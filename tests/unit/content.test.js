// Satzbank und Konjugation: Format, Doppelungen, Lücke im Zielsatz, Rechtschreibregeln der Verbformen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const CONTENT = app.get('CONTENT'), conjugate = app.get('conjugate');

test('jede Zeile der Satzbank hat fünf Felder (sechstes optional: Niveau, siebtes optional: Erklärung), keine Doppelungen, die Lücke steht im Zielsatz', () => {
  const problems = [], seen = new Set(); let n = 0;
  for (const lang of ['sv', 'es']) for (const [trap, raw] of Object.entries(CONTENT[lang])) {
    raw.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
      n++;
      const p = line.split('|').map(x => x.trim());
      const lvlOk = p.length < 6 || /^(A2|B1|B2|)$/.test(p[5]) && (p.length === 7 || p[5]);
      if (p.length < 5 || p.length > 7 || !lvlOk || (p.length === 7 && p[6].length < 10)) problems.push(`Felder ${p.length}: ${line}`);
      const [, target, gap] = p;
      if (seen.has(lang + target)) problems.push(`doppelt: ${target}`);
      seen.add(lang + target);
      if (gap && !target.includes(gap.split('/')[0])) problems.push(`Lücke „${gap}“ fehlt in: ${target} (${trap})`);
    });
  }
  assert.ok(n >= 280, `nur ${n} Sätze`);
  assert.deepEqual(problems, []);
});

test('Konjugation: regelmäßige, unregelmäßige und Rechtschreibregeln', () => {
  const cases = [
    ['hablar', 'pres', 0, 'hablo'], ['comer', 'indef', 0, 'comí'], ['vivir', 'imp', 0, 'vivía'],
    ['tener', 'indef', 0, 'tuve'], ['hacer', 'indef', 0, 'hice'], ['ser', 'subj', 0, 'sea'], ['ir', 'subj', 0, 'vaya'],
    ['llegar', 'subj', 0, 'llegue'], ['llegar', 'subj', 3, 'lleguemos'], ['buscar', 'indef', 0, 'busqué'], ['empezar', 'indef', 0, 'empecé'],
    ['dormir', 'pres', 2, 'duerme'], ['leer', 'indef', 2, 'leyó']
  ];
  for (const [v, t, i, want] of cases) assert.equal(conjugate(v, t, i), want, `${v} ${t} ${i}`);
});

test('jeder Generator liefert Aufgaben mit Lösung', () => {
  const GENS = app.get('GENS');
  for (const g of Object.keys(GENS)) for (let k = 0; k < 50; k++) {
    const d = GENS[g].make();
    assert.ok(d && Array.isArray(d.answers) && d.answers.length && d.answers[0], `${g} ohne Lösung`);
  }
});

test('jede Lücke sitzt auf einem ganzen Wort, nie mitten in einem anderen (etwa „en“ in „Pienso“)', () => {
  const BANK = app.get('BANK'), gapPos = app.get('gapPos');
  const letter = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
  const bad = [];
  for (const lang of ['sv', 'es']) BANK[lang].filter(i => i.gap).forEach(i => {
    const p = gapPos(i.target, i.gap), before = i.target[p - 1] || ' ', after = i.target[p + i.gap.length] || ' ';
    if (p < 0 || letter.test(before) || letter.test(after)) bad.push(`${i.target} (Lücke „${i.gap}“)`);
  });
  assert.deepEqual(bad, []);
  assert.equal(gapPos('Pienso mucho en ti.', 'en'), 13);
  assert.equal(gapPos('La fiesta es en casa de Ana.', 'es'), 10);
});

test('Erklärung je Satz: steht bei falscher Antwort statt der allgemeinen Themenregel', () => {
  const BANK = app.get('BANK');
  const item = BANK.es.find(i => i.target === '¿Me pasarías la sal?');
  assert.ok(item && item.note);
  const fb = app.run(`(() => { DB.st = {}; const ex = { type:'cloze', id:${JSON.stringify(item.id)} }; S.run = { kind:'quick', lang:'es', queue:[ex], idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0 }; S.view = 'run'; S.run.cur = { input:'pases', state:'answer', result:null }; check(); return S.run.cur.result + ' ' + feedbackHtml(S.run, ex, S.run.cur); })()`);
  assert.match(fb, /^bad /);
  assert.match(fb, /Höfliche Bitte/);
  assert.doesNotMatch(fb, /si \+ tuviera/);
  // Realer si-Satz: keine Regel zum irrealen Fall
  const real = BANK.es.find(i => i.target === 'Si llueve mañana, nos quedamos en casa.');
  assert.match(real.note, /si \+ Präsens/);
});
test('jeder Satz der Satzbank hat eine Erklärung, kein deutscher Satz kommt in einer Sprache doppelt vor', () => {
  const BANK = app.get('BANK');
  for (const l of ['sv', 'es']) {
    const missing = BANK[l].filter(i => !i.note).map(i => i.target);
    assert.equal(missing.length, 0, `${l}: ohne Erklärung: ${missing.join(" | ")}`);
    const seen = new Map();
    BANK[l].forEach(i => { assert.ok(!seen.has(i.de), `${l}: „${i.de}“ doppelt (${seen.get(i.de)} / ${i.target})`); seen.set(i.de, i.target); });
  }
});
