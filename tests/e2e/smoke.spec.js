// Grundfunktion: App startet, alle Hauptseiten öffnen sich, Fortschritt hat drei Reiter.
const { test, expect, APP, seed, freshDB } = require('./helpers');
test('Erster Start: Tagesplan, Übungsseite, Fortschritt und Einstellungen', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await expect(page.locator('[data-a=daily]')).toBeVisible();
  await page.click('[data-a=tab][data-v=extra]');
  for (const g of ['Kurz zwischendurch', 'Grammatik', 'Hören und Sprechen', 'Schreiben und Sammeln', 'Nachschlagen']) await expect(page.locator('h2.grp', { hasText:g })).toBeVisible();
  await page.click('[data-a=tab][data-v=progress]');
  await expect(page.locator('.ptabs button')).toHaveCount(3);
  await page.click('[data-a=ptab][data-t=es]');
  await expect(page.locator('.ptabs [aria-selected=true]')).toHaveText('Spanisch');
  await page.click('[data-a=settings]');
  await expect(page.locator('.backbar')).toContainText('Einstellungen');
});
test('Spanisch: Sprachwechsel auf der Startseite', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('.langseg [aria-checked=false]');
  await expect(page.locator('.langseg [aria-checked=true]')).toContainText('Español');
});
