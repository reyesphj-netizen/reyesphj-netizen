/* ==========================================================
   game.js
   Sistema de progreso (localStorage) + implementación de los
   10 minijuegos. Cada función iniciar_X(contenedor, onVictoria)
   recibe el elemento donde debe dibujarse el juego y una
   función a llamar cuando el jugador gana.
   ========================================================== */

const CLAVE_PROGRESO = "mj_progreso";

const Progreso = (() => {
  function estadoPorDefecto() {
    const estado = {};
    CARTAS.forEach((c) => (estado[c.id] = false));
    return estado;
  }

  function cargar() {
    try {
      const guardado = localStorage.getItem(CLAVE_PROGRESO);
      if (!guardado) return estadoPorDefecto();
      const datos = JSON.parse(guardado);
      const base = estadoPorDefecto();
      return Object.assign(base, datos);
    } catch (e) {
      return estadoPorDefecto();
    }
  }

  let estado = cargar();

  function guardar() {
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(estado));
  }

  return {
    estaDesbloqueada(id) {
      return !!estado[id];
    },
    desbloquear(id) {
      estado[id] = true;
      guardar();
    },
    completadas() {
      return Object.values(estado).filter(Boolean).length;
    },
    total() {
      return CARTAS.length;
    },
    todasCompletas() {
      return this.completadas() === this.total();
    },
    reiniciar() {
      estado = estadoPorDefecto();
      guardar();
    }
  };
})();

/* ============================================================
   Utilidad: normaliza texto (minúsculas, sin acentos) para
   comparar respuestas de forma flexible.
   ============================================================ */
function normalizarTexto(txt) {
  return txt
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ============================================================
   1) ROMPECABEZAS — piezas que se intercambian tocando/arrastrando
   ============================================================ */
function iniciarPuzzle(cont, onVictoria) {
  const TAMANIO = 3; // 3x3
  const total = TAMANIO * TAMANIO;
  let piezas = [...Array(total).keys()];

  // Baraja hasta que quede distinto del orden correcto
  do {
    for (let i = piezas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piezas[i], piezas[j]] = [piezas[j], piezas[i]];
    }
  } while (piezas.every((v, i) => v === i));

  let seleccion = null;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>🧩 Rompecabezas</h2>
      <p>Toca dos piezas para intercambiarlas hasta reconstruir la imagen.</p>
    </div>
    <div class="puzzle-tablero" id="puzzleTablero"></div>
  `;

  const tablero = cont.querySelector("#puzzleTablero");

  function render() {
    tablero.innerHTML = "";
    piezas.forEach((correctIdx, pos) => {
      const fila = Math.floor(correctIdx / TAMANIO);
      const col = correctIdx % TAMANIO;
      const pieza = document.createElement("div");
      pieza.className = "puzzle-pieza";
      pieza.draggable = true;
      pieza.style.backgroundPosition = `${(col * 100) / (TAMANIO - 1)}% ${(fila * 100) / (TAMANIO - 1)}%`;
      pieza.dataset.pos = pos;
      if (seleccion === pos) pieza.classList.add("puzzle-seleccionada");

      pieza.addEventListener("click", () => manejarSeleccion(pos));
      pieza.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", pos);
      });
      pieza.addEventListener("dragover", (e) => e.preventDefault());
      pieza.addEventListener("drop", (e) => {
        e.preventDefault();
        const origen = parseInt(e.dataTransfer.getData("text/plain"), 10);
        intercambiar(origen, pos);
      });

      tablero.appendChild(pieza);
    });
  }

  function manejarSeleccion(pos) {
    AudioSystem.click();
    if (seleccion === null) {
      seleccion = pos;
      render();
      return;
    }
    if (seleccion === pos) {
      seleccion = null;
      render();
      return;
    }
    intercambiar(seleccion, pos);
    seleccion = null;
  }

  function intercambiar(a, b) {
    [piezas[a], piezas[b]] = [piezas[b], piezas[a]];
    render();
    comprobarVictoria();
  }

  function comprobarVictoria() {
    if (piezas.every((v, i) => v === i)) {
      render();
      setTimeout(() => onVictoria(), 350);
    }
  }

  render();
}

/* ============================================================
   2) MEMORIA — encontrar parejas de emojis
   ============================================================ */
function iniciarMemoria(cont, onVictoria) {
  const emojis = ["❤️", "🌙", "⭐", "🦋", "🌸", "🎀"];
  let cartas = [...emojis, ...emojis]
    .map((e) => ({ emoji: e, volteada: false, resuelta: false }))
    .sort(() => Math.random() - 0.5);

  let primera = null;
  let segunda = null;
  let bloqueado = false;
  let movimientos = 0;
  let parejasEncontradas = 0;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>😍 Encuentra la pareja</h2>
      <p>Movimientos: <span id="memMovs">0</span> — Parejas: <span id="memParejas">0</span>/${emojis.length}</p>
    </div>
    <div class="memoria-tablero" id="memoriaTablero"></div>
  `;

  const tablero = cont.querySelector("#memoriaTablero");
  const spanMovs = cont.querySelector("#memMovs");
  const spanParejas = cont.querySelector("#memParejas");

  function render() {
    tablero.innerHTML = "";
    cartas.forEach((c, idx) => {
      const el = document.createElement("button");
      el.className = "memoria-carta" + (c.volteada || c.resuelta ? " volteada" : "");
      el.innerHTML = `<span class="memoria-cara">${c.volteada || c.resuelta ? c.emoji : "✦"}</span>`;
      if (!c.resuelta) {
        el.addEventListener("click", () => voltear(idx));
      } else {
        el.classList.add("memoria-resuelta");
      }
      tablero.appendChild(el);
    });
  }

  function voltear(idx) {
    if (bloqueado || cartas[idx].volteada || cartas[idx].resuelta) return;
    AudioSystem.click();
    cartas[idx].volteada = true;

    if (primera === null) {
      primera = idx;
      render();
      return;
    }

    segunda = idx;
    render();
    movimientos++;
    spanMovs.textContent = movimientos;
    bloqueado = true;

    setTimeout(() => {
      if (cartas[primera].emoji === cartas[segunda].emoji) {
        cartas[primera].resuelta = true;
        cartas[segunda].resuelta = true;
        parejasEncontradas++;
        spanParejas.textContent = parejasEncontradas;
        AudioSystem.exito();
        if (parejasEncontradas === emojis.length) {
          setTimeout(() => onVictoria(), 400);
        }
      } else {
        cartas[primera].volteada = false;
        cartas[segunda].volteada = false;
      }
      primera = null;
      segunda = null;
      bloqueado = false;
      render();
    }, 700);
  }

  render();
}

/* ============================================================
   3) ADIVINANZAS
   ============================================================ */
function iniciarAdivinanzas(cont, onVictoria) {
  const preguntas = [
    {
      texto: "Siempre estoy contigo, pero no puedes verme. Crezco en silencio con cada momento bonito. ¿Qué soy?",
      opciones: ["El tiempo", "Un cariño que crece", "El viento", "Un secreto"],
      correcta: 1
    },
    {
      texto: "No tengo forma, pero puedo llenar un cuarto entero cuando entras. ¿Qué soy?",
      opciones: ["Una sombra", "Una sonrisa", "Un eco", "Una alegría"],
      correcta: 3
    },
    {
      texto: "Cuanto más se comparte, más grande se vuelve. ¿Qué es?",
      opciones: ["El cariño", "El dinero", "El tiempo libre", "La comida"],
      correcta: 0
    },
    {
      texto: "Puede decirse sin hablar, con solo una mirada. ¿Qué es?",
      opciones: ["Un chiste", "Un 'te quiero'", "Una duda", "Un adiós"],
      correcta: 1
    }
  ];

  let idx = 0;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>🧠 Adivinanzas</h2>
      <p>Pregunta <span id="advActual">1</span>/${preguntas.length}</p>
    </div>
    <div class="adivinanza-caja" id="adivinanzaCaja"></div>
  `;

  const caja = cont.querySelector("#adivinanzaCaja");
  const spanActual = cont.querySelector("#advActual");

  function render() {
    const p = preguntas[idx];
    spanActual.textContent = idx + 1;
    caja.innerHTML = `
      <p class="adivinanza-texto">${p.texto}</p>
      <div class="opciones-lista" id="advOpciones"></div>
      <p class="adivinanza-feedback" id="advFeedback"></p>
    `;
    const contOpciones = caja.querySelector("#advOpciones");
    const feedback = caja.querySelector("#advFeedback");

    p.opciones.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "opcion-btn-juego";
      btn.textContent = op;
      btn.addEventListener("click", () => {
        if (i === p.correcta) {
          AudioSystem.exito();
          btn.classList.add("opcion-correcta");
          feedback.textContent = "¡Correcto! ❤️";
          feedback.className = "adivinanza-feedback ok";
          Array.from(contOpciones.children).forEach((b) => (b.disabled = true));
          setTimeout(() => {
            idx++;
            if (idx >= preguntas.length) {
              onVictoria();
            } else {
              render();
            }
          }, 700);
        } else {
          AudioSystem.error();
          btn.classList.add("opcion-incorrecta");
          feedback.textContent = "Casi... intenta nuevamente.";
          feedback.className = "adivinanza-feedback error";
          Animaciones.sacudir(btn);
          setTimeout(() => btn.classList.remove("opcion-incorrecta"), 400);
        }
      });
      contOpciones.appendChild(btn);
    });
  }

  render();
}

/* ============================================================
   4) LA PALABRA SECRETA
   ============================================================ */
function iniciarPalabraSecreta(cont, onVictoria) {
  const PALABRA = "AMOR"; // <- fácil de cambiar
  const PISTAS = [
    "Es algo que puede hacer que un día normal sea especial.",
    "Puede aparecer cuando dos personas se conocen.",
    "Empieza con la letra A."
  ];

  let pistaActual = 0;
  let intentos = 0;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>🔐 La palabra secreta</h2>
      <p>Descubre la palabra. Intentos: <span id="psIntentos">0</span></p>
    </div>
    <div class="palabra-caja">
      <p class="palabra-espacios" id="psEspacios"></p>
      <p class="palabra-pista" id="psPista"></p>
      <button class="btn-secundario" id="psVerPista">Ver otra pista</button>
      <div class="palabra-input-fila">
        <input type="text" id="psInput" class="palabra-input" placeholder="Escribe tu respuesta" autocomplete="off">
        <button class="btn-primario" id="psComprobar">Comprobar</button>
      </div>
      <p class="palabra-feedback" id="psFeedback"></p>
    </div>
  `;

  const espacios = cont.querySelector("#psEspacios");
  const pistaEl = cont.querySelector("#psPista");
  const btnPista = cont.querySelector("#psVerPista");
  const input = cont.querySelector("#psInput");
  const btnComprobar = cont.querySelector("#psComprobar");
  const feedback = cont.querySelector("#psFeedback");
  const spanIntentos = cont.querySelector("#psIntentos");

  espacios.textContent = PALABRA.split("").map(() => "_").join(" ");
  pistaEl.textContent = "Pista 1: " + PISTAS[0];

  btnPista.addEventListener("click", () => {
    AudioSystem.click();
    if (pistaActual < PISTAS.length - 1) {
      pistaActual++;
      pistaEl.textContent = `Pista ${pistaActual + 1}: ${PISTAS[pistaActual]}`;
    } else {
      pistaEl.textContent = "Ya has visto todas las pistas disponibles.";
    }
  });

  function comprobar() {
    intentos++;
    spanIntentos.textContent = intentos;
    if (normalizarTexto(input.value) === normalizarTexto(PALABRA)) {
      AudioSystem.exito();
      espacios.textContent = PALABRA;
      feedback.textContent = "¡Correcto! ❤️";
      feedback.className = "palabra-feedback ok";
      input.disabled = true;
      btnComprobar.disabled = true;
      setTimeout(() => onVictoria(), 700);
    } else {
      AudioSystem.error();
      feedback.textContent = "No es esa palabra... intenta de nuevo.";
      feedback.className = "palabra-feedback error";
      Animaciones.sacudir(input);
    }
  }

  btnComprobar.addEventListener("click", comprobar);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") comprobar();
  });
}

/* ============================================================
   5) ATRAPA LOS CORAZONES
   ============================================================ */
function iniciarCorazones(cont, onVictoria) {
  const META = 15;
  const TIEMPO_INICIAL = 25;

  let atrapados = 0;
  let tiempoRestante = TIEMPO_INICIAL;
  let intervaloSpawn = null;
  let intervaloTiempo = null;
  let activo = true;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>❤️ Atrapa los corazones</h2>
      <p>Corazones: <span id="corAtrapados">0</span>/${META} — Tiempo: <span id="corTiempo">${TIEMPO_INICIAL}</span>s</p>
    </div>
    <div class="corazones-area" id="corazonesArea"></div>
    <div id="corazonesFin"></div>
  `;

  const area = cont.querySelector("#corazonesArea");
  const spanAtrapados = cont.querySelector("#corAtrapados");
  const spanTiempo = cont.querySelector("#corTiempo");
  const zonaFin = cont.querySelector("#corazonesFin");

  function spawnCorazon() {
    if (!activo) return;
    const corazon = document.createElement("button");
    corazon.className = "corazon-clic";
    corazon.textContent = "❤️";
    const maxX = area.clientWidth - 40;
    const maxY = area.clientHeight - 40;
    corazon.style.left = Math.max(0, Math.random() * maxX) + "px";
    corazon.style.top = Math.max(0, Math.random() * maxY) + "px";

    corazon.addEventListener("click", () => {
      if (!activo) return;
      AudioSystem.click();
      atrapados++;
      spanAtrapados.textContent = atrapados;
      corazon.remove();
      if (atrapados >= META) {
        finalizar(true);
      }
    });

    area.appendChild(corazon);
    setTimeout(() => corazon.remove(), 1800);
  }

  function finalizar(gano) {
    activo = false;
    clearInterval(intervaloSpawn);
    clearInterval(intervaloTiempo);
    area.innerHTML = "";

    if (gano) {
      AudioSystem.exito();
      setTimeout(() => onVictoria(), 400);
    } else {
      AudioSystem.error();
      zonaFin.innerHTML = `
        <p class="corazones-mensaje">Se acabó el tiempo... ¡Puedes intentarlo de nuevo!</p>
        <button class="btn-primario" id="corReintentar">Reintentar</button>
      `;
      zonaFin.querySelector("#corReintentar").addEventListener("click", () => {
        zonaFin.innerHTML = "";
        iniciarCorazones(cont, onVictoria);
      });
    }
  }

  intervaloSpawn = setInterval(spawnCorazon, 700);
  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    spanTiempo.textContent = tiempoRestante;
    if (tiempoRestante <= 0) finalizar(false);
  }, 1000);
}

/* ============================================================
   6) PREGUNTA ESPECIAL
   ============================================================ */
function iniciarPreguntaEspecial(cont, onVictoria) {
  cont.innerHTML = `
    <div class="pregunta-especial">
      <h2>¿Estás lista para descubrir algo que alguien preparó especialmente para ti?</h2>
      <div class="pregunta-botones">
        <button class="btn-primario" id="peSi">Sí ❤️</button>
        <button class="btn-primario" id="peClaro">Por supuesto ✨</button>
      </div>
    </div>
  `;

  cont.querySelector("#peSi").addEventListener("click", () => {
    AudioSystem.exito();
    Animaciones.lluviaCorazones(24);
    setTimeout(() => onVictoria(), 1400);
  });

  cont.querySelector("#peClaro").addEventListener("click", () => {
    AudioSystem.exito();
    Animaciones.explosionEstrellas(28);
    setTimeout(() => onVictoria(), 1400);
  });
}

/* ============================================================
   7) EL ACERTIJO
   ============================================================ */
function iniciarAcertijo(cont, onVictoria) {
  const objetos = [
    { icono: "📖", pista: "En estas páginas guardo recuerdos que no quiero olvidar." },
    { icono: "🕯️", pista: "Doy calidez incluso en los días más oscuros." },
    { icono: "🪞", pista: "Muéstrame y verás algo que alguien más admira todos los días." },
    { icono: "📦", pista: "Dentro de mí guardo lo más valioso: no se ve, pero se siente." }
  ];
  const RESPUESTA = "corazon";

  let descubiertos = new Set();

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>🕵️ El acertijo</h2>
      <p>Toca los objetos de la habitación para encontrar pistas.</p>
    </div>
    <div class="acertijo-habitacion" id="acertijoHabitacion"></div>
    <div class="acertijo-respuesta">
      <p class="acertijo-enunciado">"Vive en tu pecho, no se ve pero se siente, crece contigo y a veces duele con solo pensar en alguien. ¿Qué es?"</p>
      <div class="palabra-input-fila">
        <input type="text" id="acRespuesta" class="palabra-input" placeholder="Tu respuesta" autocomplete="off">
        <button class="btn-primario" id="acComprobar">Comprobar</button>
      </div>
      <p class="palabra-feedback" id="acFeedback"></p>
    </div>
  `;

  const habitacion = cont.querySelector("#acertijoHabitacion");
  const input = cont.querySelector("#acRespuesta");
  const feedback = cont.querySelector("#acFeedback");

  objetos.forEach((obj, idx) => {
    const btn = document.createElement("button");
    btn.className = "acertijo-objeto";
    btn.textContent = obj.icono;
    btn.addEventListener("click", () => {
      AudioSystem.click();
      if (!descubiertos.has(idx)) {
        descubiertos.add(idx);
        btn.classList.add("acertijo-objeto-visto");
      }
      let pistasHtml = "";
      descubiertos.forEach((i) => (pistasHtml += `<p class="acertijo-pista">• ${objetos[i].pista}</p>`));
      let cajaPistas = habitacion.querySelector(".acertijo-pistas");
      if (!cajaPistas) {
        cajaPistas = document.createElement("div");
        cajaPistas.className = "acertijo-pistas";
        habitacion.appendChild(cajaPistas);
      }
      cajaPistas.innerHTML = pistasHtml;
    });
    habitacion.appendChild(btn);
  });

  function comprobar() {
    if (normalizarTexto(input.value) === RESPUESTA) {
      AudioSystem.exito();
      feedback.textContent = "¡Correcto! ❤️";
      feedback.className = "palabra-feedback ok";
      input.disabled = true;
      setTimeout(() => onVictoria(), 700);
    } else {
      AudioSystem.error();
      feedback.textContent = "No es eso... busca más pistas e intenta de nuevo.";
      feedback.className = "palabra-feedback error";
      Animaciones.sacudir(input);
    }
  }

  cont.querySelector("#acComprobar").addEventListener("click", comprobar);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") comprobar();
  });
}

/* ============================================================
   8) LABERINTO
   ============================================================ */
function iniciarLaberinto(cont, onVictoria) {
  // 0 = camino libre, 1 = pared
  const MAPA = [
    [0, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 0, 0]
  ];
  const FILAS = MAPA.length;
  const COLS = MAPA[0].length;
  const INICIO = { f: 0, c: 0 };
  const META = { f: 7, c: 7 };

  let jugador = { ...INICIO };
  let segundos = 0;
  let intervaloTiempo = null;
  let terminado = false;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>🌀 Laberinto</h2>
      <p>Usa las flechas o WASD para llegar a la meta 🌟. Tiempo: <span id="labTiempo">0</span>s</p>
    </div>
    <div class="laberinto-tablero" id="labTablero" style="grid-template-columns: repeat(${COLS}, 1fr);"></div>
    <div class="laberinto-controles" id="labControles">
      <div></div><button data-dir="arriba">▲</button><div></div>
      <button data-dir="izquierda">◀</button><div></div><button data-dir="derecha">▶</button>
      <div></div><button data-dir="abajo">▼</button><div></div>
    </div>
    <div id="labMensaje"></div>
  `;

  const tablero = cont.querySelector("#labTablero");
  const spanTiempo = cont.querySelector("#labTiempo");
  const mensaje = cont.querySelector("#labMensaje");

  function render() {
    tablero.innerHTML = "";
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLS; c++) {
        const celda = document.createElement("div");
        celda.className = "laberinto-celda";
        if (MAPA[f][c] === 1) celda.classList.add("pared");
        if (f === META.f && c === META.c) celda.textContent = "🌟";
        if (f === jugador.f && c === jugador.c) celda.classList.add("jugador");
        tablero.appendChild(celda);
      }
    }
  }

  function mover(df, dc) {
    if (terminado) return;
    const nf = jugador.f + df;
    const nc = jugador.c + dc;
    if (nf < 0 || nc < 0 || nf >= FILAS || nc >= COLS) return;
    if (MAPA[nf][nc] === 1) return;
    jugador = { f: nf, c: nc };
    AudioSystem.click();
    render();
    if (jugador.f === META.f && jugador.c === META.c) {
      terminado = true;
      clearInterval(intervaloTiempo);
      AudioSystem.exito();
      mensaje.innerHTML = `<p class="laberinto-victoria">Encontraste el camino ❤️</p>`;
      setTimeout(() => onVictoria(), 900);
    }
  }

  function manejarTecla(e) {
    const teclas = {
      ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
      ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
      ArrowLeft: [0, -1], a: [0, -1], A: [0, -1],
      ArrowRight: [0, 1], d: [0, 1], D: [0, 1]
    };
    if (teclas[e.key]) {
      e.preventDefault();
      mover(...teclas[e.key]);
    }
  }

  document.addEventListener("keydown", manejarTecla);

  cont.querySelectorAll("#labControles button").forEach((btn) => {
    const mapaDir = { arriba: [-1, 0], abajo: [1, 0], izquierda: [0, -1], derecha: [0, 1] };
    btn.addEventListener("click", () => mover(...mapaDir[btn.dataset.dir]));
  });

  // Limpieza del listener de teclado al salir del minijuego
  const observer = new MutationObserver(() => {
    if (!document.body.contains(cont)) {
      document.removeEventListener("keydown", manejarTecla);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  intervaloTiempo = setInterval(() => {
    segundos++;
    spanTiempo.textContent = segundos;
  }, 1000);

  render();
}

/* ============================================================
   9) COMPLETA LA FRASE
   ============================================================ */
function iniciarFrase(cont, onVictoria) {
  const frases = [
    {
      inicio: "Desde que llegaste a mi vida, ",
      opciones: ["todo se complicó", "los días son más bonitos", "nada cambió", "empecé a dormir peor"],
      correcta: 1
    },
    {
      inicio: "Tu sonrisa es capaz de ",
      opciones: ["arruinar mi día", "arreglar cualquier mal día", "pasar desapercibida", "no significar nada"],
      correcta: 1
    },
    {
      inicio: "Cuando pienso en el futuro, ",
      opciones: ["prefiero no pensarlo", "me imagino lejos de todos", "me gusta imaginarte cerca", "no pienso en nada"],
      correcta: 2
    },
    {
      inicio: "Lo que más valoro de ti es ",
      opciones: ["tu forma de cuidar a quienes quieres", "que casi no hablamos", "nada en particular", "tu indiferencia"],
      correcta: 0
    },
    {
      inicio: "Contigo cerca, hasta lo difícil ",
      opciones: ["se vuelve imposible", "se siente más ligero", "empeora", "deja de importar"],
      correcta: 1
    }
  ];

  let idx = 0;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>💭 Completa la frase</h2>
      <p>Frase <span id="fraseActual">1</span>/${frases.length}</p>
    </div>
    <div class="adivinanza-caja" id="fraseCaja"></div>
  `;

  const caja = cont.querySelector("#fraseCaja");
  const spanActual = cont.querySelector("#fraseActual");

  function render() {
    const f = frases[idx];
    spanActual.textContent = idx + 1;
    caja.innerHTML = `
      <p class="adivinanza-texto">"${f.inicio}________."</p>
      <div class="opciones-lista" id="fraseOpciones"></div>
      <p class="adivinanza-feedback" id="fraseFeedback"></p>
    `;
    const contOpciones = caja.querySelector("#fraseOpciones");
    const feedback = caja.querySelector("#fraseFeedback");

    f.opciones.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "opcion-btn-juego";
      btn.textContent = op;
      btn.addEventListener("click", () => {
        if (i === f.correcta) {
          AudioSystem.exito();
          btn.classList.add("opcion-correcta");
          feedback.textContent = "¡Bonita elección! ❤️";
          feedback.className = "adivinanza-feedback ok";
          Array.from(contOpciones.children).forEach((b) => (b.disabled = true));
          setTimeout(() => {
            idx++;
            if (idx >= frases.length) {
              onVictoria();
            } else {
              render();
            }
          }, 700);
        } else {
          AudioSystem.error();
          btn.classList.add("opcion-incorrecta");
          feedback.textContent = "Casi... intenta nuevamente.";
          feedback.className = "adivinanza-feedback error";
          Animaciones.sacudir(btn);
          setTimeout(() => btn.classList.remove("opcion-incorrecta"), 400);
        }
      });
      contOpciones.appendChild(btn);
    });
  }

  render();
}

/* ============================================================
   10) CONSTELACIÓN DE RECUERDOS
   ============================================================ */
function iniciarConstelacion(cont, onVictoria) {
  // Coordenadas (en %) de las estrellas que forman un corazón,
  // en el orden en que deben conectarse.
  const ESTRELLAS_CORAZON = [
    { x: 50, y: 25, palabra: "sonríe" },
    { x: 35, y: 15, palabra: "luz" },
    { x: 20, y: 25, palabra: "momentos" },
    { x: 15, y: 42, palabra: "risa" },
    { x: 50, y: 70, palabra: "especial" },
    { x: 85, y: 42, palabra: "siempre" },
    { x: 80, y: 25, palabra: "cerca" },
    { x: 65, y: 15, palabra: "hogar" }
  ];

  // Estrellas decorativas (sin palabra, solo ambiente)
  const ESTRELLAS_DECORATIVAS = 40;

  let siguienteIndice = 0;
  let clicksEasterEgg = 0;

  cont.innerHTML = `
    <div class="mj-encabezado">
      <h2>✨ Constelación de recuerdos</h2>
      <p>Toca las estrellas brillantes en orden para formar la constelación.</p>
    </div>
    <div class="constelacion-cielo" id="constCielo">
      <svg class="constelacion-lineas" id="constLineas" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
    </div>
    <div class="constelacion-palabras" id="constPalabras"></div>
  `;

  const cielo = cont.querySelector("#constCielo");
  const svg = cont.querySelector("#constLineas");
  const palabrasCont = cont.querySelector("#constPalabras");

  // Estrellas decorativas de fondo
  for (let i = 0; i < ESTRELLAS_DECORATIVAS; i++) {
    const d = document.createElement("div");
    d.className = "constelacion-estrella-deco";
    d.style.left = Math.random() * 100 + "%";
    d.style.top = Math.random() * 100 + "%";
    d.style.animationDelay = Math.random() * 3 + "s";
    cielo.appendChild(d);
  }

  ESTRELLAS_CORAZON.forEach((estrella, idx) => {
    const btn = document.createElement("button");
    btn.className = "constelacion-estrella";
    btn.style.left = estrella.x + "%";
    btn.style.top = estrella.y + "%";
    btn.dataset.idx = idx;

    btn.addEventListener("click", () => {
      // Easter egg: 5 clics rápidos sobre la primera estrella
      if (idx === 0) {
        clicksEasterEgg++;
        if (clicksEasterEgg === 5) {
          mostrarSecreto();
        }
      }

      if (idx !== siguienteIndice) {
        AudioSystem.error();
        Animaciones.sacudir(btn);
        return;
      }

      AudioSystem.click();
      btn.classList.add("constelacion-encendida");

      const palabra = document.createElement("span");
      palabra.className = "constelacion-palabra-item";
      palabra.textContent = estrella.palabra;
      palabrasCont.appendChild(palabra);

      if (siguienteIndice > 0) {
        const anterior = ESTRELLAS_CORAZON[siguienteIndice - 1];
        const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linea.setAttribute("x1", anterior.x);
        linea.setAttribute("y1", anterior.y);
        linea.setAttribute("x2", estrella.x);
        linea.setAttribute("y2", estrella.y);
        linea.setAttribute("class", "constelacion-linea");
        svg.appendChild(linea);
      }

      siguienteIndice++;

      if (siguienteIndice === ESTRELLAS_CORAZON.length) {
        // Cierra la figura del corazón
        const primera = ESTRELLAS_CORAZON[0];
        const ultima = ESTRELLAS_CORAZON[ESTRELLAS_CORAZON.length - 1];
        const cierre = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cierre.setAttribute("x1", ultima.x);
        cierre.setAttribute("y1", ultima.y);
        cierre.setAttribute("x2", primera.x);
        cierre.setAttribute("y2", primera.y);
        cierre.setAttribute("class", "constelacion-linea");
        svg.appendChild(cierre);

        AudioSystem.victoria();
        Animaciones.explosionEstrellas(30);
        setTimeout(() => onVictoria(), 1600);
      }
    });

    cielo.appendChild(btn);
  });

  function mostrarSecreto() {
    const toast = document.createElement("div");
    toast.className = "easter-egg-toast";
    toast.textContent = "✨ Encontraste un secreto: gracias por jugar con tanto cariño. ✨";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("mostrar"), 20);
    setTimeout(() => {
      toast.classList.remove("mostrar");
      setTimeout(() => toast.remove(), 600);
    }, 3200);
  }
}

/* ============================================================
   Registro de minijuegos disponibles
   ============================================================ */
const MINIJUEGOS = {
  puzzle: iniciarPuzzle,
  memoria: iniciarMemoria,
  adivinanzas: iniciarAdivinanzas,
  palabra: iniciarPalabraSecreta,
  corazones: iniciarCorazones,
  pregunta: iniciarPreguntaEspecial,
  acertijo: iniciarAcertijo,
  laberinto: iniciarLaberinto,
  frase: iniciarFrase,
  constelacion: iniciarConstelacion
};
