// Themenblatt: Beispiele zeigen verschiedene Lösungen, die Übersichtstabelle hat Verb, Gebrauch und Beispiel.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };

test('„werden“: drei Beispiele mit drei verschiedenen Verben (auch se quedó und me quedé zählen als eines)', () => {
  const verb = t => { const m = t.match(/\b(pon|pus|vuel|volv|hiz|hech|hac|qued|convirt|convert|lleg|acab|termin)\w*/i); return m && { pon:'poner', pus:'poner', vue:'volver', vol:'volver', hiz:'hacer', hec:'hacer', hac:'hacer', que:'quedar', con:'convertir', lle:'llegar', aca:'acabar', ter:'acabar' }[m[0].slice(0, 3).toLowerCase()]; };
  for (let k = 0; k < 60; k++) {
    const ex = run(`topicExamples('es', 'cambio')`).map(x => x.target);
    assert.equal(ex.length, 3);
    assert.equal(new Set(ex.map(verb)).size, 3, ex.join(' / '));
  }
});
test('por oder para: unter den Beispielen kommen beide vor', () => {
  for (let k = 0; k < 40; k++) {
    const ex = run(`topicExamples('es', 'porpara')`).map(x => x.target.toLowerCase());
    assert.ok(ex.some(t => /\bpor\b/.test(t)) && ex.some(t => /\bpara\b/.test(t)), ex.join(' / '));
  }
});
test('Themen ohne Lücke (Wortstellung) bekommen weiter drei kurze Beispiele', () => {
  assert.equal(run(`topicExamples('sv', 'bisats')`).length, 3);
});
test('Übersicht „werden“: fünf Zeilen mit Verb, Gebrauch und Beispiel, das Beispiel steht in der Satzbank-Sprache', () => {
  const tr = run(`trapMeta('es', 'cambio')`);
  assert.equal(tr.table.length, 5);
  tr.table.forEach(r => { assert.equal(r.length, 3); assert.ok(r.every(x => typeof x === 'string' && x.length)); });
  assert.ok(tr.short.length <= 100, 'Einleitung kurz halten: ' + tr.short.length);
});
test('Themen mit Übersicht: Einleitung höchstens ein Satz, jede Zeile vollständig', () => {
  for (const lang of ['sv', 'es']) for (const tr of run(`TRAPS.${lang}`).filter(t => t.table)) {
    assert.ok(tr.short.length <= 110, `${tr.id}: Einleitung ${tr.short.length} Zeichen`);
    tr.table.forEach(r => assert.ok(r.length === 3 && r.every(Boolean), tr.id));
  }
});
test('Übersicht Modalpartikeln: jede Partikel, die mindestens zweimal geübt wird, hat eine Zeile', () => {
  const rows = new Set(run(`trapMeta('sv', 'modal')`).table.map(r => r[0]));
  const n = {}; run('BANK').sv.filter(i => i.trap === 'modal').forEach(i => { const g = i.gap.toLowerCase(); n[g] = (n[g] || 0) + 1; });
  const missing = Object.keys(n).filter(g => n[g] >= 2 && !rows.has(g));
  assert.deepEqual(missing, []);
});
