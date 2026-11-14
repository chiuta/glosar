# GLOSAR

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.1.0 · Utolsó frissítés: 2026-11-14

🌐 https://glosar.chiuta.ro

> Offline szótárak kisebbségi és veszélyeztetett nyelvekhez, beszélőik készítésében.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa: a tároló a szerkezetet, az adatsémát vagy az első példákat és a közreműködési útmutatókat tartalmazza. Az alábbi terjedelem a terv, nem a ma működő állapot.

## Tervezett terjedelem

- Nyelvindex (`languages.json`) ISO 639-3 kódok alapján, és adatséma opcionális `dialect` és `orthography` mezőkkel.
- Kb. 50 alapszóból álló induló listák (számok, család, test) az aromán (rup), a megleno-román (ruq) és a romani (rom) nyelvhez.
- Offline keresőoldal, amely figyelmen kívül hagyja az ékezeteket.
- Hangfelvételek (Opus, szavanként 50 KB alatt) felvételi útmutatóval, és Anki/TSV-export tanulóknak.
- Ellenőrző, amely figyelmeztet az ismétlődő címszavakra, és útmutató műszaki előképzettség nélküli beszélőknek.

Ezek közül még semmi sincs megvalósítva: minden pont kész feladat az `ISSUES_GOOD_FIRST.md` fájlban.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/dictionaries/example.json` fájlt a `data/dictionaries/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
