/* AVANZATO — контакты: местное время в Казани (UTC+3) в строке статуса. */
(function () {
  'use strict';
  var el = document.querySelector('.ct-clock');
  if (!el) return;
  var fmt;
  try { fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }); } catch (e) { fmt = null; }
  function tick() {
    var d = new Date();
    if (fmt) el.textContent = fmt.format(d);
    else { var k = new Date(d.getTime() + (d.getTimezoneOffset() + 180) * 60000); el.textContent = ('0' + k.getHours()).slice(-2) + ':' + ('0' + k.getMinutes()).slice(-2); }
    el.setAttribute('datetime', d.toISOString());
  }
  tick(); setInterval(tick, 15000);
})();
