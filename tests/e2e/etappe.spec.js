// Etappe am Rundenende (seit 24.63): Siegel, Ausschnitt aus „Dein Weg“ direkt unter dem Titel, Sprung zu „Dein Weg“;
// Monatsbilanz beim ersten Tagwerk eines Monats.
const { test, expect, APP, seed, richDB, answerWrong } = require('./helpers');
const pad = n => String(n).padStart(2, '0');
const ds = k => { const t = new Date(), d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
test('Tagwerk mit Etappe: Siegel, Ausschnitt unter dem Titel, Link zu „Dein Weg“', async ({ page }) => {
  const db = richDB('sv');
  // Gestern auf 499 Aufgaben auffüllen: die erste Aufgabe heute erreicht 500
  const sum = Object.values(db.log).reduce((a, x) => a + ((x.sv && x.sv.n) || 0), 0);
  db.log[ds(1)] = db.log[ds(1)] || { sv:{ n:0, secs:0 } }; db.log[ds(1)].sv.n += 499 - sum;
  // Keine gefestigten Sätze, damit die Aufgaben-Etappe die einzige dieser Runde ist
  Object.values(db.st).forEach(x => { x.ivl = 6; });
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.done-h')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('svg.stamp.seal')).toBeVisible();
  // Direkt unter dem Titel
  expect(await page.evaluate(() => document.querySelector('.done-h').nextElementSibling.className)).toBe('mile');
  await expect(page.locator('.mile .mr.now')).toContainText('500 Aufgaben');
  await expect(page.locator('.mile .mr.done')).toContainText('100 Aufgaben');
  await expect(page.locator('.mile .mr.next')).toContainText('1.000 Aufgaben');
  await page.click('.mile [data-a=toway]');
  await expect(page.locator('#way')).toBeInViewport();
  await expect(page.locator('.wrail .wl', { hasText:'500 Aufgaben' })).toHaveCount(1);
});
test('Erstes Tagwerk im Monat: Vormonat als Bilanz mit Kalender, danach nicht noch einmal', async ({ page }) => {
  const db = richDB('sv'), ym = ds(0).slice(0, 7);
  Object.keys(db.done).forEach(d => { if (d.slice(0, 7) === ym) delete db.done[d]; });
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.month')).toBeVisible();
  await expect(page.locator('.month .mile-eb')).toContainText('Dein ');
  expect(await page.locator('.month .mcal rect').count()).toBeGreaterThanOrEqual(28);
  await expect(page.locator('.month .month-kpis b')).toHaveCount(3);
  // Neu gezeichnet bleibt sie, ein zweites Tagwerk (andere Sprache) zeigt sie nicht mehr
  await page.click('.actionbar [data-a=tab][data-v=home]');
  await expect(page.locator('.recap')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tagwerk-offline-v1')).used.monthShown)).toBe(ym);
});
