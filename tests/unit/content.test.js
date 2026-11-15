// Satzbank und Konjugation: Format, Doppelungen, Lücke im Zielsatz, Rechtschreibregeln der Verbformen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const CONTENT = app.get('CONTENT'), conjugate = app.get('conjugate');

test('jede Zeile der Satzbank hat fünf Felder (sechstes optional: Niveau), keine Doppelungen, die Lücke steht im Zielsatz', () => {
  const problems = [], seen = new Set(); let n = 0;
  for (const lang of ['sv', 'es']) for (const [trap, raw] of Object.entries(CONTENT[lang])) {
    raw.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
      n++;
      const p = line.split('|').map(x => x.trim());
      if (p.length !== 5 && !(p.length === 6 && /^(A2|B1|B2)$/.test(p[5]))) problems.push(`Felder ${p.length}: ${line}`);
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
