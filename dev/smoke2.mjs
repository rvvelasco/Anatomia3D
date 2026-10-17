import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const SP = process.argv[2];
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.addInitScript(() => { window.print = () => { window.__printed = (window.__printed||0)+1; }; });
await p.goto('http://localhost:8123/index.html');
await p.waitForSelector('#loading.done', {timeout:90000, state:'attached'});
const q = (s) => p.evaluate((s) => document.querySelector(s)?.click(), s);
await q('[data-act=welcomeExplore]');
// favoritos
for (const id of ['biceps_braquial','deltoides','femur','tibial_anterior','masetero']) { await p.evaluate((id)=>{location.hash=id}, id); await p.waitForTimeout(150); await q('[data-act=fav]'); }
await q('#typeFilter [data-type=fav]');
console.log('favoritos en lista:', await p.evaluate(() => document.querySelectorAll('#list .item').length));
// azar
await q('#btnRandom'); await p.waitForTimeout(300);
console.log('azar ->', await p.evaluate(() => document.querySelector('.title')?.textContent));
// imprimir
await q('[data-act=print]'); await p.waitForTimeout(300);
console.log('impreso:', await p.evaluate(() => window.__printed));
// examen con favoritos
await q('#btnStudy'); await q('[data-act=studyScope][data-v=fav]'); await q('[data-act=studyMode][data-v=exam]');
for (let k=0;k<12;k++){ await q('[data-act=studyOpt]'); await q('[data-act=studyNext]'); }
console.log('examen:', await p.evaluate(() => document.querySelector('.flash h3')?.textContent));
await p.screenshot({path: SP+'/n_exam.png'});
await q('#sheetClose');
// corte
await q('.tool[data-tool=layers]'); await q('#cutSeg [data-c=sagital]');
await p.evaluate(() => { const r=document.querySelector('#cutPos'); r.value=0.5; r.dispatchEvent(new Event('input')); });
await q('.tool[data-tool=layers]');
await p.waitForTimeout(500); await p.screenshot({path: SP+'/n_cut1.png'});
await q('.tool[data-tool=layers]'); await q('#cutSeg [data-c=transversal]'); await p.evaluate(() => { const r=document.querySelector('#cutPos'); r.value=0.62; r.dispatchEvent(new Event('input')); });
await q('[data-view=top]');
await p.waitForTimeout(1200); await p.screenshot({path: SP+'/n_cut2.png'});
// clic con corte: no debe seleccionar lo cortado
// tema
await q('.tool[data-tool=reset]'); await q('#btnTheme'); await p.evaluate(()=>{location.hash='gastrocnemio:d'}); await p.waitForTimeout(1200);
await p.screenshot({path: SP+'/n_light.png'});
await p.emulateMedia({ media: 'print' }); await p.evaluate(() => { document.querySelector('[data-act=print]').click(); });
await p.waitForTimeout(300); await p.screenshot({path: SP+'/n_print.png', fullPage: true});
console.log('errores:', errs);
await b.close();
