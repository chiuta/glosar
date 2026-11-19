# Registro de cambios

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · **Español** · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Sin publicar]

## [0.2.1] - 2026-11-20

### Cambiado
- fff-kit 1.8.1: cuando el navegador bloquea el almacenamiento o carece de él (`localStorage`/`sessionStorage` lanzan un error o no existen), la página arranca con un almacenamiento temporal en memoria en lugar de detenerse; los datos no se conservan al cerrar la página.
- fff-kit 1.8.1: la guía que amplía los controles pequeños a 44 px mide ahora también el ancho del cuerpo de la página y del elemento padre, de modo que una fila de botones ya no puede salirse de la pantalla (el grupo se deja intacto cuando la ampliación lo haría demasiado ancho).

## [0.2.0] - 2026-11-17

### Añadido
- El motor en `src/engine.mjs`: búsqueda sin tener en cuenta los diacríticos con ordenación, validación de entradas, duplicados, cobertura de la lista básica, exportación a TSV y Anki, archivo de contribución y analizador de listas pegadas.
- Exportación TSV para hojas de cálculo: una celda que empieza por `=`, `+`, `-` o `@` recibe un apóstrofo delante, para que Excel o LibreOffice no la ejecuten como fórmula (una palabra que de verdad empieza por `-` muestra, por tanto, el apóstrofo); el archivo de Anki escapa el HTML.
- La interfaz en `src/ui.js`, `src/i18n.mjs` y `src/app.css`: búsqueda, cobertura, alta (con grabación o subida), exportación y guía; ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho; lo que añades se queda en el navegador.
- Datos: el índice de idiomas `data/languages.json` (arrumano, megleno-rumano, istro-rumano, romaní, con dialectos ISO 639-3 y sistemas ortográficos), la lista de 50 conceptos básicos `data/concepts.json` y 43 entradas iniciales, cada una con fuente (Wikipedia, Wikcionario, diccionario Angloromani); un campo de licencia para cada fuente.
- `scripts/validate.py`: comprueba cada archivo con su esquema y con las reglas que un esquema no puede expresar (nombre del archivo, referencias, `sourced` y `reviewed`, duplicados, audio Opus de 50 KB como máximo); `scripts/import_bundle.py` convierte un archivo de contribución en archivos de datos sin sobrescribir nada.
- `docs/contributor-guide.md` y `docs/recording-guide.md` (también en rumano): cómo añadir palabras y grabaciones sin programar.
- Pruebas: `npm test` (el motor, los datos, los scripts de Python, la compilación y los textos de la interfaz) y pruebas de navegador en el hub (ocho idiomas, accesibilidad, estado guardado hostil, importación y exportación, pantallas pequeñas).
- `src/` y `scripts/build.mjs`: el único `index.html` se construye ahora a partir de las fuentes, con los datos y las grabaciones incorporados, y `--check` lo verifica.
- ISSUES_GOOD_FIRST y CODE_OF_CONDUCT traducidos a los ocho idiomas.
- README en inglés, rumano, francés, italiano, español, portugués, alemán y húngaro: secciones de estado y de alcance previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalable (PWA): `manifest.webmanifest`, `sw.js` y los iconos los genera el kit común (`fff-kit/pwa`); la página funciona sin conexión tras la primera visita por HTTPS.

### Cambiado
- El workflow se ejecuta en Ubuntu 26.04 con Node.js 26 y ejecuta también las pruebas, la comprobación de la compilación y la validación de los datos.
- `schema.json` rechaza los campos desconocidos; `lang` es un código ISO 639-3 simple (los dialectos van en `dialect`) y `numeral` es una nueva categoría gramatical.
- El README ya no enumera un alcance previsto: describe lo que hace la página y lo que aún no hace.

## [0.1.0] - 2026-11-13

### Añadido
- Esqueleto inicial: estructura, esquema de datos o primeros ejemplos, guías de contribución en ocho idiomas.
