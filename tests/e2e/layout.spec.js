// Aufgabe oben, Antwort unten: Bei jeder Übungsart sitzt die Antwortzone in der unteren Bildhälfte, höchstens 30 % der
// Bildhöhe unter der Aufgabe (auf kleinen Handys direkt über der Leiste); nach dem Antworten steht die Rückmeldung
// zwischen Antwort und „Weiter“. Keine Übung schaltet von selbst weiter.
const { test, expect, APP, seed, freshDB, richDB, answerWrong } = require('./helpers');
const gap = page => page.evaluate(() => {
  const a = document.querySelector('.ex-a'), sp = document.querySelector('.ex-sp'), bar = document.querySelector('.actionbar');
  if (!a || !sp || !bar) return null;
  const ar = a.getBoundingClientRect(), toBar = Math.round(bar.getBoundingClientRect().top - ar.bottom);
  return { toBar, spacer:Math.round(sp.getBoundingClientRect().height), max:Math.round(innerHeight * 0.3), lowHalf:ar.bottom >= innerHeight * 0.45 };
});
test('Antwortzone über der Leiste bei allen Übungsarten eines Tagwerks', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  const seen = new Set();
  for (let k = 0; k < 40 && await page.$('.runbar'); k++) {
    const kind = await page.evaluate(() => (document.querySelector('.tiles-pool') && 'tiles') || (document.querySelector('.spot') && 'spot') || (document.querySelector('.genus-opts') && 'genus') || (document.querySelector('.cloze') && 'cloze') || (document.querySelector('textarea#answer') && 'text') || (document.querySelector('input#answer') && 'input') || 'andere');
    const g = await gap(page);
    expect(g, kind).not.toBeNull();
    expect(g.spacer, `${kind}: Abstand Aufgabe–Antwort`).toBeLessThanOrEqual(g.max + 1);
    expect(g.lowHalf, `${kind}: Antwort in der unteren Bildhälfte`).toBe(true);
    expect(g.toBar <= 24 || g.spacer >= g.max - 1, `${kind}: entweder direkt über der Leiste oder mit vollem Abstand`).toBe(true);
    seen.add(kind);
    await answerWrong(page);
    await expect(page.locator('#fb')).toBeVisible();
    const fb = await page.evaluate(() => { const f = document.querySelector('#fb').getBoundingClientRect(), a = document.querySelector('.ex-a').getBoundingClientRect(); return f.top >= a.bottom - 1; });
    expect(fb, `${kind}: Rückmeldung unter der Antwort`).toBe(true);
    await page.click('[data-a=next]');
  }
  expect(seen.size).toBeGreaterThanOrEqual(3);
});
test('Genus: auch nach richtiger Antwort erst mit „Weiter“, wie überall', async ({ page }) => {
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=form][data-g=genus_es]');
  for (const v of ['el', 'la']) {
    if (!(await page.$('[data-a=genuspick]:not([disabled])'))) break;
    await page.click(`[data-a=genuspick][data-v=${v}]`);
  }
  await page.waitForTimeout(1200);
  await expect(page.locator('#fb')).toBeVisible();
  await expect(page.locator('[data-a=next]')).toBeVisible();
});
