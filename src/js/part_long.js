/* ---------- Langfristiger Fortschritt: Etappen, Themenraster, Veränderung über 30 Tage ---------- */
// Tagesstand ergänzen: Wortschatz (Grundformen) und gefestigte Sätze je Thema
function snapshotExtra(snap){
  ['sv', 'es'].forEach(l => {
    if (!snap[l]) return;
    snap[l].w = vocabCount(l).all;
    const t = {};
    BANK[l].forEach(i => { const st = stOf(i.id); if (st && (st.ivl || 0) >= MATURE && i.trap) t[i.trap] = (t[i.trap] || 0) + 1; });
    snap[l].t = t;
  });
}
// Stand von vor etwa 30 Tagen (25 bis 40 Tage zurück), falls vorhanden
function snapAgo(lang, days){
  for (let b = 0; b <= 15; b++) for (const d of [days + b, days - b]) { const x = DB.snap && DB.snap[addDays(today(), -d)]; if (x && x[lang] && d >= 25) return x[lang]; }
  return null;
}
// Etappen aus den gespeicherten Tagesdaten rekonstruieren. Gefestigt, Serie und verankert nutzen die Listen aus part_head.js,
// dieselben wie Rundenende und Fortschritt.
const WAY_TASKS = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000];
const WAY_HOURS = [1, 5, 10, 25, 50, 100, 250, 500];
const WAY_WORDS = [100, 250, 500, 1000, 1500, 2000];
const WAY_DAYS = [10, 50, 100, 250, 500, 1000];
// Schwellen gehen nie aus: Nach dem Ende der Liste geht es in gleichmäßigen Schritten weiter, auch nach Jahren
function ladder(list, step, upTo){ const out = list.slice(); while (out[out.length - 1] <= upTo) out.push(step(out[out.length - 1])); return out; }
const streakLabel = n => (n >= 365 && n % 365 === 0 ? `${n / 365} ${n === 365 ? 'Jahr' : 'Jahre'} in Folge` : `${n.toLocaleString('de-DE')} Tage in Folge`);
const fmtN = n => n.toLocaleString('de-DE');
const anchoredLabel = n => (n === 1 ? 'Erster Satz verankert' : `${fmtN(n)} verankerte Sätze`);
// Themen-Etappen (siehe checkTopics in part_stats.js): Stufe 1 Fehler halbiert, Stufe 2 Thema sitzt
const topicMileText = (e, again) => { const lb = trapLabel(e.l, e.k); return e.s === 2 ? `Thema „${lb}“ sitzt` : `„${lb}“: Fehler ${again ? 'wieder ' : ''}halbiert`; };
// Gefestigt je Sprache und Tag: der Bestand am Tagesende (Protokoll mc, seit 24.63), für ältere Tage die Zahl der erstmals
// gefestigten Sätze (ab der Summe der Tage, die schon aus dem Protokoll gefallen sind)
function matureByDay(days, l){
  const out = {}; let cum = archSum('mat', l), last = null;
  days.forEach(d => { const x = dayLog(d, l); cum += x.mat || 0; if (x.mc != null) last = x.mc; out[d] = last != null ? last : cum; });
  return out;
}
// Höchster Stand an gefestigten Sätzen: Eine Etappe bleibt erreicht, auch wenn später ein Satz wieder herausfällt
function matureHigh(l){
  const days = Object.keys(DB.log || {}).sort(), by = matureByDay(days, l);
  const kept = (DB.way || []).filter(e => e.k === 'mature' && e.l === l).reduce((m, e) => Math.max(m, e.v), 0);
  return Math.max(matureCount(l), kept, ...Object.values(by), 0);
}
// Gesamtsummen über alles Geübte, mit den herausgefallenen Tagen aus logArch: Übungstage (days als Liste, dayCount mit Archiv),
// Aufgaben, Sekunden, erster Übungstag. Die einzige Stelle dafür (Fortschritt, Lernminuten, Kalender, Dein Weg).
function lifeTotals(){
  const A = DB.logArch || {}, days = Object.keys(DB.log || {}).filter(d => ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0)).sort();
  const sum = k => archSum(k) + days.reduce((a, d) => a + (dayLog(d, 'sv')[k] || 0) + (dayLog(d, 'es')[k] || 0), 0);
  return { days, n:sum('n'), secs:sum('secs'), dayCount:archSum('days') + days.length, first:A.first && (!days[0] || A.first < days[0]) ? A.first : days[0] || null };
}
// Text und Zeichen einer Etappe aus Art, Sprache und Wert. Gespeicherte Etappen (DB.way) tragen nur { d, k, l, v }.
function wayLabel(e){
  const v = e.v;
  switch (e.k) {
    case 'first': return { ico:'start', t:'Erster Übungstag' };
    case 'days': return { ico:'start', t:`${fmtN(v)} Übungstage` };
    case 'years': return { ico:'start', t:`${v} ${v === 1 ? 'Jahr' : 'Jahre'} mit Tagwerk` };
    case 'mature': return { ico:'mature', t:`${fmtN(v)} gefestigte Sätze` };
    case 'anchored': return { ico:'anchored', t:anchoredLabel(v) };
    case 'tasks': return { ico:'tasks', t:`${fmtN(v)} Aufgaben` };
    case 'hours': return { ico:'time', t:`${fmtN(v)} ${v === 1 ? 'Stunde' : 'Stunden'} geübt` };
    case 'streak': return { ico:'streak', t:streakLabel(v) };
    case 'own': return { ico:'own', t:'Erster eigener Satz' };
    case 'words': return { ico:'words', t:`${fmtN(v)} verschiedene Wörter` };
    case 'text': return { ico:'write', t:v === 1 ? 'Erster eigener Text' : `${fmtN(v)} eigene Texte` };
    default: return { ico:'start', t:String(e.k) };
  }
}
// Alle erreichten Etappen mit Datum, dazu die nächsten. Abgeleitet aus Protokoll, Tagesständen, Tagwerken und Themen;
// einmal erreichte Etappen stehen außerdem in DB.way und behalten dort ihr Datum, auch wenn Protokoll oder Tagesstände
// später ausgedünnt werden oder eine Zahl wieder sinkt.
function wayEvents(){
  const T = lifeTotals(), days = T.days, ev = [], add = (d, k, l, v) => { const e = { d, k }; if (l) e.l = l; if (v != null) e.v = v; ev.push(e); };
  const stored = Array.isArray(DB.way) ? DB.way : [];
  if (!T.first && !stored.length && !(DB.etap || []).length) return { done:[], next:[] };
  let n = archSum('n'), secs = archSum('secs');
  const TASKS = ladder(WAY_TASKS, x => x + 25000, T.n), HOURS = ladder(WAY_HOURS, x => x + 250, T.secs / 3600);
  const matBy = { sv:matureByDay(days, 'sv'), es:matureByDay(days, 'es') };
  const hiM = { sv:matureHigh('sv'), es:matureHigh('es') }, MAT = milestoneList(Math.max(hiM.sv, hiM.es));
  const ANC = anchoredList(Math.max(anchoredCount('sv'), anchoredCount('es')));
  const DAYS = ladder(WAY_DAYS, x => x + 500, T.dayCount);
  const mi = { sv:0, es:0 }, ai = { sv:0, es:0 }, anc = { sv:0, es:0 };
  let ti = 0, hi = 0;
  if (T.first) {
    add(T.first, 'first');
    // Jahrestage seit dem ersten Übungstag (29. Februar: am 1. März)
    for (let y = 1; ; y++) { const [Y, M, D] = T.first.split('-'), yy = Number(Y) + y; const ad = M === '02' && D === '29' && new Date(yy, 1, 29).getMonth() !== 1 ? `${yy}-03-01` : `${yy}-${M}-${D}`; if (ad > today()) break; add(ad, 'years', null, y); }
  }
  days.forEach((d, i) => {
    const c = T.dayCount - days.length + i + 1; if (DAYS.includes(c)) add(d, 'days', null, c);
    ['sv', 'es'].forEach(l => {
      const x = dayLog(d, l); n += x.n || 0; secs += x.secs || 0;
      while (mi[l] < MAT.length && matBy[l][d] >= MAT[mi[l]]) { add(d, 'mature', l, MAT[mi[l]]); mi[l]++; }
      if (x.mc != null) anc[l] = x.ac || 0;
      while (ai[l] < ANC.length && anc[l] >= ANC[ai[l]]) { add(d, 'anchored', l, ANC[ai[l]]); ai[l]++; }
    });
    while (ti < TASKS.length && n >= TASKS[ti]) { add(d, 'tasks', null, TASKS[ti]); ti++; }
    while (hi < HOURS.length && secs >= HOURS[hi] * 3600) { add(d, 'hours', null, HOURS[hi]); hi++; }
  });
  // Serien nach derselben Regel wie die Serienanzeige (streakWalk)
  const doneDays = Object.keys(DB.done || {}).filter(d => DB.done[d]).sort(), STREAK = streakList(doneDays.length + 7);
  let si = 0;
  if (doneDays.length) streakWalk(doneDays[0], today(), (d, c) => { while (c >= STREAK[si]) { add(d, 'streak', null, STREAK[si]); si++; } });
  ['sv', 'es'].forEach(l => {
    const firstOwn = (DB.own[l] || []).filter(o => o.created).map(o => o.created).sort()[0];
    if (firstOwn) add(firstOwn, 'own', l);
    // Wortschatz erst seit den erweiterten Tagesständen. Nur Schwellen, die zwischen zwei Erfassungen überschritten wurden;
    // was schon beim ersten Erfassen erreicht war, hat kein bekanntes Datum.
    let prev = null;
    Object.keys(DB.snap || {}).sort().forEach(d => {
      const x = DB.snap[d][l]; if (!x || x.w == null) return;
      if (prev != null) ladder(WAY_WORDS, y => y + 500, x.w).forEach(th => { if (prev < th && x.w >= th) add(d, 'words', l, th); });
      prev = x.w;
    });
    const texts = (DB.texts || []).filter(x => x.lang === l).map(x => x.date).sort();
    if (texts.length) add(texts[0], 'text', l, 1);
    if (texts.length >= 10) add(texts[9], 'text', l, 10);
  });
  // Gespeicherte Etappen gehen vor: gleiche Kennung, früheres Datum bleibt
  const keep = new Set(stored.map(wayKey)), seen = new Set();
  const done = stored.map(e => Object.assign({}, e)).concat(ev.filter(e => !keep.has(wayKey(e))))
    .filter(e => { const k = wayKey(e); if (seen.has(k)) return false; seen.add(k); return true; })
    .map(e => Object.assign(e, wayLabel(e)));
  // Themen: Fehlerquote deutlich gesunken (gespeichert in DB.etap)
  const halves = {};
  (DB.etap || []).forEach(e => {
    if (!e || !e.d || !e.l || !e.k) return;
    const key = e.l + ':' + e.k, again = e.s === 1 && halves[key] > 0;
    if (e.s === 1) halves[key] = (halves[key] || 0) + 1;
    done.push({ d:e.d, ico:'topic', k:'topic', l:e.l, v:e.s, trap:e.k, i:e.i, b:e.b, c:e.c, t:topicMileText(e, again), st:e.s === 2 ? 'Thema sitzt' : again ? 'Fehler wieder halbiert' : 'Fehler halbiert' });
  });
  done.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);
  // Nächste Etappen: nach dem höchsten erreichten Stand, damit ein wieder herausgefallener Satz keine Etappe zweimal bringt
  const next = [];
  ['sv', 'es'].forEach(l => { if (!hiM[l] && !BANK[l].some(i => stOf(i.id))) return; const nx = MAT.find(x => x > hiM[l]), m = matureCount(l); if (nx) next.push({ ico:'mature', k:'mature', l, v:nx, t:wayLabel({ k:'mature', v:nx }).t, rest:`noch ${fmtN(Math.max(1, nx - m))}`, need:Math.max(1, nx - m), per:'mature' }); });
  // Serie und Aufgaben wie am Rundenende: die nächste Schwelle über dem bisher erreichten Stand
  if (doneDays.length) { const c = streak(), nx = STREAK[si], need = Math.max(1, nx - c); if (nx) next.push({ ico:'streak', k:'streak', v:nx, t:streakLabel(nx), rest:`noch ${fmtN(need)} ${need === 1 ? 'Tag' : 'Tage'}`, need, per:'day' }); }
  // Über dem höchsten erreichten Wert, auch wenn die Summe nach dem Zurücksetzen einer Sprache kleiner ist
  const reached = k => done.filter(e => e.k === k).reduce((m, e) => Math.max(m, e.v || 0), 0);
  const nt = ladder(WAY_TASKS, x => x + 25000, Math.max(T.n, reached('tasks'))).find(x => x > Math.max(T.n, reached('tasks')));
  next.push({ ico:'tasks', k:'tasks', v:nt, t:wayLabel({ k:'tasks', v:nt }).t, rest:`noch ${fmtN(nt - T.n)}`, need:nt - T.n, per:'n' });
  const hh = Math.max(T.secs / 3600, reached('hours')), nh = ladder(WAY_HOURS, x => x + 250, hh).find(x => x > hh);
  next.push({ ico:'time', k:'hours', v:nh, t:wayLabel({ k:'hours', v:nh }).t, rest:`noch ${fmtMin(Math.max(60, nh * 3600 - T.secs))}`, need:nh * 3600 - T.secs, per:'secs' });
  const dd = Math.max(T.dayCount, reached('days')), nd = ladder(WAY_DAYS, x => x + 500, dd).find(x => x > dd);
  // Übungstage: in Dein Weg erst, wenn höchstens 60 fehlen (far); am Rundenende immer
  next.push({ ico:'start', k:'days', v:nd, t:wayLabel({ k:'days', v:nd }).t, rest:`noch ${fmtN(nd - T.dayCount)}`, need:nd - T.dayCount, per:'active', far:nd - T.dayCount > 60 });
  return { done, next };
}
// Neu erreichte Etappen in DB.way festhalten (am Rundenende, beim Start und bevor Protokolltage herausfallen)
function persistWay(){
  const keep = new Set((DB.way || []).map(wayKey));
  const add = wayEvents().done.filter(e => e.k !== 'topic' && !keep.has(wayKey(e))).map(e => { const o = { d:e.d, k:e.k }; if (e.l) o.l = e.l; if (e.v != null) o.v = e.v; return o; });
  if (add.length) DB.way = (DB.way || []).concat(add);
}
// Kennung einer Etappe: Art, Sprache, Wert (bei Themen dazu Thema und Datum). Das Rundenende vergleicht die Kennungen vor und
// nach der Runde. WAY_V steht in offenen Runden, damit Kennungen einer älteren Fassung nicht verglichen werden.
const WAY_V = 2;
const wayKey = e => `${e.k}|${e.l || ''}|${e.v == null ? '' : e.v}${e.k === 'topic' ? `|${e.trap}|${e.i != null ? e.i : e.d}` : ''}`;
const wayKeys = () => wayEvents().done.map(wayKey);
// Rangfolge, wenn mehrere Etappen zusammenfallen: was über das Können spricht vor dem, was über Fleiß spricht
const WAY_PRIO = ['anchored', 'mature', 'topic', 'years', 'streak', 'words', 'text', 'own', 'hours', 'days', 'tasks', 'first'];
const wayPrio = e => { const i = WAY_PRIO.indexOf(e.k); return i < 0 ? 99 : i; };
// Die nächste Etappe derselben Art, mit Abstand („noch 15“); null, wo es keine nächste gibt. Gefestigt, Serie, Aufgaben, Stunden und
// Übungstage kommen aus wayEvents (über dem höchsten erreichten Stand): Am Rundenende steht dasselbe wie in Dein Weg und im Sprach-Tab.
const WAY_LADDER = ['mature', 'streak', 'tasks', 'hours', 'days'];
function wayNext(e){
  const l = e.l;
  if (WAY_LADDER.includes(e.k)) { const x = wayEvents().next.find(n => n.k === e.k && (n.l || '') === (l || '')); return x ? { t:x.t, rest:x.rest } : null; }
  const left = (nx, c, one, many) => `noch ${fmtN(nx - c)}${one ? ' ' + (nx - c === 1 ? one : many) : ''}`;
  switch (e.k) {
    case 'anchored': { const c = anchoredCount(l), nx = anchoredList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:anchoredLabel(nx), rest:`noch ${fmtN(Math.max(1, nx - c))}` } : null; }
    case 'words': { const c = vocabCount(l).all, nx = ladder(WAY_WORDS, y => y + 500, Math.max(c, e.v)).find(x => x > e.v); return { t:wayLabel({ k:'words', v:nx }).t, rest:left(nx, Math.min(c, nx - 1)) }; }
    // Nächste Halbierung nur bis 2 % Fehler: darunter bräuchte der Nachweis Tausende Aufgaben je Thema
    case 'topic': { const r = e.c && e.c[0] ? e.c[1] / e.c[0] / 2 : 0; return r >= 0.01 ? { t:topicMileText({ l, k:e.trap, s:1 }, true), rest:`auf unter ${pct(r, true)}` } : null; }
    case 'text': { if (e.v >= 10) return null; const c = (DB.texts || []).filter(x => x.lang === l).length; return { t:wayLabel({ k:'text', v:10 }).t, rest:left(10, Math.min(c, 9)) }; }
    case 'years': return { t:wayLabel({ k:'years', v:e.v + 1 }).t, rest:'in einem Jahr' };
    default: return null;
  }
}
// Dein Weg als Gleisplan: links Schwedisch, Mitte Gemeinsames (Serien, Aufgaben, Stunden), rechts Spanisch.
// Oben die nächsten Ziele als offene Punkte, das nächste direkt über „heute“, darunter grob, wann voraussichtlich. Darunter die
// letzten fünf Etappen einzeln, mit Abständen nach Zeit; ältere je Jahr gefaltet, die Faltung so hoch wie ihre Zeitspanne (bis
// 96 px) und mit Abständen davor und danach; ganz unten der Anfang: die Spuren laufen im Startpunkt zusammen, dazu „vor …“.
const WAY_LANES = ['sv', 'x', 'es'], WAY_DETAIL = 5;
// Abstand zwischen zwei Etappen: wächst mit dem Logarithmus der Zeit, gedeckelt. Gleicher Tag 0, 1 Tag 16 px, 3 Tage 32,
// 1 Woche 48, 1 Monat 79, 3 Monate 104, ab etwa 6 Monaten 120. Neben 34 px je Zeile liegen Tag, Woche und Monat sichtbar auseinander.
const wayGapPx = n => (n > 0 ? Math.min(120, Math.round(16 * Math.log2(1 + n))) : 0);
// Wie lange her, im Dativ, gerundet wie wayDur: gestern, vor 5 Tagen, vor 3 Wochen, vor 4 Monaten, vor 2,5 Jahren
function wayAgo(n){
  if (n <= 0) return 'heute';
  if (n === 1) return 'gestern';
  if (n < 14) return `vor ${n} Tagen`;
  if (n < 61) return `vor ${Math.round(n / 7)} Wochen`;
  if (n < 730) return `vor ${Math.round(n / 30.44)} Monaten`;
  return `vor ${String(Math.round(n / 36.5) / 10).replace('.', ',')} Jahren`;
}
// Voraussichtliches Eintreffen in Worten, grob: Serien stehen schon genau da („noch 6 Tage“), andere als „in etwa …“.
// Bis etwa ein Tag „beim nächsten Üben“: Ob heute schon geübt wurde, weiß die Schätzung nicht.
function wayEtaText(x){
  if (x.per === 'day' || !isFinite(x.eta)) return '';
  const r = Math.round(x.eta);
  if (r <= 1) return 'beim nächsten Üben';
  if (r < 14) return `in etwa ${r} Tagen`;
  if (r < 61) return `in etwa ${Math.round(r / 7)} Wochen`;
  if (r < 730) return `in etwa ${Math.round(r / 30.44)} Monaten`;
  return 'in über 2 Jahren';
}
const wayDays = n => `${fmtN(n)} ${n === 1 ? 'Tag' : 'Tage'}`;
// Dauer in Worten, gerundet: unter 2 Wochen in Tagen, dann in Wochen, ab 9 Wochen in Monaten, ab 2 Jahren in Jahren
function wayDur(n){
  if (n < 14) return wayDays(n);
  if (n < 61) return `${Math.round(n / 7)} Wochen`;
  if (n < 730) { const m = Math.round(n / 30.44); return `${m} ${m === 1 ? 'Monat' : 'Monate'}`; }
  return `${String(Math.round(n / 36.5) / 10).replace('.', ',')} Jahre`;
}
// Text unter einem Abstand: Dauer ab 2 Wochen, Pausen ab 3 Tagen ohne Üben; sonst nichts (die Höhe zeigt die Zeit)
function wayGapText(n, pause){
  if (pause && (pause >= n - 2 || (pause >= 21 ? wayDur(pause) : wayDays(pause)) === wayDur(n))) return `${wayDur(n)} Pause`;
  if (pause) return `${wayDur(n)}, davon ${pause >= 21 ? wayDur(pause) : wayDays(pause)} Pause`;
  return n >= 14 ? wayDur(n) : '';
}
const wayAct = { sv:d => (dayLog(d, 'sv').n || 0) > 0, es:d => (dayLog(d, 'es').n || 0) > 0, x:d => wayAct.sv(d) || wayAct.es(d) };
// Tage ohne Übung, mindestens 3 in Folge, zwischen older und newer (beide ausgeschlossen). Tage vor dem Protokoll (seit 24.63
// als Monatssumme archiviert) sind unbekannt und zählen nicht als Pause.
function wayRuns(older, newer, act, from){
  const out = []; let run = null;
  for (let x = addDays(older, 1); x < newer; x = addDays(x, 1)) {
    if (x >= from && !act(x)) { if (!run) run = { a:x, b:x, n:0 }; run.b = x; run.n++; }
    else { if (run && run.n >= 3) out.push(run); run = null; }
  }
  if (run && run.n >= 3) out.push(run);
  return out;
}
// Datum einer Etappe, im laufenden Jahr ohne Jahreszahl
// Voraussichtliche Tage bis zur nächsten Etappe, nur für die Reihenfolge (angezeigt wird weiter „noch 13“).
// Aufgaben, Zeit und Übungstage nach dem Tempo der letzten 14 Tage (in den ersten Tagen seit dem Anfang); Serien nach Kalender;
// gefestigte Sätze nach den Fälligkeiten der Sätze, die beim nächsten Richtigen die 21 Tage erreichen, mit 90 % Behalten.
function wayEta(x){
  if (x.per === 'day') return x.need;
  if (x.per === 'mature') {
    const due = [];
    BANK[x.l].forEach(i => { const st = stOf(i.id); if (!st || !st.due || (st.ivl || 0) >= MATURE) return; const d = st.due < today() ? today() : st.due; if (FSRS.review(st, 3, d, true).ivl >= MATURE) due.push(d); });
    due.sort(); const k = Math.ceil(x.need / 0.9) - 1;
    return k < due.length ? Math.max(0, dayDiff(due[k], today())) : Infinity;
  }
  const first = Object.keys(DB.log || {}).filter(d => wayAct.x(d)).sort()[0];
  const win = first ? Math.max(1, Math.min(14, dayDiff(today(), first) + 1)) : 14;
  let sum = 0;
  for (let k = 0; k < win; k++) { const d = addDays(today(), -k); sum += x.per === 'active' ? (wayAct.x(d) ? 1 : 0) : ['sv', 'es'].reduce((a, l) => a + (dayLog(d, l)[x.per] || 0), 0); }
  return sum > 0 ? x.need / (sum / win) : Infinity;
}
function wayHtml(){
  const w = wayEvents(); if (!w.done.length) return '';
  const firstOf = l => { const d = Object.keys(DB.log || {}).filter(x => (dayLog(x, l).n || 0) > 0).sort()[0], e = (w.done.find(x => x.l === l) || {}).d; return [d, e].filter(Boolean).sort()[0] || null; };
  const start = { sv:firstOf('sv'), es:firstOf('es'), x:w.done[0].d };
  const lanes = WAY_LANES.filter(k => start[k]), RW = lanes.length * 16, LX = k => 8 + lanes.indexOf(k) * 16;
  const logFrom = Object.keys(DB.log || {}).sort()[0] || today();
  const langTag = l => (l ? ` <span class="wl-lang">${LANG[l].deName}</span>` : '');
  const rail = (lane, d, open) => `<span class="rail" style="grid-template-columns:repeat(${lanes.length}, 16px)" aria-hidden="true">${lanes.map(k => `<span class="rl rl-${k}${d == null || d >= start[k] ? ' on' : ''}">${k === lane ? `<i class="${open ? 'open' : ''}"></i>` : ''}</span>`).join('')}</span>`;
  const seg = (k, y0, y1, dash) => (y1 - y0 < 0.5 ? '' : `<line x1="${LX(k)}" x2="${LX(k)}" y1="${y0.toFixed(1)}" y2="${y1.toFixed(1)}" class="wg-l wg-${k}${dash ? ' wg-dash' : ''}"/>`);
  const anim = S.wayAnim; S.wayAnim = null;
  const row = (e, cls) => `<li class="wl${cls || ''}">${rail(e.l || 'x', e.d)}<span class="tl-t">${esc(e.t)}${langTag(e.l)}</span><span class="tl-d">${fmtDM(e.d)}</span></li>`;
  // Zeit zwischen zwei Etappen: Höhe nach Zeit, innen tagesgenau. Spuren gestrichelt, wo eine Sprache (Mitte: beide) mindestens
  // 3 Tage ruhte; ein Jahreswechsel als Trennlinie über die ganze Breite wie „heute“, darunter das ältere Jahr.
  // Spuren zwischen newer und older auf h Pixeln: gestrichelt in Pausen, eine später begonnene Sprache zweigt ab
  const tracks = (newer, older, h, runs) => {
    const n = Math.max(1, dayDiff(newer, older)), edge = d => (dayDiff(newer, d) + 0.5) * h / n;
    let svg = '';
    lanes.forEach(k => {
      if (start[k] > newer) return;
      const end = start[k] > older ? edge(start[k]) : h; let y = 0;
      runs[k].forEach(r => { const y0 = edge(r.b) - h / n, y1 = Math.min(end, edge(r.a)); svg += seg(k, y, y0) + seg(k, y0, y1, true); y = y1; });
      svg += seg(k, y, end);
      // Eine später begonnene Sprache zweigt von der gemeinsamen Spur ab, wie ein Gleis an einer Weiche
      if (k !== 'x' && start.x && start[k] > older && start.x < start[k] && lanes.includes('x')) {
        const y2 = Math.min(h, end + 14);
        svg += `<path d="M${LX(k)} ${end.toFixed(1)} C${LX(k)} ${((end + y2) / 2).toFixed(1)} ${LX('x')} ${((end + y2) / 2).toFixed(1)} ${LX('x')} ${y2.toFixed(1)}" class="wg-l wg-${k} wg-br" fill="none"/>`;
      }
    });
    return { svg, edge };
  };
  const gap = (newer, older, cls) => {
    const n = dayDiff(newer, older); if (n <= 0) return '';
    const runs = {}; lanes.forEach(k => { runs[k] = wayRuns(older, newer, wayAct[k], logFrom); });
    const pause = (runs.x || wayRuns(older, newer, wayAct.x, logFrom)).reduce((a, r) => a + r.n, 0);
    const txt = wayGapText(n, pause), jan = Number(newer.slice(0, 4)) > Number(older.slice(0, 4)) ? newer.slice(0, 4) + '-01-01' : null;
    let h = wayGapPx(n); if (txt) h = Math.max(h, 22); if (jan) h = Math.max(h, 46);
    const { svg, edge } = tracks(newer, older, h, runs);
    let yr = '', ty = h / 2;
    if (jan) {
      const y = Math.max(16, Math.min(h - 16, edge(jan)));
      yr = `<span class="wg-yr" style="top:${y.toFixed(1)}px"><b style="left:${RW + 10}px">${Number(jan.slice(0, 4)) - 1}</b></span>`;
      ty = y > h - y ? y / 2 : (y + h) / 2;
    }
    return `<li class="wl wgap${cls || ''}" style="height:${h}px"><svg class="wg-svg" width="${RW}" height="${h}" aria-hidden="true">${svg}</svg>${yr}${txt ? `<span class="wg-t" style="top:${(ty - 8).toFixed(1)}px">${txt}</span>` : ''}</li>`;
  };
  // Nächste Ziele: das voraussichtlich nächste unten, direkt über „heute“
  const next = w.next.filter(x => !x.far && lanes.includes(x.l || 'x')).map(x => Object.assign({ eta:wayEta(x) }, x)).sort((a, b) => (a.eta === b.eta ? 0 : a.eta < b.eta ? 1 : -1));
  // Unter dem Ziel grob, wann es so weit ist (geschätzt; Serien stehen mit „noch 6 Tage“ schon genau da)
  let html = next.map(x => { const et = wayEtaText(x); return `<li class="wl wl-next">${rail(x.l || 'x', null, true)}<span class="tl-t">${esc(x.t)}${langTag(x.l)}${et ? `<span class="tl-s">${et}</span>` : ''}</span><span class="tl-d">${esc(x.rest)}</span></li>`; }).join('');
  html += `<li class="wl wtoday">${rail(null, today())}<span class="wt-t">heute</span></li>`;
  // Erreichte Etappen: die letzten fünf einzeln. Etappen eines Tages bleiben zusammen, auch wenn es dann sechs oder sieben sind.
  // Ältere je Jahr gefaltet; sind es insgesamt oder in einem Jahr höchstens zwei, stehen sie gleich da.
  const anchor = w.done[0].k === 'first' ? w.done[0] : null, body = anchor ? w.done.slice(1) : w.done.slice();
  let cut = Math.max(0, body.length - WAY_DETAIL);
  while (cut > 0 && body[cut - 1].d === body[cut].d) cut--;
  if (cut <= 2) cut = 0;
  let prev = today();
  const run = (items, cls) => items.slice().reverse().forEach(e => { if (prev) html += gap(prev, e.d, cls); html += row(e, cls); prev = e.d; });
  run(body.slice(cut));
  const folded = body.slice(0, cut), open = S.wayOpen || {};
  [...new Set(folded.map(e => e.d.slice(0, 4)))].sort().reverse().forEach(y => {
    const items = folded.filter(e => e.d.startsWith(y)), isOpen = !!open[y];
    // Ein Jahr mit höchstens zwei Etappen braucht keine Faltung
    if (items.length <= 2) { run(items); return; }
    const ms = items.map(e => dateOf(e.d).getMonth()), m0 = Math.min(...ms), m1 = Math.max(...ms);
    const label = m0 === 0 && m1 === 11 ? y : m0 === m1 ? `${MONTHS_FULL[m0]} ${y}` : `${MONTHS[m0]} – ${MONTHS[m1]} ${y}`;
    // Punkte auf den Spuren zeigen, wo etwas gefaltet ist: einer für 1 bis 2 Etappen, zwei bis 5, drei darüber
    const cnt = {}; items.forEach(e => { const k = e.l || 'x'; cnt[k] = (cnt[k] || 0) + 1; });
    const newest = items[items.length - 1].d, oldest = items[0].d, H = Math.max(54, Math.min(96, wayGapPx(dayDiff(newest, oldest))));
    if (prev) html += gap(prev, newest);
    // Die Spuren laufen durch die gefaltete Zeit, gestrichelt in Pausen; geöffnet stehen die Etappen selbst da
    const fr = {}; lanes.forEach(k => { fr[k] = isOpen ? [] : wayRuns(oldest, newest, wayAct[k], logFrom); });
    let svg = isOpen ? lanes.map(k => (start[k] <= newest ? seg(k, 0, H) : '')).join('') : tracks(newest, oldest, H, fr).svg;
    if (!isOpen) lanes.forEach(k => { const c = cnt[k] >= 6 ? 3 : cnt[k] >= 3 ? 2 : cnt[k] ? 1 : 0; for (let j = 0; j < c; j++) svg += `<circle cx="${LX(k)}" cy="${(H / 2 + (j - (c - 1) / 2) * 7).toFixed(1)}" r="2.6" class="wf-dot wf-${k}"/>`; });
    html += `<li class="wl wfold${isOpen ? ' open' : ''}" style="height:${H}px"><svg class="wg-svg" width="${RW}" height="${H}" aria-hidden="true">${svg}</svg><button type="button" class="wf-b" data-a="wayfold" data-y="${y}" aria-expanded="${isOpen}"><span class="wf-t">${label}</span><span class="wf-n">${items.length} Etappen</span><svg class="wf-ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></li>`;
    prev = isOpen ? null : oldest;
    if (isOpen) run(items, anim === y ? ' wl-in' : '');
  });
  if (anchor) {
    if (prev) html += gap(prev, anchor.d);
    // Der Anfang: Die Spuren, die an diesem Tag beginnen, laufen im Startpunkt zusammen; dazu, wie lange es her ist
    const SH = 48, cy = SH / 2, here = lanes.filter(k => start[k] === anchor.d);
    const lines = here.map(k => (k === 'x' ? `<line x1="${LX(k)}" x2="${LX(k)}" y1="0" y2="${cy}" class="wg-l wg-x"/>` : `<path d="M${LX(k)} 0 C${LX(k)} ${cy * 0.55} ${LX('x')} ${cy * 0.45} ${LX('x')} ${cy}" class="wg-l wg-${k}" fill="none"/>`)).join('');
    const d = dateOf(anchor.d), full = `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    html += `<li class="wl wstart" style="height:${SH}px"><svg class="wg-svg" width="${RW}" height="${SH}" aria-hidden="true">${lines}<circle cx="${LX('x')}" cy="${cy}" r="10.5" class="ws-ring"/><circle cx="${LX('x')}" cy="${cy}" r="6.5" class="ws-dot"/></svg><span class="tl-t"><span class="ws-t">${esc(anchor.t)}</span><span class="tl-s">${wayAgo(dayDiff(today(), anchor.d))}</span></span><span class="tl-d">${full}</span></li>`;
  }
  return `<h2 class="grp" id="way">Dein Weg</h2><div class="chart way">
    <p class="legend wleg">${lanes.map(k => `<span><i class="sq rl-${k}-sq"></i>${k === 'x' ? 'gemeinsam' : LANG[k].deName}</span>`).join('')}</p>
    <ol class="wrail">${html}</ol>
  </div>`;
}
// Jahr für Jahr: Übungstage, Zeit, Aufgaben, längste Serie, stärkster Monat, je Sprache neue und gefestigte Sätze
function longestRun(from, to){
  let best = 0;
  streakWalk(from, to, (d, c) => { best = Math.max(best, c); });
  return best;
}
function yearStats(){
  const by = {};
  Object.keys(DB.log || {}).forEach(d => {
    const y = d.slice(0, 4), Y = by[y] = by[y] || { y, days:0, done:0, secs:0, n:0, sv:{ fresh:0, mat:0, secs:0, n:0 }, es:{ fresh:0, mat:0, secs:0, n:0 }, months:{} };
    let any = false;
    ['sv', 'es'].forEach(l => { const x = dayLog(d, l); if (x.n) any = true; ['fresh', 'mat', 'secs', 'n'].forEach(k => { Y[l][k] += x[k] || 0; }); Y.secs += x.secs || 0; Y.n += x.n || 0; });
    if (any) { Y.days++; const m = d.slice(5, 7); Y.months[m] = (Y.months[m] || 0) + (dayLog(d, 'sv').secs || 0) + (dayLog(d, 'es').secs || 0); }
  });
  const AM = (DB.logArch && DB.logArch.m) || {};
  Object.keys(AM).forEach(ym => {
    const y = ym.slice(0, 4), Y = by[y] = by[y] || { y, days:0, done:0, secs:0, n:0, sv:{ fresh:0, mat:0, secs:0, n:0 }, es:{ fresh:0, mat:0, secs:0, n:0 }, months:{} }, M = AM[ym];
    Y.days += M.days || 0;
    ['sv', 'es'].forEach(l => { const x = M[l] || {}; ['fresh', 'mat', 'secs', 'n'].forEach(k => { Y[l][k] += x[k] || 0; }); Y.secs += x.secs || 0; Y.n += x.n || 0; Y.months[ym.slice(5)] = (Y.months[ym.slice(5)] || 0) + (x.secs || 0); });
  });
  Object.keys(DB.done || {}).forEach(d => { if (DB.done[d] && by[d.slice(0, 4)]) by[d.slice(0, 4)].done++; });
  const t = today();
  return Object.values(by).filter(Y => Y.days).sort((a, b) => b.y - a.y).map(Y => {
    const end = Y.y === t.slice(0, 4) ? t : `${Y.y}-12-31`;
    const top = Object.entries(Y.months).sort((a, b) => b[1] - a[1])[0];
    return Object.assign(Y, { run:longestRun(`${Y.y}-01-01`, end), topMonth:top ? Number(top[0]) - 1 : null, topSecs:top ? top[1] : 0, current:Y.y === t.slice(0, 4) });
  });
}
function yearsHtml(){
  // Erst ab dem zweiten Jahr: Im ersten stünden dieselben Zahlen wie in der Kopfkarte (Übungstage, Minuten, Serie, Tagwerke je Sprache)
  const ys = yearStats(); if (ys.length < 2) return '';
  const card = Y => {
    const langs = ['sv', 'es'].filter(l => Y[l].n);
    return `<div class="ycard"><p class="y-h">${Y.y}${Y.current ? ' <span class="dim">bisher</span>' : ''}</p>
      <div class="kpis yk"><div><b>${Y.days}</b><span>Übungstage${Y.done ? `, ${Y.done} mit Tagwerk` : ''}</span></div><div><b>${bigTime(Y.secs)[0]}</b><span>${bigTime(Y.secs)[1]} gelernt</span></div><div><b>${Y.run}</b><span>Tage längste Serie</span></div></div>
      ${(inMin => langs.map(l => `<p class="y-l"><span class="sq rl-${l}-sq"></span><b>${LANG[l].deName}</b> ${tagwerkCount(l, Y.y + '-01-01', Y.y + '-12-31').toLocaleString('de-DE')} Tagwerke, ${Y[l].fresh.toLocaleString('de-DE')} neue Sätze, ${Y[l].mat.toLocaleString('de-DE')} gefestigt, ${Y[l].n.toLocaleString('de-DE')} Aufgaben, ${fmtMin(Y[l].secs, inMin)}</p>`).join('') + (Y.topMonth != null && Y.days >= 20 ? `<p class="legend mt-8">Stärkster Monat: ${MONTHS_FULL[Y.topMonth]} mit ${fmtMin(Y.topSecs, inMin)}</p>` : ''))(bigTime(Y.secs)[1] !== 'Stunden')}</div>`;
  };
  return `<h2 class="grp">Jahr für Jahr</h2><div class="ygrid">${ys.map(card).join('')}</div>`;
}
// Themenraster: je Thema geübt und gefestigt (Balken hell und dunkel, beide Zahlen benannt) und Veränderung seit etwa 30 Tagen
function topicGridHtml(lang){
  const ago = snapAgo(lang, 30);
  const tiles = TRAPS[lang].filter(tr => tr.kind !== 'gen').map(tr => {
    const items = BANK[lang].filter(i => i.trap === tr.id); if (!items.length) return '';
    const seen = items.filter(i => stOf(i.id)).length, mat = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length;
    const d = ago && ago.t ? mat - (ago.t[tr.id] || 0) : null;
    return `<button type="button" class="tg${seen ? '' : ' tg-new'}" data-a="topic" data-t="${tr.id}"><span class="tg-l">${esc(keepHyph(tr.label))}</span><span class="tg-b" aria-hidden="true"><span style="width:${Math.round(seen / items.length * 100)}%" class="tg-seen"></span><span style="width:${Math.round(mat / items.length * 100)}%" class="tg-mat"></span></span><span class="tg-n">${seen ? `${seen} geübt · ${mat} gefestigt` : `${items.length} Sätze, neu`}${d ? ` <span class="tg-d">+${d}</span>` : ''}</span></button>`;
  }).join('');
  return `<h2 class="grp">Themen</h2><div class="tgrid">${tiles}</div><p class="legend below"><span class="sq tg-mat-sq"></span>gefestigt <span class="sq tg-seen-sq"></span>geübt${ago && ago.t ? ' · grüne Zahl: mehr gefestigt als vor 30 Tagen' : ''}. Tipp auf ein Thema für Regel, Beispiele und Zahlen.</p>`;
}
