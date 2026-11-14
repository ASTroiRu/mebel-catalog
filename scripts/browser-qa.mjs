// Local Firefox WebDriver BiDi acceptance checks. See docs/stage-g-report.md.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { ws, send, evaluate, screenshot } from './webdriver-bidi.mjs';
import { getContentPaths } from '../src/lib/content-paths.ts';
const origin=process.env.TEST_BASE_URL || 'http://127.0.0.1:3018';
const out=process.env.QA_OUTPUT_DIR || '/tmp/mebel-browser-qa';
await fs.mkdir(out,{recursive:true});
const results=[]; const runtimeErrors=[];
ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.method==='log.entryAdded'&&m.params.level==='error') runtimeErrors.push(m.params.text);});
let context;
async function run(expression){return evaluate(context,expression);}
async function settle(){await run('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');}
async function click(selector){await run('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');if(!e)throw new Error("Missing control");e.focus();e.click();})()');await settle();}
async function key(value){await send('input.performActions',{context,actions:[{type:'key',id:'keyboard',actions:[{type:'keyDown',value},{type:'keyUp',value}]}]});await settle();}
try {
  await send('session.new',{capabilities:{}});
  await send('session.subscribe',{events:['log.entryAdded']});
  context=(await send('browsingContext.getTree')).contexts[0].context;
  await send('browsingContext.activate',{context});
  const paths=await getContentPaths();
  const shots=['/','/catalog/kuhni/','/catalog/kuhni/linia/','/projects/lichnoe-prostranstvo/','/materials/','/faq/','/contacts/'];
  for(const width of [360,768,1440]) {
    await send('browsingContext.setViewport',{context,viewport:{width,height:900}});
    for(const path of paths) {
      await send('browsingContext.navigate',{context,url:origin+path,wait:'complete'});
      await run('document.fonts.ready.then(()=>true)');await settle();
      const state=JSON.parse(await run('JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll("main h1").length,headings:[...document.querySelectorAll("main h1,main h2,main h3")].map(e=>Number(e.tagName.slice(1))),missingAlt:document.querySelectorAll("main img:not([alt])").length})'));
      assert.equal(state.h1,1,path); assert.equal(state.missingAlt,0,path);
      assert.ok(state.scrollWidth<=state.width+1,'Overflow '+width+' '+path+' '+JSON.stringify(state));
      assert.ok(state.headings.every((n,i,a)=>i===0 || n<=a[i-1]+1),'Heading jump '+path);
      results.push({path,width,status:'pass'});
      if(width!==768 && shots.includes(path)) {
        // Load below-fold images before capturing the full page.
        await run('Promise.all([...document.images].map(img=>{img.loading="eager";return img.decode().catch(()=>{});})).then(()=>true)');
        await screenshot(context,out+'/'+width+'-'+(path==='/'?'home':path.split('/').filter(Boolean).join('-'))+'.png');
      }
    }
    console.log('Viewport '+width+': '+paths.length+' pages passed');
  }
  await send('browsingContext.setViewport',{context,viewport:{width:360,height:800}});
  await send('browsingContext.navigate',{context,url:origin+'/',wait:'complete'});await settle();
  await click('[aria-controls="mobile-navigation-panel"]');
  await click('#mobile-navigation-panel [data-quote-intent]');
  assert.equal(await run('!!document.querySelector("dialog[open]")'),true);
  assert.equal(await run('document.body.style.overflow'),'hidden');
  for(let i=0;i<18;i++){await key('\uE004');assert.equal(await run('document.querySelector("dialog").contains(document.activeElement)'),true,'Modal focus escaped');}
  await screenshot(context,out+'/360-form.png','viewport');
  await key('\uE00C');
  assert.equal(await run('document.querySelector("dialog[open]")===null'),true);
  assert.equal(await run('document.activeElement.getAttribute("aria-controls")'),'mobile-navigation-panel');
  await click('.cta-actions [data-quote-intent="quote"]');
  // Install local guards after the page/resources load; never use real personal data.
  await run('window.__transfers=0;window.fetch=()=>{window.__transfers++;throw Error("Forbidden fetch")};XMLHttpRequest.prototype.send=()=>{window.__transfers++;throw Error("Forbidden XHR")};Storage.prototype.setItem=()=>{window.__transfers++;throw Error("Forbidden storage")};navigator.sendBeacon=()=>{window.__transfers++;return false};');
  for(const phone of ['89991234567','+79991234567']) {
    if(!await run('!!document.querySelector("form")')) await click('.cta-actions [data-quote-intent="quote"]');
    await run('(()=>{for(const [name,value] of Object.entries({name:"Тест",phone:'+JSON.stringify(phone)+'})){const e=document.querySelector("[name="+name+"]");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(e,value);e.dispatchEvent(new Event("input",{bubbles:true}));}const s=document.querySelector("[name=categoryId]");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(s,s.options[1].value);s.dispatchEvent(new Event("change",{bubbles:true}));})()');
    await click('[name="consent"]'); await click('.quote-submit');
    assert.equal(await run('document.querySelector(".quote-toast p")?.textContent'),'Форма проверена. Это демонстрация — заявка не отправлена');
    assert.equal(await run('window.__transfers'),0);
  }
  await send('browsingContext.navigate',{context,url:origin+'/catalog/kuhni/linia/',wait:'complete'});await settle();
  await click('.gallery-main');assert.equal(await run('!!document.querySelector(".image-dialog[open]")'),true);
  await key('\uE014'); // ArrowRight
  assert.equal(await run('document.querySelectorAll(".gallery-thumbnails button")[1].getAttribute("aria-pressed")'),'true');
  await key('\uE00C');assert.equal(await run('document.activeElement.classList.contains("gallery-main")'),true);
  await send('browsingContext.navigate',{context,url:origin+'/',wait:'complete'});await settle();
  await click('[aria-label="Следующий слайд"]');
  assert.equal(await run('document.querySelector("#hero-slide").getAttribute("aria-label")'),'2 из 3: Шкафы');
  await run('new Promise(resolve=>setTimeout(resolve,6500))');
  assert.equal(await run('document.querySelector("#hero-slide").getAttribute("aria-label")'),'2 из 3: Шкафы');
  assert.equal(await run('document.querySelector("[data-rotation-control]")===null'),true);
  assert.deepEqual(runtimeErrors,[],'Browser runtime errors');
  await fs.writeFile(out+'/results.json',JSON.stringify({browser:'Firefox',checks:results,interactions:'modal focus/Escape, both phones, no transmission/storage, gallery and manual carousel passed',runtimeErrors},null,2));
  console.log('Browser acceptance passed: '+results.length+' viewport/page combinations and interactions');
} finally {await send('session.end').catch(()=>{});ws.close();}
