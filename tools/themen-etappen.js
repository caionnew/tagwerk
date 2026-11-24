// Simuliert die Themen-Etappen (topicJudge aus part_stats.js) mit erfundenen Lernverläufen:
// Fehlalarme bei gleichbleibender Fehlerquote und wann echte Verbesserungen erkannt werden.
//   node tools/themen-etappen.js
// Zufall mit festem Startwert, die Ausgabe ist bei gleichem Code gleich.
// Volumen wie im Backup vom 24.11.2026: je Sprache rund 30 Themen-Aufgaben am Tag, je Thema im Median 1,2, das obere Viertel
// 1,3 bis 1,7, der Schwerpunkt der Woche 7 bis 8. „Schwerpunkt-Wochen“: im Schnitt jede 15. Woche ist das Thema Schwerpunkt.
const { loadApp } = require('../tests/helpers/load.js');
const app = loadApp(), judge = app.get('topicJudge'), B = app.get('TOPIC_BLOCK');
let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pois = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
// Verlauf: Fehlerquote je Tag p(d), Aufgaben je Tag im Mittel lam(d). Rückgabe: Etappen wie in der App
function run(pf, days, lam){
  const blocks = [], ev = []; let cur = 0, cn = 0;
  for (let d = 0; d < days; d++) for (let j = pois(lam(d)); j > 0; j--) {
    if (rnd() < pf(d)) cur++;
    if (++cn < B) continue;
    blocks.push(cur); cur = 0; cn = 0;
    const from = ev.reduce((m, e) => Math.max(m, e.i), 0), r = judge(blocks, from, ev.some(e => e.s === 2));
    if (r) ev.push(Object.assign({ d }, r));
  }
  return ev;
}
const flat = l => () => () => l;
const burst = () => { const wk = {}; return d => { const w = Math.floor(d / 7); if (!(w in wk)) wk[w] = rnd() < 1 / 15; return wk[w] ? 7 : 1.2; }; };
const VOL = [['0,6 am Tag', flat(0.6)], ['1,2 (Median)', flat(1.2)], ['1,2 + Schwerpunkt-Wochen', burst], ['3,7', flat(3.7)], ['7,3 (Schwerpunkt)', flat(7.3)]];
const q = (a, p) => { if (!a.length) return '—'; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

console.log('Gleichbleibende Fehlerquote, 5 Jahre, je 200 Themen: falsche Etappen je Themenjahr');
let all = 0, cells = 0;
for (const [lab, mk] of VOL) {
  const row = [];
  for (const p of [0.05, 0.1, 0.2, 0.3, 0.45]) {
    let h = 0, s = 0;
    for (let r = 0; r < 200; r++) run(() => p, 365 * 5, mk()).forEach(e => { if (e.s === 2) s++; else h++; });
    row.push(`${Math.round(p * 100)} %: ${(h / 1000).toFixed(3)}${s ? ` (+${s} sitzt)` : ''}`); all += h / 1000; cells++;
  }
  console.log(`  ${lab.padEnd(25)} ${row.join('  ')}`);
}
console.log(`  Mittel ${(all / cells).toFixed(3)} je Themenjahr\n`);

// Erste Etappe nach einer echten Verbesserung: Tag (Median / 80 % der Themen bis) und Anteil der Themen mit Etappe in 4 Jahren.
// Bei Sprüngen geht ein Vorlauf von 200 Tagen auf dem alten Stand voraus; gezählt wird ab dem Sprung.
const SC = [
  ['Sprung von 30 % auf 8 %', () => 0.3, () => 0.08],
  ['Sprung von 20 % auf 10 %', () => 0.2, () => 0.1],
  ['Lernkurve von 25 % auf 6 % (Zeitkonstante 90 Tage, ohne Vorlauf)', null, d => 0.06 + 0.19 * Math.exp(-d / 90)]
];
for (const [lab, pre, pf] of SC) {
  console.log(`${lab}: erste Etappe am Tag (Median / 80 %), Anteil der Themen`);
  for (const [vl, mk] of VOL) {
    const h = [], s = [], off = pre ? 200 : 0;
    for (let r = 0; r < 300; r++) {
      const ev = run(d => (d < off ? pre(d) : pf(d - off)), 1460 + off, mk()).filter(e => e.d >= off);
      const eh = ev.find(e => e.s === 1), es = ev.find(e => e.s === 2);
      if (eh) h.push(eh.d - off); if (es) s.push(es.d - off);
    }
    console.log(`  ${vl.padEnd(25)} halbiert ${q(h, 0.5)} / ${q(h, 0.8)} (${Math.round(h.length / 3)} %)   sitzt ${q(s, 0.5)} / ${q(s, 0.8)} (${Math.round(s.length / 3)} %)`);
  }
}
