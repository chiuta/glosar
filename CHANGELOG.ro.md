# Jurnal de modificări

[English](CHANGELOG.md) · **Română** · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Nelansat]

## [0.2.1] - 2026-11-20

### Modificat
- fff-kit 1.8.1: când browserul blochează sau nu are stocare (`localStorage`/`sessionStorage` aruncă sau lipsesc), pagina pornește cu o stocare temporară în memorie, în loc să se oprească; datele nu se păstrează după închiderea paginii.
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși).

## [0.2.0] - 2026-11-17

### Adăugat
- Motorul din `src/engine.mjs`: căutare fără să țină seama de diacritice, cu ordonarea rezultatelor, validarea intrărilor, duplicate, acoperirea listei de bază, export TSV și Anki, fișierul de contribuție și analizorul listelor lipite.
- Export TSV pentru foi de calcul: o celulă care începe cu `=`, `+`, `-` sau `@` primește un apostrof în față, ca Excel sau LibreOffice să nu o ruleze ca formulă (un cuvânt care chiar începe cu `-` arată deci apostroful); fișierul Anki scapă HTML-ul.
- Interfața din `src/ui.js`, `src/i18n.mjs` și `src/app.css`: căutare, acoperire, adăugare (cu înregistrare sau încărcare), export și ghid; opt limbi, teme întunecată și luminoasă, tastatură, funcționează de la 360 px lățime; ce adaugi rămâne în browser.
- Date: indexul limbilor `data/languages.json` (aromână, meglenoromână, istroromână, romani, cu dialecte ISO 639-3 și sisteme de scriere), lista celor 50 de concepte de bază `data/concepts.json` și 43 de intrări de pornire, fiecare cu sursă (Wikipedia, Wiktionary, dicționarul Angloromani); un câmp de licență pentru fiecare sursă.
- `scripts/validate.py`: verifică fiecare fișier față de schema lui și de regulile pe care o schemă nu le poate exprima (numele fișierului, trimiteri, `sourced` și `reviewed`, duplicate, audio Opus de cel mult 50 KB); `scripts/import_bundle.py` transformă un fișier de contribuție în fișiere de date fără să suprascrie nimic.
- `docs/contributor-guide.md` și `docs/recording-guide.md` (și în română): cum adaugi cuvinte și înregistrări fără programare.
- Teste: `npm test` (motorul, datele, scripturile Python, construcția și textele interfeței) și teste de browser în hub (opt limbi, accesibilitate, stare salvată ostilă, import și export, ecrane mici).
- `src/` și `scripts/build.mjs`: singurul `index.html` este acum construit din surse, cu datele și înregistrările încorporate, iar `--check` îl verifică.
- ISSUES_GOOD_FIRST și CODE_OF_CONDUCT traduse în toate cele opt limbi.
- README în engleză, română, franceză, italiană, spaniolă, portugheză, germană și maghiară: secțiuni de stare și de domeniu planificat (derivate din `ISSUES_GOOD_FIRST.md`).
- Instalabilă (PWA): `manifest.webmanifest`, `sw.js` și pictogramele sunt generate de kitul comun (`fff-kit/pwa`); pagina funcționează offline după prima vizită prin HTTPS.

### Modificat
- Fluxul de lucru rulează pe Ubuntu 26.04 cu Node.js 26 și rulează și testele, verificarea construcției și validarea datelor.
- `schema.json` respinge câmpurile necunoscute; `lang` este un cod ISO 639-3 simplu (dialectele merg în `dialect`), iar `numeral` este o parte de vorbire nouă.
- README nu mai enumeră un domeniu planificat: descrie ce face pagina și ce nu face încă.

## [0.1.0] - 2026-11-13

### Adăugat
- Schelet inițial: structură, schema de date sau primele exemple, ghiduri de contribuție în opt limbi.
