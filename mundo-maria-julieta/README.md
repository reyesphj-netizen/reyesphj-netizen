# Tu propio mundo — Maria Julieta ❤️

Una pequeña aventura interactiva tipo videojuego/dedicatoria romántica, hecha con **HTML5, CSS3 y JavaScript vanilla** (sin frameworks ni backend).

La persona que juega debe superar 10 minijuegos para desbloquear 10 cartas, cada una con un mensaje especial. El progreso se guarda en el navegador (localStorage), así que si se cierra la página, todo lo desbloqueado sigue ahí la próxima vez.

## 1. Descripción

- Pantalla de bienvenida animada.
- Mapa principal con 10 cartas (bloqueadas/desbloqueadas).
- 10 minijuegos distintos, cada uno desbloquea su carta al completarse.
- Sistema de progreso con barra visual y guardado en `localStorage`.
- Efectos: lluvia de corazones, confeti, explosión de estrellas, destellos, partículas de fondo con parallax.
- Sonido generado con Web Audio API (sin archivos de audio externos), con botón de encendido/apagado.
- Botón para reiniciar la aventura (borra el progreso, pide confirmación).
- Diseño responsive (PC, tablet, celular).
- Un pequeño easter egg secreto en el último minijuego (constelación).

## 2. Tecnologías utilizadas

- HTML5
- CSS3 (glassmorphism, gradientes, animaciones, `backdrop-filter`)
- JavaScript vanilla (ES6+)
- Web Audio API
- `localStorage` para persistencia de progreso

No se usa React, Vue, Angular, TypeScript, Tailwind, Bootstrap ni ninguna librería externa. No requiere servidor ni backend.

## 3. Estructura del proyecto

```
/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── cards.js        → datos de las cartas y sus mensajes
│   ├── audio.js         → sistema de sonido (Web Audio API)
│   ├── animations.js    → efectos visuales reutilizables
│   ├── game.js           → progreso (localStorage) + los 10 minijuegos
│   └── main.js            → navegación entre pantallas
└── assets/
    ├── images/           → (opcional) imágenes personalizadas
    ├── sounds/           → (opcional) sonidos personalizados
    └── icons/            → (opcional) íconos personalizados
```

## 4. Cómo ejecutarlo localmente

No necesitas instalar nada. Simplemente:

1. Descarga o clona la carpeta del proyecto.
2. Abre el archivo `index.html` directamente con doble clic, o arrástralo a tu navegador.

Si tu navegador bloquea algo por seguridad al abrir el archivo directamente (poco común, ya que el proyecto no usa `fetch` ni módulos), también puedes servirlo con un servidor local simple, por ejemplo:

```bash
# Con Python instalado
python3 -m http.server 8000
# Luego abre http://localhost:8000 en tu navegador
```

## 5. Cómo publicarlo con GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `mundo-maria-julieta`).
2. Sube todos los archivos del proyecto tal cual están (manteniendo la estructura de carpetas).
3. Ve a **Settings → Pages** en tu repositorio.
4. En "Source", selecciona la rama `main` (o `master`) y la carpeta `/root`.
5. Guarda los cambios. GitHub te dará una URL parecida a:
   `https://tu-usuario.github.io/mundo-maria-julieta/`
6. Espera uno o dos minutos y abre esa URL — tu aventura ya estará publicada.

## 6. Cómo cambiar los mensajes de las cartas

Abre `js/cards.js`. Ahí encontrarás un arreglo llamado `CARTAS`, con un objeto por cada carta:

```js
{
  id: 1,
  titulo: "El comienzo",
  icono: "🧩",
  minijuego: "puzzle",
  nombreMinijuego: "Rompecabezas",
  mensaje: "Aquí va el texto que quieras..."
}
```

Solo edita el texto dentro de `mensaje` (y `titulo` si quieres cambiar el encabezado de esa carta). No necesitas tocar ningún otro archivo.

También puedes cambiar el mensaje final de la aventura editando la constante `MENSAJE_FINAL`, al final del mismo archivo.

## 7. Cómo cambiar las preguntas y respuestas de los minijuegos

Todos los minijuegos están definidos en `js/game.js`, cada uno en su propia función:

| Minijuego | Función | Qué puedes cambiar |
|---|---|---|
| Rompecabezas | `iniciarPuzzle` | El "dibujo" está hecho con gradientes CSS en `style.css` (clase `.puzzle-pieza`); puedes reemplazarlo por una imagen real (ver sección 8). |
| Encuentra la pareja | `iniciarMemoria` | El arreglo `emojis` al inicio de la función. |
| Adivinanzas | `iniciarAdivinanzas` | El arreglo `preguntas` (texto, opciones y el índice de la opción correcta). |
| La palabra secreta | `iniciarPalabraSecreta` | Las constantes `PALABRA` y `PISTAS`. |
| Atrapa los corazones | `iniciarCorazones` | Las constantes `META` (corazones a atrapar) y `TIEMPO_INICIAL` (segundos). |
| Pregunta especial | `iniciarPreguntaEspecial` | El texto de la pregunta y de los botones directamente en el HTML de la función. |
| El acertijo | `iniciarAcertijo` | El arreglo `objetos` (pistas) y la constante `RESPUESTA`. |
| Laberinto | `iniciarLaberinto` | La matriz `MAPA` (0 = camino, 1 = pared), y los objetos `INICIO`/`META`. |
| Completa la frase | `iniciarFrase` | El arreglo `frases` (inicio de frase, opciones y opción correcta). |
| Constelación de recuerdos | `iniciarConstelacion` | El arreglo `ESTRELLAS_CORAZON` (posiciones en % y palabra de cada estrella). |

En cada caso, las respuestas correctas se indican con el **índice** dentro del arreglo de opciones (empezando en `0`).

## 8. Cómo cambiar imágenes y sonidos

### Imágenes

El rompecabezas usa un "dibujo" generado con gradientes CSS para no depender de archivos externos. Si quieres usar una foto o ilustración real:

1. Coloca tu imagen en `assets/images/` (por ejemplo `assets/images/puzzle.jpg`).
2. En `css/style.css`, busca la clase `.puzzle-pieza` y reemplaza el valor de `background-image` por:
   ```css
   background-image: url("../assets/images/puzzle.jpg");
   background-size: 300% 300%;
   ```

También puedes agregar imágenes decorativas dentro de cualquier carta editando su `mensaje` en `js/cards.js` con una etiqueta `<img>`, por ejemplo:
```js
mensaje: '<img src="assets/images/foto1.jpg" alt="Foto"><br>Tu mensaje aquí...'
```

### Sonidos

Actualmente todos los sonidos se generan con Web Audio API (no se necesitan archivos). Si prefieres usar tus propios archivos de audio:

1. Coloca tus archivos `.mp3` o `.wav` en `assets/sounds/`.
2. En `js/audio.js`, dentro de cada método (`click`, `exito`, `error`, `desbloqueo`, `victoria`), reemplaza la llamada a `tono(...)` por la reproducción de un `<audio>`, por ejemplo:
   ```js
   exito() {
     const audio = new Audio("assets/sounds/exito.mp3");
     if (this.estaHabilitado()) audio.play();
   }
   ```

## 9. Notas finales

- Todo el progreso vive en `localStorage`, bajo la clave `mj_progreso`. Borrar el progreso desde el botón ↺ (o vaciar el `localStorage` del navegador) reinicia la aventura.
- El proyecto es completamente estático: no requiere Node, npm ni ningún paso de compilación.
- Los 10 minijuegos son completamente jugables y cada uno desbloquea únicamente su propia carta al completarse correctamente.
