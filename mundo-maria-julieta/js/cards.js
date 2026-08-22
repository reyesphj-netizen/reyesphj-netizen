/* ==========================================================
   cards.js
   Datos de las 10 cartas: título, ícono, minijuego asociado
   y el mensaje que se revela al desbloquearlas.

   Para cambiar los mensajes, edita el campo "mensaje" de cada
   objeto. No necesitas tocar nada más del proyecto.
   ========================================================== */

const NOMBRE_JUGADORA = "Maria Julieta";

const CARTAS = [
  {
    id: 1,
    titulo: "El comienzo",
    icono: "🧩",
    minijuego: "puzzle",
    nombreMinijuego: "Rompecabezas",
    mensaje:
      "Sé que ahora algunas piezas de tu vida parecen no encajar, pero no tienes que resolverlo todo de una vez. " +
      "Ve a tu ritmo, descansa cuando lo necesites y recuerda que los momentos difíciles también pasan. " +
      "Confía en ti, poco a poco todo volverá a encontrar su lugar. ❤️, " + NOMBRE_JUGADORA + "."
  },
  {
    id: 2,
    titulo: "Lo que recuerdo",
    icono: "😍",
    minijuego: "memoria",
    nombreMinijuego: "Encuentra la pareja",
    mensaje:
      "Tengo guardados tantos pequeños momentos contigo que a veces ni yo mismo puedo creerlo. " +
      "No hace falta verte para recordar cómo una palabra, una risa o un simple gesto tuyo puede cambiar por completo el color de un día. " +
      "Cada recuerdo contigo tiene algo especial, y por eso merece ser guardado con mucho cariño. 🥺 "
  },
  {
    id: 3,
    titulo: "Lo que siento",
    icono: "🧠",
    minijuego: "adivinanzas",
    nombreMinijuego: "Adivinanzas",
    mensaje:
      "Hay cosas que son difíciles de explicar con palabras, pero muy fáciles de sentir. Y tú eres una de ellas. " +
      "Quizás no siempre encuentre las palabras exactas para decirte lo especial e importante que eres para mí, " +
      "pero espero que puedas sentirlo en cada pequeño detalle con el que intento cuidarte y estar para ti. 🥺"
  },
  {
    id: 4,
    titulo: "La palabra",
    icono: "🔐",
    minijuego: "palabra",
    nombreMinijuego: "La palabra secreta",
    mensaje:
      "Admiración. Esa es una de las palabras que quizá pocas veces te digo, pero que siento profundamente. " +
      "Admiro la persona que eres, tu forma de seguir adelante incluso cuando los días se ponen difíciles, y esa manera tan tuya de hacer que todo parezca facil. " +
      "Quizá no lo notes, pero eres mucho más especial de lo que imaginas. ❤️"
  },
  {
    id: 5,
    titulo: "Lo que atrapo",
    icono: "❤️",
    minijuego: "corazones",
    nombreMinijuego: "Atrapa los corazones",
    mensaje:
      "Si pudiera atrapar cada buen momento contigo y guardarlo en un frasco, " +
      "tendría una colección enorme de fragmentos que me conmueven de ti. Mientras tanto, sigo intentando crear más de ellos, " +
      "uno a la vez contigo, gracias por dejarte apreciar. "
  },
  {
    id: 6,
    titulo: "La pregunta",
    icono: "💌",
    minijuego: "pregunta",
    nombreMinijuego: "Pregunta especial",
    mensaje:
      "Gracias por decir que sí, aunque fuera solo a un juego. " +
      "Ojalá algún día sea igual de fácil decir que sí a todo lo bueno que mereces en esta vida, " +
      "porque yo pienso seguir aquí para acompañarte a encontrarlo. 🥹"
  },
  {
    id: 7,
    titulo: "El acertijo",
    icono: "🕵️",
    minijuego: "acertijo",
    nombreMinijuego: "El acertijo",
    mensaje:
      "No todo lo importante se encuentra a simple vista; algunas cosas solo se descubren cuando uno se queda y mira con atención. " +
      "Contigo aprendí que detrás de un simple “estoy bien” puede existir mucho más. " +
      "Y que vale la pena estar, escuchar y descubrir poco a poco todo lo bonito que llevas dentro. ❤️ "
  },
  {
    id: 8,
    titulo: "El camino",
    icono: "🌀",
    minijuego: "laberinto",
    nombreMinijuego: "Laberinto",
    mensaje:
      "Sé que no todos los caminos son fáciles y que, a veces, hasta el camino que parecía correcto puede hacerte sentir perdida. " +
      "Y aunque la distancia no siempre me permita estar a tu lado como quisiera, quiero que recuerdes algo: no tienes que atravesarlo todo sola. " +
      "Desde donde esté, siempre habrá alguien dispuesto a caminar contigo, aunque sea a la distancia. 🤍"
  },
  {
    id: 9,
    titulo: "La frase",
    icono: "💭",
    minijuego: "frase",
    nombreMinijuego: "Completa la frase",
    mensaje:
      "Desde que llegaste a mi vida, hasta los días más comunes tienen algo especial. " +
      "No hace falta que ocurra algo extraordinario para recordarte lo importante que eres para mí; " +
      "a veces basta un día cualquiera, una pequeña conversación o simplemente pensarte para agradecer que estés en mi vida. 🤍"
  },
  {
    id: 10,
    titulo: "La constelación",
    icono: "✨",
    minijuego: "constelacion",
    nombreMinijuego: "Constelación de recuerdos",
    mensaje:
      NOMBRE_JUGADORA + ", si unieras cada momento bonito que hemos vivido, " +
      "formarían algo tan grande como una constelación entera. " +
      "Gracias por sonreír, por ser luz incluso en tus días grises, " +
      "y por dejarme ser parte de tu historia. Esta aventura termina aquí, " +
      "pero me quedo con la suerte de haberte encontrado y con todos esos momentos que, " + 
      "de alguna manera, siempre tendrán un lugar especial en mi historia. 🥺"
  }
];

/* Mensaje final que se muestra al completar las 10 cartas */
// const MENSAJE_FINAL =
//   "Has llegado al final de tu aventura.\n\n" +
//   "Pero algunas historias no terminan aquí...\n\n" +
//   NOMBRE_JUGADORA + " ❤️\n\n" +
//   "Gracias por jugar, por sonreír en el camino y por dejarme construir " +
//   "este pequeño mundo para ti. Ojalá, cada vez que lo recorras, " +
//   "recuerdes lo especial que eres.";

const MENSAJE_FINAL =
  "Has llegado al final de tu aventura.\n\n" +

  "Pero algunas historias no terminan aquí...\n\n" +

  NOMBRE_JUGADORA + " ❤️\n\n" +

  "Quizás últimamente tus ojitos ya no brillan como antes, y aunque no siempre " +
  "pueda saber qué pasa detrás de esa sonrisa, quiero que recuerdes que no tienes " +
  "que atravesarlo todo sola.\n\n" +

  "No puedo prometer arreglar aquello que te duele, pero sí puedo quedarme, " +
  "escucharte y acompañarte cuando lo necesites. Porque te aprecio muchísimo, " +
  "y verte recuperar poco a poco esa luz que te hace ser tú también será una " +
  "alegría para mí.\n\n" +

  "Gracias por dejarme ser parte de tu historia y por permitirme construir " +
  "este pequeño mundo para ti. Ojalá, cada vez que lo recorras, recuerdes " +
  "algo muy importante: eres mucho más especial de lo que a veces alcanzas a ver. ❤️";