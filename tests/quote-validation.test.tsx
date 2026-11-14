import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuote, validateFile, emptyQuote } from '../src/lib/quote-validation';
const ids = ['kitchen', 'wardrobe'];
const valid = { ...emptyQuote, categoryId:'kitchen', name:'Анна', phone:'+7 (999) 123-45-67', consent:true };
test('requires category, name, Russian-format phone and consent', () => {
  assert.deepEqual(Object.keys(validateQuote(emptyQuote, null, ids)).sort(), ['categoryId','consent','name','phone']);
  assert.deepEqual(validateQuote(valid, null, ids), {});
  for (const phone of ['89991234567','8 (999) 123-45-67','+79991234567','+7 (999) 123-45-67']) assert.deepEqual(validateQuote({...valid,phone},null,ids), {}, phone);
  for (const phone of ['79991234567','8999123456','899912345678','8abc9991234567','+89991234567','+19991234567','+7999123456','+799912345678','+7abc9991234567']) assert.ok(validateQuote({...valid,phone},null,ids).phone,phone);
  assert.ok(validateQuote({...valid,categoryId:'unknown'},null,ids).categoryId);
  assert.ok(validateQuote({...valid,name:'   '},null,ids).name);
});
test('dimensions are optional, independent and positive finite decimal values', () => {
  for (const width of ['', ' ', '120', '12,5', '.5']) assert.deepEqual(validateQuote({...valid,width},null,ids), {});
  for (const width of ['0','-1','Infinity','NaN','abc','1e999','12cm']) assert.ok(validateQuote({...valid,width},null,ids).width,width);
  assert.deepEqual(validateQuote({...valid,height:'220',depth:''},null,ids), {});
});
test('file allows only supported formats up to exactly ten MiB', () => {
  const max = 10*1024*1024;
  assert.equal(validateFile(null), undefined);
  for (const [name,type] of [['x.jpg','image/jpeg'],['x.JPEG','image/jpeg'],['x.png','image/png'],['x.pdf','application/pdf']]) {
    assert.equal(validateFile({name,type,size:max}), undefined);
    assert.ok(validateFile({name,type,size:max+1}));
  }
  assert.ok(validateFile({name:'file.exe',type:'application/pdf',size:10}));
  assert.ok(validateFile({name:'file.jpg',type:'text/html',size:10}));
});

test('context uses current route, explicit card context and measurement intent', async () => {
  const {resolveQuoteContext} = await import('../src/lib/quote-context');
  const categories = [{id:'k',slug:'kuhni',title:'Кухни'},{id:'s',slug:'shkafy',title:'Шкафы'}];
  const products = [{categoryId:'k',slug:'linia',title:'Линия'}];
  assert.deepEqual(resolveQuoteContext('/catalog/kuhni/linia/',{},categories,products),{intent:'quote',categoryId:'k',modelName:'Линия'});
  assert.deepEqual(resolveQuoteContext('/catalog/kuhni/',{},categories,products),{intent:'quote',categoryId:'k',modelName:undefined});
  assert.deepEqual(resolveQuoteContext('/catalog/kuhni/linia/',{categoryId:'s',modelName:'Вертикаль'},categories,products),{intent:'quote',categoryId:'s',modelName:'Вертикаль'});
  assert.equal(resolveQuoteContext('/zamer/',{},categories,products).intent,'measurement');
  assert.equal(resolveQuoteContext('/',{intent:'measurement'},categories,products).intent,'measurement');
  assert.equal(resolveQuoteContext('/catalog/shkafy/linia/',{},categories,products).modelName,undefined);
});
