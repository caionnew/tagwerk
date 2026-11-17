// Grammatik-Begriffe je Sprache und Land & Leute: Daten passen zueinander und zur übrigen App.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const TERMS = app.get('TERMS'), TRAPS = app.get('TRAPS'), BANK = app.get('BANK'), GLOSS_RAW = app.get('GLOSS_RAW');
const KULTUR = app.get('KULTUR'), KULTUR_CATS = app.get('KULTUR_CATS'), TEXTS = app.get('TEXTS'), GEO = app.get('GEO');
const termsFor = app.get('termsFor'), termSheetHtml = app.get('termSheetHtml');
const other = { sv:'es', es:'sv' };
const reOf = t => new RegExp('(?<![A-Za-zÄÖÜäöüß-])(?:' + t.re + ')(?![A-Za-zÄÖÜäöüß])');
// Was die App in einer Sprache an Erklärungen zeigt: Themen, Satzbank, Wörterbuch
const explanations = lang => [...TRAPS[lang].flatMap(t => [t.short || '', t.rule || '']), ...BANK[lang].map(i => i.note || ''), ...GLOSS_RAW[lang].split('\n').map(l => l.split('|')[2] || '')];

test('Begriffe: jeder hat eine Fassung je Sprache oder ist ein App-Begriff, Themen gibt es', () => {
  const keys = new Set();
  for (const t of TERMS) {
    assert.ok(!keys.has(t.k), t.k); keys.add(t.k);
    assert.ok(t.app || t.sv || t.es, t.k);
    for (const lang of ['sv', 'es']) if (t[lang]) {
      assert.equal(t[lang].length, 3, t.k);
      assert.ok(t[lang][0] && t[lang][1], t.k);
      if (t[lang][2]) assert.ok(TRAPS[lang].some(x => x.id === t[lang][2]), `${t.k} ${lang} ${t[lang][2]}`);
    }
  }
});
test('Begriffe einer Sprache tauchen in den Erklärungen der anderen nicht auf', () => {
  for (const lang of ['sv', 'es']) {
    const tx = explanations(other[lang]);
    for (const t of TERMS.filter(x => x[lang] && !x[other[lang]] && !x.app)) assert.equal(tx.filter(s => reOf(t).test(s)).length, 0, `${t.k} (${lang}) in ${other[lang]}`);
  }
});
test('Begriffe, die in den Erklärungen einer Sprache vorkommen, haben dort eine Fassung', () => {
  for (const lang of ['sv', 'es']) {
    const tx = explanations(lang);
    for (const t of TERMS.filter(x => !x.app && !x[lang])) assert.equal(tx.filter(s => reOf(t).test(s)).length, 0, `${t.k} fehlt für ${lang}`);
  }
});
test('Liste je Sprache: Supinum nur Schwedisch, Subjuntivo nur Spanisch, Perfekt in beiden mit eigenem Beispiel', () => {
  const ks = lang => termsFor(lang).map(t => t.k);
  assert.ok(ks('sv').includes('supinum') && !ks('es').includes('supinum'));
  assert.ok(ks('es').includes('subjuntivo') && !ks('sv').includes('subjuntivo'));
  assert.ok(ks('sv').includes('perfekt') && ks('es').includes('perfekt'));
  assert.ok(!ks('sv').includes('lix') && !ks('es').includes('gefestigt'));
  const es = termSheetHtml({ k:'perfekt', lang:'es' }), sv = termSheetHtml({ k:'perfekt', lang:'sv' });
  assert.match(es, /He comido/); assert.doesNotMatch(es, /Jag har/);
  assert.match(sv, /Jag har aldrig/); assert.doesNotMatch(sv, /haber/);
});
test('Land & Leute: Kategorien, eindeutige ids, Karten mit passenden Varianten, Lesetexte und Ausschnitte gibt es', () => {
  for (const lang of ['sv', 'es']) {
    const ids = KULTUR[lang].map(e => e.id);
    assert.equal(new Set(ids).size, ids.length, lang);
    for (const e of KULTUR[lang]) {
      assert.ok(KULTUR_CATS[e.cat], e.id);
      (e.txt || []).forEach(id => assert.ok(TEXTS[lang].some(t => t.id === id), `${e.id} → ${id}`));
      if (!e.map) continue;
      assert.ok(GEO[e.map.v], e.id);
      (e.map.g || []).flat().forEach(k => assert.ok(GEO[e.map.v].c[k], `${e.id} ${k}`));
      if (e.vars && e.map.g) assert.ok(e.map.g.length <= e.vars.length, e.id);
      if (e.map.clip) { assert.ok(GEO[e.map.v][e.map.clip.p], e.id); assert.ok(GEO[e.map.v].c[e.map.clip.k], e.id); assert.ok(e.map.clip.g < e.vars.length, e.id); }
      (e.map.pts || []).forEach(p => assert.ok(GEO[e.map.v].pts[p.replace(/[<>]$/, '')], `${e.id} ${p}`));
    }
  }
});
