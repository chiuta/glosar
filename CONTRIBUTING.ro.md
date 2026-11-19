# Cum contribui — GLOSAR

[English](CONTRIBUTING.md) · **Română** · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-20

1. Fă fork acestui depozit.
2. Copiază `data/dictionaries/example.json` în `data/dictionaries/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Reguli

- O intrare = un fișier.
- Citează întotdeauna o sursă.
- Contribuie doar cu material pe care ai voie să-l partajezi (fără texte copiate protejate de drepturi de autor).
- Fii amabil: vezi Codul de conduită.

## Adăugarea de cuvinte și înregistrări

1. Deschide pagina (`index.html` sau https://glosar.chiuta.ro) și mergi la fila «Adăugare»: alege limba, scrie cuvântul și sensul lui în cel puțin o limbă, alege partea de vorbire și adaugă dialectul și sistemul de scriere dacă le știi.
2. Dă mereu sursa: o carte sau o pagină web (cu adresa ei) ori vorbitorul de la care ai auzit cuvântul. Marchează o intrare `sourced` doar dacă ai copiat-o dintr-o sursă publicată și `reviewed` doar dacă un alt vorbitor decât tine a confirmat-o și și-a spus numele.
3. Scrie doar ce știi sau poți cita; nu completa niciodată din memorie o limbă pe care nu o vorbești. Nu reproduce un dicționar protejat de drepturi de autor (cuvintele luate separat, cu sursa lor, sunt în regulă; listele lungi și definițiile nu) și înregistrează doar persoane care au fost de acord.
4. Opțional, înregistrează cuvântul (vezi `docs/recording-guide.ro.md`): Opus în Ogg sau WebM, cel mult 50 KB.
5. Apasă «Descarcă tot» și trimite `glosar-contribution.json` într-un issue sau un pull request; un responsabil rulează `python scripts/import_bundle.py glosar-contribution.json`, apoi `python scripts/validate.py`.
6. Dacă preferi fișierele, copiază `data/dictionaries/example.json` în `data/dictionaries/<lang>-<headword>.json` (cuvântul fără diacritice: `ruq-tinti.json`; a doua intrare cu același cuvânt primește `-2`), editează-l și rulează `python scripts/validate.py`.
7. Vorbitorii pot ajuta cel mai mult revizuind intrările de pornire și înregistrând numeralele: deschide un issue cu id-ul intrării (`rup-tsintsi`) și corectura ta. Detalii în `docs/contributor-guide.ro.md`.
