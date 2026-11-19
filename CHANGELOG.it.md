# Registro delle modifiche

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · **Italiano** · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non rilasciato]

## [0.2.1] - 2026-11-20

### Modificato
- fff-kit 1.8.1: quando il browser blocca l’archiviazione o ne è privo (`localStorage`/`sessionStorage` generano un errore o mancano), la pagina si avvia con un’archiviazione temporanea in memoria invece di fermarsi; i dati non vengono conservati dopo la chiusura della pagina.
- fff-kit 1.8.1: la guida che ingrandisce i controlli piccoli a 44 px misura ora anche la larghezza del corpo della pagina e dell’elemento genitore, quindi una riga di pulsanti non può più uscire dallo schermo (il gruppo resta intatto quando l’ingrandimento lo renderebbe troppo largo).

## [0.2.0] - 2026-11-17

### Aggiunto
- Il motore in `src/engine.mjs`: ricerca senza badare ai segni diacritici con ordinamento, convalida delle voci, duplicati, copertura dell’elenco di base, esportazione TSV e Anki, file di contributo e analizzatore degli elenchi incollati.
- Esportazione TSV per fogli di calcolo: una cella che inizia con `=`, `+`, `-` o `@` riceve un apostrofo davanti, in modo che Excel o LibreOffice non la eseguano come formula (una parola che inizia davvero con `-` mostra quindi l’apostrofo); il file Anki esegue l’escape dell’HTML.
- L’interfaccia in `src/ui.js`, `src/i18n.mjs` e `src/app.css`: ricerca, copertura, aggiunta (con registrazione o caricamento), esportazione e guida; otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza; ciò che aggiungi resta nel browser.
- Dati: l’indice delle lingue `data/languages.json` (aromeno, megleno-rumeno, istro-rumeno, romaní, con dialetti ISO 639-3 e sistemi ortografici), l’elenco dei 50 concetti di base `data/concepts.json` e 43 voci iniziali, ciascuna con una fonte (Wikipedia, Wikizionario, dizionario Angloromani); un campo licenza per ogni fonte.
- `scripts/validate.py`: controlla ogni file rispetto al suo schema e alle regole che uno schema non può esprimere (nome del file, rinvii, `sourced` e `reviewed`, duplicati, audio Opus di al massimo 50 KB); `scripts/import_bundle.py` trasforma un file di contributo in file di dati senza sovrascrivere nulla.
- `docs/contributor-guide.md` e `docs/recording-guide.md` (anche in rumeno): come aggiungere parole e registrazioni senza programmare.
- Test: `npm test` (il motore, i dati, gli script Python, la build e i testi dell’interfaccia) e test del browser nell’hub (otto lingue, accessibilità, stato salvato ostile, importazione ed esportazione, schermi piccoli).
- `src/` e `scripts/build.mjs`: l’unico `index.html` è ora costruito dai sorgenti, con dati e registrazioni incorporati, e `--check` lo verifica.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT tradotti in tutte e otto le lingue.
- README in inglese, rumeno, francese, italiano, spagnolo, portoghese, tedesco e ungherese: sezioni di stato e di ambito previsto (derivate da `ISSUES_GOOD_FIRST.md`).
- Installabile (PWA): `manifest.webmanifest`, `sw.js` e le icone sono generati dal kit comune (`fff-kit/pwa`); la pagina funziona offline dopo la prima visita via HTTPS.

### Modificato
- Il workflow gira su Ubuntu 26.04 con Node.js 26 ed esegue anche i test, il controllo della build e la convalida dei dati.
- `schema.json` rifiuta i campi sconosciuti; `lang` è un semplice codice ISO 639-3 (i dialetti vanno in `dialect`) e `numeral` è una nuova parte del discorso.
- Il README non elenca più un ambito previsto: descrive cosa fa la pagina e cosa non fa ancora.

## [0.1.0] - 2026-11-13

### Aggiunto
- Scheletro iniziale: struttura, schema dei dati o primi esempi, guide al contributo in otto lingue.
