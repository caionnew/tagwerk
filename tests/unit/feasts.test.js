// Bewegliche Feste: Ostern nach der Gaußschen Osterformel, davon abgeleitete Termine.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const easter = app.get('easter'), fmt = app.get('fmt');
test('Ostersonntag 2025 bis 2030', () => {
  const want = { 2025:'2025-04-20', 2026:'2026-04-05', 2027:'2027-03-28', 2028:'2028-04-16', 2029:'2029-04-01', 2030:'2030-04-21' };
  for (const [y, d] of Object.entries(want)) assert.equal(fmt(easter(Number(y))), d, y);
});
test('jedes Fest hat in jedem Jahr einen gültigen Termin', () => {
  const EVENTS = app.get('EVENTS');
  for (const lang of ['sv', 'es']) for (const ev of EVENTS[lang]) for (const y of [2026, 2027, 2028]) {
    const dt = ev[1](y); assert.ok(dt instanceof Date && !isNaN(dt) && dt.getFullYear() === y, `${ev[0]} ${y}`);
  }
});
