import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto('http://localhost:8123/dev/check.html');
await p.waitForFunction('window.result', null, {timeout:60000});
console.log(await p.evaluate('window.result')); await b.close();
