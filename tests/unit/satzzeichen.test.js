// Satzzeichen und Wortgrenzen an einer Stelle (src/js/part_text.js): Vergleich, Wörterbuch, Wortkästchen und Anzeige behandeln
// dieselben Zeichen gleich. Der Doppelpunkt zählt nur am Wortende (tv:n bleibt ein Wort).
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { loadApp, SRC } = require('../helpers/load.js');
const { ORDER } = require('../../tools/build.js');
const app = loadApp();
const unpunct = app.get('unpunct'), punctKey = app.get('punctKey'), wordCore = app.get('wordCore'), wordParts = app.get('wordParts');
const endsSentence = app.get('endsSentence'), norm = app.get('norm'), tokens = app.get('tokens'), lookupWord = app.get('lookupWord');

test('Satzzeichen zählen beim Vergleich nicht, der Doppelpunkt nur am Wortende', () => {
  assert.equal(norm('¿Qué hora será?', 'es'), 'qué hora será');
  assert.equal(norm('Bevor ich es vergesse: Am Montag', 'es'), 'bevor ich es vergesse am montag');
  assert.equal(norm('Sätt på tv:n.', 'sv'), 'sätt på tv:n');
  assert.deepEqual([...tokens('Wo ist Marta? – Sie wird wohl „noch“ (im Büro) sein…')], ['Wo', 'ist', 'Marta', 'Sie', 'wird', 'wohl', 'noch', 'im', 'Büro', 'sein']);
  assert.equal(unpunct('1950-talet, ett e-postmeddelande').replace(/\s+/g, ' ').trim(), '1950-talet ett e-postmeddelande');
});

test('Wort ohne Zeichen davor und danach, zerlegt und als Schlüssel', () => {
  assert.equal(wordCore('¡«Hola»!'), 'Hola');
  assert.equal(wordCore('tv:n.'), 'tv:n');
  assert.deepEqual({ ...wordParts('¿Llegaran,') }, { pre:'¿', core:'Llegaran', post:',' });
  assert.equal(punctKey('madrugada,'), 'madrugada');
  assert.ok(endsSentence('cero.') && endsSentence('pero…') && !endsSentence('pero,'));
  // Nachschlagen nimmt dasselbe: Satzzeichen am Rand stören nicht
  assert.ok(lookupWord('es', '«casa»,') && lookupWord('sv', 'huset.'));
});

test('Keine eigenen Listen von Satzzeichen außerhalb von part_text.js', () => {
  const bad = [];
  for (const f of ORDER.filter(f => f !== 'js/part_text.js')) {
    const src = fs.readFileSync(path.join(SRC, f), 'utf8');
    // Zeichenklassen in regulären Ausdrücken mit Satzende-Zeichen oder typografischen Zeichen
    for (const m of src.matchAll(/\[(?!\^)([^\]\n]{2,40})\]/g)) {
      const c = m[1];
      if (c.includes("'")) continue; // Listen aus Zeichenketten, keine Zeichenklasse
      if ((c.includes('!') && c.includes('?')) || /[„“”«»…]/.test(c)) bad.push(`${f}: ${m[0]}`);
    }
  }
  assert.deepEqual(bad, []);
});
