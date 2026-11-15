// FSRS-6: Abgleich mit der offiziellen Referenz py-fsrs 6.3.3 (tests/fixtures/fsrs_reference.json, erzeugt mit tools/fsrs_reference.py).
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const FSRS = app.get('FSRS'), addDays = app.get('addDays');
const ref = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'fsrs_reference.json'), 'utf8'));

test('Stabilität, Schwierigkeit und Intervalle stimmen mit der Referenz überein', () => {
  let n = 0, maxS = 0, maxD = 0, ivlMismatch = 0;
  for (const seq of ref) {
    let card = {};
    for (const step of seq) {
      card = FSRS.review(card, step.g, addDays('2026-01-01', step.day), true);
      maxS = Math.max(maxS, Math.abs(card.s - step.s) / step.s);
      maxD = Math.max(maxD, Math.abs(card.d - step.d));
      if (card.ivl !== step.ivl) ivlMismatch++;
      n++;
    }
  }
  assert.ok(n >= 400, `nur ${n} Wiederholungen verglichen`);
  assert.ok(maxS < 1e-9, `Stabilität weicht um ${maxS} ab`);
  assert.ok(maxD < 1e-9, `Schwierigkeit weicht um ${maxD} ab`);
  assert.equal(ivlMismatch, 0);
});
test('Abrufwahrscheinlichkeit liegt am Fälligkeitstag bei etwa 90 %', () => {
  let card = FSRS.review({}, 3, '2026-01-01', true);
  card = FSRS.review(card, 3, card.due, true);
  const r = FSRS.retrievability(card, card.due);
  assert.ok(r > 0.88 && r < 0.92, `R = ${r}`);
});
