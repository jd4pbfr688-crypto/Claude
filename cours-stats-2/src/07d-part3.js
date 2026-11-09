
  /* ======================= CENTRER ET RÉDUIRE (juste avant le raccourci ε) =======================
     C1 trois variables, trois unités, des moyennes sans rapport : un écart de 100, c'est beaucoup ?
     C2 on centre : on enlève la moyenne, chaque graphique glisse dans l'échelle jusqu'à 0
     C3 on réduit : on divise par l'écart-type, les trois courbes deviennent la même
     C4 maintenant on compare : 100 € = 0,2 σ, 100 kg = 8,3 σ, 100 mm = 21 σ ; z = (x − μ)/σ */
  const CR_VARS = [
    { name: 'Salaire', unit: '€', mu: 2000, sd: 500, base: 380, sub: '~μ~ = 2 000 €, ~σ~ = 500 €' },
    { name: 'Poids', unit: 'kg', mu: 65, sd: 12, base: 610, sub: '~μ~ = 65 kg, ~σ~ = 12 kg' },
    { name: 'Main', unit: 'mm', mu: 70, sd: 4.74, base: 840, sub: '~μ~ = 70 mm, ~σ~ = 4,74 mm' },
  ];
  const CR = { cx: 1050, k0: 1500 / 3600, c0: 1500, kz: 200, H: 140 };
  const crK = (v, s) => Math.exp(lerp(Math.log(CR.k0), Math.log(CR.kz / v.sd), s));
  const crX = (v, x, t, s) => CR.cx + (x - t * v.mu - (1 - t) * CR.c0) * crK(v, s);
  stepped('centre', {
    labels: ['C1', 'C2', 'C3', 'C4'],
    build(svg) {
      const m = { t: 0, s: 0 };
      tx(svg, 60, 90, 'Centrer et réduire', { class: 't-title' });
      m.caps = captions(svg, [
        'Trois variables, trois unités, des moyennes sans rapport. Un écart de 100, c\'est beaucoup ou pas ?',
        'On {b:centre} : on enlève la moyenne. Chaque graphique glisse dans l\'échelle jusqu\'à 0.',
        'On {b:réduit} : on divise par l\'écart-type. Les trois courbes deviennent la même.',
        'Maintenant on peut comparer : tout est compté en écarts-types.',
      ], 150, 32);
      const defs = S('defs', {}, svg), cp = S('clipPath', { id: 'cr-clip' }, defs);
      S('rect', { x: 290, y: 180, width: 1540, height: 760 }, cp);
      m.rows = CR_VARS.map(v => {
        const r = { v };
        ftx(svg, 60, v.base - 70, '{b:' + v.name + ' (' + v.unit + ')}', { 'font-size': 30 });
        r.sub = ftx(svg, 60, v.base - 32, v.sub, { 'font-size': 22, class: 't-pop' });
        S('line', { x1: 300, x2: 1810, y1: v.base, y2: v.base, class: 'axl' }, svg);
        const g = S('g', { 'clip-path': 'url(#cr-clip)' }, svg);
        r.area = S('path', { class: 'ic-area-k' }, g); r.curve = S('path', { class: 'ic-curve-k' }, g);
        r.mu = S('line', { y1: v.base, y2: v.base - CR.H - 12, class: 'ic-musolid' }, g);
        r.muT = tx(svg, 0, v.base - CR.H - 20, '', { 'text-anchor': 'end', 'font-size': 26, 'font-weight': 700, class: 't-pop halo' });
        r.raw = range(0, 3000, 500).map(x => ({ x, l: S('line', { y1: v.base, y2: v.base + 8, class: 'axl' }, g), t: tx(g, 0, v.base + 32, x ? fr(x, 0) : '0', { 'text-anchor': 'middle', class: 't-tick' }) }));
        r.cen = range(-1500, 1500, 500).map(x => ({ x, l: S('line', { y1: v.base, y2: v.base + 8, class: 'axl' }, g), t: tx(g, 0, v.base + 32, x < 0 ? '−' + (-x) : String(x), { 'text-anchor': 'middle', class: 't-tick' }) }));
        r.z = range(-3, 3, 1).map(x => ({ x, l: S('line', { y1: v.base, y2: v.base + 8, class: 'axl' }, g), t: tx(g, 0, v.base + 32, x < 0 ? '−' + (-x) : String(x), { 'text-anchor': 'middle', class: 't-tick' }) }));
        r.arr = S('g', {}, g);
        r.arrL = S('line', { y1: v.base - CR.H - 14, y2: v.base - CR.H - 14, class: 'est-arr' }, r.arr);
        r.arrH = S('polygon', { class: 'est-arr-h' }, r.arr);
        r.arrT = tx(r.arr, 0, v.base - CR.H - 5, '+100 ' + v.unit, { 'font-size': 26, 'font-weight': 700, class: 'halo' });
        r.cmp = ftx(svg, 1400, v.base - 70, '', { 'font-size': 30, 'font-weight': 600, class: 'halo' });
        return r;
      });
      m.axT = ['~x~', '~x~ − ~μ~', '~z~'].map(s => ftx(svg, 1830, CR_VARS[2].base + 46, s, { 'font-size': 28, 'font-weight': 600, 'text-anchor': 'end' }));
      m.f = S('g', {}, svg);
      card(m.f, 360, 910, 1200, 130, 'box', 14);
      fracLine(m.f, 760, 968, '~z~ =', '~x~ − ~μ~', '~σ~', 140, '', 40);
      ftx(m.f, 920, 982, 'c\'est ce que fait {k:~ε~} = |~m~ − ~μ~| / ({p:~σ~}/√~N~)', { 'font-size': 32 });
      m.hl = S('g', {}, m.f); m.f.insertBefore(m.hl, m.f.children[1]);
      m.draw = () => {
        const { t, s } = m;
        m.rows.forEach(r => {
          const v = r.v, X = x => crX(v, x, t, s), Y = x => v.base - CR.H * Math.exp(-(((x - v.mu) / v.sd) ** 2) / 2);
          let d = '';
          for (let i = 0; i <= 160; i++) { const x = v.mu + (-3.6 + 7.2 * i / 160) * v.sd; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(x).toFixed(1); }
          r.curve.setAttribute('d', d);
          r.area.setAttribute('d', d + `L${X(v.mu + 3.6 * v.sd).toFixed(1)} ${v.base}L${X(v.mu - 3.6 * v.sd).toFixed(1)} ${v.base}Z`);
          const xm = X(v.mu); r.mu.setAttribute('x1', xm); r.mu.setAttribute('x2', xm);
          // μ slides to 0 while we centre, σ shrinks to 1 while we reduce (units disappear)
          const big = v.mu >= 1000, num = (x, d) => { const t0 = fr(x, d); return big ? t0.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : t0; };
          const muV = lerp(v.mu, 0, t), sdV = Math.exp(lerp(Math.log(v.sd), 0, s));
          const muS = Math.abs(muV) < 0.05 ? '0' : num(muV, big ? 0 : 1).replace(/,0$/, ''), sdS = s > 0.999 ? '1' : num(sdV, s > 0 ? 2 : (v.sd % 1 ? 2 : 0));
          const u = s > 0.001 ? '' : ' ' + v.unit;
          rich(r.sub, FM('~μ~ = ' + muS + (muS === '0' ? '' : u) + ', ~σ~ = ' + sdS + u));
          rich(r.muT, FM('~μ~ = ' + muS)); r.muT.setAttribute('x', xm - 10);
          const put = (ticks, px, op) => ticks.forEach(k => { const x = px(k.x); [k.l].forEach(l => { l.setAttribute('x1', x); l.setAttribute('x2', x); }); k.t.setAttribute('x', x); k.l.setAttribute('opacity', op); k.t.setAttribute('opacity', op); });
          put(r.raw, x => X(x), clamp01(1 - 2 * t).toFixed(3));
          put(r.cen, x => CR.cx + x * crK(v, s), (clamp01(2 * t - 1) * clamp01(1 - 2 * s)).toFixed(3));
          put(r.z, x => CR.cx + x * CR.kz, clamp01(2 * s - 1).toFixed(3));
          const x0 = X(v.mu), x1 = Math.min(X(v.mu + 100), 1800), y = v.base - CR.H - 14;
          r.arrL.setAttribute('x1', x0); r.arrL.setAttribute('x2', x1 - 8);
          r.arrH.setAttribute('points', `${x1},${y} ${x1 - 13},${y - 7} ${x1 - 13},${y + 7}`);
          r.arrT.setAttribute('x', x1 + 10);
        });
        m.axT.forEach((e, i) => e.setAttribute('opacity', (i === 0 ? clamp01(1 - 2 * t) : i === 1 ? clamp01(2 * t - 1) * clamp01(1 - 2 * s) : clamp01(2 * s - 1)).toFixed(3)));
      };
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.t = k >= 1 ? 1 : 0; m.s = k >= 2 ? 1 : 0; m.draw();
      showCap(m.caps, k);
      m.rows.forEach((r, i) => {
        vis(r.arr, k === 0);
        const z = 100 / r.v.sd;
        rich(r.cmp, FM('100 ' + r.v.unit + ' = {b:' + (z < 1 ? fr(z, 1) : fr(z, z < 10 ? 1 : 0)) + ' ~σ~}' + ['  : presque rien', '  : énorme', '  : impossible'][i]));
        vis(r.cmp, k >= 3);
      });
      vis(m.f, k >= 3);
      m.hl.replaceChildren(); if (k >= 3) markMult(m.f, m.hl);
    },
    play(m, k, c) {
      swapCap(c, m.caps, k);
      if (k === 0) { const kids = [...m.svg.children].filter(e => e.tagName !== 'defs' && !m.caps.includes(e) && e !== m.f && !m.rows.some(r => r.cmp === e) && !e.classList.contains('t-title')); fadeIn(c, kids, 0, 700); return 900; }
      if (k === 1) { fadeOut(c, m.rows.map(r => r.arr), 0, 300); tweenT(c, 2000, 400, u => { m.t = u; m.draw(); }, 'inOut(2)'); return 2600; }
      if (k === 2) { tweenT(c, 2200, 400, u => { m.s = u; m.draw(); }, 'inOut(2)'); return 2800; }
      m.rows.forEach((r, i) => fadeIn(c, r.cmp, i * 300, 500));
      fadeIn(c, m.f, 1000, 500); c.at(1000, () => markMult(m.f, m.hl));
      return 1700;
    }
  });

  /* ======================= DIAPO 9 · LE RACCOURCI ε =======================
     Z1 la cloche à 5 % et mₑ · Z2 on centre (− 72,5) puis on réduit (÷ 0,866) : seules les graduations bougent
     Z3 ε = 2,42 > 1,96 : rejet · Z4 à 1 % : ε(α) = 2,576, acceptation */
  stepped('eps', {
    labels: ['Z1', 'Z2', 'Z3', 'Z4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Le raccourci : l\'écart réduit ~ε~'), { class: 't-title' });
      m.b = buildBell(svg, 'EPS');
      m.caps = captions(svg, [
        'Tester, c\'est regarder si ~m~_e tombe dans l\'IP. On peut le faire plus simplement : on change de graduation.',
        ['On {b:centre} : la moyenne sous H₀ (72,5 mm) devient 0. Puis on {b:réduit} : on divise par {p:~σ~}/√~N~ = 0,866 mm.', 'La courbe ne bouge pas : l\'IP devient [−1,96 ; +1,96] et ~m~_e devient la valeur réduite ~z~ = −2,42.'],
        '~m~_e hors de l\'IP  ⇔  ~ε~ = |~z~| > ~ε~(~α~). Ici 2,42 > 1,96 : on {R:rejette H₀}, le test est significatif.',
        'À ~α~ = 1 % : ~ε~(~α~) = 2,576. Comme ~ε~ = 2,42 < 2,576, on {b:accepte} H₀ (comme sur l\'IP en mm).',
      ], 150, 30);
      m.f = S('g', {}, svg);
      card(m.f, 300, 880, 1320, 170, 'box', 14);
      fracLine(m.f, 600, 940, '~z~ =', '~m~_e − ~μ~', '{p:~σ~}/√~N~', 200, '= −2,42', 40);
      ftx(m.f, 960, 954, '→   {b:~ε~ = |~z~| = 2,42}   {p:(différence réduite)}', { 'font-size': 34 });
      ftx(m.f, 960, 1028, '{p:calculé avec les valeurs avant de centrer : ~m~_e = 70,4 mm, ~μ~ = 72,5 mm (H₀), ~σ~/√~N~ = 0,866 mm}', { 'text-anchor': 'middle', 'font-size': 24 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: k >= 3 ? Z99 : Z95, uni: 0, ax: k >= 1 ? 2 : 0, trueAmp: 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tmm, b.tcz, b.axT, b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], k >= 0);
      vis(m.f, k >= 1);
      showCap(m.caps, k);
    },
    play(m, k, c) {
      const b = m.b;
      swapCap(c, m.caps, k);
      switch (k) {
        case 0: fadeIn(c, [b.axis, b.tmm, b.tcz, b.axT, b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], 0, 600); return 900;
        case 1:
          tweenT(c, 1500, 500, t => { b.st.ax = t; b.draw(); }, 'inOut(2)');
          tweenT(c, 1700, 2600, t => { b.st.ax = 1 + t; b.draw(); }, 'inOut(2)');
          fadeIn(c, m.f, 4400, 600);
          return 5100;
        case 2: c.anim(b.meDot, { scale: [1, 1.9, 1], duration: T(900), delay: T(300), ease: 'inOut(2)' }); return 1300;
        case 3:
          tweenT(c, 1500, 400, t => { b.st.zt = lerp(Z95, Z99, t); b.draw(); });
          c.at(1500, () => c.anim(b.meDot, { scale: [1.7, 1], duration: T(500), ease: 'out(3)' }));
          return 2100;
      }
    }
  });

  /* ======================= DIAPO 10 · LE TEST UNILATÉRAL =======================
     U1 H₁ : μ < 72,5 · U2 la queue droite passe à gauche, seuil ε(2α) · U3 rejet (le bilatéral acceptait) · U4 les règles */
  stepped('uni', {
    labels: ['U1', 'U2', 'U3', 'U4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Le test unilatéral', { class: 't-title' });
      m.b = buildBell(svg, 'UNI');
      m.caps = captions(svg, [
        ['Le fabricant ne craint qu\'une chose : des gants trop grands, donc des mains plus petites que sous H₀.', 'Sur l\'axe réduit, H₀ est en 0 : H₁ est du {b:côté négatif}.'],
        'Tout ~α~ passe du côté de H₁ : la queue gauche fait 1 % à elle seule, et la borne devient −~ε~(2~α~) = −2,326.',
        ['~z~ = −2,42 est sous −2,326 : ~ε~ = 2,42 > ~ε~(2~α~) = 2,326, et du côté de H₁.', 'On {R:rejette H₀}. Avec le même ~α~ = 1 %, le test bilatéral acceptait.'],
        'Pourquoi 2~α~ ? La table de Gauss met ~α~/2 de chaque côté ; pour avoir ~α~ d\'un seul côté, on lit la colonne 2~α~.',
      ], 150, 30);
      const x0 = tX(MU0);
      m.h1 = S('g', {}, svg);
      S('line', { x1: x0 - 16, x2: x0 - 330, y1: 236, y2: 236, class: 'h1-arr' }, m.h1);
      arrowHead(m.h1, x0 - 336, 236, Math.PI, 'h1-arr-h', 16);
      ftx(m.h1, x0 - 360, 246, '{P:H₁ : côté négatif}', { 'text-anchor': 'end', 'font-size': 32 });
      const xs = tX(MU0 - Z98 * SEM);
      m.reg = S('g', {}, svg);
      ftx(m.reg, xs - 24, IPY + 108, '← {R:significatif} (rejet)', { 'text-anchor': 'end', 'font-size': 28 });
      ftx(m.reg, xs + 24, IPY + 108, '{b:non significatif} →', { 'font-size': 28 });
      m.rules = S('g', {}, svg);
      noteBox(m.rules, 160, 915, 790, ['Unilatéral {b:gauche} (H₁ du côté négatif) : on rejette H₀', 'si ~ε~ > ~ε~(2~α~) {b:et} ~z~ < 0 (~m~_e sous la valeur de H₀)'], { size: 27 });
      noteBox(m.rules, 970, 915, 790, ['Unilatéral {b:droit} (H₁ du côté positif) : on rejette H₀', 'si ~ε~ > ~ε~(2~α~) {b:et} ~z~ > 0 (~m~_e au-dessus de la valeur de H₀)'], { size: 27 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: Z99, uni: k >= 1 ? 1 : 0, ax: 2, trueAmp: 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tcz, b.axT[2], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.aU, b.ip, b.me, m.h1], k >= 0);
      vis(m.reg, k >= 2); vis(m.rules, k >= 3);
      showCap(m.caps, k);
      if (k === 1) { b.meDot.classList.remove('out'); b.meLab.classList.replace('t-red', 't-or'); }   // the verdict comes at U3
    },
    play(m, k, c) {
      const b = m.b;
      swapCap(c, m.caps, k);
      switch (k) {
        case 0: fadeIn(c, [b.axis, b.tcz, b.axT[2], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.aU, b.ip, b.me], 0, 500); fadeIn(c, m.h1, 700, 600); return 1400;
        case 1:
          tweenT(c, 2000, 400, t => { b.st.uni = t; b.draw(); b.meDot.classList.remove('out'); b.meLab.classList.replace('t-red', 't-or'); }, 'inOut(2)');
          return 2600;
        case 2:
          b.meDot.classList.add('out'); b.meLab.classList.replace('t-or', 't-red');
          c.anim(b.meDot, { scale: [1.9, 1], duration: T(600), ease: 'out(3)' });
          fadeIn(c, m.reg, 500, 600);
          return 1200;
        case 3: return stagger(c, m.rules, 0, 300, 500);
      }
    }
  });

  /* ======================= DIAPO 11 · LE DEGRÉ DE SIGNIFICATION p ======================= */
  stepped('pval', {
    labels: ['P1', 'P2', 'P3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Le degré de signification ~p~'), { class: 't-title' });
      m.b = buildBell(svg, 'PVAL');
      m.caps = captions(svg, [
        'On baisse ~α~ petit à petit : à 10 %, puis à 5 %, ~m~_e reste dans une queue. Le test reste significatif.',
        'On continue jusqu\'à ce que la borne atteigne ~z~ = −2,42 (donc ~ε~(~α~) = ~ε~ = 2,42) : on y est pour ~α~ = 1,5 %.',
        'Plus ~p~ est petit, plus le résultat est significatif.',
      ], 150, 30);
      m.def = noteBox(svg, 160, 900, 1600, ['{b:~p~ = la plus petite valeur de ~α~ pour laquelle le test est significatif} :  ~ε~(~p~) = ~ε~, ici ~p~ = 1,5 %.'], { size: 32, center: true });
      m.rule = S('g', {}, svg);
      noteBox(m.rule, 160, 900, 790, ['~p~ < ~α~ → on {R:rejette} H₀', '(ex. ~α~ = 5 % : 1,5 % < 5 %)'], { size: 30, center: true, cls: 'box-red' });
      noteBox(m.rule, 970, 900, 790, ['~p~ > ~α~ → on {b:accepte} H₀', '(ex. ~α~ = 1 % : 1,5 % > 1 %)'], { size: 30, center: true });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: k >= 1 ? -Z_ME : Z95, uni: 0, ax: 2, trueAmp: 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tcz, b.axT[2], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], k >= 0);
      vis(m.def, k === 1); vis(m.rule, k >= 2);
      showCap(m.caps, k);
    },
    play(m, k, c) {
      const b = m.b;
      swapCap(c, m.caps, k);
      if (k === 0) {
        b.st.zt = Z90; b.draw();
        fadeIn(c, [b.axis, b.tcz, b.axT[2], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], 0, 500);
        tweenT(c, 1800, 1200, t => { b.st.zt = lerp(Z90, Z95, t); b.draw(); }, 'inOut(2)');
        return 3300;
      }
      if (k === 1) {
        tweenT(c, 2200, 300, t => { b.st.zt = lerp(Z95, -Z_ME, t); b.draw(); }, 'out(2)');
        c.at(2500, () => c.anim(b.meDot, { scale: [1.8, 1], duration: T(600), ease: 'out(3)' }));
        fadeIn(c, m.def, 2800, 600);
        return 3500;
      }
      fadeOut(c, m.def, 0, 300);
      return stagger(c, m.rule, 300, 300, 500);
    }
  });

  /* ======================= DIAPO 12 · LA MÉTHODE ======================= */
  stepped('methode', {
    labels: ['M'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'La méthode, dans l\'ordre', { class: 't-title' });
      ftx(svg, 1240, 196, '{b:Exemple : les gants (G1, ~α~ = 5 %)}', { 'font-size': 28, class: 't-pop' });
      const rows = [
        ['Poser H₀ et H₁ (bilatéral ou unilatéral)', 'H₀ : ~μ~ = 72,5 mm · H₁ : ~μ~ ≠ 72,5 mm'],
        ['Fixer ~α~, {b:avant} de regarder les données', '~α~ = 5 %'],
        ['Vérifier les conditions, puis calculer l\'écart réduit', '~ε~ = |70,4 − 72,5| / 0,866 = 2,42'],
        ['Lire le seuil dans la table, comparer, conclure', '~ε~(~α~) = 1,96 < 2,42 → {R:on rejette H₀}'],
      ];
      m.rows = rows.map(([a, ex], i) => {
        const g = S('g', {}, svg), y = 240 + i * 175;
        S('line', { x1: 120, x2: 1800, y1: y, y2: y, class: 'tbl-line' }, g);
        tx(g, 150, y + 108, String(i + 1), { 'font-size': 84, 'font-weight': 700, class: 't-pop' });
        ftx(g, 270, y + 98, a, { 'font-size': 36, 'font-weight': 600 });
        ftx(g, 1240, y + 98, ex, { 'font-size': 32 });
        return g;
      });
      m.end = S('line', { x1: 120, x2: 1800, y1: 940, y2: 940, class: 'tbl-line' }, svg);
      m.note = ftx(svg, 150, 1000, 'Significatif = on rejette H₀. Non significatif = on l\'accepte, faute d\'argument.', { 'font-size': 30, class: 't-pop' });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.rows, m.end, m.note], k >= 0); },
    play(m, k, c) {
      m.rows.forEach((g, i) => { g.style.opacity = 0; c.at(200 + i * 500, () => c.anim(g, { opacity: [0, 1], translateX: [-40, 0], duration: T(600), ease: 'out(3)' })); });
      fadeIn(c, m.end, 2000, 400); fadeIn(c, m.note, 2300, 500);
      return 2900;
    }
  });

  /* ======================= DIAPO 13 · CONFORMITÉ D'UNE FRÉQUENCE ======================= */
  const FG = { x0: 140, x1: 900, d0: 56, d1: 84, base: 600, unit: 76 };
  stepped('cfreq', {
    labels: ['F1', 'F2', 'F3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Conformité d\'une fréquence', { class: 't-title' });
      m.ch = makeChart(svg, G1, { seed: 11, ext: false });
      m.ch.layout(FG, { mean: 'top', cart: [FG.x0 + 40, FG.base - YMAX * FG.unit + 20], cartSize: [64, 38], cartFont: 24 });
      m.ch.bars.forEach((bar, c) => { if (56 + c < 72) bar.setAttribute('class', 'sqg'); });
      const X = geoX(FG);
      m.thr = S('line', { x1: X(71.5), x2: X(71.5), y1: FG.base - YMAX * FG.unit - 10, y2: FG.base, class: 'pop' }, svg);
      m.ax = makeAxis(svg, range(56, 84, 4), () => true, 'Largeur de la main (mm)');
      m.ax.layout(X, FG.base, { ldy: 34, tdy: 74 });
      m.fe = S('g', {}, svg);
      ftx(m.fe, 140, 770, '11 mains ≥ 72 mm sur 30', { 'font-size': 30, class: 't-blue' });
      ftx(m.fe, 140, 850, '{O:~f~_e = 11/30 = 0,367}', { 'font-size': 48 });
      ftx(m.fe, 140, 900, '{g:~f~} = ~f~_e : la meilleure estimation', { 'font-size': 26, class: 't-pop' });
      m.h0 = noteBox(svg, 1000, 150, 860, ['{P:H₀ : ~ϕ~ = 0,20}', 'le fabricant ne prévoit que 20 % de gants L', 'Conditions : ~N~~ϕ~ = 6 > 5 ✓ et ~N~(1 − ~ϕ~) = 24 > 5 ✓', '→ on peut remplacer la binomiale par Gauss'], { size: 28, cls: 'box-pop' });
      m.f = S('g', {}, svg);
      fracLine(m.f, 1250, 500, '~ε~ =', '|~f~ − ~ϕ~|', '√( ~ϕ~(1 − ~ϕ~) / ~N~ )', 330, '', 38);
      ftx(m.f, 1040, 640, '= |0,367 − 0,20| / √(0,20 × 0,80 / 30)', { 'font-size': 30 });
      ftx(m.f, 1040, 690, '= 0,167 / 0,0730 = {b:2,28}', { 'font-size': 30 });
      ftx(m.f, 1040, 750, '2,28 > ~ε~(~α~) = 1,96 → on {R:rejette H₀}   (~p~ = 2,2 %)', { 'font-size': 30, 'font-weight': 600 });
      m.note = ftx(svg, 140, 990, 'Au dénominateur : le ~ϕ~ de H₀, pas ~f~ (c\'est l\'intervalle de pari, pas l\'IC).', { 'font-size': 26, class: 't-pop' });
      m.uni = noteBox(svg, 1000, 800, 860, ['Unilatéral droit (H₁ : ~ϕ~ > 0,20) : 2,28 > ~ε~(2~α~) = 1,645', '{b:et} ~f~_e > ~ϕ~ → rejet. Gauche : ~ε~ > ~ε~(2~α~) et ~f~_e < ~ϕ~.'], { size: 27 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.ch.shown = m.ch.counts.slice(); m.ch.drawBars();
      vis([m.ch.frame, m.ch.cart, m.ch.bars, m.thr, m.ax.g, m.fe], k >= 0); vis(m.ch.mean.g, false);
      vis(m.h0, k >= 1); vis([m.f, m.note], k >= 2); vis(m.uni, k >= 3);
    },
    play(m, k, c) {
      if (k === 0) {
        fadeIn(c, [m.ch.frame, m.ch.cart, m.ax.g], 0, 500);
        growBars(c, m.ch, 300, 40);
        fadeIn(c, m.thr, 1600, 400);
        return stagger(c, m.fe, 1900, 300, 500);
      }
      if (k === 1) return stagger(c, m.h0, 0, 250, 450);
      if (k === 2) { const e = stagger(c, m.f, 0, 350, 450); fadeIn(c, m.note, e, 500); return e + 600; }
      return stagger(c, m.uni, 0, 250, 450);
    }
  });

  /* ======================= FRÉQUENCE : BILATÉRAL, GAUCHE OU DROIT ? =======================
     Trois cloches réduites côte à côte, une par clic, bien distinctes (flèche de H₁, queue(s) rouge(s), seuil, règle) ;
     puis on y place notre z = +2,28, et on conclut d'après la question posée. */
  const CU = [
    { cx: 340, name: 'Bilatéral', h1: 'H₁ : ~ϕ~ ≠ 0,20', side: 0, tails: [[-3.4, -Z95], [Z95, 3.4]], th: [[-Z95, '−1,96'], [Z95, '+1,96']], a: '~α~/2',
      rule: ['on rejette H₀ si', '~ε~ > ~ε~(~α~) = 1,96'], verdict: '2,28 > 1,96 → {R:rejet}', out: true },
    { cx: 960, name: 'Unilatéral gauche', h1: 'H₁ : ~ϕ~ < 0,20', side: -1, tails: [[-3.4, -Z90]], th: [[-Z90, '−1,645']], a: '~α~',
      rule: ['on rejette H₀ si ~ε~ > ~ε~(2~α~) = 1,645', '{b:et} ~f~_e < ~ϕ~ (côté négatif)'], verdict: 'mauvais côté (~f~_e > ~ϕ~) → on {b:accepte} H₀', out: false },
    { cx: 1580, name: 'Unilatéral droit', h1: 'H₁ : ~ϕ~ > 0,20', side: 1, tails: [[Z90, 3.4]], th: [[Z90, '+1,645']], a: '~α~',
      rule: ['on rejette H₀ si ~ε~ > ~ε~(2~α~) = 1,645', '{b:et} ~f~_e > ~ϕ~ (côté positif)'], verdict: '2,28 > 1,645 et ~f~_e > ~ϕ~ → {R:rejet}', out: true },
  ];
  const CU_Z = (11 / 30 - 0.2) / Math.sqrt(0.2 * 0.8 / 30);   // +2,28
  stepped('cfuni', {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Fréquence : bilatéral, gauche ou droit ?', { class: 't-title' });
      m.cap = ftx(svg, 960, 150, 'H₀ : ~ϕ~ = 0,20. Le côté du test dépend de H₁, et on le choisit {b:avant} de regarder ~f~_e.', { 'text-anchor': 'middle', 'font-size': 30 });
      const B = 560, SX = 72, PK = 190, X = (p, z) => p.cx + z * SX, Y = z => B - PK * Math.exp(-z * z / 2);
      const P = (p, a, b) => { let d = ''; for (let i = 0; i <= 80; i++) { const z = a + (b - a) * i / 80; d += (i ? 'L' : 'M') + X(p, z).toFixed(1) + ' ' + Y(z).toFixed(1); } return d; };
      const A = (p, a, b) => P(p, a, b) + `L${X(p, b).toFixed(1)} ${B}L${X(p, a).toFixed(1)} ${B}Z`;
      m.panels = CU.map(p => {
        const g = S('g', {}, svg);
        card(g, p.cx - 290, 190, 580, 600, 'card', 16);
        ftx(g, p.cx, 246, '{b:' + p.name + '}', { 'text-anchor': 'middle', 'font-size': 34 });
        ftx(g, p.cx, 290, '{P:' + p.h1 + '}', { 'text-anchor': 'middle', 'font-size': 28 });
        // H₁ arrow(s)
        const ya = 322;
        if (p.side <= 0) { S('line', { x1: p.cx - 14, x2: p.cx - 150, y1: ya, y2: ya, class: 'h1-arr' }, g); arrowHead(g, p.cx - 156, ya, Math.PI, 'h1-arr-h', 14); }
        if (p.side >= 0) { S('line', { x1: p.cx + 14, x2: p.cx + 150, y1: ya, y2: ya, class: 'h1-arr' }, g); arrowHead(g, p.cx + 156, ya, 0, 'h1-arr-h', 14); }
        S('path', { d: A(p, -3.4, 3.4), class: 'ic-area-k' }, g);
        p.tails.forEach(([a, b]) => S('path', { d: A(p, a, b), class: 'ic-tail' }, g));
        S('path', { d: P(p, -3.4, 3.4), class: 'ic-curve-k' }, g);
        S('line', { x1: X(p, -3.6), x2: X(p, 3.6), y1: B, y2: B, class: 'axl' }, g);
        S('line', { x1: p.cx, x2: p.cx, y1: B + 8, y2: B - 8, class: 'axl' }, g);
        tx(g, p.cx, B + 30, '0', { 'text-anchor': 'middle', class: 't-tick' });
        p.th.forEach(([z, l]) => { S('line', { x1: X(p, z), x2: X(p, z), y1: B - 40, y2: B + 14, class: 'zone-l' }, g); tx(g, X(p, z), B + 30, l, { 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, class: 't-red' }); });
        p.tails.forEach(([a, b]) => ftx(g, X(p, a < 0 ? -2.75 : 2.75), B - 40, '{R:' + p.a + '}', { 'text-anchor': 'middle', 'font-size': 26 }));
        ftx(g, X(p, 3.6) + 6, B + 8, '~z~', { 'font-size': 24, 'font-weight': 600, class: 't-or' });
        p.rule.forEach((l, i) => ftx(g, p.cx, 640 + i * 38, l, { 'text-anchor': 'middle', 'font-size': 25 }));
        // application: our z
        const ap = S('g', {}, svg);
        S('circle', { cx: X(p, CU_Z), cy: B, r: 11, class: 'ic-pt' + (p.out ? ' out' : '') }, ap);
        ftx(ap, X(p, CU_Z), B - 70, (p.out ? '{R:' : '{O:') + '+2,28}', { 'text-anchor': 'middle', 'font-size': 26, class: 'halo' });
        ftx(ap, p.cx, 750, p.verdict, { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600 });
        return { g, ap };
      });
      m.applyCap = ftx(svg, 960, 860, 'Notre échantillon : ~f~_e = 0,367 → ~z~ = (0,367 − 0,20) / 0,0730 = {b:+2,28}, donc ~ε~ = 2,28.', { 'text-anchor': 'middle', 'font-size': 30 });
      m.end = noteBox(svg, 160, 900, 1600, ['Ici, la question est « le fabricant prévoit-il {b:assez} de gants L ? » : H₁ : ~ϕ~ > 0,20.', '→ {b:unilatéral droit} : on {R:rejette H₀}. Il faut plus de 20 % de gants L.'], { size: 30, center: true, cls: 'box-red' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.cap, k >= 0);
      m.panels.forEach((p, i) => { vis(p.g, k >= i); vis(p.ap, k >= 3); });
      vis(m.applyCap, k === 3); vis(m.end, k >= 4);
    },
    play(m, k, c) {
      if (k <= 2) { const g = m.panels[k].g; g.style.opacity = 0; if (k === 0) fadeIn(c, m.cap, 0, 500); c.at(k === 0 ? 400 : 0, () => { g.style.opacity = ''; c.anim(g, { opacity: [0, 1], translateY: [30, 0], duration: T(700), ease: 'out(3)' }); }); return 1200; }
      if (k === 3) {
        fadeIn(c, m.applyCap, 0, 500);
        m.panels.forEach((p, i) => { vis(p.ap, true); const [dot, lab, ver] = p.ap.children; [lab, ver].forEach(e => { e.style.opacity = 0; });
          c.at(800 + i * 900, () => { c.anim(dot, { opacity: [0, 1], scale: [2, 1], duration: T(500), ease: 'out(3)' }); });
          fadeIn(c, lab, 900 + i * 900, 400); fadeIn(c, ver, 1200 + i * 900, 500); dot.style.opacity = 0; });
        return 800 + 3 * 900 + 600;
      }
      fadeOut(c, m.applyCap, 0, 300);
      popIn(c, m.end, 300, 600);
      return 1000;
    }
  });

  /* ======================= DIAPO 14 · CONFORMITÉ D'UNE MOYENNE ======================= */
  stepped('cmoy', {
    labels: ['M1', 'M2', 'M3', 'M4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Conformité d\'une moyenne : la formule du cours', { class: 't-title' });
      m.f = S('g', {}, svg);
      fracLine(m.f, 330, 250, '~δ~ =', '|~m~ − ~μ~|', '{g:~s~} / √~N~', 200, '', 40);
      fracLine(m.f, 700, 250, '=', '|~m~ − ~μ~|', '{o:~S~_e} / √(~N~ − 1)', 270, '', 40);
      ftx(m.f, 120, 396, '{p:~σ~} est inconnu : on le remplace par', { 'font-size': 28 });
      ftx(m.f, 120, 436, 'son estimation {g:~s~} (le poly écrit ~S~).', { 'font-size': 28 });
      // the tree: which table for δ(α)?
      m.tree = S('g', {}, svg);
      const R0 = [1430, 196], cols = [1145, 1435, 1725];
      card(m.tree, 1250, 150, 360, 70, 'box', 12);
      ftx(m.tree, 1430, 196, '{b:Quel seuil ~δ~(~α~) ?}', { 'text-anchor': 'middle', 'font-size': 28 });
      m.edges = cols.map(x => S('path', { d: `M${R0[0]} 220 C ${R0[0]} 260, ${x} 250, ${x} 300`, class: 'tree-l' }, m.tree));
      const leaves = [['~N~ > 30', 'Gauss', '~ε~(~α~)'], ['~N~ ≤ 30, gaussien', 'Student', '~t~(~α~), ~N~ − 1 ddl'], ['non gaussien,', '~N~ < 30', 'non paramétrique']];
      m.leaf = leaves.map((ls, i) => {
        const g = S('g', {}, m.tree), x = cols[i];
        card(g, x - 135, 300, 270, 170, 'box', 12);
        ls.forEach((l, j) => ftx(g, x, 344 + j * 46, j === 0 ? '{b:' + l + '}' : l, { 'text-anchor': 'middle', 'font-size': 26 }));
        return g;
      });
      m.app = S('g', {}, svg);
      ftx(m.app, 120, 520, '{b:G1} : ~N~ = 30 (pas > 30) et les mains sont gaussiennes → {G:Student à 29 ddl}', { 'font-size': 30 });
      ftx(m.app, 120, 590, '~m~ = 70,4 mm · {g:~s~ = 4,26 mm} ({o:~S~_e = 4,19 mm})', { 'font-size': 30 });
      ftx(m.app, 120, 660, '~δ~ = 2,1 / (4,26 / √30) = 2,1 / 0,778 = {b:2,70}', { 'font-size': 34, 'font-weight': 600 });
      m.ver = S('g', {}, svg);
      noteBox(m.ver, 120, 730, 830, ['~α~ = 5 % : ~t~(~α~) = 2,045', '2,70 > 2,05 → on {R:rejette H₀}'], { size: 30, cls: 'box-red' });
      noteBox(m.ver, 970, 730, 830, ['~α~ = 1 % : ~t~(~α~) = 2,756', '2,70 < 2,76 → on {b:accepte} H₀'], { size: 30 });
      ftx(m.ver, 120, 940, 'Mêmes conclusions qu\'avec {p:~σ~} connu (~ε~ = 2,42). Unilatéral : on compare à ~δ~(2~α~).', { 'font-size': 28, class: 't-pop' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.f, k >= 0); vis(m.tree, k >= 1); vis(m.app, k >= 2); vis(m.ver, k >= 3);
      const on = k >= 2;
      m.edges.forEach((e, i) => e.classList.toggle('tree-on', on && i === 1));
      m.leaf.forEach((g, i) => { g.firstChild.setAttribute('class', on && i === 1 ? 'box-green' : 'box'); g.style.opacity = on && i !== 1 ? 0.4 : ''; });
    },
    play(m, k, c) {
      if (k === 0) return stagger(c, m.f, 0, 400, 500);
      if (k === 1) {
        vis(m.tree, true); [...m.tree.children].forEach(e => { e.style.opacity = 0; });
        fadeIn(c, [m.tree.children[0], m.tree.children[1]], 0, 400);
        m.edges.forEach((e, i) => { c.at(400 + i * 300, () => drawPath(c, e, 500)); hidePath(e); });
        m.leaf.forEach((g, i) => fadeIn(c, g, 800 + i * 300, 400));
        return 2000;
      }
      if (k === 2) {
        m.edges[1].classList.add('tree-on'); m.leaf[1].firstChild.setAttribute('class', 'box-green');
        c.anim([m.leaf[0], m.leaf[2]], { opacity: [1, 0.4], duration: T(500) });
        return stagger(c, m.app, 400, 400, 500);
      }
      return stagger(c, m.ver, 0, 350, 500);
    }
  });

  /* ======================= DIAPO 15 · CONFORMITÉ D'UNE VARIANCE ======================= */
  const LG145 = 23.86276584168909;   // ln Γ(14,5) : loi du χ² à 29 ddl
  const chi29 = y => y <= 0 ? 0 : Math.exp(13.5 * Math.log(y) - y / 2 - 14.5 * Math.LN2 - LG145);
  const CHI_LO = 16.05, CHI_HI = 45.72, CHI_G1 = 30 * 17.5733 / 22.5;   // 23,4
  const CV = { x0: 160, x1: 1760, d1: 60, base: 800, peak: 300 };
  const cX = y => CV.x0 + y / CV.d1 * (CV.x1 - CV.x0), cY = y => CV.base - CV.peak * chi29(y) / chi29(27);
  const chiPath = (a, b) => { let d = ''; for (let i = 0; i <= 160; i++) { const y = a + (b - a) * i / 160; d += (i ? 'L' : 'M') + cX(y).toFixed(1) + ' ' + cY(y).toFixed(1); } return d; };
  const chiArea = (a, b) => chiPath(a, b) + `L${cX(b).toFixed(1)} ${CV.base}L${cX(a).toFixed(1)} ${CV.base}Z`;
  stepped('cvar', {
    labels: ['V1', 'V2', 'V3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Conformité d\'une variance', { class: 't-title' });
      m.top = S('g', {}, svg);
      ftx(m.top, 120, 200, '{P:H₀ : ~σ~² = 22,5 mm²} (cours 1)', { 'font-size': 32 });
      fracLine(m.top, 320, 290, '~χ~² =', '~N~ · {o:~S~_e²}', '{p:~σ~²}', 170, '', 40);
      ftx(m.top, 120, 400, 'suit une loi du ~χ~² à ~N~ − 1 = 29 ddl', { 'font-size': 30 });
      m.chart = S('g', {}, svg);
      S('path', { d: chiArea(0.01, CV.d1), class: 'ic-area-k' }, m.chart);
      S('path', { d: chiArea(0.01, CHI_LO), class: 'ic-tail' }, m.chart);
      S('path', { d: chiArea(CHI_HI, CV.d1), class: 'ic-tail' }, m.chart);
      S('path', { d: chiPath(0.01, CV.d1), class: 'ic-curve-k' }, m.chart);
      S('line', { x1: CV.x0 - 20, x2: CV.x1 + 20, y1: CV.base, y2: CV.base, class: 'axl' }, m.chart);
      range(0, 60, 10).forEach(v => { S('line', { x1: cX(v), x2: cX(v), y1: CV.base, y2: CV.base + 8, class: 'axl' }, m.chart); tx(m.chart, cX(v), CV.base + 36, String(v), { 'text-anchor': 'middle', class: 't-tick' }); });
      ftx(m.chart, CV.x1 + 28, CV.base + 10, '~χ~²', { 'font-size': 30, 'font-weight': 600 });
      [[CHI_LO, '~χ~²(1 − ~α~/2) = 16,05'], [CHI_HI, '~χ~²(~α~/2) = 45,72']].forEach(([v, l]) => {
        S('line', { x1: cX(v), x2: cX(v), y1: CV.base - 40, y2: CV.base + 60, class: 'ic-musolid' }, m.chart);
        ftx(m.chart, cX(v), CV.base + 96, l, { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 600 });
      });
      ftx(m.chart, cX(4.5), CV.base - 40, '{R:~α~/2}', { 'text-anchor': 'middle', 'font-size': 32 });
      ftx(m.chart, cX(52), CV.base - 40, '{R:~α~/2}', { 'text-anchor': 'middle', 'font-size': 32 });
      ftx(m.chart, cX(31), 450, '{b:pas symétrique} : deux bornes, lues chacune dans la table', { 'text-anchor': 'middle', 'font-size': 28, class: 'halo' });
      m.pt = S('g', {}, svg);
      m.ptDot = S('circle', { cx: cX(CHI_G1), cy: CV.base, r: 12, class: 'ic-pt' }, m.pt);
      ftx(m.pt, cX(CHI_G1), CV.base - 70, '{O:G1 : ~χ~² = 23,4}', { 'text-anchor': 'middle', 'font-size': 32, class: 'halo' });
      m.res = S('g', {}, svg);
      ftx(m.res, 1240, 200, '~χ~² = 30 × 17,57 / 22,5 = {b:23,4}', { 'font-size': 32 });
      ftx(m.res, 1240, 250, '16,05 < 23,4 < 45,72 → on {b:accepte} H₀', { 'font-size': 32, 'font-weight': 600 });
      ftx(m.res, 1240, 296, 'unilatéral droit : rejet si ~χ~² > ~χ~²(~α~)', { 'font-size': 26, class: 't-pop' });
      ftx(m.res, 1240, 334, 'unilatéral gauche : rejet si ~χ~² < ~χ~²(1 − ~α~)', { 'font-size': 26, class: 't-pop' });
      m.metro = ftx(svg, 960, 1010, '~Très utilisé en métrologie : l\'étalonnage d\'une balance, par exemple.~', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.ptDot.setAttribute('cy', CV.base);
      vis(m.top, k >= 0); vis(m.chart, k >= 1); vis([m.pt, m.res, m.metro], k >= 2);
    },
    play(m, k, c) {
      if (k === 0) return stagger(c, m.top, 0, 350, 500);
      if (k === 1) {
        vis(m.chart, true); const kids = [...m.chart.children];
        kids.forEach(e => { e.style.opacity = 0; });
        fadeIn(c, kids.slice(0, 5), 0, 700);
        fadeIn(c, kids.slice(5), 700, 600);
        return 1500;
      }
      vis(m.pt, true); m.ptDot.setAttribute('cy', 380); m.pt.lastChild.style.opacity = 0;
      tweenT(c, 800, 0, t => m.ptDot.setAttribute('cy', lerp(380, CV.base, t)), 'outBounce');
      fadeIn(c, m.pt.lastChild, 700, 400);
      const e = stagger(c, m.res, 900, 300, 450);
      fadeIn(c, m.metro, e, 500);
      return e + 600;
    }
  });
