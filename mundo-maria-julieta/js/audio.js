/* ==========================================================
   audio.js
   Efectos de sonido generados con Web Audio API (sin archivos
   externos). Incluye un interruptor de sonido on/off que se
   guarda en localStorage.
   ========================================================== */

const AudioSystem = (() => {
  let ctx = null;
  let habilitado = localStorage.getItem("mj_sonido") !== "off";

  function obtenerContexto() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tono({ frecuencia = 440, duracion = 0.15, tipo = "sine", volumen = 0.15, retardo = 0 }) {
    if (!habilitado) return;
    try {
      const audioCtx = obtenerContexto();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = tipo;
      osc.frequency.value = frecuencia;
      const inicio = audioCtx.currentTime + retardo;
      gain.gain.setValueAtTime(0, inicio);
      gain.gain.linearRampToValueAtTime(volumen, inicio + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(inicio);
      osc.stop(inicio + duracion + 0.02);
    } catch (e) {
      /* silencioso: si el navegador bloquea audio sin interacción, no rompe el juego */
    }
  }

  return {
    click() {
      tono({ frecuencia: 520, duracion: 0.08, tipo: "triangle", volumen: 0.12 });
    },
    exito() {
      tono({ frecuencia: 523, duracion: 0.12, tipo: "sine", volumen: 0.15 });
      tono({ frecuencia: 659, duracion: 0.14, tipo: "sine", volumen: 0.15, retardo: 0.1 });
    },
    error() {
      tono({ frecuencia: 200, duracion: 0.18, tipo: "sawtooth", volumen: 0.1 });
    },
    desbloqueo() {
      tono({ frecuencia: 440, duracion: 0.12, tipo: "sine", volumen: 0.14 });
      tono({ frecuencia: 554, duracion: 0.12, tipo: "sine", volumen: 0.14, retardo: 0.12 });
      tono({ frecuencia: 659, duracion: 0.2, tipo: "sine", volumen: 0.16, retardo: 0.24 });
    },
    victoria() {
      const notas = [523, 587, 659, 784, 880];
      notas.forEach((f, i) => tono({ frecuencia: f, duracion: 0.18, tipo: "sine", volumen: 0.14, retardo: i * 0.11 }));
    },
    estaHabilitado() {
      return habilitado;
    },
    alternar() {
      habilitado = !habilitado;
      localStorage.setItem("mj_sonido", habilitado ? "on" : "off");
      return habilitado;
    }
  };
})();
