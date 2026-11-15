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
