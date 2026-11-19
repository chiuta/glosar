# Mitmachen — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · **Deutsch** · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.1 · Letzte Aktualisierung: 2026-11-20

1. Forke dieses Repository.
2. Kopiere `data/dictionaries/example.json` nach `data/dictionaries/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Regeln

- Ein Eintrag = eine Datei.
- Gib immer eine Quelle an.
- Steuere nur Material bei, das du rechtmäßig teilen darfst (keine kopierten geschützten Texte).
- Sei freundlich: siehe Verhaltenskodex.

## Wörter und Aufnahmen beitragen

1. Öffne die Seite (`index.html` oder https://glosar.chiuta.ro) und wechsle zum Reiter „Hinzufügen“: Wähle die Sprache, schreibe das Wort und seine Bedeutung in mindestens einer Sprache, wähle die Wortart und ergänze Dialekt und Schreibsystem, wenn du sie kennst.
2. Gib immer die Quelle an: ein Buch oder eine Webseite (mit Adresse) oder die Sprecherin bzw. den Sprecher, von der oder dem du das Wort gehört hast. Markiere einen Eintrag nur dann als `sourced`, wenn du ihn aus einer veröffentlichten Quelle übernommen hast, und nur dann als `reviewed`, wenn eine andere Person als du ihn bestätigt und ihren Namen genannt hat.
3. Schreibe nur, was du weißt oder belegen kannst; fülle für eine Sprache, die du nicht sprichst, nie eine Lücke aus dem Gedächtnis. Gib kein urheberrechtlich geschütztes Wörterbuch wieder (einzelne Wörter mit Quelle sind in Ordnung, lange Listen und Definitionen nicht) und nimm nur Personen auf, die einverstanden sind.
4. Optional: Nimm das Wort auf (siehe `docs/recording-guide.md`): Opus in Ogg oder WebM, höchstens 50 KB.
5. Drücke „Alles herunterladen“ und schicke `glosar-contribution.json` in einem Issue oder Pull Request; eine betreuende Person führt `python scripts/import_bundle.py glosar-contribution.json` und danach `python scripts/validate.py` aus.
6. Wenn du Dateien bevorzugst, kopiere `data/dictionaries/example.json` nach `data/dictionaries/<lang>-<headword>.json` (das Wort ohne Diakritika: `ruq-tinti.json`; ein zweiter Eintrag mit demselben Wort erhält `-2`), bearbeite sie und führe `python scripts/validate.py` aus.
7. Sprecherinnen und Sprecher helfen am meisten, indem sie die Startdatensätze prüfen und die Zahlwörter aufnehmen: Eröffne ein Issue mit der Eintrags-id (`rup-tsintsi`) und deiner Korrektur. Einzelheiten in `docs/contributor-guide.md`.
