// Rundenende: Ergebnisleiste, „Gleich nochmal üben“ ohne Einfluss auf den Wiederholungsplan, passende Knöpfe.
const { test, expect, APP, seed, richDB, answerWrong, stored } = require('./helpers');
test('Kurze Runde: Leiste je Aufgabe, Fehler gleich nochmal üben, Plan bleibt unverändert', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=quick]');
  for (let k = 0; k < 30 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  const n = 6; // Kurze Runde: sechs Aufgaben, zweite Versuche zählen nicht
  await expect(page.locator('.done-h')).toHaveText('Runde beendet');
  await expect(page.locator('.rstrip .rs')).toHaveCount(n);
  await expect(page.locator('.rstrip .rs-bad')).toHaveCount(n);
  await expect(page.locator('.actionbar [data-a=again]')).toBeVisible();
  await expect(page.locator('#tabs')).toBeHidden();
  const bar = await page.$eval('.actionbar', el => Math.round(innerHeight - el.getBoundingClientRect().bottom));
  expect(Math.abs(bar)).toBeLessThanOrEqual(1);
  const before = (await stored(page)).st;
  await page.click('[data-a=retry]');
  await expect(page.locator('.runbar')).toBeVisible();
  for (let k = 0; k < 30 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.done-h')).toHaveText('Nochmal geübt');
  await expect(page.locator('[data-a=again]')).toHaveCount(0);
  await page.waitForTimeout(300);
  expect((await stored(page)).st).toEqual(before);
});
test('Tagwerk: Stempel, Leiste, Lesetipps, Fertig und Weiter üben', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.done-h')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('svg.stamp')).toBeVisible();
  expect(await page.locator('.rstrip .rs').count()).toBeGreaterThan(3);
  await expect(page.locator('.readtip a')).toHaveCount(3);
  await expect(page.locator('.actionbar [data-a=tab][data-v=home]')).toHaveText('Fertig');
  await expect(page.locator('#tabs')).toBeHidden();
});
