// Anki: Export einlesen und übernehmen; Wort aus dem Wörterbuch an Anki teilen.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
test('Anki-Export einlesen, Vorschau, übernehmen', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=settings] >> nth=0');
  const txt = '#separator:tab\n#html:true\nJag vet inte varför han aldrig ringer.\tIch weiß nicht, warum er nie anruft.\nVi ska åka till Malmö i morgon.\tWir fahren morgen nach Malmö.\n';
  await page.setInputFiles('input[data-a=ankifile]', { name:'Rivstart.txt', mimeType:'text/plain', buffer:Buffer.from(txt) });
  await expect(page.locator('[data-a=ankiok]')).toContainText('2 übernehmen');
  await page.click('[data-a=ankiok]');
  await expect(page.locator('.notice')).toContainText('2 Sätze übernommen');
  await page.waitForTimeout(300);
  const db = await stored(page);
  expect(db.tat.sv.filter(x => x.src === 'anki').length).toBe(2);
});
test('Wort an Anki teilen: Vorderseite Wort, Rückseite Bedeutung', async ({ page }) => {
  await page.addInitScript(() => { window.__shared = null; navigator.share = d => { window.__shared = d; return Promise.resolve(); }; });
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen] >> nth=0');
  await page.locator('.reader [data-a=lookup]').first().click();
  await page.click('[data-a=popanki]');
  const d = await page.evaluate(() => window.__shared);
  expect(d.title.length).toBeGreaterThan(0);
  expect(d.text.length).toBeGreaterThan(0);
});
