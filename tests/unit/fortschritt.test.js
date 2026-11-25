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
  run(`DB = freshDB(); DB.st = {}; DB.focus = {}; DB.tlog = { [today()]: { es: { 'p:condicional': [40, 15], 'p:perfecto': [12, 2], 'p:porpara': [30, 1], 'p:serestar': [30, 1], 't:gap': [112, 19] } } }; S.errTab = 'p';`);
  assert.match(run(`errorSourcesHtml('es')`), /Konditional &amp; si\u2011Sätze/);
  assert.match(run(`weakHtml('es')`), /Konditional &amp; si\u2011Sätze/);
  // Schwerpunkt: der Name bleibt als Ganzes zusammen
  assert.match(run(`(S.lang = 'es', DB.settings.lang = 'es', viewHome())`), /<b class="nobr">Konditional &amp; si\u2011Sätze<\/b>/);
});

test('Thema üben: Schätzung je Thema; oben dieselben drei höchsten Fehlerquoten wie auf Heute; Satz-Themen mit Balken, erzeugte ohne', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    DB.gen = { prep_es: { ok: 2, bad: 1, recent: [1, 0, 1] }, det_es: { ok: 3, bad: 0, recent: [1, 1, 1] } };
    BANK.es.filter(i => i.trap === 'condicional').slice(0, 2).forEach(i => { DB.st[i.id] = { ok: 2, bad: 0, alts: [], s: 30, d: 5, ivl: 6, last: t, due: addDays(t, 6), reps: 2 }; });
    S.lang = 'es'; })()`);
  let html = run('viewPickTopic()');
  let [sents, gens] = html.split('Immer neu erzeugt');
  assert.ok(gens, 'zweite Gruppe fehlt');
  const sentRows = run(`topicRows('es').filter(r => !r.gen).length`), genRows = run(`topicRows('es').filter(r => r.gen).length`);
  assert.equal((sents.match(/class="bar"/g) || []).length, sentRows);
  assert.equal((gens.match(/class="bar/g) || []).length, 0, 'erzeugte Themen ohne Balken (kein „Anteil richtig“ mehr)');
  assert.equal((gens.match(/data-a="trapgo"/g) || []).length, genRows);
  assert.match(text(sents), /Der Balken zeigt, wie viele Sätze im Thema gefestigt sind/);
  assert.doesNotMatch(text(html), /richtig|grüne Balken|Höchste Fehlerquoten|klar über/, 'ohne Daten keine Liste oben, keine Generator-Quote');
  const row = (h, t) => text(h.split(`data-t="${t}"`)[1].split('</button>')[0].replace(/^[^>]*>/, ''));
  assert.match(row(gens, 'prep'), /^Verben mit Präposition Noch zu wenige Aufgaben für eine Schätzung$/);
  assert.match(row(sents, 'condicional'), /2 von \d+ Sätzen geübt, 0 gefestigt/);
  // Mit Daten: oben dieselben drei wie auf Heute (Satz- und erzeugte Themen zusammen), nicht doppelt; markiert nur klar über Schnitt
  run(`DB.tlog = { [today()]: { es: { 'p:condicional':[40, 16], 'p:prep':[24, 10], 'p:porpara':[30, 1], 'p:serestar':[30, 1], 'p:pasado':[30, 2] } } };`);
  html = run('viewPickTopic()');
  const est = id => run(`pct(modelTopic('es', '${id}').mean)`), mu = run(`pct(topicModel('es').mu)`), top3 = run(`weakTopics('es').map(x => x.id)`), clear = run(`[...clearSet('es')]`);
  const [, topPart] = html.split('<h2 class="grp">Höchste Fehlerquoten</h2>'), top = topPart.split('<h2 class="grp">Sätze</h2>')[0];
  assert.match(text(top), new RegExp(`^Geschätzt ?, dein Schnitt ${mu}\\.`));
  assert.deepEqual((top.match(/data-t="[^"]+"/g) || []).map(x => x.slice(8, -1)), top3);
  assert.deepEqual(top3.slice(0, 2).sort(), ['condicional', 'prep']);
  assert.ok(clear.includes('condicional'), JSON.stringify(run(`topicModel('es').topics.map(x => [x.id, x.pAbove])`)));
  assert.match(row(top, 'condicional'), new RegExp(`^Konditional &amp; si.Sätze klar über Schnitt · geschätzt ${est('condicional')} falsch · 2 von \\d+ Sätzen geübt`));
  assert.match(row(top, 'prep'), new RegExp(`^Verben mit Präposition ${clear.includes('prep') ? 'klar über Schnitt · ' : ''}geschätzt ${est('prep')} falsch$`));
  for (const id of top3) assert.equal((html.match(new RegExp(`data-t="${id}"`, 'g')) || []).length, 1, 'nicht doppelt: ' + id);
  [sents, gens] = html.split('<h2 class="grp">Sätze</h2>')[1].split('Immer neu erzeugt');
  const low = ['porpara', 'serestar', 'pasado'].find(id => !top3.includes(id));
  assert.match(row(sents, low), new RegExp(`geschätzt ${est(low)} falsch · \\d+ Sätze, noch nicht begonnen$`));
});

test('Grammatik-Training zählt nur den Generator (ab 10 Aufgaben als Anteil), „Thema üben“ das ganze Thema', () => {
  run(`DB = freshDB(); DB.gen = { prep_es: { ok: 9, bad: 3, recent: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0] }, det_es: { ok: 8, bad: 2, recent: [1, 1] } }; S.lang = 'es';`);
  assert.equal(run(`genStatText('prep_es')`), 'Zuletzt 75\u00a0% richtig (letzte 12)');
  assert.equal(run(`genStatText('det_es')`), 'Bisher 80\u00a0% richtig');
  assert.equal(run(`genStatText('conj')`), 'Noch nicht geübt');
  run(`DB.gen.conj = { ok: 1, bad: 0, recent: [1] }`);
  assert.equal(run(`genStatText('conj')`), '1 Aufgabe, 1 richtig');
  const drill = text(run('viewPickGen()').split('data-g="prep_es"')[1].split('</button>')[0]);
  assert.match(drill, /Zuletzt 75\u00a0% richtig \(letzte 12\)/);
  const topic = text(run('viewPickTopic()').split('data-t="prep"')[1].split('</button>')[0]);
  assert.doesNotMatch(topic, /richtig/);
});

test('Heute, „Höchste Fehlerquoten“: immer die drei höchsten Schätzungen übbarer Themen, sobald das Modell rechnet; markiert nur klar über Schnitt', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    BANK.es.filter(i => i.trap === 'serestar').slice(0, 5).forEach(i => { DB.st[i.id] = { ok: 1, bad: 0, alts: [], s: 2, d: 5, ivl: 2, last: t, due: addDays(t, 2), reps: 1 }; }); })()`);
  assert.equal(run(`weakHtml('es')`), '');
  run(`DB.tlog = { [today()]: { es: { 'p:condicional':[40, 16], 'p:prep':[24, 10], 'p:perfecto':[20, 9], 'p:porpara':[30, 1], 'p:serestar':[30, 1], 'p:pasado':[30, 2], 'p:genus':[20, 9], 'p:subjuntivo':[2, 2], 't:gap':[196, 50] } } };`);
  const M = run(`topicModel('es')`), ids = run(`weakTopics('es').map(x => x.id)`);
  // Drei höchste Schätzungen in der Reihenfolge des Modells; Genus (nicht übbar) und unter 3 Aufgaben nicht
  const expect = M.topics.filter(x => !['genus', 'subjuntivo'].includes(x.id) && x.n >= 3).slice(0, 3).map(x => x.id);
  assert.deepEqual(ids, expect);
  assert.deepEqual(ids, ['perfecto', 'prep', 'condicional']);
  const html = run(`weakHtml('es')`), clear = run(`[...clearSet('es')]`);
  assert.match(text(html), /^Höchste Fehlerquoten /);
  assert.equal((html.match(/class="mstrip"/g) || []).length, 3);
  assert.equal((html.match(/class="mclear"/g) || []).length, ids.filter(i => clear.includes(i)).length);
  // Legende innen unter den Zeilen
  assert.match(html, /<p class="legend inrows"><span class="mkey">.*<\/p><\/div>$/);
  // Auch wenig Fehler (unter 8) oder alle gleich: die Liste steht trotzdem, ohne Markierung
  run(`DB.clear = {}; DB.tlog = { [today()]: { es: { 'p:condicional':[30, 3], 'p:prep':[30, 3], 'p:perfecto':[30, 3], 'p:porpara':[30, 3], 't:gap':[120, 7] } } };`);
  assert.equal(run(`weakTopics('es').length`), 3);
  assert.doesNotMatch(run(`weakHtml('es')`), /mclear/);
  // Rechnet das Modell nicht (weniger als 3 Themen mit Daten), bleibt die Liste weg
  run(`DB.tlog = { [today()]: { es: { 'p:condicional':[30, 9], 'p:prep':[30, 3] } } };`);
  assert.deepEqual(run(`weakTopics('es')`), []);
});

// Runde 2 (24.73): eine Zahl je Sache, Urteile nur mit genug Daten
test('Behalten: „deutlich darüber/darunter“ nur, wenn es mit 95 % stimmt; 10 von 10 reichen dafür nicht', () => {
  const view = (ok, n, niv) => text(run(`(() => { DB = freshDB(); DB.settings.niveau = '${niv || 'mittel'}'; DB.log = { [today()]: { sv: { n: ${n}, rev: ${n}, revOk: ${ok} } } }; DB.st = {}; S.view = 'progress'; S.ptab = 'sv'; S.lang = 'sv'; return viewProgress(); })()`));
  assert.match(view(10, 10), /Für ein sicheres Urteil sind 10 Wiederholungen noch zu wenige\./);
  assert.match(view(90, 93, 'fort'), /Du liegst deutlich darüber\. Ein längeres Tagwerk würde dich nicht überfordern\./);
  assert.match(view(7, 10), /Du liegst deutlich darunter\./, '7 von 10 liegen weit genug unter 90 %: P(darunter) 97 %');
  assert.match(view(30, 50), /Du liegst deutlich darunter\./);
  assert.match(view(45, 50), /Du liegst im Plan\./);
});

test('Erzeugte Themen: keine zweite Quote „zuletzt richtig“ unter dem Themenraster und im Themenblatt; Genus-Fallen bleiben', () => {
  run(`DB = freshDB(); DB.st = {}; DB.gen = { prep_es: { ok: 9, bad: 3, recent: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0] } }; DB.genus = { es: { mano: { ok: 0, bad: 1, last: 0 } } };
    DB.tlog = { [today()]: { es: { 'p:prep':[12, 3], 'p:porpara':[20, 2], 'p:serestar':[20, 1] } } }; S.view = 'progress'; S.ptab = 'es'; S.lang = 'es';`);
  const p = text(run('viewProgress()'));
  assert.doesNotMatch(p, /zuletzt richtig|Erzeugte Aufgaben/);
  assert.match(p, /Genus-Fallen: la mano\. Genus üben/);
  run(`openTopic('es', 'prep')`);
  const sheet = text(run('topicSheetHtml(S.pop)'));
  assert.doesNotMatch(sheet, /richtig\./);
  assert.match(sheet, /Fehlerquote geschätzt \d+\s%/);
});

test('Kurznamen der Generatoren auf Deutsch, in beiden Sprachen gleich', () => {
  const shorts = run(`Object.fromEntries(Object.entries(GENS).map(([k, g]) => [k, g.short || '']))`);
  assert.equal(shorts.verbind_es, shorts.verbind_sv); assert.equal(shorts.prep_es, shorts.prep_sv);
  assert.ok(!Object.values(shorts).some(s => /Konectores|Conectores|Preposiciones/.test(s)), JSON.stringify(shorts));
});

test('Schwerpunkt der Woche: auf „Heute“ als Begriff erklärt; „Alle Begriffe“ führt zu einer Liste mit den Begriffen der App', () => {
  run(`DB = freshDB(); DB.st = {}; DB.focus = {}; S.lang = 'sv'; DB.settings.lang = 'sv';`);
  assert.match(run('viewHome()'), /<p class="hint focusline"><button type="button" class="term" data-a="term" data-k="schwerpunkt">Schwerpunkt der Woche<\/button>: <b class="nobr">/);
  run(`S.pop = { type:'term', k:'schwerpunkt', lang:'sv' }`);
  const sheet = text(run('termSheetHtml(S.pop)'));
  assert.match(sheet, /so oft Schwerpunkt, wie wahrscheinlich es gerade dein schwächstes ist/);
  assert.match(run('termSheetHtml(S.pop)'), /data-a="ref" data-r="terms">Alle Begriffe/);
  const list = run(`(S.ref = 'terms', viewRef())`), app = list.split('Begriffe der App')[1];
  assert.ok(app, 'Gruppe der App-Begriffe fehlt');
  for (const k of run(`TERMS.filter(t => t.app).map(t => t.k)`)) assert.match(app, new RegExp(`data-k="${k}"`), k);
  assert.doesNotMatch(list.split('Begriffe der App')[0], /data-k="schaetzung"/);
});

// Runde 2b (24.74): Fehlerquoten zeigen, nur bei „klar über Schnitt“ handeln; Karte „Fehler“
test('Karte „Fehler“: Reiter mit eigener Schwelle, Legende unter der Grafik, Uhrzeiten führen zur Übung, Übungsart mit gleicher Skala', () => {
  run(`DB = freshDB(); DB.st = {}; DB.clear = {}; S.errTab = null; S.lang = 'sv';
    DB.tlog = { [today()]: { sv: { 'p:species':[20, 9], 'p:bisats':[30, 4], 'p:inversion':[30, 3], 'p:zeit':[20, 4], 't:gap':[60, 5], 't:free':[20, 2] } } };`);
  let html = run(`errorSourcesHtml('sv')`);
  // Thema ist vorgewählt, obwohl es unter 8 Fehlern in 30 Tagen sind (7): Das Modell rechnet
  assert.match(html, /<h2 class="grp">Fehler<\/h2>/);
  assert.ok(html.includes('aria-checked="true" data-a="errtab" data-t="p"'));
  const legendAt = html.indexOf('<span class="mkey">'), axisAt = html.indexOf('class="maxis"');
  assert.ok(axisAt > 0 && legendAt > axisAt, 'Legende unter Streifen und Achse');
  assert.match(text(html), /Tipp auf ein Thema für Regel, Beispiele und Zahlen\.$/);
  assert.match(html, /<button type="button" data-a="form" data-g="time_sv" class="mrow[^"]*" aria-label="Uhrzeiten: geschätzt/);
  const clear = run(`[...clearSet('sv')]`);
  assert.equal((html.match(/class="mclear"/g) || []).length, clear.length);
  // Übungsart und Fehlerart brauchen weiter 8 Fehler
  run(`S.errTab = 't'`);
  assert.match(text(run(`errorSourcesHtml('sv')`)), /7 Fehler bei \d+ Aufgaben\. Die Auswertung erscheint ab 8 Fehlern in 30 Tagen\./);
  run(`DB.tlog[today()].sv['t:gap'] = [60, 12]`);
  html = run(`errorSourcesHtml('sv')`);
  // höchste Quote 20 % → Skala bis 50 % wie beim Thema: 20 % füllt 40 % der Breite, mit Achse
  assert.match(html, /Lücke füllen.*?<i style="width:max\(3px, 40%\)"><\/i>/);
  assert.match(html, /class="maxis"/);
  run(`S.errTab = null`);
});

test('Sprach-Tab: Minuten der letzten 14 Tage wie im Überblick; Lernminuten erklären den gestrichelten Pausetag', () => {
  run(`(() => { DB = freshDB(); DB.st = {}; const t = today(); for (let k = 0; k < 20; k++) if (k !== 3) DB.log[addDays(t, -k)] = { sv:{ n:10, secs:600 } }; DB.done = {}; for (let k = 0; k < 20; k++) if (k !== 3) DB.done[addDays(t, -k)] = true;
    BANK.sv.slice(0, 3).forEach(i => { DB.st[i.id] = { ok:1, bad:0, alts:[], s:2, d:5, ivl:2, last:t, due:addDays(t, 2), reps:1 }; }); S.view = 'progress'; S.ptab = 'sv'; S.lang = 'sv'; })()`);
  const p = text(run('viewProgress()'));
  assert.match(p, /\b130 Minuten, letzte 14 Tage/);
  assert.doesNotMatch(p, /letzte 7 Tage/);
  const free = run(`streakData().free.has(addDays(today(), -3))`), m = text(run('minutesHtml()'));
  if (free) assert.match(m, /Pausetag/); else assert.doesNotMatch(m, /Pausetag/);
});

test('Erklärung „Schätzung“: klar über Schnitt (90/60), Unterschied zu „Behalten“, Schnitt der Themen; kein „Fehlerquelle“ in den Texten', () => {
  const t = run(`TERMS.find(x => x.k === 'schaetzung').app[0]`);
  assert.match(t, /„Klar über Schnitt“ heißt: mit mindestens 90 % Wahrscheinlichkeit über deinem Schnitt; die Markierung bleibt, bis es unter 60 % fällt/);
  assert.match(t, /„Behalten“ zählt nur Wiederholungen/);
  assert.match(t, /jedes Thema zählt gleich, nicht jede Aufgabe/);
  const all = run(`JSON.stringify(TERMS)`);
  assert.doesNotMatch(all, /Fehlerquelle/);
  run(`DB = freshDB(); DB.settings.niveau = 'fort'; S.view = 'settings'`);
  assert.match(text(run('viewSettings()')), /Einfache nur in Themen klar über deinem Schnitt\./);
});
