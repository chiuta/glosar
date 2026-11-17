# Buenas primeras tareas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · **Español** · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Pedir a hablantes de arrumano que revisen las 11 entradas iniciales (`rup-*`), las corrijan y pongan `status: reviewed` con `reviewed_by`
- [ ] Pedir del mismo modo a hablantes de megleno-rumano que revisen las 10 entradas iniciales (`ruq-*`)
- [ ] Pedir a hablantes de romaní que revisen las 22 entradas iniciales (`rom-*`) y añadan el `dialect` de cada forma (las fuentes no lo dan)
- [ ] Añadir las primeras entradas en istro-rumano (`ruo`) a partir de una fuente publicada, con su dirección web (nunca de memoria)
- [ ] Añadir a `data/languages.json` otra lengua minoritaria o en peligro (código ISO 639-3, dialectos, sistemas ortográficos) con una primera lista de palabras de una fuente citada
- [ ] Ampliar la lista básica a 100 conceptos en `data/concepts.json` y añadir los nombres de los conceptos en francés, italiano, español, portugués, alemán y húngaro (solo existen en inglés y rumano)
- [ ] Grabar con la aplicación los diez numerales de cada idioma (Opus, menos de 50 KB) y enviar el archivo de contribución (solo hablantes)
- [ ] Pedir a hablantes nativos que revisen los textos de la interfaz de `src/i18n.mjs` (francés, italiano, español, portugués, alemán, húngaro); se escribieron con un asistente de IA
- [ ] Añadir a la pestaña de búsqueda un filtro de dialecto y otro de sistema ortográfico, con pruebas
- [ ] Hacer que la grabación funcione en Safari: grabar WAV en la página y codificarlo a Opus en JavaScript (sin red, 50 KB como máximo), o documentar un comando `ffmpeg` en `docs/recording-guide.md`

Créalas todas en GitHub con `scripts/create_issues.sh` (requiere la CLI `gh`).
