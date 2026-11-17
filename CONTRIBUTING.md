# Contributing — GLOSAR

**English** · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

1. Fork this repository.
2. Copy `data/dictionaries/example.json` into `data/dictionaries/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

## Rules

- One entry = one file.
- Always cite a source.
- Contribute only material you may legally share (no copied copyrighted text).
- Be kind: see the Code of Conduct.

## Adding words and recordings

1. Open the page (`index.html`, or https://glosar.chiuta.ro) and go to the “Add” tab: choose the language, write the word and its meaning in at least one language, pick the part of speech, and add the dialect and the spelling system if you know them.
2. Always give the source: a book or a web page (with its address), or the speaker you heard the word from. Mark an entry `sourced` only when you copied it from a published source, and `reviewed` only when a speaker other than you confirmed it and gave their name.
3. Write only what you know or can cite; never fill a gap from memory for a language you do not speak. Do not reproduce a copyrighted dictionary (single words with their source are fine; long lists and definitions are not), and record only people who agreed.
4. Optionally record the word (see `docs/recording-guide.md`): Opus in Ogg or WebM, at most 50 KB.
5. Press “Download everything” and send `glosar-contribution.json` in an issue or a pull request; a maintainer runs `python scripts/import_bundle.py glosar-contribution.json` and then `python scripts/validate.py`.
6. If you prefer files, copy `data/dictionaries/example.json` to `data/dictionaries/<lang>-<headword>.json` (the headword without diacritics: `ruq-tinti.json`; a second entry with the same headword gets `-2`), edit it and run `python scripts/validate.py`.
7. Speakers can help most by reviewing the starter entries and recording the numerals: open an issue with the entry id (`rup-tsintsi`) and your correction. Details in `docs/contributor-guide.md`.
