/* ---------- Fehlermodell: Fehlerquote je Thema, Beta-Binomial mit Vergessen, empirisch-bayessch ---------- */
// Modell je Sprache: Die Fehlerquote θ eines Themas stammt aus einer gemeinsamen Verteilung Beta(μm, (1−μ)m), die Antworten
// sind binomial. Nach den Daten ist θ verteilt wie Beta(μm + k, (1−μ)m + n − k). Daraus kommen alle Zahlen:
//   Schätzung = Posterior-Mittel (k + mμ)/(n + m), Bereich = 25–75 % und 2,5–97,5 % der Posterior, P(θ > μ).
// Vergessen statt Fenster (Diskontmodell): Eine Antwort von vor a Tagen zählt 2^(−a/H) mit H = 14. Bei rund 1 Aufgabe je Thema
// und Tag (Backup vom 24.11.: 29 Themen-Aufgaben je Sprache und Tag, Median 1,2 je Thema) bleiben gut 20 gewichtete Aufgaben,
// beim meistgeübten Thema (7 bis 8 am Tag) rund 160. Nach einer Pause werden die Bereiche breiter und die Schätzungen rücken
// zum Schnitt: Die App weiß dann weniger darüber, wie du gerade stehst.
// μ und m aus deinen Themen: Modus der Posterior von (μ, m) mit der Hyperprior p(μ, m) ∝ m^(−3/2), also p(α, β) ∝ (α+β)^(−5/2)
// nach Gelman u. a., Bayesian Data Analysis, Kap. 5. Ohne sie läge das Maximum der Randlikelihood oft bei m → ∞: In den ersten
// Wochen (Backup vom 24.11.) streuen die Themen nicht mehr, als der Zufall erklärt; die Likelihood ist ab m ≈ 20 fast flach.
// Erst ab drei Themen mit mindestens 3 gewichteten Aufgaben; sonst die gepoolte Quote und m = 10 (wie bis 24.71).
// Kein Trend je Thema (24.72.0 hatte „besser“/„schlechter“, 14 gegen 28 Tage): Bei rund 1 Aufgabe je Thema und Tag stehen
// 17 gegen 34 Aufgaben, der Standardfehler liegt bei ±10 Punkten. Ein Thema bei 20 % hätte selbst bei 0 % nie „besser“ gezeigt,
// ohne Änderung aber 3 bis 10 % Fehlalarme (am meisten beim Schwerpunkt). Fortschritt zeigt die Schätzung selbst, gesicherte
// Verbesserungen die Themen-Etappen (part_stats.js). Rechnung in docs/RESEARCH.md.
// Schwerpunkt der Woche: Thompson-Sampling, je Thema ein θ aus der Posterior gezogen, mit der Woche als festem Startwert.
const MODEL = { H:14, M_MIN:2, M_MAX:200, M0:10, MIN_N:3, CLEAR_IN:0.9, CLEAR_OUT:0.6 };
// Anzeigen und Handeln getrennt (seit 24.74): Angezeigt werden immer die höchsten Schätzungen (Heute 3, „Thema üben“ 3, Sprach-Tab 6),
// auch wenn alle Themen gleich liegen. Gehandelt wird nur bei „klar über Schnitt“: Grundlagensätze bei „Fortgeschritten“,
// Tatoeba-Nachschub dort und „Als Nächstes“. Bis 24.73 hieß beides „Fehlerquelle“ mit P(θ > μ) ≥ 75 %, ohne Gedächtnis: Die Liste
// wechselte im Dauerbetrieb etwa 15-mal im Monat, ein Thema fiel allein durchs Vergessen heraus (tools/fehlerquoten-schwelle.js).
// „Klar über Schnitt“ mit Hysterese: rein ab P(θ > μ) ≥ 90 %, raus erst unter 60 %. In der Simulation mit deinem Volumen fast so
// viele klar schwere Themen erkannt wie mit 75 % (48 gegen 50 %), ein Fünftel der Fehlalarme, 1,7 statt 15 Wechsel im Monat;
// dafür kommt eine neue Schwäche bei 1,2 Aufgaben am Tag im Median erst nach 27 statt 12 Tagen dazu.
// Gedächtnis im Speicherstand: DB.clear[lang] = { day, prev, cur }; prev ist der Stand vom letzten früheren Tag, cur der von heute.
// Fehlt das Feld (ältere Stände), zählt nur die Schwelle zum Hereinkommen.
function clearSet(lang){
  const M = topicModel(lang), t = today(); DB.clear = DB.clear || {};
  const s = DB.clear[lang], base = new Set(s ? (s.day === t ? s.prev : s.cur) || [] : []);
  const cur = M.topics.filter(x => x.n >= MODEL.MIN_N && (x.pAbove >= MODEL.CLEAR_IN || (base.has(x.id) && x.pAbove >= MODEL.CLEAR_OUT))).map(x => x.id);
  if (!s || s.day !== t || (s.cur || []).join() !== cur.join()) DB.clear[lang] = { day:t, prev:[...base], cur };
  return new Set(cur);
}
// Die höchsten Schätzungen unter den Themen, die sich üben lassen (topicIds), ab 3 gewichteten Aufgaben; für Heute und „Thema üben“.
// Erst, wenn das Modell gerechnet hat (mindestens 3 Themen mit Daten), sonst stünde dort nur der gepoolte Schnitt.
function topRates(lang, k){
  const M = topicModel(lang); if (!M.fitted) return [];
  const ids = new Set(topicIds(lang)), clear = clearSet(lang);
  return M.topics.filter(x => ids.has(x.id) && x.n >= MODEL.MIN_N).slice(0, k).map(x => Object.assign({ label:trapMeta(lang, x.id).label, clear:clear.has(x.id) }, x));
}

// Logarithmus der Gammafunktion (Lanczos, g = 7)
const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgam(x){
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgam(1 - x);
  x -= 1; let a = LANCZOS[0]; const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
const lbeta = (a, b) => lgam(a) + lgam(b) - lgam(a + b);
// Regularisierte unvollständige Betafunktion I_x(a, b): Kettenbruch nach Lentz, für große x über die Symmetrie
function betacf(x, a, b){
  const TINY = 1e-300, qab = a + b, qap = a + 1, qam = a - 1, fix = v => (Math.abs(v) < TINY ? TINY : v);
  let c = 1, d = 1 / fix(1 - qab * x / qap), h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 / fix(1 + aa * d); c = fix(1 + aa / c); h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 / fix(1 + aa * d); c = fix(1 + aa / c); const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return h;
}
function ibeta(x, a, b){
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta(a, b));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(x, a, b) / a : 1 - bt * betacf(1 - x, b, a) / b;
}
// Quantil der Beta-Verteilung: Bisektion auf I_x, 30 Schritte (Genauigkeit 1e-9)
function betaQ(p, a, b){ let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (ibeta(mid, a, b) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; }
// Zufall mit festem Startwert (mulberry32) und Ziehungen aus Gamma- und Betaverteilung (Marsaglia–Tsang)
function rng32(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function seedOf(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function gammaDraw(k, r){
  if (k < 1) return gammaDraw(k + 1, r) * Math.pow(r() || 1e-12, 1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r()); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    if (Math.log(r() || 1e-12) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}
const betaDraw = (a, b, r) => { const x = gammaDraw(a, r); return x / (x + gammaDraw(b, r)); };

// μ und m: Modus von Σ [ln B(μm + k, (1−μ)m + n − k) − ln B(μm, (1−μ)m)] − 1,5 ln m über die Themen mit Daten.
// Verschachtelter goldener Schnitt: außen ln m zwischen ln 2 und ln 200, innen μ zwischen 0,005 und 0,95 (je 30 Schritte).
function golden(f, lo, hi, steps){
  const g = (Math.sqrt(5) - 1) / 2; let a = lo, b = hi, c = b - g * (b - a), d = a + g * (b - a), fc = f(c), fd = f(d);
  for (let i = 0; i < steps; i++) { if (fc > fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); } else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); } }
  return fc > fd ? { x:c, v:fc } : { x:d, v:fd };
}
function fitPrior(list){
  const N = list.reduce((s, x) => s + x.n, 0), K = list.reduce((s, x) => s + x.k, 0);
  const pooled = N ? Math.min(0.95, Math.max(0.02, K / N)) : 0.15, use = list.filter(x => x.n >= MODEL.MIN_N);
  if (use.length < 3) return { mu:pooled, m:MODEL.M0, fitted:false };
  const ll = (mu, m) => { const a = mu * m, b = (1 - mu) * m, l0 = lbeta(a, b); let s = -1.5 * Math.log(m); for (const x of use) s += lbeta(a + x.k, b + x.n - x.k) - l0; return s; };
  const inner = m => golden(mu => ll(mu, m), 0.005, 0.95, 30);
  const best = golden(lm => inner(Math.exp(lm)).v, Math.log(MODEL.M_MIN), Math.log(MODEL.M_MAX), 30), m = Math.exp(best.x);
  return { mu:inner(m).x, m, fitted:true };
}

// Modell aus dem Fehlerprotokoll (DB.tlog, je Tag [Aufgaben, Fehler]): pre 'p' = Themen, 't' = Übungsarten (seit 24.75 dasselbe
// Modell für beide, vorher roh über 30 Tage). at: Stichtag, sonst heute; für den Verlauf im Themenblatt.
// Ergebnis: { mu, m, H, topics:[{ id, n, k (gewichtet), n30, k30 (letzte 30 Tage), mean, lo, hi, lo50, hi50, pAbove }] },
// nach Schätzung absteigend. Zwischengespeichert, solange sich Tag und Protokoll der Gruppe nicht ändern.
let modelCache = {};
function rateModel(lang, pre, at){
  const t = at || today(), days = Object.keys(DB.tlog || {}).filter(d => d <= t).sort(), P = pre + ':', ck = lang + P + (at || '');
  const sig = t + '|' + days.map(d => { const L = DB.tlog[d] && DB.tlog[d][lang]; return L ? d + Object.keys(L).filter(k => k.startsWith(P)).map(k => k + L[k]).join() : ''; }).join(';');
  if (modelCache[ck] && modelCache[ck].sig === sig) return modelCache[ck].v;
  const by = {};
  days.forEach(d => {
    const L = DB.tlog[d] && DB.tlog[d][lang], age = dayDiff(t, d); if (!L || age < 0) return;
    const w = Math.pow(2, -age / MODEL.H);
    Object.keys(L).forEach(key => {
      if (!key.startsWith(P) || !Array.isArray(L[key])) return;
      const [n, bad] = L[key], x = by[key.slice(2)] = by[key.slice(2)] || { id:key.slice(2), n:0, k:0, n30:0, k30:0 };
      x.n += w * n; x.k += w * bad;
      if (age < 30) { x.n30 += n; x.k30 += bad; }
    });
  });
  const list = Object.values(by), F = fitPrior(list), a0 = F.mu * F.m, b0 = (1 - F.mu) * F.m;
  const topics = list.map(x => {
    const a = a0 + x.k, b = b0 + x.n - x.k;
    return { id:x.id, n:x.n, k:x.k, n30:x.n30, k30:x.k30, mean:a / (a + b), lo:betaQ(0.025, a, b), hi:betaQ(0.975, a, b), lo50:betaQ(0.25, a, b), hi50:betaQ(0.75, a, b), pAbove:1 - ibeta(F.mu, a, b) };
  }).sort((p, q) => q.mean - p.mean || q.n - p.n);
  const v = { mu:F.mu, m:F.m, fitted:F.fitted, H:MODEL.H, topics };
  modelCache[ck] = { sig, v };
  return v;
}
function topicModel(lang){ return rateModel(lang, 'p'); }
function typeModel(lang){ return rateModel(lang, 't'); }
// Thompson-Sampling: je Thema ein θ aus der Posterior (ohne Daten: aus der Vorverteilung), absteigend sortiert.
// Ein Thema steht so oft vorn, wie wahrscheinlich es das schwächste ist.
function thompsonOrder(lang, ids, seed){
  const M = topicModel(lang), r = rng32(seed), a0 = M.mu * M.m, b0 = (1 - M.mu) * M.m;
  return ids.map(id => { const x = M.topics.find(y => y.id === id); return { id, v:betaDraw(a0 + (x ? x.k : 0), b0 + (x ? x.n - x.k : 0), r) }; })
    .sort((p, q) => q.v - p.v).map(x => x.id);
}
const focusSeed = (lang, week) => seedOf(`${week}:${lang}`);

/* ---------- Veränderung je Thema: die letzten vier Wochen gegen die vier davor ---------- */
// Seit 24.75 ein Pfeil je Thema, auch wenn er oft nur Rauschen zeigt; seine Kräftigkeit sagt, wie sicher er ist.
// Zwei getrennte Zeiträume zu 28 Tagen, gezählt bis zum letzten Sonntag: Die Pfeile ändern sich nur montags (im Takt des
// Schwerpunkts), nicht mit jeder Aufgabe. Je Zeitraum Beta(2q + k, 2(1 − q) + n − k) mit q = (kA + kB + 1)/(nA + nB + 2):
// eine schwache Vorverteilung ums Thema selbst (2 Aufgaben), damit ein Zeitraum mit 0 Fehlern nicht 0 % behauptet.
// P(besser) = P(θ_jetzt < θ_davor), exakt als Integral (pLess). Richtung nach P, Stufe nach der Sicherheit |2P − 1|:
// unter 0,2 (P zwischen 40 und 60 %) kein Pfeil, dann blass ab 60 %, mittel ab 80 %, kräftig ab 95 %.
// Erst, wenn das Protokoll der Sprache acht volle Wochen zurückreicht, und je Thema ab 5 Aufgaben in jedem Zeitraum.
// Ohne jede Veränderung zeigt ein Thema mit 10 bis 13 % Wahrscheinlichkeit einen kräftigen Pfeil, bei 19 Themen also meist
// ein bis drei; von 20 auf 10 % bekommt bei 1,2 Aufgaben am Tag ein Drittel einen kräftigen Pfeil (tools/pfeile.js, docs/RESEARCH.md).
// Darum ohne Farbe, und die Zahlen dazu stehen im Themenblatt.
Object.assign(MODEL, { CH_DAYS:28, CH_MIN:5, CH_LV:[0.2, 0.6, 0.9] });
// P(X1 < X2) für X1 ~ Beta(a1, b1), X2 ~ Beta(a2, b2): ∫ f2(y) I_y(a1, b1) dy, mit Simpson (400 Schritte) nach einer
// Substitution, die die Dichte von X2 endlich macht. Spitze bei 0 (a2 < 1, kommt vor, wenn ein Zeitraum ohne Fehler ist:
// a = 2q mit kleinem q): y = s^(1/a2), dann ist f2(y) dy = (1 − y)^(b2 − 1) / (a2 B) ds; Spitze bei 1 (b2 < 1) gespiegelt;
// sonst y = sin²(πs/2). Außen steht immer die spitzere Verteilung, sonst stiege I_y innen zu steil an:
// P(X1 < X2) = 1 − P(X2 < X1). Auf vier Stellen gleich mit adaptiver Quadratur (scipy), auch für Zeiträume ohne Fehler.
function pLess(a1, b1, a2, b2, swapped){
  const m1 = Math.min(a1, b1);
  if (!swapped && m1 < Math.min(a2, b2) && m1 < 1) return 1 - pLess(a2, b2, a1, b1, true);
  const N = 400, lb = lbeta(a2, b2), mode = a2 < 1 && b2 >= 1 ? 0 : b2 < 1 && a2 >= 1 ? 1 : 2;
  // Randwerte: Nur bei gespiegelter Spitze (s = 0 ist y = 1, I = 1) und in den Grenzfällen a2 = 1, b2 = 1 oder b2 = ½ nicht 0
  let sum = mode === 0 ? (b2 === 1 ? Math.exp(-lb) / a2 : 0) : mode === 1 ? Math.exp(-lb) / b2 : b2 === 0.5 ? Math.PI * Math.exp(-lb) : 0;
  for (let i = 1; i < N; i++) {
    const s = i / N, w = i % 2 ? 4 : 2;
    if (mode === 0) { const y = Math.pow(s, 1 / a2); sum += w * Math.exp((b2 - 1) * Math.log1p(-y) - lb) / a2 * ibeta(y, a1, b1); }
    else if (mode === 1) { const z = Math.pow(s, 1 / b2); sum += w * Math.exp((a2 - 1) * Math.log1p(-z) - lb) / b2 * (1 - ibeta(z, b1, a1)); }
    else { const u = Math.PI / 2 * s, sn = Math.sin(u), cs = Math.cos(u); sum += w * Math.PI * Math.exp((2 * a2 - 1) * Math.log(sn) + (2 * b2 - 1) * Math.log(cs) - lb) * ibeta(sn * sn, a1, b1); }
  }
  return Math.min(1, Math.max(0, sum / (3 * N)));
}
const changeLevel = p => { const c = Math.abs(2 * p - 1), L = MODEL.CH_LV; return c < L[0] ? 0 : c < L[1] ? 1 : c < L[2] ? 2 : 3; };
const mondayOnOrAfter = d => { const m = mondayOf(d); return m === d ? d : addDays(m, 7); };
// { ready, from (erster Montag mit Pfeilen), mon, aFrom, bFrom, topics:{ id:{ A:{n,k}, B:{n,k}, p, lvl, better } } }
let changeCache = {};
function topicChange(lang){
  const mon = mondayOf(today()), aFrom = addDays(mon, -MODEL.CH_DAYS), bFrom = addDays(aFrom, -MODEL.CH_DAYS);
  const all = Object.keys(DB.tlog || {}).filter(d => DB.tlog[d] && DB.tlog[d][lang] && Object.keys(DB.tlog[d][lang]).some(k => k.startsWith('p:'))).sort();
  const days = all.filter(d => d < mon), first = all[0] || null;
  const sig = mon + '|' + first + '|' + days.filter(d => d >= bFrom).map(d => d + Object.keys(DB.tlog[d][lang]).filter(k => k.startsWith('p:')).map(k => k + DB.tlog[d][lang][k]).join()).join(';');
  if (changeCache[lang] && changeCache[lang].sig === sig) return changeCache[lang].v;
  const from = first ? mondayOnOrAfter(addDays(first, 2 * MODEL.CH_DAYS)) : null;
  const A = {}, B = {}, add = (O, id, v) => { const x = O[id] = O[id] || { n:0, k:0 }; x.n += v[0]; x.k += v[1]; };
  days.forEach(d => { const O = d >= aFrom ? A : d >= bFrom ? B : null; if (!O) return; const L = DB.tlog[d][lang]; Object.keys(L).forEach(k => { if (k.startsWith('p:') && Array.isArray(L[k])) add(O, k.slice(2), L[k]); }); });
  const topics = {};
  new Set(Object.keys(A).concat(Object.keys(B))).forEach(id => {
    const a = A[id] || { n:0, k:0 }, b = B[id] || { n:0, k:0 }; let p = null;
    if (a.n >= MODEL.CH_MIN && b.n >= MODEL.CH_MIN) { const q = (a.k + b.k + 1) / (a.n + b.n + 2); p = pLess(2 * q + a.k, 2 * (1 - q) + a.n - a.k, 2 * q + b.k, 2 * (1 - q) + b.n - b.k); }
    topics[id] = { A:a, B:b, p, lvl:p == null ? 0 : changeLevel(p), better:p != null && p >= 0.5 };
  });
  const v = { ready:!!first && first <= bFrom, from, mon, aFrom, bFrom, topics };
  changeCache[lang] = { sig, v };
  return v;
}
// Verlauf eines Themas über 12 Wochen: je Woche die Schätzung am Sonntag (diese Woche: heute) und die rohe Wochenquote
function topicHistory(lang, id){
  const t = today(), mon = mondayOf(t), out = [];
  for (let w = 11; w >= 0; w--) {
    const from = addDays(mon, -7 * w), end = w ? addDays(from, 6) : t, M = rateModel(lang, 'p', w ? end : null), x = M.fitted ? M.topics.find(y => y.id === id) : null;
    let n = 0, k = 0;
    for (let d = from; d <= end; d = addDays(d, 1)) { const v = DB.tlog && DB.tlog[d] && DB.tlog[d][lang] && DB.tlog[d][lang]['p:' + id]; if (Array.isArray(v)) { n += v[0]; k += v[1]; } }
    out.push({ from, end, mu:M.mu, fitted:M.fitted, mean:x && x.n >= MODEL.MIN_N ? x.mean : null, lo50:x ? x.lo50 : null, hi50:x ? x.hi50 : null, n, k });
  }
  return out;
}
