// Rückmeldung nach dem Prüfen (24.77): Fälle aus den Screenshots vom 25.11. Gleichwertige Wörter beim Übersetzen, Formfehler ohne
// doppelte Bedeutung, zweiter Versuch prüft den Fehler, LanguageTool ohne Fund neutral, Lücken ohne wiederholten Satz,
// beantwortete Aufgabe im offenen Tagwerk gespeichert.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
// Mit Stimme: Der Knopf zum Vorlesen gehört zur Rückmeldung
const app = loadApp({ voices:true });
app.run('buildBank()');
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/ ([.,:])/g, '$1').trim();
const item = (lang, target) => app.get('BANK')[lang].find(i => i.target === target);
const SITZUNG = item('es', 'La reunión se puso tensa cuando salió el tema de los sueldos.');
const JAHRE = item('sv', 'Jag har inte sett dig på flera år!');
// Eine Aufgabe beantworten (kind wie im Tagwerk oder eine andere Runde); danach Weiter, die nächste Aufgabe ist der zweite Versuch
const answer = (it, type, input, kind = 'quick') => run(`(() => { DB = freshDB(); const ex = { type:${JSON.stringify(type)}, id:${JSON.stringify(it.id)} };
  S.run = { kind:${JSON.stringify(kind)}, lang:${JSON.stringify(it.lang)}, queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
  S.run.cur = { input:${JSON.stringify(input)}, state:'answer' }; check(); const c = S.run.cur;
  const out = { result:c.result, best:c.best || null, keyOk:c.keyOk || null, form:c.form || null, fb:feedbackHtml(S.run, ex, c), task:viewRun() };
  next(); const again = S.run.queue[S.run.idx]; out.again = again ? again.type : null; return out; })()`);

test('Fall aus dem Screenshot: „sesión“ und „surgió“ gelten, nur „tenso“ ist falsch', () => {
  const a = answer(SITZUNG, 'free', 'La sesión se puso tenso cuando surgió el tema de los sueldos');
  assert.equal(a.result, 'bad');
  assert.equal(a.best, 'La sesión se puso tensa cuando surgió el tema de los sueldos.', 'Lösung in deinen Wörtern');
  // In der Lösung markiert ist nur noch tensa (vorher auch reunión und salió)
  assert.deepEqual([...a.fb.matchAll(/class="w-(?:near|miss)"[^>]*>([^<]+)</g)].map(m => m[1]), ['tensa']);
  for (const v of ['La sesión se puso tensa cuando surgió el tema de los sueldos.', 'La reunión se puso tensa cuando surgió el tema de los salarios.', 'La sesión se puso tensa cuando salió el tema de los salarios.'])
    assert.equal(answer(SITZUNG, 'free', v).result, 'ok', v);
});

test('Formfehler mit gleicher Bedeutung: Bedeutung einmal, dazu Geschlecht und Zahl (vorher zweimal „angespannt“)', () => {
  const a = answer(SITZUNG, 'free', 'La sesión se puso tenso cuando surgió el tema de los sueldos');
  assert.equal(a.form, '„tenso“ ist die männliche Form (angespannt), hier braucht es die weibliche Form: „tensa“');
  assert.match(text(a.fb), /Der knifflige Teil stimmt: „se puso“\. Aber „tenso“ ist die männliche Form \(angespannt\), hier braucht es die weibliche Form: „tensa“\./);
  assert.doesNotMatch(text(a.fb), /angespannt.*angespannt/);
  assert.equal(run(`formWhy('es', [['pálido', 'pálida']])`), '„pálido“ ist die männliche Form (blass), hier braucht es die weibliche Form: „pálida“');
  // Verschiedene Bedeutungen bleiben, wie sie waren
  assert.equal(run(`formWhy('sv', [['stor', 'stort']])`), '„stor“ ist die Grundform (groß), hier braucht es „stort“ (groß, bei ett-Wörtern)');
  assert.equal(run(`formWhy('sv', [['arbeta', 'arbetar']])`), '„arbeta“ ist die Grundform (arbeiten), hier braucht es „arbetar“ (arbeitet)');
  assert.deepEqual(run(`[esGenderNum('tenso', 'tensas'), esGenderNum('casa', 'caso') && 1, esGenderNum('este', 'esta')]`), [['männliche Form', 'weibliche Mehrzahl'], 1, null]);
});

test('Zweiter Versuch: Stimmte die Lücke schon, kommt der ganze Satz noch einmal; sonst wie bisher die Lücke', () => {
  // Fehler woanders: Die Lücke („se puso“) prüfte nichts, „tensa“ stünde schon da
  assert.equal(answer(SITZUNG, 'free', 'La sesión se puso tenso cuando surgió el tema de los sueldos').again, 'free');
  // Fehler in der Lücke selbst
  assert.equal(answer(SITZUNG, 'free', 'La reunión se volvió tensa cuando salió el tema de los sueldos').again, 'cloze');
  // Lücke falsch beantwortet
  assert.equal(answer(SITZUNG, 'cloze', 'se volvió').again, 'cloze');
  // Aufgegeben: Lücke
  const g = run(`(() => { DB = freshDB(); const ex = { type:'free', id:${JSON.stringify(SITZUNG.id)} }; S.run = { kind:'quick', lang:'es', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 };
    S.run.cur = { input:'', state:'answer' }; giveUp(); next(); return S.run.queue[S.run.idx].type; })()`);
  assert.equal(g, 'cloze');
  // Der zweite Versuch zählt nicht als eigene Aufgabe und wird nicht ein drittes Mal angehängt
  const two = run(`(() => { S.run.cur = { input:'zzz', state:'answer' }; check(); next(); return { n:S.run.queue.length, res:S.run.res.length }; })()`);
  assert.deepEqual(two, { n:2, res:1 });
});

test('LanguageTool ohne Fund: neutral statt grün, mit Quelle', () => {
  const fb = run(`(() => { DB = freshDB(); const ex = { type:'free', id:${JSON.stringify(SITZUNG.id)} }; S.run = { kind:'quick', lang:'es', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 };
    S.run.cur = { input:'La sesión se puso tenso cuando surgió el tema de los sueldos', state:'answer' }; check(); S.run.cur.lt = []; return feedbackHtml(S.run, ex, S.run.cur); })()`);
  assert.doesNotMatch(fb, /lt-ok|Keine Fehler gefunden/);
  assert.match(text(fb), /LanguageTool hat nichts gefunden\. Geprüft von LanguageTool\./);
});

test('Lücke: Der Satz steht nach dem Prüfen nur oben (antippbar), in der Rückmeldung nur der Knopf zum Vorlesen', () => {
  for (const [input, result] of [['på flera år', 'ok'], ['i flera år', 'bad']]) {
    const a = answer(JAHRE, 'cloze', input);
    assert.equal(a.result, result);
    assert.doesNotMatch(a.fb, /class="sol"/, 'kein wiederholter Satz');
    assert.match(a.fb, /<div class="vrow"><div class="vrow-l">.*<\/div><button[^>]*data-a="speak"[^>]*data-text="Jag har inte sett dig på flera år!"/);
    // Oben: jedes Wort nachschlagbar, auch die Lösung in der Lücke; die falsche Antwort nicht
    const cloze = a.task.match(/<p class="cloze"[^>]*>(.*?)<\/p>/)[1];
    assert.deepEqual([...cloze.matchAll(/data-w="([^"]+)"/g)].map(m => m[1]), ['Jag', 'har', 'inte', 'sett', 'dig', 'på', 'flera', 'år']);
    assert.equal(cloze.replace(/<[^>]+>/g, '').replace(/\s+/g, ' '), result === 'ok' ? 'Jag har inte sett dig på flera år!' : 'Jag har inte sett dig i flera år på flera år!');
  }
  // Vor dem Prüfen: Eingabefeld, keine Links im Satz
  const before = run(`(() => { S.run = { kind:'quick', lang:'sv', queue:[{ type:'cloze', id:${JSON.stringify(JAHRE.id)} }], idx:0, ok:0, bad:0, res:[] }; prepCur(); return viewRun(); })()`);
  assert.doesNotMatch(before.match(/<p class="cloze"[^>]*>(.*?)<\/p>/s)[1], /data-a="lookup"/);
  // Übersetzen: der Lösungssatz bleibt in der Rückmeldung (oben steht deine Antwort)
  assert.match(answer(SITZUNG, 'free', 'zzz').fb, /class="sol"/);
});

test('Pause nach der Antwort: Die Rückmeldung wird mit dem Tagwerk gespeichert und kommt nach einem Neustart zurück', () => {
  const t = run('today()');
  run(`(() => { DB = freshDB(); const ex = { type:'cloze', id:${JSON.stringify(JAHRE.id)} }, ex2 = { type:'cloze', id:${JSON.stringify(SITZUNG.id)} };
    S.run = { kind:'daily', lang:'sv', queue:[ex, ex2], idx:0, ok:0, bad:0, res:[], combo:0, best:0, secs:0 }; S.view = 'run'; prepCur();
    S.run.shownAt = Date.now() - 7000; S.run.cur.input = 'på flera år'; check(); })()`);
  const saved = run('DB.run');
  assert.equal(saved.idx, 0);
  assert.equal(saved.cur.state, 'done');
  assert.equal(saved.cur.result, 'ok');
  assert.equal(saved.cur.input, 'på flera år');
  assert.equal(saved.cur.took, 7, 'Bedenkzeit bis zur Antwort');
  assert.equal(saved.cur.enter, false);
  // Gezählt ist noch nichts: erst mit „Weiter“
  assert.equal(run(`DB.st[${JSON.stringify(JAHRE.id)}]`), undefined);
  assert.equal(run(`(DB.log[${JSON.stringify(t)}] || {}).sv`), undefined);
  // Neustart: aus dem Speicher, „Fortsetzen“ zeigt die Rückmeldung statt derselben Frage
  run(`DB = JSON.parse(JSON.stringify(DB)); runsFromDB(); resumeDaily();`);
  assert.equal(run('S.run.cur.state'), 'done');
  assert.match(text(run('viewRun()')), /Richtig/);
  run('next()');
  assert.equal(run('S.run.idx'), 1);
  assert.deepEqual(run(`[DB.log[${JSON.stringify(t)}].sv.n, DB.log[${JSON.stringify(t)}].sv.secs, DB.st[${JSON.stringify(JAHRE.id)}].ok]`), [1, 7, 1], 'einmal gezählt, mit der Zeit bis zur Antwort');
  assert.equal(run('DB.run.cur'), undefined, 'die nächste Aufgabe ist noch offen');
});

test('Gespeicherte Rückmeldung: falsche Antwort mit „Meine ist auch richtig“ nach dem Neustart, LanguageTool unterwegs, alte und kaputte Stände', () => {
  run(`(() => { DB = freshDB(); const ex = { type:'free', id:${JSON.stringify(SITZUNG.id)} };
    S.run = { kind:'daily', lang:'es', queue:[ex, { type:'cloze', id:${JSON.stringify(JAHRE.id)} }], idx:0, ok:0, bad:0, res:[], combo:0, best:0, secs:0 }; prepCur();
    S.run.cur.input = 'La sesión se puso tenso cuando surgió el tema de los sueldos'; check(); S.run.cur.lt = 'loading'; persistRun(); })()`);
  assert.equal(run('DB.run.cur.result'), 'bad');
  assert.equal(run('"lt" in DB.run.cur'), false, 'eine laufende Prüfung wird nicht gespeichert');
  run('DB = JSON.parse(JSON.stringify(DB)); runsFromDB(); resumeDaily();');
  const v = run('viewRun()');
  assert.match(v, /data-a="accept"/);
  assert.match(v, /data-a="ltfree"/, 'LanguageTool lässt sich neu starten');
  run('selfAccept()');
  assert.deepEqual(run(`DB.st[${JSON.stringify(SITZUNG.id)}].alts`), ['La sesión se puso tenso cuando surgió el tema de los sueldos']);
  assert.equal(run('S.run.ok'), 1);
  // Ohne cur (Stand vor 24.77) oder mit unvollständigem: dieselbe Aufgabe neu, wie bisher
  for (const cur of [undefined, { state:'answer', input:'x' }, { state:'done' }, 'kaputt']) {
    run(`DB.run = { date:today(), lang:'sv', queue:[{ type:'cloze', id:${JSON.stringify(JAHRE.id)} }], idx:0, ok:0, bad:0, res:[], cur:${JSON.stringify(cur === undefined ? null : cur)} }; runsFromDB();`);
    assert.equal(run('S.dailyRun.cur'), null, JSON.stringify(cur));
  }
});

// 26.11., Screenshot „te acostumbras“ (Thema üben, richtig): Die Karte war darunter leer, oben stand deine Fassung, vorgelesen wurde
// die Hauptlösung. Seit 24.78: „Auch richtig“ mit der Hauptlösung, vorgelesen wird, was oben steht.
const COSTUMBRE = item('es', 'Con el tiempo te acostumbrarás al ritmo de la ciudad.');
const speakTexts = fb => [...fb.matchAll(/data-a="speak" data-lang="\w+" data-text="([^"]*)"/g)].map(m => m[1]);
test('Lücke richtig mit einer Alternative: „Auch richtig“ mit der Hauptlösung, vorgelesen wird deine Fassung', () => {
  const a = answer(COSTUMBRE, 'cloze', 'te acostumbras', 'trap');
  assert.equal(a.result, 'ok');
  assert.match(a.task, /<span class="gapdone ok" lang="es">.*acostumbras/);
  assert.match(text(a.fb), /^Richtig [^.]*wieder Auch richtig: te acostumbrarás( Tipp|$)/);
  assert.match(a.fb, /<p class="legend also">Auch richtig: <span lang="es"><span data-a="lookup" data-w="te">te<\/span> <span data-a="lookup" data-w="acostumbrarás">acostumbrarás<\/span><\/span><\/p>/);
  assert.deepEqual(speakTexts(a.fb), ['Con el tiempo te acostumbras al ritmo de la ciudad.']);
  // Mit der Hauptlösung (auch klein oder mit Satzzeichen) keine Zeile, vorgelesen wird der Satz der Satzbank
  for (const input of ['te acostumbrarás', 'Te acostumbrarás.']) {
    const b = answer(COSTUMBRE, 'cloze', input, 'trap');
    assert.equal(b.result, 'ok', input);
    assert.doesNotMatch(b.fb, /Auch richtig/, input);
    assert.deepEqual(speakTexts(b.fb), [COSTUMBRE.target], input);
  }
  // Falsch oder fast richtig: wie bisher, die Lösung steht oben in der Lücke
  assert.doesNotMatch(answer(COSTUMBRE, 'cloze', 'te acostumbre', 'trap').fb, /Auch richtig/);
  assert.doesNotMatch(answer(COSTUMBRE, 'cloze', 'te acostumbraras', 'trap').fb, /Auch richtig/);
  // Übersetzen: Die Hauptlösung steht ohnehin als Lösungssatz da
  const f = answer(COSTUMBRE, 'free', 'Con el tiempo te acostumbras al ritmo de la ciudad.', 'trap');
  assert.equal(f.result, 'ok'); assert.doesNotMatch(f.fb, /Auch richtig/); assert.match(f.fb, /class="sol"/);
});
