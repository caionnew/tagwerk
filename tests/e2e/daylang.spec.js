// Sprache des Tages: Die andere Sprache steht mit Stand auf „Heute“ und ist mit einem Tipp erreichbar.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Andere Sprache sichtbar, Wechsel gilt für den Tag', async ({ page }) => {
  const db = richDB('sv'); const keys = Object.keys(db.log).sort();
  db.log[keys[keys.length - 3]] = Object.assign({}, db.log[keys[keys.length - 3]], { es:{ n:12, secs:300 } });
  await seed(page, db);
  await page.goto(APP);
  const box = page.locator('.otherlang');
  await expect(box).toBeVisible();
  const other = await box.locator('[data-a=lang]').getAttribute('data-l');
  await box.locator('[data-a=lang]').click();
  await expect(page.locator(`.otherlang [data-a=lang]`)).not.toHaveAttribute('data-l', other);
  await page.reload();
  await expect(page.locator('.otherlang [data-a=lang]')).not.toHaveAttribute('data-l', other);
});
