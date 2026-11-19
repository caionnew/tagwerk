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

// Feste Wendungen (24.55.0): Beim ersten Kontakt muss die Lücke lösbar sein, sonst ist sie Raten. Entweder steht das Bild
// im deutschen Satz (Fliegen → flugor) oder die Erklärung nennt es mit „(wörtlich: …)“, dann erscheint es als Hinweis.
test('Redewendungen: jede Lücke beim ersten Kontakt lösbar, Bild im deutschen Satz oder „(wörtlich: …)“ in der Erklärung', () => {
  const BANK = app.get('BANK'), lookupWord = app.get('lookupWord'), literalOf = app.get('literalOf');
  for (const lang of ['sv', 'es']) {
    const idioms = BANK[lang].filter(i => i.trap === 'idiom');
    assert.ok(idioms.length >= 20, lang);
    const unsolvable = idioms.filter(i => !literalOf(i)).filter(i => {
      const g = lookupWord(lang, i.gap);
      const meanings = g ? g.de.split(';')[0].split(',').map(x => x.replace(/\([^)]*\)/g, '').replace(/^(der|die|das)\s+/i, '').trim().toLowerCase()).filter(Boolean) : [];
      return !meanings.some(m => i.de.toLowerCase().includes(m));
    }).map(i => `${i.de} → ${i.gap}`).join(' | ');
    assert.equal(unsolvable, '', lang);
  }
  // Das Bild steht als Ganzes in Klammern, ohne weitere Klammern darin
  assert.equal(literalOf(BANK.sv.find(i => i.gap === 'världen')), 'nicht die ganze Welt');
  assert.equal(literalOf(BANK.sv.find(i => i.gap === 'flugor')), '');
});

// Abwechslung: B2-Sätze sollen nicht immer gleich anfangen und nicht meist vom Ich erzählen.
// Ganze Inhaltspakete misst tools/vielfalt.js (neue Wörter, Länge, Anfänge gegenüber dem letzten Stand).
test('B2-Sätze: kein Zwei-Wort-Anfang öfter als achtmal, höchstens ein Fünftel beginnt mit der ersten Person', () => {
  const B = app.get('BANK');
  for (const lang of ['sv', 'es']) {
    const b2 = B[lang].filter(i => i.lvl === 3 && !i.tat && !i.own).map(i => i.target);
    const op = {}; b2.forEach(s => { const k = s.split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[,.¿¡]/g, ''); op[k] = (op[k] || 0) + 1; });
    assert.deepEqual(Object.entries(op).filter(([, n]) => n > 8), [], lang);
    const first = b2.filter(s => (lang === 'sv' ? /^jag\b/i : /^(yo|me)\b/i).test(s)).length;
    assert.ok(first <= b2.length / 5, `${lang}: ${first} von ${b2.length} beginnen mit der ersten Person`);
  }
});
