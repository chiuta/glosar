import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import I18N from '../src/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu'];
const sfx = (l) => (l === 'en' ? '' : '.' + l);
const GUIDE = { en: read('docs/contributor-guide.md'), ro: read('docs/contributor-guide.ro.md') };
const REC = { en: read('docs/recording-guide.md'), ro: read('docs/recording-guide.ro.md') };
const ui = read('src/ui.js');
const pkg = JSON.parse(read('package.json'));
const app = JSON.parse(read('src/app.json'));
const concepts = JSON.parse(read('data/concepts.json')).concepts;
const entries = fs.readdirSync(path.join(ROOT, 'data', 'dictionaries')).filter((f) => f.endsWith('.json') && f !== 'example.json').map((f) => JSON.parse(read('data/dictionaries/' + f)));

// Blocuri de cod, fără comentariile de la sfârșitul rândurilor (ele sunt scrise în limba ghidului).
function blocks(t) { return [...t.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)].map((m) => ({ info: m[1].trim(), body: m[2].split('\n').map((l) => l.replace(/\s+#.*$/, '')).join('\n') })); }
const count = (lang) => entries.filter((e) => e.lang === lang).length;

test('ghidurile există în engleză și română, au aceleași blocuri de comenzi, aceleași secțiuni și trimit unul la altul', () => {
  assert.deepEqual(blocks(GUIDE.en), blocks(GUIDE.ro));
  assert.deepEqual(blocks(REC.en), blocks(REC.ro));
  assert.match(GUIDE.en, /\[Română\]\(contributor-guide\.ro\.md\)/);
  assert.match(GUIDE.ro, /\[English\]\(contributor-guide\.md\)/);
  assert.match(REC.en, /\[Română\]\(recording-guide\.ro\.md\)/);
  assert.match(REC.ro, /\[English\]\(recording-guide\.md\)/);
  const h2 = (t) => (t.match(/^## /gm) || []).length;
  assert.equal(h2(GUIDE.en), 8); assert.equal(h2(GUIDE.ro), 8);
  assert.equal(h2(REC.en), 6); assert.equal(h2(REC.ro), 6);
  assert.match(GUIDE.en, /`recording-guide\.md`/); assert.match(GUIDE.ro, /`recording-guide\.ro\.md`/);
});

test('numele butoanelor și filelor din ghiduri sunt exact cele din interfață, în engleză și în română', () => {
  const MAP = [
    ['tab_add', 'eq'], ['tab_cover', 'eq'], ['s_status_l', 'eq'], ['a_check', 'eq'], ['a_add', 'eq'], ['b_title', 'eq'], ['a_rec', 'eq'], ['a_stop', 'eq'],
    ['a_audio_h', 'start'], ['a_rec_clear', 'eq'], ['m_dlall', 'eq'], ['m_dl1', 'eq'], ['m_dla', 'eq'], ['r_play', 'eq'], ['a_upload_l', 'start'], ['c_add', 'eq']
  ];
  for (const lang of ['en', 'ro']) {
    const text = GUIDE[lang] + '\n' + REC[lang];
    const seen = new Set();
    for (const [key, mode] of MAP) {
      const full = I18N[lang][key];
      const bold = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]);
      const hit = bold.find((b) => (mode === 'eq' ? b === full : full.startsWith(b) && b.length > 4));
      assert.ok(hit, lang + ': eticheta «' + full + '» (' + key + ') nu apare ca text îngroșat în ghiduri');
      seen.add(key);
    }
    assert.equal(seen.size, MAP.length);
    // fiecare nume de buton sau de filă după «press / apasă / open the / deschide fila / under / la» este un text din interfață
    const all = Object.values(I18N[lang]);
    const named = [...text.matchAll(/(?:[Pp]ress|[Aa]pasă|[Oo]pen the|[Dd]eschide fila|Under|La) \*\*([^*]+)\*\*/g)].map((m) => m[1]);
    assert.ok(named.length >= 12, lang + ': ' + named.length + ' nume de butoane');
    for (const b of named) assert.ok(all.some((s) => s === b || s.startsWith(b)), lang + ': «' + b + '» nu e un text din interfață');
  }
});

test('limitele din ghiduri sunt cele din cod: 50 KB, 8 secunde, 200 de rânduri, 500 de intrări, 4 MB', () => {
  assert.equal(E.LIMITS.audio, 50 * 1024);
  assert.match(ui, /MAX_REC_S = 8,/);
  assert.match(ui, /MAX_STORE_CHARS = 4000000/);
  assert.equal(E.LIMITS.bulk, 200);
  assert.equal(E.LIMITS.own, 500);
  assert.match(ui, /audioBitsPerSecond: 24000/);
  for (const lang of ['en', 'ro']) {
    const t = GUIDE[lang] + '\n' + REC[lang];
    for (const piece of ['50 KB', '8 ', '200 ', '500 ', '4 MB', '24 kbit/s', 'Opus', 'Ogg', 'WebM']) assert.ok(t.includes(piece), lang + ' ' + piece);
    assert.ok(/-b:a 24k/.test(REC[lang]) && /-t 8/.test(REC[lang]));
  }
  for (const k of ['a_rec_big', 'a_upload_l', 'lim_4']) assert.ok(/50 ?KB/.test(I18N.en[k]), k);
  assert.ok(/8 MB/.test(I18N.en.e_big) && /500/.test(I18N.en.e_many) && /200/.test(I18N.en.b_e_many));
});

test('fișierele și comenzile din ghiduri există: scripturi, opțiuni, exemple de nume de fișier și exemplul de înregistrare cu ffmpeg', () => {
  for (const lang of ['en', 'ro']) {
    const t = GUIDE[lang] + '\n' + REC[lang];
    const paths = new Set([...t.matchAll(/`((?:docs|scripts|data|src)\/[A-Za-z0-9_.\-/]+)`/g)].map((m) => m[1]).filter((p) => !/<|>/.test(p)));
    assert.ok(paths.size >= 4, lang + ': ' + paths.size + ' căi');
    for (const b of blocks(t)) for (const m of b.body.matchAll(/(?:scripts|docs)\/[A-Za-z0-9_.\-]+/g)) assert.ok(fs.existsSync(path.join(ROOT, m[0])), lang + ': lipsește ' + m[0] + ' (din blocul de cod)');
    for (const p of paths) {
      if (p === 'data/dictionaries/*.json' || p === 'audio/*') continue;
      assert.ok(fs.existsSync(path.join(ROOT, p)), lang + ': lipsește ' + p);
    }
  }
  // comenzile din ghid, și opțiunea --dry-run, sunt cele scrise în scripturi
  const imp = read('scripts/import_bundle.py');
  assert.match(imp, /"--dry-run"/);
  assert.match(read('scripts/validate.py'), /"--strict"/);
  // numele din exemple sunt chiar intrări
  for (const id of ['ruq-tinti', 'rup-tsintsi']) assert.ok(fs.existsSync(path.join(ROOT, 'data', 'dictionaries', id + '.json')), id);
  assert.equal(E.entryId('ruq', 'ținți'), 'ruq-tinti');
  assert.equal(E.entryId('rup', 'tsintsi'), 'rup-tsintsi');
  assert.equal(E.entryId('ruq', 'ţinţi'), 'ruq-tinti', 'cu sedilă sau cu virgulă, același nume de fișier');
});

test('comanda ffmpeg din ghidul de înregistrare dă un fișier acceptat de validator (dacă ffmpeg e instalat)', () => {
  const ff = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (ff.error || ff.status !== 0) return;
  const cmd = REC.en.match(/^ffmpeg (.*)$/m);
  assert.ok(cmd, 'comanda ffmpeg din ghid');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'glosar-rec-'));
  try {
    const src = path.join(tmp, 'word.m4a');
    let r = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'sine=frequency=330:duration=3', src], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    const args = cmd[1].split(/\s+/).map((a) => (a === 'word.m4a' ? src : a === 'word.opus' ? path.join(tmp, 'word.opus') : a));
    r = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    const out = fs.readFileSync(path.join(tmp, 'word.opus'));
    assert.equal(E.audioKind(out), 'ogg');
    assert.ok(out.length < E.LIMITS.audio, out.length + ' B');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

test('README, CHANGELOG, CONTRIBUTING și ISSUES_GOOD_FIRST au aceeași versiune și dată în toate cele opt limbi', () => {
  assert.equal(pkg.version, app.version);
  const WORD = { en: ['Version', 'Last updated'], ro: ['Versiune', 'Ultima actualizare'] };
  for (const l of LANGS) {
    for (const base of ['README', 'CONTRIBUTING']) {
      const t = read(base + sfx(l) + '.md');
      const m = t.match(/^(.+?): (\d+\.\d+\.\d+) · (.+?): (\d{4}-\d{2}-\d{2})$/m);
      assert.ok(m, base + sfx(l) + ': linia de versiune');
      assert.equal(m[2], pkg.version, base + sfx(l)); assert.equal(m[4], app.updated, base + sfx(l));
      if (WORD[l]) assert.deepEqual([m[1], m[3]], WORD[l], base + sfx(l));
    }
    const c = read('CHANGELOG' + sfx(l) + '.md');
    assert.ok(c.includes('## [' + pkg.version + '] - ' + app.updated), 'CHANGELOG' + sfx(l));
    assert.ok(c.indexOf('## [Unreleased]') < c.indexOf('## [' + pkg.version + ']') && c.indexOf('## [' + pkg.version + ']') < c.indexOf('## [0.1.0]'), 'CHANGELOG' + sfx(l) + ': ordinea versiunilor');
  }
});

test('cifrele din README coincid cu datele: 43 de intrări de pornire, 50 de concepte, cele trei limbi cu cuvinte, istroromâna goală', () => {
  assert.equal(entries.length, 43);
  assert.deepEqual([count('rup'), count('ruq'), count('rom'), count('ruo')], [11, 10, 22, 0]);
  assert.equal(concepts.length, 50);
  for (const l of LANGS) {
    const t = read('README' + sfx(l) + '.md');
    assert.ok(/\b43\b/.test(t), 'README' + sfx(l) + ': 43');
    assert.ok(/\b50\b/.test(t), 'README' + sfx(l) + ': 50');
    assert.ok(t.includes('docs/contributor-guide') && t.includes('scripts/import_bundle.py') && t.includes('scripts/validate.py'), 'README' + sfx(l));
    assert.ok(t.includes('https://glosar.chiuta.ro'));
    assert.ok(/ES2017/.test(t) && /Node\.js 24/.test(t), 'README' + sfx(l) + ': cerințele');
  }
  assert.equal(pkg.engines.node, '>=24');
  // sarcinile de început: zece, aceleași în toate limbile, iar fișierul pentru create_issues.sh are titlurile englezești
  const issue = (l) => [...read('ISSUES_GOOD_FIRST' + sfx(l) + '.md').matchAll(/^- \[ \] (.+)$/gm)].map((m) => m[1]);
  for (const l of LANGS) assert.equal(issue(l).length, 10, 'ISSUES_GOOD_FIRST' + sfx(l));
  assert.deepEqual(read('good-first-issues.txt').trim().split('\n'), issue('en'));
  // cifrele din sarcini: 11 + 10 + 22 intrări de pornire
  assert.ok(issue('en')[0].includes('11 starter entries') && issue('en')[1].includes('10 starter entries') && issue('en')[2].includes('22 starter entries'));
});

test('limitele din README sunt aceleași texte ca în interfață, în fiecare limbă', () => {
  for (const l of LANGS) {
    const t = read('README' + sfx(l) + '.md');
    for (let i = 1; i <= 6; i++) assert.ok(t.includes(I18N[l]['lim_' + i]), 'README' + sfx(l) + ': lim_' + i);
    assert.ok(t.includes('## ' + I18N[l].h_limits), 'README' + sfx(l) + ': titlul');
  }
});

test('fluxul de lucru rulează validarea, testele și verificarea construcției pe Ubuntu 26.04 cu Node.js 26', () => {
  const y = read('.github/workflows/validate.yml');
  assert.match(y, /runs-on: ubuntu-26\.04/);
  assert.match(y, /node-version: 26/);
  for (const c of ['python scripts/validate.py', 'node --test "test/*.test.mjs"', 'node scripts/build.mjs --check', 'pip install jsonschema']) assert.ok(y.includes(c), c);
  assert.ok(!/ubuntu-latest/.test(y));
});

test('șabloanele de pe GitHub trimit la pagină și la validator', () => {
  const n = read('.github/ISSUE_TEMPLATE/new-entry.md'), p = read('.github/PULL_REQUEST_TEMPLATE.md');
  assert.match(n, /labels: data/);
  assert.match(n, /Download everything/);
  assert.ok(I18N.en.m_dlall.startsWith('Download everything') && I18N.en.tab_add === 'Add');
  assert.match(p, /scripts\/validate\.py/);
  assert.match(p, /npm test/);
});
