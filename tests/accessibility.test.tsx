import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
function luminance(hex: string) {
  return hex.slice(1).match(/../g)!.map(value => parseInt(value,16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4).reduce((sum,value,index) => sum + value * [.2126,.7152,.0722][index],0);
}
test('normal text palette maintains 4.5:1 on both page and tinted surfaces', () => {
  const css=readFileSync('src/app/globals.css','utf8');
  const color=(name:string)=>css.match(new RegExp('--color-'+name+': (#[0-9a-f]{6})'))![1];
  for (const fg of ['ink','muted']) for (const bg of ['background','surface']) {
    const values=[luminance(color(fg)),luminance(color(bg))].sort((a,b)=>a-b);
    assert.ok((values[1]+.05)/(values[0]+.05)>=4.5,fg+' on '+bg);
  }
});
