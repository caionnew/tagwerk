// Nachschlagen: Wörterbuch mit Beispielen aus eigenen Sätzen, Fachbegriffe, Themenblatt über der Übung.
const { test, expect, APP, seed, freshDB, answerWrong } = require('./helpers');
test('Wörterbuch zeigt Grundform und macht Fachbegriffe antippbar', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=ref][data-r=friends]');
  await page.click('[data-a=lookup][data-w=bli]');
  await expect(page.locator('.pop')).toContainText('werden');
  await page.click('.pop [data-a=popclose].ghost');
  await page.click('.backbar [data-a=tab]');
  await page.click('[data-a=ref][data-r=topics]');
  await page.click('[data-a=topic][data-t=tempus]');
  await page.click('.pop .term >> text=Supinum');
  await expect(page.locator('.pop')).toContainText('nach „har“');
});
test('Themenblatt öffnet sich über der laufenden Übung', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=pickTopic]');
  await page.click('[data-a=trapgo][data-t=tempus]');
  for (let k = 0; k < 8 && !(await page.$('#fb [data-a=topic]')); k++) { await answerWrong(page); if (await page.$('#fb [data-a=topic]')) break; await page.click('[data-a=next]'); }
  await page.click('#fb [data-a=topic]');
  await expect(page.locator('.pop.tall')).toBeVisible();
  await expect(page.locator('.runbar')).toBeVisible();
  await expect(page.locator('.pop [data-a=trapgo]')).toHaveCount(0);
});
