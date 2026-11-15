// Das eingebaute Wörterbuch deckt alle Wörter ab, die die App selbst zeigt: Satzbank, erzeugte Aufgaben, Land & Leute.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const BANK = app.get('BANK'), GENS = app.get('GENS'), KULTUR = app.get('KULTUR'), lookupWord = app.get('lookupWord'), tokens = app.get('tokens');
const missing = (lang, texts) => { const m = new Set(); texts.forEach(s => tokens(s).forEach(w => { if (/[a-zà-ÿ]/i.test(w) && !/^\d+$/.test(w) && !lookupWord(lang, w)) m.add(w.toLowerCase()); })); return [...m]; };

test('Satzbank: jedes Wort ist nachschlagbar', () => {
  for (const lang of ['sv', 'es']) assert.deepEqual(missing(lang, BANK[lang].filter(i => !i.own && !i.tat).map(i => i.target)), [], lang);
});
test('erzeugte Aufgaben: jedes Wort ist nachschlagbar (300 je Generator; Lesetext-Lücken ausgenommen, Texte haben eigene Hilfen)', () => {
  for (const g of Object.keys(GENS).filter(k => !GENS[k].noGloss)) {
    const texts = [];
    for (let k = 0; k < 300; k++) { const d = GENS[g].make(); texts.push(d.full || d.answers[0]); if (d.words) texts.push(d.words.join(' ')); }
    assert.deepEqual(missing(GENS[g].lang, texts), [], g);
  }
});
test('Land & Leute: Titel, Beispielsätze und Varianten sind nachschlagbar', () => {
  for (const lang of ['sv', 'es']) assert.deepEqual(missing(lang, KULTUR[lang].flatMap(e => [e.title, e.ex[0], ...(e.vars || []).map(v => v[1])])), [], lang);
});
