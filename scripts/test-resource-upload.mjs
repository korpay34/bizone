import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHmac} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../worker/index.js',import.meta.url),'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(`CREATE TABLE resources(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,content TEXT,file_key TEXT,file_name TEXT,file_url TEXT,file_type TEXT,file_size INTEGER,download_count INTEGER DEFAULT 0,view_count INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
function prepare(sql){let values=[];return{bind(...args){values=args;return this},async first(){return sqlite.prepare(sql).get(...values)||null},async all(){return{results:sqlite.prepare(sql).all(...values)}},async run(){sqlite.prepare(sql).run(...values);return{}},sql,values:()=>values}}
let failBatch=false;
const DB={prepare,async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const statement of statements){if(failBatch&&statement.sql.startsWith('UPDATE resources'))throw Error('simulated failure');const s=sqlite.prepare(statement.sql);results.push({results:s.columns().length?s.all(...statement.values()):(s.run(...statement.values()),[])});}sqlite.exec('COMMIT');return results}catch(error){sqlite.exec('ROLLBACK');throw error}}};
const env={DB,SESSION_SECRET:'test-only',ADMIN_USERNAME:'test-admin'};
const payload=Buffer.from(JSON.stringify({username:env.ADMIN_USERNAME,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
const cookie='bizone_admin_session='+payload+'.'+createHmac('sha256',env.SESSION_SECRET).update(payload).digest('base64url');
async function request(path,{method='GET',body,auth=true,origin='https://bizone.example'}={}){return worker.fetch(new Request('https://bizone.example'+path,{method,body,headers:{...(auth?{cookie}:{}),...(method!=='GET'?{origin}:{})}}),env)}
function form(bytes,name='사용설명서.pdf'){const f=new FormData();f.set('title','설명서');f.set('author','고객지원팀');f.set('content','본문');if(bytes)f.set('attachment',new File([bytes],name,{type:'application/pdf'}));return f}
const bytes=Uint8Array.from({length:1100000},(_,i)=>i%251);
assert.equal((await request('/api/admin/resources',{method:'POST',body:form(bytes),auth:false})).status,401);
assert.equal((await request('/api/admin/resources',{method:'POST',body:form(bytes),origin:'https://other.example'})).status,403);
let response=await request('/api/admin/resources',{method:'POST',body:form(bytes)});assert.equal(response.status,200);const {id}=await response.json();
assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM resource_file_chunks').get().n,3);
response=await request(`/support/resources/${id}/download`,{auth:false});assert.equal(response.status,200);assert.match(response.headers.get('content-disposition'),/filename\*=UTF-8''/);assert.equal(response.headers.get('content-length'),String(bytes.length));assert.deepEqual(new Uint8Array(await response.arrayBuffer()),bytes);
const key=sqlite.prepare('SELECT file_key FROM resources WHERE id=?').get(id).file_key;
assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:form()})).status,200);assert.equal(sqlite.prepare('SELECT file_key FROM resources WHERE id=?').get(id).file_key,key);
// Saving without a new selection also keeps legacy URL attachments.
sqlite.prepare("INSERT INTO resources(title,author,content,file_name,file_url) VALUES('old','team','body','old.pdf','/downloads/old.pdf')").run();
assert.equal((await request('/api/admin/resources/2',{method:'POST',body:form()})).status,200);response=await request('/support/resources/2/download');assert.equal(response.status,302);assert.equal(response.headers.get('location'),'https://bizone.example/downloads/old.pdf');
// Invalid and failed replacements must leave the original attachment intact.
assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:form(new Uint8Array(10*1024*1024+1))})).status,400);
assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:form(new Uint8Array())})).status,400);
const log=console.error;console.error=()=>{};failBatch=true;assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:form(new Uint8Array([9]))})).status,500);failBatch=false;console.error=log;
assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM resource_file_chunks').get().n,3);
assert.equal(sqlite.prepare('SELECT file_key FROM resources WHERE id=?').get(id).file_key,key);
assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:form(new Uint8Array([1,2,3]),'교체.zip')})).status,200);
assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM resource_file_chunks WHERE file_key=?').get(key).n,0);
response=await request(`/support/resources/${id}/download`);assert.deepEqual(new Uint8Array(await response.arrayBuffer()),new Uint8Array([1,2,3]));
const remove=form();remove.set('remove_file','1');assert.equal((await request(`/api/admin/resources/${id}`,{method:'POST',body:remove})).status,200);assert.equal((await request(`/support/resources/${id}/download`)).status,404);assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM resource_file_chunks').get().n,0);
response=await request('/api/admin/resources',{method:'POST',body:form(bytes)});const third=(await response.json()).id;assert.equal((await request(`/api/admin/resources/${third}`,{method:'DELETE'})).status,200);assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM resource_file_chunks').get().n,0);
// Render the actual admin HTML and parse every generated inline script.
response=await request('/admin/');const html=await response.text();assert.match(html,/type="file" name="attachment"/);assert.ok(!html.includes('GitHub에 올린 파일 주소'));assert.ok(!html.includes('name="file_url"'));
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(match[1]);
console.log('PASS: authenticated upload, multipart bytes/download, size/empty validation, preserve/replace/remove, legacy downloads, deletion, atomic rollback and admin scripts.');
