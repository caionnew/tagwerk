// Statische Prüfung des ganzen Skripts (tools/lint.js): keine undefinierten oder doppelten Namen, keine doppelten Schlüssel,
// keine unbenutzten Variablen. Fängt Kollisionen zwischen Dateien, bevor sie auf dem Handy auffallen.
const test = require('node:test'), assert = require('node:assert');
const { lint } = require('../../tools/lint.js');
test('ESLint findet im Gesamtskript nichts', async () => {
  const found = await lint();
  assert.deepStrictEqual(found.map(m => `${m.file}:${m.line} ${m.message}`), []);
});
