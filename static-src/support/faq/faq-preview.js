const filters=document.querySelectorAll('.faq-filters button');
const faqItems=document.querySelectorAll('.faq-list details');
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>item.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;faqItems.forEach(item=>item.hidden=filter!=='all'&&item.dataset.category!==filter)}));
faqItems.forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;faqItems.forEach(other=>{if(other!==item)other.open=false})}));

const editor=document.querySelector('#inquiry-editor');
const form=document.querySelector('#inquiry-form');
const openEditor=()=>{editor.showModal();document.body.classList.add('dialog-open')};
document.querySelectorAll('.inquiry-write').forEach(button=>button.addEventListener('click',openEditor));
document.querySelectorAll('.inquiry-dialog-close').forEach(button=>button.addEventListener('click',()=>{button.closest('dialog').close();document.body.classList.remove('dialog-open')}));
editor.addEventListener('click',event=>{if(event.target===editor){editor.close();document.body.classList.remove('dialog-open')}});

form.addEventListener('submit',async event=>{event.preventDefault();const status=form.querySelector('.inquiry-form-status'),submit=form.querySelector('[type="submit"]');submit.disabled=true;status.className='inquiry-form-status';status.textContent='문의글을 등록하고 있습니다.';try{const response=await fetch('/api/inquiries',{method:'POST',body:new FormData(form)}),result=await response.json();if(!response.ok)throw new Error(result.error||'문의글을 등록하지 못했습니다.');status.className='inquiry-form-status success';status.textContent='문의글이 등록되었습니다.';location.replace('/support/faq/#inquiry-board')}catch(error){status.className='inquiry-form-status error';status.textContent=error.message;submit.disabled=false}});

document.querySelector('.inquiry-search').addEventListener('submit',event=>{event.preventDefault();const query=event.currentTarget.querySelector('input').value.trim().toLowerCase();document.querySelectorAll('#inquiry-list tr').forEach(row=>{const title=row.querySelector('.inquiry-title')?.textContent.toLowerCase()||'';row.hidden=Boolean(query)&&!title.includes(query)})});
