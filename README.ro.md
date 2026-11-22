# GLOSAR

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-22

🌐 https://glosar.chiuta.ro

> Dicționare offline pentru limbi minoritare și pe cale de dispariție, create de vorbitorii lor.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa, utilizabil: singurul `index.html` este un dicționar offline pentru aromână, meglenoromână și romani (istroromâna este declarată, dar încă nu are intrări). Caută fără să țină seama de diacritice, arată care dintre cele 50 de cuvinte de bază lipsesc, permite adăugarea de cuvinte cu sursă și înregistrare, exportă în TSV și Anki și produce un fișier de contribuție pe care `scripts/import_bundle.py` îl transformă în fișiere de date. Cele 43 de intrări de pornire provin din pagini publice citate și nu au fost revizuite de vorbitori.

## Ce face

- Căutare după cuvânt, variantă sau sens (în oricare dintre cele opt limbi ale interfeței), fără să țină seama de diacritice: scriind `tinti` găsește `ținți`. Filtre pentru limbă, încredere (schiță, cu sursă, revizuit) și înregistrări; fiecare rezultat arată partea de vorbire, dialectul, sistemul de scriere, sursa și licența și redă înregistrarea.
- Acoperire: un tabel cu 50 de concepte de bază (numere, familie, corp, natură, calități) arată pentru fiecare limbă ce cuvinte există și care lipsesc; un clic pe un loc gol deschide formularul de adăugare cu conceptul deja completat.
- Adăugare: un formular care verifică fiecare câmp, avertizează la duplicate, adaugă mai multe cuvinte dintr-o listă lipită și înregistrează sau încarcă o pronunție (Opus în Ogg sau WebM, cel mult 50 KB); ce adaugi rămâne în browser până îl descarci.
- Export: tot sau doar intrările tale în TSV (se deschide într-un tabel) sau ca fișier Anki (limba, încrederea și conceptul ca etichete), plus un fișier de contribuție, cu înregistrările incluse, pe care îl poți trimite proiectului.
- Date: un fișier JSON pe intrare în `data/dictionaries/`, indexul limbilor `data/languages.json` (coduri ISO 639-3, dialecte, sisteme de scriere) și lista `data/concepts.json`; interfață în opt limbi, teme întunecată și luminoasă, tastatură, funcționează de la 360 px lățime; fără rețea, fără urmărire.
- Se poate instala ca aplicație și funcționează offline după prima vizită, când e servită prin HTTPS (un service worker păstrează pagina; nu se stochează și nu se trimite nimic altceva). Deschisă dintr-un fișier descărcat, merge la fel, fără instalare.

## Cum funcționează

- `schema.json`, `languages.schema.json` și `concepts.schema.json` descriu datele; `scripts/validate.py` verifică fiecare fișier față de ele și față de regulile pe care o schemă nu le poate exprima: numele fișierului, trimiterile la limbi, dialecte, sisteme de scriere și concepte, o adresă web pentru `sourced` și un revizor pentru `reviewed`, duplicatele și fișierele audio (Opus în Ogg sau WebM, cel mult 50 KB).
- `src/engine.mjs` este motorul (fără ecran, fără rețea): regula de normalizare folosită la căutare și la numele fișierelor, validarea, ordonarea rezultatelor, duplicatele, acoperirea, exportul TSV și Anki, fișierul de contribuție și analizorul listelor lipite. `scripts/validate.py` și `scripts/import_bundle.py` aplică aceeași regulă de normalizare; testele le compară.
- `src/ui.js`, `src/i18n.mjs` și `src/app.css` sunt interfața; `node scripts/build.mjs` construiește singurul `index.html`, cu datele și înregistrările din `audio/` încorporate (`--check` verifică dacă se potrivește).
- `npm test` rulează testele motorului, ale datelor, ale scripturilor Python, ale construcției și ale textelor interfeței; testele de browser sunt în hub. Dezvoltarea cere Node.js 24 sau mai nou și Python 3 cu `jsonschema`; pagina în sine cere doar un browser care cunoaște ES2017.
- `manifest.webmanifest`, `sw.js` și pictogramele sunt produse de `node scripts/build.mjs` prin kitul comun (secțiunea `pwa` din `src/app.json`); `--check` le verifică și el, iar `npm test` verifică dacă manifestul, versiunea service worker-ului și CSP-ul corespund paginii.

## Limite și ce nu face

- Listele incluse sunt material de început: numerale și câteva cuvinte, fiecare cu sursa ei publicată (Wikipedia, Wiktionary, dicționarul Angloromani de la kratylos.org), marcate «cu sursă». Niciun vorbitor nu le-a verificat încă.
- Aromâna, meglenoromâna și romani au doar câteva cuvinte fiecare, istroromâna niciunul încă. Lista de bază cu 50 de concepte e departe de a fi acoperită (vezi fila «Acoperire»).
- Sistemele de scriere diferă între surse și între vorbitori: intrările notează sistemul folosit, iar celelalte grafii sunt variante. Căutarea ignoră diacriticele («tinti» găsește «ținți»), dar nu știe că două grafii sunt același cuvânt decât dacă o variantă o spune.
- Înregistrarea cere un browser care înregistrează în Opus (Chrome, Edge, Firefox). Safari înregistrează în alt format: folosește atunci un fișier Opus. Înregistrările sunt limitate la 50 KB.
- Ce adaugi se păstrează doar în acest browser (localStorage, aproximativ 5 MB). Descarcă regulat contribuțiile; ștergerea datelor browserului le șterge și pe ele.
- Traducerile interfeței au fost făcute cu un asistent IA și așteaptă verificarea unor vorbitori nativi; numele conceptelor există doar în engleză și în română.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/dictionaries/example.json` în `data/dictionaries/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.
5. Fără programare: adaugă cuvinte în pagină (fila «Adăugare»), descarcă fișierul tău de contribuție și trimite-l într-un issue sau un pull request; un responsabil îl importă cu `python scripts/import_bundle.py` (vezi `docs/contributor-guide.ro.md`).

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
