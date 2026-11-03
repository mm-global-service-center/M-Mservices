import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {products} from '../src/data.js';
let child,base;
before(async()=>{
 const socket=net.createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));base=`http://127.0.0.1:${port}`;
 child=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Server startup timed out')),10000);child.stdout.on('data',()=>{clearTimeout(timeout);resolve()});child.on('error',reject);child.on('exit',code=>{if(code!==null)reject(Error('Server failed: '+code))})});
});
after(()=>child?.kill());
test('health and full catalogue',async()=>{const health=await(await fetch(base+'/api/health')).json();assert.equal(health.status,'ok');const result=await(await fetch(base+'/api/products?limit=100')).json();assert.equal(result.meta.total,products.length);assert(result.data.every(p=>p.details.length>=2));});
test('Arabic search and category',async()=>{const search=await(await fetch(base+'/api/products?q='+encodeURIComponent('الشعر'))).json();assert(search.data.some(p=>p.id===6));const category=await(await fetch(base+'/api/products?category='+encodeURIComponent('المستلزمات الطبية'))).json();assert(category.data.length>0);assert(category.data.every(p=>p.category==='المستلزمات الطبية'));});
test('pagination, details and missing product',async()=>{const first=await(await fetch(base+'/api/products?limit=3&page=1')).json();const second=await(await fetch(base+'/api/products?limit=3&page=2')).json();assert.equal(first.data.length,3);assert.notEqual(first.data[0].id,second.data[0].id);const item=await(await fetch(base+'/api/products/'+first.data[0].id)).json();assert.equal(item.data.id,first.data[0].id);assert.equal((await fetch(base+'/api/products/999999')).status,404);});
