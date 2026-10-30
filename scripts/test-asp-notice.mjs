import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync('static-src/asp-notice.js','utf8');
function boot(iso,{cookie='',stored=null,blocked=false,host='www.bizone.co.kr',duplicate=false}={}){
 let time=Date.parse(iso),saved=stored;
 const nodes=[],listeners={},timers=[],buttons={};
 const root={style:{overflow:'auto'}};
 const previous={isConnected:true,focus(){this.focused=true}};
 const doc={head:{append(x){nodes.push(x)}},body:{append(x){nodes.push(x)}},documentElement:root,activeElement:previous,hidden:false,getElementById(){return duplicate?{}:null},addEventListener(n,f){listeners[n]=f},createElement(type){
  const events={};
  const node={type,open:false,setAttribute(){},addEventListener(n,f){events[n]=f},querySelector(s){return buttons[s]||= {addEventListener(n,f){this[n]=f}}},showModal(){this.open=true},close(){this.open=false;events.close?.()},remove(){this.removed=true}};
  return node;
 }};
 Object.defineProperty(doc,'cookie',{get(){if(blocked)throw Error('blocked');return cookie},set(v){if(blocked)throw Error('blocked');cookie=v}});
 class Clock extends Date{static now(){return time}}
 const storage={getItem(){if(blocked)throw Error('blocked');return saved},setItem(k,v){if(blocked)throw Error('blocked');saved=v}};
 vm.runInNewContext(code,{document:doc,window:{addEventListener(n,f){listeners[n]=f}},localStorage:storage,location:{hostname:host},Date:Clock,setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){}});
 return {nodes,buttons,root,previous,timers,listeners,setTime(v){time=Date.parse(v)},get cookie(){return cookie},get stored(){return saved},get dialog(){return nodes.find(x=>x.type==='dialog')}};
}
for(const iso of ['2026-10-29T23:59:59+09:00','2026-12-01T00:00:00+09:00','2027-01-01T00:00:00+09:00'])assert.equal(boot(iso).nodes.length,0,iso);
for(const iso of ['2026-10-30T00:00:00+09:00','2026-11-30T23:59:59+09:00'])assert.equal(boot(iso).dialog.open,true,iso);
const closed=boot('2026-10-30T15:45:00+09:00');closed.buttons['[data-asp-close]'].click();assert.equal(closed.dialog.removed,true);assert.equal(closed.cookie,'');assert.equal(closed.stored,null);assert.equal(closed.root.style.overflow,'auto');assert.equal(closed.previous.focused,true);
for(const host of ['bizone.co.kr','www.bizone.co.kr']){
 const p=boot('2026-10-30T23:59:59+09:00',{host});p.buttons['[data-asp-hide]'].click();assert.match(p.cookie,/Expires=Fri, 30 Oct 2026 15:00:00 GMT/);assert.match(p.cookie,/Domain=bizone.co.kr/);assert.match(p.cookie,/Secure/);assert.equal(p.stored,'2026-10-30');assert.equal(p.dialog.removed,true);
 assert.equal(boot('2026-10-30T23:59:59+09:00',{cookie:p.cookie}).nodes.length,0);
 assert.equal(boot('2026-10-31T00:00:00+09:00',{stored:p.stored}).dialog.open,true);
}
assert.equal(boot('2026-10-30T15:45:00+09:00',{stored:'2026-10-30'}).nodes.length,0);
assert.equal(boot('2026-10-30T15:45:00+09:00',{duplicate:true}).nodes.length,0);
const blocked=boot('2026-10-30T15:45:00+09:00',{blocked:true});blocked.buttons['[data-asp-hide]'].click();assert.equal(blocked.dialog.removed,true);
const expiry=boot('2026-11-30T23:59:59+09:00');assert.equal(expiry.timers[0].ms,1000);expiry.setTime('2026-12-01T00:00:00+09:00');expiry.timers[0].fn();assert.equal(expiry.dialog.removed,true);assert.equal(expiry.root.style.overflow,'auto');
const resumed=boot('2026-11-30T22:00:00+09:00');resumed.setTime('2026-12-01T01:00:00+09:00');resumed.listeners.pageshow();assert.equal(resumed.dialog.removed,true);
assert.doesNotMatch(code,/PHP 버전|리테일솔루션본부/);assert.match(code,/zizi04@korpay.com/);assert.match(code,/2026년 11월 6일\(금\) 00시/);
const css=readFileSync('static-src/asp-notice.css','utf8');for(const c of css.matchAll(/#([0-9a-f]{3,8})\b/gi)){const h=c[1];if(h.length===3||h.length===4){assert.equal(h[0],h[1]);assert.equal(h[1],h[2]);}else{assert.equal(h.slice(0,2),h.slice(2,4));assert.equal(h.slice(2,4),h.slice(4,6))}}
console.log('ASP notice passed: KST start/end boundaries, both close actions, cross-host cookie, next-day reset, blocked storage, duplicate guard, open-page expiry and approved content.');
