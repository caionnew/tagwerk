// Backup und Wiederherstellung mit offenem Tagwerk: Ergebnis je Aufgabe (got), zweite Versuche, alte Backups ohne got.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const segs = () => [...app.run('progressBar(S.dailyRun)').matchAll(/<i class="seg([^"]*)"/g)].map(m => m[1].trim());
const ids = () => run(`BANK.sv.filter(i => i.gap).slice(0, 3).map(i => i.id)`);

// Stand mit offenem Tagwerk von heute: zwei beantwortet (richtig, falsch), einer offen, ein zweiter Versuch angehängt
const withRun = (queue, extra = {}) => ({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, log:{}, done:{}, gen:{},
  run:Object.assign({ date:run('today()'), lang:'sv', queue, idx:2, ok:1, bad:1, res:[{ good:true, id:queue[0].id }, { good:false, id:queue[1].id }], missed:[], secs:30, combo:0, best:1 }, extra) });

test('Backup mit offenem Tagwerk: Ergebnisse und zweiter Versuch kommen zurück, die Leiste zeigt sie', () => {
  const [a, b, c] = ids();
  const db = withRun([{ type:'cloze', id:a, got:'ok' }, { type:'cloze', id:b, got:'bad' }, { type:'cloze', id:c }, { type:'cloze', id:b, requeue:true }]);
  app.setDB(db);
  const text = app.run('backupText()');
  // In der laufenden App ist noch ein anderes Tagwerk offen (Stand vor dem Einspielen)
  run(`DB = freshDB(); S.dailyRun = { kind:'daily', lang:'sv', queue:[{ type:'gen', gen:'inte' }], idx:0, ok:0, bad:0, res:[], cur:null }; S.run = S.dailyRun;`);
  run(`applyBackup(parseBackup(${JSON.stringify(text)}))`);
  assert.equal(run('S.run'), null);
  assert.deepEqual(run('S.dailyRun.queue.map(e => [e.got || null, !!e.requeue])'), [['ok', false], ['bad', false], [null, false], [null, true]]);
  assert.equal(run('S.dailyRun.idx'), 2);
  assert.equal(run('S.dailyRun.queue === DB.run.queue'), true, 'Tagwerk und Speicher teilen sich die Aufgaben');
  run('S.dailyRun.cur = { state:"answer" }');
  assert.deepEqual(segs(), ['s-ok', 's-bad', 's-cur', 're re1']);
});
test('Nach dem Einspielen gilt die Sprache des Tages aus dem Backup, nicht die vorher gewählte', () => {
  const [a] = run(`BANK.es.filter(i => i.gap).slice(0, 1).map(i => i.id)`);
  const db = { v:3, settings:{ size:'normal', lang:'es' }, st:{}, log:{}, done:{}, gen:{}, dayLang:{ d:run('today()'), l:'es' },
    run:{ date:run('today()'), lang:'es', queue:[{ type:'cloze', id:a }], idx:0, ok:0, bad:0, res:[], secs:0, combo:0, best:0 } };
  run(`DB = freshDB(); S.lang = 'sv'; S.run = null; S.dailyRun = null;`);
  run(`applyBackup(parseBackup(${JSON.stringify(JSON.stringify(db))}))`);
  assert.equal(run('S.lang'), 'es');
  assert.equal(run('S.dailyRun.lang'), 'es');
});
test('Backup ohne offenes Tagwerk schließt ein vorher offenes', () => {
  run(`S.dailyRun = { kind:'daily', lang:'sv', queue:[{ type:'gen', gen:'inte' }], idx:0, ok:0, bad:0, res:[], cur:null }; S.run = S.dailyRun;`);
  run(`applyBackup(parseBackup(JSON.stringify({ v:3, st:{}, log:{}, done:{} })))`);
  assert.equal(run('S.dailyRun'), null); assert.equal(run('S.run'), null);
});
test('Tagwerk von einem anderen Tag im Backup wird nicht fortgesetzt', () => {
  const [a, b, c] = ids();
  const db = withRun([{ type:'cloze', id:a, got:'ok' }, { type:'cloze', id:b, got:'bad' }, { type:'cloze', id:c }], { date:'2020-01-01' });
  run(`applyBackup(parseBackup(${JSON.stringify(JSON.stringify(db))}))`);
  assert.equal(run('S.dailyRun'), null); assert.equal(run('DB.run'), null);
});
test('Backup aus der Zeit vor 24.34.0 (Tagwerk ohne got): Farben kommen aus dem Rundenergebnis', () => {
  const [a, b, c] = ids();
  const db = withRun([{ type:'cloze', id:a }, { type:'cloze', id:b }, { type:'cloze', id:c }, { type:'cloze', id:b, requeue:true }]);
  run(`applyBackup(parseBackup(${JSON.stringify(JSON.stringify(db))}))`);
  run('S.dailyRun.cur = { state:"answer" }');
  assert.deepEqual(segs(), ['s-ok', 's-bad', 's-cur', 're re1']);
});

// Lesetext-Lücken (24.52.0): gelesene Texte, nachgeschlagene Wörter und eine offene Lücke im Tagwerk überstehen Backup und Einspielen
test('Backup: nachgeschlagene Wörter und gelesene Texte kommen zurück und wirken danach wie vorher', () => {
  const lk = { k:'es:campoamor', w:'diputada' };
  const db = { v:3, settings:{ size:'normal', lang:'es', niveau:'fort' }, st:{}, log:{}, done:{}, gen:{},
    used:{ texts:{ 'es:campoamor':{ best:3, n:1, last:'2026-01-01' } }, looked:{ 'es:campoamor':{ diputada:'2026-01-01' }, 'sv:vasa':{ krigsskeppet:'2026-01-02' } } },
    run:{ date:run('today()'), lang:'es', idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0,
      queue:[{ type:'gen', gen:'textgap_es', data:{ prompt:'Una de ellas era Clara Campoamor, abogada madrileña de 43 años y ___ del Partido Radical.', answers:['diputada'], label:'Nachgeschlagen in „Clara Campoamor y el voto femenino“', deLine:'', mean:'', hint:'', ph:'di…', gap:true, full:'Una de ellas era Clara Campoamor, abogada madrileña de 43 años y diputada del Partido Radical.', note:'', looked:lk } }] } };
  app.setDB(db);
  const text = app.run('backupText()');
  run('DB = freshDB(); S.run = null; S.dailyRun = null;');
  run(`applyBackup(parseBackup(${JSON.stringify(text)}))`);
  assert.deepEqual(run('DB.used.looked'), db.used.looked);
  assert.deepEqual(run('DB.used.texts'), db.used.texts);
  assert.deepEqual(run('S.dailyRun.queue[0].data.looked'), lk, 'offene Lücke im Tagwerk mit Merker');
  // Danach wie vorher: Lücke aus dem gelesenen Text, das nachgeschlagene Wort zuerst; richtig beantwortet ist es abgehakt
  run("S.lang = 'es'; DB.used.genRecent = {};");
  assert.equal(run('GENS.textgap_es.make().answers[0]'), 'diputada');
  run(`(() => { S.run = S.dailyRun; S.run.cur = { state:'answer', input:'diputada' }; check(); next(); })()`);
  assert.deepEqual(run('DB.used.looked'), { 'sv:vasa':{ krigsskeppet:'2026-01-02' } });
  // Und das Backup danach enthält den neuen Stand
  assert.deepEqual(JSON.parse(app.run('backupText()')).used.looked, { 'sv:vasa':{ krigsskeppet:'2026-01-02' } });
});
test('Backup aus der Zeit vor 24.52.0 (ohne gelesene Texte und Nachgeschlagenes): läuft, merkt sich danach Neues', () => {
  run('S.run = null; S.dailyRun = null;');
  run(`applyBackup(parseBackup(JSON.stringify({ v:3, settings:{ lang:'es' }, st:{}, log:{}, done:{} })))`);
  assert.deepEqual(run('DB.used'), {});
  assert.equal(run("genIds('es').includes('textgap_es')"), false, 'ohne gelesenen Text keine Lesetext-Lücke');
  run("rememberLooked('es', 'campoamor', 'diputada')");
  assert.deepEqual(run("Object.keys(DB.used.looked['es:campoamor'])"), ['diputada']);
  run(`applyBackup(parseBackup(JSON.stringify({ v:3, settings:{ lang:'es' }, st:{}, log:{}, done:{}, used:{ texts:{ 'es:campoamor':{ best:2, n:1 } } } })))`);
  assert.equal(run("genIds('es').includes('textgap_es')"), true);
  assert.ok(run('GENS.textgap_es.make().prompt').includes('___'));
});
