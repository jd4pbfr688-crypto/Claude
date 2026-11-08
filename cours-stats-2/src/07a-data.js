
  /* ==========================================================
     DONNÉES · toutes issues du cours 1 ou de donnees.py (même dossier)
     Population Ω (PASS) : largeur de main, μ = 70 mm, σ² = 22,5 mm², N = 30.
     G1 : les 30 valeurs du cours 1 (mₑ = 70,4 ; Sₑ² = 17,57 ; 11 mains ≥ 72 mm).
     H  : 30 handballeurs, valeurs générées une fois pour toutes (mₑ = 74,9 ; Sₑ² = 20,36 ; 23 mains ≥ 72 mm).
     Hypothèses du fabricant (H₀) : μ = 72,5 mm ; ϕ = 0,20 de gants L (main ≥ 72 mm).
     ========================================================== */
  const G1 = { name: 'G1', m: 70.4, v: [58, 63, 65, 67, 67, 68, 68, 68, 69, 69, 69, 69, 70, 70, 70, 70, 71, 71, 71, 72, 72, 73, 74, 74, 74, 74, 75, 75, 75, 81] };
  const HB = { name: 'H', m: 74.9, v: [64, 68, 69, 69, 70, 71, 71, 72, 72, 72, 72, 73, 74, 74, 75, 76, 76, 77, 77, 78, 78, 78, 78, 78, 79, 80, 80, 81, 82, 83] };
  const NIND = 30, N = 30, SIG2 = 22.5, SIG = Math.sqrt(SIG2), SEM = SIG / Math.sqrt(N);   // σ/√N = 0,866 mm
  const MU0 = 72.5, MU_TRUE = 70, ME = G1.m;
  const Z90 = 1.645, Z95 = 1.96, Z98 = 2.326, Z99 = 2.576, ZMAX = 3.4;
  const Z_ME = (ME - MU0) / SEM;   // −2,42

  // loi normale centrée réduite : fonction de répartition (Abramowitz-Stegun 7.1.26) et quantile (dichotomie)
  function Phi(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2);
    return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  function zOf(p) { let a = -8, b = 8; for (let i = 0; i < 60; i++) { const c = (a + b) / 2; if (Phi(c) < p) a = c; else b = c; } return (a + b) / 2; }
  const pctTxt = (a, d = 1) => (Math.round(a * 100 * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',').replace(/,0+$/, '') + ' %';

  // mini balisage des formules : {p:…} gris, {g:…} vert, {o:…} orange, {b:…} gras, {r:…} rouge,
  // majuscule = la même couleur en gras ; ~…~ italique, _x indice (comme dans le cours 1)
  const FMA = { p: { class: 't-pop' }, g: { class: 't-green' }, o: { class: 't-or' }, b: { 'font-weight': 700 }, r: { class: 't-red' }, u: { class: 't-blue' },
    P: { class: 't-pop', 'font-weight': 700 }, G: { class: 't-green', 'font-weight': 700 }, O: { class: 't-or', 'font-weight': 700 }, R: { class: 't-red', 'font-weight': 700 }, U: { class: 't-blue', 'font-weight': 700 } };
  const FM = s => s.split(/(\{[pgobruPGORU]:[^}]*\})/).filter(Boolean).map(t => { const q = t.match(/^\{([pgobruPGORU]):([^}]*)\}$/); return q ? [q[2], FMA[q[1]]] : [t]; });
  const ftx = (parent, x, y, s, attrs) => tx(parent, x, y, FM(s), attrs);
  // une fraction : numérateur, barre, dénominateur, centrés sur cx ; y = hauteur de la barre
  function frac(parent, cx, y, num, den, w, size = 40, cls = '') {
    const g = S('g', {}, parent);
    ftx(g, cx, y - size * 0.32, num, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 600 });
    S('line', { x1: cx - w / 2, x2: cx + w / 2, y1: y, y2: y, class: 'fbar' + (cls ? ' ' + cls : '') }, g);
    ftx(g, cx, y + size * 1.02, den, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 600 });
    return g;
  }
  // une « formule-fraction » sur une ligne : gauche = fraction = droite
  function fracLine(parent, cx, y, left, num, den, w, right, size = 40) {
    const g = S('g', {}, parent);
    if (left) ftx(g, cx - w / 2 - 18, y + size * 0.34, left, { 'text-anchor': 'end', 'font-size': size, 'font-weight': 600 });
    frac(g, cx, y, num, den, w, size);
    if (right) ftx(g, cx + w / 2 + 18, y + size * 0.34, right, { 'font-size': size, 'font-weight': 600 });
    return g;
  }
  function card(parent, x, y, w, h, cls = 'card', rx = 18) { return S('rect', { x, y, width: w, height: h, rx, class: cls }, parent); }
  // apparition « une ligne après l'autre » des enfants d'un groupe
  function stagger(c, g, d0 = 0, gap = 140, dur = 450) {
    const kids = [...g.children];
    g.style.opacity = '';
    kids.forEach((e, i) => { e.style.opacity = 0; c.at(d0 + i * gap, () => c.anim(e, { opacity: [0, 1], translateY: [14, 0], duration: T(dur), ease: 'out(3)' })); });
    return d0 + kids.length * gap + dur;
  }
  function popIn(c, el, d = 0, dur = 550) { c.at(d, () => { el.style.opacity = ''; c.anim(el, { opacity: [0, 1], scale: [0.85, 1], duration: T(dur), ease: 'out(3)' }); }); el.style.opacity = 0; }
