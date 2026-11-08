/* Калькулятор на странице цен и автозаполнение заявки на странице контактов.
   Цены живут только здесь; в адресе передаётся состав проекта, без сумм и текста. */
(function () {
  var FORMATS = {
    landing: { name: 'Лендинг', price: 55000, select: 'Лендинг — одна страница' },
    multi: { name: 'Многостраничный сайт', price: 75000, select: 'Многостраничный сайт' }
  };
  var LEADS = {
    tg: { name: 'Форма + Telegram', price: 12000 },
    crm: { name: 'Система заявок с админкой', price: 25000 }
  };
  var PHOTO_PRICE = 1000, PHOTO_MAX = 200;

  function money(n) { return String(n).replace(/\B(?=(\d{3})+$)/g, ' ') + ' ₽'; }
  function total(s) {
    if (!FORMATS[s.pkg]) return 0;
    return FORMATS[s.pkg].price + (LEADS[s.leads] ? LEADS[s.leads].price : 0) + s.photos * PHOTO_PRICE;
  }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  function initCalculator(root) {
    var state = { pkg: '', leads: '', photos: 0 };
    var q = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

    var bar = document.createElement('div');
    bar.className = 'pc-bar';
    bar.innerHTML = '<div class="pc-bar-info" aria-live="polite"><span class="pc-bar-items"></span><b class="pc-bar-sum"></b></div>' +
      '<a class="btn btn-primary pc-bar-btn" href="#pc-format"></a>';
    document.body.appendChild(bar);
    var items = bar.querySelector('.pc-bar-items'), sum = bar.querySelector('.pc-bar-sum'), go = bar.querySelector('.pc-bar-btn');

    function render() {
      q('[data-pkg]').forEach(function (li) { mark(li, li.getAttribute('data-pkg') === state.pkg); });
      q('[data-leads]').forEach(function (li) { mark(li, li.getAttribute('data-leads') === state.leads); });
      q('[data-preset]').forEach(function (li) {
        var p = li.getAttribute('data-preset').split(',');
        mark(li, p[0] === state.pkg && p[1] === state.leads && !state.photos);
      });
      var count = root.querySelector('.pc-count');
      count.textContent = state.photos;
      count.parentNode.parentNode.classList.toggle('is-on', state.photos > 0);
      root.querySelector('[data-step="-1"]').disabled = state.photos <= 0;
      root.querySelector('[data-step="1"]').disabled = state.photos >= PHOTO_MAX;

      if (!state.pkg) {
        items.textContent = 'Шаг 1';
        sum.textContent = 'Выберите формат сайта';
        go.textContent = 'Выбрать формат';
        go.setAttribute('href', '#pc-format');
        return;
      }
      var names = [FORMATS[state.pkg].name];
      if (state.leads) names.push(LEADS[state.leads].name);
      if (state.photos) names.push('ретушь ' + state.photos + ' фото');
      items.textContent = names.join(' + ');
      sum.textContent = 'от ' + money(total(state));
      go.textContent = 'Обсудить проект';
      var url = 'contacts.html?calc=1&pkg=' + state.pkg;
      if (state.leads) url += '&leads=' + state.leads;
      if (state.photos) url += '&photos=' + state.photos;
      go.setAttribute('href', url);
    }
    function mark(li, on) {
      li.classList.toggle('is-on', on);
      li.querySelector('button').setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    q('[data-pkg] button').forEach(function (b) {
      b.addEventListener('click', function () { state.pkg = b.closest('li').getAttribute('data-pkg'); render(); });
    });
    q('[data-leads] button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.closest('li').getAttribute('data-leads');
        state.leads = state.leads === v ? '' : v;
        render();
      });
    });
    q('[data-preset] button').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.closest('li').getAttribute('data-preset').split(',');
        state.pkg = p[0]; state.leads = p[1]; state.photos = 0;
        render();
      });
    });
    q('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.photos = Math.min(PHOTO_MAX, Math.max(0, state.photos + Number(b.getAttribute('data-step'))));
        render();
      });
    });
    go.addEventListener('click', function (e) {
      if (state.pkg) return;
      e.preventDefault();
      var f = document.getElementById('pc-format');
      f.scrollIntoView({ block: 'center' });
      f.classList.remove('pc-nudge'); void f.offsetWidth; f.classList.add('pc-nudge');
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { bar.classList.toggle('is-visible', e[0].isIntersecting); }).observe(root);
    } else bar.classList.add('is-visible');
    render();
  }

  function prefillForm(form) {
    var p = new URLSearchParams(location.search);
    if (p.get('calc') !== '1') return;
    var pkg = p.get('pkg') || '', leads = p.get('leads') || '', photos = parseInt(p.get('photos'), 10) || 0;
    if (!has(FORMATS, pkg)) return;
    if (!has(LEADS, leads)) leads = '';
    photos = Math.min(PHOTO_MAX, Math.max(0, photos));

    var s = { pkg: pkg, leads: leads, photos: photos };
    var lines = ['Собрано в калькуляторе:', '— ' + FORMATS[pkg].name + ': от ' + money(FORMATS[pkg].price)];
    if (leads) lines.push('— ' + LEADS[leads].name + ': +' + money(LEADS[leads].price));
    if (photos) lines.push('— Ретушь фото, ' + photos + ' шт.: +' + money(photos * PHOTO_PRICE));
    lines.push('Итого: от ' + money(total(s)) + ', точная сумма после брифа');

    var select = form.querySelector('#f-pkg'), msg = form.querySelector('#f-msg'), sub = form.querySelector('.c-form-sub');
    if (select) select.value = FORMATS[pkg].select;
    if (msg) { msg.value = lines.join('\n').replace(/ /g, ' '); msg.rows = lines.length + 1; }
    if (sub) sub.textContent = 'Состав и сумма уже подставлены. Оставьте контакт, при желании поправьте текст и отправьте.';
    form.style.scrollMarginTop = '96px';
    form.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (window.matchMedia('(hover: hover)').matches) {
      var name = form.querySelector('#f-name');
      if (name) name.focus({ preventScroll: true });
    }
  }

  function start() {
    var root = document.getElementById('price-list');
    if (root && root.querySelector('[data-pkg]')) initCalculator(root);
    var form = document.getElementById('leadForm');
    if (form) prefillForm(form);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
