// Build: Versionsnummer in der App, Symbole mit Inhalts-Hash im Namen und überall richtig verlinkt.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path');
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-build-'));
process.env.OUT_DIR = path.relative(path.join(__dirname, '..', '..'), OUT);
const { build } = require('../../tools/build.js');
test('Build: Version eingesetzt, Symbole gehasht und verlinkt, keine alten Namen', () => {
  const r = build();
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));
  const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(OUT, 'sw.js'), 'utf8');
  const man = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.webmanifest'), 'utf8'));
  assert.ok(html.includes(`APP_VERSION = '${pkg.version}'`));
  assert.ok(!html.includes("'@VERSION@'"));
  const names = Object.values(r.icons);
  assert.ok(names.length >= 3);
  for (const n of names) {
    assert.match(n, /^icon-[\w-]+\.[0-9a-f]{8}\.png$/);
    assert.ok(fs.existsSync(path.join(OUT, n)), n);
    assert.ok(sw.includes(`'./${n}'`), `${n} fehlt im Service Worker`);
  }
  for (const i of man.icons.concat(man.shortcuts.flatMap(s => s.icons))) assert.ok(names.includes(i.src), i.src);
  assert.ok(man.icons.some(i => i.purpose === 'maskable') && man.icons.some(i => i.purpose === 'any'));
  for (const old of Object.keys(r.icons)) assert.ok(![html, sw, JSON.stringify(man)].some(t => t.includes(`"${old}"`) || t.includes(`'./${old}'`)), `alter Name ${old} noch verlinkt`);
  assert.match(sw, /const CACHE = 'tagwerk-[\d.]+-[0-9a-f]{8}';/);
  fs.rmSync(OUT, { recursive:true, force:true });
});
