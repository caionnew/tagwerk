// Rundenende: Themen der Runde mit Fehler-Bündelung, Bonus „Eigener Satz“ (Ausdruck wählen, ohne Netz prüfen).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const bank = app.get('BANK').sv;
const byTrap = t => bank.filter(i => i.trap === t);
const traps = [...new Set(bank.filter(i => i.gap).map(i => i.trap))];
const [ta, tb] = traps;
const val = code => JSON.parse(JSON.stringify(app.run(code))); // Werte aus der VM ohne fremde Prototypen
const run = res => { app.run(`S.run = { kind:'daily', lang:'sv', res:${JSON.stringify(res)}, ok:0, bad:0 }`); };
test('Themen: nach Thema gruppiert, Fehler zuerst, erzeugte Aufgaben nach Generator', () => {
  const [a1, a2, a3] = byTrap(ta), [b1] = byTrap(tb);
  run([{ id:b1.id, good:true }, { id:a1.id, good:false }, { id:a2.id, good:true, near:true }, { id:a3.id, good:false }, { gen:'genus_sv', good:true }]);
  const tps = val('roundTopics(S.run)');
  assert.equal(tps[0].key, ta);
  assert.deepEqual(tps[0].dots, ['bad', 'near', 'bad']);
  assert.equal(tps[0].bad, 2);
  assert.deepEqual(tps.map(t => t.key).slice(1).sort(), [tb, app.run(`(TRAPS.sv.find(t => t.gen === 'genus_sv') || { id:'genus_sv' }).id`)].sort());
});
test('Fehler bündeln: nur wenn ein Thema mit mindestens zwei Fehlern klar vorn liegt', () => {
  const [a1, a2] = byTrap(ta), [b1, b2] = byTrap(tb);
  run([{ id:a1.id, good:false }, { id:a2.id, good:false }, { id:b1.id, good:false }, { id:b2.id, good:true }]);
  let h = app.run('topicsHtml(S.run)');
  assert.match(h, /2 von 3 Fehlern: <b>/);
  assert.match(h, new RegExp(`data-a="trapgo" data-t="${ta}"`));
  run([{ id:a1.id, good:false }, { id:a2.id, good:false }, { id:b1.id, good:true }]);
  assert.match(app.run('topicsHtml(S.run)'), /Beide Fehler: <b>/);
  run([{ id:a1.id, good:false }, { id:a2.id, good:false }, { id:b1.id, good:false }, { id:b2.id, good:false }]);
  h = app.run('topicsHtml(S.run)');
  assert.doesNotMatch(h, /class="hint bundle"/, 'Gleichstand: kein Hinweis');
  assert.match(h, /Themen dieser Runde/);
  // Ein einziges Thema: mit Fehlern eine Zeile zum Aufklappen, ohne Bündel-Hinweis; fehlerfrei nichts (die Leiste sagt alles)
  run([{ id:a1.id, good:false }, { id:a2.id, good:false }]);
  h = app.run('topicsHtml(S.run)');
  assert.match(h, /Thema dieser Runde/); assert.doesNotMatch(h, /class="hint bundle"/);
  run([{ id:a1.id, good:true }, { id:a2.id, good:true }]);
  assert.equal(app.run('topicsHtml(S.run)'), '', 'ein Thema, alles richtig: keine Liste');
});
test('Themenliste: jedes Thema mit Fehler sichtbar, bis fünf Zeilen aufgefüllt, der fehlerfreie Rest klappt auf', () => {
  const all = [...new Set(bank.map(i => i.trap))].filter(t => byTrap(t).length >= 2 && app.run(`!!trapMeta('sv', ${JSON.stringify(t)})`)).slice(0, 8);
  assert.equal(all.length, 8);
  const nRows = h => (h.match(/\btrow\b/g) || []).length;
  const shows = (h, t) => h.includes(`data-k="${t}"`);
  app.run('S.topicsAll = false');
  // Sechs Themen mit je einem Fehler, zwei ohne: alle sechs stehen da, nicht nur fünf
  run([...all.slice(0, 6).map(t => ({ id:byTrap(t)[0].id, good:false })), { id:byTrap(all[6])[0].id, good:true }, { id:byTrap(all[6])[1].id, good:true }, { id:byTrap(all[7])[0].id, good:true }]);
  let h = app.run('topicsHtml(S.run)');
  assert.equal(nRows(h), 6);
  all.slice(0, 6).forEach(t => assert.ok(shows(h, t), `Thema mit Fehler fehlt: ${t}`));
  assert.ok(!shows(h, all[6]) && !shows(h, all[7]));
  assert.match(h, /data-a="topicsall" aria-expanded="false">und 2 weitere Themen ohne Fehler</);
  app.run('S.topicsAll = true');
  h = app.run('topicsHtml(S.run)');
  assert.equal(nRows(h), 8);
  assert.match(h, /aria-expanded="true">Weniger zeigen</);
  app.run('S.topicsAll = false');
  // Zwei Themen mit Fehler, vier ohne: fünf Zeilen, das größte fehlerfreie Thema zuerst
  run([{ id:byTrap(all[0])[0].id, good:false }, { id:byTrap(all[1])[0].id, good:false }, { id:byTrap(all[2])[0].id, good:true }, { id:byTrap(all[3])[0].id, good:true }, { id:byTrap(all[3])[1].id, good:true }, { id:byTrap(all[4])[0].id, good:true }, { id:byTrap(all[5])[0].id, good:true }]);
  h = app.run('topicsHtml(S.run)');
  assert.equal(nRows(h), 5);
  assert.ok(h.indexOf(`data-k="${all[3]}"`) < h.indexOf(`data-k="${all[2]}"`), 'mehr Aufgaben zuerst');
  assert.match(h, />und 1 weiteres Thema ohne Fehler</);
  // Genau fünf Themen: nichts aufzuklappen
  run(all.slice(0, 5).map(t => ({ id:byTrap(t)[0].id, good:true })));
  h = app.run('topicsHtml(S.run)');
  assert.equal(nRows(h), 5);
  assert.doesNotMatch(h, /topicsall/);
});
test('Bonus: Lücke als Ausdruck, sonst seltenes Inhaltswort; Gewusstes zuerst; keine Funktionswörter', () => {
  const gapItem = bank.find(i => i.gap && i.gap.split(' ').length >= 2);
  // Satz ohne Lücke, der ein Inhaltswort hat (manche bestehen nur aus Alltags- und Funktionswörtern)
  const plain = bank.find(i => { if (i.gap) return false; run([{ id:i.id, good:true }]); return app.run('bonusCands(S.run)').length === 1; });
  run([{ id:plain.id, good:false }, { id:gapItem.id, good:true }]);
  const c = val('bonusCands(S.run)');
  assert.equal(c[0].expr, gapItem.gap);
  assert.equal(c[0].hint, gapItem.hint);
  assert.equal(c[1].id, plain.id);
  assert.ok(c[1].expr.length >= 4 && plain.target.toLowerCase().includes(c[1].expr));
  assert.equal(app.run(`isFunc('sv', ${JSON.stringify(c[1].expr)})`), false);
  run([{ gen:'genus_sv', good:true }]);
  assert.deepEqual(val('bonusCands(S.run)'), [], 'nur erzeugte Aufgaben: kein Bonus');
});
test('Bonus prüfen: ganzer Satz, nicht der Übungssatz, Ausdruck auch in anderer Form', () => {
  const item = bank.find(i => i.target === 'Han har glömt sina nycklar.');
  assert.ok(item, 'Satz in der Satzbank');
  const chk = (t, expr) => app.run(`bonusCheck('sv', ${JSON.stringify(t)}, { expr:${JSON.stringify(expr)}, id:${JSON.stringify(item.id)} })`);
  assert.match(chk('Sina nycklar', 'sina').msg, /mindestens drei Wörter/);
  assert.match(chk('Han har glömt sina nycklar!', 'sina').msg, /fast der Satz aus der Übung/);
  assert.equal(chk('Hon har glömt sin väska hemma.', 'sina').ok, false, 'Funktionswort: genau diese Form');
  assert.equal(chk('Barnen letar efter sina skor.', 'sina').ok, true);
  assert.equal(chk('Jag glömmer alltid min telefon.', 'glömt').ok, true, 'Inhaltswort: andere Form zählt');
  assert.match(chk('Vi åker till stan imorgon.', 'glömt').msg, /„glömt“ kommt noch nicht vor/);
});
