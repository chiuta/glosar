# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

🌐 https://glosar.chiuta.ro

> Offline-Wörterbücher für Minderheiten- und bedrohte Sprachen, von ihren Sprechern erstellt.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha, nutzbar: Die eine `index.html` ist ein Offline-Wörterbuch für Aromunisch, Megleno-Rumänisch und Romani (Istro-Rumänisch ist angelegt, hat aber noch keine Einträge). Es sucht ohne Rücksicht auf Diakritika, zeigt, welche der 50 Grundwörter fehlen, erlaubt das Ergänzen von Wörtern mit Quelle und Aufnahme, exportiert nach TSV und Anki und erzeugt eine Beitragsdatei, die `scripts/import_bundle.py` in Datendateien umwandelt. Die 43 Startdatensätze stammen von zitierten öffentlichen Seiten und wurden noch nicht von Sprechern geprüft.

## Was es kann

- Suche nach Wort, Variante oder Bedeutung (in jeder der acht Oberflächensprachen), ohne Rücksicht auf Diakritika: Die Eingabe `tinti` findet `ținți`. Filter für Sprache, Verlässlichkeit (Entwurf, belegt, geprüft) und Aufnahmen; jedes Ergebnis zeigt Wortart, Dialekt, Schreibsystem, Quelle und Lizenz und spielt die Aufnahme ab.
- Abdeckung: Eine Tabelle mit 50 Grundbegriffen (Zahlen, Familie, Körper, Natur, Eigenschaften) zeigt für jede Sprache, welche Wörter vorhanden sind und welche fehlen; ein Klick auf eine Lücke öffnet das Formular zum Hinzufügen mit bereits ausgefülltem Begriff.
- Hinzufügen: ein Formular, das jedes Feld prüft, vor Duplikaten warnt, mehrere Wörter aus einer eingefügten Liste ergänzt und eine Aussprache aufnimmt oder hochlädt (Opus in Ogg oder WebM, höchstens 50 KB); was du hinzufügst, bleibt im Browser, bis du es herunterlädst.
- Export: alles oder nur die eigenen Einträge als TSV (öffnet sich in einer Tabellenkalkulation) oder als Anki-Datei (Sprache, Verlässlichkeit und Begriff als Schlagwörter) sowie eine Beitragsdatei samt Aufnahmen, die du dem Projekt schicken kannst.
- Daten: eine JSON-Datei pro Eintrag in `data/dictionaries/`, der Sprachindex `data/languages.json` (ISO-639-3-Codes, Dialekte, Schreibsysteme) und die Liste `data/concepts.json`; Oberfläche in acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite; ohne Netzwerk, ohne Tracking.
- Als App installierbar und nach dem ersten Besuch offline verfügbar, wenn sie über HTTPS ausgeliefert wird (ein Service Worker behält die Seite; sonst wird nichts gespeichert oder gesendet). Aus einer heruntergeladenen Datei geöffnet, funktioniert sie genauso, ohne Installation.

## Wie es funktioniert

- `schema.json`, `languages.schema.json` und `concepts.schema.json` beschreiben die Daten; `scripts/validate.py` prüft jede Datei dagegen und gegen die Regeln, die ein Schema nicht ausdrücken kann: den Dateinamen, die Verweise auf Sprachen, Dialekte, Schreibsysteme und Begriffe, eine Webadresse für `sourced` und eine prüfende Person für `reviewed`, Duplikate und die Audiodateien (Opus in Ogg oder WebM, höchstens 50 KB).
- `src/engine.mjs` ist der Motor (ohne Bildschirm, ohne Netzwerk): die Normalisierungsregel für die Suche und die Dateinamen, die Validierung, die Rangfolge der Ergebnisse, Duplikate, Abdeckung, TSV- und Anki-Export, die Beitragsdatei und der Parser für eingefügte Listen. `scripts/validate.py` und `scripts/import_bundle.py` wenden dieselbe Regel an; die Tests vergleichen beide.
- `src/ui.js`, `src/i18n.mjs` und `src/app.css` bilden die Oberfläche; `node scripts/build.mjs` baut die eine `index.html` mit eingebetteten Daten und den Aufnahmen aus `audio/` (`--check` prüft, ob sie übereinstimmt).
- `npm test` führt die Tests des Motors, der Daten, der Python-Skripte, des Builds und der Oberflächentexte aus; die Browsertests liegen im Hub. Für die Entwicklung braucht man Node.js 24 oder neuer und Python 3 mit `jsonschema`; die Seite selbst braucht nur einen Browser, der ES2017 kennt.
- `manifest.webmanifest`, `sw.js` und die Symbole erzeugt `node scripts/build.mjs` über das gemeinsame Kit (Abschnitt `pwa` in `src/app.json`); `--check` prüft sie ebenfalls, und `npm test` stellt sicher, dass Manifest, Service-Worker-Version und CSP zur Seite passen.

## Grenzen und was die App nicht tut

- Die mitgelieferten Listen sind Startmaterial: Zahlwörter und einige Wörter, jeweils auf eine veröffentlichte Quelle zurückgeführt (Wikipedia, Wiktionary, das Angloromani-Wörterbuch auf kratylos.org) und als „mit Quelle“ markiert. Noch kein Sprecher hat sie geprüft.
- Aromunisch, Meglenorumänisch und Romani haben nur je eine Handvoll Wörter, Istrorumänisch noch keines. Die Grundliste mit 50 Konzepten ist bei Weitem nicht abgedeckt (siehe Reiter „Abdeckung“).
- Schreibsysteme unterscheiden sich je nach Quelle und Sprecher: Die Einträge nennen das verwendete System und führen andere Schreibweisen als Varianten auf. Die Suche ignoriert Diakritika („tinti“ findet „ținți“), weiß aber nicht, dass zwei Schreibweisen dasselbe Wort sind, wenn es keine Variante sagt.
- Für die Aufnahme braucht es einen Browser, der Opus aufnimmt (Chrome, Edge, Firefox). Safari nimmt in einem anderen Format auf: Verwenden Sie dann eine Opus-Datei. Aufnahmen sind auf 50 KB begrenzt.
- Was Sie hinzufügen, bleibt nur in diesem Browser (localStorage, etwa 5 MB). Laden Sie Ihre Beiträge regelmäßig herunter; das Löschen der Browserdaten löscht sie mit.
- Die Übersetzungen der Oberfläche wurden mit einem KI-Assistenten erstellt und warten auf die Prüfung durch Muttersprachler; die Namen der Konzepte gibt es nur auf Englisch und Rumänisch.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/dictionaries/example.json` nach `data/dictionaries/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.
5. Ohne Programmieren: Füge Wörter auf der Seite hinzu (Reiter „Hinzufügen“), lade deine Beitragsdatei herunter und schicke sie in einem Issue oder Pull Request; eine betreuende Person importiert sie mit `python scripts/import_bundle.py` (siehe `docs/contributor-guide.md`).

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
