// Thema „Feste Verbindungen“ (Paket 8, 24.88.0): Verb und Nomen gehören fest zusammen (fatta ett beslut, tomar una decisión).
// Je Sprache 49 Sätze, gut ein Drittel B1. Die Erklärung beginnt mit der Verbindung; „falsch:“ in den Alternativen ist der typische
// Fehler (göra statt fatta) und gibt Aufgaben „Finde den Fehler“. Ein anderes Verb in der Lücke wird beim Namen genannt.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
app.run('buildBank()');
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const BANK = app.get('BANK'), judgeX = app.get('judgeX'), answersFor = app.get('answersFor'), kollokWhy = app.get('kollokWhy');
const items = lang => BANK[lang].filter(i => i.trap === 'kollok');
const item = (lang, t) => { const it = items(lang).find(i => i.target === t); assert.ok(it, t); return it; };
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const answer = (it, type, input) => run(`(() => { DB = freshDB(); const ex = { type:${JSON.stringify(type)}, id:${JSON.stringify(it.id)} };
  S.run = { kind:'quick', lang:${JSON.stringify(it.lang)}, queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
  S.run.cur = { input:${JSON.stringify(input)}, state:'answer' }; check(); const c = S.run.cur;
  return { result:c.result, refl:c.refl || null, vocab:c.vocab || null, kind:c.kind || null, topic:!!c.vocabTopic, fb:feedbackHtml(S.run, ex, c) }; })()`);

test('je Sprache 49 Sätze, 18 davon B1; Wortschatz-Thema mit Suchmustern für den Nachschub', () => {
  for (const lang of ['sv', 'es']) {
    assert.equal(items(lang).length, 49, lang);
    assert.equal(items(lang).filter(i => i.lvl === 2).length, 18, lang);
    assert.ok(items(lang).every(i => i.lvl === 2 || i.lvl === 3), lang);
    assert.ok(app.run(`trapMeta('${lang}', 'kollok').vocab === true && TAT_Q.${lang}.kollok.length >= 5 && TAT_ADV.${lang}.kollok.length >= 5`), lang);
  }
});

test('jede Erklärung beginnt mit der Verbindung („fatta ett beslut = …“), ihr Verb ist das Verb der Lücke', () => {
  const lookupWord = app.get('lookupWord');
  const base = w => String(w).toLowerCase().replace(/([aeií]r)se$/, '$1');
  for (const lang of ['sv', 'es']) for (const it of items(lang)) {
    const m = /^(.+?) = /.exec(it.note);
    assert.ok(m, it.target);
    // för ist im Wörterbuch die Präposition (für), hier das Präsens von föra
    const lem = it.gap.split(' ').map(w => (w === 'för' ? 'föra' : (e => e && (e.l || w))(lookupWord(lang, w)))).filter(Boolean).map(base);
    assert.ok(m[1].split(' ').some(w => lem.includes(base(w))), `${it.target}: ${m[1]} / ${lem}`);
  }
});

test('„falsch:“ weicht nur im Lückenwort ab, gilt beim Übersetzen nicht und gibt eine Aufgabe „Finde den Fehler“', () => {
  for (const lang of ['sv', 'es']) {
    const withWrong = items(lang).filter(i => i.wrong.length);
    assert.ok(withWrong.length >= 12, lang);
    for (const it of withWrong) for (const w of it.wrong) {
      assert.equal(judgeX(w, answersFor({ type:'free', id:it.id }), lang).res, 'bad', w);
      // Vor und nach der Lücke steht dasselbe wie im Zielsatz
      const at = it.target.indexOf(it.gap), tail = it.target.slice(at + it.gap.length);
      assert.ok(w.startsWith(it.target.slice(0, at)) && w.endsWith(tail), w);
    }
    const spots = run(`bankSpots('${lang}').filter(f => f.trap === 'kollok').map(f => f())`);
    assert.equal(spots.length, withWrong.reduce((n, i) => n + i.wrong.length, 0), lang);
    for (const d of spots) {
      assert.ok(d.wrong.length >= 1 && d.wrong.length <= 2 && d.fix.length >= 1, d.full);
      assert.match(d.note, / = /);
    }
  }
  const d = run(`bankSpots('sv').filter(f => f.trap === 'kollok').map(f => f()).find(d => d.full === 'Han tog körkort först när han var trettio, efter fyra misslyckade uppkörningar.')`);
  assert.equal(d.words.join(' '), 'Han gjorde körkort först när han var trettio, efter fyra misslyckade uppkörningar.');
  assert.deepEqual(d.wrong, [1]);
  assert.deepEqual(d.fix, ['tog']);
  // Auch auf dem Themenblatt (typischer Fehler) und unter „Finde den Fehler“
  for (const lang of ['sv', 'es']) {
    assert.equal(run(`typicalError('${lang}', 'kollok').trap`), 'kollok');
    assert.ok(run(`BANK_CATS.${lang}.includes('kollok') && typeof SPOT_CATS.${lang}.kollok === 'function' && SPOT_CATS.${lang}.kollok().trap === 'kollok'`), lang);
  }
});

test('anderes Verb: „„ett beslut“ geht nicht mit göra.“; dasselbe Verb in falscher Form oder ein Nicht-Verb nicht', () => {
  const fatta = item('sv', 'Styrelsen måste fatta ett beslut om sammanslagningen till fredag.');
  assert.equal(kollokWhy('sv', fatta, [['göra', 'fatta']]), '„ett beslut“ geht nicht mit göra.');
  assert.equal(kollokWhy('sv', fatta, [['träffa', 'fatta']]), '„ett beslut“ geht nicht mit träffa.');
  assert.equal(kollokWhy('sv', fatta, [['fattar', 'fatta']]), '');
  // ta ett beslut geht auch: tar ist dann nur die falsche Form
  assert.equal(kollokWhy('sv', fatta, [['tar', 'fatta']]), '');
  assert.equal(kollokWhy('sv', fatta, [['xyz', 'fatta']]), '');
  const vistazo = item('es', '¿Le puedes echar un vistazo a mi currículum antes de que lo envíe a la consultora?');
  assert.equal(kollokWhy('es', vistazo, [['tirar', 'echar']]), '„un vistazo“ geht nicht mit tirar.');
  const cuenta = item('es', 'Leí la novela de un tirón y no me di cuenta de que ya era medianoche.');
  assert.equal(kollokWhy('es', cuenta, [['hice', 'di']]), '„cuenta de“ geht nicht mit hacer.');
  // Für jeden Satz: ein anderes häufiges Verb wird erkannt
  for (const [lang, a, b] of [['sv', 'gjorde', 'tog'], ['es', 'hice', 'di']])
    for (const it of items(lang)) assert.ok(kollokWhy(lang, it, [[a, it.gap.split(' ')[0]]]) || kollokWhy(lang, it, [[b, it.gap.split(' ')[0]]]), it.target);
  // Andere Themen: nichts
  assert.equal(kollokWhy('sv', BANK.sv.find(i => i.trap !== 'kollok'), [['göra', 'fatta']]), '');
});

test('Prüfen: Lücke und Übersetzen nennen das falsche Verb zuerst, ohne „Die Grammatik passt …“; zählt beim Thema', () => {
  const fatta = item('sv', 'Styrelsen måste fatta ett beslut om sammanslagningen till fredag.');
  const c = answer(fatta, 'cloze', 'göra');
  assert.equal(c.result, 'bad');
  assert.equal(c.refl, '„ett beslut“ geht nicht mit göra.');
  assert.match(text(c.fb), /„ett beslut“ geht nicht mit göra\..*fatta ett beslut = eine Entscheidung treffen/);
  // Zwei Wörter in der Lücke: Wort für Wort
  const rum = answer(item('sv', 'Konferensen äger rum i Göteborg i början av mars.'), 'cloze', 'tar plats');
  assert.equal(rum.refl, '„rum“ geht nicht mit ta.');
  const f = answer(fatta, 'free', 'Styrelsen måste göra ett beslut om sammanslagningen till fredag');
  assert.equal(f.result, 'bad');
  assert.equal(f.refl, '„ett beslut“ geht nicht mit göra.');
  assert.equal(f.kind, 'vocab');
  assert.ok(f.topic);
  assert.equal(f.vocab, null);
  assert.doesNotMatch(text(f.fb), /Die Grammatik passt/);
  const es = answer(item('es', 'El árbitro cometió un error grave en el último minuto.'), 'free', 'El árbitro hizo un error grave en el último minuto');
  assert.equal(es.refl, '„un error“ geht nicht mit hacer.');
  // Richtige Verbindung, andere Wörter drumherum: wie bisher
  assert.equal(answer(fatta, 'free', 'Styrelsen måste ta ett beslut om sammanslagningen till fredag').result, 'ok');
});

test('Konnektoren ohne feste Verbindungen: keine Kollokation mehr in den Auswahllisten', () => {
  for (const name of ['VERB_SV', 'VERB_ES']) {
    const list = app.get(name);
    assert.ok(!list.some(([p]) => /beslut|en fråga|hänsyn|decisión|una pregunta|un paseo|razón|de menos/.test(p)), name);
  }
  assert.equal(app.run("GENS.verbind_sv.label + ' / ' + GENS.verbind_es.label"), 'Konnektoren / Konnektoren');
});
