// Satzauswahl der Runden: keine Doppelungen, möglichst wenig Überschneidung mit der vorigen Runde; Fundstück wechselt täglich.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp({ voices:true });
const S = app.get('S'), startRun = app.get('startRun'), BANK = app.get('BANK'), fundstueck = app.get('fundstueck'), addDays = app.get('addDays'), today = app.get('today');
const DB = app.get('DB');
DB.used = { intro:true };
BANK.sv.slice(0, 120).forEach((it, i) => { DB.st[it.id] = { s:5, d:5, ivl:i % 3 ? 3 : 40, due:i % 2 ? '2000-01-01' : '2999-01-01', last:'2026-01-01', reps:2, ok:2, bad:i % 5 === 0 ? 2 : 0 }; });
function rounds(kind, opts){
  const out = [];
  for (let r = 0; r < 40; r++) {
    S.run = null; startRun(kind, opts || {});
    if (!S.run) break;
    const ids = S.run.queue.filter(x => !x.requeue && x.id).map(x => x.id);
    out.push(ids);
    // Beantworten simulieren: geübt, heute zuletzt, nicht mehr fällig
    ids.forEach(id => { const st = DB.st[id] || (DB.st[id] = { s:2, d:5, ivl:2, reps:1, ok:1, bad:0 }); st.last = today(); st.due = '2999-01-01'; });
  }
  return out;
}
const overlap = rs => rs.slice(1).reduce((s, ids, i) => s + ids.filter(x => rs[i].includes(x)).length / Math.max(1, ids.length), 0) / Math.max(1, rs.length - 1);
for (const [kind, opts, maxOv] of [['daily', null, 0.05], ['quick', null, 0.05], ['dict', null, 0.05]]) {
  test(`${kind}: kein Satz doppelt, keine Überschneidung mit der Runde davor`, () => {
    const rs = rounds(kind, opts);
    assert.ok(rs.length >= 10, `nur ${rs.length} Runden`);
    rs.forEach(ids => assert.equal(ids.length, new Set(ids).size));
    assert.ok(overlap(rs) <= maxOv, `Überschneidung ${Math.round(overlap(rs) * 100)} %`);
  });
}
test('Thema üben: Überschneidung nicht größer als rechnerisch nötig', () => {
  const rs = rounds('trap', { trap:'inversion' });
  const pool = BANK.sv.filter(i => i.trap === 'inversion').length, k = rs[1].length;
  const minOv = Math.max(0, 2 * k - pool) / k;
  assert.ok(overlap(rs) <= minOv + 0.05, `Überschneidung ${Math.round(overlap(rs) * 100)} %, Minimum ${Math.round(minOv * 100)} %`);
});
test('Fundstück: nie dieselbe Karte an zwei Tagen hintereinander (120 Tage, beide Sprachen)', () => {
  for (const lang of ['sv', 'es']) {
    let last = null, same = 0;
    for (let k = 0; k < 120; k++) {
      const f = fundstueck(lang, addDays('2026-11-15', k));
      const id = f.kind + ':' + (f.ev ? f.ev[0] + (f.diff === 0 ? ':heute' : '') : f.e ? f.e.id : f.ff ? f.ff[0] : f.item ? f.item.id : '');
      if (id === last) same++; last = id;
    }
    assert.equal(same, 0, lang);
  }
});
