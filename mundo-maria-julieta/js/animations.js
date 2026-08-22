/* ==========================================================
   animations.js
   Efectos visuales reutilizables: fondo de estrellas/partículas,
   lluvia de corazones, confeti, destellos y corazones al hacer clic.
   ========================================================== */

const Animaciones = (() => {

  /* ---------- Fondo animado de estrellas + partículas (parallax sutil) ---------- */
  function iniciarFondoMagico(idContenedor) {
    const cont = document.getElementById(idContenedor);
    if (!cont) return;
    cont.innerHTML = "";

    const capaEstrellas = document.createElement("div");
    capaEstrellas.className = "capa-parallax capa-estrellas";
    const capaParticulas = document.createElement("div");
    capaParticulas.className = "capa-parallax capa-particulas";

    cont.appendChild(capaEstrellas);
    cont.appendChild(capaParticulas);

    const totalEstrellas = window.innerWidth < 700 ? 60 : 120;
    for (let i = 0; i < totalEstrellas; i++) {
      const e = document.createElement("div");
      e.className = "estrella-fondo" + (Math.random() > 0.85 ? " estrella-grande" : "");
      e.style.left = Math.random() * 100 + "%";
      e.style.top = Math.random() * 100 + "%";
      e.style.animationDuration = 2 + Math.random() * 3 + "s";
      e.style.animationDelay = Math.random() * 4 + "s";
      capaEstrellas.appendChild(e);
    }

    const totalParticulas = window.innerWidth < 700 ? 14 : 24;
    for (let i = 0; i < totalParticulas; i++) {
      const p = document.createElement("div");
      p.className = "particula-flotante";
      p.textContent = ["✦", "・", "✧", "❤"][Math.floor(Math.random() * 4)];
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 10 + Math.random() * 12 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      p.style.fontSize = 10 + Math.random() * 14 + "px";
      capaParticulas.appendChild(p);
    }

    // Parallax sutil según el movimiento del mouse
    document.addEventListener("mousemove", (ev) => {
      const x = (ev.clientX / window.innerWidth - 0.5) * 12;
      const y = (ev.clientY / window.innerHeight - 0.5) * 12;
      capaEstrellas.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
      capaParticulas.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---------- Lluvia de corazones ---------- */
  function lluviaCorazones(cantidad = 20, duracionExtra = 0) {
    const cont = document.getElementById("capa-efectos");
    if (!cont) return;
    for (let i = 0; i < cantidad; i++) {
      setTimeout(() => {
        const c = document.createElement("div");
        c.className = "fx-corazon";
        c.textContent = ["❤️", "💕", "💖", "💗"][Math.floor(Math.random() * 4)];
        c.style.left = Math.random() * 100 + "vw";
        c.style.fontSize = 14 + Math.random() * 20 + "px";
        c.style.setProperty("--drift", Math.random() * 140 - 70 + "px");
        c.style.animationDuration = 4 + Math.random() * 3 + duracionExtra + "s";
        cont.appendChild(c);
        setTimeout(() => c.remove(), 8000);
      }, i * 90);
    }
  }

  /* ---------- Explosión de estrellas ---------- */
  function explosionEstrellas(cantidad = 26) {
    const cont = document.getElementById("capa-efectos");
    if (!cont) return;
    const cx = 50, cy = 50;
    for (let i = 0; i < cantidad; i++) {
      const e = document.createElement("div");
      e.className = "fx-estrella-explosion";
      const angulo = (Math.PI * 2 * i) / cantidad + Math.random() * 0.3;
      const distancia = 120 + Math.random() * 220;
      e.style.left = cx + "vw";
      e.style.top = cy + "vh";
      e.style.setProperty("--tx", Math.cos(angulo) * distancia + "px");
      e.style.setProperty("--ty", Math.sin(angulo) * distancia + "px");
      e.textContent = "✦";
      cont.appendChild(e);
      setTimeout(() => e.remove(), 1600);
    }
  }

  /* ---------- Confeti ---------- */
  function confeti(cantidad = 60) {
    const cont = document.getElementById("capa-efectos");
    if (!cont) return;
    const colores = ["#f3b9c9", "#cbb6e0", "#f0d18a", "#8fd3d8", "#ffd9e3"];
    for (let i = 0; i < cantidad; i++) {
      setTimeout(() => {
        const pieza = document.createElement("div");
        pieza.className = "fx-confeti";
        pieza.style.left = Math.random() * 100 + "vw";
        pieza.style.background = colores[Math.floor(Math.random() * colores.length)];
        pieza.style.animationDuration = 3 + Math.random() * 2.5 + "s";
        pieza.style.setProperty("--rot", Math.random() * 720 - 360 + "deg");
        pieza.style.setProperty("--drift", Math.random() * 160 - 80 + "px");
        cont.appendChild(pieza);
        setTimeout(() => pieza.remove(), 6000);
      }, i * 25);
    }
  }

  /* ---------- Destello puntual (para victorias de minijuegos) ---------- */
  function destelloEn(x, y, cantidad = 10) {
    const cont = document.getElementById("capa-efectos");
    if (!cont) return;
    for (let i = 0; i < cantidad; i++) {
      const d = document.createElement("div");
      d.className = "fx-destello";
      d.style.left = x + "px";
      d.style.top = y + "px";
      const angulo = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      d.style.setProperty("--tx", Math.cos(angulo) * dist + "px");
      d.style.setProperty("--ty", Math.sin(angulo) * dist + "px");
      cont.appendChild(d);
      setTimeout(() => d.remove(), 900);
    }
  }

  /* ---------- Corazón al hacer clic en cualquier parte de la pantalla ---------- */
  function activarCorazonesEnClic() {
    document.addEventListener("click", (ev) => {
      if (ev.target.closest("button, input, .no-fx-clic")) return;
      const c = document.createElement("div");
      c.className = "fx-corazon-clic";
      c.textContent = "❤️";
      c.style.left = ev.clientX + "px";
      c.style.top = ev.clientY + "px";
      document.getElementById("capa-efectos").appendChild(c);
      setTimeout(() => c.remove(), 900);
    });
  }

  /* ---------- Sacudida (para respuestas incorrectas) ---------- */
  function sacudir(elemento) {
    elemento.classList.remove("sacudir");
    void elemento.offsetWidth; // fuerza reinicio de animación
    elemento.classList.add("sacudir");
  }

  return {
    iniciarFondoMagico,
    lluviaCorazones,
    explosionEstrellas,
    confeti,
    destelloEn,
    activarCorazonesEnClic,
    sacudir
  };
})();
