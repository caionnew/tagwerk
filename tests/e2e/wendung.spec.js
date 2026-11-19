// Feste Wendung beim ersten Kontakt (24.55.0): das wörtliche Bild als Hinweis, bei „Fortgeschritten“ auf Tipp; danach ohne.
const { test, expect, APP, seed, freshDB } = require('./helpers');
const fs = require('fs'), path = require('path');
// Alle Redewendungen außer „Det är väl inte hela världen.“ schon einmal geübt: Die Themenrunde beginnt mit dem neuen Satz
function db(){
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'content.js'), 'utf8');
  const block = src.slice(src.indexOf('idiom: `'), src.indexOf('`', src.indexOf('idiom: `') + 8));
  const targets = block.split('\n').map(l => l.split('|').map(x => x.trim())[1]).filter(Boolean);
  const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
  const d = freshDB('sv'); d.settings.niveau = 'fort';
  const far = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
  // Gleiche Kennung wie in der App: Sprache + djb2-Hash des Zielsatzes
  targets.filter(t => t !== 'Det är väl inte hela världen.').forEach(t => { d.st['sv:' + hash(t)] = { s:9, d:5, ivl:9, last:'2026-01-01', due:far, reps:1, ok:1, bad:0, alts:[] }; });
  return d;
}
test('Redewendung beim ersten Kontakt: „Wörtlich zeigen“, auf Tipp das Bild; beim nächsten Satz kein Bild', async ({ page }) => {
  await seed(page, db());
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=pickTopic]');
  await page.click('[data-a=trapgo][data-t=idiom]');
  await expect(page.locator('.de')).toHaveText('Das ist doch nicht das Ende der Welt.');
  const tip = page.locator('.kicker [data-a=showtip]');
  await expect(tip).toHaveText('Wörtlich zeigen');
  await tip.click();
  await expect(page.locator('.kicker .hintw')).toHaveText('wörtlich: nicht die ganze Welt');
  await expect(page.locator('#answer')).toBeFocused();
  await page.fill('#answer', 'världen');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb')).toContainText('Richtig');
  await page.click('[data-a=next]');
  // Bekannte Wendung: Abruf ohne Hilfe
  await expect(page.locator('.kicker')).toHaveText('Ergänze die Lücke');
});
