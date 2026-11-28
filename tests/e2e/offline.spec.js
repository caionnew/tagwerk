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
  await expect(page.locator('#app')).toContainText('dagar i rad');
  await expect(page.locator('.notice')).toHaveCount(0);
  expect((await stored(page)).st).toEqual(before);
  await context.setOffline(false);
});
test('Übungsmenü: Online-Dienste sagen es, wenn keine Verbindung besteht, und wieder nicht, sobald sie zurück ist', async ({ page, context }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  const wiki = page.locator('.row[data-a=wiki] .rd');
  await expect(wiki).toHaveText('Ein ausgezeichneter Artikel, gern mit Bezug zum Land');
  await context.setOffline(true);
  await expect(wiki).toHaveText('Braucht eine Internetverbindung');
  await expect(page.locator('.row[data-a=tat] .rd')).toHaveText('Braucht eine Internetverbindung');
  await context.setOffline(false);
  await expect(wiki).toHaveText('Ein ausgezeichneter Artikel, gern mit Bezug zum Land');
});
