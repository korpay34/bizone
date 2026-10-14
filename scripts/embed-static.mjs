import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
await mkdir(resolve(root,'dist/assets'),{recursive:true});
await cp(resolve(root,'static-src'),resolve(root,'dist/assets'),{recursive:true});
await cp(resolve(root,'worker/index.js'),resolve(root,'dist/worker.js'));
console.log('Worker and static assets built separately.');
