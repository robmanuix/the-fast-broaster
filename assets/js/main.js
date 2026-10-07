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

  /* Botón flotante para volver arriba */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var verToTop = function () {
      toTop.classList.toggle('show', window.scrollY > 400);
    };
    window.addEventListener('scroll', verToTop, { passive: true });
    verToTop();
  }

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
  var sections = [];
  links.forEach(function (l) {
    var el = document.querySelector(l.getAttribute('href'));
    if (el && sections.indexOf(el) === -1) sections.push(el);
  });

  /* El footer está fijo al fondo: su offsetTop no sirve para medir,
     así que se activa solo cuando el scroll llega abajo del todo. */
  function esFijo(el) {
    return window.getComputedStyle(el).position === 'fixed';
  }

  function setActive() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = null;

    sections.forEach(function (s) {
      if (esFijo(s)) return;
      var top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= pos) current = s;
    });

    if (!current) {
      current = sections.filter(function (s) { return !esFijo(s); })[0];
    }

    /* Al final de la página manda el footer (Contacto) */
    var doc = document.documentElement;
    var alFinal = window.innerHeight + window.scrollY >= doc.scrollHeight - 80;
    if (alFinal) {
      var contacto = document.getElementById('contacto');
      if (contacto) current = contacto;
    }

    if (!current) return;
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
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

  /* ---------- 5. Datos de la carta ---------- */
  /* Las fotos van en assets/img/menu/. Si aún no existe el archivo,
     la tarjeta muestra un marcador y el sitio no se rompe. */
  var combos = [
    { cat: 'Pollo', name: 'Duo Crunch', price: '6,99 €', plano: true,
      img: 'assets/img/menu/01-duocronch.jpg',
      alt: 'Combo Duo Crunch: dos piezas de pollo crujiente con patatas y bebida',
      desc: '2 piezas de pollo + patatas + bebida.' },

    { cat: 'Pollo', name: 'Triple Crunch', price: '8,99 €',
      img: 'assets/img/menu/02-triplecronch.jpg',
      alt: 'Combo Triple Crunch: tres piezas de pollo crujiente con patatas y bebida',
      desc: '3 piezas de pollo + patatas + bebida.' },

    { cat: 'Pollo', name: 'Mega Crunch', price: '16,95 €',
      img: 'assets/img/menu/03-megacronch.jpg',
      alt: 'Combo Mega Crunch: seis piezas de pollo crujiente con patatas y bebidas',
      desc: '6 piezas de pollo + 2 raciones de patatas + 2 bebidas.' },

    { cat: 'Pollo', name: 'Combo Criminal', price: '23,95 €',
      img: 'assets/img/menu/04-combo-criminal.jpg',
      alt: 'Combo Criminal: nueve piezas de pollo crujiente con patatas y bebida de 2 litros',
      desc: '9 piezas de pollo + 3 patatas + bebida de 2 litros.' },

    { cat: 'Pollo', name: 'Mega Party', price: '30 €',
      img: 'assets/img/menu/05-mega-party.jpg',
      alt: 'Mega Party: doce piezas de pollo crujiente con patatas y bebida grande',
      desc: '12 piezas de pollo + 2 raciones de patatas + 1 bebida grande.' },

    { cat: 'Pollo', name: 'Combo Mini', price: '3,99 €',
      img: 'assets/img/menu/06-combo-mini.jpg',
      alt: 'Combo Mini: una pieza de pollo crujiente con patatas y bebida',
      desc: '1 pieza de pollo + patatas + bebida.' },

    { cat: 'Alitas', name: 'Combo 1 Alitas', price: '3,99 €',
      img: 'assets/img/menu/07-combo1-alitas.jpg',
      alt: 'Combo de tres alitas de pollo crujientes con patatas y bebida',
      desc: '3 alitas + patatas + bebida.' },

    { cat: 'Pollo', name: 'Lowcost', price: '4,99 €',
      img: 'assets/img/menu/08-lowcost.jpg',
      alt: 'Combo Lowcost: pieza de pollo con arroz y papa',
      desc: '1 pieza de pollo + 1 porción de arroz + 1 porción de patatas.' },

    { cat: 'Alitas', name: 'Combo 2 Alitas', price: '6 €',
      img: 'assets/img/menu/09-combo2-alitas.jpg',
      alt: 'Combo de seis alitas de pollo crujientes con patatas y bebida',
      desc: '6 alitas + patatas + bebida.' },

    { cat: 'Alitas', name: 'Combo 3 Alitas', price: '10,99 €',
      img: 'assets/img/menu/10-combo3-alitas.jpg',
      alt: 'Combo de doce alitas de pollo crujientes con patatas y dos bebidas',
      desc: '12 alitas + patatas + 2 bebidas.' },

    { cat: 'Fritadas', name: 'Fritada Mixta',
      prices: [
        { label: '1 persona', value: '10 €' },
        { label: '2 personas', value: '18 €' },
        { label: '3 personas', value: '25 €' }
      ],
      img: 'assets/img/menu/11-fritada-mixta.jpg',
      alt: 'Fritada mixta con cerdo frito, pollo crujiente, ensalada y patacón',
      desc: 'Ensalada, patacón o patatas fritas, pollo crujiente y cerdo frito.' },

    { cat: 'Fritadas', name: 'Fritada o Chicharrón',
      prices: [
        { label: '1 persona', value: '12 €' },
        { label: '2 personas', value: '20 €' }
      ],
      img: 'assets/img/menu/12-fritada-chicharron.jpg',
      alt: 'Fritada de chicharrón con ensalada criolla y patacón',
      desc: 'Ensalada criolla, patacón o patata frita y cerdo frito.' },

    { cat: 'Porciones', name: 'Porción de Arroz', price: '3 €',
      img: 'assets/img/menu/13-porcion-arroz.jpg',
      alt: 'Porción de arroz blanco',
      desc: 'Porción individual de arroz blanco recién hecho.' },

    { cat: 'Porciones', name: 'Porción de Patata Frita', price: '3 €',
      img: 'assets/img/menu/14-porcion-patata.jpg',
      alt: 'Porción de patatas fritas doradas',
      desc: 'Porción individual de patatas fritas doradas y crujientes.' },

    { cat: 'Porciones', name: 'Porción de Ensalada', price: '3 €',
      img: 'assets/img/menu/15-porcion-ensalada.jpg',
      alt: 'Porción de ensalada fresca',
      desc: 'Porción individual de ensalada fresca del día.' },

    { cat: 'Tiras', name: 'Tender Five', price: '7 €',
      img: 'assets/img/menu/16-tender-five.jpg',
      alt: 'Cinco tiras de pechuga de pollo empanizadas',
      desc: '5 tiras de pechuga empanizadas extra crujientes.' },

    { cat: 'Tiras', name: 'Tender XL', price: '12 €',
      img: 'assets/img/menu/17-tender-xl.jpg',
      alt: 'Diez tiras de pechuga de pollo empanizadas',
      desc: '10 tiras de pechuga empanizadas extra crujientes.' }
  ];

  /* Enlace de WhatsApp con el pedido ya escrito */
  var WHATSAPP = '34675732136';

  function waLink(c) {
    var precio = c.price ? ' (' + c.price + ')' : '';
    var texto = 'Hola, quiero pedir: ' + c.name + precio +
                '. ¿Me confirman disponibilidad?';
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  /* ---------- Lista de combos, uno debajo de otro ---------- */
  var list = document.getElementById('comboList');

  combos.forEach(function (c) {
    var row = document.createElement('article');
    /* 'plano' = foto nueva con fondo degradado: no lleva el realce dorado */
    row.className = 'combo-row' + (c.plano ? ' sin-filtro' : '');

    var priceHTML;
    if (c.prices) {
      priceHTML = '<ul class="combo-prices">';
      c.prices.forEach(function (p) {
        priceHTML += '<li><span>' + p.label + '</span><b>' + p.value + '</b></li>';
      });
      priceHTML += '</ul>';
    } else {
      priceHTML = '<p class="combo-price">' + c.price + '</p>';
    }

    row.innerHTML =
      '<figure class="combo-photo"><img src="' + c.img + '" alt="' + c.alt + '" loading="lazy"></figure>' +
      '<div class="combo-body">' +
        '<span class="tag">' + c.cat + '</span>' +
        '<h3>' + c.name + '</h3>' +
        priceHTML +
        '<p class="combo-desc">' + c.desc + '</p>' +
        '<a href="' + waLink(c) + '" target="_blank" rel="noopener" class="btn btn-red">Pedir este combo</a>' +
      '</div>';

    /* Si la foto todavía no existe, la tarjeta muestra un marcador */
    var photo = row.querySelector('.combo-photo');
    row.querySelector('.combo-photo img').addEventListener('error', function () {
      photo.classList.add('no-img');
    });

    list.appendChild(row);
  });

  /* Cada fila aparece al entrar en pantalla */
  var rows = list.querySelectorAll('.combo-row');
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var rowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          rowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(rows, function (r) { rowObserver.observe(r); });
  } else {
    Array.prototype.forEach.call(rows, function (r) { r.classList.add('in'); });
  }

  /* Marcador para las fotos de los cubos que aún no existen */
  Array.prototype.forEach.call(document.querySelectorAll('.cubo-photo img'), function (img) {
    img.addEventListener('error', function () { img.parentNode.classList.add('no-img'); });
  });

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
