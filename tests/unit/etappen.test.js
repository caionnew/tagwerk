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

// Themen: Blöcke zu 60 Aufgaben; Abschnitte aus 1, 2, 4, 8 … Blöcken gegen frühere, ab der letzten Etappe des Themas
// Blöcke einzeln anhängen und nach jedem prüfen, wie am Rundenende; Rückgabe: alle Etappen des Themas
function feed(app, J, trap, bads){
  app.run(`DB.tblk = DB.tblk || {}; DB.tblk.sv = DB.tblk.sv || {}; DB.tblk.sv['${trap}'] = DB.tblk.sv['${trap}'] || { b:[], cn:0, cb:0 };`);
  bads.forEach(b => { app.run(`DB.tblk.sv['${trap}'].b.push(${b}); checkTopics('sv');`); });
  return J(`(DB.etap || []).filter(e => e.k === '${trap}')`);
}
test('Themen: Antworten landen in Blöcken zu 60 Aufgaben', () => {
  const { app, J } = setup();
  app.run("for (let i = 0; i < 125; i++) blockAdd('sv', 'tempus', i % 4 !== 0);");
  assert.deepEqual(J("DB.tblk.sv.tempus"), { b:[15, 15], cn:5, cb:2 });
});
test('Themen: Schwankungen von Tag zu Tag ergeben keine Etappe, auch über Jahre nicht', () => {
  const { app, J } = setup();
  // Jeder Block um 30 von 60 falsch (Tage mit 1 von 3 und 2 von 3 falsch im Wechsel), dazu Ausreißer nach oben und unten
  const bads = Array.from({ length:64 }, (_, i) => [30, 26, 33, 29, 22, 31, 36, 28][i % 8]);
  assert.deepEqual(feed(app, J, 'tempus', bads), []);
  // Ein einzelner sehr guter Block nach einem schlechten reicht bei 60 Aufgaben nicht, wenn der Abstand knapp ist
  assert.deepEqual(feed(app, J, 'inversion', [22, 24, 23, 9]), []);
});
test('Themen: Halbierung kurz- und langfristig, wiederholt; die nächste braucht eine weitere Halbierung', () => {
  const { app, J } = setup();
  // Kurzfristig: 25 von 60 falsch, dann 6 von 60
  let ev = feed(app, J, 'tempus', [24, 22, 25, 6]);
  assert.equal(ev.length, 1);
  assert.deepEqual([ev[0].s, ev[0].b, ev[0].c, ev[0].i], [1, [60, 25], [60, 6], 3]);
  ev = feed(app, J, 'tempus', [7, 5, 6]);
  assert.equal(ev.length, 1, 'derselbe Stand bringt keine zweite Etappe');
  // Langfristig: lange um 10 % (6 von 60), dann lange um 5 % (3 von 60). Erst Abschnitte von 960 Aufgaben zeigen das sicher.
  ev = feed(app, J, 'inversion', Array(16).fill(6).concat(Array(16).fill(3)));
  assert.equal(ev.length, 1);
  assert.deepEqual([ev[0].s, ev[0].b, ev[0].c], [1, [960, 96], [960, 48]]);
  // Wiederholt: von 17 % auf 5 %, später von 5 % auf unter 1 %; dazwischen bringt der gleiche Stand nichts
  ev = feed(app, J, 'bisats', [10, 10, 10, 10, 3, 3, 3, 3]);
  assert.deepEqual(ev.map(e => [e.b, e.c]), [[[240, 40], [240, 12]]]);
  assert.equal(feed(app, J, 'bisats', [3, 3, 3, 3]).length, 1);
  ev = feed(app, J, 'bisats', [1, 0, 1, 0, 1, 0, 1, 0]);
  assert.deepEqual(ev.map(e => e.s), [1, 1]);
  assert.deepEqual([ev[1].b, ev[1].c], [[480, 24], [480, 4]]);
  app.run(`DB.log = { [today()]:{ sv:{ n:10 } } };`);
  const w = J('wayEvents().done').filter(e => e.trap === 'bisats').map(e => e.t);
  assert.match(w[0], /: Fehler halbiert$/); assert.match(w[1], /: Fehler wieder halbiert$/);
  assert.equal(new Set(J('wayKeys()')).size, J('wayKeys()').length, 'Kennungen eindeutig');
  // Am Rundenende: die vorige Halbierung desselben Themas als vorige Etappe
  const last = J("wayEvents().done.filter(e => e.trap === 'bisats').pop()");
  const lh = app.run(`mileHtml({ lang:'sv', miles:[${JSON.stringify(last)}], crossed:{} })`);
  assert.match(lh, /class="mr done"><i><\/i><span class="mr-t">Fehler halbiert<span class="mr-s">von 17\u00a0% auf 5\u00a0%<\/span>/);
  assert.match(text(lh), /^Etappe Wortstellung im Nebensatz Schwedisch Fehler halbiert von 17 % auf 5 % \d+\. \S+ Fehler wieder halbiert von 5 % auf 0,8 % heute Je 480 Aufgaben: vorher 24 falsch, zuletzt 4\. Themenblatt Dein Weg$/);
  // Als Nächstes: wieder halbiert, mit dem Ziel; unter 2 % Fehler keine nächste Halbierung mehr (bräuchte Tausende Aufgaben)
  const nx = J(`wayNext(wayEvents().done.filter(e => e.trap === 'bisats')[0])`);
  assert.match(nx.t, /wieder halbiert$/); assert.equal(nx.rest, 'auf unter 2,5\u00a0%');
  assert.equal(J(`wayNext(wayEvents().done.filter(e => e.trap === 'bisats').pop())`), null);
});
test('Themen: „sitzt“ einmal, wenn es früher sicher über 15 % lag und jetzt sicher darunter', () => {
  const { app, J } = setup();
  const ev = feed(app, J, 'bisats', [20, 22, 21, 19, 3, 2]);
  assert.deepEqual(ev.map(e => e.s), [1, 2]);
  assert.deepEqual(ev[1].c, [120, 5]);
  app.run(`DB.log = { [today()]:{ sv:{ n:10 } } }; S.mileAll = false;`);
  const m = J("wayEvents().done.find(e => e.k === 'topic' && e.v === 2)");
  assert.match(m.t, /^Thema „.+“ sitzt$/);
  const h = text(app.run(`mileHtml({ lang:'sv', miles:[${JSON.stringify(m)}], crossed:{ mature:[], anchored:[] } })`));
  assert.match(h, /Thema sitzt von 33 % auf 4,2 % heute .*Je 120 Aufgaben: vorher 40 falsch, zuletzt 5\./);
  assert.equal(feed(app, J, 'bisats', [1, 2, 2, 1]).filter(e => e.s === 2).length, 1);
  // Gleichbleibend um 12 % (7 von 60): nie „sitzt“
  assert.deepEqual(feed(app, J, 'tempus', Array(40).fill(7)), []);
});
test('Themen: Stand bis 24.63.0 wird umgewandelt, ältere Etappen kommen nicht doppelt', () => {
  const { app, J } = setup();
  const tlog = {}; for (let k = 30; k >= 1; k--) tlog[J(`addDays(today(), ${-k})`)] = { sv:{ 'p:tempus':[5, k > 15 ? 2 : 0], 't:free':[5, 1] } };
  const old = Object.assign(fresh(), { tlog, tbase:{ sv:{ tempus:{ n:40, bad:16, to:'2026-01-01' } } }, etap:[{ d:'2026-11-20', l:'sv', k:'tempus', s:1, b:[40, 16], c:[60, 0] }] });
  app.run(`adoptDB(${JSON.stringify(old)});`);
  assert.equal(J('DB.tbase'), undefined);
  const x = J('DB.tblk.sv.tempus');
  assert.deepEqual([x.b, x.cn], [[24, 6], 30]); // 150 Aufgaben: 75 mit 30 Fehlern, dann 75 ohne
  assert.equal(J('DB.etap[0].i'), 1);
  assert.deepEqual(J("checkTopics('sv')"), []);
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

test('Serien in „Dein Weg“ nach derselben Regel wie die Serienanzeige', () => {
  const { app, J, ds } = setup();
  // Tagwerk vor 20 Tagen, drei Tage aus, vier Tagwerke, ein Pausetag, drei Tagwerke: nach der Serienregel 7 in Folge
  const done = { [ds(20)]:true }; [16, 15, 14, 13, 11, 10, 9].forEach(k => { done[ds(k)] = true; });
  app.run(`DB.done = ${JSON.stringify(done)}; DB.log = ${JSON.stringify(Object.fromEntries(Object.keys(done).map(d => [d, { sv:{ n:10 } }])))};`);
  assert.equal(J('streakData().longest'), 7);
  assert.deepEqual(J("wayEvents().done.filter(e => e.k === 'streak')").map(e => [e.d, e.t]), [[ds(9), '7 Tage in Folge']]);
  assert.equal(J(`longestRun('${ds(30)}', today())`), 7);
});

test('Nach mehr als 400 Übungstagen: Anfang, Daten und Zählung bleiben', () => {
  const { app, J, ds } = setup();
  const log = {}; for (let k = 404; k >= 0; k--) log[ds(k)] = { sv:{ n:10, secs:300 } };
  app.run(`DB.log = ${JSON.stringify(log)};`);
  const before = J('wayEvents().done').map(e => [e.d, e.t]);
  app.run('pruneLog();');
  assert.equal(J('Object.keys(DB.log).length'), 400);
  assert.equal(J('DB.logArch.first'), ds(404));
  assert.deepEqual([J("archSum('days')"), J("archSum('n', 'sv')"), J("archSum('secs')"), J("archSum('n', 'es')")], [5, 50, 1500, 0]);
  // Gesamtzahlen und „Jahr für Jahr“ zählen die herausgefallenen Tage mit
  assert.equal(J('yearStats()').reduce((a, Y) => a + Y.days, 0), 405);
  const after = J('wayEvents().done').map(e => [e.d, e.t]);
  assert.deepEqual(after, before, 'gleiche Etappen mit gleichem Datum');
  assert.deepEqual(after.slice(0, 3), [[ds(404), 'Erster Übungstag'], [ds(395), '10 Übungstage'], [ds(395), '100 Aufgaben']]);
  const T = J('lifeTotals()');
  assert.deepEqual([T.dayCount, T.n, T.first], [405, 4050, ds(404)]);
  assert.deepEqual(J("wayNext({ k:'days', v:250 })"), { t:'500 Übungstage', rest:'noch 95' });
  // Ein Jahr nach dem ersten Übungstag, nicht nach dem ältesten Tag im Protokoll
  assert.deepEqual(after.filter(e => / mit Tagwerk$/.test(e[1])), [[J(`addDays('${ds(404)}', 365)`), '1 Jahr mit Tagwerk']]);
});

test('Erreichte Etappen bleiben, auch wenn die Zahl wieder sinkt; keine zweite Etappe beim erneuten Erreichen', () => {
  const { app, J, ds } = setup();
  app.run(`DB.log = { '${ds(3)}':{ sv:{ n:60 }, es:{ n:50 } } }; persistWay();`);
  assert.ok(J('DB.way').some(e => e.k === 'tasks' && e.v === 100));
  // Spanisch zurückgesetzt: weniger als 100 Aufgaben im Protokoll, die Etappe bleibt mit Datum
  app.run(`delete DB.log['${ds(3)}'].es; DB.way = DB.way.filter(e => e.l !== 'es');`);
  assert.deepEqual(J("wayEvents().done.filter(e => e.k === 'tasks')").map(e => [e.d, e.t]), [[ds(3), '100 Aufgaben']]);
  app.run(`S.run = { kind:'extra', lang:'sv', res:[], ok:0, bad:0, wayBefore:wayKeys() }; DB.log[today()] = { sv:{ n:60 } }; finishRun();`);
  assert.ok(!J('S.run.miles').some(e => e.k === 'tasks' && e.v === 100));
});

test('Offenes Tagwerk aus einer älteren Fassung: Kennungen werden nicht verglichen', () => {
  const { app, J } = setup();
  const ids = J('BANK.sv.slice(0, 2).map(i => i.id)');
  const run = v => app.run(`DB.run = { date:today(), lang:'sv', queue:${JSON.stringify(ids.map(id => ({ type:'free', id })))}, idx:0, wayBefore:['tasks||Alt'], ${v} }; S.dailyRun = null; restoreRun();`);
  run(''); assert.equal(J('S.dailyRun.wayBefore'), null);
  run('wayV:WAY_V'); assert.deepEqual(J('S.dailyRun.wayBefore'), ['tasks||Alt']);
});

test('Jahrestag nach einem 29. Februar am 1. März; Datum am Rundenende mit Jahr, wenn es nicht dieses ist', () => {
  const { app, J } = setup();
  fixClock(app, 2027, 6, 1);
  app.run(`DB.log = { '2024-02-29':{ sv:{ n:5 } }, '2027-05-01':{ sv:{ n:5 } } };`);
  assert.deepEqual(J("wayEvents().done.filter(e => e.k === 'years')").map(e => e.d), ['2025-03-01', '2026-03-01', '2027-03-01']);
  assert.match(J("fmtDM('2026-11-18')"), / 2026$/);
  assert.doesNotMatch(J("fmtDM('2027-05-01')"), /2027/);
  // Etappe, die nicht heute erreicht wurde: Datum statt „heute“
  const h = text(app.run(`mileHtml({ lang:'sv', miles:[{ d:'2027-05-31', k:'tasks', v:100, t:'100 Aufgaben' }], crossed:{} })`));
  assert.match(h, /100 Aufgaben 31\. \S+ /);
});
