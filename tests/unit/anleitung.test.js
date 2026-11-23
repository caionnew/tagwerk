// CLAUDE.md (Anleitung für die Arbeit am Repo) bleibt aktuell: Jede genannte Datei existiert, jedes Modul und jede Datendatei ist genannt.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), text = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
const DIRS = ['', 'src', 'src/js', 'src/data', 'tests/unit', 'tests/e2e', 'tests/helpers', 'tools', 'docs'];
test('CLAUDE.md: jede genannte Datei existiert', () => {
  // Platzhalter (tagwerk-*.patch, <version>) und das Build-Ergebnis dist/ ausgenommen
  const names = [...new Set(text.match(/[\w./*<>-]+\.(?:js|md|sh|json|css|html)\b/g) || [])].filter(n => !/[*<>]/.test(n) && !n.startsWith('dist/'));
  const missing = names.filter(n => (n.includes('/') ? !fs.existsSync(path.join(ROOT, n)) : !DIRS.some(d => fs.existsSync(path.join(ROOT, d, n)))));
  assert.deepEqual(missing, []);
});
test('CLAUDE.md: jedes Modul und jede Datendatei steht in der Code-Landkarte', () => {
  const files = ['src/js', 'src/data'].flatMap(d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.js')));
  assert.deepEqual(files.filter(f => !text.includes(f)), []);
});
test('CLAUDE.md: keine Versionsnummer und keine Testzahlen (die ändern sich mit jedem Update)', () => {
  assert.doesNotMatch(text, /\b2\d\.\d{1,3}\.\d{1,3}\b/);
  assert.doesNotMatch(text, /\(zurzeit \d+\)/);
});
