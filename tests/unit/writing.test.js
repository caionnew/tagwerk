// Freies Schreiben: Offline-Hinweise ohne Fehlalarme bei korrekten Sätzen, typische Fehler erkannt, Zeitformen erkannt.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const textHints = app.get('textHints'), analyzeText = app.get('analyzeText');
const correct = {
  sv:['Idag jobbar jag hemma.', 'Jag vet att han inte kommer.', 'När jag kommer hem lagar jag mat.', 'Igår åt jag pizza med min sambo.', 'Det är ett stort hus.', 'Han säger att han alltid glömmer det.', 'Vi har bott här i två år.', 'Kanske jag kommer imorgon.', 'Om det regnar stannar vi hemma.', 'Du behöver inte komma.', 'Jag har aldrig varit i Kiruna.', 'Sedan jag flyttade hit har jag lärt mig mycket.', 'Det var ett trevligt möte.', 'En bok och ett bord.'],
  es:['Quiero que vengas mañana.', 'Espero que estés bien.', 'Creo que tiene razón.', 'Quiero comer algo.', 'Si tuviera tiempo, viajaría más.', 'Me gustan los libros.', 'Me gusta el café.', 'Ayer comí paella.', 'Hoy he trabajado mucho.', 'Estoy cansado.', 'Trabajar aquí es cansado.', 'La película es aburrida.', 'La gente es muy amable.', 'El agua está fría.', 'Para mí es importante.', 'Es importante que lo hagas.', 'Ojalá llueva pronto.']
};
const wrong = {
  sv:[['Idag jag jobbar hemma.', 'inversion'], ['När jag kommer hem, jag lagar mat.', 'inversion'], ['Jag vet att han kommer inte.', 'bisats'], ['Jag hoppas att du mår inte dåligt.', 'bisats'], ['Igår har jag ätit pizza.', 'tempus'], ['Det är en hus.', 'species'], ['Det är ett stor hus.', 'species'], ['Du måste inte komma.', 'framtid']],
  es:[['Quiero que vienes mañana.', 'subjuntivo'], ['Espero que estás bien.', 'subjuntivo'], ['Si tendría tiempo, viajaría.', 'condicional'], ['Me gusta los libros.', 'gustar'], ['Ayer he comido paella.', 'perfecto'], ['Soy cansado.', 'serestar'], ['La gente son simpáticos.', 'konjugation']]
};
for (const lang of ['sv', 'es']) {
  for (const s of correct[lang]) test(`${lang} korrekt, kein Hinweis: ${s}`, () => { const h = textHints(lang, s); assert.equal(h.length, 0, h.map(x => x.msg).join(' | ')); });
  for (const [s, topic] of wrong[lang]) test(`${lang} Fehler erkannt (${topic}): ${s}`, () => assert.ok(textHints(lang, s).some(h => h.topic === topic)));
}
const tenseCases = [
  ['sv', 'Jag bor i Malmö. Igår gick jag till jobbet. Jag har aldrig varit i Kiruna. Nästa år ska jag resa till Norge.', ['pres', 'past', 'perf', 'fut']],
  ['sv', 'Jag skulle vilja ha en kaffe. Han hade redan ätit.', ['cond', 'plup']],
  ['es', 'Vivo en Madrid. Ayer comí paella. Antes vivía en Colonia. Quiero que vengas. Voy a viajar. Me gustaría ir. Hoy he trabajado.', ['pres', 'indef', 'imp', 'subj', 'fut', 'cond', 'perf']],
  ['es', 'Mañana hablaré con ella. Si tuviera tiempo, lo haría.', ['fut', 'subj', 'cond']]
];
for (const [lang, text, want] of tenseCases) test(`${lang} Zeitformen ${want.join(', ')}`, () => { const got = analyzeText(lang, text).tenses; for (const t of want) assert.ok(got.includes(t), `${t} fehlt, erkannt: ${got.join(', ')}`); });
test('Profil zählt Sätze, Nebensätze und Verbindungswörter', () => {
  const a = analyzeText('sv', 'Igår gick jag till jobbet eftersom bussen var sen. Men det gick bra. Sedan åt vi lunch tillsammans och pratade länge.');
  assert.equal(a.sents, 3); assert.equal(a.subCount, 1); assert.ok(a.conns.includes('men')); assert.ok(!a.conns.includes('sen'));
});

test('Wörter zum Einbauen: Grundformen, keine Eigennamen, fünf Vorschläge, „Andere Wörter“ bringt neue', () => {
  const a = loadApp();
  a.run("DB.st = {}; BANK.sv.concat(BANK.es).forEach(i => { DB.st[i.id] = { ivl:2, due:'2030-01-01', s:1, d:5 }; });");
  for (const lang of ['sv', 'es']) {
    const names = a.get('properNames')(lang), words = a.get('learningWords')(lang).map(x => x.base);
    ['anna', 'stockholm', 'uppsala', 'norge', 'madrid', 'españa', 'juan'].forEach(n => assert.ok(!words.includes(n), `${lang}: ${n} ist ein Name`));
    // Kein gewöhnliches Wort als Name erkannt
    ['hus', 'bil', 'casa', 'tren', 'hoy', 'idag'].forEach(w => assert.ok(!names.has(w), `${lang}: ${w}`));
  }
  const words = a.get('learningWords')('es').map(x => x.base);
  assert.ok(words.includes('ayudar') && !words.includes('ayudarme'), 'Grundform statt gebeugter Form');
  const first = JSON.parse(JSON.stringify(a.get('suggWords')('sv')));
  assert.equal(first.sugg.length, 5); assert.equal(first.suggMore, true);
  const next = JSON.parse(JSON.stringify(a.get('suggWords')('sv', first.sugg.map(x => x.base))));
  assert.equal(next.sugg.filter(x => first.sugg.some(y => y.base === x.base)).length, 0, 'andere Wörter als eben');
});
test('Kalender: an beiden Sprachen nur etwas geübt hat einen geteilten Rand in beiden Sprachfarben', () => {
  const a = loadApp();
  a.run("DB.log[today()] = { sv:{ n:3 }, es:{ n:2 } }; delete DB.done[today()];");
  const svg = a.get('calendarSvg')().svg;
  assert.match(svg, /<linearGradient id="calpb"[^>]*><stop offset="\.5" style="stop-color:var\(--sv\)"\/><stop offset="\.5" style="stop-color:var\(--es\)"\/>/);
  assert.match(svg, /class="pb now"/);
});
