# Buoni primi compiti

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · **Italiano** · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Far rivedere da parlanti di aromeno le 11 voci iniziali (`rup-*`), correggerle e impostare `status: reviewed` con `reviewed_by`
- [ ] Far rivedere allo stesso modo da parlanti di megleno-rumeno le 10 voci iniziali (`ruq-*`)
- [ ] Far rivedere da parlanti di romaní le 22 voci iniziali (`rom-*`) e aggiungere il `dialect` di ogni forma (le fonti non lo indicano)
- [ ] Aggiungere le prime voci in istro-rumeno (`ruo`) da una fonte pubblicata, con il suo indirizzo web (mai a memoria)
- [ ] Aggiungere a `data/languages.json` un’altra lingua minoritaria o in pericolo (codice ISO 639-3, dialetti, sistemi ortografici) con un primo elenco di parole da una fonte citata
- [ ] Estendere l’elenco di base a 100 concetti in `data/concepts.json` e aggiungere i nomi dei concetti in francese, italiano, spagnolo, portoghese, tedesco e ungherese (esistono solo in inglese e rumeno)
- [ ] Registrare con l’app i dieci numerali di ogni lingua (Opus, sotto i 50 KB) e inviare il file di contributo (solo parlanti)
- [ ] Far rivedere da madrelingua i testi dell’interfaccia in `src/i18n.mjs` (francese, italiano, spagnolo, portoghese, tedesco, ungherese); sono stati scritti con un assistente di IA
- [ ] Aggiungere alla scheda di ricerca un filtro per dialetto e uno per sistema ortografico, con test
- [ ] Far funzionare la registrazione in Safari: registrare in WAV nella pagina e codificare in Opus in JavaScript (senza rete, al massimo 50 KB), oppure documentare un comando `ffmpeg` in `docs/recording-guide.md`

Crea tutte le issue su GitHub con `scripts/create_issues.sh` (richiede la CLI `gh`).
