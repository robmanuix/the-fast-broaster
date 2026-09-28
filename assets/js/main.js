/* ==========================================================================
   The Fast Broaster - JavaScript principal
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Header: sombra al hacer scroll ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menú móvil ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- 3. Enlace activo según la sección visible ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    var pos = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s; });
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---------- 4. Carrusel del hero ---------- */
  (function heroSlider() {
    var hero = document.getElementById('inicio');
    if (!hero) return;

    var slides = hero.querySelectorAll('.hero-slide');
    var copies = hero.querySelectorAll('.hero-copy');
    var dotsBox = document.getElementById('heroDots');
    var bar = document.getElementById('heroProgress');
    var DELAY = 7000;
    var i = 0, timer = null;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Puntos de navegación */
    for (var n = 0; n < slides.length; n++) {
      (function (n) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = n === 0 ? 'on' : '';
        dot.setAttribute('aria-label', 'Ver imagen ' + (n + 1));
        dot.addEventListener('click', function () { go(n); restart(); });
        dotsBox.appendChild(dot);
      })(n);
    }
    var dots = dotsBox.querySelectorAll('button');

    function go(next) {
      i = (next + slides.length) % slides.length;
      for (var n = 0; n < slides.length; n++) {
        slides[n].classList.toggle('is-active', n === i);
        copies[n].classList.toggle('is-active', n === i);
        dots[n].classList.toggle('on', n === i);
      }
    }

    function restart() {
      clearInterval(timer);
      if (bar) {
        bar.classList.remove('run');
        void bar.offsetWidth;          /* reinicia la animación de la barra */
        if (!reduced) bar.classList.add('run');
      }
      if (!reduced) timer = setInterval(function () { go(i + 1); if (bar) { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); } }, DELAY);
    }

    document.getElementById('heroPrev').addEventListener('click', function () { go(i - 1); restart(); });
    document.getElementById('heroNext').addEventListener('click', function () { go(i + 1); restart(); });

    /* Pausa al pasar el cursor */
    hero.addEventListener('mouseenter', function () {
      clearInterval(timer);
      if (bar) bar.style.animationPlayState = 'paused';
    });
    hero.addEventListener('mouseleave', function () {
      if (bar) bar.style.animationPlayState = '';
      restart();
    });

    /* Pausa si la pestaña no está visible */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(timer); } else { restart(); }
    });

    /* Swipe en móvil */
    var sx = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { go(dx < 0 ? i + 1 : i - 1); restart(); }
      sx = null;
    }, { passive: true });

    hero.style.setProperty('--hero-delay', DELAY + 'ms');
    restart();
  })();

  /* ---------- 5. Datos de los combos ---------- */
  var combos = [
    {
      tag: 'Combo 1',
      name: 'Combo<br>Tiras<br>Crispy',
      price: '5.90 €',
      img: 'assets/img/combo-1.jpg',
      alt: 'Combo de tiras crispy con papas fritas y salsas',
      desc: 'Deliciosas tiras de pechuga de pollo con nuestro empanizado extra crujiente. Acompañadas de papas fritas doradas y dos salsas de la casa a tu elección.'
    },
    {
      tag: 'Combo 2',
      name: 'Combo<br>Broaster<br>Familiar',
      price: '18.50 €',
      img: 'assets/img/about-2.jpg',
      alt: 'Plato familiar de pollo broaster con papas',
      desc: 'Ocho presas de pollo broaster jugoso, papas fritas grandes, ensalada fresca y cuatro bebidas. El plan perfecto para compartir en casa.'
    },
    {
      tag: 'Combo 3',
      name: 'Combo<br>Nuggets<br>Dippers',
      price: '4.50 €',
      img: 'assets/img/about-3.jpg',
      alt: 'Nuggets de pollo crujientes con salsa',
      desc: 'Bocados de pollo súper crujientes ideales para mojar. Vienen con papas, bebida y nuestra salsa ranch preparada al momento.'
    },
    {
      tag: 'Combo 4',
      name: 'Combo<br>Personal<br>Crunch',
      price: '7.20 €',
      img: 'assets/img/about-1.jpg',
      alt: 'Combo personal de pollo crujiente con papas',
      desc: 'Tres presas de pollo al instante, papas fritas, pan de ajo y bebida. Tu almuerzo rápido sin renunciar al sabor.'
    }
  ];

  var slider = document.getElementById('comboSlider');
  var dotsBox = document.getElementById('comboDots');
  var track = document.createElement('div');
  track.className = 'combo-track';
  slider.appendChild(track);
  var index = 0;

  combos.forEach(function (c, i) {
    var slide = document.createElement('article');
    slide.className = 'combo-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML =
      '<div class="combo-info">' +
        '<span class="tag">' + c.tag + '</span>' +
        '<h3>' + c.name + '</h3>' +
        '<p class="combo-price">' + c.price + '</p>' +
      '</div>' +
      '<figure class="combo-photo"><img src="' + c.img + '" alt="' + c.alt + '" loading="lazy"></figure>' +
      '<div class="combo-desc">' +
        '<p>' + c.desc + '</p>' +
        '<a href="#contacto" class="btn btn-red">Pedir este combo</a>' +
      '</div>';
    track.appendChild(slide);

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = i === 0 ? 'on' : '';
    dot.setAttribute('aria-label', 'Ver ' + c.tag);
    dot.addEventListener('click', function () { show(i); });
    dotsBox.appendChild(dot);
  });

  var slides = track.querySelectorAll('.combo-slide');
  var dots = dotsBox.querySelectorAll('button');

  function show(i) {
    index = (i + combos.length) % combos.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    slides.forEach(function (s, n) { s.classList.toggle('active', n === index); });
    dots.forEach(function (d, n) { d.classList.toggle('on', n === index); });
  }

  document.getElementById('prevCombo').addEventListener('click', function () { show(index - 1); });
  document.getElementById('nextCombo').addEventListener('click', function () { show(index + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  /* Deslizar con el dedo en móvil */
  var startX = null;
  slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  }, { passive: true });

  /* ---------- 6. Parallax de las ilustraciones ---------- */
  (function parallaxDeco() {
    var section = document.getElementById('combos');
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var items = section.querySelectorAll('.deco');
    if (!items.length) return;
    var ticking = false;

    function update() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) { ticking = false; return; }

      /* progreso de 0 (entrando) a 1 (saliendo) */
      var p = (vh - rect.top) / (vh + rect.height);
      p = Math.max(0, Math.min(1, p));

      /* recorrido total disponible: alto de la sección + alto del viewport */
      var span = rect.height + vh;

      for (var i = 0; i < items.length; i++) {
        var speed = parseFloat(items[i].getAttribute('data-speed')) || 0.2;
        var dir = speed < 0 ? -1 : 1;
        var shift = (p - 0.5) * span * speed;          /* desplazamiento vertical */
        var drift = (p - 0.5) * 46 * dir;              /* ligero vaivén horizontal */
        var spin = (p - 0.5) * 34 * dir;               /* giro */
        var scale = 1 + Math.abs(p - 0.5) * 0.12;      /* respira al alejarse del centro */
        items[i].style.transform =
          'translate3d(' + drift.toFixed(1) + 'px,' + shift.toFixed(1) + 'px,0) ' +
          'rotate(' + spin.toFixed(1) + 'deg) scale(' + scale.toFixed(3) + ')';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- 7. Animaciones al entrar en pantalla ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 8. Footer fijo al fondo (el contenido pasa por encima) ---------- */
  (function stickyFooter() {
    var footer = document.querySelector('.site-footer');
    var page = document.querySelector('.page');
    if (!footer || !page) return;

    function apply() {
      document.body.classList.remove('footer-fixed');
      document.documentElement.style.removeProperty('--footer-h');

      var h = footer.offsetHeight;
      /* solo si el footer cabe holgadamente en pantalla */
      if (h < window.innerHeight * 0.75) {
        document.documentElement.style.setProperty('--footer-h', h + 'px');
        document.body.classList.add('footer-fixed');
      }
    }

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
  })();

  /* ---------- 9. Año actual en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
