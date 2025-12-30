
// Utilidades
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Inicialización de librerías
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true });

  // Navbar toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Animación de texto “dibujado”
  gsap.fromTo(".draw-text", { opacity: 0, filter: "blur(6px)" }, {
    opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power2.out"
  });
  // Logo aparece con brillo
  gsap.fromTo(".logo", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });

  // Parallax sutil con ScrollTrigger
  
  gsap.to(".parallax-stars", {
    yPercent: -10, ease: "none",
    scrollTrigger: { trigger: "#home", start: "top top", scrub: 1 }
  });
  gsap.to(".parallax-brush", {
    yPercent: -20, ease: "none",
    scrollTrigger: { trigger: "#home", start: "top top", scrub: 1 }
  });

  gsap.from(".section-title", {
  scrollTrigger: ".section-title",
  x: -50,
  opacity: 0,
  duration: 1
});


  // Render galería
  renderGaleria(GALLERY_ITEMS);

  // Filtros
  $$(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-filter");
      filtrarGaleria(cat);
    });
  });

  // Formulario de contacto
  $("#contactForm").addEventListener("submit", handleContactSubmit);
});

// Galería de demo (sin precios)
const GALLERY_ITEMS = [
  { id: "c1", nombre: "Taza de pinguino", categoria: "ceramica", img: "assets/galeria/tazapinguino.png", desc: "taza adorable de pinguino, codiciada desde que el creador de este sitio la vio" },
  { id: "f1", nombre: "cuadro decorativo", categoria: "cuadros", img: "assets/galeria/cuadro.png", desc: "cuadros para tu hogar de lo que mas te guste" },
  { id: "q1", nombre: "llaveros ", categoria: "arcilla", img: "assets/galeria/llavero.png", desc: "llaveros con tus formas favoritas" },
  { id: "p1", nombre: "Pin de patricio estrella", categoria: "pines", img: "assets/galeria/pindepatricio.png", desc: "una figura personalizada con patricio estrella" },
  { id: "pl1", nombre: "fundas", categoria: "fundas", img: "assets/galeria/fundadetelefono.png", desc: "fundas personalizadas como mas te gustan" },
  { id: "c2", nombre: "figura de ceramica", categoria: "ceramica", img: "assets/galeria/figuradeceramica.png", desc: "figura echa sobre el fantasma de la opera" }
];

function renderGaleria(items) {
  const grid = $("#galeriaGrid");
  grid.innerHTML = "";
  items.forEach(i => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-cat", i.categoria);
    card.innerHTML = `
      <img src="${i.img}" alt="${i.nombre}" />
      <div class="card-body">
        <span class="badge">${capitaliza(i.categoria)}</span>
        <h3>${i.nombre}</h3>
        <p>${i.desc}</p>
        <div class="cta">
          <button class="btn btn-secondary" aria-label="Solicitar estilo ${i.nombre}" data-style="${i.nombre}">Solicitar este estilo</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // CTA: prellenar el formulario con el estilo
  grid.querySelectorAll("button[data-style]").forEach(btn => {
    btn.addEventListener("click", () => {
      const styleName = btn.getAttribute("data-style");
      document.getElementById("tipo").value = ""; // usuario decide tipo
      const msj = `Me interesa el estilo: "${styleName}". ¿Podemos adaptarlo a mi idea?`;
      const textarea = document.getElementById("mensaje");
      textarea.value = msj;
      // scroll suave al formulario
      document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function filtrarGaleria(cat) {
  const cards = $$("#galeriaGrid .card");
  cards.forEach(c => {
    const ok = (cat === "all") || (c.getAttribute("data-cat") === cat);
    c.style.display = ok ? "block" : "none";
  });
}

function capitaliza(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// Envío de formulario (demo con mailto o EmailJS)
function handleContactSubmit(e) {
  e.preventDefault();
  const nombre = $("#nombre").value.trim();
  const email = $("#email").value.trim();
  const tipo = $("#tipo").value.trim();
  const mensaje = $("#mensaje").value.trim();

  if (!nombre || !email || !mensaje) {
    $("#contactMsg").textContent = "Por favor, completa los campos requeridos.";
    return;
  }

  // Opción A (rápida): mailto (abre cliente de correo del usuario)
  const body =
    `Nuevo pedido personalizado:\n` +
    `Nombre: ${nombre}\nEmail: ${email}\nTipo: ${tipo || "no especificado"}\nMensaje: ${mensaje}`;
  const mailto = `mailto:contacto@artemis.cl?subject=${encodeURIComponent("Pedido personalizado")}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  // Opción B (profesional): EmailJS (requiere configuración)
  // emailjs.init("TU_PUBLIC_KEY");
  // emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
  //   nombre, email, tipo, mensaje
  // }).then(() => {
  //   $("#contactMsg").textContent = "Gracias por tu pedido. Te contactaré pronto.";
  // }).catch(() => {
  //   $("#contactMsg").textContent = "Hubo un problema enviando el mensaje.";
  // });

  $("#contactMsg").textContent = "Si no se abrió tu correo, te responderé pronto.";
  e.target.reset();
}
gsap.from(".section-title", {
  scrollTrigger: ".section-title",
  x: -50,
  opacity: 0,
  duration: 1
});

particlesJS("particles-js", {
  particles: {
    number: { value: 100 },
    color: { value: ["#ffffff", "#e66cb2", "#8e59cf", "#d6b25c"] },
    shape: { type: "star" },
    opacity: { value: 0.7 },
    size: { value: 2 },
    move: { enable: true, speed: 1 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  },
  retina_detect: true
});
