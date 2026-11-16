// Rundenende: Ergebnisleiste, Fehlerliste ohne sofortige Übungsrunde, passende Knöpfe. Tagesbilanz auf „Heute“.
const { test, expect, APP, seed, richDB, answerWrong, stored } = require('./helpers');
test('Kurze Runde: Leiste je Aufgabe, Fehler aufgelistet, keine sofortige Übungsrunde', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=quick]');
  for (let k = 0; k < 30 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  const n = 6; // Kurze Runde: sechs Aufgaben, zweite Versuche zählen nicht
  await expect(page.locator('.done-h')).toHaveText('Runde beendet');
  await expect(page.locator('.rstrip .rs')).toHaveCount(n);
  await expect(page.locator('.rstrip .rs-bad')).toHaveCount(n);
  await expect(page.locator('.donebox h2.grp')).toHaveText('Noch nicht sicher');
  await expect(page.locator('[data-a=retry]')).toHaveCount(0);
  await expect(page.locator('.actionbar [data-a=again]')).toBeVisible();
  await expect(page.locator('#tabs')).toBeHidden();
  const bar = await page.$eval('.actionbar', el => Math.round(innerHeight - el.getBoundingClientRect().bottom));
  expect(Math.abs(bar)).toBeLessThanOrEqual(1);
});
test('Tagwerk: Stempel, Leiste, Lesetipps, Fertig und Weiter üben', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.done-h')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('svg.stamp')).toBeVisible();
  expect(await page.locator('.rstrip .rs').count()).toBeGreaterThan(3);
  await expect(page.locator('.readtip a')).toHaveCount(3);
  await expect(page.locator('.actionbar [data-a=tab][data-v=home]')).toHaveText('Fertig');
  await expect(page.locator('#tabs')).toBeHidden();
  await page.click('.actionbar [data-a=tab][data-v=home]');
  await expect(page.locator('.today .num')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('.today-kpis')).toContainText('Aufgaben');
});
test('Heute nach dem Tagwerk: Zeit, neue Sätze, Wiederholungen und Gefestigtes des Tages', async ({ page }) => {
  const db = richDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date(), ds = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.done[ds] = true; db.doneLang = { [ds]:{ sv:true } };
  db.log[ds] = { sv:{ n:31, ok:26, secs:742, fresh:5, rev:22, revOk:20, mat:2 } };
  await seed(page, db);
  await page.goto(APP);
  const tiles = page.locator('.today-kpis > div');
  await expect(tiles).toHaveCount(3);
  await expect(tiles.nth(0)).toContainText('12Minuten');
  await expect(tiles.nth(1)).toContainText('5neue Sätze');
  await expect(tiles.nth(2)).toContainText('20/22Wiederholungen gewusst');
  await expect(page.locator('.today-mat')).toHaveText('2 Sätze heute gefestigt.');
});
test('Heute: wenig geübt zeigt die Zahl der Aufgaben, ohne Übung keine Bilanz', async ({ page }) => {
  const db = richDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date(), ds = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.done[ds] = true; db.doneLang = { [ds]:{ sv:true, es:true } };
  db.log[ds] = { sv:{ n:4, secs:20 } };
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.today-kpis > div')).toHaveCount(1);
  await expect(page.locator('.today-kpis')).toContainText('4Aufgaben');
  await expect(page.locator('.today-mat')).toHaveCount(0);
  await page.click('[data-a=lang][data-l=es]');
  await expect(page.locator('.today .num')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('.today-kpis')).toHaveCount(0);
});
