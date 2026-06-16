/* ============================================================
   AVANZATO — shared behaviour (Editorial build)
   ============================================================ */
(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────
     Приём заявок через Google Apps Script (Web App).
     SCRIPT_URL — адрес опубликованного скрипта (.../exec).
     SECRET_KEY — должен совпадать с PHOTO_SECRET_KEY в Script Properties.
  ─────────────────────────────────────────────────────────── */
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwG3MRzQR7NA-J4oMZgpyqQ6LQ8tiPJkER_JSH-q-OV_N6zBPabop8bbnPg1S4hVklGoA/exec';
  var SECRET_KEY = '222897Avanzato!';
  /* ────────────────────────────────────────────────────────── */

  var PAGES = [
    { id: 'home',     label: 'Главная',  href: 'index.html' },
    { id: 'pricing',  label: 'Цены',     href: 'pricing.html' },
    { id: 'contacts', label: 'Контакты', href: 'contacts.html' }
  ];
  var current = document.body.getAttribute('data-page') || 'home';

  var PORTFOLIO = [
    { href:'https://velaatrips.com',     title:'Velaa Trips',      desc:'туристическое агентство на Мальдивах', size:'tall',
      src:'https://i.wfolio.ru/x/lXTL47Bxbdssl6M0l438gwfsRu0n-L2O/4IHWP6hz8oYlwwMqeiEvXDQW4opBV45E/tEz0XtzRpiAZcSbGA1Z9N51wfS3ixLBN/oKP1bEK7mRl6ZeOYbTYF3-509KJWHpgc/5XA-R3ptFbJGYY8WlHQvphi8Hxl9KEmu/EYDWE_OGVuDR3v60kr0YtYs7INstH6We.png' },
    { href:'https://darialukianova.com', title:'Дарья Лукьянова',  desc:'преподаватель из Казани',  size:'',
      src:'https://i.wfolio.ru/x/5r-vL37XfWIZzOz1-h8uW-kY1GWQLfMW/j8zKohu0GYi6Of2-q2Y2sr1NUx1W78Q0/9A2t_t85Qb9M5U4GSY21PB0hJnc4eXiF/mkksxtxuGYbgVPG5wPQX5hRy5mv-8Z_j/B8nzOdTDBVvGlgqjQGvGE1ACf1p1ICoR/fNj0veEE7HAu35MB9Vl3y1mQMpjRq0Hj.png' },
    { href:'https://crisavis.ru',        title:'Crisavis',         desc:'фотограф из Испании',     size:'',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/BNWL1PFjI2B_pF_Xqq-Ohmjc29dKFonr/bVBkTR9F-0L8cVUyqYPu2uCIghfgHzPx/cRdXVYfMyf189M4aNGWwng.png' },
    { href:'https://portanobile.com',    title:'Porta Nobile',     desc:'люксовая фурнитура в Москве',      size:'tall',
      src:'https://i.wfolio.ru/x/D7KuMwGO6ZJnvKA0F1dwJp5uSVA-rZqe/SpT1sdsTYByNdOFW2ulOEwPIdZBIDTeF/CpiO-zgmZEMSBhmBQAL423MfuZ8spudM/ndaILxMwcTarj5nHHvsmAng2U-wJoeU5/j36BYXlVLjwyz0c_hM6v3n1ow1LwwG1_/UX6n509YPcIL8ogdQc0u0PRMqxcuX2nu.png' },
    { href:'https://medfitclub.ru',      title:'Medical Fitness',  desc:'центр реабилитации в Москве',      size:'',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/bRL2GL1rwUSi8wAkvDr45cVup18TXz3t/3M8CG6q0Jghep-4HDUXmpGBtJhrCPA4a/SWqOO2l6zohPLH4NDKunEg.png' },
    { href:'https://alga-tour.com',      title:'ALGA',             desc:'туристическое агентство на Мальдивах', size:'',
      src:'https://i.wfolio.ru/x/nSMVNbIkpj73jijrmuEgqe-OtrGkDdVw/ksqqOw-68Y_04lrUcq-dUDIvosZl09Np/4l0rOaVfphEg2Z4oi2v7oR9KfKVYnmX7/e97SN9ounT4GQKu4xzMoO_x26ZYQQRxx/I34FSDXkpPaNo0ZuZBQKIQ7Nk2NRnBSy/htkIY0fLUH4ckbvGcf9tPw5eiJTXz5T_.png' },
    { href:'https://maldives-elite.ru',  title:'Maldives Elite',   desc:'туристическое агентство на Мальдивах', size:'tall',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/P4QgaGJvLpYV86gxnT7KQ14RlcGNBAU-/QJwc8gsax6C_VVgQiVb0G7QdwKtddgpn/i5VTe7Q4cuSMY3azx5sRog.png' },
    { href:'https://yanapro.ru',         title:'Яна Самойлова',    desc:'фитнес-тренер в Казани',           size:'',
      src:'https://i.wfolio.ru/x/IpIDXWsy6fAubMzqJy3peT9C_63INnIW/uPNqZb6-pqtDzBlZ-MRJEQlHRPvoh3IF/7skTmO4p5_xtjZFaAvJwPXbpKTGmEDGn/2PnckuH3i2QBSlL4uB5dBwzgPiY8FSx8/2uFEfFkivs3fpFfgEQgM0GKcKZ_ccFRQ/4UA5Qlv2Wuo91JcekPwnXZoD10he_811.jpeg' }
  ];
  window.AVW_PORTFOLIO = PORTFOLIO;

  /* ---------- scramble hover ---------- */
  var GLYPHS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ#%&*<>_/—=+';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scramble(el) {
    if (reduceMotion) return;
    var final = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', final);
    if (el._raf) cancelAnimationFrame(el._raf);
    var len = final.length, start = performance.now(), dur = 460;
    var locks = [];
    for (var i = 0; i < len; i++) locks.push(0.18 + Math.random() * 0.55);
    function tick(now) {
      var p = Math.min(1, (now - start) / dur), out = '';
      for (var i = 0; i < len; i++) {
        var ch = final.charAt(i);
        if (ch === ' ') { out += ' '; }
        else if (p >= locks[i]) { out += ch; }
        else { out += GLYPHS.charAt((Math.random() * GLYPHS.length) | 0); }
      }
      el.textContent = out;
      if (p < 1) { el._raf = requestAnimationFrame(tick); }
      else { el.textContent = final; el._raf = null; }
    }
    el._raf = requestAnimationFrame(tick);
  }
  function setupScramble(root) {
    root.querySelectorAll('.nav .link').forEach(function (el) {
      el.setAttribute('data-text', el.textContent);
      el.addEventListener('mouseenter', function () {
        /* фиксируем ширину, чтобы перебор символов не двигал ссылку
           и по ней можно было кликнуть сразу, не дожидаясь анимации */
        if (!el.style.minWidth) {
          el.style.display = 'inline-block';
          el.style.textAlign = 'center';
          el.style.minWidth = el.offsetWidth + 'px';
        }
        scramble(el);
      });
    });
  }

  /* ---------- chrome ---------- */
  function buildChrome() {
    var bar = document.createElement('div');
    bar.className = 'scrollbar';
    document.body.appendChild(bar);
    var navwrap = document.createElement('div');
    navwrap.className = 'navwrap';
    var links = PAGES.map(function (p) {
      return '<a class="link' + (p.id === current ? ' active' : '') + '" href="' + p.href + '">' + p.label + '</a>';
    }).join('');
    var mlinks = PAGES.map(function (p, i) {
      return '<a class="mlink' + (p.id === current ? ' active' : '') + '" style="--i:' + i + '" href="' + p.href + '">' + p.label + '</a>';
    }).join('');
    navwrap.innerHTML = '<nav class="nav" aria-label="Навигация">' +
      '<a class="brand" href="index.html" aria-label="AVANZATO — на главную">' +
      '<img src="images/logo avanzato (white).png" alt="AVANZATO" translate="no"></a>' +
      '<div class="nav-links">' + links + '</div>' +
      '<button class="burger" aria-label="Меню" aria-expanded="false" aria-controls="mobnav">' +
      '<span></span><span></span><span></span></button>' +
      '</nav>';
    document.body.appendChild(navwrap);

    /* mobile overlay menu */
    var mob = document.createElement('div');
    mob.className = 'mobnav';
    mob.id = 'mobnav';
    mob.innerHTML = '<div class="mobnav-inner">' + mlinks +
      '<a class="mlink mlink-cta" style="--i:' + PAGES.length + '" href="contacts.html">Обсудить проект →</a></div>';
    document.body.appendChild(mob);

    var burger = navwrap.querySelector('.burger');
    function setNav(open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    mob.addEventListener('click', function (e) { if (e.target.classList.contains('mlink')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 720) setNav(false); });

    setupScramble(navwrap);

    return bar;
  }
  var scrollbar = buildChrome();

  function onScrollProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    scrollbar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
  }

  /* ---------- parallax ---------- */
  var parallaxEls = [];
  function applyParallax() {
    var vh = window.innerHeight;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var host = el.closest('.bg-photo') || el.parentElement;
      var rect = host.getBoundingClientRect();
      var delta = (rect.top + rect.height / 2 - vh / 2);
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
      var base = el.getAttribute('data-base-scale') || '1.12';
      el.style.transform = 'translate3d(0,' + (-delta * speed * 0.12).toFixed(2) + 'px,0) scale(' + base + ')';
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollProgress(); applyParallax(); ticking = false; });
  }

  /* ---------- reveal ---------- */
  function setupReveal() {
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- counters ---------- */
  function setupCounters() {
    var els = [].slice.call(document.querySelectorAll('[data-count]'));
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, to = parseFloat(el.getAttribute('data-count')), dur = 1400, start = null;
        var prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
        function step(ts) {
          if (!start) start = ts;
          var t = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + Math.round(to * e).toLocaleString('ru-RU') + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- accordion ---------- */
  function setupAccordion() {
    document.querySelectorAll('[data-acc]').forEach(function (item) {
      var btn = item.querySelector('.acc-q'), panel = item.querySelector('.acc-a');
      if (!btn || !panel) return;
      btn.addEventListener('click', function () {
        var open = !item.classList.contains('open');
        document.querySelectorAll('[data-acc].open').forEach(function (o) {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.acc-q').setAttribute('aria-expanded', 'false'); o.querySelector('.acc-a').style.maxHeight = '0px'; }
        });
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* ---------- contact form + Telegram ---------- */
  function setupForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    /* Предвыбор формата по ?pkg= (из кнопок тарифов на странице цен) */
    var pkgParam = (location.search.match(/[?&]pkg=([^&]+)/) || [])[1];
    if (pkgParam) {
      var sel = form.querySelector('#f-pkg');
      var map = { landing: 'Лендинг — одна страница', multi: 'Многостраничный сайт' };
      if (sel && map[pkgParam]) sel.value = map[pkgParam];
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      ['#f-name', '#f-contact'].forEach(function (sel) {
        var f = form.querySelector(sel);
        if (!f || !f.value.trim()) {
          if (f) { f.classList.add('invalid'); }
          ok = false;
        } else { f.classList.remove('invalid'); }
      });
      if (!ok) return;

      var btn = form.querySelector('.c-submit');
      var lbl = btn && btn.querySelector('.lbl');
      if (lbl) lbl.textContent = 'Отправляю';
      if (btn) { btn.disabled = true; btn.classList.add('loading'); }

      var get = function (id) { var el = form.querySelector(id); return el ? el.value.trim() : ''; };

      /* Поле «Идея домена» отдельного слота в скрипте не имеет —
         дописываем его в текст сообщения. */
      var msg = get('#f-msg');
      var domain = get('#f-domain');
      if (domain) msg = (msg ? msg + '\n' : '') + 'Домен: ' + domain;

      /* Схема под doPost: key + name/phone/tg/date/city/type/msg.
         Контакт целиком кладём в tg. */
      var payload = {
        key:   SECRET_KEY,
        name:  get('#f-name'),
        phone: '',
        tg:    get('#f-contact'),
        date:  new Date().toLocaleString('ru-RU'),
        city:  'Казань',
        type:  get('#f-pkg') || '—',
        msg:   msg || '—'
      };

      /* mode:no-cors → тело отправляется как text/plain (без CORS-preflight),
         но e.postData.contents в скрипте получит сырую JSON-строку и распарсит её.
         Ответ непрозрачный, поэтому успехом считаем факт доставки запроса. */
      fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(function () {
          form.classList.add('sent');
        })
        .catch(function () {
          if (lbl) lbl.textContent = 'Ошибка — напишите в Telegram';
          if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
        });
    });
  }

  /* ---------- portfolio render ---------- */
  function renderPortfolio() {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = PORTFOLIO.map(function (p, i) {
      var n = (i + 1 < 10 ? '0' : '') + (i + 1);
      return '<a class="m-item ' + (p.size || '') + ' reveal" data-d="' + (i % 3) + '" ' +
        'href="' + p.href + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="m-frame"><img src="' + p.src + '" alt="Сайт ' + p.title + ' — разработка сайтов в Казани, Антон Аванзато" loading="lazy" decoding="async">' +
        '<span class="m-arr"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>' +
        '<span class="m-meta"><span class="m-num">' + n + '</span>' +
        '<span class="m-txt"><b>' + p.title + '</b><i>' + p.desc + '</i></span></span></a>';
    }).join('');
    // re-observe newly injected reveals
    setupReveal();
  }

  /* ---------- init ---------- */
  function init() {
    renderPortfolio();
    parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
    setupReveal(); setupCounters(); setupAccordion(); setupForm();
    onScrollProgress(); applyParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
      onScroll();
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
