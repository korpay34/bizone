// Activate each card only after its matching blog URL has been provided.
fetch('/cases-links.json').then(response=>response.ok?response.json():[]).then(records=>{
  const links=new Map(records.map(record=>[record.company,record.blogUrl]));
  document.querySelectorAll('article.case-card').forEach(card=>{
    const company=card.getAttribute('aria-label');
    const url=links.get(company);
    if(!url)return;
    let parsed;try{parsed=new URL(url)}catch{return}
    if(!['https:','http:'].includes(parsed.protocol))return;
    const link=document.createElement('a');
    link.className=card.className+' has-link';link.href=parsed.href;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',company+' 블로그 글 보기 (새 창)');
    link.innerHTML=card.innerHTML;
    const caption=document.createElement('span');caption.className='case-blog';caption.textContent='블로그에서 자세히 보기';
    const arrow=document.createElement('span');arrow.className='case-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    link.querySelector('.case-overlay').append(caption,arrow);card.replaceWith(link);
  });
}).catch(()=>{});
