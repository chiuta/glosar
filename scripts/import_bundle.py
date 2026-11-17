#!/usr/bin/env python3
"""Turn a contribution file made by the app ("Download everything") into data files.

  python scripts/import_bundle.py glosar-contribution.json            write the files
  python scripts/import_bundle.py glosar-contribution.json --dry-run  only show what would be written

For every entry it writes data/dictionaries/<lang>-<headword>.json and, when the entry has a recording, the Opus file in
audio/. Entries that already exist with the same meanings are skipped; an entry with a headword that exists but other
meanings gets a -2, -3 … suffix. Nothing is overwritten. Afterwards it runs the same checks as scripts/validate.py.
Needs the jsonschema package (pip install jsonschema); no network.
"""
import base64
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import validate  # noqa: E402

ROOT = validate.ROOT
ORDER = ["lang", "headword", "variants", "pos", "gloss", "concept", "dialect", "orthography", "status", "reviewed_by", "notes", "examples", "audio", "source", "source_url", "license"]
DATA_URI = re.compile(r"^data:audio/(webm|ogg)(?:;codecs=opus)?;base64,([A-Za-z0-9+/=]+)$")
MAX_ENTRIES = 500


def canonical(entry):
    out = {k: entry[k] for k in ORDER if k in entry}
    extra = [k for k in entry if k not in out]
    if extra:
        raise ValueError("unknown field(s): " + ", ".join(sorted(extra)))
    return out


def main(argv):
    dry = "--dry-run" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if len(paths) != 1:
        print(__doc__, file=sys.stderr)
        return 2
    try:
        bundle = json.loads(pathlib.Path(paths[0]).read_text(encoding="utf-8"))
    except (OSError, ValueError) as ex:
        print("cannot read %s: %s" % (paths[0], ex), file=sys.stderr)
        return 2
    if not isinstance(bundle, dict) or bundle.get("format") != "glosar-bundle" or bundle.get("version") != 1 or not isinstance(bundle.get("entries"), list):
        print("not a GLOSAR contribution file (format glosar-bundle, version 1)", file=sys.stderr)
        return 2
    if len(bundle["entries"]) > MAX_ENTRIES:
        print("too many entries (%d; the limit is %d)" % (len(bundle["entries"]), MAX_ENTRIES), file=sys.stderr)
        return 2
    sch = validate.Draft7Validator(validate.load(ROOT / "schema.json"))
    written, skipped, problems = 0, 0, 0
    for n, raw in enumerate(bundle["entries"], 1):
        if not isinstance(raw, dict):
            print("entry %d: not an object" % n)
            problems += 1
            continue
        entry = dict(raw)
        audio_data = entry.pop("audio_data", None)
        entry.pop("audio", None)
        eid = None
        try:
            if not isinstance(entry.get("lang"), str) or not isinstance(entry.get("headword"), str):
                raise ValueError("lang and headword are required")
            base = validate.entry_id(entry["lang"], entry["headword"])
            ext = None
            if audio_data is not None:
                m = DATA_URI.match(audio_data) if isinstance(audio_data, str) else None
                if not m:
                    raise ValueError("audio_data must be a base64 data URI (audio/webm or audio/ogg, Opus)")
                blob = base64.b64decode(m.group(2))
                if len(blob) > validate.MAX_AUDIO:
                    raise ValueError("the recording is %d bytes (the limit is %d)" % (len(blob), validate.MAX_AUDIO))
                kind = validate.audio_kind(blob)
                if not kind:
                    raise ValueError("the recording is not Opus in an Ogg or WebM container")
                ext = "opus" if kind == "ogg" else "webm"
            eid, k = base, 2
            while (ROOT / "data" / "dictionaries" / (eid + ".json")).exists():
                old = validate.load(ROOT / "data" / "dictionaries" / (eid + ".json"))
                if old.get("gloss") == entry.get("gloss"):
                    eid = None
                    break
                eid = "%s-%d" % (base, k)
                k += 1
            if eid is None:
                print("skip %s: already present with the same meanings" % base)
                skipped += 1
                continue
            if ext:
                entry["audio"] = "audio/%s.%s" % (eid, ext)
            entry = canonical(entry)
            bad = validate.schema_errors(sch, entry, eid)
            if bad:
                raise ValueError("; ".join(b.split(": ", 1)[1] for b in bad))
        except ValueError as ex:
            print("entry %d (%s): %s" % (n, raw.get("headword", "?") if isinstance(raw, dict) else "?", ex))
            problems += 1
            continue
        print("%s %s" % ("would write" if dry else "write", eid))
        if not dry:
            (ROOT / "data" / "dictionaries" / (eid + ".json")).write_text(json.dumps(entry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            if ext:
                (ROOT / "audio").mkdir(exist_ok=True)
                (ROOT / entry["audio"]).write_bytes(blob)
        written += 1
    print("%d written, %d skipped, %d with problems" % (written, skipped, problems))
    if not dry and written:
        errors, warnings, _ = validate.check()
        for w in warnings:
            print("warning: " + w)
        for e in errors:
            print("error: " + e)
        if errors:
            return 1
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
