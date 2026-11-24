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

test('Mathematik: lnΓ, I_x(a, b), Beta-Quantile und P(X < Y) wie scipy', () => {
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

test('Kein Trend je Thema (seit 24.72.1): auch ein starker Rückgang zeigt nur die Schätzung, kein „besser“', () => {
  run(`DB = freshDB(); DB.tlog = { [addDays(today(), -2)]: { sv: { 'p:bisats':[20, 0], 'p:inversion':[20, 4], 'p:tempus':[20, 4] } }, [addDays(today(), -20)]: { sv: { 'p:bisats':[20, 13], 'p:inversion':[20, 4], 'p:tempus':[20, 4], 't:gap':[120, 29] } } }; S.errTab = 'p';`);
  assert.equal('trend' in run(`modelTopic('sv', 'bisats')`), false);
  const h = run(`errorSourcesHtml('sv')`) + run(`weakHtml('sv')`) + run(`S.view = 'progress'; openTopic('sv', 'bisats'); topicSheetHtml(S.pop)`);
  assert.match(h, /Fehlerquote geschätzt/); assert.doesNotMatch(h, /besser|schlechter|class="mtr/);
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

test('Grundlagensätze bei „Fortgeschritten“: Themen mit geschätzt mindestens 25 % falsch', () => {
  run(SYN);
  const weak = run(`[...weakTraps('sv')]`).sort(), M = run(`topicModel('sv')`);
  assert.deepEqual(weak, M.topics.filter(x => x.n >= 3 && x.mean >= 0.25).map(x => x.id).sort());
  assert.deepEqual(weak, ['bisats', 'species', 'tid']);
});

test('Themenblatt: Schätzung mit Bereich, Abstand zum Schnitt, rohe Zahlen der letzten 30 Tage', () => {
  run(SYN); run(`S.view = 'progress'; openTopic('sv', 'species')`);
  const html = run(`topicSheetHtml(S.pop)`);
  assert.match(html, /Fehlerquote geschätzt 43 %, wahrscheinlich 14 % bis 76 %; mit 77 % Wahrscheinlichkeit über deinem Schnitt von 31 %\. Letzte 30 Tage: 4 von 7 falsch\./);
  run(`openTopic('sv', 'framtid')`);
  assert.doesNotMatch(run(`topicSheetHtml(S.pop)`), /Fehlerquote geschätzt/, 'ohne Daten keine Schätzung');
});

test('„Als Nächstes“ nach fehlerfreier Runde: höchste Schätzung, mit mindestens 80 % über dem Schnitt', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { es: { 'p:pasado':[20, 11], 'p:serestar':[10, 5], 'p:porpara':[30, 1], 'p:gustar':[30, 2], 'p:prep':[20, 2] } } };`);
  const r = { lang:'es', kind:'form', ok:4, bad:0, res:[{ good:true, gen:'spot_es', trap:'serestar' }, { good:true, gen:'spot_es', trap:'subjuntivo' }] };
  const html = run(`nextTopicHtml(${JSON.stringify(r)})`);
  assert.match(html, /<b>Indefinido vs\. Imperfecto<\/b>: geschätzt \d+ % falsch, dein Schnitt \d+ %\./);
  run(`DB.tlog = { [today()]: { es: { 'p:pasado':[20, 2], 'p:porpara':[20, 2], 'p:gustar':[20, 2] } } };`);
  assert.equal(run(`nextTopicHtml(${JSON.stringify(r)})`), '', 'kein Thema sicher über dem Schnitt');
});
