import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const DIR = path.join(ROOT, 'data', 'dictionaries');
const schema = rd('schema.json');
const langsDoc = rd('data/languages.json');
const conceptsDoc = rd('data/concepts.json');
const UI = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
const dataFiles = files.filter((f) => f !== 'example.json');
const entries = dataFiles.map((f) => ({ file: f, base: f.replace(/\.json$/, ''), e: rd('data/dictionaries/' + f) }));
const CTX = {
  languages: Object.fromEntries(langsDoc.languages.map((l) => [l.code, l])),
  concepts: Object.fromEntries(conceptsDoc.concepts.map((c) => [c.id, true]))
};

test('schema.json și motorul au aceleași câmpuri, enumerări și limite', () => {
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['lang', 'headword', 'pos', 'gloss', 'source']);
  assert.deepEqual(Object.keys(schema.properties), ['lang', 'headword', 'variants', 'pos', 'gloss', 'concept', 'dialect', 'orthography', 'status', 'reviewed_by', 'notes', 'examples', 'audio', 'source', 'source_url', 'license']);
  assert.deepEqual(schema.properties.pos.enum, E.POS);
  assert.deepEqual(schema.properties.status.enum, E.STATUSES);
  const p = schema.properties;
  assert.equal(p.headword.maxLength, E.LIMITS.headword);
  assert.equal(p.gloss.additionalProperties.maxLength, E.LIMITS.gloss);
  assert.equal(p.notes.maxLength, E.LIMITS.notes);
  assert.equal(p.variants.maxItems, E.LIMITS.variants);
  assert.equal(p.examples.maxItems, E.LIMITS.examples);
  assert.equal(p.examples.items.maxLength, E.LIMITS.example);
  assert.equal(p.source.maxLength, E.LIMITS.source);
  assert.equal(p.variants.uniqueItems, true);
});

test('indexul de limbi: coduri unice, nume în toate cele opt limbi ale interfeței, ortografii și dialecte cu id-uri unice', () => {
  assert.equal(langsDoc.version, 1);
  const codes = langsDoc.languages.map((l) => l.code);
  assert.deepEqual(codes, ['rup', 'ruq', 'ruo', 'rom']);
  assert.equal(new Set(codes).size, codes.length);
  for (const l of langsDoc.languages) {
    assert.match(l.code, /^[a-z]{3}$/);
    for (const u of UI) assert.ok(l.name[u] && l.name[u].trim() === l.name[u], l.code + ': nume lipsă în ' + u);
    assert.ok(l.orthographies.every((o) => o.note.en && o.note.ro), l.code + ': note de ortografie în en și ro');
    assert.equal(new Set(l.orthographies.map((o) => o.id)).size, l.orthographies.length);
    assert.equal(new Set(l.dialects.map((d) => d.id)).size, l.dialects.length);
    for (const d of l.dialects) assert.match(d.iso639_3, /^[a-z]{3}$/);
  }
  const rom = langsDoc.languages.find((l) => l.code === 'rom');
  assert.deepEqual(rom.dialects.map((d) => d.iso639_3).sort(), ['rmc', 'rmf', 'rml', 'rmn', 'rmo', 'rmq', 'rmw', 'rmy']);
});

test('lista de bază: 50 de concepte în cinci grupuri, id-uri unice, nume în engleză și română', () => {
  const c = conceptsDoc.concepts;
  assert.equal(c.length, 50);
  assert.equal(new Set(c.map((x) => x.id)).size, 50);
  const by = {};
  for (const x of c) { (by[x.group] = by[x.group] || []).push(x); assert.ok(x.en.trim() && x.ro.trim(), x.id); assert.match(x.id, /^[a-z0-9]+(-[a-z0-9]+)*$/); }
  assert.deepEqual(Object.fromEntries(Object.entries(by).map(([g, a]) => [g, a.length])), { numbers: 10, family: 10, body: 12, nature: 10, basic: 8 });
  assert.deepEqual(by.numbers.map((x) => x.id), Array.from({ length: 10 }, (_, i) => 'number-' + (i + 1)));
  assert.deepEqual(by.numbers.map((x) => x.en), ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  assert.deepEqual(by.numbers.map((x) => x.ro), ['unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece']);
});

test('fiecare înregistrare e validă pentru motor, are numele de fișier așteptat și are sens în engleză și română', () => {
  assert.ok(entries.length >= 40, entries.length + ' înregistrări');
  const seen = new Set();
  for (const { file, base, e } of entries) {
    assert.deepEqual(E.validateEntry(e, CTX), [], file);
    const want = E.entryId(e.lang, e.headword);
    assert.ok(base === want || new RegExp('^' + want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-[2-9]\\d?$').test(base), file + ': numele trebuie să fie ' + want + '.json');
    assert.ok(e.gloss.en && e.gloss.ro, file + ': sens în engleză și română');
    assert.ok(!seen.has(base)); seen.add(base);
    assert.ok(e.concept && CTX.concepts[e.concept], file + ': concept');
    assert.ok(e.orthography, file + ': ortografie');
    assert.ok(e.status === 'sourced' || e.status === 'reviewed', file + ': starea');
    assert.match(e.source_url, /^https:\/\//, file);
    assert.equal(e.license, /^Angloromani/.test(e.source) ? 'The source states no licence; single words only' : 'CC BY-SA 4.0', file + ': licența sursei (Wikipedia/Wiktionary: CC BY-SA 4.0; dicționarul Angloromani nu declară una)');
  }
});

test('datele nu au duplicate (aceeași limbă, ortografie, parte de vorbire și cuvânt) și fiecare concept apare o singură dată pe limbă', () => {
  assert.deepEqual(E.duplicates(entries.map((x) => x.e)), []);
  const per = {};
  for (const { file, e } of entries) { const k = e.lang + '|' + e.concept; assert.ok(!per[k], file + ' și ' + per[k] + ' au același concept'); per[k] = file; }
});

test('numeralele 1–10 există pentru aromână, meglenoromână și romani, cu sensul conceptului', () => {
  const concepts = Object.fromEntries(conceptsDoc.concepts.map((c) => [c.id, c]));
  for (const lang of ['rup', 'ruq', 'rom']) {
    for (let n = 1; n <= 10; n++) {
      const hit = entries.filter((x) => x.e.lang === lang && x.e.concept === 'number-' + n);
      assert.equal(hit.length, 1, lang + ' number-' + n);
      assert.equal(hit[0].e.pos, 'numeral');
      assert.equal(hit[0].e.gloss.en, concepts['number-' + n].en);
      assert.equal(hit[0].e.gloss.ro, concepts['number-' + n].ro);
    }
  }
  assert.equal(entries.filter((x) => x.e.lang === 'ruo').length, 0, 'istroromâna nu are încă date citabile');
});

test('acoperirea din date: 11 + 10 + 22 + 0 concepte, iar motorul o calculează la fel', () => {
  const cov = E.coverage(conceptsDoc.concepts, entries.map((x) => x.e), ['rup', 'ruq', 'ruo', 'rom']);
  assert.deepEqual(Object.assign({}, cov.have), { rup: 11, ruq: 10, ruo: 0, rom: 22 });
  assert.equal(cov.total, 50);
});

test('data/dictionaries/example.json este un șablon valid, cu sens în cele opt limbi, afișat doar în vitrină (nu în dicționar)', () => {
  const ex = rd('data/dictionaries/example.json');
  assert.deepEqual(E.validateEntry(ex, CTX), []);
  assert.equal(ex.status, 'draft');
  assert.ok(!('id' in ex));
  assert.deepEqual(Object.keys(ex.gloss).sort(), ['de', 'en', 'es', 'fr', 'hu', 'it', 'pt', 'ro']);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(!html.includes('"rup-word-in-your-language"'), 'șablonul nu intră în datele dicționarului');
  assert.equal(html.split('"headword":"word-in-your-language"').length - 1, 1, 'șablonul apare o dată, ca exemplu în vitrină');
  assert.ok(!html.includes('"apã"'), 'exemplul vechi din vitrină a dispărut');
  assert.ok(html.includes('"rup-tsintsi"'));
});

test('sursele cu adresă: fiecare adresă din date e https și apare în sursa scrisă', () => {
  for (const { file, e } of entries) {
    assert.match(e.source_url, /^https:\/\/(en\.wikipedia\.org|en\.wiktionary\.org|www\.kratylos\.org|kratylos\.org)\//, file);
    assert.ok(/Wikipedia|Wiktionary|kratylos|Angloromani/i.test(e.source), file + ': sursa scrisă numește sursa');
  }
});
