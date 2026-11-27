(()=>{
  const modal=document.getElementById('business-notice');
  if(!modal)return;
  const checkbox=document.getElementById('business-notice-today');
  const key='bizone-business-notice-hidden-date';
  const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const force=new URLSearchParams(location.search).has('popup-preview');
  // Keep the notice available for review while public display is paused.
  if(!force)return;
  try{if(!force&&localStorage.getItem(key)===today())return}catch{}
  const previousFocus=document.activeElement;
  modal.hidden=false;
  document.body.style.overflow='hidden';
  modal.querySelector('.business-notice-dialog').focus({preventScroll:true});
  function close(){
    if(checkbox.checked){try{localStorage.setItem(key,today())}catch{}}
    modal.hidden=true;
    document.body.style.overflow='';
    previousFocus?.focus?.({preventScroll:true});
  }
  modal.querySelector('.business-notice-close').addEventListener('click',close);
  checkbox.addEventListener('change',()=>{if(checkbox.checked)close()});
  document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')close()});
})();
