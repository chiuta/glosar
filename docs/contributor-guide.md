# GLOSAR — contributor guide

**English** · [Română](contributor-guide.ro.md)

For speakers and learners of Aromanian, Megleno-Romanian, Istro-Romanian, Romani and the languages that will join them. **No coding is needed.** Everything happens on the page (`index.html`, or https://glosar.chiuta.ro): you add words, check them, and download one file that you send to the project.

## 1. What to add, and what not to

- **Words** in their dictionary form, with at least one meaning (in any of the eight interface languages), the part of speech, and a **source**. Variants, examples, a note, the dialect, the spelling system and a recording are optional.
- **Only what you know or can cite.** If you speak the language, you are the source: write who you are or where you learned the word (“my grandmother, village X”). If you do not speak it, copy only single words from a published source and give its web address. Never fill a gap from memory.
- **No copied dictionaries.** One word with its source is fine; long lists, definitions or whole entries from a copyrighted dictionary are not.
- **Recordings** only of yourself or of people who agreed to it.

## 2. The three reliability levels

| Level | Meaning | What the data needs |
| --- | --- | --- |
| `draft` | entered, not yet checked by anyone else | a source |
| `sourced` | copied from a published source | a source and its web address (`source_url`) |
| `reviewed` | confirmed by a speaker who is not the one who entered it | a source and the reviewer’s name (`reviewed_by`) |

Search can show only `sourced` and `reviewed` entries, or only `reviewed` ones.

## 3. Add a word

1. Open the **Add** tab.
2. Choose the **language of the word**, write the **word** in its dictionary form and, if you like, **other spellings** separated by commas.
3. Choose the **part of speech** and write the **meaning** in at least one language; “Meanings in other languages” opens more fields.
4. Optional: the **concept** from the basic list of 50 (numbers, family, body, nature, qualities), the **dialect** and the **spelling system** (hover over a spelling system in the results to read its note), a **note** (where it is used, what not to confuse it with) and **examples**.
5. Choose the **Reliability** (see the table above): leave *draft* if nobody has checked it; choose *sourced* if you copied it from a published source and give that source’s web address (it must start with `https://`); choose *reviewed* if another speaker confirmed it and write their name. Write the **source** (required) in every case.
6. Press **Check**: the page lists what to fix and shows similar entries that already exist (“same meaning” means the word is already there; “other meaning” may be a homograph, so say so in the note).
7. Press **Add to my list**. Repeat for every word.

Faster: open **Coverage**, find the empty cell of the language and concept you know, and press **Add**: the form opens with both filled in. For a long list use **Add many words at once**: one line per word, the word then a tab, a semicolon or `=` and the meaning; language, part of speech, spelling system, reliability and source come from the form above (200 lines at most).

## 4. Add a recording (optional)

See `recording-guide.md`. In short: press **Record**, say the word once, press **Stop**; at most 8 seconds and 50 KB, Opus in Ogg or WebM. Or upload an `.opus`, `.ogg` or `.webm` file.

## 5. Send it

What you add stays in your browser (about 4 MB, 500 entries at most) until you press **Download everything (contribution file)**. That gives you `glosar-contribution.json`, with the recordings inside. Send it in one of these ways:

- open an issue (template “New entry”) and attach the file;
- or open a pull request that adds the file to the repository (any folder, for example `contributions/`; a maintainer imports it);
- or send it to the maintainers by e-mail.

Per entry you can also press **Download .json** (and **Download audio**) to get the single data file and recording.

## 6. What the maintainers do

```
python scripts/import_bundle.py glosar-contribution.json --dry-run   # shows what would be written
python scripts/import_bundle.py glosar-contribution.json            # writes data/dictionaries/*.json and audio/*
python scripts/validate.py                                          # same checks as the CI
```

The importer never overwrites anything: an entry that already exists with the same meanings is skipped, and a second entry with the same headword gets a `-2`, `-3` … suffix. Then the page is rebuilt with `node scripts/build.mjs`.

## 7. Prefer files? Work with the repository

Copy `data/dictionaries/example.json` to `data/dictionaries/<lang>-<headword>.json`: the file name is the language code and the headword without diacritics (`ruq-tinti.json`, `rup-tsintsi.json`); non-Latin letters become their Unicode code. One entry = one file. Run `python scripts/validate.py` (needs Python 3 and `pip install jsonschema`) and open a pull request. The fields are described in `schema.json`; the languages, dialects and spelling systems you can use are listed in `data/languages.json` (to add a language, add it there first); the basic concepts are in `data/concepts.json`.

## 8. How speakers can help most

- **Review** the starter entries: open an issue with the entry id (`rup-tsintsi`), say what is right or wrong, and give your name; a maintainer sets `status: reviewed` and `reviewed_by`.
- **Record the ten numerals** of your language.
- **Fill the empty cells** of the Coverage tab.
- **Tell us about spelling systems**: which one you write in, and the other spellings you see.

Be kind; see the Code of Conduct. Thank you for keeping a language alive.
