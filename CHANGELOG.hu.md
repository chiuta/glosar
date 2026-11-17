# Változásnapló

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · **Magyar**

Formátum: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Kiadatlan]

## [0.2.0] - 2026-11-17

### Hozzáadva
- A motor a `src/engine.mjs` fájlban: ékezetektől független keresés rangsorolással, a szócikkek ellenőrzése, ismétlődések, az alaplista lefedettsége, TSV- és Anki-export, hozzájárulási fájl és a beillesztett listák értelmezője.
- TSV-export táblázatkezelőknek: az `=`, `+`, `-` vagy `@` jellel kezdődő cella elé aposztróf kerül, hogy az Excel vagy a LibreOffice ne futtassa képletként (az a szó, amely valóban `-` jellel kezdődik, ezért az aposztrófot is mutatja); az Anki-fájl elmenekíti a HTML-t.
- A felület a `src/ui.js`, `src/i18n.mjs` és `src/app.css` fájlokban: keresés, lefedettség, hozzáadás (felvétellel vagy feltöltéssel), exportálás és útmutató; nyolc nyelv, sötét és világos téma, billentyűzet, 360 px szélességtől működik; amit hozzáadsz, a böngészőben marad.
- Adatok: a nyelvek jegyzéke a `data/languages.json` (aromán, meglenoromán, isztroromán, romani, ISO 639-3 nyelvjárásokkal és írásrendszerekkel), az 50 alapfogalom listája a `data/concepts.json` és 43 kezdő szócikk, mindegyik forrással (Wikipédia, Wikiszótár, Angloromani szótár); minden forráshoz licencmező.
- `scripts/validate.py`: minden fájlt ellenőriz a sémája és azok a szabályok szerint, amelyeket egy séma nem tud kifejezni (fájlnév, hivatkozások, `sourced` és `reviewed`, ismétlődések, legfeljebb 50 KB-os Opus hang); a `scripts/import_bundle.py` a hozzájárulási fájlt adatfájlokká alakítja, anélkül hogy bármit felülírna.
- `docs/contributor-guide.md` és `docs/recording-guide.md` (románul is): hogyan adhatsz hozzá szavakat és felvételeket programozás nélkül.
- Tesztek: `npm test` (a motor, az adatok, a Python-szkriptek, az építés és a felületi szövegek) és böngészőtesztek a hubban (nyolc nyelv, akadálymentesség, ellenséges mentett állapot, import és export, kis képernyők).
- `src/` és `scripts/build.mjs`: az egyetlen `index.html` mostantól forrásokból épül, beágyazott adatokkal és felvételekkel, és a `--check` ellenőrzi.
- Az ISSUES_GOOD_FIRST és a CODE_OF_CONDUCT lefordítva mind a nyolc nyelvre.
- README angolul, románul, franciául, olaszul, spanyolul, portugálul, németül és magyarul: állapot- és tervezett terjedelem-szakaszok (az `ISSUES_GOOD_FIRST.md` alapján).
- Telepíthető (PWA): a `manifest.webmanifest`, az `sw.js` és az ikonok a közös kitből (`fff-kit/pwa`) készülnek; az oldal az első HTTPS-látogatás után offline is működik.

### Módosítva
- A munkafolyamat Ubuntu 26.04 és Node.js 26 alatt fut, és a teszteket, a build-ellenőrzést meg az adatok ellenőrzését is futtatja.
- A `schema.json` elutasítja az ismeretlen mezőket; a `lang` egyszerű ISO 639-3 kód (a nyelvjárások a `dialect` mezőbe kerülnek), a `numeral` pedig új szófaj.
- A README már nem sorol fel tervezett terjedelmet: azt írja le, mit tud az oldal, és mit nem tud még.

## [0.1.0] - 2026-11-13

### Hozzáadva
- Kezdeti váz: szerkezet, adatséma vagy első példák, hozzájárulási útmutatók nyolc nyelven.
