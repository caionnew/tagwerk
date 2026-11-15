#!/usr/bin/env node
// Baut die App: src/index.html + src/style.css + alle Skripte in fester Reihenfolge → dist/index.html.
// Kopiert public/ nach dist/ und setzt die Cache-Version des Service Workers aus einem Inhalts-Hash,
// damit installierte Apps jede neue Version zuverlässig erkennen.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, process.env.OUT_DIR || 'dist');
// Reihenfolge ist wichtig: Daten und Generatoren vor dem App-Kern, Ansichten und Ereignisse zuletzt
const ORDER = [
  'data/content.js', 'js/generators.js', 'js/forms.js', 'data/gloss.js', 'data/fundstueck.js', 'data/terms.js', 'data/kultur.js', 'data/geo.js',
  'js/part_head.js', 'js/part_fsrs.js', 'js/part_check.js', 'js/part_online.js', 'js/part_speech.js', 'js/part_modern.js',
  'js/part_stats.js', 'js/part_long.js', 'js/part_write.js', 'js/part_ref.js', 'js/part_views.js', 'js/part_events.js'
];
function build(){
  const missing = ORDER.filter(f => !fs.existsSync(path.join(SRC, f)));
  if (missing.length) throw new Error('Fehlende Quelldateien: ' + missing.join(', '));
  const js = ORDER.map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
  // Syntaxprüfung ohne Ausführung: findet Tippfehler, bevor die App auf dem Handy leer bleibt
  new vm.Script(`(() => {\n'use strict';\n${js}\n})();`, { filename:'tagwerk-bundle.js' });
  const tpl = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  if (!tpl.includes('/* @STYLE */') || !tpl.includes('/* @SCRIPT */')) throw new Error('Platzhalter in src/index.html fehlen');
  const html = tpl.replace('/* @STYLE */\n', () => fs.readFileSync(path.join(SRC, 'style.css'), 'utf8')).replace('/* @SCRIPT */', () => js);
  fs.rmSync(OUT, { recursive:true, force:true });
  fs.mkdirSync(OUT, { recursive:true });
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  for (const f of fs.readdirSync(path.join(ROOT, 'public'))) fs.copyFileSync(path.join(ROOT, 'public', f), path.join(OUT, f));
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const hash = crypto.createHash('sha256').update(html).digest('hex').slice(0, 8);
  const version = `tagwerk-${pkg.version}-${hash}`;
  const swPath = path.join(OUT, 'sw.js');
  const sw = fs.readFileSync(swPath, 'utf8');
  if (!/const CACHE = '[^']*';/.test(sw)) throw new Error('CACHE-Zeile in public/sw.js nicht gefunden');
  fs.writeFileSync(swPath, sw.replace(/const CACHE = '[^']*';/, `const CACHE = '${version}';`));
  return { out:OUT, kb:Math.round(Buffer.byteLength(html) / 1024), version };
}
if (require.main === module) {
  try { const r = build(); console.log(`gebaut: ${path.relative(ROOT, r.out)}/index.html (${r.kb} KB), Cache ${r.version}`); }
  catch (e) { console.error('Build fehlgeschlagen:', e.message); process.exit(1); }
}
module.exports = { build, ORDER };
