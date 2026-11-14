# GLOSAR

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.1.0 · Last updated: 2026-11-14

🌐 https://glosar.chiuta.ro

> Offline dictionaries for minority and endangered languages, built by their speakers.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha: the repository holds the structure, the data schema or the first examples and the contribution guides. The scope below is the plan, not what works today.

## Planned scope

- A language index (`languages.json`) based on ISO 639-3 codes, and a data schema with optional `dialect` and `orthography` fields.
- Starter word lists of about 50 basic words (numbers, family, body) for Aromanian (rup), Megleno-Romanian (ruq) and Romani (rom).
- An offline search page with diacritic-insensitive matching.
- Audio recordings (Opus, under 50 KB per word) with a recording guide, and export to Anki/TSV for learners.
- A checker that warns about duplicate headwords, and a contributor guide for non-technical speakers.

None of this is implemented yet: each item is a ready-made task in `ISSUES_GOOD_FIRST.md`.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/dictionaries/example.json` into `data/dictionaries/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

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
