// Kleine Korrekturen: Wochenpunkt bleibt in der Reihe; Grundform bei „Fortgeschritten“ erst auf Tipp.
const { test, expect, APP, seed, freshDB, richDB } = require('./helpers');
test('Wochenstreifen sitzt im Kopf von „Heute“, der Punkt für heute bleibt dort', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const r = await page.evaluate(() => { const el = document.querySelector('.weekstrip .wk.now'); el.classList.add('fillnow'); return { pos:getComputedStyle(el).position, inHeader:!!el.closest('.hello') }; });
  expect(r.pos).not.toBe('fixed');
  expect(r.inHeader).toBe(true);
});
test('Fortgeschritten: Grundform verdeckt, Tipp zeigt sie, Eingabe bleibt; Lesetext-Lücke mit Bedeutung und Anfangsbuchstabe', async ({ page }) => {
  const db = freshDB('es'); db.settings.niveau = 'fort'; db.used.texts = { 'es:campoamor':{ best:3, n:1, last:'2026-01-01' } };
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  if (await page.$('[data-a=form][data-g=textgap_es]')) await page.click('[data-a=form][data-g=textgap_es]');
  else { await page.click('[data-a=forms]'); await page.click('[data-a=gengo][data-g=textgap_es]'); }
  let checked = false;
  for (let k = 0; k < 8 && !checked; k++) {
    const tip = page.locator('[data-a=showtip]');
    await expect(page.locator('.ex .de')).not.toBeEmpty();
    expect(await page.locator('#answer').getAttribute('placeholder')).toMatch(/^[a-zà-ÿ]…$/);
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
  // Ganze Wörter vergleichen: eine Textsuche nach „a a“ schlüge bei „Me comprometo a ayudarte“ an
  const want = (await page.locator('.cloze .gapdone.fix').textContent()).trim();
  const words = (await page.locator('.cloze').textContent()).split(/\s+/).map(w => w.replace(/[.,;:!?¿¡]/g, ''));
  expect(words.some((w, i) => w === want && words[i + 1] === want), words.join(' ')).toBe(false);
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
test('„seit“-Aufgabe: bei falscher Antwort die genaue Erklärung (Deutsch Präsens, Schwedisch Perfekt mit i)', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  if (await page.$('[data-a=form][data-g=tempus]')) await page.click('[data-a=form][data-g=tempus]');
  else { await page.click('[data-a=forms]'); await page.click('[data-a=gengo][data-g=tempus]'); }
  let seen = false;
  for (let k = 0; k < 30 && !seen; k++) {
    if (await page.$('[data-a=again]')) await page.click('[data-a=again]');
    const de = await page.locator('.de').first().textContent();
    if (/seit/.test(de)) {
      await page.fill('#answer', 'jag vänta här'); await page.click('[data-a=check]');
      await expect(page.locator('#fb .expl').first()).toContainText('Im Deutschen steht hier Präsens');
      seen = true;
    } else { await page.fill('#answer', 'x'); await page.click('[data-a=check]'); }
    await page.click('[data-a=next]');
  }
  expect(seen).toBe(true);
});
