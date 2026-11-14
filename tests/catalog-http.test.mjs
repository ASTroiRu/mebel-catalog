import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3018';
const groups = {
  kuhni: ['linia','balans','atmosfera'],
  shkafy: ['vertikal','garmoniya','elegant'],
  'shkafy-kupe': ['prostranstvo','kontur','panorama'],
  garderobnye: ['poryadok','komfort','privat'],
};

test('all seventeen catalog URLs work with unique metadata, expected prices and valid internal links', async () => {
  const paths = ['/catalog/', ...Object.entries(groups).flatMap(([category, products]) => [`/catalog/${category}/`, ...products.map(product => `/catalog/${category}/${product}/`)])];
  const titles = new Set();
  const descriptions = new Set();
  const links = new Set();
  for (const path of paths) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
    const dom = new JSDOM(await response.text());
    const doc = dom.window.document;
    const main = doc.querySelector('main');
    assert.equal(main.querySelectorAll('h1').length, 1, path);
    assert.match(doc.querySelector('meta[name="robots"]').content, /noindex/);
    assert.ok(doc.title && !titles.has(doc.title), `Duplicate title: ${path}`);
    titles.add(doc.title);
    const description = doc.querySelector('meta[name="description"]').content;
    assert.ok(description && !descriptions.has(description), `Duplicate description: ${path}`);
    descriptions.add(description);
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 3) {
      assert.doesNotMatch(main.textContent, /₽/);
      if (parts.length === 2) assert.equal(main.querySelectorAll('.home-card').length, 3);
    } else {
      assert.equal(main.querySelectorAll('.demo-price').length, 4);
      assert.match(main.textContent, /Демонстрационная модель/);
      assert.match(main.textContent, /Не является публичной офертой/);
      const related = [...main.querySelectorAll('[aria-labelledby="related-title"] a')].map(a => a.getAttribute('href'));
      assert.equal(related.length, 3);
      assert.ok(!related.includes(path));
      assert.equal(new Set(related.map(href => href.split('/')[2])).size, 3);
      assert.ok(related.every(href => href.split('/')[2] !== parts[1]));
      assert.equal(main.querySelectorAll('.gallery-thumbnails button').length, 2);
      assert.match(main.textContent, /Индивидуальные/);
    }
    for (const a of doc.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) assert.ok(doc.getElementById(href.slice(1)));
      else links.add(href);
    }
    assert.equal(main.querySelectorAll('form').length, 0);
    dom.window.close();
  }
  assert.equal(titles.size, 17);
  for (const href of links) assert.equal((await fetch(new URL(href, origin))).status, 200, href);
});

test('unknown categories, models and cross-category model URLs return 404', async () => {
  for (const path of ['/catalog/unknown/', '/catalog/kuhni/unknown/', '/catalog/shkafy/linia/', '/catalog/unknown/linia/']) {
    assert.equal((await fetch(origin + path)).status, 404, path);
  }
});
