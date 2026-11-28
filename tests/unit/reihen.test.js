// Reihen (24.97.0): Lesetexte in Fortsetzungen. Erst die Regeln für die Inhalte (gelten für jedes Paket in data/reihen.js), dann der
// Rahmen mit einer Testreihe (tests/fixtures/reihe.js): Karte, Übersicht ohne Vorgriff, Reihenfolge, „Bisher“, nächster Teil,
// Fragen in der Zielsprache, Fortsetzung auf „Heute“, Lesetext-Lücken aus gelesenen Teilen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const FIX = require('../fixtures/reihe.js');
const app = loadApp();
const run = code => app.run(code);
const SERIES = app.get('SERIES'), SHIPPED = JSON.parse(JSON.stringify(SERIES)), TEXTS = app.get('TEXTS'), FORMS = app.get('SERIES_FORMS'), textSentences = app.get('textSentences'), tokens = app.get('tokens'), lookupWord = app.get('lookupWord');

// Prüft eine Reihe nach docs/REIHEN.md; gibt die Mängel zurück
function problems(lang, s, { length = true, lookup = true } = {}){
  const out = [], bad = m => out.push(`${s.id}: ${m}`);
  if (!/^[a-z0-9]+$/.test(s.id)) bad('Kennung nur Kleinbuchstaben und Ziffern');
  if (!s.title || !s.topic || !/^(A2|B1|B2|C1)$/.test(s.level)) bad('Titel, Thema oder Niveau');
  if (!FORMS[s.form]) bad(`Erzählform „${s.form}“ unbekannt`);
  if (!s.teaser || !Array.isArray(s.intro) || s.intro.length !== 2 || !s.real) bad('Kartentext, Einleitung (Zielsprache, Deutsch) oder „Was ist echt?“ fehlt');
  if (!Array.isArray(s.parts) || s.parts.length < 2) { bad('mindestens zwei Teile'); return out; }
  const N = s.parts.length;
  (s.cast || []).forEach(([n, d, k]) => { if (!n || !d || !(k >= 1 && k <= N)) bad(`Person ${n}`); });
  (s.words || []).forEach(([w, k]) => {
    if (!(k >= 1 && k <= N)) bad(`Wort ${w}: Teil`);
    // gebeugt zählt mit (livvakter, biografen): Wortanfang oder Grundform aus dem Wörterbuch
    else if (!s.parts.slice(0, k).some(p => tokens(p.body).some(t => t.toLowerCase().startsWith(w.toLowerCase()) || (lookupWord(lang, t) || {}).l === w))) bad(`Wort ${w} kommt bis Teil ${k} nicht vor`);
  });
  s.parts.forEach((p, i) => {
    const at = `Teil ${i + 1}`, sents = textSentences(p.body || '').flat();
    if (!p.title || !p.when || !p.body) bad(`${at}: Titel, Zeitangabe oder Text`);
    if (length) { const n = p.body.split(/\s+/).length; if (n < 180 || n > 330) bad(`${at}: ${n} Wörter (180 bis 330)`); }
    sents.forEach(x => { if (!/[.!?»”"]$/.test(x)) bad(`${at}: Satzende „${x}“`); });
    if (i > 0 && (!p.hook || !Array.isArray(p.recap) || p.recap.length !== 2)) bad(`${at}: Vorschau oder „Bisher“ fehlt`);
    if (!p.src || !p.src.length) bad(`${at}: Quellen fehlen`);
    if (!p.q || p.q.length !== 3) bad(`${at}: drei Fragen`);
    (p.q || []).forEach(([q, opts, src, qt, ot]) => {
      if (!q.endsWith('?') || opts.length !== 3 || new Set(opts).size !== 3) bad(`${at}: Frage „${q}“`);
      if (!src || !sents.some(x => x.includes(src))) bad(`${at}: Textstelle zu „${q}“ fehlt im Text`);
      if (qt != null && (!/\?$/.test(qt) || !ot || ot.length !== 3 || new Set(ot).size !== 3)) bad(`${at}: Frage in der Zielsprache zu „${q}“`);
    });
    if (!p.keep || p.keep.length < 2) bad(`${at}: zwei Sätze zum Übernehmen`);
    (p.keep || []).forEach(([x, de]) => { if (!sents.includes(x) || !de) bad(`${at}: „${x}“ ist kein ganzer Satz im Text`); });
  });
  if (lookup) {
    const words = [s.title, s.teaser, s.intro[0]].concat(s.parts.flatMap(p => [p.title, p.body, p.hook || '', p.recap ? p.recap[0] : '']));
    const miss = new Set(); words.forEach(t => tokens(t).forEach(w => { if (/[a-zà-ÿ]/i.test(w) && !lookupWord(lang, w)) miss.add(w); }));
    if (miss.size) bad(`nicht nachschlagbar: ${[...miss].join(', ')}`);
  }
  return out;
}

test('Inhalte: jede Reihe hält die Regeln aus docs/REIHEN.md ein, Kennungen eindeutig auch gegenüber den Lesetexten', () => {
  for (const lang of ['sv', 'es']) {
    assert.deepEqual(SHIPPED[lang].flatMap(s => problems(lang, s)), [], lang);
    const ids = TEXTS[lang].map(t => t.id).concat(SHIPPED[lang].flatMap(s => s.parts.map((_, i) => `${s.id}-${i + 1}`)));
    assert.equal(new Set(ids).size, ids.length, lang);
    assert.equal(new Set(SHIPPED[lang].map(s => s.id)).size, SHIPPED[lang].length);
  }
});
test('Die Prüfung greift: Testreihe im Aufbau fehlerfrei, kaputte Fassung mit Mängeln', () => {
  assert.deepEqual(problems('sv', FIX, { length:false, lookup:false }), []);
  const broken = JSON.parse(JSON.stringify(FIX)); delete broken.parts[1].recap; broken.parts[2].q[0][2] = 'Steht nicht im Text.'; broken.form = 'roman'; broken.words.push(['älg', 1]);
  const p = problems('sv', broken, { length:false, lookup:false });
  for (const m of ['Erzählform', 'Teil 2: Vorschau oder „Bisher“', 'Teil 3: Textstelle', 'Wort älg']) assert.ok(p.some(x => x.includes(m)), m);
});

run(`SERIES.sv.push(${JSON.stringify(FIX)})`);
const reset = (niv = 'mittel', extra = '') => run(`(() => { DB = freshDB(); DB.settings.niveau = '${niv}'; S.lang = 'sv'; S.series = null; S.text = null; ${extra}; })()`);
const readPart = (k, day = 'today()') => `DB.used.texts = DB.used.texts || {}; DB.used.texts['sv:test-${k}'] = { best:3, n:1, last:${day} };`;

test('Karte in „Lesen und Hören“: Erzählform, Fortschritt, Beginnen und Weiter; Einzeltexte darunter', () => {
  reset();
  let h = run('viewTexts()');
  assert.match(h, /<h2 class="grp">Reihen<\/h2><div class="tgrid2"><button type="button" class="tcard scard" data-a="sopen" data-s="test">/);
  assert.match(h, /<span class="tag form">Wie es geschah<\/span>/);
  assert.match(h, /<span class="sdash" aria-label="0 von 3 Teilen gelesen"><i><\/i><i><\/i><i><\/i><\/span><span class="scta">Beginnen ›<\/span>/);
  assert.match(h, /<h2 class="grp">Einzelne Texte<\/h2><div class="tgrid2"><button type="button" class="tcard" data-a="textopen"/);
  reset('mittel', readPart(1));
  h = run('viewTexts()');
  assert.match(h, /<i class="on"><\/i><i><\/i><i><\/i><\/span><span class="scta">Weiter mit Teil 2 ›<\/span>/);
  reset('mittel', readPart(1) + readPart(2) + readPart(3));
  assert.match(run('viewTexts()'), /<span class="scta">Alle 3 Teile gelesen<\/span>/);
  reset(); run('SERIES.es = SERIES.es || []; S.lang = "es"');
  assert.doesNotMatch(run('viewTexts()'), /Reihen/, 'ohne Reihen kein Abschnitt');
});

test('Übersicht: Einleitung je Niveau, Teile ohne Vorgriff, Personen und Wörter bis zum Gelesenen, gelesene Teile noch einmal lesbar', () => {
  reset(); run(`S.series = { lang:'sv', id:'test' }`);
  let h = run('viewSeries()');
  assert.match(h, /<p class="shook wordrow" lang="sv"><span data-a="lookup"/, 'Einleitung in der Zielsprache');
  assert.match(h, /data-a="sde">Auf Deutsch<\/button>/);
  assert.match(h, /<li class="mr now"><i><\/i><button type="button" class="mr-b" data-a="spart" data-s="test" data-i="0"/);
  assert.match(h, /<li class="mr next"><i><\/i><span class="mr-b"><span class="mr-t">Teil 2<\/span><span class="mr-d">1 mars 1986<\/span><\/span><\/li>/, 'späterer Titel verdeckt');
  assert.doesNotMatch(h, /Natten<|Morgonen|Ingvar Carlsson|sjukhus|regering/);
  assert.match(h, /Lisbet Palme/); assert.match(h, /data-w="livvakt"/);
  assert.match(h, /<button type="button" class="primary" data-a="spart" data-s="test" data-i="0">Beginnen<\/button>/);
  run('S.series.de = true');
  assert.match(run('viewSeries()'), /<p class="tl-de" lang="de">Am 28\. Februar 1986/);
  reset('grund'); run(`S.series = { lang:'sv', id:'test' }`);
  h = run('viewSeries()');
  assert.match(h, /<p class="shook">Am 28\. Februar 1986/); assert.doesNotMatch(h, /Auf Deutsch/);
  reset('mittel', readPart(1) + readPart(2)); run(`S.series = { lang:'sv', id:'test' }`);
  h = run('viewSeries()');
  assert.match(h, /<li class="mr done"><i><\/i><button type="button" class="mr-b" data-a="spart" data-s="test" data-i="0" aria-label="Teil 1: Fredag kväll, gelesen, noch einmal lesen">/);
  assert.match(h, /<li class="mr now"><i><\/i><button[^>]*data-i="2"/);
  assert.doesNotMatch(h, /Ingvar Carlsson/, 'Person aus Teil 3 erst, wenn Teil 3 gelesen ist');
  assert.match(h, /data-w="sjukhus"/, 'Wort aus Teil 2 nach dem Lesen von Teil 2');
  assert.match(h, /<h2 class="grp">Personen bisher<\/h2>/);
});

test('Reihenfolge: Zu den Fragen gehen macht den Teil gelesen und öffnet den nächsten; gesperrte Teile lassen sich nicht öffnen', () => {
  reset();
  run(`seriesCmd('spart', { dataset:{ s:'test', i:'2' } })`);
  assert.equal(run('S.text && S.text.id'), null, 'Teil 3 ist noch zu');
  run(`seriesCmd('sopen', { dataset:{ s:'test' } })`);
  assert.equal(run('S.view'), 'series', 'unbegonnen: Übersicht');
  run(`seriesCmd('spart', { dataset:{ s:'test', i:'0' } })`);
  assert.equal(run('S.text.id'), 'test-1'); assert.equal(run('S.text.back'), 'series');
  run(`readCmd('tquiz', {})`);
  assert.deepEqual(JSON.parse(run(`JSON.stringify(DB.used.texts['sv:test-1'])`)), { read:true, last:run('today()') });
  run(`seriesCmd('sopen', { dataset:{ s:'test' } })`);
  assert.equal(run('S.text.id'), 'test-2', 'begonnen: gleich der nächste Teil');
  // Fragen beantworten: das beste Ergebnis kommt dazu, gelesen bleibt
  run(`(() => { S.text.quiz = true; [0, 1, 2].forEach(k => readCmd('tpick', { dataset:{ k:String(k), i:'0' } })); })()`);
  assert.equal(run(`DB.used.texts['sv:test-2'].best`), 3);
});

test('Teil im Leser: Kopf, Datumszeile, „Bisher“ je Niveau, am Ende die Vorschau auf den nächsten Teil oder das Ende der Reihe', () => {
  reset('mittel', readPart(1)); run(`openPart('sv', SERIES.sv.find(s => s.id === 'test'), 1)`);
  let h = run('viewText()');
  assert.match(h, /<h1 class="vt">Natten på Sveavägen<\/h1>/);
  assert.match(h, /<div class="tchips"><span class="tag">Teil 2 von 3<\/span><span class="tag">B2<\/span><\/div>/);
  assert.match(h, /<h1 class="rtitle" lang="sv">Natten<\/h1><p class="rdate">Stockholm, lördag 1 mars 1986<\/p>/);
  assert.match(h, /<div class="sbisher"><p class="sbisher-k">Bisher<\/p><p class="sbisher-t wordrow" lang="sv">/);
  run(`S.text.quiz = true; S.text.picks = { 0:0, 1:0, 2:1 }; S.text.qi = 3;`);
  h = run('viewText()');
  assert.match(h, /<section class="snext"><p class="find-k">Im nächsten Teil · 1 mars 1986<\/p><p class="snext-h" lang="sv">Morgonen<\/p>/);
  assert.match(h, /data-a="snext" data-s="test" data-i="2" aria-label="Weiter mit Teil 3">Weiter<\/button>/);
  assert.match(h, /data-a="textgap" data-id="test-2">Lückentext üben/);
  assert.match(h, /<p class="legend">Quellen: Wikipedia, „Mordet på Olof Palme“\.<\/p>/);
  assert.doesNotMatch(h, /Nächster Text/);
  reset('grund', readPart(1) + readPart(2)); run(`openPart('sv', SERIES.sv.find(s => s.id === 'test'), 2)`);
  assert.match(run('viewText()'), /<p class="sbisher-t">Olof Palme wird auf der Sveavägen erschossen/);
  run(`S.text.quiz = true; S.text.picks = { 0:0, 1:0, 2:0 }; S.text.qi = 3;`);
  assert.match(run('viewText()'), /<p class="find-k">Ende der Reihe<\/p><p class="snext-t">Du hast alle 3 Teile gelesen\.<\/p>/);
  reset(); run(`openPart('sv', SERIES.sv.find(s => s.id === 'test'), 0)`);
  assert.doesNotMatch(run('viewText()'), /sbisher/, 'Teil 1 ohne „Bisher“');
});

test('Fragen eines Teils bei „Fortgeschritten“ in der Zielsprache, sonst deutsch', () => {
  reset('fort'); run(`openPart('sv', SERIES.sv.find(s => s.id === 'test'), 0); S.text.quiz = true;`);
  let h = run('viewText()');
  assert.match(h, /<p class="tq-q" lang="sv">Var har Olof och Lisbet Palme varit i kväll\?<\/p>/);
  assert.match(h, /lang="sv">På bio<\/button>/);
  reset('mittel'); run(`openPart('sv', SERIES.sv.find(s => s.id === 'test'), 0); S.text.quiz = true;`);
  assert.match(run('viewText()'), /<p class="tq-q">Wo waren Olof und Lisbet Palme an diesem Abend\?<\/p>/);
});

test('Heute: Fortsetzung statt Fundstück, wenn eine Reihe offen ist, kürzlich gelesen und heute noch nicht', () => {
  reset('mittel', readPart(1, 'addDays(today(), -1)'));
  const h = run(`findHtml('sv')`);
  assert.match(h, /<section class="find scont"><p class="find-k">Fortsetzung · Natten på Sveavägen · Teil 2 von 3<\/p>/);
  assert.match(h, /data-a="spart" data-l="sv" data-s="test" data-i="1">Weiterlesen<\/button>/);
  reset('mittel', readPart(1));
  assert.doesNotMatch(run(`findHtml('sv')`), /scont/, 'heute schon gelesen');
  reset('mittel', readPart(1, 'addDays(today(), -8)'));
  assert.doesNotMatch(run(`findHtml('sv')`), /scont/, 'länger als eine Woche her');
  reset('mittel', readPart(1, 'addDays(today(), -1)') + readPart(2, 'addDays(today(), -1)') + readPart(3, 'addDays(today(), -1)'));
  assert.doesNotMatch(run(`findHtml('sv')`), /scont/, 'Reihe zu Ende');
});

test('Gelesene Teile liefern Lesetext-Lücken, beschriftet mit dem Namen der Reihe', () => {
  reset('mittel', readPart(1));
  assert.ok(run(`readTexts('sv').some(t => t.id === 'test-1')`));
  assert.ok(!run(`readTexts('sv').some(t => t.id === 'test-2')`));
  assert.equal(run(`textById('sv', 'test-1').label`), 'Natten på Sveavägen');
  const d = run(`(() => { const t = textById('sv', 'test-1'); return textGapData('sv', gapSentences(t)[0], t.label || t.title, { lenient:true }); })()`);
  assert.match(d.label, /„Natten på Sveavägen“/);
});
