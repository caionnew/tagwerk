// Einheitlichkeit (seit 24.66.1, Aufräumen Schritt 1): Verhältnisse als „x von y“, eine Regel für Minuten und Stunden,
// ein Name je Sache, „Schließen“ in Blättern links, eigene Symbole in Üben, Etappen derselben Art ohne Widerspruch.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const ds = k => run(`addDays(today(), ${-k})`);
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim();
const base = () => ({ v:3, settings:{ size:'normal', lang:'sv' }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, doneLang:{}, gen:{}, run:null, tlog:{} });
const setDB = d => { app.setDB(d); run('buildBank()'); };

test('Verhältnisse: „20 von 22“ heute, „6 von 48“ in den Fehlerquellen, kein Schrägstrich', () => {
  const d = base(); d.log[ds(0)] = { sv:{ n:30, secs:720, fresh:5, rev:22, revOk:20 } };
  setDB(d);
  const h = run(`todayHtml('sv')`);
  assert.match(text(h), /20 von 22 Wiederholungen gewusst/);
  d.tlog[ds(0)] = { sv:{ 'p:inversion':[48, 6], 'p:tempus':[20, 3], 't:gap':[68, 9] } }; setDB(d); run(`S.errTab = 'p'`);
  const e = run(`errorSourcesHtml('sv')`);
  assert.match(e, /<span class="esub">6 von 48 Aufgaben<\/span>/);
  assert.doesNotMatch(text(h) + text(e), /\d\/\d/);
});

test('Zeit: Fließtext „5 Std. 7 Min.“, in einer Karte mit Summe in Minuten auch die Teile in Minuten; „Min.“ immer mit Punkt', () => {
  assert.equal(run('fmtMin(307 * 60)'), '5 Std. 7 Min.');
  assert.equal(run('fmtMin(307 * 60, true)'), '307 Min.');
  assert.equal(run('fmtMin(2000 * 60, true)'), '2.000 Min.');
  assert.equal(run('fmtMin(20)'), 'unter 1 Min.');
  // Jahr für Jahr: 426 Minuten oben, die Sprachen und der stärkste Monat darunter in Minuten
  const d = base();
  for (let k = 40; k >= 0; k--) { d.log[ds(k)] = { sv:{ n:20, secs:450 }, es:k % 4 ? undefined : { n:10, secs:300 } }; if (!d.log[ds(k)].es) delete d.log[ds(k)].es; d.done[ds(k)] = true; }
  // „Jahr für Jahr“ erst ab dem zweiten Jahr: ein Tag im Vorjahr
  d.log[ds(400)] = { sv:{ n:5, secs:120 } };
  setDB(d);
  const y = text(run('yearsHtml()'));
  const sum = y.match(/(\d+) Minuten gelernt/);
  assert.ok(sum, y);
  assert.doesNotMatch(y, /Std\./, 'Summe in Minuten, also Teile auch');
  assert.match(y, /Schwedisch .*\d+ Min\./);
  // Dein Weg: „noch 3 Std. 10 Min.“ mit Punkt
  assert.doesNotMatch(run('wayHtml()'), /\d Min(?!\.)\b/);
});

test('Ein Name je Sache: Fehlerquellen heute wie auf Fortschritt; Hinweise mit „Tipp auf“, nicht „Antippen für“', () => {
  const d = base();
  for (let k = 10; k >= 0; k--) { d.log[ds(k)] = { sv:{ n:20, secs:600 } }; d.tlog[ds(k)] = { sv:{ 'p:inversion':[10, 3], 'p:tempus':[10, 2] } }; }
  setDB(d);
  const all = run(`viewHome()`) + run(`(S.ptab = 'sv', viewProgress())`);
  assert.doesNotMatch(all, /Meiste Fehler/);
  assert.doesNotMatch(all, /Antippen für/);
  assert.match(all, /Fehlerquellen, letzte 30 Tage/);
});

test('Blätter: „Schließen“ steht links, vor dem Hauptweg oder dem Verweis', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'src', 'js', 'part_views.js'), 'utf8')
    + require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'src', 'js', 'part_ref.js'), 'utf8');
  const feet = src.match(/<div class="popfoot">.{0,400}/g);
  assert.ok(feet.length >= 2);
  feet.forEach(f => assert.match(f, /^<div class="popfoot"><button type="button" class="ghost" data-a="popclose">Schließen<\/button>/, f.slice(0, 120)));
});

test('Üben: jeder Eintrag hat ein eigenes Symbol', () => {
  const d = base(); for (let k = 5; k >= 0; k--) d.log[ds(k)] = { sv:{ n:20, secs:600 } };
  setDB(d);
  const h = run('viewExtra()');
  const rows = [...h.matchAll(/<button type="button" class="row has-ico" data-a="([a-zA-Z]+)"[^>]*>(?:<span class="rico">(<svg[\s\S]*?<\/svg>)<\/span>)/g)].map(m => ({ a:m[1], ico:m[2] }));
  assert.ok(rows.length >= 12, rows.length);
  const seen = new Map();
  rows.forEach(r => { assert.ok(!seen.has(r.ico), `${r.a} hat dasselbe Symbol wie ${seen.get(r.ico)}`); seen.set(r.ico, r.a); });
});

test('Etappen-Kasten: zwei Schwellen derselben Art in einer Runde ohne Widerspruch', () => {
  // Heute 28 Sätze gefestigt: beide Schwellen (10 und 25) in dieser Runde überschritten
  const d = base(); for (let k = 12; k >= 1; k--) d.log[ds(k)] = { sv:{ n:12, secs:300 } };
  d.log[ds(0)] = { sv:{ n:30, secs:600, mat:28 } };
  setDB(d);
  run(`BANK.sv.slice(0, 28).forEach(i => { DB.st[i.id] = { ivl:30 }; });`);
  const done = run('wayEvents().done'), mats = done.filter(e => e.k === 'mature' && e.l === 'sv'), tasks = done.find(e => e.k === 'tasks');
  assert.deepEqual(mats.map(e => e.v), [10, 25]);
  run(`S.mileAll = false; globalThis.__r = { lang:'sv', miles:${JSON.stringify([...mats, tasks])}, crossed:{ mature:[], anchored:[] } };`);
  const h = run('mileHtml(__r)'), x = text(h);
  assert.match(h, /class="mr done"><i><\/i><span class="mr-t">10 gefestigte Sätze<\/span><span class="mr-d">heute/);
  assert.match(h, /class="mr now"><i><\/i><span class="mr-t">25 gefestigte Sätze/);
  assert.match(h, /class="mr next"><i><\/i><span class="mr-t">50 gefestigte Sätze<\/span><span class="mr-d">noch 22/);
  assert.match(x, /Außerdem: 100 Aufgaben\./);
  assert.doesNotMatch(x, /Außerdem:[^.]*gefestigt/, 'gleichartige Etappen stehen in der Leiste, nicht unter „Außerdem“');
  assert.doesNotMatch(x, /noch 1\b/);
});

// Aufräumen Schritt 2: je eine Stelle für die nächste Etappe, den Abgleich nach längster gemeinsamer Folge, Prozent und Datum
test('Nächste Etappe: Rundenende, Dein Weg und Sprach-Tab nennen dasselbe Ziel mit demselben Rest', () => {
  const d = base(), ids = run(`BANK.sv.slice(0, 30).map(i => i.id)`);
  ids.forEach(id => { d.st[id] = { s:40, d:5, ivl:30, last:ds(3), due:ds(-27), reps:4, ok:4, bad:0 }; });
  for (let k = 12; k >= 0; k--) { d.log[ds(k)] = { sv:{ n:40, secs:900 } }; d.done[ds(k)] = true; }
  d.way = [{ d:ds(2), k:'mature', l:'sv', v:25 }];
  setDB(d);
  const next = run(`wayEvents().next`), nm = next.find(x => x.k === 'mature' && x.l === 'sv');
  assert.ok(nm && nm.v > 25);
  assert.deepEqual(run(`wayNext({ k:'mature', l:'sv', v:25 })`), { t:nm.t, rest:nm.rest });
  ['tasks', 'hours', 'streak'].forEach(k => { const x = next.find(n => n.k === k); assert.deepEqual(run(`wayNext({ k:'${k}', v:1 })`), { t:x.t, rest:x.rest }, k); });
  assert.match(text(run(`(S.ptab = 'sv', viewProgress())`)), new RegExp(`Nächstes Ziel: ${nm.v}, ${nm.rest}\\.`));
  assert.match(text(run(`wayHtml()`)), new RegExp(nm.rest));
});

test('Eine Stelle je Regel im Quelltext: Abgleich, Bewegung reduzieren, Monatsnamen, Prozent mit geschütztem Leerzeichen', () => {
  const fs = require('node:fs'), path = require('node:path'), dir = path.join(__dirname, '../../src/js');
  const src = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  const count = re => (src.match(re) || []).length;
  assert.equal(count(/Math\.max\(dp\[i \+ 1\]\[j\], dp\[i\]\[j \+ 1\]\)/g), 1, 'längste gemeinsame Folge nur in lcsPairs');
  assert.equal(count(/prefers-reduced-motion/g), 1, '„Bewegung reduzieren“ nur in calmMotion');
  assert.equal(count(/'Januar'|'Jan'/g), 2, 'Monatsnamen nur in MONTHS und MONTHS_FULL');
  assert.equal(count(/function totals\(|const totals =/g), 0, 'Gesamtsummen nur in lifeTotals');
  assert.equal(count(/\} %|' %'|" %"/g), 0, 'Prozent nur über pct, mit geschütztem Leerzeichen');
  assert.equal(run('pct(0.94)'), '94 %'); assert.equal(run('pct(0.045, true)'), '4,5 %');
});

// Aufräumen Schritt 3: Fortschritt ohne Wiederholungen im ersten Jahr; „Wann du übst“ bleibt eine Karte (die Verteilung zählt)
test('Fortschritt: „Jahr für Jahr“ erst ab dem zweiten Jahr, „Wann du übst“ mit Verteilung', () => {
  const d = base();
  for (let k = 40; k >= 0; k--) { d.log[ds(k)] = { sv:{ n:20, secs:450 } }; d.done[ds(k)] = true; d.tlog[ds(k)] = { h:{ 7:5, 21:1 } }; }
  setDB(d);
  assert.equal(run('yearsHtml()'), '', 'ein Jahr: dieselben Zahlen stehen in der Kopfkarte');
  d.log[ds(400)] = { sv:{ n:5, secs:120 } }; setDB(d);
  assert.match(text(run('yearsHtml()')), /^Jahr für Jahr \d{4} bisher/);
  run(`S.ptab = 'all'; S.view = 'progress'`);
  const p = run('viewProgress()');
  // Eigene Karte nach den Lernminuten, 24 Stunden als Säulen; nur um 7 und 21 Uhr geübt: das Fenster beginnt bei 7
  assert.match(p, /<h2 class="grp">Wann du übst<\/h2><div class="chart"><svg class="hours"/);
  assert.equal((p.match(/<rect [^>]*class="hb/g) || []).length, 24);
  assert.ok(p.indexOf('Lernminuten') < p.indexOf('Wann du übst'));
  assert.match(text(p), /Am häufigsten zwischen 7 und 9 Uhr, letzte 60 Tage\./);
});
