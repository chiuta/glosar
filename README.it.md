# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.1.0 · Ultimo aggiornamento: 2026-11-14

🌐 https://glosar.chiuta.ro

> Dizionari offline per lingue minoritarie e in pericolo, creati dai loro parlanti.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha: il repository contiene la struttura, lo schema dati o i primi esempi e le guide al contributo. L’ambito qui sotto è il piano, non ciò che funziona oggi.

## Ambito previsto

- Un indice delle lingue (`languages.json`) basato sui codici ISO 639-3 e uno schema dati con i campi facoltativi `dialect` e `orthography`.
- Elenchi iniziali di circa 50 parole di base (numeri, famiglia, corpo) per l’aromeno (rup), il meglenoromeno (ruq) e il romaní (rom).
- Una pagina di ricerca offline, insensibile ai segni diacritici.
- Registrazioni audio (Opus, meno di 50 KB a parola) con una guida alla registrazione, ed esportazione in Anki/TSV per chi studia.
- Un controllo che avvisa dei lemmi duplicati e una guida per parlanti senza competenze tecniche.

Nulla di tutto ciò è ancora implementato: ogni voce è un compito pronto in `ISSUES_GOOD_FIRST.md`.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/dictionaries/example.json` in `data/dictionaries/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
