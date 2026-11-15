// Fehlerart bei getippten Antworten: Wortstellung, Grammatik (Form oder Funktionswort), Wortschatz, fehlendes Wort, Tippfehler.
// Regel: Funktionswörter und andere Formen desselben Wortes sind Grammatik, ein anderes Inhaltswort ist Wortschatz.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const errKind = app.get('errKind');
const cases = [
  // Wortstellung
  ['sv', 'Idag jag jobbar inte', 'Idag jobbar jag inte', 'order'], ['sv', 'Jag vet att han kommer inte', 'Jag vet att han inte kommer', 'order'],
  ['es', 'Ayer en casa comí pescado', 'Ayer comí pescado en casa', 'order'],
  // Grammatik: Zeitform, Endung, Modus, Kongruenz
  ['sv', 'Igår har jag ätit pizza', 'Igår åt jag pizza', 'word'], ['sv', 'ett stor hus', 'ett stort hus', 'word'],
  ['sv', 'Det är den stor bilen', 'Det är den stora bilen', 'word'],
  ['es', 'Es importante que vienes', 'Es importante que vengas', 'word'], ['es', 'Me gusta los libros', 'Me gustan los libros', 'word'],
  ['es', 'estas', 'está', 'word'],
  // Grammatik: Funktionswörter (Partikel, Präposition, Possessiv, ser/estar, Artikel)
  ['sv', 'Jag tycker på kaffe', 'Jag tycker om kaffe', 'word'], ['sv', 'Anna ringer hennes mamma', 'Anna ringer sin mamma', 'word'],
  ['sv', 'Jag har bott här för två år', 'Jag har bott här i två år', 'word'], ['sv', 'Jag har en hus', 'Jag har ett hus', 'word'],
  ['es', 'Compré el libro para diez euros', 'Compré el libro por diez euros', 'word'], ['es', 'para', 'por', 'word'],
  ['es', 'Soy cansado', 'Estoy cansado', 'word'], ['es', 'Pienso mucho de ti', 'Pienso mucho en ti', 'word'],
  // Wortschatz: anderes Inhaltswort, Form und Stellung passen
  ['sv', 'de sköna glasen', 'de fina glasen', 'vocab'], ['sv', 'Igår träffade jag en gammal lärare', 'Igår träffade jag en gammal vän', 'vocab'],
  ['sv', 'Hon har köpt en ny cykel', 'Hon har köpt en ny bil', 'vocab'],
  ['es', 'Mi hermano es profesor', 'Mi hermano es médico', 'vocab'], ['es', 'Ayer visité a mi tía', 'Ayer visité a mi abuela', 'vocab'],
  // Fehlendes Wort und Tippfehler
  ['sv', 'Jag vet att han kommer', 'Jag vet att han inte kommer', 'missing'],
  ['sv', 'Jag har bot här i två år', 'Jag har bott här i två år', 'spell'], ['sv', 'Hon har köpt en ny bill', 'Hon har köpt en ny bil', 'spell'],
  ['es', 'Quiero un cafe con lehce', 'Quiero un café con leche', 'spell']
];
for (const [lang, input, answer, want] of cases) test(`${input} → ${want}`, () => assert.equal(errKind(input, [answer], lang), want));
test('identische Antwort ist kein Fehler', () => assert.equal(errKind('Jag bor i Malmö', ['Jag bor i Malmö'], 'sv'), null));
test('Wort aus dem geprüften Teil ist immer Grammatik, auch als Inhaltswort', () => {
  assert.equal(errKind('Igår såg jag en gammal vän', ['Igår träffade jag en gammal vän'], 'sv'), 'vocab');
  assert.equal(errKind('Igår såg jag en gammal vän', ['Igår träffade jag en gammal vän'], 'sv', ['träffade']), 'word');
});

// Zählweise in der Statistik und im Ergebnis
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const answer = (ex, input) => run(`(() => { const ex = ${JSON.stringify(ex)}; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0 }; S.view = 'run'; S.run.cur = { input:${JSON.stringify(input)}, state:'answer', result:null }; check(); return { result:S.run.cur.result, kind:S.run.cur.kind || null, vocab:S.run.cur.vocab || null }; })()`);
test('Grammatik-Übung: anderes Inhaltswort bei richtiger Endung ist „fast richtig“, falsche Endung bleibt falsch', () => {
  const ex = { type:'gen', gen:'np', data:{ prompt:'die schönen Gläser', answers:['de fina glasen', 'de vackra glasen'], label:'Übersetze ins Schwedische' } };
  const a = answer(ex, 'de sköna glasen');
  assert.equal(a.result, 'near'); assert.equal(a.kind, 'vocab'); assert.deepEqual(a.vocab, [['sköna', 'fina']]);
  assert.equal(answer(ex, 'de fin glasen').result, 'bad');
  assert.equal(answer(ex, 'de fina glas').result, 'bad');
});
test('Satzbank: anderes Inhaltswort bleibt falsch, belastet aber nicht das Grammatikthema', () => {
  const BANK = app.get('BANK');
  const item = BANK.sv.find(i => i.target === 'Igår träffade jag en gammal vän.');
  assert.ok(item);
  run(`DB.tlog = {}; DB.st = {};`);
  const ex = { type:'free', id:item.id };
  const a = answer(ex, 'Igår träffade jag en gammal lärare.');
  assert.equal(a.result, 'bad'); assert.equal(a.kind, 'vocab');
  run(`recordAnswer('sv', S.run.queue[0], S.run.cur, false)`);
  const L = run(`DB.tlog[today()].sv`);
  assert.deepEqual(L['p:' + item.trap], [1, 0]);
  assert.equal(L['e:vocab'], 1);
  // Grammatikfehler im selben Satz belastet das Thema
  answer(ex, 'Igår har jag träffat en gammal vän.');
  run(`recordAnswer('sv', S.run.queue[0], S.run.cur, false)`);
  assert.deepEqual(run(`DB.tlog[today()].sv['p:' + ${JSON.stringify(item.trap)}]`), [2, 1]);
});
