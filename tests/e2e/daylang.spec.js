// Sprache des Tages: Die andere Sprache steht mit Stand auf „Heute“ und ist mit einem Tipp erreichbar.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Andere Sprache sichtbar, ihr Tagwerk startet direkt, die Wahl gilt für den Tag', async ({ page }) => {
  const db = richDB('sv'); const keys = Object.keys(db.log).sort();
  db.log[keys[keys.length - 3]] = Object.assign({}, db.log[keys[keys.length - 3]], { es:{ n:12, secs:300 } });
  await seed(page, db);
  await page.goto(APP);
  const btn = page.locator('.otherlang [data-a=otherdaily]');
  await expect(btn).toBeVisible();
  const other = await btn.getAttribute('data-l');
  await btn.click();
  await expect(page.locator('.runbar')).toBeVisible();
  await page.click('[data-a=quit]');
  await expect(page.locator(`.langseg [data-a=lang][data-l=${other}]`)).toHaveAttribute('aria-checked', 'true');
  await page.waitForFunction(() => { const d = JSON.parse(localStorage.getItem('tagwerk-offline-v1') || '{}'); return d.dayLang && d.dayLang.manual; });
  await page.reload();
  await expect(page.locator(`.otherlang [data-l=${other}]`)).toHaveCount(0);
});
