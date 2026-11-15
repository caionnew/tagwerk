// Land & Leute: Karten an den passenden Karten, Beispielsatz zum Üben übernehmen.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
for (const [lang, maps] of [['es', 8], ['sv', 3]]) {
  test(`${lang}: ${maps} Karten mit Beschriftung für Screenreader`, async ({ page }) => {
    await seed(page, freshDB(lang));
    await page.goto(APP);
    await page.click('[data-a=tab][data-v=extra]');
    await page.click('[data-a=ref][data-r=kultur]');
    await expect(page.locator('.kcard svg.map')).toHaveCount(maps);
    const labels = await page.$$eval('.kcard svg.map', els => els.map(e => e.getAttribute('aria-label')));
    labels.forEach(l => expect(l).toMatch(/^Karte/));
  });
}
test('Satz übernehmen: landet in den eigenen Sätzen, Karte bestätigt', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=ref][data-r=kultur]');
  await page.click('.kcard [data-a=kultadd] >> nth=0');
  await expect(page.locator('.kcard .kown').first()).toBeVisible();
  await page.waitForTimeout(300);
  const own = (await stored(page)).own.sv;
  expect(own.length).toBe(1);
  expect(own[0].de).not.toMatch(/\(/);
});
