// Abwechslung neuer Sätze gegenüber einem Git-Stand: node tools/vielfalt.js [ref, Vorgabe origin/main]
// Misst für jede Sprache die hinzugekommenen Sätze der Satzbank: Anteil neuer Inhaltswörter (Grundformen, die die Satzbank
// vorher nicht hatte), Länge, häufige Satzanfänge, erste Person vorn. Ziel je Inhaltspaket: mindestens 40 % neue Inhaltswörter,
// kein Zwei-Wort-Anfang öfter als dreimal, im Schnitt mindestens 9 Wörter. Erst bauen (node tools/build.js), dann messen.
'use strict';
const { execSync } = require('child_process');
const path = require('path');
const { loadApp } = require('../tests/helpers/load.js');
const ref = process.argv[2] || 'origin/main';
const root = path.join(__dirname, '..');
const contentAt = src => new Function(`${src}\nreturn CONTENT;`)();
const targets = (C, lang) => Object.values(C[lang]).flatMap(block => block.split('\n').filter(l => l.includes('|') && !l.trim().startsWith('/*')).map(l => l.split('|')[1].trim()));
const before = contentAt(execSync(`git show ${ref}:src/data/content.js`, { cwd:root, encoding:'utf8' }));
const app = loadApp(), BANK = app.get('BANK'), tokens = app.get('tokens'), lookupWord = app.get('lookupWord'), isFunc = app.get('isFunc');
const lemma = (lang, w) => { const e = lookupWord(lang, w); return ((e && e.l) || w).toLowerCase(); };
// Hilfsverben und Kopula sind Grammatik, kein Wortschatz, auch in Formen, die isFunc nicht kennt (habría, estaríamos, blivit)
const AUX = { sv:new Set(['ha', 'vara', 'bli']), es:new Set(['haber', 'ser', 'estar']) };
const content = (lang, s) => tokens(s).map(w => w.toLowerCase()).filter(w => /[a-zà-ÿ]/.test(w) && !/^\d+$/.test(w) && !isFunc(lang, w)).map(w => lemma(lang, w)).filter(l => !AUX[lang].has(l));
for (const lang of ['sv', 'es']) {
  const old = new Set(targets(before, lang)), added = BANK[lang].filter(i => !i.tat && !i.own && !old.has(i.target)).map(i => i.target);
  if (!added.length) { console.log(`${lang}: keine neuen Sätze`); continue; }
  const known = new Set([...old].flatMap(s => content(lang, s)));
  const words = added.flatMap(s => content(lang, s)), fresh = words.filter(w => !known.has(w));
  const len = added.reduce((a, s) => a + s.split(/\s+/).length, 0) / added.length;
  const op = {}; added.forEach(s => { const k = s.split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[,.¿¡]/g, ''); op[k] = (op[k] || 0) + 1; });
  const many = Object.entries(op).filter(([, n]) => n > 3);
  const first = added.filter(s => (lang === 'sv' ? /^jag\b/i : /^(yo|me)\b/i).test(s)).length;
  const share = fresh.length / words.length;
  console.log(`${lang}: ${added.length} neue Sätze, ${Math.round(share * 100)} % neue Inhaltswörter (${new Set(fresh).size} neue Grundformen), ` +
    `im Schnitt ${len.toFixed(1)} Wörter, erste Person vorn ${first}` + (many.length ? `, häufige Anfänge: ${many.map(x => x.join(' ×')).join(', ')}` : ''));
  const miss = [share < 0.4 && 'unter 40 % neue Inhaltswörter', len < 9 && 'im Schnitt unter 9 Wörtern', many.length && 'ein Satzanfang öfter als dreimal'].filter(Boolean);
  if (miss.length) console.log(`  Ziel verfehlt: ${miss.join('; ')}`);
}
