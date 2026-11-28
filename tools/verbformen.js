#!/usr/bin/env node
// Listet die Verbformen, die das Wörterbuch selbst bildet (glossForms, src/js/verbformen.js), je Verb die Formen, an denen
// Gruppe, Stammwechsel und Rechtschreibung zu sehen sind. tests/unit/verbformen.test.js vergleicht sie mit der gelesenen Liste
// tests/fixtures/verbformen.txt. Kommt ein Verb dazu oder ändert sich eine Regel: die neuen Zeilen lesen; falsche Gruppe oder
// fehlender Stammwechsel gehören in SV_G2, SV_G3, SV_STRONG oder ES_IE, ES_UE, ES_EI, ES_ACC_IAR. Dann
//   node tools/verbformen.js --write     (schreibt die Liste neu)
//   node tools/verbformen.js             (zeigt sie, mit Zählung)
const fs = require('fs'), path = require('path');
const { loadApp } = require('../tests/helpers/load.js');
const FILE = path.join(__dirname, '..', 'tests', 'fixtures', 'verbformen.txt');

function listing(app = loadApp()){
  app.get('glossForms')();
  const V = app.get('GLOSS_VERBS'), svConj = app.get('svConj'), esConj = app.get('esConj'), lines = [];
  const G = { 0:'unregelmäßig', 1:'Gruppe 1', 2:'Gruppe 2', 3:'Gruppe 3' };
  [...V.sv].sort((a, b) => a[0].localeCompare(b[0], 'sv')).forEach(([inf, g]) => {
    const c = svConj(inf, g);
    lines.push(`sv ${inf} (${G[g]}): ${c.pres}, ${c.past.join('/')}, ${(c.sups || [c.sup]).join('/')}` + (c.part.length ? `; ${c.part.join(', ')}` : '') + (c.pass.length ? `; ${[c.pass[0]].concat(c.passPast.slice(0, 1)).join(', ')}` : ''));
  });
  [...V.es].sort((a, b) => a[0].localeCompare(b[0], 'es')).forEach(([inf, lemma]) => {
    const c = esConj(inf);
    const f = (t, ...p) => p.map(i => c[t][i]).filter(Boolean).join(' ');
    lines.push(`es ${lemma}: ` + [f('pres', 0, 2, 3), f('indef', 0, 2, 5), f('subj', 0, 3), f('fut', 0), f('ra', 0), c.part, c.ger, c.impv.filter(Boolean).join(' ')].filter(Boolean).join(', '));
  });
  return lines.join('\n') + '\n';
}
module.exports = { listing, FILE };

if (require.main === module) {
  const text = listing(), n = l => text.split('\n').filter(x => x.startsWith(l + ' ')).length;
  if (process.argv.includes('--write')) { fs.writeFileSync(FILE, text); console.log('geschrieben: ' + path.relative(process.cwd(), FILE)); }
  else process.stdout.write(text);
  console.error(`Schwedisch: ${n('sv')} Verben, Spanisch: ${n('es')} Verben`);
}
