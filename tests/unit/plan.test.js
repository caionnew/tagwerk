// Tagwerk (24.54.0): Zeitschätzung aus dem eigenen Tempo, Themen gemischt statt in Blöcken, vorgelesen wird die angezeigte
// Lösung, Verbformen als ganze Sätze. Ohne Zufallsabhängigkeit: Geprüft werden Eigenschaften, die bei jedem Zufall gelten,
// oder der Zufall wird für den Test festgelegt.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
// Mit Stimmen, damit der Vorlese-Knopf im Rückmeldefeld erscheint
const app = loadApp({ voices:true });
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const T = run('today()'), ds = k => run(`addDays(today(), ${-k})`);
const blank = extra => Object.assign({ v:3, settings:{ size:'normal', lang:'es', niveau:'fort', langMode:'es' }, used:{}, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, focus:{} }, extra || {});
const setup = d => { app.setDB(d); run('buildBank(); S.lang = "es"; S.run = null; S.dailyRun = null;'); };

/* ---------- Zeitschätzung ---------- */
// Ein Tagwerk wie im Alltag: 14 Übersetzungen, 12 Lücken, 6 Grammatik-Aufgaben
const Q = JSON.stringify([...Array(14)].map(() => ({ type:'free' })).concat([...Array(12)].map(() => ({ type:'cloze' })), [...Array(6)].map(() => ({ type:'gen' }))));
const histLog = (n, secs, days) => Object.fromEntries([...Array(days)].map((_, k) => [ds(k + 1), { es:{ n, secs } }]));
test('Zeitschätzung ohne Daten: Richtwerte je Übungsart', () => {
  setup(blank());
  assert.equal(run(`minutes(${Q}, 'es')`), Math.round((14 * 45 + 12 * 25 + 6 * 20) * 1.1 / 60));
});
test('Zeitschätzung aus den letzten Übungstagen: 9 s je Aufgabe ergeben etwa 5 statt 19 Minuten', () => {
  setup(blank({ log:histLog(36, 330, 10) }));
  assert.equal(run(`minutes(${Q}, 'es')`), 5);
  // Lesen ohne Aufgaben, wenige Aufgaben und die andere Sprache zählen nicht; unter drei Tagen gelten die Richtwerte
  setup(blank({ log:Object.assign(histLog(36, 330, 2), { [ds(5)]:{ es:{ secs:900 } }, [ds(6)]:{ es:{ n:4, secs:400 } }, [ds(7)]:{ sv:{ n:30, secs:300 } } }) }));
  assert.equal(run(`minutes(${Q}, 'es')`), 19);
  // Heute zählt noch nicht (das Tagwerk läuft vielleicht gerade)
  setup(blank({ log:Object.assign(histLog(36, 330, 2), { [T]:{ es:{ n:36, secs:330 } } }) }));
  assert.equal(run(`minutes(${Q}, 'es')`), 19);
});
test('Eigenes Tempo je Übungsart: gemessene Werte zählen, fehlende Arten im selben Verhältnis', () => {
  setup(blank());
  run(`for (let i = 0; i < 12; i++) { notePace('es', 'gen', 6); notePace('es', 'cloze', 8); }`);
  // free ohne eigene Werte: 45 s × (6/20 + 8/25)/2 ≈ 14 s
  assert.equal(run(`minutes(${Q}, 'es')`), Math.round((14 * 45 * 0.31 + 12 * 8 + 6 * 6) * 1.1 / 60));
  assert.equal(run('minutes([{ type:"gen" }], "sv")'), 1, 'Schwedisch hat eigene Werte (hier keine)');
  // Pausen über zwei Minuten und 0 s zählen nicht; es bleiben die letzten 20
  run(`notePace('es', 'gen', 120); notePace('es', 'gen', 0); notePace('es', 'nix', 9); for (let i = 0; i < 25; i++) notePace('es', 'tiles', 10 + i);`);
  assert.equal(run('DB.pace.es.gen.length'), 12);
  assert.deepEqual(run('DB.pace.es.tiles'), [...Array(20)].map((_, i) => 15 + i));
  assert.equal(run('DB.pace.es.nix'), undefined);
});
test('Zeitschätzung übersteht kaputte Tempo-Daten', () => {
  setup(blank({ pace:{ es:{ gen:'x', cloze:[null, 'a', 5, 500], free:{} }, sv:7 } }));
  assert.equal(typeof run(`minutes(${Q}, 'es')`), 'number');
  run(`notePace('sv', 'gen', 9); notePace('es', 'gen', 9)`);
  assert.deepEqual(run('DB.pace.sv'), { gen:[9] });
  assert.deepEqual(run('DB.pace.es.gen'), [9]);
});
test('Tempo wird beim Weiter gemessen: erste Versuche ja, zweite Versuche nicht', () => {
  setup(blank());
  const data = { prompt:'Ayer él ___ ayuda.', answers:['pidió', 'él pidió'], gap:true, full:'Ayer él pidió ayuda.', label:'', hint:'', note:'' };
  run(`S.run = { kind:'form', lang:'es', queue:[{ type:'gen', gen:'conj', data:${JSON.stringify(data)} }, { type:'gen', gen:'conj', data:${JSON.stringify(data)}, requeue:true }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };`);
  run(`S.run.cur = { state:'answer', input:'pidió' }; check(); S.run.shownAt = Date.now() - 7000; next();`);
  assert.deepEqual(run('DB.pace.es.gen'), [7]);
  run(`S.run.cur = { state:'answer', input:'pidió' }; check(); S.run.shownAt = Date.now() - 4000; next();`);
  assert.deepEqual(run('DB.pace.es.gen'), [7], 'zweiter Versuch zählt nicht');
});
test('Backup: das Tempo kommt mit zurück, die Schätzung bleibt gleich; alte Backups ohne Tempo laufen', () => {
  setup(blank({ log:histLog(36, 330, 10) }));
  run(`for (let i = 0; i < 12; i++) { notePace('es', 'free', 15); notePace('es', 'gen', 6); }`);
  const before = run(`minutes(${Q}, 'es')`), text = app.run('backupText()');
  run('DB = freshDB(); S.run = null; S.dailyRun = null;');
  assert.notEqual(run(`minutes(${Q}, 'es')`), before);
  run(`applyBackup(parseBackup(${JSON.stringify(text)}))`);
  assert.deepEqual(run('DB.pace'), JSON.parse(text).pace);
  assert.equal(run(`minutes(${Q}, 'es')`), before);
  // Vor 24.54.0: kein DB.pace. Schätzung aus dem Verlauf, danach wird gemessen
  run(`applyBackup(parseBackup(${JSON.stringify(JSON.stringify(blank({ log:histLog(36, 330, 10) })))}))`);
  assert.equal(run('DB.pace'), undefined);
  assert.equal(run(`minutes(${Q}, 'es')`), 5);
  run(`notePace('es', 'gen', 6)`);
  assert.deepEqual(run('DB.pace'), { es:{ gen:[6] } });
});

/* ---------- Reihenfolge und Themenmix ---------- */
const BANK = app.get('BANK');
// 16 fällige Sätze zum Konditional, 10 aus anderen Themen, weitere gefestigt
function mixDB(condDue){
  const d = blank();
  let nc = 0, no = 0;
  BANK.es.forEach(i => {
    if (i.trap === 'condicional' && nc < 16) { nc++; d.st[i.id] = { s:3, d:5, ivl:3, last:ds(3), due:condDue, reps:2, ok:2, bad:0, alts:[] }; }
    else if (i.trap !== 'condicional' && no < 80) { no++; d.st[i.id] = { s:10, d:5, ivl:10, last:ds(10), due:no % 8 === 0 ? T : ds(-5), reps:3, ok:3, bad:0, alts:[] }; }
  });
  return d;
}
const plan = () => run(`(() => { const p = dailyPlan('es'); return { due:p.due, fresh:p.fresh, q:p.queue.map(ex => ({ k:taskTopic(ex), rev:!!(ex.id && stOf(ex.id)), id:ex.id || null, gen:ex.gen || null })) }; })()`);
test('Tagwerk: höchstens 5 Wiederholungen und 2 neue Sätze je Thema, Einstieg mit einer Wiederholung', () => {
  setup(mixDB(T));
  for (let k = 0; k < 150; k++) {
    const p = plan(), n = {}, nNew = {};
    p.q.forEach(x => { if (x.rev) n[x.k] = (n[x.k] || 0) + 1; else if (x.id) nNew[x.k] = (nNew[x.k] || 0) + 1; });
    assert.equal(n.condicional, 5, JSON.stringify(n));
    assert.ok(Object.values(n).every(v => v <= 5));
    assert.ok(Object.values(nNew).every(v => v <= 2), 'höchstens zwei neue Sätze je Thema: ' + JSON.stringify(nNew));
    assert.ok(p.q[0].rev, 'zuerst eine Wiederholung');
    assert.equal(p.due, 15); assert.equal(p.fresh, 6);
  }
});
// Zufall von außen festlegen: feste Zahl (Math.random = () => x) oder feste Folge (LCG), danach wieder der echte
const withRandom = (rnd, code) => run(`(() => { const orig = Math.random; Math.random = ${rnd}; try { return ${code}; } finally { Math.random = orig; } })()`);
const LCG = '(() => { let s = 12345; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; })()';
test('Reihenfolge: dasselbe Thema direkt danach nur mit halbem Gewicht, aber nie ausgeschlossen (wie die Fehlerarten bei „Fehler finden“)', () => {
  setup(blank());
  const cond = BANK.es.filter(i => i.trap === 'condicional').slice(0, 2).map(i => i.id), other = BANK.es.find(i => i.trap === 'pasado').id;
  run(`DB.st[${JSON.stringify(cond[0])}] = { s:3, d:5, ivl:3, last:'${ds(3)}', due:'${T}', reps:2, ok:2, bad:0, alts:[] }`);
  const tasks = JSON.stringify([{ type:'free', id:cond[0] }, { type:'cloze', id:cond[1] }, { type:'cloze', id:other }]);
  const order = x => withRandom(`() => ${x}`, `spreadTopics(${tasks}).map(ex => ex.id)`);
  // Nach der Wiederholung (Konditional) stehen Konditional (Gewicht ½) und Indefinido (Gewicht 1) zur Wahl: ½ von 1,5 = ein Drittel
  assert.deepEqual(order(0.33), [cond[0], cond[1], other], 'gleiches Thema bleibt möglich');
  assert.deepEqual(order(0.34), [cond[0], other, cond[1]]);
  assert.equal(app.get('REPEAT_DAMP'), 0.5);
});
test('Reihenfolge über viele Tagwerke: deutlich weniger direkte Wiederholungen als reiner Zufall, aber nicht keine', () => {
  setup(mixDB(T));
  const res = withRandom(LCG, `(() => { let adj = 0, exp = 0; const N = 400; for (let k = 0; k < N; k++) {
    const keys = dailyPlan('es').queue.map(taskTopic), c = {};
    keys.forEach((x, i) => { c[x] = (c[x] || 0) + 1; if (i && x === keys[i - 1]) adj++; });
    exp += Object.values(c).reduce((a, n) => a + n * (n - 1), 0) / keys.length;
  } return { adj:adj / N, exp:exp / N }; })()`);
  // Reiner Zufall ergäbe im Mittel Σ n·(n−1)/Länge direkte Wiederholungen je Tagwerk (hier gut 2); mit halbem Gewicht gut die Hälfte
  assert.ok(res.adj > 0.3 * res.exp && res.adj < 0.75 * res.exp, JSON.stringify(res));
});
test('Zurückgestellte Wiederholungen bleiben fällig; zwei Tage überfällig kommen sie auch über die Grenze, solange Platz ist', () => {
  setup(mixDB(T));
  assert.equal(run('dueItems("es").length'), 26, 'nichts verschwindet, die übrigen elf kommen morgen zuerst');
  setup(mixDB(ds(2)));
  const p = plan(), cond = p.q.filter(x => x.rev && x.k === 'condicional').length;
  assert.equal(p.due, 20); assert.equal(cond, 10, 'fünf über die Grenze, bis die 20 Plätze voll sind');
  // Wenige fällige: alle kommen
  const d = mixDB(ds(-3)); Object.keys(d.st).filter(id => BANK.es.find(i => i.id === id).trap === 'condicional').slice(0, 4).forEach(id => { d.st[id].due = T; });
  setup(d);
  assert.equal(plan().q.filter(x => x.rev && x.k === 'condicional').length, 4);
});
/* ---------- Vorlesen = angezeigte Lösung ---------- */
app.run('speak = (t) => { globalThis.__said.push(t); }');
app.run('globalThis.__said = []');
const lastSaid = () => { const a = app.run('globalThis.__said'); return a[a.length - 1]; };
function answer(lang, ex, input){
  run(`(() => { DB.settings.autoplay = true; S.run = { kind:'form', lang:'${lang}', queue:[${JSON.stringify(ex)}], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 }; S.run.cur = { state:'answer', input:${JSON.stringify(input)} }; check(); })()`);
  return { c:run('S.run.cur'), fb:app.run('feedbackHtml(S.run, S.run.queue[0], S.run.cur)') };
}
const btnText = fb => [...fb.matchAll(/data-a="speak" data-lang="\w+" data-text="([^"]*)"/g)].map(m => m[1]);
test('Lücke fast richtig (Akzent fehlt): vorgelesen wird der ganze Satz, nicht nur die Lücke', () => {
  setup(blank());
  const ex = { type:'gen', gen:'conj', data:{ prompt:'Ayer él ___ ayuda.', answers:['pidió', 'él pidió'], gap:true, full:'Ayer él pidió ayuda.', label:'', hint:'', note:'' } };
  for (const input of ['pidio', 'él pidio']) {
    const { c, fb } = answer('es', ex, input);
    assert.equal(c.result, 'near', input);
    assert.equal(lastSaid(), 'Ayer él pidió ayuda.', input);
    assert.deepEqual(btnText(fb), ['Ayer él pidió ayuda.']);
  }
  answer('es', ex, 'pedía');
  assert.equal(lastSaid(), 'Ayer él pidió ayuda.', 'falsch: ebenfalls der ganze Satz');
});
test('Zahl oder Uhrzeit in Worten: Lösung als ganzer Satz mit dem Gesuchten fett, Knopf und Automatik lesen denselben Satz', () => {
  setup(blank());
  const ex = { type:'gen', gen:'time_sv', data:{ kind:'time', mode:'write', num:75, cur:'kronor', answers:['sjuttiofem', 'sjuttio fem', 'sjuttiofem kronor'], full:'Det kostar sjuttiofem kronor.', note:'', label:'', trap:'zahl' } };
  const { fb } = answer('sv', ex, 'sjutiofem');
  assert.match(fb, /75 kr = Det kostar <b>sjuttiofem<\/b> kronor\./);
  assert.deepEqual(btnText(fb), ['Det kostar sjuttiofem kronor.'], 'vorher las der Knopf nichts vor');
  assert.equal(lastSaid(), 'Det kostar sjuttiofem kronor.');
  const clock = { type:'gen', gen:'time_es', data:{ kind:'time', mode:'read', say:'Son las tres y media.', clock:'3:30', h:3, m:30, answers:['3:30'], full:'Son las tres y media.', note:'', label:'', trap:'zeit' } };
  const r = answer('es', clock, '3.30');
  assert.match(r.fb, /Son las tres y media = 3:30/);
  assert.equal(lastSaid(), 'Son las tres y media.');
});
test('Satzbank: Steht deine nächstliegende Fassung da, wird sie vorgelesen; sonst der Satz (mit Aufnahme, wenn es eine gibt)', () => {
  setup(blank());
  // Ein Satz, dessen Alternative mit einem fehlenden Akzent deiner Antwort am nächsten liegt
  const typoOf = a => a.replace(/[áéíóú]/, ch => ch.normalize('NFD')[0]);
  const item = BANK.es.find(i => (i.alts || []).some(a => /[áéíóú]/.test(a) && a !== i.target && run(`closest(${JSON.stringify(typoOf(a))}, answersFor({ type:'free', id:${JSON.stringify(i.id)} }), 'es')`) === a));
  const alt = item.alts.find(a => /[áéíóú]/.test(a)), typo = typoOf(alt);
  run(`DB.st[${JSON.stringify(item.id)}] = { s:5, d:5, ivl:5, last:'${ds(5)}', due:'${T}', reps:3, ok:3, bad:0, alts:[] }`);
  const r = answer('es', { type:'free', id:item.id }, typo);
  assert.equal(r.c.result, 'near');
  assert.equal(lastSaid(), alt);
  assert.deepEqual(btnText(r.fb), [alt]);
  answer('es', { type:'free', id:item.id }, item.target);
  assert.equal(lastSaid(), item.target);
});

/* ---------- Verbformen als ganze Sätze ---------- */
test('Verbformen: jede Verbform steht in einem ganzen Satz mit Ergänzung, groß geschrieben, mit Punkt, jedes Wort nachschlagbar', () => {
  const sents = run(`(() => { const out = []; Object.keys(IRR_ES).concat(REG_ES.map(r => r[0])).forEach(inf => TENSES_ES.forEach(t => PERS.forEach(p => {
    const c = conjComp(inf, p[1], t.id); out.push({ inf, t:t.id, c:c || '', s:(t.frame(p[0]) + ' ' + c + '.').replace('___', conjugate(inf, t.id, p[1])) }); }))); return out; })()`);
  assert.equal(sents.length, (Object.keys(app.get('IRR_ES')).length + app.get('REG_ES').length) * 4 * 8);
  for (const x of sents) {
    assert.ok(x.c, `${x.inf}: keine Ergänzung`);
    assert.match(x.s, /^[A-Z][^_]+ \S+\.$/, x.s);
  }
  const lookupWord = app.get('lookupWord'), tokens = app.get('tokens');
  const miss = new Set(); sents.forEach(x => tokens(x.s).forEach(w => { if (/[a-zá-ú]/i.test(w) && !lookupWord('es', w)) miss.add(w); }));
  assert.deepEqual([...miss], []);
  assert.equal(sents.find(x => x.inf === 'ser' && x.t === 'indef' && x.s.startsWith('Ayer ellas')).s, 'Ayer ellas fueron puntuales.');
  assert.equal(sents.find(x => x.inf === 'estar' && x.t === 'indef' && x.s.startsWith('Ayer ellas')).s, 'Ayer ellas estuvieron en casa.');
  assert.equal(sents.find(x => x.inf === 'pedir' && x.t === 'subj' && x.s.includes(' él ')).s, 'Es importante que él pida ayuda.');
});
test('Verbformen: Der Generator baut ganze Sätze, vivir nie mit „ayer“; ser oder estar am Satzanfang groß', () => {
  for (let k = 0; k < 400; k++) {
    const d = run('GENS.conj.make()');
    assert.match(d.full, /^[A-Z].+\.$/, d.full);
    assert.equal(d.full, d.prompt.replace('___', d.answers[0]));
    assert.ok(!/^Ayer \S+ viv/.test(d.full), d.full);
    const s = run('GENS.serestar.make()');
    assert.match(s.full, /^[A-ZÁÉÍÓÚ¿¡]/, s.full);
  }
});
