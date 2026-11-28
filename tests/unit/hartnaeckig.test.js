// Fehlerquellen, Reiter „Sätze“: hartnäckige Sätze in beiden Sprachen gleich, mit gemeinsamem Thema.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const J = code => JSON.parse(JSON.stringify(app.run(code)));

// Zwei Sätze aus demselben Thema, drei aus anderen; Stände so gesetzt, dass genau die ersten beiden zählen
function setup(lang){
  return J(`(() => {
    DB.st = {}; DB.tlog = {}; S.errTab = null;
    const items = BANK.${lang}.filter(i => i.trap && trapMeta('${lang}', i.trap));
    const a = items[0], b = items.find(i => i.trap === a.trap && i !== a);
    const rest = items.filter(i => i.trap !== a.trap).slice(0, 3);
    const st = (lapses, ivl, ago, bad) => ({ s:2, d:7, ivl, last:addDays(today(), -ago), due:addDays(today(), ivl - ago), ok:2, bad:bad || lapses, lapses, reps:2, alts:[] });
    DB.st[a.id] = st(3, 6, 2);
    DB.st[b.id] = st(2, 4, 1);
    DB.st[rest[0].id] = st(2, 30, 3);        // gefestigt: zählt nicht mehr
    DB.st[rest[1].id] = st(1, 3, 1, 5);      // oft falsch, aber nur beim ersten Kontakt: zählt nicht
    DB.st[rest[2].id] = st(4, 5, 40);        // seit über 30 Tagen nicht geübt: zählt nicht
    return { a:a.id, b:b.id, trap:a.trap, label:trapLabel('${lang}', a.trap) };
  })()`);
}

for (const lang of ['sv', 'es']) {
  test(`Hartnäckige Sätze (${lang}): nur mehrmals vergessen, nicht gefestigt, kürzlich geübt; gemeinsames Thema erkannt`, () => {
    const x = setup(lang);
    const list = J(`hardSentences('${lang}').map(i => i.id)`);
    assert.deepEqual(list, [x.a, x.b]);
    assert.deepEqual(J(`hardPattern('${lang}', hardSentences('${lang}'))`), { trap:x.trap, n:2 });
    // Keine Übungsarten mit Daten: Die Karte öffnet direkt mit „Sätze“
    const html = app.run(`errorWaysHtml('${lang}')`);
    assert.ok(html.includes('aria-checked="true" data-a="errtab" data-t="s"'), 'Reiter „Sätze“ vorgewählt');
    assert.ok(html.includes(`steckt in 2 von 2 Sätzen`));
    assert.equal((html.match(/class="mrow msent( mlast)?"/g) || []).length, 2, 'Satzzeilen im selben Aufbau wie die anderen Reiter');
    assert.match(html, /<span class="msub stp">/);
    assert.ok(html.includes(`data-a="topic" data-t="${x.trap}"`), 'Antippen öffnet die Regel');
    assert.ok(!html.includes('data-a="hard"'), 'kein Extra-Üben-Knopf');
  });
}

test('Ohne Daten und ohne hartnäckige Sätze keine Karte', () => {
  app.run(`DB.st = {}; DB.tlog = {}; S.errTab = null;`);
  const html = app.run(`errorWaysHtml('es')`);
  assert.equal(html, '');
});
