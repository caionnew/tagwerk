// Lücken aus Lesetexten: nur gelesene Texte, deutsche Bedeutung als Hinweis, kein Grundwortschatz, nachgeschlagene Wörter zuerst.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
function seeded(seed){ let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
function withSeed(seed, fn){ const orig = Math.random; Math.random = seeded(seed); try { return fn(); } finally { Math.random = orig; } }
// Antwort prüfen und weiter (erst „Weiter“ verbucht das Ergebnis)
const answer = (d, input) => run(`(() => { S.run = { kind:'gen', lang:'es', queue:[{ type:'gen', gen:'textgap_es', data:${JSON.stringify(d)} }], idx:0, ok:0, bad:0, res:[], endless:true, gen:'textgap_es', cur:{ state:'answer', input:${JSON.stringify(input)} } }; check(); const res = S.run.cur.result; next(); return { res, missed:S.run.missed || [] }; })()`);
const fresh = (lang, extra) => { app.run(`DB = freshDB(); DB.settings.lang = '${lang}'; S.lang = '${lang}'; S.run = null; S.text = null; DB.used.genRecent = {};`); if (extra) app.run(extra); };
const read = (lang, ...ids) => `DB.used.texts = Object.assign(DB.used.texts || {}, ${JSON.stringify(Object.fromEntries(ids.map(id => [lang + ':' + id, { best:3, n:1, last:'2026-01-01' }])))});`;

test('nur aus gelesenen Texten (Schlüssel „es:campoamor“), ohne gelesenen Text gar nicht angeboten', () => {
  fresh('es');
  assert.ok(!run("genIds('es')").includes('textgap_es'), 'ohne gelesenen Text nicht im Grammatik-Training');
  run("startRun('trap', { trap:'lesen' })");
  assert.equal(run('S.run'), null, 'Thema „Lücken aus Lesetexten“ startet ohne gelesenen Text nicht');
  app.run(read('sv', 'vasa'));
  assert.ok(!run("genIds('es')").includes('textgap_es'), 'ein schwedischer Text zählt nicht für Spanisch');
  app.run(read('es', 'campoamor'));
  assert.ok(run("genIds('es')").includes('textgap_es'));
  const labels = withSeed(7, () => run("Array.from({ length:150 }, () => GENS.textgap_es.make().label)"));
  assert.deepEqual([...new Set(labels)], ['Aus „Clara Campoamor y el voto femenino“']);
});

test('jede mögliche Lücke: Bedeutung als Hinweis, verrät die Lösung nicht, kein Grundwortschatz, keine Hilfsverben', () => {
  fresh('es');
  const bad = run(`(() => { const out = [];
    for (const lang of ['sv', 'es']) for (const t of TEXTS[lang]) for (const s of gapSentences(t)) { const toks = s.split(' ');
      toks.forEach((tok, i) => { const w = gapToken(tok); if (!gapWordOk(w, i)) return; const x = gapInfo(lang, w, i, false, toks); if (!x) return;
        const lw = w.toLowerCase(), lemma = x.lemma || lw, words = x.mean.toLowerCase().split(/[\\s,]+/);
        if (!x.mean) out.push(lang + ' ohne Bedeutung: ' + w);
        if (words.includes(lw) || words.includes(lemma)) out.push(lang + ' Bedeutung verrät: ' + w);
        if (x.verb ? GAP_AUX[lang].has(lemma) : GAP_COMMON[lang].has(lemma) || gapA2(lang).has(lemma)) out.push(lang + ' zu häufig: ' + w);
      }); }
    return out; })()`);
  assert.deepEqual(bad, []);
});

test('die beiden Fälle aus der Rückmeldung und bekannte Stolperstellen', () => {
  fresh('es');
  const info = (lang, sentence, word) => run(`(() => { const toks = ${JSON.stringify(sentence)}.split(' '); const i = toks.findIndex(t => gapToken(t) === ${JSON.stringify(word)}); return gapInfo('${lang}', ${JSON.stringify(word)}, i, false, toks); })()`);
  // madres: Grundwortschatz, keine Lücke; diputada: mit Bedeutung, also nicht mehr geraten (directora scheidet aus)
  assert.equal(info('es', 'Para muchas luchadoras, pelear con la ropa de sus madres es una forma de reivindicarla.', 'madres'), null);
  const dip = info('es', 'Una de ellas era Clara Campoamor, abogada madrileña de 43 años y diputada del Partido Radical.', 'diputada');
  assert.match(dip.mean, /Abgeordnete/); assert.equal(dip.lemma, 'diputado');
  // Erklärung nach dem Doppelpunkt fällt weg, kein Leerzeichen vor dem Komma
  assert.equal(run("gapMeaning('Los (der ONCE), Coupon')"), 'Los, Coupon');
  assert.equal(run("gapMeaning('Sameby: Gemeinschaft für die Rentierhaltung (en-Wort)')"), 'Sameby');
  // Feste Wendung: så fort = sobald, nicht „schnell“
  assert.equal(info('sv', 'Några älskar det, andra flyr så fort burken öppnas.', 'fort').mean, 'sobald');
  // lagar = Gesetze, nicht „kocht“
  assert.equal(info('sv', 'Redan 1766 fick Sverige en tryckfrihetsförordning, en av världens första lagar om pressfrihet.', 'lagar'), null);
  // la cocina = Küche, nicht „kocht“ (seit 24.60.0 mit eigenem Eintrag); se llama = heißt, nicht „ruft an“
  const coc = info('es', 'Según ellos, una cholita servía para la cocina, no para el cuadrilátero.', 'cocina');
  assert.ok(!coc || coc.mean === 'Küche', coc && coc.mean);
  const llama = info('es', 'El recipiente se llama mate.', 'llama');
  assert.ok(!llama || !/anrufen/.test(llama.mean));
  // Gebeugtes Verb: Grundform als zweiter Hinweis, Bedeutung der Grundform ohne Grammatik-Angabe
  const v = info('es', 'Muchos años después volvió a su pueblo.', 'volvió');
  assert.equal(v.lemma, 'volver'); assert.equal(v.verb, true); assert.ok(!/\(/.test(v.mean));
});

test('Aufgabe: Bedeutung oben, Anfangsbuchstabe als Platzhalter, Grundform als Tipp', () => {
  fresh('es', read('es', 'campoamor'));
  const ds = withSeed(3, () => run("Array.from({ length:40 }, () => GENS.textgap_es.make())"));
  for (const d of ds) {
    assert.ok(d.deLine && d.deLine === d.mean, d.full);
    assert.equal(d.ph, d.answers[0][0] + '…');
    assert.ok(!d.hint || /^Grundform: /.test(d.hint));
    assert.ok(!/beginnt mit/.test(d.hint));
    assert.ok(d.prompt.includes('___') && d.full.toLowerCase().includes(d.answers[0]));
  }
  assert.ok(ds.some(d => d.hint), 'gebeugte Wörter bekommen die Grundform');
});

test('nachgeschlagene Wörter: ab dem Tag danach zuerst, richtig an einem späteren Tag abgehakt, falsch oder am selben Tag nicht', () => {
  fresh('es', read('es', 'campoamor'));
  app.run("rememberLooked('es', 'campoamor', 'Diputada,'); rememberLooked('es', 'campoamor', 'y'); rememberLooked('es', 'wiki', '');");
  assert.deepEqual(run("DB.used.looked"), { 'es:campoamor':{ diputada:run('today()') } });
  // Am selben Tag noch nicht bevorzugt
  assert.ok(withSeed(5, () => run("Array.from({ length:30 }, () => GENS.textgap_es.make())")).every(d => !d.looked));
  app.run("DB.used.looked['es:campoamor'].diputada = '2026-01-01'");
  const d = withSeed(5, () => run('GENS.textgap_es.make()'));
  assert.equal(d.answers[0], 'diputada');
  assert.equal(d.label, 'Nachgeschlagen in „Clara Campoamor y el voto femenino“');
  assert.equal(d.ph, 'd…'); assert.match(d.deLine, /Abgeordnete/);
  assert.deepEqual(d.looked, { k:'es:campoamor', w:'diputada' });
  assert.equal(answer(d, 'directora').res, 'bad');
  assert.ok(run("DB.used.looked['es:campoamor'].diputada"), 'falsch: bleibt');
  assert.equal(answer(d, 'diputada').res, 'ok');
  assert.deepEqual(run('DB.used.looked'), {}, 'richtig an einem späteren Tag: abgehakt');
  app.run("rememberLooked('es', 'campoamor', 'diputada')");
  answer(d, 'diputada');
  assert.ok(run("DB.used.looked['es:campoamor'].diputada"), 'am selben Tag nachgeschlagen: bleibt');
});

test('nachgeschlagenes Wort ohne verwertbaren Eintrag: trotzdem Lücke, dann mit zwei Anfangsbuchstaben', () => {
  fresh('es');
  const d = run(`textGapData('es', 'Ayer vimos un zorgoplo en el campo de trigo.', 'Test', { prefer:new Set(['zorgoplo']), looked:{ k:'es:x', w:'zorgoplo' } })`);
  assert.equal(d.answers[0], 'zorgoplo'); assert.equal(d.ph, 'zo…'); assert.equal(d.deLine, ''); assert.deepEqual(d.looked, { k:'es:x', w:'zorgoplo' });
});

test('nachgeschlagen: höchstens 300 je Sprache, die ältesten fallen heraus; alte Stände ohne Feld laufen', () => {
  fresh('es', read('es', 'campoamor'));
  app.run('delete DB.used.looked');
  assert.ok(run('GENS.textgap_es.make().prompt'), 'Stand ohne das neue Feld');
  app.run(`DB.used.looked = { 'sv:vasa':{ skeppet:'2026-01-01' }, 'es:campoamor':{} };
    for (let i = 0; i < 305; i++) DB.used.looked['es:campoamor']['palabra' + String.fromCharCode(97 + (i % 26)) + String.fromCharCode(97 + Math.floor(i / 26))] = '2026-01-' + String(10 + (i % 20)).padStart(2, '0');
    rememberLooked('es', 'campoamor', 'abogada');`);
  const es = run("Object.keys(DB.used.looked['es:campoamor']).length");
  assert.equal(es, 300);
  assert.ok(run("DB.used.looked['es:campoamor'].abogada"), 'das neue Wort bleibt');
  assert.deepEqual(run("DB.used.looked['sv:vasa']"), { skeppet:'2026-01-01' }, 'andere Sprache unberührt');
});

test('Runde direkt nach dem Lesen: eben nachgeschlagene Wörter zuerst, acht Lücken', () => {
  fresh('es', read('es', 'campoamor'));
  app.run("S.text = { lang:'es', id:'campoamor', looked:['diputada'] }; startRun('textgap', { text:'campoamor' });");
  const q = run('S.run.queue.map(x => x.data)');
  assert.equal(q.length, 8);
  assert.equal(q[0].answers[0], 'diputada');
  assert.equal(q[0].label, 'Nachgeschlagen in „Clara Campoamor y el voto femenino“');
  assert.ok(!q[0].looked, 'direkt nach dem Lesen wird nichts abgehakt');
});

test('Rundenende: bei verpasster Lücke das Wort mit Bedeutung, nicht die Bedeutung als Übersetzung', () => {
  fresh('es', read('es', 'campoamor'));
  const d = withSeed(11, () => run('GENS.textgap_es.make()'));
  const { missed } = answer(d, 'zzz');
  assert.equal(missed[0].de, `${d.answers[0]} = ${d.mean}`);
});
