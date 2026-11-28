// Perfecto/Indefinido mit zwei Normen (27.11.2026): Du wolltest dich nicht auf Spanien oder Lateinamerika festlegen, sondern beides lernen.
// Vorher galt beides überall, und wer immer Indefinido schrieb, hatte 67 von 69 Sätzen richtig. Jetzt sagt die Aufgabe, welche Norm
// gefragt ist („wie in Spanien“, „wie in Lateinamerika“); die Form der anderen ist fast richtig und zählt beim Thema als Fehler.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const BANK = app.get('BANK'), normOf = app.get('normOf'), clozeOf = app.get('clozeOf'), answersFor = app.get('answersFor'), otherAnswers = app.get('otherAnswers');
const judgeX = app.get('judgeX'), norm = app.get('norm'), gapPos = app.get('gapPos');
const blank = () => ({ v:3, settings:{ size:'normal', lang:'es', niveau:'fort' }, used:{ lookup:true, accept:true }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, focus:{} });
const item = t => BANK.es.find(i => i.target === t);
// Eine Aufgabe zeigen und optional prüfen; zurück: Kopfzeile, Lückensatz, Ergebnis, Rückmeldung, Themenzählung, Wiederholung
function show(ex, { input = '', check = false, next = false } = {}){
  app.setDB(blank());
  return run(`(() => { buildBank(); S.lang = 'es'; S.view = 'run';
    S.run = { kind:'practice', lang:'es', queue:[${JSON.stringify(ex)}], idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0 };
    prepCur(); S.run.cur = { input:${JSON.stringify(input)}, state:'answer' };
    ${check ? 'check();' : ''}
    const html = viewRun(), c = S.run.cur, fb = c.state === 'done' ? feedbackHtml(S.run, S.run.queue[0], c).replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ') : '';
    ${next ? 'next();' : ''}
    const t = (DB.tlog || {})[today()] || {};
    return { kicker:html.match(/<p class="kicker">[\\s\\S]*?<\\/p>/)[0], cloze:(html.match(/<p class="cloze"[\\s\\S]*?<\\/p>/) || [''])[0].replace(/<input[^>]*>/, '___').replace(/<[^>]+>/g, ''),
      result:c.result || null, why:c.why || null, fb, mine:c.mine || null, marked:c.state === 'done' && /<p class="sol"[^>]*>(?:(?!<\\/p>)[\\s\\S])*class="w-/.test(feedbackHtml(S.run, S.run.queue[0], c)), norm:S.run.queue[0].norm || null, topic:(t.es || {})['p:perfecto'] || null,
      queue:S.run.queue.map(q => ({ type:q.type, norm:q.norm || null, requeue:!!q.requeue })) }; })()`);
}

test('55 Sätze haben Normformen (24 mit zwei Zeitrahmen), 30 davon mit spanischer Form als Zielsatz; jede Form steht in der Lücke', () => {
  const items = BANK.es.filter(i => i.norms);
  assert.equal(items.length, 55);
  assert.ok(items.every(i => i.trap === 'perfecto'));
  assert.equal(items.filter(i => normOf(i, i.target) === 'es').length, 30);
  // Jede Fassung hat höchstens eine Norm: Eine markierte Form steht nicht noch einmal in der anderen Satzhälfte (sonst „beide“)
  for (const it of items) for (const v of [it.target].concat(it.alts)) {
    const t = ' ' + norm(v, 'es') + ' ', hits = Object.keys(it.norms).filter(k => t.includes(' ' + k + ' '));
    assert.ok(hits.length <= 1 || new Set(hits.map(k => it.norms[k])).size === 1, v);
  }
  // Satz mit Erfahrung: Perfecto gilt in beiden Normen
  assert.equal(normOf(item('Nunca he estado en México.'), 'Nunca he estado en México.'), '');
  for (const it of items) for (const k of Object.keys(it.norms)) assert.ok(it.gapAlts.some(g => norm(g, 'es') === k), `${k}: ${it.target}`);
  // Die Zeichen sind aus Lücke und Lösungen verschwunden
  assert.ok(BANK.es.every(i => i.gapAlts.every(g => !/^(ES|LA):/.test(g))));
});
test('Jede Fassung jedes markierten Satzes: in ihrer Norm richtig, in der anderen fast richtig, sonst in beiden richtig', () => {
  const problems = [];
  // Sätze ohne spanische Form (Erfahrung) fragen nur „wie in Spanien“
  for (const it of BANK.es.filter(i => i.norms)) for (const n of Object.values(it.norms).includes('es') ? ['es', 'la'] : ['es']) for (const type of ['free', 'cloze']) {
    const ex = { type, id:it.id, norm:n }, ok = answersFor(ex), other = otherAnswers(ex);
    if (type === 'cloze') { const cz = clozeOf(ex); if (gapPos(cz.target, cz.gap) < 0) problems.push(`Lücke nicht im Satz: ${cz.target}`); }
    for (const v of type === 'free' ? [it.target].concat(it.alts) : it.gapAlts) {
      const vn = normOf(it, v), want = vn && vn !== n ? 'near' : 'ok';
      let got = judgeX(v, ok, 'es', {}).res;
      if (got === 'bad') { const o = judgeX(v, other, 'es', {}); if (o && o.res !== 'bad') got = 'near'; }
      if (got !== want) problems.push(`${n} ${type}: ${v} → ${got}, erwartet ${want}`);
    }
  }
  assert.deepEqual(problems, []);
});
test('„wie in Spanien“: perdí ist „Andere Norm“, beide Formen mit Grund, und zählt beim Thema als Fehler', () => {
  const it = item('Esta mañana he perdido el autobús.');
  const r = show({ type:'free', id:it.id, norm:'es' }, { input:'Esta mañana perdí el autobús', check:true, next:true });
  // Bei „Fortgeschritten“ die Anweisung spanisch (24.92.0), die Norm bleibt deutsch
  assert.match(r.kicker, /Traduce al español<\/button><span class="hintw norm">wie in Spanien<\/span>/);
  assert.equal(r.result, 'near');
  assert.deepEqual(r.why, { kind:'norm', norm:'es' });
  assert.match(r.fb, /Andere Norm/);
  assert.doesNotMatch(r.fb, /Fast richtig/);
  // Formenpaar: gefragte Form, dann deine
  assert.match(r.fb, /Spanien he perdido gefragt Lateinamerika perdí deine/);
  assert.match(r.fb, /„Esta mañana“ gehört zu heute, darum in Spanien Perfecto\s*\./);
  assert.match(r.fb, /Esta mañana he perdido el autobús\./);
  assert.deepEqual(r.topic, [1, 1]);
  // Nichts durchgestrichen oder rot markiert: Die Lösung steht ohne Markierung, deine Antwort ohne Streichung
  assert.equal(r.mine, null);
  assert.equal(r.marked, false);
  // Richtig in der gefragten Norm: kein Fehler
  const ok = show({ type:'free', id:it.id, norm:'es' }, { input:'Esta mañana he perdido el autobús', check:true, next:true });
  assert.equal(ok.result, 'ok');
  assert.deepEqual(ok.topic, [1, 0]);
});
test('„wie in Lateinamerika“: Lücke im Satz dieser Norm, he discutido ist fast richtig, discutí richtig', () => {
  const it = item('Hoy he discutido con mi socio y he cancelado dos reuniones.');
  const r = show({ type:'cloze', id:it.id, norm:'la' });
  assert.match(r.kicker, /wie in Lateinamerika/);
  assert.equal(r.cloze, 'Hoy ___ con mi socio y cancelé dos reuniones.');
  assert.equal(show({ type:'cloze', id:it.id, norm:'la' }, { input:'discutí', check:true }).result, 'ok');
  const near = show({ type:'cloze', id:it.id, norm:'la' }, { input:'he discutido', check:true });
  assert.equal(near.result, 'near');
  assert.match(near.fb, /Lateinamerika discutí gefragt Spanien he discutido deine/);
  assert.match(near.fb, /In Lateinamerika steht für Abgeschlossenes meist Indefinido\s*, auch mit „Hoy“\./);
  // „wie in Spanien“: der Zielsatz, discutí fast richtig
  assert.equal(show({ type:'cloze', id:it.id, norm:'es' }).cloze, 'Hoy ___ con mi socio y he cancelado dos reuniones.');
  assert.equal(show({ type:'cloze', id:it.id, norm:'es' }, { input:'discutí', check:true }).result, 'near');
});
test('Erfahrung: immer „wie in Spanien“ (in Lateinamerika ginge beides, die Abfrage prüfte nichts), estuve fast richtig', () => {
  const it = item('Nunca he estado en México.');
  assert.deepEqual([...new Set(Array.from({ length:20 }, () => show({ type:'free', id:it.id }).norm))], ['es']);
  // Auch eine gespeicherte Aufgabe mit „wie in Lateinamerika“ (aus 24.80.0) fragt jetzt Spanien ab
  const r = show({ type:'free', id:it.id, norm:'la' }, { input:'Nunca estuve en México', check:true });
  assert.equal(r.norm, 'es');
  assert.equal(r.result, 'near');
  assert.match(r.fb, /Spanien he estado gefragt Lateinamerika estuve deine/);
  assert.match(r.fb, /„Nunca“ reicht bis jetzt, darum in Spanien Perfecto\s*\./);
  assert.equal(show({ type:'cloze', id:it.id }, { input:'he estado', check:true }).result, 'ok');
});
test('Rückmeldung nennt das Signalwort am Satz, das der Lücke am nächsten steht', () => {
  const morning = show({ type:'cloze', id:item('Esta mañana he perdido el autobús.').id, norm:'es' }, { input:'perdí', check:true });
  assert.match(morning.fb, /„Esta mañana“ gehört zu heute, darum in Spanien Perfecto\s*\./);
  const year = show({ type:'cloze', id:item('Este verano apenas ha llovido.').id }, { input:'llovió', check:true });
  assert.match(year.fb, /„Este verano“ läuft noch, darum in Spanien Perfecto/);
  // „ya“ steht näher an der Lücke als „hoy“
  const ya = show({ type:'free', id:item('Ayer no me llamó nadie, pero hoy el teléfono ya ha sonado cinco veces.').id, norm:'es' }, { input:'Ayer no me llamó nadie, pero hoy el teléfono ya sonó cinco veces', check:true });
  assert.match(ya.fb, /„ya“ reicht bis jetzt, darum in Spanien Perfecto\s*\./);
  // hoy allein: „läuft noch“, nicht „gehört zu heute“
  const hoy = show({ type:'cloze', id:item('Hoy he trabajado mucho.').id, norm:'es' }, { input:'trabajé', check:true });
  assert.match(hoy.fb, /„Hoy“ läuft noch, darum in Spanien Perfecto/);
  const la = show({ type:'cloze', id:item('Hace un mes se conocieron y hoy se han comprometido.').id, norm:'la' }, { input:'se han comprometido', check:true });
  assert.match(la.fb, /In Lateinamerika steht für Abgeschlossenes meist Indefinido\s*, auch mit „hoy“\./);
});
test('Form der anderen Norm: gleich noch einmal als Lücke mit derselben Norm', () => {
  const it = item('El lunes empezó el curso y hoy ya hemos hecho el primer examen.');
  const r = show({ type:'free', id:it.id, norm:'la' }, { input:'El lunes empezó el curso y hoy ya hemos hecho el primer examen', check:true, next:true });
  assert.equal(r.result, 'near');
  assert.match(r.fb, /gleich noch einmal, dann morgen wieder/);
  assert.deepEqual(r.queue[1], { type:'cloze', norm:'la', requeue:true });
  // Die Lücke kommt im Satz dieser Norm, die erste Satzhälfte bleibt
  assert.equal(show({ type:'cloze', id:it.id, norm:'la' }).cloze, 'El lunes empezó el curso y hoy ya ___ el primer examen.');
  // Richtig in der gefragten Norm: keine Wiederholung
  assert.equal(show({ type:'free', id:it.id, norm:'la' }, { input:'El lunes empezó el curso y hoy ya hicimos el primer examen', check:true, next:true }).queue.length, 1);
});
test('Norm: ausgelost, sobald die Aufgabe dran ist, nur bei Übersetzen und Lücke; die Wiederholung behält sie', () => {
  const it = item('Esta mañana he perdido el autobús.');
  const ns = new Set(Array.from({ length:40 }, () => show({ type:'free', id:it.id }).norm));
  assert.deepEqual([...ns].sort(), ['es', 'la']);
  assert.equal(show({ type:'dict', id:it.id }).norm, null);
  // Satz ohne Normformen: keine Norm, kein Hinweis
  const plain = item('Ayer no dormí bien.');
  const p = show({ type:'free', id:plain.id });
  assert.equal(p.norm, null);
  assert.ok(!/hintw norm/.test(p.kicker));
  // Falsch: Die Wiederholung kommt mit derselben Norm
  const bad = show({ type:'free', id:it.id, norm:'la' }, { input:'Esta mañana perdimos el tren', check:true, next:true });
  assert.equal(bad.result, 'bad');
  assert.deepEqual(bad.queue[1], { type:'cloze', norm:'la', requeue:true });
});
test('Regelblatt: Übersicht nach Signalwort, beide Normen je Zeile, die Abfrage erklärt', () => {
  const tr = run("TRAPS.es.find(t => t.id === 'perfecto')");
  assert.deepEqual(tr.table.map(r => r[0]), ['ayer, en 2018', 'hoy, ya', 'nunca, este año']);
  assert.ok(tr.table.slice(1).every(r => /Spanien/.test(r[1]) && /Lateinamerika/.test(r[1])));
  assert.match(tr.rule, /„wie in Spanien“ oder „wie in Lateinamerika“/);
  assert.match(tr.rule, /„Andere Norm“, kommt gleich noch einmal/);
});
test('Rundenende: Grund bei der anderen Norm', () => {
  assert.equal(app.get('roundWhy')({ result:'near', why:{ kind:'norm', norm:'la' } }, null, 'es'), 'Andere Norm, gefragt war Lateinamerika');
});
test('Rundenende: Antwort in der anderen Norm ist kein „Fehlerfrei“', () => {
  const it = item('Esta mañana he perdido el autobús.'), ok = item('Ayer no dormí bien.');
  app.setDB(blank());
  const done = run(`(() => { buildBank(); S.lang = 'es';
    S.run = { kind:'practice', lang:'es', queue:[{ type:'free', id:${JSON.stringify(it.id)}, norm:'es' }, { type:'free', id:${JSON.stringify(ok.id)} }, { type:'free', id:${JSON.stringify(ok.id)} }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0 };
    const answer = t => { prepCur(); S.run.cur = { input:t, state:'answer' }; check(); next(); };
    answer('Esta mañana perdí el autobús'); S.run.idx = 1; answer('Ayer no dormí bien'); S.run.idx = 2; answer('Ayer no dormí bien');
    S.view = 'runDone'; return viewRunDone().replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' '); })()`);
  assert.doesNotMatch(done, /Fehlerfrei/);
  // Seit 24.93.0 kein „Fehlerfrei“-Titel mehr; auch der Zuruf ist nicht der für eine fehlerfreie Runde
  for (const z of app.get('ZURUF').es.perfect) assert.ok(!done.includes(z.replace(/[¡!]/g, '')), z);
  assert.match(done, /2 von 3 auf Anhieb richtig, 1 in der anderen Norm\./);
  assert.match(done, /Andere Norm, gefragt war Spanien/);
});
