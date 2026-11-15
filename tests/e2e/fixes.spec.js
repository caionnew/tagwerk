// Kleine Korrekturen: Wochenpunkt bleibt in der Reihe; Grundform bei „Fortgeschritten“ erst auf Tipp.
const { test, expect, APP, seed, freshDB, richDB } = require('./helpers');
test('Gefüllter Wochenpunkt bleibt in der Wochenreihe', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const pos = await page.evaluate(() => { const el = document.querySelector('.wd.now'); el.classList.add('fillnow'); return getComputedStyle(el).position; });
  expect(pos).not.toBe('fixed');
});
test('Fortgeschritten: Grundform verdeckt, Tipp zeigt sie, Eingabe bleibt', async ({ page }) => {
  const db = freshDB('es'); db.settings.niveau = 'fort';
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  if (await page.$('[data-a=form][data-g=textgap_es]')) await page.click('[data-a=form][data-g=textgap_es]');
  else { await page.click('[data-a=forms]'); await page.click('[data-a=gengo][data-g=textgap_es]'); }
  let checked = false;
  for (let k = 0; k < 8 && !checked; k++) {
    const tip = page.locator('[data-a=showtip]');
    if (await tip.count()) {
      await expect(page.locator('.kicker')).not.toContainText('Grundform:');
      await page.fill('#answer', 'abc');
      await tip.click();
      await expect(page.locator('.kicker .hintw')).toContainText('Grundform');
      await expect(page.locator('#answer')).toHaveValue('abc');
      checked = true;
    } else { await page.fill('#answer', 'zzz'); await page.click('[data-a=check]'); await page.click('[data-a=next]'); }
  }
  expect(checked).toBe(true);
});
test('Lücke nach dem Prüfen: falsch = durchgestrichen + Lösung, kein Eingabefeld mehr, kein Wort doppelt', async ({ page }) => {
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  if (await page.$('[data-a=form][data-g=prep_es]')) await page.click('[data-a=form][data-g=prep_es]');
  else { await page.click('[data-a=forms]'); await page.click('[data-a=gengo][data-g=prep_es]'); }
  await page.fill('#answer', 'zzz'); await page.click('[data-a=check]');
  await expect(page.locator('.cloze s.gapdone.bad')).toHaveText('zzz');
  await expect(page.locator('.cloze .gapdone.fix')).toHaveCount(1);
  await expect(page.locator('#answer')).toHaveCount(0);
  const want = await page.locator('.cloze .gapdone.fix').textContent();
  expect(await page.locator('.cloze').textContent()).not.toContain(want + ' ' + want);
});
