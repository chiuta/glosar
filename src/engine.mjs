// GLOSAR · motorul (logică pură, fără DOM). Sintaxă ES2017. Regulile de «fold» și «entryId» sunt aceleași ca în scripts/validate.py.
// fold · entryId · buildIndex · search · validateEntry · duplicates · coverage · toTSV · toAnki · makeBundle · parseBundle · parsePaste

export const POS = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'numeral', 'phrase', 'other'];
export const STATUSES = ['draft', 'sourced', 'reviewed'];
export const LIMITS = { headword: 80, gloss: 200, notes: 500, variants: 20, examples: 10, example: 300, source: 300, audio: 51200, own: 500, bulk: 200, bundle: 500 };
const KEYS = ['lang', 'headword', 'variants', 'pos', 'gloss', 'concept', 'dialect', 'orthography', 'status', 'reviewed_by', 'notes', 'examples', 'audio', 'source', 'source_url', 'license'];
const EXTRA = { 'đ': 'd', 'ð': 'd', 'ł': 'l', 'ø': 'o', 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ı': 'i', 'þ': 'th', 'ħ': 'h', 'ə': 'a', 'ɨ': 'i', 'ʒ': 'zh', 'ʃ': 'sh' };
const EXTRA_RE = /[đðłøßæœıþħəɨʒʃ]/g;
const DATA_AUDIO = /^data:audio\/(webm|ogg)(?:;codecs=opus)?;base64,([A-Za-z0-9+/]+={0,2})$/;
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CTRL = /[\u0000-\u001f\u007f]/;

function dict() { return Object.create(null); }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function str(v, min, max) { return typeof v === 'string' && v.length >= min && v.length <= max; }

/* ---------------- normalizare ---------------- */
// minuscule, fără semne diacritice combinate, câteva litere scrise cu litere latine simple; cheia pentru căutare și nume de fișiere
export function fold(s) {
  const t = String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(EXTRA_RE, function (c) { return EXTRA[c]; });
  return t.replace(/\s+/g, ' ').trim();
}
export function entryId(lang, headword) {
  let slug = fold(headword).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) slug = 'u' + Array.from(String(headword).toLowerCase()).map(function (c) { return c.codePointAt(0).toString(16); }).join('-');
  return lang + '-' + slug;
}
// id unic față de cele existente: <lang>-<slug>, apoi -2, -3 …
export function uniqueId(lang, headword, taken) {
  const base = entryId(lang, headword);
  let id = base, n = 2;
  while (taken[id]) id = base + '-' + (n++);
  return id;
}

/* ---------------- audio ---------------- */
export function audioBytes(uri) {
  const m = typeof uri === 'string' ? DATA_AUDIO.exec(uri) : null;
  if (!m) return -1;
  const b = m[2];
  return Math.floor(b.length * 3 / 4) - (b.length - b.replace(/=+$/, '').length);
}
export function audioExt(uri) { const m = typeof uri === 'string' ? DATA_AUDIO.exec(uri) : null; return m ? (m[1] === 'ogg' ? 'opus' : 'webm') : ''; }
// octeții unui URI de date audio (Uint8Array) sau null
export function dataUriBytes(uri) {
  const m = typeof uri === 'string' ? DATA_AUDIO.exec(uri) : null;
  if (!m) return null;
  let bin;
  try { bin = atob(m[2]); } catch (e) { return null; }
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function hasAscii(u, str, limit) {
  const n = Math.min(u.length, limit) - str.length;
  for (let i = 0; i <= n; i++) {
    let j = 0;
    while (j < str.length && u[i + j] === str.charCodeAt(j)) j++;
    if (j === str.length) return true;
  }
  return false;
}
// 'ogg' = Opus în Ogg («OggS» + «OpusHead» în primii 200 de octeți); 'webm' = Opus în WebM (antet EBML + «A_OPUS» în primii 4096); altfel ''
export function audioKind(u) {
  if (!u || u.length < 12) return '';
  if (u[0] === 0x4f && u[1] === 0x67 && u[2] === 0x67 && u[3] === 0x53) return hasAscii(u, 'OpusHead', 200) ? 'ogg' : '';
  if (u[0] === 0x1a && u[1] === 0x45 && u[2] === 0xdf && u[3] === 0xa3) return hasAscii(u, 'A_OPUS', 4096) ? 'webm' : '';
  return '';
}

/* ---------------- validarea unei înregistrări (oglinda schemei) ---------------- */
// întoarce o listă de coduri de eroare: object, extra, lang, headword, variants, pos, gloss, concept, dialect, orthography, status,
// reviewed_by, notes, examples, audio, audio_big, source, source_url, license
// ctx (opțional): {languages: {cod: {orthographies:[{id}], dialects:[{id}]}}, concepts: {id: true}}
export function validateEntry(o, ctx) {
  if (!isObj(o)) return ['object'];
  const out = [];
  const bad = function (c) { if (out.indexOf(c) < 0) out.push(c); };
  Object.keys(o).forEach(function (k) { if (KEYS.indexOf(k) < 0) bad('extra'); });
  const lg = ctx && ctx.languages ? ctx.languages[o.lang] : null;
  if (typeof o.lang !== 'string' || !/^[a-z]{2,3}$/.test(o.lang) || (ctx && ctx.languages && !lg)) bad('lang');
  if (!str(o.headword, 1, LIMITS.headword) || CTRL.test(o.headword) || o.headword.trim() !== o.headword) bad('headword');
  if (o.variants !== undefined) {
    if (!Array.isArray(o.variants) || o.variants.length > LIMITS.variants) bad('variants');
    else o.variants.forEach(function (v, i) { if (!str(v, 1, LIMITS.headword) || CTRL.test(v) || o.variants.indexOf(v) !== i) bad('variants'); });
  }
  if (POS.indexOf(o.pos) < 0) bad('pos');
  if (!isObj(o.gloss) || !Object.keys(o.gloss).length) bad('gloss');
  else Object.keys(o.gloss).forEach(function (k) { if (!/^[a-z]{2,3}$/.test(k) || !str(o.gloss[k], 1, LIMITS.gloss) || CTRL.test(o.gloss[k])) bad('gloss'); });
  if (o.concept !== undefined && (typeof o.concept !== 'string' || !ID_RE.test(o.concept) || (ctx && ctx.concepts && !ctx.concepts[o.concept]))) bad('concept');
  if (o.dialect !== undefined && (!str(o.dialect, 1, 40) || !ID_RE.test(o.dialect) || (lg && lg.dialects.map(function (d) { return d.id; }).indexOf(o.dialect) < 0))) bad('dialect');
  if (o.orthography !== undefined && (!str(o.orthography, 1, 40) || !ID_RE.test(o.orthography) || (lg && lg.orthographies.map(function (d) { return d.id; }).indexOf(o.orthography) < 0))) bad('orthography');
  if (o.status !== undefined && STATUSES.indexOf(o.status) < 0) bad('status');
  if (o.reviewed_by !== undefined && !str(o.reviewed_by, 1, 80)) bad('reviewed_by');
  if (o.status === 'reviewed' && o.reviewed_by === undefined) bad('reviewed_by');
  if (o.status === 'sourced' && o.source_url === undefined) bad('source_url');
  if (o.notes !== undefined && !str(o.notes, 1, LIMITS.notes)) bad('notes');
  if (o.examples !== undefined) {
    if (!Array.isArray(o.examples) || o.examples.length > LIMITS.examples) bad('examples');
    else o.examples.forEach(function (x) { if (!str(x, 1, LIMITS.example)) bad('examples'); });
  }
  if (o.audio !== undefined) {
    const n = audioBytes(o.audio);
    if (n < 0 && !(typeof o.audio === 'string' && /^audio\/[a-z0-9-]+\.(opus|ogg|webm)$/.test(o.audio))) bad('audio');
    else if (n > LIMITS.audio) bad('audio_big');
    else if (n >= 0 && !audioKind(dataUriBytes(o.audio))) bad('audio');
  }
  if (!str(o.source, 1, LIMITS.source) || CTRL.test(o.source)) bad('source');
  if (o.source_url !== undefined && (!str(o.source_url, 1, 500) || !/^https:\/\/[^\s]+$/.test(o.source_url))) bad('source_url');
  if (o.license !== undefined && !str(o.license, 1, 80)) bad('license');
  return out;
}
// aceleași câmpuri, în ordinea din fișierele de date; fără câmpuri goale
export function canonicalEntry(o) {
  const e = {};
  KEYS.forEach(function (k) {
    const v = o[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) return;
    e[k] = v;
  });
  return e;
}

/* ---------------- căutare ---------------- */
const SRANK = { reviewed: 0, sourced: 1, draft: 2 };
function glossItems(g) {
  const out = [];
  Object.keys(g || {}).forEach(function (k) {
    const full = fold(g[k]);
    if (full) out.push(full);
    String(g[k]).split(/[;,\/]/).forEach(function (p) { const f = fold(p); if (f && out.indexOf(f) < 0) out.push(f); });
  });
  return out;
}
export function buildIndex(entries) {
  return entries.map(function (e) { return { e: e, k: fold(e.headword), kv: (e.variants || []).map(fold), kg: glossItems(e.gloss) }; });
}
function wordStart(h, f) { return (' ' + h).indexOf(' ' + f) >= 0; }
// opt: {lang, minStatus: 'any'|'sourced'|'reviewed', audio}; întoarce [{e, score, why}] cele mai bune primele
export function search(index, q, opt) {
  const o = opt || {}, f = fold(q), out = [];
  const minRank = o.minStatus === 'reviewed' ? 0 : o.minStatus === 'sourced' ? 1 : 2;
  index.forEach(function (x) {
    const e = x.e;
    if (o.lang && o.lang !== 'all' && e.lang !== o.lang) return;
    if ((SRANK[e.status || 'draft'] === undefined ? 2 : SRANK[e.status || 'draft']) > minRank) return;
    if (o.audio && !e.audio) return;
    let s = 0, why = '';
    if (!f) { s = 1; why = 'all'; } else {
      const hs = [x.k].concat(x.kv);
      if (hs.indexOf(f) >= 0) { s = 100; why = 'exact'; }
      else if (hs.some(function (h) { return h.indexOf(f) === 0; })) { s = 80; why = 'prefix'; }
      else if (hs.some(function (h) { return wordStart(h, f); })) { s = 70; why = 'word'; }
      else if (hs.some(function (h) { return h.indexOf(f) >= 0; })) { s = 50; why = 'part'; }
      else if (x.kg.indexOf(f) >= 0) { s = 60; why = 'meaning'; }
      else if (x.kg.some(function (g) { return g.indexOf(f) === 0 || wordStart(g, f); })) { s = 40; why = 'meaning-start'; }
      else if (x.kg.some(function (g) { return g.indexOf(f) >= 0; })) { s = 20; why = 'meaning-part'; }
    }
    if (s) out.push({ e: e, score: s, why: why, k: x.k });
  });
  out.sort(function (a, b) {
    return b.score - a.score || (f ? 0 : (a.e.lang < b.e.lang ? -1 : a.e.lang > b.e.lang ? 1 : 0)) ||
      (SRANK[a.e.status || 'draft'] - SRANK[b.e.status || 'draft']) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0) || (String(a.e.id) < String(b.e.id) ? -1 : 1);
  });
  return out;
}

/* ---------------- duplicate ---------------- */
export function dupKey(e) { return [e.lang, e.dialect || '', e.orthography || '', e.pos, fold(e.headword)].join('|'); }
// intrări care au aceeași cheie ca «e» (limbă, dialect, ortografie, parte de vorbire, cuvânt); «same» = aceleași sensuri
export function findDuplicates(entries, e) {
  const k = dupKey(e), out = [];
  entries.forEach(function (x) { if (x !== e && dupKey(x) === k) out.push({ e: x, same: JSON.stringify(x.gloss) === JSON.stringify(e.gloss) }); });
  return out;
}
// grupuri de intrări cu aceeași cheie: [{key, entries, same}]
export function duplicates(entries) {
  const g = dict();
  entries.forEach(function (e) { (g[dupKey(e)] || (g[dupKey(e)] = [])).push(e); });
  return Object.keys(g).filter(function (k) { return g[k].length > 1; }).sort().map(function (k) {
    const list = g[k];
    return { key: k, entries: list, same: list.every(function (x) { return JSON.stringify(x.gloss) === JSON.stringify(list[0].gloss); }) };
  });
}

/* ---------------- acoperirea listei de concepte ---------------- */
// rows: [{concept, cells: {cod: intrarea cea mai sigură | null}}]; have: {cod: număr de concepte acoperite}
export function coverage(concepts, entries, codes) {
  const by = dict(), have = dict();
  codes.forEach(function (c) { have[c] = 0; });
  entries.forEach(function (e) {
    if (!e.concept) return;
    const k = e.concept + '|' + e.lang, cur = by[k];
    if (!cur || SRANK[e.status || 'draft'] < SRANK[cur.status || 'draft']) by[k] = e;
  });
  const rows = concepts.map(function (c) {
    const cells = dict();
    codes.forEach(function (l) { const e = by[c.id + '|' + l] || null; cells[l] = e; if (e) have[l]++; });
    return { concept: c, cells: cells };
  });
  return { rows: rows, have: have, total: concepts.length };
}

/* ---------------- exporturi ---------------- */
function cell(s) { return String(s === undefined || s === null ? '' : s).replace(/[\t\r\n]+/g, ' ').trim(); }
// foile de calcul iau drept formulă o celulă care începe cu = + - @; apostroful din față o face text (OWASP, «CSV injection»)
function sheetCell(s) { const c = cell(s); return /^[=+\-@]/.test(c) ? "'" + c : c; }
function glossLangs(entries, first) {
  const seen = dict(), out = [];
  (first || []).forEach(function (l) { if (!seen[l]) { seen[l] = 1; out.push(l); } });
  const rest = [];
  entries.forEach(function (e) { Object.keys(e.gloss).forEach(function (l) { if (!seen[l]) { seen[l] = 1; rest.push(l); } }); });
  return out.concat(rest.sort());
}
// TSV cu antet: id, limbă, cuvânt, variante, parte de vorbire, dialect, ortografie, stare, sensuri (câte o coloană pe limbă), sursă
export function toTSV(entries) {
  const gl = glossLangs(entries, ['en', 'ro']).filter(function (l, i) { return i < 2 || entries.some(function (e) { return e.gloss[l]; }); });
  const head = ['id', 'lang', 'headword', 'variants', 'pos', 'dialect', 'orthography', 'status'].concat(gl.map(function (l) { return 'gloss_' + l; }), ['source']);
  const lines = [head.join('\t')];
  entries.forEach(function (e) {
    lines.push([e.id || entryId(e.lang, e.headword), e.lang, e.headword, (e.variants || []).join(' | '), e.pos, e.dialect || '', e.orthography || '', e.status || 'draft']
      .concat(gl.map(function (l) { return e.gloss[l] || ''; }), [e.source]).map(sheetCell).join('\t'));
  });
  return lines.join('\n') + '\n';
}
function esc(s) { return cell(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
// fișier pentru Anki (Fișier → Import): față = cuvântul (cu variantele), spate = sensurile; etichete = limba, starea, conceptul
// L: {pos: {noun: …}, lang: {en: 'English', …}} — etichete traduse pentru spatele cardului; glossFirst: ordinea limbilor de sens
export function toAnki(entries, L, glossFirst) {
  const lines = ['#separator:tab', '#html:true', '#tags column:3'];
  const order = glossLangs(entries, glossFirst || ['en', 'ro']);
  entries.forEach(function (e) {
    const front = '<b>' + esc(e.headword) + '</b>' + (e.variants && e.variants.length ? '<br><small>' + esc(e.variants.join(', ')) + '</small>' : '');
    const back = order.filter(function (l) { return e.gloss[l]; }).map(function (l) { return esc((L && L.lang && L.lang[l]) || l) + ': ' + esc(e.gloss[l]); }).join('<br>') +
      '<br><small>' + esc((L && L.pos && L.pos[e.pos]) || e.pos) + '</small>';
    const tags = ['glosar', e.lang, 'status-' + (e.status || 'draft')].concat(e.concept ? ['concept-' + e.concept] : []).join(' ');
    lines.push([front, back, tags].join('\t'));
  });
  return lines.join('\n') + '\n';
}
export function entryToJson(e, id) {
  const c = canonicalEntry(e);
  if (c.audio && audioBytes(c.audio) >= 0) c.audio = 'audio/' + (id || entryId(c.lang, c.headword)) + '.' + audioExt(c.audio);
  return JSON.stringify(c, null, 2) + '\n';
}

/* ---------------- fișierul de contribuție ---------------- */
export function makeBundle(entries, when) {
  const list = entries.map(function (e) {
    const c = canonicalEntry(e);
    if (c.audio && audioBytes(c.audio) >= 0) { c.audio_data = c.audio; delete c.audio; }
    return c;
  });
  return JSON.stringify({ format: 'glosar-bundle', version: 1, created: when || new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'), entries: list }, null, 2) + '\n';
}
// întoarce {entries, errors}; errors = [{index (de la 1), codes}] sau [{index: 0, codes: ['format'|'json'|'many']}]
export function parseBundle(text, ctx) {
  let b;
  try { b = JSON.parse(String(text)); } catch (e) { return { entries: [], errors: [{ index: 0, codes: ['json'] }] }; }
  if (!isObj(b) || b.format !== 'glosar-bundle' || b.version !== 1 || !Array.isArray(b.entries)) return { entries: [], errors: [{ index: 0, codes: ['format'] }] };
  if (b.entries.length > LIMITS.bundle) return { entries: [], errors: [{ index: 0, codes: ['many'] }] };
  const entries = [], errors = [];
  b.entries.forEach(function (raw, i) {
    if (!isObj(raw)) { errors.push({ index: i + 1, codes: ['object'] }); return; }
    const e = Object.assign({}, raw);
    if (e.audio_data !== undefined) { e.audio = e.audio_data; delete e.audio_data; }
    const codes = validateEntry(e, ctx);
    if (codes.length) errors.push({ index: i + 1, codes: codes }); else entries.push(canonicalEntry(e));
  });
  return { entries: entries, errors: errors };
}

/* ---------------- lipire de liste: «cuvânt <tab> sens» ---------------- */
// separatori: tab, «;», «=» (primul găsit); întoarce {items: [{headword, gloss, line}], errors: [{line, code}]}; coduri: sep, headword, gloss, many
export function parsePaste(text) {
  const items = [], errors = [], lines = String(text).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, ''), t = raw.trim();
    if (!t || t.charAt(0) === '#') continue;
    if (items.length >= LIMITS.bulk) { errors.push({ line: i + 1, code: 'many' }); break; }
    let cut = raw.indexOf('\t');
    if (cut < 0) cut = raw.indexOf(';');
    if (cut < 0) cut = raw.indexOf('=');
    if (cut < 0) { errors.push({ line: i + 1, code: 'sep' }); continue; }
    const head = raw.slice(0, cut).trim(), gloss = raw.slice(cut + 1).trim();
    if (!str(head, 1, LIMITS.headword) || CTRL.test(head)) { errors.push({ line: i + 1, code: 'headword' }); continue; }
    if (!str(gloss, 1, LIMITS.gloss) || CTRL.test(gloss)) { errors.push({ line: i + 1, code: 'gloss' }); continue; }
    items.push({ headword: head, gloss: gloss, line: i + 1 });
  }
  return { items: items, errors: errors };
}
