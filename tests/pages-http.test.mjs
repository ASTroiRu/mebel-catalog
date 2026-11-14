import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3018';
const concepts = ['teplyy-minimalizm','spokoynyy-ritm','chistaya-geometriya','lichnoe-prostranstvo'];
const paths = ['/projects/', ...concepts.map(s => `/projects/${s}/`), ...['zamer','process','materials','about','faq','contacts','privacy'].map(s => `/${s}/`)];
test('twelve stage E routes have metadata, one H1, noindex and working links', async () => {
  const titles = new Set(), descriptions = new Set(), links = new Set();
  for (const path of paths) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
    const doc = new JSDOM(await response.text()).window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, path);
    assert.ok(!titles.has(doc.title)); titles.add(doc.title);
    const description = doc.querySelector('meta[name="description"]').content;
    assert.ok(description && !descriptions.has(description)); descriptions.add(description);
    assert.match(doc.querySelector('meta[name="robots"]').content, /noindex/);
    assert.doesNotMatch(doc.querySelector('main').textContent, /₽/);
    for (const a of doc.querySelectorAll('a[href]')) if (a.getAttribute('href').startsWith('/')) links.add(a.getAttribute('href'));
    if (path.startsWith('/projects/') && path !== '/projects/') {
      assert.match(doc.querySelector('main').textContent, /Концепт/);
      assert.ok(doc.querySelectorAll('.gallery-thumbnails button').length >= 2);
      assert.ok(doc.querySelector('main a[href^="/catalog/"]'));
      assert.ok(doc.querySelector('main [data-quote-category]'));
    }
  }
  for (const href of links) assert.equal((await fetch(origin + href)).status, 200, href);
  assert.equal((await fetch(origin + '/projects/missing/')).status, 404);
  assert.equal((await fetch(origin + '/missing-info/')).status, 404);
});
test('information content exposes seven steps, five FAQ groups, demo contacts and draft policy', async () => {
  const get = async path => new JSDOM(await (await fetch(origin + path)).text()).window.document;
  const process = await get('/process/'); assert.equal(process.querySelectorAll('main .process-grid li').length, 7);
  const faq = await get('/faq/'); assert.equal(faq.querySelectorAll('main .faq-group').length, 5); assert.ok(faq.querySelectorAll('main details > summary').length >= 5);
  const contacts = await get('/contacts/'); assert.equal(contacts.querySelectorAll('main dl > div').length, 6); assert.equal(contacts.querySelectorAll('main a[href^="tel:"], main a[href^="mailto:"], iframe').length, 0);
  assert.match((await get('/privacy/')).querySelector('main').textContent, /Проект документа/);
  const zamer = await get('/zamer/'); assert.equal(zamer.querySelector('main [data-quote-intent="measurement"]').textContent.trim(), 'Записаться на замер');
  assert.equal((await get('/materials/')).querySelectorAll('main .material-card').length, 4);
});
