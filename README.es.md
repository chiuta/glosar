# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.1.0 · Última actualización: 2026-11-14

🌐 https://glosar.chiuta.ro

> Diccionarios sin conexión para lenguas minoritarias y en peligro, creados por sus hablantes.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa: el repositorio contiene la estructura, el esquema de datos o los primeros ejemplos y las guías de contribución. El alcance de abajo es el plan, no lo que funciona hoy.

## Alcance previsto

- Un índice de lenguas (`languages.json`) basado en los códigos ISO 639-3 y un esquema de datos con los campos opcionales `dialect` y `orthography`.
- Listas iniciales de unas 50 palabras básicas (números, familia, cuerpo) para el arromanés (rup), el meglenorrumano (ruq) y el romaní (rom).
- Una página de búsqueda sin conexión, insensible a los signos diacríticos.
- Grabaciones de audio (Opus, menos de 50 KB por palabra) con una guía de grabación, y exportación a Anki/TSV para quien aprende.
- Un comprobador que avisa de las entradas duplicadas y una guía para hablantes sin formación técnica.

Nada de esto está implementado todavía: cada punto es una tarea preparada en `ISSUES_GOOD_FIRST.md`.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/dictionaries/example.json` en `data/dictionaries/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
