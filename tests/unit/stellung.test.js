// Zeitangaben an anderer Stelle (24.62.1): Beide üblichen Stellungen zählen, im Schwedischen nur mit Verb an zweiter Stelle.
// Dazu: Diktat prüft nur den gehörten Satz; „tu“ (Possessiv) und „yo que tú“ fallen beim Vergleich nicht mehr weg.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const BANK = app.get('BANK'), judgeX = app.get('judgeX');
const item = (lang, target) => { const it = BANK[lang].find(i => i.target === target); assert.ok(it, target); return it; };
const res = (lang, target, input) => { const it = item(lang, target); return (judgeX(input, [it.target].concat(it.alts), lang) || {}).res; };

test('Spanisch: Zeitangabe vorn oder hinten, beides richtig', () => {
  const ok = [['Ayer no dormí bien.', 'No dormí bien ayer'], ['Hoy he trabajado mucho.', 'Trabajé mucho hoy'], ['El año pasado viajamos a México.', 'Fuimos a México el año pasado'],
    ['Anoche no pegué ojo.', 'No pegué ojo anoche'], ['Nos vemos a las ocho delante del cine.', 'Quedamos delante del cine a las ocho'],
    ['Me acabo de acordar de que hoy es su cumpleaños.', 'Acabo de acordarme de que su cumpleaños es hoy'], ['Siempre le buscas tres pies al gato.', 'Le buscas siempre tres pies al gato'],
    ['Aunque llueva mañana, saldremos de excursión.', 'Aunque mañana llueva, saldremos de excursión']];
  for (const [t, i] of ok) assert.equal(res('es', t, i), 'ok', i);
  // Umgestellt, aber falsch bleibt falsch
  assert.equal(res('es', 'Ayer no dormí bien.', 'No ayer dormí bien'), 'bad');
});
test('Schwedisch: Zeitangabe vorn mit Verb an zweiter Stelle oder hinten; ohne Inversion falsch', () => {
  const ok = [['Kanske regnar det i morgon.', 'I morgon regnar det kanske'], ['Jag måste gå nu.', 'Nu måste jag gå'], ['Jag ska ringa i morgon.', 'I morgon ringer jag'],
    ['Brevet skickades igår.', 'Igår skickades brevet'], ['Vi åker klockan sex.', 'Klockan sex åker vi'], ['Det har snöat oavbrutet sedan i söndags.', 'Sedan i söndags har det snöat oavbrutet'],
    ['Hon ringde för en timme sedan.', 'För en timme sen ringde hon'], ['Igår träffade jag en gammal vän.', 'Jag träffade en gammal kompis igår']];
  for (const [t, i] of ok) assert.equal(res('sv', t, i), 'ok', i);
  const bad = [['Jag måste gå nu.', 'Nu jag måste gå'], ['Jag ska ringa i morgon.', 'I morgon jag ska ringa'], ['Igår träffade jag en gammal vän.', 'Igår jag träffade en gammal vän'],
    ['Brevet skickades igår.', 'Igår brevet skickades'], ['Kanske regnar det i morgon.', 'I morgon det regnar kanske']];
  for (const [t, i] of bad) assert.equal(res('sv', t, i), 'bad', i);
});
test('Diktat: nur der gehörte Satz zählt, keine Alternative', () => {
  const it = item('es', 'Ayer visité a mi abuela.');
  assert.ok(it.alts.includes('Visité a mi abuela ayer.'));
  const dict = input => run(`(() => { S.lang = 'es'; S.view = 'run'; S.run = { kind:'dict', lang:'es', queue:[{ type:'dict', id:${JSON.stringify(it.id)} }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0 };
    S.run.cur = { input:${JSON.stringify(input)}, state:'answer' }; check(); return S.run.cur.result; })()`);
  assert.equal(dict('ayer visité a mi abuela'), 'ok');
  assert.equal(dict('Visité a mi abuela ayer.'), 'bad');
  assert.equal(dict('Ayer fui a ver a mi abuela.'), 'bad');
});
test('Spanisch: Subjektpronomen am Anfang zählt nicht, aber nicht „tu“ (Possessiv) und nicht in „yo que tú“', () => {
  const r = (input, answer) => (judgeX(input, [answer], 'es') || {}).res;
  assert.equal(r('Yo tengo dos hermanos', 'Tengo dos hermanos.'), 'ok');
  assert.equal(r('Tú eres muy amable', 'Eres muy amable.'), 'ok');
  assert.equal(r('Tu eres muy amable', 'Eres muy amable.'), 'near', 'tú ohne Akzent: fast richtig');
  assert.equal(r('Prima me cayó genial desde el primer momento', 'Tu prima me cayó genial desde el primer momento.'), 'bad');
  assert.equal(r('Tu prima me cayó genial desde el primer momento', 'Tu prima me cayó genial desde el primer momento.'), 'ok');
  assert.equal(r('Que tú, no lo haría', 'Yo que tú, no lo haría.'), 'bad');
  assert.equal(r('En tu lugar no lo haría', 'Yo en tu lugar no lo haría.'), 'ok');
});
