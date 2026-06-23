/* ============================================================
   AVANZATO — Pricing 3D interactions (pricing.html only)
   - cursor-driven tilt on tier cards (+ glare, depth layers)
   - subtle background-shape parallax
   Gated behind reduced-motion + pointer capability.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function setupTierTilt() {
    if (reduce || !fine) return;
    [].slice.call(document.querySelectorAll('.tier')).forEach(function (card) {
      var featured = card.classList.contains('featured');
      var max = 6, raf = null, rx = 0, ry = 0, gx = 50, gy = 50;
      function paint() {
        raf = null;
        card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)' + (featured ? ' scale(1.025)' : '');
        card.style.setProperty('--gx', gx.toFixed(1) + '%');
        card.style.setProperty('--gy', gy.toFixed(1) + '%');
      }
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry = clamp(px, -0.5, 0.5) * max;
        rx = clamp(-py, -0.5, 0.5) * max;
        gx = px * 100 + 50; gy = py * 100 + 50;
        card.style.transition = 'transform .12s linear, box-shadow .5s var(--ease), border-color .5s var(--ease)';
        if (!raf) raf = requestAnimationFrame(paint);
      });
      card.addEventListener('mouseleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), box-shadow .5s var(--ease), border-color .5s var(--ease)';
        card.style.transform = '';
      });
    });
  }

  function setupBgParallax() {
    if (reduce || !fine) return;
    var shapes = [].slice.call(document.querySelectorAll('.pr-shape'));
    if (!shapes.length) return;
    var raf = null, mx = 0, my = 0;
    function paint() {
      raf = null;
      shapes.forEach(function (s, i) {
        var d = (i + 1) * 9;
        s.style.marginLeft = (mx * d).toFixed(1) + 'px';
        s.style.marginTop = (my * d).toFixed(1) + 'px';
      });
    }
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
  }

  /* ---------- interactive estimate calculator ---------- */
  function setupCalc() {
    var root = document.getElementById('calc');
    if (!root) return;
    var totalEl = document.getElementById('calc-total');
    var breakEl = document.getElementById('calc-break');
    var photosEl = document.getElementById('calc-photos');
    var cta = document.getElementById('calc-cta');
    var result = document.getElementById('calc-result');
    var opts = [].slice.call(root.querySelectorAll('.calc-opt'));
    var minus = root.querySelector('.calc-mn');
    var plus = root.querySelector('.calc-pl');
    var PHOTO = 1000, MAXP = 30;

    var state = { base: 55000, pkg: 'landing', name: 'Лендинг', photos: 0 };
    var shown = 55000;

    function fmt(n) { return Math.round(n).toLocaleString('ru-RU'); }

    function animateTotal(to) {
      var from = shown, start = null, dur = 600;
      if (totalEl._raf) cancelAnimationFrame(totalEl._raf);
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - t, 3);
        shown = from + (to - from) * e;
        totalEl.textContent = fmt(shown);
        if (t < 1) totalEl._raf = requestAnimationFrame(step);
        else { shown = to; totalEl.textContent = fmt(to); }
      }
      if (reduce) { shown = to; totalEl.textContent = fmt(to); return; }
      totalEl._raf = requestAnimationFrame(step);
    }

    function render() {
      var photoSum = state.photos * PHOTO;
      var total = state.base + photoSum;
      animateTotal(total);
      var rows = '<li><span>' + state.name + '</span><b>' + fmt(state.base) + ' ₽</b></li>';
      if (state.photos > 0) rows += '<li><span>Ретушь фото × ' + state.photos + '</span><b>' + fmt(photoSum) + ' ₽</b></li>';
      breakEl.innerHTML = rows;
      photosEl.textContent = state.photos;
      cta.setAttribute('href', 'contacts.html?pkg=' + state.pkg);
      if (minus) minus.disabled = state.photos <= 0;
      if (plus) plus.disabled = state.photos >= MAXP;
    }

    opts.forEach(function (b) {
      b.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('active'); });
        b.classList.add('active');
        state.base = parseInt(b.getAttribute('data-base'), 10);
        state.pkg = b.getAttribute('data-pkg');
        state.name = b.getAttribute('data-name');
        render();
      });
    });
    [minus, plus].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        var d = parseInt(btn.getAttribute('data-step'), 10);
        state.photos = clamp(state.photos + d, 0, MAXP);
        render();
      });
    });

    if (fine && !reduce && result) {
      result.addEventListener('mousemove', function (e) {
        var r = result.getBoundingClientRect();
        result.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        result.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    }
    render();
  }

  function init() { setupTierTilt(); setupBgParallax(); setupCalc(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
