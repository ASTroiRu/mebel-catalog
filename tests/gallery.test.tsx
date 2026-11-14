import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageGallery } from '../src/components/gallery/image-gallery';

test('gallery selects thumbnails, wraps keyboard navigation, closes and restores focus/scroll', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url:'http://localhost/', pretendToBeVisual:true });
  Object.assign(globalThis, { window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT:true });
  // JSDOM has no top layer; only supply native dialog API, test our state/effects.
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  const root = createRoot(document.getElementById('root')!);
  const images = [{ src:'/images/products/linia.svg', alt:'Первое', caption:'Схема один' }, { src:'/images/products/balans.svg', alt:'Второе', caption:'Схема два' }];
  document.body.style.overflow = 'auto';
  try {
    await act(async () => root.render(<ImageGallery images={images} title="Линия" />));
    const thumbs = document.querySelectorAll<HTMLButtonElement>('.gallery-thumbnails button');
    await act(async () => thumbs[1].click());
    assert.equal(thumbs[1].getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelector('.gallery-main img')?.getAttribute('alt'), 'Второе');
    const opener = document.querySelector<HTMLButtonElement>('.gallery-main')!;
    await act(async () => { opener.focus(); opener.click(); });
    assert.equal(document.querySelector('dialog')?.open, true);
    assert.equal(document.body.style.overflow, 'hidden');
    assert.equal(document.activeElement?.textContent, 'Закрыть');
    const close = document.querySelector<HTMLButtonElement>('.dialog-toolbar button')!;
    const next = document.querySelector<HTMLButtonElement>('[aria-label="Следующее изображение"]')!;
    await act(async () => { next.focus(); next.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true})); });
    assert.ok(document.activeElement === close, 'Gallery Tab wraps to close');
    await act(async () => close.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true})));
    assert.ok(document.activeElement === next, 'Gallery Shift+Tab wraps to next');

    await act(async () => document.activeElement?.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'ArrowRight',bubbles:true})));
    assert.equal(document.querySelector('.dialog-image img')?.getAttribute('alt'), 'Первое');
    await act(async () => document.activeElement?.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'Escape',bubbles:true})));
    assert.equal(document.querySelector('dialog')?.open, false);
    assert.equal(document.body.style.overflow, 'auto');
    assert.equal(document.activeElement, opener);
    await act(async () => opener.click());
    await act(async () => document.querySelector<HTMLButtonElement>('.dialog-toolbar button')!.click());
    assert.equal(document.querySelector('dialog')?.open, false);
    await act(async () => opener.click());
    await act(async () => document.querySelector('dialog')!.dispatchEvent(new dom.window.Event('cancel', {cancelable:true})));
    assert.equal(document.querySelector('dialog')?.open, false);
    await act(async () => opener.click());
    await act(async () => root.unmount());
    assert.equal(document.body.style.overflow, 'auto');
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
