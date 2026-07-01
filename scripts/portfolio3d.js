/* ============================================================
   AVANZATO — Portfolio 3D interactions (portfolio.html only)
   - cursor-driven tilt on project cards (with parallax depth layers)
   - floating hero deck that reacts to mouse / device tilt
   - subtle background-shape parallax
   All gated behind reduced-motion + pointer capability.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- 1. card tilt ----------
     Убрано намеренно: карточки в сетке теперь с чистым редакторским
     hover (zoom + ч/б→цвет, акцентная рамка) — всё на CSS.
     Парящая колода в шапке и фон-параллакс сохранены. */
  function setupCardTilt() { /* no-op */ }

  /* ---------- 2. hero floating deck ---------- */
  function setupHeroDeck() {
    if (reduce) return;
    var stage = document.querySelector('.p3-stage');
    var deck = document.querySelector('.p3-deck');
    if (!stage || !deck) return;
    var raf = null, rx = 0, ry = 0;
    function paint() { raf = null; deck.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'; }
    function aim(px, py) {
      ry = clamp(px, -1, 1) * 16;
      rx = clamp(-py, -1, 1) * 12;
      if (!raf) raf = requestAnimationFrame(paint);
    }
    if (fine) {
      var host = document.querySelector('.p-hero') || stage;
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        aim((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      });
      host.addEventListener('mouseleave', function () { aim(0, 0); });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        aim(e.gamma / 45, (e.beta - 45) / 45);
      });
    }
  }

  /* ---------- 3. background shape parallax ---------- */
  function setupBgParallax() {
    if (reduce || !fine) return;
    var shapes = [].slice.call(document.querySelectorAll('.p3-shape'));
    if (!shapes.length) return;
    var raf = null, mx = 0, my = 0;
    function paint() {
      raf = null;
      shapes.forEach(function (s, i) {
        var depth = (i + 1) * 8;
        s.style.marginLeft = (mx * depth).toFixed(1) + 'px';
        s.style.marginTop = (my * depth).toFixed(1) + 'px';
      });
    }
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
  }

  function init() {
    setupCardTilt();
    setupHeroDeck();
    setupBgParallax();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
