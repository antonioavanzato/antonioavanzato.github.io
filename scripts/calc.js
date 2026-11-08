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
    var photos = 0;
    var count = root.querySelector('.pc-count'), lines = root.querySelector('.pc-lines');
    var sum = root.querySelector('.pc-total b'), go = root.querySelector('.pc-go');
    var reset = root.querySelector('.pc-reset');
    var minus = root.querySelector('[data-step="-1"]'), plus = root.querySelector('[data-step="1"]');

    function picked(name) { return root.querySelector('input[name="' + name + '"]:checked').value; }
    function line(name, price) {
      var li = document.createElement('li'), a = document.createElement('span'), b = document.createElement('b');
      a.textContent = name; b.textContent = price;
      li.appendChild(a); li.appendChild(b); lines.appendChild(li);
    }
    function render() {
      var s = { pkg: picked('pkg'), leads: picked('leads'), photos: photos };
      lines.textContent = '';
      line(FORMATS[s.pkg].name, 'от\u00a0' + money(FORMATS[s.pkg].price));
      if (s.leads) line(LEADS[s.leads].name, '+' + money(LEADS[s.leads].price));
      if (s.photos) line('Ретушь, ' + s.photos + ' фото', '+' + money(s.photos * PHOTO_PRICE));
      sum.textContent = 'от\u00a0' + money(total(s));
      count.textContent = photos;
      minus.disabled = photos <= 0;
      plus.disabled = photos >= PHOTO_MAX;
      reset.hidden = photos === 0;
      var url = 'contacts.html?calc=1&pkg=' + s.pkg;
      if (s.leads) url += '&leads=' + s.leads;
      if (s.photos) url += '&photos=' + s.photos;
      go.setAttribute('href', url);
    }
    root.addEventListener('change', render);
    reset.addEventListener('click', function () { photos = 0; render(); plus.focus(); });
    [minus, plus].forEach(function (b) {
      b.addEventListener('click', function () {
        photos = Math.min(PHOTO_MAX, Math.max(0, photos + Number(b.getAttribute('data-step'))));
        render();
      });
    });
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
    // на телефоне форма ниже первого экрана; браузер может сбросить прокрутку при загрузке
    function toForm() { form.scrollIntoView({ block: 'start', behavior: 'instant' }); }
    toForm();
    window.addEventListener('load', function () { setTimeout(toForm, 60); }, { once: true });
    if (window.matchMedia('(hover: hover)').matches) {
      var name = form.querySelector('#f-name');
      if (name) name.focus({ preventScroll: true });
    }
  }

  function start() {
    var root = document.getElementById('pc-calc');
    if (root) initCalculator(root);
    var form = document.getElementById('leadForm');
    if (form) prefillForm(form);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
