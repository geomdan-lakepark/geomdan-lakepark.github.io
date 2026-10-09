/* 홈페이지 콘텐츠와 링크 설정 — GitHub Organization에서 이 파일을 수정하세요.
 * 항목 추가: sections 배열의 항목을 복사하고 id/title/description/url을 변경합니다.
 * 항목 삭제: 해당 객체를 삭제합니다. 숨김: visible: false. 배열 순서대로 배치됩니다.
 * id는 영문 소문자·숫자·하이픈만 사용하고 기존 항목과 겹치지 않게 지정합니다.
 * navigation은 상단 메뉴 순서입니다. 추가된 항목도 자동으로 메뉴에 표시됩니다.
 * 외부 url은 https://로, 내부 url은 complaints/index.html처럼 상대경로로 지정합니다.
 * 이미지는 assets/images에 추가하고 image 경로에 지정합니다.
 * 위임동의서 현황은 동호수_현황의 블록·상태별 집계만 읽습니다. source에서 기준과 갱신 주기를 변경합니다.
 */
window.COUNCIL_SITE = {
  brand: { title: '더샵 검단레이크파크', subtitle: '입주예정자협의회 공식 홈페이지' },
  hero: {
    // 첫 줄 단지명은 이미지에 이미 인쇄되어 있어 화면 낭독용으로 제공됩니다.
    // 둘째 줄은 이미지 속 단지명 아래에 실제 글자로 표시됩니다.
    title: ['더샵 검단레이크파크', '입주예정자협의회 공식 홈페이지'],
    image: 'assets/images/hero-entrance.webp',
    backdrop: 'assets/images/hero-forest-wide.webp',
    imageAlt: '나무와 산책로를 배경으로 검단 그 변화의 정점에서 만나는 더샵이라고 적힌 더샵 검단레이크파크 대문 이미지',
  },
  delegation: {
    visible: true,
    navLabel: '위임동의서',
    title: '위임동의서 접수 현황',
    description: '여러분의 동의가 협의회의 힘이 됩니다.',
    labels: { block22: '22블록', total: '통합 동의율', block23: '23블록' },
    totalCaption: '22·23블록 전체',
    status: '집계 준비 중',
    note: '접수 현황은 준비가 완료되면 안내하겠습니다.',
    url: 'https://form.naver.com/response/3xC5swspWEY',
    buttonLabel: '위임동의서 작성하기',
    source: {
      enabled: true,
      spreadsheetId: '1C3gHaLJsCd5_1-8KYq5zHkuBX3lpO_W4XVTzY_c2pT0',
      gid: '1484309037',
      range: 'A2:G',
      blockValues: { block22: '22BL', block23: '23BL' },
      acceptedStatuses: ['1·2차 확인완료', '입주예정자 미인증 · 위임동의 제출완료'],
      pendingStatuses: ['미인증·미제출', '위임동의 미제출'],
      // A열은 블록, G열은 교차검증상태입니다. 위 두 완료 상태의 세대수를 합산합니다.
      basis: '위임동의서 제출 기준(입주예정자 인증 미확인 포함)',
      refreshSeconds: 60,
      timeoutSeconds: 12,
    },
  },
  // 공동민원: enabled가 false이거나 마감이 지나면 종료 안내만 표시합니다.
  // 다음 캠페인은 민원 내용부터 검토한 뒤 enabled와 deadline을 변경하세요.
  campaign: {
    enabled: true,
    deadline: '2026-09-30T23:00:00+09:00',
    timeZone: 'Asia/Seoul',
  },
  navLabels: { about: '우리 단지', council: '입예협 소개' },
  navigation: ['about', 'council', 'cafe', 'delegation', 'petition'],
  sections: [
    {
      id: 'cafe', visible: true, navLabel: '소통 채널', layout: 'channels',
      title: '입예협 소통 채널', description: '소식은 카페에서, 대화는 카톡에서.',
      url: 'https://cafe.naver.com/tslp', buttonLabel: '카페 방문하기',
      actions: [
        { buttonLabel: '카톡 공지방', url: 'https://open.kakao.com/o/g8qdmoDi', style: 'primary' },
        { buttonLabel: '카톡 소통방', url: 'https://open.kakao.com/o/gbmJJbFi', style: 'secondary' },
      ],
      codeLink: { label: '입장코드는 카페에서 확인', url: 'https://cafe.naver.com/tslp/2437' },
      image: 'assets/images/cafe.webp', imageAlt: '이웃의 소통을 표현한 말풍선',
      theme: 'cafe',
    },
    {
      id: 'petition', visible: true, navLabel: '단체민원',
      title: '단체민원', description: '함께 전하는 의견, 더 나은 변화.',
      url: 'complaints/index.html', buttonLabel: '민원 안내 보기',
      image: 'assets/images/petition-night.webp', imageAlt: '주민의 의견을 담은 문서',
      theme: 'petition',
    },
  ],
  footer: {
    description: '주민의 의견을 모아, 함께 더 나은 내일을 만듭니다.',
  },
};
