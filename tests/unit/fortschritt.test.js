// Fortschritt: Zahlen, die man leicht falsch liest. Jede Zahl sagt, was sie zählt.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/[ \t\n]+/g, ' ').trim();

test('Lernzeit als Kennzahl: bis 10 Stunden in Minuten, nie „1 Stunden“', () => {
  assert.deepEqual(run('bigTime(4865)'), ['81', 'Minuten']);
  assert.deepEqual(run('bigTime(60)'), ['1', 'Minute']);
  assert.deepEqual(run('bigTime(0)'), ['0', 'Minuten']);
  assert.deepEqual(run('bigTime(599 * 60)'), ['599', 'Minuten']);
  assert.deepEqual(run('bigTime(600 * 60)'), ['10,0', 'Stunden']);
  assert.deepEqual(run('bigTime(150 * 3600)'), ['150', 'Stunden']);
});

test('Überblick: 81 Minuten statt „1 Stunden“, Sprachkarte nennt „heute geübt“ in eigener Zeile', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.log = { [t]: { sv: { n: 30, a: 30, ok: 28, secs: 4865, rev: 12, revOk: 12, fresh: 3 } } }; DB.done = { [t]: true };
    DB.st = {}; BANK.sv.slice(0, 5).forEach(i => { DB.st[i.id] = { ok: 1, bad: 0, alts: [], s: 2, d: 5, ivl: 2, last: t, due: addDays(t, 2), reps: 1 }; });
    S.view = 'progress'; S.ptab = 'all'; })()`);
  const html = text(run('viewProgress()'));
  assert.match(html, /81 Minuten/);
  assert.doesNotMatch(html, /\b1 Stunden/);
  assert.match(html, /1 Übungstag 1 Tagwerk 30 Aufgaben/);
  assert.match(html, /Behalten 100[\u00a0 ]% heute geübt/);
});

test('Themenkachel nennt geübt und gefestigt, passend zu beiden Balken', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    BANK.sv.filter(i => i.trap === 'inversion').slice(0, 3).forEach((i, k) => { DB.st[i.id] = { ok: 2, bad: 0, alts: [], s: 30, d: 5, ivl: k ? 5 : 30, last: t, due: addDays(t, 5), reps: 2 }; }); })()`);
  const n = run(`BANK.sv.filter(i => i.trap === 'inversion').length`);
  const tile = text(run('topicGridHtml("sv")').split('data-t="inversion"')[1].split('</button>')[0]);
  assert.match(tile, /3 geübt · 1 gefestigt/);
  const fresh = text(run('topicGridHtml("sv")').split('data-t="bisats"')[1].split('</button>')[0]);
  assert.match(fresh, new RegExp(`${run(`BANK.sv.filter(i => i.trap === 'bisats').length`)} Sätze, neu`));
  assert.ok(n > 3);
});

test('Fehlerquellen: Thema und Übungsart sagen oben, was die Zahl ist', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:inversion': [48, 6], 'p:bisats': [25, 5], 't:free': [12, 6], 't:gap': [64, 8], 'e:word': 10 } } };`);
  run(`S.errTab = 'p'`);
  let html = run(`errorSourcesHtml('sv')`);
  assert.match(text(html), /Anteil falscher Antworten je Thema, ab 10 Aufgaben:/); assert.match(html, /6 von 48 Aufgaben/); assert.match(html, /13\u00a0%/);
  run(`S.errTab = 't'`);
  html = run(`errorSourcesHtml('sv')`);
  assert.match(html, /Anteil falscher Antworten je Übungsart:/); assert.match(html, /50 %|50 %/);
});

test('Behalten deutlich über Plan: unter „Fortgeschritten“ längeres Tagwerk, sonst erst schwerere Sätze', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.log = { [t]: { sv: { n: 50, a: 50, ok: 49, secs: 900, rev: 45, revOk: 44, fresh: 5 } } };
    DB.st = {}; BANK.sv.slice(0, 5).forEach(i => { DB.st[i.id] = { ok: 1, bad: 0, alts: [], s: 2, d: 5, ivl: 2, last: t, due: addDays(t, 2), reps: 1 }; });
    S.view = 'progress'; S.ptab = 'sv'; S.lang = 'sv'; })()`);
  run(`DB.settings.niveau = 'mittel'`);
  let html = run('viewProgress()');
  assert.match(html, /Das Niveau <button[^>]*data-a="settings"[^>]*>„Fortgeschritten“<\/button> bringt längere und schwerere/);
  run(`DB.settings.niveau = 'fort'`);
  html = run('viewProgress()');
  assert.match(html, /Ein längeres Tagwerk würde dich nicht überfordern/);
});

test('Fehlerquellen nach Thema: Anteil falsch, ab 10 Aufgaben, das schwächste Thema vorn statt des häufigsten', () => {
  // Zahlen aus dem Screenshot vom 24.11.: bis 24.70 nach Anzahl der Fehler sortiert, 5 von 13 stand unten
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:bisats': [37, 8], 'p:inversion': [73, 7], 'p:species': [13, 5], 'p:passiv': [4, 3], 'p:tid': [20, 0], 't:gap': [147, 23] } } }; S.errTab = 'p';`);
  const html = run(`errorSourcesHtml('sv')`);
  const rows = [...html.matchAll(/<span class="el">([^<]+)<span class="esub">(\d+) von (\d+) Aufgaben<\/span><\/span><span class="ebar"[^>]*><span style="width:([\d.]+)%"><\/span><\/span><span class="ev">(\d+)\u00a0%</g)]
    .map(m => ({ label:m[1], n:`${m[2]}/${m[3]}`, w:+m[4], p:+m[5] }));
  // 4 Aufgaben (3 falsch) sind noch keine Aussage, ein Thema ohne Fehler keine Fehlerquelle
  assert.deepEqual(rows.map(r => r.n), ['5/13', '8/37', '7/73']);
  assert.deepEqual(rows.map(r => r.p), [38, 22, 10]);
  rows.forEach(r => { const [b, n] = r.n.split('/').map(Number); assert.ok(Math.abs(r.w - b / n * 100) < 0.1, r.label); });
  assert.match(text(html), /Wenige Aufgaben zählen für die Reihenfolge weniger/);
});

test('Geglättete Quote: wenige Aufgaben ziehen zur eigenen Quote, eine Rechnung für alle Stellen', () => {
  run(`DB = freshDB(); DB.st = {}; DB.focus = {}; DB.tlog = { [today()]: { es: { 'p:condicional': [40, 15], 'p:perfecto': [10, 4], 'p:prep': [12, 4], 'p:porpara': [30, 1], 'p:genus': [20, 6], 'p:subjuntivo': [6, 3], 't:gap': [118, 33] } } }; S.errTab = 'p';`);
  // 15 von 40 (38 %) vor 4 von 10 (40 %): bei 10 Aufgaben ist der Anteil noch unsicher; 3 von 6 fehlt (unter 10)
  const list = run(`topicStats(errStats('es', 30))`);
  assert.deepEqual(list.map(x => x.id), ['condicional', 'perfecto', 'prep', 'genus', 'porpara']);
  const mean = 33 / 118;
  assert.ok(Math.abs(list[1].score - (4 + 10 * mean) / 20) < 1e-9);
  // Dieselbe Reihenfolge auf Heute (ohne Genus, nicht übbar), im Reiter „Thema“ und beim Schwerpunkt der Woche
  assert.deepEqual(run(`weakTopics('es').map(x => x.id)`), ['condicional', 'perfecto', 'prep']);
  const src = text(run(`errorSourcesHtml('es')`));
  assert.ok(src.indexOf('Konditional') < src.indexOf('Perfecto') && src.indexOf('Perfecto') < src.indexOf('Verben mit Präposition'));
  assert.equal(run(`focusCandidates('es')[0]`), 'condicional');
  // Schwerpunkt erst ab 10 Aufgaben: 3 von 6 (50 %) zählt noch nicht als schwach
  run(`DB.tlog = { [today()]: { es: { 'p:subjuntivo': [6, 3], 'p:condicional': [20, 3], 't:gap': [26, 6] } } };`);
  assert.equal(run(`focusCandidates('es')[0]`), 'condicional');
});

test('Thema üben: Satz-Themen mit Balken für den gefestigten Anteil, erzeugte Themen unter 10 Aufgaben ohne Balken, als Anzahl', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    DB.gen = { prep_es: { ok: 2, bad: 1, recent: [1, 0, 1] }, det_es: { ok: 3, bad: 0, recent: [1, 1, 1] } };
    BANK.es.filter(i => i.trap === 'condicional').slice(0, 2).forEach(i => { DB.st[i.id] = { ok: 2, bad: 0, alts: [], s: 30, d: 5, ivl: 6, last: t, due: addDays(t, 6), reps: 2 }; });
    S.lang = 'es'; })()`);
  const html = run('viewPickTopic()');
  const [sents, gens] = html.split('Immer neu erzeugt');
  assert.ok(gens, 'zweite Gruppe fehlt');
  const sentRows = run(`topicRows('es').filter(r => !r.gen).length`), genRows = run(`topicRows('es').filter(r => r.gen).length`);
  assert.equal((sents.match(/class="bar"/g) || []).length, sentRows);
  assert.equal((gens.match(/class="bar/g) || []).length, 0);
  assert.equal((gens.match(/data-a="trapgo"/g) || []).length, genRows);
  assert.match(text(sents), /Der Balken zeigt, wie viele Sätze im Thema gefestigt sind/);
  assert.match(text(gens.split('data-t="prep"')[1].split('</button>')[0]), /3 Aufgaben, 2 richtig/);
  assert.match(text(gens.split('data-t="concord"')[1].split('</button>')[0]), /3 Aufgaben, 3 richtig/);
  assert.doesNotMatch(text(gens), /%/);
  assert.match(text(sents.split('data-t="condicional"')[1].split('</button>')[0]), /2 von \d+ Sätzen geübt, 0 gefestigt/);
});

test('Erzeugte Bereiche: ab 10 Aufgaben grüner Balken und Prozent, derselbe Anteil in Balken, „Thema üben“ und „Grammatik-Training“', () => {
  run(`DB = freshDB(); DB.gen = { prep_es: { ok: 9, bad: 3, recent: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0] }, det_es: { ok: 8, bad: 2, recent: [1, 1] } }; S.lang = 'es';`);
  assert.equal(run(`genStatText('prep_es')`), 'Zuletzt 75 % richtig (letzte 12)');
  assert.equal(run(`genStatText('det_es')`), 'Bisher 80 % richtig');
  assert.equal(run(`genStatText('conj')`), 'Noch nicht geübt');
  run(`DB.gen.conj = { ok: 1, bad: 0, recent: [1] }`);
  assert.equal(run(`genStatText('conj')`), '1 Aufgabe, 1 richtig');
  const topic = text(run('viewPickTopic()').split('data-t="prep"')[1].split('</button>')[0]);
  const drill = text(run('viewPickGen()').split('data-g="prep_es"')[1].split('</button>')[0]);
  assert.match(topic, /Zuletzt 75 % richtig \(letzte 12\)/);
  assert.match(drill, /Zuletzt 75 % richtig \(letzte 12\)/);
  const html = run('viewPickTopic()'), rowOf = t => html.split(`data-t="${t}"`)[1].split('</button>')[0];
  assert.match(rowOf('prep'), /class="bar qbar"[^>]*><span style="width:75%"/);
  assert.match(rowOf('concord'), /class="bar qbar"[^>]*><span style="width:80%"/);
  assert.doesNotMatch(rowOf('konjugation'), /class="bar/);
  assert.match(text(html.split('Immer neu erzeugt')[1]), /^Der grüne Balken zeigt den Anteil richtiger Antworten, ab 10 Aufgaben/);
});

test('Heute, „Fehlerquellen“: wie auf Fortschritt, erst ab 8 Fehlern, je Thema mindestens 2 Fehler und 10 Aufgaben, nur übbare Themen', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    BANK.es.filter(i => i.trap === 'serestar').slice(0, 5).forEach(i => { DB.st[i.id] = { ok: 1, bad: 0, alts: [], s: 2, d: 5, ivl: 2, last: t, due: addDays(t, 2), reps: 1 }; }); })()`);
  // Geübt, aber keine Fehler: kein Block mehr (früher standen hier Themen mit 0 gefestigt)
  assert.equal(run(`weakHtml('es')`), '');
  run(`DB.tlog = {
    [today()]: { es: { 'p:condicional': [30, 5], 'p:prep': [12, 3], 'p:perfecto': [10, 2], 'p:porpara': [14, 1], 'p:genus': [20, 6], 'p:subjuntivo': [7, 3], 't:gap': [93, 20] } },
    [addDays(today(), -30)]: { es: { 'p:idiom': [19, 9], 't:gap': [19, 9] } } };`);
  assert.deepEqual(run(`weakTopics('es').map(x => x.id)`), ['prep', 'perfecto', 'condicional']);
  // Gleiche Reihenfolge wie im Reiter „Thema“ der Fehlerquellen, dort ohne die nicht übbaren Bereiche
  const src = text(run(`(S.errTab = 'p', errorSourcesHtml('es'))`));
  assert.ok(src.indexOf('Verben mit Präposition') < src.indexOf('Perfecto') && src.indexOf('Perfecto') < src.indexOf('Konditional'));
  const html = run(`weakHtml('es')`);
  assert.match(text(html), /^Fehlerquellen, letzte 30 Tage /, 'derselbe Name wie auf Fortschritt');
  // Die Zeile sagt, was der Balken zeigt: Anteil falsch, dazu die Anzahl; der Balken ist der Anteil auf voller Spur
  const cond = html.split('data-t="condicional"')[1].split('</button>')[0];
  assert.match(text(cond), /17\u00a0% falsch, 5 von 30$/);
  assert.match(cond, /class="bar wbar"[^>]*><span style="width:max\(3px, 16\.7%\)">/);
  assert.equal((html.match(/class="bar wbar"/g) || []).length, 3);
  // Unter 8 Fehlern in der Sprache sagt die Liste noch nichts
  run(`DB.tlog[today()].es['t:gap'] = [93, 7]`);
  assert.deepEqual(run(`weakTopics('es')`), []);
  assert.equal(run(`weakHtml('es')`), '');
});
