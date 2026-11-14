import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../src/content/repository';

test('catalog has four unique categories and twelve valid products, three per category', async () => {
  const categories = await content.getCategories();
  const products = await content.getProducts();
  assert.equal(categories.length, 4);
  assert.equal(products.length, 12);
  assert.equal(new Set(products.map(p => p.id)).size, 12);
  assert.equal(new Set(products.map(p => p.slug)).size, 12);
  assert.equal(new Set(products.map(p => p.seo.title)).size, 12);
  for (const c of categories) {
    assert.equal((await content.getProducts(c.id)).length, 3);
    assert.equal((await content.getCategory(c.slug))?.id, c.id);
  }
  for (const p of products) {
    const c = categories.find(c => c.id === p.categoryId)!;
    assert.ok(c);
    assert.equal((await content.getProduct(c.slug, p.slug))?.id, p.id);
    assert.ok(p.images.length >= 2);
    assert.ok(p.images.every(image => image.alt && image.caption));
    assert.ok(p.demoPriceFrom > 0);
    assert.equal(p.dimensions, 'Индивидуальные');
    const related = await content.getRelatedProducts(p.id);
    assert.equal(related.length, 3);
    assert.equal(new Set(related.map(p => p.categoryId)).size, 3);
    assert.ok(related.every(other => other.id !== p.id && other.categoryId !== p.categoryId));
    assert.deepEqual(related.map(p => p.id), p.relatedIds);
  }
});

test('unknown and wrong-category model lookups return undefined', async () => {
  assert.equal(await content.getCategory('unknown'), undefined);
  assert.equal(await content.getProduct('kuhni', 'unknown'), undefined);
  assert.equal(await content.getProduct('shkafy', 'linia'), undefined);
  assert.equal(await content.getProduct('unknown', 'linia'), undefined);
  assert.deepEqual(await content.getRelatedProducts('unknown'), []);
});

test('model galleries start with their own schematic rather than a shared reference photo', async () => {
  for (const product of await content.getProducts()) {
    assert.equal(product.images[0].src, `/images/products/${product.slug}.svg`);
    assert.match(product.images[0].caption, /схема/i);
    assert.match(product.images[1].caption, /не.*модели/i);
  }
});
