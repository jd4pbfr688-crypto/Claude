// Exporte le diaporama : une image par étape, un PDF vectoriel (une page par étape),
// et un parcours de tous les clics dans le vrai mode animé (erreurs de console, ordre des étapes).
// Usage : node export.js <deck.html> <dossier de sortie> <anime.umd.min.js> <dossier des polices> [still|clicks|all]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [deck, outDir, animePath, fontsDir, mode = 'all'] = process.argv.slice(2);
fs.mkdirSync(path.join(outDir, 'etapes'), { recursive: true });

async function route(page) {
  await page.route(/cdn\.jsdelivr\.net\/npm\/animejs/, r => r.fulfill({ path: animePath, contentType: 'application/javascript' }));
  await page.route(/fonts\.googleapis\.com/, r => {
    let css = fs.readFileSync(path.join(fontsDir, 'inter.css'), 'utf8');
    css = css.replace(/https:\/\/fonts\.gstatic\.com\/([^)]+)/g, (_, p) => 'https://fonts.gstatic.com/' + p);
    return r.fulfill({ body: css, contentType: 'text/css', headers: { 'access-control-allow-origin': '*' } });
  });
  await page.route(/fonts\.gstatic\.com/, r => {
    const p = new URL(r.request().url()).pathname.slice(1).replace(/\//g, '_');
    return r.fulfill({ path: path.join(fontsDir, p), contentType: 'font/woff2', headers: { 'access-control-allow-origin': '*' } });
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const url = (q = '') => 'file://' + path.resolve(deck) + q;

async function still(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  await route(page);
  await page.goto(url('?still=1'));
  await page.waitForFunction(() => window.Deckadence && document.fonts.status === 'loaded');
  await page.addStyleTag({ content: '#hud, #edbtn, #fsbtn, #swipehint, #railtip { display: none !important; }' });
  const n = await page.evaluate(() => Deckadence.stations.length);
  const list = [], svgs = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => Deckadence.goto(i), i);
    await page.waitForFunction(i => Deckadence.current() === i && !Deckadence.isBusy() && Deckadence.stations[i].el.querySelector('svg.stage').childElementCount > 0, i);
    await sleep(150);
    const { key, steps } = await page.evaluate(() => ({ key: Deckadence.stations[Deckadence.current()].key, steps: Deckadence.steps() }));
    for (let k = 0; k < steps.length; k++) {
      await page.evaluate(k => Deckadence.setStep(k), k);
      await sleep(120);
      const name = `${String(i + 1).padStart(2, '0')}-${key}-${String(k + 1).padStart(2, '0')}-${steps[k]}`;
      await page.screenshot({ path: path.join(outDir, 'etapes', name + '.png') });
      svgs.push(await page.evaluate(() => Deckadence.stations[Deckadence.current()].el.querySelector('svg.stage').outerHTML));
      list.push(name);
    }
  }
  fs.writeFileSync(path.join(outDir, 'etapes.json'), JSON.stringify(list, null, 1));
  // vector PDF: the same SVGs, one per page, with the deck's own styles and fonts
  const css = await page.evaluate(() => [...document.querySelectorAll('style')].map(s => s.textContent).join('\n'));
  const html = `<!doctype html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
    <style>${css}
    html, body { height: auto !important; overflow: visible !important; }
    @page { size: 1920px 1080px; margin: 0; }
    .pg { width: 1920px; height: 1080px; position: relative; overflow: hidden; page-break-after: always; break-after: page; background: #fff; }
    .pg:last-child { page-break-after: auto; break-after: auto; }
    </style></head><body>${svgs.map(s => `<div class="pg">${s}</div>`).join('')}</body></html>`;
  const printFile = path.join(outDir, 'print.html');
  fs.writeFileSync(printFile, html);
  const pp = await browser.newPage();
  await route(pp);
  await pp.goto('file://' + path.resolve(printFile));
  await pp.waitForFunction(() => document.fonts.status === 'loaded');
  await sleep(300);
  await pp.pdf({ path: path.join(outDir, 'statistiques-probabilistes-2.pdf'), width: '1920px', height: '1080px', printBackground: true });
  console.log(`still: ${list.length} étapes, ${n} diapos`);
  if (errors.length) console.log('ERREURS (still):\n' + [...new Set(errors)].join('\n'));
  await page.close(); await pp.close();
  return list;
}

async function clicks(browser) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  await route(page);
  await page.goto(url());
  await page.waitForFunction(() => window.Deckadence && document.fonts.status === 'loaded');
  await sleep(2500);
  const seen = [];
  const where = () => page.evaluate(() => { const s = Deckadence.stations[Deckadence.current()]; const st = Deckadence.steps(); return s.key + ':' + (st.length ? st[s.el._at || 0] : '-'); });
  seen.push(await where());
  for (let guard = 0; guard < 400; guard++) {
    await page.keyboard.press('ArrowRight');
    await sleep(350);
    await page.waitForFunction(() => !Deckadence.isBusy(), null, { timeout: 15000 });
    const w = await where();
    if (w === seen[seen.length - 1]) break;   // the end
    seen.push(w);
    await sleep(w.endsWith(':-') ? 600 : 5200);   // let the step play to its end
  }
  // and back: one press of ← per step, all the way to the start
  let back = 0;
  for (let guard = 0; guard < 400; guard++) {
    const before = await where();
    await page.keyboard.press('ArrowLeft');
    await sleep(250);
    await page.waitForFunction(() => !Deckadence.isBusy(), null, { timeout: 15000 });
    await sleep(150);
    const w = await where();
    if (w === before) break;
    back++;
  }
  await page.keyboard.press('o'); await sleep(1800);
  await page.screenshot({ path: path.join(outDir, 'vue-ensemble.png') });
  console.log(`clics : ${seen.length} étapes parcourues en avant, ${back} retours`);
  fs.writeFileSync(path.join(outDir, 'parcours.json'), JSON.stringify(seen, null, 1));
  if (errors.length) console.log('ERREURS (clics):\n' + [...new Set(errors)].join('\n'));
  await page.close();
  return seen;
}

(async () => {
  const browser = await chromium.launch();
  let list = null, seen = null;
  if (mode === 'still' || mode === 'all') list = await still(browser);
  if (mode === 'clicks' || mode === 'all') seen = await clicks(browser);
  if (list && seen) {
    const a = list.map(s => s.split('-').slice(1, 2)[0] + ':' + s.split('-').slice(3).join('-'));
    const same = JSON.stringify(a) === JSON.stringify(seen);
    console.log(same ? 'ordre des clics = ordre des étapes ✓' : 'ÉCART entre clics et étapes :\n' + a.filter((x, i) => x !== seen[i]).slice(0, 5).join('\n'));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
