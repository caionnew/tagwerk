// „Dein Weg“ (seit 24.64): Abstände nach Zeit, Dauer und Pausen als Text, Jahreswechsel, die letzten fünf Etappen einzeln,
// ältere je Jahr gefaltet, der erste Übungstag immer sichtbar, nächste Ziele nach voraussichtlichem Eintreffen.
// Dazu die Herkunft fester Wendungen in der Rückmeldung.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const fresh = () => ({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, doneLang:{}, gen:{}, run:null, tlog:{}, snap:{}, used:{} });
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
// Feste Uhr: 21. November 2026, mittags (Jahresfaltung und Jahreszahlen hängen am Datum)
function fixClock(app, y, m, d){
  app.run(`globalThis.__RD = globalThis.__RD || Date; globalThis.Date = class extends __RD { constructor(...a){ if (a.length) super(...a); else super(${y}, ${m - 1}, ${d}, 12); } static now(){ return new __RD(${y}, ${m - 1}, ${d}, 12).getTime(); } };`);
}
function setup(db){
  const app = loadApp();
  fixClock(app, 2026, 11, 21);
  const J = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
  app.setDB(Object.assign(fresh(), db || {}));
  return { app, J, ds:k => J(`addDays(today(), ${-k})`) };
}
// Übungstage von „from“ bis „to“ Tage zurück (ohne die Tage in skip), je Tag Aufgaben in beiden Sprachen und ein Tagwerk
function days(ds, from, to, n, skip){
  const log = {}, done = {};
  for (let k = from; k >= to; k--) { if (skip && skip(k)) continue; log[ds(k)] = { sv:{ n, secs:n * 12 }, es:{ n, secs:n * 12 } }; done[ds(k)] = true; }
  return { log, done };
}
// Zeilen des Gleisplans in Reihenfolge, als kurze Kennung
const rows = h => [...h.matchAll(/<li class="wl( [\w-]+)*"[^>]*>([\s\S]*?)<\/li>/g)].map(m => {
  const cls = (m[1] || '').trim(), t = text(m[2]);
  return cls.startsWith('wgap') ? `gap:${t}` : cls.startsWith('wfold') ? `fold:${t}` : cls === 'wtoday' ? 'heute' : cls === 'wl-next' ? `next:${t}` : `row:${t}`;
});

test('Abstand wächst mit der Wurzel der Zeit, gedeckelt', () => {
  const { J } = setup();
  assert.deepEqual([1, 7, 30, 60, 90, 400].map(n => J(`wayGapPx(${n})`)), [7, 19, 38, 54, 66, 84]);
});

test('Text unter einem Abstand: Dauer ab 2 Wochen, Pausen ab 3 Tagen, gerundet ohne Scheingenauigkeit', () => {
  const { J } = setup();
  const t = (n, p) => J(`wayGapText(${n}, ${p})`);
  assert.equal(t(1, 0), '');
  assert.equal(t(13, 0), '', 'unter 2 Wochen zeigt nur die Höhe die Zeit');
  assert.equal(t(14, 0), '2 Wochen');
  assert.equal(t(20, 0), '3 Wochen');
  assert.equal(t(74, 0), '2 Monate');
  assert.equal(t(30, 0), '4 Wochen');
  assert.equal(t(400, 0), '13 Monate');
  assert.equal(t(900, 0), '2,5 Jahre');
  assert.equal(t(49, 16), '7 Wochen, davon 16 Tage Pause');
  assert.equal(t(120, 30), '4 Monate, davon 4 Wochen Pause');
  assert.equal(t(51, 49), '7 Wochen Pause', 'fast nur Pause');
  assert.equal(t(5, 4), '5 Tage Pause');
  assert.equal(t(10, 3), '10 Tage, davon 3 Tage Pause');
});

test('Pausen: Tage ohne Üben ab 3 in Folge, je Sprache; Tage vor dem Protokoll sind keine Pause', () => {
  const { app, J, ds } = setup();
  const { log, done } = days(ds, 40, 1, 20, k => k >= 20 && k <= 25);
  for (let k = 12; k >= 8; k--) delete log[ds(k)].sv;
  app.run(`DB.log = ${JSON.stringify(log)}; DB.done = ${JSON.stringify(done)};`);
  assert.deepEqual(J(`wayRuns(addDays(today(), -40), today(), wayAct.x, '0000')`).map(r => r.n), [6]);
  assert.deepEqual(J(`wayRuns(addDays(today(), -40), today(), wayAct.sv, '0000')`).map(r => r.n), [6, 5]);
  assert.deepEqual(J(`wayRuns(addDays(today(), -40), today(), wayAct.es, '0000')`).map(r => r.n), [6]);
  assert.deepEqual(J(`wayRuns(addDays(today(), -40), today(), wayAct.x, addDays(today(), -19))`), [], 'vor dem Protokoll unbekannt');
  // Zwei Tage ohne Üben sind keine Pause (ein Pausetag ist erlaubt, der Kalender zeigt ihn)
  app.run(`delete DB.log[addDays(today(), -3)]; delete DB.log[addDays(today(), -4)];`);
  assert.deepEqual(J(`wayRuns(addDays(today(), -19), today(), wayAct.x, '0000')`), []);
});

test('Gleisplan: nächste Ziele, „heute“, Abstände mit Text, Datum im laufenden Jahr ohne Jahreszahl; kein Link „Ganzen Weg zeigen“', () => {
  const { app, ds } = setup();
  const { log, done } = days(ds, 30, 0, 30, k => k >= 10 && k <= 26);
  app.run(`DB.log = ${JSON.stringify(log)}; DB.done = ${JSON.stringify(done)};`);
  const h = app.run('wayHtml()'), r = rows(h);
  const iToday = r.indexOf('heute');
  assert.ok(iToday > 0 && r.slice(0, iToday).every(x => x.startsWith('next:')), r.join(' / '));
  assert.ok(r.some(x => /^gap:.*Pause$/.test(x)), 'Pause im Text: ' + r.join(' / '));
  assert.match(h, /class="wg-l wg-x wg-dash"/, 'Spur gestrichelt in der Pause');
  assert.doesNotMatch(h, /Ganzen Weg|wayall/);
  const dated = r.filter(x => x.startsWith('row:'));
  assert.ok(dated.length >= 3 && dated.every(x => !x.includes('2026')), 'im laufenden Jahr ohne Jahreszahl: ' + dated.join(' / '));
});

test('Die letzten fünf einzeln, Etappen eines Tages bleiben zusammen, ältere je Jahr gefaltet, erster Übungstag immer sichtbar', () => {
  const { app } = setup();
  const way = [
    { d:'2024-03-02', k:'first' }, { d:'2024-03-05', k:'tasks', v:100 }, { d:'2024-04-01', k:'tasks', v:500 }, { d:'2024-09-01', k:'hours', v:1 },
    { d:'2025-02-01', k:'tasks', v:1000 }, { d:'2025-06-01', k:'hours', v:5 }, { d:'2025-11-20', k:'days', v:10 }, { d:'2025-12-15', k:'tasks', v:2500 },
    { d:'2026-01-06', k:'hours', v:10 }, { d:'2026-01-07', k:'days', v:50 }, { d:'2026-01-08', k:'tasks', v:5000 }, { d:'2026-01-09', k:'hours', v:25 }, { d:'2026-01-09', k:'days', v:100 }
  ];
  const view = () => { app.run(`DB.way = ${JSON.stringify(way)}; S.wayOpen = {};`); const r = rows(app.run('wayHtml()')).filter(x => !x.startsWith('next:')); return { r, detail:r.slice(r.indexOf('heute') + 1, r.findIndex(x => x.startsWith('fold:'))).filter(x => x.startsWith('row:')), folds:r.filter(x => x.startsWith('fold:')) }; };
  let v = view();
  assert.equal(v.detail.length, 5, v.detail.join(' / '));
  assert.deepEqual(v.folds, ['fold:Feb – Dez 2025 4 Etappen', 'fold:Mär – Sep 2024 3 Etappen']);
  assert.equal(v.r[v.r.length - 1], 'row:Erster Übungstag 2. Mär 2024', 'erster Übungstag ganz unten');
  assert.ok(v.r.indexOf('fold:Mär – Sep 2024 3 Etappen') === v.r.length - 2, 'direkt über dem Anfang, ohne Abstand');
  // Liegt der Schnitt mitten in einem Tag, bleibt der Tag zusammen: dann sechs einzeln
  way.splice(7, 1, { d:'2026-01-06', k:'tasks', v:2500 });
  v = view();
  assert.equal(v.detail.length, 6, v.detail.join(' / '));
  assert.equal(v.detail.filter(x => x.endsWith('6. Jan')).length, 2);
  assert.deepEqual(v.folds, ['fold:Feb – Nov 2025 3 Etappen', 'fold:Mär – Sep 2024 3 Etappen']);
  // Ein Jahr mit höchstens zwei älteren Etappen steht ohne Faltung da
  way.splice(5, 1);
  v = view();
  assert.deepEqual(v.folds, ['fold:Mär – Sep 2024 3 Etappen']);
  assert.ok(v.r.includes('row:10 Übungstage 20. Nov 2025'));
});

test('Aufklappen: ein Jahr zeigt seine Etappen mit Abständen und kurzer Bewegung; höchstens zwei ältere stehen gleich da', () => {
  const { app, J } = setup();
  const way = [{ d:'2025-01-02', k:'first' }];
  [[1, 5], [2, 9], [3, 20], [5, 2], [7, 7], [9, 14], [10, 1], [11, 3]].forEach(([m, d], i) => way.push({ d:`2025-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, k:'tasks', v:100 * (i + 1) }));
  app.run(`DB.way = ${JSON.stringify(way)};`);
  let h = app.run('wayHtml()');
  assert.match(h, /data-a="wayfold" data-y="2025" aria-expanded="false"><span class="wf-t">Jan – Mär 2025<\/span><span class="wf-n">3 Etappen/);
  assert.equal((h.match(/class="wf-dot/g) || []).length, 2, 'zwei Punkte für 3 bis 5 gefaltete Etappen');
  app.run(`S.wayOpen = { 2025:true }; S.wayAnim = '2025';`);
  h = app.run('wayHtml()');
  assert.match(h, /aria-expanded="true"/);
  assert.equal((h.match(/class="wl wl-in"/g) || []).length, 3, 'aufgeklappte Etappen erscheinen mit kurzer Bewegung');
  assert.match(h, /class="wl wgap wl-in"/, 'mit Abständen nach Zeit');
  assert.equal(J('S.wayAnim'), null, 'nur beim Aufklappen, nicht bei jedem Neuzeichnen');
  assert.doesNotMatch(app.run('wayHtml()'), /wl-in/);
  app.run(`DB.way = ${JSON.stringify(way.slice(0, 8))}; S.wayOpen = {};`);
  assert.doesNotMatch(app.run('wayHtml()'), /wfold/);
});

test('Jahreswechsel zwischen zwei Etappen: Trennlinie mit dem älteren Jahr', () => {
  const { app } = setup();
  app.run(`DB.way = ${JSON.stringify([{ d:'2025-11-02', k:'first' }, { d:'2025-12-20', k:'tasks', v:100 }, { d:'2026-01-03', k:'tasks', v:500 }])};`);
  const h = app.run('wayHtml()');
  assert.match(h, /class="wg-yr"[^>]*><b[^>]*>2025<\/b>/);
  assert.match(text(h), /20\. Dez 2025/, 'älteres Jahr mit Jahreszahl');
  assert.match(text(h), /3\. Jan(?! 2026)/, 'laufendes Jahr ohne');
});

test('Nächste Ziele: nach voraussichtlichem Eintreffen, das nächste direkt über „heute“', () => {
  const { app, ds } = setup();
  // 7 Tage zu je 70 Aufgaben (490): 500 Aufgaben morgen; 10 Übungstage in 3 Tagen; 14 Tage in Folge in 7 Tagen
  const { log, done } = days(ds, 6, 0, 35);
  app.run(`DB.log = ${JSON.stringify(log)}; DB.done = ${JSON.stringify(done)};`);
  const r = rows(app.run('wayHtml()')), next = r.slice(0, r.indexOf('heute'));
  assert.match(next[next.length - 1], /^next:500 Aufgaben noch 10$/, next.join(' / '));
  assert.match(next[next.length - 2], /^next:10 Übungstage noch 3$/);
  assert.ok(next.indexOf(next.find(x => x.includes('14 Tage in Folge'))) < next.length - 2);
  // Gefestigte Sätze: nach den Fälligkeiten der Sätze, die beim nächsten Richtigen 21 Tage erreichen
  const BANK = app.get('BANK');
  app.run(`${JSON.stringify(BANK.sv.slice(0, 12).map(i => i.id))}.forEach(id => { DB.st[id] = { s:12, d:3, ivl:10, last:addDays(today(), -8), due:addDays(today(), 2), reps:2, ok:2, bad:0, alts:[] }; });`);
  const eta = app.run(`wayEta({ per:'mature', l:'sv', need:10 })`);
  assert.equal(eta, 2);
  assert.equal(app.run(`wayEta({ per:'mature', l:'es', need:10 })`), Infinity, 'ohne Kandidaten unbekannt, dann ganz oben');
});

test('Herkunft fester Wendungen: als eigene Zeile, beim ersten Kontakt auch bei richtiger Antwort, sonst nur bei falscher', () => {
  const { app } = setup();
  const BANK = app.get('BANK'), originOf = app.get('originOf'), noteOf = app.get('noteOf'), literalOf = app.get('literalOf');
  const ko = BANK.sv.find(i => i.gap === 'ko' && i.trap === 'idiom');
  assert.match(originOf(ko), /rumpan är i land/);
  assert.doesNotMatch(noteOf(ko), /Herkunft/);
  assert.equal(literalOf(ko), 'keine Kuh auf dem Eis');
  const fb = (input, seen) => app.run(`(() => { DB.st = ${seen ? `{ ${JSON.stringify(ko.id)}:{ s:5, d:5, ivl:5, last:addDays(today(), -5), due:today(), reps:1, ok:1, bad:0, alts:[] } }` : '{}'}; const ex = { type:'cloze', id:${JSON.stringify(ko.id)} }; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], missed:[], combo:0, best:0 }; S.view = 'run'; S.run.cur = { input:${JSON.stringify(input)}, state:'answer', result:null }; check(); return S.run.cur.result + ' ' + feedbackHtml(S.run, ex, S.run.cur); })()`);
  const okNew = fb('ko', false), okSeen = fb('ko', true), bad = fb('häst', true);
  assert.match(okNew, /^ok /); assert.match(okNew, /Herkunft:<\/span> verkürzt aus/);
  assert.match(okSeen, /^ok /); assert.doesNotMatch(okSeen, /Herkunft/);
  assert.match(bad, /^bad /); assert.match(bad, /kein Grund zur Sorge/); assert.match(bad, /Herkunft:<\/span>/);
  assert.equal((bad.match(/Herkunft/g) || []).length, 1, 'nur einmal, nicht noch in der Erklärung');
  // Ohne Herkunft keine Zeile
  const plain = BANK.sv.find(i => i.gap === 'världen');
  assert.equal(originOf(plain), '');
});

test('Herkunft nur am Ende einer Erklärung, ohne Klammern darin, kurz', () => {
  const { app } = setup();
  const BANK = app.get('BANK'), originOf = app.get('originOf');
  const all = ['sv', 'es'].flatMap(l => BANK[l].filter(i => /Herkunft/.test(i.note || '')));
  assert.ok(all.length >= 5);
  all.forEach(i => {
    assert.match(i.note, /\(Herkunft: [^()]+\)$/, i.target);
    assert.ok(originOf(i).length <= 190, `${i.target}: ${originOf(i).length} Zeichen`);
  });
});
