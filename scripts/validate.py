#!/usr/bin/env python3
"""Check the GLOSAR data: every file against its JSON schema, then the cross-checks a schema cannot express.

  python scripts/validate.py            errors fail (exit 1); warnings are printed
  python scripts/validate.py --strict   warnings fail too
  python scripts/validate.py --list     also print the basic-word-list coverage per language

Checked: data/dictionaries/*.json (schema.json), data/languages.json (languages.schema.json), data/concepts.json
(concepts.schema.json); then file name = <lang>-<headword>, language / dialect / orthography / concept exist, `sourced`
entries have a source_url, `reviewed` entries a reviewer, audio files exist and are Opus in an Ogg or WebM container of
at most 50 KB, and duplicate headwords (same language, dialect, orthography, part of speech and headword).
The folding rules (fold, entry_id) are the same as in src/engine.mjs; the tests compare the two.
"""
import json
import pathlib
import re
import sys
import unicodedata

try:
    from jsonschema import Draft7Validator
except ImportError:  # pragma: no cover
    sys.exit("jsonschema is required: pip install jsonschema")

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX_AUDIO = 51200
MARKS = re.compile("[̀-ͯ]")
EXTRA = {"đ": "d", "ð": "d", "ł": "l", "ø": "o", "ß": "ss", "æ": "ae", "œ": "oe", "ı": "i", "þ": "th", "ħ": "h", "ə": "a", "ɨ": "i", "ʒ": "zh", "ʃ": "sh"}
EXTRA_RE = re.compile("[" + "".join(EXTRA) + "]")


def fold(s):
    """Lower case, no combining marks, a few letters spelled out; the key used for searching and file names."""
    s = MARKS.sub("", unicodedata.normalize("NFD", str(s).lower()))
    s = EXTRA_RE.sub(lambda m: EXTRA[m.group(0)], s)
    return re.sub(r"\s+", " ", s).strip()


def entry_id(lang, headword):
    slug = re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", fold(headword)))
    if not slug:
        slug = "u" + "-".join("%x" % ord(c) for c in str(headword).lower())
    return lang + "-" + slug


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def schema_errors(validator, doc, label):
    out = []
    for err in sorted(validator.iter_errors(doc), key=lambda e: list(map(str, e.absolute_path))):
        where = "/".join(map(str, err.absolute_path)) or "(root)"
        out.append("%s: %s: %s" % (label, where, err.message))
    return out


def audio_kind(data):
    """'ogg' = Opus in Ogg (OggS + OpusHead in the first 200 bytes), 'webm' = Opus in WebM (EBML header + A_OPUS in the first 4096), else ''."""
    if len(data) < 12:
        return ""
    if data[:4] == b"OggS":
        return "ogg" if b"OpusHead" in data[:200] else ""
    if data[:4] == b"\x1a\x45\xdf\xa3":
        return "webm" if b"A_OPUS" in data[:4096] else ""
    return ""


def audio_problem(root, name):
    p = root / name
    if not p.is_file():
        return "audio file %s is missing" % name
    data = p.read_bytes()
    if len(data) > MAX_AUDIO:
        return "%s is %d bytes (the limit is %d)" % (name, len(data), MAX_AUDIO)
    ext = name.rsplit(".", 1)[-1]
    kind = audio_kind(data)
    if ext in ("opus", "ogg") and kind != "ogg":
        return "%s is not Opus in an Ogg container" % name
    if ext == "webm" and kind != "webm":
        return "%s is not Opus in a WebM container" % name
    return None


def check(root=ROOT):
    """Return (errors, warnings, stats)."""
    errors, warnings = [], []
    sch = {n: Draft7Validator(load(root / f)) for n, f in (("entry", "schema.json"), ("languages", "languages.schema.json"), ("concepts", "concepts.schema.json"))}
    langs_doc = load(root / "data" / "languages.json")
    concepts_doc = load(root / "data" / "concepts.json")
    errors += schema_errors(sch["languages"], langs_doc, "data/languages.json")
    errors += schema_errors(sch["concepts"], concepts_doc, "data/concepts.json")
    langs = {l["code"]: l for l in langs_doc.get("languages", [])}
    concepts = {c["id"]: c for c in concepts_doc.get("concepts", [])}
    if len(langs) != len(langs_doc.get("languages", [])):
        errors.append("data/languages.json: duplicate language code")
    if len(concepts) != len(concepts_doc.get("concepts", [])):
        errors.append("data/concepts.json: duplicate concept id")

    files = sorted((root / "data" / "dictionaries").glob("*.json"), key=lambda p: p.stem)  # rup-un before rup-un-2
    seen, per_lang, covered = {}, {}, {}
    for f in files:
        rel = f.relative_to(root).as_posix()
        try:
            e = load(f)
        except ValueError as ex:
            errors.append("%s: not valid JSON (%s)" % (rel, ex))
            continue
        bad = schema_errors(sch["entry"], e, rel)
        errors += bad
        if bad or f.name == "example.json":  # the template is checked against the schema only
            continue
        lang = langs.get(e["lang"])
        if lang is None:
            errors.append("%s: language %s is not listed in data/languages.json" % (rel, e["lang"]))
            continue
        base = f.name[:-5]
        want = entry_id(e["lang"], e["headword"])
        if not (base == want or re.fullmatch(re.escape(want) + r"-[2-9]\d?", base)):
            errors.append("%s: the file name must be %s.json (or %s-2.json, -3 … for a second entry with the same headword)" % (rel, want, want))
        if "orthography" in e and e["orthography"] not in [o["id"] for o in lang["orthographies"]]:
            errors.append("%s: orthography %r is not listed for %s in data/languages.json" % (rel, e["orthography"], e["lang"]))
        if "dialect" in e and e["dialect"] not in [d["id"] for d in lang["dialects"]]:
            errors.append("%s: dialect %r is not listed for %s in data/languages.json" % (rel, e["dialect"], e["lang"]))
        if "concept" in e and e["concept"] not in concepts:
            errors.append("%s: concept %r is not in data/concepts.json" % (rel, e["concept"]))
        if e.get("status") == "sourced" and "source_url" not in e:
            errors.append("%s: a `sourced` entry needs a source_url" % rel)
        if e.get("status") == "reviewed" and "reviewed_by" not in e:
            errors.append("%s: a `reviewed` entry needs reviewed_by" % rel)
        if "audio" in e:
            if e["audio"] != "audio/" + base + e["audio"][e["audio"].rfind("."):]:
                errors.append("%s: the audio file must be named after the entry (audio/%s.opus)" % (rel, base))
            problem = audio_problem(root, e["audio"])
            if problem:
                errors.append("%s: %s" % (rel, problem))
        if e["lang"] == "rom" and "dialect" not in e:
            pass  # the macrolanguage: a dialect is welcome but not required
        key = "|".join([e["lang"], e.get("dialect", ""), e.get("orthography", ""), e["pos"], fold(e["headword"])])
        if key in seen:
            other = seen[key]
            if other[1] == e["gloss"]:
                errors.append("%s: duplicate of %s (same headword, part of speech and meanings)" % (rel, other[0]))
            else:
                warnings.append("%s: same headword and part of speech as %s but other meanings: a homograph? (use the notes to tell them apart)" % (rel, other[0]))
        else:
            seen[key] = (rel, e["gloss"])
        per_lang[e["lang"]] = per_lang.get(e["lang"], 0) + 1
        if "concept" in e:
            covered.setdefault(e["lang"], set()).add(e["concept"])
        for v in e.get("variants", []):
            if fold(v) == fold(e["headword"]) and v == e["headword"]:
                warnings.append("%s: the variant %r repeats the headword" % (rel, v))
    for code in langs:
        per_lang.setdefault(code, 0)
    return errors, warnings, {"entries": sum(per_lang.values()), "per_lang": per_lang, "concepts": len(concepts), "covered": covered}


def main(argv):
    strict, show = "--strict" in argv, "--list" in argv
    errors, warnings, st = check()
    for w in warnings:
        print("warning: " + w)
    for e in errors:
        print("error: " + e)
    if show:
        for code, n in sorted(st["per_lang"].items()):
            print("%s: %d entries, %d of %d basic concepts" % (code, n, len(st["covered"].get(code, ())), st["concepts"]))
    print("%d entries, %d language(s), %d error(s), %d warning(s)." % (st["entries"], len(st["per_lang"]), len(errors), len(warnings)))
    return 1 if errors or (strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
