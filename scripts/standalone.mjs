// Build an entirely self-contained preview for restrictive offline viewers.
import {build} from 'esbuild';
import {readFile,writeFile,mkdir,rm,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {company} from '../src/config.js';
const root=process.cwd(),temp=path.join(root,'.preview-src');
const publicRoot=process.env.PREVIEW_ASSETS || path.join(root,'public');
const fontPath=process.env.PREVIEW_FONT || path.join(root,'src/assets/cairo.ttf');
const output=process.env.PREVIEW_OUTPUT || 'preview-offline.html';
const uri=(bytes,mime)=>`data:${mime};base64,${bytes.toString('base64')}`;
try{
 await mkdir(temp,{recursive:true});
 for(const f of ['main.jsx','Globe.jsx','data.js','config.js','style.css'])await copyFile(path.join(root,'src',f),path.join(temp,f));
 const assets={};for(const f of await readdir(path.join(publicRoot,'images')))assets[f]=uri(await readFile(path.join(publicRoot,'images',f)),f.endsWith('.png')?'image/png':'image/webp');
 assets['earth.jpg']=uri(await readFile(path.join(publicRoot,'earth.jpg')),'image/jpeg');
 await writeFile(path.join(temp,'assets.js'),'export const assets='+JSON.stringify(assets)+';');
 let main=await readFile(path.join(temp,'main.jsx'),'utf8');main="import {assets} from './assets.js';\n"+main.replace("import './style.css';",'');
 main=main.replaceAll("import.meta.env.BASE_URL+`images/${n}.webp`","assets[`${n}.webp`]")
  .replaceAll("import.meta.env.BASE_URL+`images/${p.image}.webp`","assets[`${p.image}.webp`]")
  .replaceAll("import.meta.env.BASE_URL+'images/13.webp'","assets['13.webp']")
  .replaceAll("import.meta.env.BASE_URL+'images/whatsapp-1.png'","assets['whatsapp-1.png']")
  .replaceAll("import.meta.env.BASE_URL+'images/whatsapp-2.png'","assets['whatsapp-2.png']");
 const api="useEffect(()=>{const controller=new AbortController();fetch(import.meta.env.BASE_URL+'api/products?limit=100',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('offline');return r.json()}).then(json=>{if(Array.isArray(json.data))setCatalog(json.data)}).catch(()=>{});return()=>controller.abort()},[]);";
 if(!main.includes(api))throw Error('Preview transform: API expression changed');main=main.replace(api,'');
 if(main.includes('import.meta.env.BASE_URL'))throw Error('Preview transform: unresolved asset path');await writeFile(path.join(temp,'main.jsx'),main);
 let globe=await readFile(path.join(temp,'Globe.jsx'),'utf8');globe="import {assets} from './assets.js';\n"+globe.replace("import.meta.env.BASE_URL+'earth.jpg'","assets['earth.jpg']");await writeFile(path.join(temp,'Globe.jsx'),globe);
 const result=await build({entryPoints:[path.join(temp,'main.jsx')],bundle:true,minify:true,jsx:'automatic',format:'iife',target:'es2020',write:false});
 let css=await readFile(path.join(temp,'style.css'),'utf8');css=css.replace("url('./assets/cairo.ttf')",`url('${uri(await readFile(fontPath),'font/ttf')}')`);
 // In a sandbox with no popup permission, show the actual QR and explain the limitation.
 // In a normal browser all WhatsApp links work directly and this handler is not installed.
 const helper=`if(window.self!==window.top){document.addEventListener('click',function(e){var link=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]');if(!link)return;e.preventDefault();var isSecond=link.href.includes(${JSON.stringify(company.mobile2.digits)});var box=document.createElement('div');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','التواصل عبر واتساب');box.style.cssText='position:fixed;inset:0;background:#153b50bb;z-index:9999;display:grid;place-items:center;padding:20px;direction:rtl';var card=document.createElement('div');card.style.cssText='background:white;border-radius:16px;padding:24px;max-width:350px;text-align:center;box-shadow:0 20px 50px #0003;color:#173d52;font-family:Cairo,Tahoma,sans-serif';var title=document.createElement('strong');title.textContent='التواصل عبر واتساب';var p=document.createElement('p');p.style.cssText='font-size:13px;line-height:1.9';p.textContent='عارض المحادثة قد يمنع فتح واتساب مباشرة. امسح الرمز من هاتف آخر، أو حمّل ملف المعاينة وافتحه في المتصفح لاستخدام الأزرار بنقرة.';var qr=document.createElement('img');qr.src=isSecond?${JSON.stringify(assets['whatsapp-2.png'])}:${JSON.stringify(assets['whatsapp-1.png'])};qr.alt='رمز واتساب';qr.style.cssText='width:170px;height:170px;display:block;margin:10px auto';var num=document.createElement('div');num.dir='ltr';num.textContent=isSecond?${JSON.stringify(company.mobile2.international)}:${JSON.stringify(company.mobile1.international)};num.style.cssText='font-weight:bold;margin:12px';var close=document.createElement('button');close.textContent='إغلاق';close.style.cssText='padding:9px 25px;background:#168fb7;color:white;border:0;border-radius:8px;cursor:pointer;font:inherit';close.onclick=function(){box.remove()};card.append(title,p,qr,num,close);box.append(card);box.onclick=function(ev){if(ev.target===box)box.remove()};document.body.append(box)},{capture:true})}`;
 const js=result.outputFiles[0].text.replaceAll('</script','<\\/script');
 const html=`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5fbfd"><title>M&M | معاينة الموقع</title><style>${css}</style></head><body><div id="root"></div><script>${js}</script><script>${helper}</script></body></html>`;
 await writeFile(path.resolve(root,output),html);console.log('Self-contained preview created:',output);
}finally{await rm(temp,{recursive:true,force:true})}
