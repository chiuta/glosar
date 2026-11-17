# Közreműködés — GLOSAR

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

1. Forkold ezt a tárolót.
2. Másold a `data/dictionaries/example.json` fájlt a `data/dictionaries/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Szabályok

- Egy bejegyzés = egy fájl.
- Mindig add meg a forrást.
- Csak olyan anyagot küldj, amelyet jogszerűen megoszthatsz (nincs másolt, védett szöveg).
- Légy kedves: lásd az Etikai kódexet.

## Szavak és hangfelvételek hozzáadása

1. Nyisd meg az oldalt (`index.html` vagy https://glosar.chiuta.ro), és lépj a „Hozzáadás” lapra: válaszd ki a nyelvet, írd le a szót és a jelentését legalább egy nyelven, válaszd ki a szófajt, és add meg a nyelvjárást és az írásrendszert, ha ismered őket.
2. Mindig add meg a forrást: egy könyvet vagy weboldalt (a címével), illetve a beszélőt, akitől a szót hallottad. Egy szócikket csak akkor jelölj `sourced` állapotúnak, ha közölt forrásból másoltad, és csak akkor `reviewed` állapotúnak, ha rajtad kívül egy másik beszélő megerősítette, és megadta a nevét.
3. Csak azt írd le, amit tudsz vagy amit idézni tudsz; olyan nyelvnél, amelyet nem beszélsz, soha ne pótolj hiányt emlékezetből. Ne másolj le jogvédett szótárt (egyes szavak a forrásukkal rendben vannak, hosszú listák és meghatározások nem), és csak olyanokat vegyél fel, akik beleegyeztek.
4. Opcionálisan vedd fel a szót (lásd `docs/recording-guide.md`): Opus Ogg vagy WebM tárolóban, legfeljebb 50 KB.
5. Nyomd meg a „Minden letöltése” gombot, és küldd el a `glosar-contribution.json` fájlt egy issue-ban vagy pull requestben; egy karbantartó lefuttatja a `python scripts/import_bundle.py glosar-contribution.json`, majd a `python scripts/validate.py` parancsot.
6. Ha inkább fájlokkal dolgozol, másold a `data/dictionaries/example.json` fájlt a `data/dictionaries/<lang>-<headword>.json` helyre (a szó ékezetek nélkül: `ruq-tinti.json`; az azonos szóval készült második szócikk `-2` végződést kap), szerkeszd, és futtasd a `python scripts/validate.py` parancsot.
7. A beszélők úgy segíthetnek a legtöbbet, ha átnézik a kezdő szócikkeket és felveszik a számneveket: nyiss egy issue-t a szócikk azonosítójával (`rup-tsintsi`) és a javításoddal. Részletek a `docs/contributor-guide.md` fájlban.
