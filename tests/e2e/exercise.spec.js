// Übungen: Tagwerk vollständig durchlaufen, Wortkästchen bleiben beim Antippen an ihrem Platz.
const { test, expect, APP, seed, freshDB, answerWrong, stored } = require('./helpers');
test('Tagwerk von Anfang bis Ende, Ergebnis zählt nur den ersten Versuch', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 60 && await page.$('.runbar'); k++) {
    await answerWrong(page);
    await expect(page.locator('#fb')).toBeVisible();
    await page.click('[data-a=next]');
  }
  await expect(page.locator('#app')).toContainText('auf Anhieb richtig');
  const db = await stored(page);
  expect(Object.keys(db.st).length).toBeGreaterThan(0);
  expect(Object.values(db.log).length).toBe(1);
});
test('Wortkästchen: Antippen verschiebt die übrigen Kästchen nicht', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 15 && !(await page.$('.tiles-pool')); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  test.skip(!(await page.$('.tiles-pool')), 'keine Wortkästchen-Aufgabe in dieser Runde');
  const pos = () => page.$$eval('.tiles-pool .tile', els => els.map(e => { const r = e.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)}`; }));
  const before = await pos();
  await page.click('.tiles-pool button.tile:not(.ghost) >> nth=0');
  await page.click('.tiles-pool button.tile:not(.ghost) >> nth=0');
  expect(await pos()).toEqual(before);
});
