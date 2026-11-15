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
