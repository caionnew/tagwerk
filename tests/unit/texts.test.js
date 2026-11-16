// Lesetexte: Aufbau, Fragen, übernehmbare Sätze stehen wörtlich im Text, Sätze lassen sich sauber trennen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const TEXTS = app.get('TEXTS'), textSentences = app.get('textSentences');
test('je Sprache mindestens sechs Texte mit eindeutiger Kennung, Thema und Niveau', () => {
  for (const lang of ['sv', 'es']) {
    assert.ok(TEXTS[lang].length >= 6, lang);
    const ids = TEXTS[lang].map(t => t.id); assert.equal(new Set(ids).size, ids.length);
    for (const t of TEXTS[lang]) { assert.ok(t.title && t.topic && /^(A2|B1|B2|C1)$/.test(t.level), t.id); }
    assert.ok(new Set(TEXTS[lang].map(t => t.topic)).size >= 5, `${lang}: zu wenig Themenvielfalt`);
  }
});
test('Länge 70 bis 260 Wörter, jeder Satz endet mit Satzzeichen', () => {
  for (const lang of ['sv', 'es']) for (const t of TEXTS[lang]) {
    const n = t.body.split(/\s+/).length; assert.ok(n >= 70 && n <= 260, `${t.id}: ${n} Wörter`);
    for (const s of textSentences(t.body).flat()) assert.match(s, /[.!?]$/, `${t.id}: ${s}`);
  }
});
test('drei Fragen mit drei verschiedenen Antworten und belegender Textstelle, übernehmbare Sätze stehen im Text', () => {
  for (const lang of ['sv', 'es']) for (const t of TEXTS[lang]) {
    assert.equal(t.q.length, 3, t.id);
    for (const [q, opts, src] of t.q) {
      assert.ok(q.endsWith('?'), q); assert.equal(opts.length, 3); assert.equal(new Set(opts).size, 3, q);
      assert.ok(src && textSentences(t.body).flat().some(x => x.includes(src)), `${t.id}: Textstelle zu „${q}“ fehlt im Text`);
    }
    assert.ok(t.keep.length >= 2, t.id);
    const sents = textSentences(t.body).flat();
    for (const [s, de] of t.keep) { assert.ok(sents.includes(s), `${t.id}: „${s}“ ist kein ganzer Satz im Text`); assert.ok(de.length > 5); }
  }
});
test('Antworten gemischt, aber für denselben Text stabil; die richtige steht nicht immer oben', () => {
  const optionOrder = app.get('optionOrder');
  let firstTop = 0, total = 0;
  for (const lang of ['sv', 'es']) for (const t of TEXTS[lang]) t.q.forEach((_, k) => {
    const a = optionOrder(t.id, k, 3), b = optionOrder(t.id, k, 3);
    assert.deepEqual(Array.from(a), Array.from(b)); assert.deepEqual(Array.from(a).sort(), [0, 1, 2]);
    total++; if (a[0] === 0) firstTop++;
  });
  assert.ok(firstTop < total * 0.6, `richtige Antwort ${firstTop} von ${total} Mal oben`);
});
