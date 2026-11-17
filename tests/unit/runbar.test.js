// Fortschrittsleiste der Runde (Ergebnis je Aufgabe, zweite Versuche) und Prüfung der Stellungs-Übung („inte“, „alltid“ & Co.).
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const errKind = app.get('errKind');

// Feste Zufallsfolge, damit der Generator jedes Mal dieselben Aufgaben liefert
function seeded(seed){ let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
function withSeed(seed, fn){ const orig = Math.random; Math.random = seeded(seed); try { return fn(); } finally { Math.random = orig; } }

const segs = html => [...html.matchAll(/<i class="seg([^"]*)"/g)].map(m => m[1].trim());

test('Leiste: beantwortete Aufgaben in der Farbe ihres Ergebnisses, aktuelle grau, zweite Versuche als eigene Gruppe', () => {
  const html = run(`(() => {
    S.run = { kind:'daily', lang:'sv', idx:3, ok:2, bad:1, res:[], missed:[],
      queue:[{ type:'gen', got:'ok' }, { type:'gen', got:'bad' }, { type:'gen', got:'near' }, { type:'gen' }, { type:'gen' }, { type:'cloze', id:'x', requeue:true }],
      cur:{ state:'answer', result:null } };
    return progressBar(S.run);
  })()`);
  assert.deepEqual(segs(html), ['s-ok', 's-bad', 's-near', 's-cur', '', 're re1']);
  assert.match(html, /aria-label="Aufgabe 4 von 6: 1 richtig, 1 fast richtig, 1 falsch, 1 zweiter Versuch folgt"/);
  assert.match(html, /<span class="count" aria-hidden="true">4\/6<\/span>/);
});
test('Leiste: das aktuelle Feld färbt sich schon beim Prüfen, mit kurzer Bewegung nur in diesem Moment', () => {
  const at = enter => run(`(() => { S.run.cur = { state:'done', result:'bad', enter:${enter} }; return progressBar(S.run); })()`);
  assert.equal(segs(at(true))[3], 's-bad just');
  assert.equal(segs(at(false))[3], 's-bad');
});
test('Leiste: Runde aus einer älteren Version ohne gespeichertes Ergebnis nimmt es aus dem Rundenergebnis', () => {
  const html = run(`(() => {
    S.run = { kind:'daily', lang:'sv', idx:4, ok:2, bad:1, missed:[],
      res:[{ good:true }, { good:false }, { good:true, near:true }],
      queue:[{ type:'gen' }, { type:'free', id:'a' }, { type:'gen' }, { type:'cloze', id:'a', requeue:true }, { type:'gen' }],
      cur:{ state:'answer', result:null } };
    return progressBar(S.run);
  })()`);
  assert.deepEqual(segs(html), ['s-ok', 's-bad', 's-near', 's-done re re1', 's-cur']);
});
test('Leiste: bei vielen Aufgaben enger', () => {
  const dens = n => run(`(() => { S.run = { kind:'daily', lang:'sv', idx:0, ok:0, bad:0, res:[], queue:Array.from({ length:${n} }, () => ({ type:'gen' })), cur:{ state:'answer' } }; return progressBar(S.run).match(/class="progress([^"]*)"/)[1]; })()`);
  assert.equal(dens(25), ''); assert.equal(dens(31), ' d1'); assert.equal(dens(45), ' d2');
});
test('Weiter merkt sich das Ergebnis an der Aufgabe, auch beim zweiten Versuch', () => {
  const BANK = app.get('BANK');
  const item = BANK.sv.find(i => i.gap);
  const got = run(`(() => {
    DB.st = {}; DB.tlog = {};
    S.run = { kind:'quick', lang:'sv', idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0,
      queue:[{ type:'cloze', id:${JSON.stringify(item.id)} }, { type:'gen', gen:'inte', data:{ prompt:'x', answers:['Jag kommer inte.'], label:'' } }] };
    S.run.cur = { state:'done', result:'bad', input:'x' }; next();
    S.run.cur = { state:'done', result:'near', input:'x' }; next();
    S.run.cur = { state:'done', result:'ok', input:'x' }; next();
    return S.run.queue.map(e => [e.got, !!e.requeue]);
  })()`);
  assert.deepEqual(got, [['bad', false], ['near', false], ['ok', true]]);
});

// Stellungs-Übung: Stimmt die geprüfte Stellung, bleibt ein anderer Fehler falsch, aber die Erklärung ist nicht die Regel, die man richtig angewandt hat
const answer = (ex, input) => run(`(() => { const ex = ${JSON.stringify(ex)}; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0 }; S.view = 'run'; S.run.cur = { input:${JSON.stringify(input)}, state:'answer', result:null }; check(); const c = S.run.cur; return { result:c.result, kind:c.kind || null, posOk:!!c.posOk, fb:feedbackHtml(S.run, ex, c) }; })()`);
const inte = (de, sv, pos, adv) => ({ type:'gen', gen:'inte', data:{ prompt:de, answers:[sv], label:'Übersetze ins Schwedische', note:'REGEL', pos, posLabel:`Die Stellung von „${adv}“ stimmt` } });
const POS_OK = /Die Stellung von „alltid“ stimmt\. Der Unterschied liegt woanders\./;
test('Hauptsatz: Adverb richtig, anderer Fehler → falsch, Erklärung sagt, dass die Stellung stimmt', () => {
  const ex = inte('Wir trainieren immer im Fitnessstudio.', 'Vi tränar alltid på gymmet.', ['vi', '*', 'alltid'], 'alltid');
  const a = answer(ex, 'vi tränar alltid till gymmet');
  assert.equal(a.result, 'bad'); assert.ok(a.posOk);
  assert.match(a.fb, POS_OK); assert.doesNotMatch(a.fb, /REGEL/);
  // Andere Bedeutung („bin im Urlaub“ statt „mache Urlaub“): falsch
  assert.equal(answer(inte('Ich mache immer im Juli Urlaub.', 'Jag tar alltid semester i juli.', ['jag', '*', 'alltid'], 'alltid'), 'jag är alltid på semester i juli').result, 'bad');
  // Adverb falsch: falsch, mit der Regel
  const b = answer(ex, 'vi tränar på gymmet alltid');
  assert.equal(b.result, 'bad'); assert.ok(!b.posOk); assert.match(b.fb, /REGEL/);
  assert.equal(answer(ex, 'vi alltid tränar på gymmet').result, 'bad');
});
test('Nebensatz: Infinitiv statt Präsens ist falsch, nicht „anderes Wort, Grammatik passt“', () => {
  const ex = inte('Sie sagt, dass wir immer Pilze sammeln.', 'Hon säger att vi alltid plockar svamp.', ['att', 'vi', 'alltid'], 'alltid');
  const a = answer(ex, 'hon säger att vi alltid samla svamp');
  assert.equal(a.result, 'bad'); assert.equal(a.kind, 'word');
  assert.match(a.fb, POS_OK); assert.doesNotMatch(a.fb, /Die Grammatik passt/);
  assert.equal(answer(ex, 'hon säger att vi samlar alltid svamp').result, 'bad');
});
test('Inversion vorn: Verb, Subjekt, Adverb', () => {
  const ex = inte('Nach der Arbeit trainieren wir immer im Fitnessstudio.', 'Efter jobbet tränar vi alltid på gymmet.', ['jobbet', '*', 'vi', 'alltid'], 'alltid');
  assert.ok(answer(ex, 'efter jobbet tränar vi alltid till gymmet').posOk);
  assert.ok(!answer(ex, 'efter jobbet vi tränar alltid på gymmet').posOk);
});
test('Statistik: Fehler neben richtig gesetzter Stellung belastet das Thema nicht, falsche Stellung schon', () => {
  const ex = inte('Wir trainieren immer im Fitnessstudio.', 'Vi tränar alltid på gymmet.', ['vi', '*', 'alltid'], 'alltid');
  run(`DB.tlog = {}`);
  answer(ex, 'vi tränar alltid till gymmet'); run(`recordAnswer('sv', S.run.queue[0], S.run.cur, false)`);
  answer(ex, 'vi tränar till gymmet alltid'); run(`recordAnswer('sv', S.run.queue[0], S.run.cur, false)`);
  assert.deepEqual(run(`DB.tlog[today()].sv['p:bisats']`), [2, 1]);
});
test('Generator: „i gymmet“ und „åker på semester“ sind richtige Fassungen', () => {
  const genInte = app.get('genInte');
  const found = { gym:0, sem:0 };
  withSeed(11, () => {
    for (let i = 0; i < 600; i++) {
      const d = genInte(), a0 = d.answers[0];
      if (/ på gymmet\./.test(a0)) { found.gym++; assert.ok(d.answers.includes(a0.replace('på gymmet', 'i gymmet')), a0); assert.equal(answer({ type:'gen', gen:'inte', data:d }, a0.replace('på gymmet', 'i gymmet')).result, 'ok'); }
      if (/ tar semester i juli\./.test(a0)) { found.sem++; assert.ok(d.answers.includes(a0.replace('tar semester', 'åker på semester')), a0); }
    }
  });
  assert.ok(found.gym > 0 && found.sem > 0, JSON.stringify(found));
});
test('Inversion beim Übersetzen: Subjekt vorn ist ebenfalls richtig', () => {
  const BANK = app.get('BANK');
  const item = BANK.sv.find(i => i.target === 'Ikväll träffar jag honom inte.');
  run(`DB.st = {}`);
  assert.equal(answer({ type:'free', id:item.id }, 'Jag träffar honom inte ikväll.').result, 'ok');
  assert.equal(answer({ type:'free', id:item.id }, 'Ikväll träffar jag honom inte.').result, 'ok');
  assert.equal(answer({ type:'free', id:item.id }, 'Ikväll jag träffar honom inte.').result, 'bad');
});
test('Generator: Die eigene Lösung erfüllt immer die geprüfte Stellung, der Satz „Urlaub“ ist idiomatisch', () => {
  const genInte = app.get('genInte'), seqIn = app.get('seqIn'), norm = app.get('norm');
  withSeed(7, () => {
    for (let i = 0; i < 400; i++) {
      const d = genInte();
      assert.ok(Array.isArray(d.pos) && d.pos.length >= 3, d.answers[0]);
      assert.ok(seqIn(norm(d.answers[0], 'sv').split(' '), d.pos.map(w => (w === '*' ? w : norm(w, 'sv')))), `${d.answers[0]} / ${d.pos.join(' ')}`);
      assert.doesNotMatch(d.prompt, /(mache|machst|macht|machen) (immer|nie|oft) Urlaub/, d.prompt);
    }
  });
});
test('Fehlerart: Grundform gegen gebeugte Form ist Grammatik, zwei gebeugte Formen verschiedener Wörter Wortschatz', () => {
  assert.equal(errKind('hon säger att vi alltid samla svamp', ['Hon säger att vi alltid plockar svamp.'], 'sv'), 'word');
  assert.equal(errKind('hon säger att vi alltid samlar svamp', ['Hon säger att vi alltid plockar svamp.'], 'sv'), 'vocab');
});
test('Wortkästchen bei Inversion: erstes Wort bleibt groß, sonst klein', () => {
  const BANK = app.get('BANK');
  const tilesFor = item => run(`(() => { S.run = { kind:'quick', lang:'sv', queue:[{ type:'tiles', id:${JSON.stringify(item.id)} }], idx:0, ok:0, bad:0, res:[], missed:[] }; prepCur(); return S.run.queue[0].pool.map(p => p.t); })()`);
  const inv = BANK.sv.find(i => i.target === 'Ikväll träffar jag honom inte.');
  assert.ok(inv); assert.ok(tilesFor(inv).includes('Ikväll'));
  const other = BANK.sv.find(i => i.kind === 'order' && i.trap === 'bisats' && /^Jag /.test(i.target));
  assert.ok(other); assert.ok(tilesFor(other).includes('jag'));
});
