const menu=document.querySelector('.cc-menu'),nav=document.querySelector('.cc-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});
document.querySelectorAll('.cc-group>button').forEach(button=>button.addEventListener('click',()=>{const group=button.parentElement,open=group.classList.toggle('open');button.setAttribute('aria-expanded',String(open))}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');document.querySelectorAll('.cc-group.open').forEach(group=>{group.classList.remove('open');group.querySelector('button').setAttribute('aria-expanded','false')})}});

// The center keeps its header and footer in place while switching board content.
let centerRequest;
async function showCenter(url,push=true){
 if(!document.querySelector('#customer-center-content')){location.href=url;return}
 centerRequest?.abort();const controller=new AbortController();centerRequest=controller;
 const current=document.querySelector('#customer-center-content');current.setAttribute('aria-busy','true');
 try{
  const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('Load failed');
  const parsed=new DOMParser().parseFromString(await response.text(),'text/html'),next=parsed.querySelector('#customer-center-content');if(!next)throw new Error('Missing center');
  if(controller.signal.aborted)return;
  document.querySelectorAll('dialog.inquiry-dialog').forEach(dialog=>dialog.remove());document.body.classList.remove('dialog-open');
  current.replaceWith(next);parsed.querySelectorAll('dialog.inquiry-dialog').forEach(dialog=>document.body.append(dialog));document.title=parsed.title;
  if(push)history.pushState({center:true},'',url);
  document.querySelector('#center-faq-script')?.remove();
  if(next.dataset.tab==='faq'){const script=document.createElement('script');script.id='center-faq-script';script.src='/support/faq/faq-preview.js?v=2';document.body.append(script)}
 }catch(error){if(error.name!=='AbortError')location.assign(url)}finally{document.querySelector('#customer-center-content')?.removeAttribute('aria-busy')}
}
document.addEventListener('click',event=>{const link=event.target.closest('.cc-tabs a,.resource-pagination a');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!document.querySelector('#customer-center-content'))return;event.preventDefault();showCenter(link.href)});
document.addEventListener('submit',event=>{if(!event.target.matches('.resource-search')||!document.querySelector('#customer-center-content'))return;event.preventDefault();const url=new URL('/support/',location.origin);url.search=new URLSearchParams(new FormData(event.target)).toString();showCenter(url.href)});
window.addEventListener('popstate',()=>{if(location.pathname==='/support/'||location.pathname==='/support')showCenter(location.href,false)});
