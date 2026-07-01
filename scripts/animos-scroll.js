/* ============================================================
   AVANZATO — animos-style scroll reveal (scroll-scrubbed words)
   ------------------------------------------------------------
   Слова проявляются из размытых/тусклых в резкие/яркие по мере
   прокрутки элемента через вьюпорт — как на animos.app.
   Работает только на элементах с атрибутом [data-scroll-words].
   Не меняет текст и разметку (кроме оборачивания слов в <span>),
   бережно сохраняет вложенные теги (<em>, <a>, <br> и т.п.).
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* оборачиваем текстовые узлы в слова, сохраняя вложенные элементы */
  function wrapWords(root, bucket) {
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) { // текст
          var parts = ch.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (p === '') return;
            if (/^\s+$/.test(p)) {
              var sp = document.createElement('span');
              sp.className = 'sw-sp';
              sp.textContent = p;
              frag.appendChild(sp);
              return;
            }
            var w = document.createElement('span');
            w.className = 'sw';
            w.textContent = p;
            bucket.push(w);
            frag.appendChild(w);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') {
          walk(ch); // рекурсия внутрь <em>, <a> и пр.
        }
      });
    })(root);
  }

  var items = [];

  function setup() {
    var els = [].slice.call(document.querySelectorAll('[data-scroll-words]'));
    if (!els.length) return;

    els.forEach(function (el) {
      if (el._sw) return;
      el._sw = true;
      var words = [];
      wrapWords(el, words);
      el.classList.add('sw-ready');
      if (reduceMotion || !words.length) {
        words.forEach(function (w) { w.classList.add('lit'); });
        return;
      }
      items.push({ el: el, words: words, lit: 0 });
    });

    if (!items.length) return;
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  function update() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var r = it.el.getBoundingClientRect();

      /* прогресс: 0 когда верх элемента у 82% высоты экрана,
         1 когда низ элемента доходит до 42% высоты экрана.
         Такой диапазон даёт «дочитывающее» проявление по ходу скролла. */
      var startY = vh * 0.82;
      var endY = vh * 0.42;
      var span = (startY - endY) + r.height;
      var p = (startY - r.top) / span;
      if (p < 0) p = 0; else if (p > 1) p = 1;

      var target = Math.round(p * it.words.length);
      if (target === it.lit) continue;

      if (target > it.lit) {
        for (var a = it.lit; a < target; a++) it.words[a].classList.add('lit');
      } else {
        for (var b = it.lit - 1; b >= target; b--) it.words[b].classList.remove('lit');
      }
      it.lit = target;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
