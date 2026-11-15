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
// Etappen aus den gespeicherten Tagesdaten rekonstruieren
const WAY_TASKS = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000];
const WAY_HOURS = [1, 5, 10, 25, 50, 100, 250, 500];
const WAY_MATURE = [10, 25, 50, 100, 250, 500, 1000, 1500, 2000];
const WAY_STREAK = [7, 30, 100, 200, 365, 730];
const WAY_WORDS = [100, 250, 500, 1000, 1500, 2000];
const WAY_DAYS = [10, 50, 100, 250, 500, 1000];
// Schwellen gehen nie aus: Nach dem Ende der Liste geht es in gleichmäßigen Schritten weiter, auch nach Jahren
function ladder(list, step, upTo){ const out = list.slice(); while (out[out.length - 1] <= upTo) out.push(step(out[out.length - 1])); return out; }
const streakStep = x => (x === 730 ? 1000 : x === 1000 ? 1095 : x + 365);
const streakLabel = n => (n >= 365 && n % 365 === 0 ? `${n / 365} ${n === 365 ? 'Jahr' : 'Jahre'} in Folge` : `${n.toLocaleString('de-DE')} Tage in Folge`);
function wayEvents(){
  const ev = [], days = Object.keys(DB.log || {}).filter(d => ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0)).sort();
  if (!days.length) return { done:[], next:[] };
  ev.push({ d:days[0], ico:'start', t:'Erster Übungstag' });
  // Gesamtwerte vorab, damit die Schwellenlisten lang genug sind
  const sumAll = k => days.reduce((a, d) => a + (dayLog(d, 'sv')[k] || 0) + (dayLog(d, 'es')[k] || 0), 0);
  const allN = sumAll('n'), allSecs = sumAll('secs');
  const TASKS = ladder(WAY_TASKS, x => x + 25000, allN), HOURS = ladder(WAY_HOURS, x => x + 250, allSecs / 3600);
  const MAT = ladder(WAY_MATURE, x => x + 500, Math.max(matureCount('sv'), matureCount('es'), ...['sv', 'es'].map(l => days.reduce((a, d) => a + (dayLog(d, l).mat || 0), 0))));
  const DAYS = ladder(WAY_DAYS, x => x + 500, days.length);
  days.forEach((d, i) => { const k = DAYS.indexOf(i + 1); if (k >= 0) ev.push({ d, ico:'start', t:`${(i + 1).toLocaleString('de-DE')} Übungstage` }); });
  // Jahrestage seit dem ersten Übungstag
  for (let y = 1; ; y++) { const [Y, M, D] = days[0].split('-'); const ad = `${Number(Y) + y}-${M}-${D}`; if (ad > today()) break; ev.push({ d:ad, ico:'start', t:`${y} ${y === 1 ? 'Jahr' : 'Jahre'} mit Tagwerk` }); }
  let n = 0, secs = 0; const mat = { sv:0, es:0 }, ti = { i:0 }, hi = { i:0 }, mi = { sv:0, es:0 };
  days.forEach(d => {
    ['sv', 'es'].forEach(l => {
      const x = dayLog(d, l); n += x.n || 0; secs += x.secs || 0; mat[l] += x.mat || 0;
      while (mi[l] < MAT.length && mat[l] >= MAT[mi[l]]) { ev.push({ d, ico:'mature', l, t:`${MAT[mi[l]].toLocaleString('de-DE')} gefestigte Sätze` }); mi[l]++; }
    });
    while (ti.i < TASKS.length && n >= TASKS[ti.i]) { ev.push({ d, ico:'tasks', t:`${TASKS[ti.i].toLocaleString('de-DE')} Aufgaben` }); ti.i++; }
    while (hi.i < HOURS.length && secs >= HOURS[hi.i] * 3600) { ev.push({ d, ico:'time', t:`${HOURS[hi.i].toLocaleString('de-DE')} ${HOURS[hi.i] === 1 ? 'Stunde' : 'Stunden'} geübt` }); hi.i++; }
  });
  // Serien nach derselben Regel wie die Serienanzeige: ein freier Tag pro Woche unterbricht nicht
  const doneDays = Object.keys(DB.done || {}).filter(d => DB.done[d]).sort();
  if (doneDays.length) {
    const STREAK = ladder(WAY_STREAK, streakStep, doneDays.length + 7);
    let streak = 0, misses = [], si = 0, d = doneDays[0];
    const end = today();
    while (d <= end) {
      if (DB.done[d]) { streak++; while (streak >= STREAK[si]) { ev.push({ d, ico:'streak', t:streakLabel(STREAK[si]) }); si++; } }
      else if (d !== end) {
        misses = misses.filter(m => dayDiff(d, m) < 7);
        if (misses.length) { streak = 0; misses = []; } else misses.push(d);
      }
      d = addDays(d, 1);
    }
  }
  ['sv', 'es'].forEach(l => {
    const firstOwn = (DB.own[l] || []).filter(o => o.created).map(o => o.created).sort()[0];
    if (firstOwn) ev.push({ d:firstOwn, ico:'own', l, t:'Erster eigener Satz' });
    // Wortschatz und Themen erst seit den erweiterten Tagesständen
    // Nur Schwellen, die zwischen zwei Erfassungen überschritten wurden. Was schon beim ersten Erfassen erreicht war, hat kein bekanntes Datum.
    let prev = null;
    Object.keys(DB.snap || {}).sort().forEach(d => {
      const x = DB.snap[d][l]; if (!x || x.w == null) return;
      if (prev) {
        ladder(WAY_WORDS, y => y + 500, x.w).forEach(th => { if (prev.w < th && x.w >= th) ev.push({ d, ico:'words', l, t:`${th} verschiedene Wörter` }); });
        Object.keys(x.t || {}).forEach(tr => {
          const total = BANK[l].filter(i => i.trap === tr).length, meta = trapMeta(l, tr);
          if (meta && total >= 6 && (prev.t[tr] || 0) / total < 0.5 && x.t[tr] / total >= 0.5) ev.push({ d, ico:'topic', l, t:`„${meta.label}“ zur Hälfte gefestigt` });
        });
      }
      prev = { w:x.w, t:x.t || {} };
    });
    const texts = (DB.texts || []).filter(x => x.lang === l).map(x => x.date).sort();
    if (texts.length) ev.push({ d:texts[0], ico:'write', l, t:'Erster eigener Text' });
    if (texts.length >= 10) ev.push({ d:texts[9], ico:'write', l, t:'10 eigene Texte' });
  });
  ev.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);
  // Nächste Etappen
  const next = [];
  ['sv', 'es'].forEach(l => { if (!BANK[l].some(i => stOf(i.id))) return; const m = matureCount(l), nx = ladder(WAY_MATURE, x => x + 500, m).find(x => x > m); if (nx) next.push({ ico:'mature', l, t:`${nx} gefestigte Sätze`, rest:`noch ${nx - m}` }); });
  const nh = ladder(WAY_HOURS, x => x + 250, secs / 3600).find(x => x * 3600 > secs); if (nh) next.push({ ico:'time', t:`${nh} Stunden geübt`, rest:`noch ${fmtMin(nh * 3600 - secs).replace(/\.$/, '')}` });
  const nd = DAYS.find(x => x > days.length); if (nd && nd - days.length <= 60) next.push({ ico:'start', t:`${nd.toLocaleString('de-DE')} Übungstage`, rest:`noch ${nd - days.length}` });
  return { done:ev, next };
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
  return `<h2 class="grp">Dein Weg</h2><div class="chart way">
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
      <div class="kpis yk"><div><b>${Y.days}</b><span>Übungstage${Y.done ? `, ${Y.done} mit Tagwerk` : ''}</span></div><div><b>${Y.secs >= 3600 ? Math.round(Y.secs / 3600).toLocaleString('de-DE') : Math.round(Y.secs / 60)}</b><span>${Y.secs >= 3600 ? 'Stunden' : 'Minuten'} gelernt</span></div><div><b>${Y.run}</b><span>Tage längste Serie</span></div></div>
      ${langs.map(l => `<p class="y-l"><span class="sq rl-${l}-sq"></span><b>${LANG[l].deName}</b> ${Y[l].fresh.toLocaleString('de-DE')} neue Sätze, ${Y[l].mat.toLocaleString('de-DE')} gefestigt, ${Y[l].n.toLocaleString('de-DE')} Aufgaben, ${fmtMin(Y[l].secs)}</p>`).join('')}
      ${Y.topMonth != null && Y.days >= 20 ? `<p class="legend" style="margin-top:6px">Stärkster Monat: ${MONTHS_FULL[Y.topMonth]} mit ${fmtMin(Y.topSecs)}</p>` : ''}</div>`;
  };
  return `<h2 class="grp">Jahr für Jahr</h2><div class="ygrid">${ys.map(card).join('')}</div>`;
}
// Themenraster: je Thema Anteil gefestigt und Veränderung seit etwa 30 Tagen
function topicGridHtml(lang){
  const ago = snapAgo(lang, 30);
  const tiles = TRAPS[lang].filter(tr => tr.kind !== 'gen').map(tr => {
    const items = BANK[lang].filter(i => i.trap === tr.id); if (!items.length) return '';
    const seen = items.filter(i => stOf(i.id)).length, mat = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length;
    const d = ago && ago.t ? mat - (ago.t[tr.id] || 0) : null;
    return `<button type="button" class="tg${seen ? '' : ' tg-new'}" data-a="topic" data-t="${tr.id}"><span class="tg-l">${esc(tr.label)}</span><span class="tg-b" aria-hidden="true"><span style="width:${Math.round(seen / items.length * 100)}%" class="tg-seen"></span><span style="width:${Math.round(mat / items.length * 100)}%" class="tg-mat"></span></span><span class="tg-n">${mat}/${items.length}${d ? ` <span class="tg-d">+${d}</span>` : ''}</span></button>`;
  }).join('');
  return `<h2 class="grp">Themen</h2><div class="tgrid">${tiles}</div><p class="legend" style="margin:8px 4px 0"><span class="sq tg-mat-sq"></span>gefestigt <span class="sq tg-seen-sq"></span>geübt${ago && ago.t ? ' · grüne Zahl: mehr gefestigt als vor 30 Tagen' : ''}. Antippen für Regel und Beispiele.</p>`;
}
