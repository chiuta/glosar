# Jó első feladatok

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · **Magyar**

- [ ] Aromán beszélőkkel átnézetni a 11 kezdő szócikket (`rup-*`), kijavíttatni őket, és beállítani a `status: reviewed` értéket a `reviewed_by` mezővel
- [ ] Meglenoromán beszélőkkel ugyanígy átnézetni a 10 kezdő szócikket (`ruq-*`)
- [ ] Romani beszélőkkel átnézetni a 22 kezdő szócikket (`rom-*`), és megadni minden alak `dialect` mezőjét (a források nem közlik)
- [ ] Az első isztroromán (`ruo`) szócikkek felvétele közölt forrásból, a webcímével (soha nem emlékezetből)
- [ ] Újabb kisebbségi vagy veszélyeztetett nyelv felvétele a `data/languages.json` fájlba (ISO 639-3 kód, nyelvjárások, írásrendszerek) idézett forrásból származó első szólistával
- [ ] Az alaplista bővítése 100 fogalomra a `data/concepts.json` fájlban, és a fogalomnevek hozzáadása franciául, olaszul, spanyolul, portugálul, németül és magyarul (jelenleg csak angolul és románul vannak meg)
- [ ] Minden nyelv tíz számnevének felvétele az alkalmazással (Opus, 50 KB alatt), és a hozzájárulási fájl elküldése (csak beszélőknek)
- [ ] A `src/i18n.mjs` felületi szövegeinek (francia, olasz, spanyol, portugál, német, magyar) átnézetése anyanyelvi beszélőkkel; MI-asszisztenssel íródtak
- [ ] Nyelvjárás- és írásrendszer-szűrő hozzáadása a keresés laphoz, tesztekkel
- [ ] A felvétel működtetése Safariban: WAV felvétele az oldalon és Opus-szá kódolása JavaScriptben (hálózat nélkül, legfeljebb 50 KB), vagy egy `ffmpeg` parancs dokumentálása a `docs/recording-guide.md` fájlban

Hozd létre mindet GitHubon a `scripts/create_issues.sh` szkripttel (a `gh` CLI szükséges).
