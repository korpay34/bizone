(() => {
  'use strict';
  const START = Date.parse('2026-10-30T00:00:00+09:00');
  const END = Date.parse('2026-12-01T00:00:00+09:00');
  const KEY = 'bizone_asp_notice_20261030_hidden';
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const kstDay = time => new Date(time + KST_OFFSET).toISOString().slice(0, 10);
  function hiddenToday(time) {
    const today = kstDay(time);
    try {
      const value = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(KEY + '='));
      if (value && value.slice(KEY.length + 1) === today) return true;
    } catch (_) { /* Continue if cookies are unavailable. */ }
    try { return localStorage.getItem(KEY) === today; } catch (_) { return false; }
  }
  const now = Date.now();
  if (now < START || now >= END || hiddenToday(now) || document.getElementById('asp-service-notice')) return;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/asp-notice.css?v=20261030-1';
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.id = 'asp-service-notice';
  dialog.className = 'asp-notice';
  dialog.setAttribute('aria-labelledby', 'asp-notice-title');
  dialog.innerHTML = `
    <div class="asp-notice-scroll" tabindex="0" aria-label="서비스 종료 안내 본문">
      <header class="asp-notice-header"><strong class="asp-notice-brand">BIZONE</strong><span class="asp-notice-badge">중요 서비스 안내</span></header>
      <h2 id="asp-notice-title">구 ASP 서비스 종료 및<br>SCM 서비스 중단 안내</h2>
      <p>고객정보 보호 및 보안 강화를 위해 구 ASP 서비스를 종료하고<br class="asp-notice-desktop"> 신규 ASP PLUS(ASP+)로 전환합니다.</p>
      <p>사전 안내드린 전환 일정에 적극적인 협조를 부탁드립니다.</p>
      <div class="asp-notice-deadline"><span>최종 종료 예정일</span><strong>2026년 11월 6일(금) 00시</strong><p>1차 종료 예정일&nbsp; 2026년 10월 30일(금) 00시</p><p>종료 대상&nbsp; 구 ASP · 협력업체 SCM 등 관련 서비스 일체</p></div>
      <p>기존 접속주소&nbsp; old.wavepos.co.kr</p>
      <p><b>종료 이후 기존 서비스 이용이 불가하므로 사전 전환 바랍니다.</b></p>
      <section class="asp-notice-section"><h3><span>01</span> 신규 ASP PLUS 이용 안내</h3>
        <div class="asp-notice-url"><span>신규 접속주소</span><a href="https://pops.wavepos.co.kr/" target="_blank" rel="noopener noreferrer">pops.wavepos.co.kr<span class="asp-notice-sr"> (새 창)</span></a></div>
        <ul><li>기존 기능 대부분 반영 완료, 미구현 기능은 우선순위에 따라 순차 반영</li><li>일부 기능은 기술적 사유로 개발이 지연되거나 불가할 수 있습니다.</li></ul>
        <p><b>오류 발생 시 고객센터 <a href="tel:18333272">1833-3272</a>로 즉시 문의해주세요.</b></p>
      </section>
      <section class="asp-notice-section"><h3><span>02</span> 협력업체 SCM 운영 방침</h3><p>기존 SCM 서비스는 중단되며, 대체 방안으로 사원 등록,<br class="asp-notice-desktop"> 주 발주처 지정 및 특정 리포트 제공을 검토하고 있습니다.</p><p><b>기존 SCM과 동일한 기능 제공은 보장하지 않습니다.</b></p></section>
      <section class="asp-notice-section"><h3><span>03</span> 이용업체 협조사항</h3><p>종료 일정에 맞춰 신규 ASP PLUS 전환 및 자체 업무 대책을<br class="asp-notice-desktop"> 마련해주시기 바랍니다. <b>별도 연장 없이 일정에 따라 진행됩니다.</b></p></section>
      <div class="asp-notice-contact"><span>고객센터&nbsp; <a href="tel:18333272">1833-3272</a></span><span>기능요청&nbsp; <a href="mailto:zizi04@korpay.com">zizi04@korpay.com</a></span></div>
      <p class="asp-notice-issuer">2026. 10. 30.&nbsp; 주식회사 코페이</p>
    </div>
    <footer class="asp-notice-actions"><button type="button" data-asp-hide>오늘 하루 보지 않기</button><button type="button" data-asp-close autofocus>닫기</button></footer>`;
  document.body.append(dialog);
  const previousFocus = document.activeElement;
  const previousOverflow = document.documentElement.style.overflow;
  let expiryTimer;
  function dismiss() {
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener('close', () => {
    clearTimeout(expiryTimer);
    document.documentElement.style.overflow = previousOverflow;
    dialog.remove();
    style.remove();
    if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({preventScroll: true});
  }, {once: true});
  dialog.querySelector('[data-asp-close]').addEventListener('click', dismiss);
  dialog.querySelector('[data-asp-hide]').addEventListener('click', () => {
    const time = Date.now(), today = kstDay(time);
    const midnight = new Date(today + 'T00:00:00+09:00').getTime() + 24 * 60 * 60 * 1000;
    const domain = /^(www\.)?bizone\.co\.kr$/i.test(location.hostname) ? '; Domain=bizone.co.kr' : '';
    try { document.cookie = KEY + '=' + today + '; Expires=' + new Date(midnight).toUTCString() + '; Path=/; SameSite=Lax; Secure' + domain; } catch (_) { /* Storage fallback below. */ }
    try { localStorage.setItem(KEY, today); } catch (_) { /* Closing still works when storage is blocked. */ }
    dismiss();
  });
  function checkExpiry() {
    if (Date.now() >= END) return dismiss();
    expiryTimer = setTimeout(checkExpiry, Math.min(END - Date.now(), 2147483647));
  }
  window.addEventListener('pageshow', () => { if (dialog.open && (Date.now() >= END || hiddenToday(Date.now()))) dismiss(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && dialog.open && (Date.now() >= END || hiddenToday(Date.now()))) dismiss(); });
  if (typeof dialog.showModal !== 'function') { dialog.remove(); style.remove(); return; }
  dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
  checkExpiry();
})();
