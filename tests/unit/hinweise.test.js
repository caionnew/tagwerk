// Gemeldet am 21.11.2026 (Screenshots, Niveau „Fortgeschritten“): Das Muster der Periphrase (acabar de + Infinitiv) verriet das
// gesuchte Verb; ein fehlendes „nos“ wurde nicht erklärt; zwei Erklärungen passten nicht zum gemachten Fehler.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const BANK = app.get('BANK'), PERI_ES = app.get('PERI_ES'), judgeX = app.get('judgeX'), esReflexWhy = app.get('esReflexWhy');
const blank = niveau => ({ v:3, settings:{ size:'normal', lang:'es', niveau }, used:{ lookup:true, accept:true }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, focus:{} });
const peri = p => PERI_ES.find(x => x[0] === p);
const periData = p => { const [prompt, ans, pat, de, note] = peri(p); return { prompt, deLine:de, answers:ans.map(a => a.toLowerCase()), label:'Setz die passende Form ein', hint:`(${pat})`, tip:'Muster', note, gap:true, full:prompt.replace('___', ans[0]) }; };
// Eine Aufgabe zeigen (und optional prüfen); zurück kommen Kopfzeile, Ergebnis und Rückmeldung als Text
function show(ex, { niveau = 'fort', input = '', tip = false, check = false } = {}){
  app.setDB(blank(niveau));
  return run(`(() => { buildBank(); S.lang = 'es'; S.view = 'run';
    S.run = { kind:'daily', lang:'es', queue:[${JSON.stringify(ex)}], idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0 };
    S.run.cur = { input:${JSON.stringify(input)}, state:'answer', tip:${tip} };
    ${check ? 'check();' : ''}
    const html = viewRun(), c = S.run.cur;
    return { kicker:html.match(/<p class="kicker">[\\s\\S]*?<\\/p>/)[0], result:c.result || null,
      fb:c.state === 'done' ? feedbackHtml(S.run, S.run.queue[0], c).replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ') : '' }; })()`);
}
const genEx = p => ({ type:'gen', gen:'perifrasis', data:periData(p) });

test('Periphrasen bei „Fortgeschritten“: Muster verdeckt, auf Tipp und nach dem Prüfen sichtbar', () => {
  const g = run('genPerifrasis()');
  assert.equal(g.tip, 'Muster');
  assert.match(g.hint, /^\(.+\)$/);
  const ex = genEx('___ de empezar a nevar.');
  const k = show(ex).kicker;
  assert.ok(k.includes('data-a="showtip">Muster zeigen</button>'), k);
  assert.ok(!k.includes('acabar de'), 'Muster erst auf Tipp');
  assert.ok(show(ex, { tip:true }).kicker.includes('(acabar de + Infinitiv)'));
  const done = show(ex, { input:'acaba', check:true });
  assert.equal(done.result, 'ok');
  assert.ok(done.kicker.includes('(acabar de + Infinitiv)'), 'nach dem Prüfen steht das Muster da');
});
test('Periphrasen bei „Mittel“: Muster steht gleich da', () => {
  assert.ok(show(genEx('___ a llover.'), { niveau:'mittel' }).kicker.includes('(volver a + Infinitiv)'));
});
test('Periphrasen: Ohne Muster zählt jede richtige Füllung, falsche bleiben falsch', () => {
  const ok = [['No ___ de llover desde ayer.', 'ha parado'], ['No ___ de llover desde ayer.', 'ha dejado'], ['A pesar del ruido, ___ durmiendo.', 'seguía'],
    ['De repente ___ a llover.', 'rompió'], ['Cuando le conté la noticia, ___ a llorar.', 'rompió'], ['Al ver la escena, todos ___ a reír.', 'rompieron'],
    ['___ toda la mañana intentando llamarte.', 'he estado'], ['___ dos horas esperando.', 'He estado'], ['___ diciéndolo desde hace meses.', 'llevo'],
    ['___ a trabajar en cuanto llego a la oficina.', 'comienzo']];
  for (const [p, input] of ok) assert.equal(show(genEx(p), { input, check:true }).result, 'ok', `${p} ${input}`);
  const bad = [['___ treinta años casados.', 'están'], ['___ a llover.', 'empieza'], ['¿Cuánto tiempo ___ estudiando español?', 'estás'], ['___ de empezar a nevar.', 'acabó']];
  for (const [p, input] of bad) assert.equal(show(genEx(p), { input, check:true }).result, 'bad', `${p} ${input}`);
  // Die gezeigte Lösung bleibt die Periphrase
  assert.equal(periData('No ___ de llover desde ayer.').full, 'No deja de llover desde ayer.');
});

test('Fehlendes Reflexivpronomen: Hinweis nennt die Bedeutung mit und ohne Pronomen', () => {
  assert.equal(esReflexWhy('Si llueve mañana quedamos en casa', 'Si llueve mañana, nos quedamos en casa.'),
    '„nos“ fehlt: quedarse = bleiben; quedar allein heißt meist sich verabreden oder übrig sein.');
  // Kein Reflexiv: Objektpronomen (nos llamó = er rief uns an), se lo, Pronomen vorhanden
  assert.equal(esReflexWhy('Llamó ayer', 'Nos llamó ayer.'), '');
  assert.equal(esReflexWhy('Lo dije', 'Se lo dije.'), '');
  assert.equal(esReflexWhy('Nos quedamos en casa', 'Nos quedamos en casa.'), '');
  // Ohne Eintrag in der kleinen Tabelle: Bedeutung aus dem Wörterbuch, ohne zu behaupten, das Verb gehe nie ohne Pronomen
  assert.equal(esReflexWhy('Caí en la calle', 'Me caí en la calle.'), '„me“ fehlt: caerse = hinfallen; hier gehört das Pronomen dazu.');
});
test('Satz „Wenn es morgen regnet“: ohne nos falsch und erklärt, beide Stellungen von mañana richtig', () => {
  const it = BANK.es.find(i => i.target === 'Si llueve mañana, nos quedamos en casa.');
  const answers = [it.target].concat(it.alts);
  for (const a of ['Si mañana llueve, nos quedamos en casa', 'Si mañana llueve, nos quedaremos en casa']) assert.equal(judgeX(a, answers, 'es').res, 'ok', a);
  const r = show({ type:'free', id:it.id }, { input:'Si llueve mañana quedamos en casa', check:true });
  assert.equal(r.result, 'bad');
  assert.match(r.fb, /Der knifflige Teil stimmt: „llueve“\. Aber „nos“ fehlt: quedarse = bleiben/);
  assert.doesNotMatch(r.fb, /Unterschied liegt woanders/);
});
test('Lücke „Se convirtió“: se volvió ist falsch, die Erklärung sagt warum', () => {
  const it = BANK.es.find(i => i.target === 'Se convirtió en una de las voces más importantes del movimiento.');
  const r = show({ type:'cloze', id:it.id }, { input:'se volvió', check:true });
  assert.equal(r.result, 'bad');
  assert.match(r.fb, /volverse steht ohne en/);
});
test('Lücke „Suelo“: normalmente ist falsch, die Erklärung widerspricht dem nicht mehr', () => {
  const it = BANK.es.find(i => i.target === 'Suelo ir andando al trabajo.');
  const r = show({ type:'cloze', id:it.id }, { input:'normalmente', check:true });
  assert.equal(r.result, 'bad');
  assert.match(r.fb, /normalmente voy, nicht normalmente ir/);
  for (const a of ['Suelo ir al trabajo a pie', 'Normalmente voy al trabajo andando']) assert.equal(judgeX(a, [it.target].concat(it.alts), 'es').res, 'ok', a);
});

// Gemeldet am 27.11.2026 (Screenshots): „Si no lloviera diéramos un paseo“ war zu Recht falsch, aber die Rückmeldung strich
// „dar un paseo“ durch und erklärte den Stamm von salir; „daríamos un paseo“ wäre ebenso falsch gewertet worden.
// „se me hace difícil“ passte nicht zur Regel des Themas („hacerse: eigenes Zutun, Beruf, Zeit“).
const esCondWhy = app.get('esCondWhy');
test('si-Satz: Subjuntivo statt Konditional und umgekehrt wird benannt, nur bei demselben Verb', () => {
  assert.equal(esCondWhy('Si no lloviera diéramos un paseo', 'Si no lloviera, daríamos un paseo.'),
    '„diéramos“ ist Subjuntivo, hier steht der Konditional: daríamos. Die Form auf -ra statt des Konditionals ist nur regional üblich (allgemein nur hubiera, quisiera, debiera).');
  assert.match(esCondWhy('Si no lloviera, saliésemos a pasear', 'Si no lloviera, saldríamos a pasear.'), /^„saliésemos“ ist Subjuntivo, hier steht der Konditional: saldríamos\./);
  assert.match(esCondWhy('Si tuviera tiempo, mantuviera la casa', 'Si tuviera tiempo, mantendría la casa.'), /Konditional: mantendría/);
  assert.match(esCondWhy('Si fuera rico, fuera feliz', 'Si fuera rico, sería feliz.'), /„fuera“ ist Subjuntivo, hier steht der Konditional: sería/);
  assert.equal(esCondWhy('Si tendría tiempo, te ayudaría', 'Si tuviera tiempo, te ayudaría.'), '„tendría“ ist Konditional. Nach si steht der Subjuntivo: si tuviera.');
  assert.equal(esCondWhy('Si me lo dirías, te ayudaría', 'Si me lo dijeras, te ayudaría.'), '„dirías“ ist Konditional. Nach si steht der Subjuntivo: si me lo dijeras.');
  assert.match(esCondWhy('Si habría sabido, no habría venido', 'Si hubiera sabido, no habría venido.'), /„habría“ ist Konditional\. Nach si steht der Subjuntivo: si hubiera/);
  // Keine Behauptung: anderes Verb, fuera schon im si-Satz, quería ist Imperfecto, hubiera und pudiera gehen im Hauptsatz,
  // habría neben der Fassung mit hubiera, Satz ohne si
  for (const [a, b] of [['Si no lloviera, diéramos un paseo', 'Si no lloviera, saldríamos a pasear.'], ['Si fuera rico, estaría feliz', 'Si fuera rico, sería feliz.'],
    ['Si quería, podría', 'Si quisiera, podría.'], ['Si tuviera dinero, hubiera comprado la casa', 'Si tuviera dinero, habría comprado la casa.'],
    ['Si pudiera, pudiera ayudarte', 'Si pudiera, podría ayudarte.'], ['Si me hubiera levantado antes, habría cogido el tren', 'Si me hubiera levantado antes, hubiera cogido el tren.'],
    ['Dijo que viniera', 'Dijo que vendría.']]) assert.equal(esCondWhy(a, b), '', a);
});
test('Keine richtige Fassung der Satzbank löst den Hinweis aus', () => {
  for (const it of BANK.es) { const all = [it.target].concat(it.alts); for (const a of all) for (const b of all) assert.equal(esCondWhy(a, b), '', `${a} / ${b}`); }
});
test('Satz „Wenn es nicht regnen würde“: dar un paseo und ir a pasear gelten, diéramos ist falsch und benannt', () => {
  const it = BANK.es.find(i => i.target === 'Si no lloviera, saldríamos a pasear.');
  const answers = [it.target].concat(it.alts);
  for (const a of ['Si no lloviera daríamos un paseo', 'Si no lloviese, iríamos a dar un paseo', 'Si no lloviera, pasearíamos', 'Si no lloviese, saldríamos a caminar'])
    assert.equal(judgeX(a, answers, 'es').res, 'ok', a);
  const r = show({ type:'free', id:it.id }, { input:'Si no lloviera diéramos un paseo', check:true });
  assert.equal(r.result, 'bad');
  assert.match(r.fb, /„diéramos“ ist Subjuntivo\s*, hier steht der Konditional\s*: daríamos\./);
  // Kein Wortschatzfehler: „Die Grammatik passt“ stimmte hier nicht, und das Thema zählt den Fehler
  assert.doesNotMatch(r.fb, /Die Grammatik passt/);
  assert.equal(app.run('S.run.cur.kind'), 'word');
  // Die gezeigte Lösung ist die nächste Fassung (dar un paseo), nicht salir a pasear
  assert.match(r.fb, /Si no lloviera, daríamos un paseo\./);
  // Lücke: iríamos gilt, saliéramos ist falsch und benannt
  assert.equal(show({ type:'cloze', id:it.id }, { input:'iríamos', check:true }).result, 'ok');
  const g = show({ type:'cloze', id:it.id }, { input:'saliéramos', check:true });
  assert.equal(g.result, 'bad');
  assert.match(g.fb, /„saliéramos“ ist Subjuntivo\s*, hier steht der Konditional\s*: saldríamos\./);
});
test('„se me hace difícil“: Regel und Erklärung passen zusammen, me resulta gilt auch', () => {
  const it = BANK.es.find(i => i.target === 'Cada vez se me hace más difícil madrugar.');
  assert.match(it.note, /^hacerse für eine allmähliche Entwicklung; mit me sagt es, wie es dir vorkommt/);
  const tr = app.run("TRAPS.es.find(t => t.id === 'cambio')");
  assert.deepEqual(JSON.parse(JSON.stringify(tr.table.find(r => r[0] === 'hacerse'))), ['hacerse', 'allmählich, oft mit eigenem Zutun: Beruf, Zeit', 'se hizo médico, se hace tarde']);
  assert.match(tr.rule, /se me hace difícil \(es fällt mir schwer\)/);
  for (const g of ['me resulta', 'me es']) assert.equal(show({ type:'cloze', id:it.id }, { input:g, check:true }).result, 'ok', g);
  assert.equal(judgeX('Cada vez me resulta más difícil madrugar', [it.target].concat(it.alts), 'es').res, 'ok');
});
