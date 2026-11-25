// Veränderungspfeile je Thema (part_model.js, topicChange): wie oft ein Pfeil ohne echte Veränderung erscheint und wie oft eine
// echte Veränderung einen kräftigen Pfeil bekommt. Exakt über alle Ergebnisse der beiden Zeiträume (je 28 Tage), mit pLess und
// changeLevel der App; Ergebnisse mit Wahrscheinlichkeit unter 10⁻⁹ bleiben weg.
//   node tools/pfeile.js        (etwa eine Minute)
// Volumen je Thema wie im Backup vom 24.11.2026: im Median 1,2 Aufgaben am Tag, oberes Drittel 3, das meistgeübte 7,3.
// Ergebnis am 25.11.2026: ohne Veränderung je Thema 10 bis 13 % kräftige Pfeile (beide Richtungen zusammen), etwa 30 % mittlere,
// 40 % blasse, 12 bis 22 % keiner; bei 19 Themen also im Schnitt etwa 2 kräftige. Von 20 auf 10 % bekommt bei 1,2 am Tag ein Drittel
// einen kräftigen Pfeil nach unten (zwei Drittel mindestens einen mittleren, 9 % zeigen in die falsche Richtung), bei 3 am Tag 59 %,
// bei 7,3 am Tag 89 %. Von 20 auf 15 % ist bei 1,2 am Tag kaum zu sehen: 15 % kräftig, 24 % falsche Richtung.
const { loadApp } = require('../tests/helpers/load.js');
const app = loadApp(), pLess = app.get('pLess'), changeLevel = app.get('changeLevel');
const lgam = app.get('lgam'), pmf = (k, n, p) => Math.exp(lgam(n + 1) - lgam(k + 1) - lgam(n - k + 1) + k * Math.log(p) + (n - k) * Math.log1p(-p));
const range = (n, p) => { const m = n * p, s = Math.sqrt(n * p * (1 - p)); return [Math.max(0, Math.floor(m - 7 * s - 1)), Math.min(n, Math.ceil(m + 7 * s + 1))]; };
// Verteilung der Stufen (−3 … 3, negativ = besser) für wahre Quoten pA (jetzt) und pB (davor) bei je n Aufgaben
function levels(n, pA, pB){
  const out = {}, [a0, a1] = range(n, pA), [b0, b1] = range(n, pB);
  for (let ka = a0; ka <= a1; ka++) {
    const wa = pmf(ka, n, pA); if (wa < 1e-9) continue;
    for (let kb = b0; kb <= b1; kb++) {
      const w = wa * pmf(kb, n, pB); if (w < 1e-9) continue;
      const q = (ka + kb + 1) / (2 * n + 2), p = pLess(2 * q + ka, 2 * (1 - q) + n - ka, 2 * q + kb, 2 * (1 - q) + n - kb), l = changeLevel(p) * (p >= 0.5 ? -1 : 1);
      out[l] = (out[l] || 0) + w;
    }
  }
  return out;
}
const f = x => `${(100 * (x || 0)).toFixed(1)} %`;
for (const [r, lab] of [[1.2, 'Median'], [3, 'oberes Drittel'], [7.3, 'meistgeübt']]) {
  const n = Math.round(28 * r);
  console.log(`\n${r} Aufgaben am Tag (${lab}), je Zeitraum ${n}:`);
  for (const p of [0.1, 0.2, 0.3]) { const L = levels(n, p, p); console.log(`  ohne Veränderung bei ${p * 100} %: kräftig ${f((L[3] || 0) + (L[-3] || 0))}, mittel ${f((L[2] || 0) + (L[-2] || 0))}, blass ${f((L[1] || 0) + (L[-1] || 0))}, keiner ${f(L[0])}`); }
  for (const [b, a] of [[0.2, 0.1], [0.3, 0.15], [0.2, 0.15], [0.1, 0.2]]) { const L = levels(n, a, b); const dir = a < b ? -1 : 1;
    console.log(`  von ${b * 100} auf ${a * 100} %: kräftig richtig ${f(L[3 * dir])}, mindestens mittel ${f((L[3 * dir] || 0) + (L[2 * dir] || 0))}, falsche Richtung ${f((L[-dir] || 0) + (L[-2 * dir] || 0) + (L[-3 * dir] || 0))}`); }
}
