// Gestaltungssystem (Aufräumen Schritt 2b): feste Stufen für Schrift, Stärke, Radius und Bewegung, kein totes CSS,
// keine festen Abstände in den Vorlagen. Neue Regeln nehmen die Variablen aus :root in src/style.css.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const SRC = path.join(__dirname, '../../src');
const css = fs.readFileSync(path.join(SRC, 'style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const files = dir => fs.readdirSync(path.join(SRC, dir)).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(SRC, dir, f), 'utf8'));
const js = files('js').join('\n'), code = js + files('data').join('\n') + fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const values = prop => [...css.matchAll(new RegExp(`(?:^|[;{\\s])${prop}:\\s*([^;}]+)`, 'g'))].map(m => m[1].trim());

test('Schriftgrößen nur aus den Stufen --fs-1 bis --fs-13 (Ausnahme: Beschriftung der Karten)', () => {
  const bad = values('font-size').filter(v => !/^var\(--fs-([1-9]|1[0-3])\)$/.test(v) && v !== 'inherit' && !/^[\d.]+em$/.test(v) && !['8.5px', '9.5px'].includes(v));
  assert.deepEqual(bad, []);
  const map = [...css.matchAll(/([^{}]+)\{[^}]*font-size:\s*(?:8\.5|9\.5)px/g)].map(m => m[1].trim());
  assert.ok(map.every(s => s.startsWith('.map')), map.join(', '));
});

test('Schriftstärken nur aus --fw-regular, --fw-medium, --fw-semibold, --fw-bold', () => {
  assert.deepEqual(values('font-weight').filter(v => !/^var\(--fw-(regular|medium|semibold|bold)\)$/.test(v)), []);
});

test('Radien nur aus den Stufen: Flächen 18, Bedienelemente 14, darin 10, Markierungen 6 und 4, Pille, Kreis', () => {
  const ok = v => v.split(/\s+/).every(p => /^var\(--r-(l|m|s|xs|mark|pill)\)$/.test(p) || p === '0' || p === '50%' || /^[\d.]+em$/.test(p));
  assert.deepEqual(values('border-radius').filter(v => !ok(v)), []);
  assert.match(css, /--r-l:18px; --r-m:14px;/);
});

test('Übergänge: zwei Dauern und eine Kurve (langsam nur Füllstand und Abblenden beim Vorlesen)', () => {
  const bad = values('transition').flatMap(v => v.split(',')).map(s => s.trim()).filter(t => t !== 'none !important' && !/ var\(--dur-[12]\) var\(--ease\)$/.test(t) && !/^(width|filter|opacity) \.5s var\(--ease\)$/.test(t));
  assert.deepEqual(bad, []);
  assert.deepEqual(values('animation').filter(v => /(?<![-\w])ease(-out)?(?![-\w])/.test(v)), [], 'Einblenden mit var(--ease)');
  assert.match(js, /const MOTION = \{ fast:120, base:200, ease:'cubic-bezier\(\.2,\.7,\.3,1\)' \}/);
  assert.match(css, /--dur-1:\.12s; --dur-2:\.2s; --ease:cubic-bezier\(\.2,\.7,\.3,1\)/);
});

test('Kein totes CSS: jede Klasse aus style.css kommt im Code vor (auch zusammengesetzt wie m-${l})', () => {
  const classes = new Set();
  for (const m of css.matchAll(/([^{}]+)\{/g)) { const sel = m[1].trim(); if (sel.startsWith('@')) continue; for (const c of sel.matchAll(/\.([A-Za-z_][\w-]*)/g)) classes.add(c[1]); }
  // Vorsilben, an die eine Vorlage den Rest anhängt: class="m-${l}"
  const prefixes = new Set();
  for (const m of code.matchAll(/class="([^"]*)"/g)) for (const p of m[1].matchAll(/([\w-]+)\$\{/g)) prefixes.add(p[1]);
  const used = c => new RegExp(`(?<![\\w-])${c.replace(/[-]/g, '\\-')}(?![\\w-])`).test(code) || [...prefixes].some(p => c.startsWith(p) && c.length > p.length);
  assert.deepEqual([...classes].filter(c => !used(c)).sort(), []);
});

test('Keine festen Abstände in den Vorlagen: Abstände über Klassen (m0, mt-8, legend below …)', () => {
  assert.deepEqual(js.match(/style="margin[^"]*"/g) || [], []);
});
