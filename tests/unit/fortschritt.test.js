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

test('Fehlerquellen: Thema, Übungsart und Fehlerart sagen oben, was die Zahl ist', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:inversion': [48, 6], 'p:bisats': [25, 5], 'p:tempus': [12, 1], 't:free': [12, 6], 't:gap': [64, 8], 'e:word': 10 } } };`);
  run(`S.errTab = 'p'`);
  let html = run(`errorSourcesHtml('sv')`);
  // Legende mit Zeichen; „Schätzung“ öffnet die Erklärung, kein geschwungenes Gleichheitszeichen
  assert.match(html, /<i class="mk-dot"><\/i><button type="button" class="term" data-a="term" data-k="schaetzung">Schätzung<\/button>/);
  assert.match(text(html), /Schätzung Bereich Schnitt \d+\u00a0%/);
  assert.doesNotMatch(html, /≈/);
  run(`S.errTab = 't'`);
  html = run(`errorSourcesHtml('sv')`);
  assert.match(html, /Anteil falsch je Übungsart, letzte 30 Tage:/); assert.match(html, /50\u00a0%/); assert.match(html, /6 von 12/);
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

test('Fehlerquellen nach Thema: Schätzung aus dem Fehlermodell, Streifen mit Bereich, Achse, Reihenfolge nach Schätzung', () => {
  // Zahlen aus dem Screenshot vom 24.11. (alles von heute, also ohne Vergessen); bis 24.70 stand 5 von 13 unten
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:bisats': [37, 8], 'p:inversion': [73, 7], 'p:species': [13, 5], 'p:tid': [20, 0], 'p:passiv': [2, 1], 't:gap': [145, 21] } } }; S.errTab = 'p';`);
  const M = run(`topicModel('sv')`), html = run(`errorSourcesHtml('sv')`);
  const rows = [...html.matchAll(/data-t="(\w+)" class="mrow[^"]*"[^>]*>.*?<span class="mpct">(\d+)\u00a0%<\/span>.*?<i class="m95" style="left:([\d.]+)%; width:([\d.]+)%"><\/i><i class="m50" style="left:([\d.]+)%; width:([\d.]+)%"><\/i><i class="mmu" style="left:([\d.]+)%"><\/i><i class="mdot" style="left:([\d.]+)%"><\/i>/g)]
    .map(m => ({ id:m[1], p:+m[2], lo:+m[3], w:+m[4], dot:+m[8], mu:+m[7] }));
  // Reihenfolge und Zahlen wie im Modell; unter 3 Aufgaben (2 von passiv) kein eigener Eintrag
  assert.deepEqual(rows.map(r => r.id), M.topics.filter(x => x.n >= 3).map(x => x.id));
  // 5 von 13 vorn, das oft geübte, sichere Thema (7 von 73) hinter Wortstellung im Nebensatz
  assert.equal(rows[0].id, 'species');
  assert.ok(rows.findIndex(r => r.id === 'bisats') < rows.findIndex(r => r.id === 'inversion'));
  const max = /<span style="left:100\.0%">50\u00a0%<\/span>/.test(html) ? 0.5 : /75\u00a0%<\/span><\/div>/.test(html) ? 0.75 : 1;
  rows.forEach(r => { const x = M.topics.find(y => y.id === r.id);
    assert.equal(r.p, Math.round(x.mean * 100), r.id);
    assert.ok(Math.abs(r.dot - Math.min(1, x.mean / max) * 100) < 0.06, r.id);
    assert.ok(Math.abs(r.lo - Math.min(1, x.lo / max) * 100) < 0.06 && Math.abs(r.lo + r.w - Math.min(1, x.hi / max) * 100) < 0.11, r.id);
    assert.ok(Math.abs(r.mu - M.mu / max * 100) < 0.06); });
  // Achse in 25er-Schritten bis zur Skala; der letzte Eintrag ohne Trennlinie
  assert.match(html, /<div class="maxis" aria-hidden="true"><span style="left:0\.0%">0\u00a0%<\/span>/);
  assert.equal((html.match(/class="mrow mlast"/g) || []).length, 1);
  // Vorlesen: was die Grafik zeigt, als Satz
  assert.match(html, /aria-label="Adjektivendungen &amp; bestimmte Form: geschätzt \d+\u00a0% falsch, wahrscheinlich \d+\u00a0% bis \d+\u00a0%"/);
});

test('Themennamen brechen nicht am Bindestrich um: „si‑Sätze“, „s‑Passiv“ mit geschütztem Bindestrich', () => {
  assert.equal(run(`keepHyph('Konditional & si-Sätze')`), 'Konditional & si\u2011Sätze');
  assert.equal(run(`keepHyph('s-Passiv, „man“ & „det finns“')`), 's\u2011Passiv, „man“ & „det finns“');
  assert.equal(run(`keepHyph('Präteritum oder Perfekt')`), 'Präteritum oder Perfekt');
  run(`DB = freshDB(); DB.st = {}; DB.focus = {}; DB.tlog = { [today()]: { es: { 'p:condicional': [40, 15], 'p:perfecto': [12, 2], 't:gap': [52, 17] } } }; S.errTab = 'p';`);
  assert.match(run(`errorSourcesHtml('es')`), /Konditional &amp; si\u2011Sätze/);
  assert.match(run(`weakHtml('es')`), /Konditional &amp; si\u2011Sätze/);
  // Schwerpunkt: der Name bleibt als Ganzes zusammen
  assert.match(run(`(S.lang = 'es', DB.settings.lang = 'es', viewHome())`), /<b class="nobr">Konditional &amp; si\u2011Sätze<\/b>/);
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

test('Heute, „Fehlerquellen“: Themen über deinem Schnitt wie im Sprach-Tab, erst ab 8 Fehlern, nur übbare Themen', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    BANK.es.filter(i => i.trap === 'serestar').slice(0, 5).forEach(i => { DB.st[i.id] = { ok: 1, bad: 0, alts: [], s: 2, d: 5, ivl: 2, last: t, due: addDays(t, 2), reps: 1 }; }); })()`);
  assert.equal(run(`weakHtml('es')`), '');
  run(`DB.tlog = { [today()]: { es: { 'p:condicional': [30, 9], 'p:prep': [12, 4], 'p:perfecto': [10, 4], 'p:porpara': [30, 1], 'p:serestar': [25, 2], 'p:genus': [20, 9], 'p:subjuntivo': [2, 2], 't:gap': [129, 31] } } };`);
  const M = run(`topicModel('es')`), ids = run(`weakTopics('es').map(x => x.id)`);
  // Höchstens drei, alle über dem Schnitt, in der Reihenfolge des Modells; Genus (nicht übbar) und unter 3 Aufgaben nicht
  const expect = M.topics.filter(x => !['genus', 'subjuntivo'].includes(x.id) && x.mean > M.mu).slice(0, 3).map(x => x.id);
  assert.deepEqual(ids, expect);
  assert.ok(ids.length >= 2 && !ids.includes('porpara') && !ids.includes('genus'));
  const html = run(`weakHtml('es')`);
  assert.match(text(html), /^Fehlerquellen /, 'derselbe Name wie auf Fortschritt');
  assert.equal((html.match(/class="mstrip"/g) || []).length, ids.length);
  assert.match(html, /<p class="legend below"><span class="mkey">/);
  // Unter 8 Fehlern in der Sprache sagt die Liste noch nichts
  run(`DB.tlog[today()].es['t:gap'] = [129, 7]`);
  assert.deepEqual(run(`weakTopics('es')`), []);
  assert.equal(run(`weakHtml('es')`), '');
});
