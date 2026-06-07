/* ============================================================
   AVANZATO — shared behaviour (Liquid Glass build)
   ============================================================ */
(function () {
  'use strict';

  /* ── Telegram Bot ─────────────────────────────────────────
     Вставь свои значения перед публикацией:
     TG_TOKEN — токен бота от @BotFather
     TG_CHAT  — твой chat_id (узнать через @userinfobot)
  ─────────────────────────────────────────────────────────── */
  var TG_TOKEN = '8503433014:AAHSVknQgkq7yR8ZM5NoN4Wf9B0OTS0uYqY';
  var TG_CHAT  = '595711';
  /* ────────────────────────────────────────────────────────── */

  var PAGES = [
    { id: 'home',     label: 'Главная',  href: 'index.html' },
    { id: 'pricing',  label: 'Цены',     href: 'pricing.html' },
    { id: 'contacts', label: 'Контакты', href: 'contacts.html' }
  ];
  var current = document.body.getAttribute('data-page') || 'home';

  var PORTFOLIO = [
    { href:'https://velaatrips.com',     title:'Velaa Trips',      desc:'туристическое агентство', size:'tall',
      src:'https://i.wfolio.ru/x/lXTL47Bxbdssl6M0l438gwfsRu0n-L2O/4IHWP6hz8oYlwwMqeiEvXDQW4opBV45E/tEz0XtzRpiAZcSbGA1Z9N51wfS3ixLBN/oKP1bEK7mRl6ZeOYbTYF3-509KJWHpgc/5XA-R3ptFbJGYY8WlHQvphi8Hxl9KEmu/EYDWE_OGVuDR3v60kr0YtYs7INstH6We.png' },
    { href:'https://darialukianova.com', title:'Дарья Лукьянова',  desc:'преподаватель из Казани',  size:'',
      src:'https://i.wfolio.ru/x/5r-vL37XfWIZzOz1-h8uW-kY1GWQLfMW/j8zKohu0GYi6Of2-q2Y2sr1NUx1W78Q0/9A2t_t85Qb9M5U4GSY21PB0hJnc4eXiF/mkksxtxuGYbgVPG5wPQX5hRy5mv-8Z_j/B8nzOdTDBVvGlgqjQGvGE1ACf1p1ICoR/fNj0veEE7HAu35MB9Vl3y1mQMpjRq0Hj.png' },
    { href:'https://crisavis.ru',        title:'Crisavis',         desc:'фотограф из Испании',     size:'',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/BNWL1PFjI2B_pF_Xqq-Ohmjc29dKFonr/bVBkTR9F-0L8cVUyqYPu2uCIghfgHzPx/cRdXVYfMyf189M4aNGWwng.png' },
    { href:'https://portanobile.com',    title:'Porta Nobile',     desc:'люксовая фурнитура',      size:'tall',
      src:'https://i.wfolio.ru/x/D7KuMwGO6ZJnvKA0F1dwJp5uSVA-rZqe/SpT1sdsTYByNdOFW2ulOEwPIdZBIDTeF/CpiO-zgmZEMSBhmBQAL423MfuZ8spudM/ndaILxMwcTarj5nHHvsmAng2U-wJoeU5/j36BYXlVLjwyz0c_hM6v3n1ow1LwwG1_/UX6n509YPcIL8ogdQc0u0PRMqxcuX2nu.png' },
    { href:'https://medfitclub.ru',      title:'Medical Fitness',  desc:'центр реабилитации',      size:'',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/bRL2GL1rwUSi8wAkvDr45cVup18TXz3t/3M8CG6q0Jghep-4HDUXmpGBtJhrCPA4a/SWqOO2l6zohPLH4NDKunEg.png' },
    { href:'https://alga-tour.com',      title:'ALGA',             desc:'туристическое агентство', size:'',
      src:'https://i.wfolio.ru/x/nSMVNbIkpj73jijrmuEgqe-OtrGkDdVw/ksqqOw-68Y_04lrUcq-dUDIvosZl09Np/4l0rOaVfphEg2Z4oi2v7oR9KfKVYnmX7/e97SN9ounT4GQKu4xzMoO_x26ZYQQRxx/I34FSDXkpPaNo0ZuZBQKIQ7Nk2NRnBSy/htkIY0fLUH4ckbvGcf9tPw5eiJTXz5T_.png' },
    { href:'https://maldives-elite.ru',  title:'Maldives Elite',   desc:'туристическое агентство', size:'tall',
      src:'https://i.wfolio.ru/x/D48ScH1DA6jxU_uSH-Or-C0cJClpP-QP/lEAL128xEMPGM2o_rKw_kMPHKR9vAJ80/P4QgaGJvLpYV86gxnT7KQ14RlcGNBAU-/QJwc8gsax6C_VVgQiVb0G7QdwKtddgpn/i5VTe7Q4cuSMY3azx5sRog.png' },
    { href:'https://yanapro.ru',         title:'Яна Самойлова',    desc:'фитнес-тренер',           size:'',
      src:'https://i.wfolio.ru/x/IpIDXWsy6fAubMzqJy3peT9C_63INnIW/uPNqZb6-pqtDzBlZ-MRJEQlHRPvoh3IF/7skTmO4p5_xtjZFaAvJwPXbpKTGmEDGn/2PnckuH3i2QBSlL4uB5dBwzgPiY8FSx8/2uFEfFkivs3fpFfgEQgM0GKcKZ_ccFRQ/4UA5Qlv2Wuo91JcekPwnXZoD10he_811.jpeg' }
  ];
  window.AVW_PORTFOLIO = PORTFOLIO;

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
    navwrap.innerHTML = '<nav class="nav glass" aria-label="Навигация">' +
      '<a class="brand" href="index.html" translate="no">AVANZATO</a>' + links + '</nav>';
    document.body.appendChild(navwrap);
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
      var base = el.getAttribute('data-base-scale') || '1.18';
      el.style.transform = 'translate3d(0,' + (-delta * speed * 0.18).toFixed(2) + 'px,0) scale(' + base + ')';
    }
  }

  /* ---------- lift ---------- */
  var liftEls = [];
  function applyLift() {
    var vh = window.innerHeight;
    for (var i = 0; i < liftEls.length; i++) {
      var el = liftEls[i], r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var dist = Math.abs(r.top + r.height / 2 - vh / 2) / (vh / 2);
      var k = Math.max(0, 1 - dist);
      el.style.transform = 'scale(' + (1 + 0.02 * k).toFixed(4) + ')';
      el.style.boxShadow = '0 ' + (8 + 26 * k).toFixed(1) + 'px ' + (32 + 30 * k).toFixed(0) +
        'px rgba(0,0,0,' + (0.08 + 0.09 * k).toFixed(3) + '), var(--glass-inner)';
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollProgress(); applyParallax(); applyLift(); ticking = false; });
  }

  /* ---------- reveal ---------- */
  function setupReveal() {
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
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
        var el = en.target, to = parseFloat(el.getAttribute('data-count')), dur = 1300, start = null;
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

  /* ---------- shimmer ---------- */
  function setupShimmer() {
    document.querySelectorAll('[data-shimmer]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
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

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Валидация */
      var ok = true;
      ['#f-name', '#f-contact'].forEach(function (sel) {
        var f = form.querySelector(sel);
        if (!f || !f.value.trim()) {
          if (f) { f.style.borderColor = '#e0584e'; f.style.boxShadow = '0 0 0 4px rgba(224,88,78,0.12)'; }
          ok = false;
        } else {
          f.style.borderColor = ''; f.style.boxShadow = '';
        }
      });
      if (!ok) return;

      /* Loading state */
      var btn = form.querySelector('.c-submit');
      var lbl = btn && btn.querySelector('.lbl');
      if (lbl) lbl.textContent = 'Отправляю…';
      if (btn) btn.disabled = true;

      /* Сборка данных */
      var get = function (id) { var el = form.querySelector(id); return el ? el.value.trim() || '—' : '—'; };
      var text =
        '🌐 *Новая заявка — AVANZATO Веб*\n\n' +
        '👤 *Имя:* '          + get('#f-name')    + '\n' +
        '📱 *Контакт:* '       + get('#f-contact') + '\n' +
        '📋 *Формат сайта:* '  + get('#f-pkg')     + '\n' +
        '🔗 *Домен:* '         + get('#f-domain')  + '\n' +
        '💬 *Сообщение:* '     + get('#f-msg')     + '\n\n' +
        '🕐 ' + new Date().toLocaleString('ru-RU');

      /* Отправка в Telegram */
      fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text: text, parse_mode: 'Markdown' })
      }).then(function (r) {
        if (r.ok) {
          form.classList.add('sent');
        } else {
          if (lbl) lbl.textContent = 'Ошибка — напишите в Telegram';
          if (btn) btn.disabled = false;
        }
      }).catch(function () {
        if (lbl) lbl.textContent = 'Ошибка — напишите в Telegram';
        if (btn) btn.disabled = false;
      });
    });
  }

  /* ============================================================
     TWEAKS
  ============================================================ */
  var TK_KEY = 'avw_glass_tweaks_v2';
  var tk = { blur: 20, alpha: 40, sat: 180, mood: 'airy' };
  try { Object.assign(tk, JSON.parse(localStorage.getItem(TK_KEY) || '{}')); } catch (e) {}

  function applyTweaks() {
    var s = document.documentElement.style;
    s.setProperty('--glass-blur', tk.blur + 'px');
    s.setProperty('--glass-alpha', (tk.alpha / 100).toFixed(2));
    s.setProperty('--glass-sat', tk.sat + '%');
    document.body.setAttribute('data-mood', tk.mood);
  }
  function saveTweaks() { try { localStorage.setItem(TK_KEY, JSON.stringify(tk)); } catch (e) {} }

  var panelBuilt = false;
  function buildTweaks() {
    if (panelBuilt) return document.getElementById('tweaks');
    panelBuilt = true;
    var el = document.createElement('div');
    el.id = 'tweaks';
    el.innerHTML =
      '<div class="tk-card glass">' +
        '<div class="tk-hd"><b>Стекло · Tweaks</b><button class="tk-x" title="Закрыть">✕</button></div>' +
        '<div class="tk-row"><div class="tk-lbl"><span>Размытие</span><span class="v" id="tkBlurV"></span></div><input type="range" id="tkBlur" min="4" max="40" step="1"></div>' +
        '<div class="tk-row"><div class="tk-lbl"><span>Прозрачность</span><span class="v" id="tkAlphaV"></span></div><input type="range" id="tkAlpha" min="15" max="75" step="1"></div>' +
        '<div class="tk-row"><div class="tk-lbl"><span>Насыщенность</span><span class="v" id="tkSatV"></span></div><input type="range" id="tkSat" min="100" max="220" step="5"></div>' +
        '<div class="tk-row"><div class="tk-lbl"><span>Атмосфера</span></div><div class="tk-seg" id="tkMood">' +
          '<button data-m="airy">Светлая</button><button data-m="frost">Морозная</button><button data-m="warm">Тёплая</button></div></div>' +
        '<div class="tk-note">Настройки живого стекла сохраняются на всех страницах.</div>' +
      '</div>';
    document.body.appendChild(el);
    var blur = el.querySelector('#tkBlur'), alpha = el.querySelector('#tkAlpha'), sat = el.querySelector('#tkSat');
    function sync() {
      blur.value = tk.blur; alpha.value = tk.alpha; sat.value = tk.sat;
      el.querySelector('#tkBlurV').textContent = tk.blur + 'px';
      el.querySelector('#tkAlphaV').textContent = tk.alpha + '%';
      el.querySelector('#tkSatV').textContent = tk.sat + '%';
      el.querySelectorAll('#tkMood button').forEach(function (b) { b.classList.toggle('sel', b.getAttribute('data-m') === tk.mood); });
    }
    blur.addEventListener('input', function () { tk.blur = +blur.value; applyTweaks(); saveTweaks(); sync(); });
    alpha.addEventListener('input', function () { tk.alpha = +alpha.value; applyTweaks(); saveTweaks(); sync(); });
    sat.addEventListener('input', function () { tk.sat = +sat.value; applyTweaks(); saveTweaks(); sync(); });
    el.querySelectorAll('#tkMood button').forEach(function (b) {
      b.addEventListener('click', function () { tk.mood = b.getAttribute('data-m'); applyTweaks(); saveTweaks(); sync(); });
    });
    el.querySelector('.tk-x').addEventListener('click', function () { window.parent.postMessage({ type: '__deactivate_edit_mode' }, '*'); el.classList.remove('on'); });
    sync();
    return el;
  }
  function setTweaksVisible(on) { (document.getElementById('tweaks') || buildTweaks()).classList.toggle('on', !!on); }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === '__activate_edit_mode') setTweaksVisible(true);
    else if (d.type === '__deactivate_edit_mode') setTweaksVisible(false);
  });

  /* ---------- portfolio render ---------- */
  function renderPortfolio() {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = PORTFOLIO.map(function (p, i) {
      return '<a class="m-item ' + (p.size || '') + ' reveal lift" data-shimmer data-d="' + (i % 3) + '" ' +
        'href="' + p.href + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + p.src + '" alt="Сайт ' + p.title + ' — разработка сайтов в Казани, Антон Аванзато" loading="lazy" decoding="async">' +
        '<span class="m-arr glass"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span class="m-cap"><b>' + p.title + '</b><i>' + p.desc + '</i></span></a>';
    }).join('');
  }

  /* ---------- init ---------- */
  function init() {
    applyTweaks();
    renderPortfolio();
    parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
    liftEls = [].slice.call(document.querySelectorAll('.lift'));
    setupReveal(); setupCounters(); setupShimmer(); setupAccordion(); setupForm();
    onScrollProgress(); applyParallax(); applyLift();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
      liftEls = [].slice.call(document.querySelectorAll('.lift'));
      onScroll();
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
