/* ==========================================================
   main.js
   Navegación entre pantallas y orquestación general:
   INTRO → MAPA → CARTA → MINIJUEGO → VICTORIA → CARTA
   DESBLOQUEADA → MENSAJE → MAPA → ... → FINAL
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  Animaciones.iniciarFondoMagico("fondo-magico");
  Animaciones.activarCorazonesEnClic();

  const barraSuperior = document.getElementById("barra-superior");
  const btnSonido = document.getElementById("btnSonido");
  const btnReiniciar = document.getElementById("btnReiniciar");
  const btnComenzar = document.getElementById("btnComenzar");
  const btnVolverMapa = document.getElementById("btnVolverMapa");
  const btnVolverRecorrer = document.getElementById("btnVolverRecorrer");

  btnSonido.textContent = AudioSystem.estaHabilitado() ? "🔊" : "🔇";

  /* ---------- Navegación entre pantallas ---------- */
  function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
    const destino = document.getElementById(id);
    destino.classList.add("activa");
    window.scrollTo(0, 0);
  }

  /* ---------- Pantalla de carga inicial ---------- */
  setTimeout(() => {
    mostrarPantalla("pantalla-intro");
  }, 1400);

  /* ---------- Botón comenzar aventura ---------- */
  btnComenzar.addEventListener("click", () => {
    AudioSystem.click();
    barraSuperior.classList.remove("oculto");
    renderizarMapa();
    mostrarPantalla("pantalla-mapa");
  });

  /* ---------- Botón volver a recorrer el mundo (desde pantalla final) ---------- */
  btnVolverRecorrer.addEventListener("click", () => {
    AudioSystem.click();
    renderizarMapa();
    mostrarPantalla("pantalla-mapa");
  });

  /* ---------- Botón sonido ---------- */
  btnSonido.addEventListener("click", () => {
    const habilitado = AudioSystem.alternar();
    btnSonido.textContent = habilitado ? "🔊" : "🔇";
    if (habilitado) AudioSystem.click();
  });

  /* ---------- Botón reiniciar aventura ---------- */
  btnReiniciar.addEventListener("click", () => {
    const confirmado = window.confirm(
      "¿Seguro que quieres reiniciar la aventura? Esto borrará todo tu progreso."
    );
    if (!confirmado) return;
    Progreso.reiniciar();
    AudioSystem.click();
    renderizarMapa();
    mostrarPantalla("pantalla-mapa");
  });

  /* ---------- Botón volver al mapa desde un minijuego ---------- */
  btnVolverMapa.addEventListener("click", () => {
    AudioSystem.click();
    document.getElementById("minijuegoContenedor").innerHTML = "";
    renderizarMapa();
    mostrarPantalla("pantalla-mapa");
  });

  /* ==========================================================
     MAPA: dibuja las 10 cartas según su estado
     ========================================================== */
  function actualizarBarraProgreso() {
    const completadas = Progreso.completadas();
    const total = Progreso.total();
    const porcentaje = Math.round((completadas / total) * 100);
    document.getElementById("progresoRelleno").style.width = porcentaje + "%";
    document.getElementById("progresoTexto").textContent = `${completadas}/${total}`;
  }

  function renderizarMapa() {
    const cont = document.getElementById("mapaCartas");
    cont.innerHTML = "";

    CARTAS.forEach((carta) => {
      const desbloqueada = Progreso.estaDesbloqueada(carta.id);
      const el = document.createElement("button");
      el.className = "carta-mapa" + (desbloqueada ? " carta-desbloqueada" : "");
      el.innerHTML = `
        <span class="carta-mapa-icono">${desbloqueada ? carta.icono : "🔒"}</span>
        <span class="carta-mapa-numero">CARTA ${String(carta.id).padStart(2, "0")}</span>
        <span class="carta-mapa-nombre">${carta.nombreMinijuego}</span>
        <span class="carta-mapa-estado">${desbloqueada ? "DESBLOQUEADA" : "BLOQUEADA"}</span>
      `;
      el.addEventListener("click", () => {
        AudioSystem.click();
        abrirCarta(carta.id);
      });
      cont.appendChild(el);
    });

    actualizarBarraProgreso();
  }

  /* ==========================================================
     PANTALLA CARTA: vista bloqueada o mensaje desbloqueado
     ========================================================== */
  function abrirCarta(id) {
    const carta = CARTAS.find((c) => c.id === id);
    const desbloqueada = Progreso.estaDesbloqueada(id);
    const cont = document.getElementById("cartaContenido");

    if (!desbloqueada) {
      cont.innerHTML = `
        <div class="carta-bloqueada">
          <div class="carta-icono-grande">🔒</div>
          <h2>MENSAJE BLOQUEADO</h2>
          <p>Completa el desafío "${carta.nombreMinijuego}" para descubrirlo...</p>
          <div class="carta-botones">
            <button class="btn-primario no-fx-clic" id="btnJugar">Jugar ${carta.icono}</button>
            <button class="btn-secundario no-fx-clic" id="btnVolver1">Volver al mapa</button>
          </div>
        </div>
      `;
      cont.querySelector("#btnJugar").addEventListener("click", () => {
        AudioSystem.click();
        iniciarMinijuegoParaCarta(id);
      });
      cont.querySelector("#btnVolver1").addEventListener("click", () => {
        AudioSystem.click();
        mostrarPantalla("pantalla-mapa");
      });
    } else {
      cont.innerHTML = `
        <div class="carta-abierta" id="cartaAbierta">
          <div class="carta-titulo-icono">${carta.icono}</div>
          <h2>${carta.titulo}</h2>
          <p class="carta-mensaje-texto">${carta.mensaje}</p>
          <button class="btn-primario no-fx-clic" id="btnVolver2">Volver al mapa</button>
        </div>
      `;
      requestAnimationFrame(() => {
        cont.querySelector("#cartaAbierta").classList.add("carta-abierta-animar");
      });
      cont.querySelector("#btnVolver2").addEventListener("click", () => {
        AudioSystem.click();
        mostrarPantalla("pantalla-mapa");
      });
    }

    mostrarPantalla("pantalla-carta");
  }

  /* ==========================================================
     MINIJUEGO: lanza el minijuego correspondiente a una carta
     ========================================================== */
  function iniciarMinijuegoParaCarta(id) {
    const carta = CARTAS.find((c) => c.id === id);
    const cont = document.getElementById("minijuegoContenedor");
    cont.innerHTML = "";

    mostrarPantalla("pantalla-minijuego");

    const iniciarFn = MINIJUEGOS[carta.minijuego];
    if (typeof iniciarFn === "function") {
      iniciarFn(cont, () => manejarVictoria(id));
    } else {
      cont.innerHTML = `<p>Este minijuego aún no está disponible.</p>`;
    }
  }

  /* ==========================================================
     VICTORIA: animación + desbloqueo + vuelta al flujo
     ========================================================== */
  function manejarVictoria(id) {
    AudioSystem.desbloqueo();
    Progreso.desbloquear(id);
    Animaciones.lluviaCorazones(16);

    mostrarPantalla("pantalla-victoria");
    const sobre = document.getElementById("victoriaSobre");
    sobre.classList.remove("victoria-sobre-abrir");
    void sobre.offsetWidth;
    sobre.classList.add("victoria-sobre-abrir");

    setTimeout(() => {
      renderizarMapa();
      abrirCarta(id);

      if (Progreso.todasCompletas()) {
        setTimeout(() => mostrarFinal(), 1600);
      }
    }, 1500);
  }

  /* ==========================================================
     PANTALLA FINAL
     ========================================================== */
  function mostrarFinal() {
    document.getElementById("finalMensaje").textContent = MENSAJE_FINAL.replace(
      /Maria Julieta ❤️\n\n/,
      ""
    );
    mostrarPantalla("pantalla-final");
    AudioSystem.victoria();
    Animaciones.confeti(70);
    Animaciones.lluviaCorazones(24, 1);
  }

  /* Si ya había progreso guardado, refleja el estado al iniciar */
  actualizarBarraProgreso();
});
