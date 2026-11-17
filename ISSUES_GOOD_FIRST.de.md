# Gute erste Aufgaben

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · **Deutsch** · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Sprecher des Aromunischen die 11 Startdatensätze (`rup-*`) prüfen und korrigieren lassen und `status: reviewed` mit `reviewed_by` setzen
- [ ] Sprecher des Megleno-Rumänischen die 10 Startdatensätze (`ruq-*`) auf dieselbe Weise prüfen lassen
- [ ] Romani-Sprecher die 22 Startdatensätze (`rom-*`) prüfen lassen und den `dialect` jeder Form ergänzen (die Quellen nennen ihn nicht)
- [ ] Die ersten Einträge für Istro-Rumänisch (`ruo`) aus einer veröffentlichten Quelle mit ihrer Webadresse ergänzen (nie aus dem Gedächtnis)
- [ ] Eine weitere Minderheiten- oder gefährdete Sprache in `data/languages.json` aufnehmen (ISO-639-3-Code, Dialekte, Schreibsysteme) mit einer ersten Wortliste aus einer zitierten Quelle
- [ ] Die Grundliste in `data/concepts.json` auf 100 Begriffe erweitern und die Begriffsnamen auf Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch ergänzen (sie gibt es nur auf Englisch und Rumänisch)
- [ ] Die zehn Zahlwörter jeder Sprache mit der App aufnehmen (Opus, unter 50 KB) und die Beitragsdatei schicken (nur Sprecher)
- [ ] Die Oberflächentexte in `src/i18n.mjs` (Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch, Ungarisch) von Muttersprachlern prüfen lassen; sie wurden mit einem KI-Assistenten geschrieben
- [ ] Dem Suchreiter einen Dialektfilter und einen Schreibsystemfilter hinzufügen, mit Tests
- [ ] Die Aufnahme in Safari zum Laufen bringen: WAV in der Seite aufnehmen und in JavaScript nach Opus kodieren (ohne Netzwerk, höchstens 50 KB) oder einen `ffmpeg`-Befehl in `docs/recording-guide.md` dokumentieren

Lege sie alle auf GitHub mit `scripts/create_issues.sh` an (benötigt die `gh`-CLI).
