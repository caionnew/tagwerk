// Fortschrittsleiste: Ergebnis je Aufgabe in den Farben der Auswertung, schon beim Prüfen; zweite Versuche als eigene Gruppe.
const { test, expect, APP, seed, freshDB, answerWrong, stored } = require('./helpers');
const segClass = (page, i) => page.locator('.progress .seg').nth(i).getAttribute('class');
test('Fortschrittsleiste: falsch färbt sofort, zweiter Versuch hängt sich an, Farben bleiben nach Pause', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  await expect(page.locator('.progress')).toHaveAttribute('role', 'img');
  // Bis eine Satzaufgabe falsch beantwortet ist (die kommt als zweiter Versuch wieder)
  let i = -1;
  for (let k = 0; k < 20 && i < 0; k++) {
    const idx = await page.$$eval('.progress .seg', els => els.findIndex(e => e.classList.contains('s-cur')));
    expect(idx).toBeGreaterThanOrEqual(0);
    await answerWrong(page);
    // Das Feld der Aufgabe zeigt das Ergebnis schon vor „Weiter“
    expect(await segClass(page, idx)).toMatch(/s-(bad|near)/);
    const before = await page.locator('.progress .seg').count();
    await page.click('[data-a=next]');
    if (await page.locator('.progress .seg').count() > before) i = idx;
  }
  expect(i).toBeGreaterThanOrEqual(0);
  expect(await segClass(page, i)).toMatch(/s-bad/);
  await expect(page.locator('.progress .seg.re1')).toHaveCount(1);
  await expect(page.locator('.progress')).toHaveAttribute('aria-label', /zweiter Versuch folgt/);
  // Pause und Fortsetzen: die Farben kommen aus dem gespeicherten Stand
  await page.click('[data-a=quit]');
  await expect.poll(async () => { const db = await stored(page); return db.run && db.run.queue[i].got; }).toBe('bad');
  await page.click('[data-a=daily]');
  expect(await segClass(page, i)).toMatch(/s-bad/);
  await expect(page.locator('.progress .seg.re1')).toHaveCount(1);
});
