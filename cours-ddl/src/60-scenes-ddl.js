
  /* ==========================================================
     COURS 2 · LES DEGRÉS DE LIBERTÉ
     Déroulé validé par le tuteur (9 stations, 33 clics) :
       TITRE · RAPPEL (3) · MAINS (5) · ECARTS (3) · CARRES (4) · PONT (4) · ESSAI (4) · COURBE (6) · REGLE (3)
     ========================================================== */

  /* ---------- données : un objet par source, lu par toutes les diapos ----------
     D     : 5 largeurs de main prises dans G1 du premier cours (valeurs simulées là-bas ;
             population μ = 70 mm, σ² = 22,5 mm²). Tout le reste en est calculé.
     ESSAI : document « La loi de Student, pas à pas » (10 + 10 patients, 132 et 140 mmHg, s = 8,
             t = 2,24, ν = 18, seuil 2,10). Les 20 tensions individuelles sont FABRIQUÉES, avec
             exactement ces moyennes et ce s (somme des carrés 582 + 570 = 1 152 = 18 × 64). */
  const D = (() => {
    const v = [68, 73, 65, 75, 74], N = v.length;
    const me = v.reduce((a, b) => a + b, 0) / N;                       // 71
    const ec = v.map(x => x - me);                                     // −3, +2, −6, +4, +3
    const SC = ec.reduce((a, e) => a + e * e, 0);                      // 74
    const mu = 70, ecMu = v.map(x => x - mu);                          // −2, +3, −5, +5, +4
    const SCmu = ecMu.reduce((a, e) => a + e * e, 0);                  // 79
    const order = v.map((_, i) => i).sort((a, b) => v[a] - v[b]);      // 65, 68, 73, 74, 75
    return { v, N, me, ec, SC, Se2: SC / N, s2: SC / (N - 1), mu, ecMu, SCmu, order,
             free: [62, 77, 66, 79, 69],   // MAINS : les 5 valeurs encore libres, avant la contrainte
             park: 78,                     // MAINS (M3) : la 5ᵉ, toujours libre, se tient à l'écart
             last: 4, other: 2 };          // la valeur imposée (74), puis une autre (65)
  })();
  const ESSAI = (() => {
    const A = [121, 123, 126, 127, 131, 132, 134, 139, 143, 144];
    const B = [125, 128, 137, 139, 141, 144, 145, 146, 147, 148];
    const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
    const m1 = mean(A), m2 = mean(B);
    const SC = A.reduce((s, x) => s + (x - m1) ** 2, 0) + B.reduce((s, x) => s + (x - m2) ** 2, 0);
    const nu = A.length + B.length - 2;
    return { A, B, m1, m2, n1: A.length, n2: B.length, nu, s: Math.sqrt(SC / nu), t: 2.24, hollowA: 9, hollowB: 0 };
  })();
  // Seuils de Student au risque 5 % (bilatéral, quantile 0,975), recalculés ; Gauss : 1,960
  const TQ = { 4: 2.7764, 9: 2.2622, 16: 2.1199, 17: 2.1098, 18: 2.1009, 19: 2.0930, 20: 2.0860, 29: 2.0452, 198: 1.9720 };
  const Z975 = 1.960;
  console.assert(D.me === 71 && D.SC === 74 && D.SCmu === 79 && ESSAI.m1 === 132 && ESSAI.m2 === 140 && ESSAI.s === 8 && ESSAI.nu === 18,
    '[ddl] données incohérentes');

  /* ---------- petits outils ---------- */
  const GR = { class: 't-green' }, OR = { class: 't-or' }, PO = { class: 't-pop' };
  // {p:…} gris, {g:…} vert, {o:…} orange, {u:…} bleu, {b:…} gras, {r:…} rouge ; majuscule = en gras
  const FMA = { p: PO, g: GR, o: OR, u: { class: 't-blue' }, b: { 'font-weight': 700 }, r: { class: 't-red' },
    P: { class: 't-pop', 'font-weight': 700 }, G: { class: 't-green', 'font-weight': 700 },
    O: { class: 't-or', 'font-weight': 700 }, U: { class: 't-blue', 'font-weight': 700 } };
  const FM = s => s.split(/(\{[pgourbPGOU]:[^}]*\})/).filter(Boolean)
    .map(t => { const q = t.match(/^\{([pgourbPGOU]):([^}]*)\}$/); return q ? [q[2], FMA[q[1]]] : [t]; });
  const sgn = e => (e > 0 ? '+' : e < 0 ? '−' : '') + Math.abs(e);
  const clamp01 = t => Math.max(0, Math.min(1, t));
  // a smooth walk through waypoints (t in 0…1)
  function along(p, t) {
    const n = p.length - 1, u = Math.min(n - 1e-9, clamp01(t) * n), i = Math.floor(u), f = u - i;
    return lerp(p[i], p[i + 1], f * f * (3 - 2 * f));
  }
  function setXY(el, x, y) { el.setAttribute('x', x); el.setAttribute('y', y); }
  function setLine(el, x1, y1, x2, y2) { el.setAttribute('x1', x1); el.setAttribute('y1', y1); el.setAttribute('x2', x2); el.setAttribute('y2', y2); }
  function stickAt(r, x, base, h, w = 18) {
    r.setAttribute('x', x - w / 2); r.setAttribute('y', base - h); r.setAttribute('width', w); r.setAttribute('height', Math.max(0, h));
  }
  const triPath = (x, base, h = 26, hw = 14) => `M${x} ${base + 2}L${x + hw} ${base + 2 + h}L${x - hw} ${base + 2 + h}Z`;
  // une flèche horizontale de x1 vers x2 (la pointe est en x2)
  function hArrow(parent, cls = 'ecart', hcls = 'ecart-h') {
    const g = S('g', {}, parent), line = S('line', { class: cls }, g), head = S('polygon', { class: hcls }, g);
    return { g, line, head, set(x1, x2, y, hs = 18) {
      const dir = x2 >= x1 ? 1 : -1, len = Math.abs(x2 - x1), h = Math.min(hs, len * 0.7), w = h * 0.6;
      setLine(line, x1, y, x2 - dir * h * 0.7, y);
      head.setAttribute('points', `${x2},${y} ${x2 - dir * h},${y - w} ${x2 - dir * h},${y + w}`);
      head.setAttribute('visibility', len < 2 ? 'hidden' : 'visible');
    } };
  }
  // une double flèche ↔ (valeur encore libre, ou écart entre deux moyennes)
  function dblArrow(parent, cls = 'barr', hcls = 'barr-h') {
    const g = S('g', {}, parent), line = S('line', { class: cls }, g);
    const h1 = S('polygon', { class: hcls }, g), h2 = S('polygon', { class: hcls }, g);
    return { g, set(a, b, y, hs = 14) {
      const k = hs * 0.6;
      setLine(line, a + hs * 0.7, y, b - hs * 0.7, y);
      h1.setAttribute('points', `${a},${y} ${a + hs},${y - k} ${a + hs},${y + k}`);
      h2.setAttribute('points', `${b},${y} ${b - hs},${y - k} ${b - hs},${y + k}`);
    } };
  }
  // la moyenne d'un échantillon : trait orange, triangle sous l'axe, étiquette (jamais une barre)
  function meanMark(parent, label, o = {}) {
    const g = S('g', {}, parent);
    const line = S('line', { class: (o.lineCls || 'mline') + ' grow' }, g);
    const tri = o.tri === false ? null : S('path', { class: 'mtri' }, g);
    const lbl = tx(g, 0, 0, label, { 'text-anchor': o.anchor || 'middle', 'font-size': o.size || 30, 'font-weight': 600, class: o.txt || 't-or' });
    return { g, line, tri, lbl, set(x, top, base, lx, ly) {
      setLine(line, x, top, x, base);
      if (tri) tri.setAttribute('d', triPath(x, base));
      setXY(lbl, lx ?? x, ly ?? top - 14);
    } };
  }
  function meanGrow(c, mk, d = 0) {
    mk.g.style.opacity = '';
    const rest = [mk.tri, mk.lbl].filter(Boolean);
    utils.set(mk.line, { scaleY: 0 }); rest.forEach(e => { e.style.opacity = 0; });
    c.anim(mk.line, { scaleY: [0, 1], duration: T(600), delay: T(d), ease: 'out(3)' });
    if (mk.tri) c.anim(mk.tri, { opacity: [0, 1], translateY: [12, 0], duration: T(400), delay: T(d + 300), ease: 'out(2)' });
    c.anim(mk.lbl, { opacity: [0, 1], duration: T(400), delay: T(d + 450) });
  }
  function popIn(c, el, d = 0, from = 1.35) {
    c.at(d, () => { el.style.opacity = ''; });
    el.style.opacity = 0;
    c.anim(el, { opacity: [0, 1], scale: [from, 1], duration: T(550), delay: T(d), ease: 'out(3)' });
  }
  function riseIn(c, el, d = 0, dur = 450) {
    el.style.opacity = 0;
    c.anim(el, { opacity: [0, 1], translateY: [14, 0], duration: T(dur), delay: T(d), ease: 'out(3)' });
  }
  function bullet(parent, x, y) { return S('circle', { cx: x - 26, cy: y - 11, r: 6, class: 'f-bullet' }, parent); }

  // Un écart par ligne, chacun partant de mₑ. Lignes alternées droite / gauche, la plus longue en haut
  // de chaque côté : aucun trait vertical ne croise une autre flèche.
  function rowIndex(i) {
    const side = right => D.v.map((_, j) => j).filter(j => (D.v[j] > D.me) === right).sort((a, b) => Math.abs(D.ec[b]) - Math.abs(D.ec[a]));
    const R = side(true), L = side(false), seq = [];
    for (let k = 0; k < Math.max(R.length, L.length); k++) { if (R[k] != null) seq.push(R[k]); if (L[k] != null) seq.push(L[k]); }
    return seq.indexOf(i);
  }
  function makeRows(parent, X, rowY, stickTop, o = {}) {
    const size = o.size || 30;
    return D.v.map((v, i) => {
      const y = rowY(rowIndex(i)), g = S('g', {}, parent);
      const guide = o.guides === false ? null : S('line', { class: 'guide-v' }, g);
      const a = hArrow(g, 'ecart', 'ecart-h');
      const mk = txt => tx(g, 0, 0, txt, { 'font-size': size, 'font-weight': 700, class: 't-blue' });
      const lab = mk(sgn(v - D.me)), lab2 = o.mu ? mk(sgn(v - D.mu)) : null;
      const row = { g, a, lab, lab2, guide, y, i, v,
        place(center, tip = X(v)) {
          const x0 = X(center), e = v - center, side = e > 0 ? 1 : -1;
          a.set(x0, tip, y, o.hs || 18);
          [lab, lab2].filter(Boolean).forEach(l => { setXY(l, X(v) + side * 14, y + size * 0.36); l.setAttribute('text-anchor', side > 0 ? 'start' : 'end'); });
          if (guide) setLine(guide, X(v), y + 12, X(v), stickTop - 6);
        } };
      row.place(D.me);
      return row;
    });
  }

  /* ======================= TITRE ======================= */
  stepped('titre', {
    labels: ['titre'],
    build(svg) {
      const m = {};
      m.title = tx(svg, 960, 540, 'Les degrés de liberté', { 'text-anchor': 'middle', 'font-size': 110, 'font-weight': 700, 'letter-spacing': '-2' });
      m.sub = tx(svg, 960, 625, '~Combien de valeurs ont encore le droit de bouger ?~', { 'text-anchor': 'middle', 'font-size': 40, class: 't-pop' });
      m.foot = tx(svg, 960, 930, 'Tutorat PASS · UE4 Biostatistiques - Esteban Mora', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.title, m.sub, m.foot], k >= 0); },
    play(m, k, c) {
      c.anim(m.title, { opacity: [0, 1], translateY: [40, 0], duration: T(900), ease: 'out(3)' });
      fadeIn(c, m.sub, 700, 700);
      fadeIn(c, m.foot, 1100, 600);
      return 1800;
    }
  });

  /* ======================= RAPPEL · vous l'avez déjà vu =======================
     R1 trois formules du premier cours · R2 chaque « N − 1 » s'allume · R3 la question */
  stepped('rappel', {
    labels: ['R1', 'R2', 'R3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Vous l\'avez déjà vu', { class: 't-title' });
      m.hlG = S('g', {}, svg);
      m.rows = S('g', {}, svg);
      const HL = (s, id) => [s, { 'data-hl': id, 'font-weight': 700 }];
      const L = 160;
      const lab = (y, s) => tx(m.rows, L, y, FM(s), { 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      const big = (y, segs) => tx(m.rows, L, y, segs, { 'font-size': 56, 'font-weight': 500 });
      const note = (y, segs) => tx(m.rows, L, y, segs, { 'font-size': 30, 'font-weight': 500 });
      m.items = [
        [lab(260, 'Estimer {p:~σ~²}'),
         big(330, [['~s~²', GR], [' = '], ['~S~_e²', OR], [' · ~N~ / ('], HL('~N~ − 1', 'a'), [')']])],
        [lab(480, 'IC d\'une moyenne, {p:~σ~} inconnu'),
         big(550, [['~m~', GR], [' ± ~t~(~α~) · '], ['~s~', GR], [' / √~N~']]),
         note(604, [['~t~ : loi de Student à '], HL('~N~ − 1', 'a'), [' ddl']])],
        [lab(710, 'IC d\'une variance'),
         big(780, [['[ ('], HL('~N~ − 1', 'a'), [')'], ['~s~²', GR], [' / ~χ~²(~α~/2) ; ('], HL('~N~ − 1', 'b'), [')'], ['~s~²', GR], [' / ~χ~²(1 − ~α~/2) ]']]),
         note(834, [['~χ~² à '], HL('~N~ − 1', 'a'), [' ddl']])],
      ];
      // one highlight per « N − 1 » (positions measured from the rendered text, in pose)
      m.hls = [];
      m.items.flat().forEach(t => {
        const ids = [...new Set([...t.querySelectorAll('tspan[data-hl]')].map(s => s.dataset.hl))];
        ids.forEach(id => m.hls.push({ t, id, r: S('rect', { class: 'hl growx', rx: 8 }, m.hlG) }));
      });
      m.q = tx(svg, 960, 975, 'Pourquoi ~N~ − 1 ?', { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 700 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.hls.forEach(h => {
        const sp = [...h.t.querySelectorAll(`tspan[data-hl="${h.id}"]`)];
        try {
          const x0 = sp[0].getStartPositionOfChar(0).x, last = sp[sp.length - 1];
          const x1 = last.getEndPositionOfChar(last.getNumberOfChars() - 1).x;
          const fs = parseFloat(h.t.getAttribute('font-size')), y = +h.t.getAttribute('y');
          h.r.setAttribute('x', x0 - 4); h.r.setAttribute('width', x1 - x0 + 8);
          h.r.setAttribute('y', y - fs * 0.86); h.r.setAttribute('height', fs * 1.14);
        } catch (e) {}
      });
      vis(m.rows, k >= 0);
      vis(m.hlG, k >= 1);
      vis(m.q, k >= 2);
    },
    play(m, k, c) {
      if (k === 0) { m.rows.style.opacity = ''; m.items.forEach((it, i) => it.forEach(t => riseIn(c, t, i * 380, 500))); return 1700; }
      if (k === 1) {
        m.hlG.style.opacity = '';
        m.hls.forEach((h, i) => { utils.set(h.r, { scaleX: 0 }); c.anim(h.r, { scaleX: [0, 1], duration: T(450), delay: T(i * 260), ease: 'out(3)' }); });
        return m.hls.length * 260 + 500;
      }
      popIn(c, m.q, 0, 1.15); return 700;
    }
  });

  /* ======================= MAINS · le jeu des 5 mains =======================
     M1 5 valeurs libres (elles se promènent) · M2 on impose mₑ = 71 mm · M3 quatre valeurs se posent
     M4 la 5ᵉ n'a plus le choix (bâton vide) : 4 = N − 1 · M5 ce n'est pas LA 5ᵉ : n'importe laquelle */
  const HX = { x0: 200, x1: 1400, d0: 60, d1: 80 };   // 60 px par mm, le même axe sur MAINS et ECARTS
  const HB = 760, HH = 150;                            // ligne de base, hauteur d'un bâton (effectif 1)
  function makeStick(parent) {
    const g = S('g', {}, parent);
    const f = S('rect', { class: 'sq grow' }, g), h = S('rect', { class: 'stick-h' }, g);
    const lab = tx(g, 0, 0, '', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 500, class: 't-blue' });
    const dbl = dblArrow(g);
    return { g, f, h, lab, dbl, set(x, val) {
      stickAt(f, x, HB, HH); stickAt(h, x, HB, HH);
      setXY(lab, x, HB - HH - 16); if (val != null) lab.textContent = val;
      dbl.set(x - 34, x + 34, HB - HH - 30);
    } };
  }
  stepped('mains', {
    labels: ['M1', 'M2', 'M3', 'M4', 'M5'],
    build(svg) {
      const m = {}, X = m.X = geoX(HX);
      m.title = tx(svg, 60, 90, 'Le jeu des 5 mains (~N~ = 5)', { class: 't-title' });
      m.def = tx(svg, 60, 165, FM('{b:1 degré de liberté (ddl)} = 1 valeur qui peut encore bouger'), { 'font-size': 36 });
      m.axis = makeAxis(svg, range(60, 80, 1), v => v % 2 === 0, 'Largeur de la main (mm)');
      m.axis.layout(X, HB, { ldy: 38, tdy: 84 });
      m.mean = meanMark(svg, '~m~_e = 71 mm');
      m.mean.set(X(D.me), 440, HB, X(D.me), 420);
      m.st = D.v.map(v => makeStick(svg));
      m.cLab = tx(svg, 1660, 380, 'valeurs libres', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 600 });
      m.c5 = tx(svg, 1660, 575, String(D.N), { 'text-anchor': 'middle', 'font-size': 190, 'font-weight': 700, class: 't-blue' });
      m.c4 = tx(svg, 1660, 575, String(D.N - 1), { 'text-anchor': 'middle', 'font-size': 190, 'font-weight': 700, class: 't-blue' });
      m.cN = tx(svg, 1660, 665, '= ~N~ − 1', { 'text-anchor': 'middle', 'font-size': 54, 'font-weight': 600 });
      const calc = skip => FM(`${D.N} × {o:${D.me}} − (${D.v.filter((_, i) => i !== skip).join(' + ')}) = {U:${D.v[skip]}}`);
      m.f1 = tx(svg, 800, 975, calc(D.last), { 'text-anchor': 'middle', 'font-size': 42, 'font-weight': 500 });
      m.f2 = tx(svg, 800, 975, calc(D.other), { 'text-anchor': 'middle', 'font-size': 42, 'font-weight': 500 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const X = m.X, imposed = k === 3 ? D.last : k >= 4 ? D.other : -1;
      vis([m.title, m.axis.g, m.cLab], k >= 0);
      vis(m.mean.g, k >= 1);
      vis(m.c5, k >= 0 && k <= 2); vis([m.c4, m.cN, m.def], k >= 3);
      vis(m.f1, k === 3); vis(m.f2, k >= 4);
      m.st.forEach((s, i) => {
        const landed = k >= 3 || (k >= 2 && i !== D.last);
        s.set(X(landed ? D.v[i] : k === 2 ? D.park : D.free[i]), D.v[i]);
        vis(s.g, k >= 0);
        vis(s.f, i !== imposed); vis(s.h, i === imposed);
        vis(s.lab, landed); vis(s.dbl.g, !landed);
        s.lab.setAttribute('font-weight', i === imposed ? 700 : 500);
        s.lab.setAttribute('font-size', i === imposed ? 34 : 28);
      });
    },
    play(m, k, c) {
      const X = m.X;
      if (k === 0) {
        fadeIn(c, m.title, 0, 500); fadeIn(c, m.axis.g, 100, 500);
        const r = seeded(17), paths = D.free.map(f => [61 + r() * 18, 61 + r() * 18, 61 + r() * 18, f]);
        m.st.forEach((s, i) => {
          s.g.style.opacity = ''; vis(s.dbl.g, false);
          s.set(X(paths[i][0]));
          utils.set(s.f, { scaleY: 0 });
          c.at(400 + i * 110, () => c.anim(s.f, { scaleY: [0, 1], duration: T(500), ease: 'out(3)' }));
        });
        // elles se promènent librement, chacune à son rythme, puis s'arrêtent
        tweenT(c, 2800, 900, t => m.st.forEach((s, i) => s.set(X(along(paths[i], clamp01((t - i * 0.03) / 0.88))))), 'linear');
        fadeIn(c, m.st.map(s => s.dbl.g), 3700, 400);
        fadeIn(c, [m.cLab, m.c5], 1300, 500);
        return 4200;
      }
      if (k === 1) { meanGrow(c, m.mean, 0); return 1100; }
      if (k === 2) {
        const f = m.st[D.last];   // la 5ᵉ reste libre : elle s'écarte pour laisser la place
        tweenT(c, 900, 0, t => f.set(X(lerp(D.free[D.last], D.park, t))));
        D.v.map((_, i) => i).filter(i => i !== D.last).forEach((i, j) => {
          const s = m.st[i], d = j * 700;
          fadeOut(c, s.dbl.g, d, 250);
          tweenT(c, 650, d, t => s.set(X(lerp(D.free[i], D.v[i], t))));
          c.at(d + 600, () => { s.lab.style.opacity = ''; c.anim(s.lab, { opacity: [0, 1], translateY: [8, 0], duration: T(300), ease: 'out(2)' }); });
        });
        return 3200;
      }
      if (k === 3) {
        const s = m.st[D.last], x0 = D.park, x1 = D.v[D.last];
        fadeOut(c, s.dbl.g, 0, 250);
        // elle essaie de bouger… puis elle est tirée jusqu'à la seule valeur possible
        tweenT(c, 1000, 0, t => s.set(X(x0 + 1.6 * Math.sin(t * Math.PI * 4) * (1 - t))), 'linear');
        tweenT(c, 800, 1100, t => s.set(X(lerp(x0, x1, t))));
        fadeIn(c, s.h, 1700, 500); fadeOut(c, s.f, 1700, 500);
        c.at(1900, () => { s.lab.setAttribute('font-weight', 700); s.lab.setAttribute('font-size', 34); s.lab.style.opacity = '';
          c.anim(s.lab, { opacity: [0, 1], translateY: [8, 0], duration: T(300), ease: 'out(2)' }); });
        fadeOut(c, m.c5, 2300, 300);
        popIn(c, m.c4, 2500);
        fadeIn(c, m.cN, 2900, 400);
        fadeIn(c, m.f1, 3100, 500);
        riseIn(c, m.def, 3800, 500);
        return 4400;
      }
      // k === 4 : une autre valeur aurait pu être la dernière
      const a = m.st[D.last], b = m.st[D.other];
      fadeOut(c, a.h, 0, 500); fadeIn(c, a.f, 0, 500);
      fadeIn(c, b.h, 400, 500); fadeOut(c, b.f, 400, 500);
      c.at(400, () => { a.lab.setAttribute('font-weight', 500); a.lab.setAttribute('font-size', 28); b.lab.setAttribute('font-weight', 700); b.lab.setAttribute('font-size', 34); });
      fadeOut(c, m.f1, 0, 400); fadeIn(c, m.f2, 600, 500);
      return 1300;
    }
  });

  /* ======================= ECARTS · les écarts s'équilibrent =======================
     E1 les 5 écarts à mₑ · E2 l'expérience de la balance : le triangle de mₑ est le point d'appui,
     la planche ne tient à l'horizontale que sur mₑ ; Σ(xᵢ − mₑ) = 0 · E3 un écart caché se retrouve */
  stepped('ecarts', {
    labels: ['E1', 'E2', 'E3'],
    build(svg) {
      const m = {}, X = m.X = geoX(HX), top = HB - HH;
      tx(svg, 60, 90, 'Les écarts à la moyenne', { class: 't-title' });
      m.beam = S('g', {}, svg);          // tout ce qui repose sur la planche (elle bascule en E2)
      m.axis = makeAxis(m.beam, range(60, 80, 1), v => v % 2 === 0, 'Largeur de la main (mm)');
      m.axis.layout(X, HB, { ldy: 38, tdy: 84 });
      m.sticks = D.v.map(v => { const r = S('rect', { class: 'sq grow' }, m.beam); stickAt(r, X(v), HB, HH); return r; });
      m.mean = meanMark(m.beam, '~m~_e = 71 mm', { tri: false });
      m.mean.set(X(D.me), 270, HB, X(D.me), 250);
      m.rows = makeRows(m.beam, X, r => 300 + r * 62, top, { size: 34 });
      m.tri = S('path', { class: 'mtri' }, svg);   // le point d'appui : il reste sous la planche
      m.q = tx(svg, 0, 0, '?', { 'font-size': 44, 'font-weight': 700, class: 't-blue' });
      const rl = m.rows[D.last]; setXY(m.q, X(D.v[D.last]) + 14, rl.y + 15);
      const byVal = D.order.map(i => D.ec[i]);
      m.sum = tx(svg, 800, 975, FM(`{u:${byVal.map(sgn).join(' ').replace(/ \+/g, ' + ').replace(/ −/g, ' − ')}} = {b:0}`), { 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 500 });
      const known = D.order.filter(i => i !== D.last).map(i => D.ec[i]), ks = known.reduce((a, b) => a + b, 0);
      m.calc = tx(svg, 800, 975, FM(`{u:${known.map(sgn).join(' ').replace(/ \+/g, ' + ').replace(/ −/g, ' − ')}} = {u:${sgn(ks)}}, donc la dernière vaut {U:${sgn(-ks)}}`), { 'text-anchor': 'middle', 'font-size': 42, 'font-weight': 500 });
      m.sigma = tx(svg, 1665, 470, [['Σ(~x~_i − '], ['~m~_e', OR], [') = 0']], { 'text-anchor': 'middle', 'font-size': 54, 'font-weight': 600 });
      m.always = tx(svg, 1665, 530, 'toujours', { 'text-anchor': 'middle', 'font-size': 32, class: 't-pop' });
      m.free = tx(svg, 1665, 690, FM('{U:~N~ − 1 = 4}'), { 'text-anchor': 'middle', 'font-size': 64 });
      m.freeL = tx(svg, 1665, 745, 'écarts libres', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 600 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.beam.removeAttribute('transform');
      m.tri.setAttribute('d', triPath(m.X(D.me), HB));
      vis([m.beam, m.tri], k >= 0);
      vis([m.sigma, m.always], k >= 1);
      vis(m.sum, k === 1); vis(m.calc, k >= 2);
      vis([m.free, m.freeL], k >= 2);
      vis(m.q, false);
    },
    play(m, k, c) {
      const X = m.X;
      if (k === 0) {
        m.beam.style.opacity = '';
        fadeIn(c, [m.axis.g, m.tri], 0, 500);
        m.sticks.forEach((s, i) => { utils.set(s, { scaleY: 0 }); c.anim(s, { scaleY: [0, 1], duration: T(500), delay: T(200 + i * 100), ease: 'out(3)' }); });
        meanGrow(c, m.mean, 700);
        m.rows.forEach((r, j) => {
          const d = 1400 + rowIndex(r.i) * 300;
          [r.lab, r.guide, r.a.g].forEach(e => { e.style.opacity = 0; });
          c.at(d, () => { r.a.g.style.opacity = ''; });
          r.a.set(X(D.me), X(D.me), r.y);
          tweenT(c, 600, d, t => r.a.set(X(D.me), lerp(X(D.me), X(r.v), t), r.y));
          fadeIn(c, [r.lab, r.guide], d + 500, 300);
        });
        return 2900;
      }
      if (k === 1) {
        // le point d'appui glisse : la planche penche du côté le plus lourd, et ne tient droite que sur mₑ
        const rot = f => Math.max(-8, Math.min(8, 1.25 * (D.me - f)));
        fadeOut(c, [m.mean.line, m.mean.lbl], 0, 300);
        tweenT(c, 3600, 300, t => {
          const f = along([D.me, 64, 77.5, D.me], t);
          m.tri.setAttribute('d', triPath(X(f), HB));
          m.beam.setAttribute('transform', `rotate(${rot(f).toFixed(3)} ${X(f).toFixed(1)} ${HB + 2})`);
        }, 'linear');
        fadeIn(c, [m.mean.line, m.mean.lbl], 4000, 400);
        fadeIn(c, m.sum, 4300, 500);
        fadeIn(c, [m.sigma, m.always], 4800, 500);
        return 5400;
      }
      // k === 2 : on cache un écart ; les quatre autres le retrouvent
      const r = m.rows[D.last];
      c.anim([r.a.g, r.lab, r.guide], { opacity: [1, 0.12], duration: T(400), ease: 'out(2)' });
      fadeIn(c, m.q, 400, 300);
      fadeOut(c, m.sum, 0, 300); fadeIn(c, m.calc, 700, 500);
      c.at(2000, () => c.anim([r.a.g, r.lab, r.guide], { opacity: [0.12, 1], duration: T(500), ease: 'out(2)' }));
      fadeOut(c, m.q, 2000, 300);
      fadeIn(c, [m.free, m.freeL], 2600, 500);
      return 3200;
    }
  });

  /* ======================= CARRES · d'où le N − 1 de s² =======================
     C1 chaque écart devient un carré (même échelle) : somme 74 mm² · C2 Sₑ² = 74 / 5
     C3 s² = 74 / 4 (= Sₑ² × N/(N − 1), la formule du premier cours)
     C4 si μ = 70 était connu : écarts à μ, 79 > 74 ; mₑ donne les écarts les plus petits possibles */
  const CX = { x0: 140, x1: 1040, d0: 60, d1: 80 };   // 45 px par mm, carrés à la même échelle
  const CB = 470, CHT = 80, SQB = 900, SQGAP = 36;
  stepped('carres', {
    labels: ['C1', 'C2', 'C3', 'C4'],
    build(svg) {
      const m = {}, X = m.X = geoX(CX), ppm = (CX.x1 - CX.x0) / (CX.d1 - CX.d0), top = CB - CHT;
      tx(svg, 60, 90, [['D\'où le ~N~ − 1 de '], ['~s~²', GR]], { class: 't-title' });
      m.chart = S('g', {}, svg);
      m.axis = makeAxis(m.chart, range(60, 80, 1), v => v % 2 === 0, 'Largeur de la main (mm)');
      m.axis.layout(X, CB, { ldy: 36, tdy: 76 });
      m.axis.labels.forEach(l => l.setAttribute('font-size', 20)); if (m.axis.tt) m.axis.tt.setAttribute('font-size', 24);
      D.v.forEach(v => stickAt(S('rect', { class: 'sq' }, m.chart), X(v), CB, CHT, 14));
      m.mean = meanMark(m.chart, '~m~_e = 71', { size: 26, anchor: 'start' });
      m.mean.set(X(D.me), 190, CB, X(D.me) + 10, 205);
      m.mu = meanMark(svg, '~μ~ = 70', { size: 26, anchor: 'end', lineCls: 'mu-solid', tri: false, txt: 't-pop' });
      m.mu.set(X(D.mu), 190, CB, X(D.mu) - 10, 205);
      m.rows = makeRows(m.chart, X, r => 232 + r * 34, top, { size: 24, mu: true, hs: 14 });
      // squares, left to right in the axis order ; side = |écart| at the same scale (ppm px per mm)
      const lay = es => { let x = CX.x0; return D.order.map(i => { const s = Math.abs(es[i]) * ppm, o = { x, s }; x += s + SQGAP; return o; }); };
      m.layMe = lay(D.ec); m.layMu = lay(D.ecMu);
      m.sq = D.order.map((i, j) => {
        const g = S('g', {}, svg);
        const rect = S('rect', { class: 'sqr' }, g), edge = S('line', { class: 'ecart' }, g);
        const fs = s => Math.round(24 + s * 0.11);
        const nMe = tx(g, 0, 0, String(D.ec[i] ** 2), { 'text-anchor': 'middle', 'font-weight': 700, class: 't-blue' });
        const nMu = tx(g, 0, 0, String(D.ecMu[i] ** 2), { 'text-anchor': 'middle', 'font-weight': 700, class: 't-pop' });
        const fly = S('line', { class: 'ecart' }, svg);
        const q = { g, rect, edge, nMe, nMu, fly, i, set(x, s, h = s) {
          rect.setAttribute('x', x); rect.setAttribute('width', s); rect.setAttribute('y', SQB - h); rect.setAttribute('height', Math.max(0, h));
          setLine(edge, x, SQB, x + s, SQB);
          [nMe, nMu].forEach(n => { setXY(n, x + s / 2, SQB - h / 2 + fs(s) * 0.36); n.setAttribute('font-size', fs(s)); });
        } };
        q.set(m.layMe[j].x, m.layMe[j].s);
        return q;
      });
      const cx = (CX.x0 + m.layMe[4].x + m.layMe[4].s) / 2;
      m.sumMe = tx(svg, cx, 985, FM(`{u:${D.order.map(i => D.ec[i] ** 2).join(' + ')}} = {b:${D.SC} mm²}`), { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 500 });
      m.sumMu = tx(svg, cx + 20, 985, FM(`{p:${D.order.map(i => D.ecMu[i] ** 2).join(' + ')}} = {P:${D.SCmu} mm²}`), { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 500 });
      const R = 1190;
      m.se = S('g', {}, svg);
      tx(m.se, R, 560, FM(`{o:~S~_e²} = ${D.SC} / ${D.N} = {O:${fr(D.Se2)}} mm²`), { 'font-size': 50, 'font-weight': 500 });
      tx(m.se, R, 612, FM(`{p:on divise par ~N~ = ${D.N} écarts}`), { 'font-size': 28 });
      m.s2 = S('g', {}, svg);
      tx(m.s2, R, 740, FM(`{g:~s~²} = ${D.SC} / ${D.N - 1} = {G:${fr(D.s2)}} mm²`), { 'font-size': 50, 'font-weight': 500 });
      tx(m.s2, R, 792, FM(`{p:mais seuls ~N~ − 1 = ${D.N - 1} sont libres}`), { 'font-size': 28 });
      tx(m.s2, R, 856, FM(`= {o:~S~_e²} × ~N~ / (~N~ − 1) = ${fr(D.Se2)} × ${D.N}/${D.N - 1}`), { 'font-size': 30, 'font-weight': 500 });
      m.muTxt = S('g', {}, svg);
      tx(m.muTxt, R, 330, FM(`Si {P:~μ~ = ${D.mu}} était connu : {P:${D.SCmu}} > ${D.SC}`), { 'font-size': 42, 'font-weight': 500 });
      tx(m.muTxt, R, 384, FM('{o:~m~_e} donne les écarts les plus petits possibles'), { 'font-size': 30, 'font-weight': 500 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const X = m.X, muOn = k >= 3, L = muOn ? m.layMu : m.layMe;
      vis(m.chart, k >= 0);
      vis(m.mu.g, muOn);
      m.rows.forEach(r => { r.place(muOn ? D.mu : D.me); vis(r.lab, !muOn); vis(r.lab2, muOn); });
      m.sq.forEach((q, j) => { q.set(L[j].x, L[j].s); vis(q.g, k >= 0); vis(q.nMe, !muOn); vis(q.nMu, muOn); vis(q.fly, false); });
      vis(m.sumMe, k >= 0 && !muOn); vis(m.sumMu, muOn);
      vis(m.se, k >= 1); vis(m.s2, k >= 2); vis(m.muTxt, muOn);
      if (muOn) { m.se.style.opacity = 0.3; m.s2.style.opacity = 0.3; }
    },
    play(m, k, c) {
      const X = m.X;
      if (k === 0) {
        fadeIn(c, m.chart, 0, 600);
        m.sq.forEach((q, j) => {
          const r = m.rows[q.i], L = m.layMe[j], d = 900 + j * 520;
          q.g.style.opacity = ''; [q.rect, q.edge, q.nMe].forEach(e => { e.style.opacity = 0; });
          // l'écart quitte sa ligne, descend, puis le carré pousse dessus
          c.at(d, () => { q.fly.style.opacity = ''; });
          q.fly.style.opacity = 0;
          const a0 = [X(D.me), X(r.v)].sort((p, s) => p - s);
          tweenT(c, 520, d, t => setLine(q.fly, lerp(a0[0], L.x, t), lerp(r.y, SQB, t), lerp(a0[1], L.x + L.s, t), lerp(r.y, SQB, t)));
          c.at(d + 540, () => { q.fly.style.opacity = 0; q.edge.style.opacity = ''; q.rect.style.opacity = ''; });
          tweenT(c, 450, d + 540, t => q.set(L.x, L.s, L.s * t), 'out(2)');
          fadeIn(c, q.nMe, d + 900, 300);
        });
        fadeIn(c, m.sumMe, 900 + 5 * 520 + 400, 500);
        return 900 + 5 * 520 + 1000;
      }
      if (k === 1) { fadeIn(c, m.se, 0, 600); return 700; }
      if (k === 2) { fadeIn(c, m.s2, 0, 600); return 700; }
      // k === 3 : le centre passe de mₑ à μ ; les écarts et les carrés grandissent
      meanGrow(c, m.mu, 0);
      c.anim([m.se, m.s2], { opacity: [1, 0.3], duration: T(500), ease: 'out(2)' });
      tweenT(c, 1200, 700, t => {
        const ctr = lerp(D.me, D.mu, t);
        m.rows.forEach(r => r.place(ctr));
        m.sq.forEach((q, j) => { const a = m.layMe[j], b = m.layMu[j]; q.set(lerp(a.x, b.x, t), lerp(a.s, b.s, t)); });
      });
      m.rows.forEach(r => { fadeOut(c, r.lab, 700, 300); fadeIn(c, r.lab2, 1500, 400); });
      m.sq.forEach(q => { fadeOut(c, q.nMe, 700, 300); fadeIn(c, q.nMu, 1600, 400); });
      fadeOut(c, m.sumMe, 700, 300); fadeIn(c, m.sumMu, 1900, 500);
      fadeIn(c, m.muTxt, 2300, 500);
      return 2900;
    }
  });

  /* ======================= PONT · les ν + 1 gaussiennes du poly =======================
     P1 ν = nombre de ddl ; les 5 mesures et la fraction t · P2 la moyenne monte : 1 en haut
     P3 les 4 écarts libres descendent : ν = 4 en bas · P4 ν + 1 = 5 = N */
  const PX = { x0: 120, x1: 960, d0: 60, d1: 80 };    // 42 px par mm
  const PB = 660, PHT = 100;
  stepped('pont', {
    labels: ['P1', 'P2', 'P3', 'P4'],
    build(svg) {
      const m = {}, X = m.X = geoX(PX), ppm = (PX.x1 - PX.x0) / (PX.d1 - PX.d0);
      tx(svg, 60, 90, 'Les « ~ν~ + 1 gaussiennes » du poly', { class: 't-title' });
      m.intro = S('g', {}, svg);
      tx(m.intro, 60, 165, FM('{b:~ν~} = nombre de degrés de liberté'), { 'font-size': 34 });
      tx(m.intro, 60, 215, FM('Student à ~ν~ ddl se construit avec {b:~ν~ + 1 gaussiennes} ; une gaussienne = une mesure'), { 'font-size': 30, class: 't-pop' });
      m.chart = S('g', {}, svg);
      m.axis = makeAxis(m.chart, range(60, 80, 1), v => v % 2 === 0, 'Largeur de la main (mm)');
      m.axis.layout(X, PB, { ldy: 36, tdy: 78 });
      m.axis.labels.forEach(l => l.setAttribute('font-size', 20)); if (m.axis.tt) m.axis.tt.setAttribute('font-size', 24);
      D.v.forEach(v => stickAt(S('rect', { class: 'sq' }, m.chart), X(v), PB, PHT, 14));
      m.mean = meanMark(m.chart, '~m~_e = 71', { size: 26 });
      m.mean.set(X(D.me), 370, PB, X(D.me), 352);
      m.rows = makeRows(m.chart, X, r => 398 + r * 36, PB - PHT, { size: 24, hs: 14 });
      m.cap = tx(m.chart, (PX.x0 + PX.x1) / 2, 820, FM(`{U:${D.N} mesures = ${D.N} gaussiennes}`), { 'text-anchor': 'middle', 'font-size': 32 });
      // la fraction t = (m − μ) / (s/√N), la même qu'en cours (IC, σ inconnu)
      const FX = 1440;
      m.frac = S('g', {}, svg);
      tx(m.frac, 1110, 663, '~t~ =', { 'font-size': 76, 'font-weight': 500 });
      tx(m.frac, FX, 585, FM('{g:~m~} − {p:~μ~}'), { 'text-anchor': 'middle', 'font-size': 76, 'font-weight': 500 });
      S('line', { class: 'fbar', x1: FX - 180, x2: FX + 180, y1: 637, y2: 637 }, m.frac);
      tx(m.frac, FX, 725, FM('{g:~s~} / √~N~'), { 'text-anchor': 'middle', 'font-size': 76, 'font-weight': 500 });
      m.numTag = tx(svg, FX + 230, 585, '1', { 'font-size': 72, 'font-weight': 700, class: 't-or' });
      m.numCap = tx(svg, FX + 230, 470, 'la moyenne', { 'font-size': 26, 'font-weight': 600, class: 't-or' });
      m.denTag = tx(svg, FX + 230, 725, String(D.N - 1), { 'font-size': 72, 'font-weight': 700, class: 't-blue' });
      m.denNu = tx(svg, FX + 290, 725, '= ~ν~', { 'font-size': 60, 'font-weight': 700 });
      m.fly = S('line', { class: 'mline' }, svg);
      // les écarts libres, réduits de moitié, rangés sous la fraction
      const sc = 0.5 * ppm, free = D.order.filter(i => i !== D.last);
      let x = 1215;
      m.low = free.map(i => {
        const w = Math.abs(D.ec[i]) * sc, x0 = D.ec[i] > 0 ? x : x + w, x1 = D.ec[i] > 0 ? x + w : x;
        const a = hArrow(svg); a.set(x0, x1, 820, 14);
        const lab = tx(svg, x + w / 2, 795, sgn(D.ec[i]), { 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 700, class: 't-blue' });
        const o = { a, lab, i, x0, x1 }; x += w + 34; return o;
      });
      m.lowCap = tx(svg, 1215 + (x - 34 - 1215) / 2, 872, `les ${D.N - 1} écarts libres`, { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600, class: 't-blue' });
      m.eq = tx(svg, 960, 975, FM(`{b:~ν~ + 1} = ${D.N - 1} + 1 = ${D.N} = {b:~N~}`), { 'text-anchor': 'middle', 'font-size': 60, 'font-weight': 500 });
      m.eq2 = tx(svg, 960, 1030, 'les ~ν~ + 1 gaussiennes du poly, ce sont tes ~N~ mesures', { 'text-anchor': 'middle', 'font-size': 30, class: 't-pop' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis([m.intro, m.chart, m.frac], k >= 0);
      vis([m.numTag, m.numCap], k >= 1);
      vis(m.fly, false);
      m.low.forEach(o => { o.a.set(o.x0, o.x1, 820, 14); vis([o.a.g, o.lab], k >= 2); });
      vis([m.denTag, m.lowCap], k >= 2);
      const dl = m.rows[D.last]; if (k >= 2) dl.g.style.opacity = 0.2;
      vis(m.denNu, k >= 3); vis([m.eq, m.eq2], k >= 3);
    },
    play(m, k, c) {
      const X = m.X;
      if (k === 0) {
        fadeIn(c, m.intro, 0, 500);
        fadeIn(c, m.chart, 300, 600);
        fadeIn(c, m.frac, 900, 600);
        return 1600;
      }
      if (k === 1) {
        // le trait de mₑ quitte le graphique et monte au numérateur
        m.fly.style.opacity = '';
        tweenT(c, 1100, 0, t => setLine(m.fly, lerp(X(D.me), 1655, t), lerp(370, 530, t), lerp(X(D.me), 1655, t), lerp(PB, 590, t)));
        c.at(1100, () => { m.fly.style.opacity = 0; });
        popIn(c, m.numTag, 1100); fadeIn(c, m.numCap, 1300, 400);
        return 1800;
      }
      if (k === 2) {
        // les 4 écarts libres descendent sous la fraction ; le 5ᵉ reste : il est imposé
        m.low.forEach((o, j) => {
          const r = m.rows[o.i], d = j * 260;
          vis([o.a.g, o.lab], true); o.lab.style.opacity = 0;
          tweenT(c, 900, d, t => o.a.set(lerp(X(D.me), o.x0, t), lerp(X(r.v), o.x1, t), lerp(r.y, 820, t), 14));
          fadeIn(c, o.lab, d + 800, 300);
        });
        c.anim(m.rows[D.last].g, { opacity: [1, 0.2], duration: T(500), delay: T(400), ease: 'out(2)' });
        popIn(c, m.denTag, 1700); fadeIn(c, m.lowCap, 1900, 400);
        return 2400;
      }
      fadeIn(c, m.denNu, 0, 400);
      riseIn(c, m.eq, 400, 500); fadeIn(c, m.eq2, 900, 500);
      return 1500;
    }
  });

  /* ======================= ESSAI · deux groupes =======================
     T1 10 + 10 tensions (fabriquées) · T2 m₁ = 132, m₂ = 140 : écart 8 mmHg
     T3 chaque groupe perd 1 ddl : ν = n₁ + n₂ − 2 = 18 · T4 table de Student, ligne 18 : 2,10 ; t = 2,24 > 2,10 */
  const EX = { x0: 300, x1: 1380, d0: 115, d1: 155 };  // 27 px par mmHg
  const EBA = 470, EBB = 790, EHT = 110;
  stepped('essai', {
    labels: ['T1', 'T2', 'T3', 'T4'],
    build(svg) {
      const m = {}, X = m.X = geoX(EX);
      tx(svg, 60, 90, 'Deux groupes : l\'essai sur l\'antihypertenseur', { class: 't-title' });
      tx(svg, 60, 142, `Tensions individuelles fabriquées pour l'exemple ; moyennes et ~s~ = ${ESSAI.s} mmHg tirés du document`, { 'font-size': 24, class: 't-pop' });
      m.base = S('g', {}, svg);
      [[EBA, 'A', 'médicament'], [EBB, 'B', 'placebo']].forEach(([b, n, w]) => {
        S('line', { class: 'rowbase', x1: X(EX.d0), x2: X(EX.d1), y1: b, y2: b }, m.base);
        tx(m.base, 180, b - 44, n, { 'text-anchor': 'middle', 'font-size': 52, 'font-weight': 700 });
        tx(m.base, 180, b - 8, w, { 'text-anchor': 'middle', 'font-size': 24, class: 't-pop' });
      });
      m.axis = makeAxis(m.base, range(115, 155, 1), v => v % 5 === 0, 'Tension artérielle (mmHg)');
      m.axis.layout(X, 850, { ldy: 36, tdy: 80 });
      const sticks = (vals, b) => vals.map(v => {
        const g = S('g', {}, svg), f = S('rect', { class: 'sq grow' }, g), h = S('rect', { class: 'stick-h' }, g);
        stickAt(f, X(v), b, EHT, 12); stickAt(h, X(v), b, EHT, 12); return { g, f, h };
      });
      m.sA = sticks(ESSAI.A, EBA); m.sB = sticks(ESSAI.B, EBB);
      m.ext = S('g', {}, svg);
      S('line', { class: 'mext', x1: X(ESSAI.m1), x2: X(ESSAI.m1), y1: EBA + 30, y2: 600 }, m.ext);
      S('line', { class: 'mext', x1: X(ESSAI.m2), x2: X(ESSAI.m2), y1: 540, y2: EBB - EHT - 40 }, m.ext);
      m.gap = dblArrow(m.ext, 'dbl', 'dbl-h'); m.gap.set(X(ESSAI.m1), X(ESSAI.m2), 570);
      tx(m.ext, X((ESSAI.m1 + ESSAI.m2) / 2), 552, `${ESSAI.m2 - ESSAI.m1} mmHg`, { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700 });
      m.mA = meanMark(svg, `~m~_1 = ${ESSAI.m1}`, { anchor: 'start' }); m.mA.set(X(ESSAI.m1), EBA - EHT - 50, EBA, X(ESSAI.m1) + 12, EBA - EHT - 22);
      m.mB = meanMark(svg, `~m~_2 = ${ESSAI.m2}`, { anchor: 'start' }); m.mB.set(X(ESSAI.m2), EBB - EHT - 50, EBB, X(ESSAI.m2) + 12, EBB - EHT - 22);
      // right panel
      const RC = 1690;
      m.cnt = S('g', {}, svg);
      tx(m.cnt, RC, 270, `(${ESSAI.n1} − 1) + (${ESSAI.n2} − 1)`, { 'text-anchor': 'middle', 'font-size': 38, 'font-weight': 500 });
      tx(m.cnt, RC, 370, FM(`{b:~ν~ = ${ESSAI.nu}}`), { 'text-anchor': 'middle', 'font-size': 80 });
      tx(m.cnt, RC, 425, '= ~n~_1 + ~n~_2 − 2', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 500 });
      m.tab = S('g', {}, svg);
      m.tabHl = S('rect', { class: 'hl growx', x: 1500, width: 380, height: 46, rx: 8 }, m.tab);
      tx(m.tab, 1590, 540, '~ν~', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      tx(m.tab, 1780, 540, '~t~ (5 %)', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      S('line', { class: 'basel', x1: 1500, x2: 1880, y1: 556, y2: 556 }, m.tab);
      m.tRows = [16, 17, 18, 19, 20].map((nu, j) => {
        const y = 600 + j * 50, g = S('g', {}, m.tab), on = nu === ESSAI.nu;
        tx(g, 1590, y, String(nu), { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': on ? 700 : 500 });
        tx(g, 1780, y, TQ[nu].toFixed(3).replace('.', ','), { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': on ? 700 : 500 });
        if (on) m.tabHl.setAttribute('y', y - 33);
        return g;
      });
      m.concl = S('g', {}, svg);
      tx(m.concl, RC, 900, FM(`{b:~t~ = ${fr(ESSAI.t, 2)} > ${fr(TQ[18], 2)}}`), { 'text-anchor': 'middle', 'font-size': 46 });
      tx(m.concl, RC, 950, FM(`{p:Gauss : ${fr(Z975, 2)}}`), { 'text-anchor': 'middle', 'font-size': 30 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.base, k >= 0);
      [[m.sA, ESSAI.hollowA], [m.sB, ESSAI.hollowB]].forEach(([arr, hi]) => arr.forEach((s, j) => {
        vis(s.g, k >= 0); vis(s.f, !(k >= 2 && j === hi)); vis(s.h, k >= 2 && j === hi);
      }));
      vis([m.mA.g, m.mB.g, m.ext], k >= 1);
      vis(m.cnt, k >= 2);
      vis([m.tab, m.concl], k >= 3);
    },
    play(m, k, c) {
      if (k === 0) {
        fadeIn(c, m.base, 0, 500);
        const all = [...m.sA, ...m.sB], r = seeded(5), ord = shuffle(all.map((_, i) => i), r);
        all.forEach(s => { s.g.style.opacity = ''; utils.set(s.f, { scaleY: 0 }); });
        ord.forEach((i, j) => c.anim(all[i].f, { scaleY: [0, 1], duration: T(450), delay: T(400 + j * 70), ease: 'out(3)' }));
        return 400 + all.length * 70 + 500;
      }
      if (k === 1) {
        meanGrow(c, m.mA, 0); meanGrow(c, m.mB, 250);
        fadeIn(c, m.ext, 1000, 500);
        return 1600;
      }
      if (k === 2) {
        [[m.sA, ESSAI.hollowA], [m.sB, ESSAI.hollowB]].forEach(([arr, hi], g) => {
          fadeOut(c, arr[hi].f, g * 400, 500); fadeIn(c, arr[hi].h, g * 400, 500);
        });
        const kids = [...m.cnt.children]; m.cnt.style.opacity = '';
        kids.forEach((e, i) => riseIn(c, e, 900 + i * 350, 450));
        return 900 + kids.length * 350 + 500;
      }
      m.tab.style.opacity = '';
      const hdr = [...m.tab.children].filter(e => !m.tRows.includes(e) && e !== m.tabHl);
      fadeIn(c, hdr, 0, 400);
      m.tRows.forEach((g, j) => riseIn(c, g, 200 + j * 120, 400));
      utils.set(m.tabHl, { scaleX: 0 }); c.anim(m.tabHl, { scaleX: [0, 1], duration: T(500), delay: T(1000), ease: 'out(3)' });
      fadeIn(c, m.concl, 1700, 500);
      return 2300;
    }
  });

  /* ======================= COURBE · ν change le seuil =======================
     C1 Gauss, seuil 1,96 · puis la courbe de Student se déforme : ν = 4 (les 5 mains), 9 (10 patients),
     18 (l'essai), 29 (G1, N = 30), 198 (100 + 100) ; le seuil glisse de 2,78 à 1,97 */
  function lgamma(x) {   // Lanczos, g = 7
    const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
    x -= 1; let a = p[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += p[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  const dens = (x, nu) => nu === Infinity ? Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
    : Math.exp(lgamma((nu + 1) / 2) - lgamma(nu / 2) - 0.5 * Math.log(nu * Math.PI) - (nu + 1) / 2 * Math.log(1 + x * x / nu));
  const LAWS = [
    { nu: Infinity, tc: Z975, a: 'Gauss', ex: '~σ~ connu' },
    { nu: 4, tc: TQ[4], a: '4', ex: '5 mains' },
    { nu: 9, tc: TQ[9], a: '9', ex: '10 patients' },
    { nu: 18, tc: TQ[18], a: '18', ex: 'l\'essai' },
    { nu: 29, tc: TQ[29], a: '29', ex: 'G1 (~N~ = 30)' },
    { nu: 198, tc: TQ[198], a: '198', ex: '100 + 100 patients' },
  ];
  const PL = { x0: 140, x1: 1300, t0: -5, t1: 5, base: 820, H: 1300 };
  stepped('courbe', {
    labels: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
    build(svg) {
      const m = {}, X = m.X = x => PL.x0 + (x - PL.t0) / (PL.t1 - PL.t0) * (PL.x1 - PL.x0);
      tx(svg, 60, 90, 'Pourquoi ~ν~ change le seuil', { class: 't-title' });
      m.area = S('path', { class: 'ic-area-k' }, svg);
      m.tl = S('path', { class: 'ic-tail' }, svg); m.tr = S('path', { class: 'ic-tail' }, svg);
      m.ref = S('path', { class: 'gauss-ref' }, svg);
      m.curve = S('path', { class: 'ic-curve-k' }, svg);
      m.axis = S('g', {}, svg);
      S('line', { class: 'axl', x1: X(PL.t0), x2: X(PL.t1), y1: PL.base, y2: PL.base }, m.axis);
      range(-5, 5, 1).forEach(v => S('line', { class: 'axl', x1: X(v), x2: X(v), y1: PL.base, y2: PL.base + 8 }, m.axis));
      tx(m.axis, X(0), PL.base + 40, '0', { 'text-anchor': 'middle', class: 't-tick' });
      tx(m.axis, X(PL.t1) + 18, PL.base + 9, '~t~', { 'font-size': 30, 'font-weight': 600 });
      m.refLab = tx(svg, X(0), PL.base - dens(0, Infinity) * PL.H - 16, 'Gauss', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600, class: 't-pop' });
      m.th = [-1, 1].map(sg => {
        const g = S('g', {}, svg), l = S('line', { class: 'vline' }, g);
        const t = tx(g, 0, 0, '', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700 });
        return { g, l, t, sg };
      });
      m.alpha = [-1, 1].map(sg => tx(svg, X(sg * 3.9), PL.base - 48, '~α~/2', { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, class: 't-red' }));
      m.law = LAWS.map(L => tx(svg, 180, 250, L.nu === Infinity ? 'Gauss' : `~ν~ = ${L.a}`, { 'font-size': 60, 'font-weight': 700 }));
      // table
      m.tab = S('g', {}, svg);
      m.hl = S('rect', { class: 'hl', x: 1392, width: 496, height: 56, rx: 8 }, m.tab);
      tx(m.tab, 1412, 250, '~ν~', { 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      tx(m.tab, 1872, 250, 'seuil 5 %', { 'text-anchor': 'end', 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      S('line', { class: 'basel', x1: 1392, x2: 1888, y1: 268, y2: 268 }, m.tab);
      m.rowY = j => 322 + j * 66;
      m.rows = LAWS.map((L, j) => {
        const g = S('g', {}, m.tab), y = m.rowY(j);
        tx(g, 1412, y, L.a, { 'font-size': 34, 'font-weight': 700 });
        tx(g, 1540, y, L.ex, { 'font-size': 24, class: 't-pop' });
        tx(g, 1872, y, fr(L.tc, 2), { 'text-anchor': 'end', 'font-size': 34, 'font-weight': 700 });
        return g;
      });
      m.msg = tx(svg, (PL.x0 + PL.x1) / 2, 975, FM('{b:~ν~ > 30 à 50} : Student ≈ Gauss'), { 'text-anchor': 'middle', 'font-size': 40 });
      m.draw = (ka, kb, t, amp = 1) => {
        const A = LAWS[ka], B = LAWS[kb], f = x => amp * lerp(dens(x, A.nu), dens(x, B.nu), t), tc = lerp(A.tc, B.tc, t);
        const Y = x => PL.base - PL.H * f(x), pts = (a, b, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(x).toFixed(1); } return d; };
        const full = pts(PL.t0, PL.t1, 240);
        m.curve.setAttribute('d', full);
        m.area.setAttribute('d', full + `L${X(PL.t1)} ${PL.base}L${X(PL.t0)} ${PL.base}Z`);
        m.tr.setAttribute('d', pts(tc, PL.t1, 80) + `L${X(PL.t1)} ${PL.base}L${X(tc)} ${PL.base}Z`);
        m.tl.setAttribute('d', pts(PL.t0, -tc, 80) + `L${X(-tc)} ${PL.base}L${X(PL.t0)} ${PL.base}Z`);
        const lab = fr((t < 0.5 ? A : B).tc, 2);
        m.th.forEach(h => { const x = X(h.sg * tc); setLine(h.l, x, PL.base - PL.H * f(tc) - 6, x, PL.base + 14); setXY(h.t, x, PL.base + 50); h.t.textContent = (h.sg < 0 ? '−' : '') + lab; });
      };
      // the Gauss reference stays put once Student appears
      m.ref.setAttribute('d', (() => { let d = ''; for (let i = 0; i <= 240; i++) { const x = PL.t0 + (PL.t1 - PL.t0) * i / 240; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + (PL.base - PL.H * dens(x, Infinity)).toFixed(1); } return d; })());
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const kk = Math.max(0, k);
      m.draw(kk, kk, 1);
      vis([m.area, m.tl, m.tr, m.curve, m.axis, m.th.map(h => h.g), m.alpha, m.tab], k >= 0);
      vis([m.ref, m.refLab], k >= 1);
      m.law.forEach((t, j) => vis(t, j === k));
      m.rows.forEach((g, j) => vis(g, j <= k));
      m.hl.setAttribute('y', m.rowY(kk) - 38);
      vis(m.hl, k >= 0);
      vis(m.msg, k >= 5);
    },
    play(m, k, c) {
      if (k === 0) {
        [m.area, m.tl, m.tr, m.curve, m.axis].forEach(e => { e.style.opacity = ''; });
        fadeIn(c, m.axis, 0, 400);
        m.draw(0, 0, 1, 0);
        tweenT(c, 1100, 300, t => m.draw(0, 0, 1, t), 'out(3)');   // la courbe monte depuis l'axe
        fadeIn(c, [m.tl, m.tr], 300, 10);
        fadeIn(c, m.th.map(h => h.g), 1300, 400); fadeIn(c, m.alpha, 1500, 400);
        fadeIn(c, m.law[0], 600, 400);
        m.tab.style.opacity = '';
        fadeIn(c, [...m.tab.children].filter(e => !m.rows.includes(e)), 1700, 400);
        riseIn(c, m.rows[0], 1900, 400);
        return 2400;
      }
      if (k === 1) fadeIn(c, [m.ref, m.refLab], 0, 400);
      fadeOut(c, m.law[k - 1], 0, 300); fadeIn(c, m.law[k], 300, 400);
      tweenT(c, 1300, 200, t => m.draw(k - 1, k, t));
      const y0 = m.rowY(k - 1) - 38, y1 = m.rowY(k) - 38;
      tweenT(c, 500, 1200, t => m.hl.setAttribute('y', lerp(y0, y1, t)));
      riseIn(c, m.rows[k], 1300, 400);
      if (k === 5) fadeIn(c, m.msg, 1700, 500);
      return k === 5 ? 2300 : 1800;
    }
  });

  /* ======================= REGLE · compter les ddl =======================
     Q1 la règle · Q2 le tableau, ligne par ligne (un seul clic) · Q3 ce qu'il faut retenir */
  stepped('regle', {
    labels: ['Q1', 'Q2', 'Q3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Compter les ddl', { class: 't-title' });
      m.rule = tx(svg, 960, 215, FM('{b:ddl} = nombre de valeurs − nombre de moyennes estimées'), { 'text-anchor': 'middle', 'font-size': 46 });
      const C = [140, 960, 1250, 1580];
      m.head = S('g', {}, svg);
      ['Situation', 'Valeurs', 'Moyennes estimées', 'ddl'].forEach((h, j) =>
        tx(m.head, C[j], 330, h, { 'text-anchor': j ? 'middle' : 'start', 'font-size': 28, 'font-weight': 600, class: 't-pop' }));
      S('line', { class: 'basel', x1: 140, x2: 1800, y1: 350, y2: 350 }, m.head);
      const ROWS = [
        ['Un échantillon (~s~², Student, ~χ~²)', '~N~', '1', '~N~ − 1'],
        ['Deux échantillons (Student)', '~n~_1 + ~n~_2', '2', '~n~_1 + ~n~_2 − 2'],
        ['Deux variances (Snedecor)', '~n~_1 et ~n~_2', '1 et 1', '~n~_1 − 1 et ~n~_2 − 1'],
        ['Si ~μ~ était connu', '~N~', '0', '~N~'],
      ];
      m.rows = ROWS.map((r, i) => {
        const g = S('g', {}, svg), y = 425 + i * 88;
        r.forEach((cell, j) => tx(g, C[j], y, cell, { 'text-anchor': j ? 'middle' : 'start', 'font-size': j ? 38 : 32, 'font-weight': j === 3 ? 700 : 500 }));
        if (i < ROWS.length - 1) S('line', { class: 'gridl', x1: 140, x2: 1800, y1: y + 36, y2: y + 36 }, g);
        return g;
      });
      m.keep = S('g', {}, svg);
      [[835, 'Student à {b:~ν~ ddl} : ~ν~ + 1 = ~N~ mesures, 1 en haut, ~ν~ en bas'],
       [895, 'Moins de ddl → seuil plus haut ; {b:~ν~ > 30 à 50} → Gauss'],
       [955, '{p:~σ~} connu → Gauss : pas de ddl']].forEach(([y, s]) => {
        const g = S('g', {}, m.keep); bullet(g, 166, y); tx(g, 166, y, FM(s), { 'font-size': 34, 'font-weight': 500 });
      });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.rule, k >= 0);
      vis([m.head, m.rows], k >= 1);
      vis(m.keep, k >= 2);
    },
    play(m, k, c) {
      if (k === 0) { riseIn(c, m.rule, 0, 600); return 800; }
      if (k === 1) { fadeIn(c, m.head, 0, 400); m.rows.forEach((g, i) => riseIn(c, g, 300 + i * 450, 450)); return 300 + m.rows.length * 450 + 300; }
      m.keep.style.opacity = '';
      [...m.keep.children].forEach((g, i) => riseIn(c, g, i * 350, 450));
      return 3 * 350 + 500;
    }
  });

