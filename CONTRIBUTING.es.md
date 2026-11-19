# Cómo contribuir — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · **Español** · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versión: 0.2.1 · Última actualización: 2026-11-20

1. Haz un fork de este repositorio.
2. Copia `data/dictionaries/example.json` en `data/dictionaries/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Reglas

- Una entrada = un archivo.
- Cita siempre una fuente.
- Aporta solo material que puedas compartir legalmente (sin texto protegido copiado).
- Sé amable: consulta el Código de conducta.

## Añadir palabras y grabaciones

1. Abre la página (`index.html` o https://glosar.chiuta.ro) y ve a la pestaña «Añadir»: elige el idioma, escribe la palabra y su significado en al menos un idioma, elige la categoría gramatical y añade el dialecto y el sistema ortográfico si los conoces.
2. Indica siempre la fuente: un libro o una página web (con su dirección), o el hablante de quien oíste la palabra. Marca una entrada como `sourced` solo si la copiaste de una fuente publicada, y como `reviewed` solo si otro hablante distinto de ti la confirmó y dio su nombre.
3. Escribe solo lo que sabes o puedes citar; nunca rellenes un hueco de memoria en un idioma que no hablas. No reproduzcas un diccionario protegido (las palabras sueltas con su fuente están bien; las listas largas y las definiciones, no) y graba solo a personas que lo hayan aceptado.
4. Opcionalmente, graba la palabra (consulta `docs/recording-guide.md`): Opus en Ogg o WebM, 50 KB como máximo.
5. Pulsa «Descargar todo» y envía `glosar-contribution.json` en una issue o un pull request; un mantenedor ejecuta `python scripts/import_bundle.py glosar-contribution.json` y después `python scripts/validate.py`.
6. Si prefieres los archivos, copia `data/dictionaries/example.json` en `data/dictionaries/<lang>-<headword>.json` (la palabra sin diacríticos: `ruq-tinti.json`; una segunda entrada con la misma palabra recibe `-2`), edítalo y ejecuta `python scripts/validate.py`.
7. Los hablantes ayudan más revisando las entradas iniciales y grabando los numerales: abre una issue con el id de la entrada (`rup-tsintsi`) y tu corrección. Detalles en `docs/contributor-guide.md`.
