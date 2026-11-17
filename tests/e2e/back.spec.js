// Zurück-Geste des Handys (im Test: Zurück des Browsers): innerhalb der App einen Schritt zurück, erst auf „Heute“ hinaus.
const { test, expect, APP, seed, richDB } = require('./helpers');
const back = page => page.evaluate(() => history.back());
test('Zurück führt Schritt für Schritt durch die App: Text, Liste, Üben, Heute', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen][data-id=vasa]');
  await expect(page.locator('.rtitle')).toHaveText('Regalskeppet Vasa');
  await back(page);
  await expect(page.locator('[data-a=textopen][data-id=vasa]')).toBeVisible();
  await back(page);
  await expect(page.locator('.bottomnav [data-v=extra]')).toHaveAttribute('aria-current', 'page');
  await back(page);
  await expect(page.locator('.bottomnav [data-v=home]')).toHaveAttribute('aria-current', 'page');
  expect(page.url()).toBe(APP);
});
test('Zurück schließt ein offenes Fenster, die Ansicht bleibt', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('.find [data-a=lookup] >> nth=0');
  await expect(page.locator('.pop')).toBeVisible();
  await back(page);
  await expect(page.locator('.pop')).toHaveCount(0);
  await expect(page.locator('.today')).toBeVisible();
  expect(page.url()).toBe(APP);
});
test('Zurück im Tagwerk pausiert es; danach geht es auf „Heute“ weiter, wo man war', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('.today [data-a=daily]');
  await expect(page.locator('.runbar')).toBeVisible();
  await back(page);
  await expect(page.locator('.today')).toContainText('Tagwerk läuft');
  await page.click('.today [data-a=daily]');
  await expect(page.locator('.runbar')).toBeVisible();
});
test('Auf „Heute“ verlässt Zurück die App wie gewohnt, auch nach einem Ausflug in die App', async ({ page }) => {
  await seed(page, richDB('sv'));
  // Vorherige Seite im Verlauf: irgendeine andere Adresse (wie die leere Seite vor der App in Firefox)
  const before = APP + 'vorher.html';
  await page.goto(before);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  await page.click('[data-a=tab][data-v=home]');
  await back(page);
  await expect.poll(() => page.url()).toBe(before);
});
