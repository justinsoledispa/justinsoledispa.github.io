/* =========================================================
   SCRIPT.JS - PORTAFOLIO GLITCH EDITORIAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  activarMenuMovil();
  activarNavbarPorScroll();
  revelarElementosAlScroll();
  animarNumerosResumen();
  activarCursorPersonalizado();
});

/* =========================================================
   1. NAVBAR ACTIVA SEGÚN SECCIÓN
   ========================================================= */

function activarNavbarPorScroll() {
  const secciones = document.querySelectorAll("section[id], header[id]");
  const links = Array.from(document.querySelectorAll(".navbar-links a"));

  if (!secciones.length || !links.length) return;

  const rutaActual = normalizarRuta(window.location.pathname);
  const linksConSeccion = links
    .map((link) => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      return { link, url };
    })
    .filter(({ url }) => {
      return normalizarRuta(url.pathname) === rutaActual && url.hash && document.querySelector(url.hash);
    });

  const activarLink = (linkActivo) => {
    links.forEach((link) => {
      link.classList.toggle("activo", link === linkActivo);
      if (link === linkActivo) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const activarPaginaActual = () => {
    const linkPagina = links.find((link) => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      const rutaLink = normalizarRuta(url.pathname);

      if (rutaLink === rutaActual && !url.hash) return true;
      return esPaginaDeMateria(rutaActual) && rutaLink.endsWith("/proyectos.html");
    });

    if (linkPagina) activarLink(linkPagina);
  };

  activarPaginaActual();

  if (!linksConSeccion.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute("id");
          const match = linksConSeccion.find(({ url }) => url.hash === `#${id}`);

          if (match) {
            activarLink(match.link);
          } else if (id === "inicio") {
            activarPaginaActual();
          }
        }
      });
    },
    {
      root: null,
      threshold: 0.45,
    }
  );

  secciones.forEach((seccion) => observer.observe(seccion));
}

function normalizarRuta(pathname) {
  const ruta = pathname.replace(/\\/g, "/");
  if (ruta.endsWith("/")) return `${ruta}index.html`;
  return ruta;
}

function esPaginaDeMateria(pathname) {
  return /\/20\d{2}-\d-[^/]+\/index\.html$/.test(pathname);
}

/* =========================================================
   1.1 MENÚ MÓVIL
   ========================================================= */

function activarMenuMovil() {
  const boton = document.querySelector(".navbar-toggle");
  const menu = document.getElementById("navbar-menu");

  if (!boton || !menu) return;

  const cerrarMenu = () => {
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú de navegación");
    menu.classList.remove("is-open");
  };

  const alternarMenu = () => {
    const estaAbierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!estaAbierto));
    boton.setAttribute("aria-label", estaAbierto ? "Abrir menú de navegación" : "Cerrar menú de navegación");
    menu.classList.toggle("is-open", !estaAbierto);
  };

  boton.addEventListener("click", alternarMenu);

  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) cerrarMenu();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) cerrarMenu();
  });
}

/* =========================================================
   2. REVELAR SECCIONES Y TARJETAS AL HACER SCROLL
   ========================================================= */

function revelarElementosAlScroll() {
  const elementos = document.querySelectorAll(
    ".seccion-amplia, .tarjeta-materia, .tarjeta-tecnologia, .tarjeta-certificacion, .tarjeta-contacto, .panel-info"
  );

  if (!elementos.length) return;

  elementos.forEach((elemento) => {
    elemento.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  elementos.forEach((elemento) => observer.observe(elemento));
}

/* =========================================================
   3. ANIMAR NÚMEROS DEL PANEL RESUMEN
   ========================================================= */

function animarNumerosResumen() {
  const numeros = document.querySelectorAll(".resumen-numero:not(.resumen-numero-estatico)");

  if (!numeros.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        const elemento = entrada.target;
        const textoOriginal = elemento.textContent.trim();
        const numero = Number(textoOriginal);

        if (!Number.isNaN(numero)) {
          animarContador(elemento, numero);
        }

        observer.unobserve(elemento);
      });
    },
    {
      threshold: 0.8,
    }
  );

  numeros.forEach((numero) => observer.observe(numero));
}

function animarContador(elemento, valorFinal) {
  let valorActual = 0;
  const duracion = 700;
  const incremento = Math.max(1, Math.ceil(valorFinal / 30));
  const intervalo = duracion / Math.ceil(valorFinal / incremento);

  const contador = setInterval(() => {
    valorActual += incremento;

    if (valorActual >= valorFinal) {
      elemento.textContent = valorFinal;
      clearInterval(contador);
    } else {
      elemento.textContent = valorActual;
    }
  }, intervalo);
}

function activarCursorPersonalizado() {
  const puedeUsarCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!puedeUsarCursor || reduceMovimiento) return;

  let cursor = document.querySelector(".custom-cursor");

  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
  }

  let objetivoX = window.innerWidth / 2;
  let objetivoY = window.innerHeight / 2;
  let actualX = objetivoX;
  let actualY = objetivoY;
  let animando = false;

  const mover = () => {
    actualX += (objetivoX - actualX) * 0.16;
    actualY += (objetivoY - actualY) * 0.16;
    cursor.style.transform = `translate3d(${actualX}px, ${actualY}px, 0) translate(-50%, -50%)`;
    animando = true;
    requestAnimationFrame(mover);
  };

  window.addEventListener("mousemove", (evento) => {
    objetivoX = evento.clientX;
    objetivoY = evento.clientY;
    cursor.classList.remove("is-hidden");

    if (!animando) {
      requestAnimationFrame(mover);
    }
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.remove("is-hidden");
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.add("is-hidden");
  });

  document.addEventListener("mouseover", (evento) => {
    if (evento.target.closest("a, button, input, textarea, select, [role='button']")) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", (evento) => {
    if (evento.target.closest("a, button, input, textarea, select, [role='button']")) {
      cursor.classList.remove("is-hovering");
    }
  });
}
