// Simuliert die Themen-Etappen (topicJudge aus part_stats.js) mit erfundenen Lernverläufen:
// Fehlalarme bei gleichbleibender Fehlerquote und wann echte Verbesserungen erkannt werden.
//   node tools/themen-etappen.js
// Zufall mit festem Startwert, die Ausgabe ist bei gleichem Code gleich.
const { loadApp } = require('../tests/helpers/load.js');
const app = loadApp(), judge = app.get('topicJudge'), B = app.get('TOPIC_BLOCK');
let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pois = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
// Verlauf: Fehlerquote je Tag p(d), Aufgaben je Tag im Mittel lam. Rückgabe: Etappen wie in der App
function run(pf, days, lam){
  const blocks = [], ev = []; let cur = 0, cn = 0;
  for (let d = 0; d < days; d++) for (let j = pois(lam); j > 0; j--) {
    if (rnd() < pf(d)) cur++;
    if (++cn < B) continue;
    blocks.push(cur); cur = 0; cn = 0;
    const from = ev.reduce((m, e) => Math.max(m, e.i), 0), r = judge(blocks, from, ev.some(e => e.s === 2));
    if (r) ev.push(Object.assign({ d }, r));
  }
  return ev;
}
const pc = x => Math.round(x[1] / x[0] * 100) + ' %';
const show = e => `Tag ${e.d} ${e.s === 2 ? 'sitzt' : 'halbiert'} (${e.c[0]} Aufgaben je Abschnitt): ${pc(e.b)} → ${pc(e.c)}`;
console.log('Gleichbleibende Fehlerquote, 5 Jahre, je 60 Themen: falsche Etappen je Themenjahr');
let all = 0, cells = 0;
for (const lam of [1.5, 3, 6]) {
  const row = [];
  for (const p of [0.05, 0.1, 0.2, 0.3, 0.45]) {
    let h = 0, s = 0;
    for (let r = 0; r < 60; r++) run(() => p, 365 * 5, lam).forEach(e => { if (e.s === 2) s++; else h++; });
    row.push(`${Math.round(p * 100)} %: ${(h / 300).toFixed(3)}${s ? ` (+${s} sitzt)` : ''}`); all += h / 300; cells++;
  }
  console.log(`  ${lam} Aufgaben/Tag  ${row.join('  ')}`);
}
console.log(`  Mittel ${(all / cells).toFixed(3)} je Themenjahr\n`);
const scen = (label, pf, days) => { console.log(label); for (let r = 0; r < 3; r++) console.log('  ' + (run(pf, days, 3).map(show).join(' | ') || 'nichts')); };
scen('Sprung von 30 % auf 12 % an Tag 200', d => (d < 200 ? 0.3 : 0.12), 700);
scen('Langsam von 10 % auf 5 % (Tag 180 bis 910), danach 5 %', d => (d < 180 ? 0.1 : d < 910 ? 0.1 - 0.05 * (d - 180) / 730 : 0.05), 1800);
scen('Lernkurve von 45 % auf 4 %', d => 0.04 + 0.41 * Math.exp(-d / 200), 1400);
scen('Ab Tag 300 schwerere Sätze (10 % → 25 %), dann Lernen', d => (d < 300 ? 0.1 : 0.04 + 0.21 * Math.exp(-(d - 300) / 150)), 1200);
