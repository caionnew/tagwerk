// Tagwerk je Sprache: Nach dem spanischen Tagwerk zeigt Schwedisch sein eigenes (freiwilliges) Tagwerk; im erledigten Spanisch steht Schwedisch als Wahl für „Wenn du noch Zeit hast“.
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
  await expect(page.locator('.today')).toContainText('Spanisch');
  // Spanisch ist erledigt: kein Angebot, es noch einmal zu starten
  await expect(page.locator('[data-a=otherdaily]')).toHaveCount(0);
  await page.click('[data-a=lang][data-l=es]');
  await expect(page.locator('.today')).toContainText('Tagwerk erledigt');
  // Nach dem Tagwerk: die andere Sprache als erste Wahl unter „Wenn du noch Zeit hast“, mit Dauer und Inhalt
  const row = page.locator('.today .choices .row').first();
  await expect(row).toHaveAttribute('data-a', 'otherdaily');
  await expect(row.locator('.rt')).toHaveText('Schwedisch-Tagwerk zusätzlich');
  await expect(row.locator('.rd')).toContainText(/^Etwa \d+ Minuten/);
  await row.click();
  await expect(page.locator('.runbar')).toBeVisible();
});
