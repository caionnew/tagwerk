#!/usr/bin/env node
// Prüft das ganze Skript so, wie es im Browser läuft: alle Quelldateien in Bau-Reihenfolge hintereinander.
// Einzelne Dateien allein ergäben Fehlalarme, weil sie Namen aus anderen Dateien benutzen.
// Findet undefinierte und doppelt vergebene Namen, doppelte Schlüssel, unbenutzte Variablen, toten Code.
// Aufruf: node tools/lint.js   (läuft auch als Einheitstest in tests/unit/lint.test.js)
const fs = require('fs'), path = require('path');
const { ESLint } = require('eslint');
const globals = require('globals');
const { ORDER } = require('./build.js');
const SRC = path.join(__dirname, '..', 'src');

const RULES = {
  'no-undef':'error', 'no-redeclare':'error', 'no-dupe-keys':'error', 'no-duplicate-case':'error', 'no-dupe-else-if':'error',
  'no-const-assign':'error', 'no-func-assign':'error', 'no-unsafe-negation':'error', 'no-self-assign':'error', 'no-self-compare':'error',
  'no-unreachable':'error', 'no-unused-vars':['error', { args:'none', caughtErrors:'none' }], 'use-isnan':'error', 'valid-typeof':'error'
};

async function lint(){
  const files = ORDER.map(f => ({ f, text:fs.readFileSync(path.join(SRC, f), 'utf8') }));
  // Startzeile jeder Datei im Gesamtskript, um Funde auf Datei und Zeile zurückzuführen
  let line = 1;
  files.forEach(x => { x.start = line; line += x.text.split('\n').length; });
  const eslint = new ESLint({
    overrideConfigFile:true,
    overrideConfig:{ languageOptions:{ ecmaVersion:'latest', sourceType:'script', globals:{ ...globals.browser } }, rules:RULES }
  });
  const [res] = await eslint.lintText(files.map(x => x.text).join('\n'), { filePath:'tagwerk-bundle.js' });
  return res.messages.map(m => {
    const x = files.filter(y => y.start <= m.line).pop();
    return { file:'src/' + x.f, line:m.line - x.start + 1, rule:m.ruleId, message:m.message };
  });
}
module.exports = { lint };

if (require.main === module) lint().then(found => {
  found.forEach(m => console.log(`${m.file}:${m.line}  ${m.message}  (${m.rule})`));
  console.log(found.length ? `${found.length} Funde` : 'Keine Funde');
  process.exitCode = found.length ? 1 : 0;
});
