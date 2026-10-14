(()=>{
'use strict';
const nav=document.querySelector('.header .nav'),menu=document.querySelector('.mobile-menu'),groups=[...document.querySelectorAll('.header .nav-group')];
function close(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');groups.forEach(group=>{group.classList.remove('is-open');group.querySelector('.nav-toggle').setAttribute('aria-expanded','false')})}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});
groups.forEach(group=>{const button=group.querySelector('.nav-toggle');button.addEventListener('click',()=>{const open=!group.classList.contains('is-open');groups.forEach(other=>{other.classList.remove('is-open');other.querySelector('.nav-toggle').setAttribute('aria-expanded','false')});group.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open))})});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))close()});
})();
