// Lesen und Hören: Text lesen, Fragen beantworten, Satz übernehmen; Hören mit verdecktem Text; Wikipedia-Fundstück.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
const fakeSpeech = () => {
  window.__said = []; let cur = null;
  Object.defineProperty(window, 'speechSynthesis', { configurable:true, value:{
    speak(u){ window.__said.push(u.text); cur = u; setTimeout(() => { if (cur === u && u.onend) u.onend(); }, 20); },
    cancel(){ cur = null; }, getVoices:() => [{ lang:'sv-SE' }, { lang:'es-ES' }, { lang:'de-DE' }], onvoiceschanged:null } });
  window.SpeechSynthesisUtterance = function(t){ this.text = t; };
};
test('Lesen: Text mit antippbaren Wörtern, drei Fragen, Ergebnis gespeichert, Satz übernehmen', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen][data-id=vasa]');
  await expect(page.locator('.reader')).toContainText('Vasa');
  expect(await page.locator('.reader [data-a=lookup]').count()).toBeGreaterThan(50);
  for (let k = 0; k < 3; k++) await page.click(`[data-a=tpick][data-k="${k}"][data-i="${k === 2 ? 1 : 0}"]`);
  await expect(page.locator('.tq-score')).toHaveText('2 von 3 richtig.');
  await expect(page.locator('.tq-b.wrong')).toHaveCount(1);
  await page.waitForTimeout(300);
  let db = await stored(page);
  expect(db.used.texts['sv:vasa'].best).toBe(2);
  await page.click('[data-a=tkeep][data-k="0"]');
  await expect(page.locator('[data-a=tkeep][data-k="0"]')).toHaveText('Übernommen');
  await page.waitForTimeout(300);
  db = await stored(page);
  expect(db.own.sv.some(o => o.target === 'Skeppet var helt enkelt för smalt och för högt.')).toBe(true);
  await page.click('.backbar [data-a=tab]');
  await expect(page.locator('[data-a=textopen][data-id=vasa]')).toContainText('2 von 3 richtig');
});
test('Hören: Text verdeckt, Satz für Satz vorgelesen, Pause, Text nach den Fragen', async ({ page }) => {
  await page.addInitScript(fakeSpeech);
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen][data-id=siesta]');
  await page.click('[data-a=tmode][data-v=listen]');
  await expect(page.locator('.reader')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.__said.length), { timeout:8000 }).toBeGreaterThanOrEqual(3);
  const said = await page.evaluate(() => window.__said);
  expect(said[0]).toBe('Mucha gente cree que en España todo el mundo duerme la siesta.');
  expect(said[1]).toBe('No es verdad.');
  await page.click('[data-a=tplayall]');
  const n = await page.evaluate(() => window.__said.length);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.__said.length)).toBe(n);
  for (let k = 0; k < 3; k++) await page.click(`[data-a=tpick][data-k="${k}"][data-i="0"]`);
  await expect(page.locator('.tq-score')).toHaveText('Alles verstanden.');
  await page.click('[data-a=tshow] >> nth=0');
  await expect(page.locator('.reader')).toContainText('veinte minutos');
});
test('Wikipedia-Fundstück: Artikel mit Quelle und Lizenz; ohne Netz eine klare Meldung', async ({ page }) => {
  let fail = false;
  await page.route('https://sv.wikipedia.org/w/api.php**', route => fail ? route.abort() : route.fulfill({ json:{ query:{ pages:[
    { title:'Kort', extract:'För kort.', fullurl:'https://sv.wikipedia.org/wiki/Kort' },
    { title:'Stockholms skärgård', fullurl:'https://sv.wikipedia.org/wiki/Stockholms_sk%C3%A4rg%C3%A5rd',
      extract:'Stockholms skärgård är en skärgård i Östersjön utanför Stockholm. Den består av omkring trettio tusen öar, kobbar och skär. Många stockholmare har sommarstuga på någon av öarna och åker dit med båt. Skärgården sträcker sig ungefär åtta mil från norr till söder och är ett populärt mål för seglare och kajakpaddlare under sommarhalvåret.\nPå vintern kan isen lägga sig mellan de inre öarna, och då åker en del människor långfärdsskridskor mellan dem.' }
  ] } } }));
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=wiki] >> nth=0');
  await expect(page.locator('.backbar h1')).toHaveText('Stockholms skärgård');
  await expect(page.locator('.reader')).toContainText('trettio tusen öar');
  await expect(page.locator('.legend')).toContainText('CC BY-SA 4.0');
  fail = true;
  await page.click('.btnrow [data-a=wiki]');
  await expect(page.locator('#app')).toContainText('Dafür braucht es Internet');
});
