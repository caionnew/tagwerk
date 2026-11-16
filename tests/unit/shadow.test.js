// Nachsprechen: Auswertung der Aufnahme, Aussprachehilfen, Wortabgleich der Spracherkennung
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const fn = n => app.get(n);
const val = x => JSON.parse(JSON.stringify(x));

// Hüllkurve im 20-ms-Raster aus Abschnitten [Lautstärke, Sekunden]
function bins(parts){
  const out = [];
  parts.forEach(([r, s]) => { for (let i = 0; i < Math.round(s / 0.02); i++) out.push({ r:r ? r * (0.8 + 0.2 * Math.sin(i)) : 0.002, p:r ? r * 3 : 0.006 }); });
  return out;
}
const near = (a, b, eps = 0.06) => assert.ok(Math.abs(a - b) <= eps, `${a} statt etwa ${b}`);

test('Auswertung: Sprechbeginn, -ende, Pause im Satz, Stockung ohne Satzzeichen', () => {
  const an = val(fn('shAnalyze')(bins([[0, 0.3], [0.1, 0.8], [0, 0.5], [0.1, 0.6], [0, 1.5]]), 0, 0));
  assert.equal(an.nothing, false);
  near(an.onset, 0.3); near(an.offset, 2.2); near(an.speech, 1.9);
  assert.equal(an.pauses.length, 1); near(an.pauses[0][0], 1.1); near(an.pauses[0][1], 1.6);
  assert.equal(an.extra, 1);
  assert.equal(fn('shAnalyze')(bins([[0, 0.3], [0.1, 0.8], [0, 0.5], [0.1, 0.6], [0, 1.5]]), 0, 1).extra, 0, 'Pause am Komma ist gewollt');
});
test('Auswertung: kurze Lücken (Verschlusslaute) sind keine Pausen, Knackser sind kein Sprechen', () => {
  const an = val(fn('shAnalyze')(bins([[0, 0.4], [0.12, 0.5], [0, 0.12], [0.12, 0.5], [0, 1]]), 0, 0));
  assert.equal(an.pauses.length, 0);
  near(an.speech, 1.12);
  assert.equal(fn('shAnalyze')(bins([[0, 1], [0.2, 0.04], [0, 2]]), 0, 0).nothing, true);
  assert.equal(fn('shAnalyze')(bins([[0, 3]]), 0, 0).nothing, true);
});
test('Auswertung: Tempo im Vergleich zum Original, leise und übersteuert', () => {
  const b = bins([[0, 0.3], [0.1, 1.9], [0, 1]]), A = fn('shAnalyze');
  assert.equal(A(b, 1.9, 0).tempo, 'same');
  assert.equal(A(b, 1.4, 0).tempo, 'slow');
  assert.equal(A(b, 1.0, 0).tempo, 'vslow');
  assert.equal(A(b, 3.0, 0).tempo, 'fast');
  assert.equal(A(b, 0, 0).tempo, null, 'ohne Original kein Urteil');
  assert.equal(A(bins([[0, 0.3], [0.008, 1.9], [0, 1]]), 0, 0).quiet, true);
  assert.equal(A(b, 0, 0).quiet, false);
  const loud = bins([[0, 0.3], [0.3, 1.9], [0, 1]]).map(x => ({ r:x.r, p:x.r > 0.1 ? 1 : x.p }));
  assert.equal(A(loud, 0, 0).clip, true);
  assert.equal(A(b, 0, 0).clip, false);
});
test('Pausen am Satzzeichen gelten als gewollt, andere als Stockung', () => {
  // Komma etwa in der Mitte: die Pause in der Mitte passt, die späte nicht
  const an = fn('shAnalyze')(bins([[0, 0.2], [0.1, 1], [0, 0.4], [0.1, 0.6], [0, 0.4], [0.1, 0.4], [0, 1]]), 0, 1);
  const m = val(fn('shMarkPauses')(an, 'Om du har tid i kväll, kan vi ses på stan.'));
  assert.deepEqual(m.pauses.map(p => p[2]), [true, false]);
  assert.equal(m.extra, 1);
});
test('Live-Messwerte im Raster: Lücken übernehmen den Wert davor', () => {
  const b = val(fn('shBinsFromFrames')([{ t:0.005, r:0.1, p:0.2 }, { t:0.07, r:0.3, p:0.5 }]));
  assert.equal(b.length, 4);
  assert.deepEqual(b.map(x => x.r), [0.1, 0.1, 0.1, 0.3]);
});

test('Spanisch: betonter Vokal nach den Regeln der Rechtschreibung', () => {
  const st = fn('esStress'), mark = w => { const i = st(w); return i == null ? w : w.slice(0, i) + '[' + w[i] + ']' + w.slice(i + 1); };
  const want = 'mañ[a]na gr[a]cias ciud[a]d habl[a]r ah[o]ra [a]gua Urugu[a]y est[o]y ru[i]do vi[u]da pingü[i]no r[á]pidamente [á]rbol canci[ó]n ex[a]men po[e]ta Mar[í]a te[a]tro si[e]mpre guit[a]rra Migu[e]l rel[o]j europ[e]o bu[e]no id[e]a hubi[e]ras';
  assert.equal(want.replace(/[[\]]/g, '').split(' ').map(mark).join(' '), want);
  // Einsilbige und unbetonte Wörter bleiben ohne Markierung
  ['hoy', 'muy', 'que', 'para', 'como', 'pero', 'ONU', 'el'].forEach(w => assert.equal(st(w), null, w));
});
test('Spanisch: Bindung vor Vokal und stummem h, nicht vor Gleitlaut und nicht über Satzzeichen', () => {
  const links = t => val(fn('shHints')(t, 'es').links);
  assert.deepEqual(links('La película está basada en una novela.'), ['', 'es', '', 'es', 'es', '', '']);
  assert.deepEqual(links('Si me hubieras avisado, te habría recogido.'), ['', 'es', 'es', '', 'es', '', '']);
  assert.deepEqual(links('Me gusta el hielo y el huevo.'), ['', 'es', '', 'es', 'es', '', '']);
});
test('Schwedisch: r verschmilzt (auch über die Wortgrenze), stumme Buchstaben, Alltagsformen', () => {
  const m = w => val(fn('svMarks')(w));
  assert.deepEqual(m('barn').retro, [[2, 4]]);
  assert.deepEqual(m('först').retro, [[2, 4]]);
  assert.deepEqual(m('Karlsson').retro, [[2, 4]]);
  assert.deepEqual(m('mörkt').retro, []);
  assert.deepEqual(m('hjälp').silent, [0]);
  assert.deepEqual(m('ljus').silent, [0]);
  assert.deepEqual(m('roligt').silent, [4]);
  assert.deepEqual(m('jag').silent, [2]);
  assert.equal(m('mig').say, 'mej');
  assert.equal(m('dem').say, 'dom');
  assert.deepEqual(val(fn('shHints')('Vi har lämnat över sitt hus.', 'sv').links), ['', 'retro', '', 'retro', '', '']);
});
test('Satz mit Hilfen: Text bleibt vollständig, Wörter antippbar', () => {
  const html = fn('shSentenceHtml');
  const plain = h => h.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').replace(/⁠/g, '').replace(/&#39;/g, "'");
  ['Föräldrarna har lämnat över sitt hus till sina barn.', 'Det är inte konstigt att jag säger det.', '¿Llevábamos dos horas esperando, o no?', 'Si me hubieras avisado, te habría recogido en la estación.']
    .forEach(t => { const lang = /[¿á]/.test(t) || t.startsWith('Si') ? 'es' : 'sv'; assert.equal(plain(html(t, lang, true)), t); assert.equal(plain(html(t, lang, false)), t); });
  // „ringer dig“: r und d verschmelzen auch über die Wortgrenze, „dig“ spricht man „dej“
  const h = html('Jag ringer dig i morgon.', 'sv', true);
  assert.match(h, /ringe<span class="ph-rx">r<\/span><\/span>\u2060<span class="ph-l ph-lrx"/);
  assert.match(h, /<ruby><span class="ph-rx">d<\/span>ig<rt>dej<\/rt><\/ruby>/);
  assert.match(h, /data-a="lookup" data-w="morgon" data-k="4"/);
});
test('Spracherkennung: Wörter je Satzwort, beste Hypothese, Zahlen und „i morgon“', () => {
  const hits = (t, alts, lang) => val(fn('shHits')(t, alts, lang));
  const a = hits('Vi ses i morgon klockan tre.', ['vi ses imorgon klockan 3', 'vi ser i morgon'], 'sv');
  assert.deepEqual(a.hit, [true, true, true, true, true, true]);
  assert.equal(a.n, 6); assert.equal(a.of, 6);
  const b = hits('¿Dónde está la estación?', ['donde esta la'], 'es');
  assert.deepEqual(b.hit, [true, true, true, false]);
});
