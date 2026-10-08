(() => {
  'use strict';
  const delegation = window.COUNCIL_SITE?.delegation;
  const source = delegation?.source;
  if (!source?.enabled || delegation.visible === false) return;

  const $ = id => document.getElementById(id);
  const status = $('delegation-status');
  const note = $('delegation-note');
  const announcement = $('consent-announcement');
  const metrics = ['block22', 'total', 'block23'].map(key => ({
    key,
    element: document.querySelector(`.consent-metric--${key}`),
    detail: $(`consent-${key}-detail`),
  }));
  if (!status || !note || metrics.some(m => !m.element || !m.detail)) return;

  const boundedSeconds = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value)) : fallback;
  const refreshMs = boundedSeconds(source.refreshSeconds, 60, 30, 3600) * 1000;
  const timeoutMs = boundedSeconds(source.timeoutSeconds, 12, 3, 30) * 1000;
  const counts = new Intl.NumberFormat('ko-KR');
  const rateFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const timeFormat = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const dateFormat = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  let timer;
  let inFlight = false;
  let lastSuccess = null;
  let lastSignature = '';
  let lastState = '';
  const basis = typeof source.basis === 'string' ? source.basis : '위임동의서 제출 기준';

  function sourceUrl() {
    if (!/^[A-Za-z0-9_-]{20,100}$/.test(source.spreadsheetId || '') || !/^\d+$/.test(String(source.gid))) throw new Error('Invalid sheet setting');
    const blocks = [source.blockValues?.block22, source.blockValues?.block23];
    if (blocks.some(v => typeof v !== 'string' || !v) || new Set(blocks).size !== 2) throw new Error('Invalid block setting');
    if (!Array.isArray(source.acceptedStatuses) || !source.acceptedStatuses.length || source.acceptedStatuses.some(v => typeof v !== 'string' || !v) || new Set(source.acceptedStatuses).size !== source.acceptedStatuses.length) throw new Error('Invalid accepted statuses');
    if (!Array.isArray(source.pendingStatuses) || source.pendingStatuses.some(v => typeof v !== 'string' || !v || source.acceptedStatuses.includes(v))) throw new Error('Invalid pending statuses');
    if (!/^[A-Z]+\d+:[A-Z]+(?:\d+)?$/.test(source.range || '')) throw new Error('Invalid source range');
    const url = new URL(`https://docs.google.com/spreadsheets/d/${source.spreadsheetId}/gviz/tq`);
    // Google aggregates the rows first. The browser receives block/status counts only.
    // Include every status so unsubmitted households remain in the denominator.
    url.search = new URLSearchParams({
      gid: String(source.gid), range: source.range, headers: '0', tqx: 'out:json',
      tq: 'select A,G,count(A) where A is not null group by A,G',
      _: String(Date.now()),
    }).toString();
    return url;
  }

  function parseSnapshot(body) {
    // The Visualization endpoint wraps JSON in setResponse(...). Never execute the response.
    const match = body.trim().match(/^(?:\/\*[^]*?\*\/\s*)?google\.visualization\.Query\.setResponse\((\{[^]*\})\);?$/);
    if (!match) throw new Error('Unreadable source response');
    const response = JSON.parse(match[1]);
    if (response.status !== 'ok' || !response.table || !Array.isArray(response.table.rows)) throw new Error('Source query failed');
    if (response.table.cols?.map(c => c.id).join(',') !== 'A,G,count-A') throw new Error('Household columns changed');
    const blocks = new Map(['block22', 'block23'].map(key => [source.blockValues[key], { key, population: 0, submitted: 0, knownStatus: false }]));
    const accepted = new Set(source.acceptedStatuses);
    const known = new Set([...source.acceptedStatuses, ...source.pendingStatuses]);
    const seen = new Set();
    for (const row of response.table.rows) {
      const block = blocks.get(row.c?.[0]?.v);
      const state = row.c?.[1]?.v ?? '';
      const count = row.c?.[2]?.v;
      if (!block || typeof state !== 'string') throw new Error('Unknown block or status schema');
      if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) throw new Error('Missing or invalid household count');
      const group = JSON.stringify([block.key, state]);
      if (seen.has(group)) throw new Error('Duplicate aggregate group');
      seen.add(group);
      block.population += count;
      if (accepted.has(state)) block.submitted += count;
      if (count > 0 && known.has(state)) block.knownStatus = true;
    }
    const snapshot = {};
    for (const block of blocks.values()) {
      if (!Number.isSafeInteger(block.population) || block.population <= 0 || !block.knownStatus) throw new Error('Missing household population or status data');
      snapshot[block.key] = { submitted: block.submitted, population: block.population };
    }
    snapshot.total = { submitted: snapshot.block22.submitted + snapshot.block23.submitted, population: snapshot.block22.population + snapshot.block23.population };
    if (!Number.isSafeInteger(snapshot.total.population)) throw new Error('Household totals out of range');
    return snapshot;
  }

  function render(snapshot) {
    const signature = JSON.stringify(snapshot);
    for (const metric of metrics) {
      const data = snapshot[metric.key];
      const rate = data.submitted / data.population * 100;
      const display = rate === 0 ? '0' : Math.round(rate * 10) / 10 === 100 ? '100' : rateFormat.format(rate);
      const value = metric.element.querySelector('.consent-value');
      value.querySelector('span').textContent = display;
      value.classList.add('consent-value--numeric');
      const arc = metric.element.querySelector('.consent-ring-fill');
      arc.toggleAttribute('hidden', rate === 0);
      if (rate >= 100) {
        arc.removeAttribute('stroke-dasharray');arc.style.strokeLinecap = 'butt';
      } else {
        arc.setAttribute('stroke-dasharray', `${rate} ${100 - rate}`);arc.style.strokeLinecap = 'round';
      }
      metric.detail.textContent = `동의율 ${display}%, 전체 ${counts.format(data.population)}세대 중 ${counts.format(data.submitted)}세대 제출. ${basis}.`;
    }
    const fetchedAt = new Date();
    lastSuccess = { snapshot, fetchedAt };
    status.textContent = `${timeFormat.format(fetchedAt)} 업데이트`;
    status.title = `${dateFormat.format(fetchedAt)} 조회. ${basis}.`;
    note.textContent = `${basis}. 통합 ${counts.format(snapshot.total.population)}세대 중 ${counts.format(snapshot.total.submitted)}세대 제출. ${dateFormat.format(fetchedAt)} 조회한 집계이며 시트 반영에는 지연이 있을 수 있습니다.`;
    if (lastState !== 'success' || signature !== lastSignature) {
      announcement.textContent = `동의율을 업데이트했습니다. ${metrics.map(m => `${m.element.querySelector('.consent-label').textContent} ${m.element.querySelector('.consent-value span').textContent}%`).join(', ')}.`;
    }
    lastSignature = signature;lastState = 'success';
  }

  function failed() {
    status.textContent = lastSuccess ? '갱신 지연' : '집계 확인 중';
    if (lastSuccess) {
      status.title = `${dateFormat.format(lastSuccess.fetchedAt)} 조회한 집계를 유지하고 있습니다. 다음 갱신을 기다리고 있습니다.`;
      note.textContent = `${basis}. 최신 집계를 불러오지 못해 ${dateFormat.format(lastSuccess.fetchedAt)} 조회한 값을 표시합니다.`;
    } else {
      status.title = '집계를 불러오지 못했습니다. 연결을 다시 확인하고 있습니다.';
      note.textContent = '현재 집계를 불러오지 못해 동의율을 표시하지 않습니다. 위임동의서 작성은 가능합니다.';
    }
    if (lastState !== 'failure') announcement.textContent = lastSuccess ? '갱신이 지연되어 마지막으로 확인한 동의율을 표시합니다.' : '집계를 확인하고 있습니다. 위임동의서 작성은 가능합니다.';
    lastState = 'failure';
  }

  async function refresh() {
    clearTimeout(timer);
    if (inFlight || document.hidden) return;
    inFlight = true;
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(sourceUrl(), { credentials: 'omit', cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Source unavailable');
      const body = await response.text();
      if (body.length > 100000) throw new Error('Unexpected source size');
      render(parseSnapshot(body));
    } catch { failed(); }
    finally {
      clearTimeout(abortTimer);inFlight = false;
      if (!document.hidden) timer = setTimeout(refresh, refreshMs);
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else refresh();
  });
  refresh();
})();
