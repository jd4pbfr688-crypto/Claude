<script>
(function () {
  const { animate, utils } = anime;
  const EASE = anime.cubicBezier ? anime.cubicBezier(.82, 0, .18, 1) : 'inOutQuart';
  const PACE = 1;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = (reduceMotion ? 0.6 : 1) * PACE;
  const STILL = /[?&]still=1(&|$)/.test(location.search);
  const TOUCH = matchMedia('(pointer: coarse)').matches;

  /* ---------- collect stations ---------- */
  const nodes = Array.from(document.querySelectorAll('.station'));
  const stations = nodes.map(el => {
    const x = +el.dataset.x, y = +el.dataset.y, zoom = +el.dataset.zoom || 1;
    el.style.transform = `translate(${x}px, ${y}px)`;
    return { el, x, y, w: el.offsetWidth, h: el.offsetHeight, zoom,
             cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2,
             name: el.dataset.name, key: el.dataset.key || '' };
  });
  function stationFromHash(h) {
    let t = (h || '').replace(/^#/, '');
    try { t = decodeURIComponent(t); } catch (e) {}
    if (!t) return -1;
    const byId = stations.findIndex(s => s.el.id === t);
    if (byId >= 0) return byId;
    const T = t.toUpperCase();
    return stations.findIndex(s => s.key && s.key.toUpperCase() === T);
  }

  const world = document.getElementById('world');
  const viewportEl = document.getElementById('viewport');
  const hud = document.getElementById('hud');
  const cam = { x: stations[0].cx, y: stations[0].cy, zoom: 1 };
  let cur = 0, busy = false, overview = false, navToken = 0;

  let insetLeft = 0;
  function vw() { return window.innerWidth - insetLeft; }
  function vh() { return window.innerHeight; }
  function render() {
    world.style.transform =
      `translate(${insetLeft + vw() / 2 - cam.x * cam.zoom}px, ${vh() / 2 - cam.y * cam.zoom}px) scale(${cam.zoom})`;
  }
  function fitZoom(s) { return Math.min(vw() / s.w, vh() / s.h) * s.zoom; }
  function maskToStation(s) {
    const z = fitZoom(s);
    const l = Math.max(0, (vw() - s.w * z) / 2).toFixed(1), t = Math.max(0, (vh() - s.h * z) / 2).toFixed(1);
    viewportEl.style.clipPath = `inset(${t}px ${l}px ${t}px ${(+l + insetLeft).toFixed(1)}px)`;
  }
  function unmask() { viewportEl.style.clipPath = 'inset(0px 0px 0px 0px)'; }
  function updateCulling() {
    if (!TOUCH) return;
    stations.forEach((s, k) => { s.el.style.visibility = (overview || Math.abs(k - cur) <= 1) ? '' : 'hidden'; });
  }

  /* ---------- live window: only stations near the camera exist in the DOM ---------- */
  const LIVE_SPAN = TOUCH ? 1 : 2, PREFETCH_SPAN = LIVE_SPAN + 2, FETCH_MS = 10000;
  let liveAll = (document.documentElement.dataset.live || document.body.dataset.live) === 'all';
  stations.forEach(s => {
    const tpl = s.el.querySelector(':scope > template[data-station]');
    if (tpl) { s.src = tpl.innerHTML; tpl.remove(); s.live = false; }
    else if (s.el.dataset.src) { s.src = null; s.live = false; }
    else { s.src = s.el.innerHTML; s.live = true; }
    if (!s.live) s.el.classList.add('dormant');
  });
  const sceneOf = s => { const n = s.el.dataset.scene; return n ? sceneRegistry[n] : null; };
  function loadSrc(s) {
    if (s.src != null) return Promise.resolve();
    if (s.loading) return s.loading;
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl && setTimeout(() => ctl.abort(), FETCH_MS);
    return (s.loading = fetch(s.el.dataset.src, ctl ? { signal: ctl.signal } : undefined)
      .then(r => { if (!r.ok) throw new Error(r.status + ' ' + r.statusText); return r.text(); })
      .then(t => { s.src = t; })
      .catch(e => { console.warn('[deckadence] could not load', s.el.dataset.src, e); s.failed = true; })
      .finally(() => { clearTimeout(timer); s.loading = null; }));
  }
  function mountStation(s) {
    if (s.mounted) return true;
    if (s.mounting) return s.mounting;
    if (!s.live) {
      if (s.src == null && !s.failed) return loadSrc(s).then(() => mountStation(s));
      if (s.src == null) {
        s.el.innerHTML = `<p class="station-error">${s.key || s.el.id} · could not load ${s.el.dataset.src}</p>`;
        s.failed = false; s.live = s.mounted = true; s.el.classList.remove('dormant');
        return true;
      }
      s.el.innerHTML = s.src; s.live = true; s.primed = false;
      s.el.classList.remove('dormant'); s.el.style.backgroundImage = '';
    }
    const sc = sceneOf(s);
    let r = null;
    try { r = sc && sc.mount ? sc.mount(s.el) : null; } catch (e) { console.error('[deckadence] mount failed:', s.key || s.el.id, e); }
    s.el.dispatchEvent(new CustomEvent('deck:mount', { bubbles: true, detail: { key: s.key, id: s.el.id } }));
    if (!(r && typeof r.then === 'function')) { s.mounted = true; return true; }
    const settle = () => { s.mounted = true; s.mounting = null; return true; };
    return (s.mounting = r.then(settle, e => { console.error('[deckadence] mount failed:', s.key || s.el.id, e); return settle(); }));
  }
  function releaseMedia(el) {
    el.querySelectorAll('img').forEach(i => { i.removeAttribute('srcset'); i.src = 'data:,'; });
    el.querySelectorAll('video, audio').forEach(m => { try { m.pause(); m.removeAttribute('src'); m.querySelectorAll('source').forEach(x => x.remove()); m.load(); } catch (e) {} });
    el.querySelectorAll('iframe').forEach(f => { f.src = 'about:blank'; });
  }
  function unmountStation(s) {
    if (!s.live || liveAll || s.mounting) return;
    const sc = sceneOf(s);
    if (s.mounted && sc && sc.unmount) sc.unmount(s.el);
    if (s.mounted) s.el.dispatchEvent(new CustomEvent('deck:unmount', { bubbles: true, detail: { key: s.key, id: s.el.id } }));
    releaseMedia(s.el);
    s.el.replaceChildren();
    s.live = false; s.mounted = false; s.primed = false;
    s.el.classList.add('dormant');
  }
  const near = (k, i, span) => Math.abs(k - i) <= span;
  function settleLive(i) {
    stations.forEach((s, k) => {
      if (liveAll || near(k, i, LIVE_SPAN)) { const m = mountStation(s); if (m !== true) m.catch(() => {}); }
      else unmountStation(s);
      if (!liveAll && s.src == null && near(k, i, PREFETCH_SPAN)) loadSrc(s);
    });
  }
  function setSource(i, html) { const s = stations[i]; if (s && typeof html === 'string') s.src = html; }
  function setLive(mode) {
    if (mode !== 'all') return Promise.resolve();
    liveAll = true;
    return Promise.all(stations.map(s => mountStation(s))).then(() => {});
  }

  /* ---------- HUD ---------- */
  const rail = document.getElementById('rail');
  const railtip = document.createElement('div'); railtip.id = 'railtip'; document.body.appendChild(railtip);
  stations.forEach((s, i) => {
    const d = document.createElement('div'); d.className = 'dot' + (i ? '' : ' active');
    d.addEventListener('click', () => { if (!busy && i !== cur) goto(i); });
    d.addEventListener('mouseenter', () => {
      const r = d.getBoundingClientRect();
      railtip.textContent = [String(i + 1).padStart(2, '0'), s.key, s.name].filter(Boolean).join(' · ');
      railtip.style.left = (r.left + r.width / 2) + 'px';
      railtip.classList.add('show');
    });
    d.addEventListener('mouseleave', () => railtip.classList.remove('show'));
    rail.appendChild(d);
  });
  const dots = Array.from(rail.children);
  stations.forEach(s => {
    if (!s.key) return;
    const t = document.createElement('div'); t.className = 'station-tag';
    t.textContent = s.key;
    if (s.name) { const n = document.createElement('span'); n.className = 'tag-name'; n.textContent = ' · ' + s.name; t.appendChild(n); }
    t.style.transform = `translate(${s.x}px, ${s.y}px) translateY(-140%)`;
    world.appendChild(t);
  });
  document.getElementById('total').textContent = String(stations.length).padStart(2, '0');
  function railWindow(i) {
    const n = dots.length;
    if (!n) return;
    dots[i].classList.remove('out');
    const DOT = dots[i].offsetWidth || 8, GAP = parseFloat(getComputedStyle(rail).gap) || 10;
    const hs = getComputedStyle(hud), CLEAR = parseFloat(hs.columnGap) || 0;
    const inner = hud.clientWidth - parseFloat(hs.paddingLeft) - parseFloat(hs.paddingRight);
    const counterW = hud.querySelector('.counter').scrollWidth;
    const nameMin = Math.min(160, inner * 0.2);
    let avail = inner - 2 * (Math.max(counterW, nameMin) + CLEAR);
    if (!(inner > 0)) avail = Math.max(100, vw() * 0.5 - 2 * CLEAR);
    const max = Math.max(5, Math.floor((avail + GAP) / (DOT + GAP)));
    if (n <= max) { dots.forEach(d => d.classList.remove('out', 'edge')); return; }
    const start = Math.min(Math.max(0, i - Math.floor(max / 2)), n - max), end = start + max - 1;
    dots.forEach((d, k) => {
      const inWin = k >= start && k <= end;
      d.classList.toggle('out', !inWin);
      d.classList.toggle('edge', inWin && ((k === start && start > 0) || (k === end && end < n - 1)));
    });
  }
  function setHud(i) {
    document.getElementById('idx').textContent = String(i + 1).padStart(2, '0');
    const label = hud.querySelector('.station-name'), s = stations[i];
    label.textContent = s.name || '';
    if (s.key) {
      const k = document.createElement('span'); k.className = 'station-key'; k.textContent = s.key;
      label.prepend(k, s.name ? ' · ' : '');
    }
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    railWindow(i);
    stepHud();
  }
  function syncHash(i) {
    const s = stations[i], h = '#' + encodeURIComponent(s.key || s.el.id);
    if (location.hash === h) return;
    try { history.replaceState(null, '', location.pathname + location.search + h); } catch (e) {}
  }
  function setTone(i) {
    const inv = stations[i].el.classList.contains('invert');
    hud.classList.toggle('on-invert', inv);
    document.body.classList.toggle('invert-hud', inv);
  }

  /* ---------- camera ---------- */
  function flyTo(target, { dur = 1150, ease = EASE, mid, done } = {}) {
    if (STILL) { Object.assign(cam, target); render(); maskToStation(stations[cur]); if (mid) mid(); if (done) done(); return; }
    busy = true; unmask();
    const D = dur * MOTION;
    if (mid) setTimeout(mid, D * 0.55);
    animate(cam, { x: target.x, y: target.y, zoom: target.zoom,
      duration: D, ease, onUpdate: render,
      onComplete: () => { busy = false; maskToStation(stations[cur]); if (done) done(); } });
  }
  function flyDive(s, { mid, done } = {}) {
    const target = { x: s.cx, y: s.cy, zoom: fitZoom(s) };
    if (STILL) { Object.assign(cam, target); render(); maskToStation(s); if (mid) mid(); if (done) done(); return; }
    busy = true; unmask();
    const D = 1750 * MOTION;
    if (mid) setTimeout(mid, D * 0.55);
    animate(cam, { x: target.x, y: target.y,
      zoom: [
        { to: target.zoom * 0.34, duration: 720 * MOTION, ease: 'inOutQuad' },
        { to: target.zoom,        duration: 1030 * MOTION, ease: EASE }
      ],
      duration: D, ease: EASE, onUpdate: render,
      onComplete: () => { busy = false; maskToStation(s); if (done) done(); } });
  }
  function overviewCam() {
    const pad = 200;
    const minX = Math.min(...stations.map(s => s.x)) - pad, maxX = Math.max(...stations.map(s => s.x + s.w)) + pad;
    const minY = Math.min(...stations.map(s => s.y)) - pad, maxY = Math.max(...stations.map(s => s.y + s.h)) + pad;
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2,
             zoom: Math.min(vw() / (maxX - minX), vh() / (maxY - minY)) };
  }
  function toOverview() {
    overview = true; busy = true; unmask(); updateCulling();
    document.body.classList.add('is-overview');
    stations.forEach(s => { if (!s.live && s.el.dataset.poster) s.el.style.backgroundImage = `url("${s.el.dataset.poster}")`; });
    const c = overviewCam();
    animate(cam, { x: c.x, y: c.y, zoom: c.zoom, duration: 1300 * MOTION, ease: EASE,
      onUpdate: render, onComplete: () => busy = false });
  }

  /* ---------- scene registry ---------- */
  const sceneRegistry = {};

  /* ---------- navigation ---------- */
  function holdFor(pending, then) {
    busy = true; const t = ++navToken;
    pending.then(() => { busy = false; if (t === navToken) then(); }, () => { busy = false; });
  }
  function goto(i, opts) {
    if (i < 0 || i >= stations.length) return;
    const m = mountStation(stations[i]);
    if (m !== true) return holdFor(m, () => goto(i, opts));
    const prev = cur, wasOverview = overview; cur = i; overview = false;
    if (wasOverview) stations.forEach(t => { if (!t.live) t.el.style.backgroundImage = ''; });
    document.body.classList.remove('is-overview');
    setHud(i); updateCulling(); syncHash(i);
    Object.values(sceneRegistry).forEach(sc => sc.stop());
    const s = stations[i], isNew = i !== prev;
    const token = ++navToken;
    const fresh = () => token === navToken && !overview;
    const fromEnd = !!(opts && opts.fromEnd);
    primeStation(s, fromEnd);
    const reveal = () => { if (fresh()) { revealStation(s, fromEnd); settleLive(i); } };
    const mid = () => { if (fresh()) setTone(i); };
    if (!isNew) { setTone(i); flyTo({ x: s.cx, y: s.cy, zoom: fitZoom(s) }, opts); reveal(); return; }
    if (s.el.dataset.fly === 'dive') flyDive(s, { mid, done: reveal });
    else flyTo({ x: s.cx, y: s.cy, zoom: fitZoom(s) }, { ...opts, mid, done: reveal });
  }

  /* ---------- generic intro ---------- */
  function splitLines(el) {
    if (el.dataset.done) return;
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i)
      .map(html => `<span class="clip"><span class="lineInner">${html}</span></span>`)
      .join('');
    el.dataset.done = '1';
  }
  function fitHeading(el) {
    if (el.dataset.fit) return; el.dataset.fit = '1';
    const lines = [...el.querySelectorAll('.lineInner')];
    if (!lines.length) return;
    const wraps = l => {
      const lh = parseFloat(getComputedStyle(l).lineHeight) || parseFloat(getComputedStyle(l).fontSize) * 1.2;
      return l.offsetHeight > lh * 1.3;
    };
    let guard = 0;
    while (lines.some(wraps) && guard++ < 26) {
      el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * 0.94).toFixed(1) + 'px';
    }
  }
  function releaseClips(el) { el.querySelectorAll('.clip').forEach(c => { c.style.overflow = 'visible'; }); }

  function introTargets(el) {
    el.querySelectorAll('[data-split="lines"]').forEach(splitLines);
    el.querySelectorAll('[data-split="lines"]').forEach(fitHeading);
    const lines = el.querySelectorAll('.lineInner');
    const fades = Array.from(el.querySelectorAll('[data-fade]'));
    let autos = [];
    if (!lines.length && !fades.length) {
      autos = Array.from(el.children).filter(c => getComputedStyle(c).position !== 'absolute');
    }
    return { lines, fadeTargets: [...fades, ...autos] };
  }
  function primeIntro(el) {
    el.querySelectorAll('.clip').forEach(c => { c.style.overflow = 'hidden'; });
    const { lines, fadeTargets } = introTargets(el);
    if (lines.length) utils.set(lines, { translateY: '100%' });
    if (fadeTargets.length) utils.set(fadeTargets, { opacity: 0, translateY: 22 });
  }
  function playIntro(el) {
    const { lines, fadeTargets } = introTargets(el);
    if (STILL) {
      releaseClips(el);
      if (lines.length) utils.set(lines, { translateY: '0%' });
      if (fadeTargets.length) utils.set(fadeTargets, { opacity: 1, translateY: 0 });
      return;
    }
    if (lines.length) animate(lines, { translateY: ['100%', '0%'], duration: 1150 * MOTION,
      delay: anime.stagger(150 * MOTION), ease: EASE, onComplete: () => releaseClips(el) });
    else releaseClips(el);
    if (fadeTargets.length) animate(fadeTargets, { opacity: [0, 1], translateY: [22, 0],
      duration: 900 * MOTION, delay: anime.stagger(110 * MOTION, { start: (lines.length ? 440 : 90) * MOTION }),
      ease: 'out(2)' });
  }

  function revealStation(s, fromEnd) {
    const name = s.el.dataset.scene, sc = name && sceneRegistry[name];
    if (STILL) { if (sc && sc.still) sc.still(s.el); playIntro(s.el); return; }
    if (!s.primed) { console.warn('[deckadence] station revealed without priming (it will flash):', s.key || s.el.id); primeStation(s, fromEnd); }
    s.primed = false;
    if (sc) { if (fromEnd && sc.labels) stepHud(); else sc.run(s.el); return; }
    playIntro(s.el);
  }
  function primeStation(s, fromEnd) {
    s.primed = true;
    if (STILL) return;
    const name = s.el.dataset.scene, sc = name && sceneRegistry[name];
    if (!sc) { primeIntro(s.el); return; }
    if (sc.prep) sc.prep(s.el, fromEnd);
    else console.warn('[deckadence] scene "' + name + '" has no prep(el): it will flash on every arrival');
  }

  /* ==========================================================
     SCÈNES À ÉTAPES
     stepped(name, { labels, build(svg) → m, pose(m, k), play(m, k, c) → ms })
       build  : dessine tout le SVG (une fois par montage), puis pose(-1)
       pose   : état FINAL de l'étape k, posé d'un coup (k = -1 : avant l'étape a)
       play   : anime de l'état k-1 vers k ; renvoie sa durée, pose(k) est réappliqué à la fin
     Un clic (→, espace, swipe) = une étape. ← revient d'une étape. ↓ rejoue l'étape.
     ========================================================== */
  const T = ms => ms * MOTION;
  const NS = 'http://www.w3.org/2000/svg';
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpObj = (A, B, t) => { const o = {}; for (const k in A) o[k] = typeof A[k] === 'number' ? lerp(A[k], B[k], t) : A[k]; return o; };
  const fr = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const flat = a => [a].flat(Infinity).filter(Boolean).flatMap(x => (x instanceof NodeList ? [...x] : [x]));
  function S(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // Rich SVG text: *gras*, ~italique~, _e en indice ; espace insécable avant : ? ! ;
  function rich(t, content) {
    while (t.firstChild) t.removeChild(t.firstChild);
    const segs = typeof content === 'string' ? [[content]] : content;
    let up = false;
    segs.forEach(([str, attrs]) => {
      str = str.replace(/ ([:?!;])/g, ' $1');
      str.split(/(\*[^*]+\*|~[^~]+~)/).forEach(seg => {
        if (!seg) return;
        const sa = Object.assign({}, attrs || {});
        if (seg.length > 2 && seg[0] === '*' && seg.endsWith('*')) { sa['font-weight'] = 700; seg = seg.slice(1, -1); }
        else if (seg.length > 2 && seg[0] === '~' && seg.endsWith('~')) { sa['font-style'] = 'italic'; seg = seg.slice(1, -1); }
        seg.split(/(_[A-Za-z0-9α])/).forEach(q => {
          if (!q) return;
          const a = Object.assign({}, sa), sub = q.length === 2 && q[0] === '_';
          if (sub) { a.dy = '0.25em'; a['font-size'] = '70%'; } else if (up) a.dy = '-0.175em';
          S('tspan', a, t).textContent = sub ? q[1] : q;
          up = sub;
        });
      });
    });
    return t;
  }
  const tx = (parent, x, y, content, attrs) => rich(S('text', Object.assign({ x, y }, attrs || {}), parent), content);
  function seeded(seed) {
    return function () {
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  // pose helpers
  function clean(svg) { svg.querySelectorAll('[style]').forEach(e => e.removeAttribute('style')); }
  // hidden = transparent AND not clickable (otherwise an invisible element from another step catches edit clicks)
  function vis(els, on) { flat(els).forEach(e => { e.style.opacity = on ? '' : 0; e.style.pointerEvents = on ? '' : 'none'; }); }
  // play helpers (all queued on the step controller c, so leaving the step cancels them)
  function fadeIn(c, els, d = 0, dur = 500) { const t = flat(els); if (!t.length) return; t.forEach(e => { e.style.opacity = 0; }); c.anim(t, { opacity: [0, 1], duration: T(dur), delay: T(d), ease: 'out(2)' }); }
  function fadeOut(c, els, d = 0, dur = 400) { const t = flat(els); if (!t.length) return; c.anim(t, { opacity: 0, duration: T(dur), delay: T(d), ease: 'out(2)' }); }
  function tweenT(c, dur, d, fn, ease = EASE) { const o = { t: 0 }; c.anim(o, { t: [0, 1], duration: T(dur), delay: T(d), ease, onUpdate: () => fn(o.t) }); }
  function hidePath(p) { const L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = L; }
  function drawPath(c, p, dur, d = 0, ease = 'inOutQuad') {
    const L = p.getTotalLength(), o = { v: L };
    p.style.opacity = ''; p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = L;
    c.anim(o, { v: [L, 0], duration: T(dur), delay: T(d), ease, onUpdate: () => { p.style.strokeDashoffset = o.v; } });
  }

  let stepHud = () => {};
  function stepped(name, def) {
    let ctl = null;
    const n = def.labels.length;
    const pose = (m, k) => { def.pose(m, k); applyEdits(m.svg); };
    const sc = sceneRegistry[name] = {
      labels: def.labels,
      mount(el) {
        const svg = el.querySelector('svg.stage');
        svg.replaceChildren();
        el._m = def.build(svg); el._m.svg = svg; el._at = 0;
        nameBlocks(svg);
        pose(el._m, -1);
      },
      stop() {
        if (!ctl) return;
        ctl.cancelled = true; ctl.timers.forEach(clearTimeout);
        ctl.anims.forEach(a => { try { a.pause(); } catch (e) {} });
        ctl = null;
      },
      prep(el, fromEnd) { sc.stop(); const k = fromEnd ? n - 1 : -1; pose(el._m, k); el._at = Math.max(0, k); },
      run(el) { sc.go(el, 0); },
      still(el) { sc.set(el, 0); },
      go(el, k) {
        sc.stop(); pose(el._m, k - 1); el._at = k; stepHud();
        const c = ctl = { cancelled: false, timers: [], anims: [] };
        c.at = (ms, fn) => c.timers.push(setTimeout(() => { if (!c.cancelled) fn(); }, T(ms)));
        c.anim = (t, p) => { const a = animate(t, p); c.anims.push(a); return a; };
        const ms = def.play(el._m, k, c) || 0;
        c.at(ms + 80, () => pose(el._m, k));
      },
      set(el, k) { sc.stop(); pose(el._m, k); el._at = k; stepHud(); },
      forward(el) { if (el._at < n - 1) { sc.go(el, el._at + 1); return true; } return false; },
      back(el) { if (el._at > 0) { sc.set(el, el._at - 1); return true; } return false; },
    };
  }


  /* ==========================================================
     MODE ÉDITION · touche E ou bouton ✎
     Clic : sélectionner · glisser : déplacer · Maj + glisser : déplacer tout le groupe
     Flèches : déplacer de 1 px (Maj : 10 px) · double-clic sur un texte : le réécrire
     (*gras*, ~italique~, m_e pour l'indice) · Suppr : masquer · Ctrl+Z : annuler.
     Une modification vaut pour toutes les étapes du visuel. Elle est enregistrée avec la
     présentation (stockage partagé de l'artifact) ; hors ligne, dans ce navigateur.
     EDITS = { CLÉ_STATION : { chemin-dans-le-svg : { dx, dy, text, fill, size, hidden } } }
     ========================================================== */
  const EDITS = {};
  const LS_KEY = 'stats-proba-edits-v1';
  // Inside the claude.ai viewer (an iframe) the edits saved with the artifact are the only truth:
  // this browser's copy is ignored, then overwritten once they arrive. Opened as a plain file,
  // the browser copy is all there is.
  const IN_VIEWER = window.parent !== window;
  const loadLocal = () => { try { Object.assign(EDITS, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); } catch (e) {} };
  if (!IN_VIEWER) loadLocal();
  const stationKey = svg => svg.closest('.station').dataset.key;
  // An element's address = the stable name of its top-level block + its child indices inside it.
  // Blocks are named from their content at build time (before any edit), so adding or removing
  // another block elsewhere in the drawing never re-targets a saved edit.
  const hashName = str => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return 'k' + (h >>> 0).toString(36); };
  function nameBlocks(svg) {
    const seen = {};
    [...svg.children].forEach(ch => {
      const t = ch.tagName === 'text' ? ch : ch.querySelector('text');
      const sig = ch.tagName + ':' + (t ? t.textContent.trim().slice(0, 40) : (ch.getAttribute('class') || ''));
      seen[sig] = (seen[sig] || 0) + 1;
      ch.dataset.ek = hashName(sig + '#' + seen[sig]);
    });
  }
  const pathOf = (el, svg) => {
    const rel = []; let top = el;
    while (top.parentNode !== svg) { rel.unshift([...top.parentNode.children].indexOf(top)); top = top.parentNode; }
    return top.dataset.ek + (rel.length ? '/' + rel.join('-') : '');
  };
  const byPath = (svg, p) => {
    if (p[0] !== 'k') return p.split('-').reduce((n, i) => n && n.children[+i], svg);   // older index-only addresses
    const [top, rel] = p.split('/');
    let n = svg.querySelector(':scope > [data-ek="' + top + '"]');
    if (n && rel) n = rel.split('-').reduce((x, i) => x && x.children[+i], n);
    return n;
  };
  function recolor(t, c) {
    if (t.tagName === 'g') { [...t.children].forEach(ch => recolor(ch, c)); return; }
    if (t.tagName === 'text') { t.style.fill = c; t.querySelectorAll('tspan').forEach(x => { x.style.fill = c; }); return; }
    const cs = getComputedStyle(t);
    if (t.tagName === 'line' || cs.fill === 'none') t.style.stroke = c;
    else { t.style.fill = c; if (cs.stroke !== 'none') t.style.stroke = c; }
  }
  function paint(t, o) {
    if (o.text != null && t.tagName === 'text') rich(t, o.text);
    if (o.hidden) t.style.display = 'none';
    if (o.dx || o.dy) t.style.translate = `${o.dx || 0}px ${o.dy || 0}px`;   // CSS translate composes with any transform
    if (o.size) t.style.fontSize = o.size + 'px';
    if (o.fill) recolor(t, o.fill);
  }
  function applyEdits(svg) {
    const key = stationKey(svg), E = EDITS[key];
    if (!E) return;
    let migrated = false;
    for (const p of Object.keys(E)) {
      const t = byPath(svg, p); if (!t) continue;
      paint(t, E[p]);
      if (p[0] !== 'k') { const np = pathOf(t, svg); E[np] = { ...(E[np] || {}), ...E[p] }; delete E[p]; migrated = true; }   // upgrade old addresses
    }
    if (migrated && !STILL && (!IN_VIEWER || storeReady)) save(key);
  }
  // text element → the markup rich() reads back (*gras*, ~italique~, _e)
  function toMarkup(t) {
    const ts = [...t.querySelectorAll('tspan')];
    if (!ts.length) return t.textContent;
    let out = '', bold = false;
    ts.forEach(x => {
      const sub = x.getAttribute('font-size') === '70%', b = +x.getAttribute('font-weight') >= 700, it = x.getAttribute('font-style') === 'italic';
      if (!sub && b !== bold) { out += '*'; bold = b; }
      out += sub ? '_' + x.textContent : it ? '~' + x.textContent + '~' : x.textContent;
    });
    if (bold) out += '*';
    return out.replace(/ /g, ' ').replace(/\*\*/g, '');
  }

  let editing = false, sel = null, selPath = null, undo = [], db = null, saving = false, saveTimer = 0, storeReady = !IN_VIEWER;
  const pending = new Set();
  const $id = id => document.getElementById(id);
  const edbar = $id('edbar'), edsel = $id('edsel'), edtext = $id('edtext'), edstat = $id('edstat');
  const curSvg = () => stations[cur].el.querySelector('svg.stage');
  const edStatus = t => { edstat.textContent = t; };
  function save(key) {
    if (!storeReady) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(EDITS)); } catch (e) {}
    pending.add(key);
    clearTimeout(saveTimer); saveTimer = setTimeout(flush, 700);
    edStatus(db ? 'Enregistrement…' : 'Enregistré dans ce navigateur');
  }
  async function flush() {
    if (!db || saving || !pending.size) return;
    saving = true;
    try {
      for (const key of [...pending]) { pending.delete(key); await db.doc('edits/' + key).set({ o: JSON.parse(JSON.stringify(EDITS[key] || {})) }); }
      edStatus('Enregistré');
    } catch (e) {
      edStatus(e && (e.code === 'not_granted' || e.code === 'revoked') ? 'Lecture seule : gardé dans ce navigateur' : 'Pas enregistré : réessaie dans un moment');
    }
    saving = false;
    if (pending.size) flush();
  }
  function repose() {
    const s = stations[cur], sc = sceneOf(s);
    if (sc && sc.labels && s.mounted) sc.set(s.el, s.el._at || 0);
    if (selPath) sel = byPath(curSvg(), selPath);
  }
  function change(svg, p, patch) {
    const key = stationKey(svg), E = EDITS[key] = EDITS[key] || {};
    undo.push({ key, p, prev: E[p] ? { ...E[p] } : null });
    E[p] = { ...(E[p] || {}), ...patch };
    repose(); save(key);
  }
  function doUndo() {
    const u = undo.pop(); if (!u) return;
    const E = EDITS[u.key] = EDITS[u.key] || {};
    if (u.prev) E[u.p] = u.prev; else delete E[u.p];
    repose(); save(u.key);
  }
  function select(t) {
    sel = t; selPath = t ? pathOf(t, curSvg()) : null;
    edbar.classList.toggle('has-sel', !!t);
    edbar.classList.toggle('is-text', !!t && t.tagName === 'text');
  }
  // the selection outline follows its element (camera moves, steps, drags)
  (function track() {
    if (editing && sel && sel.isConnected && curSvg().contains(sel) && getComputedStyle(sel).display !== 'none') {
      const r = sel.getBoundingClientRect();
      Object.assign(edsel.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
      edsel.hidden = false;
    } else edsel.hidden = true;
    requestAnimationFrame(track);
  })();
  function toggleEdit(on = !editing) {
    editing = on;
    document.body.classList.toggle('editing', on);
    edbar.hidden = !on;
    select(null); edtext.hidden = true;
    if (on) { repose(); edStatus(db ? 'Les modifications sont enregistrées avec la présentation' : 'Les modifications sont gardées dans ce navigateur'); }
  }
  $id('edbtn').addEventListener('click', e => { toggleEdit(); e.currentTarget.blur(); });

  viewportEl.addEventListener('pointerdown', e => {
    if (!editing || busy || e.button > 0) return;
    const svg = curSvg();
    let t = e.target;
    if (!svg.contains(t) || t === svg) { select(null); return; }
    if (t.tagName === 'tspan') t = t.parentNode;
    if (e.shiftKey && t.parentNode !== svg) t = t.parentNode;   // Maj : the whole group
    select(t);
    const p = selPath, key = stationKey(svg), base = { ...((EDITS[key] || {})[p] || {}) };
    const M = t.parentNode.getScreenCTM().inverse(), P = ev => new DOMPoint(ev.clientX, ev.clientY).matrixTransform(M);
    const p0 = P(e), off = ev => { const q = P(ev); return [Math.round((base.dx || 0) + q.x - p0.x), Math.round((base.dy || 0) + q.y - p0.y), Math.abs(q.x - p0.x) + Math.abs(q.y - p0.y)]; };
    let moved = false;
    const mv = ev => { const [dx, dy, d] = off(ev); if (d > 2) moved = true; if (moved) t.style.translate = `${dx}px ${dy}px`; };
    const up = ev => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (moved) { const [dx, dy] = off(ev); change(svg, p, { dx, dy }); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    e.preventDefault();
  });
  viewportEl.addEventListener('dblclick', e => {
    if (!editing) return;
    let t = e.target;
    if (t.tagName === 'tspan') t = t.parentNode;
    if (t.tagName === 'text' && curSvg().contains(t)) openText(t);
  });
  function openText(t) {
    const svg = curSvg(), p = pathOf(t, svg), key = stationKey(svg), r = t.getBoundingClientRect();
    const before = ((EDITS[key] || {})[p] || {}).text ?? toMarkup(t);
    edtext.value = before;
    Object.assign(edtext.style, { left: r.left - 8 + 'px', top: r.top - 6 + 'px', width: Math.max(r.width + 80, 240) + 'px',
      fontSize: Math.max(13, parseFloat(getComputedStyle(t).fontSize) * cam.zoom) + 'px' });
    edtext.hidden = false; edtext.focus(); edtext.select();
    const done = keep => {
      edtext.onkeydown = edtext.onblur = null; edtext.hidden = true;
      if (keep && edtext.value !== before) change(svg, p, { text: edtext.value });
    };
    edtext.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter') done(true); else if (ev.key === 'Escape') done(false); };
    edtext.onblur = () => done(true);
  }
  edbar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const svg = curSvg(), key = stationKey(svg), act = b.dataset.act;
    if (act === 'done') return toggleEdit(false);
    if (act === 'undo') return doUndo();
    if (act === 'reset') {
      if (!b.classList.contains('armed')) { b.classList.add('armed'); b.textContent = 'Confirmer ?'; setTimeout(() => { b.classList.remove('armed'); b.textContent = 'Réinitialiser ce visuel'; }, 2500); return; }
      b.classList.remove('armed'); b.textContent = 'Réinitialiser ce visuel';
      delete EDITS[key]; undo = undo.filter(u => u.key !== key); select(null); repose(); save(key); return;
    }
    if (!sel) return;
    if (b.dataset.color) change(svg, selPath, { fill: b.dataset.color });
    else if (act === 'bigger' || act === 'smaller') {
      if (sel.tagName === 'text') change(svg, selPath, { size: Math.round(parseFloat(getComputedStyle(sel).fontSize) * (act === 'bigger' ? 1.12 : 0.89) * 10) / 10 });
    } else if (act === 'hide') { change(svg, selPath, { hidden: true }); select(null); }
  });
  // keys: E toggles; while editing, arrows / Suppr / Ctrl+Z act on the selection before the deck sees them
  window.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if ((e.key === 'e' || e.key === 'E') && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); e.stopImmediatePropagation(); toggleEdit(); return; }
    if (!editing) return;
    const eat = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { eat(); doUndo(); return; }
    if (e.key === 'Escape') { eat(); if (sel) select(null); else toggleEdit(false); return; }
    if (!sel) return;
    const st = e.shiftKey ? 10 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
    const svg = curSvg(), o = (EDITS[stationKey(svg)] || {})[selPath] || {};
    if (d) { eat(); change(svg, selPath, { dx: (o.dx || 0) + d[0], dy: (o.dy || 0) + d[1] }); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { eat(); change(svg, selPath, { hidden: true }); select(null); }
  }, true);
  // shared store: the edits saved with the artifact replace this browser's copy
  function reposeAll() { stations.forEach(st => { const sc = sceneOf(st); if (st.mounted && sc && sc.labels && st !== stations[cur]) sc.set(st.el, st.el._at || 0); }); repose(); }
  function useLocalCopy() { if (storeReady) return; storeReady = true; loadLocal(); reposeAll(); }   // no shared store in this view
  (function connect(t0) {
    const C = window.claude;
    if (!(C && typeof C.use === 'function')) { if (IN_VIEWER && Date.now() - t0 < 8000) setTimeout(() => connect(t0), 150); else useLocalCopy(); return; }
    C.use('db').then(async d => {
      if (!d) { useLocalCopy(); return; }
      try {
        const qs = await d.collection('edits').get();
        for (const k in EDITS) delete EDITS[k];
        qs.docs.forEach(doc => { const v = doc.data(); if (v && v.o) EDITS[doc.id] = JSON.parse(JSON.stringify(v.o)); });
        db = d; storeReady = true;
        try { localStorage.setItem(LS_KEY, JSON.stringify(EDITS)); } catch (e) {}
        reposeAll();
      } catch (e) { db = d; useLocalCopy(); }
      if (editing) edStatus('Les modifications sont enregistrées avec la présentation');
      flush();
    }, () => useLocalCopy());
  })(Date.now());

