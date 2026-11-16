// Fortschritt: Übungstage nach Sprache und Einsatz, „Dein Weg“ als Gleisplan mit Spuren je Sprache.
const { test, expect, APP, seed, richDB } = require('./helpers');
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
