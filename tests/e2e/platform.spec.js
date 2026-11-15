// Plattform: Teilen an die App, Schnellzugriff, reduzierte Bewegung.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Geteilter Text öffnet „Eigenen Satz eintragen“ und bereinigt die Adresse', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP + '?title=&text=' + encodeURIComponent('Regeringen vill att fler ska åka tåg. https://8sidor.se/x'));
  await expect(page.locator('.backbar')).toContainText('Eigenen Satz eintragen');
  await expect(page.locator('#ownT')).toHaveValue('Regeringen vill att fler ska åka tåg.');
  expect(await page.evaluate(() => location.search)).toBe('');
});
test('Schnellzugriff ?go=quick startet die Kurze Runde', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP + '?go=quick');
  await expect(page.locator('.runbar')).toBeVisible();
});
test.describe('reduzierte Bewegung', () => {
  test.use({ reducedMotion:'reduce' });
  test('Rückmeldung erscheint ohne Animation', async ({ page }) => {
    await seed(page, richDB('sv'));
    await page.goto(APP);
    await page.click('[data-a=daily]');
    if (await page.$('.tiles-pool')) { while (await page.$('.tiles-pool .tile:not(.ghost)')) await page.click('.tiles-pool .tile:not(.ghost)'); } else await page.fill('#answer', 'x');
    await page.click('[data-a=check]');
    expect(await page.$eval('#fb', e => getComputedStyle(e).animationName)).toBe('none');
  });
});
