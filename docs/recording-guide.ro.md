# GLOSAR — ghid de înregistrare

[English](recording-guide.md) · **Română**

O înregistrare îi lasă pe cei care învață să audă cuvântul. Un cuvânt, un fișier scurt. Îți trebuie un telefon sau un calculator cu microfon și un browser.

## Ce acceptă proiectul

- **Audio Opus**, într-un container **Ogg** (`.opus` sau `.ogg`) sau **WebM** (`.webm`);
- **cel mult 50 KB** pe cuvânt (pagina înregistrează la 24 kbit/s și se oprește singură după 8 secunde; 8 secunde pline înseamnă aproximativ 20–30 KB);
- un cuvânt sau o expresie scurtă pe fișier; fișierul poartă numele intrării (`audio/ruq-tinti.opus`), iar scriptul de import face asta pentru tine.

Alte formate (MP3, WAV, M4A, Vorbis în Ogg) sunt refuzate de pagină și de `scripts/validate.py`.

## Înregistrează în pagină

1. Deschide fila **Adăugare** și completează cuvântul (înregistrarea aparține intrării pe care o scrii).
2. La **Înregistrare audio**, apasă **Înregistrează**. Browserul cere microfonul: permite-l.
3. Spune cuvântul o dată, calm, așa cum l-ai spune unui prieten. Lasă cam o jumătate de secundă de liniște înainte și după.
4. Apasă **Oprește** (sau așteaptă: se oprește singură). Pagina arată mărimea («Înregistrare gata: 22 KB») și un buton **Ascultă**; ascult-o.
5. Nu e bună? Apasă **Șterge înregistrarea** și înregistrează din nou.
6. Apasă **Verifică**, apoi **Adaugă în lista mea**. Înregistrarea se păstrează în browser împreună cu intrarea și intră în fișierul de contribuție.

**Ce browsere înregistrează Opus?** Chrome, Edge și Firefox (calculator și Android). **Safari (iPhone, iPad, Mac) nu poate înregistra Opus**: acolo folosește alt browser sau încarcă un fișier făcut cu altă aplicație (mai jos).

## Sfaturi pentru o înregistrare bună

- O cameră liniștită, uși închise, fără ventilator sau apă curgând; un dulap sau un pat cu o pătură fac un mic studio bun.
- Microfonul cam la o palmă de gură, puțin într-o parte, ca «p» și «t» să nu pocnească. Microfonul unor căști merge bine.
- Un cuvânt, rostit firesc. Nu-l citi ca pe o listă și nu striga. Dacă cuvântul are variante dialectale, înregistrează-o pe cea despre care e intrarea și scrie dialectul în intrare.
- Verifică să nu fie telefonul într-un mod de economisire care oprește microfonul.
- Înregistrează doar pe tine sau persoane care au fost de acord să fie înregistrate și să-și publice vocea sub licența proiectului.

## Încarcă un fișier făcut cu altă aplicație

Dacă ai deja o înregistrare sau folosești Safari, convert-o în Opus și încarc-o la **Sau încarcă un fișier**. Cu `ffmpeg` (gratuit) instalat:

```
ffmpeg -i word.m4a -ac 1 -c:a libopus -b:a 24k -t 8 word.opus
```

`-ac 1` o face mono, `-b:a 24k` o ține mică, `-t 8` o taie la 8 secunde. Verifică mărimea (sub 50 KB): dacă e mai mare, scurtează liniștea sau coboară rata de biți (`-b:a 16k`). Pagina îți spune dacă fișierul nu e Opus sau e prea mare.

## Verifică un fișier din linia de comandă

```
python scripts/validate.py
```

eșuează dacă un fișier audio din intrare lipsește, nu e Opus în Ogg sau WebM, are peste 50 KB sau nu poartă numele intrării.

## Confidențialitate

Nimic nu se trimite când înregistrezi: sunetul rămâne în browser până descarci fișierul de contribuție și îl trimiți tu. Pagina nu îți păstrează vocea nicăieri altundeva și nu are conturi.
