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
  assert.match(h, /Falsche Sätze kommen morgen wieder\./);
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
