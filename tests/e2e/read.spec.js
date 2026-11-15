// Lesen und Hören: Text lesen, Fragen beantworten, Satz übernehmen; Hören mit verdecktem Text; Wikipedia-Fundstück.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
const fakeSpeech = () => {
  window.__said = []; let cur = null;
  Object.defineProperty(window, 'speechSynthesis', { configurable:true, value:{
    speak(u){ window.__said.push(u.text); cur = u; setTimeout(() => { if (cur === u && u.onend) u.onend(); }, 20); },
    cancel(){ cur = null; }, getVoices:() => [{ lang:'sv-SE' }, { lang:'es-ES' }, { lang:'de-DE' }], onvoiceschanged:null } });
  window.SpeechSynthesisUtterance = function(t){ this.text = t; };
};
test('Lesen: antippbare Wörter landen in „Nachgeschlagen“, Fragen einzeln, Ergebnis gespeichert, Satz übernehmen', async ({ page }) => {
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen][data-id=vasa]');
  await expect(page.locator('.rtitle')).toHaveText('Regalskeppet Vasa');
  expect(await page.locator('.reader [data-a=lookup]').count()).toBeGreaterThan(50);
  await page.click('.reader [data-a=lookup][data-w=krigsskeppet]');
  await page.click('[data-a=popclose] >> nth=0');
  await expect(page.locator('.wtray .wchip')).toHaveCount(1);
  await expect(page.locator('.tq-head')).toContainText('Frage 1 von 3');
  await page.click('[data-a=tpick][data-k="0"][data-i="0"]');
  await expect(page.locator('.tq-head')).toContainText('Frage 2 von 3');
  await page.click('[data-a=tpick][data-k="1"][data-i="0"]');
  await expect(page.locator('.tq-head')).toContainText('Frage 3 von 3');
  await page.click('[data-a=tpick][data-k="2"][data-i="1"]');
  await expect(page.locator('.tdone-h')).toHaveText('2 von 3 richtig.');
  await page.waitForTimeout(300);
  let db = await stored(page);
  expect(db.used.texts['sv:vasa'].best).toBe(2);
  await page.click('[data-a=tkeep][data-k="0"]');
  await expect(page.locator('[data-a=tkeep][data-k="0"]')).toHaveText('Übernommen');
  await page.waitForTimeout(300);
  db = await stored(page);
  expect(db.own.sv.some(o => o.target === 'Skeppet var helt enkelt för smalt och för högt.')).toBe(true);
  await page.click('[data-a=tnexttext]');
  await expect(page.locator('.rtitle')).not.toHaveText('Regalskeppet Vasa');
  await page.click('.backbar [data-a=tab]');
  await expect(page.locator('[data-a=textopen][data-id=vasa]')).toContainText('2 von 3');
});
test('Nur hören: Text verschwommen, Satz für Satz vorgelesen, Antippen deckt auf, nach den Fragen alles sichtbar', async ({ page }) => {
  await page.addInitScript(fakeSpeech);
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=textopen][data-id=siesta]');
  await page.click('[data-a=thide]');
  const total = await page.locator('.reader .rs-s').count();
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(total);
  await expect.poll(() => page.evaluate(() => window.__said.length), { timeout:8000 }).toBeGreaterThanOrEqual(3);
  const said = await page.evaluate(() => window.__said);
  expect(said[0]).toBe('Mucha gente cree que en España todo el mundo duerme la siesta.');
  expect(said[1]).toBe('No es verdad.');
  await page.click('[data-a=tplayall]');
  const n = await page.evaluate(() => window.__said.length);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.__said.length)).toBe(n);
  await page.click('.reader [data-a=treveal][data-i="1"]');
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(total - 1);
  for (let k = 0; k < 3; k++) { await page.click(`[data-a=tpick][data-k="${k}"][data-i="0"]`); }
  await expect(page.locator('.tdone-h')).toHaveText('Alles verstanden.');
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(0);
  await expect(page.locator('.reader')).toContainText('veinte minutos');
  await page.waitForTimeout(300);
  expect((await stored(page)).used.texts['es:siesta'].heard).toBe(true);
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
  await expect(page.locator('.rtitle')).toHaveText('Stockholms skärgård');
  await expect(page.locator('.reader')).toContainText('trettio tusen öar');
  await expect(page.locator('.legend')).toContainText('CC BY-SA 4.0');
  fail = true;
  await page.click('.btnrow [data-a=wiki]');
  await expect(page.locator('#app')).toContainText('Dafür braucht es Internet');
});
