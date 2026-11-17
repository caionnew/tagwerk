// Fehler finden: richtige Sätze gehören dazu, die gefundene Stelle wird bei Formen verbessert, Ablauf von Antippen und Prüfen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const GENS = app.get('GENS');
const items = lang => Array.from({ length:400 }, () => GENS['spot_' + lang].make());
test('jede Aufgabe ist eindeutig: richtiger Satz ohne Fehlerstelle oder fehlerhafter Satz mit genau einer Abweichung vom richtigen', () => {
  for (const lang of ['sv', 'es']) for (const d of items(lang)) {
    const shown = d.words.join(' ');
    // Satzzeichen am Ende wie im richtigen Satz, sonst verrät das fehlende „.“ den Fehler
    assert.equal(shown.slice(-1), d.full.slice(-1), shown);
    if (!d.wrong.length) { assert.equal(shown, d.full); assert.equal(d.fix, null); continue; }
    assert.notEqual(shown.replace(/[.!?]$/, '').toLowerCase(), d.full.replace(/[.!?]$/, '').toLowerCase(), shown);
    assert.ok(d.wrong.every(i => i >= 0 && i < d.words.length), shown);
    if (d.fix) assert.ok(d.fix.length && d.fix.every(Boolean) && d.full.toLowerCase().includes(d.fix[0].split(' ')[0].toLowerCase()), `${shown}: ${d.fix}`);
  }
});
test('richtige Sätze: festgelegt über den Würfelwurf, sonst unverändert', () => {
  const spotVariant = app.get('spotVariant'), d = app.get('spotTempusSv')();
  const ok = spotVariant(d, 0.1), same = spotVariant(d, 0.9);
  assert.equal(ok.wrong.length, 0); assert.equal(ok.words.join(' '), d.full); assert.equal(ok.fix, null);
  assert.equal(same, d);
});
test('geänderte Wörter der Lösung auch bei kürzerer Verbesserung', () => {
  const ch = app.get('spotChanged');
  assert.equal([...ch(['Ayer', 'he', 'ido', 'al', 'cine.'], ['Ayer', 'fui', 'al', 'cine.'])].join(), '1');
  assert.equal([...ch(['Igår', 'har', 'jag', 'ätit', 'pizza.'], ['Igår', 'åt', 'jag', 'pizza.'])].join(), '1');
  assert.equal([...ch(['Pablo', 'es', 'en', 'el', 'tren.'], ['Pablo', 'está', 'en', 'el', 'tren.'])].join(), '1');
});
// Ablauf ohne Oberfläche: Antippen (choose) und Prüfen (check)
const base = { kind:'spot', deLine:'x', note:'n', trap:'serestar', label:'' };
const RIGHT = Object.assign({}, base, { words:['Pablo', 'está', 'en', 'el', 'tren.'], wrong:[], full:'Pablo está en el tren.', answers:['Pablo está en el tren.'], fix:null });
const WRONG = Object.assign({}, base, { words:['Pablo', 'es', 'en', 'el', 'tren.'], wrong:[1], full:'Pablo está en el tren.', answers:['Pablo está en el tren.'], fix:null });
const FORM = Object.assign({}, base, { trap:'subjuntivo', words:['Espero', 'que', 'vienes.'], wrong:[2], full:'Espero que vengas.', answers:['Espero que vengas.'], fix:['vengas'] });
function play(data, steps){
  app.run(`S.run = { kind:'form', lang:'es', queue:[{ type:'gen', gen:'spot_es', data:${JSON.stringify(data)} }], idx:0, ok:0, bad:0, res:[], missed:[], cur:{ input:'', state:'answer', result:null } };`);
  for (const [k, v] of steps) app.run(k === 'tap' ? `choose(${JSON.stringify(v)})` : `S.run.cur.input = ${JSON.stringify(v)}; check()`);
  return app.run('S.run.cur');
}
test('richtiger Satz: „Kein Fehler“ ist richtig, ein angetipptes Wort falsch', () => {
  assert.equal(play(RIGHT, [['tap', 'none']]).result, 'ok');
  assert.equal(play(RIGHT, [['tap', '1']]).result, 'bad');
});
test('fehlerhafter Satz: „Kein Fehler“ und ein falsches Wort sind falsch, die Stelle ist richtig', () => {
  const none = play(WRONG, [['tap', 'none']]); assert.equal(none.result, 'bad'); assert.ok(none.none);
  assert.equal(play(WRONG, [['tap', '0']]).result, 'bad');
  assert.equal(play(WRONG, [['tap', '1']]).result, 'ok');
});
test('Formfehler: erst finden, dann die richtige Form; Akzent fehlt = fast richtig, ganzer Satz zählt auch', () => {
  const found = play(FORM, [['tap', '2']]);
  assert.equal(found.fixing, true); assert.equal(found.result, null); assert.equal(found.state, 'answer');
  assert.equal(play(FORM, [['tap', '2'], ['type', 'vengas']]).result, 'ok');
  assert.equal(play(FORM, [['tap', '2'], ['type', 'Espero que vengas.']]).result, 'ok');
  const bad = play(FORM, [['tap', '2'], ['type', 'vienes']]); assert.equal(bad.result, 'bad'); assert.ok(bad.fixBad);
  assert.equal(play(FORM, [['tap', '0']]).result, 'bad');
});
test('Rundenthemen nach dem Thema der erzeugten Aufgabe; nach fehlerfreier Runde das schwächste andere Thema', () => {
  const roundTopics = app.get('roundTopics');
  const r = { lang:'es', kind:'form', ok:4, bad:0, res:[{ good:true, gen:'spot_es', trap:'serestar' }, { good:true, gen:'spot_es', trap:'porpara' }, { good:true, gen:'spot_es', trap:'serestar' }, { good:true, gen:'spot_es', trap:'subjuntivo' }] };
  assert.equal(roundTopics(r).map(t => t.trap).sort().join(), 'porpara,serestar,subjuntivo');
  const d = app.get('today')();
  app.run(`DB.tlog = { '${d}': { es:{ 'p:pasado':[10, 4], 'p:serestar':[10, 5], 'p:gustar':[3, 3] } } };`);
  const html = app.get('nextTopicHtml')(r);
  assert.match(html, /Indefinido vs\. Imperfecto/); assert.match(html, /4 von 10/);
  assert.equal(app.get('nextTopicHtml')(Object.assign({}, r, { bad:1 })), '');
});
