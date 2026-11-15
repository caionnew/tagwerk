// Fehlerart bei getippten Antworten: Wortstellung, falsches Wort oder Form, fehlendes Wort, Tippfehler.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const errKind = loadApp().get('errKind');
const cases = [
  ['sv', 'Idag jag jobbar inte', 'Idag jobbar jag inte', 'order'], ['sv', 'Jag vet att han kommer inte', 'Jag vet att han inte kommer', 'order'],
  ['sv', 'Igår har jag ätit pizza', 'Igår åt jag pizza', 'word'], ['sv', 'Jag vet att han kommer', 'Jag vet att han inte kommer', 'missing'],
  ['sv', 'Jag har bot här i två år', 'Jag har bott här i två år', 'spell'], ['sv', 'ett stor hus', 'ett stort hus', 'word'],
  ['sv', 'Hon har köpt en ny bill', 'Hon har köpt en ny bil', 'spell'], ['es', 'Quiero un cafe con lehce', 'Quiero un café con leche', 'spell'],
  ['es', 'Es importante que vienes', 'Es importante que vengas', 'word'], ['es', 'Ayer en casa comí pescado', 'Ayer comí pescado en casa', 'order'],
  ['es', 'Me gusta los libros', 'Me gustan los libros', 'word'], ['es', 'para', 'por', 'word'], ['es', 'estas', 'está', 'word']
];
for (const [lang, input, answer, want] of cases) test(`${input} → ${want}`, () => assert.equal(errKind(input, [answer], lang), want));
test('identische Antwort ist kein Fehler', () => assert.equal(errKind('Jag bor i Malmö', ['Jag bor i Malmö'], 'sv'), null));
