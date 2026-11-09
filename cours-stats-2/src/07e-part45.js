
  /* ---------- tableaux : cells[r][c] = balisage (ou null) ; ligne 0 et colonne 0 = en-têtes ---------- */
  function grid(parent, x0, y0, cw, rh, cells, o = {}) {
    const g = S('g', {}, parent), W = cw.reduce((a, b) => a + b, 0), H = rh * cells.length;
    const xs = cw.reduce((a, w, i) => (a.push(a[i] + w), a), [x0]);
    S('rect', { x: x0, y: y0, width: W, height: rh, rx: 8, class: 'tbl-head' }, g);
    for (let r = 1; r <= cells.length; r++) S('line', { x1: x0, x2: x0 + W, y1: y0 + r * rh, y2: y0 + r * rh, class: 'tbl-line' }, g);
    const els = cells.map((row, r) => row.map((t, c) => {
      if (t == null) return null;
      const head = r === 0 || c === 0;
      const x = c === 0 ? xs[0] + 18 : (xs[c] + xs[c + 1]) / 2;
      return ftx(g, x, y0 + r * rh + rh / 2 + (o.size || 28) * 0.36, head ? '{b:' + t + '}' : t,
        Object.assign({ 'font-size': head ? (o.hsize || 26) : (o.size || 28) }, c === 0 ? {} : { 'text-anchor': 'middle' }, o.cls && !head ? { class: o.cls } : {}));
    }));
    return { g, els, xs, x0, y0, W, H, rh };
  }
  // two stacked charts (G1 above H) on the same axis, for the homogeneity slides
  const HG = (base, unit = 36, x0 = 150, x1 = 890) => ({ x0, x1, d0: 56, d1: 84, base, unit });
  function twoCharts(svg, o = {}) {
    const m = {};
    const G = [HG(o.b1 || 430, o.unit), HG(o.b2 || 720, o.unit)];
    m.c = [G1, HB].map((grp, i) => {
      const ch = makeChart(svg, grp, { seed: 11 + 20 * i, ylabels: true, ext: false, sym: 'm_' + (i + 1) });
      ch.layout(G[i], { mean: 'top', cart: [G[i].x0 + 40, G[i].base - YMAX * G[i].unit + 18], cartSize: [56, 34], cartFont: 22 });
      if (o.hl) ch.bars.forEach((bar, c) => { if (56 + c < 72) bar.setAttribute('class', 'sqg'); });
      return ch;
    });
    m.G = G;
    m.ax = makeAxis(svg, range(56, 84, 4), () => true, 'Largeur de la main (mm)');
    m.ax.layout(geoX(G[1]), G[1].base, { ldy: 34, tdy: 74 });
    if (o.hl) m.thr = G.map(Gi => S('line', { x1: geoX(Gi)(71.5), x2: geoX(Gi)(71.5), y1: Gi.base - YMAX * Gi.unit - 8, y2: Gi.base, class: 'pop' }, svg));
    m.all = () => [...m.c.flatMap(ch => [ch.frame, ch.cart, ...ch.bars]), m.ax.g, ...(m.thr || [])];
    m.full = () => { m.c.forEach(ch => { ch.shown = ch.counts.slice(); ch.drawBars(); }); };
    m.grow = (c, d = 0, step = 30) => { fadeIn(c, [m.c.map(ch => [ch.frame, ch.cart]), m.ax.g, m.thr || []], d, 500); m.c.forEach((ch, i) => growBars(c, ch, d + 300 + i * 200, step)); return d + 300 + 200 + NIND * step + 400; };
    return m;
  }

  /* ======================= DIAPO 16 · CONFORMITÉ OU HOMOGÉNÉITÉ ? ======================= */
  stepped('homo', {
    labels: ['O1', 'O2', 'O3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Conformité ou homogénéité ?', { class: 't-title' });
      // left: one sample against a value
      m.left = S('g', {}, svg);
      ftx(m.left, 120, 200, '{b:Conformité}', { 'font-size': 40 });
      const GL = { x0: 150, x1: 870, d0: 56, d1: 84, base: 640, unit: 52 }, XL = geoX(GL);
      m.chL = makeChart(m.left, G1, { seed: 11, ext: false });
      m.chL.layout(GL, { mean: 'top', cart: [GL.x0 + 40, GL.base - YMAX * GL.unit + 18], cartSize: [56, 34], cartFont: 22 });
      const axL = makeAxis(m.left, range(56, 84, 4), () => true, null); axL.layout(XL, GL.base, { ldy: 34 });
      S('line', { x1: XL(MU0), x2: XL(MU0), y1: GL.base, y2: GL.base - YMAX * GL.unit - 46, class: 'ic-musolid' }, m.left);
      ftx(m.left, XL(MU0) + 10, GL.base - YMAX * GL.unit - 52, '{P:72,5 mm}', { 'font-size': 26 });
      ftx(m.left, 120, 760, '1 échantillon face à {b:une valeur de référence}', { 'font-size': 30 });
      ftx(m.left, 120, 804, '~Les gants : G1 est-il conforme à 72,5 mm ?~', { 'font-size': 26, class: 't-pop' });
      // right: two samples between themselves
      m.right = S('g', {}, svg);
      ftx(m.right, 1020, 200, '{b:Homogénéité}', { 'font-size': 40 });
      S('line', { x1: 960, x2: 960, y1: 170, y2: 820, class: 'tbl-line' }, svg);
      const GR1 = HG(420, 34, 1050, 1800), GR2 = HG(640, 34, 1050, 1800);
      m.chR = [G1, HB].map((grp, i) => {
        const ch = makeChart(m.right, grp, { seed: 11 + 20 * i, ylabels: false, ext: false, sym: 'm_' + (i + 1) });
        ch.layout([GR1, GR2][i], { mean: 'top', cart: [1090, [GR1, GR2][i].base - YMAX * 34 + 18], cartSize: [56, 34], cartFont: 22 });
        return ch;
      });
      const axR = makeAxis(m.right, range(56, 84, 4), () => true, null); axR.layout(geoX(GR2), GR2.base, { ldy: 34 });
      ftx(m.right, 1020, 760, '{b:2 échantillons} comparés entre eux', { 'font-size': 30 });
      ftx(m.right, 1020, 804, '~H : 30 handballeurs du club universitaire~', { 'font-size': 26, class: 't-pop' });
      m.h0 = noteBox(svg, 120, 870, 1680, ['{P:H₀ :} « ~k~_{e1} et ~k~_{e2} sont homogènes » : les deux échantillons viennent de populations', 'qui ont le même indicateur, ~κ~_1 = ~κ~_2 = ~κ~. En clair : ils représentent la même population.'], { size: 30, cls: 'box-pop' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      [m.chL, ...m.chR].forEach(ch => { ch.shown = ch.counts.slice(); ch.drawBars(); });
      vis(m.left, k >= 0); vis(m.right, k >= 1); vis(m.h0, k >= 2);
      vis(m.svg.querySelector(':scope > line.tbl-line'), k >= 1);
    },
    play(m, k, c) {
      if (k === 0) {
        vis(m.left, true); [...m.left.children].forEach(e => { e.style.opacity = 0; });
        fadeIn(c, [...m.left.children].filter(e => e !== m.chL.g), 0, 600);
        vis(m.chL.g, true); fadeIn(c, [m.chL.frame, m.chL.cart], 0, 400); m.chL.mean.g.style.opacity = 0;
        growBars(c, m.chL, 300, 30); meanIn(c, m.chL.mean, 300 + NIND * 30 + 100);
        return 300 + NIND * 30 + 900;
      }
      if (k === 1) {
        fadeIn(c, m.svg.querySelector(':scope > line.tbl-line'), 0, 400);
        vis(m.right, true); [...m.right.children].forEach(e => { e.style.opacity = 0; });
        fadeIn(c, [...m.right.children].filter(e => !m.chR.some(ch => ch.g === e)), 0, 600);
        m.chR.forEach((ch, i) => { vis(ch.g, true); fadeIn(c, [ch.frame, ch.cart], 0, 400); ch.mean.g.style.opacity = 0; growBars(c, ch, 300 + i * 300, 30); meanIn(c, ch.mean, 300 + i * 300 + NIND * 30 + 100); });
        return 300 + 300 + NIND * 30 + 900;
      }
      return stagger(c, m.h0, 0, 300, 500);
    }
  });

  /* ======================= DIAPO 17 · DEUX FRÉQUENCES ======================= */
  // F1 les deux fréquences · F2 le numérateur : sous H₀ on attend 0 · F3 les variances s'additionnent
  // F4 ϕ inconnu → estimation conjointe f · F5 ε = combien d'écarts-types · F6 données appariées
  stepped('hfreq', {
    labels: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Homogénéité de deux fréquences', { class: 't-title' });
      m.ch = twoCharts(svg, { hl: true, b1: 400, b2: 700, unit: 40 });
      m.f = S('g', {}, svg);
      ftx(m.f, 1000, 190, '{O:~f~_1 = 11/30 = 0,367}  (G1)', { 'font-size': 32 });
      ftx(m.f, 1000, 236, '{O:~f~_2 = 23/30 = 0,767}  (H)', { 'font-size': 32 });
      m.num = S('g', {}, svg);
      ftx(m.num, 1000, 300, '{b:1. En haut} : sous H₀ (une seule population), on attend ~f~_1 − ~f~_2 = 0.', { 'font-size': 27 });
      ftx(m.num, 1000, 340, 'On observe |~f~_1 − ~f~_2| = {b:0,400} : c\'est l\'écart à ce qu\'on attend.', { 'font-size': 27 });
      m.var = S('g', {}, svg);
      ftx(m.var, 1000, 400, '{b:2. En bas} : l\'écart-type de la différence. Les variances {b:s\'additionnent} :', { 'font-size': 27 });
      ftx(m.var, 1000, 444, 'Var(~F~_1 − ~F~_2) = {p:~ϕ~(1 − ~ϕ~)}/~n~_1 + {p:~ϕ~(1 − ~ϕ~)}/~n~_2 = {p:~ϕ~(1 − ~ϕ~)}(1/~n~_1 + 1/~n~_2)', { 'font-size': 27 });
      m.pool = S('g', {}, svg);
      ftx(m.pool, 1000, 504, '{b:3. ~ϕ~ est inconnu} : sous H₀, les 60 viennent de la même population,', { 'font-size': 27 });
      ftx(m.pool, 1000, 540, 'donc on les réunit pour l\'estimer (estimation conjointe) :', { 'font-size': 27 });
      fracLine(m.pool, 1250, 604, '~f~ =', '~n~_1~f~_1 + ~n~_2~f~_2', '~n~_1 + ~n~_2', 250, '= {b:0,567}', 32);
      ftx(m.pool, 1000, 690, '{p:Conditions : 11, 19, 23 et 7 sont tous > 5 ✓ → loi de Gauss}', { 'font-size': 24 });
      m.eps = S('g', {}, svg);
      fracLine(m.eps, 1300, 770, '~ε~ =', '|~f~_1 − ~f~_2|', '√( ~f~(1 − ~f~)(1/~n~_1 + 1/~n~_2) )', 430, '', 32);
      ftx(m.eps, 1000, 884, '= 0,400 / 0,128 = {b:3,13} écarts-types : trop pour du hasard.', { 'font-size': 30 });
      ftx(m.eps, 1000, 934, '3,13 > 1,96 → {R:non homogènes} : on rejette H₀', { 'font-size': 32, 'font-weight': 600 });
      m.pair = S('g', {}, svg);
      card(m.pair, 100, 830, 840, 210, 'box-or', 14);
      ftx(m.pair, 126, 878, '{b:⚠ Données appariées} : les mêmes individus', { 'font-size': 27 });
      ftx(m.pair, 126, 916, '(main droite et main gauche des 30 de G1).', { 'font-size': 27 });
      ftx(m.pair, 126, 954, 'Ces formules ne marchent pas : on teste', { 'font-size': 27 });
      ftx(m.pair, 126, 992, 'la fréquence des discordances (conformité).', { 'font-size': 27 });
      const px = 760;
      for (let i = 0; i < 4; i++) { const y = 880 + i * 30; S('circle', { cx: px, cy: y, r: 8, class: 'dot' }, m.pair); S('line', { x1: px + 10, x2: px + 110, y1: y, y2: y, class: 'thin' }, m.pair); S('circle', { cx: px + 120, cy: y, r: 8, class: 'dot' }, m.pair); }
      return m;
    },
    pose(m, k) {
      clean(m.svg); m.ch.full();
      vis(m.ch.all(), k >= 0); m.ch.c.forEach(ch => vis(ch.mean.g, false));
      vis(m.f, k >= 0); vis(m.num, k >= 1); vis(m.var, k >= 2); vis(m.pool, k >= 3); vis(m.eps, k >= 4); vis(m.pair, k >= 5);
    },
    play(m, k, c) {
      if (k === 0) { const e = m.ch.grow(c, 0, 25); return stagger(c, m.f, e - 400, 400, 500); }
      return stagger(c, [null, m.num, m.var, m.pool, m.eps, m.pair][k], 0, k === 5 ? 120 : 400, 500);
    }
  });

  /* ======================= DIAPO 18 · DEUX VARIANCES ======================= */
  stepped('hvar', {
    labels: ['V1', 'V2', 'V3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Homogénéité de deux variances', { class: 't-title' });
      m.ch = twoCharts(svg, { b1: 400, b2: 700, unit: 40 });
      // the spread of each sample: an arrow from m − s to m + s
      m.spread = [[G1, 4.2637, 's_G1'], [HB, 4.5891, 's_H']].map(([grp, s], i) => {
        const g = S('g', {}, svg), Gi = m.ch.G[i], X = geoX(Gi), y = Gi.base - YMAX * Gi.unit - 48;
        S('line', { x1: X(grp.m - s) + 8, x2: X(grp.m + s) - 8, y1: y, y2: y, class: 'est-arr' }, g);
        arrowHead(g, X(grp.m - s), y, Math.PI, 'est-arr-h', 12); arrowHead(g, X(grp.m + s), y, 0, 'est-arr-h', 12);
        ftx(g, X(grp.m + s) + 16, y + 9, '~s~ = ' + fr(s, 2), { 'font-size': 24, 'font-weight': 600 });
        return g;
      });
      m.why = noteBox(svg, 1000, 160, 860, ['{b:Pourquoi d\'abord les variances ?}', 'Le test des moyennes n\'a de sens que si', 'les variances sont homogènes.'], { size: 28 });
      m.F = S('g', {}, svg);
      ftx(m.F, 1000, 390, '1 = la plus grande variance (ici H) :', { 'font-size': 27, class: 't-pop' });
      ftx(m.F, 1000, 444, '~S~_1² = {b:21,06} (H)   ·   ~S~_2² = {b:18,18} (G1)', { 'font-size': 34 });
      fracLine(m.F, 1130, 570, '~F~ =', '~S~_1²', '~S~_2²', 90, '= {b:1,16}', 44);
      ftx(m.F, 1000, 680, 'On s\'arrange pour que ~F~ > 1.', { 'font-size': 26, class: 't-pop' });
      m.res = S('g', {}, svg);
      ftx(m.res, 1000, 760, 'Table de Snedecor, (29 ; 29) ddl : ~F~(~α~/2) = 2,10', { 'font-size': 30 });
      ftx(m.res, 1000, 812, '1,16 < 2,10 → on {b:accepte} H₀ : variances homogènes', { 'font-size': 30, 'font-weight': 600 });
      ftx(m.res, 1000, 862, '{G:→ on a le droit de comparer les moyennes.}', { 'font-size': 30 });
      return m;
    },
    pose(m, k) {
      clean(m.svg); m.ch.full();
      vis(m.ch.all(), k >= 0); m.ch.c.forEach(ch => vis(ch.mean.g, k >= 0));
      vis([m.spread, m.why], k >= 0); vis(m.F, k >= 1); vis(m.res, k >= 2);
    },
    play(m, k, c) {
      if (k === 0) {
        const e = m.ch.grow(c, 0, 25);
        m.ch.c.forEach(ch => meanIn(c, ch.mean, e - 300));
        fadeIn(c, m.spread, e + 200, 600);
        return stagger(c, m.why, e + 600, 250, 450);
      }
      return stagger(c, k === 1 ? m.F : m.res, 0, 350, 500);
    }
  });

  /* ======================= DIAPO 19 · DEUX MOYENNES ======================= */
  stepped('hmoy', {
    labels: ['M1', 'M2', 'M3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Homogénéité de deux moyennes', { class: 't-title' });
      m.ch = twoCharts(svg, { b1: 400, b2: 700, unit: 40 });
      const X = geoX(m.ch.G[1]);
      m.gap = S('g', {}, svg);
      S('line', { x1: X(G1.m), x2: X(G1.m), y1: m.ch.G[0].base, y2: m.ch.G[1].base, class: 'mext' }, m.gap);
      const ya = 455;
      S('line', { x1: X(G1.m) + 8, x2: X(HB.m) - 8, y1: ya, y2: ya, class: 'est-arr' }, m.gap);
      arrowHead(m.gap, X(G1.m), ya, Math.PI, 'est-arr-h', 12); arrowHead(m.gap, X(HB.m), ya, 0, 'est-arr-h', 12);
      ftx(m.gap, (X(G1.m) + X(HB.m)) / 2, ya - 12, '{b:4,5 mm}', { 'text-anchor': 'middle', 'font-size': 26, class: 'halo' });
      m.pool = S('g', {}, svg);
      ftx(m.pool, 1000, 200, '~n~_1 = ~n~_2 = 30 (pas > 30) : Student, avec une variance commune', { 'font-size': 27, class: 't-pop' });
      fracLine(m.pool, 1270, 290, '~S~² =', '~n~_1~S~_{e1}² + ~n~_2~S~_{e2}²', '~n~_1 + ~n~_2 − 2', 300, '', 34);
      ftx(m.pool, 1000, 410, '~S~² = {b:19,62}', { 'font-size': 40 });
      m.d = S('g', {}, svg);
      fracLine(m.d, 1300, 520, '~δ~ =', '|~m~_1 − ~m~_2|', '√( ~S~²/~n~_1 + ~S~²/~n~_2 )', 350, '', 34);
      ftx(m.d, 1000, 650, '~δ~ = {b:3,93}', { 'font-size': 44 });
      m.res = S('g', {}, svg);
      ftx(m.res, 1000, 730, 'Student à ~n~_1 + ~n~_2 − 2 = 58 ddl : ~t~(~α~) = 2,00', { 'font-size': 30 });
      ftx(m.res, 1000, 782, '3,93 > 2,00 → on {R:rejette H₀} (~p~ < 0,1 %)', { 'font-size': 30, 'font-weight': 600 });
      ftx(m.res, 1000, 828, 'Les handballeurs ont des mains plus larges.', { 'font-size': 28 });
      m.big = ftx(svg, 120, 1000, 'Si ~n~_1 et ~n~_2 > 30 : ~δ~ = |~m~_1 − ~m~_2| / √(~S~_1²/~n~_1 + ~S~_2²/~n~_2), comparé à ~ε~(~α~).', { 'font-size': 28, class: 't-pop' });
      return m;
    },
    pose(m, k) {
      clean(m.svg); m.ch.full();
      vis(m.ch.all(), k >= 0); m.ch.c.forEach(ch => vis(ch.mean.g, k >= 0));
      vis([m.gap, m.pool], k >= 0); vis(m.d, k >= 1); vis([m.res, m.big], k >= 2);
    },
    play(m, k, c) {
      if (k === 0) {
        const e = m.ch.grow(c, 0, 25);
        m.ch.c.forEach(ch => meanIn(c, ch.mean, e - 300));
        fadeIn(c, m.gap, e + 300, 500);
        return stagger(c, m.pool, e + 600, 350, 500);
      }
      if (k === 1) return stagger(c, m.d, 0, 400, 500);
      const e = stagger(c, m.res, 0, 350, 500); fadeIn(c, m.big, e, 500); return e + 600;
    }
  });

  /* ======================= DIAPO 20 · LE χ² PAS À PAS (exemple du poly : les quartiers) ======================= */
  const QO = [[12, 60, 28], [31, 45, 24]], QR = [100, 100], QC = [43, 105, 52], QT = 200;
  const QE = QO.map((r, i) => r.map((_, j) => QR[i] * QC[j] / QT));
  const QK = QO.map((r, i) => r.map((o, j) => (o - QE[i][j]) ** 2 / QE[i][j]));
  stepped('chi2', {
    labels: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Le test du ~χ~² pas à pas (exemple du poly)'), { class: 't-title' });
      m.h0 = ftx(svg, 60, 150, '{P:H₀ : « il n\'y a pas de lien entre le quartier et la distribution des avis »} (indépendance)', { 'font-size': 28 });
      const heads = ['Favorable', 'Opposé', 'Indifférent'];
      // observed (sample: orange), with margins
      m.capO = ftx(svg, 80, 222, '{b:Effectifs observés} ~O~', { 'font-size': 28 });
      m.O = grid(svg, 80, 244, [230, 150, 150, 160, 150], 64, [[null, ...heads, 'Totaux'], ['La Huppée', ...QO[0].map(String), '100'], ['Beauséjour', ...QO[1].map(String), '100'], ['Totaux', ...QC.map(String), '200']], { size: 30, cls: 't-or' });
      m.Odata = [1, 2].flatMap(r => [1, 2, 3].map(c => m.O.els[r][c]));
      m.Omarg = [m.O.els[0][4], m.O.els[1][4], m.O.els[2][4], m.O.els[3][0], ...[1, 2, 3, 4].map(c => m.O.els[3][c])];
      m.Omarg.forEach(e => { e.classList.remove('t-or'); e.setAttribute('font-weight', 700); });
      m.hl = [S('rect', { x: 80 + 230, y: 244 + 3 * 64 + 4, width: 150, height: 56, rx: 6, class: 'tbl-hl' }, svg), S('rect', { x: 80 + 230 + 450 + 160 - 160, y: 244 + 64 + 4, width: 150, height: 56, rx: 6, class: 'tbl-hl' }, svg)];
      m.hl[1].setAttribute('x', 80 + 230 + 150 * 2 + 160); m.hl[1].setAttribute('width', 150);
      // computed under H₀ (grey)
      m.capC = ftx(svg, 1000, 222, '{b:Effectifs calculés} ~C~ (si H₀ est vraie)', { 'font-size': 28 });
      m.C = grid(svg, 1000, 244, [230, 200, 200, 200], 64, [[null, ...heads], ['La Huppée', ...QE[0].map(v => fr(v, 1))], ['Beauséjour', ...QE[1].map(v => fr(v, 1))]], { size: 30, cls: 't-pop' });
      m.Cdata = [1, 2].flatMap(r => [1, 2, 3].map(c => m.C.els[r][c]));
      m.c11 = S('g', {}, svg);
      fracLine(m.c11, 310, 600, '~C~_{11} =', '~O~_{1.} × ~O~_{.1}', '~T~', 210, '= 43 × 100 / 200 = {b:21,5}', 32);
      ftx(m.c11, 1000, 476, 'Tous les ~C~ ≥ 5 ✓ (sinon on regroupe des classes)', { 'font-size': 26, class: 't-green' });
      // contributions
      m.capK = ftx(svg, 1000, 560, '{b:(~O~ − ~C~)² / ~C~} case par case', { 'font-size': 28 });
      m.K = grid(svg, 1000, 582, [230, 200, 200, 200], 64, [[null, ...heads], ['La Huppée', ...QK[0].map(v => fr(v, 2))], ['Beauséjour', ...QK[1].map(v => fr(v, 2))]], { size: 30 });
      m.Kdata = [1, 2].flatMap(r => [1, 2, 3].map(c => m.K.els[r][c]));
      m.sum = ftx(svg, 1000, 830, '~χ~² = somme des 6 cases = {b:10,85}', { 'font-size': 34 });
      m.ddl = S('g', {}, svg);
      ftx(m.ddl, 80, 730, 'ddl = (~L~ − 1)(~K~ − 1) = (2 − 1)(3 − 1) = {b:2}', { 'font-size': 30 });
      ftx(m.ddl, 80, 782, '~α~ = 5 % : table de Pearson, ~χ~²(~α~) = {b:5,99}', { 'font-size': 30 });
      m.end = noteBox(svg, 80, 900, 1780, ['10,85 > 5,99 → on {R:rejette H₀} : quand on change de quartier, la distribution des avis change.'], { size: 32, center: true, cls: 'box-red' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis([m.h0, m.capO, m.O.g], k >= 0);
      vis(m.Omarg, k >= 1);
      vis(m.hl, k === 2);
      vis([m.capC, m.C.g, m.c11], k >= 2);
      vis([m.capK, m.K.g, m.sum], k >= 3);
      vis(m.ddl, k >= 4); vis(m.end, k >= 5);
    },
    play(m, k, c) {
      switch (k) {
        case 0: {
          fadeIn(c, [m.h0, m.capO], 0, 500);
          vis(m.O.g, true); vis(m.Omarg, false);
          [...m.O.g.children].forEach(e => { if (!m.Odata.includes(e) && !m.Omarg.includes(e)) { e.style.opacity = 0; } });
          fadeIn(c, [...m.O.g.children].filter(e => !m.Odata.includes(e) && !m.Omarg.includes(e)), 300, 500);
          m.Odata.forEach((e, i) => popIn(c, e, 700 + i * 160, 400));
          return 700 + 6 * 160 + 500;
        }
        case 1: m.Omarg.forEach((e, i) => popIn(c, e, i * 160, 400)); return 8 * 160 + 500;
        case 2: {
          fadeIn(c, m.hl, 0, 400);
          fadeIn(c, [m.capC], 300, 400);
          const e = stagger(c, m.c11, 300, 300, 500);
          vis(m.C.g, true); [...m.C.g.children].forEach(x => { x.style.opacity = 0; });
          fadeIn(c, [...m.C.g.children].filter(x => !m.Cdata.includes(x)), 1300, 400);
          m.Cdata.forEach((x, i) => popIn(c, x, 1600 + i * 180, 400));
          return Math.max(e, 1600 + 6 * 180 + 500);
        }
        case 3: {
          fadeIn(c, m.capK, 0, 400);
          vis(m.K.g, true); [...m.K.g.children].forEach(x => { x.style.opacity = 0; });
          fadeIn(c, [...m.K.g.children].filter(x => !m.Kdata.includes(x)), 200, 400);
          m.Kdata.forEach((x, i) => popIn(c, x, 500 + i * 300, 400));
          popIn(c, m.sum, 500 + 6 * 300 + 200);
          return 500 + 6 * 300 + 800;
        }
        case 4: return stagger(c, m.ddl, 0, 400, 500);
        case 5: popIn(c, m.end, 0, 600); return 700;
      }
    }
  });

  /* ======================= DIAPO 21 · χ² ET HOMOGÉNÉITÉ ======================= */
  stepped('chi22', {
    labels: ['L1', 'L2', 'L3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Le ~χ~² d\'une table 2 × 2 = l\'homogénéité de deux fréquences'), { class: 't-title' });
      m.capO = ftx(svg, 80, 200, '{b:Observés} ~O~ (diapo « deux fréquences »)', { 'font-size': 28 });
      m.O = grid(svg, 80, 222, [200, 220, 220, 150], 64, [[null, 'main ≥ 72 mm', 'main < 72 mm', 'Totaux'], ['G1', '11', '19', '30'], ['H', '23', '7', '30'], ['Totaux', '34', '26', '60']], { size: 30, cls: 't-or' });
      [m.O.els[1][3], m.O.els[2][3], ...[1, 2, 3].map(c => m.O.els[3][c])].forEach(e => { e.classList.remove('t-or'); e.setAttribute('font-weight', 700); });
      m.capC = ftx(svg, 1000, 200, '{b:Calculés} ~C~ si H₀ (ex. 34 × 30 / 60 = 17)', { 'font-size': 28 });
      m.C = grid(svg, 1000, 222, [200, 220, 220], 64, [[null, 'main ≥ 72 mm', 'main < 72 mm'], ['G1', '17', '13'], ['H', '17', '13']], { size: 30, cls: 't-pop' });
      m.sum = S('g', {}, svg);
      ftx(m.sum, 80, 590, '~χ~² = Σ (~O~ − ~C~)² / ~C~ = {b:9,77}', { 'font-size': 44 });
      ftx(m.sum, 80, 680, 'ddl = (2 − 1)(2 − 1) = 1 · ~χ~²(5 %) = 3,84 → 9,77 > 3,84 : on {R:rejette H₀}', { 'font-size': 30, 'font-weight': 600 });
      m.link = noteBox(svg, 80, 770, 1780, ['{b:9,77 = 3,13²} : le ~ε~ de la diapo « deux fréquences », au carré.   {b:3,84 = 1,96²} : son seuil, au carré.', 'C\'est {b:le même test}. Avec une table 2 × 2, le ~χ~² teste la conformité ou l\'homogénéité de fréquences (note 3 du poly).'], { size: 30, cls: 'box-green' });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.capO, m.O.g, m.capC, m.C.g], k >= 0); vis(m.sum, k >= 1); vis(m.link, k >= 2); },
    play(m, k, c) {
      if (k === 0) { fadeIn(c, [m.capO, m.O.g], 0, 600); fadeIn(c, [m.capC, m.C.g], 700, 600); return 1400; }
      if (k === 1) return stagger(c, m.sum, 0, 500, 500);
      return stagger(c, m.link, 0, 400, 500);
    }
  });

  /* ======================= DIAPO 22 · BILAN : QUEL TEST ? ======================= */
  stepped('bilan', {
    labels: ['Z1', 'Z2'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Bilan : quel test ?', { class: 't-title' });
      const X = [80, 420, 900, 1380, 1860], Y = [140, 210, 450, 690];
      m.grid = S('g', {}, svg);
      S('rect', { x: X[0], y: Y[0], width: X[4] - X[0], height: Y[1] - Y[0], rx: 8, class: 'tbl-head' }, m.grid);
      ['Fréquence', 'Moyenne', 'Variance'].forEach((h, i) => ftx(m.grid, (X[i + 1] + X[i + 2]) / 2, 186, '{b:' + h + '}', { 'text-anchor': 'middle', 'font-size': 30 }));
      [Y[2], Y[3]].forEach(y => S('line', { x1: X[0], x2: X[4], y1: y, y2: y, class: 'tbl-line' }, m.grid));
      [X[1], X[2], X[3]].forEach(x => S('line', { x1: x, x2: x, y1: Y[0], y2: Y[3], class: 'tbl-line' }, m.grid));
      const rowHead = (y0, t, sub) => { ftx(m.grid, X[0] + 20, y0 + 60, '{b:' + t + '}', { 'font-size': 32 }); sub.forEach((s, i) => ftx(m.grid, X[0] + 20, y0 + 104 + i * 34, s, { 'font-size': 24, class: 't-pop' })); };
      rowHead(Y[1], 'Conformité', ['1 échantillon', 'face à une valeur']);
      rowHead(Y[2], 'Homogénéité', ['2 échantillons', 'entre eux']);
      const cell = (ci, ri, lines) => lines.forEach(([t, size, cls], i) => ftx(m.grid, X[ci + 1] + 22, [Y[1], Y[2]][ri] + 58 + i * 44, t, { 'font-size': size || 26, ...(cls ? { class: cls } : {}) }));
      cell(0, 0, [['~ε~ = |~f~ − ~ϕ~| / √(~ϕ~(1 − ~ϕ~)/~N~)', 25], ['Gauss : ~ε~(~α~)', 24, 't-pop'], ['si ~N~~ϕ~ et ~N~(1 − ~ϕ~) > 5', 24, 't-pop']]);
      cell(1, 0, [['~δ~ = |~m~ − ~μ~| / (~s~/√~N~)', 25], ['~ε~(~α~) si ~N~ > 30', 24, 't-pop'], ['sinon, si gaussien : ~t~(~α~),', 24, 't-pop'], ['~N~ − 1 ddl', 24, 't-pop']]);
      cell(2, 0, [['~χ~² = ~N~·~S~_e² / ~σ~²', 25], ['loi du ~χ~², ~N~ − 1 ddl', 24, 't-pop'], ['deux bornes : 1 − ~α~/2 et ~α~/2', 24, 't-pop']]);
      cell(0, 1, [['~ε~ = |~f~_1 − ~f~_2| /', 25], ['√(~f~(1 − ~f~)(1/~n~_1 + 1/~n~_2))', 25], ['Gauss : ~ε~(~α~)', 24, 't-pop'], ['~f~ = estimation conjointe', 24, 't-pop']]);
      cell(1, 1, [['~δ~ = |~m~_1 − ~m~_2| /', 25], ['√(~S~²/~n~_1 + ~S~²/~n~_2)', 25], ['~t~(~α~), ~n~_1 + ~n~_2 − 2 ddl', 24, 't-pop'], ['(~ε~(~α~) si ~n~_1, ~n~_2 > 30)', 24, 't-pop']]);
      cell(2, 1, [['~F~ = ~S~_1² / ~S~_2² (> 1)', 25], ['Snedecor : ~F~(~α~/2),', 24, 't-pop'], ['(~n~_1 − 1 ; ~n~_2 − 1) ddl', 24, 't-pop'], ['{b:à faire avant les moyennes}', 24]]);
      m.chi = S('g', {}, svg);
      card(m.chi, X[0], 712, X[4] - X[0], 110, 'box', 10);
      ftx(m.chi, X[0] + 20, 760, '{b:Plusieurs distributions (table ~L~ × ~K~)} : ~χ~² = Σ (~O~ − ~C~)² / ~C~, à (~L~ − 1)(~K~ − 1) ddl, tous les ~C~ ≥ 5.', { 'font-size': 27 });
      ftx(m.chi, X[0] + 20, 800, 'Partout : on rejette H₀ quand l\'écart dépasse le seuil de la table (test significatif).', { 'font-size': 25, class: 't-pop' });
      m.np = noteBox(svg, X[0], 850, X[4] - X[0], ['Tous ces tests supposent une loi de Gauss : ce sont des tests {b:paramétriques} (comme l\'ANOVA).', 'Le ~χ~² et les tests de rangs (Wilcoxon, Mann-Whitney, Spearman…) sont {b:non paramétriques} ; ce complément n\'est pas à connaître.'], { size: 27 });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.grid, m.chi], k >= 0); vis(m.np, k >= 1); },
    play(m, k, c) {
      if (k === 0) { const e = stagger(c, m.grid, 0, 45, 400); fadeIn(c, m.chi, e, 500); return e + 600; }
      return stagger(c, m.np, 0, 300, 500);
    }
  });
