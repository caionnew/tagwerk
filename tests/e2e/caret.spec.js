// Umbauen: Die Schreibmarke steht hinter dem vorgegebenen Satzanfang, nicht davor.
const { test, expect, APP, seed, freshDB } = require('./helpers');
const caret = page => page.$eval('#answer', el => ({ pos:el.selectionStart, len:el.value.length, val:el.value, focused:document.activeElement === el }));
for (const lang of ['sv', 'es']) {
  test(`Umbauen (${lang}): Marke am Ende, auch nach erneutem Antippen; Sonderzeichen hinten`, async ({ page }) => {
    await seed(page, freshDB(lang));
    await page.goto(APP);
    await page.click('[data-a=tab][data-v=extra]');
    await page.click(`[data-a=form][data-g=trans_${lang}]`);
    await expect(page.locator('textarea#answer')).toBeVisible();
    let c = await caret(page);
    expect(c.len).toBeGreaterThan(0);
    expect(c.focused).toBe(true);
    expect(c.pos).toBe(c.len);
    // Feld verlassen und ganz links wieder antippen: Android würde die Marke dorthin setzen
    await page.evaluate(() => document.activeElement.blur());
    await page.click('#answer', { position:{ x:6, y:14 } });
    await page.waitForTimeout(250);
    c = await caret(page);
    expect(c.pos).toBe(c.len);
    const ch = await page.getAttribute('[data-a=char] >> nth=0', 'data-c');
    const before = c.val;
    await page.click('[data-a=char] >> nth=0');
    c = await caret(page);
    expect(c.val).toBe(before + ch);
  });
}
