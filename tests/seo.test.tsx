import test from 'node:test';
import assert from 'node:assert/strict';
import { getContentPaths } from '../src/lib/content-paths';
import { parseSiteOrigin, indexingPolicy, serializeJsonLd, buildMetadata } from '../src/lib/seo';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
test('manifest includes exactly thirty unique content routes and demo publishes none', async () => {
  const paths = await getContentPaths();
  assert.equal(paths.length,30); assert.equal(new Set(paths).size,30);
  assert.ok(paths.every(path => path.startsWith('/') && path.endsWith('/')));
  assert.deepEqual(await sitemap(),[]);
  assert.equal(robots().sitemap,undefined);
  assert.deepEqual(robots().rules,{userAgent:'*',disallow:'/'});
});
test('origin validation and indexing policy fail closed for public configuration', () => {
  assert.equal(parseSiteOrigin(undefined),'http://127.0.0.1:3017');
  assert.equal(parseSiteOrigin('https://example.com/'),'https://example.com');
  for (const value of ['ftp://example.com','https://u:p@example.com','https://example.com/path','https://example.com/?x=1']) assert.throws(() => parseSiteOrigin(value));
  assert.equal(indexingPolicy(true,'http://127.0.0.1:3017').index,false);
  assert.throws(() => indexingPolicy(false,'http://127.0.0.1:3017'));
  assert.equal(indexingPolicy(false,'https://example.com').index,true);
});
test('metadata uses absolute canonical and JSON-LD cannot escape script elements', () => {
  const meta = buildMetadata('/catalog/',{title:'Каталог',description:'Описание'});
  assert.equal(meta.alternates?.canonical,'http://127.0.0.1:3017/catalog/');
  const hostile = {name:'</script><script>alert(1)</script>'};
  const json = serializeJsonLd(hostile);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json),hostile);
});
