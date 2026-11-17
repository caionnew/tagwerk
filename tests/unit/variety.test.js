// Abwechslung: Jeder Generator erzeugt mindestens dreimal so viele verschiedene Aufgaben, wie die Wiederholungssperre sich merkt.
// Konnektoren-Listen: Lösung unter den Optionen, keine doppelten Sätze.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const GENS = app.get('GENS'), genKey = app.get('genKey'), MEM = app.get('GEN_MEMORY');
test('jeder Generator: mindestens dreimal so viele verschiedene Aufgaben wie die Wiederholungssperre', () => {
  for (const g of Object.keys(GENS)) {
    const seen = new Set();
    for (let i = 0; i < 3000 && seen.size < 3 * MEM; i++) seen.add(genKey(GENS[g].make()));
    assert.ok(seen.size >= 3 * MEM, `${g}: nur ${seen.size} verschiedene Aufgaben`);
  }
});
test('Konnektoren & feste Verbindungen: genug Fälle, Lösung unter den Optionen, drei verschiedene Optionen, keine Dubletten', () => {
  for (const name of ['VERB_SV', 'VERB_ES']) {
    const list = app.get(name);
    assert.ok(list.length >= 40, `${name}: ${list.length}`);
    assert.equal(new Set(list.map(x => x[0])).size, list.length, `${name}: doppelte Sätze`);
    for (const [p, a, opts] of list) { assert.ok(p.includes('___'), p); assert.ok(opts.includes(a), p); assert.equal(new Set(opts).size, 3, p); }
  }
});
test('Spanische Lückensätze: a und de vor „el“ sind zusammengezogen (al, del)', () => {
  for (const name of ['PREP_ES', 'VERB_ES']) {
    for (const [p, a] of app.get(name)) assert.doesNotMatch(p.replace('___', a), /\b(a|de) el\b/i, `${name}: ${p}`);
  }
});
