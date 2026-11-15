// Serienregel: Ein freier Tag pro Woche unterbricht nicht; zwei Auslassungen innerhalb von 7 Tagen oder hintereinander beenden die Serie.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const streakData = app.get('streakData'), addDays = app.get('addDays'), today = app.get('today'), DB = app.get('DB');
const withDone = days => { DB.done = {}; days.forEach(k => { DB.done[addDays(today(), -k)] = true; }); return streakData(); };
test('jeden Tag geübt: Serie zählt jeden Tag', () => assert.equal(withDone(Array.from({ length:20 }, (_, k) => k)).current, 20));
test('ein freier Tag pro Woche unterbricht nicht', () => {
  const days = Array.from({ length:28 }, (_, k) => k).filter(k => k % 7 !== 3);
  assert.ok(withDone(days).current >= 24, `Serie ${withDone(days).current}`);
});
test('zwei Tage hintereinander ausgelassen beenden die Serie', () => assert.equal(withDone([0, 1, 2, 5, 6, 7, 8, 9]).current, 3));
test('heute noch nicht geübt: die Serie von gestern bleibt sichtbar', () => assert.equal(withDone([1, 2, 3, 4]).current, 4));
test('Dein Weg: sprachbezogene Etappen tragen ihre Sprache, gemeinsame keine', () => {
  const { loadApp } = require('../helpers/load.js');
  const app = loadApp();
  const t = app.run('today()');
  const d = k => app.run(`addDays(today(), -${k})`);
  const log = {}; for (let k = 1; k <= 12; k++) log[d(k)] = { sv:{ n:40, secs:900, mat:3 } };
  app.run(`DB.log = ${JSON.stringify(log)}; DB.done = {}; DB.own = { sv:[], es:[] }; DB.texts = []; DB.snap = {};`);
  const w = JSON.parse(JSON.stringify(app.run('wayEvents()')));
  const mature = w.done.filter(e => e.ico === 'mature'), shared = w.done.filter(e => e.ico === 'tasks' || e.ico === 'start' || e.ico === 'time');
  require('node:assert/strict').ok(mature.length && mature.every(e => e.l === 'sv'));
  require('node:assert/strict').ok(shared.length && shared.every(e => !e.l));
  require('node:assert/strict').ok(!t || true);
});
