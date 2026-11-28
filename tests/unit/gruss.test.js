// Begrüßung auf „Heute“ (24.89.0): jeden Tag eine andere, innerhalb der Tageszeit dieselbe; Vorrang für Feiertag (24.90.0), ersten Tag,
// Rückkehr nach einer Pause, erledigtes Tagwerk und zweiten Besuch; Wochentage mit eigenem Gruß. Und: Ein Thema unter
// „Höchste Fehlerquoten“ öffnet zuerst das Themenblatt.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => app.run(code);
const GREET = app.get('GREET'), lookupWord = app.get('lookupWord'), tokens = app.get('tokens');
const all = lang => { const out = new Set(); const walk = o => (Array.isArray(o) ? o.forEach(x => out.add(x)) : Object.values(o).forEach(walk)); walk(GREET[lang]); return [...out]; };
// Gruß zu Datum und Uhrzeit; log: Übungstage vorher (Standard: der Vortag), extra: weiterer Code für DB
const greet = (lang, y, m, d, h, { log, extra = '' } = {}) => {
  const prev = log === undefined ? `{ [fmt(new Date(${y}, ${m - 1}, ${d - 1}))]: { ${lang}: { n: 5 } } }` : JSON.stringify(log);
  return run(`(() => { DB = freshDB(); DB.log = ${prev}; ${extra}; return greeting('${lang}', new Date(${y}, ${m - 1}, ${d}, ${h}, 30)); })()`);
};

test('jedes Wort ist nachschlagbar, jeder Gruß passt in eine Zeile neben den Wochenstreifen (höchstens 16 Zeichen)', () => {
  for (const lang of ['sv', 'es']) for (const g of all(lang)) {
    assert.ok(g.length <= 16, g);
    for (const w of tokens(g)) if (/[a-zà-ÿ]/i.test(w)) assert.ok(lookupWord(lang, w), `${lang}: ${w} (${g})`);
  }
  // Wendungen stehen beim Wort, das sie trägt
  assert.match(lookupWord('sv', 'sen').de, /länge sen! = lange nicht gesehen!/);
  assert.match(lookupWord('es', 'cuánto').de, /¡cuánto tiempo! = lange nicht gesehen!/);
});

test('innerhalb der Tageszeit derselbe, am nächsten Tag ein anderer; über einen Monat viele verschiedene', () => {
  assert.equal(greet('sv', 2026, 12, 1, 8), greet('sv', 2026, 12, 1, 9));
  assert.ok(GREET.sv.morning.includes(greet('sv', 2026, 12, 1, 8)));
  assert.notEqual(greet('sv', 2026, 12, 1, 8), greet('sv', 2026, 12, 2, 8));
  assert.ok(GREET.es.day.includes(greet('es', 2026, 12, 1, 17)));
  for (const [lang, h] of [['sv', 8], ['sv', 12], ['es', 10], ['es', 21]]) {
    const seen = new Set(Array.from({ length:30 }, (_, k) => greet(lang, 2027, 1, 2 + k, h)));
    assert.ok(seen.size >= 4, `${lang} ${h} Uhr: ${[...seen]}`);
  }
  // Tageszeiten wie bisher
  assert.ok(GREET.sv.late.includes(greet('sv', 2026, 12, 1, 23)));
  assert.ok(GREET.es.evening.includes(greet('es', 2026, 12, 1, 22)));
});

test('Wochentage: Freitagabend fredagsmys, Mittwochabend lillördag, Freitag ¡Ya es viernes!', () => {
  assert.equal(greet('sv', 2026, 12, 4, 19), 'Fredagsmys!');
  assert.equal(greet('sv', 2026, 12, 2, 19), 'Glad lillördag!');
  assert.equal(greet('sv', 2026, 12, 4, 12), 'Äntligen fredag!');
  assert.equal(greet('es', 2026, 12, 4, 12), '¡Ya es viernes!');
  assert.equal(greet('es', 2026, 12, 5, 22), '¡Buen finde!');
  // Fika am frühen Nachmittag jeden zweiten Tag
  const fika = [1, 2, 3].map(d => greet('sv', 2026, 12, d, 14));
  assert.ok(fika.includes('Dags för fika?') && fika.some(g => g !== 'Dags för fika?'), String(fika));
});

test('Vorrang: Fest, erster Tag, Rückkehr nach Pause, Tagwerk erledigt, zweiter Besuch', () => {
  // Lucia geht allem vor, auch dem erledigten Tagwerk
  assert.equal(greet('sv', 2026, 12, 13, 9, { extra:`DB.done['2026-12-13'] = true; DB.doneLang = { '2026-12-13': { sv: true } }` }), 'Glad lucia!');
  assert.equal(greet('sv', 2026, 12, 1, 9, { log:{} }), 'Nu kör vi!');
  assert.equal(greet('es', 2026, 12, 1, 9, { log:{} }), '¡Empezamos!');
  // Zuletzt vor drei Tagen geübt, heute noch nicht: Rückkehr; vor zwei Tagen (ein Pausetag) noch nicht
  assert.ok(GREET.sv.back.includes(greet('sv', 2026, 12, 4, 9, { log:{ '2026-12-01': { es:{ n:4 } } } })));
  assert.ok(!GREET.sv.back.includes(greet('sv', 2026, 12, 3, 9, { log:{ '2026-12-01': { sv:{ n:4 } } } })));
  assert.ok(GREET.es.back.includes(greet('es', 2026, 12, 10, 21, { log:{ '2026-12-01': { es:{ n:4 } } } })));
  // Tagwerk in dieser Sprache erledigt; in der anderen nicht
  const done = `DB.log['2026-12-01'] = { sv: { n: 12 } }; DB.done['2026-12-01'] = true; DB.doneLang = { '2026-12-01': { sv: true } }`;
  assert.ok(GREET.sv.done.includes(greet('sv', 2026, 12, 1, 19, { extra:done })));
  assert.ok(!GREET.es.done.includes(greet('es', 2026, 12, 1, 21, { extra:done })));
  // Heute schon etwas geübt
  assert.equal(greet('sv', 2026, 12, 1, 19, { extra:`DB.log['2026-12-01'] = { sv: { n: 3 } }` }), 'Hej igen!');
  assert.equal(greet('es', 2026, 12, 1, 19, { extra:`DB.log['2026-12-01'] = { es: { n: 3 } }` }), '¡Hola de nuevo!');
});

test('Feiertage: eigener Gruß je Sprache und Zeitraum, Einzeltage vor Zeiträumen; Feste ohne Gruß bekommen den gewöhnlichen', () => {
  const hol = (lang, t) => run(`(() => { const h = holidayGreet('${lang}', '${t}'); return h ? h.g + (h.orn ? ' ' + h.orn : '') : null; })()`);
  assert.equal(hol('sv', '2026-11-29'), 'Trevlig advent! candle');
  assert.equal(hol('sv', '2026-12-20'), 'Trevlig advent! candle');
  assert.equal(hol('sv', '2026-12-13'), 'Glad lucia! candle', 'Lucia am dritten Advent');
  assert.equal(hol('sv', '2028-12-24'), 'God jul! star', 'Heiligabend am vierten Advent');
  assert.equal(hol('sv', '2026-12-23'), 'Lillejulafton! star');
  assert.equal(hol('sv', '2026-12-26'), 'God jul! star');
  assert.equal(hol('sv', '2026-12-28'), 'God fortsättning!');
  assert.equal(hol('sv', '2027-01-01'), 'Gott nytt år! spark');
  assert.equal(hol('sv', '2027-03-27'), 'Glad påsk!', 'Påskafton');
  assert.equal(hol('sv', '2027-06-26'), 'Glad midsommar! sun', 'Midsommardagen');
  assert.equal(hol('es', '2026-12-24'), '¡Feliz Nochebuena! star');
  assert.equal(hol('es', '2026-12-28'), '¡No te fíes hoy!', 'Inocentes vor „¡Felices fiestas!“');
  assert.equal(hol('es', '2026-12-29'), '¡Felices fiestas!');
  assert.equal(hol('es', '2027-01-06'), '¡Felices Reyes! star');
  assert.equal(hol('es', '2027-03-28'), '¡Feliz Pascua!');
  assert.equal(hol('es', '2026-11-29'), null);
  // La Tomatina (letzter Mittwoch im August) und Alla helgons dag: der gewöhnliche Gruß, nicht der Satz aus dem Fundstück
  assert.ok(GREET.es.day.includes(greet('es', 2027, 8, 25, 12)), greet('es', 2027, 8, 25, 12));
  assert.ok(!/batalla/.test(greet('es', 2027, 8, 25, 12)));
  assert.ok(GREET.sv.day.includes(greet('sv', 2026, 10, 31, 12)), 'Alla helgons dag');
  // Jeder Eintrag hat in jedem Jahr ein Datum, jedes Wort ist nachschlagbar, höchstens 18 Zeichen
  for (const lang of ['sv', 'es']) {
    const rows = run(`HOLIDAY_GREET.${lang}.map(([rule, n, g, orn]) => [[2026, 2027, 2028, 2029, 2030].every(y => !!rule(y)), g, orn || ''])`);
    for (const [ok, g, orn] of rows) {
      assert.ok(ok, g); assert.ok(g.length <= 18, g); assert.ok(!orn || run(`!!ORN.${orn}`), orn);
      for (const w of tokens(g)) if (/[a-zà-ÿ]/i.test(w)) assert.ok(lookupWord(lang, w), `${lang}: ${w} (${g})`);
    }
  }
});

test('Kopf: Zeichen zum Feiertagsgruß, bewegt nur beim ersten Zeichnen am Tag; gewöhnliche Tage ohne Zeichen', () => {
  const html = () => run(`greetHtml('sv', new Date(2026, 11, 13, 9, 0))`);
  run('S.greetAnim = null');
  assert.match(html(), /Glad.*lucia.*<svg class="orn orn-candle go"/);
  assert.match(html(), /<svg class="orn orn-candle"/, 'beim zweiten Mal ohne Bewegung');
  assert.doesNotMatch(run(`greetHtml('sv', new Date(2026, 11, 1, 9, 0))`), /orn/);
  // Ohne Layout (Node) tut die Anpassung nichts
  run('fitGreeting()');
});

test('Stempel: je Tag fest gedreht (−6° bis +6°); Funken nur nach fehlerfreier Runde und an Etappentagen', () => {
  const tilts = new Set(Array.from({ length:60 }, (_, k) => run(`stampTilt(addDays('2026-12-01', ${k}))`)));
  assert.ok([...tilts].every(x => x >= -6 && x <= 6) && tilts.size >= 8, [...tilts].join(' '));
  assert.equal(run(`stampTilt('2026-12-01')`), run(`stampTilt('2026-12-01')`));
  assert.match(run(`stampSvg({ stamped:false }, true, false, true)`), /--tilt:-?\d+deg.*class="bu"/);
  assert.doesNotMatch(run(`stampSvg({ stamped:false }, true, false, false)`), /class="bu"/);
  assert.match(run(`stampSvg({ stamped:false }, true, true, false)`), /--bd:1.3s.*class="bu"/);
  assert.doesNotMatch(run(`stampSvg({ stamped:true }, true, true, true)`), /class="bu"/, 'beim Wiederzeichnen nicht noch einmal');
});

test('Datum im Kopf in der Zielsprache, antippbar: „lördag 28 november“, „sábado, 28 de noviembre“', () => {
  assert.equal(run(`dateIn('sv', new Date(2026, 10, 28))`), 'lördag 28 november');
  assert.equal(run(`dateIn('es', new Date(2026, 10, 28))`), 'sábado, 28 de noviembre');
  assert.equal(run(`dateIn('es', new Date(2027, 0, 6))`), 'miércoles, 6 de enero');
  assert.equal(run(`dateIn('sv', new Date(2027, 4, 4))`), 'tisdag 4 maj');
  for (const lang of ['sv', 'es']) {
    const W = run(`DATE_WORDS.${lang}`);
    for (const w of [...W.d, ...W.m]) assert.ok(lookupWord(lang, w), `${lang}: ${w}`);
  }
  const head = run(`(() => { DB = freshDB(); S.lang = 'es'; S.view = 'home'; return viewHome(); })()`);
  assert.match(head, /<p class="hello-d" lang="es"><span data-a="lookup" data-w="[a-záéíóú]+">[a-záéíóú]+,<\/span> \d+ <span data-a="lookup" data-w="de">de<\/span> <span data-a="lookup" data-w="[a-z]+">[a-z]+<\/span><\/p>/);
  assert.match(run(`dateHtml('sv', new Date(2026, 10, 28))`), /^<span data-a="lookup" data-w="lördag">lördag<\/span> 28 <span data-a="lookup" data-w="november">november<\/span>$/);
});

test('Zuruf am Rundenende: nach dem Ergebnis auf Anhieb, nur in der Zielsprache, antippbar; Titel klein und deutsch', () => {
  const Z = app.get('ZURUF'), z = (lang, ok, total, perfect) => run(`zurufFor('${lang}', ${ok}, ${total}, ${perfect})`);
  assert.ok(Z.sv.perfect.includes(z('sv', 10, 10, true)));
  assert.ok(Z.sv.good.includes(z('sv', 2, 2, true)), 'unter drei Aufgaben kein „fehlerfrei“');
  assert.ok(Z.es.good.includes(z('es', 10, 12, false)));
  assert.ok(Z.es.mid.includes(z('es', 7, 12, false)));
  assert.ok(Z.sv.low.includes(z('sv', 1, 12, false)));
  assert.equal(z('sv', 1, 12, false), z('sv', 1, 12, false), 'fest beim Neuzeichnen');
  for (const lang of ['sv', 'es']) for (const g of Object.values(Z[lang]).flat()) {
    assert.ok(g.length <= 16, g);
    for (const w of tokens(g)) if (/[a-zà-ÿ]/i.test(w)) assert.ok(lookupWord(lang, w), `${lang}: ${w} (${g})`);
  }
  assert.match(lookupWord('sv', 'klockrent').de, /perfekt/);
  // Im Rundenende: Titel als kleine Überschrift, Zuruf daneben; ohne beantwortete Aufgabe wie bisher nur der Titel
  const done = n => run(`(() => { DB = freshDB(); S.run = { kind:'quick', lang:'es', queue:[], idx:0, ok:${n}, bad:${10 - n}, res:Array.from({ length:10 }, (_, k) => ({ good:k < ${n} })), combo:0, best:0, stamped:true }; S.view = 'runDone'; return viewRunDone(); })()`);
  const h = done(10);
  assert.match(h, /<div class="done-top"><div class="done-tt"><h1 class="done-h done-st">Runde beendet<\/h1><p class="done-z wordrow" lang="es"><span data-a="lookup" data-w="[^"]+"><span class="hang">¡<\/span>/, '¡ hängt vor der Kante, die Buchstaben fluchten mit dem Titel');
  assert.doesNotMatch(h, /Fehlerfrei/);
  assert.match(run(`(() => { S.run.ok = 0; S.run.bad = 0; S.run.res = []; return viewRunDone(); })()`), /<h1 class="done-h">Runde beendet<\/h1>/);
  run('S.run = null; S.view = "home"');
});

test('Heute, „Höchste Fehlerquoten“: Antippen öffnet das Themenblatt, von dort „10 Aufgaben üben“', () => {
  run(`(() => { DB = freshDB(); DB.tlog = { [today()]: { es: { 'p:condicional':[40, 16], 'p:prep':[24, 10], 'p:perfecto':[20, 9], 'p:porpara':[30, 1], 'p:serestar':[30, 1], 't:gap':[150, 37] } } }; })()`);
  const html = run(`weakHtml('es')`), ids = run(`weakTopics('es').map(x => x.id)`);
  assert.equal(ids.length, 3);
  for (const id of ids) assert.match(html, new RegExp(`<button type="button" data-a="topic" data-t="${id}" class="row mrowh"`));
  assert.doesNotMatch(html, /trapgo/);
  const sheet = run(`(() => { S.view = 'home'; openTopic('es', '${ids[0]}', 'rule'); return topicSheetHtml(S.pop); })()`);
  assert.match(sheet, new RegExp(`data-a="trapgo" data-l="es" data-t="${ids[0]}">10 Aufgaben üben`));
  run('S.pop = null');
});
