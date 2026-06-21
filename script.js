/* =========================================================
   SCRIPT.JS - PORTAFOLIO GLITCH EDITORIAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
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
  const links = document.querySelectorAll(".navbar-links a[href^='#']");

  if (!secciones.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute("id");

          links.forEach((link) => {
            link.classList.remove("activo");

            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("activo");
            }
          });
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

  if (!puedeUsarCursor) return;

  let cursor = document.querySelector(".custom-cursor");

  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
  }

  window.addEventListener("mousemove", (evento) => {
    cursor.style.left = `${evento.clientX}px`;
    cursor.style.top = `${evento.clientY}px`;
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.remove("is-hidden");
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.add("is-hidden");
  });

  const elementosInteractivos = document.querySelectorAll(
    "a, button, input, textarea, select, [role='button']"
  );

  elementosInteractivos.forEach((elemento) => {
    elemento.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
    });

    elemento.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });
}
