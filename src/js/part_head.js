/* ---------- Themen ---------- */
const LANG = {
  es:{ name:'Español', deName:'Spanisch', deAcc:'ins Spanische', tts:'es-ES', chars:['á','é','í','ó','ú','ñ','ü','¿','¡'], ph:'Escribe aquí …' },
  sv:{ name:'Svenska', deName:'Schwedisch', deAcc:'ins Schwedische', tts:'sv-SE', chars:['å','ä','ö','é'], ph:'Skriv här …' }
};
const FALSE_FRIEND = 'Falscher Freund: Das ähnliche Wort bedeutet etwas anderes.';
const TRAPS = {
  sv:[
    { id:'bisats', label:'Wortstellung im Nebensatz', kind:'order', gen:'inte', short:'Im Nebensatz steht „inte“ vor dem Verb, und das Verb wandert nicht ans Ende.', rule:'Gilt nach att, eftersom, om, när, som, fast und ähnlichen Wörtern. Auch aldrig, alltid, kanske und ofta stehen dort vor dem Verb: …att han inte kommer, …eftersom jag alltid glömmer det.' },
    { id:'inversion', label:'Inversion & „inte“', kind:'order', short:'Das Verb steht an zweiter Stelle. Steht etwas anderes vorn, folgt das Subjekt erst danach.', rule:'Idag jobbar jag inte. När jag kommer hem lagar jag mat. „inte“ kommt erst nach dem Subjekt.' },
    { id:'tempus', label:'Präteritum oder Perfekt', kind:'form', gen:'tempus', short:'Mit Zeitpunkt in der Vergangenheit: Präteritum. Ohne Zeitpunkt, als Erfahrung oder bis heute andauernd: Perfekt.', rule:'Igår åt jag pizza, auch wenn man im Deutschen „habe gegessen“ sagt. Perfekt (har + Supinum) für Erfahrungen und Ergebnisse: Jag har aldrig varit i Kiruna.' },
    { id:'species', label:'Adjektivendungen & bestimmte Form', kind:'gen', gen:'np', short:'Doppelt bestimmt: den/det/de + Adjektiv auf -a + bestimmte Form.', rule:'Adjektiv in der Grundform bei en-Wörtern (en stor bil), mit -t bei ett-Wörtern (ett stort hus), mit -a im Plural und in der bestimmten Form (det stora huset).' },
    { id:'partikel', label:'Partikelverben', kind:'order', short:'Die Partikel ist betont und gehört zum Verb. „inte“ steht zwischen Verb und Partikel: Jag tycker inte om kaffe.', rule:'tycka om, ta med, komma ihåg, hålla med: Die Partikel ist betont. Jag kommer inte ihåg.' },
    { id:'sin', label:'sin/sitt/sina vs. hans/hennes', kind:'form', short:'sin/sitt/sina nur, wenn der Besitzer Subjekt desselben Satzes ist.', rule:'Anna ringer sin mamma. Aber: Lisa och hennes man bor i Lund, und im Nebensatz: …att hennes bror är sjuk.' },
    { id:'tid', label:'Präpositionen bei Zeit & Ort', kind:'form', short:'Dauer: i två år. Vor: för … sedan. In (Zukunft): om.', rule:'på måndag = kommenden Montag, i måndags = letzten Montag. Verneinte Dauer mit på: inte på flera veckor. Ort: på jobbet, hos läkaren.' },
    { id:'framtid', label:'Zukunft & Modalverben', kind:'form', short:'behöver inte = muss nicht, får = darf, ska = Plan, kommer att = Prognose.', rule:'„Du musst nicht“ heißt du behöver inte. „måste inte“ ist mehrdeutig, „får inte“ heißt „darf nicht“. bli = werden, stanna = bleiben.' },
    { id:'passiv', label:'s-Passiv, „man“ & „det finns“', kind:'form', short:'Passiv mit -s (öppnas, byggdes). „es gibt“ heißt det finns.', rule:'Allgemeine Aussagen oft mit man: Här talar man svenska.' },
    { id:'falska', label:'Falsche Freunde', kind:'form', short:FALSE_FRIEND, rule:'bleiben = stanna, lustig = rolig, Urlaub = semester, Semester = termin, Fahrt = resa, Rock = kjol, brav = snäll, bekommen = få, Termin = tid.' }
  ],
  es:[
    { id:'konjugation', label:'Verbformen', kind:'gen', gen:'conj', short:'Signale: normalmente = Präsens, ayer = Indefinido, antes/siempre = Imperfecto, es importante que = Subjuntivo.', rule:'Unregelmäßige Formen wie tuve, hice, fui, sea, vaya lohnen sich auswendig.' },
    { id:'serestar', label:'ser oder estar', kind:'form', gen:'serestar', short:'ser für Identität und Eigenschaften, estar für Zustand und Ort.', rule:'Auch ser: Uhrzeit und wo ein Ereignis stattfindet (la fiesta es en casa de Ana). Auch estar: Ergebnis und estar + Gerundium.' },
    { id:'pasado', label:'Indefinido vs. Imperfecto', kind:'form', short:'Indefinido für abgeschlossene Ereignisse, Imperfecto für Hintergrund und Gewohnheit.', rule:'Estaba leyendo (laufende Handlung) cuando sonó el teléfono (Ereignis). Begrenzte Dauer ebenfalls Indefinido: Estuvo tres años en Berlín.' },
    { id:'perfecto', label:'Perfecto vs. Indefinido', kind:'form', short:'In Spanien: heute, diese Woche, Erfahrung = Perfecto. Gestern, 2018 = Indefinido.', rule:'In Lateinamerika steht meist Indefinido, auch für heute. Beides wird verstanden.' },
    { id:'subjuntivo', label:'Subjuntivo oder Indikativ', kind:'form', short:'Nach Wunsch, Gefühl, Zweifel und „cuando“ mit Zukunftsbezug: Subjuntivo.', rule:'quiero que, me alegro de que, no creo que, es importante que, para que, antes de que, ojalá. Aber: creo que tiene razón (Indikativ).' },
    { id:'porpara', label:'por oder para', kind:'form', gen:'porpara', short:'para = Zweck, Ziel, Frist. por = Grund, Preis, durch.', rule:'para ti, para el viernes, para trabajar. gracias por, por 200 euros, por el parque, por correo, por eso.' },
    { id:'pronombres', label:'Objektpronomen', kind:'order', short:'Pronomen vor das konjugierte Verb oder an Infinitiv und Imperativ hängen.', rule:'te lo doy, ¿puedes explicármelo?, dámelo. le/les + lo/la wird zu se lo/se la.' },
    { id:'gustar', label:'gustar & Co.', kind:'form', short:'Das Verb richtet sich nach dem, was gefällt: me gustan los libros.', rule:'Genauso encantar, interesar, doler, faltar, parecer, quedar, molestar.' },
    { id:'condicional', label:'Konditional & si-Sätze', kind:'form', short:'Irreal: si + tuviera, dann Konditional (viajaría).', rule:'Realer Fall: si + Präsens (si llueve, nos quedamos). Höflich: me gustaría, podrías, deberías.' },
    { id:'reflexivo', label:'Reflexivverben & „se“', kind:'form', short:'Reflexives Verb: Das Pronomen gehört dazu.', rule:'levantarse, acordarse de, quedarse, irse. se me olvidó, se me cayó: Es ist mir passiert. se habla: man spricht.' },
    { id:'preposiciones', label:'Präpositionen & „a“', kind:'form', short:'Feste Präposition oder persönliches „a“, nicht wörtlich aus dem Deutschen.', rule:'veo a mi hermana, pienso en ti, sueño con, depende de, se casó con, se enamoró de, tarda en. desde hace = seit, hace = vor.' },
    { id:'falsos', label:'Falsche Freunde', kind:'form', short:FALSE_FRIEND, rule:'Firma = empresa (firma = Unterschrift), Mantel = abrigo (mantel = Tischdecke), Gymnasium = instituto, Rente = pensión, Konkurrenz = competencia, Prospekt = folleto.' }
  ]
};
const SIZES = {
  kurz:{ label:'Kurz', newPer:3, maxRev:10, gen:4 },
  normal:{ label:'Normal', newPer:6, maxRev:20, gen:6 },
  lang:{ label:'Lang', newPer:10, maxRev:35, gen:8 }
};
const INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64];
const SECS = { tiles:30, cloze:25, free:45, gen:20, dict:30 };
const NAMES = ['anna','peter','lisa','jonas','juan','ana','pablo','madrid','göteborg','sverige','uppsala','lund','stockholm','norge','méxico','barcelona','berlín','colonia','sevilla','perú','chile','españa'];

/* ---------- Hilfsfunktionen ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const fmt = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => fmt(new Date());
const addDays = (ds, n) => { const [y, m, d] = ds.split('-').map(Number); return fmt(new Date(y, m - 1, d + n)); };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
const deacc = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const joinList = p => (p.length > 1 ? p.slice(0, -1).join(', ') + ' und ' + p[p.length - 1] : (p[0] || ''));

function norm(s, lang){
  let t = String(s || '').toLowerCase().replace(/[’`´]/g, "'").replace(/[.!?¡¿,;"„“”«»()…]/g, ' ').replace(/[–—]/g, ' ').replace(/\s+/g, ' ').trim();
  if (lang === 'sv') t = t.replace(/\bi (dag|morgon|går|kväll|morse|natt)\b/g, 'i$1');
  else if (lang === 'es') t = t.replace(/^(yo|tú|tu|él|ella|nosotros|nosotras|ellos|ellas|usted|ustedes) (?=\S+ \S)/, '');
  return t;
}
function tokens(s){ return String(s).replace(/[.!?¡¿,;"„“”«»()…]/g, ' ').split(/\s+/).filter(Boolean); }

/* ---------- Satzbank ---------- */
let BANK = { sv:[], es:[] };
// Position der Lücke im Zielsatz: nur ganze Wörter. Eine reine Zeichensuche fände „en“ zuerst in „Pienso“
// und „es“ in „fiesta“; dann stünde die Lücke im falschen Wort.
function gapPos(target, gap){
  if (!gap) return -1;
  const L = 'A-Za-zÀ-ÖØ-öø-ÿ', re = new RegExp(`(?<![${L}])${gap.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![${L}])`);
  const m = re.exec(target);
  return m ? m.index : target.indexOf(gap);
}
function buildBank(){
  BANK = { sv:[], es:[] };
  ['sv', 'es'].forEach(lang => {
    TRAPS[lang].forEach(tr => {
      const raw = CONTENT[lang][tr.id];
      if (!raw) return;
      raw.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        const p = line.split('|').map(x => x.trim());
        if (p.length < 2) return;
        const [de, target, gap = '', hint = '', alts = ''] = p;
        const gaps = gap ? gap.split('/').map(x => x.trim()).filter(Boolean) : [];
        const altList = alts ? alts.split(';;').map(x => x.trim()).filter(Boolean) : [];
        if (gaps[0]) {
          // Lückenfüllungen, die sich aus den alternativen Sätzen ergeben (gleicher Anfang und gleiches Ende)
          const pos = gapPos(target, gaps[0]);
          const pre = target.slice(0, pos), post = target.slice(pos + gaps[0].length);
          altList.forEach(a => { if (pos >= 0 && a.startsWith(pre) && a.endsWith(post) && a.length > pre.length + post.length) { const fill = a.slice(pre.length, a.length - post.length).trim(); if (fill && !gaps.includes(fill)) gaps.push(fill); } });
        }
        BANK[lang].push({ id:lang + ':' + hash(target), lang, trap:tr.id, kind:tr.kind === 'order' ? 'order' : 'form', de, target, gap:gaps[0] || '', gapAlts:gaps, hint, alts:altList });
      });
    });
    (DB.own[lang] || []).forEach(o => BANK[lang].push({ id:o.id, lang, trap:'eigene', kind:'order', de:o.de, target:o.target, gap:'', gapAlts:[], hint:'', alts:[], own:true }));
    (DB.tat[lang] || []).forEach(o => BANK[lang].push({ id:o.id, lang, trap:o.trap, kind:'order', de:o.de, target:o.target, gap:'', gapAlts:[], hint:'', alts:[], own:o.trap === 'eigene' && !o.auto, tat:o }));
  });
}
const itemById = id => BANK.sv.find(i => i.id === id) || BANK.es.find(i => i.id === id);
function trapMeta(lang, id){
  if (id === 'eigene') return { id, label:'Gesammelte Sätze', kind:'order', short:'', rule:'' };
  return TRAPS[lang].find(t => t.id === id);
}

// Versionsnummer, setzt tools/build.js aus package.json ein
const APP_VERSION = '@VERSION@';
/* ---------- Speicher ---------- */
const KEY = 'tagwerk-offline-v1';
const freshDB = () => ({ v:3, settings:{ size:'normal', lang:'sv', refill:true }, used:{}, tatFetch:{}, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null });
let DB = freshDB();
function load(){
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      DB = Object.assign(freshDB(), d);
      DB.settings = Object.assign(freshDB().settings, d.settings || {});
      if (!d.settings || !d.settings.size) DB.settings.size = d.settings && d.settings.newPerDay === 3 ? 'kurz' : d.settings && d.settings.newPerDay === 10 ? 'lang' : 'normal';
      DB.own = Object.assign({ sv:[], es:[] }, d.own || {});
      DB.tat = Object.assign({ sv:[], es:[] }, d.tat || {});
      migrateStates();
    }
  } catch (e) {
    // Unlesbaren Stand zur Seite legen, bevor ein späteres Speichern ihn überschreibt
    try { const raw = localStorage.getItem(KEY); if (raw) localStorage.setItem(KEY + '-unlesbar', raw); } catch (e2) {}
    note('Gespeicherte Daten ließen sich nicht lesen. Spiel ein Backup ein, falls du eines hast.', 'warn');
  }
}
function migrateStates(){
  const old = [0, 1, 2, 4, 8, 16, 32, 64];
  Object.values(DB.st).forEach(st => {
    if (st.s != null) return;
    const ivl = old[Math.min(st.lv || 0, 7)] || 1;
    st.s = Math.max(0.5, ivl); st.d = Math.min(10, Math.max(1, 5 + 0.5 * ((st.bad || 0) - (st.ok || 0))));
    st.ivl = ivl; st.last = addDays(st.due || today(), -ivl); st.reps = st.ok || 0; st.lapses = st.bad || 0;
  });
}
// Backup: genau das gespeicherte Objekt, lesbar über alle Versionen hinweg
const backupName = () => `tagwerk-backup-${today()}.json`;
const backupText = () => JSON.stringify(DB, null, 1);
function backupFile(){
  const name = backupName(), text = backupText();
  try { return new File([text], name, { type:'application/json' }); } catch (e) { return null; }
}
function canShareBackup(){
  try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files:[new File(['{}'], 'tagwerk.json', { type:'application/json' })] })); } catch (e) { return false; }
}
function parseBackup(text){
  try {
    const d = JSON.parse(String(text).replace(/^\uFEFF/, '').trim());
    if (!d || typeof d !== 'object' || Array.isArray(d) || !d.st || typeof d.st !== 'object') return null;
    return d;
  } catch (e) { return null; }
}
function applyBackup(d){
  DB = Object.assign(freshDB(), d);
  DB.own = Object.assign({ sv:[], es:[] }, d.own || {});
  DB.tat = Object.assign({ sv:[], es:[] }, d.tat || {});
  DB.settings = Object.assign(freshDB().settings, d.settings || {});
  migrateStates(); flushSave(); buildBank();
}
function backupSummary(){
  const n = Object.keys(DB.st || {}).length, days = Object.keys(DB.log || {}).length;
  return `${n === 1 ? '1 Satz' : `${n} Sätze`}, ${days === 1 ? '1 Übungstag' : `${days} Übungstage`}`;
}
let saveTimer = null;
function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(DB)); }
    catch (e) { note('Speichern ist fehlgeschlagen. Exportier zur Sicherheit ein Backup unter Einstellungen.', 'warn'); render(); }
  }, 150);
}
// Sofort speichern, wenn die App in den Hintergrund geht oder geschlossen wird (Android beendet Apps oft ohne Vorwarnung)
function flushSave(){ clearTimeout(saveTimer); try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} }
// Tagesstand je Sprache (für den Verlauf): geübt, gefestigt, geschätzt abrufbar
function snapshot(){
  const t = today(), snap = {};
  ['sv', 'es'].forEach(l => {
    let n = 0, m = 0, k = 0;
    BANK[l].forEach(i => { const st = stOf(i.id); if (!st) return; n++; if ((st.ivl || 0) >= MATURE) m++; k += FSRS.retrievability(st, t); });
    if (n) snap[l] = { n, m, k:Math.round(k) };
  });
  snapshotExtra(snap);
  DB.snap = DB.snap || {};
  if (Object.keys(snap).length) { DB.snap[t] = snap; save(); }
}
function persistRun(){
  const r = S.run;
  if (r && r.kind === 'daily') DB.run = r.finished ? null : { date:today(), lang:r.lang, queue:r.queue, idx:r.idx, ok:r.ok, bad:r.bad, strongBefore:r.strongBefore };
  save();
}
function dayLog(d, lang){ const x = DB.log[d] && DB.log[d][lang]; return typeof x === 'number' ? { n:x } : (x || {}); }
function logDay(lang, f){
  const d = today();
  DB.log[d] = DB.log[d] || {};
  const x = dayLog(d, lang);
  Object.keys(f).forEach(k => { x[k] = (x[k] || 0) + f[k]; });
  DB.log[d][lang] = x;
  const keys = Object.keys(DB.log).sort();
  while (keys.length > 400) delete DB.log[keys.shift()];
}
const logAct = (lang, n) => logDay(lang, { n:n || 1 });
const dayDiff = (a, b) => Math.round((new Date(a.slice(0, 4), a.slice(5, 7) - 1, a.slice(8, 10)) - new Date(b.slice(0, 4), b.slice(5, 7) - 1, b.slice(8, 10))) / 86400000);
// Serie: Ein Tag zählt, wenn ein Tagwerk erledigt wurde. Ein ausgelassener Tag pro 7 Tage unterbricht sie nicht.
function streakData(){
  const days = Object.keys(DB.done).filter(x => DB.done[x]).sort();
  const t = today(), free = new Set();
  let cur = 0, best = 0, lastFree = null;
  if (!days.length) return { current:0, longest:0, free };
  for (let x = days[0]; x <= t; x = addDays(x, 1)) {
    if (DB.done[x]) { cur++; best = Math.max(best, cur); continue; }
    if (x === t) break;
    const nx = addDays(x, 1);
    if (cur > 0 && (DB.done[nx] || nx === t) && (!lastFree || dayDiff(x, lastFree) >= 7)) { free.add(x); lastFree = x; }
    else { cur = 0; lastFree = null; }
  }
  return { current:cur, longest:best, free };
}
const streak = () => streakData().current;
function sumLog(lang, days, key){ let n = 0; for (let k = 0; k < days; k++) n += dayLog(addDays(today(), -k), lang)[key] || 0; return n; }
const week = lang => sumLog(lang, 7, 'n');
function mondayOf(ds){ const [y, m, d] = ds.split('-').map(Number); const dt = new Date(y, m - 1, d); const wd = (dt.getDay() + 6) % 7; return addDays(ds, -wd); }
const MATURE = 21, ANCHORED = 365;
const matureCount = lang => BANK[lang].filter(i => { const s = stOf(i.id); return s && (s.ivl || 0) >= MATURE; }).length;
const strongCount = matureCount;
// Meilensteine ohne Ende: feiner am Anfang, später in größeren Schritten
function milestoneList(upTo){
  const out = [10, 25, 50, 100, 150, 200, 300, 400, 500, 750, 1000];
  for (let m = 1500; m <= Math.max(upTo, 1500) + 500; m += 500) out.push(m);
  return out;
}
const nextMilestone = n => milestoneList(n).find(m => m > n);
const prevMilestone = n => [0].concat(milestoneList(n)).filter(m => m <= n).pop();
const knownEstimate = lang => BANK[lang].reduce((a, i) => a + FSRS.retrievability(stOf(i.id), today()), 0);
function streakMilestone(n){
  if ([7, 14, 30, 50, 100, 150, 200, 250, 300].includes(n)) return `${n} Tage in Folge.`;
  if (n % 365 === 0) return n === 365 ? 'Ein Jahr in Folge.' : `${n / 365} Jahre in Folge.`;
  if (n > 365 && n % 100 === 0) return `${n} Tage in Folge.`;
  return '';
}

/* ---------- Zustand ---------- */
const S = { lang:'sv', view:'home', run:null, dailyRun:null, notice:null, armed:null, shadow:null, write:null, own:null, tat:null };
function note(text, kind){ S.notice = text ? { text, kind:kind || 'ok' } : null; }
const size = () => SIZES[DB.settings.size] || SIZES.normal;

function stOf(id){ return DB.st[id]; }
function stage(item){
  const st = stOf(item.id);
  if (st && (st.reps || 0) >= 2) return 'free';
  return item.kind === 'order' ? 'tiles' : 'cloze';
}
function dueItems(lang){
  const t = today();
  return BANK[lang].filter(i => { const s = stOf(i.id); return s && s.due <= t; }).sort((a, b) => stOf(a.id).due.localeCompare(stOf(b.id).due));
}
function pickNew(lang, n, onlyTrap){
  const unseen = BANK[lang].filter(i => !stOf(i.id) && (!onlyTrap || i.trap === onlyTrap));
  const out = unseen.filter(i => i.own || (i.tat && !i.tat.auto)).slice(0, Math.max(1, Math.ceil(n / 2)));
  const count = {};
  BANK[lang].forEach(i => { if (stOf(i.id)) count[i.trap] = (count[i.trap] || 0) + 1; });
  while (out.length < n) {
    const rest = unseen.filter(i => !out.includes(i));
    if (!rest.length) break;
    const traps = [...new Set(rest.map(i => i.trap))];
    traps.sort((a, b) => (count[a] || 0) - (count[b] || 0) || Math.random() - 0.5);
    const tr = traps[0];
    const item = rest.find(i => i.trap === tr);
    out.push(item); count[tr] = (count[tr] || 0) + 1;
  }
  return out;
}
const genIds = lang => Object.keys(GENS).filter(g => GENS[g].lang === lang && !GENS[g].form);
const formIds = lang => Object.keys(GENS).filter(g => GENS[g].lang === lang && GENS[g].form);
function dayGen(lang){
  const g = genIds(lang);
  if (!g.length) return null;
  return g[Math.floor(Date.now() / 86400000) % g.length];
}
const exFor = item => ({ type:stage(item), id:item.id });
function shuffleInPlace(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function dailyPlan(lang){
  const sz = size();
  const due = dueItems(lang).slice(0, sz.maxRev);
  const fresh = pickNew(lang, sz.newPer);
  const g = dayGen(lang);
  const base = shuffle(due).map(exFor).concat(fresh.map(exFor));
  // Die Hälfte der Grammatik-Aufgaben aus dem Generator des Tages, der Rest aus den anderen Übungsformen, täglich wechselnd
  const fx = formIds(lang).filter(f => GENS[f].daily), day = Math.floor(Date.now() / 86400000);
  const nForm = fx.length ? Math.floor(sz.gen / 2) : 0;
  const drills = g ? Array.from({ length:sz.gen - nForm }, () => ({ type:'gen', gen:g })) : [];
  for (let i = 0; i < nForm; i++) drills.push({ type:'gen', gen:fx[(day + i) % fx.length] });
  shuffleInPlace(drills);
  // gemischt statt Block: Formübungen gleichmäßig zwischen die Sätze verteilen
  // Erst ein Satz, dann abwechselnd; die Formübungen verteilen sich gleichmäßig
  const queue = [];
  const step = drills.length ? Math.max(1, base.length / drills.length) : Infinity;
  let next = step, di = 0;
  base.forEach((ex, i) => { queue.push(ex); while (di < drills.length && i + 1 >= next) { queue.push(drills[di++]); next += step; } });
  while (di < drills.length) queue.push(drills[di++]);
  const genLabels = [...new Set(drills.slice().sort((a, b) => (GENS[a.gen].form ? 1 : 0) - (GENS[b.gen].form ? 1 : 0)).map(x => GENS[x.gen].short || GENS[x.gen].label))];
  return { queue, due:due.length, fresh:fresh.length, gen:g, genN:drills.length, genLabels };
}
const minutes = queue => Math.max(1, Math.round(queue.reduce((s, ex) => s + (SECS[ex.type] || 25), 0) * 1.15 / 60));

function startRun(kind, opts){
  const lang = S.lang;
  let queue = [];
  if (kind === 'daily') queue = dailyPlan(lang).queue;
  else if (kind === 'quick') {
    queue = dueItems(lang).slice(0, 6).map(exFor);
    if (queue.length < 6) {
      const t = today(), have = new Set(queue.map(x => x.id));
      const weak = BANK[lang].filter(i => { const s = stOf(i.id); return s && !have.has(i.id) && s.last !== t; })
        .sort((a, b) => FSRS.retrievability(stOf(a.id), t) - FSRS.retrievability(stOf(b.id), t));
      queue = queue.concat(weak.slice(0, 6 - queue.length).map(exFor));
    }
    const g = genIds(lang);
    while (queue.length < 6 && g.length) queue.push({ type:'gen', gen:pick(g) });
  } else if (kind === 'trap') {
    const tr = trapMeta(lang, opts.trap);
    if (tr.kind === 'gen') { for (let i = 0; i < 10; i++) queue.push({ type:'gen', gen:tr.gen }); }
    else {
      const items = BANK[lang].filter(i => i.trap === tr.id);
      const t = today();
      const due = items.filter(i => stOf(i.id) && stOf(i.id).due <= t);
      // Heute schon Geübtes nach hinten, sonst brächte ein zweites „Thema üben“ dieselben Sätze
      const mem = DB.used.recentPick = DB.used.recentPick || {}, recent = mem['trap_' + tr.id] || [];
      const seen = items.filter(i => stOf(i.id) && !due.includes(i)).sort((a, b) => (recent.includes(a.id) - recent.includes(b.id)) || ((stOf(a.id).last === t) - (stOf(b.id).last === t)) || (FSRS.retrievability(stOf(a.id), t) - FSRS.retrievability(stOf(b.id), t)));
      const fresh = pickNew(lang, 10, tr.id);
      const nGen = tr.gen ? 3 : 0;
      queue = due.concat(fresh, seen).slice(0, 10 - nGen).map(exFor);
      mem['trap_' + tr.id] = queue.map(x => x.id);
      for (let i = 0; i < nGen; i++) queue.splice(Math.round((i + 1) * queue.length / (nGen + 1)) + i, 0, { type:'gen', gen:tr.gen });
    }
  } else if (kind === 'gen') queue = [{ type:'gen', gen:opts.gen }];
  else if (kind === 'form') queue = Array.from({ length:10 }, () => ({ type:'gen', gen:opts.gen }));
  else if (kind === 'dict') queue = freshFirst(BANK[lang].filter(i => stOf(i.id) && (canSpeak() || (i.tat && i.tat.audio && !i.tat.audio.blocked))), 'dict_' + lang, 10).map(i => ({ type:'dict', id:i.id }));
  else if (kind === 'hard') queue = hardItems(lang).map(i => ({ type:'free', id:i.id }));
  else if (kind === 'extraNew') queue = pickNew(lang, (opts && opts.n) || size().newPer).map(exFor);
  if (!queue.length) { note('Dafür gibt es gerade nichts zu üben.', 'warn'); render(); return; }
  if (S.run && !S.run.finished && S.run.kind === 'daily' && kind !== 'daily') S.dailyRun = S.run;
  if (kind === 'daily') S.dailyRun = null;
  S.notice = null;
  S.run = { kind, lang, queue, idx:0, ok:0, bad:0, endless:kind === 'gen', gen:opts && opts.gen, trap:opts && opts.trap, cur:null, strongBefore:strongCount(lang) };
  S.view = 'run'; prepCur(); persistRun(); render(); window.scrollTo(0, 0);
}
function hardItems(lang){
  // Nur Sätze, die noch nicht gefestigt sind: Wer einen Satz seit Monaten kann, soll ihn hier nicht ewig sehen
  return BANK[lang].filter(i => { const s = stOf(i.id); return s && s.bad >= 2 && (s.ivl || 0) < MATURE; })
    .sort((a, b) => { const x = stOf(a.id), y = stOf(b.id); return ((y.d || 5) - (x.d || 5)) || (y.bad - x.bad); }).slice(0, 5);
}
// Zufallsauswahl ohne Wiederholung der letzten Runden: zuletzt Gewähltes kommt nach hinten, solange es genug anderes gibt
function freshFirst(items, slot, n){
  const mem = DB.used.recentPick = DB.used.recentPick || {};
  const recent = mem[slot] || [];
  const out = shuffle(items).sort((a, b) => (recent.includes(a.id) ? 1 : 0) - (recent.includes(b.id) ? 1 : 0)).slice(0, n);
  mem[slot] = recent.concat(out.map(i => i.id)).slice(-30);
  return out;
}
// Erzeugte Aufgaben ohne Wiederholung: Jeder Generator merkt sich seine letzten Aufgaben, auch über Runden hinweg.
const GEN_MEMORY = 12;
const genKey = d => String(d.word || d.full || (d.answers && d.answers[0]) || d.prompt || '').toLowerCase();
function makeFresh(g){
  const mem = DB.used.genRecent = DB.used.genRecent || {};
  const list = mem[g] = mem[g] || [];
  let d = GENS[g].make(), k = genKey(d);
  for (let tries = 0; tries < 30 && list.includes(k); tries++) { d = GENS[g].make(); k = genKey(d); }
  list.push(k); if (list.length > GEN_MEMORY) list.splice(0, list.length - GEN_MEMORY);
  return d;
}
function prepCur(){
  const r = S.run; const ex = r.queue[r.idx];
  r.shownAt = Date.now();
  if (!ex) { r.cur = null; return; }
  if (ex.type === 'gen' && !ex.data) ex.data = makeFresh(ex.gen);
  if (ex.type === 'tiles' && !ex.pool) {
    const item = itemById(ex.id);
    const toks = tileTokens(item.target);
    const extra = distractorFor(item, toks);
    ex.extra = !!extra;
    ex.pool = shuffle(toks.map((t, i) => ({ t, i })).concat(extra ? [{ t:extra, i:toks.length, extra:true }] : []));
    if (ex.pool.map(x => x.i).join() === toks.map((_, i) => i).join() && toks.length > 1) ex.pool.reverse();
    ex.picked = [];
  }
  if (ex.type === 'tiles') ex.picked = [];
  r.cur = { input:ex.type === 'gen' && ex.data && ex.data.start ? ex.data.start : '', state:'answer', result:null, intro:true };
  S.focus = true;
}
// Ein gezieltes Ablenkwort an der Stelle, um die es im Thema geht (falsche Partikel, le statt se)
const PART_SWAP = { om:'på', på:'om', med:'till', till:'med', upp:'ut', ut:'upp', av:'på', bort:'upp', fram:'upp', ihåg:'om' };
function distractorFor(item, toks){
  const low = toks.map(t => t.toLowerCase());
  if (item.trap === 'partikel') { for (const t of low.slice().reverse()) if (PART_SWAP[t] && !low.includes(PART_SWAP[t])) return PART_SWAP[t]; }
  if (item.trap === 'pronombres' && low.some(t => ['lo', 'la', 'los', 'las'].includes(t)) && !low.includes('le')) return 'le';
  return null;
}
function tileTokens(sentence){
  const t = tokens(sentence);
  if (t.length && !NAMES.includes(t[0].toLowerCase())) t[0] = t[0].toLowerCase();
  return t;
}
const tileKey = s => tileTokens(s).map(x => x.toLowerCase()).join(' ');
function openDaily(){
  if (S.run && !S.run.finished && S.run.kind === 'daily') return S.run;
  if (S.dailyRun && !S.dailyRun.finished) return S.dailyRun;
  return null;
}
function restoreRun(){
  const d = DB.run;
  if (!d || d.date !== today() || !Array.isArray(d.queue) || d.idx >= d.queue.length) { DB.run = null; return; }
  if (d.queue.some(ex => ex.id && !itemById(ex.id))) { DB.run = null; return; }
  S.dailyRun = { kind:'daily', lang:d.lang, queue:d.queue, idx:d.idx, ok:d.ok || 0, bad:d.bad || 0, cur:null, strongBefore:d.strongBefore != null ? d.strongBefore : strongCount(d.lang) };
}
function resumeDaily(){
  const d = openDaily(); if (!d) return false;
  S.run = d; S.lang = d.lang; S.view = 'run';
  if (!d.cur) prepCur();
  return true;
}
