
  /* ==========================================================
     RANGÉE I · RAPPEL DU COURS 1 (avant la diapo de titre du cours 2)
       RFORM   les formules de l'IC et de l'IP ; IC : échantillon → population, IP : l'inverse
       MULT    ε(α) est un multiplicateur de l'écart-type
       TABLE   lire ε(α) dans la table de l'écart réduit (Gauss)
       STUDENT d'autres lois, d'autres tables (Student ; Pearson, Snedecor)
       ARBRE   quelle loi, quelles conditions, selon ce qu'on mesure (poly, I.A et I.C)
       ASERT   à quoi ça sert tout ça : estimer, prévoir, décider
     Le surligneur jaune marque toujours le multiplicateur lu dans une table : {k:…} dans les formules.
     ========================================================== */
  // yellow highlight behind every run of {k:…} pieces of the texts inside `scope`
  function markMult(scope, hlG, keep) {
    if (!keep) hlG.replaceChildren();
    (scope.tagName === 'text' ? [scope] : [...scope.querySelectorAll('text')]).forEach(t => {
      let run = null;
      const flush = () => { if (run) S('rect', { x: run.x - 7, y: run.y - 3, width: run.x2 - run.x + 14, height: run.y2 - run.y + 6, rx: 7, class: 'hl-mult' }, hlG); run = null; };
      [...t.querySelectorAll('tspan')].forEach(ts => {
        if (!ts.classList.contains('t-mult')) { flush(); return; }
        const b = ts.getBBox();
        if (!run) run = { x: b.x, y: b.y, x2: b.x + b.width, y2: b.y + b.height };
        else Object.assign(run, { x: Math.min(run.x, b.x), y: Math.min(run.y, b.y), x2: Math.max(run.x2, b.x + b.width), y2: Math.max(run.y2, b.y + b.height) });
      });
      flush();
    });
  }
  // a small bell: centre cx, base, sx px per standard deviation; optional red tails beyond ±zt
  function bellG(parent, o) {
    const g = S('g', {}, parent), X = z => o.cx + z * o.sx, Y = z => o.base - o.peak * Math.exp(-z * z / 2), z0 = o.zmax || 3.4;
    const P = (a, b) => { let d = ''; for (let i = 0; i <= 100; i++) { const z = a + (b - a) * i / 100; d += (i ? 'L' : 'M') + X(z).toFixed(1) + ' ' + Y(z).toFixed(1); } return d; };
    const A = (a, b) => P(a, b) + `L${X(b).toFixed(1)} ${o.base}L${X(a).toFixed(1)} ${o.base}Z`;
    g.area = S('path', { d: A(-z0, z0), class: o.areaCls || 'ic-area-k' }, g);
    if (o.zt) { S('path', { d: A(-z0, -o.zt), class: 'ic-tail' }, g); S('path', { d: A(o.zt, z0), class: 'ic-tail' }, g); }
    S('path', { d: P(-z0, z0), class: o.curveCls || 'ic-curve-k' }, g);
    S('line', { x1: X(-z0) - 16, x2: X(z0) + 16, y1: o.base, y2: o.base, class: 'axl' }, g);
    g.X = X; g.Y = Y;
    return g;
  }

  /* ======================= RAPPEL 1 · LES FORMULES DE L'IC ET DE L'IP ======================= */
  const RF_ROWS = [
    ['Fréquence', '{G:~f~} ± {k:~ε~(~α~)}·√({g:~f~}(1 − {g:~f~})/~N~)', '{P:~ϕ~} ± {k:~ε~(~α~)}·√({p:~ϕ~(1 − ~ϕ~)}/~N~)'],
    ['Moyenne, {p:~σ~} connu', '{G:~m~} ± {k:~ε~(~α~)}·{p:~σ~}/√~N~', '{P:~μ~} ± {k:~ε~(~α~)}·{p:~σ~}/√~N~'],
    ['Moyenne, {p:~σ~} inconnu', '{G:~m~} ± {k:~t~(~α~)}·{g:~s~}/√~N~', '{P:~μ~} ± {k:~t~(~α~)}·{g:~s~}/√~N~'],
    ['Variance', '[(~N~−1){g:~s~²}/{k:~χ~²(~α~/2)} ; (~N~−1){g:~s~²}/{k:~χ~²(1−~α~/2)}]', '[{k:~χ~²(1−~α~/2)}·{p:~σ~²}/~N~ ; {k:~χ~²(~α~/2)}·{p:~σ~²}/~N~]'],
  ];
  stepped('rform', {
    labels: ['F1', 'F2', 'F3', 'F4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Rappel du cours 1 : IC et IP', { class: 't-title' });
      // the two directions
      m.boxes = S('g', {}, svg);
      card(m.boxes, 160, 160, 460, 180, 'box-or', 16);
      ftx(m.boxes, 390, 230, '{b:Un échantillon}', { 'text-anchor': 'middle', 'font-size': 36 });
      ftx(m.boxes, 390, 290, '{O:~f~_e, ~m~_e, ~S~_e}  →  {G:~f~, ~m~, ~s~}', { 'text-anchor': 'middle', 'font-size': 32 });
      card(m.boxes, 1300, 160, 460, 180, 'popbox', 16);
      ftx(m.boxes, 1530, 230, '{b:La population}', { 'text-anchor': 'middle', 'font-size': 36 });
      ftx(m.boxes, 1530, 290, '{P:~ϕ~, ~μ~, ~σ~}', { 'text-anchor': 'middle', 'font-size': 32 });
      m.ic = S('g', {}, svg);
      S('line', { x1: 640, x2: 1270, y1: 222, y2: 222, class: 'ic-seg' }, m.ic); arrowHead(m.ic, 1282, 222, 0, 'ic-dot', 20);
      ftx(m.ic, 955, 200, '{G:IC} : on part de l\'échantillon pour encadrer la population', { 'text-anchor': 'middle', 'font-size': 25 });
      m.ip = S('g', {}, svg);
      S('line', { x1: 1280, x2: 650, y1: 280, y2: 280, class: 'ic-seg p' }, m.ip); arrowHead(m.ip, 638, 280, Math.PI, 'h1-arr-h', 20);
      ftx(m.ip, 955, 322, '{P:IP} : on part de la population pour prévoir l\'échantillon', { 'text-anchor': 'middle', 'font-size': 25 });
      // the formulas
      m.tab = S('g', {}, svg);
      const C = [160, 560, 1190], Y0 = 420, DY = 92;
      m.hl = S('g', {}, m.tab);
      S('rect', { x: 140, y: Y0 - 44, width: 1640, height: 64, rx: 8, class: 'tbl-head' }, m.tab);
      ftx(m.tab, C[1], Y0, '{G:Intervalle de confiance (IC)}', { 'font-size': 30 });
      ftx(m.tab, C[2], Y0, '{P:Intervalle de pari (IP)}', { 'font-size': 30 });
      m.rows = RF_ROWS.map(([a, b, c], i) => {
        const g = S('g', {}, m.tab), y = Y0 + 80 + i * DY, sz = i === 3 ? 25 : 30;
        S('line', { x1: 140, x2: 1780, y1: y + 30, y2: y + 30, class: 'tbl-line' }, g);
        ftx(g, C[0], y, '{b:' + a.replace(/\{p:([^}]*)\}/, '$1') + '}', { 'font-size': 28 });
        ftx(g, C[1], y, b, { 'font-size': sz }); ftx(g, C[2], y, c, { 'font-size': sz });
        return g;
      });
      m.note = ftx(svg, 960, 900, 'Les formules dépendent des lois : {k:~ε~(~α~)} vient de Gauss, {k:~t~(~α~)} de Student, {k:~χ~²} de Pearson.', { 'text-anchor': 'middle', 'font-size': 32 });
      m.note2 = ftx(svg, 960, 960, 'Seul le centre change entre l\'IC et l\'IP : l\'estimation d\'un côté, la valeur de la population de l\'autre.', { 'text-anchor': 'middle', 'font-size': 27, class: 't-pop' });
      m.hl2 = S('g', {}, svg); svg.insertBefore(m.hl2, m.note);
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis([m.boxes, m.ic], k >= 0); vis(m.ip, k >= 1); vis(m.tab, k >= 2); vis([m.note, m.note2], k >= 3);
      if (k >= 3) { markMult(m.tab, m.hl); markMult(m.note, m.hl2); } else { m.hl.replaceChildren(); m.hl2.replaceChildren(); }
    },
    play(m, k, c) {
      if (k === 0) { fadeIn(c, m.boxes, 0, 600); vis(m.ic, true); const ln = m.ic.firstChild; [...m.ic.children].forEach(e => { e.style.opacity = 0; }); c.at(600, () => { ln.style.opacity = ''; c.anim(ln, { scaleX: [0, 1], duration: T(700), ease: 'inOut(2)' }); }); fadeIn(c, [...m.ic.children].slice(1), 1200, 500); return 1800; }
      if (k === 1) { vis(m.ip, true); const ln = m.ip.firstChild; [...m.ip.children].forEach(e => { e.style.opacity = 0; }); c.at(0, () => { ln.style.opacity = ''; c.anim(ln, { scaleX: [0, 1], duration: T(700), ease: 'inOut(2)' }); }); fadeIn(c, [...m.ip.children].slice(1), 600, 500); return 1200; }
      if (k === 2) {
        vis(m.tab, true); [...m.tab.children].forEach(e => { e.style.opacity = 0; });
        fadeIn(c, [...m.tab.children].filter(e => !m.rows.includes(e) && e !== m.hl), 0, 500);
        m.rows.forEach((g, i) => c.at(400 + i * 350, () => c.anim(g, { opacity: [0, 1], translateX: [-30, 0], duration: T(500), ease: 'out(3)' })));
        return 400 + 4 * 350 + 300;
      }
      markMult(m.tab, m.hl); markMult(m.note, m.hl2);
      [...m.hl.children, ...m.hl2.children].forEach((r, i) => { r.style.opacity = 0; c.at(200 + i * 90, () => c.anim(r, { opacity: [0, 1], scaleX: [0, 1], duration: T(400), ease: 'out(3)' })); });
      fadeIn(c, [m.note, m.note2], 300, 600);
      return 200 + 18 * 90 + 500;
    }
  });

  /* ======================= RAPPEL 2 · ε(α) EST UN MULTIPLICATEUR ======================= */
  const MU = { cx: 960, base: 640, sx: 210, peak: 340 };
  stepped('mult', {
    labels: ['X1', 'X2', 'X3'],
    build(svg) {
      const m = { z: 1 };
      tx(svg, 60, 90, FM('~ε~(~α~) : un multiplicateur'), { class: 't-title' });
      m.caps = captions(svg, [
        'Autour du centre, à ± 1 écart-type, on trouve 68 % des valeurs.',
        'Par combien multiplier l\'écart-type pour ne laisser que ~α~ = 5 % dehors ? Par {k:~ε~(~α~) = 1,96}.',
        'Pour ~α~ = 1 %, il faut aller plus loin : {k:~ε~(~α~) = 2,576}. Plus ~α~ est petit, plus l\'intervalle est large.',
      ], 150, 32);
      m.hlc = S('g', {}, svg); svg.insertBefore(m.hlc, m.caps[0]);
      const X = z => MU.cx + z * MU.sx, Y = z => MU.base - MU.peak * Math.exp(-z * z / 2);
      const P = (a, b) => { let d = ''; for (let i = 0; i <= 120; i++) { const z = a + (b - a) * i / 120; d += (i ? 'L' : 'M') + X(z).toFixed(1) + ' ' + Y(z).toFixed(1); } return d; };
      const A = (a, b) => b - a < 1e-4 ? '' : P(a, b) + `L${X(b).toFixed(1)} ${MU.base}L${X(a).toFixed(1)} ${MU.base}Z`;
      m.area = S('path', { class: 'ic-area-k' }, svg);
      m.mid = S('path', { class: 'mult-mid' }, svg);
      m.tl = S('path', { class: 'ic-tail' }, svg); m.tr = S('path', { class: 'ic-tail' }, svg);
      S('path', { d: P(-3.6, 3.6), class: 'ic-curve-k' }, svg);
      S('line', { x1: X(-3.8), x2: X(3.8), y1: MU.base, y2: MU.base, class: 'axl' }, svg);
      S('line', { x1: MU.cx, x2: MU.cx, y1: MU.base + 10, y2: MU.base - MU.peak - 20, class: 'thin' }, svg);
      tx(svg, MU.cx, MU.base - MU.peak - 30, 'centre', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' });
      // one standard deviation: the unit
      m.unit = S('g', {}, svg);
      S('line', { x1: MU.cx + 4, x2: X(1) - 8, y1: MU.base + 56, y2: MU.base + 56, class: 'est-arr' }, m.unit);
      arrowHead(m.unit, X(1), MU.base + 56, 0, 'est-arr-h', 13);
      S('line', { x1: X(1), x2: X(1), y1: MU.base, y2: MU.base + 70, class: 'thin' }, m.unit);
      tx(m.unit, (MU.cx + X(1)) / 2, MU.base + 92, '1 écart-type', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600 });
      // the interval: ± z standard deviations
      m.ivl = S('g', {}, svg);
      m.seg = S('line', { y1: MU.base + 140, y2: MU.base + 140, class: 'ic-seg p' }, m.ivl);
      m.br = [-1, 1].map(() => S('path', { class: 'ic-br p' }, m.ivl));
      m.pct = tx(svg, MU.cx, MU.base - 120, '', { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 700, class: 'halo' });
      m.aL = tx(svg, 0, MU.base - 40, FM('~α~/2'), { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700, class: 't-red halo' });
      m.aR = tx(svg, 0, MU.base - 40, FM('~α~/2'), { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700, class: 't-red halo' });
      m.times = tx(svg, 0, MU.base + 210, '', { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 700 });
      m.hlt = S('g', {}, svg); svg.insertBefore(m.hlt, m.times);
      m.f = S('g', {}, svg);
      m.hlf = S('g', {}, m.f);
      ftx(m.f, 960, 990, 'intervalle = centre ± {k:~ε~(~α~)} × écart-type', { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 600 });
      m.draw = (tails) => {
        const z = m.z;
        m.area.setAttribute('d', A(-3.6, 3.6));
        m.mid.setAttribute('d', A(-z, z));
        m.tl.setAttribute('d', tails ? A(-3.6, -z) : ''); m.tr.setAttribute('d', tails ? A(z, 3.6) : '');
        m.seg.setAttribute('x1', X(-z)); m.seg.setAttribute('x2', X(z));
        const y = MU.base + 140;
        m.br[0].setAttribute('d', `M${X(-z) + 16} ${y - 22}L${X(-z)} ${y - 22}L${X(-z)} ${y + 22}L${X(-z) + 16} ${y + 22}`);
        m.br[1].setAttribute('d', `M${X(z) - 16} ${y - 22}L${X(z)} ${y - 22}L${X(z)} ${y + 22}L${X(z) - 16} ${y + 22}`);
        rich(m.pct, pctTxt(2 * Phi(z) - 1, 0));
        const zs = Math.abs(z - 1) < 1e-6 ? '1' : zTxt(z);
        rich(m.times, FM('× ' + (z > 1.001 ? '{k:' + zs + '}' : zs) + (z > 1.001 ? ' écarts-types' : ' écart-type')));
        m.times.setAttribute('x', MU.cx);
        m.aL.setAttribute('x', X(-Math.max(z + 0.6, 2.7))); m.aR.setAttribute('x', X(Math.max(z + 0.6, 2.7)));
      };
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.z = k >= 2 ? Z99 : k >= 1 ? Z95 : 1; m.draw(k >= 1);
      showCap(m.caps, k);
      vis(m.svg.querySelectorAll(':scope > path, :scope > line, :scope > text:not(.t-title)'), k >= 0);
      vis([m.unit, m.ivl, m.pct, m.times], k >= 0);
      vis([m.aL, m.aR], k >= 1); vis(m.f, k >= 1);
      showCap(m.caps, k);
      [m.hlc, m.hlt, m.hlf].forEach(g => g.replaceChildren());
      if (k >= 1) { markMult(m.caps[k], m.hlc); markMult(m.times, m.hlt); markMult(m.f, m.hlf); }
    },
    play(m, k, c) {
      swapCap(c, m.caps, k);
      if (k === 0) {
        const els = [...m.svg.querySelectorAll(':scope > path, :scope > line, :scope > text:not(.t-title)')].filter(e => !m.caps.includes(e));
        fadeIn(c, els, 0, 600); fadeIn(c, m.unit, 700, 500); fadeIn(c, [m.ivl, m.pct, m.times], 1100, 500);
        return 1800;
      }
      const z0 = k === 1 ? 1 : Z95, z1 = k === 1 ? Z95 : Z99;
      [m.hlc, m.hlt, m.hlf].forEach(g => g.replaceChildren());
      tweenT(c, 1600, 400, t => { m.z = lerp(z0, z1, t); m.draw(true); }, 'inOut(2)');
      if (k === 1) { fadeIn(c, [m.aL, m.aR], 1200, 400); fadeIn(c, m.f, 2000, 500); }
      c.at(2100, () => { markMult(m.caps[k], m.hlc); markMult(m.times, m.hlt); markMult(m.f, m.hlf); [...m.hlc.children, ...m.hlt.children, ...m.hlf.children].forEach(r => c.anim(r, { opacity: [0, 1], scaleX: [0, 1], duration: T(400), ease: 'out(3)' })); });
      return 2700;
    }
  });

  /* ======================= RAPPEL 3 · LA TABLE DE L'ÉCART RÉDUIT (GAUSS) =======================
     α = ligne + colonne ; la case donne ε(α) tel que P(|Z| > ε) = α */
  const GT = { x0: 120, y0: 210, cw0: 140, cw: 104, rh: 62, rows: 6, cols: 10 };
  const gtX = c => GT.x0 + GT.cw0 + c * GT.cw, gtY = r => GT.y0 + (r + 1) * GT.rh;
  const epsOf = a => a <= 0 ? '∞' : zOf(1 - a / 2).toFixed(3).replace('.', ',');
  stepped('table', {
    labels: ['G1', 'G2', 'G3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Lire ~ε~(~α~) dans la table de Gauss'), { class: 't-title' });
      ftx(svg, 60, 150, 'Table de l\'écart réduit : ~α~ = la ligne + la colonne ; la case donne ~ε~(~α~).', { 'font-size': 28, class: 't-pop' });
      m.tab = S('g', {}, svg);
      m.rowHl = S('rect', { x: GT.x0, height: GT.rh, width: GT.cw0 + GT.cols * GT.cw, rx: 6, class: 'gt-line' }, m.tab);
      m.colHl = S('rect', { y: GT.y0, width: GT.cw, height: (GT.rows + 1) * GT.rh, rx: 6, class: 'gt-line' }, m.tab);
      S('rect', { x: GT.x0, y: GT.y0, width: GT.cw0 + GT.cols * GT.cw, height: GT.rh, rx: 6, class: 'tbl-head' }, m.tab);
      S('rect', { x: GT.x0, y: GT.y0, width: GT.cw0, height: (GT.rows + 1) * GT.rh, rx: 6, class: 'tbl-head' }, m.tab);
      ftx(m.tab, GT.x0 + GT.cw0 / 2, GT.y0 + 40, '{b:~α~}', { 'text-anchor': 'middle', 'font-size': 28 });
      for (let c = 0; c < GT.cols; c++) ftx(m.tab, gtX(c) + GT.cw / 2, GT.y0 + 40, '{b:0,0' + c + '}', { 'text-anchor': 'middle', 'font-size': 24 });
      m.cells = [];
      for (let r = 0; r < GT.rows; r++) {
        ftx(m.tab, GT.x0 + GT.cw0 / 2, gtY(r) + 40, '{b:' + fr(r / 10, 2) + '}', { 'text-anchor': 'middle', 'font-size': 24 });
        S('line', { x1: GT.x0, x2: GT.x0 + GT.cw0 + GT.cols * GT.cw, y1: gtY(r) + GT.rh, y2: gtY(r) + GT.rh, class: 'tbl-line' }, m.tab);
        m.cells.push(range(0, GT.cols - 1, 1).map(c => tx(m.tab, gtX(c) + GT.cw / 2, gtY(r) + 40, epsOf(r / 10 + c / 100), { 'text-anchor': 'middle', 'font-size': 24 })));
      }
      m.cellHl = S('rect', { width: GT.cw - 6, height: GT.rh - 8, rx: 8, class: 'hl-mult' }, m.tab);
      m.tab.insertBefore(m.cellHl, m.tab.children[2]);
      m.pick = (r, c) => {
        m.rowHl.setAttribute('y', gtY(r)); m.colHl.setAttribute('x', gtX(c));
        m.cellHl.setAttribute('x', gtX(c) + 3); m.cellHl.setAttribute('y', gtY(r) + 4);
        m.cells.flat().forEach(t => { t.setAttribute('font-weight', 400); t.setAttribute('font-size', 24); });
        m.cells[r][c].setAttribute('font-weight', 700); m.cells[r][c].setAttribute('font-size', 28);
      };
      // the curve that goes with the reading
      m.bell = bellG(svg, { cx: 1500, base: 800, sx: 90, peak: 170, zt: Z95 });
      m.side = S('g', {}, svg);
      m.sideTxt = [
        ['~α~ = 5 % : ligne 0,00, colonne 0,05', '→ {k:~ε~(~α~) = 1,960} ≈ 1,96', '2,5 % de chaque côté'],
        ['~α~ = 1 % : ligne 0,00, colonne 0,01 → {k:2,576}', '~α~ = 10 % : ligne 0,10, colonne 0,00 → {k:1,645}', 'Plus ~α~ est petit, plus ~ε~(~α~) est grand.'],
      ].map(lines => { const g = S('g', {}, svg); lines.forEach((l, i) => ftx(g, 960, 920 + i * 46, l, { 'text-anchor': 'middle', 'font-size': i === 2 ? 26 : 30, class: i === 2 ? 't-pop' : '' })); return g; });
      m.hlS = S('g', {}, svg); svg.insertBefore(m.hlS, m.sideTxt[0]);
      m.bLab = [-1, 1].map(s => tx(svg, m.bell.X(s * Z95), 840, (s < 0 ? '−' : '+') + '1,96', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700 }));
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.tab, k >= 0);
      vis([m.rowHl, m.colHl, m.cellHl], k >= 1);
      if (k >= 1) m.pick(k === 1 ? 0 : 1, k === 1 ? 5 : 0); else m.cells.flat().forEach(t => { t.setAttribute('font-weight', 400); t.setAttribute('font-size', 24); });
      vis([m.bell, m.bLab], k === 1);
      m.sideTxt.forEach((g, i) => vis(g, i === k - 1));
      m.hlS.replaceChildren(); if (k >= 1) markMult(m.sideTxt[k - 1], m.hlS);
    },
    play(m, k, c) {
      if (k === 0) {
        vis(m.tab, true); [...m.tab.children].forEach(e => { e.style.opacity = 0; });
        vis([m.rowHl, m.colHl, m.cellHl], false);
        fadeIn(c, [...m.tab.children].filter(e => ![m.rowHl, m.colHl, m.cellHl].includes(e)), 0, 600);
        return 900;
      }
      if (k === 1) {
        m.pick(0, 5);
        fadeIn(c, m.rowHl, 0, 400); fadeIn(c, m.colHl, 700, 400);
        c.at(1300, () => { m.cellHl.style.opacity = ''; c.anim(m.cellHl, { opacity: [0, 1], scale: [1.6, 1], duration: T(500), ease: 'out(3)' }); });
        fadeIn(c, [m.bell, m.bLab], 1500, 600);
        fadeIn(c, m.sideTxt[0], 1700, 500);
        c.at(1700, () => { m.hlS.replaceChildren(); markMult(m.sideTxt[0], m.hlS); });
        return 2400;
      }
      fadeOut(c, [m.bell, m.bLab, m.sideTxt[0], m.hlS], 0, 300);
      c.at(300, () => { m.hlS.replaceChildren(); m.hlS.style.opacity = ''; m.pick(0, 1); });
      c.at(1300, () => m.pick(1, 0));
      fadeIn(c, m.sideTxt[1], 400, 500);
      c.at(400, () => { markMult(m.sideTxt[1], m.hlS); });
      return 2100;
    }
  });

  /* ======================= RAPPEL 4 · D'AUTRES LOIS, D'AUTRES TABLES ======================= */
  const ST_ROWS = [['1', '6,314', '12,706', '31,821', '63,657'], ['2', '2,920', '4,303', '6,965', '9,925'], ['4', '2,132', '2,776', '3,747', '4,604'],
    ['10', '1,812', '2,228', '2,764', '3,169'], ['20', '1,725', '2,086', '2,528', '2,845'], ['29', '1,699', '2,045', '2,462', '2,756'], ['30', '1,697', '2,042', '2,457', '2,750'], ['∞', '1,645', '1,960', '2,326', '2,576']];
  const t4 = x => 0.375 * Math.pow(1 + x * x / 4, -2.5), g0 = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  stepped('student', {
    labels: ['S1', 'S2', 'S3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'D\'autres lois, d\'autres tables', { class: 't-title' });
      // left: Gauss and Student (4 ddl)
      const SC = { cx: 500, base: 640, sx: 95, py: 900 }, X = x => SC.cx + x * SC.sx, Y = (f, x) => SC.base - SC.py * f(x);
      const P = f => { let d = ''; for (let i = 0; i <= 160; i++) { const x = -4.3 + 8.6 * i / 160; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f, x).toFixed(1); } return d; };
      m.curves = S('g', {}, svg);
      S('path', { d: P(g0), class: 'ic-curve-k' }, m.curves);
      S('path', { d: P(t4), class: 'tb-true' }, m.curves);
      S('line', { x1: X(-4.5), x2: X(4.5), y1: SC.base, y2: SC.base, class: 'axl' }, m.curves);
      ftx(m.curves, X(0.25), Y(g0, 0) - 14, '{b:Gauss}', { 'font-size': 28 });
      ftx(m.curves, X(1.5), Y(t4, 1.5) - 70, '{P:Student} {p:(4 ddl)}', { 'font-size': 28 });
      [[Z95, '1,96', 'ic-musolid'], [2.776, '2,776', 'pop']].forEach(([z, l, cls], i) => {
        S('line', { x1: X(z), x2: X(z), y1: SC.base, y2: SC.base - 120 + i * 40, class: cls }, m.curves);
        ftx(m.curves, X(z), SC.base + 34, i ? '{P:' + l + '}' : '{b:' + l + '}', { 'font-size': 26, 'text-anchor': 'middle' });
      });
      m.capL = S('g', {}, svg);
      ftx(m.capL, 120, 730, '{p:~σ~} inconnu : on utilise {g:~s~}, et la loi devient', { 'font-size': 28 });
      ftx(m.capL, 120, 772, 'celle de {b:Student}, plus étalée : pour le même ~α~,', { 'font-size': 28 });
      ftx(m.capL, 120, 814, 'il faut multiplier par plus ({k:2,776} au lieu de {k:1,96}).', { 'font-size': 28 });
      m.hlL = S('g', {}, svg); svg.insertBefore(m.hlL, m.capL);
      // right: the Student table (bilateral α)
      m.tab = grid(svg, 1000, 170, [150, 170, 170, 170, 170], 66, [['ddl', '~α~ = 0,10', '0,05', '0,02', '0,01'], ...ST_ROWS.map(r => [r[0], ...r.slice(1)])], { size: 28, hsize: 24 });
      m.cellHl = S('rect', { width: 160, height: 54, rx: 8, class: 'hl-mult' }, svg); m.tab.g.insertBefore(m.cellHl, m.tab.g.children[1]);
      m.rowHl = S('rect', { x: 1000, width: 830, height: 66, rx: 8, class: 'gt-line' }, svg); m.tab.g.insertBefore(m.rowHl, m.tab.g.firstChild);
      m.capR = S('g', {}, svg);
      ftx(m.capR, 1000, 800, 'G1 : ~N~ = 30 → 29 ddl, ~α~ = 5 % → {k:~t~(~α~) = 2,045}', { 'font-size': 28 });
      m.capInf = S('g', {}, svg);
      ftx(m.capInf, 1000, 800, 'Ligne ∞ = la table de Gauss : quand ~N~ grandit, {k:~t~(~α~) → ~ε~(~α~)}.', { 'font-size': 28 });
      m.hlR = S('g', {}, svg); svg.insertBefore(m.hlR, m.capR);
      m.more = noteBox(svg, 120, 900, 1710, ['Une loi = une table : {k:~χ~²} (Pearson) pour une variance, {k:~F~} (Snedecor) pour un rapport de variances.'], { size: 30, center: true });
      m.hlM = S('g', {}, svg); m.more.insertBefore(m.hlM, m.more.children[1]);
      m.pickCell = (r, c) => { m.cellHl.setAttribute('x', m.tab.xs[c] + 5); m.cellHl.setAttribute('y', m.tab.y0 + (r + 1) * 66 + 6); };
      m.pickRow = r => m.rowHl.setAttribute('y', m.tab.y0 + (r + 1) * 66);
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis([m.curves, m.capL], k >= 0);
      vis(m.tab.g, k >= 1); vis(m.cellHl, k === 1); vis(m.capR, k === 1); vis(m.rowHl, k >= 2); vis([m.capInf, m.more], k >= 2);
      m.pickCell(5, 2); m.pickRow(7);
      [m.hlL, m.hlR, m.hlM].forEach(g => g.replaceChildren());
      if (k >= 0) markMult(m.capL, m.hlL);
      if (k === 1) markMult(m.capR, m.hlR);
      if (k >= 2) { markMult(m.capInf, m.hlR); markMult(m.more, m.hlM); }
      m.tab.els.forEach((row, r) => row.forEach(t => { if (t && r > 0) t.setAttribute('font-weight', (k === 1 && r === 6) || (k >= 2 && r === 8) ? 700 : 400); }));
    },
    play(m, k, c) {
      if (k === 0) {
        vis(m.curves, true); const kids = [...m.curves.children]; kids.forEach(e => { e.style.opacity = 0; });
        fadeIn(c, kids.filter(e => e.getAttribute('class') !== 'tb-true'), 0, 600);
        fadeIn(c, kids.filter(e => e.getAttribute('class') === 'tb-true'), 900, 700);
        fadeIn(c, m.capL, 1400, 500); fadeIn(c, m.hlL, 1600, 400);
        return 2200;
      }
      if (k === 1) { fadeIn(c, m.tab.g, 0, 600); popIn(c, m.cellHl, 900, 500); fadeIn(c, [m.capR, m.hlR], 1100, 500); return 1700; }
      fadeOut(c, [m.capR, m.hlR], 0, 300); fadeOut(c, m.cellHl, 0, 300);
      c.at(300, () => { m.hlR.replaceChildren(); m.hlR.style.opacity = ''; markMult(m.capInf, m.hlR); });
      fadeIn(c, m.rowHl, 400, 500); fadeIn(c, m.capInf, 600, 500);
      c.at(1200, () => markMult(m.more, m.hlM));
      fadeIn(c, m.more, 1200, 600);
      return 2000;
    }
  });

  /* ======================= RAPPEL 5 · QUELLE LOI, QUELLES CONDITIONS ? (poly, I.A et I.C) ======================= */
  stepped('arbre', {
    labels: ['A1', 'A2', 'A3', 'A4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Quelle loi, quelles conditions ?', { class: 't-title' });
      const node = (parent, cx, y, w, lines, cls = 'box', size = 26) => {
        const g = S('g', {}, parent), h = 30 + lines.length * (size + 12);
        card(g, cx - w / 2, y, w, h, cls, 12);
        lines.forEach((l, i) => ftx(g, cx, y + 22 + size * 0.85 + i * (size + 12), l, { 'text-anchor': 'middle', 'font-size': size }));
        g.h = h; return g;
      };
      const down = (parent, x, y1, y2, lab) => { const g = S('g', {}, parent); S('line', { x1: x, x2: x, y1, y2: y2 - 10, class: 'tree-l' }, g); arrowHead(g, x, y2, Math.PI / 2, 'h1-arr-h', 13); if (lab) ftx(g, x + 10, (y1 + y2) / 2 + 9, lab, { 'font-size': 22, class: 't-pop' }); return g; };
      const CX = [340, 960, 1580];
      m.root = S('g', {}, svg);
      node(m.root, 960, 140, 420, ['{b:Que mesure-t-on ?}'], 'box', 30);
      [['Une fréquence', CX[0]], ['Une moyenne', CX[1]], ['Une variance', CX[2]]].forEach(([t, x]) => {
        S('path', { d: `M960 210 C 960 240, ${x} 220, ${x} 262`, class: 'tree-l' }, m.root);
        node(m.root, x, 266, 400, ['{b:' + t + '}'], 'tbl-head', 30);
      });
      // fréquence
      m.fq = S('g', {}, svg);
      down(m.fq, CX[0], 340, 380);
      node(m.fq, CX[0], 384, 520, ['~N~~f~ ≥ 5 et ~N~(1 − ~f~) ≥ 5 ?', '{p:(IP : ~N~~ϕ~ et ~N~(1 − ~ϕ~) > 5)}']);
      down(m.fq, CX[0], 492, 540, 'oui');
      node(m.fq, CX[0], 544, 520, ['binomiale ≈ Gauss', '{k:~ε~(~α~)}'], 'box-green');
      ftx(m.fq, CX[0], 700, '{p:non : ~N~ trop petit, pas de Gauss}', { 'text-anchor': 'middle', 'font-size': 24 });
      ftx(m.fq, CX[0], 734, '{p:(il faut un ~N~ assez grand,}', { 'text-anchor': 'middle', 'font-size': 24 });
      ftx(m.fq, CX[0], 766, '{p:surtout pour une maladie rare)}', { 'text-anchor': 'middle', 'font-size': 24 });
      // moyenne
      m.mo = S('g', {}, svg);
      down(m.mo, CX[1], 340, 380);
      node(m.mo, CX[1], 384, 520, ['caractère gaussien,', 'ou ~N~ > 30 ?']);
      ftx(m.mo, CX[1], 520, '{p:non : tests non paramétriques}', { 'text-anchor': 'middle', 'font-size': 24 });
      down(m.mo, CX[1], 530, 572, 'oui');
      node(m.mo, CX[1], 576, 360, ['{p:~σ~} connu ?']);
      S('path', { d: `M${CX[1] - 60} 644 C ${CX[1] - 60} 680, ${CX[1] - 140} 670, ${CX[1] - 140} 704`, class: 'tree-l' }, m.mo);
      S('path', { d: `M${CX[1] + 60} 644 C ${CX[1] + 60} 680, ${CX[1] + 140} 670, ${CX[1] + 140} 704`, class: 'tree-l' }, m.mo);
      ftx(m.mo, CX[1] - 120, 676, 'oui', { 'text-anchor': 'end', 'font-size': 22, class: 't-pop' });
      ftx(m.mo, CX[1] + 120, 676, 'non', { 'font-size': 22, class: 't-pop' });
      node(m.mo, CX[1] - 140, 708, 260, ['Gauss', '{k:~ε~(~α~)}·{p:~σ~}/√~N~'], 'box-green', 24);
      node(m.mo, CX[1] + 140, 708, 260, ['Student, ~N~ − 1 ddl', '{k:~t~(~α~)}·{g:~s~}/√~N~'], 'box-green', 24);
      ftx(m.mo, CX[1], 860, '{p:(~t~(~α~) → ~ε~(~α~) quand ~N~ grandit)}', { 'text-anchor': 'middle', 'font-size': 22 });
      // variance
      m.va = S('g', {}, svg);
      down(m.va, CX[2], 340, 380);
      node(m.va, CX[2], 384, 520, ['caractère gaussien ?']);
      down(m.va, CX[2], 452, 500, 'oui');
      node(m.va, CX[2], 504, 520, ['Pearson, ~N~ − 1 ddl', '{k:~χ~²(1 − ~α~/2)} et {k:~χ~²(~α~/2)}'], 'box-green');
      ftx(m.va, CX[2], 666, '{p:deux bornes : intervalle non symétrique}', { 'text-anchor': 'middle', 'font-size': 24 });
      ftx(m.va, CX[2], 700, '{p:rapport de deux variances : Snedecor ~F~}', { 'text-anchor': 'middle', 'font-size': 24 });
      m.hl = S('g', { class: 'hl-top' }, svg);
      m.foot = noteBox(svg, 120, 920, 1710, ['{b:Deux échantillons} (différence de fréquences ou de moyennes) : mêmes vérifications pour chacun, par exemple ~n~_1 et ~n~_2 > 30.'], { size: 28, center: true });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.root, k >= 0); vis(m.fq, k >= 1); vis(m.mo, k >= 2); vis([m.va, m.foot], k >= 3);
      m.hl.replaceChildren();
      [[m.fq, 1], [m.mo, 2], [m.va, 3]].forEach(([g, s]) => { if (k >= s) markMult(g, m.hl, true); });
    },
    play(m, k, c) {
      if (k === 0) return stagger(c, m.root, 0, 90, 450);
      const g = [null, m.fq, m.mo, m.va][k];
      const e = stagger(c, g, 0, 160, 450);
      c.at(e - 300, () => { const n = m.hl.children.length; markMult(g, m.hl, true); [...m.hl.children].slice(n).forEach(r => c.anim(r, { opacity: [0, 1], duration: T(400) })); });
      if (k === 3) fadeIn(c, m.foot, e, 500);
      return e + (k === 3 ? 600 : 100);
    }
  });

  /* ======================= RAPPEL 6 · À QUOI ÇA SERT TOUT ÇA ? ======================= */
  stepped('asert', {
    labels: ['Q1', 'Q2', 'Q3'],
    build(svg) {
      const m = {};
      m.big = tx(svg, 960, 560, 'À quoi ça sert tout ça ?', { 'text-anchor': 'middle', 'font-size': 110, 'font-weight': 700, 'letter-spacing': '-2' });
      m.small = tx(svg, 960, 110, 'À quoi ça sert tout ça ?', { 'text-anchor': 'middle', 'font-size': 56, 'font-weight': 700 });
      const panel = (x, head, sub) => {
        const g = S('g', {}, svg);
        card(g, x, 170, 520, 690, 'card', 18);
        ftx(g, x + 260, 236, head, { 'text-anchor': 'middle', 'font-size': 46 });
        ftx(g, x + 260, 282, sub, { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' });
        return g;
      };
      const ax = (g, x0, y, mm0, mm1, mark) => { const X = v => x0 + (v - mm0) / (mm1 - mm0) * 440; S('line', { x1: x0 - 10, x2: x0 + 450, y1: y, y2: y, class: 'axl' }, g); (mark || []).forEach(v => { S('line', { x1: X(v), x2: X(v), y1: y, y2: y + 8, class: 'axl' }, g); tx(g, X(v), y + 34, String(v), { 'text-anchor': 'middle', 'font-size': 22, class: 't-tick' }); }); return X; };
      const brk = (g, X, a, b, y, sfx) => { S('line', { x1: X(a), x2: X(b), y1: y, y2: y, class: 'ic-seg' + sfx }, g); [[a, 1], [b, -1]].forEach(([v, s]) => S('path', { d: `M${X(v) + s * 14} ${y - 20}L${X(v)} ${y - 20}L${X(v)} ${y + 20}L${X(v) + s * 14} ${y + 20}`, class: 'ic-br' + sfx }, g)); };
      // 1 · estimate (IC): one sample → the population
      m.p1 = panel(150, '{G:Estimer}', 'un échantillon → la population');
      { const X = ax(m.p1, 190, 560, 67, 74, [68, 70, 72, 74]);
        S('line', { x1: X(70.4), x2: X(70.4), y1: 560, y2: 400, class: 'ic-msolid' }, m.p1); ftx(m.p1, X(70.4) + 8, 396, '{G:~m~ = 70,4}', { 'font-size': 26 });
        S('line', { x1: X(69.6), x2: X(69.6), y1: 560, y2: 450, class: 'pop' }, m.p1); ftx(m.p1, X(69.6) - 8, 446, '{P:~μ~ ?}', { 'font-size': 26, 'text-anchor': 'end' });
        brk(m.p1, X, 68.70, 72.10, 500, '');
        ftx(m.p1, 410, 680, 'IC à 95 % : la vraie moyenne', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p1, 410, 716, 'est entre {G:68,7} et {G:72,1} mm', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p1, 410, 790, '~« Quelle est la vraie valeur ? »~', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' }); }
      // 2 · predict (IP): the population → where a sample will fall
      m.p2 = panel(700, '{P:Prévoir}', 'la population → un échantillon');
      { const X = ax(m.p2, 740, 560, 67, 74, [68, 70, 72, 74]);
        S('line', { x1: X(70), x2: X(70), y1: 560, y2: 400, class: 'ic-musolid' }, m.p2); ftx(m.p2, X(70) + 8, 396, '{P:~μ~ = 70}', { 'font-size': 26 });
        brk(m.p2, X, 68.30, 71.70, 620, ' p');
        [69.1, 70.6, 69.7, 70.3, 71.1, 69.4].forEach((v, i) => S('circle', { cx: X(v), cy: 548 - (i % 2) * 22, r: 9, class: 'ic-pt' }, m.p2));
        ftx(m.p2, 960, 700, '95 % des ~m~_e tombent', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p2, 960, 736, 'entre {P:68,3} et {P:71,7} mm', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p2, 960, 790, '~« Où va tomber mon échantillon ? »~', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' }); }
      // 3 · decide: compare what we observe with what we expected
      m.p3 = panel(1250, '{R:Décider}', 'comparer l\'observé à l\'attendu');
      { const X = ax(m.p3, 1290, 560, 67, 74, [68, 70, 72, 74]);
        S('line', { x1: X(72.5), x2: X(72.5), y1: 560, y2: 400, class: 'ic-musolid' }, m.p3); ftx(m.p3, X(72.5) - 8, 396, '{P:H₀ : 72,5}', { 'font-size': 26, 'text-anchor': 'end' });
        brk(m.p3, X, 70.80, 74.20, 620, ' p');
        S('circle', { cx: X(70.4), cy: 548, r: 11, class: 'ic-pt out' }, m.p3); ftx(m.p3, X(70.4) - 4, 520, '{R:~m~_e}', { 'font-size': 26, 'text-anchor': 'end' });
        ftx(m.p3, 1510, 700, '~m~_e hors de l\'IP :', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p3, 1510, 736, 'on {R:rejette} l\'hypothèse', { 'text-anchor': 'middle', 'font-size': 27 });
        ftx(m.p3, 1510, 790, '~« Le médicament marche-t-il ? »~', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' }); }
      m.banner = noteBox(svg, 150, 900, 1620, ['Décider, c\'est faire un {b:test d\'hypothèses} : un intervalle de pari et une règle. C\'est le cours d\'aujourd\'hui.'], { size: 32, center: true, cls: 'box-red' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.big, k === 0); vis(m.small, k >= 1);
      vis([m.p1, m.p2], k >= 1); vis([m.p3, m.banner], k >= 2);
    },
    play(m, k, c) {
      if (k === 0) { m.big.style.opacity = ''; c.anim(m.big, { opacity: [0, 1], scale: [0.7, 1], duration: T(900), ease: 'out(3)' }); return 1000; }
      if (k === 1) {
        fadeOut(c, m.big, 0, 400); fadeIn(c, m.small, 300, 500);
        [m.p1, m.p2].forEach((g, i) => c.at(600 + i * 500, () => { g.style.opacity = ''; c.anim(g, { opacity: [0, 1], translateY: [40, 0], duration: T(700), ease: 'out(3)' }); }));
        [m.p1, m.p2].forEach(g => { g.style.opacity = 0; });
        return 1900;
      }
      m.p3.style.opacity = 0; c.at(0, () => { m.p3.style.opacity = ''; c.anim(m.p3, { opacity: [0, 1], translateY: [40, 0], duration: T(700), ease: 'out(3)' }); });
      popIn(c, m.banner, 900, 600);
      return 1600;
    }
  });
