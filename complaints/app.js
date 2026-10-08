/* Shared council campaign page. Dates and visibility are controlled by site.config.js. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const templates = window.COMPLAINT_TEMPLATES;
  let toastTimer, copying = false, operationId = 0, templateOpener, copyOpener;
  const dialog = $('template-dialog'), listDialog = $('list-dialog'), copyDialog = $('copy-dialog'), gallery = $('gallery');
  const EPEOPLE_URL = 'https://www.epeople.go.kr/';
  document.querySelectorAll('[data-art]').forEach(el => el.innerHTML = window.CouncilArt(el.dataset.art));
  function toast(text) { clearTimeout(toastTimer); $('toast').textContent = text; $('toast').hidden = false; toastTimer = setTimeout(() => $('toast').hidden = true, 4500); }
  const concise = [
    '복합청사와 세 철도 환승을\n하나의 기본계획에 담도록.',
    '건물 배치부터 연결 공간까지.\n설계 초기부터 함께 검토하도록.',
    '따로 짓는 비용과 함께 짓는 비용.\n장기적인 효율을 비교하도록.',
    '세 노선이 모두 연결되는\n검단의 환승거점을 만들도록.',
    '늘어나는 인구와 입주 수요.\n미래의 생활권을 반영하도록.',
    '공연과 문화, 주민 공공시설.\n행정과 함께 누리는 공간으로.',
    '역에서 청사, 공원, 주거지까지.\n일상의 동선이 이어지도록.',
    '행정·문화·교통을 연결해\n검단 전체의 활력을 높이도록.',
    '관계 기관의 계획과 일정을\n하나의 목표 아래 조율하도록.',
    '주민 의견을 계획에 반영하고\n추진 과정을 함께 확인하도록.'
  ];
  templates.forEach((t, i) => {
    const card = document.createElement('article'); card.className = 'template-card';
    const visual = document.createElement('button'); visual.className = 'template-visual'; visual.type = 'button'; visual.setAttribute('aria-label', `${i+1}번 ${t.displayName} 문안 전체 보기`); visual.innerHTML = `<span class="visual-number">${String(i+1).padStart(2,'0')} / 10</span>${window.CouncilArt(t.theme)}`; visual.addEventListener('click', () => showTemplate(i));
    const number = document.createElement('span'); number.className = 'template-number'; number.textContent = `문안 ${String(i+1).padStart(2,'0')}`;
    const title = document.createElement('h3'); title.textContent = t.displayName;
    const desc = document.createElement('p'); desc.className = 'template-description'; desc.style.whiteSpace = 'pre-line'; desc.textContent = concise[i];
    const actions = document.createElement('div'); actions.className = 'template-actions';
    const copy = makeCopyButton(i, '복사하기');
    const read = document.createElement('button'); read.className = 'choose-link'; read.textContent = '문안 전체 보기 ›'; read.type = 'button'; read.setAttribute('aria-label',`${i+1}번 ${t.displayName} 문안 전체 보기`); read.addEventListener('click', () => showTemplate(i));
    actions.append(copy, read); card.append(visual, number, title, desc, actions); $('gallery-track').append(card);
    const row = document.createElement('button'); row.type = 'button'; row.innerHTML = `<span>${String(i+1).padStart(2,'0')}</span><div><strong>${t.displayName}</strong><small>${t.label}</small></div><b aria-hidden="true">›</b>`;
    row.addEventListener('click', () => { listDialog.close(); showTemplate(i, $('all-templates')); }); $('template-list').append(row);
  });
  function makeCopyButton(i, label) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'pill copy-accent'; button.textContent = label; button.dataset.copyTemplate = i;
    button.setAttribute('aria-label', `${i+1}번 ${templates[i].displayName} 문안 ${label}`);
    button.addEventListener('click', () => copyTemplate(i)); return button;
  }
  function showTemplate(i, opener = document.activeElement) {
    if(!campaignIsOpen()){renderCampaign();return;}
    templateOpener = opener; const t = templates[i];
    $('dialog-kicker').textContent = `민원 문안 ${String(i+1).padStart(2,'0')} / 10 · ${t.label}`;
    $('dialog-heading').textContent = t.displayName;
    $('dialog-body').replaceChildren();
    const titleLabel = document.createElement('p'); titleLabel.className = 'dialog-label'; titleLabel.textContent = '제목';
    const title = document.createElement('p'); title.className = 'document-title'; title.textContent = t.title;
    const bodyLabel = document.createElement('p'); bodyLabel.className = 'dialog-label'; bodyLabel.textContent = '본문';
    const body = document.createElement('div'); body.className = 'document-body'; body.textContent = t.body;
    $('dialog-body').append(titleLabel,title,bodyLabel,body); setTemplateActions(i);
    if (!dialog.open) dialog.showModal(); document.querySelector('.dialog-content').scrollTop = 0;
  }
  function setTemplateActions(i) {
    $('dialog-actions').replaceChildren();
    const copy = makeCopyButton(i, '제목 + 본문 복사하기');
    const note = document.createElement('p'); note.textContent = '복사 후 안내 창에서 국민신문고로 이동할 수 있습니다.';
    $('dialog-actions').append(copy,note);
  }
  function copiedText(i) { const t=templates[i]; return `제목: ${t.title}\n\n본문:\n${t.body}`; }
  function setCopyBusy(busy) {
    document.querySelectorAll('[data-copy-template],#random-copy').forEach(button => { button.disabled=busy; button.setAttribute('aria-busy',String(busy)); });
  }
  function fallbackCopy(text) {
    const focus=document.activeElement;
    const area=document.createElement('textarea'); area.value=text; area.readOnly=true;
    area.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;padding:0;font-size:16px;opacity:.01;';
    // Native modal dialogs make the rest of the page inert: copy inside the open dialog.
    (dialog.open ? dialog : copyDialog.open ? copyDialog : document.body).append(area);
    let success=false;
    try { area.focus({preventScroll:true}); area.select(); area.setSelectionRange(0,area.value.length); success=document.execCommand('copy')===true; }
    catch (_) { success=false; }
    finally { area.remove(); if(focus?.isConnected)focus.focus({preventScroll:true}); }
    return success;
  }
  async function copyTemplate(i, { random=false, opener } = {}) {
    if(copying || !campaignIsOpen() || !templates[i])return;
    const request=++operationId;
    const source=opener || (dialog.open ? templateOpener : document.activeElement);
    const text=copiedText(i);
    copying=true;setCopyBusy(true);
    let success=false;
    try {
      if(navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); success=true; }
    } catch (_) { success=false; }
    if(!success && request===operationId && campaignIsOpen()) success=fallbackCopy(text);
    copying=false;setCopyBusy(false);
    if(request!==operationId || !campaignIsOpen()){renderCampaign();return;}
    showCopyResult(i,success,random,source);
  }
  function epeopleLink(label='국민신문고로 이동') {
    const link=document.createElement('a');link.className='pill copy-accent';link.href=EPEOPLE_URL;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${label}, 새 탭에서 열림`);link.textContent=`${label} ↗`;
    link.addEventListener('click',event=>{if(!campaignIsOpen()){event.preventDefault();renderCampaign();}});return link;
  }
  function showCopyResult(i, success, random, opener) {
    copyOpener=opener;
    if(dialog.open)dialog.close();if(listDialog.open)listDialog.close();
    const t=templates[i];
    copyDialog.classList.toggle('is-error',!success);
    $('copy-heading').textContent=success?'문안이 복사되었습니다.':'자동 복사가 되지 않았습니다.';
    $('copy-message').textContent=success?`${random?'무작위로 고른 ':''}${String(i+1).padStart(2,'0')}번 문안의 제목과 본문을 복사했습니다. 국민신문고에 붙여넣고 직접 제출해 주세요.`:'아래 내용을 직접 복사해 주세요. 복사한 뒤 국민신문고로 이동할 수 있습니다.';
    $('copy-template-name').textContent=`문안 ${String(i+1).padStart(2,'0')} · ${t.displayName}`;
    $('copy-template-title').textContent=t.title;
    $('copy-fallback').hidden=success;$('copy-fallback-label').hidden=success;
    $('copy-fallback').value=success?'':copiedText(i);
    $('copy-actions').replaceChildren();
    if(success) {
      const link=epeopleLink();$('copy-actions').append(link);
    } else {
      const retry=document.createElement('button');retry.type='button';retry.className='pill outline';retry.textContent='복사 다시 시도';retry.addEventListener('click',()=>{copyDialog.close();copyTemplate(i,{random,opener});});
      const select=document.createElement('button');select.type='button';select.className='copy-manual-select';select.textContent='내용 전체 선택';select.addEventListener('click',()=>{$('copy-fallback').focus();$('copy-fallback').select();$('copy-fallback').setSelectionRange(0,$('copy-fallback').value.length);});
      const link=epeopleLink('직접 복사했습니다 · 국민신문고로 이동');link.classList.add('manual-go');$('copy-actions').append(retry,select,link);
    }
    if(!copyDialog.open)copyDialog.showModal();
    const action=$('copy-actions').querySelector(success?'a':'button');action?.focus({preventScroll:true});
  }
  $('random-copy').addEventListener('click',()=>copyTemplate(Math.floor(Math.random()*templates.length),{random:true}));
  function showDetail(title, markup, kicker='함께 요구합니다') {
    if(!campaignIsOpen()){renderCampaign();return;}
    $('dialog-kicker').textContent = kicker; $('dialog-heading').textContent = title;
    $('dialog-body').innerHTML = `<div class="dialog-summary">${markup}</div>`; $('dialog-actions').replaceChildren();
    const button = document.createElement('button'); button.className = 'pill primary'; button.textContent = '확인'; button.addEventListener('click', () => dialog.close()); $('dialog-actions').append(button);
    dialog.showModal(); document.querySelector('.dialog-content').scrollTop = 0;
  }
  document.querySelector('[data-detail="culture"]').addEventListener('click', () => showDetail('행정에 문화를 더하다.', '<p>문화예술회관과 주민 문화·체육·공공시설을 포함한 복합청사를 검단구 신청사 기본계획에 반영해 주세요.</p><ul><li>시설 규모와 운영 동선, 개방시간까지 함께 검토</li><li>별도 건립과 복합 건립의 장기 비용 비교</li><li>철도 환승과 공원·주거지 보행 연결을 포함한 통합계획 수립</li></ul><p>주민이 계획 반영을 요구하는 내용이며, 시설 구성이 확정되었다는 뜻은 아닙니다.</p>'));
  document.querySelector('[data-detail="rail"]').addEventListener('click', () => showDetail('세 철도. 하나의 연결.', '<p>검단구청역(가칭)을 중심으로 세 철도가 모두 연결되는 환승체계를 요청합니다.</p><ul><li>인천1호선 104역 신설 추진</li><li>인천순환3호선의 검단구청역 경유·신설 반영</li><li>대장홍대선 검단 연장 및 검단구청역 연결</li></ul><p>청사·지하주차장·광장 설계 단계부터 역 출입구와 환승통로를 확보하고, 나진포천·중앙호수공원으로 안전하게 걸어갈 수 있도록 검토해 주세요.</p>'));
  $('submission-info').addEventListener('click', () => showDetail('제출 전 확인해 주세요.', '<ul><li><strong>민원구분은 일반민원</strong>을 선택합니다.</li><li><strong>처리기관은 인천광역시 검단구</strong>를 선택합니다. ‘처리기관 직접 선택’ → ‘기관검색’에서 기관명을 검색하고 선택하세요.</li><li>복사된 ‘제목:’, ‘본문:’ 표시는 구분용입니다. 각 표시 뒤의 내용을 제목칸과 본문칸에 나누어 입력해 주세요.</li><li>PC는 Ctrl+V(맥은 ⌘+V), 휴대폰은 입력란을 길게 눌러 ‘붙여넣기’를 선택하세요.</li><li>직접 제출한 뒤 접수 완료 화면 또는 접수번호를 확인하세요. 철도 관련 민원은 소관 기관으로 이송될 수 있습니다.</li></ul><p>협의회의 공동민원 참여 마감은 국민신문고 자체의 접수 종료 시각을 뜻하지 않습니다.</p>', '참여방법'));
  document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  [dialog,listDialog,copyDialog].forEach(d => d.addEventListener('click', event => { if(event.target === d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();} }));
  copyDialog.addEventListener('close',()=>{if(copyOpener?.isConnected && !$('active-view').hidden)copyOpener.focus({preventScroll:true});});
  $('all-templates').addEventListener('click', () => {if(campaignIsOpen())listDialog.showModal();else renderCampaign();});
  function galleryPosition() {
    const cards = [...document.querySelectorAll('.template-card')];
    const outer = gallery.getBoundingClientRect();
    const visible = cards.map((c,i) => ({i,r:c.getBoundingClientRect()})).filter(({r})=>r.left>=outer.left-5 && r.right<=outer.right+5);
    const first = visible.length ? visible[0].i : Math.min(9,Math.round(gallery.scrollLeft/(cards[0].offsetWidth+24)));
    const last = visible.length ? visible[visible.length-1].i : first;
    $('gallery-position').textContent = first===last?String(first+1).padStart(2,'0'):`${String(first+1).padStart(2,'0')}–${String(last+1).padStart(2,'0')}`;
    $('gallery-prev').disabled = gallery.scrollLeft < 5;
    $('gallery-next').disabled = gallery.scrollLeft+gallery.clientWidth >= gallery.scrollWidth-5;
  }
  function moveGallery(direction) { const card = document.querySelector('.template-card'); const gap = innerWidth<=760?16:24; const stride=card.offsetWidth+gap; const gutter=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')); const available=Math.min(1280,gallery.clientWidth-2*gutter); const count=innerWidth<=760?1:Math.max(1,Math.floor((available+gap)/stride)); gallery.scrollBy({left:direction*stride*count,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
  $('gallery-prev').addEventListener('click',()=>moveGallery(-1)); $('gallery-next').addEventListener('click',()=>moveGallery(1));
  gallery.addEventListener('scroll',galleryPosition,{passive:true}); gallery.addEventListener('keydown',event=>{if(event.target!==gallery)return;if(event.key==='ArrowRight'){event.preventDefault();moveGallery(1);}if(event.key==='ArrowLeft'){event.preventDefault();moveGallery(-1);}}); window.addEventListener('resize',galleryPosition); galleryPosition();
  const menuButton=document.querySelector('.menu-button'),mobileMenu=$('mobile-menu');
  menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');mobileMenu.hidden=!open;});
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','메뉴 열기');}));
  let previousCampaignState = '', campaignTimer;
  function readCampaign(now = Date.now()) {
    const config = window.COUNCIL_SITE?.campaign;
    if (!config || typeof config.enabled !== 'boolean' || typeof config.deadline !== 'string') return { state: 'unavailable' };
    const match = config.deadline.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/);
    if (!match) return { state: 'unavailable' };
    const [, y, mo, d, h, mi, sec, offset] = match;
    const local = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec));
    if (local.getUTCFullYear() !== +y || local.getUTCMonth() + 1 !== +mo || local.getUTCDate() !== +d || local.getUTCHours() !== +h || local.getUTCMinutes() !== +mi || local.getUTCSeconds() !== +sec || (offset !== 'Z' && (+offset.slice(1, 3) > 14 || +offset.slice(4) > 59))) return { state: 'unavailable' };
    const deadlineMs = Date.parse(config.deadline);
    if (!Number.isFinite(deadlineMs) || typeof config.timeZone !== 'string' || !config.timeZone) return { state: 'unavailable' };
    try {
      const dateFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: config.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
      const timeFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: config.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
      const deadlineTimeFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: config.timeZone, hour: 'numeric', minute: '2-digit', hour12: true });
      return { ...config, deadlineMs, dateFormatter, timeFormatter, deadlineTimeFormatter, state: !config.enabled ? 'disabled' : now >= deadlineMs ? 'ended' : 'open' };
    } catch (_) { return { state: 'unavailable' }; }
  }
  function campaignIsOpen() { return readCampaign().state === 'open'; }
  function koreanDate(date, formatter) {
    const parts = Object.fromEntries(formatter.formatToParts(date).map(p => [p.type, p.value]));
    return `${parts.year}.${parts.month}.${parts.day} (${parts.weekday})`;
  }
  function renderCampaign() {
    clearTimeout(campaignTimer);
    const now = new Date(), campaign = readCampaign(now.getTime()), open = campaign.state === 'open';
    const changed = previousCampaignState !== campaign.state;
    const focusWasActive = $('active-view').contains(document.activeElement) || document.querySelector('.navigation').contains(document.activeElement) || [dialog,listDialog,copyDialog].some(d=>d.open);
    if (changed) {
      ++operationId;
      [dialog,listDialog,copyDialog].forEach(d=>{ if(d.open)d.close(); });
      mobileMenu.hidden=true;
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','메뉴 열기');
    }
    $('active-view').hidden=!open;
    $('active-view').toggleAttribute('inert',!open);
    $('closed-view').hidden=open;
    document.body.dataset.campaignState=campaign.state;
    document.querySelectorAll('.navigation a,#mobile-menu a').forEach(a=>a.hidden=!open);
    menuButton.hidden=!open;
    if (!open) {
      setCopyBusy(true);
      if (campaign.state==='unavailable') {
        $('closed-kicker').textContent='공동민원 · 안내 준비 중';
        $('closed-title').textContent='공동민원 안내를 준비하고 있습니다.';
        $('closed-subtitle').textContent='참여 일정은 공식 홈페이지와 카페에서 안내하겠습니다.';
      } else {
        $('closed-kicker').textContent='공동민원 · 참여 종료';
        $('closed-title').innerHTML='함께해 주셔서<br>감사합니다.';
        $('closed-subtitle').textContent='이번 공동민원 참여가 종료되었습니다.';
      }
      if(changed && previousCampaignState==='open' && focusWasActive)$('closed-title').focus();
    } else {
      if(changed && !copying)setCopyBusy(false);
      $('clock-date').textContent=koreanDate(now,campaign.dateFormatter);
      $('clock-time').textContent=campaign.timeFormatter.format(now);
      $('deadline-date').textContent=koreanDate(new Date(campaign.deadlineMs),campaign.dateFormatter);
      $('deadline-time').textContent=campaign.deadlineTimeFormatter.format(new Date(campaign.deadlineMs));
      const seconds=Math.max(0,Math.ceil((campaign.deadlineMs-now.getTime())/1000)),pad=v=>String(v).padStart(2,'0');
      $('days').textContent=Math.floor(seconds/86400);
      $('hours').textContent=`${pad(Math.floor(seconds/3600)%24)}:${pad(Math.floor(seconds/60)%60)}:${pad(seconds%60)}`;
    }
    previousCampaignState=campaign.state;
    campaignTimer=setTimeout(renderCampaign,open?Math.min(1000,Math.max(1,campaign.deadlineMs-Date.now())):60000);
  }
  const cafe = window.COUNCIL_SITE?.sections?.find(section=>section.id==='cafe');
  if(cafe?.url && /^https:\/\//.test(cafe.url))$('closed-cafe').href=cafe.url;
  renderCampaign();
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden)renderCampaign(); });
  window.addEventListener('pageshow',renderCampaign);
})();
