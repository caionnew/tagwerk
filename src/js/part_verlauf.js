/* ---------- Verlauf im Sprach-Tab: Sätze, Wörter und Behaltensdauer über die Zeit ---------- */
// Drei Reiter, je eine Frage: wie viel (Sätze nach Stand), wie breit (Wörter), wie haltbar (Behaltensdauer).
// Quellen: Tagesprotokoll (neu eingeführte Sätze; Bestand gefestigt und verankert am Tagesende, seit 24.63) und Tagesstände
// (abrufbar, Wörter; Wörter in gefestigten Sätzen und Behaltensdauer seit 24.106.0). Der letzte Punkt ist immer der Stand jetzt.

// Behaltensdauer: Stabilität S aus dem Wiederholungsplan (FSRS), die Zeit, nach der du einen Satz noch mit 90 % weißt.
// Quartile linear interpoliert (wie R type 7). Unter 10 Tagen eine Nachkommastelle, darüber ganze Tage.
const spanRound = v => (v < 10 ? Math.round(v * 10) / 10 : Math.round(v));
function quantile(sorted, p){
  if (!sorted.length) return null;
  const h = (sorted.length - 1) * p, lo = Math.floor(h), hi = Math.min(sorted.length - 1, lo + 1);
  return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo]);
}
function spanValues(lang){ return BANK[lang].map(i => stOf(i.id)).filter(st => st && st.s > 0).map(st => st.s).sort((a, b) => a - b); }
function spanQuartiles(lang){
  const v = spanValues(lang);
  return v.length ? [0.25, 0.5, 0.75].map(p => spanRound(quantile(v, p))) : null;
}
const fmtDays = v => (v == null ? '–' : `${String(spanRound(v)).replace('.', ',')} ${spanRound(v) === 1 ? 'Tag' : 'Tage'}`);
// Verteilung jetzt, solange es noch keinen Verlauf gibt: Grenzen wie bei „gefestigt“ (21 Tage) und „verankert“ (365 Tage)
const SPAN_BINS = [[0, 7, 'unter 1 Woche'], [7, 21, '1 bis 3 Wochen'], [21, 90, '3 Wochen bis 3 Monate'], [90, 365, '3 Monate bis 1 Jahr'], [365, Infinity, 'über 1 Jahr']];

// Datenpunkte: täglich, ab 70 Tagen alle 3 Tage, ab 180 Tagen wöchentlich; der letzte ist heute
function verlaufData(lang){
  const days = Object.keys(DB.log).filter(k => (dayLog(k, lang).n || 0) > 0).sort();
  if (!days.length) return null;
  const t = today(), first = days[0], long = dayDiff(t, first) > 400, all = long && S.pcAll;
  const start = long && !all ? addDays(t, -365) : first, span = dayDiff(t, start);
  const step = span > 180 ? 7 : span > 70 ? 3 : 1;
  let cum = days.filter(d => d < start).reduce((a, d) => a + (dayLog(d, lang).fresh || 0), 0);
  const pts = [];
  for (let k = 0; k <= span; k++) {
    const ds = addDays(start, k);
    cum += dayLog(ds, lang).fresh || 0;
    if (k % step && k !== span) continue;
    // Stand am Tagesende: Protokoll (mc, ac), sonst Tagesstand; bei größeren Schritten der jüngste innerhalb des Schritts
    let lg = null, sn = null;
    for (let b = 0; b < step; b++) {
      const d = addDays(ds, -b), x = DB.log[d] && DB.log[d][lang], y = DB.snap && DB.snap[d] && DB.snap[d][lang];
      if (!lg && x && typeof x === 'object' && x.mc != null) lg = x;
      if (!sn && y) sn = y;
    }
    const m = lg ? lg.mc : sn ? sn.m : null;
    pts.push({ ds, n:cum, m, a:m == null ? null : lg ? lg.ac || 0 : sn.a || 0, k:sn ? sn.k : null,
      w:sn && sn.w != null ? sn.w : null, wf:sn && sn.wf != null ? sn.wf : null, sp:sn && sn.sp ? sn.sp : null });
  }
  // Jetzt: genau, nicht aus dem letzten Tagesstand. Sätze, die vor dem Protokoll schon geübt waren, zählen von Anfang an mit.
  const v = vocabCount(lang), now = pts[pts.length - 1], practiced = BANK[lang].filter(i => stOf(i.id)).length;
  const extra = Math.max(0, practiced - now.n);
  if (extra) pts.forEach(p => { p.n += extra; });
  Object.assign(now, { n:Math.max(practiced, now.n), m:matureCount(lang), a:anchoredCount(lang), k:Math.round(knownEstimate(lang)), w:v.all, wf:v.firm, sp:spanQuartiles(lang) });
  pts.forEach(p => { if (p.m != null && p.n < p.m) p.n = p.m; });
  return { pts, start, span, long, all };
}

// Monotone Kurven (Fritsch-Carlson): keine Überschwinger, Zahlen steigen zwischen zwei Punkten nicht über den größeren.
// Alle Reihen teilen die x-Stützstellen; gestapelte Flächen entstehen aus der Summe der Bestandteile samt Steigungen,
// so liegt eine obere Kante nie unter der unteren.
function monoSlopes(v){
  const n = v.length, s = [], m = [];
  for (let i = 0; i < n - 1; i++) s[i] = v[i + 1] - v[i];
  for (let i = 0; i < n; i++) m[i] = n < 2 ? 0 : i === 0 ? s[0] : i === n - 1 ? s[n - 2] : s[i - 1] * s[i] <= 0 ? 0 : 2 * s[i - 1] * s[i] / (s[i - 1] + s[i]);
  return m;
}
// Bézier-Stücke einer Reihe (Werte und Steigungen je Index) als Pfadteil, vorwärts oder rückwärts
function bezPath(idx, v, m, X, Y, back){
  const f = n => n.toFixed(1), seg = [];
  for (let j = 0; j < idx.length - 1; j++) {
    const i = idx[j], h = (X(idx[j + 1]) - X(i)) / 3;
    seg.push([[X(i), Y(v[j])], [X(i) + h, Y(v[j] + m[j] / 3)], [X(idx[j + 1]) - h, Y(v[j + 1] - m[j + 1] / 3)], [X(idx[j + 1]), Y(v[j + 1])]]);
  }
  if (!seg.length) return `${back ? 'L' : 'M'}${f(X(idx[0]))},${f(Y(v[0]))}`;
  if (back) return seg.reverse().map((s, j) => `${j ? '' : `L${f(s[3][0])},${f(s[3][1])}`}C${f(s[2][0])},${f(s[2][1])} ${f(s[1][0])},${f(s[1][1])} ${f(s[0][0])},${f(s[0][1])}`).join('');
  return `M${f(seg[0][0][0])},${f(seg[0][0][1])}` + seg.map(s => `C${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])} ${f(s[3][0])},${f(s[3][1])}`).join('');
}
// Zusammenhängende Abschnitte, in denen alle verlangten Werte da sind
function runsOf(pts, ok){
  const runs = []; let cur = [];
  pts.forEach((p, i) => { if (ok(p)) cur.push(i); else if (cur.length) { runs.push(cur); cur = []; } });
  if (cur.length) runs.push(cur);
  return runs;
}
// Gestapelt: comps sind Funktionen je Bestandteil von unten nach oben. Liefert je Ebene (Oberkante) Werte und Steigungen.
function stackLevels(pts, idx, comps){
  const vals = comps.map(c => idx.map(i => c(pts[i]))), slopes = vals.map(monoSlopes);
  const levels = [{ v:idx.map(() => 0), m:idx.map(() => 0) }];
  vals.forEach((v, k) => { const below = levels[k]; levels.push({ v:v.map((x, j) => below.v[j] + x), m:slopes[k].map((x, j) => below.m[j] + x) }); });
  return levels;
}
function bandPath(idx, lo, hi, X, Y){ return bezPath(idx, hi.v, hi.m, X, Y, false) + bezPath(idx, lo.v, lo.m, X, Y, true) + 'Z'; }
function linePath(idx, v, X, Y){ return bezPath(idx, v, monoSlopes(v), X, Y, false); }

function niceStep(max){ const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))); return [1, 2, 5, 10].map(m => m * p).find(v => v >= raw) || p * 10; }
const vFmt = n => (n == null ? '–' : Math.round(n).toLocaleString('de-DE'));
const signed = n => (n > 0 ? `+${vFmt(n)}` : n < 0 ? `−${vFmt(-n)}` : '0');
const pcDate = (ds, withYear) => { const x = dateOf(ds), d = dayDiff(today(), ds); return d === 0 ? 'Heute' : d === 1 ? 'Gestern' : `${x.getDate()}. ${MONTHS[x.getMonth()]}${withYear ? ` ${x.getFullYear()}` : ''}`; };

// Rahmen eines Diagramms: Gitter, Achsen, Zeichnung, Fadenkreuz. dots: je Reihe die y-Werte (Pixel) für die Punkte beim Antippen.
const PC = { W:340, H:176, L:34, R:10, T:8, B:22 };
function pcSvg(D, inner, grid, dots, label, id = 'pcsvg'){
  const { W, H, L, R, B } = PC, n = D.pts.length, X = i => L + (n === 1 ? 0 : i / (n - 1)) * (W - L - R);
  const lastI = n - 1, longAx = D.span > 300;
  let ax = '';
  [0, Math.floor(lastI / 2), lastI].filter((v, i, a) => a.indexOf(v) === i).forEach((i, j, a) => {
    const anchor = j === 0 ? 'start' : j === a.length - 1 ? 'end' : 'middle', x = dateOf(D.pts[i].ds);
    ax += `<text x="${X(i).toFixed(1)}" y="${H - 5}" class="xl" text-anchor="${anchor}">${longAx ? `${MONTHS[x.getMonth()]} ${x.getFullYear()}` : `${x.getDate()}. ${MONTHS[x.getMonth()]}`}</text>`;
  });
  const cross = `<g class="pcx" aria-hidden="true"><line x1="${X(lastI)}" x2="${X(lastI)}" y1="${PC.T}" y2="${H - B}"/>${dots.map((d, s) => (d.y[lastI] == null ? '' : `<circle data-s="${s}" class="${d.cls}" cx="${X(lastI).toFixed(1)}" cy="${d.y[lastI].toFixed(1)}" r="3.5"/>`)).join('')}</g>`;
  const json = { w:W, x:D.pts.map((p, i) => +X(i).toFixed(1)), d:D.pts.map(p => p.label || pcDate(p.ds, longAx)), p:dots.map(d => d.y.map(y => (y == null ? null : +y.toFixed(1)))), v:D.cells.map(c => c.v) };
  return `<svg viewBox="0 0 ${W} ${H}" class="pcsvg${S.pcEnter && id === 'pcsvg' ? ' enter' : ''}" id="${id}" tabindex="0" role="img" aria-label="${esc(label)}" data-pc="${esc(JSON.stringify(json))}">${grid}<g class="pcd">${inner}</g>${ax}${cross}</svg>`;
}
function linearGrid(max, Y){
  const st = niceStep(max), top = Math.ceil(max / st) * st;
  let g = '';
  for (let v = 0; v <= top; v += st) g += `<line x1="${PC.L}" x2="${PC.W - PC.R}" y1="${Y(v, top).toFixed(1)}" y2="${Y(v, top).toFixed(1)}" class="gl"/><text x="${PC.L - 6}" y="${(Y(v, top) + 3).toFixed(1)}" class="yl">${v.toLocaleString('de-DE')}</text>`;
  return { g, top };
}
// Werte unter dem Diagramm: Datum und je Reihe Zahl, Farbe und Name. Beim Antippen zeigen sie den gewählten Tag.
function pcCells(D){
  const lastI = D.pts.length - 1;
  return `<div class="pcvals" style="--n:${D.cells.length}"><p class="pcdate">${esc(D.pts[lastI].label || pcDate(D.pts[lastI].ds))}</p>${D.cells.map((c, j) => `<div class="pcv"><b data-pv="${j}">${esc(c.v[lastI] == null ? '–' : c.v[lastI])}</b><span><i class="${c.key}" aria-hidden="true"></i>${c.label}</span></div>`).join('')}</div>`;
}
const termBtn = (k, t) => `<button type="button" class="term" data-a="term" data-k="${k}">${t}</button>`;
// Veränderung: gegen den Punkt etwa 30 Tage zurück, bei kürzerem Verlauf gegen den Anfang
function pcThen(D){
  const t = today(), back = D.span >= 30 ? addDays(t, -30) : D.pts[0].ds;
  let best = 0; D.pts.forEach((p, i) => { if (Math.abs(dayDiff(p.ds, back)) < Math.abs(dayDiff(D.pts[best].ds, back))) best = i; });
  return { i:best, when:D.span >= 30 ? 'in 30 Tagen' : `seit ${pcDate(D.pts[0].ds)}` };
}

function verlaufSaetze(D){
  const { pts } = D, n = pts.length, lastI = n - 1, X = i => PC.L + (n === 1 ? 0 : i / (n - 1)) * (PC.W - PC.L - PC.R);
  const max = Math.max(4, ...pts.map(p => Math.max(p.n, p.k || 0)));
  const Yt = (v, top) => PC.T + (1 - v / top) * (PC.H - PC.T - PC.B), grid = linearGrid(max, Yt), Y = v => Yt(v, grid.top);
  const anchored = pts.some(p => p.a > 0);
  let inner = '';
  runsOf(pts, p => p.m != null).forEach(idx => {
    const lv = stackLevels(pts, idx, [p => p.a, p => p.m - p.a, p => p.n - p.m]);
    if (anchored) inner += `<path d="${bandPath(idx, lv[0], lv[1], X, Y)}" class="pca a-a"/>`;
    inner += `<path d="${bandPath(idx, lv[1], lv[2], X, Y)}" class="pca a-m"/><path d="${bandPath(idx, lv[2], lv[3], X, Y)}" class="pca a-y"/>`;
    inner += `<path d="${bezPath(idx, lv[3].v, lv[3].m, X, Y)}" class="pcl l-top"/>`;
  });
  runsOf(pts, p => p.m == null).forEach(idx => { inner += `<path d="${linePath(idx, idx.map(i => pts[i].n), X, Y)}" class="pcl l-top"/>`; });
  runsOf(pts, p => p.k != null).forEach(idx => { if (idx.length > 1) inner += `<path d="${linePath(idx, idx.map(i => pts[i].k), X, Y)}" class="pcl l-k"/>`; });
  const yOf = f => pts.map(p => (f(p) == null ? null : Y(f(p))));
  const dots = [{ y:yOf(p => p.n), cls:'d-y' }, { y:yOf(p => p.m), cls:'d-m' }, { y:yOf(p => p.k), cls:'d-k' }];
  if (anchored) dots.push({ y:yOf(p => (p.a ? p.a : null)), cls:'d-a' });
  const cells = [];
  if (anchored) cells.push({ v:pts.map(p => (p.m == null ? null : vFmt(p.a))), key:'sq k-a', label:termBtn('verankert', 'verankert') });
  cells.push({ v:pts.map(p => (p.m == null ? null : vFmt(p.m - p.a))), key:'sq k-m', label:termBtn('gefestigt', 'gefestigt') },
    { v:pts.map(p => vFmt(p.m == null ? p.n : p.n - p.m)), key:'sq k-y', label:'im Aufbau' },
    { v:pts.map(p => (p.k == null ? null : vFmt(p.k))), key:'lk l-k', label:termBtn('abrufbar', 'abrufbar') });
  const th = pcThen(D), a = pts[th.i], z = pts[lastI];
  const head = a.m != null ? `<p class="pcstat"><b>${signed(z.m - a.m)}</b> gefestigt, <b>${signed(z.n - a.n)}</b> geübt ${th.when}</p>`
    : `<p class="pcstat"><b>${signed(z.n - a.n)}</b> geübt ${th.when}</p>`;
  return head + pcSvg(Object.assign({}, D, { cells }), inner, grid.g, dots, `Sätze im Verlauf: ${z.m} gefestigt, ${z.n - z.m} im Aufbau, ${z.k} abrufbar`) + pcCells(Object.assign({}, D, { cells }));
}

function verlaufWoerter(D){
  const { pts } = D, n = pts.length, lastI = n - 1, X = i => PC.L + (n === 1 ? 0 : i / (n - 1)) * (PC.W - PC.L - PC.R);
  const max = Math.max(4, ...pts.map(p => p.w || 0));
  const Yt = (v, top) => PC.T + (1 - v / top) * (PC.H - PC.T - PC.B), grid = linearGrid(max, Yt), Y = v => Yt(v, grid.top);
  let inner = '';
  // Gesamtzahl als helle Fläche; Wörter in gefestigten Sätzen darüber dunkel, erst ab dem ersten erfassten Tag (24.106.0)
  runsOf(pts, p => p.w != null).forEach(idx => {
    const v = idx.map(i => pts[i].w), base = { v:idx.map(() => 0), m:idx.map(() => 0) };
    inner += `<path d="${bandPath(idx, base, { v, m:monoSlopes(v) }, X, Y)}" class="pca a-y"/><path d="${linePath(idx, v, X, Y)}" class="pcl l-top"/>`;
  });
  runsOf(pts, p => p.wf != null).forEach(idx => {
    if (idx.length < 2) return;
    const v = idx.map(i => pts[i].wf);
    inner += `<path d="${bandPath(idx, { v:idx.map(() => 0), m:idx.map(() => 0) }, { v, m:monoSlopes(v) }, X, Y)}" class="pca a-m"/>`;
  });
  const yOf = f => pts.map(p => (f(p) == null ? null : Y(f(p))));
  const dots = [{ y:yOf(p => p.w), cls:'d-y' }, { y:yOf(p => p.wf), cls:'d-m' }];
  const cells = [{ v:pts.map(p => (p.w == null ? null : vFmt(p.w))), key:'sq k-y', label:'in geübten Sätzen' },
    { v:pts.map(p => (p.wf == null ? null : vFmt(p.wf))), key:'sq k-m', label:'in gefestigten' }];
  const th = pcThen(D), firstW = pts.findIndex(p => p.w != null), from = pts[th.i].w != null ? th : { i:firstW, when:`seit ${pcDate(pts[firstW].ds)}` }, z = pts[lastI];
  const head = `<p class="pcstat"><b>${signed(z.w - pts[from.i].w)}</b> ${termBtn('woerter', Math.abs(z.w - pts[from.i].w) === 1 ? 'Wort' : 'Wörter')} ${from.when}</p>`;
  const DD = Object.assign({}, D, { cells });
  return head + pcSvg(DD, inner, grid.g, dots, `Wörter im Verlauf: ${z.w} in geübten Sätzen, ${z.wf} in gefestigten`) + pcCells(DD);
}

function verlaufGedaechtnis(D, lang){
  const { pts } = D, lastI = pts.length - 1, z = pts[lastI];
  const head = (extra = '') => `<p class="pcstat"><b>${fmtDays(z.sp[1])}</b> ${termBtn('behaltensdauer', 'Behaltensdauer')}${extra}</p>`;
  const withSp = pts.map((p, i) => (p.sp ? i : -1)).filter(i => i >= 0);
  const enough = withSp.length >= 3 && dayDiff(z.ds, pts[withSp[0]].ds) >= 6;
  if (!enough) {
    // Noch kein Verlauf: die Verteilung jetzt
    const v = spanValues(lang), counts = SPAN_BINS.map(([lo, hi]) => v.filter(s => s >= lo && s < hi).length), mx = Math.max(1, ...counts);
    return head() + `<div class="spbins">${SPAN_BINS.map(([, , l], i) => `<div class="spb"><span class="spl">${l}</span><span class="spbar"><span class="b${i}" style="width:${counts[i] ? Math.max(3, Math.round(counts[i] / mx * 100)) : 0}%"></span></span><b>${vFmt(counts[i])}</b></div>`).join('')}</div>`
      + `<div class="pcvals" style="--n:3"><p class="pcdate">Heute</p>${[['unteres Viertel', 0], ['Median', 1], ['oberes Viertel', 2]].map(([l, k]) => `<div class="pcv"><b>${fmtDays(z.sp[k])}</b><span>${l}</span></div>`).join('')}</div>`;
  }
  // Logarithmische Achse in Tagen: Haltbarkeit wächst mit jeder Wiederholung um einen Faktor, nicht um einen Betrag
  const sel = pts.slice(withSp[0]), n = sel.length, X = i => PC.L + (n === 1 ? 0 : i / (n - 1)) * (PC.W - PC.L - PC.R);
  const lg = v => Math.log10(Math.max(0.1, v)), all = sel.filter(p => p.sp).flatMap(p => [p.sp[0], p.sp[2]]);
  let lo = lg(Math.min(...all)), hi = lg(Math.max(...all));
  if (hi - lo < 1) { const c = (hi + lo) / 2; lo = c - 0.5; hi = c + 0.5; }
  const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
  const Y = l => PC.T + (1 - (l - lo) / (hi - lo)) * (PC.H - PC.T - PC.B);
  let ticks = [1, 3, 7, 14, 30, 90, 180, 365, 730, 1825].filter(v => lg(v) >= lo && lg(v) <= hi);
  while (ticks.length > 5) ticks = ticks.filter((v, i) => i % 2 === 0);
  const grid = ticks.map(v => `<line x1="${PC.L}" x2="${PC.W - PC.R}" y1="${Y(lg(v)).toFixed(1)}" y2="${Y(lg(v)).toFixed(1)}" class="gl"/><text x="${PC.L - 6}" y="${(Y(lg(v)) + 3).toFixed(1)}" class="yl">${v}</text>`).join('');
  let inner = '';
  runsOf(sel, p => !!p.sp).forEach(idx => {
    const lv = stackLevels(sel, idx, [p => lg(p.sp[0]), p => lg(p.sp[2]) - lg(p.sp[0])]);
    inner += `<path d="${bandPath(idx, lv[1], lv[2], X, Y)}" class="pca a-y"/>`;
    inner += `<path d="${linePath(idx, idx.map(i => lg(sel[i].sp[1])), X, Y)}" class="pcl l-md"/>`;
  });
  const yOf = k => sel.map(p => (p.sp ? Y(lg(p.sp[k])) : null));
  const dots = [{ y:yOf(2), cls:'d-y' }, { y:yOf(1), cls:'d-m' }, { y:yOf(0), cls:'d-y' }];
  const cells = [{ v:sel.map(p => (p.sp ? fmtDays(p.sp[0]) : null)), key:'sq k-y', label:'unteres Viertel' },
    { v:sel.map(p => (p.sp ? fmtDays(p.sp[1]) : null)), key:'lk l-md', label:'Median' },
    { v:sel.map(p => (p.sp ? fmtDays(p.sp[2]) : null)), key:'sq k-y', label:'oberes Viertel' }];
  const DD = Object.assign({}, D, { pts:sel, cells, span:dayDiff(z.ds, sel[0].ds) });
  const th = pcThen(DD), a = sel[th.i];
  const extra = a !== z && a.sp ? `, ${DD.span >= 30 ? 'vor 30 Tagen' : `am ${pcDate(a.ds)}`} ${String(spanRound(a.sp[1])).replace('.', ',')}` : '';
  return head(extra) + pcSvg(DD, inner, grid, dots, `Behaltensdauer im Verlauf, Median ${fmtDays(z.sp[1])}, logarithmische Achse`) + pcCells(DD);
}

function progressChart(lang){
  const D = verlaufData(lang);
  if (!D || D.span < 7) return '';
  const hasW = D.pts.filter(p => p.w != null).length >= 2, hasG = !!D.pts[D.pts.length - 1].sp;
  const tabs = [['s', 'Sätze'], hasW ? ['w', 'Wörter'] : null, hasG ? ['g', 'Gedächtnis'] : null].filter(Boolean);
  const tab = tabs.some(([k]) => k === S.pcTab) ? S.pcTab : 's';
  const body = tab === 'w' ? verlaufWoerter(D) : tab === 'g' ? verlaufGedaechtnis(D, lang) : verlaufSaetze(D);
  S.pcEnter = false;
  const seg = tabs.length > 1 ? `<div class="minseg pcseg" role="radiogroup" aria-label="Ansicht">${tabs.map(([k, l]) => `<button type="button" role="radio" aria-checked="${tab === k}" data-a="pctab" data-t="${k}">${l}</button>`).join('')}</div>` : '';
  const rangeSeg = D.long ? `<div class="seg2 pcr" role="radiogroup">${[[false, 'Letztes Jahr'], [true, 'Seit Beginn']].map(([v, l]) => `<button type="button" role="radio" aria-checked="${!!D.all === v}" data-a="pcrange" data-v="${v ? 1 : 0}">${l}</button>`).join('')}</div>` : '';
  return `<h2 class="grp">Verlauf</h2>${rangeSeg}<div class="chart pcchart">${seg}${body}</div>`;
}

// Antippen und Ziehen zeigt die Werte eines Tages (Verlauf und Fehlerquote im Sprach-Tab); Pfeiltasten gehen Punkt für Punkt. Ohne neues Rendern: nur Fadenkreuz und Zahlen.
function armVerlauf(){ document.querySelectorAll('svg[data-pc]').forEach(armChart); }
function armChart(svg){
  if (svg.dataset.armed) return;
  let D; try { D = JSON.parse(svg.dataset.pc); } catch (e) { return; }
  svg.dataset.armed = '1';
  const box = svg.closest('.chart'), cells = box.querySelectorAll('[data-pv]'), date = box.querySelector('.pcdate'), cross = svg.querySelector('.pcx');
  const last = D.x.length - 1;
  let cur = last;
  const show = i => {
    cur = Math.max(0, Math.min(last, i));
    const x = D.x[cur], line = cross.querySelector('line');
    line.setAttribute('x1', x); line.setAttribute('x2', x);
    cross.classList.toggle('on', cur !== last);
    cross.querySelectorAll('circle').forEach(c => { const y = D.p[+c.dataset.s][cur]; if (y == null) c.setAttribute('visibility', 'hidden'); else { c.removeAttribute('visibility'); c.setAttribute('cx', x); c.setAttribute('cy', y); } });
    cells.forEach(c => { const v = D.v[+c.dataset.pv][cur]; c.textContent = v == null ? '–' : v; });
    if (date) date.textContent = D.d[cur];
  };
  const at = e => {
    const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * D.w;
    let best = 0; D.x.forEach((x, i) => { if (Math.abs(x - vx) < Math.abs(D.x[best] - vx)) best = i; });
    return best;
  };
  svg.addEventListener('pointerdown', e => show(at(e)));
  svg.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) show(at(e)); });
  svg.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') show(last); });
  svg.addEventListener('keydown', e => {
    const k = { ArrowLeft:cur - 1, ArrowRight:cur + 1, Home:0, End:last }[e.key];
    if (k == null) return;
    e.preventDefault(); show(k);
  });
}
