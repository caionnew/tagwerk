// Zielsprache je Niveau (24.92.0): Ab „Mittel“ die Serie im Kopf („5 dagar i rad“, „5 días seguidos“), bei „Fortgeschritten“ dazu
// die Anweisungen der Aufgaben, Deutsch auf Tipp. „Grundlagen“ bleibt deutsch.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => app.run(code);
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const strip = (lang, niv, extra = '') => text(run(`(() => { DB = freshDB(); DB.settings.niveau = ${niv ? `'${niv}'` : 'undefined'}; S.lang = '${lang}'; ${extra}; return weekStrip().count; })()`));

test('Serie im Kopf: ab „Mittel“ in der Zielsprache, bei „Grundlagen“ deutsch; vorgelesen wird deutsch', () => {
  const days = n => `DB.log = {}; DB.done = {}; for (let k = 1; k <= ${n}; k++) { const d = addDays(today(), -k); DB.log[d] = { sv: { n: 10 }, es: { n: 10 } }; DB.done[d] = true; }`;
  assert.equal(strip('sv', 'grund', days(5)), '5 in Folge');
  assert.equal(strip('sv', 'mittel', days(5)), '5 dagar i rad');
  assert.equal(strip('sv', null, days(1)), '1 dag i rad', 'ohne Einstellung gilt „Mittel“');
  assert.equal(strip('es', 'fort', days(5)), '5 días seguidos');
  assert.equal(strip('es', 'fort', days(1)), '1 día seguido');
  assert.equal(strip('sv', 'mittel'), 'Serien börjar i dag');
  assert.equal(strip('es', 'mittel'), 'Hoy empieza la racha');
  assert.equal(strip('es', 'grund'), 'Serie startet heute');
  assert.match(run(`(() => { DB.settings.niveau = 'mittel'; S.lang = 'sv'; return weekStrip().strip; })()`), /aria-label="0 Tage in Folge/);
});

test('Anweisungen: bei „Fortgeschritten“ in der Zielsprache, Tipp zeigt sie deutsch; sonst deutsch', () => {
  run(`DB = freshDB(); DB.settings.niveau = 'fort'`);
  assert.equal(run(`kick('Ergänze die Lücke', 'sv', {})`), '<button type="button" class="kick-tl" data-a="kickde" lang="sv" title="Ergänze die Lücke">Fyll i luckan</button>');
  assert.match(run(`kick('Übersetze ins Spanische', 'es', {})`), />Traduce al español</);
  assert.equal(run(`kick('Ergänze die Lücke', 'sv', { kickDe: true })`), 'Ergänze die Lücke');
  assert.match(run(`kick('Aus „Vasaloppet“', 'sv', {})`), />Ur ”Vasaloppet”</);
  assert.match(run(`kick('Aus „La siesta“', 'es', {})`), />Del texto «La siesta»</);
  assert.match(run(`kick('Nachgeschlagen in „Regalskeppet Vasa“', 'sv', {})`), />Uppslaget i ”Regalskeppet Vasa”</);
  assert.match(run(`kick('Ergänze aus dem Text', 'es', {})`), />Completa con el texto</);
  assert.equal(run(`kick('Irgendwas Neues', 'sv', {})`), 'Irgendwas Neues', 'ohne Übersetzung deutsch');
  run(`DB.settings.niveau = 'mittel'`);
  assert.equal(run(`kick('Ergänze die Lücke', 'sv', {})`), 'Ergänze die Lücke');
});

test('jede Anweisung, die eine Aufgabe zeigen kann, hat eine Übersetzung in ihrer Sprache', () => {
  const G = app.get('GENS'), kickTL = app.get('kickTL'), miss = new Set();
  for (const k of Object.keys(G)) for (let i = 0; i < 120; i++) {
    const d = G[k].make(); if (!d || !d.label) continue;
    if (!kickTL(G[k].lang, d.label)) miss.add(`${G[k].lang}: ${d.label}`);
  }
  const fixed = ['Ergänze die Lücke', 'Bring die Wörter in die richtige Reihenfolge', 'Ein Wort bleibt übrig', 'Hör zu und schreib den Satz auf', 'echte Aufnahme',
    'Tipp auf das falsche Wort. Stimmt der Satz, tipp auf „Kein Fehler“.', 'Gefunden. Wie heißt es richtig?', 'Hör zu und schreib die Uhrzeit als Zahl', 'Hör zu und schreib den Preis als Zahl'];
  for (const lang of ['sv', 'es']) for (const de of [...fixed, `Übersetze ${run(`LANG.${lang}.deAcc`)}`]) if (!kickTL(lang, de)) miss.add(`${lang}: ${de}`);
  assert.deepEqual([...miss], []);
});

test('In der Aufgabe: Lücke bei „Fortgeschritten“ mit „Fyll i luckan“, nach dem Tipp deutsch', () => {
  const html = run(`(() => { DB = freshDB(); DB.settings.niveau = 'fort'; const it = BANK.sv.find(i => i.gap && i.trap === 'tempus' && !i.own && !i.tat);
    S.run = { kind:'quick', lang:'sv', queue:[{ type:'cloze', id:it.id }], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
    S.run.cur = { input:'', state:'answer' }; return viewRun(); })()`);
  assert.match(html, /<p class="kicker"><button type="button" class="kick-tl" data-a="kickde" lang="sv" title="Ergänze die Lücke">Fyll i luckan<\/button>/);
  const de = run(`(() => { S.run.cur.kickDe = true; return viewRun(); })()`);
  assert.match(de, /<p class="kicker">Ergänze die Lücke/);
  run('S.run = null; S.view = "home"');
});
