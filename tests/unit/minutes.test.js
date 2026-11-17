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
  assert.match(text(h), new RegExp(`${13 * 10 + 4 * 6} Minuten in 14 Tagen`));
  assert.match(text(h), /13 von 14 Tagen geübt/);
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
  assert.match(t, /Spanisch 6 9 83 % 2/);
  assert.match(c, /class="sq ds"/, 'Tagwerk Schwedisch: gefüllt');
  assert.match(c, /class="sq pe"/, 'Spanisch ohne Tagwerk: Rand');
  assert.match(t, /Fehler bei Subjuntivo oder Indikativ und Inversion & „inte“\./);
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
