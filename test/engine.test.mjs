import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fx = (n) => fs.readFileSync(path.join(HERE, 'fixtures', n));
const uri = (buf, mime) => 'data:' + mime + ';base64,' + buf.toString('base64');
const OPUS_OGG = uri(fx('tone.opus'), 'audio/ogg');
const OPUS_WEBM = uri(fx('tone.webm'), 'audio/webm');
const VORBIS_OGG = uri(fx('tone-vorbis.ogg'), 'audio/ogg');
const VORBIS_WEBM = uri(fx('tone-vorbis.webm'), 'audio/webm');

const CTX = {
  languages: {
    rup: { dialects: [], orthographies: [{ id: 'armaneashti' }, { id: 'ro-based' }] },
    rom: { dialects: [{ id: 'balkan' }], orthographies: [{ id: 'latin-standard' }] }
  },
  concepts: { water: true, 'number-5': true }
};
const OK = () => ({ lang: 'rup', headword: 'apã', pos: 'noun', gloss: { en: 'water' }, source: 'test' });
const codes = (o, ctx) => E.validateEntry(o, ctx === undefined ? CTX : ctx);
const mk = (lang, headword, gloss, extra) => Object.assign({ lang, headword, pos: 'noun', gloss, source: 's' }, extra || {});

test('fold: minuscule, fără semne diacritice, câteva litere scrise simplu, spații normalizate', () => {
  const cases = {
    'ținți': 'tinti', 'ŢINŢI': 'tinti', 'Șase': 'sase', 'noauă': 'noaua', 'apã': 'apa', 'čhib': 'chib', 'štar': 'star', 'pandž': 'pandz',
    'panʒ': 'panzh', 'đ': 'd', 'Æ': 'ae', 'ß': 'ss', 'ł': 'l', '  A   b  ': 'a b', 'İ': 'i', 'ǎ': 'a', 'x': 'x', '': ''
  };
  for (const [a, b] of Object.entries(cases)) assert.equal(E.fold(a), b, JSON.stringify(a));
  for (const s of Object.keys(cases)) assert.equal(E.fold(E.fold(s)), E.fold(s), 'idempotent: ' + s);
});

test('entryId și uniqueId: slug latin, litere nelatine devin cod Unicode, sufix -2, -3 pentru același cuvânt', () => {
  assert.equal(E.entryId('rup', 'tsintsi'), 'rup-tsintsi');
  assert.equal(E.entryId('ruq', 'ținți'), 'ruq-tinti');
  assert.equal(E.entryId('rom', 'štar'), 'rom-star');
  assert.equal(E.entryId('rom', 'čhib'), 'rom-chib');
  assert.equal(E.entryId('rom', 'pandž'), 'rom-pandz');
  assert.equal(E.entryId('rom', 'a b/c'), 'rom-a-b-c');
  assert.equal(E.entryId('rom', 'दो'), 'rom-u926-94b');
  assert.equal(E.uniqueId('rup', 'un', {}), 'rup-un');
  assert.equal(E.uniqueId('rup', 'un', { 'rup-un': 1 }), 'rup-un-2');
  assert.equal(E.uniqueId('rup', 'un', { 'rup-un': 1, 'rup-un-2': 1 }), 'rup-un-3');
});

test('validateEntry: o înregistrare corectă trece, iar fiecare câmp are propriul cod de eroare', () => {
  assert.deepEqual(codes(OK()), []);
  assert.deepEqual(codes(OK(), null), []);
  assert.deepEqual(codes(null), ['object']);
  assert.deepEqual(codes([]), ['object']);
  assert.deepEqual(codes('x'), ['object']);
  const bad = (patch, code, ctx) => {
    const o = Object.assign(OK(), patch);
    for (const k of Object.keys(patch)) if (patch[k] === undefined) delete o[k];
    assert.deepEqual(codes(o, ctx), [code], JSON.stringify(patch).slice(0, 80));
  };
  bad({ extra: 1 }, 'extra');
  bad({ lang: 'xx' }, 'lang'); bad({ lang: 'RUP' }, 'lang'); bad({ lang: undefined }, 'lang'); bad({ lang: 5 }, 'lang');
  bad({ headword: '' }, 'headword'); bad({ headword: ' x' }, 'headword'); bad({ headword: 'x ' }, 'headword'); bad({ headword: 'a\u0007' }, 'headword');
  bad({ headword: 'x'.repeat(81) }, 'headword'); bad({ headword: undefined }, 'headword'); bad({ headword: 7 }, 'headword');
  bad({ variants: 'x' }, 'variants'); bad({ variants: [''] }, 'variants'); bad({ variants: ['a', 'a'] }, 'variants');
  bad({ variants: Array.from({ length: 21 }, (_, i) => 'v' + i) }, 'variants'); bad({ variants: ['x'.repeat(81)] }, 'variants');
  bad({ pos: 'x' }, 'pos'); bad({ pos: undefined }, 'pos');
  bad({ gloss: {} }, 'gloss'); bad({ gloss: { en: '' } }, 'gloss'); bad({ gloss: { EN: 'x' } }, 'gloss'); bad({ gloss: { en: 'x'.repeat(201) } }, 'gloss');
  bad({ gloss: [] }, 'gloss'); bad({ gloss: undefined }, 'gloss');
  bad({ concept: 'Water' }, 'concept'); bad({ concept: 'nope' }, 'concept');
  bad({ dialect: 'balkan' }, 'dialect'); bad({ orthography: 'latin-standard' }, 'orthography'); bad({ orthography: 'X' }, 'orthography');
  bad({ status: 'x' }, 'status'); bad({ status: 'reviewed' }, 'reviewed_by'); bad({ status: 'sourced' }, 'source_url');
  bad({ reviewed_by: '' }, 'reviewed_by'); bad({ notes: '' }, 'notes'); bad({ notes: 'x'.repeat(501) }, 'notes');
  bad({ examples: 'x' }, 'examples'); bad({ examples: [''] }, 'examples'); bad({ examples: Array.from({ length: 11 }, () => 'x') }, 'examples');
  bad({ source: '' }, 'source'); bad({ source: undefined }, 'source'); bad({ source: 'x'.repeat(301) }, 'source');
  bad({ source_url: 'http://x.org' }, 'source_url'); bad({ source_url: 'https://x y' }, 'source_url'); bad({ license: '' }, 'license');
  // cu context gol (fără listă de limbi/concepte) se verifică doar forma
  assert.deepEqual(codes(Object.assign(OK(), { lang: 'zzz', concept: 'orice', dialect: 'x', orthography: 'y' }), null), []);
  // combinații valide
  assert.deepEqual(codes(Object.assign(OK(), { status: 'sourced', source_url: 'https://x.org/a', license: 'CC BY-SA 4.0', concept: 'water', orthography: 'ro-based', variants: ['apă'], examples: ['a'], notes: 'n' })), []);
  assert.deepEqual(codes(Object.assign(OK(), { status: 'reviewed', reviewed_by: 'Maria' })), []);
  assert.deepEqual(codes(Object.assign(OK(), { lang: 'rom', dialect: 'balkan', orthography: 'latin-standard' })), []);
});

test('validateEntry: sunetul — cale, URI Opus în Ogg sau WebM acceptate; Vorbis, text oarecare și peste 50 KB respinse', () => {
  const a = (audio) => codes(Object.assign(OK(), { audio }));
  assert.deepEqual(a('audio/rup-apa.opus'), []); assert.deepEqual(a('audio/rup-apa.ogg'), []); assert.deepEqual(a('audio/rup-apa.webm'), []);
  assert.deepEqual(a(OPUS_OGG), []); assert.deepEqual(a(OPUS_WEBM), []);
  assert.deepEqual(a(OPUS_OGG.replace('audio/ogg', 'audio/ogg;codecs=opus')), []);
  assert.deepEqual(a(VORBIS_OGG), ['audio']); assert.deepEqual(a(VORBIS_WEBM), ['audio']);
  assert.deepEqual(a('audio/Rup.opus'), ['audio']); assert.deepEqual(a('audio/x.mp3'), ['audio']); assert.deepEqual(a('../audio/x.opus'), ['audio']);
  assert.deepEqual(a('data:audio/mpeg;base64,AAAA'), ['audio']); assert.deepEqual(a('data:audio/ogg;base64,AAAA'), ['audio']); assert.deepEqual(a(5), ['audio']);
  const big = Buffer.concat([fx('tone.opus'), Buffer.alloc(60000)]);
  assert.ok(big.length > E.LIMITS.audio);
  assert.deepEqual(a(uri(big, 'audio/ogg')), ['audio_big']);
  assert.equal(E.LIMITS.audio, 51200);
});

test('audioKind, audioBytes, audioExt, dataUriBytes: antete reale generate cu ffmpeg', () => {
  assert.equal(E.audioKind(new Uint8Array(fx('tone.opus'))), 'ogg');
  assert.equal(E.audioKind(new Uint8Array(fx('tone.webm'))), 'webm');
  assert.equal(E.audioKind(new Uint8Array(fx('tone-vorbis.ogg'))), '');
  assert.equal(E.audioKind(new Uint8Array(fx('tone-vorbis.webm'))), '');
  assert.equal(E.audioKind(new Uint8Array(0)), '');
  assert.equal(E.audioKind(new Uint8Array(40)), '');
  assert.equal(E.audioKind(null), '');
  assert.equal(E.audioKind(new Uint8Array(Buffer.from('OggS' + 'x'.repeat(40)))), '');
  assert.equal(E.audioBytes(OPUS_OGG), fx('tone.opus').length);
  assert.equal(E.audioBytes(OPUS_WEBM), fx('tone.webm').length);
  assert.equal(E.audioBytes('data:audio/ogg;base64,QQ=='), 1);
  assert.equal(E.audioBytes('data:audio/ogg;base64,QUI='), 2);
  assert.equal(E.audioBytes('nope'), -1);
  assert.equal(E.audioExt(OPUS_OGG), 'opus'); assert.equal(E.audioExt(OPUS_WEBM), 'webm'); assert.equal(E.audioExt('x'), '');
  assert.deepEqual(Buffer.from(E.dataUriBytes(OPUS_WEBM)), fx('tone.webm'));
  assert.equal(E.dataUriBytes('data:audio/ogg;base64,@@@'), null);
  assert.equal(E.dataUriBytes('x'), null);
});

test('canonicalEntry: ordinea câmpurilor din fișierele de date, fără câmpuri goale; entryToJson înlocuiește sunetul cu calea fișierului', () => {
  const c = E.canonicalEntry({ source: 's', notes: '', variants: [], gloss: { en: 'x' }, pos: 'noun', headword: 'h', lang: 'rup', status: undefined, concept: null, id: 'zzz', audio: OPUS_WEBM });
  assert.deepEqual(Object.keys(c), ['lang', 'headword', 'pos', 'gloss', 'audio', 'source']);
  const j = JSON.parse(E.entryToJson(c, 'rup-h'));
  assert.equal(j.audio, 'audio/rup-h.webm');
  assert.ok(E.entryToJson(c, 'rup-h').endsWith('\n'));
  assert.equal(JSON.parse(E.entryToJson({ lang: 'rup', headword: 'Țuță', pos: 'noun', gloss: { en: 'x' }, source: 's' })).headword, 'Țuță');
  assert.equal(JSON.parse(E.entryToJson(Object.assign(c, { audio: OPUS_OGG }), 'rup-h')).audio, 'audio/rup-h.opus');
});

/* ---------------- căutare ---------------- */
const SET = [
  Object.assign(mk('rup', 'tsintsi', { en: 'five', ro: 'cinci' }, { variants: ['ținți'], status: 'sourced', concept: 'number-5' }), { id: 'rup-tsintsi' }),
  Object.assign(mk('ruq', 'ținți', { en: 'five', ro: 'cinci' }, { variants: ['tsints'], status: 'reviewed', reviewed_by: 'X', audio: OPUS_OGG }), { id: 'ruq-tinti' }),
  Object.assign(mk('rom', 'pandž', { en: 'five', ro: 'cinci' }, { variants: ['panzh', 'panʒ'], status: 'draft' }), { id: 'rom-pandz' }),
  Object.assign(mk('rom', 'pani', { en: 'water', ro: 'apă' }, { status: 'sourced', concept: 'water' }), { id: 'rom-pani' }),
  Object.assign(mk('rup', 'apã mare', { en: 'big water; sea', ro: 'apă mare' }, { status: 'draft' }), { id: 'rup-apa-mare' }),
  Object.assign(mk('rup', 'sapã', { en: 'hoe', ro: 'sapă' }), { id: 'rup-sapa' })
];
const IDX = E.buildIndex(SET);
const ids = (r) => r.map((x) => x.e.id);

test('search: cuvânt exact (și variantă exactă) înaintea prefixului, cuvântului din expresie, părții din cuvânt și sensului', () => {
  const r = E.search(IDX, 'tinti');
  assert.deepEqual(ids(r), ['ruq-tinti', 'rup-tsintsi'], 'headword ținți și varianta ținți, ambele exacte; ordine: stare (verificat înaintea celui cu sursă)');
  assert.deepEqual(r.map((x) => x.why), ['exact', 'exact']);
  assert.deepEqual(ids(E.search(IDX, 'ts')), ['ruq-tinti', 'rup-tsintsi'], 'prefix pe cuvânt (tsintsi) sau pe variantă (tsints); la scor egal, cel verificat vine primul');
  const apa = E.search(IDX, 'apa');
  assert.equal(apa[0].e.id, 'rup-apa-mare', 'începutul expresiei (apã mare) = prefix');
  assert.equal(apa[0].why, 'prefix');
  assert.ok(ids(apa).indexOf('rup-sapa') > ids(apa).indexOf('rup-apa-mare'), 'parte din cuvânt (sapã) vine după');
  assert.equal(apa.find((x) => x.e.id === 'rup-sapa').why, 'part');
  const mare = E.search(IDX, 'mare');
  assert.equal(mare[0].e.id, 'rup-apa-mare');
  assert.equal(mare[0].why, 'word', 'al doilea cuvânt din expresie');
  assert.equal(E.search(IDX, 'sint')[0].why, 'part');
  assert.equal(E.search(IDX, 'pan')[0].why, 'prefix');
  assert.deepEqual(E.search(IDX, 'zzz'), []);
});

test('search: căutarea după sens (orice limbă de sens), cu «;» ca separator de sensuri și sens parțial', () => {
  const five = E.search(IDX, 'five');
  assert.deepEqual(ids(five), ['ruq-tinti', 'rup-tsintsi', 'rom-pandz'], 'toate cu sensul exact «five»; ordine: stare apoi cuvânt');
  assert.ok(five.every((x) => x.why === 'meaning'));
  assert.equal(E.search(IDX, 'sea')[0].e.id, 'rup-apa-mare', 'al doilea sens dintr-un câmp cu «;»');
  assert.equal(E.search(IDX, 'sea')[0].why, 'meaning');
  assert.equal(E.search(IDX, 'cin')[0].why, 'meaning-start');
  assert.equal(E.search(IDX, 'nci')[0].why, 'meaning-part');
  assert.deepEqual(ids(E.search(IDX, 'APĂ')), ['rup-apa-mare', 'rom-pani', 'rup-sapa'], 'majuscule și diacritice nu contează; prefix (80) > sens exact (60) > parte de cuvânt (50)');
});

test('search: filtre de limbă, de încredere și de sunet; interogarea goală arată tot, grupat pe limbă', () => {
  assert.deepEqual(ids(E.search(IDX, '', { lang: 'rom' })), ['rom-pani', 'rom-pandz'], 'doar romani; cel cu sursă înaintea ciornei');
  assert.equal(E.search(IDX, '', { lang: 'all' }).length, SET.length);
  assert.deepEqual(ids(E.search(IDX, '', { minStatus: 'reviewed' })), ['ruq-tinti']);
  assert.deepEqual(new Set(ids(E.search(IDX, '', { minStatus: 'sourced' }))), new Set(['ruq-tinti', 'rup-tsintsi', 'rom-pani']));
  assert.equal(E.search(IDX, '', { minStatus: 'any' }).length, SET.length, 'fără stare = ciornă');
  assert.deepEqual(ids(E.search(IDX, '', { audio: true })), ['ruq-tinti']);
  assert.deepEqual(ids(E.search(IDX, 'five', { audio: true, lang: 'ruq' })), ['ruq-tinti']);
  const all = E.search(IDX, '');
  const langs = all.map((x) => x.e.lang);
  assert.deepEqual(langs, langs.slice().sort(), 'grupate pe limbă');
  assert.ok(all.every((x) => x.why === 'all'));
});

/* ---------------- duplicate ---------------- */
test('dupKey, findDuplicates și duplicates: aceeași limbă, dialect, ortografie, parte de vorbire și cuvânt (fără diacritice)', () => {
  const a = mk('rup', 'apã', { en: 'water' }), b = mk('rup', 'apa', { en: 'water' }), c = mk('rup', 'apã', { en: 'year' }), d = mk('rup', 'apã', { en: 'water' }, { pos: 'verb' }), e = mk('ruq', 'apã', { en: 'water' }), f = mk('rup', 'apã', { en: 'water' }, { orthography: 'ro-based' });
  assert.equal(E.dupKey(a), E.dupKey(b));
  for (const x of [d, e, f]) assert.notEqual(E.dupKey(a), E.dupKey(x));
  const fd = E.findDuplicates([a, b, c, d, e, f], a);
  assert.deepEqual(fd.map((x) => [x.e === b, x.e === c, x.same]), [[true, false, true], [false, true, false]]);
  const g = E.duplicates([a, b, c, d, e, f]);
  assert.equal(g.length, 1);
  assert.equal(g[0].entries.length, 3);
  assert.equal(g[0].same, false);
  assert.equal(E.duplicates([a, b])[0].same, true);
  assert.deepEqual(E.duplicates([a, d, e, f]), []);
});

/* ---------------- acoperire ---------------- */
test('coverage: alege cea mai sigură intrare pentru fiecare concept și limbă și numără conceptele acoperite', () => {
  const concepts = [{ id: 'water', group: 'nature', en: 'water', ro: 'apă' }, { id: 'number-5', group: 'numbers', en: 'five', ro: 'cinci' }, { id: 'sun', group: 'nature', en: 'sun', ro: 'soare' }];
  const a = mk('rup', 'a1', { en: 'x' }, { concept: 'water', status: 'draft' }), b = mk('rup', 'a2', { en: 'x' }, { concept: 'water', status: 'reviewed', reviewed_by: 'm' }), c = mk('rom', 'p', { en: 'x' }, { concept: 'water' }), d = mk('rom', 'q', { en: 'x' });
  const r = E.coverage(concepts, [a, b, c, d], ['rup', 'rom', 'ruq']);
  assert.equal(r.total, 3);
  assert.deepEqual(Object.assign({}, r.have), { rup: 1, rom: 1, ruq: 0 });
  assert.equal(r.rows[0].cells.rup, b, 'reviewed bate draft');
  assert.equal(r.rows[0].cells.rom, c);
  assert.equal(r.rows[0].cells.ruq, null);
  assert.deepEqual(r.rows.map((x) => x.concept.id), ['water', 'number-5', 'sun']);
  assert.ok(r.rows[1].cells.rup === null && r.rows[2].cells.rom === null);
});

/* ---------------- exporturi ---------------- */
test('toTSV: antet cu coloane de sens pentru limbile folosite, tab și rând nou din text devin spații', () => {
  const e1 = Object.assign(mk('rup', 'a\tb', { en: 'x\ny', ro: 'z' }, { variants: ['v1', 'v2'], status: 'sourced', dialect: undefined, orthography: 'ro-based' }), { id: 'rup-a-b' });
  const e2 = mk('rom', 'c', { fr: 'cinq' });
  const t = E.toTSV([e1, e2]);
  const lines = t.split('\n');
  assert.equal(lines.pop(), '');
  assert.deepEqual(lines[0].split('\t'), ['id', 'lang', 'headword', 'variants', 'pos', 'dialect', 'orthography', 'status', 'gloss_en', 'gloss_ro', 'gloss_fr', 'source']);
  assert.equal(lines.length, 3);
  assert.ok(lines.every((l) => l.split('\t').length === 12));
  assert.deepEqual(lines[1].split('\t'), ['rup-a-b', 'rup', 'a b', 'v1 | v2', 'noun', '', 'ro-based', 'sourced', 'x y', 'z', '', 's']);
  assert.deepEqual(lines[2].split('\t'), ['rom-c', 'rom', 'c', '', 'noun', '', '', 'draft', '', '', 'cinq', 's']);
  assert.deepEqual(E.toTSV([]).split('\n')[0].split('\t'), ['id', 'lang', 'headword', 'variants', 'pos', 'dialect', 'orthography', 'status', 'gloss_en', 'gloss_ro', 'source']);
});

test('toTSV: celulele care încep cu = + - @ primesc un apostrof în față, ca foaia de calcul să nu le ruleze ca formule', () => {
  const evil = [
    mk('rup', '=HYPERLINK("https://exemplu.invalid","x")', { en: '+1+1', ro: '-2+3' }, { source: '@SUM(A1)', variants: ['=1', 'ok'] }),
    mk('rom', ' \t=cmd|\' /C calc\'!A0', { en: '-' }),
    mk('rup', 'normal', { en: 'a=b', ro: 'x-y' }, { source: 'o sursă' })
  ];
  const lines = E.toTSV(evil).split('\n');
  assert.equal(lines.pop(), '');
  const rows = lines.map((l) => l.split('\t'));
  assert.ok(rows.every((r) => r.length === 11), 'numărul de coloane nu se schimbă');
  assert.deepEqual(rows[1].slice(2, 4), ['\'=HYPERLINK("https://exemplu.invalid","x")', '\'=1 | ok'], 'cuvântul și lista de variante (unită cu « | ») încep cu «=»');
  assert.deepEqual(rows[1].slice(8, 11), ['\'+1+1', '\'-2+3', '\'@SUM(A1)']);
  assert.equal(rows[2][2][0], '\'');
  assert.equal(rows[2][8], '\'-');
  assert.deepEqual(rows[3].slice(2, 3).concat(rows[3].slice(8, 11)), ['normal', 'a=b', 'x-y', 'o sursă'], '«=» sau «-» în interiorul textului rămân neschimbate');
  assert.ok(rows.slice(1).every((r) => !/^[=+\-@]/.test(r[2]) && !/^[=+\-@]/.test(r[8])), 'nicio celulă de date nu începe cu un caracter de formulă');
});

test('toAnki: directive Anki, două tab-uri pe rând, HTML scăpat, etichete cu limba, starea și conceptul', () => {
  const e1 = mk('rup', 'a<b>&', { en: 'one & <two>', ro: 'unu' }, { variants: ['v'], status: 'sourced', concept: 'number-1', pos: 'numeral' });
  const e2 = mk('rom', 'c', { fr: 'cinq' });
  const t = E.toAnki([e1, e2], { pos: { numeral: 'numeral (ro)', noun: 'substantiv' }, lang: { en: 'Engleză', ro: 'Română', fr: 'Franceză' } }, ['ro', 'en']);
  const lines = t.split('\n');
  assert.equal(lines.pop(), '');
  assert.deepEqual(lines.slice(0, 3), ['#separator:tab', '#html:true', '#tags column:3']);
  assert.equal(lines.length, 5);
  for (const l of lines.slice(3)) assert.equal(l.split('\t').length, 3, l);
  const [front, back, tags] = lines[3].split('\t');
  assert.equal(front, '<b>a&lt;b&gt;&amp;</b><br><small>v</small>');
  assert.equal(back, 'Română: unu<br>Engleză: one &amp; &lt;two&gt;<br><small>numeral (ro)</small>');
  assert.equal(tags, 'glosar rup status-sourced concept-number-1');
  assert.equal(lines[4].split('\t')[2], 'glosar rom status-draft');
  assert.ok(lines[4].split('\t')[1].startsWith('Franceză: cinq<br>'));
  assert.ok(!t.includes('\ufeff'));
});

/* ---------------- fișierul de contribuție ---------------- */
test('makeBundle și parseBundle: dus-întors fără pierderi, sunetul ca audio_data, erori cu numărul intrării', () => {
  const list = [
    Object.assign(mk('rup', 'apã', { en: 'water', ro: 'apă' }, { variants: ['apă'], concept: 'water', orthography: 'armaneashti', audio: OPUS_WEBM, examples: ['e'], notes: 'n' }), { id: 'rup-apa' }),
    mk('rom', 'pani', { en: 'water' }, { status: 'sourced', source_url: 'https://x.org/p', license: 'CC BY-SA 4.0' })
  ];
  const text = E.makeBundle(list, '2026-11-17T08:00:00Z');
  const b = JSON.parse(text);
  assert.deepEqual(Object.keys(b), ['format', 'version', 'created', 'entries']);
  assert.equal(b.format, 'glosar-bundle'); assert.equal(b.version, 1); assert.equal(b.created, '2026-11-17T08:00:00Z');
  assert.equal(b.entries[0].audio_data, OPUS_WEBM);
  assert.ok(!('audio' in b.entries[0]) && !('id' in b.entries[0]));
  assert.ok(text.endsWith('\n'));
  const r = E.parseBundle(text, CTX);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.entries, list.map((e) => E.canonicalEntry(e)));
  assert.match(E.makeBundle([]), /"created": "\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ"/);
  // erori
  assert.deepEqual(E.parseBundle('nu e json', CTX), { entries: [], errors: [{ index: 0, codes: ['json'] }] });
  assert.deepEqual(E.parseBundle('{"format":"x","version":1,"entries":[]}', CTX).errors, [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(E.parseBundle('{"format":"glosar-bundle","version":2,"entries":[]}', CTX).errors, [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(E.parseBundle('[]', CTX).errors, [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(E.parseBundle(JSON.stringify({ format: 'glosar-bundle', version: 1, entries: Array.from({ length: 501 }, () => ({})) }), CTX).errors, [{ index: 0, codes: ['many'] }]);
  const mixed = JSON.stringify({ format: 'glosar-bundle', version: 1, entries: [{ lang: 'xx' }, 5, JSON.parse(JSON.stringify(list[1])), Object.assign(OK(), { audio_data: VORBIS_OGG })] });
  const m = E.parseBundle(mixed, CTX);
  assert.equal(m.entries.length, 1);
  assert.deepEqual(m.errors.map((x) => x.index), [1, 2, 4]);
  assert.deepEqual(m.errors[1].codes, ['object']);
  assert.ok(m.errors[0].codes.includes('lang') && m.errors[0].codes.includes('headword'));
  assert.deepEqual(m.errors[2].codes, ['audio']);
});

/* ---------------- liste lipite ---------------- */
test('parsePaste: tab, «;» sau «=» ca separator, comentarii și rânduri goale ignorate, erori cu numărul rândului', () => {
  const p = E.parsePaste('un\tone\n\n# comentariu\ndoi; two; 2\r\ntrei = three\nfără separator\n\tfără cuvânt\ncuvânt\t\n' + 'x'.repeat(81) + '\tprea lung\n');
  assert.deepEqual(p.items, [{ headword: 'un', gloss: 'one', line: 1 }, { headword: 'doi', gloss: 'two; 2', line: 4 }, { headword: 'trei', gloss: 'three', line: 5 }]);
  assert.deepEqual(p.errors, [{ line: 6, code: 'sep' }, { line: 7, code: 'headword' }, { line: 8, code: 'gloss' }, { line: 9, code: 'headword' }]);
  const many = E.parsePaste(Array.from({ length: 205 }, (_, i) => 'w' + i + '\tg' + i).join('\n'));
  assert.equal(many.items.length, 200);
  assert.deepEqual(many.errors, [{ line: 201, code: 'many' }]);
  assert.deepEqual(E.parsePaste(''), { items: [], errors: [] });
  assert.equal(E.parsePaste('a\u0007\tb').errors[0].code, 'headword');
  assert.equal(E.parsePaste('a\tb\u0007').errors[0].code, 'gloss');
});
