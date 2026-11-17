# Sarcini bune pentru început

[English](ISSUES_GOOD_FIRST.md) · **Română** · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Cere vorbitorilor de aromână să revizuiască cele 11 intrări de pornire (`rup-*`), să le corecteze și să pună `status: reviewed` cu `reviewed_by`
- [ ] Cere vorbitorilor de meglenoromână să revizuiască în același fel cele 10 intrări de pornire (`ruq-*`)
- [ ] Cere vorbitorilor de romani să revizuiască cele 22 de intrări de pornire (`rom-*`) și să adauge `dialect` pentru fiecare formă (sursele nu îl dau)
- [ ] Adaugă primele intrări în istroromână (`ruo`) dintr-o sursă publicată, cu adresa ei web (niciodată din memorie)
- [ ] Adaugă în `data/languages.json` o altă limbă minoritară sau pe cale de dispariție (cod ISO 639-3, dialecte, sisteme de scriere), cu o primă listă de cuvinte dintr-o sursă citată
- [ ] Extinde lista de bază la 100 de concepte în `data/concepts.json` și adaugă numele conceptelor în franceză, italiană, spaniolă, portugheză, germană și maghiară (există doar în engleză și română)
- [ ] Înregistrează cele zece numerale ale fiecărei limbi cu aplicația (Opus, sub 50 KB) și trimite fișierul de contribuție (doar vorbitori)
- [ ] Cere vorbitorilor nativi să revizuiască textele interfeței din `src/i18n.mjs` (franceză, italiană, spaniolă, portugheză, germană, maghiară); au fost scrise cu un asistent de IA
- [ ] Adaugă un filtru de dialect și unul de sistem de scriere în fila de căutare, cu teste
- [ ] Fă înregistrarea să funcționeze în Safari: înregistrează WAV în pagină și codează-l în Opus în JavaScript (fără rețea, cel mult 50 KB) sau documentează o comandă `ffmpeg` în `docs/recording-guide.ro.md`

Creează-le pe toate pe GitHub cu `scripts/create_issues.sh` (cere CLI-ul `gh`).
