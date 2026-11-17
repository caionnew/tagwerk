// Fehler finden: „Kein Fehler“ bei richtigen Sätzen, gefundene Formfehler verbessern, Rückmeldung je Fall.
const { test, expect, APP, seed, freshDB } = require('./helpers');
const base = { kind:'spot', note:'Wo sich jemand befindet: estar.', trap:'serestar', label:'' };
const RIGHT = Object.assign({}, base, { deLine:'Pablo ist im Zug.', words:['Pablo', 'está', 'en', 'el', 'tren.'], wrong:[], full:'Pablo está en el tren.', answers:['Pablo está en el tren.'], fix:null });
const WRONG = Object.assign({}, base, { deLine:'Ana ist zu Hause.', words:['Ana', 'es', 'en', 'casa.'], wrong:[1], full:'Ana está en casa.', answers:['Ana está en casa.'], fix:null });
const FORM = Object.assign({}, base, { deLine:'Ich hoffe, dass du kommst.', note:'Nach esperar que (Wunsch) steht der Subjuntivo.', trap:'subjuntivo', words:['Espero', 'que', 'vienes.'], wrong:[2], full:'Espero que vengas.', answers:['Espero que vengas.'], fix:['vengas'] });
function withRun(queue){
  const db = freshDB('es'), t = new Date(), pad = n => String(n).padStart(2, '0');
  db.run = { date:`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`, lang:'es', queue:queue.map(data => ({ type:'gen', gen:'spot_es', data })), idx:0, ok:0, bad:0, res:[], missed:[], secs:0, combo:0, best:0 };
  return db;
}
test('Fehler finden: richtiger Satz, übersehener Fehler, Form verbessern', async ({ page }) => {
  await seed(page, withRun([RIGHT, WRONG, FORM]));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  // 1) richtiger Satz: „Kein Fehler“
  await expect(page.locator('.kicker')).toContainText('Kein Fehler');
  await page.click('[data-a=spotnone]');
  await expect(page.locator('#fb')).toHaveClass(/fb-ok/);
  await expect(page.locator('.spotline')).toHaveText('Der Satz stimmt.');
  await page.click('[data-a=next]');
  // 2) fehlerhafter Satz, „Kein Fehler“ ist falsch und zeigt die Stelle
  await page.click('[data-a=spotnone]');
  await expect(page.locator('#fb')).toHaveClass(/fb-bad/);
  await expect(page.locator('.spotline')).toContainText('„es“');
  await expect(page.locator('.sw-w.was')).toHaveText('es');
  await page.click('[data-a=next]');
  // 3) Formfehler: finden, dann die richtige Form eintippen
  await page.click('[data-a=spotpick][data-i="2"]');
  await expect(page.locator('.kicker')).toHaveText('Gefunden. Wie heißt es richtig?');
  await expect(page.locator('[data-a=spotnone]')).toHaveCount(0);
  await expect(page.locator('#answer')).toBeFocused();
  await page.fill('#answer', 'vengas');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb')).toHaveClass(/fb-ok/);
  await expect(page.locator('.sol .w-fix')).toHaveText('vengas.');
});
test('Fehler finden: Wort im richtigen Satz angetippt, falsche Form nach dem Finden', async ({ page }) => {
  await seed(page, withRun([RIGHT, FORM]));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  await page.click('[data-a=spotpick][data-i="1"]');
  await expect(page.locator('#fb')).toHaveClass(/fb-bad/);
  await expect(page.locator('.spotline')).toHaveText('Der Satz war richtig.');
  await expect(page.locator('.sw-w.alarm')).toHaveText('está');
  await page.click('[data-a=next]');
  await page.click('[data-a=spotpick][data-i="2"]');
  await page.fill('#answer', 'vienes');
  await page.keyboard.press('Enter');
  await expect(page.locator('#fb')).toHaveClass(/fb-bad/);
  await expect(page.locator('.spotline')).toContainText('„vengas“');
});
