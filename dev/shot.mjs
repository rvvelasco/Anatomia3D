import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, out, ...views] = process.argv;
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:900,height:1000} });
p.on('console', m => { if (m.type()==='error') console.log('console:', m.text()); });
p.on('pageerror', e => console.log('pageerror:', e.message));
let i=0;
for (const v of views) {
  await p.goto('http://localhost:8123/dev/preview.html?'+v);
  await p.waitForFunction('window.done', null, {timeout:60000}).catch(e=>console.log('timeout',v));
  const errs = await p.evaluate('window.errs'); if (errs?.length) console.log(errs.join('\n'));
  await p.screenshot({ path: `${out}_${i++}.png` });
}
await b.close();
