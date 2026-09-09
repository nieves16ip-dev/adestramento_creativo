// script.js

let idiomaActual = 'gl';

// 🔧 Función auxiliar: busca o botón por id, e se non existe, por clase
function obterLangBtn() {
  return document.getElementById('langBtn') || document.querySelector('.lang-btn');
}

/* ============================
   SELECTOR DE IDIOMA
   ============================ */

function toggleDropdown() {
  const menu = document.getElementById('langMenu');
  const btn = obterLangBtn();

  if (!menu || !btn) {
    console.warn('⚠️ Non se atopou #langMenu ou o botón de idioma (#langBtn / .lang-btn).');
    return;
  }

  const expandido = btn.getAttribute('aria-expanded') === 'true';

  menu.classList.toggle('show');
  btn.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(!expandido));
}

function actualizarTextoIdioma(texto) {
  const spanIdioma = document.getElementById('idioma-actual');
  if (spanIdioma) {
    spanIdioma.textContent = texto;
  } else {
    console.warn('⚠️ Non se atopou #idioma-actual no HTML desta páxina.');
  }
}

function seleccionarIdioma(codigo, textoVisible) {
  idiomaActual = codigo;

  actualizarTextoIdioma(textoVisible);

  const langMenu = document.getElementById('langMenu');
  const langBtn = obterLangBtn();

  if (langMenu) langMenu.classList.remove('show');
  if (langBtn) {
    langBtn.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  }

  aplicarTraducion(codigo);
  localStorage.setItem('idioma', codigo);
}

function aplicarTraducion(codigo) {
  if (typeof traducions === 'undefined') {
    console.error('❌ "traducions" non está definido. Verifica que traducions.js se cargue ANTES de script.js.');
    return;
  }

  document.documentElement.setAttribute('lang', codigo);

  // Texto normal
  document.querySelectorAll('[data-i18n]').forEach(elemento => {
    const clave = elemento.getAttribute('data-i18n');
    if (traducions[codigo] && traducions[codigo][clave]) {
      elemento.textContent = traducions[codigo][clave];
    }
  });

  // Atributo alt (imaxes)
  document.querySelectorAll('[data-i18n-alt]').forEach(elemento => {
    const clave = elemento.getAttribute('data-i18n-alt');
    if (traducions[codigo] && traducions[codigo][clave]) {
      elemento.setAttribute('alt', traducions[codigo][clave]);
    }
  });

  // 🔧 NOVO: Atributo placeholder (inputs / textareas)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elemento => {
    const clave = elemento.getAttribute('data-i18n-placeholder');
    if (traducions[codigo] && traducions[codigo][clave]) {
      elemento.setAttribute('placeholder', traducions[codigo][clave]);
    }
  });
}

/* ============================
   INICIO: DOMContentLoaded
   ============================ */

document.addEventListener('DOMContentLoaded', function () {

  const idiomaGardado = localStorage.getItem('idioma');

  const nomes = {
    gl: '🇪🇸 Galego',
    pt: '🇵🇹 Portugués',
    es: '🇪🇸 Español',
    en: '🇬🇧 Inglés',
    fr: '🇫🇷 Francés'
  };

  if (idiomaGardado) {
    idiomaActual = idiomaGardado;
    aplicarTraducion(idiomaGardado);
    actualizarTextoIdioma(nomes[idiomaGardado] || nomes['gl']);
  } else {
    aplicarTraducion(idiomaActual);
    actualizarTextoIdioma(nomes[idiomaActual]);
  }

  /* --- ABRIR/PECHAR O DESPREGABLE DE IDIOMA --- */
  const langBtn = obterLangBtn();
  if (langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });
  } else {
    console.warn('⚠️ Non se atopou o botón de idioma (#langBtn / .lang-btn) nesta páxina.');
  }

  /* --- SELECCIONAR UN IDIOMA DA LISTA --- */
  const langMenuItems = document.querySelectorAll('#langMenu li');
  if (langMenuItems.length === 0) {
    console.warn('⚠️ Non se atoparon <li> dentro de #langMenu.');
  }

  langMenuItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      const codigo = this.getAttribute('data-lang');
      const label = this.getAttribute('data-label');
      seleccionarIdioma(codigo, label);
    });
  });

  /* --- MENÚ HAMBURGUESA (MÓBIL) --- */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('activo');
      navbar.classList.toggle('abierto');
    });

    navbar.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        menuToggle.classList.remove('activo');
        navbar.classList.remove('abierto');
      });
    });
  }

  /* --- SUBMENÚS DROPDOWN EN MÓBIL --- */
  document.querySelectorAll('.dropdown-toggle').forEach(function (boton) {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const li = this.closest('.dropdown');
      if (!li) return;

      const xaAberto = li.classList.contains('activo');

      document.querySelectorAll('.dropdown.activo').forEach(function (otro) {
        if (otro !== li) {
          otro.classList.remove('activo');
          const outroBoton = otro.querySelector('.dropdown-toggle');
          if (outroBoton) outroBoton.setAttribute('aria-expanded', 'false');
        }
      });

      li.classList.toggle('activo', !xaAberto);
      this.setAttribute('aria-expanded', String(!xaAberto));
    });
  });

});

/* ============================
   PECHAR AO CLICAR FÓRA
   ============================ */

document.addEventListener('click', function (event) {

  const langDropdown = document.querySelector('.lang-dropdown');
  if (langDropdown && !langDropdown.contains(event.target)) {
    const langMenu = document.getElementById('langMenu');
    const langBtn = obterLangBtn();
    if (langMenu) langMenu.classList.remove('show');
    if (langBtn) {
      langBtn.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  }

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');

  if (navbar && menuToggle) {
    const clicDentroDoNavbar = navbar.contains(event.target);
    const clicNoBoton = menuToggle.contains(event.target);

    if (!clicDentroDoNavbar && !clicNoBoton) {
      menuToggle.classList.remove('activo');
      navbar.classList.remove('abierto');

      document.querySelectorAll('.dropdown.activo').forEach(function (li) {
        li.classList.remove('activo');
        const boton = li.querySelector('.dropdown-toggle');
        if (boton) boton.setAttribute('aria-expanded', 'false');
      });
    }
  }

});
