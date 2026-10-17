import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, w='1440', h='900'] = process.argv;
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:+w,height:+h} });
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto('http://localhost:8123/index.html');
await p.waitForSelector('#loading.done', {timeout:90000, state:'attached'});
const r = await p.evaluate(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const q = (s) => document.querySelector(s);
  const out = { items:0, empty:[] };
  q('[data-act=welcomeExplore]')?.click();
  const items = [...document.querySelectorAll('#list .item')];
  for (const it of items) {
    it.click(); out.items++;
    for (const t of ['resumen','detalle','conexiones','clinica','notas']) {
      q(`.ptabs [data-tab=${t}]`).click();
      if (!q('.pane').textContent.trim() && t!=='notas') out.empty.push(it.dataset.id+':'+t);
    }
  }
  for (const l of document.querySelectorAll('#lessonList [data-lesson]')) { l.click(); for (let k=0;k<8;k++) q('[data-lstep].primary, button.primary[data-lstep]')?.click(); }
  for (const n of document.querySelectorAll('#nerveList [data-nerve]')) n.click();
  q('#btnStudy').click();
  for (const m of ['id','test','cards','loc']) {
    q(`[data-act=studyMode][data-v=${m}]`).click();
    for (let k=0;k<25;k++) {
      if (m==='id'||m==='test') { q('[data-act=studyOpt]')?.click(); q('[data-act=studyNext]')?.click(); }
      if (m==='cards') { q('[data-act=studyReveal]')?.click(); q('[data-act=studyKnew]')?.click(); }
      if (m==='loc') q('[data-act=studyNext]')?.click();
    }
  }
  q('#search').value='nervio radial'; q('#search').dispatchEvent(new Event('input'));
  out.search = document.querySelectorAll('#searchResults button').length;
  return out;
});
console.log(JSON.stringify(r), '\nerrors:', errs.slice(0,10));
await b.close();
