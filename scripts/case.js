/* AVANZATO — кейсы: «Маршрут проекта» из заголовков глав, «Шаг N из M»,
   полоса прогресса и сетка для нескольких кадров подряд. Тексты не меняются. */
(function () {
  'use strict';
  var blocks = [].slice.call(document.querySelectorAll('.case-block'));
  if (!blocks.length) return;
  var total = blocks.length, pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* шаги и якоря */
  var items = blocks.map(function (b, i) {
    var h = b.querySelector('h2');
    if (!b.id) b.id = 'step-' + (i + 1);
    if (h) h.setAttribute('data-step', 'Шаг ' + pad(i + 1) + ' из ' + pad(total));
    return { id: b.id, title: h ? h.textContent.replace(/\s+/g, ' ').trim() : 'Шаг ' + (i + 1) };
  });

  /* маршрут проекта после шапки */
  var hero = document.querySelector('.case-hero .wrap');
  if (hero) {
    var nav = document.createElement('nav');
    nav.className = 'case-route reveal in'; nav.setAttribute('aria-label', 'Маршрут проекта');
    var html = '<div class="case-route-h"><b>Маршрут проекта</b><span>' + total + ' шагов от задачи до результата</span></div><ol>';
    items.forEach(function (it, i) {
      html += '<li><a href="#' + it.id + '"><i>' + pad(i + 1) + '</i><span></span></a></li>';
    });
    nav.innerHTML = html + '</ol>';
    [].forEach.call(nav.querySelectorAll('a span'), function (s, i) { s.textContent = items[i].title.replace(/\s*—.*$/, ''); });
    hero.appendChild(nav);
    nav.style.gridColumn = '1 / -1';
  }

  /* несколько кадров подряд — в сетку */
  var shots = [].slice.call(document.querySelectorAll('section .case-shot'));
  var runs = [], cur = [];
  shots.forEach(function (f) {
    if (cur.length && cur[cur.length - 1].nextElementSibling === f) cur.push(f);
    else { if (cur.length > 1) runs.push(cur); cur = [f]; }
  });
  if (cur.length > 1) runs.push(cur);
  runs.forEach(function (run) {
    var g = document.createElement('div'); g.className = 'case-shots' + (run.length % 2 ? ' odd' : '');
    run[0].parentNode.insertBefore(g, run[0]);
    run.forEach(function (f) { g.appendChild(f); });
  });

  /* прогресс и подсветка текущего шага */
  var bar = document.createElement('div'); bar.className = 'case-prog'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>'; document.body.appendChild(bar);
  var fill = bar.firstChild, links = nav ? [].slice.call(nav.querySelectorAll('a')) : [];
  var raf = null;
  function update() {
    raf = null;
    var first = blocks[0].getBoundingClientRect().top + scrollY - innerHeight * .5;
    var last = blocks[total - 1].getBoundingClientRect().bottom + scrollY - innerHeight * .5;
    var p = Math.max(0, Math.min(1, (scrollY - first) / Math.max(1, last - first)));
    fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    var active = -1;
    blocks.forEach(function (b, i) { if (b.getBoundingClientRect().top < innerHeight * .5) active = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i <= active); });
  }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update); update();
})();
