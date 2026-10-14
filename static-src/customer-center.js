const menu=document.querySelector('.cc-menu'),nav=document.querySelector('.cc-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});
document.querySelectorAll('.cc-group>button').forEach(button=>button.addEventListener('click',()=>{const group=button.parentElement,open=group.classList.toggle('open');button.setAttribute('aria-expanded',String(open))}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');document.querySelectorAll('.cc-group.open').forEach(group=>{group.classList.remove('open');group.querySelector('button').setAttribute('aria-expanded','false')})}});
