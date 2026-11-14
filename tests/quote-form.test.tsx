import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { act } from 'react';
import { QuoteProvider } from '../src/components/forms/quote-provider';
import { QuoteButton } from '../src/components/ui/quote-button';
import { MobileMenu } from '../src/components/layout/mobile-menu';
import { DEMO_SUCCESS } from '../src/lib/quote-validation';

const categories = [{id:'kitchen',slug:'kuhni',title:'Кухни'},{id:'wardrobe',slug:'shkafy',title:'Шкафы'}];
const products = [{categoryId:'kitchen',slug:'linia',title:'Линия'}];
async function setup(path = '/', mobile = false) {
  const dom = new JSDOM('<div id="root"></div>', {url:`http://localhost${path}`,pretendToBeVisual:true});
  Object.assign(globalThis, {window:dom.window,self:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,Node:dom.window.Node,IS_REACT_ACT_ENVIRONMENT:true});
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  Object.defineProperty(dom.window, 'matchMedia', {value:() => ({matches:false,addEventListener(){},removeEventListener(){}})});
  let transfers = 0;
  const forbidden = () => { transfers++; throw new Error('Unexpected transfer/storage'); };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = forbidden;
  Object.assign(dom.window, {fetch:forbidden,FileReader:forbidden,XMLHttpRequest:forbidden});
  dom.window.Storage.prototype.setItem = forbidden;
  Object.defineProperty(dom.window.navigator,'sendBeacon',{value:forbidden});
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root')!);
  try { await act(async () => root.render(<QuoteProvider categories={categories} products={products}>{mobile ? <MobileMenu /> : <><QuoteButton /><QuoteButton intent="measurement" /><QuoteButton categoryId="wardrobe" modelName="Вертикаль" /></>}</QuoteProvider>)); } catch (error) { if (error instanceof AggregateError) throw new Error(error.errors.map(item => String(item)).join("\n")); throw error; }
  const click = async (selector: string) => { const el = document.querySelector<HTMLButtonElement>(selector); assert.ok(el,selector); await act(async () => { el.focus(); el.click(); }); };
  const set = async (name: string, value: string) => {
    const el = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`)!;
    assert.ok(el,name);
    const proto = el instanceof dom.window.HTMLSelectElement ? dom.window.HTMLSelectElement.prototype : el instanceof dom.window.HTMLTextAreaElement ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
    await act(async () => { Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,value); el.dispatchEvent(new dom.window.Event(el instanceof dom.window.HTMLSelectElement ? 'change' : 'input',{bubbles:true})); });
  };
  const submit = async () => { let allowed = true; await act(async () => { allowed = document.querySelector('form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})); }); assert.equal(allowed,false,'Form must cancel native submission'); };
  const selectFile = async (file: File) => { const el=document.querySelector<HTMLInputElement>('[name="file"]')!; Object.defineProperty(el,'files',{configurable:true,value:[file]}); await act(async () => el.dispatchEvent(new dom.window.Event('change',{bubbles:true}))); };
  return {dom,click,set,submit,selectFile,transfers:()=>transfers,cleanup:async()=>{await act(async()=>root.unmount());globalThis.fetch=originalFetch;dom.window.close();}};
}

test('context, untouched fields, live errors, focus and cancellation reset form', async () => {
  const app = await setup('/catalog/kuhni/linia/');
  try {
    await app.click('[data-quote-intent="quote"]');
    assert.equal(document.querySelector<HTMLSelectElement>('[name="categoryId"]')?.value,'kitchen');
    assert.match(document.querySelector('.quote-model')!.textContent!,/Линия/);
    assert.equal(document.querySelectorAll('.field-error').length,0);
    assert.equal(document.activeElement?.id,'quote-title');
    await app.set('width','-1');
    assert.match(document.getElementById('quote-width-error')!.textContent!,/больше нуля/);
    await app.set('width','120,5');
    assert.equal(document.getElementById('quote-width-error'),null);
    await app.submit();
    assert.equal(document.activeElement?.id,'quote-name');
    const phoneError = document.getElementById('quote-phone-error');
    await app.set('name','Анна');
    assert.ok(document.getElementById('quote-phone-error') === phoneError,'Unrelated live error must not remount');
    await app.selectFile(new app.dom.window.File(['x'],'plan.pdf',{type:'application/pdf'}));
    await act(async () => document.querySelector('dialog')!.dispatchEvent(new app.dom.window.MouseEvent('click',{bubbles:true})));
    assert.ok(document.querySelector('form'),'Backdrop click must not close form');
    await act(async () => document.querySelector('dialog')!.dispatchEvent(new app.dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
    assert.equal(document.querySelector('form'),null);
    assert.equal(document.body.style.overflow,'');
    assert.equal(document.activeElement?.getAttribute('data-quote-intent'),'quote');
    await app.click('[data-quote-intent="measurement"]');
    assert.equal(document.getElementById('quote-title')?.textContent,'Записаться на замер');
    assert.equal(document.querySelector<HTMLInputElement>('[name="name"]')?.value,'');
    assert.equal(document.querySelector('.selected-file'),null);
    assert.equal(document.querySelectorAll('.field-error').length,0);
    await app.click('[aria-label="Закрыть форму"]');
    await app.click('[data-quote-model="Вертикаль"]');
    assert.equal(document.querySelector<HTMLSelectElement>('[name="categoryId"]')?.value,'wardrobe');
    assert.match(document.querySelector('.quote-model')!.textContent!,/Вертикаль/);
    await app.set('categoryId','kitchen');
    assert.equal(document.querySelector('.quote-model'),null);
    assert.equal(app.transfers(),0);
  } finally { await app.cleanup(); }
});

test('invalid file blocks success; valid form shows exact demo notice without sending or saving data', async () => {
  const app = await setup();
  try {
    await app.click('[data-quote-intent="quote"]');
    await app.set('categoryId','kitchen');
    await app.set('name','Анна');
    await app.set('phone','8 (999) 123-45-67');
    await app.set('height','220');
    await app.set('comment','Демонстрационный комментарий');
    await app.click('[name="consent"]');
    await app.selectFile(new app.dom.window.File(['x'],'bad.exe',{type:'application/octet-stream'}));
    await app.submit();
    assert.ok(document.getElementById('quote-file-error'));
    assert.equal(document.querySelector('.quote-toast'),null);
    await app.selectFile(new app.dom.window.File(['x'],'plan.pdf',{type:'application/pdf'}));
    await app.submit();
    assert.equal(document.querySelector('form'),null);
    assert.equal(document.querySelector('.quote-toast p')?.textContent,DEMO_SUCCESS);
    assert.equal(app.transfers(),0);
    await app.click('[data-quote-intent="quote"]');
    assert.equal(document.querySelector<HTMLInputElement>('[name="phone"]')?.value,'');
    assert.equal(document.querySelector<HTMLInputElement>('[name="consent"]')?.checked,false);
    assert.equal(document.querySelector('.selected-file'),null);
    await act(async () => document.querySelector('dialog')!.dispatchEvent(new app.dom.window.Event('cancel',{cancelable:true})));
    assert.equal(document.querySelector('form'),null);
  } finally { await app.cleanup(); }
});

test('mobile menu closes when opening form and receives focus back after close', async () => {
  const app = await setup('/',true);
  try {
    await app.click('[aria-controls="mobile-navigation-panel"]');
    await app.click('[data-quote-intent="quote"]');
    assert.equal(document.querySelector('[aria-controls="mobile-navigation-panel"]')?.getAttribute('aria-expanded'),'false');
    assert.ok(document.querySelector('dialog[open]'));
    await app.click('[aria-label="Закрыть форму"]');
    assert.equal(document.activeElement?.getAttribute('aria-controls'),'mobile-navigation-panel');
    assert.equal(document.body.style.overflow,'');
  } finally { await app.cleanup(); }
});

test('Tab and Shift+Tab wrap inside the quote dialog', async () => {
  const app = await setup();
  try {
    await app.click('[data-quote-intent="quote"]');
    const first = document.querySelector<HTMLButtonElement>('.quote-close')!;
    const last = document.querySelector<HTMLButtonElement>('.quote-submit')!;
    await act(async () => { last.focus(); last.dispatchEvent(new app.dom.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true})); });
    assert.ok(document.activeElement === first, 'Tab from submit returns to close');
    await act(async () => first.dispatchEvent(new app.dom.window.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true})));
    assert.ok(document.activeElement === last, 'Shift+Tab from close returns to submit');
  } finally { await app.cleanup(); }
});
