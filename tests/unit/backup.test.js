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
