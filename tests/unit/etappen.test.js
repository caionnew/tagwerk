// Etappen (seit 24.63): eine Schwellenliste je Art, Erkennung am Rundenende, Rangfolge, gefestigte Sätze der Runde,
// verankerte Sätze, Themen mit gesunkener Fehlerquote (ohne Rauschen), Monatsbilanz, Tageskarte, Vibration.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const fresh = () => ({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, doneLang:{}, gen:{}, run:null, tlog:{}, snap:{}, used:{} });
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim();
function setup(db){
  const app = loadApp();
  const J = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
  app.setDB(Object.assign(fresh(), db || {}));
  return { app, J, ds:k => J(`addDays(today(), ${-k})`) };
}
// Feste Uhr für die Monatsbilanz: 3. Dezember 2026, mittags
function fixClock(app, y, m, d){
  app.run(`globalThis.__RD = globalThis.__RD || Date; globalThis.Date = class extends __RD { constructor(...a){ if (a.length) super(...a); else super(${y}, ${m - 1}, ${d}, 12); } static now(){ return new __RD(${y}, ${m - 1}, ${d}, 12).getTime(); } };`);
}

test('Schwellen: Serie, verankert und gefestigt aus je einer Liste', () => {
  const { J } = setup();
  const s = J('streakList(400)');
  assert.deepEqual(s.slice(0, 10), [7, 14, 30, 50, 100, 150, 200, 250, 300, 365]);
  assert.ok(s.includes(400) && s.includes(730));
  assert.deepEqual(J('anchoredList(0)').slice(0, 8), [1, 10, 25, 50, 100, 250, 500, 1000]);
  assert.ok(J('anchoredList(1700)').includes(2000));
  assert.equal(J('anchoredLabel(1)'), 'Erster Satz verankert');
  assert.equal(J('streakLabel(730)'), '2 Jahre in Folge');
});

test('Rundenende: neue Etappen sind die, die nach der Runde in „Dein Weg“ stehen und vorher nicht', () => {
  const { app, J, ds } = setup();
  const log = {}; for (let k = 6; k >= 1; k--) log[ds(k)] = { sv:{ n:15, secs:300 } };
  app.run(`DB.log = ${JSON.stringify(log)};`);
  app.run(`S.run = { kind:'extra', lang:'sv', res:[], ok:0, bad:0, wayBefore:wayKeys() };`);
  assert.ok(!J('wayKeys()').some(k => k.includes('100 Aufgaben')));
  app.run(`DB.log[today()] = { sv:{ n:12, secs:240 } }; finishRun();`);
  const miles = J('S.run.miles').map(e => e.t);
  assert.deepEqual(miles, ['100 Aufgaben']);
  // Alter Rundenstand ohne Vergleichsliste: keine Etappe, kein Fehler
  app.run(`S.run = { kind:'extra', lang:'sv', res:[], ok:0, bad:0, wayBefore:null }; DB.log[today()].sv.n = 120; finishRun();`);
  assert.deepEqual(J('S.run.miles'), []);
});

test('Mehrere Etappen: Können vor Fleiß, die übrigen in einer Zeile, Ausschnitt mit voriger und nächster Etappe', () => {
  const { app, J, ds } = setup();
  const log = {}; for (let k = 12; k >= 1; k--) log[ds(k)] = { sv:{ n:12, secs:300, mat:1 } };
  app.run(`DB.log = ${JSON.stringify(log)};`);
  const done = J('wayEvents().done'), tasks = done.find(e => e.k === 'tasks'), mature = done.filter(e => e.k === 'mature').pop();
  assert.ok(tasks && mature);
  assert.ok(J(`wayPrio(${JSON.stringify(mature)})`) < J(`wayPrio(${JSON.stringify(tasks)})`));
  app.run(`S.mileAll = false; globalThis.__r = { lang:'sv', miles:${JSON.stringify([tasks, mature])}, crossed:{ mature:[], anchored:[] } };`);
  const h = app.run('mileHtml(__r)'), t = text(h);
  assert.match(h, /class="mr now"><i><\/i><span class="mr-t">10 gefestigte Sätze/);
  assert.match(t, /Außerdem: 100 Aufgaben\./);
  assert.match(h, /class="mr next"><i><\/i><span class="mr-t">25 gefestigte Sätze/);
  assert.doesNotMatch(h, /class="mr done"/, 'erste Etappe dieser Art: keine vorige');
  assert.match(h, /data-a="toway"/);
  assert.equal(app.run('mileHtml({ miles:[] })'), '');
  // Zweite Etappe derselben Art: die vorige mit Datum davor
  app.run(`DB.log[today()] = { sv:{ n:400, secs:600 } };`);
  const t500 = J('wayEvents().done').find(e => e.t === '500 Aufgaben');
  app.run(`globalThis.__r = { lang:'sv', miles:[${JSON.stringify(t500)}], crossed:{ mature:[], anchored:[] } };`);
  const h2 = app.run('mileHtml(__r)');
  assert.match(text(h2), /^Etappe 100 Aufgaben \d+\. \S+ 500 Aufgaben heute 1\.000 Aufgaben noch 456 Dein Weg$/);
});

test('Gefestigt in dieser Runde: nur Sätze, die die Schwelle überschritten haben, die mit den meisten Fehlern zuerst', () => {
  const { app, J } = setup();
  const ids = J("BANK.sv.slice(0, 5).map(i => i.id)");
  app.run(`DB.st = { '${ids[0]}':{ ivl:23, bad:1 }, '${ids[1]}':{ ivl:25, bad:4, lapses:2 }, '${ids[2]}':{ ivl:30, bad:0 }, '${ids[3]}':{ ivl:9, bad:3 } };`);
  const r = { res:[
    { id:ids[0], ivl:23, pivl:12, good:true }, { id:ids[1], ivl:25, pivl:10, good:true },
    { id:ids[2], ivl:30, pivl:24, good:true }, { id:ids[3], ivl:9, pivl:4, good:true }, { id:ids[1], ivl:25, pivl:10, good:true }
  ] };
  const c = J(`crossedIn(${JSON.stringify(r)}, MATURE)`);
  assert.deepEqual(c.map(x => x.id), [ids[1], ids[0]]);
  // Im Block: Satz mit Fehlerzahl und heutigem Abstand, ab vier Sätzen „und N weitere“
  const many = Array.from({ length:5 }, (_, i) => ({ id:J(`BANK.sv[${10 + i}].id`), ivl:22, bad:i ? 0 : 3 }));
  app.run(`S.mileAll = false; globalThis.__r = { lang:'sv', miles:[{ d:today(), k:'mature', l:'sv', v:10, t:'10 gefestigte Sätze' }], crossed:{ mature:${JSON.stringify(many)}, anchored:[] } };`);
  const h = app.run('mileHtml(__r)');
  assert.equal((h.match(/class="ms"/g) || []).length, 3);
  assert.match(text(h), /dreimal falsch, jetzt 22 Tage Abstand/);
  assert.match(h, /data-a="mileall">und 2 weitere</);
  app.run('S.mileAll = true;');
  assert.equal((app.run('mileHtml(__r)').match(/class="ms"/g) || []).length, 5);
});

test('Verankert: Bestand am Tagesende aus dem Protokoll, Etappe am Tag des Überschreitens', () => {
  const { app, J, ds } = setup();
  app.run(`DB.log = { '${ds(3)}':{ sv:{ n:10, mc:40, ac:0 } }, '${ds(2)}':{ sv:{ n:10, mc:41, ac:1 } }, '${ds(1)}':{ sv:{ n:10, mc:44 } } };`);
  const a = J('wayEvents().done').filter(e => e.k === 'anchored');
  assert.deepEqual(a.map(e => [e.d, e.t, e.l]), [[ds(2), 'Erster Satz verankert', 'sv']]);
  // Protokollierung: snapshot schreibt mc und ac in den Tageseintrag
  const id = J('BANK.sv[0].id'), id2 = J('BANK.sv[1].id');
  app.run(`DB.st = { '${id}':{ ivl:400 }, '${id2}':{ ivl:30 } }; DB.log[today()] = { sv:{ n:4 } }; snapshot();`);
  const x = J('DB.log[today()].sv');
  assert.equal(x.mc, 2); assert.equal(x.ac, 1);
});

// Themen: Ausgangswert aus den ersten 40 Aufgaben, aktueller Wert aus den letzten 60 (mindestens 40) danach
function topicDB(ds, trap, base, later){
  const tlog = {}; let k = 40;
  const put = ([n, bad]) => { tlog[ds(k--)] = { sv:{ ['p:' + trap]:[n, bad] } }; };
  base.forEach(put); later.forEach(put);
  return tlog;
}
test('Themen: Schwankungen von Tag zu Tag ergeben keine Etappe', () => {
  const { app, J, ds } = setup();
  const trap = J("topicIds('sv').find(id => id !== 'eigene')");
  // Ausgangswert 13 von 40 falsch; danach im Wechsel 1 von 3 und 2 von 3 falsch, 25 Tage lang
  const later = Array.from({ length:25 }, (_, i) => [3, i % 2 ? 2 : 1]);
  app.run(`DB.tlog = ${JSON.stringify(topicDB(ds, trap, [[10, 3], [10, 4], [10, 3], [10, 3]], later))};`);
  assert.deepEqual(J("checkTopics('sv')"), []);
  // Auch ein einzelner guter Tag am Ende reicht nicht
  app.run(`DB.tlog[today()] = { sv:{ 'p:${trap}':[6, 0] } };`);
  assert.deepEqual(J("checkTopics('sv')"), []);
});
test('Themen: halbiert erst mit genug Aufgaben und klarem Abstand, „sitzt“ erst bei höchstens 3 von 60', () => {
  const { app, J, ds } = setup();
  const trap = J("topicIds('sv').find(id => id !== 'eigene')");
  // Zu wenige Aufgaben nach dem Ausgangswert: noch keine Aussage
  app.run(`DB.tlog = ${JSON.stringify(topicDB(ds, trap, [[20, 8], [20, 8]], [[10, 0], [10, 0], [10, 1]]))};`);
  assert.deepEqual(J("checkTopics('sv')"), []);
  // 16 von 40 am Anfang, zuletzt 6 von 60: halbiert
  app.run(`DB.tlog = ${JSON.stringify(topicDB(ds, trap, [[20, 8], [20, 8]], [[20, 2], [20, 2], [20, 2]]))}; DB.tbase = {};`);
  const e1 = J("checkTopics('sv')");
  assert.equal(e1.length, 1); assert.equal(e1[0].s, 1); assert.deepEqual([e1[0].b, e1[0].c], [[40, 16], [60, 6]]);
  assert.deepEqual(J("checkTopics('sv')"), [], 'jede Stufe nur einmal');
  // Ausgangswert bleibt gespeichert, auch wenn die ersten Tage aus dem Protokoll fallen
  app.run(`delete DB.tlog['${ds(40)}']; delete DB.tlog['${ds(39)}'];`);
  app.run(`DB.tlog['${ds(3)}'] = { sv:{ 'p:${trap}':[20, 1] } }; DB.tlog['${ds(2)}'] = { sv:{ 'p:${trap}':[20, 0] } }; DB.tlog['${ds(1)}'] = { sv:{ 'p:${trap}':[20, 1] } };`);
  const e2 = J("checkTopics('sv')");
  assert.equal(e2.length, 1); assert.equal(e2[0].s, 2); assert.deepEqual(e2[0].c, [60, 2]);
  app.run(`DB.log = { '${ds(1)}':{ sv:{ n:20 } } };`);
  const w = J('wayEvents().done').filter(e => e.k === 'topic');
  assert.equal(w.length, 2);
  assert.match(w[0].t, /Fehler halbiert$/); assert.match(w[1].t, /sitzt$/);
  // 4 von 60 ist (noch) nicht „sitzt“
  const { app:a2, J:J2, ds:d2 } = setup();
  a2.run(`DB.tlog = ${JSON.stringify(topicDB(d2, trap, [[20, 8], [20, 8]], [[20, 2], [20, 1], [20, 1]]))};`);
  assert.deepEqual(J2("checkTopics('sv')").map(e => e.s), [1]);
});

test('Monatsbilanz: beim ersten Tagwerk des Monats, einmal; danach keine Monatszeile mehr auf „Heute“', () => {
  const { app, J } = setup();
  fixClock(app, 2026, 12, 3);
  assert.equal(J('today()'), '2026-12-03');
  const log = {}, done = {};
  for (let d = 1; d <= 30; d++) { const k = `2026-11-${String(d).padStart(2, '0')}`; if (d % 4 === 0) continue; log[k] = { sv:{ n:20, secs:600, mc:d } }; if (d % 2) done[k] = true; }
  app.run(`DB.log = ${JSON.stringify(log)}; DB.done = ${JSON.stringify(done)}; DB.done['2026-12-03'] = true; DB.used = {};`);
  assert.match(app.run('monthRecap()'), /November:/);
  const m = J('monthCard()');
  assert.equal(m.ym, '2026-11'); assert.equal(m.days, 23); assert.equal(m.tw, Object.keys(done).length); assert.equal(m.gain.sv, 30);
  assert.equal(J('monthCard()'), null, 'nur einmal je Monat');
  assert.equal(app.run('monthRecap()'), '', 'Heute zeigt die Zeile danach nicht mehr');
  const h = app.run(`monthHtml(${JSON.stringify(m)})`);
  assert.match(text(h), /Dein November/);
  assert.match(text(h), /23 von 30 Tagen geübt/);
  assert.equal((h.match(/<rect /g) || []).length, 30);
  // Schon ein früheres Tagwerk in diesem Monat: keine Bilanz
  app.run(`DB.used = {}; DB.done['2026-12-02'] = true;`);
  assert.equal(J('monthCard()'), null);
});
test('Monatsbilanz im Januar: dazu das Vorjahr in einer Zeile', () => {
  const { app, J } = setup();
  fixClock(app, 2027, 1, 2);
  app.run(`DB.log = { '2026-03-04':{ es:{ n:30, secs:900 } }, '2026-12-10':{ sv:{ n:20, secs:600 } } }; DB.done = { '2026-12-10':true, '2027-01-02':true };`);
  const m = J('monthCard()');
  assert.equal(m.ym, '2026-12'); assert.deepEqual(m.year, { y:2026, days:2, n:50, secs:1500 });
  assert.match(text(app.run(`monthHtml(${JSON.stringify(m)})`)), /Dein Jahr 2026: an 2 Tagen geübt, 50 Aufgaben/);
});

test('Tageskarte im Kalender nennt die Etappen dieses Tages', () => {
  const { app, ds } = setup();
  const log = {}; for (let k = 9; k >= 1; k--) log[ds(k)] = { sv:{ n:15, secs:300 } };
  app.run(`DB.log = ${JSON.stringify(log)};`);
  // 100 Aufgaben am siebten Übungstag (7 × 15 = 105)
  assert.match(text(app.run(`dayCard('${ds(3)}')`)), /100 Aufgaben/);
  assert.doesNotMatch(text(app.run(`dayCard('${ds(4)}')`)), /100 Aufgaben/);
});

test('Stempel: Siegel nur an Etappentagen; außerhalb des Tagwerks nur mit Etappe', () => {
  const { app } = setup();
  assert.match(app.run('stampSvg({ stamped:true }, true, false)'), /^<svg class="stamp" viewBox="0 0 56 56"/);
  assert.match(app.run('stampSvg({}, true, true)'), /class="stamp seal draw"[^>]*><path class="sl"/);
  assert.match(app.run('stampSvg({}, false, true)'), /class="stamp seal nd draw".*class="dot"/);
  assert.equal(app.run('stampSvg({}, false, false)'), '');
});

test('Vibration: Etappe kurz, kurz, lang; ausgeschaltet keine', () => {
  const { app, J } = setup();
  app.run('navigator.vibrate = p => { globalThis.__vib = p; return true; }; DB.settings.haptics = true; buzz("mile");');
  assert.deepEqual(J('__vib'), [14, 70, 14, 70, 60]);
  app.run('globalThis.__vib = null; DB.settings.haptics = false; buzz("mile");');
  assert.equal(J('__vib'), null);
});
