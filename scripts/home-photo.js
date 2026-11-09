/* AVANZATO — Главная: проявка кадров, плёнка с перетаскиванием, вспышка на CTA. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- фокусировка: строки заголовка по очереди становятся резкими, потом весь заголовок ---------- */
  var title = document.querySelector('.hero-title');
  if (title) {
    var lines = [].slice.call(title.querySelectorAll('.line'));
    var focusOn = function (i) { lines.forEach(function (ln, k) { ln.classList.toggle('sharp', i == null || k === i); }); };
    title.classList.add('focusing');
    var run = function () {
      var steps = lines.map(function (_, i) { return i; }).concat([null]);
      steps.forEach(function (st, n) { setTimeout(function () { focusOn(st); }, n * 1500); });
      setTimeout(function () { title.classList.remove('focusing'); title.classList.add('focused'); }, steps.length * 1500 + 900);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 1000); });
  }

  /* ---------- проявка ---------- */
  var dev = [].slice.call(document.querySelectorAll('.develop'));
  if (reduce || !('IntersectionObserver' in window)) dev.forEach(function (d) { d.classList.add('is-dev'); });
  else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { var el = e.target; setTimeout(function () { el.classList.add('is-dev'); }, 150); io.unobserve(el); }
      });
    }, { threshold: 0.35 });
    dev.forEach(function (d) { io.observe(d); });
  }

  /* ---------- плёнка ---------- */
  var track = document.querySelector('.film-track');
  if (track) {
    var step = function () { var f = track.querySelector('.film-frame'); return f ? f.getBoundingClientRect().width + 14 : 300; };
    [].forEach.call(document.querySelectorAll('.film-btn'), function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: step() * +b.getAttribute('data-dir'), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    /* перетаскивание мышью, как плёнку на столе */
    var down = false, moved = false, sx = 0, sl = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-drag'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false;
      if (moved) {
        setTimeout(function () { track.classList.remove('is-drag'); }, 0);
        var s = step(); track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: step() * (e.key === 'ArrowRight' ? 1 : -1), behavior: reduce ? 'auto' : 'smooth' }); }
    });
  }

  /* ---------- вспышка на главных кнопках ---------- */
  if (!reduce) {
    var flash = document.createElement('div'); flash.className = 'flash'; flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);
    [].forEach.call(document.querySelectorAll('.hero-cta .btn-primary'), function (b) {
      b.addEventListener('pointerdown', function () {
        flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      });
    });
  }
})();
