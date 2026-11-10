/* AVANZATO — страница цен: «Рассчитать …» выбирает формат в калькуляторе. */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('.fm-go[data-pkg]'), function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('#pc-calc input[name="pkg"][value="' + a.getAttribute('data-pkg') + '"]');
      if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  });

  /* телефон: плашка с итогом, пока вопросы на экране, а сам чек нет */
  var calc = document.getElementById('pc-calc'), sum = calc && calc.querySelector('.pc-sum'), steps = calc && calc.querySelector('.pc-steps');
  if (calc && sum && steps && 'IntersectionObserver' in window) {
    var mini = document.createElement('div'); mini.className = 'pc-mini';
    mini.innerHTML = '<div><span>Итого</span><b></b></div><a href="#">К расчёту</a>';
    document.body.appendChild(mini);
    var total = calc.querySelector('.pc-total b'), out = mini.querySelector('b');
    var copy = function () { out.textContent = total.textContent; };
    copy(); new MutationObserver(copy).observe(total, { childList: true, characterData: true, subtree: true });
    mini.querySelector('a').addEventListener('click', function (e) { e.preventDefault(); sum.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    var stepsIn = false, sumIn = false;
    var nav = document.querySelector('.navwrap .nav') || document.querySelector('.navwrap');
    var upd = function () {
      var on = stepsIn && !sumIn;
      if (on && nav) { var b = nav.getBoundingClientRect().bottom; if (b > 0) mini.style.top = Math.round(b + 8) + 'px'; }
      mini.classList.toggle('on', on);
    };
    new IntersectionObserver(function (en) { stepsIn = en[0].isIntersecting; upd(); }, { rootMargin: '-30% 0px -30% 0px' }).observe(steps);
    new IntersectionObserver(function (en) { sumIn = en[0].isIntersecting; upd(); }).observe(sum);
  }
})();
