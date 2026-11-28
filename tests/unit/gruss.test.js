// Begrüßung auf „Heute“ (24.89.0): jeden Tag eine andere, innerhalb der Tageszeit dieselbe; Vorrang für Fest, ersten Tag,
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
