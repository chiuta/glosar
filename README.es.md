# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.2.0 · Última actualización: 2026-11-17

🌐 https://glosar.chiuta.ro

> Diccionarios sin conexión para lenguas minoritarias y en peligro, creados por sus hablantes.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa, utilizable: el único `index.html` es un diccionario sin conexión para el arrumano, el megleno-rumano y el romaní (el istro-rumano está declarado pero aún no tiene entradas). Busca sin tener en cuenta los diacríticos, muestra cuáles de las 50 palabras básicas faltan, permite añadir palabras con una fuente y una grabación, exporta a TSV y a Anki y genera un archivo de contribución que `scripts/import_bundle.py` convierte en archivos de datos. Las 43 entradas iniciales proceden de páginas públicas citadas y no las han revisado hablantes.

## Qué hace

- Búsqueda por palabra, variante o significado (en cualquiera de los ocho idiomas de la interfaz), sin tener en cuenta los diacríticos: al escribir `tinti` encuentra `ținți`. Filtros por idioma, fiabilidad (borrador, con fuente, revisado) y grabaciones; cada resultado muestra la categoría gramatical, el dialecto, el sistema ortográfico, la fuente y la licencia, y reproduce la grabación.
- Cobertura: una tabla de 50 conceptos básicos (números, familia, cuerpo, naturaleza, cualidades) muestra para cada idioma qué palabras existen y cuáles faltan; un clic en un hueco abre el formulario de alta con el concepto ya rellenado.
- Alta: un formulario que comprueba cada campo, avisa de los duplicados, añade varias palabras desde una lista pegada y graba o sube una pronunciación (Opus en Ogg o WebM, 50 KB como máximo); lo que añades se queda en el navegador hasta que lo descargues.
- Exportación: todo o solo tus propias entradas en TSV (se abre en una hoja de cálculo) o como archivo de Anki (idioma, fiabilidad y concepto como etiquetas), más un archivo de contribución, con las grabaciones incluidas, que puedes enviar al proyecto.
- Datos: un archivo JSON por entrada en `data/dictionaries/`, el índice de idiomas `data/languages.json` (códigos ISO 639-3, dialectos, sistemas ortográficos) y la lista `data/concepts.json`; interfaz en ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho; sin red, sin rastreo.
- Instalable como aplicación y disponible sin conexión tras la primera visita cuando se sirve por HTTPS (un service worker conserva la página; no se guarda ni se envía nada más). Abierta desde un archivo descargado funciona igual, sin instalación.

## Cómo funciona

- `schema.json`, `languages.schema.json` y `concepts.schema.json` describen los datos; `scripts/validate.py` comprueba cada archivo con ellos y con las reglas que un esquema no puede expresar: el nombre del archivo, las referencias a idiomas, dialectos, sistemas ortográficos y conceptos, una dirección web para `sourced` y un revisor para `reviewed`, los duplicados y los archivos de audio (Opus en Ogg o WebM, 50 KB como máximo).
- `src/engine.mjs` es el motor (sin pantalla, sin red): la regla de normalización usada para buscar y para los nombres de archivo, la validación, la ordenación de los resultados, los duplicados, la cobertura, la exportación a TSV y Anki, el archivo de contribución y el analizador de listas pegadas. `scripts/validate.py` y `scripts/import_bundle.py` aplican la misma regla; las pruebas las comparan.
- `src/ui.js`, `src/i18n.mjs` y `src/app.css` son la interfaz; `node scripts/build.mjs` construye el único `index.html` con los datos y las grabaciones de `audio/` incorporados (`--check` verifica que coincide).
- `npm test` ejecuta las pruebas del motor, de los datos, de los scripts de Python, de la compilación y de los textos de la interfaz; las pruebas de navegador están en el hub. El desarrollo requiere Node.js 24 o más reciente y Python 3 con `jsonschema`; la página en sí solo necesita un navegador que conozca ES2017.
- `manifest.webmanifest`, `sw.js` y los iconos los produce `node scripts/build.mjs` mediante el kit común (sección `pwa` de `src/app.json`); `--check` también los verifica, y `npm test` comprueba que el manifiesto, la versión del service worker y la CSP coincidan con la página.

## Límites y lo que no hace

- Las listas incluidas son material inicial: numerales y unas pocas palabras, cada una con su fuente publicada (Wikipedia, Wikcionario, el diccionario de angloromaní de kratylos.org) y marcada «con fuente». Ningún hablante las ha revisado aún.
- El arrumano, el meglenorrumano y el romaní tienen solo un puñado de palabras cada uno, el istrorrumano ninguna aún. La lista básica de 50 conceptos está lejos de estar cubierta (véase la pestaña «Cobertura»).
- Los sistemas de escritura difieren entre fuentes y entre hablantes: las entradas anotan el sistema usado y recogen otras grafías como variantes. La búsqueda ignora los signos diacríticos («tinti» encuentra «ținți»), pero no sabe que dos grafías son la misma palabra si una variante no lo dice.
- Grabar requiere un navegador que grabe en Opus (Chrome, Edge, Firefox). Safari graba en otro formato: usa entonces un archivo Opus. Las grabaciones están limitadas a 50 KB.
- Lo que añades se guarda solo en este navegador (localStorage, unos 5 MB). Descarga tus contribuciones con regularidad; borrar los datos del navegador también las borra.
- Las traducciones de la interfaz se hicieron con un asistente de IA y esperan la revisión de hablantes nativos; los nombres de los conceptos solo existen en inglés y en rumano.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/dictionaries/example.json` en `data/dictionaries/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.
5. Sin programar: añade palabras en la página (pestaña «Añadir»), descarga tu archivo de contribución y envíalo en una issue o un pull request; un mantenedor lo importa con `python scripts/import_bundle.py` (consulta `docs/contributor-guide.md`).

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
