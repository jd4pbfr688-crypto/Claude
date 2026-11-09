  /* ---------- input ---------- */
  function next() { if (!busy && cur < stations.length - 1) goto(cur + 1); }
  // From the last step, going back lands on the previous station's LAST step.
  function prev() { if (!busy && cur > 0) goto(cur - 1, { fromEnd: true }); }
  // ONE step dispatch for arrows AND swipes: a stepped scene consumes the click while it
  // still has steps in that direction; past its ends, the camera flies to the next station.
  function step(dir) {
    const s = stations[cur], sc = sceneOf(s);
    if (!busy && !overview && sc && sc.labels && s.mounted && (dir > 0 ? sc.forward(s.el) : sc.back(s.el))) return;
    dir > 0 ? next() : prev();
  }
  function replay() {
    const s = stations[cur], sc = sceneOf(s);
    if (sc && sc.labels && s.mounted && !overview) sc.go(s.el, s.el._at || 0); else goto(cur);
  }
  stepHud = () => {
    const s = stations[cur], sc = sceneOf(s), el = document.getElementById('stepl');
    if (el) el.textContent = sc && sc.labels && s.mounted && !overview ? '  ·  étape ' + sc.labels[s.el._at || 0] : '';
  };

  function toggleFullscreen() {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      const el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { try { const p = req.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }
  const fsbtn = document.getElementById('fsbtn');
  fsbtn.addEventListener('click', () => { toggleFullscreen(); fsbtn.blur(); });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => {
    document.body.classList.toggle('is-fullscreen', !!(document.fullscreenElement || document.webkitFullscreenElement));
  }));
  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) {
    document.body.classList.add('no-fullscreen');
    fsbtn.style.display = 'none';
  }

  window.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'o' || e.key === 'O' || e.key === 'ArrowUp') { e.preventDefault(); if (!busy) toOverview(); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
    else if (e.key === 'ArrowDown' || e.key === 'Escape') { e.preventDefault(); if (!busy) replay(); }
  });

  let swipeHint = null;
  function removeSwipeHint() { if (swipeHint) { swipeHint.remove(); swipeHint = null; } }
  if (TOUCH && !STILL) {
    swipeHint = document.createElement('div');
    swipeHint.id = 'swipehint'; swipeHint.textContent = 'Balayez pour avancer';
    document.body.appendChild(swipeHint);
    swipeHint.addEventListener('animationend', removeSwipeHint);
  }
  function requestDeckFullscreen(lockLandscape) {
    const el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const p = req.call(el);
      if (p && p.catch) p.catch(() => {});
      if (lockLandscape && screen.orientation && screen.orientation.lock)
        Promise.resolve(p).then(() => screen.orientation.lock('landscape')).catch(() => {});
    } catch (e) {}
  }
  let fsAuto = false, touch = null;
  window.addEventListener('touchstart', e => {
    touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  window.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (!touch || e.touches.length || document.body.classList.contains('editing')) { touch = null; return; }
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (window.visualViewport && window.visualViewport.scale > 1.05) return;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 48) return;
    if (TOUCH && !fsAuto) { fsAuto = true; requestDeckFullscreen(false); }
    removeSwipeHint();
    step((ax >= ay ? dx : dy) < 0 ? 1 : -1);
  }, { passive: true });
  document.getElementById('rotatehint').addEventListener('click', () => {
    fsAuto = true;
    requestDeckFullscreen(true);
    document.body.classList.add('rh-dismissed');
  });

  stations.forEach((s, i) => s.el.addEventListener('click', () => { if (overview && !busy) goto(i); }));

  function refit() {
    stations.forEach(s => { s.w = s.el.offsetWidth; s.h = s.el.offsetHeight; s.cx = s.x + s.w / 2; s.cy = s.y + s.h / 2; });
    railWindow(cur);
    if (overview) toOverview();
    else { const s = stations[cur]; cam.x = s.cx; cam.y = s.cy; cam.zoom = fitZoom(s); render(); maskToStation(s); }
  }
  window.addEventListener('resize', refit);

  /* ---------- control-layer hooks ---------- */
  window.Deckadence = {
    version: 1,
    cam, stations, world, viewport: viewportEl,
    current: () => cur, isBusy: () => busy, isOverview: () => overview, still: STILL,
    goto, toOverview, render, fitZoom, primeStation, revealStation, splitLines, fitHeading, releaseClips,
    mountStation, setLive, setSource, isLive: i => !!(stations[i] && stations[i].live), liveSpan: LIVE_SPAN,
    setInset(px) { insetLeft = Math.max(0, +px || 0); refit(); },
    // steps of the current station: labels, and jump to one (by label or index), posed at its final state
    steps: () => { const sc = sceneOf(stations[cur]); return sc && sc.labels ? sc.labels.slice() : []; },
    setStep(k) { const s = stations[cur], sc = sceneOf(s); if (!sc || !sc.labels) return false; const i = typeof k === 'number' ? k : sc.labels.indexOf(k); if (i < 0) return false; sc.set(s.el, i); return true; },
    isPresenting: () => !!(document.fullscreenElement || document.webkitFullscreenElement),
  };

  let hashRetry = 0;
  function followHash() {
    clearTimeout(hashRetry);
    const i = stationFromHash(location.hash);
    if (i < 0 || (i === cur && !overview)) return;
    if (busy) { hashRetry = setTimeout(followHash, 120); return; }
    goto(i);
  }
  window.addEventListener('hashchange', followHash);

  /* ---------- boot ---------- */
  const hashIdx = stationFromHash(location.hash);
  const start = hashIdx >= 0 ? hashIdx : 0;
  if (hashIdx >= 0 && !STILL) syncHash(start);
  cur = start;
  stations.forEach((s, k) => { if (!liveAll && !near(k, start, LIVE_SPAN)) unmountStation(s); });
  document.body.classList.add('deck-ready');
  const bootMount = new Promise(r => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => r(mountStation(stations[start])), { once: true })
    : r(mountStation(stations[start])));
  cam.x = stations[start].cx; cam.y = stations[start].cy; cam.zoom = fitZoom(stations[start]);
  render();
  maskToStation(stations[start]);
  setHud(start);
  setTone(start);
  updateCulling();
  stations[start].el.style.visibility = 'hidden';
  Promise.all([document.fonts.ready, new Promise(r => setTimeout(r, 240)), bootMount]).then(() => {
    const st = stations[start];
    updateCulling();
    railWindow(cur);
    if (cur !== start) { st.el.style.visibility = ''; return; }
    primeStation(st);
    st.el.style.visibility = '';
    revealStation(st);
    settleLive(start);
  });
})();
</script>
