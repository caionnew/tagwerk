// Kleine Korrekturen: Wochenpunkt bleibt in der Reihe; Grundform bei „Fortgeschritten“ erst auf Tipp.
const { test, expect, APP, seed, freshDB, richDB } = require('./helpers');
test('Wochenstreifen sitzt im Kopf von „Heute“, der Punkt für heute bleibt dort', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const r = await page.evaluate(() => { const el = document.querySelector('.weekstrip .wk.now'); el.classList.add('fillnow'); return { pos:getComputedStyle(el).position, inHeader:!!el.closest('.hello') }; });
  expect(r.pos).not.toBe('fixed');
  expect(r.inHeader).toBe(true);
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
test('Wochenstreifen färbt nach Sprache des Tagwerks, beide geteilt', async ({ page }) => {
  const db = richDB('sv'); const pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  db.done[ds(1)] = true; db.done[ds(2)] = true; db.doneLang = { [ds(1)]:{ es:true }, [ds(2)]:{ sv:true, es:true } };
  db.log[ds(1)] = { es:{ n:12 } }; db.log[ds(2)] = { sv:{ n:12 }, es:{ n:12 } };
  await seed(page, db);
  await page.goto(APP);
  const cells = page.locator('.weekstrip .wk');
  await expect(cells).toHaveCount(7);
  await expect(cells.nth(5)).toHaveClass(/\bde\b/);
  await expect(cells.nth(4)).toHaveClass(/\bdb\b/);
  await expect(cells.nth(6)).toHaveClass(/\bnow\b/);
});
