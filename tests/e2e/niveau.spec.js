// Niveau in den Einstellungen: gespeichert, beschrieben, Lesetexte danach sortiert.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
test('Fortgeschritten wählen: gespeichert, schwerste Lesetexte (C1) zuerst, Modi richtig benannt', async ({ page }) => {
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=settings] >> nth=0');
  await page.click('[data-a=niveau][data-v=fort]');
  await expect(page.locator('[data-a=niveau][data-v=fort]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#app')).toContainText('Lange und anspruchsvolle Sätze zuerst');
  await page.waitForTimeout(300);
  expect((await stored(page)).settings.niveau).toBe('fort');
  await page.click('.backbar [data-a=tab]');
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  // Einzeltexte nach Niveau; die Karten der Reihen stehen darüber
  await expect(page.locator('.tcard:not(.scard) .tag >> nth=1')).toHaveText('C1');
  await expect(page.locator('[data-a=tdefmode][data-v=read]')).toHaveText('Lesen und hören');
  await page.click('.tcard:not(.scard) >> nth=0');
  await expect(page.locator('.pbtn.play.wide')).toContainText('Vorlesen');
});

test('Schwerpunkt der Woche auf „Heute“, wechselbar', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  const line = page.locator('.focusline b');
  await expect(line).toBeVisible();
  const before = await line.textContent();
  await page.click('[data-a=focusnext]');
  await expect(line).not.toHaveText(before);
});
