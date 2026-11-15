/* ---------- Online-Extras: Tatoeba & LanguageTool ---------- */
const TAT_LANG = { sv:'swe', es:'spa' };
const TAT_Q = {
  sv:{
    bisats:['eftersom', '"att han inte"', '"att jag inte"', '"om du inte"', '"att hon inte"', '"som jag aldrig"', '"att det inte"'],
    inversion:['^idag', '^igår', '^tyvärr', '^nu', '^ibland', '^kanske', '^sedan'],
    tempus:['"har aldrig"', '^igår', '"förra veckan"', '"förra året"', '"i somras"', '"har du någonsin"'],
    partikel:['"tycker om"', '"komma ihåg"', '"kommer ihåg"', '"ta med"', '"håller med"', '"ge upp"', '"hälsa på"'],
    sin:['sin', 'sitt', 'sina'],
    tid:['sedan', '"om en vecka"', '"i två"', '"på morgonen"', '"på helgen"', '"i måndags"'],
    framtid:['"kommer att"', '"behöver inte"', '"får inte"', 'borde', '"skulle vilja"'],
    passiv:['"det finns"', '"finns det"', '"man kan"', '"man måste"'],
    falska:['stanna', 'roligt', 'semester', 'fick', 'snäll']
  },
  es:{
    serestar:['estoy', 'está', '"es muy"', 'estamos'],
    pasado:['"cuando era"', 'estaba', '"de repente"', 'ayer'],
    perfecto:['"he estado"', '"nunca he"', '"has visto"', '"hoy he"'],
    subjuntivo:['"quiero que"', 'ojalá', '"espero que"', '"para que"', '"no creo que"'],
    porpara:['"gracias por"', '"para mí"', '"por eso"', 'para'],
    pronombres:['"se lo"', '"te lo"', '"me lo"', '"se la"'],
    gustar:['"me gusta"', '"me gustan"', '"me duele"', '"le gusta"', '"me encanta"'],
    condicional:['"si tuviera"', '"me gustaría"', 'deberías', 'podrías'],
    reflexivo:['"se me"', '"me acuerdo"', '"me levanto"', '"nos vamos"'],
    preposiciones:['"pienso en"', '"depende de"', '"desde hace"', '"se casó con"'],
    falsos:['empresa', 'abrigo', 'gimnasio']
  }
};
async function tatoebaSearch(lang, q, native, wc){
  const p = new URLSearchParams({ lang:TAT_LANG[lang], 'trans:lang':'deu', 'showtrans:lang':'deu', is_unapproved:'no', is_orphan:'no', word_count:wc || '3-12', sort:'random', limit:'20', include:'audios' });
  if (q) p.set('q', q);
  if (native) p.set('is_native', 'yes');
  const res = await fetch('https://api.tatoeba.org/v1/sentences?' + p.toString());
  if (!res.ok) throw new Error('http ' + res.status);
  const json = await res.json();
  const known = new Set(BANK[lang].map(i => norm(i.target, lang)));
  return (json.data || []).map(s => {
    const trs = (s.translations || []).flat ? (s.translations || []).flat() : (s.translations || []);
    const t = trs.find(x => x && x.lang === 'deu' && x.is_direct) || trs.find(x => x && x.lang === 'deu');
    const a = (s.audios || []).find(x => x && x.licence && x.download_url);
    if (!t || !s.text) return null;
    return { tid:s.id, target:s.text, de:t.text, owner:s.owner || '', license:s.license || 'CC BY 2.0 FR',
      audio:a ? { url:a.download_url, author:a.author || '', licence:a.licence, attr:a.attribution_url || '' } : null };
  }).filter(x => x && !known.has(norm(x.target, lang)) && x.target.length < 120);
}
async function tatoebaFetch(lang, trap, word){
  let out = [];
  if (word) {
    out = await tatoebaSearch(lang, word, false);
  } else {
    const qs = shuffle(TAT_Q[lang][trap] || []);
    for (const q of qs) {
      const r = await tatoebaSearch(lang, q, true);
      r.forEach(x => { if (!out.some(y => y.tid === x.tid)) out.push(x); });
      if (out.length >= 10) break;
    }
  }
  out.sort((a, b) => (b.audio ? 1 : 0) - (a.audio ? 1 : 0));
  return out.slice(0, 10);
}
async function languageTool(text, lang){
  const body = new URLSearchParams({ text, language:lang === 'sv' ? 'sv' : 'es', motherTongue:'de' });
  const res = await fetch('https://api.languagetool.org/v2/check', { method:'POST', body });
  if (!res.ok) throw new Error('http ' + res.status);
  const json = await res.json();
  return (json.matches || []).map(m => ({ offset:m.offset, length:m.length, message:m.message || (m.rule && m.rule.description) || '', reps:(m.replacements || []).slice(0, 3).map(r => r.value) }));
}
const offlineMsg = 'Keine Verbindung. Das hier braucht Internet, alles andere geht auch offline.';
let audioEl = null;
// auto: von der App selbst gestartet (Hördiktat). Verweigert der Browser das ohne Antippen, bleibt es still.
function playItem(item, rate, auto){
  if (item && item.tat && item.tat.audio && !item.tat.audio.blocked && navigator.onLine !== false) {
    try {
      if (audioEl) audioEl.pause();
      audioEl = new Audio(item.tat.audio.url);
      audioEl.playbackRate = rate && rate < 0.8 ? 0.75 : 1;
      audioEl.play().catch(err => {
        // NotAllowedError: Autoplay-Sperre des Browsers, kein Problem der Aufnahme
        if (err && err.name === 'NotAllowedError') { if (!auto) speak(item.target, item.lang, rate); return; }
        // Manche Aufnahmen dürfen außerhalb von Tatoeba nicht abgespielt werden: dann einmal merken und vorlesen
        item.tat.audio.blocked = true; const o = (DB.tat[item.lang] || []).find(x => x.id === item.id); if (o && o.audio) { o.audio.blocked = true; save(); }
        speak(item.target, item.lang, rate);
      });
      return;
    } catch (e) {}
  }
  speak(item.target, item.lang, rate);
}


// Nachschub: Wenn die eingebauten Sätze zur Neige gehen, neue von Tatoeba holen (höchstens alle 6 Stunden)
async function refill(lang){
  if (!DB.settings.refill || navigator.onLine === false || typeof fetch !== 'function') return 0;
  // Fortgeschritten: nur Sätze zählen, die auch drankommen (ab Mittelstufe oder schwaches Thema)
  const fort = (DB.settings.niveau || 'mittel') === 'fort', weak = fort ? weakTraps(lang) : null;
  const unseen = BANK[lang].filter(i => !stOf(i.id) && (!fort || i.own || i.tat || (i.lvl || 1) >= 2 || weak.has(i.trap))).length;
  if (unseen >= size().newPer * 3) return 0;
  DB.tatFetch = DB.tatFetch || {};
  if (Date.now() - (DB.tatFetch[lang] || 0) < 6 * 3600 * 1000) return 0;
  DB.tatFetch[lang] = Date.now(); save();
  const mature = matureCount(lang);
  const wc = fort ? (mature < 200 ? '6-14' : '7-18') : mature < 50 ? '3-8' : mature < 200 ? '4-10' : mature < 600 ? '5-12' : '6-16';
  const traps = Object.keys(TAT_Q[lang]);
  const day = Math.floor(Date.now() / 86400000);
  let added = 0;
  for (let k = 0; k < 4 && added < 16; k++) {
    const free = k === 3, trap = traps[(day + k) % traps.length];
    try {
      const list = await tatoebaSearch(lang, free ? '' : pick(TAT_Q[lang][trap]), true, wc);
      list.sort((a, b) => (b.audio ? 1 : 0) - (a.audio ? 1 : 0)).slice(0, 4).forEach(x => {
        const id = lang + ':tat:' + x.tid;
        if (DB.tat[lang].some(o => o.id === id)) return;
        DB.tat[lang].push({ id, trap:free ? 'eigene' : trap, de:x.de, target:x.target, owner:x.owner, license:x.license, audio:x.audio, created:today(), auto:true });
        added++;
      });
    } catch (e) { break; }
  }
  if (added) { DB.tatFetch[lang + 'N'] = (DB.tatFetch[lang + 'N'] || 0) + added; save(); buildBank(); if (S.view === 'home' || S.view === 'progress') render(); }
  return added;
}

/* ---------- Anki ---------- */
// An Anki senden: Teilen-Menü; AnkiDroid nimmt den Titel als Vorderseite, den Text als Rückseite
function shareToAnki(front, back){
  if (navigator.share) navigator.share({ title:front, text:back }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(front + '\t' + back).then(() => note('Kopiert. In Anki einfügen.'), () => {});
}
// Sätze aus einem Anki-Export übernehmen („Notizen als Klartext“, Tabulator, auch CSV). Spalten werden erkannt.
function ankiClean(x){
  return String(x || '').replace(/\[sound:[^\]]*\]/g, ' ').replace(/\{\{c\d+::([^}:]*)(::[^}]*)?\}\}/g, '$1').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
function ankiRows(text){
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  let sep = '\t';
  const head = lines.filter(l => l.startsWith('#'));
  const hs = head.find(l => /^#separator:/i.test(l)); if (hs) { const v = hs.split(':')[1].trim().toLowerCase(); sep = { tab:'\t', comma:',', semicolon:';', pipe:'|', space:' ' }[v] || v; }
  else if (!lines.some(l => l.includes('\t')) && lines.some(l => l.includes(';'))) sep = ';';
  const body = lines.filter(l => !l.startsWith('#')).join('\n'), rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (q) { if (ch === '"' && body[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"' && cur === '') q = true;
    else if (ch === sep) { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.map(r => r.map(ankiClean));
}
function ankiDetect(rows){
  const sample = rows.slice(0, 200), cols = Math.max(0, ...sample.map(r => r.length));
  const MARK = { sv:/[åäö]/i, es:/[ñ¿¡áéíóú]/i };
  let best = null;
  for (let c = 0; c < cols; c++) for (const lang of ['sv', 'es']) {
    let hit = 0, all = 0, mark = 0;
    sample.forEach(r => { const t = r[c] || ''; if (MARK[lang].test(t)) mark++; tokens(t).forEach(w => { if (!/[a-zà-ÿ]/i.test(w)) return; all++; if (lookupWord(lang, w)) hit++; }); });
    const sc = (all ? hit / all : 0) + mark / Math.max(1, sample.length) * 0.5;
    if (!best || sc > best.sc) best = { lang, col:c, sc };
  }
  if (!best || best.sc < 0.25) return null;
  // Übersetzung: die übrige Spalte mit den meisten mehrwortigen Einträgen
  let tr = -1, trN = 0;
  for (let c = 0; c < cols; c++) { if (c === best.col) continue; const n = sample.filter(r => (r[c] || '').split(' ').length >= 2 && !/^\d+$/.test(r[c])).length; if (n > trN) { tr = c; trN = n; } }
  if (tr < 0) return null;
  const en = sample.slice(0, 60).map(r => r[tr] || '').join(' ').toLowerCase().match(/\b(the|and|is|you|to|of|it|i)\b/g);
  return { lang:best.lang, col:best.col, tr, en:(en || []).length > 20 };
}
function ankiPrepare(text, name){
  const rows = ankiRows(text), det = ankiDetect(rows);
  if (!det) return { error:'In der Datei habe ich keine Spalte mit schwedischen oder spanischen Sätzen gefunden.' };
  const have = new Set(BANK[det.lang].map(i => norm(i.target)));
  const items = [];
  rows.forEach(r => {
    const target = (r[det.col] || '').trim(), de = (r[det.tr] || '').trim(), n = target.split(' ').length;
    if (n < 3 || n > 22 || !de || have.has(norm(target))) return;
    have.add(norm(target)); items.push({ target:/[.!?]$/.test(target) ? target : target + '.', de });
  });
  return { lang:det.lang, en:det.en, name, items, total:items.length };
}
const ANKI_MAX = 1500;
function ankiCommit(P){
  const list = P.items.slice(0, ANKI_MAX), t = today();
  DB.tat[P.lang] = DB.tat[P.lang] || [];
  list.forEach(x => DB.tat[P.lang].push({ id:P.lang + ':anki:' + hash(x.target), trap:'eigene', de:x.de, target:x.target, owner:'', license:'aus deinem Anki', src:'anki', deck:P.name, en:P.en || undefined, created:t, auto:true }));
  save(); buildBank();
  return list.length;
}
