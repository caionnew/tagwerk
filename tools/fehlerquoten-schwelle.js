// Schwelle für „klar über Schnitt“ (part_model.js, clearSet): Regeln mit und ohne Hysterese in Szenarien, mit fitPrior/ibeta der App.
//   node tools/fehlerquoten-schwelle.js        (einige Minuten)
// Volumen je Thema wie im Backup vom 24.11.2026 (Schwedisch, 19 Themen, Aufgaben je Tag). Zufall mit festem Startwert.
// Gleichgewicht: Tage 45–135, täglich neu gerechnet. „falsch“: markiert, obwohl die wahre Quote nicht über dem Schnitt der Themen
// liegt; „klar schwere“: wahre Quote mindestens 8 Punkte über dem Schnitt. Dynamik: ein Thema mit 1,2 Aufgaben am Tag springt an
// Tag 60 von 35 auf 15 % (bzw. umgekehrt); gezählt wird, nach wie vielen Tagen sich die Markierung ändert.
// Ergebnis am 25.11.2026 (Grundlage für 90/60): realistisch 0,75 → 2,3 markiert, 0,11 falsch, 50 % der klar schweren, 14,7 Wechsel
// im Monat; 90/60 → 1,8 markiert, 0,02 falsch, 48 %, 1,7 Wechsel; Tage bis markiert (Median) 12 gegen 27, bis nicht mehr 11 gegen 19.
const { loadApp } = require('../tests/helpers/load.js');
const app = loadApp(), fitPrior = app.get('fitPrior'), ibeta = app.get('ibeta'), H = app.get('MODEL').H, MIN_N = app.get('MODEL').MIN_N;
const RATES = [7.3, 3.7, 3.0, 1.3, 1.3, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2, 1.1, 1.0, 0.5, 0.5, 0.5, 0.3, 0.3, 0.3], K = RATES.length;
let seed = 99; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pois = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
const gamma = k => { if (k < 1) return gamma(k + 1) * Math.pow(rnd(), 1 / k); const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d); for (;;) { let x, v; do { x = Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd()); v = 1 + c * x; } while (v <= 0); v = v * v * v; if (Math.log(rnd()) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v; } };
const beta = (m, s) => { const a = gamma(m * s), b = gamma((1 - m) * s); return a / (a + b); };
function simulate(th, D){ const log = []; for (let d = 0; d < D; d++) { const row = []; for (let t = 0; t < K; t++) { const n = pois(RATES[t]); let k = 0; for (let j = 0; j < n; j++) if (rnd() < th(t, d)) k++; row.push([n, k]); } log.push(row); } return log; }
// inkrementell: gewichtete Summen je Tag fortschreiben
function dailyP(log, D){
  const out = [], n = new Array(K).fill(0), k = new Array(K).fill(0), f = Math.pow(2, -1 / H);
  for (let e = 0; e < D; e++) {
    for (let t = 0; t < K; t++) { n[t] = n[t] * f + log[e][t][0]; k[t] = k[t] * f + log[e][t][1]; }
    const list = []; for (let t = 0; t < K; t++) if (n[t] > 0) list.push({ t, n:n[t], k:k[t] });
    const P = fitPrior(list), a0 = P.mu * P.m, b0 = (1 - P.mu) * P.m, p = new Array(K).fill(0), ok = new Array(K).fill(false);
    list.forEach(z => { p[z.t] = 1 - ibeta(P.mu, a0 + z.k, b0 + z.n - z.k); ok[z.t] = z.n >= MIN_N; });
    out.push({ p, ok });
  }
  return out;
}
const RULES = [[0.75, 0.75], [0.8, 0.8], [0.9, 0.9], [0.8, 0.6], [0.8, 0.5], [0.9, 0.6], [0.9, 0.7], [0.95, 0.7]];
function apply(P, enter, leave, from, to){ let st = new Array(K).fill(false); const res = []; for (let e = 0; e < to; e++) { st = st.map((s, t) => P[e].ok[t] && (P[e].p[t] >= enter || (s && P[e].p[t] >= leave))); if (e >= from) res.push(st.slice()); } return res; }
const R_EQ = 30, R_DYN = 60;
const SC = { 'Realistisch': () => { const th = RATES.map(() => beta(0.17, 40)); return t => th[t]; }, 'Alle gleich': () => () => 0.17, 'Drei klar schwerer': () => t => (t % 7 === 3 ? 0.35 : 0.15) };
for (const [name, mk] of Object.entries(SC)) {
  const acc = RULES.map(() => ({ flips:0, flag:0, fp:0, hit:0, clear:0, days:0 })), R = R_EQ;
  for (let r = 0; r < R; r++) {
    const th = mk(), thv = [...Array(K).keys()].map(t => th(t, 0)), mean = thv.reduce((a, b) => a + b, 0) / K;
    const P = dailyP(simulate(th, 135), 135);
    RULES.forEach(([en, le], i) => { const S_ = apply(P, en, le, 45, 135), A = acc[i];
      S_.forEach((st, j) => { A.days++; st.forEach((f, t) => { const clear = thv[t] >= mean + 0.08; if (clear) A.clear++; if (f) { A.flag++; if (thv[t] <= mean + 1e-9) A.fp++; if (clear) A.hit++; } if (j && f !== S_[j - 1][t]) A.flips++; }); }); });
  }
  console.log(`\n${name} (Gleichgewicht, Tage 45–135):`);
  RULES.forEach(([en, le], i) => { const A = acc[i]; console.log(`  rein ${en} / raus ${le}: ${(A.flag / A.days).toFixed(1)} markiert, ${(A.fp / A.days).toFixed(2)} falsch, ${A.clear ? Math.round(A.hit / A.clear * 100) + ' % der klar schweren, ' : ''}${(A.flips / A.days * 30).toFixed(1)} Wechsel im Monat`); });
}
console.log('\nDynamik (Thema mit 1,2 am Tag, übrige 15 % ±6): Tage bis Status wechselt (Median / 80 %)');
const med = RATES.findIndex(r => r <= 1.25);
for (const [lab, a, b] of [['wird besser 35 → 15 %, bis nicht mehr markiert', 0.35, 0.15], ['wird schlechter 15 → 35 %, bis markiert', 0.15, 0.35]]) {
  const res = RULES.map(() => []);
  for (let r = 0; r < R_DYN; r++) {
    const base = RATES.map(() => beta(0.15, 40)), th = (t, d) => (t === med ? (d < 60 ? a : b) : base[t]), P = dailyP(simulate(th, 150), 150);
    RULES.forEach(([en, le], i) => { const S_ = apply(P, en, le, 0, 150); let hit = 999; for (let e = 60; e < 150; e++) { const f = S_[e][med]; if ((a > b && !f) || (a < b && f)) { hit = e - 60; break; } } res[i].push(hit); });
  }
  const q = (v, p) => { const s = [...v].sort((x, y) => x - y), x = s[Math.floor(p * s.length)]; return x === 999 ? '>90' : x; };
  console.log(`  ${lab}: ` + RULES.map(([en, le], i) => `${en}/${le}: ${q(res[i], 0.5)}/${q(res[i], 0.8)}`).join('  '));
}
