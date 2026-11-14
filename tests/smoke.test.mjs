import test from 'node:test';
import assert from 'node:assert/strict';

const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3018';

test('home is available, Russian, and excluded from indexing', async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ru"/);
  assert.match(html, /<meta name="robots" content="[^"]*noindex/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.doesNotMatch(html, /<form(?:\s|>)/);
});

test('unknown route returns an actual 404 and remains noindex', async () => {
  const response = await fetch(`${origin}/this-page-does-not-exist/`);
  assert.equal(response.status, 404);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  const html = await response.text();
  assert.match(html, /Страница не найдена/);
  assert.match(html, /href="\/"/);
});

test('every enabled navigation link resolves or has a valid in-page target', async () => {
  const html = await (await fetch(origin)).text();
  const targets = [...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]))];
  assert.ok(targets.length > 0);
  for (const href of targets) {
    if (href.startsWith('#')) {
      assert.ok(html.includes(`id="${href.slice(1)}"`), `Missing anchor: ${href}`);
    } else {
      const target = new URL(href, origin);
      assert.equal(target.origin, origin, 'Stage A must not link to external services');
      assert.equal((await fetch(target)).status, 200, `Broken link: ${href}`);
    }
  }
});

test('stage B has all sections in order, three slide selectors and six accessible FAQ items', async () => {
  const { JSDOM } = await import('jsdom');
  const html = await (await fetch(origin)).text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const sections = [...doc.querySelectorAll('main > section')];
  assert.deepEqual(sections.map(section => section.getAttribute('aria-labelledby')), [
    'home-title', 'categories-title', 'benefits-title', 'solutions-title', 'process-title', 'concepts-title', 'materials-title', 'faq-title', 'cta-title',
  ]);
  assert.equal(doc.querySelectorAll('.slide-dots button').length, 3);
  assert.equal(doc.querySelectorAll('.hero-carousel img').length, 1);
  assert.equal(doc.querySelectorAll('.faq-item > summary').length, 6);
  assert.equal(doc.querySelectorAll('.process-grid > li').length, 7);
  assert.equal(doc.querySelectorAll('main h1').length, 1);
  assert.equal(doc.querySelectorAll('main form').length, 0);
  assert.doesNotMatch(doc.querySelector('main').textContent, /₽|руб\.|от\s+\d[\d\s]*руб/);
  assert.ok(doc.querySelector('link[rel="preload"][as="image"]'), 'First hero image should be preloaded');
  for (const img of doc.querySelectorAll('main img')) {
    assert.ok(img.alt.length > 0, 'Every content image needs alt text');
    assert.ok(img.getAttribute('sizes') || img.src.endsWith('.svg'), 'Raster images need responsive sizes');
  }
  dom.window.close();
});

test('local hero images and SVG placeholder are available', async () => {
  for (const path of ['/images/home/kitchen.webp', '/images/home/wardrobe.webp', '/images/home/dressing.webp', '/images/home/coupe.svg']) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type') || '', /^image\//);
    assert.ok((await response.arrayBuffer()).byteLength > 100);
  }
});

test('quote and measurement controls are enabled while form stays client-only', async () => {
  const { JSDOM } = await import('jsdom');
  for (const path of ['/', '/catalog/kuhni/', '/catalog/kuhni/linia/']) {
    const dom = new JSDOM(await (await fetch(origin + path)).text());
    const doc = dom.window.document;
    const buttons = [...doc.querySelectorAll('[data-quote-intent]')];
    assert.ok(buttons.length > 0);
    assert.ok(buttons.every(button => !button.disabled && button.getAttribute('aria-haspopup') === 'dialog'));
    assert.equal(doc.querySelector('form'), null, 'Form mounts only after opening on client');
    if (path === '/') assert.ok(doc.querySelector('[data-quote-intent="measurement"]'));
    if (path === '/catalog/kuhni/') assert.ok(doc.querySelector('[data-quote-category="category-kitchen"]'));
    if (path.endsWith('/linia/')) assert.ok(doc.querySelector('[data-quote-model="Линия"]'));
    dom.window.close();
  }
});
