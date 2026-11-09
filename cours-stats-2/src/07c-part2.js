
  /* ---------- petites briques communes aux diapos ---------- */
  // une légende sur une ou deux lignes, centrée en haut de la diapo ; une seule visible à la fois
  function captions(svg, list, y = 158, size = 32) {
    return list.map(lines => {
      const g = S('g', {}, svg);
      [].concat(lines).forEach((l, i) => ftx(g, 960, y + i * (size + 12), l, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 500 }));
      return g;
    });
  }
  function showCap(caps, k) { caps.forEach((g, i) => vis(g, i === k)); }
  function swapCap(c, caps, k) { if (caps[k - 1]) fadeOut(c, caps[k - 1], 0, 250); if (caps[k]) fadeIn(c, caps[k], 200, 500); }
  // an annotation box: lines of markup inside a rounded rectangle
  function noteBox(parent, x, y, w, lines, o = {}) {
    const g = S('g', {}, parent), size = o.size || 30, lh = o.lh || size * 1.35, pad = o.pad || 24;
    const h = o.h || pad * 2 + lh * lines.length - (lh - size);
    card(g, x, y, w, h, o.cls || 'box', 12);
    lines.forEach((l, i) => ftx(g, o.center ? x + w / 2 : x + pad, y + pad + size * 0.82 + i * lh, l, Object.assign({ 'font-size': size, 'font-weight': o.w || 500 }, o.center ? { 'text-anchor': 'middle' } : {})));
    g.h = h;
    return g;
  }
  function arrowLine(parent, x1, y1, x2, y2, cls = 'est-arr', hcls = 'est-arr-h', size = 14) {
    const g = S('g', {}, parent), a = Math.atan2(y2 - y1, x2 - x1);
    S('line', { x1, y1, x2: x2 - Math.cos(a) * size * 0.6, y2: y2 - Math.sin(a) * size * 0.6, class: cls }, g);
    arrowHead(g, x2, y2, a, hcls, size);
    return g;
  }
  function hatchDefs(svg, key, light) {
    const defs = S('defs', {}, svg);
    const pat = S('pattern', { id: 'hb-' + key, patternUnits: 'userSpaceOnUse', width: 13, height: 13, patternTransform: 'rotate(45)' }, defs);
    S('rect', { width: 13, height: 13, class: 'beta-bg' }, pat);
    S('line', { x1: 2, y1: 0, x2: 2, y2: 13, class: 'beta-hatch' + (light ? ' light' : '') }, pat);
    return `url(#hb-${key})`;
  }

  /* ======================= DIAPO 1 · TITRE ======================= */
  stepped('titre', {
    labels: ['titre'],
    build(svg) {
      const m = {};
      m.title = tx(svg, 960, 430, 'Statistiques probabilistes 2', { 'text-anchor': 'middle', 'font-size': 104, 'font-weight': 700, 'letter-spacing': '-2' });
      m.sub = tx(svg, 960, 535, 'Tests d\'hypothèses', { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 500 });
      // emblem: the bell of H₀, its two red tails and a mean fallen in one of them
      m.joke = tx(svg, 960, 612, '~Toujours pas un cours~', { 'text-anchor': 'middle', 'font-size': 38, class: 't-pop' });
      const g = m.emb = S('g', { transform: 'translate(0 40)' }, svg), X = z => 960 + z * 70, Y = z => 790 - 150 * Math.exp(-z * z / 2);
      const P = (a, b) => { let d = ''; for (let i = 0; i <= 80; i++) { const z = a + (b - a) * i / 80; d += (i ? 'L' : 'M') + X(z).toFixed(1) + ' ' + Y(z).toFixed(1); } return d; };
      const A = (a, b) => P(a, b) + `L${X(b)} 790L${X(a)} 790Z`;
      S('path', { d: A(-3.2, 3.2), class: 'ic-area-k' }, g);
      S('path', { d: A(-3.2, -1.96), class: 'ic-tail' }, g);
      S('path', { d: A(1.96, 3.2), class: 'ic-tail' }, g);
      S('path', { d: P(-3.2, 3.2), class: 'ic-curve-k' }, g);
      S('line', { x1: X(-3.5), x2: X(3.5), y1: 790, y2: 790, class: 'axl' }, g);
      S('circle', { cx: X(-2.42), cy: 790, r: 10, class: 'ic-pt out' }, g);
      m.foot = tx(svg, 960, 930, 'Tutorat PASS · UE4 Biostatistiques - Esteban Mora', { 'text-anchor': 'middle', 'font-size': 26, class: 't-pop' });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.title, m.sub, m.joke, m.emb, m.foot], k >= 0); },
    play(m, k, c) {
      c.anim(m.title, { opacity: [0, 1], translateY: [40, 0], duration: T(900), ease: 'out(3)' });
      fadeIn(c, m.sub, 500, 700);
      fadeIn(c, m.joke, 800, 700);
      fadeIn(c, m.emb, 1100, 700);
      fadeIn(c, m.foot, 1500, 600);
      return 2200;
    }
  });

  /* ======================= LA PIÈCE (deux diapos, avant les gants) =======================
     PIECE0 on pose H₀ « la pièce est normale » ; face = succès, pile = échec ; ϕ = 0,5 ; N = 10 ;
            rappel de la fréquence ; 6 faces → fₑ = 0,6 ; fluctuation d'échantillonnage ; l'IP à 5 % = [0,19 ; 0,81]
     PIECE  les tirages : l'histogramme de B(10 ; 0,5) avec la courbe de Gauss superposée, l'IP dessous et la formule
            en bas (comme au cours 1) ; 6, 10 puis 8 faces ; le choix de α ; 5 faces : on accepte H₀ faute de preuves ;
            les 2 possibilités (texte du poly) */
  const BIN10 = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1];   // /1024 : loi binomiale B(10 ; 0,5)
  const SD10 = Math.sqrt(0.25 / 10);                                // 0,158
  const FACES = { 6: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0], 10: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 8: [1, 1, 0, 1, 1, 1, 1, 0, 1, 1], 5: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0] };   // 1 = face (succès)
  function makeCoin(parent, x, y, r) {
    const g = S('g', { transform: `translate(${x.toFixed(1)} ${y})` }, parent), inner = S('g', {}, g);
    const c = S('circle', { cx: 0, cy: 0, r, class: 'coin' }, inner);
    const t = tx(inner, 0, r * 0.32, '?', { 'text-anchor': 'middle', 'font-size': r * 0.95, 'font-weight': 700 });
    const o = { g, inner, c, t };
    o.set = v => {   // 1 = face (succès), 0 = pile (échec), null = pas encore lancée
      c.setAttribute('class', v == null ? 'coin' : v ? 'coin pile' : 'coin face');
      rich(t, v == null ? '?' : v ? 'F' : 'P');
      t.setAttribute('class', v ? 't-white' : v === 0 ? 't-blue' : 't-pop');
    };
    return o;
  }
  function flipCoins(c, coins, set, d = 0, gap = 90) {
    coins.forEach((o, i) => c.at(d + i * gap, () => c.anim(o.inner, { scaleX: [1, 0], duration: T(140), ease: 'in(2)', onComplete: () => { o.set(set[i]); c.anim(o.inner, { scaleX: [0, 1], duration: T(140), ease: 'out(2)' }); } })));
    return d + coins.length * gap + 300;
  }

  stepped('piece0', {
    labels: ['H1', 'H2', 'H3', 'H4', 'H5'],
    build(svg) {
      const m = {};
      m.t = tx(svg, 960, 100, 'Je lance une pièce 10 fois. Est-ce qu\'elle est truquée ?', { 'text-anchor': 'middle', 'font-size': 52, 'font-weight': 700 });
      m.h0 = S('g', {}, svg);
      card(m.h0, 520, 146, 880, 84, 'popbox', 14);
      ftx(m.h0, 960, 202, 'On pose {P:H₀ : « la pièce est normale »}', { 'text-anchor': 'middle', 'font-size': 38 });
      // definitions
      m.def = S('g', {}, svg);
      makeCoin(m.def, 200, 300, 30).set(1); ftx(m.def, 250, 312, 'face = {b:succès}', { 'font-size': 34 });
      makeCoin(m.def, 200, 376, 30).set(0); ftx(m.def, 250, 388, 'pile = échec', { 'font-size': 34 });
      ftx(m.def, 170, 466, 'Sous H₀ : {P:~ϕ~ = 0,5}  {p:(la probabilité de face)}', { 'font-size': 34 });
      ftx(m.def, 170, 528, 'Notre échantillon : {b:~N~ = 10} lancers', { 'font-size': 34 });
      // the sample and its frequency
      m.coins = range(0, 9, 1).map(i => makeCoin(svg, 1040 + i * 72, 300, 30));
      m.fr = S('g', {}, svg);
      ftx(m.fr, 1000, 412, '{b:Rappel} : ~f~_e = nombre d\'issues de la modalité / ~N~ total', { 'font-size': 30 });
      ftx(m.fr, 1000, 490, '6 faces sur 10 → {O:~f~_e = 6/10 = 0,6}', { 'font-size': 42 });
      // can we say it is loaded?
      m.q = S('g', {}, svg);
      ftx(m.q, 960, 612, 'Est-ce qu\'on peut pour autant dire que la pièce est truquée ? {b:Non.}', { 'text-anchor': 'middle', 'font-size': 36 });
      ftx(m.q, 960, 662, 'Il y a une {b:fluctuation d\'échantillonnage} : d\'autres séries de 10 lancers d\'une pièce normale donnent', { 'text-anchor': 'middle', 'font-size': 28, class: 't-pop' });
      [0.4, 0.7, 0.5, 0.3, 0.6, 0.5].forEach((v, i) => {
        const g = S('g', { transform: `translate(${(960 + (i - 2.5) * 110).toFixed(1)} 718)` }, m.q);
        S('rect', { x: -40, y: -22, width: 80, height: 44, rx: 22, class: 'chip' }, g);
        tx(g, 0, 9, fr(v, 1), { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700, class: 't-or' });
      });
      // so: an interval of the bet
      m.ip = S('g', {}, svg);
      card(m.ip, 160, 786, 1600, 262, 'box', 14);
      m.hl = S('g', {}, m.ip);
      ftx(m.ip, 960, 840, 'Comment faire ? On détermine un {b:intervalle de pari}.', { 'text-anchor': 'middle', 'font-size': 32 });
      ftx(m.ip, 960, 912, 'IP = {P:~ϕ~} ± {k:~ε~(~α~)}·√({p:~ϕ~(1 − ~ϕ~)}/~N~)', { 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 600 });
      ftx(m.ip, 960, 972, 'à ~α~ = 5 % : 0,5 ± {k:1,96} × √(0,5 × 0,5 / 10) = 0,5 ± 1,96 × 0,158 = {b:[0,19 ; 0,81]}', { 'text-anchor': 'middle', 'font-size': 30 });
      ftx(m.ip, 960, 1020, '{p:Conditions : ~N~~ϕ~ = ~N~(1 − ~ϕ~) = 5, juste à la limite (le poly demande > 5) : on fait comme si, pour l\'exemple.}', { 'text-anchor': 'middle', 'font-size': 22 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.coins.forEach((o, i) => o.set(k >= 2 ? FACES[6][i] : null));
      vis([m.t, m.h0], k >= 0); vis(m.def, k >= 1); vis([m.coins.map(o => o.g), m.fr], k >= 2); vis(m.q, k >= 3); vis(m.ip, k >= 4);
      m.hl.replaceChildren(); if (k >= 4) markMult(m.ip, m.hl);
    },
    play(m, k, c) {
      switch (k) {
        case 0: fadeIn(c, m.t, 0, 600); popIn(c, m.h0, 600, 600); return 1300;
        case 1: return stagger(c, m.def, 0, 220, 450);
        case 2: {
          m.coins.forEach((o, i) => { o.set(null); popIn(c, o.g, i * 60, 350); });
          const e = flipCoins(c, m.coins, FACES[6], 800, 80);
          return stagger(c, m.fr, e, 500, 500);
        }
        case 3: return stagger(c, m.q, 0, 160, 450);
        case 4: { const e = stagger(c, m.ip, 0, 350, 500); c.at(e - 300, () => markMult(m.ip, m.hl)); return e; }
      }
    }
  });

  // the bars of B(10 ; 0,5) on the axis of fₑ, the Gauss curve that approaches them, the IP under the axis
  const PC = { x0: 360, w: 1200, base: 790, h: 250, bw: 70 };
  const pcX = f => PC.x0 + f * PC.w;
  const gaussBin = f => Math.exp(-((f - 0.5) ** 2) / (2 * SD10 * SD10)) / (SD10 * Math.sqrt(2 * Math.PI)) * 0.1;   // per 0,1 class
  const PMAX = gaussBin(0.5);
  const pcY = p => PC.base - p / PMAX * PC.h;
  const TIRAGES = [null, 6, 10, 8, 8, 5, 5];   // faces shown at each step
  stepped('piece', {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    build(svg) {
      const m = { z: Z95 };
      tx(svg, 60, 90, FM('Tirages au sort, sous H₀ : {P:~ϕ~ = 0,5}'), { class: 't-title' });
      m.coins = range(0, 9, 1).map(i => makeCoin(svg, 960 + (i - 4.5) * 88, 180, 34));
      m.res = tx(svg, 960, 282, '', { 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 700, class: 't-or' });
      m.say = [
        ['Avec une pièce normale, 95 % des ~f~_e tombent dans l\'IP [0,19 ; 0,81].'],
        ['Tout le monde dit non, c\'est normal.', '0,6 est dans l\'IP → on ne peut rien conclure.'],
        ['Tout le monde dit oui. Pourquoi ? Si la pièce était normale, ça n\'arriverait qu\'{b:une fois sur 1 000}.', '1 est hors de l\'IP → on {R:rejette H₀}.'],
        ['La salle hésite : 0,8 est juste dans l\'IP [0,19 ; 0,81].', '→ Où mettre la limite ? {b:C\'est le choix de ~α~.}'],
        ['Avec ~α~ = 10 %, l\'IP se resserre : [0,24 ; 0,76], et 0,8 serait rejeté.', '{p:On choisit ~α~ avant de lancer la pièce.}'],
        ['Ce n\'est pas parce que j\'ai 5 faces sur 10 que la pièce n\'est forcément pas truquée.', 'Donc j\'{b:accepte H₀} en manque de preuves pour la rejeter.'],
      ].map(lines => { const g = S('g', {}, svg); lines.forEach((l, i) => ftx(g, 960, 344 + i * 46, l, { 'text-anchor': 'middle', 'font-size': i ? 32 : 34, 'font-weight': i ? 600 : 500 })); return g; });
      // the chart
      m.chart = S('g', {}, svg);
      m.tailL = S('path', { class: 'ic-tail' }, m.chart); m.tailR = S('path', { class: 'ic-tail' }, m.chart);
      m.bars = BIN10.map((n, k) => {
        const p = n / 1024, f = k / 10;
        const r = S('rect', { x: pcX(f) - PC.bw / 2, y: pcY(p), width: PC.bw, height: Math.max(PC.base - pcY(p), 2), class: 'bin grow' }, m.chart);
        const l = tx(m.chart, pcX(f), Math.min(pcY(p), pcY(gaussBin(f))) - 10, fr(100 * p, 1) + ' %', { 'text-anchor': 'middle', 'font-size': 20, class: 't-pop halo' });
        return { r, l, f };
      });
      let d = '';
      for (let i = 0; i <= 160; i++) { const f = -0.06 + 1.12 * i / 160; d += (i ? 'L' : 'M') + pcX(f).toFixed(1) + ' ' + pcY(gaussBin(f)).toFixed(1); }
      m.curve = S('path', { d, class: 'ic-curve-k' }, m.chart);
      S('line', { x1: pcX(-0.08), x2: pcX(1.08), y1: PC.base, y2: PC.base, class: 'axl' }, m.chart);
      range(0, 10, 1).forEach(k => { S('line', { x1: pcX(k / 10), x2: pcX(k / 10), y1: PC.base, y2: PC.base + 8, class: 'axl' }, m.chart); tx(m.chart, pcX(k / 10), PC.base + 34, k % 10 ? fr(k / 10, 1) : String(k / 10), { 'text-anchor': 'middle', class: 't-tick' }); });
      ftx(m.chart, pcX(1.08) + 14, PC.base + 10, '{O:~f~_e}', { 'font-size': 32 });
      ftx(m.chart, pcX(-0.08) - 14, PC.base + 10, '{p:B(10 ; 0,5)}', { 'font-size': 22, 'text-anchor': 'end' });
      // the interval of the bet, under the axis
      m.ipG = S('g', {}, m.chart);
      m.seg = S('line', { y1: 862, y2: 862, class: 'ic-seg p' }, m.ipG);
      m.br = [-1, 1].map(() => S('path', { class: 'ic-br p' }, m.ipG));
      m.lo = tx(m.ipG, 0, 872, '', { 'text-anchor': 'end', 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      m.hi = tx(m.ipG, 0, 872, '', { 'text-anchor': 'start', 'font-size': 28, 'font-weight': 600, class: 't-pop' });
      tx(m.ipG, pcX(0.5), 906, 'IP', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 700, class: 't-pop' });
      // the formula, at the bottom (as in course 1)
      m.fbox = S('g', {}, svg);
      card(m.fbox, 260, 940, 1400, 90, 'box', 12);
      m.hl = S('g', {}, m.fbox);
      m.formula = tx(m.fbox, 960, 998, '', { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 600 });
      // the 2 possibilities (poly, II.A.2)
      m.two = S('g', {}, svg);
      card(m.two, 160, 460, 1600, 560, 'box-pop', 16);
      ftx(m.two, 200, 530, '{b:2 possibilités :}', { 'font-size': 38 });
      const bul = (y, lines, ex) => { S('circle', { cx: 222, cy: y - 11, r: 7, class: 'f-bullet' }, m.two); lines.forEach((l, i) => ftx(m.two, 250, y + i * 46, l, { 'font-size': 32 })); ftx(m.two, 250, y + lines.length * 46 + 4, ex, { 'font-size': 24, class: 't-pop' }); };
      bul(610, ['Les données sont {R:improbables sous H₀} (trop éloignées des valeurs attendues) et', 'on choisit de dire que {b:H₀ n\'est pas réalisée}, mais qu\'une {b:alternative H₁} (une autre', 'situation) est réalisée.'], '~exemple : 10 faces sur 10~');
      bul(850, ['Les données sont {b:probables sous H₀} (proches des valeurs attendues) et on', '{b:accepte l\'hypothèse H₀}, faute d\'argument pour la rejeter.'], '~exemple : 6 ou 5 faces sur 10~');
      m.draw = (hiK) => {
        const z = m.z, lo = 0.5 - z * SD10, hi = 0.5 + z * SD10;
        const area = (a, b) => { let p = ''; for (let i = 0; i <= 60; i++) { const f = a + (b - a) * i / 60; p += (i ? 'L' : 'M') + pcX(f).toFixed(1) + ' ' + pcY(gaussBin(f)).toFixed(1); } return p + `L${pcX(b).toFixed(1)} ${PC.base}L${pcX(a).toFixed(1)} ${PC.base}Z`; };
        m.tailL.setAttribute('d', area(-0.06, lo)); m.tailR.setAttribute('d', area(hi, 1.06));
        m.seg.setAttribute('x1', pcX(lo)); m.seg.setAttribute('x2', pcX(hi));
        m.br[0].setAttribute('d', `M${pcX(lo) + 16} 840L${pcX(lo)} 840L${pcX(lo)} 884L${pcX(lo) + 16} 884`);
        m.br[1].setAttribute('d', `M${pcX(hi) - 16} 840L${pcX(hi)} 840L${pcX(hi)} 884L${pcX(hi) - 16} 884`);
        rich(m.lo, fr(lo, 2)); m.lo.setAttribute('x', pcX(lo) - 12); rich(m.hi, fr(hi, 2)); m.hi.setAttribute('x', pcX(hi) + 12);
        m.bars.forEach(({ r, l, f }, k) => {
          const out = f < lo - 1e-9 || f > hi + 1e-9, me = k === hiK;
          r.setAttribute('class', 'grow ' + (me ? 'sqo' : out ? 'bin-r' : 'bin'));
          l.setAttribute('class', (me ? 't-or' : out ? 't-red' : 't-pop') + ' halo'); l.setAttribute('font-weight', me || out ? 700 : 400); l.setAttribute('font-size', me ? 28 : 20);
        });
        const zs = zTxt(z), a = Math.abs(z - Z95) < 1e-6 ? '5 %' : Math.abs(z - Z90) < 1e-6 ? '10 %' : pctTxt(2 * (1 - Phi(z)));
        rich(m.formula, FM('IP = {P:~ϕ~} ± {k:~ε~(~α~)}·√({p:~ϕ~(1 − ~ϕ~)}/~N~) = 0,5 ± {k:' + zs + '} × 0,158 = [' + fr(lo, 2) + ' ; ' + fr(hi, 2) + ']   {p:(~α~ = ' + a + ')}'));
      };
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const n = TIRAGES[Math.max(k, 0)];
      m.coins.forEach((o, i) => o.set(n ? FACES[n][i] : null));
      rich(m.res, n ? FM(n + ' faces sur 10 : ~f~_e = ' + fr(n / 10, 1).replace(/,0$/, '')) : '');
      m.z = k === 4 ? Z90 : Z95; m.draw(n && k >= 1 ? n : -1);
      vis(m.coins.map(o => o.g), k >= 0); vis(m.res, k >= 1);
      m.say.forEach((g, i) => vis(g, i === Math.min(k, 5)));
      vis([m.chart, m.fbox], k >= 0 && k <= 5); vis(m.two, k >= 6);
      m.hl.replaceChildren(); if (k >= 0 && k <= 5) markMult(m.formula, m.hl);
    },
    play(m, k, c) {
      const show = i => { if (m.say[i - 1] && i - 1 !== Math.min(k, 5)) fadeOut(c, m.say[i - 1], 0, 250); };
      if (k === 0) {
        fadeIn(c, m.coins.map(o => o.g), 0, 400);
        vis(m.chart, true); const kids = [...m.chart.children]; kids.forEach(e => { e.style.opacity = 0; });
        fadeIn(c, kids.filter(e => e !== m.curve && e !== m.tailL && e !== m.tailR && e !== m.ipG), 200, 600);
        c.at(900, () => drawPath(c, m.curve, 1200));
        fadeIn(c, [m.tailL, m.tailR], 2000, 500); fadeIn(c, m.ipG, 2300, 500);
        fadeIn(c, m.fbox, 2700, 500); c.at(2700, () => { m.hl.replaceChildren(); markMult(m.formula, m.hl); });
        fadeIn(c, m.say[0], 3100, 500);
        return 3700;
      }
      if (k === 6) { fadeOut(c, [m.chart, m.fbox], 0, 400); popIn(c, m.two, 400, 600); return 1100; }
      show(k);
      const n = TIRAGES[k];
      if (k === 4) {   // α = 5 % → 10 %
        tweenT(c, 1500, 300, t => { m.z = lerp(Z95, Z90, t); m.draw(8); m.hl.replaceChildren(); }, 'inOut(2)');
        c.at(1850, () => markMult(m.formula, m.hl));
        fadeIn(c, m.say[4], 600, 500);
        return 2400;
      }
      const prev = TIRAGES[k - 1];
      m.coins.forEach((o, i) => o.set(prev ? FACES[prev][i] : null));
      if (k === 5) { m.z = Z95; m.draw(8); }
      const e = flipCoins(c, m.coins, FACES[n], 0, 80);
      c.at(e - 200, () => { m.z = Z95; m.draw(n); m.hl.replaceChildren(); markMult(m.formula, m.hl); });
      popIn(c, m.res, e - 200, 500);
      c.at(e - 220, () => rich(m.res, FM(n + ' faces sur 10 : ~f~_e = ' + fr(n / 10, 1).replace(/,0$/, ''))));
      return stagger(c, m.say[Math.min(k, 5)], e + 200, 450, 500);
    }
  });

  /* ======================= DIAPO 3 · LA QUESTION =======================
     Q1 G1 du cours 1 : 30 étudiants, mₑ = 70,4 mm · Q2 la fiche du fabricant : 72,5 mm
     Q3 l'écart de 2,1 mm et la question du test */
  const XR = { x0: 150, x1: 1690, d0: 56, d1: 84 };
  const BIG = { ...XR, base: 800, unit: 600 / YMAX };
  stepped('question', {
    labels: ['Q1', 'Q2', 'Q3'],
    build(svg) {
      const m = {};
      m.t = tx(svg, 60, 90, FM('Notre échantillon : G1 du cours 1 ({b:~N~ = 30})'), { class: 't-title' });
      m.ch = makeChart(svg, G1, { seed: 11, yTitle: true, ext: false });
      m.ch.layout(BIG, { mean: 'below', cart: [BIG.x0 + 60, BIG.base - YMAX * BIG.unit + 30] });
      m.axis = makeAxis(svg, range(56, 84, 2), () => true, 'Largeur de la main (mm)');
      m.axis.layout(geoX(BIG), BIG.base, { ldy: 56, tdy: 100 });
      const X = geoX(BIG), xf = X(MU0), xm = X(ME), top = BIG.base - YMAX * BIG.unit;
      m.fab = S('g', {}, svg);
      S('line', { x1: xf, x2: xf, y1: BIG.base, y2: top - 26, class: 'ic-musolid grow' }, m.fab);
      tx(m.fab, xf + 12, top - 34, FM('{P:72,5 mm}'), { 'font-size': 30 });
      m.card = S('g', {}, svg);
      card(m.card, 1290, 228, 560, 178, 'popcard', 14);
      tx(m.card, 1318, 278, 'Fiche du fabricant de gants de TP', { 'font-size': 26, 'font-weight': 600, class: 't-pop' });
      tx(m.card, 1318, 336, FM('largeur moyenne de main :'), { 'font-size': 30 });
      tx(m.card, 1318, 384, FM('{P:72,5 mm}'), { 'font-size': 40 });
      m.gap = S('g', {}, svg);
      const ya = top + 70;
      S('line', { x1: xm + 8, x2: xf - 8, y1: ya, y2: ya, class: 'est-arr' }, m.gap);
      arrowHead(m.gap, xm + 2, ya, Math.PI, 'est-arr-h', 13); arrowHead(m.gap, xf - 2, ya, 0, 'est-arr-h', 13);
      tx(m.gap, (xm + xf) / 2, ya - 14, '2,1 mm', { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, class: 'halo' });
      m.q = tx(svg, 960, 1010, FM('Hasard de l\'échantillonnage, ou le fabricant se trompe ?'), { 'text-anchor': 'middle', 'font-size': 42, 'font-weight': 700 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      m.ch.shown = m.ch.counts.slice(); m.ch.drawBars();
      vis([m.t, m.ch.frame, m.ch.cart, m.ch.bars, m.axis.g, m.ch.mean.g], k >= 0);
      vis([m.fab, m.card], k >= 1);
      vis([m.gap, m.q], k >= 2);
    },
    play(m, k, c) {
      if (k === 0) {
        fadeIn(c, [m.t, m.ch.frame, m.ch.cart, m.axis.g], 0, 500);
        growBars(c, m.ch, 400, 45);
        meanIn(c, m.ch.mean, 400 + NIND * 45 + 200);
        return 400 + NIND * 45 + 1100;
      }
      if (k === 1) {
        fadeIn(c, m.card, 0, 500);
        const ln = m.fab.querySelector('line'), lb = m.fab.querySelector('text');
        vis(m.fab, true); utils.set(ln, { scaleY: 0 }); lb.style.opacity = 0;
        c.at(500, () => c.anim(ln, { scaleY: [0, 1], duration: T(700), ease: 'out(3)' }));
        fadeIn(c, lb, 1000, 400);
        return 1500;
      }
      fadeIn(c, m.gap, 0, 500);
      popIn(c, m.q, 500);
      return 1200;
    }
  });

  /* ======================= DIAPO 3 · H₀ ET H₁ ======================= */
  stepped('hypo', {
    labels: ['H1', 'H2'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Deux hypothèses', { class: 't-title' });
      m.h0 = S('g', {}, svg);
      card(m.h0, 80, 160, 840, 760, 'card', 18);
      ftx(m.h0, 120, 250, '{P:H₀} · hypothèse nulle', { 'font-size': 44 });
      ftx(m.h0, 120, 340, '« ~m~_e est conforme à ~μ~ = 72,5 mm »', { 'font-size': 36, 'font-weight': 600 });
      ftx(m.h0, 120, 420, 'Le fabricant a raison : les 2,1 mm d\'écart', { 'font-size': 30 });
      ftx(m.h0, 120, 462, 'viennent du hasard de l\'échantillonnage.', { 'font-size': 30 });
      ftx(m.h0, 120, 560, '~Souvent, H₀ dit que « rien ne se passe » :~', { 'font-size': 27, class: 't-pop' });
      ftx(m.h0, 120, 598, '~la pièce est normale, les données collent aux anciennes.~', { 'font-size': 27, class: 't-pop' });
      ftx(m.h0, 120, 700, 'On la {b:suppose vraie} pendant tout le test.', { 'font-size': 30 });
      card(m.h0, 120, 790, 240, 70, 'chip-pop', 35);
      ftx(m.h0, 240, 836, '{b:une seule}', { 'font-size': 30, 'text-anchor': 'middle' });
      m.h1 = S('g', {}, svg);
      card(m.h1, 1000, 160, 840, 760, 'card', 18);
      ftx(m.h1, 1040, 250, '{P:H₁} · hypothèse alternative', { 'font-size': 44 });
      const rows = [['~μ~ ≠ 72,5 mm', 'les mains sont différentes', 'both', 360], ['~μ~ < 72,5 mm', 'les mains sont plus petites', 'left', 500], ['~μ~ > 72,5 mm', 'les mains sont plus grandes', 'right', 640]];
      rows.forEach(([t, sub, dir, y]) => {
        const g = S('g', {}, m.h1);
        ftx(g, 1040, y, t, { 'font-size': 36, 'font-weight': 600 });
        ftx(g, 1040, y + 40, sub, { 'font-size': 26, class: 't-pop' });
        const x0 = 1500, x1 = 1790, xc = 1645, yl = y - 12;
        S('line', { x1: x0, x2: x1, y1: yl, y2: yl, class: 'axl' }, g);
        S('line', { x1: xc, x2: xc, y1: yl - 16, y2: yl + 16, class: 'ic-musolid' }, g);
        tx(g, xc, yl + 44, '72,5', { 'text-anchor': 'middle', 'font-size': 22, class: 't-pop' });
        if (dir !== 'right') { S('line', { x1: xc - 14, x2: x0 + 14, y1: yl - 26, y2: yl - 26, class: 'h1-arr' }, g); arrowHead(g, x0, yl - 26, Math.PI, 'h1-arr-h', 14); }
        if (dir !== 'left') { S('line', { x1: xc + 14, x2: x1 - 14, y1: yl - 26, y2: yl - 26, class: 'h1-arr' }, g); arrowHead(g, x1, yl - 26, 0, 'h1-arr-h', 14); }
      });
      card(m.h1, 1040, 790, 340, 70, 'chip-pop', 35);
      ftx(m.h1, 1210, 836, '{b:une ou plusieurs}', { 'font-size': 30, 'text-anchor': 'middle' });
      return m;
    },
    pose(m, k) { clean(m.svg); vis(m.h0, k >= 0); vis(m.h1, k >= 1); },
    play(m, k, c) { return stagger(c, k === 0 ? m.h0 : m.h1, 0, 160, 450); }
  });

  /* ======================= DIAPO 4 · LE RAISONNEMENT =======================
     R1 on suppose H₀ vraie : la courbe des mₑ autour de 72,5 · R2 α = 5 % : queues, IP [70,80 ; 74,20]
     R3 mₑ = 70,4 tombe dans une queue : on rejette H₀ · R4 les deux issues */
  stepped('raison', {
    labels: ['R1', 'R2', 'R3', 'R4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'On suppose H₀ vraie', { class: 't-title' });
      m.b = buildBell(svg, 'RAISON');
      m.caps = captions(svg, [
        'Si H₀ est vraie, les ~m~_e des échantillons de 30 se répartissent autour de {P:72,5 mm}.',
        'On fixe ~α~ = 5 % : l\'intervalle de pari ({P:IP}) contient 95 % des ~m~_e.',
      ]);
      m.sd = ftx(svg, 1760, 252, 'écart-type : {p:~σ~}/√~N~ = 4,74/√30 = 0,866 mm', { 'text-anchor': 'end', 'font-size': 26, class: 't-pop' });
      m.verdict = noteBox(svg, 170, 330, 600, ['~m~_e est hors de l\'IP :', 'données {b:improbables} sous H₀', '→ on {R:rejette H₀} (test {b:significatif})'], { size: 30 });
      m.vArr = arrowLine(svg, 470, 330 + m.verdict.h + 6, tX(ME) - 120, TA.base - 132);
      m.out = S('g', {}, svg);
      noteBox(m.out, 160, 890, 790, ['~m~_e {b:dans} l\'IP : données probables sous H₀', '→ on {b:accepte} H₀, faute d\'argument pour la rejeter'], { size: 28 });
      noteBox(m.out, 970, 890, 790, ['~m~_e {b:hors} de l\'IP : données improbables sous H₀', '→ on {R:rejette} H₀ : une alternative H₁ est réalisée'], { size: 28 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: Z95, uni: 0, ax: 0, trueAmp: 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, m.sd], k >= 0);
      vis([b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip], k >= 1);
      vis([b.me, m.verdict, m.vArr], k >= 2);
      vis(m.out, k >= 3);
      showCap(m.caps, Math.min(k, 1));
    },
    play(m, k, c) {
      const b = m.b;
      swapCap(c, m.caps, k);
      if (k === 0) { const e = bellIntro(c, b, 300); fadeIn(c, m.sd, e - 300, 500); return e + 300; }
      if (k === 1) {
        vis([b.tailL, b.tailR], true); b.st.zt = ZMAX; b.draw();
        tweenT(c, 1100, 300, t => { b.st.zt = lerp(ZMAX, Z95, t); b.draw(); });
        [b.pct, b.aval].forEach((e, i) => popIn(c, e, 600 + i * 250, 500));
        fadeIn(c, [b.aL, b.aR], 1200, 400);
        return ipIn(c, b, 1500) + 200;
      }
      if (k === 2) {
        b.meDot.classList.remove('out'); b.meLab.classList.remove('t-red');
        const e = meFall(c, b, 0);
        c.at(800, () => { b.meDot.classList.add('out'); b.meLab.classList.add('t-red'); c.anim(b.meDot, { scale: [1.7, 1], duration: T(500), ease: 'out(3)' }); });
        fadeIn(c, [m.verdict, m.vArr], e, 500);
        return e + 700;
      }
      return stagger(c, m.out, 0, 300, 500);
    }
  });

  /* ======================= DIAPO 5 · LE RISQUE α =======================
     A1 sous H₀, 20 échantillons : 19 mₑ dans l'IP, 1 dans une queue · A2 rejeter H₀ à tort = α */
  stepped('alpha', {
    labels: ['A1', 'A2'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Et si H₀ était vraie quand même ?', { class: 't-title' });
      m.b = buildBell(svg, 'ALPHA');
      m.caps = captions(svg, ['Sous H₀, tirons 20 échantillons de 30 : 19 ~m~_e tombent dans l\'IP, 1 tombe dans une queue.']);
      const red = m.b.pts.find(p => Math.abs(p.z) > Z95);
      m.box = noteBox(svg, 1290, 318, 570, ['Si notre échantillon était celui-là,', 'on rejetterait H₀…', '{b:alors qu\'elle est vraie.}'], { size: 28 });
      m.bArr = arrowLine(svg, 1560, 318 + m.box.h + 6, red.x + 6, red.y - 18);
      m.def = noteBox(svg, 160, 890, 1600, ['Rejeter H₀ alors qu\'elle est vraie : c\'est le {R:risque ~α~} (risque de {b:1ʳᵉ espèce}).', 'On le fixe {b:avant} le test ; ici, 1 échantillon sur 20 (5 %) nous tromperait.'], { size: 30 });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: Z95, uni: 0, ax: 0, trueAmp: 0 }); b.draw();
      b.pts.forEach(p => { p.el.setAttribute('cy', p.y); });
      vis(b.parts.all, false);
      vis([b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip], k >= 0);
      vis(b.pts.map(p => p.el), k >= 0);
      vis([m.box, m.bArr, m.def], k >= 1);
      showCap(m.caps, k >= 0 ? 0 : -1);
    },
    play(m, k, c) {
      const b = m.b;
      if (k === 0) {
        const base = [b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip];
        fadeIn(c, base, 0, 500);
        fadeIn(c, m.caps[0], 300, 500);
        b.pts.forEach((p, i) => {
          p.el.setAttribute('cy', 120); p.el.style.opacity = 0; p.el.classList.remove('out');
          c.at(700 + i * 230, () => {
            p.el.style.opacity = '';
            tweenT(c, 700, 0, t => p.el.setAttribute('cy', lerp(120, p.y, t)), 'outBounce');
            if (Math.abs(p.z) > Z95) c.at(560, () => { p.el.classList.add('out'); c.anim(p.el, { scale: [1.8, 1], duration: T(500), ease: 'out(3)' }); });
          });
        });
        return 700 + 19 * 230 + 900;
      }
      fadeIn(c, [m.box, m.bArr], 0, 500);
      fadeIn(c, m.def, 600, 600);
      return 1300;
    }
  });

  /* ======================= DIAPO 6 · ET À 1 % ? ======================= */
  stepped('alpha1', {
    labels: ['U1', 'U2'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, FM('Et à ~α~ = 1 % ?'), { class: 't-title' });
      m.b = buildBell(svg, 'ALPHA1');
      m.caps = captions(svg, ['À ~α~ = 1 %, les queues rétrécissent : l\'IP s\'élargit et devient [70,27 ; 74,73].']);
      m.verdict = noteBox(svg, 170, 330, 600, ['~m~_e = 70,4 est maintenant {b:dans} l\'IP', '→ on {b:accepte} H₀'], { size: 30 });
      m.vArr = arrowLine(svg, 470, 330 + m.verdict.h + 6, tX(ME) - 120, TA.base - 132);
      m.msg = noteBox(svg, 160, 890, 1600, ['Même échantillon, autre conclusion : tout dépend de ~α~.', 'C\'est pour ça qu\'on choisit ~α~ {b:avant} de regarder les données.'], { size: 32, center: true });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: k >= 0 ? Z99 : Z95, uni: 0, ax: 0, trueAmp: 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], k >= 0);
      vis([m.verdict, m.vArr], k >= 0);
      vis(m.msg, k >= 1);
      showCap(m.caps, k >= 0 ? 0 : -1);
    },
    play(m, k, c) {
      const b = m.b;
      if (k === 0) {
        b.st.zt = Z95; b.draw();
        fadeIn(c, [b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], 0, 400);
        fadeIn(c, m.caps[0], 300, 500);
        tweenT(c, 1600, 900, t => { b.st.zt = lerp(Z95, Z99, t); b.draw(); });
        c.at(1900, () => c.anim(b.meDot, { scale: [1.6, 1], duration: T(500), ease: 'out(3)' }));
        fadeIn(c, [m.verdict, m.vArr], 2600, 500);
        return 3200;
      }
      fadeIn(c, m.msg, 0, 600);
      return 700;
    }
  });

  /* ======================= DIAPO 7 · LE RISQUE β =======================
     B1 en vrai μ = 70 (cours 1) : la vraie courbe · B2 la zone β (hachures vertes) et la puissance
     B3 retour à α = 5 % : β baisse · B4 la vraie valeur glisse : autant de β que de H₁ */
  stepped('beta', {
    labels: ['B1', 'B2', 'B3', 'B4'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Et si H₀ était fausse ?', { class: 't-title' });
      m.b = buildBell(svg, 'BETA');
      m.caps = captions(svg, [
        'En vrai, {P:~μ~ = 70 mm} (cours 1) : H₀ est fausse, mais à 1 % on l\'a acceptée.',
        ['Les échantillons de la vraie courbe qui tombent dans l\'IP font accepter H₀ à tort :', 'c\'est le {G:risque ~β~} (risque de {b:2ᵉ espèce}).'],
        'Retour à ~α~ = 5 % : l\'IP se resserre et ~β~ descend. Baisser ~α~ fait monter ~β~.',
        '~β~ dépend de la vraie valeur : il y a autant de ~β~ que d\'hypothèses H₁.',
      ], 150, 30);
      // B4 · β for three true values (α = 5 %)
      m.tbl = S('g', {}, svg);
      card(m.tbl, 1180, 860, 680, 170, 'box', 12);
      ftx(m.tbl, 1210, 906, '{b:à ~α~ = 5 %, si en vrai…}', { 'font-size': 26, class: 't-pop' });
      [[71.5, 'mains proches de H₀'], [70, ''], [69, 'loin de H₀']].forEach(([mu, note], i) => {
        const lo = MU0 - Z95 * SEM, hi = MU0 + Z95 * SEM, b = Phi((hi - mu) / SEM) - Phi((lo - mu) / SEM), x = 1210 + i * 220;
        ftx(m.tbl, x, 958, '~μ~ = ' + fr(mu, mu % 1 ? 1 : 0), { 'font-size': 28, class: 't-pop' });
        ftx(m.tbl, x, 1004, '{G:~β~ = ' + pctTxt(b, 0) + '}', { 'font-size': 34 });
      });
      return m;
    },
    pose(m, k) {
      clean(m.svg);
      vis(m.tbl, k >= 3);
      const b = m.b;
      Object.assign(b.st, { amp: 1, zt: k >= 2 ? Z95 : Z99, uni: 0, ax: 0, trueC: MU_TRUE, trueAmp: k >= 0 ? 1 : 0 }); b.meAt(TA.base); b.draw();
      vis(b.parts.all, false);
      vis([b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], k >= -1 && k >= 0);
      vis([b.trueCurve, b.tmu], k >= 0);
      vis([b.beta, b.leg], k >= 1);
      showCap(m.caps, k);
    },
    play(m, k, c) {
      const b = m.b;
      swapCap(c, m.caps, k);
      switch (k) {
        case 0: {
          fadeIn(c, [b.axis, b.tmm, b.axT[0], b.area, b.curve, b.mu, b.tailL, b.tailR, b.pct, b.aval, b.aL, b.aR, b.ip, b.me], 0, 400);
          b.st.trueAmp = 0; b.draw(); vis(b.trueCurve, true);
          tweenT(c, 1300, 600, t => { b.st.trueAmp = t; b.draw(); }, 'out(3)');
          const ln = b.tmuL; vis(b.tmu, true); utils.set(ln, { scaleY: 0 }); b.tmuT.style.opacity = 0;
          c.at(1400, () => c.anim(ln, { scaleY: [0, 1], duration: T(600), ease: 'out(3)' }));
          fadeIn(c, b.tmuT, 1800, 400);
          return 2400;
        }
        case 1: fadeIn(c, b.beta, 300, 800); fadeIn(c, b.leg, 900, 500); return 1500;
        case 2: tweenT(c, 1600, 400, t => { b.st.zt = lerp(Z99, Z95, t); b.draw(); }); return 2100;
        case 3: {
          const path = [[MU_TRUE, 71.5, 1500], [71.5, 69, 2200], [69, MU_TRUE, 1300]];
          let t0 = 300;
          path.forEach(([a, z, dur]) => { tweenT(c, dur, t0, t => { b.st.trueC = lerp(a, z, t); b.draw(); }, 'inOut(2)'); t0 += dur + 500; });
          fadeIn(c, m.tbl, t0 - 300, 600);
          return t0 + 400;
        }
      }
    }
  });

  /* ======================= DIAPO 8 · LES DEUX ERREURS ======================= */
  stepped('erreurs', {
    labels: ['E1', 'E2', 'E3'],
    build(svg) {
      const m = {};
      tx(svg, 60, 90, 'Deux façons de se tromper', { class: 't-title' });
      const hatch = hatchDefs(svg, 'ERREURS', true);
      const C = [[600, 1180], [1220, 1800]], R = [[360, 560], [580, 780]];
      m.frame = S('g', {}, svg);
      ftx(m.frame, 1200, 214, '{b:En réalité…}', { 'text-anchor': 'middle', 'font-size': 30, class: 't-pop' });
      ftx(m.frame, (C[0][0] + C[0][1]) / 2, 300, '{P:H₀ est vraie}', { 'text-anchor': 'middle', 'font-size': 36 });
      ftx(m.frame, (C[1][0] + C[1][1]) / 2, 300, '{P:H₀ est fausse}', { 'text-anchor': 'middle', 'font-size': 36 });
      ftx(m.frame, 160, (R[0][0] + R[0][1]) / 2 + 12, '{b:On accepte H₀}', { 'font-size': 36 });
      ftx(m.frame, 160, (R[1][0] + R[1][1]) / 2 + 12, '{b:On rejette H₀}', { 'font-size': 36 });
      ftx(m.frame, 160, 300, '~Décision ↓~', { 'font-size': 26, class: 't-pop' });
      const cell = (ci, ri, cls, fill, lines) => {
        const g = S('g', {}, svg), [x0, x1] = C[ci], [y0, y1] = R[ri];
        S('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 14, class: cls, ...(fill ? { fill } : {}) }, g);
        lines.forEach(([t, size], i) => ftx(g, (x0 + x1) / 2, (y0 + y1) / 2 - 8 + (i - (lines.length - 1) / 2) * 62 + size * 0.34, t, { 'text-anchor': 'middle', 'font-size': size, class: 'halo' }));
        return g;
      };
      m.cA = cell(0, 1, 'cell-a', null, [['{R:erreur de 1ʳᵉ espèce}', 34], ['risque ~α~', 40]]);
      m.cB = cell(1, 0, 'cell-b', hatch, [['{G:erreur de 2ᵉ espèce}', 34], ['risque ~β~', 40]]);
      m.cOK = [cell(0, 0, 'cell-ok', null, [['{b:bonne décision}', 34], ['probabilité 1 − ~α~', 32]]), cell(1, 1, 'cell-ok', null, [['{b:bonne décision}', 34], ['{b:puissance} 1 − ~β~', 36]])];
      m.note = S('g', {}, svg);
      ftx(m.note, 160, 880, '{R:~α~} : fixé {b:avant} le test, par nous.', { 'font-size': 32 });
      ftx(m.note, 160, 934, '{G:~β~} : dépend de H₁ ; on ne peut le calculer qu\'en connaissant H₁.', { 'font-size': 32 });
      return m;
    },
    pose(m, k) { clean(m.svg); vis([m.frame, m.cA], k >= 0); vis(m.cB, k >= 1); vis([m.cOK, m.note], k >= 2); },
    play(m, k, c) {
      if (k === 0) { fadeIn(c, m.frame, 0, 500); popIn(c, m.cA, 600); return 1200; }
      if (k === 1) { popIn(c, m.cB, 0); return 700; }
      m.cOK.forEach((g, i) => popIn(c, g, i * 250)); stagger(c, m.note, 700, 300, 500); return 1700;
    }
  });
