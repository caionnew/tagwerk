// Fehlermodell (part_model.js): Mathematik gegen scipy, Vergessen, empirisches Bayes mit Hyperprior, Trend, Thompson-Sampling,
// und die Stellen, die es nutzen. Sollwerte aus scipy 1.18 (stats.beta, special.betainc, Nelder–Mead auf derselben Zielfunktion).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const near = (a, b, eps, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg || ''} ${a} statt ${b}`);
// Sechs Übungstage in 28 Tagen, fünf schwedische Themen
const SYN = `(() => { DB = freshDB(); DB.focus = {}; const ds = k => addDays(today(), -k); DB.tlog = {
  [ds(0)]: { sv: { 'p:inversion':[8,1], 'p:bisats':[4,1], 'p:species':[2,1], 'p:tempus':[3,0] } },
  [ds(3)]: { sv: { 'p:inversion':[7,0], 'p:bisats':[3,1], 'p:species':[1,1], 'p:tempus':[3,1], 'p:tid':[2,0] } },
  [ds(7)]: { sv: { 'p:inversion':[6,1], 'p:bisats':[4,2], 'p:species':[2,0], 'p:tid':[1,1] } },
  [ds(14)]: { sv: { 'p:inversion':[8,2], 'p:bisats':[3,0], 'p:tempus':[4,1] } },
  [ds(20)]: { sv: { 'p:inversion':[6,1], 'p:species':[2,2], 'p:tid':[2,0] } },
  [ds(28)]: { sv: { 'p:bisats':[5,2], 'p:tempus':[3,0] } } }; })()`;

test('Mathematik: lnΓ, I_x(a, b) und Beta-Quantile wie scipy', () => {
  near(run('lgam(0.3)'), 1.0957979948, 1e-9); near(run('lgam(100.7)'), 362.3567752034, 1e-8); near(run('lgam(1)'), 0, 1e-12);
  [[0.3, 2.5, 7.1, 0.6490225790], [0.05, 0.4, 3, 0.4925999852], [0.9, 30, 4, 0.5769436641], [0.5, 120.3, 80.2, 0.0022029070]]
    .forEach(([x, a, b, v]) => near(run(`ibeta(${x}, ${a}, ${b})`), v, 1e-9, `I_${x}(${a}, ${b})`));
  near(run('betaQ(0.025, 10.02, 28.48)'), 0.136345, 1e-6); near(run('betaQ(0.975, 10.02, 28.48)'), 0.407731, 1e-6);
});

test('Modell: Vergessen mit Halbwertszeit 14 Tage, μ und m aus der Hyperprior, Posterior je Thema wie scipy', () => {
  run(SYN);
  const M = run(`topicModel('sv')`), by = id => M.topics.find(x => x.id === id);
  // Eine Antwort von heute zählt 1, von vor 14 Tagen ½, von vor 28 Tagen ¼
  near(by('inversion').n, 8 + 7 * 2 ** (-3 / 14) + 6 * 2 ** (-7 / 14) + 8 / 2 + 6 * 2 ** (-20 / 14), 1e-9);
  assert.equal(by('bisats').n30, 19); assert.equal(by('bisats').k30, 6);
  assert.equal(M.fitted, true); near(M.mu, 0.30552, 2e-4, 'μ'); near(M.m, 3.3117, 3e-3, 'm');
  const REF = { species:[0.43414, 0.14110, 0.75692, 0.31397, 0.54880, 0.76646], bisats:[0.30938, 0.11360, 0.55164, 0.22575, 0.38426, 0.48477],
    tid:[0.26503, 0.03104, 0.63169, 0.13803, 0.36771, 0.35962], tempus:[0.20380, 0.03642, 0.46559, 0.11742, 0.27255, 0.18193],
    inversion:[0.14705, 0.04400, 0.29762, 0.09826, 0.18682, 0.02049] };
  assert.deepEqual(M.topics.map(x => x.id), ['species', 'bisats', 'tid', 'tempus', 'inversion'], 'nach Schätzung sortiert');
  Object.entries(REF).forEach(([id, r]) => ['mean', 'lo', 'hi', 'lo50', 'hi50', 'pAbove'].forEach((k, i) => near(by(id)[k], r[i], 5e-4, `${id}.${k}`)));
});

test('Modell: unter drei Themen mit Daten gepoolte Quote und m = 10; eine Pause macht die Bereiche breiter', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:passiv':[10, 7], 'p:tid':[10, 1] } } };`);
  let M = run(`topicModel('sv')`);
  assert.equal(M.fitted, false); near(M.mu, 0.4, 1e-12); assert.equal(M.m, 10);
  near(M.topics[0].mean, (7 + 4) / 20, 1e-12);
  // Dieselben Antworten 28 Tage alt: zählen ein Viertel, die Schätzung rückt zum Schnitt, der Bereich wird breiter
  const wide = M.topics[0].hi - M.topics[0].lo;
  run(`DB.tlog = { [addDays(today(), -28)]: { sv: { 'p:passiv':[10, 7], 'p:tid':[10, 1] } } };`);
  M = run(`topicModel('sv')`);
  near(M.topics[0].n, 2.5, 1e-12);
  assert.ok(M.topics[0].hi - M.topics[0].lo > wide && M.topics[0].mean < 0.55);
});

test('Kein kurzfristiger Trend (seit 24.72.1): ein starker Rückgang in drei Wochen zeigt nur die Schätzung; Pfeile erst nach acht Wochen', () => {
  run(`DB = freshDB(); DB.tlog = { [addDays(today(), -2)]: { sv: { 'p:bisats':[20, 0], 'p:inversion':[20, 4], 'p:tempus':[20, 4] } }, [addDays(today(), -20)]: { sv: { 'p:bisats':[20, 13], 'p:inversion':[20, 4], 'p:tempus':[20, 4], 't:gap':[120, 29] } } };`);
  assert.equal('trend' in run(`topicModel('sv').topics.find(x => x.id === 'bisats')`), false);
  const h = run(`topicListHtml('sv')`) + run(`weakHtml('sv')`) + run(`S.view = 'progress'; openTopic('sv', 'bisats', 'num'); topicSheetHtml(S.pop)`);
  // Nur die Zahlen prüfen: Die Beispielsätze im Themenblatt sind zufällig und dürfen „besser“ enthalten
  // („Jag hoppas att du snart mår bättre.“), daran ist 24.72.1 auf GitHub gescheitert.
  assert.match(h, /geschätzt falsch/); assert.doesNotMatch(h, /class="mtr|class="arw|Letzte 14 Tage|als die 28 davor|>besser<|>schlechter</);
  assert.match(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), /Ab \d+\. \S+ vergleicht die App jeden Montag die letzten vier Wochen mit den vier davor\./);
});

test('Thompson-Sampling: Thema vorn so oft, wie es wahrscheinlich das schwächste ist; fester Startwert je Woche', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:passiv':[10, 7], 'p:tid':[10, 1] } } };`);
  let first = 0; const N = 3000;
  for (let s = 1; s <= N; s++) if (run(`thompsonOrder('sv', ['passiv', 'tid'], ${s})[0]`) === 'passiv') first++;
  near(first / N, 0.97759, 0.012, 'P(passiv schwächer) nach scipy');
  assert.deepEqual(run(`thompsonOrder('sv', ['passiv', 'tid'], 42)`), run(`thompsonOrder('sv', ['passiv', 'tid'], 42)`));
  assert.equal(run(`focusSeed('sv', '2026-11-23')`), run(`focusSeed('sv', '2026-11-23')`));
  assert.notEqual(run(`focusSeed('sv', '2026-11-23')`), run(`focusSeed('sv', '2026-11-30')`));
  assert.notEqual(run(`focusSeed('sv', '2026-11-23')`), run(`focusSeed('es', '2026-11-23')`));
});

test('Schwerpunkt der Woche: Themen mit Daten per Thompson-Sampling, danach die übrigen nach offenen Sätzen; stabil in der Woche', () => {
  run(SYN); run(`DB.st = {}; DB.settings.niveau = 'mittel';`);
  // Satz-Themen mit Daten (erzeugte Themen wie die Adjektivendungen haben keinen Schwerpunkt), in der Reihenfolge der Ziehung
  const c = run(`focusCandidates('sv')`), data = run(`TRAPS.sv.filter(t => t.kind !== 'gen' && ['species', 'bisats', 'tid', 'tempus', 'inversion'].includes(t.id)).map(t => t.id)`);
  assert.ok(data.length >= 3);
  assert.deepEqual(c.slice(0, data.length), run(`thompsonOrder('sv', ${JSON.stringify(data)}, focusSeed('sv', mondayOf(today())))`));
  assert.equal(c.length, run(`TRAPS.sv.filter(t => t.kind !== 'gen' && BANK.sv.some(i => i.trap === t.id)).length`), 'danach alle übrigen');
  const ft = run(`focusTrap('sv')`);
  assert.equal(ft, c[0]);
  run(`DB.tlog[today()].sv['p:tempus'] = [30, 29];`);
  assert.equal(run(`focusTrap('sv')`), ft, 'innerhalb der Woche stabil');
});

test('Klar über Schnitt mit Hysterese: rein ab 90 %, raus unter 60 %, Stand vom Vortag im Speicherstand; Grundlagensätze nur dort', () => {
  run(SYN);
  const M = run(`topicModel('sv')`), p = id => M.topics.find(x => x.id === id).pAbove;
  // species: P(über dem Schnitt) 77 %, bisats 49 %; ohne gespeicherten Stand zählt nur die Schwelle zum Hereinkommen
  assert.ok(p('species') > 0.6 && p('species') < 0.9 && p('bisats') < 0.6, JSON.stringify(M.topics.map(x => [x.id, x.pAbove])));
  run(`delete DB.clear`);
  assert.deepEqual(run(`[...weakTraps('sv')]`), []);
  // Ohne Vortag ist der Stand davor unbekannt: prev null (bis 24.77 leer, das las das Rundenende als „vorher nicht klar“)
  assert.deepEqual(run(`DB.clear.sv`), { day:run('today()'), prev:null, cur:[] }, 'Stand von heute gespeichert');
  assert.equal(run(`clearBase('sv')`), null);
  // Gestern klar über Schnitt: bleibt, solange P ≥ 60 %; bisats (49 %) fällt heraus
  run(`DB.clear = { sv:{ day:addDays(today(), -1), prev:[], cur:['species', 'bisats'] } }`);
  assert.deepEqual(run(`[...clearSet('sv')]`), ['species']);
  assert.deepEqual(run(`DB.clear.sv`), { day:run('today()'), prev:['species', 'bisats'], cur:['species'] });
  assert.deepEqual(run(`[...weakTraps('sv')]`), ['species'], 'Grundlagensätze nur in Themen klar über Schnitt');
  // Am selben Tag gilt weiter der Stand von gestern (prev), nicht der eben gerechnete: kein Hin und Her innerhalb eines Tages
  run(`DB.clear.sv.cur = []`);
  assert.deepEqual(run(`[...clearSet('sv')]`), ['species']);
  // Älterer Speicherstand ohne Feld: funktioniert, nur ohne Gedächtnis
  run(`DB.clear = undefined`);
  assert.deepEqual(run(`[...clearSet('sv')]`), []);
  // Ab 90 % kommt ein Thema auch ohne Vortag dazu
  run(`DB.clear = {}; DB.tlog[today()].sv['p:species'] = [20, 14];`);
  assert.ok(run(`topicModel('sv').topics.find(x => x.id === 'species').pAbove`) >= 0.9);
  assert.deepEqual(run(`[...clearSet('sv')]`), ['species']);
});

test('Themenblatt „Deine Zahlen“: Schätzung mit Bereich, Abstand zum Schnitt, rohe Zahlen der letzten 30 Tage', () => {
  run(SYN); run(`S.view = 'progress'; openTopic('sv', 'species', 'num')`);
  const t = run(`topicSheetHtml(S.pop)`).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.match(t, /43 % geschätzt falsch .*Wahrscheinlich 14 % bis 76 %; mit 77 % Wahrscheinlichkeit über deinem Schnitt ?von 31 %\./);
  assert.match(t, /Veränderung Letzte 30 Tage 4 von 7 falsch\. /);
  run(`openTopic('sv', 'framtid', 'num')`);
  assert.match(run(`topicSheetHtml(S.pop)`), /Noch zu wenige Aufgaben für eine Schätzung\./, 'ohne Daten keine Schätzung');
});

test('pLess: P(X1 < X2) für zwei Beta-Verteilungen auf vier Stellen wie scipy, auch mit Spitze bei 0 oder 1', () => {
  // Referenz: scipy.integrate.quad über f1(x)·(1 − F2(x)) bzw. f2(y)·F1(y); Fälle mit a < 1 entstehen bei Zeiträumen ohne Fehler
  const cases = [[2, 8, 4, 6, 0.8529], [14, 82, 21, 63, 0.9622], [0.034, 29.97, 0.034, 29.97, 0.5], [0.05, 30, 1.2, 40, 0.9671], [3, 0.4, 5, 0.3, 0.6422],
    [0.02, 110, 0.5, 60, 0.9734], [20, 3, 30, 0.6, 0.9659], [0.039, 51.96, 1.04, 50.96, 0.975], [1.04, 50.96, 0.039, 51.96, 0.025], [2.3, 10, 0.3, 30, 0.0096], [30, 0.3, 40, 0.2, 0.632]];
  for (const [a1, b1, a2, b2, ref] of cases) near(run(`pLess(${a1}, ${b1}, ${a2}, ${b2})`), ref, 6e-5, `${a1}, ${b1}, ${a2}, ${b2}`);
});

test('„Als Nächstes“ nach fehlerfreier Runde: höchste Schätzung, mit mindestens 80 % über dem Schnitt', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { es: { 'p:pasado':[20, 11], 'p:serestar':[10, 5], 'p:porpara':[30, 1], 'p:gustar':[30, 2], 'p:prep':[20, 2] } } };`);
  const r = { lang:'es', kind:'form', ok:4, bad:0, res:[{ good:true, gen:'spot_es', trap:'serestar' }, { good:true, gen:'spot_es', trap:'subjuntivo' }] };
  const html = run(`nextTopicHtml(${JSON.stringify(r)})`);
  assert.match(html, /<b>Indefinido vs\. Imperfecto<\/b>: geschätzt \d+ % falsch, dein Schnitt \d+ %\./);
  run(`DB.tlog = { [today()]: { es: { 'p:pasado':[20, 2], 'p:porpara':[20, 2], 'p:gustar':[20, 2] } } };`);
  assert.equal(run(`nextTopicHtml(${JSON.stringify(r)})`), '', 'kein Thema sicher über dem Schnitt');
});
