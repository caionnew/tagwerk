#!/usr/bin/env node
// Baut die App: src/index.html + src/style.css + alle Skripte in fester Reihenfolge → dist/index.html.
// Kopiert public/ nach dist/ und setzt die Cache-Version des Service Workers aus einem Inhalts-Hash,
// damit installierte Apps jede neue Version zuverlässig erkennen. Symbole erhalten einen Hash im Dateinamen,
// die Versionsnummer aus package.json steht in der App unter Einstellungen.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, process.env.OUT_DIR || 'dist');
// Reihenfolge ist wichtig: Daten und Generatoren vor dem App-Kern, Ansichten und Ereignisse zuletzt
const ORDER = [
  'data/content.js', 'js/generators.js', 'js/forms.js', 'data/gloss.js', 'data/fundstueck.js', 'data/terms.js', 'data/kultur.js', 'data/texte.js', 'data/geo.js',
  'js/part_head.js', 'js/part_icons.js', 'js/part_fsrs.js', 'js/part_check.js', 'js/part_online.js', 'js/part_speech.js', 'js/part_radio.js', 'js/part_read.js', 'js/part_start.js', 'js/part_shadow.js',
  'js/part_stats.js', 'js/part_model.js', 'js/part_long.js', 'js/part_write.js', 'js/part_ref.js', 'js/part_views.js', 'js/part_events.js'
];
function build(){
  const missing = ORDER.filter(f => !fs.existsSync(path.join(SRC, f)));
  if (missing.length) throw new Error('Fehlende Quelldateien: ' + missing.join(', '));
  const js = ORDER.map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
  // Syntaxprüfung ohne Ausführung: findet Tippfehler, bevor die App auf dem Handy leer bleibt
  new vm.Script(`(() => {\n'use strict';\n${js}\n})();`, { filename:'tagwerk-bundle.js' });
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (!js.includes("'@VERSION@'")) throw new Error('APP_VERSION-Platzhalter fehlt (src/js/part_head.js)');
  const tpl = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  if (!tpl.includes('/* @STYLE */') || !tpl.includes('/* @SCRIPT */')) throw new Error('Platzhalter in src/index.html fehlen');
  // Symbole bekommen einen Inhalts-Hash im Namen (icon-512.1a2b3c4d.png). Firefox merkt sich Symbole pro Adresse;
  // mit neuem Namen holt es ein geändertes Symbol neu, statt das alte aus seinem Speicher zu nehmen.
  const PUB = path.join(ROOT, 'public');
  const icons = {};
  for (const f of fs.readdirSync(PUB).filter(f => /^icon-[\w-]+\.png$/.test(f))) {
    const h = crypto.createHash('sha256').update(fs.readFileSync(path.join(PUB, f))).digest('hex').slice(0, 8);
    icons[f] = f.replace(/\.png$/, `.${h}.png`);
  }
  const withIcons = text => Object.entries(icons).reduce((t, [from, to]) => t.replace(new RegExp(`(?<=["'/])${from.replace(/\./g, '\\.')}(?=["'])`, 'g'), to), text);
  const html = withIcons(tpl.replace('/* @STYLE */\n', () => fs.readFileSync(path.join(SRC, 'style.css'), 'utf8')).replace('/* @SCRIPT */', () => js.replace("'@VERSION@'", `'${pkg.version}'`)));
  fs.rmSync(OUT, { recursive:true, force:true });
  fs.mkdirSync(OUT, { recursive:true });
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  for (const f of fs.readdirSync(PUB)) {
    if (icons[f]) { fs.copyFileSync(path.join(PUB, f), path.join(OUT, icons[f])); continue; }
    const src = path.join(PUB, f);
    if (/\.(webmanifest|js)$/.test(f)) fs.writeFileSync(path.join(OUT, f), withIcons(fs.readFileSync(src, 'utf8')));
    else fs.copyFileSync(src, path.join(OUT, f));
  }
  const hash = crypto.createHash('sha256').update(html).update(JSON.stringify(icons)).digest('hex').slice(0, 8);
  const version = `tagwerk-${pkg.version}-${hash}`;
  const swPath = path.join(OUT, 'sw.js');
  const sw = fs.readFileSync(swPath, 'utf8');
  if (!/const CACHE = '[^']*';/.test(sw)) throw new Error('CACHE-Zeile in public/sw.js nicht gefunden');
  fs.writeFileSync(swPath, sw.replace(/const CACHE = '[^']*';/, `const CACHE = '${version}';`));
  const unused = Object.values(icons).filter(n => !fs.readFileSync(path.join(OUT, 'manifest.webmanifest'), 'utf8').includes(n) && !html.includes(n));
  if (unused.length) throw new Error("Symbol nirgends verwendet: " + unused.join(', '));
  return { out:OUT, kb:Math.round(Buffer.byteLength(html) / 1024), version, icons };
}
if (require.main === module) {
  try { const r = build(); console.log(`gebaut: ${path.relative(ROOT, r.out)}/index.html (${r.kb} KB), Cache ${r.version}`); }
  catch (e) { console.error('Build fehlgeschlagen:', e.message); process.exit(1); }
}
module.exports = { build, ORDER };
