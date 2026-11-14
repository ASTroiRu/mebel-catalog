import fs from 'node:fs/promises';
export const ws = new WebSocket('ws://127.0.0.1:9222/session');
let id=0; const pending=new Map();
ws.addEventListener('message',event=>{const data=JSON.parse(event.data); if(pending.has(data.id)){const {resolve,reject,timer}=pending.get(data.id);clearTimeout(timer);pending.delete(data.id);data.type==='error'?reject(new Error(JSON.stringify(data))):resolve(data.result);}});
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
export function send(method,params={}){return new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(new Error('Timeout: '+method));},45000);pending.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));});}
export async function evaluate(context,expression){const r=await send('script.evaluate',{expression,target:{context},awaitPromise:true});if(r.type==='exception')throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
export async function screenshot(context,path,origin="document"){const r=await send('browsingContext.captureScreenshot',{context,origin});await fs.writeFile(path,Buffer.from(r.data,'base64'));}
