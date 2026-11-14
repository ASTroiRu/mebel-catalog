import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3018';
const canonicalOrigin = process.env.SITE_URL?.replace(/\/$/,'') || 'http://127.0.0.1:3017';
test('all thirty discoverable pages have consistent canonical, OG and safe structured data', async () => {
  const pending = ['/'], visited = new Set(), titles = new Set(), descriptions = new Set();
  while (pending.length) {
    const path = pending.shift(); if (visited.has(path)) continue; visited.add(path);
    const response = await fetch(origin + path); assert.equal(response.status,200,path);
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
    const dom = new JSDOM(await response.text()); const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('h1').length,1,path);
    assert.ok(!titles.has(doc.title),path); titles.add(doc.title);
    const description = doc.querySelector('meta[name="description"]').content;
    assert.ok(description && !descriptions.has(description),path); descriptions.add(description);
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href,canonicalOrigin+path,path);
    assert.equal(doc.querySelector('meta[property="og:url"]')?.content,canonicalOrigin+path,path);
    assert.equal(doc.querySelector('meta[property="og:title"]')?.content,doc.title,path);
    assert.equal(doc.querySelector('meta[property="og:description"]')?.content,description,path);
    assert.match(doc.querySelector('meta[property="og:image"]')?.content || '',/^https?:\/\//);
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent));
    const page = schemas.find(schema => ['WebPage','CollectionPage','AboutPage','ContactPage'].includes(schema['@type']));
    assert.equal(page?.url,canonicalOrigin+path,path);
    if (path !== '/') {
      const crumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
      assert.ok(crumbs?.itemListElement.length >= 2,path);
      assert.equal(crumbs.itemListElement.at(-1).item,canonicalOrigin+path);
    }
    assert.doesNotMatch(JSON.stringify(schemas),/"(?:offers|aggregateRating|review|availability)"/);
    for (const a of doc.querySelectorAll('a[href]')) { const href=a.getAttribute('href'); if (href.startsWith('/') && !href.startsWith('//') && !href.includes('#') && !visited.has(href)) pending.push(href); }
    dom.window.close();
  }
  assert.equal(visited.size,30);
});
test('demo sitemap is empty and robots never advertises it', async () => {
  const response = await fetch(origin+'/sitemap.xml'); assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/xml/);
  const xml = await response.text(); assert.match(xml,/<urlset/); assert.doesNotMatch(xml,/<loc>/);
  const robots = await (await fetch(origin+'/robots.txt')).text(); assert.match(robots,/Disallow: \/\s/); assert.doesNotMatch(robots,/Sitemap:/);
});
test('optimized image endpoint negotiates AVIF and WebP with caching', async () => {
  for (const format of ['image/avif','image/webp']) {
    const response=await fetch(origin+'/_next/image?url=%2Fimages%2Fhome%2Fkitchen.webp&w=640&q=75',{headers:{Accept:format}});
    assert.equal(response.status,200); assert.equal(response.headers.get('content-type'),format);
    assert.match(response.headers.get('cache-control'),/max-age=/);
    assert.ok((await response.arrayBuffer()).byteLength>0);
  }
});
