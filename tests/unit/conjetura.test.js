// Thema „wohl“: Futur der Vermutung (Spanisch, Paket 6). Vermutung über jetzt im Futur, über früher im Konditional oder
// mit habrá/habría + Partizip; deber de und probablemente mit Präsens gelten beim Übersetzen auch, seguramente wie probablemente.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const BANK = app.get('BANK'), judgeX = app.get('judgeX'), answersFor = app.get('answersFor'), trapMeta = app.get('trapMeta');
const items = [...BANK.es.filter(i => i.trap === 'conjetura')];
const item = t => { const it = items.find(i => i.target === t); assert.ok(it, t); return it; };
const judge = (it, input) => judgeX(input, answersFor({ type:'free', id:it.id }), 'es').res;

test('Thema mit 36 Sätzen (12 B1, 24 B2), Übersicht mit fünf Zeilen, Suchmuster für den Nachschub', () => {
  assert.equal(items.length, 36);
  assert.equal(items.filter(i => i.lvl === 2).length, 12);
  assert.equal(items.filter(i => i.lvl === 3).length, 24);
  const tr = trapMeta('es', 'conjetura');
  assert.equal(tr.table.length, 5);
  assert.ok(app.run('TAT_Q.es.conjetura.length >= 5 && TAT_ADV.es.conjetura.length >= 5'));
});

test('Jede Lücke ist eine Form der Vermutung: Futur, Konditional oder habrá/habría + Partizip', () => {
  const ok = /^(será|serán|serían|estará|estarás|estarán|estaremos|estaría|tendrá|tendría|llamará|cabrán|sabría|habría|(habrá|habré|habrán|habría) \S+)$/i;
  assert.deepEqual([...items.filter(i => !ok.test(i.gap)).map(i => i.gap)], []);
});

test('Übersetzen: Futur, deber de und probablemente gelten, seguramente wie probablemente; das bloße Präsens nicht', () => {
  const it = item('Llaman a la puerta. Será el cartero.');
  for (const s of ['Llaman a la puerta. Será el cartero', 'Llaman a la puerta. Debe de ser el cartero', 'Llaman a la puerta. Probablemente es el cartero', 'Llaman a la puerta. Seguramente es el cartero', 'Suena el timbre. Será el cartero']) assert.equal(judge(it, s), 'ok', s);
  assert.equal(judge(it, 'Llaman a la puerta. Es el cartero'), 'bad');
  // Über früher: Konditional; habrá sido geht, wenn es bis jetzt reicht
  const ex = item('El examen de acceso habrá sido durísimo, porque solo lo han aprobado tres candidatos.');
  assert.equal(judge(ex, 'El examen de acceso sería durísimo, porque solo lo aprobaron tres candidatos'), 'ok');
});

test('Lücke: auch deber de und probablemente aus den Alternativen', () => {
  const it = item('Llaman a la puerta. Será el cartero.');
  assert.deepEqual([...it.gapAlts], ['Será', 'Debe de ser', 'Debe ser', 'Probablemente es']);
});

test('seguramente gilt überall wie probablemente, die Lösung steht dann mit seguramente da', () => {
  const ownWords = app.get('ownWords');
  assert.equal(ownWords('es', 'Seguramente tiene hambre', 'Probablemente tiene hambre.'), 'Seguramente tiene hambre.');
  assert.equal(judgeX('seguramente tiene hambre', ['Probablemente tiene hambre.'], 'es').res, 'ok');
});
