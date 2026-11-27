#!/usr/bin/env node
// Listet alle Fassungen, die die App aus den Alternativen der Satzbank erzeugt (Kombinationen und -se zu -ra), je Satz.
// tests/unit/kombinationen.test.js vergleicht sie mit der gelesenen Liste tests/fixtures/kombinationen.txt.
// Ändern sich Inhalte: neue Fassungen lesen, falsche mit „nicht: …“ in den Alternativen ausschließen, dann
//   node tools/kombinationen.js --write     (schreibt die Liste neu)
//   node tools/kombinationen.js             (zeigt sie, mit Zählung)
const fs = require('fs'), path = require('path');
const { loadApp } = require('../tests/helpers/load.js');
const FILE = path.join(__dirname, '..', 'tests', 'fixtures', 'kombinationen.txt');

function listing(app = loadApp()){
  const BANK = app.get('BANK'), lines = [];
  ['sv', 'es'].forEach(lang => BANK[lang].filter(it => it.made && it.made.length).forEach(it => {
    lines.push(`# ${lang} ${it.trap} | ${it.target}`);
    it.made.forEach(s => lines.push(s));
  }));
  return lines.join('\n') + '\n';
}
module.exports = { listing, FILE };

if (require.main === module) {
  const text = listing(), heads = text.split('\n').filter(l => l.startsWith('# '));
  const count = lang => ({ sentences:heads.filter(l => l.startsWith(`# ${lang} `)).length, made:0 });
  const n = { sv:count('sv'), es:count('es') };
  let lang = null;
  text.split('\n').filter(Boolean).forEach(l => { if (l.startsWith('# ')) lang = l.slice(2, 4); else n[lang].made++; });
  if (process.argv.includes('--write')) { fs.writeFileSync(FILE, text); console.log('geschrieben: ' + path.relative(process.cwd(), FILE)); }
  else process.stdout.write(text);
  console.error(`Schwedisch: ${n.sv.sentences} Sätze, ${n.sv.made} Fassungen; Spanisch: ${n.es.sentences} Sätze, ${n.es.made} Fassungen`);
}
