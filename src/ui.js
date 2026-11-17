/* GLOSAR · interfața. Folosește din ambalaj: I18N, DATA, LANGUAGES, CONCEPTS, tr(), fmt() și funcțiile din engine.mjs. */
var STORE_KEY = 'glosar.state';
var TABS = ['search', 'cover', 'add', 'export', 'guide'];
var UI_LANGS = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
var GROUP_POS = { numbers: 'numeral', family: 'noun', body: 'noun', nature: 'noun', basic: 'adjective' };
var PAGE = 30, MAX_REC_S = 8, MAX_FILE = 8000000, MAX_STORE_CHARS = 4000000, MAX_LINES_SHOWN = 20;
var S = null, ALL = [], LANGMAP = dict(), CONCMAP = dict(), CONCEPT_LIST = [], LANG_LIST = [], CTX = null, INDEX = [], TAKEN = dict();
var V = { tab: 'search', q: '', lang: 'all', minStatus: 'any', audioOnly: false, shown: PAGE, draft: null, bulk: null, check: null, confirm: '', focus: '', xscope: 'all', xlang: 'all', live: null, main: null, res: null, audioEl: null, rec: null };
var cur = { el: null, lang: 'en', L: null };
var booted = false, saveTimer = 0;

/* ---------- ajutoare DOM ---------- */
function h(tag, attrs, kids) {
  var e = document.createElement(tag), k;
  if (attrs) for (k in attrs) {
    var v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  if (kids) for (var i = 0; i < kids.length; i++) {
    var c = kids[i];
    if (c === null || c === undefined || c === false) continue;
    e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  return e;
}
function makeL(lang) {
  return {
    lang: lang,
    t: function (k) { return tr(lang, k); },
    f: function (k) { var a = [tr(lang, k)]; for (var i = 1; i < arguments.length; i++) a.push(arguments[i]); return fmt.apply(null, a); }
  };
}
function isHttps(u) { return typeof u === 'string' && /^https:\/\/[^\s]{1,500}$/.test(u); }
function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function downloadBlob(name, blob) {
  try {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    return true;
  } catch (e) { return false; }
}
function downloadText(name, text, mime) { return downloadBlob(name, new Blob([text], { type: mime + ';charset=utf-8' })); }
function readText(file, done) {
  var L = cur.L;
  if (!file) return;
  if (file.size > MAX_FILE) { flash(L.t('e_big')); return; }
  var fr = new FileReader();
  fr.onload = function () { done(String(fr.result)); };
  fr.onerror = function () { flash(L.t('e_read')); };
  fr.readAsText(file, 'utf-8');
}
function bytesToDataUri(u, kind) {
  var s = '', i, CH = 0x8000;
  for (i = 0; i < u.length; i += CH) s += String.fromCharCode.apply(null, u.subarray(i, i + CH));
  return 'data:audio/' + (kind === 'ogg' ? 'ogg' : 'webm') + ';base64,' + btoa(s);
}
function flash(msg, lines) {
  var box = V.live;
  if (!box) return;
  box.textContent = '';
  if (msg) box.appendChild(h('p', { text: msg }));
  if (lines && lines.length) box.appendChild(h('ul', { class: 'gl-lines' }, lines.map(function (x) { return h('li', { text: x }); })));
}
function field(label, control, id) { return h('div', { class: 'gl-f' }, [h('label', { for: id, text: label }), control]); }
function stripId(e) { var o = {}; Object.keys(e).forEach(function (k) { if (k !== 'id') o[k] = e[k]; }); return o; }

/* ---------- date de bază ---------- */
function buildBase() {
  var keys = typeof DATA === 'undefined' ? [] : Object.keys(DATA).sort();
  ALL = keys.map(function (k) { var e = Object.assign({}, DATA[k]); e.id = k; return e; });
  LANG_LIST = typeof LANGUAGES === 'undefined' || !LANGUAGES.languages ? [] : LANGUAGES.languages;
  LANGMAP = dict(); LANG_LIST.forEach(function (l) { LANGMAP[l.code] = l; });
  CONCEPT_LIST = typeof CONCEPTS === 'undefined' || !CONCEPTS.concepts ? [] : CONCEPTS.concepts;
  CONCMAP = dict(); CONCEPT_LIST.forEach(function (c) { CONCMAP[c.id] = c; });
  CTX = { languages: LANGMAP, concepts: CONCMAP };
}
function allEntries() { return ALL.concat(S.own); }
function reindex() {
  var all = allEntries();
  INDEX = buildIndex(all);
  TAKEN = dict();
  all.forEach(function (e) { TAKEN[e.id] = true; });
}
function langName(code) { var l = LANGMAP[code]; return l ? (l.name[cur.lang] || l.name.en || code) : code; }
function dialectName(code, id) {
  var l = LANGMAP[code], r = id;
  if (l) l.dialects.forEach(function (d) { if (d.id === id) r = d.name[cur.lang] || d.name.en || id; });
  return r;
}
function orthNote(code, id) {
  var l = LANGMAP[code], r = '';
  if (l) l.orthographies.forEach(function (o) { if (o.id === id) r = o.note[cur.lang] || o.note.en || ''; });
  return r;
}
function conceptLabel(c) { return cur.lang === 'ro' ? c.ro : c.en; }
function glossName(code) { return UI_LANGS.indexOf(code) >= 0 ? cur.L.t('l_' + code) : code; }
function glossOrder(g) {
  var order = [cur.lang, 'en', 'ro'].filter(function (x, i, a) { return a.indexOf(x) === i && g[x]; });
  Object.keys(g).sort().forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); });
  return order;
}

/* ---------- starea salvată ---------- */
function defaultLast() { return { lang: LANG_LIST.length ? LANG_LIST[0].code : 'rup', orthography: '', dialect: '', status: 'draft', reviewed_by: '', source: '', source_url: '', license: '' }; }
function cleanOwn(o) {
  if (!isObj(o) || typeof o.id !== 'string' || !/^[a-z]{2,3}-[a-z0-9]+(-[a-z0-9]+)*$/.test(o.id)) return null;
  var e = stripId(o);
  if (validateEntry(e, CTX).length) return null;
  var c = canonicalEntry(e);
  c.id = o.id;
  return c;
}
function loadState() {
  var s = { own: [], last: defaultLast() }, raw = null;
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { raw = null; }
  if (!isObj(raw)) return s;
  if (Array.isArray(raw.own)) raw.own.forEach(function (o) {
    var c = cleanOwn(o);
    if (c && s.own.length < LIMITS.own && !s.own.some(function (x) { return x.id === c.id; })) s.own.push(c);
  });
  if (isObj(raw.last)) {
    var l = raw.last;
    ['lang', 'orthography', 'dialect', 'status', 'reviewed_by', 'source', 'source_url', 'license'].forEach(function (k) { if (typeof l[k] === 'string' && l[k].length <= 500) s.last[k] = l[k]; });
  }
  return s;
}
function saveNow() {
  clearTimeout(saveTimer); saveTimer = 0;
  try {
    var text = JSON.stringify({ v: 1, own: S.own, last: S.last });
    if (text.length > MAX_STORE_CHARS) { flash(cur.L ? cur.L.t('e_quota') : ''); return false; }
    localStorage.setItem(STORE_KEY, text);
    return true;
  } catch (e) { flash(cur.L ? cur.L.t('e_quota') : ''); return false; }
}

/* ---------- ciorna din formular ---------- */
function newDraft() {
  var last = S.last, lang = LANGMAP[last.lang] ? last.lang : (LANG_LIST.length ? LANG_LIST[0].code : 'rup');
  return {
    lang: lang, headword: '', variants: '', pos: 'noun', gloss: dict(), concept: '', dialect: last.dialect, orthography: last.orthography,
    status: last.status, reviewed_by: last.reviewed_by, notes: '', examples: '', source: last.source, source_url: last.source_url, license: last.license, audio: '', more: false
  };
}
function draftOf() { return V.draft || (V.draft = newDraft()); }
function fixLang(d) {
  var l = LANGMAP[d.lang];
  if (!l) return;
  if (d.dialect && !l.dialects.some(function (x) { return x.id === d.dialect; })) d.dialect = '';
  if (d.orthography && !l.orthographies.some(function (x) { return x.id === d.orthography; })) d.orthography = '';
}
function draftEntry(d) {
  var e = { lang: d.lang, headword: d.headword.trim(), pos: d.pos, gloss: {}, source: d.source.trim() }, vs = [];
  d.variants.split(',').forEach(function (v) { v = v.trim(); if (v && vs.indexOf(v) < 0) vs.push(v); });
  if (vs.length) e.variants = vs;
  UI_LANGS.forEach(function (l) { var t = (d.gloss[l] || '').trim(); if (t) e.gloss[l] = t; });
  if (d.concept) e.concept = d.concept;
  if (d.dialect) e.dialect = d.dialect;
  if (d.orthography) e.orthography = d.orthography;
  e.status = d.status;
  if (d.status === 'reviewed' && d.reviewed_by.trim()) e.reviewed_by = d.reviewed_by.trim();
  if (d.notes.trim()) e.notes = d.notes.trim();
  var ex = d.examples.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);
  if (ex.length) e.examples = ex;
  if (d.source_url.trim()) e.source_url = d.source_url.trim();
  if (d.license.trim()) e.license = d.license.trim();
  if (d.audio) e.audio = d.audio;
  return e;
}
function issueKey(c) {
  return ['lang', 'headword', 'variants', 'pos', 'gloss', 'concept', 'dialect', 'orthography', 'reviewed_by', 'notes', 'examples', 'audio', 'audio_big', 'source', 'source_url', 'license'].indexOf(c) >= 0 ? 'issue_' + c : 'issue_other';
}
function remember(d) {
  S.last = { lang: d.lang, orthography: d.orthography, dialect: d.dialect, status: d.status, reviewed_by: d.reviewed_by, source: d.source.trim(), source_url: d.source_url.trim(), license: d.license.trim() };
}
function addOwn(e) {
  if (S.own.length >= LIMITS.own) { flash(cur.L.f('m_full', LIMITS.own)); return null; }
  var o = canonicalEntry(e);
  o.id = uniqueId(o.lang, o.headword, TAKEN);
  S.own.push(o);
  if (!saveNow()) { S.own.pop(); return null; }
  TAKEN[o.id] = true;
  return o;
}

/* ---------- sunet ---------- */
function playUri(uri) {
  try {
    if (V.audioEl) V.audioEl.pause();
    var a = new Audio(uri), p;
    V.audioEl = a;
    p = a.play();
    if (p && p.catch) p.catch(function () { /* redarea poate fi blocată de browser */ });
  } catch (e) { /* fără sunet */ }
}
function recMime() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return '';
  var c = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus'];
  for (var i = 0; i < c.length; i++) if (MediaRecorder.isTypeSupported(c[i])) return c[i];
  return '';
}
function useBytes(u, size) {
  var L = cur.L, d = draftOf(), kind;
  if (size > LIMITS.audio) { flash(L.f('a_rec_big', Math.ceil(size / 1024))); return; }
  kind = audioKind(u);
  if (!kind) { flash(L.t('a_rec_bad')); return; }
  d.audio = bytesToDataUri(u, kind);
  V.focus = 'gl-play-draft';
  render();
  flash(L.f('a_rec_ok', Math.max(1, Math.round(size / 1024))));
}
function useBlob(blob) {
  var fr = new FileReader();
  fr.onload = function () { useBytes(new Uint8Array(fr.result), blob.size); };
  fr.onerror = function () { flash(cur.L.t('e_read')); };
  fr.readAsArrayBuffer(blob);
}
function stopTracks(stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* deja oprit */ } }
function stopRec() {
  var r = V.rec;
  if (!r) return;
  clearTimeout(r.timer);
  try { if (r.rec.state !== 'inactive') r.rec.stop(); else stopTracks(r.stream); } catch (e) { stopTracks(r.stream); }
}
function cancelRec() {
  var r = V.rec;
  if (!r) return;
  r.cancelled = true;
  stopRec();
  V.rec = null;
}
function startRec() {
  var L = cur.L, mime = recMime();
  if (!mime) { flash(L.t('a_rec_none')); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    var chunks = [], rec, r;
    try { rec = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 24000 }); } catch (e) { stopTracks(stream); flash(L.t('a_rec_none')); return; }
    r = { rec: rec, stream: stream, timer: 0, cancelled: false };
    V.rec = r;
    rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
    rec.onstop = function () {
      stopTracks(stream);
      clearTimeout(r.timer);
      if (V.rec === r) V.rec = null;
      if (r.cancelled) return;
      useBlob(new Blob(chunks, { type: mime.split(';')[0] }));
    };
    rec.start();
    r.timer = setTimeout(stopRec, MAX_REC_S * 1000);
    V.focus = 'gl-stop';
    render();
    flash(L.f('a_rec_busy', MAX_REC_S));
  }, function () { flash(L.t('a_rec_denied')); });
}

/* ---------- Căutare ---------- */
function entryCard(e, L) {
  var li = h('li', { class: 'gl-entry', id: 'gl-e-' + e.id }), head = h('div', { class: 'gl-head' }, [h('span', { class: 'gl-word', text: e.headword })]);
  if (e.variants && e.variants.length) head.appendChild(h('span', { class: 'gl-var', text: ' (' + L.t('r_also') + ': ' + e.variants.join(', ') + ')' }));
  li.appendChild(head);
  var meta = [h('span', { text: langName(e.lang) }), h('span', { text: L.t('pos_' + e.pos) })];
  if (e.dialect) meta.push(h('span', { text: dialectName(e.lang, e.dialect) }));
  if (e.orthography) meta.push(h('span', { title: orthNote(e.lang, e.orthography), text: e.orthography }));
  var st = e.status || 'draft';
  meta.push(h('span', { class: 'gl-badge gl-st-' + st, text: L.t('st_' + st) + (st === 'reviewed' && e.reviewed_by ? ' · ' + L.f('r_rev', e.reviewed_by) : '') }));
  if (!ALL.some(function (x) { return x.id === e.id; })) meta.push(h('span', { class: 'gl-badge gl-yours', text: L.t('r_yours') }));
  li.appendChild(h('div', { class: 'gl-meta' }, meta.reduce(function (acc, m, i) { if (i) acc.push(' · '); acc.push(m); return acc; }, [])));
  li.appendChild(h('div', { class: 'gl-gloss' }, glossOrder(e.gloss).reduce(function (acc, k) {
    if (acc.length) acc.push(' · ');
    acc.push(h('span', { class: 'gl-g' }, [h('b', { text: glossName(k) + ': ' }), e.gloss[k]]));
    return acc;
  }, [])));
  if (e.notes) li.appendChild(h('p', { class: 'gl-notes', text: e.notes }));
  if (e.examples && e.examples.length) {
    li.appendChild(h('div', { class: 'gl-exh', text: L.t('r_ex') }));
    li.appendChild(h('ul', { class: 'gl-ex' }, e.examples.map(function (x) { return h('li', { text: x }); })));
  }
  var src = h('p', { class: 'gl-src' }, [L.t('r_src') + ': ' + e.source]);
  if (isHttps(e.source_url)) src.appendChild(h('span', null, [' (', h('a', { href: e.source_url, target: '_blank', rel: 'noopener noreferrer', text: e.source_url.replace(/^https:\/\//, '').split('/')[0] }), ')']));
  if (e.license) src.appendChild(document.createTextNode(' · ' + L.t('r_lic') + ': ' + e.license));
  li.appendChild(src);
  if (e.audio && audioBytes(e.audio) >= 0) li.appendChild(h('button', { type: 'button', class: 'btn gl-play', 'aria-label': L.f('r_play_l', e.headword), text: '▶ ' + L.t('r_play'), onclick: function () { playUri(e.audio); } }));
  return li;
}
function renderResults() {
  var box = V.res, L = cur.L;
  if (!box) return;
  box.textContent = '';
  var hits = search(INDEX, V.q, { lang: V.lang, minStatus: V.minStatus, audio: V.audioOnly }), shown = Math.min(hits.length, V.shown);
  box.appendChild(h('p', { class: 'gl-count', id: 'gl-count', role: 'status', text: hits.length ? L.f('s_count', hits.length, shown) : L.t('s_none') }));
  if (!hits.length) return;
  var ul = h('ul', { class: 'gl-list', id: 'gl-list' });
  hits.slice(0, shown).forEach(function (x) { ul.appendChild(entryCard(x.e, L)); });
  box.appendChild(ul);
  if (hits.length > shown) box.appendChild(h('button', { type: 'button', class: 'btn', id: 'gl-more', text: L.t('s_more'), onclick: function () {
    var first = hits[shown].e.id;
    V.shown += PAGE; renderResults(); V.focus = 'gl-e-' + first; refocus();
  } }));
}
function refocus() {
  if (!V.focus) return;
  var f = document.getElementById(V.focus);
  if (f) { if (!/^(button|input|select|textarea|a)$/i.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus(); }
  V.focus = '';
}
function panelSearch(L) {
  var box = h('div', { class: 'gl-box' });
  var q = h('input', { type: 'text', id: 'gl-q', class: 'gl-inp', autocomplete: 'off', spellcheck: 'false', maxlength: '80', value: V.q });
  q.addEventListener('input', function () { V.q = q.value; V.shown = PAGE; renderResults(); });
  var lang = h('select', { id: 'gl-flang', class: 'sel gl-inp', onchange: function () { V.lang = lang.value; V.shown = PAGE; renderResults(); } }, [h('option', { value: 'all', text: L.t('s_all') })]);
  LANG_LIST.forEach(function (l) { lang.appendChild(h('option', { value: l.code, text: langName(l.code) })); });
  lang.value = V.lang;
  var st = h('select', { id: 'gl-fstatus', class: 'sel gl-inp', onchange: function () { V.minStatus = st.value; V.shown = PAGE; renderResults(); } }, [
    h('option', { value: 'any', text: L.t('s_st_any') }), h('option', { value: 'sourced', text: L.t('s_st_sourced') }), h('option', { value: 'reviewed', text: L.t('s_st_reviewed') })
  ]);
  st.value = V.minStatus;
  var au = h('input', { type: 'checkbox', id: 'gl-faudio', checked: V.audioOnly });
  au.addEventListener('change', function () { V.audioOnly = au.checked; V.shown = PAGE; renderResults(); });
  box.appendChild(h('div', { class: 'gl-bar' }, [field(L.t('s_q_l'), q, 'gl-q'), field(L.t('s_lang_l'), lang, 'gl-flang'), field(L.t('s_status_l'), st, 'gl-fstatus')]));
  box.appendChild(h('label', { class: 'gl-check', for: 'gl-faudio' }, [au, ' ', L.t('s_audio_l')]));
  V.res = h('div', { class: 'gl-res', id: 'gl-results' });
  box.appendChild(V.res);
  renderResults();
  return box;
}

/* ---------- Acoperire ---------- */
function startAdd(code, cid) {
  var d = V.draft = newDraft(), c = CONCMAP[cid];
  d.lang = code; fixLang(d);
  d.concept = cid;
  d.pos = GROUP_POS[c.group] || 'noun';
  d.gloss.en = c.en; d.gloss.ro = c.ro;
  V.tab = 'add'; V.focus = 'gl-head'; render();
}
function panelCover(L) {
  var box = h('div', { class: 'gl-box' });
  box.appendChild(h('h3', { text: L.t('c_title') }));
  box.appendChild(h('p', { class: 'note gl-intro', text: L.t('c_intro') }));
  var codes = LANG_LIST.map(function (l) { return l.code; }), cov = coverage(CONCEPT_LIST, allEntries(), codes);
  box.appendChild(h('ul', { class: 'gl-have' }, codes.map(function (c) { return h('li', { text: L.f('c_have', langName(c), cov.have[c], cov.total) }); })));
  var wrap = h('div', { class: 'tblw gl-tblw', role: 'region', 'aria-label': L.t('c_cap'), tabindex: '0' });
  var groups = [];
  cov.rows.forEach(function (r) { if (groups.indexOf(r.concept.group) < 0) groups.push(r.concept.group); });
  groups.forEach(function (g) {
    var t = h('table', { class: 'tbl gl-table' }, [h('caption', { class: 'gl-capt', text: L.t('g_' + g) })]);
    t.appendChild(h('thead', null, [h('tr', null, [h('th', { scope: 'col', text: L.t('c_col') })].concat(codes.map(function (c) { return h('th', { scope: 'col', text: langName(c) }); })))]));
    var tb = h('tbody');
    cov.rows.filter(function (r) { return r.concept.group === g; }).forEach(function (r) {
      var tr1 = h('tr', null, [h('th', { scope: 'row', text: conceptLabel(r.concept) })]);
      codes.forEach(function (c) {
        var e = r.cells[c];
        tr1.appendChild(e
          ? h('td', { class: 'gl-have-cell', text: e.headword })
          : h('td', null, [h('span', { class: 'gl-off', text: L.t('c_missing') + ' ' }), h('button', {
            type: 'button', class: 'btn gl-addbtn', id: 'gl-add-' + c + '-' + r.concept.id, 'aria-label': L.f('c_add_l', conceptLabel(r.concept), langName(c)),
            onclick: function () { startAdd(c, r.concept.id); }
          }, [L.t('c_add')])]));
      });
      tb.appendChild(tr1);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
  });
  box.appendChild(wrap);
  return box;
}

/* ---------- Adăugare ---------- */
function textInput(id, d, key, max) {
  var i = h('input', { type: 'text', id: id, class: 'gl-inp', maxlength: String(max || 300), autocomplete: 'off' });
  i.value = d[key];
  i.addEventListener('input', function () { d[key] = i.value; });
  return i;
}
function areaInput(id, d, key, rows) {
  var a = h('textarea', { id: id, class: 'gl-inp', rows: String(rows || 3) });
  a.value = d[key];
  a.addEventListener('input', function () { d[key] = a.value; });
  return a;
}
function selectInput(id, d, key, options, onchange) {
  var s = h('select', { id: id, class: 'sel gl-inp' }, options.map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
  s.value = d[key];
  s.addEventListener('change', function () { d[key] = s.value; if (onchange) onchange(); });
  return s;
}
function showCheck(out, e, L) {
  out.textContent = '';
  var codes = validateEntry(e, CTX), dups = findDuplicates(allEntries(), e), blocked = codes.length > 0 || dups.some(function (x) { return x.same; });
  if (!codes.length && !dups.length) out.appendChild(h('p', { class: 'gl-ok', text: L.t('a_ok') }));
  if (codes.length) {
    out.appendChild(h('p', { text: L.t('a_issues') }));
    out.appendChild(h('ul', { class: 'gl-lines' }, codes.map(function (c) { return h('li', { class: 'gl-bad', text: L.t(issueKey(c)) }); })));
  }
  if (dups.length) {
    out.appendChild(h('p', { text: L.t('a_dups') }));
    out.appendChild(h('ul', { class: 'gl-lines' }, dups.map(function (x) {
      return h('li', { class: x.same ? 'gl-bad' : 'gl-warn', text: x.e.id + ' (' + x.e.headword + '): ' + L.t(x.same ? 'a_dup_same' : 'a_dup_other') });
    })));
  }
  return !blocked;
}
function audioBlock(d, L) {
  var box = h('div', { class: 'gl-audio' }), bar = h('div', { class: 'gl-bar' });
  box.appendChild(h('h4', { text: L.t('a_audio_h') }));
  if (recMime()) {
    if (V.rec) bar.appendChild(h('button', { type: 'button', class: 'btn pri', id: 'gl-stop', text: L.t('a_stop'), onclick: function () { stopRec(); } }));
    else bar.appendChild(h('button', { type: 'button', class: 'btn', id: 'gl-rec', text: L.t('a_rec'), onclick: startRec }));
  } else box.appendChild(h('p', { class: 'note', id: 'gl-recnone', text: L.t('a_rec_none') }));
  var file = h('input', { type: 'file', id: 'gl-upload', class: 'gl-file', accept: '.opus,.ogg,.webm,audio/ogg,audio/webm' });
  file.addEventListener('change', function () {
    var f = file.files && file.files[0];
    file.value = '';
    if (!f) return;
    if (f.size > LIMITS.audio) { flash(L.f('a_rec_big', Math.ceil(f.size / 1024))); return; }
    var fr = new FileReader();
    fr.onload = function () { useBytes(new Uint8Array(fr.result), f.size); };
    fr.onerror = function () { flash(L.t('e_read')); };
    fr.readAsArrayBuffer(f);
  });
  bar.appendChild(file);
  bar.appendChild(h('label', { class: 'btn gl-filelab', for: 'gl-upload', text: L.t('a_upload_l') }));
  box.appendChild(bar);
  if (d.audio) {
    var u = dataUriBytes(d.audio);
    box.appendChild(h('div', { class: 'gl-bar' }, [
      h('button', { type: 'button', class: 'btn', id: 'gl-play-draft', text: '▶ ' + L.t('r_play') + ' (' + Math.max(1, Math.round((u ? u.length : 0) / 1024)) + ' KB)', onclick: function () { playUri(d.audio); } }),
      h('button', { type: 'button', class: 'btn', id: 'gl-rec-clear', text: L.t('a_rec_clear'), onclick: function () { d.audio = ''; V.focus = 'gl-rec'; render(); } })
    ]));
  }
  return box;
}
function baseOf(d) {
  var e = draftEntry(d);
  return { lang: e.lang, orthography: e.orthography, dialect: e.dialect, status: e.status, reviewed_by: e.reviewed_by, source: e.source, source_url: e.source_url, license: e.license, pos: e.pos };
}
function panelBulk(L, d) {
  var b = V.bulk || (V.bulk = { text: '', gl: cur.lang, ready: null }), box = h('div', { class: 'gl-box gl-bulk' });
  box.appendChild(h('h3', { text: L.t('b_title') }));
  box.appendChild(h('p', { class: 'note', text: L.t('b_help') }));
  var gl = h('select', { id: 'gl-bgl', class: 'sel gl-inp', onchange: function () { b.gl = gl.value; b.ready = null; } }, UI_LANGS.map(function (l) { return h('option', { value: l, text: L.t('l_' + l) }); }));
  gl.value = b.gl;
  var ta = h('textarea', { id: 'gl-btext', class: 'gl-inp', rows: '6', spellcheck: 'false' });
  ta.value = b.text;
  ta.addEventListener('input', function () { b.text = ta.value; b.ready = null; var go = document.getElementById('gl-bgo'); if (go) go.hidden = true; });
  box.appendChild(h('div', { class: 'gl-bar' }, [field(L.t('b_gl_l'), gl, 'gl-bgl')]));
  box.appendChild(field(L.t('b_text_l'), ta, 'gl-btext'));
  var out = h('div', { class: 'gl-check-out', id: 'gl-bout', role: 'status' });
  var go = h('button', { type: 'button', class: 'btn pri', id: 'gl-bgo', hidden: !b.ready, text: b.ready ? L.f('b_go', b.ready.length) : '' });
  function entriesFrom(items) {
    var base = baseOf(d);
    return items.map(function (it) {
      var e = { lang: base.lang, headword: it.headword, pos: base.pos, gloss: {}, source: base.source, status: base.status };
      e.gloss[b.gl] = it.gloss;
      ['orthography', 'dialect', 'reviewed_by', 'source_url', 'license'].forEach(function (k) { if (base[k]) e[k] = base[k]; });
      return e;
    });
  }
  function check() {
    fixLang(d);
    out.textContent = '';
    var p = parsePaste(b.text), lines = [], good = [], taken = allEntries().slice(), bad = p.errors.length;
    p.errors.forEach(function (x) { lines.push(L.f('b_line', x.line, L.t('b_e_' + x.code))); });
    var made = entriesFrom(p.items), codes = made.length ? validateEntry(made[0], CTX) : [];
    if (codes.length) {
      out.appendChild(h('p', { text: L.t('a_issues') }));
      out.appendChild(h('ul', { class: 'gl-lines' }, codes.map(function (c) { return h('li', { class: 'gl-bad', text: L.t(issueKey(c)) }); })));
      b.ready = null; go.hidden = true;
      return;
    }
    made.forEach(function (e, i) {
      var dup = findDuplicates(taken, e).some(function (x) { return x.same; });
      if (dup) { bad++; lines.push(L.f('b_line', p.items[i].line, e.headword + ': ' + L.t('b_e_dup'))); } else { good.push(e); taken.push(e); }
    });
    b.ready = good.length ? good : null;
    out.appendChild(h('p', { class: bad ? 'gl-warn' : 'gl-ok', text: L.f('b_sum', good.length, bad) }));
    if (lines.length) out.appendChild(h('ul', { class: 'gl-lines' }, lines.slice(0, MAX_LINES_SHOWN).map(function (x) { return h('li', { text: x }); })));
    go.hidden = !good.length;
    go.textContent = good.length ? L.f('b_go', good.length) : '';
  }
  go.addEventListener('click', function () {
    if (!b.ready) return;
    var added = 0, skipped = 0;
    b.ready.forEach(function (e) {
      if (findDuplicates(allEntries(), e).some(function (x) { return x.same; }) || !addOwn(e)) skipped++; else added++;
    });
    remember(d); saveNow(); reindex();
    b.ready = null; b.text = '';
    V.focus = 'gl-btext'; render();
    flash(L.f('b_added', added, skipped));
  });
  box.appendChild(h('div', { class: 'gl-bar' }, [h('button', { type: 'button', class: 'btn', id: 'gl-bcheck', text: L.t('b_check'), onclick: check }), go]));
  box.appendChild(out);
  return box;
}
function ownList(L) {
  var box = h('div', { class: 'gl-box gl-own' });
  box.appendChild(h('h3', { id: 'gl-own-h', text: L.f('m_title', S.own.length) }));
  if (!S.own.length) box.appendChild(h('p', { class: 'gl-empty', text: L.t('m_none') }));
  else {
    var ul = h('ul', { class: 'gl-custom', id: 'gl-own' });
    S.own.forEach(function (o, i) {
      var g = glossOrder(o.gloss)[0], row = h('li', null, [
        h('span', { class: 'gl-cid', text: o.id }), ' ', h('span', { class: 'gl-cmeta', text: o.headword + ' — ' + o.gloss[g] }), ' ',
        h('button', { type: 'button', class: 'btn', id: 'gl-od-' + i, text: L.t('m_dl1'), onclick: function () { downloadText(o.id + '.json', entryToJson(stripId(o), o.id), 'application/json'); flash(L.f('x_done', o.id + '.json')); } }), ' '
      ]);
      if (o.audio && audioBytes(o.audio) >= 0) {
        row.appendChild(h('button', { type: 'button', class: 'btn', id: 'gl-oa-' + i, text: L.t('m_dla'), onclick: function () {
          var name = o.id + '.' + audioExt(o.audio);
          downloadBlob(name, new Blob([dataUriBytes(o.audio)], { type: o.audio.slice(5, o.audio.indexOf(';')) }));
          flash(L.f('x_done', name));
        } }));
        row.appendChild(document.createTextNode(' '));
      }
      row.appendChild(h('button', { type: 'button', class: 'btn', id: 'gl-or-' + i, text: L.t('m_rm'), onclick: function () {
        S.own.splice(i, 1); saveNow(); reindex(); V.focus = 'gl-own-h'; render(); flash(L.f('m_removed', o.id));
      } }));
      ul.appendChild(row);
    });
    box.appendChild(ul);
  }
  var file = h('input', { type: 'file', id: 'gl-import', class: 'gl-file', accept: '.json,application/json' });
  file.addEventListener('change', function () {
    var f = file.files && file.files[0];
    file.value = '';
    readText(f, function (text) {
      var r = parseBundle(text, CTX);
      if (r.errors.length && r.errors[0].index === 0) { flash(L.t(r.errors[0].codes[0] === 'many' ? 'e_many' : 'e_format')); return; }
      var added = 0, skipped = r.errors.length, lines = r.errors.map(function (x) { return L.f('m_bad', x.index, x.codes.map(function (c) { return L.t(issueKey(c)); }).join(' ')); });
      r.entries.forEach(function (e) {
        if (findDuplicates(allEntries(), e).some(function (x) { return x.same; }) || !addOwn(e)) skipped++; else added++;
      });
      reindex(); V.focus = 'gl-own-h'; render();
      flash(L.f('m_imported', added, skipped), lines.slice(0, MAX_LINES_SHOWN));
    });
  });
  box.appendChild(h('div', { class: 'gl-bar' }, [
    h('button', { type: 'button', class: 'btn pri', id: 'gl-dlall', disabled: !S.own.length, text: L.t('m_dlall'), onclick: function () {
      if (!S.own.length) return;
      downloadText('glosar-contribution.json', makeBundle(S.own, nowIso()), 'application/json');
      flash(L.f('x_done', 'glosar-contribution.json'));
    } }),
    file, h('label', { class: 'btn gl-filelab', for: 'gl-import', text: L.t('m_import') }),
    h('button', { type: 'button', class: 'btn', id: 'gl-clear', disabled: !S.own.length, text: V.confirm === 'clear' ? L.t('m_clear2') : L.t('m_clear'), onclick: function () {
      if (V.confirm !== 'clear') { V.confirm = 'clear'; V.focus = 'gl-clear'; render(); return; }
      S.own = []; V.confirm = ''; saveNow(); reindex(); V.focus = 'gl-own-h'; render(); flash(L.t('m_cleared'));
    } })
  ]));
  return box;
}
function panelAdd(L) {
  var box = h('div', { class: 'gl-box' }), d = draftOf();
  fixLang(d);
  box.appendChild(h('h3', { text: L.t('a_title') }));
  box.appendChild(h('p', { class: 'note', text: L.t('a_priv') }));
  var lang = LANGMAP[d.lang], none = [['', L.t('a_none')]];
  var langSel = selectInput('gl-lang', d, 'lang', LANG_LIST.map(function (l) { return [l.code, langName(l.code)]; }), function () { fixLang(d); V.focus = 'gl-lang'; render(); });
  var posSel = selectInput('gl-pos', d, 'pos', POS.map(function (p) { return [p, L.t('pos_' + p)]; }));
  box.appendChild(h('div', { class: 'gl-bar' }, [field(L.t('a_lang_l'), langSel, 'gl-lang'), field(L.t('a_pos_l'), posSel, 'gl-pos')]));
  box.appendChild(field(L.t('a_head_l'), textInput('gl-head', d, 'headword', LIMITS.headword), 'gl-head'));
  box.appendChild(field(L.t('a_var_l'), textInput('gl-var', d, 'variants', 400), 'gl-var'));
  box.appendChild(h('p', { class: 'note', text: L.t('a_gloss_h') }));
  ['en', 'ro'].forEach(function (l) {
    var gi = h('input', { type: 'text', id: 'gl-g-' + l, class: 'gl-inp', maxlength: String(LIMITS.gloss), autocomplete: 'off' });
    gi.value = d.gloss[l] || '';
    gi.addEventListener('input', function () { d.gloss[l] = gi.value; });
    box.appendChild(field(L.f('a_gloss_l', L.t('l_' + l)), gi, 'gl-g-' + l));
  });
  var more = h('details', { class: 'gl-more', id: 'gl-more-g', open: d.more }, [h('summary', { text: L.t('a_more') })]);
  more.addEventListener('toggle', function () { d.more = more.open; });
  UI_LANGS.filter(function (l) { return l !== 'en' && l !== 'ro'; }).forEach(function (l) {
    var gi = h('input', { type: 'text', id: 'gl-g-' + l, class: 'gl-inp', maxlength: String(LIMITS.gloss), autocomplete: 'off' });
    gi.value = d.gloss[l] || '';
    gi.addEventListener('input', function () { d.gloss[l] = gi.value; });
    more.appendChild(field(L.f('a_gloss_l', L.t('l_' + l)), gi, 'gl-g-' + l));
  });
  box.appendChild(more);
  var concepts = [['', L.t('a_none')]].concat(CONCEPT_LIST.map(function (c) { return [c.id, conceptLabel(c)]; }));
  var conSel = selectInput('gl-concept', d, 'concept', concepts, function () {
    var c = CONCMAP[d.concept];
    if (c) { if (!(d.gloss.en || '').trim()) d.gloss.en = c.en; if (!(d.gloss.ro || '').trim()) d.gloss.ro = c.ro; V.focus = 'gl-concept'; render(); }
  });
  var dia = selectInput('gl-dialect', d, 'dialect', none.concat(lang ? lang.dialects.map(function (x) { return [x.id, x.name[cur.lang] || x.name.en || x.id]; }) : []));
  var ort = selectInput('gl-orth', d, 'orthography', none.concat(lang ? lang.orthographies.map(function (x) { return [x.id, x.id]; }) : []));
  box.appendChild(h('div', { class: 'gl-bar' }, [field(L.t('a_concept_l'), conSel, 'gl-concept'), field(L.t('a_dialect_l'), dia, 'gl-dialect'), field(L.t('a_orth_l'), ort, 'gl-orth')]));
  var stSel = selectInput('gl-status', d, 'status', STATUSES.map(function (s) { return [s, L.t('st_' + s)]; }), function () { V.focus = 'gl-status'; render(); });
  var bar = [field(L.t('s_status_l'), stSel, 'gl-status')];
  if (d.status === 'reviewed') bar.push(field(L.t('a_rev_l'), textInput('gl-rev', d, 'reviewed_by', 80), 'gl-rev'));
  box.appendChild(h('div', { class: 'gl-bar' }, bar));
  box.appendChild(field(L.t('a_src_l'), textInput('gl-src', d, 'source', LIMITS.source), 'gl-src'));
  box.appendChild(field(L.t('a_url_l'), textInput('gl-url', d, 'source_url', 500), 'gl-url'));
  box.appendChild(field(L.t('a_notes_l'), areaInput('gl-notes', d, 'notes', 2), 'gl-notes'));
  box.appendChild(field(L.t('a_ex_l'), areaInput('gl-ex', d, 'examples', 2), 'gl-ex'));
  box.appendChild(field(L.t('a_lic_l'), textInput('gl-lic', d, 'license', 80), 'gl-lic'));
  box.appendChild(audioBlock(d, L));
  var out = h('div', { class: 'gl-check-out', id: 'gl-out', role: 'status' });
  box.appendChild(h('div', { class: 'gl-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'gl-check', text: L.t('a_check'), onclick: function () { showCheck(out, draftEntry(d), L); } }),
    h('button', { type: 'button', class: 'btn pri', id: 'gl-add', text: L.t('a_add'), onclick: function () {
      var e = draftEntry(d);
      if (!showCheck(out, e, L)) return;
      var o = addOwn(e);
      if (!o) return;
      remember(d); saveNow(); reindex();
      var keep = V.draft;
      V.draft = newDraft();
      V.draft.lang = keep.lang; V.draft.pos = keep.pos; V.draft.more = keep.more;
      V.focus = 'gl-head'; render();
      flash(L.f('a_added', o.id));
    } })
  ]));
  box.appendChild(out);
  box.appendChild(panelBulk(L, d));
  box.appendChild(ownList(L));
  return box;
}

/* ---------- Export ---------- */
function exportSet() {
  var list = V.xscope === 'dict' ? ALL : V.xscope === 'mine' ? S.own : allEntries();
  return list.filter(function (e) { return V.xlang === 'all' || e.lang === V.xlang; });
}
function panelExport(L) {
  var box = h('div', { class: 'gl-box' });
  box.appendChild(h('h3', { text: L.t('x_title') }));
  box.appendChild(h('p', { class: 'note', text: L.t('x_intro') }));
  var scope = h('select', { id: 'gl-xscope', class: 'sel gl-inp', onchange: function () { V.xscope = scope.value; V.focus = 'gl-xscope'; render(); } }, [
    h('option', { value: 'all', text: L.t('x_all') }), h('option', { value: 'dict', text: L.t('x_dict') }), h('option', { value: 'mine', text: L.t('x_mine') })
  ]);
  scope.value = V.xscope;
  var lang = h('select', { id: 'gl-xlang', class: 'sel gl-inp', onchange: function () { V.xlang = lang.value; V.focus = 'gl-xlang'; render(); } }, [h('option', { value: 'all', text: L.t('s_all') })]);
  LANG_LIST.forEach(function (l) { lang.appendChild(h('option', { value: l.code, text: langName(l.code) })); });
  lang.value = V.xlang;
  box.appendChild(h('div', { class: 'gl-bar' }, [field(L.t('x_scope_l'), scope, 'gl-xscope'), field(L.t('s_lang_l'), lang, 'gl-xlang')]));
  var set = exportSet();
  box.appendChild(h('p', { class: 'gl-count', id: 'gl-xcount', text: set.length ? L.f('x_count', set.length) : L.t('x_none') }));
  var stem = 'glosar-' + (V.xlang === 'all' ? 'all' : V.xlang);
  box.appendChild(h('div', { class: 'gl-bar' }, [
    h('button', { type: 'button', class: 'btn pri', id: 'gl-xtsv', disabled: !set.length, text: L.t('x_tsv'), onclick: function () {
      /* semnul de ordine a octeților ajută Excel să recunoască UTF-8 */
      downloadText(stem + '.tsv', '﻿' + toTSV(exportSet()), 'text/tab-separated-values'); flash(L.f('x_done', stem + '.tsv'));
    } }),
    h('button', { type: 'button', class: 'btn pri', id: 'gl-xanki', disabled: !set.length, text: L.t('x_anki'), onclick: function () {
      var lab = { pos: dict(), lang: dict() };
      POS.forEach(function (p) { lab.pos[p] = L.t('pos_' + p); });
      UI_LANGS.forEach(function (l) { lab.lang[l] = L.t('l_' + l); });
      downloadText(stem + '-anki.txt', toAnki(exportSet(), lab, [cur.lang, 'en', 'ro']), 'text/plain'); flash(L.f('x_done', stem + '-anki.txt'));
    } })
  ]));
  return box;
}

/* ---------- Ghid ---------- */
function panelGuide(L) {
  var box = h('div', { class: 'gl-box' });
  box.appendChild(h('h3', { text: L.t('gd_title') }));
  box.appendChild(h('ol', { class: 'gl-steps' }, [1, 2, 3, 4, 5, 6].map(function (i) { return h('li', { text: L.t('gd_' + i) }); })));
  box.appendChild(h('h3', { text: L.t('gd_st_h') }));
  box.appendChild(h('ul', { class: 'gl-lines' }, STATUSES.map(function (s) { return h('li', { text: L.t('gd_st_' + s) }); })));
  box.appendChild(h('h3', { text: L.t('gd_rec_h') }));
  box.appendChild(h('ul', { class: 'gl-lines' }, [h('li', { text: L.t('gd_rec_1') }), h('li', { text: L.f('gd_rec_2', MAX_REC_S) }), h('li', { text: L.t('gd_rec_3') })]));
  box.appendChild(h('h3', { text: L.t('gd_lic_h') }));
  box.appendChild(h('p', { class: 'gl-intro', text: L.t('gd_lic') }));
  return box;
}

/* ---------- file și desenare ---------- */
var PANELS = { search: panelSearch, cover: panelCover, add: panelAdd, export: panelExport, guide: panelGuide };
function gotoTab(id, focusId) {
  if (id !== 'add') cancelRec();
  V.tab = id; V.focus = focusId || ''; render();
}
function tabsBar() {
  var L = cur.L, bar = h('div', { class: 'gl-tabs', role: 'tablist', 'aria-label': L.t('title') });
  TABS.forEach(function (id, i) {
    var on = id === V.tab;
    bar.appendChild(h('button', {
      type: 'button', class: 'btn gl-tab' + (on ? ' pri' : ''), role: 'tab', id: 'gl-t-' + id, 'aria-selected': on ? 'true' : 'false', 'aria-controls': 'gl-p-' + id, tabindex: on ? '0' : '-1', text: L.t('tab_' + id),
      onclick: function () { gotoTab(id, 'gl-t-' + id); },
      onkeydown: function (ev) {
        var j = null;
        if (ev.key === 'ArrowRight') j = i + 1; else if (ev.key === 'ArrowLeft') j = i - 1; else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = TABS.length - 1;
        if (j === null) return;
        ev.preventDefault();
        j = (j + TABS.length) % TABS.length;
        gotoTab(TABS[j], 'gl-t-' + TABS[j]);
      }
    }));
  });
  return bar;
}
function render() {
  var main = V.main, L = cur.L;
  if (!main) return;
  main.textContent = '';
  var root = h('div', { class: 'gl-root' });
  root.appendChild(tabsBar());
  TABS.forEach(function (id) {
    var p = h('div', { class: 'gl-panel', role: 'tabpanel', id: 'gl-p-' + id, 'aria-labelledby': 'gl-t-' + id, hidden: id !== V.tab });
    if (id === V.tab) p.appendChild(PANELS[id](L));
    root.appendChild(p);
  });
  main.appendChild(root);
  refocus();
}

/* ---------- montare ---------- */
function boot() {
  if (booted) return;
  booted = true;
  buildBase();
  S = loadState();
  reindex();
  window.addEventListener('pagehide', function () { cancelRec(); });
}
function mount(el, lang) {
  cur.el = el; cur.lang = lang; cur.L = makeL(lang);
  boot();
  var L = cur.L, card = el.parentNode;
  if (card && card.classList) card.classList.add('in');
  cancelRec();
  el.textContent = '';
  V.live = h('div', { class: 'gl-msg', id: 'gl-live', role: 'status', 'aria-live': 'polite' });
  V.main = h('div', { class: 'gl-main' });
  el.appendChild(h('p', { class: 'gl-intro', text: L.t('intro') }));
  el.appendChild(V.live);
  el.appendChild(V.main);
  var lim = h('section', { class: 'card rv in gl-card', id: 'gl-lim-card' }, [h('h2', { id: 'gl-lim-h', text: L.t('h_limits') }), h('ul', { class: 'gl-list-lim' }, [1, 2, 3, 4, 5, 6].map(function (i) { return h('li', { text: L.t('lim_' + i) }); }))]);
  if (card && card.insertAdjacentElement) card.insertAdjacentElement('afterend', lim);
  render();
}
