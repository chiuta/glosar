# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.1.0 · Letzte Aktualisierung: 2026-11-14

🌐 https://glosar.chiuta.ro

> Offline-Wörterbücher für Minderheiten- und bedrohte Sprachen, von ihren Sprechern erstellt.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha: Das Repository enthält die Struktur, das Datenschema oder die ersten Beispiele und die Beitragsleitfäden. Der Umfang unten ist der Plan, nicht das, was heute funktioniert.

## Geplanter Umfang

- Ein Sprachindex (`languages.json`) auf Basis der ISO-639-3-Codes und ein Datenschema mit den optionalen Feldern `dialect` und `orthography`.
- Startlisten mit rund 50 Grundwörtern (Zahlen, Familie, Körper) für Aromunisch (rup), Megleno-Rumänisch (ruq) und Romani (rom).
- Eine Offline-Suchseite, die Diakritika ignoriert.
- Audioaufnahmen (Opus, unter 50 KB pro Wort) mit einer Aufnahmeanleitung sowie Export nach Anki/TSV für Lernende.
- Eine Prüfung, die vor doppelten Stichwörtern warnt, und eine Anleitung für Sprecherinnen und Sprecher ohne technische Vorkenntnisse.

Nichts davon ist bisher umgesetzt: Jeder Punkt ist eine fertig vorbereitete Aufgabe in `ISSUES_GOOD_FIRST.md`.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/dictionaries/example.json` nach `data/dictionaries/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
