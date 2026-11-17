import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import I18N from '../src/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = fs.readFileSync(path.join(ROOT, 'src', 'ui.js'), 'utf8');
const eng = fs.readFileSync(path.join(ROOT, 'src', 'engine.mjs'), 'utf8');
const concepts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'concepts.json'), 'utf8')).concepts;
const LANGS = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
const keys = Object.keys(I18N.en);
const ph = (s) => [...String(s).matchAll(/\{(\d)\}/g)].map((m) => +m[1]);

// Cheile folosite de ambalajul generat (meniu, titlu, buton de deschidere) și nu de ui.js.
const BUILDER = ['nav', 'title', 'open'];
// Șiruri snake_case din ui.js care sunt nume de câmpuri sau coduri de eroare, nu chei de traducere.
const NOT_KEYS = ['reviewed_by', 'source_url', 'audio_big'];

function list(re, src) { const m = src.match(re); assert.ok(m, 'nu găsesc ' + re); return [...m[1].matchAll(/'([a-z_]+)'/g)].map((x) => x[1]); }
const TABS = list(/var TABS = \[([^\]]*)\]/, ui);
const UI_LANGS = list(/var UI_LANGS = \[([^\]]*)\]/, ui);
const ISSUE_CODES = list(/function issueKey\(c\) \{\s*return \[([^\]]*)\]/, ui);
const GROUPS = [...new Set(concepts.map((c) => c.group))];
const validate = eng.slice(eng.indexOf('export function validateEntry'), eng.indexOf('export function canonicalEntry'));
const EMITTED = [...new Set([...validate.matchAll(/bad\('([a-z_]+)'\)/g)].map((m) => m[1]).concat(['object']))].sort();
const PASTE = [...new Set([...eng.slice(eng.indexOf('export function parsePaste')).matchAll(/code: '([a-z]+)'/g)].map((m) => m[1]))].sort();

/** Argumentele de la nivelul superior ale apelului care începe imediat după paranteza deschisă de la poziția i. */
function callArgs(src, i) {
  const args = []; let depth = 0, q = '', cur = '';
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (q) { cur += c; if (c === '\\') { cur += src[++k]; } else if (c === q) q = ''; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) { if (depth === 0) { args.push(cur.trim()); return args; } depth--; }
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  throw new Error('apel neînchis');
}

// toate familiile de chei construite din cod: prefix + valoare
const FAMILIES = {
  tab_: TABS, l_: UI_LANGS, pos_: E.POS, st_: E.STATUSES, gd_st_: E.STATUSES, g_: GROUPS,
  issue_: ISSUE_CODES.concat(['other']), b_e_: PASTE.concat(['dup']), gd_: [1, 2, 3, 4, 5, 6], lim_: [1, 2, 3, 4, 5, 6]
};
const familyKeys = [].concat(...Object.entries(FAMILIES).map(([p, vs]) => vs.map((v) => p + v)));

test('toate limbile au exact aceleași chei și aceiași substituenți {n}, fără texte goale', () => {
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(I18N[l]), keys, l + ': chei diferite');
    for (const k of keys) {
      assert.ok(typeof I18N[l][k] === 'string' && I18N[l][k].trim().length > 0, l + '/' + k + ': text gol');
      assert.deepEqual(ph(I18N[l][k]).sort(), ph(I18N.en[k]).sort(), l + '/' + k + ': substituenți diferiți');
    }
  }
  assert.deepEqual(Object.keys(I18N).sort(), LANGS.slice().sort());
  assert.ok(keys.length >= 180, keys.length + ' chei');
});

test('fiecare șir snake_case din ui.js este o cheie de traducere existentă (sau un nume de câmp cunoscut)', () => {
  const lits = [...ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)].map((m) => m[1]).filter((s) => !s.endsWith('_') && !NOT_KEYS.includes(s));
  assert.ok(lits.length > 80, 'puține chei găsite: ' + lits.length);
  for (const k of new Set(lits)) assert.ok(keys.includes(k), 'cheie lipsă în i18n: ' + k);
  // prefixele folosite la chei construite («'l_' + cod») sunt exact cele din FAMILIES
  const pre = [...new Set([...ui.matchAll(/L\.t\('([a-z_]+_)' \+/g)].map((m) => m[1]).concat([...ui.matchAll(/L\.t\(issueKey/g)].length ? ['issue_'] : []))].sort();
  assert.deepEqual(pre, ['b_e_', 'g_', 'gd_', 'gd_st_', 'issue_', 'l_', 'lim_', 'pos_', 'st_', 'tab_'].sort());
  for (const p of pre) assert.ok(FAMILIES[p], p);
});

test('familiile dinamice de chei (file, limbi, părți de vorbire, stări, grupe de concepte, erori, ghid, limite) sunt complete', () => {
  assert.deepEqual(TABS, ['search', 'cover', 'add', 'export', 'guide']);
  assert.deepEqual(UI_LANGS, LANGS, 'limbile interfeței = limbile din ambalaj și din teste');
  assert.deepEqual(E.POS, ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'numeral', 'phrase', 'other']);
  assert.deepEqual(E.STATUSES, ['draft', 'sourced', 'reviewed']);
  assert.deepEqual(GROUPS, ['numbers', 'family', 'body', 'nature', 'basic']);
  assert.deepEqual(PASTE, ['gloss', 'headword', 'many', 'sep']);
  for (const k of familyKeys) assert.ok(keys.includes(k), 'lipsește ' + k);
  assert.ok(!keys.includes('lim_7') && !keys.includes('gd_7'), 'ui.js afișează doar lim_1…lim_6 și gd_1…gd_6');
});

test('codurile de eroare ale motorului: cele din issueKey sunt toate emise de validateEntry, iar celelalte se arată ca «issue_other»', () => {
  const other = EMITTED.filter((c) => !ISSUE_CODES.includes(c));
  assert.deepEqual(other, ['extra', 'object', 'status']);
  for (const c of ISSUE_CODES) assert.ok(EMITTED.includes(c), c + ' nu mai este emis de motor');
  // fiecare cod chiar apare: câte o înregistrare stricată în felul respectiv
  const ok = { lang: 'rup', headword: 'x', pos: 'noun', gloss: { en: 'y' }, source: 's' };
  const mk = (patch) => Object.assign({}, ok, patch);
  const bad = {
    extra: mk({ id: 1 }), lang: mk({ lang: 'X' }), headword: mk({ headword: '' }), variants: mk({ variants: 'a' }), pos: mk({ pos: 'z' }), gloss: mk({ gloss: {} }),
    concept: mk({ concept: 'A' }), dialect: mk({ dialect: 'A' }), orthography: mk({ orthography: 'A' }), status: mk({ status: 'z' }), reviewed_by: mk({ reviewed_by: '' }),
    source_url: mk({ source_url: 'http://x' }), notes: mk({ notes: '' }), examples: mk({ examples: 'a' }), audio: mk({ audio: 'x.mp3' }),
    audio_big: mk({ audio: 'data:audio/ogg;base64,' + Buffer.concat([Buffer.from('OggS\0\0\0\0\0\0\0\0OpusHead'), Buffer.alloc(52000)]).toString('base64') }),
    source: mk({ source: '' }), license: mk({ license: '' })
  };
  for (const [c, e] of Object.entries(bad)) assert.ok(E.validateEntry(e, null).includes(c), c + ': ' + JSON.stringify(E.validateEntry(e, null)));
  assert.deepEqual(E.validateEntry(5, null), ['object']);
});

test('nicio cheie nu rămâne nefolosită (nici statică, nici din familiile dinamice, nici în ambalaj)', () => {
  const used = new Set(BUILDER.concat(familyKeys));
  for (const m of ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)) used.add(m[1]);
  for (const m of ui.matchAll(/L\.[tf]\('([a-z_0-9]+)'/g)) used.add(m[1]);
  const orphan = keys.filter((k) => !used.has(k));
  assert.deepEqual(orphan, []);
  const unknown = familyKeys.filter((k) => !keys.includes(k));
  assert.deepEqual(unknown, []);
});

test('apelurile L.f dau cel puțin atâtea argumente câți substituenți are textul, iar L.t nu se folosește pe texte cu substituenți', () => {
  let nf = 0, nt = 0;
  for (const m of ui.matchAll(/L\.([tf])\('([a-z_0-9]+)'/g)) {
    const kind = m[1], key = m[2];
    if (!keys.includes(key)) continue;  // prefixe de chei construite, verificate mai sus
    const rest = callArgs(ui, m.index + m[0].length);
    const given = rest.filter((x) => x !== '').length;
    const need = Math.max(-1, ...ph(I18N.en[key]));
    if (kind === 'f') { nf++; assert.ok(given >= need + 1 && given >= 1, 'L.f(' + key + '): ' + given + ' argumente, ' + (need + 1) + ' necesare'); }
    else { nt++; assert.ok(need < 0, 'L.t(' + key + ') folosit pe un text cu substituenți'); }
  }
  assert.ok(nf >= 12 && nt >= 70, nf + ' apeluri L.f, ' + nt + ' apeluri L.t');
  // familiile construite nu au substituenți (se afișează cu L.t)
  for (const k of familyKeys) assert.deepEqual(ph(I18N.en[k]), [], k);
});

test('traducerile nu conțin caractere de control, spații duble sau la capete, nici sedilă în română', () => {
  for (const l of LANGS) for (const k of keys) {
    const s = I18N[l][k];
    assert.ok(!/[\u0000-\u001f\u007f]/.test(s), l + '/' + k + ': caractere de control');
    assert.ok(!/ {2,}/.test(s), l + '/' + k + ': spații duble');
    assert.equal(s, s.trim(), l + '/' + k + ': spații la capete');
  }
  for (const k of keys) assert.ok(!/[şţŞŢ]/.test(I18N.ro[k]), 'ro/' + k + ': sedilă');
});

test('numele limbilor l_*: opt nume distincte în fiecare limbă a interfeței, iar limba proprie apare cu numele ei (autonim)', () => {
  const AUTONYM = { ro: 'Română', en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', it: 'Italiano', hu: 'Magyar', pt: 'Português' };
  for (const l of LANGS) {
    const names = LANGS.map((x) => I18N[l]['l_' + x]);
    assert.equal(new Set(names).size, 8, l + ': nume repetate ' + names.join(', '));
    assert.equal(I18N[l]['l_' + l], AUTONYM[l], l + ': limba proprie');
  }
});
