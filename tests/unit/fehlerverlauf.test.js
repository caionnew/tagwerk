// Fehlerquote über Monate (seit 24.107.0): dein Schnitt an jeder Stützstelle mit 50-%-Bereich, Wochensummen hinter dem
// Fehlerprotokoll. Dazu die Rückmeldung ohne Planung und ohne Thema bei richtigen Antworten, die Lösung in der gefragten Norm.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const text = html => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[ \t\n]+/g, ' ').trim();

// days Tage Protokoll, vier Themen, Fehlerquote sinkt von etwa 40 auf 20 %
function setup(days){
  app.run(`(() => {
    DB = freshDB(); DB.tlog = {}; DB.tweek = {}; S.lang = 'sv';
    for (let k = ${days}; k >= 0; k--) {
      const d = addDays(today(), -k), f = k / ${days}, L = {};
      ['inversion', 'bisats', 'species', 'tempus'].forEach((id, j) => { const n = 4 + j; L['p:' + id] = [n, Math.round(n * (0.2 + 0.2 * f) + (j === 2 ? 1 : 0))]; });
      L['t:free'] = [6, 2];
      DB.tlog[d] = { sv:L };
    }
  })()`);
}

test('Fehlerquote über Monate: letzter Wert ist dein Schnitt, Bereich enthält ihn, Stützstellen ab heute rückwärts', () => {
  setup(40);
  const H = run(`errHistory('sv')`), last = H.pts[H.pts.length - 1];
  assert.equal(H.step, 2, '40 Tage: alle zwei Tage, höchstens 20 Stellen');
  assert.equal(last.end, run('today()'));
  assert.ok(Math.abs(last.mu - run(`topicModel('sv').mu`)) < 1e-9);
  for (const p of H.pts.filter(x => x.mu != null)) assert.ok(p.lo <= p.mu && p.mu <= p.hi, `${p.end}: ${p.lo} ≤ ${p.mu} ≤ ${p.hi}`);
  assert.ok(H.pts[1].mu > last.mu + 0.05, 'die Quote sinkt');
  assert.equal(run(`errHistory('sv').step`), 2);
  setup(10);
  assert.equal(run(`errHistory('sv').step`), 1);
  setup(300);
  assert.equal(run(`errHistory('sv').step`), 28);
});

test('Fehlerprotokoll älter als 120 Tage: Zahlen wandern in Wochensummen, der Verlauf behält sie', () => {
  setup(160);
  const before = run(`errHistory('sv').pts.map(p => p.mu)`);
  const sum = code => run(`(() => { let n = 0, k = 0; ${code}; return [n, k]; })()`);
  const all = sum(`Object.values(DB.tlog).forEach(d => Object.keys(d.sv).filter(x => x.startsWith('p:')).forEach(x => { n += d.sv[x][0]; k += d.sv[x][1]; }))`);
  app.run('pruneTlog()');
  assert.ok(run('Object.keys(DB.tlog).every(d => dayDiff(today(), d) <= 120)'));
  const kept = sum(`Object.values(DB.tlog).forEach(d => Object.keys(d.sv).filter(x => x.startsWith('p:')).forEach(x => { n += d.sv[x][0]; k += d.sv[x][1]; }))`);
  const rolled = sum(`Object.values(DB.tweek).forEach(w => Object.keys(w.sv).filter(x => x.startsWith('p:')).forEach(x => { n += w.sv[x][0]; k += w.sv[x][1]; }))`);
  assert.deepEqual([kept[0] + rolled[0], kept[1] + rolled[1]], all, 'nichts geht verloren');
  assert.ok(run(`Object.values(DB.tweek).every(w => w.sv['t:free'])`), 'Übungsarten wandern mit');
  const after = run(`errHistory('sv').pts.map(p => p.mu)`);
  assert.equal(after.length, before.length);
  // Neuere Stellen gleich, ältere nah dran (Wochensumme zählt als Donnerstag)
  assert.ok(Math.abs(after[after.length - 1] - before[before.length - 1]) < 1e-9);
  after.forEach((v, i) => { if (v != null && before[i] != null) assert.ok(Math.abs(v - before[i]) < 0.03, `Stelle ${i}`); });
});

test('Themen: Karte mit Fehlerquote über die Zeit, Vergleich mit vor 4 Wochen; ohne drei Schätzungen keine Karte', () => {
  setup(40);
  const h = run(`topicListHtml('sv')`);
  assert.match(h, /<h2 class="grp">Themen<\/h2><div class="chart erchart">/);
  assert.match(text(h), /^Themen \d+\s% Fehlerquote ?, vor 4 Wochen \d+\s% (Heute|\S+) \d+\s% Schnitt \d+–\d+\s% 50-%-Bereich /);
  assert.match(h, /data-k="schaetzung">Fehlerquote<\/button>/);
  assert.match(h, /id="ercsvg"/);
  const mu = run(`topicModel('sv').mu`);
  assert.match(text(h), new RegExp(`^Themen ${Math.round(mu * 100)}\\s% Fehlerquote`));
  setup(1);
  assert.doesNotMatch(run(`topicListHtml('sv')`), /erchart/, 'zwei Tage, zwei Schätzungen');
});

test('Rückmeldung: kein „wann wieder“, Thema nur bei falscher Antwort; Lösung in der gefragten Norm; „tiene lugar“ und „gran sala“ gelten', () => {
  const answer = (target, input, extra = '') => run(`(() => { DB = freshDB(); const it = BANK.es.find(i => i.target === ${JSON.stringify(target)}); const ex = Object.assign({ type:'free', id:it.id }, ${extra || '{}'});
    S.run = { kind:'daily', lang:'es', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.run.cur = { input:${JSON.stringify(input)}, state:'answer' }; check();
    return { result:S.run.cur.result, fb:feedbackHtml(S.run, ex, S.run.cur), sol:solShown('es', ex, S.run.cur) }; })()`);
  const ok = answer('Hoy he trabajado mucho.', 'Hoy he trabajado mucho', `{ norm:'es' }`);
  assert.equal(ok.result, 'ok');
  assert.doesNotMatch(ok.fb, /wieder|Thema:/);
  const la = answer('Hoy he trabajado mucho.', 'Hoy trabajé mucho', `{ norm:'la' }`);
  assert.equal(la.result, 'ok');
  assert.equal(la.sol, 'Hoy trabajé mucho.', 'wie in Lateinamerika: die Lösung im Indefinido');
  const bad = answer('Hoy he trabajado mucho.', 'Hoy he comido mucho', `{ norm:'es' }`);
  assert.equal(bad.result, 'bad');
  assert.match(bad.fb, /<p class="src">Thema: Perfecto vs. Indefinido<\/p>/);
  assert.doesNotMatch(bad.fb, /wieder/);
  const R = 'La reunión será en la sala grande, que ya está reservada.';
  for (const inp of ['La reunión tiene lugar en la gran sala que ya está reservada', 'La reunión se celebra en la sala grande, que ya está reservada.', 'La reunión es en la gran sala que ya está reservada'])
    assert.equal(answer(R, inp).result, 'ok', inp);
  assert.equal(answer(R, 'La reunión está en la sala grande, que ya está reservada.').result, 'bad', 'estar für den Ort eines Ereignisses bleibt falsch');
});
