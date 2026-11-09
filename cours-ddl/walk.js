// Parcourt TOUS les clics en mode animé (→), comme en cours, et relève les erreurs de la console.
// Prend une image au milieu de chaque animation et une à la fin.
// Usage : node walk.js <page.html> <dossier-sortie> [anime local]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [page_, outDir, animeLocal] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (['error', 'warning', 'assert'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  if (animeLocal) await page.route('**/animejs@4.4.1/**', r => r.fulfill({ path: animeLocal, contentType: 'application/javascript' }));
  await page.goto('file://' + path.resolve(page_));
  await page.waitForFunction(() => window.Deckadence && document.body.classList.contains('deck-ready'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  const total = await page.evaluate(() => Deckadence.stations.reduce((a, s) => a + 1, 0));
  let clicks = 0, guard = 0;
  const where = () => page.evaluate(() => { const s = Deckadence.stations[Deckadence.current()]; return s.key + '_' + ((Deckadence.steps()[s.el._at || 0]) || ''); });
  let last = await where();
  await page.screenshot({ path: path.join(outDir, `${String(clicks).padStart(2, '0')}_${last}_end.png`) });
  while (guard++ < 60) {
    await page.keyboard.press('ArrowRight'); clicks++;
    await page.waitForTimeout(1300);
    const w = await where();
    if (w === last) { clicks--; break; }   // fin du diaporama
    await page.screenshot({ path: path.join(outDir, `${String(clicks).padStart(2, '0')}_${w}_mid.png`) });
    await page.waitForTimeout(4600);
    await page.screenshot({ path: path.join(outDir, `${String(clicks).padStart(2, '0')}_${w}_end.png`) });
    last = w;
  }
  // retour arrière : ← depuis le début de la station REGLE doit atterrir sur la dernière étape de COURBE
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(400); }
  await page.waitForTimeout(1800);
  const back = await where();
  console.log('clics :', clicks, '· arrivée :', last, '· après 3 × ← :', back);
  console.log(errors.length ? errors.join('\n') : 'console : aucune erreur');
  await browser.close();
})();
