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
  { id: "c1", nombre: "Taza cuervo dorado", categoria: "ceramica", img: "assets/galeria/ceramica-1.jpg", desc: "Cerámica pintada a mano con detalles dorados y símbolos." },
  { id: "f1", nombre: "Funda lunas crecientes", categoria: "fundas", img: "assets/galeria/funda-1.jpg", desc: "Funda de celular personalizada con lunas y estrellas." },
  { id: "q1", nombre: "Cuadro constelación", categoria: "cuadros", img: "assets/galeria/cuadro-1.jpg", desc: "Lienzo con constelaciones y cuervo central." },
  { id: "p1", nombre: "Pin cuervo místico", categoria: "pines", img: "assets/galeria/pin-1.jpg", desc: "Figura de arcilla modelada y pintada a mano." },
  { id: "pl1", nombre: "Playera estrella guía", categoria: "playeras", img: "assets/galeria/playera-1.jpg", desc: "Serigrafía artesanal con símbolos." },
  { id: "c2", nombre: "Maceta celestial", categoria: "ceramica", img: "assets/galeria/ceramica-2.jpg", desc: "Maceta con pinceladas púrpura y dorado." }
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
