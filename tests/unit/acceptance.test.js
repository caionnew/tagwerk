// Richtige Antworten werden erkannt: Schreibvarianten, Zahlen, Synonyme, Tippfehler.
// Und umgekehrt: echte Grammatikfehler bleiben Fehler, auch wenn nur ein Buchstabe anders ist.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const judgeX = app.get('judgeX'), BANK = app.get('BANK'), GENS = app.get('GENS'), judgeOpts = app.get('judgeOpts');
const res = (input, answers, lang, opt) => (judgeX(input, answers, lang, opt) || {}).res;

test('Satzbank: jede Zielfassung und jede Alternative wird erkannt, auch klein, ohne Satzzeichen, mit Leerzeichen', () => {
  const bad = [];
  for (const lang of ['sv', 'es']) for (const it of BANK[lang]) {
    const answers = [it.target].concat(it.alts);
    for (const a of answers) {
      for (const v of [a, a.toLowerCase(), a.replace(/[.!?¡¿,]/g, ''), '  ' + a.replace(/ /g, '  ') + ' ']) if (res(v, answers, lang) !== 'ok') bad.push(`${lang}: ${v}`);
    }
  }
  assert.deepEqual(bad, []);
});
test('Schwedisch: i dag/idag, Ziffern, arbeta/jobba, mej/mig, sen/sedan gelten als gleich', () => {
  const cases = [
    ['Jag jobbar inte i dag.', 'Idag jobbar jag inte.', false],
    ['Idag arbetar jag inte.', 'Idag jobbar jag inte.', true],
    ['Klockan 8 börjar kursen.', 'Klockan åtta börjar kursen.', true],
    ['Kan du ringa mej?', 'Kan du ringa mig?', true],
    ['Vi träffades för tre år sen.', 'Vi träffades för tre år sedan.', true],
    ['Han har jobbat här i 2 år.', 'Han har arbetat här i två år.', true]
  ];
  for (const [input, answer, ok] of cases) assert.equal(res(input, [answer], 'sv') === 'ok', ok, input);
});
test('Spanisch: Ziffern und fehlendes Subjektpronomen', () => {
  assert.equal(res('Tengo 2 hermanos.', ['Tengo dos hermanos.'], 'es'), 'ok');
  assert.equal(res('Yo tengo dos hermanos.', ['Tengo dos hermanos.'], 'es'), 'ok');
  assert.equal(res('Tengo dos hermanos', ['Tengo dos hermanos.'], 'es'), 'ok');
});
test('Tippfehler: vertauscht, Nachbartaste, Doppelbuchstabe zählen als „fast richtig“ mit Hinweis', () => {
  const cases = [
    ['Han promenrear ofta i skogen.', 'Han promenerar ofta i skogen.'],
    ['Han promwnerar ofta i skogen.', 'Han promenerar ofta i skogen.'],
    ['Vi ser inte skilnaden.', 'Vi ser inte skillnaden.'],
    ['Paketet levererras i morgon.', 'Paketet levereras i morgon.'],
    ['Necesito el infirme para el lunes.', 'Necesito el informe para el lunes.']
  ];
  for (const [input, answer] of cases) {
    const lang = /necesito/i.test(answer) ? 'es' : 'sv';
    const j = judgeX(input, [answer], lang);
    assert.equal(j.res, 'near', input);
    assert.equal(j.why.kind, 'typo', input);
  }
});
test('Kein Tippfehler, sondern Fehler: Endungen, Stammwechsel, zwei Fehler, geschützte Wörter', () => {
  const cases = [
    ['sv', 'Det stora huset är gammalt.', 'Det stort huset är gammalt.'],
    ['sv', 'Igår läste jag boken.', 'Igår läst jag boken.'],
    ['es', 'Pienso mucho en ti.', 'Penso mucho en ti.'],
    ['es', 'Quiero que viajes en verano.', 'Quiero que viajas en verano.'],
    ['sv', 'Han promenerar ofta i skogen.', 'Han promenrear oftaa i skogen.'],
    ['sv', 'Vi tittade på filmen.', 'Vi tittadr på filmen.']
  ];
  for (const [lang, answer, input] of cases) assert.equal(res(input, [answer], lang), 'bad', input);
  // geschütztes Wort: das Lückenwort bzw. Schlüsselwort der Aufgabe
  assert.equal(res('Jag har pluggat svenska sedan mrs.', ['Jag har pluggat svenska sedan mars.'], 'sv', { protect:['mars'] }), 'bad');
  assert.equal(res('Igår trfäade jag en gammal vän.', ['Igår träffade jag en gammal vän.'], 'sv', { protect:['träffade'] }), 'bad');
});
test('Uhrzeit ausschreiben und Lückenwörter: keine Ziffern, keine Tippfehler-Kulanz', () => {
  const time = { type:'gen', gen:'time_sv', data:{ kind:'time', mode:'write', answers:['kvart över åtta'] } };
  assert.equal(res('kvart över 8', time.data.answers, 'sv', judgeOpts(time)), 'bad');
  const gap = { type:'gen', gen:'conj', data:{ gap:true, answers:['hablamos'] } };
  assert.equal(res('hablamso', gap.data.answers, 'es', judgeOpts(gap)), 'bad');
});
test('Erzeugte Aufgaben: die Musterlösung und alle Alternativen werden immer erkannt (je 200)', () => {
  const bad = [];
  for (const g of Object.keys(GENS)) for (let k = 0; k < 200; k++) {
    const d = GENS[g].make();
    if (!d || !d.answers || d.kind === 'spot' || d.kind === 'genus') continue;
    const ex = { type:'gen', gen:g, data:d };
    for (const a of d.answers) if (res(a, d.answers, GENS[g].lang, judgeOpts(ex)) !== 'ok') bad.push(`${g}: ${a}`);
  }
  assert.deepEqual([...new Set(bad)].slice(0, 10), []);
});
test('Lösungsanzeige: „imorgon“ getippt markiert „i morgon“ nicht als falsch, und umgekehrt', () => {
  const d = (t, y) => app.run(`diffHtml(${JSON.stringify(t)}, ${JSON.stringify(y)}, 'sv')`);
  const a = d('Det kommer att regna i morgon.', 'Det kommer att regna imorgon');
  assert.doesNotMatch(a.html, /w-miss|w-near/);
  assert.equal(a.score, 1);
  const b = d('Jag vet att han inte kommer idag.', 'Jag vet att han inte kommer i dag');
  assert.doesNotMatch(b.html, /w-miss|w-near/);
  assert.match(d('Det kommer att regna i morgon.', 'Det kommer att snöa imorgon').html, /w-miss[^>]*>regna</);
  assert.equal(app.run(`judgeX('Det kommer att regna imorgon', ['Det kommer att regna i morgon.'], 'sv').res`), 'ok');
});
test('Übersetzen: „har“ darf im schwedischen Nebensatz fehlen, nicht im Hauptsatz und nicht im Diktat', () => {
  const item = BANK.sv.find(i => i.target === 'Han påstår att han aldrig har fått mejlet.');
  const opt = judgeOpts({ type:'free', id:item.id });
  const answers = [item.target].concat(item.alts);
  assert.equal(res('Han påstår att han aldrig fått mejlet.', answers, 'sv', opt), 'ok');
  assert.equal(res('Han påstår att han aldrig fått mailet.', answers, 'sv', opt), 'ok', 'mail = mejl');
  assert.equal(res('Han påstår att han aldrig fått mejlet.', answers, 'sv'), 'bad', 'Diktat: so schreiben, wie es klingt');
  assert.equal(res('Vad hänt?', ['Vad har hänt?'], 'sv', { de:'Was ist passiert?' }), 'bad', 'Fragewort vorn: Hauptsatz');
  assert.equal(res('När jag kom hem hon ätit.', ['När jag kom hem hade hon ätit.'], 'sv', { de:'x' }), 'bad');
  assert.equal(res('Vet du om restaurangen öppet idag?', ['Vet du om restaurangen har öppet idag?'], 'sv', { de:'x' }), 'bad', 'öppet ist kein Supinum');
  const fast = BANK.sv.find(i => i.target.startsWith('Fast vi inte hade setts'));
  assert.equal(res('Fast vi inte setts på länge kände jag igen henne direkt.', [fast.target].concat(fast.alts), 'sv', judgeOpts({ type:'free', id:fast.id })), 'ok');
});
test('Übersetzen: betontes Subjektpronomen im Spanischen ist richtig, wenn der deutsche Satz dieselbe Person nennt', () => {
  const item = BANK.es.find(i => i.target === 'Creo que tiene razón.');
  const opt = judgeOpts({ type:'free', id:item.id }), answers = [item.target].concat(item.alts);
  assert.equal(res('Creo que él tiene razón.', answers, 'es', opt), 'ok');
  assert.equal(res('Creo que ella tiene razón.', answers, 'es', opt), 'bad', 'der deutsche Satz sagt „er“');
  const q = BANK.es.find(i => i.target === 'Quiero que vengas.');
  assert.equal(res('Quiero que tú vengas.', [q.target], 'es', judgeOpts({ type:'free', id:q.id })), 'ok');
  assert.equal(res('Quiero que tú vengas.', [q.target], 'es'), 'bad', 'ohne deutschen Satz (Diktat) nicht');
});
