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
// Fehlerquote als Prozent, unter 10 % mit einer Nachkommastelle
const fmtPct = r => (r < 0.1 && r > 0 ? (Math.round(r * 1000) / 10).toLocaleString('de-DE') : String(Math.round(r * 100))) + ' %';
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
// Summen über die ganze Zeit: Protokoll plus die Tage, die schon herausgefallen sind
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
  ['sv', 'es'].forEach(l => { if (!BANK[l].some(i => stOf(i.id))) return; const nx = MAT.find(x => x > hiM[l]), m = matureCount(l); if (nx) next.push({ ico:'mature', k:'mature', l, t:wayLabel({ k:'mature', v:nx }).t, rest:`noch ${fmtN(Math.max(1, nx - m))}` }); });
  // Serie und Aufgaben wie am Rundenende: die nächste Schwelle über dem bisher erreichten Stand
  if (doneDays.length) { const c = streak(), nx = STREAK[si]; if (nx) next.push({ ico:'streak', k:'streak', t:streakLabel(nx), rest:`noch ${fmtN(Math.max(1, nx - c))} ${nx - c === 1 ? 'Tag' : 'Tage'}` }); }
  // Über dem höchsten erreichten Wert, auch wenn die Summe nach dem Zurücksetzen einer Sprache kleiner ist
  const reached = k => done.filter(e => e.k === k).reduce((m, e) => Math.max(m, e.v || 0), 0);
  const nt = ladder(WAY_TASKS, x => x + 25000, Math.max(T.n, reached('tasks'))).find(x => x > Math.max(T.n, reached('tasks')));
  next.push({ ico:'tasks', k:'tasks', t:wayLabel({ k:'tasks', v:nt }).t, rest:`noch ${fmtN(nt - T.n)}` });
  const hh = Math.max(T.secs / 3600, reached('hours')), nh = ladder(WAY_HOURS, x => x + 250, hh).find(x => x > hh);
  next.push({ ico:'time', k:'hours', t:wayLabel({ k:'hours', v:nh }).t, rest:`noch ${fmtMin(nh * 3600 - T.secs).replace(/\.$/, '')}` });
  const dd = Math.max(T.dayCount, reached('days')), nd = ladder(WAY_DAYS, x => x + 500, dd).find(x => x > dd);
  if (nd - T.dayCount <= 60) next.push({ ico:'start', k:'days', t:wayLabel({ k:'days', v:nd }).t, rest:`noch ${nd - T.dayCount}` });
  return { done, next };
}
// Neu erreichte Etappen in DB.way festhalten (am Rundenende, beim Start und bevor Protokolltage herausfallen)
function persistWay(){
  const keep = new Set((DB.way || []).map(wayKey));
  const add = wayEvents().done.filter(e => e.k !== 'topic' && !keep.has(wayKey(e))).map(e => { const o = { d:e.d, k:e.k }; if (e.l) o.l = e.l; if (e.v != null) o.v = e.v; return o; });
  if (add.length) DB.way = (DB.way || []).concat(add);
}
// Kennung einer Etappe: Art, Sprache, Wert (bei Themen dazu Thema und Datum). Das Rundenende vergleicht die Kennungen vor und
// nach der Runde (seit 24.63). WAY_V steht in offenen Runden, damit Kennungen einer älteren Fassung nicht verglichen werden.
const WAY_V = 2;
const wayKey = e => `${e.k}|${e.l || ''}|${e.v == null ? '' : e.v}${e.k === 'topic' ? `|${e.trap}|${e.i != null ? e.i : e.d}` : ''}`;
const wayKeys = () => wayEvents().done.map(wayKey);
// Rangfolge, wenn mehrere Etappen zusammenfallen: was über das Können spricht vor dem, was über Fleiß spricht
const WAY_PRIO = ['anchored', 'mature', 'topic', 'years', 'streak', 'words', 'text', 'own', 'hours', 'days', 'tasks', 'first'];
const wayPrio = e => { const i = WAY_PRIO.indexOf(e.k); return i < 0 ? 99 : i; };
// Die nächste Etappe derselben Art, mit Abstand („noch 15“); null, wo es keine nächste gibt
function wayNext(e){
  const l = e.l, T = lifeTotals();
  const left = (nx, c, one, many) => `noch ${fmtN(nx - c)}${one ? ' ' + (nx - c === 1 ? one : many) : ''}`;
  switch (e.k) {
    case 'mature': { const c = matureCount(l), nx = milestoneList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:wayLabel({ k:'mature', v:nx }).t, rest:`noch ${fmtN(Math.max(1, nx - c))}` } : null; }
    case 'anchored': { const c = anchoredCount(l), nx = anchoredList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:anchoredLabel(nx), rest:`noch ${fmtN(Math.max(1, nx - c))}` } : null; }
    case 'streak': { const c = streak(), nx = streakList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:streakLabel(nx), rest:left(nx, Math.min(c, nx - 1), 'Tag', 'Tage') } : null; }
    case 'words': { const c = vocabCount(l).all, nx = ladder(WAY_WORDS, y => y + 500, Math.max(c, e.v)).find(x => x > e.v); return { t:wayLabel({ k:'words', v:nx }).t, rest:left(nx, Math.min(c, nx - 1)) }; }
    case 'tasks': { const c = T.n, nx = ladder(WAY_TASKS, x => x + 25000, Math.max(c, e.v)).find(x => x > e.v); return { t:wayLabel({ k:'tasks', v:nx }).t, rest:left(nx, Math.min(c, nx - 1)) }; }
    case 'hours': { const c = T.secs, nx = ladder(WAY_HOURS, x => x + 250, Math.max(c / 3600, e.v)).find(x => x > e.v); return { t:wayLabel({ k:'hours', v:nx }).t, rest:`noch ${fmtMin(Math.max(60, nx * 3600 - c)).replace(/\.$/, '')}` }; }
    case 'days': { const c = T.dayCount, nx = ladder(WAY_DAYS, x => x + 500, Math.max(c, e.v)).find(x => x > e.v); return { t:wayLabel({ k:'days', v:nx }).t, rest:left(nx, Math.min(c, nx - 1)) }; }
    // Nächste Halbierung nur bis 2 % Fehler: darunter bräuchte der Nachweis Tausende Aufgaben je Thema
    case 'topic': { const r = e.c && e.c[0] ? e.c[1] / e.c[0] / 2 : 0; return r >= 0.01 ? { t:topicMileText({ l, k:e.trap, s:1 }, true), rest:`auf unter ${fmtPct(r)}` } : null; }
    case 'text': { if (e.v >= 10) return null; const c = (DB.texts || []).filter(x => x.lang === l).length; return { t:wayLabel({ k:'text', v:10 }).t, rest:left(10, Math.min(c, 9)) }; }
    case 'years': return { t:wayLabel({ k:'years', v:e.v + 1 }).t, rest:'in einem Jahr' };
    default: return null;
  }
}
// Dein Weg als Gleisplan: links Schwedisch, Mitte Gemeinsames (Serien, Aufgaben, Stunden), rechts Spanisch.
// Gleiche Zeitachse für alle drei Spuren, so sieht man parallelen und unterschiedlichen Fortschritt. Oben die nächsten Ziele als offene Punkte.
const WAY_LANES = ['sv', 'x', 'es'];
function wayHtml(){
  const w = wayEvents(); if (!w.done.length) return '';
  const firstOf = l => { const d = Object.keys(DB.log || {}).filter(x => (dayLog(x, l).n || 0) > 0).sort()[0], e = (w.done.find(x => x.l === l) || {}).d; return [d, e].filter(Boolean).sort()[0] || null; };
  const start = { sv:firstOf('sv'), es:firstOf('es'), x:w.done[0].d };
  const lanes = WAY_LANES.filter(k => start[k]);
  const all = !!S.wayAll, list = all ? w.done.slice().reverse() : w.done.slice(-6).reverse();
  const fmtD = d => { const x = dateOf(d); return `${x.getDate()}. ${MONTHS[x.getMonth()]} ${x.getFullYear()}`; };
  const rail = (lane, d, open) => `<span class="rail" style="grid-template-columns:repeat(${lanes.length}, 16px)" aria-hidden="true">${lanes.map(k => `<span class="rl rl-${k}${d == null || d >= start[k] ? ' on' : ''}">${k === lane ? `<i class="${open ? 'open' : ''}"></i>` : ''}</span>`).join('')}</span>`;
  const label = k => (k === 'x' ? 'gemeinsam' : LANG[k].deName);
  const nextRows = w.next.filter(x => lanes.includes(x.l || 'x')).map(x => `<li class="wl wl-next">${rail(x.l || 'x', null, true)}<span class="tl-t">${esc(x.t)}${x.l ? ` <span class="wl-lang">${LANG[x.l].deName}</span>` : ''}</span><span class="tl-d">${esc(x.rest)}</span></li>`).join('');
  let prevY = null;
  const rows = list.map(x => {
    const y = x.d.slice(0, 4), sep = y !== prevY && (prevY !== null || y !== today().slice(0, 4)) ? `<li class="wl wy">${rail(null, x.d)}<span class="wy-t">${y}</span><span></span></li>` : '';
    prevY = y;
    return sep + `<li class="wl">${rail(x.l || 'x', x.d)}<span class="tl-t">${esc(x.t)}${x.l ? ` <span class="wl-lang">${LANG[x.l].deName}</span>` : ''}</span><span class="tl-d">${fmtD(x.d)}</span></li>`;
  }).join('');
  return `<h2 class="grp" id="way">Dein Weg</h2><div class="chart way">
    <p class="legend wleg">${lanes.map(k => `<span><i class="sq rl-${k}-sq"></i>${label(k)}</span>`).join('')}</p>
    <ol class="wrail">${nextRows}${rows}</ol>
    ${w.done.length > 6 ? `<button type="button" class="link" data-a="wayall">${all ? 'Weniger zeigen' : `Ganzen Weg zeigen (${w.done.length} Etappen)`}</button>` : ''}
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
  const ys = yearStats(); if (!ys.length || (ys.length === 1 && ys[0].days < 30)) return '';
  const card = Y => {
    const langs = ['sv', 'es'].filter(l => Y[l].n);
    return `<div class="ycard"><p class="y-h">${Y.y}${Y.current ? ' <span class="dim">bisher</span>' : ''}</p>
      <div class="kpis yk"><div><b>${Y.days}</b><span>Übungstage${Y.done ? `, ${Y.done} mit Tagwerk` : ''}</span></div><div><b>${bigTime(Y.secs)[0]}</b><span>${bigTime(Y.secs)[1]} gelernt</span></div><div><b>${Y.run}</b><span>Tage längste Serie</span></div></div>
      ${langs.map(l => `<p class="y-l"><span class="sq rl-${l}-sq"></span><b>${LANG[l].deName}</b> ${tagwerkCount(l, Y.y + '-01-01', Y.y + '-12-31').toLocaleString('de-DE')} Tagwerke, ${Y[l].fresh.toLocaleString('de-DE')} neue Sätze, ${Y[l].mat.toLocaleString('de-DE')} gefestigt, ${Y[l].n.toLocaleString('de-DE')} Aufgaben, ${fmtMin(Y[l].secs)}</p>`).join('')}
      ${Y.topMonth != null && Y.days >= 20 ? `<p class="legend" style="margin-top:6px">Stärkster Monat: ${MONTHS_FULL[Y.topMonth]} mit ${fmtMin(Y.topSecs)}</p>` : ''}</div>`;
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
    return `<button type="button" class="tg${seen ? '' : ' tg-new'}" data-a="topic" data-t="${tr.id}"><span class="tg-l">${esc(tr.label)}</span><span class="tg-b" aria-hidden="true"><span style="width:${Math.round(seen / items.length * 100)}%" class="tg-seen"></span><span style="width:${Math.round(mat / items.length * 100)}%" class="tg-mat"></span></span><span class="tg-n">${seen ? `${seen} geübt · ${mat} gefestigt` : `${items.length} Sätze, neu`}${d ? ` <span class="tg-d">+${d}</span>` : ''}</span></button>`;
  }).join('');
  return `<h2 class="grp">Themen</h2><div class="tgrid">${tiles}</div><p class="legend" style="margin:8px 4px 0"><span class="sq tg-mat-sq"></span>gefestigt <span class="sq tg-seen-sq"></span>geübt${ago && ago.t ? ' · grüne Zahl: mehr gefestigt als vor 30 Tagen' : ''}. Antippen für Regel und Beispiele.</p>`;
}
