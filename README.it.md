# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.2.0 · Ultimo aggiornamento: 2026-11-17

🌐 https://glosar.chiuta.ro

> Dizionari offline per lingue minoritarie e in pericolo, creati dai loro parlanti.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alfa, utilizzabile: l’unico `index.html` è un dizionario offline per l’aromeno, il megleno-rumeno e il romaní (l’istro-rumeno è dichiarato ma non ha ancora voci). Cerca senza badare ai segni diacritici, mostra quali delle 50 parole di base mancano, permette di aggiungere parole con una fonte e una registrazione, esporta in TSV e per Anki e produce un file di contributo che `scripts/import_bundle.py` trasforma in file di dati. Le 43 voci iniziali provengono da pagine pubbliche citate e non sono state riviste da parlanti.

## Cosa fa

- Ricerca per parola, variante o significato (in una qualsiasi delle otto lingue dell’interfaccia), senza badare ai segni diacritici: digitando `tinti` trova `ținți`. Filtri per lingua, affidabilità (bozza, con fonte, rivisto) e registrazioni; ogni risultato mostra la parte del discorso, il dialetto, il sistema ortografico, la fonte e la licenza, e riproduce la registrazione.
- Copertura: una tabella di 50 concetti di base (numeri, famiglia, corpo, natura, qualità) mostra per ogni lingua quali parole esistono e quali mancano; un clic su una casella vuota apre il modulo di aggiunta con il concetto già compilato.
- Aggiunta: un modulo che controlla ogni campo, avvisa dei duplicati, aggiunge più parole da un elenco incollato e registra o carica una pronuncia (Opus in Ogg o WebM, al massimo 50 KB); ciò che aggiungi resta nel browser finché non lo scarichi.
- Esportazione: tutto o solo le tue voci in TSV (si apre in un foglio di calcolo) o come file Anki (lingua, affidabilità e concetto come etichette), più un file di contributo, registrazioni incluse, che puoi inviare al progetto.
- Dati: un file JSON per voce in `data/dictionaries/`, l’indice delle lingue `data/languages.json` (codici ISO 639-3, dialetti, sistemi ortografici) e l’elenco `data/concepts.json`; interfaccia in otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza; senza rete, senza tracciamento.
- Installabile come app e disponibile offline dopo la prima visita quando è servita via HTTPS (un service worker conserva la pagina; nient’altro viene memorizzato o inviato). Aperta da un file scaricato funziona allo stesso modo, senza installazione.

## Come funziona

- `schema.json`, `languages.schema.json` e `concepts.schema.json` descrivono i dati; `scripts/validate.py` controlla ogni file rispetto a essi e alle regole che uno schema non può esprimere: il nome del file, i rinvii a lingue, dialetti, sistemi ortografici e concetti, un indirizzo web per `sourced` e un revisore per `reviewed`, i duplicati e i file audio (Opus in Ogg o WebM, al massimo 50 KB).
- `src/engine.mjs` è il motore (senza schermo, senza rete): la regola di normalizzazione usata per la ricerca e per i nomi dei file, la convalida, l’ordinamento dei risultati, i duplicati, la copertura, l’esportazione TSV e Anki, il file di contributo e l’analizzatore degli elenchi incollati. `scripts/validate.py` e `scripts/import_bundle.py` applicano la stessa regola; i test le confrontano.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` sono l’interfaccia; `node scripts/build.mjs` costruisce l’unico `index.html` con i dati e le registrazioni di `audio/` incorporati (`--check` verifica che corrisponda).
- `npm test` esegue i test del motore, dei dati, degli script Python, della build e dei testi dell’interfaccia; i test del browser sono nell’hub. Lo sviluppo richiede Node.js 24 o più recente e Python 3 con `jsonschema`; la pagina stessa richiede solo un browser che conosca ES2017.
- `manifest.webmanifest`, `sw.js` e le icone sono prodotti da `node scripts/build.mjs` tramite il kit comune (sezione `pwa` di `src/app.json`); anche `--check` li verifica, e `npm test` controlla che il manifest, la versione del service worker e la CSP corrispondano alla pagina.

## Limiti e cosa non fa

- Le liste incluse sono materiale iniziale: numerali e qualche parola, ciascuna con la sua fonte pubblicata (Wikipedia, Wikizionario, il dizionario angloromanì di kratylos.org) e contrassegnata «con fonte». Nessun parlante le ha ancora riviste.
- L’arumeno, il meglenorumeno e il romaní hanno solo una manciata di parole ciascuno, l’istrorumeno ancora nessuna. La lista di base di 50 concetti è lontana dall’essere coperta (vedi la scheda «Copertura»).
- I sistemi di scrittura differiscono tra le fonti e tra i parlanti: le voci annotano il sistema usato e riportano le altre grafie come varianti. La ricerca ignora i segni diacritici («tinti» trova «ținți») ma non sa che due grafie sono la stessa parola se una variante non lo dice.
- Per registrare serve un browser che registri in Opus (Chrome, Edge, Firefox). Safari registra in un altro formato: usa allora un file Opus. Le registrazioni sono limitate a 50 KB.
- Quello che aggiungi resta solo in questo browser (localStorage, circa 5 MB). Scarica regolarmente i tuoi contributi; cancellare i dati del browser li cancella.
- Le traduzioni dell’interfaccia sono state fatte con un assistente IA e attendono la revisione di madrelingua; i nomi dei concetti esistono solo in inglese e in rumeno.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/dictionaries/example.json` in `data/dictionaries/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.
5. Senza programmare: aggiungi parole nella pagina (scheda «Aggiunta»), scarica il tuo file di contributo e invialo in una issue o in una pull request; un manutentore lo importa con `python scripts/import_bundle.py` (vedi `docs/contributor-guide.md`).

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
