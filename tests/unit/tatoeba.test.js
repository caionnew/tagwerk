// Nachschub von Tatoeba: Suchplan (Schwerpunkt zuerst, anspruchsvolle Muster bei „Fortgeschritten“, Themenwort statt Zufall)
// und Filter gegen Einerlei (Tom und Mary, fast gleiche Sätze, sehr häufige Satzanfänge).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const val = code => JSON.parse(JSON.stringify(app.run(code)));
test('Suchmuster: jedes Thema hat genug Auswahl, alle Themen gibt es, bei „Fortgeschritten“ eigene Muster', () => {
  for (const lang of ['sv', 'es']) {
    const q = val(`TAT_Q.${lang}`), adv = val(`TAT_ADV.${lang}`), traps = val(`TRAPS.${lang}.map(t => t.id)`);
    for (const [k, v] of Object.entries(q)) {
      assert.ok(traps.includes(k), `${lang}: Thema ${k} fehlt`);
      assert.ok(v.length >= 6, `${lang}/${k}: nur ${v.length} Suchmuster`);
      assert.equal(new Set(v).size, v.length, `${lang}/${k}: doppelte Muster`);
    }
    for (const [k, v] of Object.entries(adv)) { assert.ok(q[k], `${lang}: ${k} nur in TAT_ADV`); assert.ok(v.length >= 5, `${lang}/${k}`); }
    assert.ok(val(`TAT_THEMES.${lang}`).length >= 15);
    assert.ok(q[lang === 'sv' ? 'falska' : 'falsos'].length >= 20, 'falsche Freunde aus der Liste');
  }
});
test('Suchplan: Schwerpunkt der Woche zuerst, drei Themen, dann ein Themenwort; „Fortgeschritten“ nimmt TAT_ADV', () => {
  app.run(`DB.focus = { sv:{ trap:'passiv', week:mondayOf(today()) } }`);
  const plan = val(`tatPlan('sv', true, 3)`);
  assert.equal(plan.length, 4);
  assert.equal(plan[0].trap, 'passiv');
  assert.ok(val(`TAT_ADV.sv.passiv`).includes(plan[0].q));
  assert.equal(new Set(plan.slice(0, 3).map(p => p.trap)).size, 3);
  assert.equal(plan[3].trap, 'eigene');
  assert.ok(val(`TAT_THEMES.sv`).includes(plan[3].q));
  const easy = val(`tatPlan('sv', false, 3)`);
  assert.ok(val(`TAT_Q.sv.passiv`).includes(easy[0].q));
});
test('Filter: Tom und Mary raus, fast gleiche Sätze raus, häufige Anfänge raus, Neues bleibt', () => {
  const s = (t, extra) => app.run(`(() => { const p = tatPool('sv'); ${extra || ''}; return tatSamey('sv', ${JSON.stringify(t)}, p); })()`);
  assert.equal(s('Tom säger att Mary aldrig har varit i Paris.'), true);
  const b = app.get('BANK').sv.find(i => i.target.split(' ').length >= 6).target;
  assert.equal(s(b.replace(/\.$/, '!')), true, 'fast derselbe Satz wie in der Satzbank');
  assert.equal(s('Jag vet att forskarna har hittat en ny art i regnskogen.', "p.starts['jag vet'] = 9"), true, 'Satzanfang schon sehr häufig');
  assert.equal(s('Forskarna har hittat en ny fågelart i regnskogen.'), false);
  assert.equal(s('Den tomma lådan stod kvar i hallen.'), false, 'tom als Adjektiv ist kein Name');
});
test('Nachschub: nimmt brauchbare Sätze, lässt Tom, Dubletten und Bekanntes weg, Thema laut Suchplan', async () => {
  const bank = app.get('BANK').sv, known = bank[0].target;
  app.run(`DB.settings.refill = true; DB.settings.niveau = 'fort'; navigator.onLine = true; DB.tatFetch = {}; DB.tat.sv = [];
    BANK.sv.forEach(i => { DB.st[i.id] = { s:5, d:5, ivl:3, last:today(), due:today(), reps:1, ok:1, bad:0, alts:[] }; });`);
  const sent = (id, text) => ({ id, text, owner:'x', license:'CC BY 2.0 FR', translations:[[{ lang:'deu', text:'Übersetzung ' + id, is_direct:true }]], audios:[] });
  const data = [sent(1, 'Tom har aldrig varit i Stockholm förut.'), sent(2, known), sent(3, 'Regeringen presenterade i går en ny plan för landsbygden.'),
    sent(4, 'Regeringen presenterade i går en ny plan för landsbygden!'), sent(5, 'Hon hade redan lämnat festen när vi kom fram.')];
  const urls = [];
  app.run('globalThis.fetch = null');
  const sandbox = app.run('globalThis');
  sandbox.URLSearchParams = URLSearchParams; // fehlt in der Test-VM, im Browser vorhanden
  sandbox.fetch = async url => { urls.push(String(url)); return { ok:true, json:async () => ({ data }) }; };
  const n = await app.run(`refill('sv')`);
  const tat = val('DB.tat.sv');
  assert.equal(urls.length, 4, 'vier Suchen');
  assert.ok(decodeURIComponent(urls[0]).includes('word_count=6-14'));
  assert.equal(n, 2);
  assert.deepEqual(tat.map(t => t.target).sort(), ['Hon hade redan lämnat festen när vi kom fram.', 'Regeringen presenterade i går en ny plan för landsbygden.']);
  assert.ok(tat.every(t => t.auto && t.de.startsWith('Übersetzung')));
});
