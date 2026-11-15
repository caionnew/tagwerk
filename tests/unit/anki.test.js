// Anki: Klartext-Export einlesen (Kopfzeilen, Tabulator, HTML, Ton, Lückentext), Sprache und Übersetzung erkennen, übernehmen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const SAMPLE = ['#separator:tab', '#html:true', '#notetype column:3',
  'Jag vet inte varför han aldrig ringer.\tI don\'t know why he never calls.\tBasic',
  '<b>Vi</b> ska åka till Malmö i morgon.[sound:x.mp3]\tWe are going to Malmö tomorrow.\tBasic',
  '"Hon sa: ""Kom hit!"" och gick."\tShe said: "Come here!" and left.\tBasic',
  'Det är {{c1::inte}} så farligt som du tror.\tIt is not as dangerous as you think.\tBasic',
  'Hej\tHi\tBasic'].join('\n');
test('Anki-Klartext: Zeilen und Felder sauber, Sprache und Übersetzungsspalte erkannt', () => {
  const rows = JSON.parse(JSON.stringify(app.run(`ankiRows(${JSON.stringify(SAMPLE)})`)));
  assert.equal(rows.length, 5);
  assert.equal(rows[1][0], 'Vi ska åka till Malmö i morgon.');
  assert.equal(rows[2][0], 'Hon sa: "Kom hit!" och gick.');
  assert.equal(rows[3][0], 'Det är inte så farligt som du tror.');
  const P = JSON.parse(JSON.stringify(app.run(`ankiPrepare(${JSON.stringify(SAMPLE)}, 'Test')`)));
  assert.equal(P.lang, 'sv');
  assert.equal(P.total, 4, 'zu kurze Zeile übersprungen');
  assert.equal(P.items[0].de, "I don't know why he never calls.");
});
test('Übernehmen: als neue Sätze in Stapelreihenfolge, doppelt Eingelesenes wird übersprungen', () => {
  const before = app.run('BANK.sv.length');
  const n = app.run(`ankiCommit(ankiPrepare(${JSON.stringify(SAMPLE)}, 'Test'))`);
  assert.equal(n, 4);
  assert.equal(app.run('BANK.sv.length'), before + 4);
  assert.equal(app.run(`ankiPrepare(${JSON.stringify(SAMPLE)}, 'Test').total`), 0);
});
test('Lücken aus Lesetexten: Lücke im Satz, Lösung ist das fehlende Wort', () => {
  for (const lang of ['sv', 'es']) for (let k = 0; k < 30; k++) {
    const d = app.run(`GENS.textgap_${lang}.make()`);
    assert.ok(d.prompt.includes('___') && d.full.toLowerCase().includes(d.answers[0]), d.prompt);
  }
  const q = app.run("(() => { S.lang = 'sv'; startRun('textgap', { text:TEXTS.sv[0].id }); return S.run.queue.length; })()");
  assert.ok(q >= 5);
});
