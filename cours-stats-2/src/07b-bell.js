
  /* ==========================================================
     LA CLOCHE DU TEST (diapos 4 à 7 et 9 à 11)
     La courbe des mₑ sous H₀ (centrée sur μ = 72,5 mm, écart-type σ/√N = 0,866 mm), ses queues α (rouge),
     l'intervalle de pari (crochets gris pleins), notre mₑ = 70,4 (orange, rouge s'il tombe dans une queue),
     et pour la diapo β la vraie courbe (μ = 70 mm, pointillés gris) avec la zone β hachurée en vert.
     Un état → un dessin : pose() règle l'état, play() l'anime, draw() redessine tout.
       st.zt   borne bilatérale (en écarts réduits) · st.uni 0 → 1 : la queue droite passe à gauche (seuil st.zu)
       st.ax   graduation : 0 = mm, 1 = centrée (mₑ − μ), 2 = réduite (ε) ; continue pendant le morphing
       st.trueC, st.trueAmp : la vraie courbe (0 = absente)
     ========================================================== */
  const TA = { x0: 160, x1: 1760, d0: 67, d1: 76, base: 680, peak: 330 };
  const tX = mm => TA.x0 + (mm - TA.d0) * (TA.x1 - TA.x0) / (TA.d1 - TA.d0);
  const bY = (z, amp = 1) => TA.base - TA.peak * amp * Math.exp(-z * z / 2);
  const IPY = TA.base + 86;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  function bellPath(c, z1, z2, amp = 1) {
    let d = '';
    for (let i = 0; i <= 140; i++) { const z = z1 + (z2 - z1) * i / 140; d += (i ? 'L' : 'M') + tX(c + z * SEM).toFixed(1) + ' ' + bY(z, amp).toFixed(1); }
    return d;
  }
  const bellArea = (c, z1, z2, amp = 1) => z2 - z1 < 1e-4 ? '' : bellPath(c, z1, z2, amp) + `L${tX(c + z2 * SEM).toFixed(1)} ${TA.base}L${tX(c + z1 * SEM).toFixed(1)} ${TA.base}Z`;
  const KNOWN_Z = [[Z90, '1,645'], [Z95, '1,96'], [Z98, '2,326'], [Z99, '2,576']];
  const zTxt = z => { const k = KNOWN_Z.find(([v]) => Math.abs(v - z) < 1e-6); return k ? k[1] : fr(z, 2); };
  const sgn = (v, s) => (v < 0 ? '−' : '+') + s;
  // the 20 means of the bet (cours 1, aide IP4): the one at 2,35 lands in a tail
  const BET_PTS = [-1.5, 0.1, -0.4, 0.6, -0.9, 0.3, 1.2, -0.2, 0.7, -0.6, 0.0, 1.6, -1.1, 0.45, -0.3, 0.9, 2.35, -0.75, 0.2, 1.35];

  function buildBell(svg, key, o = {}) {
    const m = { st: { amp: 1, zt: Z95, uni: 0, zu: Z98, ax: 0, trueC: MU_TRUE, trueAmp: 0 } };
    const defs = S('defs', {}, svg);
    const pat = S('pattern', { id: 'hb-' + key, patternUnits: 'userSpaceOnUse', width: 13, height: 13, patternTransform: 'rotate(45)' }, defs);
    S('rect', { width: 13, height: 13, class: 'beta-bg' }, pat);
    S('line', { x1: 2, y1: 0, x2: 2, y2: 13, class: 'beta-hatch' }, pat);
    // μ of H₀: grey, solid (supposed known); drawn under the area, so only its top and its foot show
    m.mu = S('g', {}, svg);
    S('line', { x1: tX(MU0), x2: tX(MU0), y1: TA.base + 14, y2: TA.base - TA.peak - 30, class: 'ic-musolid grow' }, m.mu);
    m.muLab = tx(m.mu, tX(MU0), TA.base - TA.peak - 46, FM('{P:~μ~ = 72,5 mm} {p:(H₀)}'), { 'text-anchor': 'middle', 'font-size': 32, class: 'halo' });
    m.area = S('path', { class: 'ic-area-k' }, svg);
    m.tailL = S('path', { class: 'ic-tail' }, svg);
    m.tailR = S('path', { class: 'ic-tail' }, svg);
    m.beta = S('path', { fill: `url(#hb-${key})`, class: 'beta-area' }, svg);
    m.trueCurve = S('path', { class: 'tb-true' }, svg);
    m.curve = S('path', { class: 'ic-curve-k' }, svg);
    // axis and its three graduations
    m.axis = S('line', { x1: TA.x0 - 20, x2: TA.x1 + 20, y1: TA.base, y2: TA.base, class: 'axl' }, svg);
    m.tmm = S('g', {}, svg);
    m.mmTicks = range(67, 76, 1).map(v => ({ v, l: S('line', { class: 'axl' }, m.tmm), t: tx(m.tmm, 0, 0, String(v), { class: 't-tick', 'text-anchor': 'middle' }) }));
    m.tcz = S('g', {}, svg);
    m.czTicks = range(-5, 3, 1).map(v => ({ v, l: S('line', { class: 'axl' }, m.tcz), t: tx(m.tcz, 0, 0, v < 0 ? '−' + (-v) : String(v), { class: 't-tick', 'text-anchor': 'middle' }) }));
    m.axT = ['~m~_e (mm)', '~m~_e − ~μ~ (mm)', '~ε~'].map(s => tx(svg, TA.x1 + 28, TA.base + 10, FM(s), { 'font-size': 30, 'font-weight': 600, class: 't-or' }));
    // the true mean (cours 1): dotted grey
    m.tmu = S('g', {}, svg);
    m.tmuL = S('line', { y1: TA.base, y2: 268, class: 'pop' }, m.tmu);
    m.tmuT = tx(m.tmu, 0, 252, FM('{P:en vrai : ~μ~ = 70 mm}'), { 'text-anchor': 'middle', 'font-size': 30, class: 'halo' });
    // levels
    m.pct = tx(svg, tX(MU0), TA.base - 150, '95 %', { 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 700, class: 'halo' });
    m.aval = tx(svg, tX(MU0), TA.base - 92, '', { 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 700, class: 't-red halo' });
    m.aL = tx(svg, 0, TA.base - 34, FM('~α~/2'), { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 700, class: 't-red halo' });
    m.aR = tx(svg, 0, TA.base - 34, FM('~α~/2'), { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 700, class: 't-red halo' });
    m.aU = tx(svg, 0, TA.base - 34, FM('~α~'), { 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 700, class: 't-red halo' });
    // the interval of the bet around μ (grey brackets), its two bounds
    m.ip = S('g', {}, svg);
    m.ipSeg = S('line', { y1: IPY, y2: IPY, class: 'ic-seg p' }, m.ip);
    m.ipBr = [-1, 1].map(() => S('path', { class: 'ic-br p' }, m.ip));
    m.ipLo = tx(m.ip, 0, IPY + 56, '', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 600, class: 't-pop' });
    m.ipHi = tx(m.ip, 0, IPY + 56, '', { 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 600, class: 't-pop' });
    m.ipTag = tx(m.ip, 0, IPY + 10, 'IP', { 'text-anchor': 'end', 'font-size': 34, 'font-weight': 700, class: 't-pop' });
    // our sample's mean
    m.me = S('g', {}, svg);
    m.meDot = S('circle', { cx: tX(ME), cy: TA.base, r: 11, class: 'ic-pt' }, m.me);
    m.meLead = S('line', { x1: tX(ME) - 14, y1: TA.base - 84, x2: tX(ME) - 4, y2: TA.base - 15, class: 'thin' }, m.me);
    m.meLab = tx(m.me, tX(ME) - 14, TA.base - 94, '', { 'text-anchor': 'end', 'font-size': 32, 'font-weight': 700, class: 't-or halo' });
    m.meAt = y => { m.meDot.setAttribute('cy', y); };
    // β legend (top right)
    m.leg = S('g', {}, svg);
    m.legB = tx(m.leg, 1430, 250, '', { 'font-size': 46, 'font-weight': 700, class: 't-green' });
    m.legP = tx(m.leg, 1430, 300, '', { 'font-size': 30, 'font-weight': 600, class: 't-pop' });
    // falling means (diapo α)
    const placed = [];
    m.pts = BET_PTS.map(z => {
      const x = tX(MU0 + z * SEM); let lv = 0;
      while (placed.some(p => p.lv === lv && Math.abs(p.x - x) < 22)) lv++;
      placed.push({ x, lv });
      return { z, x, y: TA.base - 12 - lv * 22, el: S('circle', { cx: x, cy: TA.base - 12 - lv * 22, r: 10, class: 'ic-pt' }, svg) };
    });

    m.bounds = () => { const s = m.st; return [lerp(s.zt, s.zu, s.uni), lerp(s.zt, ZMAX, s.uni)]; };   // [zL, zR]
    m.betaVal = () => { const [zL, zR] = m.bounds(), lo = MU0 - zL * SEM, hi = MU0 + zR * SEM, c = m.st.trueC; return Phi((hi - c) / SEM) - Phi((lo - c) / SEM); };
    m.draw = () => {
      const s = m.st, [zL, zR] = m.bounds();
      m.area.setAttribute('d', bellArea(MU0, -ZMAX, ZMAX, s.amp));
      m.curve.setAttribute('d', bellPath(MU0, -ZMAX, ZMAX, s.amp));
      m.tailL.setAttribute('d', bellArea(MU0, -ZMAX, -zL, s.amp));
      m.tailR.setAttribute('d', bellArea(MU0, zR, ZMAX, s.amp));
      // graduations
      const a = s.ax;
      m.mmTicks.forEach(k => { const x = tX(k.v); k.l.setAttribute('x1', x); k.l.setAttribute('x2', x); k.l.setAttribute('y1', TA.base); k.l.setAttribute('y2', TA.base + 8); k.t.setAttribute('x', x); k.t.setAttribute('y', TA.base + 36); });
      m.tmm.setAttribute('opacity', clamp01(1 - 2 * a).toFixed(3));
      const sc = lerp(1, SEM, clamp01(a - 1));
      m.czTicks.forEach(k => { const x = tX(MU0 + k.v * sc); k.l.setAttribute('x1', x); k.l.setAttribute('x2', x); k.l.setAttribute('y1', TA.base); k.l.setAttribute('y2', TA.base + 8); k.t.setAttribute('x', x); k.t.setAttribute('y', TA.base + 36); });
      m.tcz.setAttribute('opacity', clamp01(2 * a - 1).toFixed(3));
      m.axT.forEach((t, i) => t.setAttribute('opacity', clamp01(1 - 2 * Math.abs(a - i)).toFixed(3)));
      // interval and bounds
      const mode = Math.round(a), xl = tX(MU0 - zL * SEM), xr = tX(MU0 + zR * SEM), xrIP = tX(MU0 + Math.min(zR, ZMAX) * SEM);
      m.ipSeg.setAttribute('x1', xl); m.ipSeg.setAttribute('x2', xrIP);
      m.ipBr[0].setAttribute('d', `M${xl + 16} ${IPY - 22}L${xl} ${IPY - 22}L${xl} ${IPY + 22}L${xl + 16} ${IPY + 22}`);
      m.ipBr[1].setAttribute('d', `M${xr - 16} ${IPY - 22}L${xr} ${IPY - 22}L${xr} ${IPY + 22}L${xr - 16} ${IPY + 22}`);
      m.ipBr[1].setAttribute('opacity', (1 - s.uni).toFixed(3));
      const lab = (z, sg) => mode === 0 ? fr(MU0 + sg * z * SEM, 2) : mode === 1 ? sgn(sg, fr(z * SEM, 2)) : sgn(sg, zTxt(z));
      rich(m.ipLo, lab(zL, -1)); m.ipLo.setAttribute('x', xl);
      rich(m.ipHi, lab(zR, 1)); m.ipHi.setAttribute('x', xr); m.ipHi.setAttribute('opacity', (1 - s.uni).toFixed(3));
      m.ipTag.setAttribute('x', xl - 26);
      // levels
      const alpha = 2 * (1 - Phi(s.zt));
      rich(m.pct, pctTxt(1 - alpha)); rich(m.aval, FM('~α~ = ' + pctTxt(alpha)));
      m.aL.setAttribute('x', tX(MU0 - Math.max(zL + 0.55, 3.0) * SEM)); m.aR.setAttribute('x', tX(MU0 + Math.max(s.zt + 0.55, 3.0) * SEM)); m.aU.setAttribute('x', m.aL.getAttribute('x'));
      m.aL.setAttribute('opacity', (1 - s.uni).toFixed(3)); m.aR.setAttribute('opacity', (1 - s.uni).toFixed(3)); m.aU.setAttribute('opacity', s.uni.toFixed(3));
      // our mean: red when it falls in a tail
      const out = Z_ME < -zL - 1e-9 || Z_ME > zR + 1e-9;
      m.meDot.classList.toggle('out', out);
      m.meLab.classList.toggle('t-red', out); m.meLab.classList.toggle('t-or', !out);
      rich(m.meLab, FM(mode === 0 ? '~m~_e = 70,4' : mode === 1 ? '−2,1' : '−2,42'));
      m.pts.forEach(p => p.el.classList.toggle('out', Math.abs(p.z) > s.zt));
      // the true curve and β
      const c = s.trueC, xt = tX(c);
      m.trueCurve.setAttribute('d', bellPath(c, -ZMAX, ZMAX, s.trueAmp));
      m.tmuL.setAttribute('x1', xt); m.tmuL.setAttribute('x2', xt); m.tmuT.setAttribute('x', xt);
      rich(m.tmuT, FM('{P:en vrai : ~μ~ = ' + fr(c, c % 1 ? 1 : 0) + ' mm}'));
      const lo = MU0 - zL * SEM, hi = MU0 + zR * SEM;
      const z1 = Math.max(-ZMAX, (lo - c) / SEM), z2 = Math.min(ZMAX, (hi - c) / SEM);
      m.beta.setAttribute('d', bellArea(c, z1, z2, s.trueAmp));
      const b = m.betaVal();
      rich(m.legB, FM('~β~ = ' + pctTxt(b, 0)));
      rich(m.legP, FM('puissance 1 − ~β~ = ' + pctTxt(1 - b, 0)));
    };
    m.parts = { all: [m.area, m.tailL, m.tailR, m.beta, m.trueCurve, m.curve, m.axis, m.tmm, m.tcz, m.axT, m.mu, m.tmu, m.pct, m.aval, m.aL, m.aR, m.aU, m.ip, m.me, m.leg, m.pts.map(p => p.el)] };
    return m;
  }
  // the H₀ bell rises from the axis: axis, then the curve and its area, then μ
  function bellIntro(c, m, d = 0) {
    vis([m.axis, m.tmm, m.axT[0]], true); utils.set(m.axis, { scaleX: 0 });
    c.anim(m.axis, { scaleX: [0, 1], duration: T(700), delay: T(d), ease: 'inOut(2)' });
    fadeIn(c, [m.tmm, m.axT[0]], d + 400, 500);
    vis([m.area, m.curve], true); m.st.amp = 0; m.draw();
    tweenT(c, 1200, d + 600, t => { m.st.amp = t; m.draw(); }, 'out(3)');
    const ln = m.mu.querySelector('line');
    vis(m.mu, true); utils.set(ln, { scaleY: 0 }); m.muLab.style.opacity = 0;
    c.at(d + 1500, () => c.anim(ln, { scaleY: [0, 1], duration: T(600), ease: 'out(3)' }));
    fadeIn(c, m.muLab, d + 1900, 500);
    return d + 2400;
  }
  // grey interval grows under the axis
  function ipIn(c, m, d = 0) {
    vis(m.ip, true);
    const kids = [m.ipSeg, ...m.ipBr, m.ipLo, m.ipHi, m.ipTag];
    kids.forEach(e => { e.style.opacity = 0; });
    c.at(d, () => { m.ipSeg.style.opacity = ''; c.anim(m.ipSeg, { scaleX: [0, 1], duration: T(700), ease: 'inOut(2)' }); });
    fadeIn(c, [m.ipBr, m.ipTag], d + 600, 300);
    fadeIn(c, [m.ipLo, m.ipHi], d + 800, 400);
    return d + 1300;
  }
  // our mean falls onto the axis
  function meFall(c, m, d = 0) {
    vis(m.me, true); m.meLab.style.opacity = 0; m.meLead.style.opacity = 0;
    m.meAt(150);
    c.at(d, () => tweenT(c, 800, 0, t => m.meAt(lerp(150, TA.base, t)), 'outBounce'));
    fadeIn(c, [m.meLab, m.meLead], d + 700, 400);
    return d + 1200;
  }
