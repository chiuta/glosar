# GLOSAR

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

🌐 https://glosar.chiuta.ro

> Offline dictionaries for minority and endangered languages, built by their speakers.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha, usable: the single `index.html` is an offline dictionary for Aromanian, Megleno-Romanian and Romani (Istro-Romanian is declared but still has no entries). It searches without regard to diacritics, shows which of 50 basic words are missing, lets you add words with a source and a recording, exports to TSV and Anki, and produces a contribution file that `scripts/import_bundle.py` turns into data files. The 43 starter entries come from cited public pages and have not been reviewed by speakers.

## What it does

- Search by word, variant or meaning (in any of the eight interface languages), ignoring diacritics: typing `tinti` finds `ținți`. Filters for language, reliability (draft, sourced, reviewed) and recordings; every result shows the part of speech, dialect, spelling system, source and licence, and plays the recording.
- Coverage: a table of 50 basic concepts (numbers, family, body, nature, qualities) shows for every language which words exist and which are missing; a click on a gap opens the add form with the concept already filled in.
- Add: a form that checks every field, warns about duplicates, adds many words from a pasted list, and records or uploads a pronunciation (Opus in Ogg or WebM, at most 50 KB); what you add stays in the browser until you download it.
- Export: everything or only your own entries as TSV (opens in a spreadsheet) or as an Anki file (language, reliability and concept as tags), and a contribution file, recordings included, that you can send to the project.
- Data: one JSON file per entry in `data/dictionaries/`, the language index `data/languages.json` (ISO 639-3 codes, dialects, spelling systems) and the list `data/concepts.json`; interface in eight languages, dark and light themes, keyboard, works from 360 px wide; no network, no tracking.
- Installable as an app and available offline after the first visit when served over HTTPS (a service worker keeps the page; nothing else is stored or sent). Opened from a downloaded file it works the same, without installation.

## How it works

- `schema.json`, `languages.schema.json` and `concepts.schema.json` describe the data; `scripts/validate.py` checks every file against them and against the rules a schema cannot express: the file name, references to languages, dialects, spelling systems and concepts, a web address for `sourced` and a reviewer for `reviewed`, duplicates, and the audio files (Opus in Ogg or WebM, at most 50 KB).
- `src/engine.mjs` is the engine (no screen, no network): the folding rule used for searching and for file names, validation, ranking of results, duplicates, coverage, TSV and Anki export, the contribution file and the parser for pasted lists. `scripts/validate.py` and `scripts/import_bundle.py` apply the same folding rule; the tests compare the two.
- `src/ui.js`, `src/i18n.mjs` and `src/app.css` are the interface; `node scripts/build.mjs` builds the single `index.html` with the data and the recordings from `audio/` embedded (`--check` verifies that it matches).
- `npm test` runs the tests of the engine, the data, the Python scripts, the build and the interface texts; the browser tests are in the hub. Development needs Node.js 24 or newer and Python 3 with `jsonschema`; the page itself only needs a browser that knows ES2017.
- `manifest.webmanifest`, `sw.js` and the icons are produced by `node scripts/build.mjs` through the shared kit (`pwa` in `src/app.json`); `--check` also verifies them, and `npm test` checks that the manifest, the service worker version and the CSP match the page.

## Limits and what it does not do

- The built-in lists are starter material: numerals and a few words, each traced to a published source (Wikipedia, Wiktionary, the Angloromani dictionary at kratylos.org) and marked “sourced”. No speaker has reviewed them yet.
- Aromanian, Megleno-Romanian and Romani have only a handful of words each, Istro-Romanian none yet. The basic list of 50 concepts is far from covered (see the “Coverage” tab).
- Spelling systems differ between sources and between speakers: entries record the system used and list other spellings as variants. Search ignores diacritics (“tinti” finds “ținți”) but does not know that two spellings are the same word unless a variant says so.
- Recording needs a browser that records Opus (Chrome, Edge, Firefox). Safari records in another format: use an Opus file instead. Recordings are limited to 50 KB.
- What you add is kept in this browser only (localStorage, about 5 MB). Download your contributions regularly; clearing the browser data deletes them.
- The interface translations were made with an AI assistant and await review by native speakers; concept names exist only in English and Romanian.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/dictionaries/example.json` into `data/dictionaries/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.
5. No coding needed: add words on the page (tab “Add”), download your contribution file and send it in an issue or a pull request; a maintainer imports it with `python scripts/import_bundle.py` (see `docs/contributor-guide.md`).

## Good first issues

See `ISSUES_GOOD_FIRST.md` for ready-made tasks.

## License

Code: MIT. Contributed data: state its source; it is released under the same licence unless the file says otherwise.

## Support

If this project is useful, you can [buy me a coffee](https://buymeacoffee.com/echo.of.the.strings).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Add yourself with `@all-contributors please add @you for data` in your pull request.
