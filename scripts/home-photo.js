/* AVANZATO — Главная: проявка кадров, плёнка с перетаскиванием, вспышка на CTA. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- рамка автофокуса вокруг «со вкусом.» ---------- */
  var af = document.querySelector('.af'), inner = document.querySelector('.hero-inner');
  if (af && inner) {
    var box = document.createElement('div'); box.className = 'af-box'; box.setAttribute('aria-hidden', 'true');
    inner.appendChild(box);
    var place = function () {
      var r = af.getBoundingClientRect(), p = inner.getBoundingClientRect(), fs = parseFloat(getComputedStyle(af).fontSize);
      var px = fs * .1, py = fs * .02;
      box.style.left = (r.left - p.left - px) + 'px'; box.style.top = (r.top - p.top + fs * .1) + 'px';
      box.style.width = (r.width + px * 2) + 'px'; box.style.height = (r.height - fs * .06 + py) + 'px';
    };
    place(); setTimeout(place, 900); setTimeout(place, 1600); addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    box.classList.add('go');
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
