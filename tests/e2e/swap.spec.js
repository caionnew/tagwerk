// Nomen tauschen (Spanisch): Satz mit markiertem Nomen, neues Nomen zum Nachschlagen, ganzer Satz als Antwort, Erklärung beim Fehler.
const { test, expect, APP, seed, freshDB, answerWrong } = require('./helpers');
const { loadApp } = require('../helpers/load.js');
const app = loadApp(), T = app.get('SWAP_ES');
// Die App läuft gekapselt; die Aufgabe ergibt sich aus dem angezeigten Satz und den beiden Nomen
async function shown(page){
  const src = (await page.textContent('.ex .de')).trim(), from = (await page.textContent('.ex .de b')).trim(), to = (await page.textContent('.vocab .swapto')).trim();
  const i = T.findIndex(([, l], k) => l.split(' ').includes(from) && app.run(`swapRender(SWAP_ES[${k}][0], swapNoun('${from}')).text`) === src);
  expect(i).toBeGreaterThanOrEqual(0);
  return app.run(`swapTask(${i}, '${from}', '${to}')`);
}
test('Nomen tauschen: Aufgabe, richtige Antwort, Erklärung bei falscher', async ({ page }) => {
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=forms]');
  await page.click('[data-a=gengo][data-g=det_es]');
  await expect(page.locator('.kicker')).toHaveText('Tausch das Nomen aus und pass den Satz an');
  await expect(page.locator('.ex .de b')).toHaveCount(1);
  const d = await shown(page);
  expect(d.src).not.toBe(d.full);
  await expect(page.locator('#answer')).toHaveValue('');
  await page.click('.vocab .swapto');
  await expect(page.locator('.pop')).toBeVisible();
  await page.click('.popov');
  await page.fill('#answer', d.full);
  await page.click('[data-a=check]');
  await expect(page.locator('#fb.fb-ok')).toBeVisible();
  await page.click('[data-a=next]');
  const e = await shown(page);
  await answerWrong(page);
  await expect(page.locator('#fb.fb-bad')).toBeVisible();
  await expect(page.locator('#fb')).toContainText(e.note);
});
