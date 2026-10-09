(() => {
  'use strict';
  const config = window.COUNCIL_SITE;
  if (!config) return;
  const $ = id => document.getElementById(id);
  const text = value => typeof value === 'string' ? value : '';
  const validId = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
  const placeholderIds = new Set(Array.from($('features').querySelectorAll('[id]'), el => el.id));
  const reservedIds = new Set(Array.from(document.querySelectorAll('[id]'), el => el.id).filter(id => !placeholderIds.has(id)));
  const externalUrl = value => /^https?:\/\//i.test(text(value));
  function safeUrl(value) {
    if (!text(value).trim()) return '';
    try {
      const clean = value.trim();
      if (externalUrl(clean)) {
        const url = new URL(clean);
        return !url.username && !url.password ? url.href : '';
      }
      // GitHub Pages의 프로젝트 경로 안에서도 작동하도록 내부 링크는 상대경로를 사용합니다.
      if (/^(?:\.\/)?[a-zA-Z0-9_./-]+(?:#[a-zA-Z0-9_-]+)?$/.test(clean) && !clean.startsWith('/') && !clean.split('/').includes('..')) return clean;
    } catch { /* Unconfigured links use the preparation notice. */ }
    return '';
  }
  function setText(id, value) { const el = $(id); if (el) el.textContent = text(value); }
  const sections = [];const usedIds = new Set(reservedIds);
  for (const item of Array.isArray(config.sections) ? config.sections : []) {
    if (!item || item.visible === false || !validId(item.id) || usedIds.has(item.id) || usedIds.has(`${item.id}-title`)) continue;
    usedIds.add(item.id);usedIds.add(`${item.id}-title`);sections.push(item);
  }
  const delegation = config.delegation || {};
  const registry = new Map(sections.map(item => [item.id, item]));
  if (delegation.visible !== false) registry.set('delegation', delegation);
  for (const [id, label] of Object.entries(config.navLabels || {})) {
    if (validId(id) && text(label).trim() && $(id) && !$(id).hidden && !registry.has(id)) registry.set(id, { navLabel: label });
  }
  let noticeOpener = null;
  function showNotice(title, opener) {
    noticeOpener = opener;
    setText('notice-title', `${title || '안내 페이지'} 준비 중`);
    setText('notice-message', '페이지 연결을 준비하고 있습니다. 준비가 완료되면 협의회에서 안내하겠습니다.');
    $('notice-dialog').showModal();
  }
  function action(item, label, style = 'primary') {
    const url = safeUrl(item?.url);
    const el = document.createElement(url ? 'a' : 'button');
    el.className = `button button-${style === 'secondary' ? 'secondary' : 'primary'}`;el.textContent = text(label) || '안내 보기';
    if (url) {
      el.href = url;
      if (externalUrl(url)) {el.target = '_blank';el.rel = 'noopener noreferrer';el.setAttribute('aria-label', `${el.textContent}, 새 창에서 열림`);}
    } else {
      el.type = 'button';el.textContent += ' · 준비 중';
      el.addEventListener('click', () => showNotice(item?.title || label, el));
    }
    return el;
  }
  document.querySelectorAll('[data-brand-title]').forEach(el => {el.textContent = text(config.brand?.title) || '더샵 검단레이크파크';});
  document.querySelectorAll('[data-brand-subtitle]').forEach(el => {el.textContent = text(config.brand?.subtitle) || '입주예정자협의회';});
  const brandText = `${text(config.brand?.title)} ${text(config.brand?.subtitle)}`.trim();
  if (brandText) {document.title = brandText;document.querySelector('.brand').setAttribute('aria-label', `${brandText}, 맨 위로`);document.querySelector('meta[property="og:title"]').content = brandText;}
  const hero = config.hero || {};
  $('hero-title').replaceChildren();
  for (const line of Array.isArray(hero.title) ? hero.title : [hero.title]) {const span = document.createElement('span');span.textContent = text(line);$('hero-title').append(span);}
  $('hero-title').setAttribute('aria-label', (Array.isArray(hero.title) ? hero.title : [hero.title]).map(text).join(' '));
  const heroImage = safeUrl(hero.image);if (heroImage) $('hero-image').src = heroImage;
  $('hero-image').alt = text(hero.imageAlt);
  const backdrop = safeUrl(hero.backdrop);
  $('hero-backdrop-image').hidden = !backdrop;
  if (backdrop) $('hero-backdrop-image').src = backdrop;
  $('delegation').hidden = delegation.visible === false;
  setText('delegation-title', delegation.title);setText('delegation-description', delegation.description);
  setText('consent-block22-label', delegation.labels?.block22 || '22블록');
  setText('consent-total-label', delegation.labels?.total || '통합 동의율');
  setText('consent-block23-label', delegation.labels?.block23 || '23블록');
  setText('consent-total-caption', delegation.totalCaption || '22·23블록 전체');
  setText('delegation-status', delegation.status || '집계 준비 중');
  setText('delegation-note', delegation.note);
  // A single native link covers the status panel; no nested interactive controls.
  const delegationLink = action(delegation, delegation.buttonLabel);
  delegationLink.className = 'delegation-link';
  delegationLink.setAttribute('aria-describedby', 'delegation-note');
  const delegationLinkLabel = document.createElement('span');
  delegationLinkLabel.className = 'delegation-link-label';
  delegationLinkLabel.textContent = delegationLink.textContent;
  if (delegationLink.tagName === 'A' && externalUrl(delegationLink.getAttribute('href'))) {
    const arrow = document.createElement('span');arrow.textContent = ' ↗';arrow.setAttribute('aria-hidden', 'true');delegationLinkLabel.append(arrow);
  }
  delegationLink.replaceChildren(delegationLinkLabel);
  $('delegation-actions').replaceChildren(delegationLink);
  $('features').replaceChildren();
  for (const item of sections) {
    const section = document.createElement('section');section.className = `feature feature-${['cafe', 'petition'].includes(item.theme) ? item.theme : 'neutral'}`;section.id = item.id;section.setAttribute('aria-labelledby', `${item.id}-title`);
    const channels = item.layout === 'channels';
    if (channels) {
      section.classList.add('feature-channels');
      const cardLink = action(item, item.buttonLabel);
      cardLink.className = 'channel-card-link';
      const cardLabel = document.createElement('span');
      cardLabel.textContent = cardLink.tagName === 'A' ? '카페로 이동' : '카페 연결 · 준비 중';
      if (cardLink.tagName === 'A' && externalUrl(cardLink.getAttribute('href'))) {const arrow = document.createElement('span');arrow.textContent = ' ↗';arrow.setAttribute('aria-hidden', 'true');cardLabel.append(arrow);}
      cardLink.replaceChildren(cardLabel);section.append(cardLink);
    }
    const content = document.createElement('div');content.className = 'feature-content';
    const heading = document.createElement('h2');heading.className = 'section-title';heading.id = `${item.id}-title`;heading.textContent = text(item.title);
    const desc = document.createElement('p');desc.className = 'section-description';desc.textContent = text(item.description);
    const buttons = document.createElement('div');buttons.className = 'button-row';
    if (channels) {
      buttons.classList.add('channel-actions');
      for (const itemAction of Array.isArray(item.actions) ? item.actions : []) {
        if (!itemAction) continue;
        const control = action(itemAction, itemAction.buttonLabel, itemAction.style);
        if (control.tagName === 'A' && externalUrl(control.getAttribute('href'))) {const arrow = document.createElement('span');arrow.textContent = ' ↗';arrow.setAttribute('aria-hidden', 'true');control.append(arrow);}
        buttons.append(control);
      }
    } else {buttons.append(action(item, item.buttonLabel));}
    content.append(heading, desc, buttons);
    if (channels && item.codeLink) {
      const codeLink = action(item.codeLink, item.codeLink.label);
      codeLink.className = 'channel-code-link';
      if (codeLink.tagName === 'A' && externalUrl(codeLink.getAttribute('href'))) {const arrow = document.createElement('span');arrow.textContent = ' ↗';arrow.setAttribute('aria-hidden', 'true');codeLink.append(arrow);}
      content.append(codeLink);
    }
    section.append(content);
    const imageUrl = safeUrl(item.image);
    if (imageUrl) {const visual = document.createElement('div');visual.className = 'feature-image';const image = document.createElement('img');image.src = imageUrl;image.alt = text(item.imageAlt);image.width = 1000;image.height = 1000;image.loading = 'lazy';image.decoding = 'async';visual.append(image);section.append(visual);} else {section.classList.add('feature-text-only');}
    if (text(item.note)) {const note = document.createElement('p');note.className = 'feature-note';note.textContent = item.note;section.append(note);}
    $('features').append(section);
  }
  $('features').hidden = sections.length === 0;
  const orderedIds = Array.isArray(config.navigation) ? config.navigation : [];
  const navIds = [...new Set([...orderedIds.filter(id => registry.has(id)), ...registry.keys()])];
  function fillNavigation(nav) {nav.replaceChildren();for (const id of navIds) {const item = registry.get(id);const link = document.createElement('a');link.className = 'nav-link';link.href = `#${id}`;link.textContent = text(item.navLabel) || text(item.title);nav.append(link);}}
  document.querySelectorAll('[data-navigation]').forEach(fillNavigation);fillNavigation($('mobile-nav'));
  setText('footer-copy', config.footer?.description);
  const toggle = $('menu-toggle');const mobileNav = $('mobile-nav');toggle.hidden = navIds.length === 0;
  function closeMenu(restoreFocus = false) {toggle.setAttribute('aria-expanded', 'false');toggle.setAttribute('aria-label', '메뉴 열기');mobileNav.hidden = true;document.querySelector('.site-header').classList.remove('is-open');if (restoreFocus) toggle.focus();}
  toggle.addEventListener('click', () => {if (toggle.getAttribute('aria-expanded') === 'true') {closeMenu(true);return;}toggle.setAttribute('aria-expanded', 'true');toggle.setAttribute('aria-label', '메뉴 닫기');mobileNav.hidden = false;document.querySelector('.site-header').classList.add('is-open');mobileNav.querySelector('a')?.focus();});
  mobileNav.addEventListener('click', event => {const link = event.target.closest('a');if (!link) return;const section = $(link.hash.slice(1));closeMenu();if (section) {section.setAttribute('tabindex', '-1');section.focus({preventScroll:true});}});
  document.addEventListener('keydown', event => {if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {event.preventDefault();closeMenu(true);}});
  window.matchMedia('(min-width: 768px)').addEventListener('change', event => {if (event.matches) closeMenu();});
  $('notice-dialog').addEventListener('close', () => {noticeOpener?.focus();noticeOpener = null;});
})();
