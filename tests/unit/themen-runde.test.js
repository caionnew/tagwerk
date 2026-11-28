// Fehler je Thema am Rundenende (24.68): deine Antwort neben der Lösung, Lösung in deinen Wörtern, Formfehler beim Namen,
// Fehler neben richtig gesetztem Thema als Ring, Themen zum Aufklappen statt „Noch nicht sicher“.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
app.run('buildBank()');
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim();
const bank = app.get('BANK').sv, byTrap = t => bank.filter(i => i.trap === t);
const inte = (de, sv) => ({ type:'gen', gen:'inte', data:{ prompt:de, answers:[sv], label:'Übersetze ins Schwedische', note:'REGEL', pos:['att', 'vi', 'inte'], posLabel:'Die Stellung von „inte“ stimmt' } });
const FREITAG = inte('Ich weiß, dass wir am Freitag nicht arbeiten.', 'Jag vet att vi inte jobbar på fredag.');
// Eine Aufgabe beantworten: Rückmeldung, Aufgabenbild nach dem Prüfen und der Eintrag fürs Rundenende
const answer = (ex, input) => run(`(() => { const ex = ${JSON.stringify(ex)}; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
  S.run.cur = { input:${JSON.stringify(input)}, state:'answer' }; check(); const c = S.run.cur;
  const out = { result:c.result, best:c.best || null, fb:feedbackHtml(S.run, ex, c), task:viewRun() }; next(); out.res = S.run.res[0]; return out; })()`);

test('Fall aus dem Screenshot: „arbeta“ statt „arbetar“ — Lösung in deinem Wort, die Form beim Namen, Antwort nur einmal', () => {
  const a = answer(FREITAG, 'jag vet att vi inte arbeta på fredag');
  assert.equal(a.result, 'bad');
  // „arbeta“ und „jobba“ gelten gleich: Die Lösung nimmt dein Wort, falsch ist nur die Endung
  assert.equal(a.best, 'Jag vet att vi inte arbetar på fredag.');
  assert.match(text(a.fb), /^Falsch Jag vet att vi inte arbetar på fredag\. Die Stellung von „inte“ stimmt\. Aber „arbeta“ ist die Grundform \(arbeiten\), hier braucht es „arbetar“ \(arbeitet\)\./);
  assert.doesNotMatch(a.fb, /woanders|jobbar|REGEL/);
  // Deine Antwort steht einmal, im Feld, mit gestrichenem Wort; keine „Du:“-Zeile mehr in der Rückmeldung
  assert.doesNotMatch(a.fb, /Du:/);
  assert.match(a.task, /<p class="tw-done" lang="sv">jag vet att vi inte <span class="w-extra">arbeta<\/span> på fredag<\/p>/);
  assert.doesNotMatch(a.task, /id="answer"/);
  // Fürs Rundenende: Aufgabe, Antwort, Lösung, Grund; das Thema selbst stimmte
  assert.deepEqual([a.res.q, a.res.ans, a.res.best, a.res.off], ['Ich weiß, dass wir am Freitag nicht arbeiten.', 'jag vet att vi inte arbeta på fredag', 'Jag vet att vi inte arbetar på fredag.', 1]);
  assert.match(a.res.why, /^Die Stellung von „inte“ stimmt\. Aber „arbeta“ ist die Grundform/);
});

test('Fall aus dem Screenshot vom 25.11.: „Kleider“ heißt auch Kleidung; kläderna gilt, bei „kläder“ fehlt die Endung', () => {
  // Generator mit festgelegtem Zufall: Kleid, billig, Aufgabenart (0 indef, 1 def, 3 pl, 4 defpl, 6 pred, 7 predpl)
  const kleid = t => run(`(() => { const N = NOUNS.findIndex(n => n[0] === 'Kleid'), A = NOUNS[N][8].indexOf('b'), seq = [(N + 0.5) / NOUNS.length, (A + 0.5) / NOUNS[N][8].length, ${t + 0.5} / 8], orig = Math.random;
    Math.random = () => seq.shift(); try { return genNP(); } finally { Math.random = orig; } })()`);
  const d = kleid(4);
  assert.equal(d.prompt, 'die billigen Kleider');
  assert.deepEqual(d.answers, ['de billiga klänningarna', 'de billiga kläderna']);
  assert.match(d.note, /de \+ Adjektiv auf -a \+ klänningarna\. „Kleider“ als Kleidung: kläderna\.$/);
  const ex = { type:'gen', gen:'np', data:d };
  assert.equal(answer(ex, 'de billiga kläderna').result, 'ok');
  // Bisher: „klänningarna“ als Lösung und „kläder“ ganz gestrichen, als wäre das Wort falsch. Jetzt die Lösung in deinem Wort,
  // falsch ist nur die fehlende bestimmte Form
  const a = answer(ex, 'de billiga kläder');
  assert.equal(a.result, 'bad');
  assert.equal(a.best, 'de billiga kläderna');
  assert.match(text(a.fb), /^Falsch de billiga kläderna „kläder“ ist die Grundform \(Kleider, Kleidung\), hier braucht es „kläderna“/);
  assert.equal(a.res.best, 'de billiga kläderna');
  // Die anderen Pluralfälle ebenso; im Singular gibt es nichts Zweites: das Kleid ist klänningen
  assert.deepEqual(kleid(3).answers, ['billiga klänningar', 'billiga kläder']);
  assert.deepEqual(kleid(7).answers, ['Klänningarna är billiga.', 'Kläderna är billiga.']);
  assert.deepEqual([0, 1, 6].map(t => kleid(t).answers), [['en billig klänning'], ['den billiga klänningen'], ['Klänningen är billig.']]);
});

test('Lösung in deinen Wörtern: nur gleichwertige Wörter, die du benutzt hast', () => {
  assert.equal(run(`ownWords('sv', 'jag arbetade igår', 'Jag jobbade igår.')`), 'Jag arbetade igår.');
  assert.equal(run(`ownWords('sv', 'Arbeta mer', 'Jobba mer!')`), 'Arbeta mer!');
  assert.equal(run(`ownWords('sv', 'hon ringde mej', 'Hon ringde mig.')`), 'Hon ringde mej.');
  assert.equal(run(`ownWords('sv', 'jag jobbar', 'Jag jobbar.')`), 'Jag jobbar.');
  assert.equal(run(`ownWords('sv', 'jag har ett arbete', 'Jag har ett jobb.')`), 'Jag har ett jobb.', 'Hauptwort „jobb“ bleibt');
  assert.equal(run(`ownWords('es', 'trabajo', 'Trabajo.')`), 'Trabajo.');
  assert.equal(run(`ownWords('sv', 'rena kläder', 'rena klänningar')`), 'rena kläder');
  assert.equal(run(`ownWords('sv', 'kläderna är rena', 'Klänningarna är rena.')`), 'Kläderna är rena.');
  assert.equal(run(`ownWords('sv', 'de rena klänningar', 'de rena klänningarna')`), 'de rena klänningarna');
});

test('Formfehler beim Namen: nur zwei Formen desselben Wortes, mit Bedeutung aus dem Wörterbuch', () => {
  assert.equal(run(`formWhy('sv', [['stor', 'stort']])`), '„stor“ ist die Grundform (groß), hier braucht es „stort“ (groß, bei ett-Wörtern)');
  assert.equal(run(`formWhy('sv', [['röd', 'röda']])`), '„röd“ ist die Grundform (rot), hier braucht es „röda“ (rot, Plural und bestimmte Form)');
  assert.equal(run(`formWhy('sv', [['träffat', 'träffade']])`), '„träffade“ (traf) statt „träffat“');
  // Verschiedene Wörter: „Grundform“ sagte nichts (normalmente ist kein Verb), ebenso Kauderwelsch
  assert.equal(run(`formWhy('es', [['normalmente', 'suelo']])`), '');
  assert.equal(run(`formWhy('sv', [['zzz', 'stort']])`), '');
  // Ohne Formfehler bleibt es bei „woanders“
  assert.match(text(answer(FREITAG, 'jag vet att vi inte jobbar till fredag').fb), /Die Stellung von „inte“ stimmt\. Der Unterschied liegt woanders\./);
});

test('Themen: Fehler neben richtig gesetztem Thema als Ring, zählt nicht als Fehler des Themas', () => {
  const [a1, a2] = byTrap('tempus');
  app.run(`S.run = { kind:'daily', lang:'sv', ok:1, bad:3, res:${JSON.stringify([
    { gen:'inte', trap:'bisats', good:false, off:1, target:'Jag vet att vi inte jobbar på fredag.' },
    { gen:'inte', trap:'bisats', good:true, target:'Hon säger att hon inte har tid.' },
    { id:a1.id, good:false, target:a1.target }, { id:a2.id, good:false, target:a2.target }])} }`);
  const tps = run('roundTopics(S.run)'), bis = tps.find(t => t.key === 'bisats');
  assert.deepEqual([bis.dots, bis.bad, bis.off], [['off', 'ok'], 0, 1]);
  const h = run('(S.topicOpen = null, topicsHtml(S.run))');
  assert.match(h, /Beide Fehler: <b>Präteritum oder Perfekt<\/b>/, 'der Ring zählt nicht mit');
  assert.match(h, /aria-label="1 richtig, 1 mit Fehler außerhalb des Themas"><i class="d-off"><\/i><i class="d-ok"><\/i>/);
});

test('Thema aufklappen: falsche zuerst mit deiner Antwort und Lösung, richtige kurz, Regel und Üben; eins auf einmal', () => {
  const [a1, a2, a3] = byTrap('tempus'), [b1] = byTrap('sin');
  const res = [
    { id:a1.id, good:true, ty:'cloze', q:a1.de, ans:a1.gap, target:a1.target },
    { id:a2.id, good:false, ty:'free', q:a2.de, ans:'zzz ' + a2.target, best:a2.target, why:'Richtige Wörter, falsche Reihenfolge', again:1, target:a2.target },
    { id:a3.id, good:false, target:a3.target },
    { id:b1.id, good:false, ty:'cloze', q:b1.de, ans:'hans', best:b1.gap, target:b1.target, gu:undefined },
  ];
  app.run(`S.run = { kind:'daily', lang:'sv', ok:1, bad:3, res:${JSON.stringify(res)} }; S.topicOpen = null; S.topicsAll = false;`);
  let h = run('topicsHtml(S.run)');
  assert.doesNotMatch(h, /class="tdet/);
  assert.match(h, /data-a="topicopen" data-k="tempus" aria-expanded="false"/);
  h = run(`(S.topicOpen = 'tempus', topicsHtml(S.run))`);
  assert.match(h, /data-k="tempus" aria-expanded="true" aria-controls="tdet-\d"/);
  assert.equal((h.match(/class="tdet/g) || []).length, 1, 'nur das geöffnete Thema');
  const det = h.slice(h.indexOf('class="tdet'));
  const t = text(det);
  // Falsch zuerst: Aufgabe, deine Antwort mit gestrichenem Wort, Lösung, Grund und zweiter Versuch
  assert.ok(t.indexOf(a2.de) < t.indexOf(a1.de), 'falsche vor richtigen');
  assert.match(det, /<span class="lbl-s">Du:<\/span> <span class="w-extra">zzz<\/span>/);
  assert.match(t, /Richtige Wörter, falsche Reihenfolge\. Beim zweiten Mal richtig\./);
  // Aus einer älteren Fassung (ohne Antwort): nur der Satz
  assert.match(det, new RegExp(`<li class="rk bad"><span class="rk-row"><span class="rk-s" lang="sv">${a3.target.replace(/[.?]/g, '\\$&')}`));
  // Richtig: kurz mit Haken-Klasse
  assert.match(det, /<li class="rk ok"><span class="rk-q">/);
  assert.match(det, /data-a="topic" data-t="tempus">Regel und Beispiele<\/button><button type="button" class="link" data-a="trapgo" data-t="tempus">Thema üben/);
  assert.doesNotMatch(h, /kommen morgen wieder/);
  // Rundenende: keine eigene Fehlerliste mehr, alles steht bei den Themen
  app.run(`S.view = 'runDone'; S.run.stamped = true;`);
  const done = run('viewRunDone()');
  assert.doesNotMatch(done, /Noch nicht sicher|Weitere Fehler/);
  app.run('S.topicOpen = null');
});

test('Zweiter Versuch und Aufgeben landen beim ersten Versuch', () => {
  const it = byTrap('tempus').find(i => i.gap);
  const out = run(`(() => { const ex = { type:'cloze', id:${JSON.stringify(it.id)} }; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
    S.run.cur = { input:'zzz', state:'answer' }; check(); next();
    const again = S.run.queue[S.run.idx]; S.run.cur = { input:${JSON.stringify(it.gap)}, state:'answer' }; check(); next();
    return { again:again.requeue, res:S.run.res }; })()`);
  assert.equal(out.again, true);
  assert.equal(out.res.length, 1, 'der zweite Versuch zählt nicht als eigene Aufgabe');
  assert.deepEqual([out.res[0].ans, out.res[0].again], ['zzz', 1]);
  // Aufgegeben: keine Antwort, am Rundenende „Weiß ich nicht“
  const gu = run(`(() => { const ex = { type:'cloze', id:${JSON.stringify(it.id)} }; S.run = { kind:'quick', lang:'sv', queue:[ex], idx:0, ok:0, bad:0, res:[], combo:0, best:0 }; S.view = 'run';
    S.run.cur = { input:'', state:'answer' }; giveUp(); next(); return S.run.res[0]; })()`);
  assert.deepEqual([gu.gu, gu.ans, gu.good], [1, undefined, false]);
  assert.match(run(`roundTaskHtml(${JSON.stringify(gu)}, 'sv')`), /<span class="rk-you">Weiß ich nicht<\/span>/);
});

// Runde mit einem Thema (25.11.): „Thema üben“ Adjektivendungen, 9 von 10 richtig. Bis 24.75 stand dort eine Zeile mit zehn Punkten,
// dieselben wie in der Leiste darüber, und die falsche Aufgabe erst nach einem Tipp.
test('Runde mit einem Thema: Schätzung mit Stand vor der Runde, falsche Aufgaben offen, keine Punkte', () => {
  // Vier Themen im Protokoll, damit das Modell rechnet; Adjektivendungen klar schwächer
  app.run(`DB.tlog = {}; for (let k = 1; k <= 20; k++) DB.tlog[addDays(today(), -k)] = { sv:{ 'p:inversion':[3, k % 3 ? 0 : 1], 'p:bisats':[3, k % 2], 'p:species':[2, 1], 'p:tempus':[2, 0] } };`);
  const est0 = run(`estSnap('sv')`);
  assert.deepEqual(Object.keys(est0).sort(), ['bisats', 'inversion', 'species', 'tempus']);
  // Die Runde: das Protokoll von heute bekommt ihre zehn Aufgaben, eine davon falsch
  app.run(`DB.tlog[today()] = { sv:{ 'p:species':[10, 1] } }`);
  const ok = { gen:'np', good:true, target:'den stora bilen' }, bad = { gen:'np', good:false, ty:'free', q:'die guten Hunde', ans:'zzz qqq', target:'de bra hundarna', why:'Doppelte Bestimmtheit im Plural.' };
  const res = [ok, ok, ok, ok, ok, ok, ok, ok, bad, ok];
  const set = (kind, r, e0) => app.run(`S.run = { kind:'${kind}', lang:'sv', ok:${r.filter(x => x.good).length}, bad:${r.filter(x => !x.good).length}, est0:${JSON.stringify(e0)}, res:${JSON.stringify(r)} }`);
  set('trap', res, est0);
  let h = run('topicsHtml(S.run)');
  const now = run(`topicModel('sv').topics.find(x => x.id === 'species').mean`);
  assert.ok(now < est0.species, 'neun von zehn richtig senken die Schätzung');
  assert.match(h, /<h2 class="grp">Thema dieser Runde<\/h2>/);
  assert.doesNotMatch(h, /trow|tdots|topicopen/, 'keine Punkte, nichts aufzuklappen');
  // Zeile wie in der Themenliste, Tipp öffnet „Deine Zahlen“; Zahl, was sie zählt, Stand vorher als Ring
  assert.match(h, /<button type="button" data-a="topic" data-t="species" data-z="1" class="row mrowh"/);
  const P = v => run(`pct(${v})`).replace(/\s/g, ' ');
  assert.match(text(h), new RegExp(`^Thema dieser Runde Adjektivendungen & bestimmte Form ${P(now)} geschätzte Fehlerquote, vor der Runde ${P(est0.species)} Schätzung`));
  assert.equal((h.match(/class="mring"/g) || []).length, 1);
  assert.match(h, /class="mpct cl"/, 'klar über Schnitt rot hinterlegt wie überall');
  // Die falsche Aufgabe offen, die richtigen nicht; Regel, aber kein „Thema üben“ (das ist „Noch eine Runde“)
  assert.equal((h.match(/<li class="rk /g) || []).length, 1);
  assert.match(text(h), /die guten Hunde Du: zzz qqq de bra hundarna Doppelte Bestimmtheit im Plural\. Regel und Beispiele$/);
  assert.doesNotMatch(h, /trapgo/);
  // Dieselbe Runde aus „Schnell üben“: dort führt „Thema üben“ weiter
  set('quick', res, est0);
  assert.match(run('topicsHtml(S.run)'), /data-a="trapgo" data-t="species">Thema üben/);
  // Fehlerfrei: die Schätzung bleibt, Aufgaben und Links entfallen
  set('trap', res.map(() => ok), est0);
  h = run('topicsHtml(S.run)');
  assert.match(h, /vor der Runde/); assert.doesNotMatch(h, /class="tdet|Regel und Beispiele/);
  // Ohne Stand vorher (fortgesetztes Tagwerk): ohne „vor der Runde“ und ohne Ring
  set('trap', res, null);
  h = run('topicsHtml(S.run)');
  assert.match(text(h), /geschätzte Fehlerquote Schätzung/); assert.doesNotMatch(h, /mring|vor der Runde/);
  // Ohne Modell (zu wenig Themen mit Daten): nur die Aufgaben; fehlerfrei nichts, die Leiste sagt alles
  app.run(`DB.tlog = {}`);
  set('trap', res, null);
  h = run('topicsHtml(S.run)');
  assert.doesNotMatch(h, /mstrip/); assert.match(h, /<span class="rt">Adjektivendungen &amp; bestimmte Form<\/span>/); assert.match(h, /Du:/);
  set('trap', res.map(() => ok), null);
  assert.equal(run('topicsHtml(S.run)'), '');
});

test('Runde mit einem Thema ohne Themenblatt (Genus): Schätzung aus dem Thema der Aufgaben, Zeile ohne Tipp', () => {
  app.run(`DB.tlog = {}; for (let k = 1; k <= 20; k++) DB.tlog[addDays(today(), -k)] = { sv:{ 'p:inversion':[3, k % 3 ? 0 : 1], 'p:bisats':[3, k % 2], 'p:genus':[2, k % 4 ? 0 : 1], 'p:tempus':[2, 0] } };`);
  const g = { gen:'genus_sv', trap:'genus', good:true, target:'ett hus' };
  app.run(`S.run = { kind:'form', lang:'sv', ok:3, bad:1, est0:${JSON.stringify(run(`estSnap('sv')`))}, res:${JSON.stringify([g, g, { ...g, good:false, ans:'en', target:'ett bord' }, g])} }`);
  const h = run('topicsHtml(S.run)');
  assert.match(h, /<div class="row mrowh"/); assert.doesNotMatch(h, /data-a="topic"/);
  assert.match(h, /vor der Runde/);
  app.run('DB.tlog = {}');
});

// 26.11. (24.78): Am Rundenende mit mehreren Themen oben die Themen, die durch die Runde „klar über Schnitt“ wurden oder es nicht
// mehr sind; im aufgeklappten Thema die Schätzung mit dem Stand vor der Runde. Vier Themen, damit das Modell rechnet.
// sp: Fehler bei Adjektivendungen je Tag (k % 4 ? 0 : 1: P(über Schnitt) 17 %, k % 2: 72 %)
const LOG = (sp = 'k % 4 ? 0 : 1') => `DB.tlog = {}; for (let k = 1; k <= 20; k++) DB.tlog[addDays(today(), -k)] = { sv:{ 'p:inversion':[3, k % 3 ? 0 : 1], 'p:bisats':[3, k % 2], 'p:species':[2, ${sp}], 'p:tempus':[2, 0] } };`, LOG4 = LOG();
// Eine Aufgabe des Tagwerks: aus der Satzbank, Adjektivendungen (species) aus dem Generator np
const tw = (trap, good) => ({ ...(trap === 'species' ? { gen:'np', q:'die guten Hunde', target:'de bra hundarna' } : { id:byTrap(trap)[0].id, q:byTrap(trap)[0].de, target:byTrap(trap)[0].target }), good, ty:'free', ...(good ? {} : { ans:'zzz', why:'GRUND' }) });
const daily = (res, more = '') => app.run(`S.run = { kind:'daily', lang:'sv', ok:${res.filter(x => x.good).length}, bad:${res.filter(x => !x.good).length}, res:${JSON.stringify(res)}${more} }; S.topicOpen = null; S.topicsAll = false;`);
test('Rundenende: Wechsel bei „klar über Schnitt“ durch die Runde, rein und raus, nur Themen der Runde', () => {
  app.run(`${LOG4} DB.clear = {};`);
  const est0 = run(`estSnap('sv')`), clear0 = run(`clearSnap('sv')`);
  assert.deepEqual(clear0, [], 'vorher keins klar');
  // Das Tagwerk: Adjektivendungen 18 von 20 falsch, die anderen richtig
  app.run(`DB.tlog[today()] = { sv:{ 'p:species':[20, 18], 'p:inversion':[2, 0], 'p:tempus':[2, 0] } }`);
  const res = [tw('species', false), tw('species', false), tw('species', true), tw('inversion', true), tw('tempus', true)];
  daily(res, `, est0:${JSON.stringify(est0)}, clear0:${JSON.stringify(clear0)}`);
  assert.deepEqual(run(`[...clearSet('sv')]`), ['species']);
  assert.deepEqual(run(`clearChanges('sv', ['species', 'inversion', 'tempus'], S.run.clear0)`), [{ id:'species', on:true }]);
  let h = run('topicsHtml(S.run)');
  const P = v => run(`pct(${v})`).replace(/\s/g, ' ');
  const now = run(`topicModel('sv').topics.find(x => x.id === 'species').mean`);
  // Überschrift nach Richtung (24.78.1), in der Zeile nur Quote und Stand vorher; die Legende kurz, ohne „klar über Schnitt“:
  // das sagt die Überschrift, die Schwellen erklärt „Schätzung“ (24.78.2)
  assert.match(text(h), new RegExp(`^Jetzt klar über Schnitt Adjektivendungen & bestimmte Form ${P(now)} geschätzte Fehlerquote, vor dem Tagwerk ${P(est0.species)} Schätzung Bereich Schnitt [\\d\\s]+% Themen dieser Runde`));
  assert.doesNotMatch(h, /Nicht mehr klar/);
  assert.match(h, /<button type="button" data-a="topic" data-t="species" data-z="1" class="row mrowh"/);
  assert.equal((h.match(/class="mring"/g) || []).length, 1);
  assert.match(h, /class="mpct cl"/);
  // Raus: gestern klar (P 72 %, bleibt durch die Hysterese), zwölf richtige senken P auf 37 %
  app.run(`${LOG('k % 2')} DB.clear = { sv:{ day:addDays(today(), -1), prev:[], cur:['species'] } };`);
  const e1 = run(`estSnap('sv')`), c1 = run(`clearSnap('sv')`);
  assert.deepEqual(c1, ['species'], 'beim Start noch klar (Hysterese)');
  app.run(`DB.tlog[today()] = { sv:{ 'p:species':[12, 0], 'p:tempus':[2, 0] } }`);
  daily([tw('species', true), tw('species', true), tw('tempus', true), tw('tempus', false)], `, est0:${JSON.stringify(e1)}, clear0:${JSON.stringify(c1)}`);
  h = run('topicsHtml(S.run)');
  assert.match(text(h), /^Nicht mehr klar über Schnitt Adjektivendungen & bestimmte Form [\d\s]+% geschätzte Fehlerquote, vor dem Tagwerk [\d\s]+% Schätzung Bereich Schnitt [\d\s]+% Themen dieser Runde/);
  assert.doesNotMatch(h.slice(0, h.indexOf('Themen dieser Runde')), /class="mpct cl"/, 'keine rot hinterlegte Quote');
  assert.doesNotMatch(h, /Jetzt klar/);
  // Beide Richtungen in einer Runde: zwei Abschnitte, „Jetzt“ zuerst, jeder mit derselben kurzen Legende (24.78.2; in 24.78.1 nur
  // im letzten und mit den Schwellen, das las sich, als gehöre sie nur zu „Nicht mehr klar“)
  const both = run(`(() => { const s = clearChanges; clearChanges = () => [{ id:'species', on:false }, { id:'tempus', on:true }]; try { return topicsHtml(S.run); } finally { clearChanges = s; } })()`);
  assert.match(text(both), /^Jetzt klar über Schnitt Präteritum oder Perfekt .* Nicht mehr klar über Schnitt Adjektivendungen & bestimmte Form .* Themen dieser Runde/);
  const keys = [...both.matchAll(/<p class="legend inrows">(.*?)<\/p>/g)].map(m => m[1]);
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1], 'dieselbe Legende in beiden');
  assert.doesNotMatch(keys[0], /klar über Schnitt/);
  const v2 = both.slice(0, both.indexOf('Themen dieser Runde'));
  assert.equal((text(v2).match(/klar über Schnitt/g) || []).length, 2, 'einmal je Abschnitt, in der Überschrift');
  const iOff = both.indexOf('Nicht mehr klar');
  assert.ok(both.indexOf('legend inrows') < iOff && both.lastIndexOf('legend inrows') > iOff, 'je eine in jedem Abschnitt');
  // Fortgesetztes Tagwerk (ohne Stand beim Start): Vergleich mit dem Stand vom letzten früheren Tag, ohne Ring
  daily([tw('species', true), tw('tempus', true)]);
  h = run('topicsHtml(S.run)');
  assert.match(text(h), /^Nicht mehr klar über Schnitt Adjektivendungen & bestimmte Form [\d\s]+% geschätzte Fehlerquote Schätzung/);
  assert.doesNotMatch(h, /mring/);
  // Stand davor unbekannt (erster Tag mit Gedächtnis): kein Wechsel behauptet
  app.run(`DB.clear = {}; clearSet('sv');`);
  assert.equal(run(`clearBase('sv')`), null);
  assert.doesNotMatch(run('topicsHtml(S.run)'), /klar über Schnitt/i);
  // Ein Thema, das nicht in der Runde war, steht dort nicht, auch wenn es gewechselt hat
  app.run(`DB.clear = { sv:{ day:addDays(today(), -1), prev:[], cur:['species'] } };`);
  daily([tw('tempus', true), tw('inversion', true)]);
  assert.doesNotMatch(run('topicsHtml(S.run)'), /klar über Schnitt/i);
  app.run('DB.tlog = {}; DB.clear = {};');
});

test('Rundenende: aufgeklapptes Thema mit Schätzung und Stand vor dem Tagwerk, Tipp öffnet „Deine Zahlen“', () => {
  app.run(`${LOG4} DB.clear = {};`);
  const est0 = run(`estSnap('sv')`);
  app.run(`DB.tlog[today()] = { sv:{ 'p:species':[2, 1], 'p:tempus':[2, 0] } }`);
  daily([tw('species', false), tw('species', true), tw('tempus', true), tw('tempus', true)], `, est0:${JSON.stringify(est0)}, clear0:[]`);
  let h = run(`(S.topicOpen = 'species', topicsHtml(S.run))`);
  assert.doesNotMatch(h, /klar über Schnitt/i, 'kein Wechsel');
  const det = h.slice(h.lastIndexOf('<', h.indexOf('class="tdet')));
  assert.match(text(det), /^Geschätzte Fehlerquote [\d\s]+% vor dem Tagwerk [\d\s]+% Schätzung Bereich Schnitt [\d\s]+% die guten Hunde/);
  assert.equal((det.match(/class="mring"/g) || []).length, 1);
  assert.ok(det.indexOf('class="tdest"') < det.indexOf('class="rks"'), 'Schätzung vor den Aufgaben');
  // Gebaut wie eine Zeile: Tipp öffnet „Deine Zahlen“ (vorher ein eigener Link darunter)
  assert.match(det, /<button type="button" data-a="topic" data-t="species" data-z="1" class="tdest" aria-label="Geschätzte Fehlerquote: geschätzt [\d\s]+% falsch, wahrscheinlich [\d\s]+% bis [\d\s]+%, vor dem Tagwerk [\d\s]+%">/);
  assert.match(det, /data-t="species">Regel und Beispiele<\/button><button type="button" class="link" data-a="trapgo" data-t="species">Thema üben/);
  assert.doesNotMatch(det, />Deine Zahlen</);
  // Ohne Stand vorher: ohne Ring; Thema ohne Schätzung: nur die Aufgaben, kein „Deine Zahlen“
  daily([tw('species', false), tw('tempus', true), tw('partikel', false)]);
  h = run(`(S.topicOpen = 'species', topicsHtml(S.run))`);
  assert.match(h, /class="tdest"/); assert.doesNotMatch(h, /mring|vor dem Tagwerk/);
  h = run(`(S.topicOpen = 'partikel', topicsHtml(S.run))`);
  assert.doesNotMatch(h, /class="tdest"|data-z/);
  app.run('DB.tlog = {}; DB.clear = {}; S.topicOpen = null;');
});
