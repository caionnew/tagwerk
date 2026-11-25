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

test('Themenblatt „Deine Zahlen“: Stand nennt Sätze, geübt und gefestigt (bis 24.74 auf der Themenkachel)', () => {
  run(`(() => { DB = freshDB(); const t = today(); DB.st = {};
    BANK.sv.filter(i => i.trap === 'inversion').slice(0, 3).forEach((i, k) => { DB.st[i.id] = { ok: 2, bad: 0, alts: [], s: 30, d: 5, ivl: k ? 5 : 30, last: t, due: addDays(t, 5), reps: 2 }; }); })()`);
  const n = run(`BANK.sv.filter(i => i.trap === 'inversion').length`);
  assert.ok(n > 3);
  assert.match(text(run(`topicNumbersHtml('sv', 'inversion')`)), new RegExp(`Stand ${n} Sätze im Thema, 3 geübt, 1 gefestigt ?\\.`));
  // Ohne Schätzungen führt die Themenliste zu Regel und Beispielen aller Themen; kein Raster mehr
  const list = run(`topicListHtml('sv')`);
  assert.match(text(list), /^Themen Schätzungen erscheinen, sobald drei Themen genug Aufgaben haben\. Regel und Beispiele: /);
  assert.match(list, /<button type="button" class="link inl" data-a="topic" data-t="bisats">/);
  assert.doesNotMatch(list, /tgrid|gefestigt/);
});

test('Legenden: „Schätzung“ als Begriff, kein ≈; Übungsart mit demselben Modell und eigenem Schnitt', () => {
  run(`DB = freshDB(); DB.tlog = { [today()]: { sv: { 'p:inversion': [48, 6], 'p:bisats': [25, 5], 'p:tempus': [12, 1], 't:free': [12, 6], 't:gap': [64, 8], 't:tiles': [30, 2], 'e:word': 10 } } };`);
  let html = run(`topicListHtml('sv')`);
  // Legende mit Zeichen; „Schätzung“ öffnet die Erklärung, kein geschwungenes Gleichheitszeichen
  assert.match(html, /<i class="mk-dot"><\/i><button type="button" class="term" data-a="term" data-k="schaetzung">Schätzung<\/button>/);
  assert.match(text(html), /Schätzung Bereich Schnitt \d+\u00a0% % klar über Schnitt/);
  assert.doesNotMatch(html, /≈/);
  run(`S.errTab = 't'`);
  html = run(`errorWaysHtml('sv')`);
  const T = run(`typeModel('sv')`);
  assert.ok(T.fitted);
  assert.match(text(html), new RegExp(`Schnitt der Übungsarten ${Math.round(T.mu * 100)}\u00a0%`));
  // Reihenfolge nach Schätzung, Freies Übersetzen (6 von 12) vorn; Zahl = Schätzung, nicht die rohe Quote
  const names = [...html.matchAll(/<span class="mname">([^<]+)<\/span>/g)].map(m => m[1]);
  assert.deepEqual(names, T.topics.map(x => run(`ERR_TYPES['${x.id}']`)));
  assert.equal(names[0], 'Freies Übersetzen');
  assert.match(html, new RegExp(`Freies Übersetzen</span><span class="mright"><span class="mval"><span class="mpct">${Math.round(T.topics[0].mean * 100)}\u00a0%`));
  assert.equal((html.match(/class="mstrip"/g) || []).length, 3);
  run(`S.errTab = null`);
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

test('Themenliste: Schätzung aus dem Fehlermodell, Streifen mit Bereich, Achse, Reihenfolge nach Schätzung', () => {
  // Zahlen aus dem Screenshot vom 24.11. (alles von heute, also ohne Vergessen); bis 24.70 stand 5 von 13 unten
  run(`DB = freshDB(); DB.clear = {}; DB.tlog = { [today()]: { sv: { 'p:bisats': [37, 8], 'p:inversion': [73, 7], 'p:species': [13, 5], 'p:tid': [20, 0], 'p:passiv': [2, 1], 't:gap': [145, 21] } } };`);
  const M = run(`topicModel('sv')`), html = run(`topicListHtml('sv')`);
  const rows = [...html.matchAll(/data-t="(\w+)" data-z="1" class="mrow[^"]*"[^>]*>.*?<span class="mpct(?: cl)?">(\d+)\u00a0%<\/span>.*?<i class="m95" style="left:([\d.]+)%; width:([\d.]+)%"><\/i><i class="m50" style="left:([\d.]+)%; width:([\d.]+)%"><\/i><i class="mmu" style="left:([\d.]+)%"><\/i><i class="mdot" style="left:([\d.]+)%"><\/i>/g)]
    .map(m => ({ id:m[1], p:+m[2], lo:+m[3], w:+m[4], dot:+m[8], mu:+m[7] }));
  // Reihenfolge und Zahlen wie im Modell; unter 3 Aufgaben (2 von passiv) kein eigener Eintrag, sondern unter „Noch ohne Schätzung“
  assert.deepEqual(rows.map(r => r.id), M.topics.filter(x => x.n >= 3).map(x => x.id));
  assert.match(text(html), /Noch ohne Schätzung: .*s\u2011Passiv/);
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
  assert.match(html, /aria-label="Adjektivendungen &amp; bestimmte Form: geschätzt \d+\u00a0% falsch, wahrscheinlich \d+\u00a0% bis \d+\u00a0%/);
  // Ohne acht Wochen Protokoll noch keine Pfeile, nur der Hinweis, ab wann
  assert.doesNotMatch(html, /class="aslot"|class="arw/);
  assert.match(text(html), /Ab \d+\. \S+ zeigen Pfeile, ob ein Thema besser oder schlechter läuft als in den vier Wochen davor\./);
});

test('Themennamen brechen nicht am Bindestrich um: „si‑Sätze“, „s‑Passiv“ mit geschütztem Bindestrich', () => {
  assert.equal(run(`keepHyph('Konditional & si-Sätze')`), 'Konditional & si\u2011Sätze');
  assert.equal(run(`keepHyph('s-Passiv, „man“ & „det finns“')`), 's\u2011Passiv, „man“ & „det finns“');
  assert.equal(run(`keepHyph('Präteritum oder Perfekt')`), 'Präteritum oder Perfekt');
  run(`DB = freshDB(); DB.st = {}; DB.focus = {}; DB.tlog = { [today()]: { es: { 'p:condicional': [40, 15], 'p:perfecto': [12, 2], 'p:porpara': [30, 1], 'p:serestar': [30, 1], 't:gap': [112, 19] } } };`);
  assert.match(run(`topicListHtml('es')`), /Konditional &amp; si\u2011Sätze/);
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
  assert.match(text(sents), /Der Balken zeigt, wie viele Sätze im Thema du schon geübt hast/);
  assert.doesNotMatch(text(html), /richtig|grüne Balken|Höchste Fehlerquoten|klar über/, 'ohne Daten keine Liste oben, keine Generator-Quote');
  const row = (h, t) => text(h.split(`data-t="${t}"`)[1].split('</button>')[0].replace(/^[^>]*>/, ''));
  assert.match(row(gens, 'prep'), /^Verben mit Präposition Noch zu wenige Aufgaben für eine Schätzung$/);
  assert.match(row(sents, 'condicional'), /^Konditional &amp; si.Sätze 2 von \d+ Sätzen geübt$/);
  // Der Balken zeigt den geübten Anteil (2 von n), nicht den gefestigten (0)
  const nCond = run(`BANK.es.filter(i => i.trap === 'condicional').length`);
  assert.match(sents.split('data-t="condicional"')[1].split('</button>')[0], new RegExp(`<span class="bar" aria-hidden="true"><span style="width:${Math.max(3, Math.round(2 / nCond * 100))}%">`));
  // Mit Daten: oben dieselben drei wie auf Heute (Satz- und erzeugte Themen zusammen), nicht doppelt; markiert nur klar über Schnitt
  run(`DB.tlog = { [today()]: { es: { 'p:condicional':[40, 16], 'p:prep':[24, 10], 'p:porpara':[30, 1], 'p:serestar':[30, 1], 'p:pasado':[30, 2] } } };`);
  html = run('viewPickTopic()');
  const est = id => run(`pct(topicModel('es').topics.find(x => x.id === '${id}').mean)`), mu = run(`pct(topicModel('es').mu)`), top3 = run(`weakTopics('es').map(x => x.id)`), clear = run(`[...clearSet('es')]`);
  const [, topPart] = html.split('<h2 class="grp">Höchste Fehlerquoten</h2>'), top = topPart.split('<h2 class="grp">Sätze</h2>')[0];
  assert.match(text(top), new RegExp(`^Geschätzt ?, dein Schnitt ${mu}\\.`));
  assert.deepEqual((top.match(/data-t="[^"]+"/g) || []).map(x => x.slice(8, -1)), top3);
  assert.deepEqual(top3.slice(0, 2).sort(), ['condicional', 'prep']);
  assert.ok(clear.includes('condicional'), JSON.stringify(run(`topicModel('es').topics.map(x => [x.id, x.pAbove])`)));
  // „Klar über Schnitt“ als rot hinterlegte Quote, erklärt in der Zeile darüber
  assert.match(row(top, 'condicional'), new RegExp(`^Konditional &amp; si.Sätze geschätzt ${est('condicional')} falsch · 2 von \\d+ Sätzen geübt$`));
  assert.match(top.split('data-t="condicional"')[1], new RegExp(`^[^>]*>.*?geschätzt <span class="mpct cl">${est('condicional')}</span> falsch`));
  assert.match(text(top), /klar über Schnitt\./);
  assert.match(row(top, 'prep'), new RegExp(`^Verben mit Präposition geschätzt ${est('prep')} falsch$`));
  assert.equal(/<span class="mpct cl">/.test(top.split('data-t="prep"')[1].split('</button>')[0]), clear.includes('prep'));
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
  assert.equal((html.match(/class="mpct cl"/g) || []).length, ids.filter(i => clear.includes(i)).length);
  assert.equal(/klar über Schnitt/.test(html), ids.some(i => clear.includes(i)), 'Legende nur, wenn markiert');
  // Legende innen unter den Zeilen
  assert.match(html, /<p class="legend inrows"><span class="mkey">.*<\/p><\/div>$/);
  // Auch wenig Fehler (unter 8) oder alle gleich: die Liste steht trotzdem, ohne Markierung
  run(`DB.clear = {}; DB.tlog = { [today()]: { es: { 'p:condicional':[30, 3], 'p:prep':[30, 3], 'p:perfecto':[30, 3], 'p:porpara':[30, 3], 't:gap':[120, 7] } } };`);
  assert.equal(run(`weakTopics('es').length`), 3);
  assert.doesNotMatch(run(`weakHtml('es')`), /mpct cl|klar über/);
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

test('Erzeugte Themen: keine zweite Quote „zuletzt richtig“ in der Themenliste und im Themenblatt; Genus-Fallen bleiben', () => {
  run(`DB = freshDB(); DB.st = {}; DB.gen = { prep_es: { ok: 9, bad: 3, recent: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0] } }; DB.genus = { es: { mano: { ok: 0, bad: 1, last: 0 } } };
    DB.tlog = { [today()]: { es: { 'p:prep':[12, 3], 'p:porpara':[20, 2], 'p:serestar':[20, 1] } } }; S.view = 'progress'; S.ptab = 'es'; S.lang = 'es';`);
  const p = text(run('viewProgress()'));
  assert.doesNotMatch(p, /zuletzt richtig|Erzeugte Aufgaben/);
  assert.match(p, /Genus-Fallen: la mano\. Genus üben/);
  run(`openTopic('es', 'prep', 'num')`);
  const sheet = text(run('topicSheetHtml(S.pop)'));
  assert.doesNotMatch(sheet, /richtig\./);
  assert.match(sheet, /\d+\s% geschätzt falsch/);
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
test('Themenliste und Karte „Wie du Fehler machst“: Legende unter der Grafik, Uhrzeiten führen zur Übung, Übungsart vorgewählt', () => {
  run(`DB = freshDB(); DB.st = {}; DB.clear = {}; S.errTab = null; S.lang = 'sv';
    DB.tlog = { [today()]: { sv: { 'p:species':[20, 9], 'p:bisats':[30, 4], 'p:inversion':[30, 3], 'p:zeit':[20, 4], 't:gap':[60, 5], 't:free':[20, 2], 't:tiles':[20, 1] } } };`);
  let html = run(`topicListHtml('sv')`);
  const legendAt = html.indexOf('<span class="mkey">'), axisAt = html.indexOf('class="maxis"');
  assert.ok(axisAt > 0 && legendAt > axisAt, 'Legende unter Streifen und Achse');
  assert.match(text(html), /Tipp auf ein Thema für deine Zahlen und die Regel\./);
  assert.match(html, /<button type="button" data-a="form" data-g="time_sv" class="mrow[^"]*" aria-label="Uhrzeiten: geschätzt/);
  // Themen mit Themenblatt öffnen auf „Deine Zahlen“
  assert.match(html, /<button type="button" data-a="topic" data-t="species" data-z="1" class="mrow/);
  const clear = run(`[...clearSet('sv')]`);
  assert.ok(clear.includes('species'));
  assert.equal((html.match(/class="mpct cl">/g) || []).length, clear.length, 'je markiertes Thema eine rote Quote');
  assert.match(html, /<span class="mpct cl kpill">%<\/span>klar über Schnitt/);
  assert.match(html, /aria-label="Adjektivendungen[^"]*, klar über Schnitt"/);
  // Karte: Übungsart vorgewählt, sobald drei Übungsarten Daten haben, auch unter 8 Fehlern
  html = run(`errorWaysHtml('sv')`);
  assert.match(html, /^<h2 class="grp">Wie du Fehler machst<\/h2>/);
  assert.ok(html.includes('aria-checked="true" data-a="errtab" data-t="t"'));
  assert.deepEqual([...html.matchAll(/data-a="errtab" data-t="(\w)"/g)].map(m => m[1]), ['t', 'e', 's']);
  assert.ok(html.indexOf('class="maxis"') < html.indexOf('<span class="mkey">'));
  // Ohne Daten: ein Satz statt Reiter
  run(`DB.tlog = {}`);
  assert.equal(text(run(`errorWaysHtml('sv')`)), 'Wie du Fehler machst Erscheint, sobald drei Übungsarten genug Aufgaben haben.');
  run(`S.errTab = null`);
});

test('Pfeile: die vier Wochen bis Sonntag gegen die vier davor, Stufen nach Sicherheit, kein Pfeil bei kaum Unterschied', () => {
  // Zehn Wochen Protokoll: species wird besser (8 → 2 Fehler je Woche bei 20), bisats schlechter, inversion bleibt
  run(`(() => { DB = freshDB(); DB.st = {}; DB.clear = {}; S.lang = 'sv'; const t = today(); DB.tlog = {};
    for (let k = 70; k >= 0; k--) { const d = addDays(t, -k), old = d < addDays(mondayOf(t), -28);
      DB.tlog[d] = { sv: { 'p:species':[3, old ? (k % 3 ? 1 : 2) : (k % 4 ? 0 : 1)], 'p:bisats':[3, old ? (k % 4 ? 0 : 1) : (k % 3 ? 1 : 2)], 'p:inversion':[3, k % 5 ? 0 : 1], 'p:tempus':[1, 0], 't:gap':[10, 2] } }; } })()`);
  const C = run(`topicChange('sv')`);
  assert.ok(C.ready);
  assert.equal(run(`mondayOf(today())`), C.mon);
  assert.equal(C.aFrom, run(`addDays(mondayOf(today()), -28)`));
  // Nur Tage vor diesem Montag zählen: heute geübt ändert nichts
  const sp = C.topics.species;
  assert.equal(sp.A.n, 84); assert.equal(sp.B.n, 84);
  assert.ok(sp.better && sp.p > 0.95 && sp.lvl === 3, JSON.stringify(sp));
  assert.ok(!C.topics.bisats.better && C.topics.bisats.lvl === 3);
  // tempus: 28 gegen 28, keine Fehler → P = 50 %, kein Pfeil
  assert.ok(Math.abs(C.topics.tempus.p - 0.5) < 1e-3 && C.topics.tempus.lvl === 0);
  // Stufen: unter 60 % keiner, ab 60 blass, ab 80 mittel, ab 95 kräftig, symmetrisch für „schlechter“
  assert.deepEqual([0.55, 0.65, 0.85, 0.96, 0.45, 0.3, 0.1, 0.04].map(p => run(`changeLevel(${p})`)), [0, 1, 2, 3, 0, 1, 2, 3]);
  // pLess ist P(X1 < X2): symmetrisch und gegen eine Monte-Carlo-freie Probe (gleiche Verteilungen → ½)
  assert.ok(Math.abs(run('pLess(3, 7, 3, 7)') - 0.5) < 1e-4);
  assert.ok(Math.abs(run('pLess(2, 8, 4, 6)') + run('pLess(4, 6, 2, 8)') - 1) < 1e-4);
  const html = run(`topicListHtml('sv')`);
  const slot = id => html.split(`data-t="${id}"`)[1].split('</button>')[0].match(/<span class="aslot">(.*?)<\/span>/)[1];
  assert.match(slot('species'), /^<svg class="arw l3" viewBox="0 0 16 12" aria-hidden="true"><polyline points="1.5,1 /, 'fallend = besser');
  assert.match(slot('bisats'), /^<svg class="arw l3"[^>]*><polyline points="1.5,11 /, 'steigend = schlechter');
  assert.equal(slot('tempus'), '', 'kaum Unterschied: leere Stelle, kein waagrechter Pfeil');
  assert.match(text(html), /besser, schlechter als die vier Wochen davor; kräftiger = sicherer/);
  assert.match(html, /aria-label="Adjektivendungen[^"]*, besser mit über 99\u00a0% Wahrscheinlichkeit"/);
  // Jede Zeile mit Pfeil sagt es auch zum Vorlesen; welche das sind, hängt vom Wochentag ab (Zeiträume bis Sonntag)
  for (const [id, c] of Object.entries(C.topics)) if (c.lvl) assert.match(html, new RegExp(`data-t="${id}"[^>]*aria-label="[^"]*, (besser|schlechter) mit [^"]+ Wahrscheinlichkeit"`), id);
  // „Deine Zahlen“ nennt dieselben Zahlen
  const z = text(run(`topicNumbersHtml('sv', 'species')`));
  assert.match(z, new RegExp(`Vier Wochen bis \\d+\\. \\S+( \\d{4})?: \\d+\u00a0% \\(${sp.A.k} von 84\\) falsch, die vier davor \\d+\u00a0% \\(${sp.B.k} von 84\\): besser mit ${run(`probPct(${sp.p})`)} Wahrscheinlichkeit ?\\.`));
  assert.match(text(run(`topicNumbersHtml('sv', 'tempus')`)), /\(0 von 28\): besser und schlechter gleich wahrscheinlich, kein Pfeil\./);
  // Unter acht Wochen: kein Pfeil, Datum ab wann
  run(`Object.keys(DB.tlog).filter(d => d < addDays(today(), -40)).forEach(d => delete DB.tlog[d])`);
  const C2 = run(`topicChange('sv')`);
  assert.ok(!C2.ready);
  assert.equal(C2.from, run(`(() => { const f = Object.keys(DB.tlog).sort()[0], d = addDays(f, 56); return mondayOf(d) === d ? d : addDays(mondayOf(d), 7); })()`));
  assert.match(text(run(`topicNumbersHtml('sv', 'species')`)), /Ab \d+\. \S+ vergleicht die App jeden Montag die letzten vier Wochen mit den vier davor\./);
});

test('Themenblatt: zwei Reiter, aus Fortschritt auf „Deine Zahlen“; Verlauf über 12 Wochen, Etappen, nicht gewusste Sätze', () => {
  run(`(() => { DB = freshDB(); DB.st = {}; DB.clear = {}; S.lang = 'sv'; S.view = 'progress'; const t = today(); DB.tlog = {};
    for (let k = 30; k >= 0; k--) DB.tlog[addDays(t, -k)] = { sv: { 'p:inversion':[4, k % 3 ? 0 : 1], 'p:bisats':[3, 1], 'p:tempus':[3, 0] } };
    const it = BANK.sv.filter(i => i.trap === 'inversion'); DB.st[it[0].id] = { ok:1, bad:2, lapses:2, alts:[], s:2, d:5, ivl:1, last:t, due:t, reps:3 };
    DB.etap = [{ d:addDays(t, -3), l:'sv', k:'inversion', s:1, b:[120, 30], c:[120, 12], i:2 }]; })()`);
  run(`openTopic('sv', 'inversion')`);
  let h = run('topicSheetHtml(S.pop)');
  assert.match(h, /aria-checked="true" data-a="toptab" data-t="rule">Regel/);
  assert.match(h, /Beispiele/); assert.doesNotMatch(h, /Verlauf, 12 Wochen/);
  run(`openTopic('sv', 'inversion', 'num')`);
  h = run('topicSheetHtml(S.pop)');
  assert.match(h, /aria-checked="true" data-a="toptab" data-t="num">Deine Zahlen/);
  assert.doesNotMatch(h, /Typischer Fehler/);
  assert.match(text(h), /Verlauf, 12 Wochen/);
  assert.match(h, /<svg viewBox="0 0 320 140" class="dsvg" role="img"/);
  // Punkte = Wochen mit Aufgaben; Linie = Schätzung je Woche
  const H = run(`topicHistory('sv', 'inversion')`);
  assert.equal(H.length, 12); assert.equal(H[11].end, run('today()'));
  assert.equal((h.match(/class="craw"/g) || []).length, H.filter(w => w.n).length);
  assert.equal(H.reduce((a, w) => a + w.n, 0), 124);
  assert.match(text(h), /Etappen \d+\. \S+( \d{4})? Fehler halbiert: 25\u00a0% → 10\u00a0%/);
  assert.match(text(h), /Bei Wiederholungen nicht gewusst .* · 2×/);
  // Umschalten bleibt im Blatt
  run(`S.pop.tab = 'rule'`);
  assert.match(run('topicSheetHtml(S.pop)'), /Typischer Fehler|Beispiele/);
  // Keine Etappe: wie weit die Blöcke sind
  run(`DB.etap = []; DB.tblk = { sv: { inversion: { b:[5], cn:14, cb:2 } } }`);
  assert.match(text(run(`topicNumbersHtml('sv', 'inversion')`)), /Etappen Noch keine\. Geprüft wird alle 60 Aufgaben im Thema, zuerst nach 120; bisher 74\./);
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

test('Erklärung „Schätzung“: klar über Schnitt (90/60), Pfeile, Unterschied zu „Behalten“, Schnitt der Themen; kein „Fehlerquelle“ in den Texten', () => {
  const t = run(`TERMS.find(x => x.k === 'schaetzung').app[0]`);
  assert.match(t, /Die Pfeile in der Themenliste vergleichen die letzten vier Wochen mit den vier davor, neu an jedem Montag; je kräftiger, desto sicherer\. Ohne Pfeil gibt es keinen klaren Unterschied\./);
  assert.match(t, /„Klar über Schnitt“ heißt: mit mindestens 90 % Wahrscheinlichkeit über deinem Schnitt; die rote Hinterlegung bleibt, bis es unter 60 % fällt/);
  assert.match(t, /„Behalten“ zählt nur Wiederholungen/);
  assert.match(t, /jedes Thema zählt gleich, nicht jede Aufgabe/);
  const all = run(`JSON.stringify(TERMS)`);
  assert.doesNotMatch(all, /Fehlerquelle/);
  run(`DB = freshDB(); DB.settings.niveau = 'fort'; S.view = 'settings'`);
  assert.match(text(run('viewSettings()')), /Einfache nur in Themen klar über deinem Schnitt\./);
});
