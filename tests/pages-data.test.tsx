import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../src/content/repository';
test('four concepts have unique routes, valid categories, galleries and honest labels', async () => {
  const concepts = await content.getConcepts();
  const categories = await content.getCategories();
  assert.equal(concepts.length, 4);
  assert.equal(new Set(concepts.map(c => c.slug)).size, 4);
  assert.equal(new Set(concepts.map(c => c.categoryId)).size, 4);
  for (const c of concepts) {
    assert.ok(categories.some(category => category.id === c.categoryId));
    assert.ok(c.images.length >= 2 && c.images.every(i => i.alt && i.caption));
    assert.ok(c.materials.length && c.colors.length);
    assert.equal((await content.getConcept(c.slug))?.id, c.id);
  }
  assert.equal(await content.getConcept('missing'), undefined);
});
test('seven information pages expose unique metadata and reject unknown slugs', async () => {
  const pages = await content.getInformationPages();
  assert.deepEqual(pages.map(p => p.slug).sort(), ['about','contacts','faq','materials','privacy','process','zamer']);
  assert.equal(new Set(pages.map(p => p.seo.title)).size, 7);
  for (const p of pages) assert.equal((await content.getInformationPage(p.slug))?.id, p.id);
  assert.equal(await content.getInformationPage('missing'), undefined);
});
test('contact fields come from repository so a CMS can replace demo data', async () => {
  const page = await content.getInformationPage('contacts');
  assert.equal(page?.contactFields?.length, 6);
  assert.equal(page?.contactFields?.find(field => field.label === 'Регион работы')?.value, 'Москва и Московская область');
  assert.ok(page?.contactFields?.filter(field => field.label !== 'Регион работы').every(field => field.value.startsWith('Демо')));
});
