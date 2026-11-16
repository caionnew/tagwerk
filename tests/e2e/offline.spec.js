// Offline-Start wie auf dem Handy: Der Service Worker hält die App vor, ohne Netz startet sie mit dem Lernstand.
const { test, expect, APP, seed, richDB, stored } = require('./helpers');
test('Nach dem ersten Besuch startet die App ohne Netz, Lernstand und Serie bleiben', async ({ page, context }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await expect(page.locator('.today')).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller);
  const before = (await stored(page)).st;
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.today')).toBeVisible();
  await expect(page.locator('#app')).toContainText('in Folge');
  await expect(page.locator('.notice')).toHaveCount(0);
  expect((await stored(page)).st).toEqual(before);
  await context.setOffline(false);
});
