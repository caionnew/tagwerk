// Verlauf im Sprach-Tab (seit 24.106.0): Reiter Sätze, Wörter und Gedächtnis; Tagesstand mit verankert, Wörtern in gefestigten
// Sätzen und Behaltensdauer; monotone Kurven ohne Überschwinger; Werte unter dem Diagramm folgen dem gewählten Tag.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const text = html => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[ \t\n]+/g, ' ').trim();
const pcData = html => JSON.parse(html.match(/data-pc="([^"]*)"/)[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));

// 40 Tage Protokoll und Tagesstände; 60 geübte Sätze mit bekannter Stabilität (1 bis 60 Tage), 20 davon gefestigt
function setup({ days = 40, sp = true, w = true, noLog = false } = {}){
  app.run(`(() => {
    DB = freshDB(); DB.snap = {}; DB.log = {}; DB.st = {}; S.pcTab = null; S.pcAll = false; S.lang = 'sv';
    const t = today();
    BANK.sv.slice(0, 60).forEach((i, k) => { const s = k + 1; DB.st[i.id] = { s, d:5, ivl:s, last:t, due:addDays(t, s), reps:2, ok:2, bad:0, alts:[] }; });
    for (let k = ${days}; k >= 1; k--) {
      const d = addDays(t, -k), f = (${days} - k) / ${days};
      ${noLog ? '' : 'DB.log[d] = { sv:{ n:12, secs:400, fresh:k === ' + days + ' ? 10 : (k % 4 ? 1 : 2), mc:Math.round(18 * f) } };'}
      DB.snap[d] = { sv:{ n:10 + Math.round(48 * f), m:Math.round(18 * f), k:8 + Math.round(40 * f)${w ? ', w:40 + Math.round(200 * f)' : ''}${w ? ', wf:k < 10 ? 60 + Math.round(30 * f) : undefined' : ''}${sp ? ', sp:k < 25 ? [1 + 3 * f, 3 + 20 * f, 10 + 30 * f].map(spanRound) : undefined' : ''} } };
      if (DB.snap[d].sv.wf === undefined) delete DB.snap[d].sv.wf;
      if (DB.snap[d].sv.sp === undefined) delete DB.snap[d].sv.sp;
    }
  })()`);
}

test('Behaltensdauer: Quartile linear interpoliert (R type 7), gerundet; Tagesstand speichert verankert, Wörter in gefestigten Sätzen und Quartile', () => {
  assert.equal(run('quantile([1, 2, 3, 4], 0.5)'), 2.5);
  assert.equal(run('quantile([1, 2, 3, 4], 0.25)'), 1.75);
  assert.equal(run('quantile([7], 0.75)'), 7);
  assert.equal(run('quantile([], 0.5)'), null);
  assert.deepEqual([run('spanRound(3.456)'), run('spanRound(12.6)')], [3.5, 13]);
  setup();
  // 60 Sätze mit S = 1 … 60: Quartile 15,75 / 30,5 / 45,25
  assert.deepEqual(run(`spanQuartiles('sv')`), [16, 31, 45]);
  app.run(`(() => { const id = BANK.sv[0].id; DB.st[id].ivl = 400; DB.st[id].s = 400; })()`);
  app.run('snapshot()');
  const sn = run('DB.snap[today()].sv');
  assert.equal(sn.a, 1, 'verankert im Tagesstand');
  assert.ok(sn.w > 0 && sn.wf > 0 && sn.wf <= sn.w, 'Wörter und Wörter in gefestigten Sätzen');
  assert.equal(sn.sp.length, 3);
  assert.ok(sn.sp[0] <= sn.sp[1] && sn.sp[1] <= sn.sp[2]);
  assert.match(run('fmtDays(1)'), /^1 Tag$/); assert.match(run('fmtDays(8.44)'), /^8,4 Tage$/);
});

test('Monotone Kurven: Steigung null an Extremstellen, harmonisches Mittel sonst; gestapelte Oberkante nie unter der unteren', () => {
  assert.deepEqual(run('monoSlopes([0, 2, 2, 5])'), [2, 0, 0, 3]);
  assert.equal(run('monoSlopes([0, 1, 4])')[1], 1.5);
  assert.deepEqual(run('monoSlopes([3])'), [0]);
  // Bestandteil b springt, a steigt gleichmäßig: an allen Bézier-Stützstellen liegt a+b über a
  const lv = run(`stackLevels([{ a:0, b:5 }, { a:2, b:0 }, { a:4, b:9 }, { a:6, b:9 }], [0, 1, 2, 3], [p => p.a, p => p.b])`);
  for (let j = 0; j < 3; j++) {
    for (const [u, l] of [[lv[2].v[j] + lv[2].m[j] / 3, lv[1].v[j] + lv[1].m[j] / 3], [lv[2].v[j + 1] - lv[2].m[j + 1] / 3, lv[1].v[j + 1] - lv[1].m[j + 1] / 3]]) assert.ok(u >= l - 1e-9);
  }
  // Monoton steigende Werte: keine Kontrollpunkte über dem nächsten Wert (kein Überschwingen)
  const v = [0, 1, 1.2, 8, 8.1], m = run(`monoSlopes(${JSON.stringify(v)})`);
  for (let i = 0; i < v.length - 1; i++) { assert.ok(v[i] + m[i] / 3 <= v[i + 1] + 1e-9); assert.ok(v[i + 1] - m[i + 1] / 3 >= v[i] - 1e-9); }
});

test('Verlauf: drei Reiter, Sätze vorgewählt; Kopfzeile mit Zuwachs; Werte unter dem Diagramm sind der Stand jetzt', () => {
  setup();
  const h = run(`progressChart('sv')`);
  assert.match(h, /<h2 class="grp">Verlauf<\/h2>/);
  assert.deepEqual([...h.matchAll(/data-a="pctab" data-t="(\w)"/g)].map(x => x[1]), ['s', 'w', 'g']);
  assert.match(h, /aria-checked="true" data-a="pctab" data-t="s">Sätze/);
  assert.match(text(h), /^Verlauf Sätze Wörter Gedächtnis [+−]?\d+ gefestigt, \+\d+ geübt in 30 Tagen Heute /);
  const D = pcData(h), last = D.x.length - 1;
  assert.equal(D.d[last], 'Heute');
  assert.equal(D.x.length, 41, 'täglich, 40 Tage und heute');
  const mature = run(`matureCount('sv')`), practiced = run(`BANK.sv.filter(i => stOf(i.id)).length`);
  assert.deepEqual(D.v.map(v => v[last]), [String(mature), String(practiced - mature), String(Math.round(run(`knownEstimate('sv')`)))]);
  assert.match(text(h), new RegExp(`Heute ${mature} gefestigt ${practiced - mature} im Aufbau \\d+ abrufbar$`));
  assert.match(h, /data-k="gefestigt">gefestigt<\/button>/);
  assert.doesNotMatch(h, /verankert/, 'ohne verankerte Sätze keine Fläche und kein Wert dafür');
  assert.doesNotMatch(h, /Erscheint|sobald|Tipp auf/);
  // Ein verankerter Satz: vierte Fläche und Wert zuerst
  app.run(`(() => { const id = BANK.sv[0].id; DB.st[id].ivl = 400; DB.st[id].s = 400; })()`);
  const h2 = run(`progressChart('sv')`);
  assert.match(h2, /class="pca a-a"/);
  assert.match(text(h2), /Heute 1 verankert \d+ gefestigt/);
});

test('Verlauf: Wörter und Gedächtnis; ohne Verlauf der Behaltensdauer die Verteilung jetzt', () => {
  setup();
  app.run(`S.pcTab = 'w'`);
  let h = run(`progressChart('sv')`);
  assert.match(text(h), /^Verlauf Sätze Wörter Gedächtnis \+\d+ Wörter in 30 Tagen Heute \d+ in geübten Sätzen \d+ in gefestigten$/);
  assert.match(h, /data-k="woerter">Wörter<\/button>/);
  const vc = run(`vocabCount('sv')`), D = pcData(h);
  assert.deepEqual(D.v.map(v => v[v.length - 1]), [String(vc.all), String(vc.firm)]);
  assert.equal(D.v[1][0], null, 'Wörter in gefestigten Sätzen erst ab dem ersten erfassten Tag');
  app.run(`S.pcTab = 'g'`);
  h = run(`progressChart('sv')`);
  assert.match(text(h), /^Verlauf Sätze Wörter Gedächtnis 31 Tage Behaltensdauer ?, am \d+\. \S+ \d+(,\d)? Heute 16 Tage unteres Viertel 31 Tage Median 45 Tage oberes Viertel$/);
  assert.match(h, /data-k="behaltensdauer">Behaltensdauer<\/button>/);
  assert.match(h, /logarithmische Achse/);
  assert.equal(pcData(h).x.length, 25, 'nur die Tage mit Behaltensdauer');
  // Noch kein Verlauf: Verteilung nach Grenzen in Tagen
  setup({ sp:false });
  app.run(`S.pcTab = 'g'`);
  h = run(`progressChart('sv')`);
  assert.doesNotMatch(h, /<svg/);
  assert.match(text(h), /unter 1 Woche 6 1 bis 3 Wochen 14 3 Wochen bis 3 Monate 40 3 Monate bis 1 Jahr 0 über 1 Jahr 0 Heute 16 Tage unteres Viertel 31 Tage Median 45 Tage oberes Viertel$/);
});

test('Verlauf: ohne Wortstände kein Reiter Wörter; unter einer Woche kein Verlauf; Stand der Sätze steckt jetzt im Verlauf', () => {
  setup({ w:false });
  const h = run(`progressChart('sv')`);
  assert.deepEqual([...h.matchAll(/data-a="pctab" data-t="(\w)"/g)].map(x => x[1]), ['s', 'g']);
  app.run(`S.pcTab = 'w'`);
  assert.match(run(`progressChart('sv')`), /aria-checked="true" data-a="pctab" data-t="s"/, 'gewählter Reiter fehlt: Sätze');
  setup({ days:5 });
  assert.equal(run(`progressChart('sv')`), '');
  setup();
  app.run(`S.ptab = 'sv'; S.view = 'progress'`);
  const p = run('viewProgress()');
  assert.doesNotMatch(p, /Stand der Sätze|distline/);
  assert.equal((p.match(/<h2 class="grp">Verlauf<\/h2>/g) || []).length, 1);
});

test('Verlauf: kurzer Verlauf vergleicht mit dem Anfang („seit …“), langer bietet Letztes Jahr und Seit Beginn', () => {
  setup({ days:12 });
  assert.match(text(run(`progressChart('sv')`)), /geübt seit \d+\. \S+ Heute/);
  app.run(`(() => { const t = today(); for (let k = 420; k > 40; k -= 3) DB.log[addDays(t, -k)] = { sv:{ n:5, secs:200, fresh:0, mc:0 } }; })()`);
  const h = run(`progressChart('sv')`);
  assert.match(h, /data-a="pcrange" data-v="0">Letztes Jahr/);
  assert.match(pcData(h).d[0], /^\d+\. \S+ \d{4}$/, 'mit Jahr bei langem Verlauf');
});
