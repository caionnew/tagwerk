// Fortschritt: Übungstage nach Sprache und Einsatz, „Dein Weg“ als Gleisplan mit Spuren je Sprache, Abständen nach Zeit und
// aufklappbaren Jahren (seit 24.64). Dazu die Herkunft fester Wendungen in der Übung.
const { test, expect, APP, seed, richDB, freshDB, hash } = require('./helpers');
test('Kalender kodiert Sprache und Einsatz, Dein Weg zeigt Spuren und nächste Ziele', async ({ page }) => {
  const db = richDB('sv'); const pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  db.log[ds(3)] = Object.assign({}, db.log[ds(3)], { es:{ n:8, secs:200 } }); db.done[ds(3)] = true; db.doneLang = { [ds(3)]:{ sv:true, es:true } };
  db.log[ds(4)] = { es:{ n:3, secs:60 } }; delete db.done[ds(4)];
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  await expect(page.locator(`.cal g[data-d="${ds(3)}"] .de`)).toHaveCount(1);
  await expect(page.locator(`.cal rect[data-d="${ds(4)}"]`)).toHaveClass(/\bpe\b/);
  await expect(page.locator(`.cal rect[data-d="${ds(1)}"]`)).toHaveClass(/\bds\b/);
  await expect(page.locator('.calleg')).not.toContainText('Tagwerk und mehr');
  await expect(page.locator('.wleg')).toContainText('Schwedisch');
  await expect(page.locator('.wleg')).toContainText('Spanisch');
  expect(await page.locator('.wrail .wl').count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('.wrail .wl-next i.open').first()).toBeVisible();
  // Gemeinsame Etappen in der mittleren Spur, sprachbezogene in ihrer Spur
  await expect(page.locator('.wrail .wl', { hasText:'Erster Übungstag' }).locator('.rl-x i')).toHaveCount(1);
});

test('Dein Weg: Abstände nach Zeit, ältere Etappen je Jahr auf- und zuklappbar, erster Übungstag bleibt sichtbar', async ({ page }) => {
  const db = freshDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  db.doneLang = {};
  for (let k = 430; k >= 1; k--) { if (k >= 200 && k <= 220) continue; db.log[ds(k)] = { sv:{ n:30, secs:400 }, es:{ n:30, secs:400 } }; db.done[ds(k)] = true; }
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  const card = page.locator('#way + .chart');
  await expect(card.locator('.wtoday')).toHaveText('heute');
  await expect(card).not.toContainText('Ganzen Weg');
  await expect(card.locator('.wl', { hasText:'Erster Übungstag' })).toHaveCount(1);
  expect(await card.locator('.wg-t').count()).toBeGreaterThan(0);
  const fold = card.locator('.wf-b').first();
  await expect(fold).toHaveAttribute('aria-expanded', 'false');
  const before = await card.locator('.wl').count();
  await fold.click();
  await expect(card.locator('.wf-b').first()).toHaveAttribute('aria-expanded', 'true');
  expect(await card.locator('.wl').count()).toBeGreaterThan(before + 2);
  await card.locator('.wf-b').first().click();
  await expect(card.locator('.wf-b').first()).toHaveAttribute('aria-expanded', 'false');
  expect(await card.locator('.wl').count()).toBe(before);
});

test('Feste Wendung: Herkunft beim ersten Kontakt auch bei richtiger Antwort', async ({ page }) => {
  const db = freshDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date();
  const today = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.run = { date:today, lang:'sv', queue:[{ type:'cloze', id:'sv:' + hash('Det är ingen ko på isen, vi har fortfarande tid.') }], idx:0, ok:0, bad:0, res:[], missed:[] };
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=daily]');
  await page.fill('#answer', 'ko');
  await page.click('[data-a=check]');
  await expect(page.locator('.verdict')).toHaveText('Richtig');
  await expect(page.locator('.expl.orig')).toContainText('Herkunft: verkürzt aus „… så länge rumpan är i land“');
});
