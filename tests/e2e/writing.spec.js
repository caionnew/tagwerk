// Freies Schreiben: Auswertung offline, Hinweise, Archiv und Verlauf in der Statistik.
const { test, expect, APP, seed, richDB, stored } = require('./helpers');
test('Text mit typischen Fehlern: Profil, vier Hinweise, Archiv, Verlauf', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=write]');
  await page.fill('#wtext', 'Idag jag jobbar hemma. Jag tycker att det är skönt eftersom jag slipper bussen. Igår har jag ätit lunch med en kollega. Hon säger att hon kommer inte på festen. Det är ett stor hus i Malmö.');
  await page.click('[data-a=weval]');
  await expect(page.locator('.wprof')).toBeVisible();
  await expect(page.locator('.whints li')).toHaveCount(4);
  await page.click('[data-a=wnew]');
  await page.fill('#wtext', 'Förra sommaren reste jag till Norrland med min sambo. Vi bodde i en liten stuga vid en sjö, och varje morgon badade vi trots att vattnet var kallt. Eftersom solen aldrig gick ner sov vi dåligt, men det gjorde ingenting. Nästa år ska vi åka dit igen.');
  await page.click('[data-a=weval]');
  await expect(page.locator('.whints li')).toHaveCount(0);
  await expect(page.locator('.warch summary')).toContainText('(2)');
  await page.waitForTimeout(300);
  expect((await stored(page)).texts.length).toBe(2);
  await page.click('.backbar [data-a=tab]');
  await page.click('[data-a=tab][data-v=progress]');
  await page.click('[data-a=ptab][data-t=sv]');
  await expect(page.locator('h2.grp', { hasText:'Schreiben' })).toBeVisible();
});
test('Wörter zum Einbauen: fünf Grundformen, „Andere Wörter“ tauscht sie und lässt den Text stehen', async ({ page }) => {
  const db = richDB('sv'); Object.keys(db.st).forEach((k, i) => { db.st[k].ivl = i % 2 ? 3 : 30; });
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=write]');
  const chips = () => page.$$eval('.wsugg .wchip', e => e.map(x => x.textContent));
  const before = await chips();
  expect(before.length).toBe(5);
  before.forEach(w => expect(w).toBe(w.toLowerCase()));
  await page.fill('#wtext', 'Jag skriver något.');
  await page.click('[data-a=wsugg]');
  const after = await chips();
  expect(after.length).toBe(5);
  expect(after.filter(w => before.includes(w))).toEqual([]);
  await expect(page.locator('#wtext')).toHaveValue('Jag skriver något.');
});
// Seit 24.95.0: bei „Fortgeschritten“ Aufgabe und Anweisung in der Zielsprache, Wörter antippbar; „Auf Deutsch“ stellt die deutsche
// Fassung darunter, ohne den angefangenen Text zu verlieren
test('Schreibaufgabe bei „Fortgeschritten“: zielsprachig, Wort nachschlagbar, „Auf Deutsch“ behält den Text', async ({ page }) => {
  const db = richDB('es'); db.settings.lang = 'es'; db.settings.niveau = 'fort';
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=write]');
  await expect(page.locator('.kicker .kick-tl')).toHaveText('Escribe de 4 a 6 frases en español');
  await expect(page.locator('.de.wq')).toHaveAttribute('lang', 'es');
  await expect(page.locator('.wq-de')).toHaveCount(0);
  await page.fill('#wtext', 'Ayer fui al mercado.');
  await page.click('.de.wq [data-a=lookup] >> nth=1');
  await expect(page.locator('.pop')).toBeVisible();
  await page.click('[data-a=popclose]');
  await page.click('.vocab [data-a=kickde]');
  await expect(page.locator('.wq-de')).toBeVisible();
  await expect(page.locator('.kicker')).toHaveText('Schreib 4 bis 6 Sätze auf Spanisch');
  await expect(page.locator('.de.wq')).toBeVisible();
  await expect(page.locator('#wtext')).toHaveValue('Ayer fui al mercado.');
  await page.click('[data-a=wnew]');
  await expect(page.locator('.wq-de')).toHaveCount(0);
  await expect(page.locator('.kicker .kick-tl')).toBeVisible();
});
