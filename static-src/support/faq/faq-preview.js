const filters=document.querySelectorAll('.faq-filters button');
const faqItems=document.querySelectorAll('.faq-list details');
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;faqItems.forEach(item=>item.hidden=filter!=='all'&&item.dataset.category!==filter)}));
faqItems.forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;faqItems.forEach(other=>{if(other!==item)other.open=false})}));

const editor=document.querySelector('#inquiry-editor');
const passwordDialog=document.querySelector('#password-dialog');
const passwordForm=document.querySelector('#password-form');
const passwordEntry=passwordDialog.querySelector('.password-entry');
const postContent=passwordDialog.querySelector('.private-post-content');
const list=document.querySelector('#inquiry-list');
const openEditor=()=>{editor.showModal();document.body.classList.add('dialog-open')};
document.querySelectorAll('.inquiry-write').forEach(button=>button.addEventListener('click',openEditor));
document.querySelectorAll('.inquiry-dialog-close').forEach(button=>button.addEventListener('click',()=>{button.closest('dialog').close();document.body.classList.remove('dialog-open')}));
[editor,passwordDialog].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){dialog.close();document.body.classList.remove('dialog-open')}}));

document.querySelector('#inquiry-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const number=list.children.length+1;const today=new Date().toISOString().slice(0,10).replaceAll('-','.');const row=document.createElement('tr');row.innerHTML=`<td>${number}</td><td class="inquiry-title"><button type="button"><span class="title-lock" aria-hidden="true"></span>${escapeHtml(data.get('title'))}</button></td><td>${maskName(data.get('author'))}</td><td>${today}</td><td><span class="status waiting">접수완료</span></td>`;const button=row.querySelector('button');button.dataset.password=String(data.get('password'));button.dataset.title=String(data.get('title'));button.dataset.category=String(data.get('category'));button.dataset.content=String(data.get('content'));list.prepend(row);form.reset();form.querySelector('.inquiry-form-status').textContent='문의글이 등록되었습니다.';setTimeout(()=>{editor.close();document.body.classList.remove('dialog-open');form.querySelector('.inquiry-form-status').textContent=''},700)});

list.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;passwordDialog.dataset.expected=button.dataset.password;passwordDialog.dataset.title=button.dataset.title;passwordDialog.dataset.category=button.dataset.category;passwordDialog.dataset.content=button.dataset.content;passwordForm.reset();passwordEntry.hidden=false;postContent.hidden=true;passwordForm.querySelector('.inquiry-form-status').textContent='';passwordDialog.showModal();document.body.classList.add('dialog-open');passwordDialog.querySelector('input').focus()});
passwordForm.addEventListener('submit',event=>{event.preventDefault();const input=event.currentTarget.querySelector('input');const status=event.currentTarget.querySelector('.inquiry-form-status');if(input.value===passwordDialog.dataset.expected){passwordEntry.hidden=true;status.textContent='';postContent.querySelector('.private-post-category').textContent=passwordDialog.dataset.category;postContent.querySelector('h3').textContent=passwordDialog.dataset.title;postContent.querySelector('p').textContent=passwordDialog.dataset.content;postContent.hidden=false}else{status.className='inquiry-form-status error';status.textContent='비밀번호가 일치하지 않습니다.'}});
document.querySelector('.inquiry-search').addEventListener('submit',event=>event.preventDefault());
function maskName(value){const text=String(value||'고객');return text.length<2?'*':text[0]+'*'.repeat(Math.min(2,text.length-1))}
function escapeHtml(value){return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
