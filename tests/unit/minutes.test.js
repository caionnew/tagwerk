// Lernminuten der letzten 14 Tage: Kennzahlen mit Vergleich, Tageskarte je Sprache (Minuten, Aufgaben, Treffer, Neues, Tagwerk, Fehlerthemen, Uhrzeit).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const T = run('today()'), ds = k => run(`addDays(today(), ${-k})`);
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim();
// 30 Tage: Schwedisch täglich 10 Min. (außer Tag 3), Spanisch jeden dritten Tag 6 Min.; Tag 3 Pausetag
function db(){
  const d = { v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, doneLang:{}, gen:{}, run:null, tlog:{} };
  for (let k = 29; k >= 0; k--) {
    if (k === 3) continue;
    const day = ds(k), L = { sv:{ n:20, ok:17, secs:600, fresh:3, rev:8, revOk:7, mat:k === 0 ? 1 : 0 } };
    d.tlog[day] = { h:{ 7:10, 8:4, 21:6 }, sv:{ 't:free':[10, 2], 't:gap':[5, 1], 'p:inversion':[6, 2], 'p:tempus':[5, 1] } };
    if (k % 3 === 0) { L.es = { n:9, ok:8, secs:360, fresh:2, rev:4, revOk:3, mat:0 }; d.tlog[day].es = { 't:gap':[6, 1], 'p:subjuntivo':[4, 3] }; }
    d.log[day] = L; d.done[day] = true; d.doneLang[day] = { sv:true };
  }
  return d;
}
const setup = extra => { app.setDB(Object.assign(db(), extra || {})); run('buildBank(); S.minDay = null; S.calDay = null'); };

test('Zeitspannen aus Stunden: zusammenhängende Stunden werden eine Spanne', () => {
  assert.equal(run('hourSpans({ 7:3, 8:1, 21:2 })'), '7–9 und 21–22 Uhr');
  assert.equal(run('hourSpans({ 6:1, 12:1, 13:2, 21:2 })'), '6–7, 12–14 und 21–22 Uhr');
  assert.equal(run('hourSpans({ 23:1 })'), '23–24 Uhr');
  assert.equal(run('hourSpans({})'), '');
});
test('Tage: Kennzahlen, Vergleich mit den 14 Tagen davor, 14 Säulen, nichts vorgewählt, Pausetag gestrichelt', () => {
  setup();
  const h = run('minutesHtml()');
  assert.equal((h.match(/class="mc[ "]/g) || []).length, 14);
  // 13 Übungstage: 13 × 10 Min. Schwedisch, Spanisch an den Tagen 0, 6, 9, 12 je 6 Min.
  // Schnitt über alle 14 Tage, auch den Pausetag: 154 / 14 = 11
  assert.match(text(h), new RegExp(`^Lernminuten, letzte 14 Tage ${13 * 10 + 4 * 6} Minuten 13 von 14 Tagen geübt 11 Minuten pro Tag`));
  assert.match(text(h), /Die 14 Tage davor: \d+ Minuten\./);
  assert.doesNotMatch(h, /aria-pressed="true"/);
  assert.match(text(h), /Tipp auf einen Tag für Details\./);
  assert.doesNotMatch(h, /class="dcard"/);
  assert.match(h, new RegExp(`class="mc fr[^"]*" data-a="mpick" data-k="${ds(3)}"[^>]*aria-label="[^"]*: Pausetag"`));
  assert.match(h, /class="mavg"/, 'Durchschnittslinie ab drei Übungstagen');
  // Gewählter Tag: hinterlegt, Karte statt Hinweis
  run(`S.minDay = ${JSON.stringify(T)}`);
  const g = run('minutesHtml()');
  assert.match(g, new RegExp(`class="mc sel now[^"]*" data-a="mpick" data-k="${T}" aria-pressed="true"`));
  assert.match(g, /class="dcard"/); assert.doesNotMatch(text(g), /Tipp auf einen Tag/);
});
test('Tageskarte: Titel, Datum und Uhrzeit, Tabelle je Sprache, Quadrat wie im Kalender, Fehlerthemen beider Sprachen', () => {
  setup();
  const c = run(`dayCard(${JSON.stringify(T)})`), t = text(c);
  assert.match(t, /^Heute [^,]+, \d+\. \S+ · 7–9 und 21–22 Uhr/);
  assert.match(t, /Min\. Aufgaben richtig neu/);
  assert.match(t, /Schwedisch, Tagwerk erledigt 10 20 80 % 3/);
  assert.match(t, /Spanisch 6 9 5 von 6 2/, 'unter 10 ersten Versuchen als Anzahl, nicht in Prozent');
  assert.match(c, /class="sq ds"/, 'Tagwerk Schwedisch: gefüllt');
  assert.match(c, /class="sq pe"/, 'Spanisch ohne Tagwerk: Rand');
  assert.match(t, /Fehler bei Subjuntivo oder Indikativ und Inversion & „inte“\./);
  assert.match(c, /<span class="nobr"><button[^>]*data-t="inversion">[^<]+<\/button>\.<\/span><\/p>/, 'der Punkt bricht nicht allein um');
  assert.match(c, /class="term" data-a="topic" data-l="es" data-t="subjuntivo"/);
  assert.match(c, /class="term" data-a="topic" data-l="sv" data-t="inversion"/);
  assert.match(text(run(`dayCard(${JSON.stringify(ds(3))})`)), /Pausetag, die Serie lief weiter\./);
  // Älterer Tag: Datum als Titel, keine zweite Datumszeile
  const old = text(run(`dayCard(${JSON.stringify(ds(5))})`));
  assert.match(old, /^[^,]+, \d+\. \S+ 7–9 und 21–22 Uhr Sprache Min\./);
});
test('Heute noch nicht geübt: Karte von heute sagt es', () => {
  const d = db(); delete d.log[T]; delete d.tlog[T]; delete d.done[T]; delete d.doneLang[T];
  app.setDB(d); run('buildBank(); S.minDay = null');
  assert.match(text(run(`dayCard(${JSON.stringify(T)})`)), /^Heute [^,]+, \d+\. \S+ Noch nicht geübt\.$/);
});
test('Kein Wochenumschalter; ohne Lernzeit kein Abschnitt', () => {
  setup();
  const h = run('minutesHtml()');
  assert.doesNotMatch(h, /data-a="mrange"/);
  assert.match(text(h), /^Lernminuten, letzte 14 Tage/);
  app.setDB({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null });
  run('buildBank()');
  assert.equal(run('minutesHtml()'), '');
});

test('Summen: Zahlen über den Säulen ergeben die Summe oben, die Tageskarte die Zahl über ihrer Säule', () => {
  // Krumme Sekunden: einzeln gerundet 9 + 24 = 33, die Summe der Sekunden ergäbe gerundet 32
  const d = db(); d.log = {}; d.tlog = {};
  d.log[ds(1)] = { sv:{ n:10, secs:490 }, es:{ n:2, secs:20 } };   // 8 + „<1“ → 8
  d.log[ds(0)] = { sv:{ n:10, secs:560 }, es:{ n:10, secs:870 } }; // 9 + 15 → 24
  d.log[ds(2)] = { sv:{ n:1, secs:40 } };                            // 1
  d.log[ds(3)] = { es:{ n:1, secs:20 } };                            // nur „<1“
  app.setDB(d); run('buildBank(); S.minDay = null');
  const h = run('minutesHtml()');
  const vals = [...h.matchAll(/<span class="mcv">(.*?)<\/span>/g)].map(m => m[1]).filter(Boolean);
  assert.deepEqual(vals, ['<1', '1', '8', '24']);
  assert.match(text(h), /33 Minuten 4 von 4 Tagen geübt 8 Minuten pro Tag/, '33 / 4');
  assert.match(h, new RegExp(`data-k="${ds(1)}" aria-pressed="false" aria-label="[^"]*: 8 Min\\."`));
  assert.match(h, new RegExp(`data-k="${ds(3)}" aria-pressed="false" aria-label="[^"]*: unter 1 Min\\."`));
  assert.match(text(run(`dayCard(${JSON.stringify(ds(0))})`)), /Schwedisch(, Tagwerk erledigt)? 9 10 – 0 Spanisch 15 10/);
});
test('Vor dem ersten Übungstag: blasse Bahn, nichts zum Antippen, zählt nicht, Schnittlinie ab dem ersten Tag', () => {
  const d = db(); d.log = {}; d.tlog = {};
  [0, 1, 2, 3, 4].forEach(k => { d.log[ds(k)] = { sv:{ n:10, secs:600 } }; });
  app.setDB(d); run('buildBank(); S.minDay = null');
  const h = run('minutesHtml()');
  assert.equal((h.match(/class="mc pre[ "]/g) || []).length, 9);
  assert.equal((h.match(/data-a="mpick"/g) || []).length, 5);
  assert.match(h, /<span class="mc pre[^"]*" aria-hidden="true">/);
  assert.match(text(h), /5 von 5 Tagen geübt/);
  assert.match(h, /class="mavg" style="left:calc\(9 \* \(100% \+ 3px\) \/ 14\);top:/);
  assert.match(text(h), /Schnitt pro Tag/);
});
test('Hinweis „Tipp auf einen Tag“ nur bis zum ersten Antippen, in Lernminuten und Kalender', () => {
  setup();
  assert.match(text(run('minutesHtml()')), /Tipp auf einen Tag für Details\./);
  run('DB.used = { dayTap:true }');
  const h = text(run('minutesHtml()'));
  assert.doesNotMatch(h, /Tipp auf einen Tag/);
  assert.match(h, /Schnitt pro Tag( Am häufigsten geübt zwischen \d+ und \d+ Uhr, letzte 60 Tage\.)?$/);
  run(`S.ptab = 'all'; S.view = 'progress'`);
  const p = text(run('viewProgress()'));
  assert.match(p, /\d+ von \d+ Tagen geübt\.( Wischen für frühere Wochen\.)?/);
  assert.doesNotMatch(p, /Tipp auf einen Tag/);
});

test('Schnitt pro Tag: Ein Tag ohne Übung zählt mit (10 Min. täglich und ein Tag frei ergibt weniger als 10 Min. täglich und einmal 9)', () => {
  const avgOf = mins => {
    const d = db(); d.log = {}; d.tlog = {};
    mins.forEach((m, k) => { if (m) d.log[ds(k)] = { sv:{ n:10, secs:m * 60 } }; });
    d.log[ds(30)] = { sv:{ n:1, secs:60 } }; // früher Start: alle 14 Tage zählen
    app.setDB(d); run('buildBank(); S.minDay = null');
    return Number(text(run('minutesHtml()')).match(/(\d+) Minuten pro Tag/)[1]);
  };
  const frei = avgOf([10, 10, 10, 10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10]), neun = avgOf([10, 10, 10, 10, 10, 9, 10, 10, 10, 10, 10, 10, 10, 10]);
  assert.equal(frei, 9, '130 / 14');
  assert.equal(neun, 10, '139 / 14');
  assert.ok(frei < neun);
});
test('Heute zählt erst, wenn geübt wurde, in Lernminuten und Kalender', () => {
  const d = db(); delete d.log[T]; delete d.tlog[T]; delete d.done[T]; delete d.doneLang[T];
  app.setDB(d); run('buildBank(); S.minDay = null');
  assert.match(text(run('minutesHtml()')), /12 von 13 Tagen geübt/);
  assert.match(run(`minutesHtml()`), new RegExp(`data-k="${T}"[^>]*aria-label="[^"]*: noch nicht geübt"`));
  const c = run('calendarSvg()');
  assert.equal(c.total - c.active, 1, 'nur der Pausetag fehlt, heute nicht');
});
test('14 Tage ohne Übung: Nullen statt Striche, Bahnen bleiben, Hinweis statt Legende', () => {
  const d = db(); d.log = {}; d.tlog = {};
  for (let k = 40; k >= 15; k--) d.log[ds(k)] = { sv:{ n:10, secs:600 }, es:{ n:5, secs:300 } };
  app.setDB(d); run('buildBank(); S.minDay = null');
  const h = run('minutesHtml()'), t = text(h);
  assert.match(t, /^Lernminuten, letzte 14 Tage 0 Minuten 0 von 13 Tagen geübt 0 Minuten pro Tag/);
  assert.equal((h.match(/data-a="mpick"/g) || []).length, 14);
  assert.doesNotMatch(h, /class="mavg"/);
  assert.doesNotMatch(h, /keyrow/);
  assert.match(t, /In den letzten 14 Tagen nicht geübt\.$/);
});
test('Skala mindestens eine Viertelstunde, kleine Anteile mindestens 3 px', () => {
  const d = db(); d.log = {}; d.tlog = {};
  d.log[T] = { sv:{ n:10, secs:360 }, es:{ n:1, secs:10 } };
  app.setDB(d); run('buildBank(); S.minDay = null');
  const h = run('minutesHtml()');
  assert.match(h, /<i class="m-sv" style="height:38\.4px"><\/i>/, '6 von 15 Minuten: 40 % von 96 px');
  assert.match(h, /<i class="m-es" style="height:3\.0px"><\/i>/);
});
