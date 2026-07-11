/* ============================================================
   AVANZATO — Pricing 3D interactions (pricing.html only)
   - cursor-driven tilt on tier cards (+ glare, depth layers)
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

  function init() { setupTierTilt(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
