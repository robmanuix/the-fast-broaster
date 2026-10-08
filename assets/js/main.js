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
      img: 'assets/img/menu/01-duocrunch.png',
      alt: 'Combo Duo Crunch: dos piezas de pollo crujiente con patatas y bebida',
      desc: '2 piezas de pollo + 1 ración de patatas + bebida.' },

    { cat: 'Pollo', name: 'Triple Crunch', price: '8,99 €',
      img: 'assets/img/menu/02-triplecronch.jpg',
      alt: 'Combo Triple Crunch: tres piezas de pollo crujiente con patatas y bebida',
      desc: '3 piezas de pollo + 1 ración de patatas + bebida.' },

    { cat: 'Pollo', name: 'Mega Crunch', price: '16,95 €',
      img: 'assets/img/menu/03-megacronch.jpg',
      alt: 'Combo Mega Crunch: seis piezas de pollo crujiente con patatas y bebidas',
      desc: '6 piezas de pollo + 2 raciones de patatas + 2 bebidas.' },

    { cat: 'Pollo', name: 'Combo Criminal', price: '23,95 €',
      img: 'assets/img/menu/04-combo-criminal.jpg',
      alt: 'Combo Criminal: nueve piezas de pollo crujiente con patatas y bebida de 2 litros',
      desc: '9 piezas de pollo + 3 raciones de patatas + bebida de 2 litros.' },

    { cat: 'Pollo', name: 'Mega Party', price: '30 €',
      img: 'assets/img/menu/05-mega-party.jpg',
      alt: 'Mega Party: doce piezas de pollo crujiente con patatas y bebida grande',
      desc: '12 piezas de pollo + 2 raciones de patatas + 1 bebida grande.' },

    { cat: 'Pollo', name: 'Combo Mini', price: '3,99 €',
      img: 'assets/img/menu/06-combo-mini.jpg',
      alt: 'Combo Mini: una pieza de pollo crujiente con patatas y bebida',
      desc: '1 pieza de pollo + 1 ración de patatas + bebida.' },

    { cat: 'Pollo', name: 'Lowcost', price: '4,99 €',
      img: 'assets/img/menu/08-lowcost.jpg',
      alt: 'Combo Lowcost: pieza de pollo con arroz y patatas',
      desc: '1 pieza de pollo + 1 ración de arroz + 1 ración de patatas.' },

    { cat: 'Alitas', name: 'Combo 1 Alitas', price: '3,99 €',
      img: 'assets/img/menu/07-combo1-alitas.jpg',
      alt: 'Combo de tres alitas de pollo crujientes con patatas y bebida',
      desc: '3 alitas + 1 ración de patatas + bebida.' },

    { cat: 'Alitas', name: 'Combo 2 Alitas', price: '6 €',
      img: 'assets/img/menu/09-combo2-alitas.jpg',
      alt: 'Combo de seis alitas de pollo crujientes con patatas y bebida',
      desc: '6 alitas + 1 ración de patatas + bebida.' },

    { cat: 'Alitas', name: 'Combo 3 Alitas', price: '10,99 €',
      img: 'assets/img/menu/10-combo3-alitas.jpg',
      alt: 'Combo de doce alitas de pollo crujientes con patatas y dos bebidas',
      desc: '12 alitas + 1 ración de patatas + 2 bebidas.' },

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
      desc: 'Ensalada criolla, patacón o patatas fritas y cerdo frito.' },

    { cat: 'Porciones', name: 'Porción de Arroz', price: '3 €',
      img: 'assets/img/menu/13-porcion-arroz.jpg',
      alt: 'Porción de arroz blanco',
      desc: 'Porción individual de arroz blanco recién hecho.' },

    { cat: 'Porciones', name: 'Porción de Patatas Fritas', price: '3 €',
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

  /* WhatsApp que recibe los pedidos */
  var WHATSAPP = '34652869704';

  /* '6,99 €' -> 699 (céntimos), para sumar sin errores de decimales */
  function toCents(txt) {
    return Math.round(parseFloat(String(txt).replace(/[^\d,]/g, '').replace(',', '.')) * 100);
  }
  function slug(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  /* 3000 -> '30,00 €' */
  function money(cents) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  /* ---------- Lista de combos, uno debajo de otro ---------- */
  var list = document.getElementById('comboList');

  combos.forEach(function (c) {
    var row = document.createElement('article');
    /* 'plano' = foto nueva con fondo degradado: no lleva el realce dorado */
    row.className = 'combo-row' + (c.plano ? ' sin-filtro' : '');

    /* Atributos para el botón Agregar (el carrito los lee al hacer clic) */
    function addBtn(variant, cents, extra) {
      return '<button type="button" class="btn btn-red ' + (extra || '') + '" data-add' +
        ' data-id="' + slug(c.name + ' ' + variant) + '"' +
        ' data-name="' + c.name + '"' +
        ' data-variant="' + variant + '"' +
        ' data-price="' + cents + '"' +
        ' data-img="' + c.img + '">Agregar</button>';
    }

    var priceHTML, ctaHTML = '';
    if (c.prices) {
      /* Varios precios: cada uno lleva su propio Agregar */
      priceHTML = '<ul class="combo-prices">';
      c.prices.forEach(function (p) {
        priceHTML += '<li><span>' + p.label + '</span><b>' + p.value + '</b>' +
                     addBtn(p.label, toCents(p.value), 'btn-xs') + '</li>';
      });
      priceHTML += '</ul>';
    } else {
      priceHTML = '<p class="combo-price">' + c.price + '</p>';
      ctaHTML = addBtn('', toCents(c.price));
    }

    row.innerHTML =
      '<figure class="combo-photo"><img src="' + c.img + '" alt="' + c.alt + '" loading="lazy"></figure>' +
      '<div class="combo-body">' +
        '<span class="tag">' + c.cat + '</span>' +
        '<h3>' + c.name + '</h3>' +
        priceHTML +
        '<p class="combo-desc">' + c.desc + '</p>' +
        ctaHTML +
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

  /* ---------- 5b. Carrito: pedido por WhatsApp (sin checkout) ---------- */
  (function carrito() {
    var KEY = 'tfb-pedido-v1';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var btn      = document.getElementById('cartBtn');
    var count    = document.getElementById('cartCount');
    var panel    = document.getElementById('cartPanel');
    var overlay  = document.getElementById('cartOverlay');
    var listEl   = document.getElementById('cartItems');
    var emptyEl  = document.getElementById('cartEmpty');
    var totalEl  = document.getElementById('cartTotal');
    var sendEl   = document.getElementById('cartSend');
    var closeBtn = document.getElementById('cartClose');
    var keepBtn  = document.getElementById('cartKeep');
    var live     = document.getElementById('cartLive');
    if (!btn || !panel) return;

    var items = load();
    var lastFocus = null;

    /* --- almacenamiento (si falla, el carrito funciona igual en memoria) --- */
    function load() {
      try {
        var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
        return raw.filter(function (i) {
          return i && typeof i.id === 'string' && typeof i.name === 'string' &&
                 isFinite(i.price) && i.qty > 0;
        }).map(function (i) {
          return { id: i.id, name: i.name, variant: i.variant || '', price: +i.price,
                   img: i.img || '', qty: Math.min(99, Math.floor(i.qty)) };
        });
      } catch (e) { return []; }
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    }

    /* --- cálculos --- */
    function units() { return items.reduce(function (n, i) { return n + i.qty; }, 0); }
    function total() { return items.reduce(function (n, i) { return n + i.qty * i.price; }, 0); }
    function escapeHTML(t) {
      return String(t).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    /* --- mensaje de WhatsApp: saludo corto + lista + total --- */
    function mensaje() {
      var lineas = items.map(function (i) {
        var nombre = i.name + (i.variant ? ' (' + i.variant + ')' : '');
        return '• ' + i.qty + ' x ' + nombre + ' — ' + money(i.qty * i.price);
      });
      return 'Hola, quiero hacer este pedido en The Fast Broaster:\n\n' +
             lineas.join('\n') +
             '\n\nTotal: ' + money(total()) +
             '\n\n¿Me confirman disponibilidad? Gracias.';
    }

    /* --- contador de la cabecera --- */
    function syncBadge() {
      var n = units();
      count.textContent = n > 99 ? '99+' : n;
      count.dataset.n = n;
      btn.setAttribute('aria-label', n
        ? 'Abrir mi pedido (' + n + (n === 1 ? ' producto)' : ' productos)')
        : 'Abrir mi pedido (vacío)');
    }
    function bump() {
      if (reduce) return;
      [btn, count].forEach(function (el) {
        el.classList.remove('bump');
        void el.offsetWidth;            /* reinicia la animación */
        el.classList.add('bump');
      });
    }

    /* --- panel lateral --- */
    function render() {
      listEl.innerHTML = '';
      items.forEach(function (i) {
        var li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.id = i.id;
        li.innerHTML =
          '<div class="ci-thumb"><img src="' + escapeHTML(i.img) + '" alt="" loading="lazy"></div>' +
          '<div class="ci-info">' +
            '<h3>' + escapeHTML(i.name) + '</h3>' +
            (i.variant ? '<span class="ci-variant">' + escapeHTML(i.variant) + '</span>' : '') +
            '<span class="ci-price">' + money(i.price * i.qty) + '</span>' +
          '</div>' +
          '<button type="button" class="ci-remove" data-act="remove" aria-label="Quitar ' + escapeHTML(i.name) + ' del pedido">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<div class="ci-qty" role="group" aria-label="Cantidad de ' + escapeHTML(i.name) + '">' +
            '<button type="button" data-act="dec" aria-label="Quitar una unidad">−</button>' +
            '<output>' + i.qty + '</output>' +
            '<button type="button" data-act="inc" aria-label="Agregar una unidad">+</button>' +
          '</div>';
        var img = li.querySelector('img');
        img.addEventListener('error', function () { img.parentNode.classList.add('no-img'); });
        listEl.appendChild(li);
      });

      var vacio = items.length === 0;
      emptyEl.hidden = !vacio;
      listEl.hidden = vacio;
      totalEl.textContent = money(total());
      if (vacio) {
        sendEl.removeAttribute('href');
        sendEl.setAttribute('aria-disabled', 'true');
      } else {
        sendEl.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensaje());
        sendEl.removeAttribute('aria-disabled');
      }
    }

    function update() { save(); render(); syncBadge(); }

    function open() {
      lastFocus = document.activeElement;
      panel.removeAttribute('inert');
      document.documentElement.classList.add('cart-open');
      /* dos frames para que la transición de entrada arranque */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { document.body.classList.add('cart-visible'); });
      });
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(function () { closeBtn.focus(); }, 60);
    }
    function close() {
      document.body.classList.remove('cart-visible');
      document.documentElement.classList.remove('cart-open');
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('inert', '');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function isOpen() { return document.body.classList.contains('cart-visible'); }

    /* --- agregar producto + animación hacia el carrito --- */
    function add(data, fromEl) {
      var found = items.filter(function (i) { return i.id === data.id; })[0];
      if (found) { found.qty = Math.min(99, found.qty + 1); }
      else { items.push({ id: data.id, name: data.name, variant: data.variant,
                          price: data.price, img: data.img, qty: 1 }); }
      save(); render();
      live.textContent = data.name + (data.variant ? ' (' + data.variant + ')' : '') +
                         ' agregado. ' + units() + ' en tu pedido.';

      /* retroalimentación en el propio botón */
      if (fromEl && !fromEl.classList.contains('is-added')) {
        var original = fromEl.textContent;
        fromEl.classList.add('is-added');
        fromEl.textContent = '✓ Agregado';
        setTimeout(function () {
          fromEl.classList.remove('is-added');
          fromEl.textContent = original;
        }, 1100);
      }

      if (reduce || !fromEl || !btn.animate) { syncBadge(); return; }
      fly(data, fromEl);
    }

    function fly(data, fromEl) {
      var a = fromEl.getBoundingClientRect();
      var b = btn.getBoundingClientRect();
      var size = 54;
      var x0 = a.left + a.width / 2 - size / 2, y0 = a.top + a.height / 2 - size / 2;
      var dx = (b.left + b.width / 2 - size / 2) - x0;
      var dy = (b.top + b.height / 2 - size / 2) - y0;

      var dot = document.createElement('div');
      dot.className = 'fly';
      dot.style.cssText = 'left:' + x0 + 'px;top:' + y0 + 'px;width:' + size + 'px;height:' + size + 'px;' +
                          'background-image:url("' + data.img + '")';
      document.body.appendChild(dot);

      var anim = dot.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1, offset: 0 },
        { transform: 'translate(' + (dx * 0.5) + 'px,' + (Math.min(dy, 0) - 90) + 'px) scale(.8)', opacity: 1, offset: .45 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.22)', opacity: .35, offset: 1 }
      ], { duration: 780, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' });

      function done() {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
        syncBadge();
        bump();
      }
      anim.onfinish = done;
      anim.oncancel = done;
    }

    /* --- eventos --- */
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest && e.target.closest('[data-add]');
      if (addBtn) {
        add({
          id: addBtn.dataset.id, name: addBtn.dataset.name,
          variant: addBtn.dataset.variant || '',
          price: parseInt(addBtn.dataset.price, 10), img: addBtn.dataset.img || ''
        }, addBtn);
      }
    });

    listEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]');
      if (!b) return;
      var li = b.closest('.cart-item');
      var idx = -1;
      items.forEach(function (i, n) { if (i.id === li.dataset.id) idx = n; });
      if (idx < 0) return;
      var act = b.dataset.act;
      if (act === 'inc') items[idx].qty = Math.min(99, items[idx].qty + 1);
      if (act === 'dec') items[idx].qty -= 1;
      if (act === 'remove' || items[idx].qty <= 0) items.splice(idx, 1);
      update();
      /* al cambiar la lista, el foco no se pierde */
      var again = listEl.querySelector('[data-id="' + li.dataset.id + '"] [data-act="' + act + '"]');
      (again || closeBtn).focus();
    });

    sendEl.addEventListener('click', function (e) {
      if (sendEl.getAttribute('aria-disabled') === 'true') e.preventDefault();
    });
    btn.addEventListener('click', function () { isOpen() ? close() : open(); });
    closeBtn.addEventListener('click', close);
    keepBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {                       /* el foco se queda dentro del panel */
        var f = panel.querySelectorAll('button:not([disabled]), a[href]');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    update();
  })();

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
