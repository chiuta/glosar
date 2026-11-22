# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.2.1 · Utolsó frissítés: 2026-11-22

🌐 https://glosar.chiuta.ro

> Offline szótárak kisebbségi és veszélyeztetett nyelvekhez, beszélőik készítésében.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa, használható: az egyetlen `index.html` egy offline szótár az aromán, a meglenoromán és a romani nyelvhez (az isztroromán deklarálva van, de még nincs szócikke). Ékezetektől függetlenül keres, megmutatja, hogy az 50 alapszó közül melyek hiányoznak, lehetővé teszi szavak hozzáadását forrással és hangfelvétellel, TSV és Anki formátumba exportál, és hozzájárulási fájlt készít, amelyet a `scripts/import_bundle.py` adatfájlokká alakít. A 43 kezdő szócikk idézett nyilvános oldalakról származik, és beszélők még nem nézték át.

## Mit tud

- Keresés szó, változat vagy jelentés szerint (a felület nyolc nyelvének bármelyikén), az ékezetektől függetlenül: a `tinti` beírása megtalálja a `ținți` szót. Szűrők nyelv, megbízhatóság (vázlat, forrással, ellenőrzött) és hangfelvétel szerint; minden találat mutatja a szófajt, a nyelvjárást, az írásrendszert, a forrást és a licencet, és lejátssza a felvételt.
- Lefedettség: egy 50 alapfogalomból (számok, család, test, természet, tulajdonságok) álló táblázat megmutatja minden nyelvre, hogy mely szavak vannak meg és melyek hiányoznak; egy hiányzó helyre kattintva megnyílik a hozzáadás űrlapja a fogalommal előre kitöltve.
- Hozzáadás: egy űrlap, amely minden mezőt ellenőriz, figyelmeztet az ismétlődésekre, beillesztett listából több szót is hozzáad, és kiejtést vesz fel vagy tölt fel (Opus Ogg vagy WebM tárolóban, legfeljebb 50 KB); amit hozzáadsz, a letöltésig a böngészőben marad.
- Exportálás: minden vagy csak a saját szócikkeid TSV-ben (táblázatkezelőben nyílik meg) vagy Anki-fájlként (a nyelv, a megbízhatóság és a fogalom címkeként), továbbá egy hozzájárulási fájl a felvételekkel együtt, amelyet elküldhetsz a projektnek.
- Adatok: szócikkenként egy JSON-fájl a `data/dictionaries/` mappában, a nyelvek jegyzéke a `data/languages.json` (ISO 639-3 kódok, nyelvjárások, írásrendszerek) és az alapfogalmak listája a `data/concepts.json`; nyolcnyelvű felület, sötét és világos téma, billentyűzet, 360 px szélességtől működik; hálózat és követés nélkül.
- Alkalmazásként telepíthető, és az első látogatás után offline is elérhető, ha HTTPS-en keresztül szolgálják ki (egy service worker megőrzi az oldalt; semmi mást nem tárol és nem küld). Letöltött fájlból megnyitva ugyanígy működik, telepítés nélkül.

## Hogyan működik

- A `schema.json`, a `languages.schema.json` és a `concepts.schema.json` írja le az adatokat; a `scripts/validate.py` minden fájlt ellenőriz ezek szerint és azokkal a szabályokkal, amelyeket egy séma nem tud kifejezni: a fájlnév, a nyelvekre, nyelvjárásokra, írásrendszerekre és fogalmakra való hivatkozások, a `sourced` állapotnál webcím, a `reviewed` állapotnál ellenőrző személy, az ismétlődések és a hangfájlok (Opus Ogg vagy WebM tárolóban, legfeljebb 50 KB).
- A `src/engine.mjs` a motor (képernyő és hálózat nélkül): a kereséshez és a fájlnevekhez használt normalizálási szabály, az ellenőrzés, a találatok rangsorolása, az ismétlődések, a lefedettség, a TSV- és Anki-export, a hozzájárulási fájl és a beillesztett listák értelmezője. A `scripts/validate.py` és a `scripts/import_bundle.py` ugyanazt a szabályt alkalmazza; a tesztek összehasonlítják őket.
- A `src/ui.js`, a `src/i18n.mjs` és a `src/app.css` a felület; a `node scripts/build.mjs` építi az egyetlen `index.html` fájlt a beágyazott adatokkal és az `audio/` mappa felvételeivel (a `--check` ellenőrzi, hogy egyezik-e).
- Az `npm test` futtatja a motor, az adatok, a Python-szkriptek, az építés és a felületi szövegek tesztjeit; a böngészőtesztek a hubban vannak. A fejlesztéshez Node.js 24 vagy újabb és Python 3 `jsonschema`-val kell; maga az oldal csak ES2017-et ismerő böngészőt igényel.
- A `manifest.webmanifest`, az `sw.js` és az ikonok a `node scripts/build.mjs` futtatásakor készülnek a közös kit révén (az `src/app.json` `pwa` szakasza); a `--check` is ellenőrzi őket, az `npm test` pedig azt, hogy a manifeszt, a service worker verziója és a CSP megegyezik az oldalval.

## Korlátok és amit nem tud

- A beépített listák kiinduló anyagok: számnevek és néhány szó, mindegyik közzétett forrásra (Wikipédia, Wikiszótár, a kratylos.org angloromani szótára) visszavezetve, „forrással” jelöléssel. Egyetlen beszélő sem ellenőrizte még őket.
- Az arománnak, a megleno-románnak és a romaninak csak néhány szava van, az isztriai románnak még egy sem. Az 50 fogalmas alaplista messze nincs lefedve (lásd a „Lefedettség” fület).
- A helyesírási rendszerek forrásonként és beszélőnként eltérnek: a szócikkek feltüntetik a használt rendszert, a többi írásmódot változatként sorolják fel. A keresés figyelmen kívül hagyja az ékezeteket („tinti” megtalálja a „ținți” szót), de nem tudja, hogy két írásmód ugyanaz a szó, ha ezt nem mondja ki egy változat.
- A felvételhez Opus formátumban rögzítő böngésző kell (Chrome, Edge, Firefox). A Safari más formátumban vesz fel: ilyenkor használj Opus-fájlt. A felvételek legfeljebb 50 KB-osak lehetnek.
- Amit hozzáadsz, csak ebben a böngészőben marad meg (localStorage, nagyjából 5 MB). Rendszeresen töltsd le a hozzájárulásaidat; a böngészőadatok törlése ezeket is törli.
- A felület fordításait MI-asszisztenssel készítettük, anyanyelvi beszélők ellenőrzésére várnak; a fogalmak nevei csak angolul és románul léteznek.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/dictionaries/example.json` fájlt a `data/dictionaries/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.
5. Programozás nélkül: adj hozzá szavakat az oldalon („Hozzáadás” lap), töltsd le a hozzájárulási fájlodat, és küldd el egy issue-ban vagy pull requestben; egy karbantartó a `python scripts/import_bundle.py` paranccsal importálja (lásd `docs/contributor-guide.md`).

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
