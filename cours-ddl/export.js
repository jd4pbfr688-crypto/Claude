// Exporte une image 1920×1080 par étape (mode image fixe ?still=1), puis vérifie qu'aucune erreur
// n'apparaît dans la console. Usage : node export.js <page.html> <dossier-sortie> [anime.umd.min.js local]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [page_, outDir, animeLocal] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || m.type() === 'assert') errors.push(m.type() + ': ' + m.text()); });
  if (animeLocal) await page.route('**/animejs@4.4.1/**', r => r.fulfill({ path: animeLocal, contentType: 'application/javascript' }));
  await page.goto('file://' + path.resolve(page_) + '?still=1');
  await page.waitForFunction(() => window.Deckadence && document.body.classList.contains('deck-ready'));
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '#hud,#edbtn,#fsbtn,#swipehint,#railtip{display:none!important}' });
  const n = await page.evaluate(() => Deckadence.stations.length);
  const index = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => Deckadence.goto(i), i);
    await page.waitForFunction(i => Deckadence.current() === i && Deckadence.stations[i].mounted, i);
    await page.waitForTimeout(250);
    const steps = await page.evaluate(() => Deckadence.steps());
    const st = await page.evaluate(i => ({ key: Deckadence.stations[i].key, name: Deckadence.stations[i].name }), i);
    const items = [];
    for (let k = 0; k < steps.length; k++) {
      await page.evaluate(k => Deckadence.setStep(k), k);
      await page.waitForTimeout(120);
      const f = `${String(i + 1).padStart(2, '0')}_${st.key}_${String(k + 1).padStart(2, '0')}_${steps[k]}.png`;
      await page.screenshot({ path: path.join(outDir, f) });
      items.push({ f, step: steps[k] });
    }
    index.push({ key: st.key, name: st.name, items });
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index));
  console.log(index.reduce((a, g) => a + g.items.length, 0) + ' images');
  console.log(errors.length ? errors.join('\n') : 'console : aucune erreur');
  await browser.close();
})();
