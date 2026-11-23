// „Meine ist auch richtig“ nur, wo es mehrere richtige Fassungen geben kann. Lücken mit genau einer Lösung (auch innerhalb gemischter Übungen wie np) zeigen ihn nie.
const { test, expect, APP, seed, freshDB, answerWrong } = require('./helpers');
const cases = [
  ['es', 'serestar', false], ['es', 'porpara', false], ['es', 'conj', false],
  ['sv', 'np', true], ['sv', 'tempus', true], ['sv', 'inte', true],
  ['sv', 'trans_sv', true], ['sv', 'spot_sv', false], ['sv', 'genus_sv', false],
  ['es', 'det_es', true], ['sv', 'verbind_sv', false], ['es', 'prep_es', false]
];
for (const [lang, gen, shown] of cases) {
  test(`${gen}: Knopf ${shown ? 'sichtbar' : 'nicht sichtbar'}`, async ({ page }) => {
    await seed(page, freshDB(lang));
    await page.goto(APP);
    await page.click('[data-a=tab][data-v=extra]');
    if (await page.$(`[data-a=form][data-g=${gen}]`)) await page.click(`[data-a=form][data-g=${gen}]`);
    else { await page.click('[data-a=forms]'); await page.click(`[data-a=gengo][data-g=${gen}]`); }
    for (let k = 0; k < 6; k++) {
      const gap = !!(await page.$('.cloze'));
      await answerWrong(page);
      if (await page.$('.fb-bad')) await expect(page.locator('[data-a=accept]')).toHaveCount(shown && !gap ? 1 : 0);
      await page.click('[data-a=next]');
    }
  });
}
test('Uhrzeiten: Knopf nur beim Schreiben in Worten', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=form][data-g=time_sv]');
  for (let k = 0; k < 10 && await page.$('.runbar'); k++) {
    const mode = await page.$eval('#answer', e => e.getAttribute('inputmode') || 'text');
    await page.fill('#answer', 'zzz'); await page.click('[data-a=check]');
    await expect(page.locator('[data-a=accept]')).toHaveCount(mode === 'text' ? 1 : 0);
    await page.click('[data-a=next]');
  }
});
