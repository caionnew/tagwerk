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
function wayEvents(){
  const ev = [], days = Object.keys(DB.log || {}).filter(d => ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0)).sort();
  if (!days.length) return { done:[], next:[] };
  ev.push({ d:days[0], ico:'start', t:'Erster Übungstag' });
  let n = 0, secs = 0; const mat = { sv:0, es:0 }, ti = { i:0 }, hi = { i:0 }, mi = { sv:0, es:0 };
  days.forEach(d => {
    ['sv', 'es'].forEach(l => {
      const x = dayLog(d, l); n += x.n || 0; secs += x.secs || 0; mat[l] += x.mat || 0;
      while (mi[l] < WAY_MATURE.length && mat[l] >= WAY_MATURE[mi[l]]) { ev.push({ d, ico:'mature', t:`${WAY_MATURE[mi[l]]} gefestigte Sätze ${LANG[l].deName}` }); mi[l]++; }
    });
    while (ti.i < WAY_TASKS.length && n >= WAY_TASKS[ti.i]) { ev.push({ d, ico:'tasks', t:`${WAY_TASKS[ti.i].toLocaleString('de-DE')} Aufgaben` }); ti.i++; }
    while (hi.i < WAY_HOURS.length && secs >= WAY_HOURS[hi.i] * 3600) { ev.push({ d, ico:'time', t:`${WAY_HOURS[hi.i]} ${WAY_HOURS[hi.i] === 1 ? 'Stunde' : 'Stunden'} geübt` }); hi.i++; }
  });
  // Serien nach derselben Regel wie die Serienanzeige: ein freier Tag pro Woche unterbricht nicht
  const doneDays = Object.keys(DB.done || {}).filter(d => DB.done[d]).sort();
  if (doneDays.length) {
    let streak = 0, misses = [], si = 0, d = doneDays[0];
    const end = today();
    while (d <= end) {
      if (DB.done[d]) { streak++; while (si < WAY_STREAK.length && streak >= WAY_STREAK[si]) { ev.push({ d, ico:'streak', t:`${WAY_STREAK[si]} Tage in Folge` }); si++; } }
      else if (d !== end) {
        misses = misses.filter(m => dayDiff(d, m) < 7);
        if (misses.length) { streak = 0; misses = []; } else misses.push(d);
      }
      d = addDays(d, 1);
    }
  }
  ['sv', 'es'].forEach(l => {
    const firstOwn = (DB.own[l] || []).filter(o => o.created).map(o => o.created).sort()[0];
    if (firstOwn) ev.push({ d:firstOwn, ico:'own', t:`Erster eigener Satz ${LANG[l].deName}` });
    // Wortschatz und Themen erst seit den erweiterten Tagesständen
    // Nur Schwellen, die zwischen zwei Erfassungen überschritten wurden. Was schon beim ersten Erfassen erreicht war, hat kein bekanntes Datum.
    let prev = null;
    Object.keys(DB.snap || {}).sort().forEach(d => {
      const x = DB.snap[d][l]; if (!x || x.w == null) return;
      if (prev) {
        WAY_WORDS.forEach(th => { if (prev.w < th && x.w >= th) ev.push({ d, ico:'words', t:`${th} verschiedene Wörter ${LANG[l].deName}` }); });
        Object.keys(x.t || {}).forEach(tr => {
          const total = BANK[l].filter(i => i.trap === tr).length, meta = trapMeta(l, tr);
          if (meta && total >= 6 && (prev.t[tr] || 0) / total < 0.5 && x.t[tr] / total >= 0.5) ev.push({ d, ico:'topic', t:`„${meta.label}“ zur Hälfte gefestigt` });
        });
      }
      prev = { w:x.w, t:x.t || {} };
    });
    const texts = (DB.texts || []).filter(x => x.lang === l).map(x => x.date).sort();
    if (texts.length) ev.push({ d:texts[0], ico:'write', t:`Erster Text ${LANG[l].deName}` });
    if (texts.length >= 10) ev.push({ d:texts[9], ico:'write', t:`10 Texte ${LANG[l].deName}` });
  });
  ev.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);
  // Nächste Etappen
  const next = [];
  ['sv', 'es'].forEach(l => { if (!BANK[l].some(i => stOf(i.id))) return; const m = matureCount(l), nx = WAY_MATURE.find(x => x > m); if (nx) next.push({ ico:'mature', t:`${nx} gefestigte Sätze ${LANG[l].deName}`, rest:`noch ${nx - m}` }); });
  const nh = WAY_HOURS.find(x => x * 3600 > secs); if (nh) next.push({ ico:'time', t:`${nh} Stunden geübt`, rest:`noch ${fmtMin(nh * 3600 - secs).replace(/\.$/, '')}` });
  return { done:ev, next:next.slice(0, 3) };
}
// Gleiche Punkte, Farbe nach Art der Etappe
const WAY_CAT = { start:'a', mature:'a', words:'a', topic:'a', tasks:'b', time:'b', streak:'c', own:'d', write:'d' };
function wayHtml(){
  const w = wayEvents(); if (!w.done.length) return '';
  const all = !!S.wayAll, list = all ? w.done.slice().reverse() : w.done.slice(-5).reverse();
  const fmtD = d => { const x = dateOf(d); return `${x.getDate()}. ${MONTHS[x.getMonth()]} ${x.getFullYear()}`; };
  return `<h2 class="grp">Dein Weg</h2><div class="chart way">
    ${w.next.length ? `<p class="way-next">Als Nächstes: ${w.next.map(x => `${esc(x.t)} <span class="dim">(${esc(x.rest)})</span>`).join(' · ')}</p>` : ''}
    <ol class="tl">${list.map(x => `<li><span class="tl-i c-${WAY_CAT[x.ico] || 'b'}" aria-hidden="true"></span><span class="tl-t">${esc(x.t)}</span><span class="tl-d">${fmtD(x.d)}</span></li>`).join('')}</ol>
    ${w.done.length > 5 ? `<button type="button" class="link" data-a="wayall">${all ? 'Weniger zeigen' : `Ganzen Weg zeigen (${w.done.length} Etappen)`}</button>` : ''}
  </div>`;
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
