// Kombinationen von Alternativen und -se wie -ra (altsMade in src/js/part_head.js). Jede erzeugte Fassung ist gelesen und
// steht in tests/fixtures/kombinationen.txt; ändern sich Inhalte, listet der erste Test neue und weggefallene Fassungen.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs');
const { loadApp } = require('../helpers/load.js');
const { listing, FILE } = require('../../tools/kombinationen.js');
const app = loadApp();
const BANK = app.get('BANK'), judgeX = app.get('judgeX'), answersFor = app.get('answersFor'), altCombos = app.get('altCombos');
const combos = (t, a) => [...altCombos(t, a)];
const altsMade = app.get('altsMade'), esSeForm = app.get('esSeForm'), norm = app.get('norm');
const item = (lang, target) => { const it = BANK[lang].find(i => i.target === target); assert.ok(it, target); return it; };
const judge = (it, input) => judgeX(input, answersFor({ type:'free', id:it.id }), it.lang).res;
const own = it => it.alts.slice(0, it.alts.length - (it.made || []).length);

test('Erzeugte Fassungen: alle gelesen (tests/fixtures/kombinationen.txt)', () => {
  const now = listing(app), read = fs.readFileSync(FILE, 'utf8');
  if (now === read) return;
  const a = new Set(read.split('\n')), b = new Set(now.split('\n'));
  const added = [...b].filter(l => l && !a.has(l)), gone = [...a].filter(l => l && !b.has(l));
  assert.fail(`Erzeugte Fassungen haben sich geändert. Neue lesen, falsche mit „nicht: …“ in den Alternativen ausschließen, dann node tools/kombinationen.js --write\nneu:\n${added.join('\n')}\nweg:\n${gone.join('\n')}`);
});

test('Kombination: zwei Alternativen an verschiedenen Stellen gelten auch zusammen', () => {
  const sv = item('sv', 'Det var hans idé att ta upp frågan på mötet.');
  assert.equal(judge(sv, 'Det var hans idé att lyfta frågan under mötet'), 'ok');
  assert.ok(sv.made.includes('Det var hans idé att lyfta frågan under mötet.'));
  const es = item('es', 'Cuando lo conocí, todavía trabajaba de camarero.');
  assert.equal(judge(es, 'Cuando lo conocí, aún trabajaba como mesero'), 'ok');
});

test('Kombination: Was eine Alternative zusammen ändert, bleibt zusammen; berührende Stellen nicht', () => {
  // Zwei Stellen in einer Alternative (encuentro … tenso): nie „El encuentro … tensa“
  assert.deepEqual(combos('La reunión de ayer se puso tensa.', ['El encuentro de ayer se puso tenso.', 'La reunión de anoche se puso tensa.']), ['El encuentro de anoche se puso tenso.']);
  // Angrenzende Stellen (se puso | tensa) gelten nicht zusammen
  assert.deepEqual(combos('La reunión se puso tensa.', ['La reunión se volvió tensa.', 'La reunión se puso tirante.']), []);
  // Mehr als zwei geänderte Stellen: Die Alternative bleibt für sich
  assert.deepEqual(combos('Ayer fui al cine con mi hermano.', ['Anoche fui al teatro con mi hermana.', 'Ayer fui al cine con mi primo.']), []);
});

test('Kombination: Großschreibung und Satzzeichen wie in einem geschriebenen Satz', () => {
  assert.ok(item('es', '¿Las llaves? Me las dejé en casa.').made.includes('¿Las llaves? Las he dejado en casa.'));
  assert.ok(item('es', '¿Lo de agosto? Se lo comenté a la jefa esta mañana y no puso pegas.').made.includes('¿Lo de agosto? Esta mañana se lo dije a la jefa y no puso pegas.'));
  assert.ok(item('sv', 'Jag studerade i Göteborg i tre år, sedan flyttade jag till Stockholm.').made.includes('Jag pluggade i tre år i Göteborg, sedan flyttade jag till Stockholm.'));
  // Das Komma vor einer angehängten Stelle bleibt (… la madrugada, más o menos)
  assert.ok(item('es', 'Cuando sonó la alarma, serían más o menos las cuatro de la madrugada.').made.includes('Cuando saltó la alarma, serían las cuatro de la madrugada, más o menos.'));
  for (const lang of ['sv', 'es']) for (const it of BANK[lang]) for (const s of it.made || []) {
    assert.match(s, /^[¿¡"„«]*\p{Lu}/u, s);
    assert.doesNotMatch(s, /[,;:][.!?]$|\s[,.;:!?]|[,;:]{2}/, s);
  }
});

test('-se gilt wie -ra: lloviese wie lloviera, auch hubiese im Hauptsatz einer Bedingung in der Vergangenheit', () => {
  assert.equal(judge(item('es', 'Mandaron los documentos por mensajero para que llegaran a tiempo.'), 'Mandaron los documentos por mensajero para que llegasen a tiempo'), 'ok');
  assert.equal(judge(item('es', 'Si me hubieras avisado, te habría recogido en la estación.'), 'Si me hubieras avisado, te hubiese recogido en la estación'), 'ok');
  assert.equal(judge(item('es', 'Si no lloviera, saldríamos a pasear.'), 'Si no lloviese, iríamos a caminar'), 'ok');
  // Nur echte Formen auf -ra eines Verbs
  for (const w of ['para', 'ahora', 'era', 'otra', 'hora', 'cualquiera', 'afuera']) assert.equal(esSeForm(w), '', w);
  assert.equal(esSeForm('fuera'), 'fuese');
  assert.equal(esSeForm('hubiéramos'), 'hubiésemos');
  assert.equal(esSeForm('¿Llegaran,'), '¿Llegasen,');
});

test('„nicht:“ schließt eine erzeugte Fassung aus, und jeder Eintrag trifft eine', () => {
  assert.notEqual(judge(item('es', 'Me gustaría un café.'), 'Quisiese un café'), 'ok');
  assert.notEqual(judge(item('es', 'Fuera está lloviendo a cántaros.'), 'Fuese está lloviendo a cántaros'), 'ok');
  assert.notEqual(judge(item('sv', 'Har du ätit?'), 'Har du redan ätit än'), 'ok');
  let n = 0;
  for (const lang of ['sv', 'es']) for (const it of BANK[lang].filter(i => i.not && i.not.length)) {
    const all = new Set(altsMade(lang, it.target, own(it), [], it.norms || {}).map(s => norm(s, lang)));
    for (const x of it.not) { n++; assert.ok(all.has(norm(x, lang)), `„nicht: ${x}“ trifft keine erzeugte Fassung`); }
  }
  assert.ok(n >= 11);
});

test('Erzeugte Fassungen mischen keine Normen und wiederholen keine vorhandene', () => {
  for (const lang of ['sv', 'es']) for (const it of BANK[lang]) {
    const have = new Set([it.target].concat(own(it)).map(s => norm(s, lang)));
    for (const s of it.made || []) {
      assert.ok(!have.has(norm(s, lang)), s);
      if (it.norms) {
        const t = ' ' + norm(s, lang) + ' ';
        assert.ok(new Set(Object.keys(it.norms).filter(f => t.includes(' ' + f + ' ')).map(f => it.norms[f])).size <= 1, s);
      }
    }
  }
});
