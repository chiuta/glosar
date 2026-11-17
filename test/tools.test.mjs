import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FX = path.join(ROOT, 'test', 'fixtures');
const fx = (n) => fs.readFileSync(path.join(FX, n));
const py = (args, o = {}) => { const r = spawnSync('python3', args, { encoding: 'utf8', cwd: o.cwd || ROOT, input: o.input }); return { status: r.status, out: (r.stdout || '') + (r.stderr || '') }; };
const HAVE_PY = py(['-I', '-c', 'import jsonschema']).status === 0;
const T = HAVE_PY ? test : test.skip;
const tmpdirs = [];
const mktmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'glosar-test-')); tmpdirs.push(d); return d; };
test.after(() => { for (const d of tmpdirs) fs.rmSync(d, { recursive: true, force: true }); });

/** Un arbore mic de lucru: scheme, scripturi, indexul de limbi, lista de bază și două înregistrări. */
function tree() {
  const d = mktmp();
  for (const f of ['schema.json', 'languages.schema.json', 'concepts.schema.json']) fs.copyFileSync(path.join(ROOT, f), path.join(d, f));
  fs.mkdirSync(path.join(d, 'scripts')); fs.mkdirSync(path.join(d, 'data', 'dictionaries'), { recursive: true }); fs.mkdirSync(path.join(d, 'audio'));
  for (const f of ['validate.py', 'import_bundle.py']) fs.copyFileSync(path.join(ROOT, 'scripts', f), path.join(d, 'scripts', f));
  for (const f of ['languages.json', 'concepts.json']) fs.copyFileSync(path.join(ROOT, 'data', f), path.join(d, 'data', f));
  for (const f of ['rup-un.json', 'rup-doi.json']) fs.copyFileSync(path.join(ROOT, 'data', 'dictionaries', f), path.join(d, 'data', 'dictionaries', f));
  fs.copyFileSync(path.join(ROOT, 'data', 'dictionaries', 'example.json'), path.join(d, 'data', 'dictionaries', 'example.json'));
  return d;
}
const entry = (o) => Object.assign({ lang: 'rup', headword: 'test', pos: 'noun', gloss: { en: 'test' }, source: 's' }, o);
const put = (d, name, o) => fs.writeFileSync(path.join(d, 'data', 'dictionaries', name + '.json'), typeof o === 'string' ? o : JSON.stringify(o));
const validate = (d, ...flags) => py([path.join(d, 'scripts', 'validate.py'), ...flags], { cwd: d });

T('scripts/validate.py: datele din depozit trec fără erori și fără avertismente, și în modul --strict', () => {
  const r = py(['scripts/validate.py', '--strict', '--list']);
  assert.equal(r.status, 0, r.out);
  const n = fs.readdirSync(path.join(ROOT, 'data', 'dictionaries')).filter((f) => f.endsWith('.json') && f !== 'example.json').length;
  assert.match(r.out, new RegExp('^' + n + ' entries, 4 language\\(s\\), 0 error\\(s\\), 0 warning\\(s\\)\\.$', 'm'));
  assert.match(r.out, /^rup: 11 entries, 11 of 50 basic concepts$/m);
  assert.match(r.out, /^ruo: 0 entries, 0 of 50 basic concepts$/m);
  assert.match(r.out, /^rom: 22 entries, 22 of 50 basic concepts$/m);
});

T('fold și entry_id din Python dau exact aceleași rezultate ca fold și entryId din motor', () => {
  const words = ['ținți', 'ŢINŢI', 'Șase', 'noauă', 'apã', 'čhib', 'štar', 'pandž', 'panʒ', 'đ', 'Æ', 'ß', 'ł', 'ø', 'ð', 'þ', 'ħ', 'ə', 'ɨ', 'ʃ', 'œ', 'ı', '  A   b  ',
    'İ', 'ǎ', 'x', 'a b/c', 'दो', 'жена', '日本', 'a-b', '--x--', 'ÀÉÎÕÜ', 'ṭ', 'ǆ', 'ﬁ', 'Ǳ'];
  const code = 'import sys, json\nsys.path.insert(0, "scripts")\nimport validate\nw = json.loads(sys.stdin.read())\nprint(json.dumps([[validate.fold(x), validate.entry_id("rup", x)] for x in w], ensure_ascii=False))';
  const r = py(['-I', '-c', code], { input: JSON.stringify(words) });
  assert.equal(r.status, 0, r.out);
  const got = JSON.parse(r.out);
  words.forEach((w, i) => { assert.deepEqual(got[i], [E.fold(w), E.entryId('rup', w)], JSON.stringify(w)); });
});

T('schema.json și motorul se potrivesc: ce acceptă schema acceptă și motorul, iar motorul e mai strict doar în cazurile documentate', () => {
  const ok = { lang: 'rup', headword: 'x', pos: 'noun', gloss: { en: 'y' }, source: 's' };
  // [nume, înregistrare, acceptată de schemă, acceptată de motor]
  const cases = [
    ['minimă', ok, true, true],
    ['completă', Object.assign({}, ok, { variants: ['a'], concept: 'water', dialect: 'x-y', orthography: 'z', status: 'sourced', reviewed_by: 'm', notes: 'n', examples: ['e'], audio: 'audio/rup-x.opus', source_url: 'https://a.org/b', license: 'L' }), true, true],
    ['completă cu stare «draft»', Object.assign({}, ok, { variants: ['a'], concept: 'water', dialect: 'x-y', orthography: 'z', status: 'draft', notes: 'n', examples: ['e'], audio: 'audio/rup-x.webm', source_url: 'https://a.org/b', license: 'L' }), true, true],
    ['cheie în plus', Object.assign({}, ok, { id: 'x' }), false, false],
    ['limbă cu majuscule', Object.assign({}, ok, { lang: 'RUP' }), false, false],
    ['limbă cu 4 litere', Object.assign({}, ok, { lang: 'rupo' }), false, false],
    ['fără sursă', { lang: 'rup', headword: 'x', pos: 'noun', gloss: { en: 'y' } }, false, false],
    ['parte de vorbire necunoscută', Object.assign({}, ok, { pos: 'x' }), false, false],
    ['sensuri goale', Object.assign({}, ok, { gloss: {} }), false, false],
    ['cod de limbă de sens greșit', Object.assign({}, ok, { gloss: { EN: 'y' } }), false, false],
    ['sens prea lung', Object.assign({}, ok, { gloss: { en: 'y'.repeat(201) } }), false, false],
    ['variante repetate', Object.assign({}, ok, { variants: ['a', 'a'] }), false, false],
    ['21 de variante', Object.assign({}, ok, { variants: Array.from({ length: 21 }, (_, i) => 'v' + i) }), false, false],
    ['11 exemple', Object.assign({}, ok, { examples: Array.from({ length: 11 }, () => 'e') }), false, false],
    ['audio cu alt tip', Object.assign({}, ok, { audio: 'audio/x.mp3' }), false, false],
    ['adresă http', Object.assign({}, ok, { source_url: 'http://a.org' }), false, false],
    ['adresă cu spațiu', Object.assign({}, ok, { source_url: 'https://a b' }), false, false],
    ['concept cu majuscule', Object.assign({}, ok, { concept: 'Water' }), false, false],
    ['dialect cu majuscule', Object.assign({}, ok, { dialect: 'Balkan' }), false, false],
    ['licență goală', Object.assign({}, ok, { license: '' }), false, false],
    ['notă goală', Object.assign({}, ok, { notes: '' }), false, false],
    ['stare necunoscută', Object.assign({}, ok, { status: 'x' }), false, false],
    // schema nu exprimă condiții între câmpuri, motorul și validate.py da
    ['«reviewed» fără reviewer', Object.assign({}, ok, { status: 'reviewed' }), true, false],
    ['«sourced» fără adresă', Object.assign({}, ok, { status: 'sourced' }), true, false],
    // motorul refuză în plus spații la capete și caractere de control (date introduse de oameni în formular)
    ['cuvânt cu spațiu la început', Object.assign({}, ok, { headword: ' x' }), true, false],
    ['cuvânt cu caracter de control', Object.assign({}, ok, { headword: 'x\u0007' }), true, false],
    ['sens cu caracter de control', Object.assign({}, ok, { gloss: { en: 'y\u0007' } }), true, false],
    ['sursă cu caracter de control', Object.assign({}, ok, { source: 's\u0007' }), true, false]
  ];
  const code = 'import sys, json\nfrom jsonschema import Draft7Validator\nv = Draft7Validator(json.load(open("schema.json")))\nprint(json.dumps([v.is_valid(e) for e in json.loads(sys.stdin.read())]))';
  const r = py(['-I', '-c', code], { input: JSON.stringify(cases.map((c) => c[1])) });
  assert.equal(r.status, 0, r.out);
  const schemaOk = JSON.parse(r.out);
  const diff = [];
  cases.forEach((c, i) => {
    const eng = E.validateEntry(c[1], null);
    if (schemaOk[i] !== c[2]) diff.push(c[0] + ': schema ' + schemaOk[i] + ', așteptat ' + c[2]);
    if ((eng.length === 0) !== c[3]) diff.push(c[0] + ': motor ' + (eng.length === 0) + ', așteptat ' + c[3] + ' ' + JSON.stringify(eng));
    if (eng.length === 0 && !schemaOk[i]) diff.push(c[0] + ': motorul acceptă ce respinge schema');
  });
  assert.deepEqual(diff, []);
});

T('scripts/validate.py: duplicate, nume de fișier, referințe la limbi, dialecte, ortografii și concepte, stări', () => {
  const d = tree();
  let r = validate(d);
  assert.equal(r.status, 0, r.out);
  // aceeași cuvânt și aceleași sensuri = eroare; alte sensuri = avertisment (omograf), eroare doar cu --strict
  const un = JSON.parse(fs.readFileSync(path.join(d, 'data/dictionaries/rup-un.json'), 'utf8'));
  put(d, 'rup-un-2', Object.assign({}, un, { status: 'draft', notes: 'aceleași sensuri' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-un-2\.json: duplicate of data\/dictionaries\/rup-un\.json/);
  put(d, 'rup-un-2', Object.assign({}, un, { gloss: { en: 'a, an' } }));
  r = validate(d); assert.equal(r.status, 0, r.out); assert.match(r.out, /warning: .*rup-un-2\.json: same headword and part of speech .* homograph/);
  r = validate(d, '--strict'); assert.equal(r.status, 1);
  fs.rmSync(path.join(d, 'data/dictionaries/rup-un-2.json'));
  // diacriticele nu schimbă identitatea cuvântului (apã = apa) și nici numele fișierului
  put(d, 'rup-apa', entry({ headword: 'apã', gloss: { en: 'water' } }));
  assert.equal(validate(d).status, 0);
  put(d, 'rup-apa-2', entry({ headword: 'apa', gloss: { en: 'water' } }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-apa-2\.json: duplicate/);
  fs.rmSync(path.join(d, 'data/dictionaries/rup-apa-2.json'));
  // numele fișierului
  put(d, 'altceva', entry({ headword: 'zzz' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /altceva\.json: the file name must be rup-zzz\.json/);
  fs.rmSync(path.join(d, 'data/dictionaries/altceva.json'));
  // referințe
  const bad = {
    'rup-a1': [entry({ headword: 'a1', lang: 'xyz' }), /language xyz is not listed/],
    'rup-a2': [entry({ headword: 'a2', dialect: 'balkan' }), /dialect 'balkan' is not listed/],
    'rup-a3': [entry({ headword: 'a3', orthography: 'nu-exista' }), /orthography 'nu-exista' is not listed/],
    'rup-a4': [entry({ headword: 'a4', concept: 'nu-exista' }), /concept 'nu-exista' is not in data\/concepts\.json/],
    'rup-a5': [entry({ headword: 'a5', status: 'sourced' }), /a `sourced` entry needs a source_url/],
    'rup-a6': [entry({ headword: 'a6', status: 'reviewed' }), /a `reviewed` entry needs reviewed_by/],
    'rup-a7': [entry({ headword: 'a7', extra: 1 }), /rup-a7\.json: \(root\): Additional properties/]
  };
  for (const [name, [o, re]] of Object.entries(bad)) {
    put(d, name, o);
    r = validate(d);
    assert.equal(r.status, 1, name + '\n' + r.out);
    assert.match(r.out, re, name);
    fs.rmSync(path.join(d, 'data/dictionaries/' + name + '.json'));
  }
  put(d, 'rup-b1', '{ nu e json');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-b1\.json: not valid JSON/);
  fs.rmSync(path.join(d, 'data/dictionaries/rup-b1.json'));
  // șablonul example.json se verifică doar față de schemă
  put(d, 'example', entry({ headword: 'oricum', lang: 'xyz' }));
  assert.equal(validate(d).status, 0);
  put(d, 'example', entry({ extra: 1 }));
  assert.equal(validate(d).status, 1);
  // un dialect și o ortografie declarate trec
  put(d, 'example', JSON.parse(fs.readFileSync(path.join(ROOT, 'data/dictionaries/example.json'), 'utf8')));
  put(d, 'rom-ok', entry({ lang: 'rom', headword: 'ok', dialect: 'balkan', orthography: 'latin-standard', concept: 'water', status: 'reviewed', reviewed_by: 'M' }));
  assert.equal(validate(d).status, 0);
  // indexul de limbi și lista de bază se verifică față de scheme
  const langs = JSON.parse(fs.readFileSync(path.join(d, 'data/languages.json'), 'utf8'));
  langs.languages.push(Object.assign({}, langs.languages[0]));
  fs.writeFileSync(path.join(d, 'data/languages.json'), JSON.stringify(langs));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /duplicate language code/);
});

T('scripts/validate.py: fișierele audio — trebuie să existe, să poarte numele intrării, să fie Opus în Ogg sau WebM și sub 50 KB', () => {
  const d = tree();
  const a = (name, audio) => put(d, name, entry({ headword: name.slice(4), audio }));
  const copy = (src, dst) => fs.writeFileSync(path.join(d, 'audio', dst), typeof src === 'string' ? fx(src) : src);
  a('rup-s1', 'audio/rup-s1.opus'); copy('tone.opus', 'rup-s1.opus');
  a('rup-s2', 'audio/rup-s2.webm'); copy('tone.webm', 'rup-s2.webm');
  a('rup-s3', 'audio/rup-s3.ogg'); copy('tone.opus', 'rup-s3.ogg');
  let r = validate(d); assert.equal(r.status, 0, r.out);
  a('rup-m1', 'audio/rup-m1.opus');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-m1\.json: audio file audio\/rup-m1\.opus is missing/);
  fs.rmSync(path.join(d, 'data/dictionaries/rup-m1.json'));
  a('rup-n1', 'audio/alt-nume.opus'); copy('tone.opus', 'alt-nume.opus');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-n1\.json: the audio file must be named after the entry \(audio\/rup-n1\.opus\)/);
  fs.rmSync(path.join(d, 'data/dictionaries/rup-n1.json'));
  a('rup-v1', 'audio/rup-v1.opus'); copy('tone-vorbis.ogg', 'rup-v1.opus');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-v1\.opus is not Opus in an Ogg container/);
  a('rup-v1', 'audio/rup-v1.webm'); copy('tone-vorbis.webm', 'rup-v1.webm');
  r = validate(d); assert.match(r.out, /rup-v1\.webm is not Opus in a WebM container/);
  a('rup-v1', 'audio/rup-v1.webm'); copy('tone.opus', 'rup-v1.webm');
  r = validate(d); assert.match(r.out, /rup-v1\.webm is not Opus in a WebM container/, 'Ogg cu extensia .webm');
  a('rup-v1', 'audio/rup-v1.opus'); copy(Buffer.from('nu e audio deloc, doar text de umplutură'), 'rup-v1.opus');
  r = validate(d); assert.match(r.out, /rup-v1\.opus is not Opus in an Ogg container/);
  copy(Buffer.concat([fx('tone.opus'), Buffer.alloc(51200)]), 'rup-v1.opus');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /rup-v1\.opus is \d+ bytes \(the limit is 51200\)/);
  copy(Buffer.concat([fx('tone.opus'), Buffer.alloc(51200 - fx('tone.opus').length)]), 'rup-v1.opus');
  r = validate(d); assert.equal(r.status, 0, 'exact 51200 B e încă în limită (antetul Ogg + OpusHead e la început): ' + r.out);
});

T('scripts/import_bundle.py: scrie fișierele de date și sunetul, sare peste duplicate, numerotează omografele, raportează intrările greșite și nu suprascrie nimic', () => {
  const d = tree();
  const WEBM = 'data:audio/webm;base64,' + fx('tone.webm').toString('base64');
  const un = JSON.parse(fs.readFileSync(path.join(d, 'data/dictionaries/rup-un.json'), 'utf8'));
  const list = [
    entry({ headword: 'apã', gloss: { en: 'water', ro: 'apă' }, audio: WEBM, concept: 'water', orthography: 'armaneashti', status: 'draft' }),
    entry({ lang: 'rom', headword: 'čhib', gloss: { en: 'tongue' }, status: 'sourced', source_url: 'https://x.org/c' }),
    Object.assign({}, un),
    Object.assign({}, un, { gloss: { en: 'a, an' } })
  ];
  const bundle = path.join(d, 'b.json');
  fs.writeFileSync(bundle, E.makeBundle(list, '2026-11-17T08:00:00Z'));
  let r = py([path.join(d, 'scripts/import_bundle.py'), bundle, '--dry-run'], { cwd: d });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /would write rup-apa/); assert.match(r.out, /would write rom-chib/); assert.match(r.out, /skip rup-un: already present/); assert.match(r.out, /would write rup-un-2/);
  assert.ok(!fs.existsSync(path.join(d, 'data/dictionaries/rup-apa.json')), '--dry-run nu scrie');
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /3 written, 1 skipped, 0 with problems/);
  const apa = JSON.parse(fs.readFileSync(path.join(d, 'data/dictionaries/rup-apa.json'), 'utf8'));
  assert.equal(apa.audio, 'audio/rup-apa.webm');
  assert.deepEqual(Object.keys(apa), ['lang', 'headword', 'pos', 'gloss', 'concept', 'orthography', 'status', 'audio', 'source']);
  assert.deepEqual(fs.readFileSync(path.join(d, 'audio/rup-apa.webm')), fx('tone.webm'));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(d, 'data/dictionaries/rup-un-2.json'), 'utf8')).gloss, { en: 'a, an' });
  assert.equal(JSON.parse(fs.readFileSync(path.join(d, 'data/dictionaries/rom-chib.json'), 'utf8')).headword, 'čhib');
  assert.equal(validate(d, '--strict').status, 1, 'omograful (rup-un și rup-un-2) dă avertisment, deci --strict eșuează');
  assert.equal(validate(d).status, 0);
  // a doua rulare: totul există deja, nu se scrie nimic nou
  const before = fs.readdirSync(path.join(d, 'data/dictionaries')).sort();
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d });
  assert.equal(r.status, 0, r.out); assert.match(r.out, /0 written, 4 skipped, 0 with problems/);
  assert.deepEqual(fs.readdirSync(path.join(d, 'data/dictionaries')).sort(), before);
  // intrări greșite: raportate, restul se scrie
  const evil = JSON.stringify({ format: 'glosar-bundle', version: 1, entries: [
    entry({ headword: 'bun' }), { lang: 'xx' }, 5,
    Object.assign(entry({ headword: 'rău' }), { audio_data: 'data:audio/ogg;base64,' + fx('tone-vorbis.ogg').toString('base64') }),
    Object.assign(entry({ headword: 'mare' }), { audio_data: 'data:audio/ogg;base64,' + Buffer.concat([fx('tone.opus'), Buffer.alloc(60000)]).toString('base64') }),
    Object.assign(entry({ headword: 'mic' }), { audio_data: 'audio/rup-mic.opus' }),
    Object.assign(entry({ headword: 'extra' }), { id: 'rup-extra' }),
    Object.assign(entry({ headword: '../x' }), { gloss: { en: 'path' } })
  ] });
  fs.writeFileSync(bundle, evil);
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /entry 2 \(\?\): lang and headword are required/);
  assert.match(r.out, /entry 3: not an object/);
  assert.match(r.out, /entry 4 \(rău\): the recording is not Opus in an Ogg or WebM container/);
  assert.match(r.out, /entry 5 \(mare\): the recording is \d+ bytes \(the limit is 51200\)/);
  assert.match(r.out, /entry 6 \(mic\): audio_data must be a base64 data URI/);
  assert.match(r.out, /entry 7 \(extra\): unknown field\(s\): id/);
  assert.match(r.out, /2 written, 0 skipped, 6 with problems/);
  assert.ok(fs.existsSync(path.join(d, 'data/dictionaries/rup-bun.json')));
  assert.ok(fs.existsSync(path.join(d, 'data/dictionaries/rup-x.json')), 'cuvântul «../x» devine slug sigur: rup-x');
  for (const f of fs.readdirSync(path.join(d, 'data/dictionaries'))) assert.ok(!f.includes('/') && !f.startsWith('..'), f);
  assert.equal(fs.readdirSync(path.join(d, 'audio')).length, 1, 'doar sunetul valid a fost scris');
  assert.equal(validate(d).status, 0);
  // fișiere care nu sunt contribuții
  fs.writeFileSync(bundle, '{"format":"altceva"}');
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d }); assert.equal(r.status, 2); assert.match(r.out, /not a GLOSAR contribution file/);
  fs.writeFileSync(bundle, 'nu e json');
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d }); assert.equal(r.status, 2);
  r = py([path.join(d, 'scripts/import_bundle.py'), path.join(d, 'lipsa.json')], { cwd: d }); assert.equal(r.status, 2);
  r = py([path.join(d, 'scripts/import_bundle.py')], { cwd: d }); assert.equal(r.status, 2);
  fs.writeFileSync(bundle, JSON.stringify({ format: 'glosar-bundle', version: 1, entries: Array.from({ length: 501 }, () => ({})) }));
  r = py([path.join(d, 'scripts/import_bundle.py'), bundle], { cwd: d }); assert.equal(r.status, 2); assert.match(r.out, /too many entries/);
});

/* ---------------- ambalajul (hub tools/alpha/build.mjs) ---------------- */
function copyRepo() {
  const d = mktmp();
  fs.cpSync(ROOT, d, { recursive: true, filter: (s) => !s.split(path.sep).includes('.git') && !s.split(path.sep).includes('node_modules') });
  return d;
}
const build = (d, ...a) => { const r = spawnSync(process.execPath, ['scripts/build.mjs', '--no-kit', ...a], { cwd: d, encoding: 'utf8' }); return { status: r.status, out: (r.stdout || '') + (r.stderr || '') }; };

test('ambalaj: sunetul din audio/ devine URI de date în pagină, iar LANGUAGES și CONCEPTS ajung variabile globale ale ei', () => {
  const d = copyRepo();
  const f = path.join(d, 'data/dictionaries/rup-un.json');
  const o = JSON.parse(fs.readFileSync(f, 'utf8'));
  o.audio = 'audio/rup-un.opus';
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
  fs.writeFileSync(path.join(d, 'audio/rup-un.opus'), fx('tone.opus'));
  let r = build(d); assert.equal(r.status, 0, r.out);
  const html = fs.readFileSync(path.join(d, 'index.html'), 'utf8');
  assert.ok(html.includes('"audio":"data:audio/ogg;base64,' + fx('tone.opus').toString('base64') + '"'), 'URI-ul de date e în DATA');
  assert.ok(!html.includes('audio/rup-un.opus'), 'calea relativă nu rămâne în pagină');
  assert.match(html, /var LANGUAGES=\{"version":1,"languages":\[\{"code":"rup"/);
  assert.match(html, /var CONCEPTS=\{"version":1,"concepts":\[\{"id":"number-1"/);
  r = build(d, '--check'); assert.equal(r.status, 0, r.out);
  fs.appendFileSync(path.join(d, 'src/app.css'), '\n.x{color:red}\n');
  r = build(d, '--check'); assert.equal(r.status, 1, r.out);
});

test('ambalaj: erori clare pentru sunet lipsă, prea mare sau cu extensie nepermisă și pentru nume de variabile globale cu minuscule', () => {
  const d = copyRepo();
  const f = path.join(d, 'data/dictionaries/rup-un.json');
  const o = JSON.parse(fs.readFileSync(f, 'utf8'));
  const set = (audio) => fs.writeFileSync(f, JSON.stringify(Object.assign({}, o, { audio })));
  set('audio/rup-un.opus');
  let r = build(d); assert.equal(r.status, 1); assert.match(r.out, /audio\/rup-un\.opus» nu există în audio\//);
  fs.writeFileSync(path.join(d, 'audio/rup-un.opus'), Buffer.alloc(51201));
  r = build(d); assert.equal(r.status, 1); assert.match(r.out, /51201 de octeți \(limita este 51200\)/);
  set('audio/rup-un.mp3'); fs.writeFileSync(path.join(d, 'audio/rup-un.mp3'), Buffer.alloc(10));
  r = build(d); assert.equal(r.status, 1); assert.match(r.out, /sunt acceptate doar \.opus, \.ogg și \.webm/);
  fs.writeFileSync(f, JSON.stringify(o));
  const cfgp = path.join(d, 'src/app.json'), cfg = JSON.parse(fs.readFileSync(cfgp, 'utf8'));
  cfg.files = { languages: 'data/languages.json' };
  fs.writeFileSync(cfgp, JSON.stringify(cfg));
  r = build(d); assert.equal(r.status, 1); assert.match(r.out, /numele «languages» din «files» trebuie să fie MAJUSCULE/);
});

test('index.html din depozit corespunde cu src/ (build --check) și versiunea din app.json, package.json și pagină este aceeași', () => {
  const r = spawnSync(process.execPath, ['scripts/build.mjs', '--check', '--no-kit'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, (r.stdout || '') + (r.stderr || ''));
  const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/app.json'), 'utf8'));
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(app.version, pkg.version);
  assert.equal(app.slug, 'glosar');
  assert.ok(pkg.engines.node === '>=24');
  assert.ok(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('"slug":"glosar","name":"GLOSAR","kind":"data","ver":"' + app.version + '"'));
});
