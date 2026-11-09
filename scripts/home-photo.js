/* AVANZATO — Главная: проявка кадров, плёнка с перетаскиванием, вспышка на CTA. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- автофокус: рамка прыгает по строкам заголовка, потом берёт его целиком ---------- */
  var title = document.querySelector('.hero-title'), inner = document.querySelector('.hero-inner');
  if (title && inner) {
    var lines = [].slice.call(title.querySelectorAll('.line'));
    var box = document.createElement('div'); box.className = 'af-box'; box.setAttribute('aria-hidden', 'true');
    inner.appendChild(box);
    var target = null; /* null = весь заголовок */
    var rectOf = function (els) {
      var l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
      els.forEach(function (el) { var rg = document.createRange(); rg.selectNodeContents(el.firstElementChild || el); var q = rg.getBoundingClientRect(); l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); });
      return { left: l, top: t, width: r - l, height: b - t };
    };
    var place = function () {
      var r = rectOf(target ? [target] : lines), p = inner.getBoundingClientRect();
      var fs = parseFloat(getComputedStyle(title).fontSize), px = fs * .12;
      box.style.left = (r.left - p.left - px) + 'px'; box.style.top = (r.top - p.top + fs * .04) + 'px';
      box.style.width = (r.width + px * 2) + 'px'; box.style.height = (r.height + fs * .02) + 'px';
    };
    var pulse = function (cls) { box.classList.remove('hunt', 'lock'); void box.offsetWidth; box.classList.add(cls); };
    var focusOn = function (i) {
      target = i == null ? null : lines[i];
      lines.forEach(function (ln, k) { ln.classList.toggle('sharp', i == null || k === i); });
      place(); pulse(i == null ? 'lock' : 'hunt');
    };
    addEventListener('resize', place);
    if (reduce) { box.classList.add('on'); place(); if (document.fonts) document.fonts.ready.then(place); }
    else {
      title.classList.add('focusing');
      var run = function () {
        var steps = lines.map(function (_, i) { return i; }).concat([null]);
        box.classList.add('on');
        steps.forEach(function (st, n) { setTimeout(function () { focusOn(st); }, n * 700); });
        setTimeout(function () { title.classList.remove('focusing'); }, steps.length * 700 + 400);
      };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 1000); });
    }
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
