  // mini markup for coloured formula segments: {p:…} grey, {g:…} green, {o:…} orange, {b:…} bold,
  // {P:…}/{G:…} grey/green and bold; ~…~ stays italic, _x subscript, as everywhere in the deck
  const FMA = { p: { class: 't-pop' }, g: { class: 't-green' }, o: { class: 't-or' }, b: { 'font-weight': 700 }, r: { class: 't-red' },
    P: { class: 't-pop', 'font-weight': 700 }, G: { class: 't-green', 'font-weight': 700 } };
  const FM = s => s.split(/(\{[pgobrPG]:[^}]*\})/).filter(Boolean).map(t => { const q = t.match(/^\{([pgobrPG]):([^}]*)\}$/); return q ? [q[2], FMA[q[1]]] : [t]; });
  const PHI_B = 0.375, N_B = 30;
  const binom = (n, p) => { const out = []; let c = 1; for (let k = 0; k <= n; k++) { out.push(c * p ** k * (1 - p) ** (n - k)); c = c * (n - k) / (k + 1); } return out; };
  // a small sampling-law sketch: bell, light area, centre line + label, interval under it (green: around the estimate)
  function miniBell(parent, o) {
    const g = S('g', {}, parent), { cx, base, sx, peak } = o, z1 = -3.4, z2 = 3.4;
    const X = z => cx + z * sx, Y = z => base - peak * Math.exp(-z * z / 2);
    let d = ''; for (let i = 0; i <= 120; i++) { const z = z1 + (z2 - z1) * i / 120; d += (i ? 'L' : 'M') + X(z).toFixed(1) + ' ' + Y(z).toFixed(1); }
    S('path', { d: d + `L${X(z2)} ${base}L${X(z1)} ${base}Z`, class: 'ic-area-' + (o.k || 'g') }, g);
    S('path', { d, class: 'ic-curve-' + (o.k || 'g') }, g);
    S('line', { x1: X(z1) - 30, x2: X(z2) + 30, y1: base, y2: base, class: 'axl' }, g);
    S('line', { x1: cx, x2: cx, y1: base, y2: base - peak - 20, class: o.k === 'k' ? 'ic-musolid' : 'ic-msolid' }, g);
    tx(g, cx, base - peak - 34, FM(o.center), { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 700 });
    const w = 1.96 * sx, y = base + 54;
    S('line', { x1: cx - w, x2: cx + w, y1: y, y2: y, class: 'ic-seg' + (o.k === 'k' ? ' p' : '') }, g);
    [-1, 1].forEach(sg => S('path', { d: `M${cx + sg * w - sg * 16} ${y - 22}L${cx + sg * w} ${y - 22}L${cx + sg * w} ${y + 22}L${cx + sg * w - sg * 16} ${y + 22}`, class: 'ic-br' + (o.k === 'k' ? ' p' : '') }, g));
    S('circle', { cx, cy: y, r: 8, class: 'ic-dot' }, g);
    if (o.half) {   // the half-width, an arrow from the centre to the right bracket
      S('line', { x1: cx + 10, x2: cx + w - 10, y1: y + 44, y2: y + 44, class: 'est-arr' }, g);
      arrowHead(g, cx + w - 6, y + 44, 0, 'est-arr-h', 12);
      tx(g, cx + w / 2, y + 84, FM(o.half), { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 600 });
    }
    return g;
  }
  // bars of a discrete law on [x0, x1]: values[i] at position pos(i)
  function lawBars(parent, o) {
    const g = S('g', {}, parent), top = Math.max(...o.values);
    S('line', { x1: o.x0 - 20, x2: o.x1 + 20, y1: o.base, y2: o.base, class: 'axl' }, g);
    o.values.forEach((v, i) => {
      const x = o.x0 + (o.x1 - o.x0) * o.pos(i), h = v / top * o.h;
      S('rect', { x: x - o.w / 2, y: o.base - h, width: o.w, height: h, class: o.cls }, g);
    });
    (o.ticks || []).forEach(([p, lab]) => {
      const x = o.x0 + (o.x1 - o.x0) * p;
      S('line', { x1: x, x2: x, y1: o.base, y2: o.base + 8, class: 'axl' }, g);
      tx(g, x, o.base + 36, FM(lab), { 'text-anchor': 'middle', 'font-size': 26 });
    });
    if (o.title) tx(g, (o.x0 + o.x1) / 2, o.base + 80, FM(o.title), { 'text-anchor': 'middle', 'font-size': 26, class: 't-ax' });
    return g;
  }
  function formulaScene(name, cfg) {
    stepped(name, {
      labels: cfg.steps.map((_, i) => cfg.prefix + (i + 1)),
      build(svg) {
        const m = { blocks: [] };
        tx(svg, 60, 90, FM(cfg.title), { class: 't-title' });
        cfg.steps.forEach(st => {
          const g = S('g', {}, svg);
          (st.lines || []).forEach(l => {
            if (l.box) box(g, l.box[0], l.box[1], l.box[2], l.box[3], l.boxCls || 'est-box', 12);
            if (l.bullet) S('circle', { cx: l.x - 26, cy: l.y - 11, r: 6, class: 'f-bullet' }, g);
            tx(g, l.x, l.y, FM(l.t), Object.assign({ 'font-size': l.size || 32, 'font-weight': l.w || 500 }, l.anchor ? { 'text-anchor': l.anchor } : {}));
          });
          if (st.draw) st.draw(g);
          m.blocks.push(g);
        });
        return m;
      },
      pose(m, k) { clean(m.svg); m.blocks.forEach((g, i) => vis(g, i <= k)); },
      play(m, k, c) {
        const g = m.blocks[k], kids = [...g.children];
        g.style.opacity = '';
        kids.forEach((e, i) => { e.style.opacity = 0; c.at(i * 140, () => c.anim(e, { opacity: [0, 1], translateY: [14, 0], duration: T(450), ease: 'out(3)' })); });
        return kids.length * 140 + 500;
      }
    });
  }
