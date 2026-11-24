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
  // Schwächstes Thema außerhalb der Runde, sicher über dem Schnitt (Fehlermodell); ser/estar war in der Runde
  app.run(`DB.tlog = { '${d}': { es:{ 'p:pasado':[20, 11], 'p:serestar':[10, 5], 'p:gustar':[30, 2], 'p:prep':[30, 2] } } };`);
  const html = app.get('nextTopicHtml')(r);
  assert.match(html, /Indefinido vs\. Imperfecto/); assert.match(html, /geschätzt \d+\u00a0% falsch/);
  assert.equal(app.get('nextTopicHtml')(Object.assign({}, r, { bad:1 })), '');
});
test('jede Fehlerart einzeln: genau eine Fehlerstelle, die Verbesserung passt zum richtigen Satz', () => {
  const CATS = app.get('SPOT_CATS');
  for (const lang of ['sv', 'es']) for (const k of Object.keys(CATS[lang])) for (let i = 0; i < 40; i++) {
    const d = CATS[lang][k](), shown = d.words.join(' ');
    assert.notEqual(shown.toLowerCase(), d.full.toLowerCase(), `${lang}/${k}: ${shown}`);
    assert.ok(d.wrong.length && d.wrong.every(x => x >= 0 && x < d.words.length), `${lang}/${k}: ${shown}`);
    assert.equal(d.trap, k === 'bisats' || k === 'inversion' ? d.trap : k, `${lang}/${k}`);
    assert.ok(d.note, `${lang}/${k}: ohne Erklärung`);
    if (d.fix) assert.ok(d.fix.some(f => d.full.toLowerCase().includes(f.toLowerCase())), `${lang}/${k}: ${d.full} / ${d.fix}`);
  }
});
test('sin/hans aus der Satzbank: nur wo „sin“ nicht stehen kann, mit passender Form und Besitzer zum Eintippen', () => {
  const all = app.get('bankSpotsSv')().map(f => f()), by = Object.fromEntries(all.map(d => [d.words.join(' '), d]));
  assert.equal(by['Lisa och sin man bor i Lund.'].fix.join(), 'hennes');
  assert.equal(by['Jonas tror att sina kollegor inte gillar honom.'].fix.join(), 'hans');
  assert.equal(by['Grannarna och sin hund har rest bort.'].fix.join(), 'deras');
  assert.equal(by['Jag lånar sin bil.'].fix.join(), 'hans');
  assert.ok(by['Företaget och sina kunder har kommit överens.'].fix.includes('dess'));
  // „Peter tycker om sin syster“ wäre ein richtiger Satz (seine eigene Schwester), also keine Aufgabe
  assert.ok(!Object.keys(by).some(s => s.startsWith('Peter tycker om')));
});
test('gustar & Co.: Einzahl und Mehrzahl vertauscht, ohne „me da igual“ und ohne Wendungen aus zwei Wörtern', () => {
  const all = app.get('bankSpotsEs')().filter(f => f.trap === 'gustar').map(f => f().words.join(' '));
  assert.ok(all.includes('Me gusta los libros.') && all.includes('Me duele los pies.') && all.includes('Me encantan la música.'));
  assert.ok(all.every(s => !/\bdan? (igual|pena)\b/.test(s)), all.find(s => /\bdan? /.test(s)));
});
test('Auswahl nach Wahrscheinlichkeit: wacklige Themen öfter, sichere seltener, die letzte Art halb so oft, nichts ausgeschlossen', () => {
  const d = app.get('today')();
  app.run(`DB.tlog = { '${d}': { es:{ 'p:serestar':[20, 0], 'p:subjuntivo':[20, 10] } } }; DB.used = DB.used || {}; DB.used.spotLast = { es:'porpara' };`);
  const w = app.get('spotWeights')('es');
  assert.ok(w.subjuntivo > w.prep && w.prep > w.serestar, JSON.stringify(w));
  // 0 von 20 falsch → 0,6; 10 von 20 falsch → 1,6 (geglättet mit einem Fehler auf fünf Aufgaben vorweg)
  assert.ok(Math.abs(w.serestar - 0.6) < 1e-9 && Math.abs(w.subjuntivo - 1.6) < 1e-9, JSON.stringify(w));
  assert.equal(w.porpara * 2, w.prep);
  // Arten aus der Satzbank mit weniger als 12 Sätzen kommen anteilig seltener (Gewicht = Sätze / 12, höchstens 1)
  for (const [lang, k] of [['sv', 'sin'], ['es', 'subjuntivo'], ['es', 'perfecto'], ['es', 'gustar']]) {
    const n = app.run(`bankSpots('${lang}').filter(f => f.trap === '${k}').length`);
    assert.equal(app.get('spotWeight')(lang, k), Math.min(1, n / 12), k);
  }
  assert.ok(Object.values(w).every(x => x > 0));
  // Gedächtnis erst beim Zeigen
  app.get('spotSeen')('es', { cat:'gustar' });
  assert.equal(app.run('DB.used.spotLast.es'), 'gustar');
  app.run('DB.tlog = {}; DB.used.spotLast = {};');
});
test('Themenblatt: typischer Fehler jetzt auch für sin, gustar, Präpositionen und Konnektoren', () => {
  const te = app.get('typicalError');
  for (const [lang, trap] of [['sv', 'sin'], ['es', 'gustar'], ['sv', 'prep'], ['es', 'verbind'], ['sv', 'inversion']]) {
    const d = te(lang, trap); assert.ok(d && d.wrong.length && d.trap === trap, `${lang}/${trap}`);
  }
});
test('Indefinido aus der Satzbank: genug Sätze, auch mit „hace …“ und reflexiv, Erklärung nennt beide Formen', () => {
  const all = app.get('bankSpotsEs')().filter(f => f.trap === 'perfecto').map(f => f());
  assert.ok(all.length >= 20, String(all.length));
  const nos = all.find(d => d.full === 'Nos casamos hace dos años.');
  assert.equal(nos.words.join(' '), 'Nos hemos casado hace dos años.');
  assert.match(nos.note, /„hace dos años“.*nos casamos, nicht nos hemos casado/);
  assert.ok(nos.fix.includes('casamos'));
  const lun = all.find(d => d.full === 'El lunes pasado empezó el curso.');
  assert.match(lun.note, /„el lunes pasado“.*empezó, nicht ha empezado/);
});
