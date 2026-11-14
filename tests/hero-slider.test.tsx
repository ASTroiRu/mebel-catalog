import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroSlider } from '../src/components/home/hero-slider';

// Manual navigation, absence of autoplay, and mounting only the active image.
const slides = ['Кухни', 'Шкафы', 'Гардеробные'].map((label, index) => ({
  id: String(index), label, image: <img src={`/slide-${index}.webp`} alt={label} />,
}));

async function setup(reduced = false) {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, IS_REACT_ACT_ENVIRONMENT: true });
  const media = new dom.window.EventTarget() as InstanceType<typeof dom.window.EventTarget> & { matches: boolean };
  media.matches = reduced;
  Object.defineProperty(dom.window, 'matchMedia', { value: () => media });
  const container = document.getElementById('root')!;
  const root = createRoot(container);
  await act(async () => root.render(<HeroSlider slides={slides} />));
  const click = async (label: string) => {
    const button = [...container.querySelectorAll('button')].find(el => el.getAttribute('aria-label') === label || el.textContent === label);
    assert.ok(button, `Button missing: ${label}`);
    await act(async () => button.click());
  };
  return { dom, container, media, click, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const image = (container: HTMLElement) => container.querySelector('img')?.alt;

test('carousel stays manual over time and has no rotation control', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval', 'setTimeout'] });
  const app = await setup();
  try {
    await act(async () => t.mock.timers.tick(60000));
    assert.equal(image(app.container), 'Кухни');
    assert.equal(app.container.querySelectorAll('img').length, 1);
    assert.equal(app.container.querySelector('[data-rotation-control]'), null);
    assert.doesNotMatch(app.container.textContent!, /автопоказ/i);
  } finally { await app.cleanup(); }
});

test('arrows wrap, indicators select, and keyboard navigation works', async () => {
  const app = await setup();
  try {
    await app.click('Предыдущий слайд');
    assert.equal(image(app.container), 'Гардеробные');
    await app.click('Следующий слайд');
    assert.equal(image(app.container), 'Кухни');
    await app.click('Показать слайд 2: Шкафы');
    assert.equal(image(app.container), 'Шкафы');
    assert.equal(app.container.querySelector('[aria-current="true"]')?.getAttribute('aria-label'), 'Показать слайд 2: Шкафы');
    const next = app.container.querySelector('[aria-label="Следующий слайд"]')!;
    await act(async () => next.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', {key:'ArrowRight',bubbles:true})));
    assert.equal(image(app.container), 'Гардеробные');
    await act(async () => next.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', {key:'ArrowLeft',bubbles:true})));
    assert.equal(image(app.container), 'Шкафы');
  } finally { await app.cleanup(); }
});

test('horizontal swipes navigate but vertical and cancelled gestures do not', async () => {
  const app = await setup(true);
  try {
    const photo = app.container.querySelector('#hero-slide')!;
    async function touch(type: string, x: number, y: number) {
      const event = new app.dom.window.Event(type, {bubbles:true});
      Object.defineProperties(event, {touches:{value:[{clientX:x,clientY:y}]},changedTouches:{value:[{clientX:x,clientY:y}]}});
      await act(async () => photo.dispatchEvent(event));
    }
    await touch('touchstart',200,100); await touch('touchend',110,105);
    assert.equal(image(app.container), 'Шкафы');
    await touch('touchstart',200,100); await touch('touchend',190,240);
    assert.equal(image(app.container), 'Шкафы');
    await touch('touchstart',200,100); await touch('touchcancel',110,105); await touch('touchend',110,105);
    assert.equal(image(app.container), 'Шкафы');
    await touch('touchstart',100,100); await touch('touchend',200,105);
    assert.equal(image(app.container), 'Кухни');
  } finally { await app.cleanup(); }
});
