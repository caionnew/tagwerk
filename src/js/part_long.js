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
const topicMileText = e => { const tr = trapMeta(e.l, e.k); const lb = tr ? tr.label : e.k; return e.s === 2 ? `„${lb}“ sitzt` : `„${lb}“: Fehler halbiert`; };
// Gefestigt je Sprache und Tag: der Bestand am Tagesende (Protokoll mc, seit 24.63), für ältere Tage die Zahl der erstmals gefestigten Sätze
function matureByDay(days, l){
  const out = {}; let cum = 0, last = null;
  days.forEach(d => { const x = dayLog(d, l); cum += x.mat || 0; if (x.mc != null) last = x.mc; out[d] = last != null ? last : cum; });
  return out;
}
// Höchster Stand an gefestigten Sätzen: Eine Etappe bleibt erreicht, auch wenn später ein Satz wieder herausfällt
function matureHigh(l){
  const days = Object.keys(DB.log || {}).sort(), by = matureByDay(days, l);
  return Math.max(matureCount(l), ...Object.values(by), 0);
}
function wayEvents(){
  const ev = [], days = Object.keys(DB.log || {}).filter(d => ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0)).sort();
  if (!days.length) return { done:[], next:[] };
  ev.push({ d:days[0], ico:'start', k:'first', t:'Erster Übungstag' });
  // Gesamtwerte vorab, damit die Schwellenlisten lang genug sind
  const sumAll = k => days.reduce((a, d) => a + (dayLog(d, 'sv')[k] || 0) + (dayLog(d, 'es')[k] || 0), 0);
  const allN = sumAll('n'), allSecs = sumAll('secs');
  const TASKS = ladder(WAY_TASKS, x => x + 25000, allN), HOURS = ladder(WAY_HOURS, x => x + 250, allSecs / 3600);
  const matBy = { sv:matureByDay(days, 'sv'), es:matureByDay(days, 'es') };
  const MAT = milestoneList(Math.max(matureCount('sv'), matureCount('es'), ...Object.values(matBy.sv), ...Object.values(matBy.es)));
  const ANC = anchoredList(Math.max(anchoredCount('sv'), anchoredCount('es')));
  const DAYS = ladder(WAY_DAYS, x => x + 500, days.length);
  days.forEach((d, i) => { const k = DAYS.indexOf(i + 1); if (k >= 0) ev.push({ d, ico:'start', k:'days', v:i + 1, t:`${fmtN(i + 1)} Übungstage` }); });
  // Jahrestage seit dem ersten Übungstag
  for (let y = 1; ; y++) { const [Y, M, D] = days[0].split('-'); const ad = `${Number(Y) + y}-${M}-${D}`; if (ad > today()) break; ev.push({ d:ad, ico:'start', k:'years', v:y, t:`${y} ${y === 1 ? 'Jahr' : 'Jahre'} mit Tagwerk` }); }
  let n = 0, secs = 0; const ti = { i:0 }, hi = { i:0 }, mi = { sv:0, es:0 }, ai = { sv:0, es:0 }, anc = { sv:0, es:0 };
  days.forEach(d => {
    ['sv', 'es'].forEach(l => {
      const x = dayLog(d, l); n += x.n || 0; secs += x.secs || 0;
      while (mi[l] < MAT.length && matBy[l][d] >= MAT[mi[l]]) { ev.push({ d, ico:'mature', k:'mature', l, v:MAT[mi[l]], t:`${fmtN(MAT[mi[l]])} gefestigte Sätze` }); mi[l]++; }
      if (x.mc != null) anc[l] = x.ac || 0;
      while (ai[l] < ANC.length && anc[l] >= ANC[ai[l]]) { ev.push({ d, ico:'anchored', k:'anchored', l, v:ANC[ai[l]], t:anchoredLabel(ANC[ai[l]]) }); ai[l]++; }
    });
    while (ti.i < TASKS.length && n >= TASKS[ti.i]) { ev.push({ d, ico:'tasks', k:'tasks', v:TASKS[ti.i], t:`${fmtN(TASKS[ti.i])} Aufgaben` }); ti.i++; }
    while (hi.i < HOURS.length && secs >= HOURS[hi.i] * 3600) { ev.push({ d, ico:'time', k:'hours', v:HOURS[hi.i], t:`${fmtN(HOURS[hi.i])} ${HOURS[hi.i] === 1 ? 'Stunde' : 'Stunden'} geübt` }); hi.i++; }
  });
  // Serien nach derselben Regel wie die Serienanzeige: ein Pausetag pro Woche unterbricht nicht
  const doneDays = Object.keys(DB.done || {}).filter(d => DB.done[d]).sort();
  if (doneDays.length) {
    const STREAK = streakList(doneDays.length + 7);
    let streak = 0, misses = [], si = 0, d = doneDays[0];
    const end = today();
    while (d <= end) {
      if (DB.done[d]) { streak++; while (streak >= STREAK[si]) { ev.push({ d, ico:'streak', k:'streak', v:STREAK[si], t:streakLabel(STREAK[si]) }); si++; } }
      else if (d !== end) {
        misses = misses.filter(m => dayDiff(d, m) < 7);
        if (misses.length) { streak = 0; misses = []; } else misses.push(d);
      }
      d = addDays(d, 1);
    }
  }
  ['sv', 'es'].forEach(l => {
    const firstOwn = (DB.own[l] || []).filter(o => o.created).map(o => o.created).sort()[0];
    if (firstOwn) ev.push({ d:firstOwn, ico:'own', k:'own', l, t:'Erster eigener Satz' });
    // Wortschatz erst seit den erweiterten Tagesständen. Nur Schwellen, die zwischen zwei Erfassungen überschritten wurden;
    // was schon beim ersten Erfassen erreicht war, hat kein bekanntes Datum.
    let prev = null;
    Object.keys(DB.snap || {}).sort().forEach(d => {
      const x = DB.snap[d][l]; if (!x || x.w == null) return;
      if (prev != null) ladder(WAY_WORDS, y => y + 500, x.w).forEach(th => { if (prev < th && x.w >= th) ev.push({ d, ico:'words', k:'words', l, v:th, t:`${fmtN(th)} verschiedene Wörter` }); });
      prev = x.w;
    });
    const texts = (DB.texts || []).filter(x => x.lang === l).map(x => x.date).sort();
    if (texts.length) ev.push({ d:texts[0], ico:'write', k:'text', l, v:1, t:'Erster eigener Text' });
    if (texts.length >= 10) ev.push({ d:texts[9], ico:'write', k:'text', l, v:10, t:'10 eigene Texte' });
  });
  // Themen: Fehlerquote deutlich gesunken (gespeichert, weil das Fehlerprotokoll nach 120 Tagen verfällt)
  (DB.etap || []).forEach(e => { if (e && e.d && e.l && e.k) ev.push({ d:e.d, ico:'topic', k:'topic', l:e.l, v:e.s, trap:e.k, b:e.b, c:e.c, t:topicMileText(e) }); });
  ev.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);
  // Nächste Etappen: nach dem höchsten erreichten Stand, damit ein wieder herausgefallener Satz keine Etappe zweimal bringt
  const next = [];
  ['sv', 'es'].forEach(l => { if (!BANK[l].some(i => stOf(i.id))) return; const nx = MAT[mi[l]], m = matureCount(l); if (nx) next.push({ ico:'mature', k:'mature', l, t:`${fmtN(nx)} gefestigte Sätze`, rest:`noch ${Math.max(1, nx - m)}` }); });
  const nh = HOURS.find(x => x * 3600 > secs); if (nh) next.push({ ico:'time', k:'hours', t:`${fmtN(nh)} Stunden geübt`, rest:`noch ${fmtMin(nh * 3600 - secs).replace(/\.$/, '')}` });
  const nd = DAYS.find(x => x > days.length); if (nd && nd - days.length <= 60) next.push({ ico:'start', k:'days', t:`${fmtN(nd)} Übungstage`, rest:`noch ${nd - days.length}` });
  return { done:ev, next };
}
// Kennung einer Etappe: Rundenende vergleicht die Etappen vor und nach der Runde (A2, seit 24.63)
const wayKey = e => `${e.k}|${e.l || ''}|${e.t}`;
const wayKeys = () => wayEvents().done.map(wayKey);
// Rangfolge, wenn mehrere Etappen zusammenfallen: was über das Können spricht vor dem, was über Fleiß spricht
const WAY_PRIO = ['anchored', 'mature', 'topic', 'years', 'streak', 'words', 'text', 'own', 'hours', 'days', 'tasks', 'first'];
const wayPrio = e => { const i = WAY_PRIO.indexOf(e.k); return i < 0 ? 99 : i; };
// Die nächste Etappe derselben Art, mit Abstand („noch 15“); null, wo es keine nächste gibt
function wayNext(e){
  const l = e.l, sum = k => Object.keys(DB.log || {}).reduce((a, d) => a + (dayLog(d, 'sv')[k] || 0) + (dayLog(d, 'es')[k] || 0), 0);
  const left = (nx, c, one, many) => `noch ${fmtN(nx - c)}${one ? ' ' + (nx - c === 1 ? one : many) : ''}`;
  switch (e.k) {
    case 'mature': { const c = matureCount(l), nx = milestoneList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:`${fmtN(nx)} gefestigte Sätze`, rest:`noch ${fmtN(Math.max(1, nx - c))}` } : null; }
    case 'anchored': { const c = anchoredCount(l), nx = anchoredList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:anchoredLabel(nx), rest:`noch ${fmtN(Math.max(1, nx - c))}` } : null; }
    case 'streak': { const c = streak(), nx = streakList(Math.max(c, e.v)).find(x => x > e.v); return nx ? { t:streakLabel(nx), rest:left(nx, Math.min(c, nx - 1), 'Tag', 'Tage') } : null; }
    case 'words': { const c = vocabCount(l).all, nx = ladder(WAY_WORDS, y => y + 500, Math.max(c, e.v)).find(x => x > e.v); return { t:`${fmtN(nx)} verschiedene Wörter`, rest:left(nx, Math.min(c, nx - 1)) }; }
    case 'tasks': { const c = sum('n'), nx = ladder(WAY_TASKS, x => x + 25000, Math.max(c, e.v)).find(x => x > e.v); return { t:`${fmtN(nx)} Aufgaben`, rest:left(nx, Math.min(c, nx - 1)) }; }
    case 'hours': { const c = sum('secs'), nx = ladder(WAY_HOURS, x => x + 250, Math.max(c / 3600, e.v)).find(x => x > e.v); return { t:`${fmtN(nx)} Stunden geübt`, rest:`noch ${fmtMin(Math.max(60, nx * 3600 - c)).replace(/\.$/, '')}` }; }
    case 'days': { const c = Object.keys(DB.log || {}).filter(d => ['sv', 'es'].some(x => (dayLog(d, x).n || 0) > 0)).length, nx = ladder(WAY_DAYS, x => x + 500, Math.max(c, e.v)).find(x => x > e.v); return { t:`${fmtN(nx)} Übungstage`, rest:left(nx, Math.min(c, nx - 1)) }; }
    case 'topic': return e.v === 1 ? { t:topicMileText({ l, k:e.trap, s:2 }), rest:'nächste Stufe' } : null;
    case 'text': { if (e.v >= 10) return null; const c = (DB.texts || []).filter(x => x.lang === l).length; return { t:'10 eigene Texte', rest:left(10, Math.min(c, 9)) }; }
    case 'years': return { t:`${e.v + 1} Jahre mit Tagwerk`, rest:'in einem Jahr' };
    default: return null;
  }
}
// Dein Weg als Gleisplan: links Schwedisch, Mitte Gemeinsames (Serien, Aufgaben, Stunden), rechts Spanisch.
// Gleiche Zeitachse für alle drei Spuren, so sieht man parallelen und unterschiedlichen Fortschritt. Oben die nächsten Ziele als offene Punkte.
const WAY_LANES = ['sv', 'x', 'es'];
function wayHtml(){
  const w = wayEvents(); if (!w.done.length) return '';
  const firstOf = l => { const d = Object.keys(DB.log || {}).filter(x => (dayLog(x, l).n || 0) > 0).sort()[0]; return d || null; };
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
  let best = 0, cur = 0, misses = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    if (DB.done[d]) { cur++; best = Math.max(best, cur); }
    else { misses = misses.filter(m => dayDiff(d, m) < 7); if (misses.length) { cur = 0; misses = []; } else misses.push(d); }
  }
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
