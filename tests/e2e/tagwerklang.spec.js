// Tagwerk je Sprache: Nach dem spanischen Tagwerk zeigt Schwedisch sein eigenes (freiwilliges) Tagwerk, und Spanisch steht als „heute erledigt“.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Spanisch erledigt, Schwedisch-Tagwerk zusätzlich startbar, Stand stimmt', async ({ page }) => {
  const db = richDB('sv'); const pad = n => String(n).padStart(2, '0'), t = new Date();
  const today = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.done[today] = true; db.doneLang = { [today]:{ es:true } };
  db.log[today] = { es:{ n:12, secs:300 } };
  db.settings.lang = 'sv'; db.settings.langMode = 'last';
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.today .eyebrow')).toContainText('Zusätzlich');
  await expect(page.locator('.today [data-a=daily]')).toContainText('Schwedisch-Tagwerk starten');
  await expect(page.locator('.otherlang')).toContainText('Spanisch');
  await expect(page.locator('.otherlang')).toContainText('Tagwerk heute erledigt');
  await page.click('[data-a=lang][data-l=es]');
  await expect(page.locator('.today')).toContainText('Tagwerk erledigt');
  await expect(page.locator('.otherlang [data-a=otherdaily]')).toContainText('Zusätzlich starten');
  await page.click('.otherlang [data-a=otherdaily]');
  await expect(page.locator('.runbar')).toBeVisible();
});
