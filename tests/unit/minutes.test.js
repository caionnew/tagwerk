// Lernminuten: Tage und Wochen, Kennzahlen mit Vergleich, Detailkarte je Sprache (Minuten, Tagwerk, Treffer, Neues, Wiederholungen, Fehler, Uhrzeit).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const T = run('today()'), ds = k => run(`addDays(today(), ${-k})`);
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
// 30 Tage: Schwedisch täglich 10 Min. (außer Tag 3), Spanisch jeden dritten Tag 6 Min.; Tag 3 Pausetag
function db(){
  const d = { v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, doneLang:{}, gen:{}, run:null, tlog:{} };
  for (let k = 29; k >= 0; k--) {
    if (k === 3) continue;
    const day = ds(k), L = { sv:{ n:20, ok:17, secs:600, fresh:3, rev:8, revOk:7, mat:k === 0 ? 1 : 0 } };
    d.tlog[day] = { h:{ 7:10, 8:4, 21:6 }, sv:{ 't:free':[10, 2], 't:gap':[5, 1], 'p:inversion':[6, 2], 'p:tempus':[5, 1] } };
    if (k % 3 === 0) { L.es = { n:9, ok:8, secs:360, fresh:2, rev:4, revOk:3, mat:0 }; d.tlog[day].es = { 't:gap':[6, 1], 'p:subjuntivo':[4, 1] }; }
    d.log[day] = L; d.done[day] = true; d.doneLang[day] = { sv:true };
  }
  return d;
}
const setup = extra => { app.setDB(Object.assign(db(), extra || {})); run('buildBank(); S.minDay = null; S.minWeek = null; S.minRange = "d"; S.calDay = null'); };

test('Zeitspannen aus Stunden: zusammenhängende Stunden werden eine Spanne', () => {
  assert.equal(run('hourSpans({ 7:3, 8:1, 21:2 })'), '7–9 und 21–22 Uhr');
  assert.equal(run('hourSpans({ 6:1, 12:1, 13:2, 21:2 })'), '6–7, 12–14 und 21–22 Uhr');
  assert.equal(run('hourSpans({ 23:1 })'), '23–24 Uhr');
  assert.equal(run('hourSpans({})'), '');
});
test('Tage: Kennzahlen, Vergleich mit den 14 Tagen davor, 14 Säulen, heute gewählt, Pausetag gestrichelt', () => {
  setup();
  const h = run('minutesHtml()');
  assert.equal((h.match(/class="mc[ "]/g) || []).length, 14);
  // 13 Übungstage: 13 × 10 Min. Schwedisch + 5 × 6 Min. Spanisch (Tage 0, 6, 9, 12 und 3 fehlt → 0, 6, 9, 12) = 130 + 24
  const sv = 13 * 10, es = [0, 6, 9, 12].length * 6;
  assert.match(text(h), new RegExp(`${sv + es} Minuten in 14 Tagen`));
  assert.match(text(h), /13 von 14 Tagen geübt/);
  assert.match(text(h), /Die 14 Tage davor: \d+ Minuten/);
  assert.match(h, new RegExp(`class="mc sel now[^"]*" data-a="mpick" data-k="${T}"`));
  assert.match(h, new RegExp(`class="mc fr[^"]*" data-a="mpick" data-k="${ds(3)}"[^>]*aria-label="[^"]*: Pausetag"`));
  assert.match(h, /class="mavg"/, 'Durchschnittslinie ab drei Übungstagen');
});
test('Detailkarte eines Tages: je Sprache Minuten, Tagwerk, Aufgaben, Treffer, Neues, Wiederholungen, Fehler mit Thema der richtigen Sprache, Uhrzeit', () => {
  setup();
  const c = run(`dayCard(${JSON.stringify(T)})`), t = text(c);
  assert.match(t, /heute 16 Min\./);
  assert.match(t, /Schwedisch Tagwerk 10 Min\. 20 Aufgaben 80 % auf Anhieb richtig 3 neue Sätze 7 von 8 Wiederholungen gewusst 1 gefestigt/);
  assert.match(t, /Spanisch 6 Min\. 9 Aufgaben/);
  assert.match(c, /data-a="topic" data-l="sv" data-t="inversion"/);
  assert.match(c, /data-a="topic" data-l="es" data-t="subjuntivo"/);
  assert.match(t, /Fehler bei Inversion & „inte“ \(2 von 6\), Präteritum oder Perfekt \(1 von 5\)/);
  assert.match(t, /Uhrzeit: 7–9 und 21–22 Uhr/);
  assert.match(text(run(`dayCard(${JSON.stringify(ds(3))})`)), /Pausetag: nicht geübt, die Serie lief weiter\./);
  // Nur eine Sprache: Minuten stehen nur im Kopf
  const one = run(`dayCard(${JSON.stringify(ds(1))})`);
  assert.equal((text(one).match(/10 Min\./g) || []).length, 1);
});
test('Heute noch nicht geübt: Vorauswahl ist der letzte Übungstag, die Karte von heute sagt es', () => {
  const d = db(); delete d.log[T]; delete d.tlog[T]; delete d.done[T]; delete d.doneLang[T];
  app.setDB(d); run('buildBank(); S.minDay = null; S.minRange = "d"');
  assert.match(run('minutesHtml()'), new RegExp(`class="mc sel[^"]*" data-a="mpick" data-k="${ds(1)}"`));
  assert.match(text(run(`dayCard(${JSON.stringify(T)})`)), /Heute noch nicht geübt\./);
});
test('Wochen: ab drei Wochen Übung wählbar, aktuelle Woche vorgewählt, Karte mit Tagwerken und Übungstagen', () => {
  setup();
  assert.ok(run('minWeeksOk()'));
  run('S.minRange = "w"');
  const h = run('minutesHtml()'), t = text(h);
  const weeks = (h.match(/class="mc[ "]/g) || []).length;
  assert.ok(weeks >= 5 && weeks <= 6, String(weeks));
  assert.match(h, /class="mchart mweeks"/);
  assert.match(t, /Stunden in \d Wochen|Minuten in \d Wochen/);
  assert.match(t, /Minuten pro Woche/);
  assert.match(t, /Diese Woche seit Montag/);
  assert.match(t, /An \d von \d Tagen geübt/);
  // Ältere Woche: Kopf mit ausgeschriebenem Monat, Tagwerke gezählt
  const keys = run('minSpan("w").map(x => x.key)');
  run(`S.minWeek = ${JSON.stringify(keys[keys.length - 2])}`);
  const t2 = text(run('minutesHtml()'));
  assert.match(t2, /\d+\. (bis \d+\. )?(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)( bis \d+\. \w+)? /);
  assert.match(t2, /Schwedisch \d Tagwerke/);
});
test('Unter drei Wochen Übung keine Wochenansicht; ohne Lernzeit kein Abschnitt', () => {
  app.setDB({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{ [T]:{ sv:{ n:5, secs:300 } } }, done:{}, gen:{}, run:null });
  run('buildBank(); S.minRange = "w"; S.minDay = null');
  assert.ok(!run('minWeeksOk()'));
  const h = run('minutesHtml()');
  assert.doesNotMatch(h, /data-a="mrange"/); assert.doesNotMatch(h, /mweeks/);
  app.setDB({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null });
  run('buildBank()');
  assert.equal(run('minutesHtml()'), '');
});
