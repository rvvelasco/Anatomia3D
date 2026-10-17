// Pruebas de UX con eventos reales de ratón, teclado y táctiles.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const SP = process.argv[2];
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const log = (...a) => console.log(...a);
const errs = [];
async function page(opts) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  const t0 = Date.now();
  await p.goto('http://localhost:8123/index.html');
  await p.waitForSelector('#loading.done', {timeout:90000, state:'attached'});
  log('carga (ms):', Date.now()-t0);
  return p;
}
const st = (p) => p.evaluate(() => ({ title: document.querySelector('.title')?.textContent, open: document.body.className, hash: location.hash, tip: document.querySelector('#tooltip')?.hidden === false ? document.querySelector('#tooltip').textContent : null }));

// ---------- Escritorio ----------
let p = await page({ viewport:{width:1440,height:900} });
await p.click('[data-act=welcomeExplore]'); await p.waitForTimeout(700);
const box = await p.locator('#canvas').boundingBox();
const cx = box.x + box.width/2, cy = box.y + box.height*0.36;
await p.mouse.move(cx, cy); await p.waitForTimeout(400);
log('hover:', (await st(p)).tip);
await p.mouse.click(cx, cy); await p.waitForTimeout(500);
log('click centro pecho:', await st(p));
await p.mouse.move(cx-100, cy); await p.mouse.down(); await p.mouse.move(cx+50, cy+20, {steps:8}); await p.mouse.up(); await p.waitForTimeout(300);
log('tras arrastrar (no debe cambiar):', (await st(p)).title);
await p.mouse.click(box.x+40, box.y+box.height-40); await p.waitForTimeout(300);
log('click vacío (cierra):', await st(p));
await p.keyboard.press('/'); await p.keyboard.type('glut'); await p.waitForTimeout(200);
await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
log('buscar glut + ↓ + Enter:', (await st(p)).title);
await p.click('.ptabs [data-tab=conexiones]'); await p.click('.pane [data-go]'); await p.waitForTimeout(400);
log('seguir enlace:', (await st(p)).title);
await p.goBack(); await p.waitForTimeout(500);
log('botón atrás del navegador:', await st(p), p.url());
await p.screenshot({ path: SP+'/ux_d1.png' });
await p.close();

// ---------- Tablet horizontal ----------
p = await page({ viewport:{width:1024,height:768} });
await p.click('[data-act=welcomeExplore]');
await p.evaluate(() => document.querySelector('#list .item[data-id=femur]').click()); await p.waitForTimeout(800);
const sw = await p.evaluate(() => document.querySelector('#stage').clientWidth);
log('tablet ancho visor con ficha abierta:', sw);
await p.screenshot({ path: SP+'/ux_t1.png' });
await p.close();

// ---------- Móvil (táctil) ----------
p = await page({ ...devices['iPhone 13'] });
const mb = await p.locator('#canvas').boundingBox();
await p.touchscreen.tap(mb.x+mb.width/2, mb.y+mb.height*0.32); await p.waitForTimeout(600);
log('móvil tap pecho:', await st(p));
const sheet = await p.evaluate(() => getComputedStyle(document.body).getPropertyValue('--peek'));
log('peek:', sheet);
await p.screenshot({ path: SP+'/ux_m1.png' });
await p.tap('#sheetGrip'); await p.waitForTimeout(500);
log('tap grip -> full:', (await st(p)).open);
await p.screenshot({ path: SP+'/ux_m2.png' });
await p.tap('#sheetClose'); await p.waitForTimeout(400);
log('cerrar:', (await st(p)).open);
await p.tap('#btnMenu'); await p.waitForTimeout(400);
await p.tap('#sideTabs [data-tab=lecciones]'); await p.tap('#lessonList [data-lesson=carpo]'); await p.waitForTimeout(800);
log('lección desde menú:', await st(p));
await p.screenshot({ path: SP+'/ux_m3.png' });
await p.close();

// ---------- Móvil horizontal ----------
p = await page({ viewport:{width:844,height:390}, isMobile:true, hasTouch:true });
await p.evaluate(() => { location.hash = 'biceps_braquial:d'; }); await p.waitForTimeout(900);
const vis = await p.evaluate(() => { const s=document.querySelector('#sheet').getBoundingClientRect(); return { sheetTop: s.top, h: innerHeight }; });
log('horizontal:', vis);
await p.screenshot({ path: SP+'/ux_l1.png' });
await p.close();
log('errores:', errs);
await b.close();
