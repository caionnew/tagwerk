// Erzeugte Aufgaben wiederholen sich weder innerhalb einer Runde noch direkt hintereinander (auch über Runden hinweg).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const GENS = app.get('GENS'), S = app.get('S'), prepCur = app.get('prepCur'), genKey = app.get('genKey');
const RUN = 10, ROUNDS = 200;
for (const g of Object.keys(GENS)) {
  test(`Generator ${g}: keine Wiederholung in ${ROUNDS} Runden à ${RUN}`, () => {
    let within = 0, back = 0, prevLast = null;
    for (let r = 0; r < ROUNDS; r++) {
      S.run = { lang:GENS[g].lang, kind:'form', queue:Array.from({ length:RUN }, () => ({ type:'gen', gen:g })), idx:0 };
      const keys = [];
      for (let i = 0; i < RUN; i++) { S.run.idx = i; prepCur(); keys.push(genKey(S.run.queue[i].data)); }
      within += keys.length - new Set(keys).size;
      for (let i = 1; i < RUN; i++) if (keys[i] === keys[i - 1]) back++;
      if (prevLast && keys[0] === prevLast) back++;
      prevLast = keys[RUN - 1];
    }
    assert.equal(within, 0, 'doppelt innerhalb einer Runde');
    assert.equal(back, 0, 'direkt hintereinander');
  });
}
