import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=process.cwd();
const code=await readFile(resolve(root,'dist/worker.js'),'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const assets={async fetch(request){const p=new URL(request.url).pathname;try{const content=await readFile(resolve(root,'dist/assets','.'+p));return new Response(content,{headers:{'content-type':p.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'}})}catch{return new Response('Not found',{status:404})}}};
const db={prepare(){return{bind(){return this},async run(){return{}},async all(){return{results:[]}},async first(){return{count:0}}}}};
for(const path of ['/','/about/','/solutions/app/','/privacy/','/a-cases','/a-cases.html','/a-about-20260928.html','/support/faq/','/support/notices/','/support/resources/','/admin/']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path),{ASSETS:assets,DB:db});assert.equal(response.status,200,path);const body=await response.text();assert.match(body,/<html/i,path);
 if(path==='/')assert.ok(body.includes('큰 매장은')&&body.includes('href="/support/">고객센터</a>'));
 if(path.includes('a-about'))assert.ok(body.includes('운영의 가치를 높이고,')&&!body.includes('HISTORY / 01'));
}
for(const file of ['index.html','a-about-20260928.html','a-cases.html','a-app-20260928-v2.html','a-privacy-20260928.html']){
 const html=await readFile(resolve(root,'dist/assets',file),'utf8');
 for(const m of html.matchAll(/(?:src|href)=["'](\/[^"'#?]+)(?:\?[^"']*)?["']/g)){
 const path=m[1];if(path==='/a-app-20260928.html'||path.startsWith('/support/'))continue;
 const resolved=resolve(root,'dist/assets','.'+path);try{await stat(resolved)}catch{throw new Error(`Missing asset in ${file}: ${path}`)}
 }
}
const config=JSON.parse(await readFile('wrangler.jsonc','utf8'));
assert.equal(config.name,'bizone');assert.equal(config.d1_databases[0].database_id,'366fa980-9b86-4777-a4de-f1f5ae900522');assert.equal(config.keep_vars,true);
assert.ok(!code.includes('__STATIC_FILES__'));
console.log('Migration verified: public pages, assets, admin and board routes; existing D1 binding and runtime settings retained.');
// Exercise rendered support details and authenticated admin views with test-only data.
const item={id:7,title:'검증 게시글 <test>',author:'고객지원팀',category:'제품 문의',content:'본문 내용',answer:'답변 내용',answer_author:'고객지원팀',created_at:'2026-10-14 10:00:00',answered_at:'2026-10-14',file_name:'guide.pdf',file_url:'/downloads/guide.pdf',view_count:2,download_count:1};
const populated={prepare(sql){return{bind(){return this},async run(){return{}},async all(){return{results:[item]}},async first(){return sql.includes('COUNT(')?{count:1}:item}}}};
for(const path of ['/support/notices/','/support/resources/','/support/faq/','/support/notices/7','/support/resources/7','/support/faq/7']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path),{ASSETS:assets,DB:populated});assert.equal(response.status,200,path);const body=await response.text();assert.ok(body.includes('/customer-center.css')&&body.includes('cc-artwork')&&body.includes('aria-current="page"'),path);assert.ok(body.includes('검증 게시글 &lt;test&gt;'),path);
}
const {createHmac}=await import('node:crypto');
const payload=Buffer.from(JSON.stringify({username:'test-admin',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
const signature=createHmac('sha256','test-only-secret').update(payload).digest('base64url');
for(const path of ['/admin/','/admin/notices/','/admin/inquiries/']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path,{headers:{cookie:'bizone_admin_session='+payload+'.'+signature}}),{ASSETS:assets,DB:populated,SESSION_SECRET:'test-only-secret',ADMIN_USERNAME:'test-admin'});assert.equal(response.status,200,path);const body=await response.text();assert.ok(body.includes('/admin-renewal.css')&&body.includes('admin-brand')&&body.includes('admin-dialog'),path);assert.ok(!body.includes('/bizone-logo-text-only.png'),path);
}
for(const file of ['index.html','a-about-20260928.html','a-cases.html','a-app-20260928-v2.html','a-privacy-20260928.html']){
 const body=await readFile(resolve(root,'dist/assets',file),'utf8');assert.doesNotMatch(body,/href="[^" ]*#(?:notice|qa|downloads)"/,file);assert.ok(body.includes('href="/support/">고객센터</a>'),file);
}
console.log('Support navigation, populated boards, protected inquiry view, and all authenticated admin screens verified.');

for(const [path,name] of [['/support/notices/','notice'],['/support/faq/','qa'],['/support/resources/','resources'],['/support/faq/7','qa']]){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path),{ASSETS:assets,DB:populated});const body=await response.text();assert.ok(body.includes('/images/support-'+name+'-v1.webp'),path);assert.ok(!body.includes('CONNECTED SUPPORT'),path);const image=await assets.fetch(new Request('https://assets.local/images/support-'+name+'-v1.webp'));assert.equal(image.status,200,name);
}
console.log('Distinct support artwork assets and list/detail hero mappings verified.');

for(const tab of ['notices','faq','resources']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev/support/?tab='+tab+'&q=test'),{ASSETS:assets,DB:populated});assert.equal(response.status,200);const body=await response.text();assert.ok(body.includes('id="customer-center-content" data-tab="'+tab+'"'));assert.ok(!body.includes('support-submenu'));assert.ok(body.includes('href="/support/">고객센터</a>'));if(tab!=='faq')assert.ok(body.includes('name="tab" value="'+tab+'"'));
}
const defaultCenter=await worker.fetch(new Request('https://bizone.korpay.workers.dev/support/'),{ASSETS:assets,DB:populated});assert.ok((await defaultCenter.text()).includes('data-tab="notices"'));
console.log('Unified customer center: default tab, all three panels, search state, and direct navigation verified.');
for(const path of ['/support/','/support/?tab=faq','/support/?tab=resources','/support/notices/7','/support/resources/7','/support/faq/7']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path),{ASSETS:assets,DB:populated});const body=await response.text();assert.ok(body.includes('class="floating-actions"')&&body.includes('class="cinematic-top"')&&body.includes('/support-consultation.js?v=1'),path);assert.ok(response.headers.get('content-security-policy').includes('https://formsubmit.co'),path);
}
const consultation=await readFile('static-src/support-consultation.js','utf8');assert.ok(consultation.includes("getElementById('consult-form')")&&!consultation.includes("getElementById('inquiry-form')"));
console.log('Floating consultation/TOP controls verified across center tabs and details; Q&A and consultation forms use separate identifiers.');
for(const path of ['/support/?tab=selfhelp','/support/?tab=faq','/support/faq/index.html']){
 const response=await worker.fetch(new Request('https://bizone.korpay.workers.dev'+path),{ASSETS:assets,DB:populated});const body=await response.text();assert.ok(!body.includes('/widget.js'),path);assert.ok(body.includes('data-chatbot-tab hidden')||!body.includes('data-chatbot-tab'),path);if(path.includes('selfhelp'))assert.ok(body.includes('data-tab="notices"'),path);
}
for(const file of ['index.html','product/barcode-scanner/index.html','product/card-terminal/index.html']){
 const body=await readFile(resolve(root,'dist/assets',file),'utf8');const models=[...body.matchAll(/data-chatbot-model="([^"]+)"/g)].map(m=>m[1]);assert.ok(models.length>=3&&body.includes('/chatbot-links.js'),file);
 for(const model of models)assert.ok(body.includes('href="/support/?tab=selfhelp&amp;model='+encodeURIComponent(model)+'" data-chatbot-model="'+model+'" hidden>'),file+' '+model);
}
console.log('Chatbot disabled without CHATBOT_URL: no widget, selfhelp tab hidden and falls back to notices; model links stay hidden and point to the selfhelp tab.');
