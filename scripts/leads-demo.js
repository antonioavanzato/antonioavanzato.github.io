/* Демо системы заявок: всё происходит в браузере, данные никуда не отправляются. */
(function () {
  'use strict';
  var form = document.getElementById('lsForm');
  if (!form) return;

  var STATUSES = ['Новая', 'В работе', 'Съёмка назначена', 'Оплачено'];
  var tg = document.getElementById('lsTg');
  var rows = document.getElementById('lsRows');
  var nameEl = document.getElementById('ls-name');
  var phoneEl = document.getElementById('ls-phone');
  var submit = form.querySelector('.ls-submit');

  // Чипы: один активный в группе
  [].forEach.call(form.querySelectorAll('.ls-chips'), function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.ls-chip');
      if (!chip) return;
      [].forEach.call(group.children, function (c) {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
    });
  });
  function picked(name) {
    var c = form.querySelector('[data-group="' + name + '"] .active');
    return c ? c.textContent : '—';
  }

  // Маска телефона, как в боевой форме
  phoneEl.addEventListener('input', function () {
    var v = phoneEl.value.replace(/\D/g, '');
    if (v.length === 11 && /^[78]/.test(v)) v = v.slice(1);
    v = v.slice(0, 10);
    var f = '';
    if (v.length) f = '+7 ' + v.slice(0, 3);
    if (v.length > 3) f += ' ' + v.slice(3, 6);
    if (v.length > 6) f += ' ' + v.slice(6, 8);
    if (v.length > 8) f += ' ' + v.slice(8, 10);
    phoneEl.value = f;
    phoneEl.classList.remove('invalid');
  });
  nameEl.addEventListener('input', function () { nameEl.classList.remove('invalid'); });

  // Смена статуса по клику
  rows.addEventListener('click', function (e) {
    var b = e.target.closest('.ls-status');
    if (!b) return;
    var s = (parseInt(b.getAttribute('data-s'), 10) + 1) % STATUSES.length;
    b.setAttribute('data-s', s);
    b.textContent = STATUSES[s];
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function maskPhone(p) {
    var d = p.replace(/\D/g, '');
    return '+7 ' + d.slice(1, 4) + ' ··· ·· ' + d.slice(-2);
  }
  function now() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameEl.value.trim();
    var digits = phoneEl.value.replace(/\D/g, '');
    if (name.length < 2) { nameEl.classList.add('invalid'); nameEl.focus(); return; }
    if (digits.length !== 11) { phoneEl.classList.add('invalid'); phoneEl.focus(); return; }

    var svc = picked('svc'), city = picked('city');
    submit.disabled = true;

    // 1. Уведомление в Telegram — без имени и телефона
    setTimeout(function () {
      var empty = tg.querySelector('.ls-empty');
      if (empty) empty.remove();
      var msg = el('div', 'ls-msg');
      msg.appendChild(el('b', null, '🔔 Новая заявка'));
      msg.appendChild(document.createTextNode(svc + ' · ' + city + ' '));
      var link = el('a', null, 'Открыть в админке →');
      link.href = '#lsRows';
      msg.appendChild(link);
      msg.appendChild(el('time', null, now()));
      tg.appendChild(msg);
      while (tg.children.length > 2) tg.removeChild(tg.firstChild);
    }, 450);

    // 2. Строка в админке — с контактами, данные только в РФ
    setTimeout(function () {
      var row = el('div', 'ls-row new');
      row.setAttribute('role', 'row');
      var who = el('span'); who.setAttribute('role', 'cell');
      who.appendChild(el('b', null, name));
      who.appendChild(el('i', null, maskPhone(digits)));
      var what = el('span', null, svc + ' · ' + city); what.setAttribute('role', 'cell');
      var st = el('span'); st.setAttribute('role', 'cell');
      var btn = el('button', 'ls-status', STATUSES[0]);
      btn.type = 'button'; btn.setAttribute('data-s', '0');
      st.appendChild(btn);
      row.appendChild(who); row.appendChild(what); row.appendChild(st);
      rows.insertBefore(row, rows.firstChild);
      while (rows.children.length > 4) rows.removeChild(rows.lastChild);

      form.reset();
      submit.disabled = false;
    }, 900);
  });
})();
