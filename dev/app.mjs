import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, out, w='1440', h='900', script=''] = process.argv;
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:+w,height:+h} });
p.on('console', m => { if (['error','warning'].includes(m.type())) console.log('console:', m.text()); });
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto('http://localhost:8123/index.html' + (process.env.HASH||''));
await p.waitForSelector('#loading.done', {timeout:90000, state:'attached'});
await p.waitForTimeout(1500);
if (script) { await p.evaluate(script).catch(e=>console.log('evalerr',e.message)); await p.waitForTimeout(1500); }
await p.screenshot({ path: out });
await b.close();
