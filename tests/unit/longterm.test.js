// Nach Jahren: Etappen gehen nicht aus, Jahre werden zusammengefasst, Tagesstände bleiben klein.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const J = code => JSON.parse(JSON.stringify(app.run(code)));
// 5 Jahre jeden Tag ein Tagwerk: 40 Aufgaben, 15 Minuten, Schwedisch und Spanisch im Wechsel, Tagesstand mit Themen
const DAYS = 5 * 365 + 10;
app.run(`(() => {
  DB.log = {}; DB.done = {}; DB.snap = {}; DB.own = { sv:[], es:[] }; DB.texts = [];
  const topics = {}; TRAPS.sv.forEach(t => { topics[t.id] = 3; });
  for (let k = ${DAYS}; k >= 1; k--) {
    const d = addDays(today(), -k), l = k % 2 ? 'sv' : 'es';
    DB.log[d] = { [l]:{ n:40, secs:900, fresh:2, mat:1 } }; DB.done[d] = true;
    DB.snap[d] = { sv:{ n:400, m:150, k:300, w:900, t:topics }, es:{ n:300, m:120, k:250, w:700, t:topics } };
  }
})()`);
test('Etappen gehen nach Jahren weiter: Serien in Jahren, über 50.000 Aufgaben, Jahrestage, Übungstage', () => {
  const w = J('wayEvents()'), t = w.done.map(e => e.t);
  for (const want of ['1 Jahr in Folge', '2 Jahre in Folge', '1.000 Tage in Folge', '3 Jahre in Folge', '4 Jahre in Folge', '5 Jahre in Folge', '50.000 Aufgaben', '5 Jahre mit Tagwerk', '1.500 Übungstage'])
    assert.ok(t.includes(want), `fehlt: ${want}`);
  assert.ok(w.next.length >= 1, 'es gibt immer ein nächstes Ziel');
  const lad = Array.from(app.run('ladder(WAY_TASKS, x => x + 25000, 80000)'));
  assert.ok(lad.includes(75000) && lad.includes(100000), 'Aufgaben-Schwellen über die Liste hinaus');
  assert.equal(new Set(w.done.map(e => e.d + e.t)).size, w.done.length, 'keine doppelten Etappen');
});
test('Jahr für Jahr: Übungstage, längste Serie, je Sprache Aufgaben', () => {
  const ys = J('yearStats()');
  assert.ok(ys.length >= 5);
  const full = ys.find(y => !y.current && y.days >= 365);
  assert.ok(full, 'ein volles Jahr');
  assert.equal(full.run, full.days);
  assert.equal(full.sv.n + full.es.n, full.n);
  assert.ok(app.run('yearsHtml()').includes('Jahr für Jahr'));
});
test('Tagesstände: die letzten 120 Tage täglich, ältere nur Sonntage und Monatsenden; Speicher bleibt klein', () => {
  const before = Object.keys(J('DB.snap')).length;
  app.run('compactSnaps()');
  const keys = Object.keys(J('DB.snap')), recent = keys.filter(d => app.run(`dayDiff(today(), '${d}')`) <= 120);
  assert.equal(recent.length, 120);
  assert.ok(keys.length < before / 4, `${keys.length} von ${before}`);
  const size = app.run('JSON.stringify(DB).length');
  assert.ok(size < 1.5 * 1024 * 1024, `nach 5 Jahren ${Math.round(size / 1024)} KB`);
  // Verlauf und Etappen funktionieren mit den zusammengefassten Ständen weiter
  assert.ok(app.run("progressChart('sv')").includes('Verlauf'));
});
