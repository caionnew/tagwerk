// Serie in der Runde: zählt erste Versuche, „Weiß ich nicht“ und Fehler setzen zurück, zweite Versuche zählen nicht.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
test('Serie: 3 richtig, Fehler, 2 richtig; zweiter Versuch ändert nichts', () => {
  app.run(`S.run = { kind:'quick', lang:'sv', queue:[], idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0 }; S.view = 'run';`);
  const step = (result, requeue) => app.run(`(() => { const ex = { type:'gen', gen:'np', data:{ answers:['x'] }${requeue ? ', requeue:true' : ''} }; S.run.queue.push(ex); S.run.idx = S.run.queue.length - 1; const c = { state:'answer', result:'${result}' }; S.run.cur = c; finishAnswer(S.run, ex, c); return c.combo; })()`);
  assert.equal(step('ok'), 1); assert.equal(step('near'), 2); assert.equal(step('ok'), 3);
  assert.equal(step('bad'), 0);
  assert.equal(step('ok', true), undefined);
  assert.equal(step('ok'), 1); assert.equal(step('ok'), 2);
  assert.equal(app.run('S.run.best'), 3);
});
