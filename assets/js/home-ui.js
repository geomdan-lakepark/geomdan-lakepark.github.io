(() => {
  'use strict';
  // Dialogs and sharing for the public homepage. Navigation and live consent data
  // are managed separately by home.js and consent.js.
  const guide = document.getElementById('guide-dialog');
  const guideOpen = document.getElementById('guide-open');
  guideOpen.addEventListener('click', () => guide.showModal());
  document.getElementById('guide-close').addEventListener('click', () => guide.close());
  guide.addEventListener('close', () => guideOpen.focus());

  const aerial = document.getElementById('aerial-dialog');
  const aerialOpen = document.getElementById('aerial-open');
  const aerialFigure = document.getElementById('complex-visual').cloneNode(true);
  aerialFigure.removeAttribute('id');
  aerialFigure.querySelector('.aerial-expand').remove();
  document.getElementById('aerial-detail').append(aerialFigure);
  aerialOpen.addEventListener('click', () => aerial.showModal());
  document.getElementById('aerial-close').addEventListener('click', () => aerial.close());
  aerial.addEventListener('close', () => aerialOpen.focus());

  const officialUrl = 'https://geomdan-lakepark.github.io/';
  const shareStatus = document.getElementById('share-status');
  const copyButton = document.getElementById('site-copy');
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(officialUrl);
      shareStatus.textContent = '공식 홈페이지 주소가 복사되었습니다.';
      copyButton.textContent = '복사 완료 ✓';
    } catch {
      copyButton.textContent = '주소 복사 ↗';
      shareStatus.textContent = '주소를 복사하지 못했습니다. 브라우저의 공유 메뉴를 이용해 주세요.';
    }
  };
  copyButton.addEventListener('click', copyUrl);
  document.getElementById('site-share').addEventListener('click', async () => {
    if (!navigator.share) { await copyUrl(); return; }
    try {
      await navigator.share({ title: '더샵 검단레이크파크 입주예정자협의회 공식 홈페이지', text: '우리 단지의 공식 안내와 참여 링크를 한곳에서 확인하세요.', url: officialUrl });
      shareStatus.textContent = '공유 화면을 닫았습니다.';
    } catch (error) {
      if (error.name !== 'AbortError') await copyUrl();
    }
  });
})();
