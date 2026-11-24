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
const MODEL = { H:14, M_MIN:2, M_MAX:200, M0:10, MIN_N:3, WEAK_P:0.75 };
// Fehlerquelle: ein Thema, das mit mindestens 75 % Wahrscheinlichkeit über deinem Schnitt liegt. Eine Definition für Heute,
// „Als Nächstes“, „Thema üben“ und die Grundlagensätze bei „Fortgeschritten“ (bis 24.72: vier verschiedene Regeln).
const isWeak = x => !!x && x.n >= MODEL.MIN_N && x.pAbove >= MODEL.WEAK_P;

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

// Modell einer Sprache aus dem Fehlerprotokoll (DB.tlog, Einträge p:Thema = [Aufgaben, Fehler] je Tag).
// Ergebnis: { mu, m, H, topics:[{ id, n, k (gewichtet), n30, k30 (letzte 30 Tage), mean, lo, hi, lo50, hi50, pAbove }] },
// nach Schätzung absteigend. Zwischengespeichert, solange sich Tag und Protokoll der Sprache nicht ändern.
let modelCache = {};
function topicModel(lang){
  const t = today(), days = Object.keys(DB.tlog || {}).sort();
  const sig = t + '|' + days.map(d => { const L = DB.tlog[d] && DB.tlog[d][lang]; return L ? d + Object.keys(L).filter(k => k.startsWith('p:')).map(k => k + L[k]).join() : ''; }).join(';');
  if (modelCache[lang] && modelCache[lang].sig === sig) return modelCache[lang].v;
  const by = {};
  days.forEach(d => {
    const L = DB.tlog[d] && DB.tlog[d][lang], age = dayDiff(t, d); if (!L || age < 0) return;
    const w = Math.pow(2, -age / MODEL.H);
    Object.keys(L).forEach(key => {
      if (!key.startsWith('p:') || !Array.isArray(L[key])) return;
      const [n, bad] = L[key], x = by[key.slice(2)] = by[key.slice(2)] || { id:key.slice(2), n:0, k:0, n30:0, k30:0 };
      x.n += w * n; x.k += w * bad;
      if (age < 30) { x.n30 += n; x.k30 += bad; }
    });
  });
  const list = Object.values(by), P = fitPrior(list), a0 = P.mu * P.m, b0 = (1 - P.mu) * P.m;
  const topics = list.map(x => {
    const a = a0 + x.k, b = b0 + x.n - x.k;
    return { id:x.id, n:x.n, k:x.k, n30:x.n30, k30:x.k30, mean:a / (a + b), lo:betaQ(0.025, a, b), hi:betaQ(0.975, a, b), lo50:betaQ(0.25, a, b), hi50:betaQ(0.75, a, b), pAbove:1 - ibeta(P.mu, a, b) };
  }).sort((p, q) => q.mean - p.mean || q.n - p.n);
  const v = { mu:P.mu, m:P.m, fitted:P.fitted, H:MODEL.H, topics };
  modelCache[lang] = { sig, v };
  return v;
}
const modelTopic = (lang, id) => topicModel(lang).topics.find(x => x.id === id) || null;
// Thompson-Sampling: je Thema ein θ aus der Posterior (ohne Daten: aus der Vorverteilung), absteigend sortiert.
// Ein Thema steht so oft vorn, wie wahrscheinlich es das schwächste ist.
function thompsonOrder(lang, ids, seed){
  const M = topicModel(lang), r = rng32(seed), a0 = M.mu * M.m, b0 = (1 - M.mu) * M.m;
  return ids.map(id => { const x = M.topics.find(y => y.id === id); return { id, v:betaDraw(a0 + (x ? x.k : 0), b0 + (x ? x.n - x.k : 0), r) }; })
    .sort((p, q) => q.v - p.v).map(x => x.id);
}
const focusSeed = (lang, week) => seedOf(`${week}:${lang}`);
