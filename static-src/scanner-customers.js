(()=>{
const section=document.querySelector('.scanner-customers'),button=section?.querySelector('.customer-motion-toggle');
if(!button)return;
button.addEventListener('click',()=>{const paused=section.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'고객사 로고 흐름 재생':'고객사 로고 흐름 일시정지');button.textContent=paused?'재생':'일시정지'});
})();
