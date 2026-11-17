// Sprache des Tages: Vor dem Tagwerk steht nur die Sprache des Tages auf „Heute“ (die andere wechselt man oben), die Wahl gilt für den Tag.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Vor dem Tagwerk kein zweites Startangebot; Wechsel über die Sprachwahl gilt für den Tag', async ({ page }) => {
  const db = richDB('sv'); const keys = Object.keys(db.log).sort();
  db.log[keys[keys.length - 3]] = Object.assign({}, db.log[keys[keys.length - 3]], { es:{ n:12, secs:300 } });
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.today [data-a=daily]')).toBeVisible();
  await expect(page.locator('[data-a=otherdaily]')).toHaveCount(0);
  const cur = await page.locator('.langseg [aria-checked=true]').getAttribute('data-l'), other = cur === 'sv' ? 'es' : 'sv', name = other === 'sv' ? 'Schwedisch' : 'Spanisch';
  await page.click(`.langseg [data-a=lang][data-l=${other}]`);
  await expect(page.locator('.today [data-a=daily]')).toContainText(`${name}-Tagwerk starten`);
  await page.click('.today [data-a=daily]');
  await expect(page.locator('.runbar')).toBeVisible();
  await page.click('[data-a=quit]');
  await expect(page.locator(`.langseg [data-a=lang][data-l=${other}]`)).toHaveAttribute('aria-checked', 'true');
  // Die Wahl gilt für heute, auch nach einem Neustart der App
  await page.waitForFunction(o => { const d = JSON.parse(localStorage.getItem('tagwerk-offline-v1') || '{}'); return d.dayLang && d.dayLang.manual && d.dayLang.l === o; }, other);
  await page.reload();
  await expect(page.locator(`.langseg [data-a=lang][data-l=${other}]`)).toHaveAttribute('aria-checked', 'true');
});
