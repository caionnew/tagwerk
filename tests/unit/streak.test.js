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
