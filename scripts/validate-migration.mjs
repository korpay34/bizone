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
 if(path==='/')assert.ok(body.includes('큰 매장은')&&body.includes('/support/faq/'));
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
