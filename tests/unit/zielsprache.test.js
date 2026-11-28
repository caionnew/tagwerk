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

test('¡ und ¿ hängen am Anfang großer Zeilen vor der Kante, das Zeichen bleibt im antippbaren Wort', () => {
  const hang = h => run(`hangLead(${JSON.stringify(h)})`);
  assert.equal(hang(run(`linkWords('¡Poco a poco!', 'es')`)), '<span data-a="lookup" data-w="Poco"><span class="hang">¡</span>Poco</span> <span data-a="lookup" data-w="a">a</span> <span data-a="lookup" data-w="poco">poco!</span>');
  assert.match(hang(run(`linkWords('¿Qué tal?', 'es')`)), /^<span data-a="lookup" data-w="Qué"><span class="hang q">¿<\/span>Qué<\/span>/);
  assert.equal(hang('¿Dónde está?'), '<span class="hang q">¿</span>Dónde está?');
  assert.equal(hang('Hej!'), 'Hej!');
  assert.equal(hang('Hola, ¿qué tal?'), 'Hola, ¿qué tal?', 'nur am Zeilenanfang');
  assert.match(run(`greetHtml('es', new Date(2026, 11, 24, 10, 30))`), /<p class="hello-g wordrow" lang="es"><span data-a="lookup" data-w="Feliz"><span class="hang">¡<\/span>Feliz/);
  assert.doesNotMatch(run(`greetHtml('sv', new Date(2026, 11, 24, 10, 30))`), /hang/);
});

test('Urteil nach dem Prüfen: bei „Fortgeschritten“ in der Zielsprache (Deutsch im title), „Andere Norm“ deutsch, Tipp auf die Anweisung zeigt es deutsch', () => {
  const fb = (lang, niv, c) => run(`(() => { DB = freshDB(); DB.settings.niveau = '${niv}'; const it = BANK.${lang}.find(i => !i.own && !i.tat);
    return feedbackHtml({ lang:'${lang}' }, { type:'free', id:it.id }, Object.assign({ input:'x', nextIvl:3, combo:0 }, ${JSON.stringify(c)})); })()`);
  const pill = h => (h.match(/<span class="verdict [^"]+"[^>]*>[^<]+<\/span>/) || [''])[0];
  assert.equal(pill(fb('sv', 'fort', { result:'ok' })), '<span class="verdict v-ok" lang="sv" title="Richtig">Rätt</span>');
  assert.equal(pill(fb('sv', 'fort', { result:'near' })), '<span class="verdict v-mid" lang="sv" title="Fast richtig">Nästan rätt</span>');
  assert.equal(pill(fb('sv', 'fort', { result:'bad' })), '<span class="verdict v-bad" lang="sv" title="Falsch">Fel</span>');
  assert.equal(pill(fb('es', 'fort', { result:'bad', gaveUp:true })), '<span class="verdict v-bad" lang="es" title="Lösung">Solución</span>');
  assert.equal(pill(fb('es', 'fort', { result:'near' })), '<span class="verdict v-mid" lang="es" title="Fast richtig">Casi correcto</span>');
  assert.equal(pill(fb('es', 'fort', { result:'near', why:{ kind:'norm' } })), '<span class="verdict v-mid">Andere Norm</span>');
  assert.equal(pill(fb('es', 'fort', { result:'ok', kickDe:true })), '<span class="verdict v-ok">Richtig</span>');
  assert.equal(pill(fb('sv', 'mittel', { result:'ok' })), '<span class="verdict v-ok">Richtig</span>');
  assert.match(fb('sv', 'fort', { result:'ok', combo:3 }), /<span class="combo"><span lang="sv">3 i rad<\/span><\/span>/);
  assert.match(fb('es', 'fort', { result:'ok', combo:5 }), /<span class="combo"><span lang="es">5 seguidas<\/span><\/span>/);
  assert.match(fb('es', 'grund', { result:'ok', combo:5 }), /<span class="combo">5 in Folge<\/span>/);
  for (const lang of ['sv', 'es']) for (const [k, w] of Object.entries(app.get('VERDICT_TL')[lang])) if (k !== 'combo') for (const t of w.toLowerCase().split(' ')) assert.ok(run(`lookupWord('${lang}', ${JSON.stringify(t)})`), `${lang}: ${t}`);
});

test('Schreibaufgabe bei „Fortgeschritten“: Aufgabe und Anweisung in der Zielsprache, „Auf Deutsch“ stellt die deutsche darunter; sonst deutsch', () => {
  const P = app.get('WRITE_PROMPTS'), T = app.get('WRITE_PROMPTS_TL'), tokens = app.get('tokens'), lookupWord = app.get('lookupWord');
  for (const lang of ['sv', 'es']) {
    assert.equal(T[lang].length, P.length, `${lang}: gleich viele Aufgaben, gleiche Reihenfolge`);
    for (const p of T[lang]) {
      assert.match(p, /^[¿A-ZÅÄÖÁÉÍÓÚ]/, p);
      assert.match(p, /[.?]$/, p);
      for (const w of tokens(p)) if (/[a-zà-ÿ]/i.test(w)) assert.ok(lookupWord(lang, w), `${lang}: ${w} (${p})`);
    }
    assert.equal(new Set(T[lang]).size, P.length, `${lang}: keine doppelt`);
  }
  assert.equal(T.sv[P.indexOf('Warum lernst du diese Sprache?')], 'Varför lär du dig svenska?');
  assert.equal(T.es[P.indexOf('Was würdest du mit einem Lottogewinn machen?')], '¿Qué harías si te tocara la lotería?');
  const view = (lang, niv, i, extra = '') => run(`(() => { DB = freshDB(); DB.settings.niveau = '${niv}'; S.write = { lang:'${lang}', prompt:WRITE_PROMPTS[${i}], text:'', id:'w1', extra:'' }; ${extra}; S.view = 'write'; return viewWrite(); })()`);
  const fort = view('es', 'fort', 2);
  assert.match(fort, /<p class="kicker"><button type="button" class="kick-tl" data-a="kickde" lang="es" title="Schreib 4 bis 6 Sätze auf Spanisch">Escribe de 4 a 6 frases en español<\/button><\/p>/);
  assert.match(fort, /<p class="de wq wordrow" lang="es"><span data-a="lookup" data-w="Cómo"><span class="hang q">¿<\/span>Cómo<\/span>/);
  assert.match(fort, /data-a="kickde">Auf Deutsch<\/button>/);
  assert.doesNotMatch(fort, /Wie sieht ein typischer Montag/);
  const de = view('es', 'fort', 2, 'S.write.kickDe = true');
  assert.match(de, /<p class="kicker">Schreib 4 bis 6 Sätze auf Spanisch<\/p>/);
  assert.match(de, /<p class="de wq wordrow" lang="es">.*<\/p><p class="wq-de" lang="de">Wie sieht ein typischer Montag bei dir aus\?<\/p>/);
  assert.doesNotMatch(de, /Auf Deutsch/);
  const mid = view('sv', 'mittel', 2);
  assert.match(mid, /<p class="kicker">Schreib 4 bis 6 Sätze auf Schwedisch<\/p>\s*<p class="de" lang="de">Wie sieht ein typischer Montag bei dir aus\?<\/p>/);
  assert.match(view('sv', 'fort', 0, 'S.write.restored = true'), /<p class="kicker">Dein Entwurf von vorhin<\/p>/);
  assert.match(run(`(() => { DB.settings.niveau = 'fort'; return kick('Schreib einen eigenen Satz mit', 'sv', {}); })()`), />Skriv en egen mening med</);
  assert.match(run(`kick('Schreib einen eigenen Satz mit', 'es', {})`), />Escribe una frase propia con</);
  run('S.write = null; S.view = "home"');
});
