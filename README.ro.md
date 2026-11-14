# GLOSAR

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.1.0 · Ultima actualizare: 2026-11-14

🌐 https://glosar.chiuta.ro

> Dicționare offline pentru limbi minoritare și pe cale de dispariție, create de vorbitorii lor.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa: depozitul conține structura, schema de date sau primele exemple și ghidurile de contribuție. Domeniul de mai jos este planul, nu ceea ce funcționează azi.

## Domeniu planificat

- Un index al limbilor (`languages.json`) pe baza codurilor ISO 639-3 și o schemă de date cu câmpurile opționale `dialect` și `orthography`.
- Liste de pornire cu circa 50 de cuvinte de bază (numere, familie, corp) pentru aromână (rup), meglenoromână (ruq) și romani (rom).
- O pagină de căutare offline, insensibilă la diacritice.
- Înregistrări audio (Opus, sub 50 KB pe cuvânt) cu un ghid de înregistrare, și export în Anki/TSV pentru cei care învață.
- Un verificator care avertizează asupra cuvintelor-titlu duplicate și un ghid pentru vorbitori fără pregătire tehnică.

Nimic din asta nu este implementat încă: fiecare punct este o sarcină gata pregătită în `ISSUES_GOOD_FIRST.md`.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/dictionaries/example.json` în `data/dictionaries/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
