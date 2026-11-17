// Land & Leute: Karten an den passenden Karten, Filter nach Kategorie, Beispielsatz ins Tagwerk, Lesetexte mit Rückweg.
// Grammatik-Begriffe: Liste und Erklärung je Sprache.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
for (const [lang, maps] of [['es', 11], ['sv', 4]]) {
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
  await expect(page.locator('.kcard .kadd.on').first()).toHaveText('✓ Im Tagwerk');
  await page.waitForTimeout(300);
  const own = (await stored(page)).own.sv;
  expect(own.length).toBe(1);
  expect(own[0].de).not.toMatch(/\(/);
});
test('Filter: nur eine Kategorie, „Alle“ zeigt wieder alles mit Überschriften', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=ref][data-r=kultur]');
  const all = await page.locator('.kcard').count();
  await page.click('[data-a=kultcat][data-c=sprache]');
  await expect(page.locator('[data-a=kultcat][data-c=sprache]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('.kcard')).toHaveCount(3);
  await expect(page.locator('h2.grp')).toHaveCount(0);
  await page.click('[data-a=kultcat][data-c=alle]');
  await expect(page.locator('.kcard')).toHaveCount(all);
  await expect(page.locator('h2.grp').first()).toHaveText('Sprache');
});
test('Lesetext aus einer Karte: zurück führt nach Land & Leute, der Filter bleibt', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=ref][data-r=kultur]');
  await page.click('[data-a=kultcat][data-c=gesellschaft]');
  await page.click('.kcard [data-a=textopen][data-id=allemansratten]');
  await expect(page.locator('.reader')).toBeVisible();
  await page.click('.backbar .x');
  await expect(page.locator('h1.vt')).toHaveText('Land & Leute');
  await expect(page.locator('[data-a=kultcat][data-c=gesellschaft]')).toHaveAttribute('aria-checked', 'true');
});
for (const [lang, has, not, ex] of [['sv', 'Supinum', 'Subjuntivo', 'Jag har aldrig sett'], ['es', 'Subjuntivo', 'Supinum', 'He comido']]) {
  test(`${lang}: Grammatik-Begriffe nur für die Sprache, Perfekt mit eigenem Beispiel`, async ({ page }) => {
    await seed(page, freshDB(lang));
    await page.goto(APP);
    await page.click('[data-a=tab][data-v=extra]');
    await page.click('[data-a=ref][data-r=terms]');
    await expect(page.locator('.rows .rt', { hasText:has })).toHaveCount(1);
    await expect(page.locator('.rows .rt', { hasText:not })).toHaveCount(0);
    await page.click('[data-a=term][data-k=perfekt]');
    await expect(page.locator('.pop .termex')).toContainText(ex);
  });
}
