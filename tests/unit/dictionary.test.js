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

// Lesetexte (24.53.0): jedes Wort nachschlagbar, damit Antippen offline eine deutsche Bedeutung zeigt und Lesetext-Lücken
// aus jedem Satz entstehen können. Gebeugte Formen brauchen den Eintrag ihrer Grundform (deren Bedeutung ist der Hinweis).
const TEXTS = app.get('TEXTS'), GLOSS = app.get('GLOSS');
test('Lesetexte: jedes Wort ist nachschlagbar', () => {
  for (const lang of ['sv', 'es']) assert.deepEqual(missing(lang, TEXTS[lang].flatMap(t => [t.title, t.body])), [], lang);
});
// Bewusst ohne Grundform-Eintrag: Die vorhandene Grundform meint im Text etwas anderes (cambio = Wechsel, nicht „sich umziehen“)
const NO_BASE = { sv:['gifta sig'], es:['cambiarse', 'levantarse', 'ducharse', 'acordarse'] };
test('Lesetexte: gebeugte Formen haben einen Eintrag ihrer Grundform', () => {
  for (const lang of ['sv', 'es']) {
    const miss = new Set();
    TEXTS[lang].forEach(t => tokens(t.body).forEach(w => { const e = lookupWord(lang, w); if (e && e.l && !e.multi && !lookupWord(lang, e.l) && !NO_BASE[lang].includes(e.l.toLowerCase())) miss.add(e.l + ' ← ' + w); }));
    assert.deepEqual([...miss], [], lang);
  }
  assert.ok(GLOSS.sv.vindby && GLOSS.es.diputada);
});
