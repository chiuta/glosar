# Änderungsprotokoll

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · **Deutsch** · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Unveröffentlicht]

## [0.2.1] - 2026-11-20

### Geändert
- fff-kit 1.8.1: Blockiert der Browser den Speicher oder fehlt er (`localStorage`/`sessionStorage` lösen einen Fehler aus oder fehlen), startet die Seite mit einem temporären Arbeitsspeicher, statt anzuhalten; die Daten bleiben nach dem Schließen der Seite nicht erhalten.
- fff-kit 1.8.1: Die Hilfe, die kleine Bedienelemente auf 44 px vergrößert, misst jetzt auch die Breite des Seitenkörpers und des übergeordneten Elements; eine Schaltflächenreihe kann den Bildschirm also nicht mehr verlassen (die Gruppe bleibt unverändert, wenn die Vergrößerung sie zu breit machen würde).

## [0.2.0] - 2026-11-17

### Hinzugefügt
- Der Motor in `src/engine.mjs`: Suche ohne Rücksicht auf Diakritika mit Rangfolge, Validierung der Einträge, Duplikate, Abdeckung der Grundliste, TSV- und Anki-Export, Beitragsdatei und Parser für eingefügte Listen.
- TSV-Export für Tabellenkalkulationen: Eine Zelle, die mit `=`, `+`, `-` oder `@` beginnt, erhält ein Apostroph davor, damit Excel oder LibreOffice sie nicht als Formel ausführt (ein Wort, das wirklich mit `-` beginnt, zeigt daher das Apostroph); die Anki-Datei maskiert HTML.
- Die Oberfläche in `src/ui.js`, `src/i18n.mjs` und `src/app.css`: Suche, Abdeckung, Hinzufügen (mit Aufnahme oder Upload), Export und Anleitung; acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite; was du hinzufügst, bleibt im Browser.
- Daten: der Sprachindex `data/languages.json` (Aromunisch, Megleno-Rumänisch, Istro-Rumänisch, Romani, mit ISO-639-3-Dialekten und Schreibsystemen), die Liste der 50 Grundbegriffe `data/concepts.json` und 43 Startdatensätze, jeweils mit Quelle (Wikipedia, Wiktionary, Angloromani-Wörterbuch); ein Lizenzfeld für jede Quelle.
- `scripts/validate.py`: prüft jede Datei gegen ihr Schema und die Regeln, die ein Schema nicht ausdrücken kann (Dateiname, Verweise, `sourced` und `reviewed`, Duplikate, Opus-Audio von höchstens 50 KB); `scripts/import_bundle.py` wandelt eine Beitragsdatei in Datendateien um, ohne etwas zu überschreiben.
- `docs/contributor-guide.md` und `docs/recording-guide.md` (auch auf Rumänisch): wie man Wörter und Aufnahmen ohne Programmieren beiträgt.
- Tests: `npm test` (der Motor, die Daten, die Python-Skripte, der Build und die Oberflächentexte) und Browsertests im Hub (acht Sprachen, Barrierefreiheit, feindlicher gespeicherter Zustand, Import und Export, kleine Bildschirme).
- `src/` und `scripts/build.mjs`: Die eine `index.html` wird jetzt aus den Quellen gebaut, mit eingebetteten Daten und Aufnahmen, und `--check` prüft sie.
- ISSUES_GOOD_FIRST und CODE_OF_CONDUCT in alle acht Sprachen übersetzt.
- README auf Englisch, Rumänisch, Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch: Abschnitte zu Status und geplantem Umfang (abgeleitet aus `ISSUES_GOOD_FIRST.md`).
- Installierbar (PWA): `manifest.webmanifest`, `sw.js` und die Symbole werden vom gemeinsamen Kit (`fff-kit/pwa`) erzeugt; die Seite funktioniert nach dem ersten Besuch über HTTPS offline.

### Geändert
- Der Workflow läuft auf Ubuntu 26.04 mit Node.js 26 und führt auch die Tests, die Build-Prüfung und die Datenvalidierung aus.
- `schema.json` lehnt unbekannte Felder ab; `lang` ist ein einfacher ISO-639-3-Code (Dialekte gehören in `dialect`) und `numeral` ist eine neue Wortart.
- Die README führt keinen geplanten Umfang mehr auf: Sie beschreibt, was die Seite kann und was sie noch nicht kann.

## [0.1.0] - 2026-11-13

### Hinzugefügt
- Erstes Gerüst: Struktur, Datenschema oder erste Beispiele, Beitragsanleitungen in acht Sprachen.
