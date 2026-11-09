/* AVANZATO — Портфолио: фильтр по направлению и превью сайта,
   плывущее за курсором (только на устройствах с мышью). */
(function () {
  'use strict';
  var list = document.querySelector('.pl-list');
  if (!list) return;
  var rows = [].slice.call(list.querySelectorAll('.pl-row'));

  /* ---------- фильтр ---------- */
  var chips = [].slice.call(document.querySelectorAll('.pl-chip'));
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-f');
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
      rows.forEach(function (r) {
        var show = f === 'all' || r.getAttribute('data-cat') === f;
        r.hidden = !show;
        if (show) r.classList.add('in');
      });
    });
  });

  /* ---------- плавающее превью ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var box = document.querySelector('.pl-preview');
  var inner = box && box.querySelector('.pl-preview-in');
  if (!box || !inner) return;

  var imgs = {}, cur = null, active = false, raf = null;
  var tx = 0, ty = 0, x = 0, y = 0, lastX = 0;

  function imgFor(src) {
    if (!imgs[src]) {
      var im = new Image(); im.src = src; im.alt = ''; im.decoding = 'async';
      inner.appendChild(im); imgs[src] = im;
    }
    return imgs[src];
  }
  function tick() {
    var k = reduce ? 1 : 0.16;
    x += (tx - x) * k; y += (ty - y) * k;
    var tilt = Math.max(-8, Math.min(8, (tx - lastX) * 0.4)); lastX += (tx - lastX) * 0.2;
    box.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%) rotate(' + (reduce ? 0 : tilt).toFixed(2) + 'deg) scale(' + (active ? 1 : .86) + ')';
    if (active || Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) raf = requestAnimationFrame(tick); else raf = null;
  }
  function run() { if (!raf) raf = requestAnimationFrame(tick); }

  function show(link, e) {
    var im = imgFor(link.getAttribute('data-img'));
    if (!active) { x = tx = e.clientX; y = ty = e.clientY; lastX = tx; }
    if (cur !== im) { if (cur) cur.classList.remove('is-cur'); im.classList.add('is-cur'); cur = im; }
    active = true; box.classList.add('is-on');
  }
  list.addEventListener('mousemove', function (e) {
    if (!fine.matches) return;
    tx = e.clientX; ty = e.clientY;
    var link = e.target.closest('.pl-link');
    if (link) show(link, e);
    else if (active) { active = false; box.classList.remove('is-on'); }
    run();
  });
  list.addEventListener('mouseleave', function () { active = false; box.classList.remove('is-on'); run(); });
  window.addEventListener('scroll', function () { if (active) { active = false; box.classList.remove('is-on'); run(); } }, { passive: true });

  /* заранее подгружаем картинки, когда список появился на экране */
  if (fine.matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { rows.forEach(function (r) { imgFor(r.querySelector('.pl-link').getAttribute('data-img')); }); io.disconnect(); }
    });
    io.observe(list);
  }
})();
