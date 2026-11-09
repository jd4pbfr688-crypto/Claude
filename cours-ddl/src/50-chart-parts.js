  /* ---------- chart parts (shared by every station) ---------- */
  const geoX = G => mm => G.x0 + (mm - G.d0) * (G.x1 - G.x0) / (G.d1 - G.d0);
  const fmtTick = v => Number.isInteger(v) ? String(v) : fr(v);
  const range = (a, b, s) => { const o = []; for (let v = a; v <= b + 1e-9; v += s) o.push(+v.toFixed(4)); return o; };

  // Moyenne mₑ : jamais une barre. Trait vertical 3 px + triangle sous l'axe + étiquette orange.
  function makeMean(parent, m, label, sym = 'm_e') {
    const g = S('g', {}, parent);
    const line = S('line', { class: 'mline grow' }, g);
    const tri = S('path', { class: 'mtri' }, g);
    const lbl = S('text', { class: 't-or', 'font-weight': 600 }, g);
    let mode = null;
    return { g, line, tri, lbl, m, layout(X, top, base, md, L = {}) {
      const x = X(m);
      line.setAttribute('x1', x); line.setAttribute('x2', x); line.setAttribute('y1', top); line.setAttribute('y2', base);
      const [h, hw] = md === 'below' ? [26, 14] : md === 'right' ? [13, 8] : [12, 7];
      tri.setAttribute('d', `M${x} ${base + 2}L${x + hw} ${base + 2 + h}L${x - hw} ${base + 2 + h}Z`);
      if (md !== mode) {
        mode = md;
        rich(lbl, md === 'top' ? `${sym} = ${fr(m)}` : (label || `${sym} = ${fr(m)} mm`));
        lbl.setAttribute('font-size', md === 'top' ? 22 : 28);
        lbl.setAttribute('text-anchor', md === 'top' ? 'middle' : 'start');
      }
      if (md === 'below') { lbl.setAttribute('x', x + 22); lbl.setAttribute('y', base + 28); }
      else if (md === 'right') { lbl.setAttribute('x', L.labelX); lbl.setAttribute('y', (top + base) / 2 + 10); }
      else { lbl.setAttribute('x', x); lbl.setAttribute('y', top - 8); }
    } };
  }

  // Une barre d'histogramme : de x0 à x1, hauteur h px posée sur base (cachée quand vide).
  function setBar(el, x0, x1, base, h) {
    el.setAttribute('x', x0); el.setAttribute('width', x1 - x0);
    el.setAttribute('y', base - h); el.setAttribute('height', Math.max(0, h));
    el.setAttribute('visibility', h > 0.5 ? 'visible' : 'hidden');
  }
  // Diagramme en bâtons d'un groupe : les longueurs sont arrondies au mm, donc un bâton fin
  // posé EXACTEMENT sur chaque valeur (56…84 mm), haut de son effectif. Ainsi le trait mₑ tombe
  // sur une abscisse précise, jamais sur un intervalle. Les valeurs arrivent dans un ordre
  // aléatoire (graine fixe) : à chaque arrivée, le bâton de sa valeur monte d'un cran.
  const YMAX = 5;   // effectif maximal d'une valeur dans G1–G9 (N = 30)
  const stickW = G => Math.max(3, Math.min(18, 0.32 * (G.x1 - G.x0) / (G.d1 - G.d0)));
  function makeChart(parent, grp, o = {}) {
    const g = S('g', {}, parent);
    const frame = S('g', {}, g);
    const grid = [], ylab = [];
    for (let i = 0; i <= YMAX; i++) {
      grid.push(S('line', { class: i ? 'gridl' : 'basel' }, frame));
      if (o.ylabels !== false) ylab.push(tx(frame, 0, 0, String(i), { class: 't-tick', 'text-anchor': 'end' }));
    }
    const yTitle = o.yTitle ? tx(frame, 0, 0, 'Effectif', { class: 't-ax', 'text-anchor': 'middle' }) : null;
    const sqG = S('g', {}, g);
    const r = seeded(o.seed || 7), lv = {};
    const counts = new Array(29).fill(0);
    grp.v.forEach(v => counts[v - 56]++);
    const bars = counts.map(() => S('rect', { class: 'sq' }, sqG));
    const sq = shuffle(grp.v.map((_, i) => i), r).map(i => {
      const c = grp.v[i] - 56;
      lv[c] = (lv[c] ?? -1) + 1;
      return { c, lvl: lv[c] };
    });
    const mean = makeMean(g, grp.m, o.meanText, o.sym);
    const cart = S('g', {}, g), cr = S('rect', { class: 'nobox', rx: 8 }, cart), ct = tx(cart, 0, 0, grp.name, { 'text-anchor': 'middle', 'font-weight': 700 });
    const ext = o.ext === false ? null : S('line', { class: 'mext' }, o.extParent || g);
    const ch = { g, frame, sq, bars, sqEls: bars, counts, shown: counts.slice(), mean, cart, ext, yTitle, grp, G: null,
      drawBars() { const G = ch.G, X = geoX(G), w = stickW(G); bars.forEach((b, c) => setBar(b, X(56 + c) - w / 2, X(56 + c) + w / 2, G.base, ch.shown[c] * G.unit)); },
      layout(G, L = {}) {
        ch.G = G; ch.shown = counts.slice();
        const X = geoX(G), top = G.base - YMAX * G.unit;
        grid.forEach((l, i) => { const y = G.base - i * G.unit; l.setAttribute('x1', X(56)); l.setAttribute('x2', X(84)); l.setAttribute('y1', y); l.setAttribute('y2', y); });
        ylab.forEach((t, i) => { t.setAttribute('x', G.x0 - 14); t.setAttribute('y', G.base - i * G.unit + 8); t.setAttribute('visibility', G.unit < 60 && (i % 2 || i === 0) ? 'hidden' : 'visible'); });
        if (yTitle) { const x = G.x0 - 70, y = (top + G.base) / 2; yTitle.setAttribute('x', x); yTitle.setAttribute('y', y); yTitle.setAttribute('transform', `rotate(-90 ${x} ${y})`); }
        ch.drawBars();
        mean.layout(X, top, G.base, L.mean || 'below', L);
        const [cw, chh] = L.cartSize || [76, 44], [cx, cy] = L.cart || [G.x0 - 100, (top + G.base) / 2];
        cr.setAttribute('x', cx - cw / 2); cr.setAttribute('y', cy - chh / 2); cr.setAttribute('width', cw); cr.setAttribute('height', chh);
        ct.setAttribute('x', cx); ct.setAttribute('y', cy + (L.cartFont || 26) * 0.36); ct.setAttribute('font-size', L.cartFont || 26);
        if (ext) { const x = X(grp.m); ext.setAttribute('x1', x); ext.setAttribute('x2', x); ext.setAttribute('y1', L.extTop ?? top); ext.setAttribute('y2', L.extBot ?? G.base); }
      } };
    return ch;
  }

  function makeAxis(parent, ticks, isLabel, title, cls = 't-tick') {
    const g = S('g', {}, parent);
    const line = S('line', { class: 'axl' }, g);
    const tk = ticks.map(v => ({ v, l: S('line', { class: 'axl' }, g), t: isLabel(v) ? tx(g, 0, 0, fmtTick(v), { class: cls, 'text-anchor': 'middle' }) : null }));
    const tt = title ? tx(g, 0, 0, title, { class: 't-ax', 'text-anchor': 'middle' }) : null;
    return { g, labels: tk.filter(k => k.t).map(k => k.t), tt, layout(X, y, o = {}) {
      line.setAttribute('x1', X(ticks[0])); line.setAttribute('x2', X(ticks[ticks.length - 1])); line.setAttribute('y1', y); line.setAttribute('y2', y);
      tk.forEach(k => {
        const x = X(k.v);
        k.l.setAttribute('x1', x); k.l.setAttribute('x2', x); k.l.setAttribute('y1', y); k.l.setAttribute('y2', y + 8);
        if (k.t) { k.t.setAttribute('x', x); k.t.setAttribute('y', y + (o.ldy || 34)); k.t.setAttribute('visibility', o.thin && k.v % 4 ? 'hidden' : 'visible'); }
      });
      if (tt) { tt.setAttribute('x', (X(ticks[0]) + X(ticks[ticks.length - 1])) / 2); tt.setAttribute('y', y + (o.tdy || 78)); }
    } };
  }

  // Les barres partent de zéro ; à chaque valeur qui arrive, la barre de sa classe monte d'un cran.
  function growBars(c, ch, start, step) {
    ch.shown = ch.counts.map(() => 0); ch.drawBars(); vis(ch.bars, true);
    ch.sq.forEach((s, i) => {
      const o = { v: 0 };
      c.anim(o, { v: [0, 1], duration: T(280), delay: T(start + i * step), ease: 'out(3)',
        onUpdate: () => { ch.shown[s.c] = Math.max(ch.shown[s.c], s.lvl + o.v); ch.drawBars(); } });
    });
  }
  function meanIn(c, mean, d = 0) {
    c.at(d, () => { mean.g.style.opacity = ''; });
    utils.set(mean.line, { scaleY: 0 }); utils.set([mean.tri, mean.lbl], { opacity: 0 });
    c.anim(mean.line, { scaleY: [0, 1], duration: T(500), delay: T(d), ease: 'out(3)' });
    c.anim(mean.tri, { opacity: [0, 1], translateY: [12, 0], duration: T(400), delay: T(d + 300), ease: 'out(2)' });
    c.anim(mean.lbl, { opacity: [0, 1], duration: T(400), delay: T(d + 450) });
  }
  function box(parent, x, y, w, h, cls = 'box', rx = 10) { return S('rect', { x, y, width: w, height: h, rx, class: cls }, parent); }
  function arrowHead(parent, x, y, ang, cls, size = 16) {
    const a = ang, s = size, w = size * 0.55;
    const p = [[x, y], [x - s * Math.cos(a) + w * Math.sin(a), y - s * Math.sin(a) - w * Math.cos(a)], [x - s * Math.cos(a) - w * Math.sin(a), y - s * Math.sin(a) + w * Math.cos(a)]];
    return S('polygon', { points: p.map(q => q.map(v => v.toFixed(1)).join(',')).join(' '), class: cls }, parent);
  }
  // Pictogramme : main, index tendu. Le groupe extérieur porte la position, l'intérieur s'anime.
  function hand(parent, x, y, s, on = false) {
    const outer = S('g', { transform: `translate(${x} ${y}) scale(${s / 100})` }, parent);
    const g = S('g', { class: 'hand' }, outer);
    const idx = S('rect', { x: 40, y: 4, width: 17, height: 56, rx: 8.5, class: on ? 'on' : '' }, g);
    S('rect', { x: 56, y: 40, width: 15, height: 26, rx: 7.5 }, g);
    S('rect', { x: 69, y: 44, width: 14, height: 24, rx: 7 }, g);
    S('rect', { x: 14, y: 52, width: 16, height: 34, rx: 8, transform: 'rotate(-28 22 68)' }, g);
    S('rect', { x: 28, y: 50, width: 56, height: 46, rx: 16 }, g);
    return { outer, g, idx };
  }

