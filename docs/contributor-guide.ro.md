# GLOSAR — ghid pentru contribuitori

[English](contributor-guide.md) · **Română**

Pentru vorbitori și învățăcei de aromână, meglenoromână, istroromână, romani și limbile care li se vor alătura. **Nu e nevoie de programare.** Totul se petrece în pagină (`index.html` sau https://glosar.chiuta.ro): adaugi cuvinte, le verifici și descarci un singur fișier pe care îl trimiți proiectului.

## 1. Ce să adaugi și ce nu

- **Cuvinte** în forma din dicționar, cu cel puțin un sens (în oricare dintre cele opt limbi ale interfeței), partea de vorbire și o **sursă**. Variantele, exemplele, o notă, dialectul, sistemul de scriere și o înregistrare sunt opționale.
- **Doar ce știi sau poți cita.** Dacă vorbești limba, tu ești sursa: scrie cine ești sau de unde ai învățat cuvântul («bunica mea, satul X»). Dacă nu o vorbești, copiază doar cuvinte luate separat dintr-o sursă publicată și dă-i adresa web. Nu completa niciodată un gol din memorie.
- **Fără dicționare copiate.** Un cuvânt cu sursa lui e în regulă; listele lungi, definițiile sau intrări întregi dintr-un dicționar protejat de drepturi de autor nu.
- **Înregistrări** doar ale tale sau ale unor persoane care au fost de acord.

## 2. Cele trei niveluri de încredere

| Nivel | Înseamnă | Ce cer datele |
| --- | --- | --- |
| `draft` | introdus, încă neverificat de altcineva | o sursă |
| `sourced` | copiat dintr-o sursă publicată | o sursă și adresa ei web (`source_url`) |
| `reviewed` | confirmat de un vorbitor care nu este cel care l-a introdus | o sursă și numele revizorului (`reviewed_by`) |

Căutarea poate arăta doar intrările `sourced` și `reviewed`, sau doar pe cele `reviewed`.

## 3. Adaugă un cuvânt

1. Deschide fila **Adăugare**.
2. Alege **limba cuvântului**, scrie **cuvântul** în forma din dicționar și, dacă vrei, **alte grafii** separate prin virgulă.
3. Alege **partea de vorbire** și scrie **sensul** în cel puțin o limbă; «Sensuri în alte limbi» deschide mai multe câmpuri.
4. Opțional: **conceptul** din lista de bază cu 50 (numere, familie, corp, natură, însușiri), **dialectul** și **sistemul de scriere** (ține cursorul peste un sistem de scriere în rezultate ca să-i citești nota), o **notă** (unde se folosește, cu ce nu trebuie confundat) și **exemple**.
5. Alege **Încredere** (vezi tabelul de mai sus): lasă *ciornă* dacă nimeni nu a verificat cuvântul; alege *cu sursă* dacă l-ai copiat dintr-o sursă publicată și dă adresa ei web (trebuie să înceapă cu `https://`); alege *verificat* dacă un alt vorbitor l-a confirmat și scrie numele lui. **Sursa** (obligatorie) se scrie în toate cazurile.
6. Apasă **Verifică**: pagina listează ce trebuie corectat și arată intrările asemănătoare care există deja («același sens» înseamnă că cuvântul e deja acolo; «alt sens» poate fi un omograf, așa că spune-o în notă).
7. Apasă **Adaugă în lista mea**. Repetă pentru fiecare cuvânt.

Mai repede: deschide **Acoperire**, găsește celula goală a limbii și conceptului pe care le știi și apasă **Adaugă**: formularul se deschide cu amândouă completate. Pentru o listă lungă folosește **Adaugă mai multe cuvinte deodată**: un rând pe cuvânt, cuvântul, apoi tab, punct și virgulă sau `=` și sensul; limba, partea de vorbire, sistemul de scriere, încrederea și sursa vin din formularul de deasupra (cel mult 200 de rânduri).

## 4. Adaugă o înregistrare (opțional)

Vezi `recording-guide.ro.md`. Pe scurt: apasă **Înregistrează**, spune cuvântul o dată, apasă **Oprește**; cel mult 8 secunde și 50 KB, Opus în Ogg sau WebM. Sau încarcă un fișier `.opus`, `.ogg` ori `.webm`.

## 5. Trimite-l

Ce adaugi rămâne în browser (aproximativ 4 MB, cel mult 500 de intrări) până apeși **Descarcă tot (fișier de contribuție)**. Obții `glosar-contribution.json`, cu înregistrările înăuntru. Trimite-l într-unul dintre aceste feluri:

- deschide un issue (șablonul «New entry») și atașează fișierul;
- sau deschide un pull request care adaugă fișierul în depozit (orice director, de exemplu `contributions/`; un responsabil îl importă);
- sau trimite-l prin e-mail responsabililor.

Pentru fiecare intrare poți apăsa și **Descarcă .json** (și **Descarcă audio**) ca să obții fișierul de date și înregistrarea separat.

## 6. Ce fac responsabilii

```
python scripts/import_bundle.py glosar-contribution.json --dry-run   # arată ce s-ar scrie
python scripts/import_bundle.py glosar-contribution.json            # scrie data/dictionaries/*.json și audio/*
python scripts/validate.py                                          # aceleași verificări ca în CI
```

Importul nu suprascrie nimic: o intrare care există deja cu aceleași sensuri este sărită, iar a doua intrare cu același cuvânt primește sufixul `-2`, `-3` … Apoi pagina se reconstruiește cu `node scripts/build.mjs`.

## 7. Preferi fișierele? Lucrează în depozit

Copiază `data/dictionaries/example.json` în `data/dictionaries/<lang>-<headword>.json`: numele fișierului este codul limbii și cuvântul fără diacritice (`ruq-tinti.json`, `rup-tsintsi.json`); literele nelatine devin codul lor Unicode. O intrare = un fișier. Rulează `python scripts/validate.py` (cere Python 3 și `pip install jsonschema`) și deschide un pull request. Câmpurile sunt descrise în `schema.json`; limbile, dialectele și sistemele de scriere pe care le poți folosi sunt în `data/languages.json` (pentru o limbă nouă, adaug-o mai întâi acolo); conceptele de bază sunt în `data/concepts.json`.

## 8. Cum pot ajuta cel mai mult vorbitorii

- **Revizuiește** intrările de pornire: deschide un issue cu id-ul intrării (`rup-tsintsi`), spune ce e corect sau greșit și dă-ți numele; un responsabil pune `status: reviewed` și `reviewed_by`.
- **Înregistrează cele zece numerale** ale limbii tale.
- **Completează celulele goale** din fila Acoperire.
- **Spune-ne despre sistemele de scriere**: în care scrii și ce alte grafii vezi.

Fii amabil; vezi Codul de conduită. Mulțumim că ții o limbă vie.
