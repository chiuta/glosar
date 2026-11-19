# Come contribuire — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · **Italiano** · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

1. Fai il fork di questo repository.
2. Copia `data/dictionaries/example.json` in `data/dictionaries/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Regole

- Una voce = un file.
- Cita sempre una fonte.
- Contribuisci solo con materiale che puoi condividere legalmente (niente testi protetti copiati).
- Sii gentile: vedi il Codice di condotta.

## Aggiungere parole e registrazioni

1. Apri la pagina (`index.html` o https://glosar.chiuta.ro) e vai alla scheda «Aggiunta»: scegli la lingua, scrivi la parola e il suo significato in almeno una lingua, scegli la parte del discorso e aggiungi il dialetto e il sistema ortografico se li conosci.
2. Indica sempre la fonte: un libro o una pagina web (con il suo indirizzo), oppure il parlante da cui hai sentito la parola. Segna una voce `sourced` solo se l’hai copiata da una fonte pubblicata e `reviewed` solo se un altro parlante l’ha confermata e ha dato il suo nome.
3. Scrivi solo ciò che sai o puoi citare; non colmare mai un vuoto a memoria per una lingua che non parli. Non riprodurre un dizionario protetto (singole parole con la loro fonte vanno bene; lunghi elenchi e definizioni no) e registra solo persone consenzienti.
4. Facoltativo: registra la parola (vedi `docs/recording-guide.md`): Opus in Ogg o WebM, al massimo 50 KB.
5. Premi «Scarica tutto» e invia `glosar-contribution.json` in una issue o in una pull request; un manutentore esegue `python scripts/import_bundle.py glosar-contribution.json` e poi `python scripts/validate.py`.
6. Se preferisci i file, copia `data/dictionaries/example.json` in `data/dictionaries/<lang>-<headword>.json` (la parola senza segni diacritici: `ruq-tinti.json`; una seconda voce con la stessa parola riceve `-2`), modificalo ed esegui `python scripts/validate.py`.
7. I parlanti aiutano di più rivedendo le voci iniziali e registrando i numerali: apri una issue con l’id della voce (`rup-tsintsi`) e la tua correzione. Dettagli in `docs/contributor-guide.md`.
