// 24.77: Fälle aus den Screenshots vom 25.11. Pause nach der Antwort übersteht einen Neustart, Urteil und „wann wieder“ auf einer
// Höhe, Lücken ohne wiederholten Satz, zweiter Versuch als ganzer Satz, wenn die Lücke schon stimmte.
const { test, expect, APP, seed, richDB, stored, hash, fakeVoice } = require('./helpers');
const pad = n => String(n).padStart(2, '0');
const today = () => { const t = new Date(); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`; };
const JAHRE = 'sv:' + hash('Jag har inte sett dig på flera år!'), SITZUNG = 'es:' + hash('La reunión se puso tensa cuando salió el tema de los sueldos.');
// Offenes Tagwerk mit genau diesen Aufgaben
const withRun = (lang, queue) => { const db = richDB(lang); db.run = { date:today(), lang, queue, idx:0, ok:0, bad:0, res:[], secs:0, combo:0, best:0 }; return db; };
const center = (page, sel) => page.locator(sel).evaluate(e => { const r = e.getBoundingClientRect(); return r.top + r.height / 2; });

test('Pause nach der Antwort, App neu geöffnet: „Fortsetzen“ zeigt die Rückmeldung, gezählt wird einmal', async ({ page }) => {
  const db = withRun('sv', [{ type:'cloze', id:JAHRE }, { type:'cloze', id:JAHRE, requeue:true }]);
  await seed(page, db);
  await page.goto(APP);
  await page.click('.today [data-a=daily]');
  await page.fill('#answer', 'på flera år');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb .verdict')).toHaveText('Richtig');
  await page.click('[data-a=quit]');
  // Speichern auslösen wie beim Schließen der App (sonst liest der Test vor dem verzögerten Speichern)
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  const before = await stored(page);
  expect(before.run.cur.result).toBe('ok');
  expect((before.log[today()] || {}).sv).toBeUndefined();
  await page.reload();
  await page.click('.today [data-a=daily]');
  // Dieselbe Rückmeldung statt derselben Frage
  await expect(page.locator('#fb .verdict')).toHaveText('Richtig');
  await expect(page.locator('#answer')).toHaveCount(0);
  await expect(page.locator('.cloze .gapdone.ok')).toHaveText('på flera år');
  await page.click('[data-a=next]');
  await expect(page.locator('.count')).toHaveText('2/2');
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  const after = await stored(page);
  expect(after.log[today()].sv.n).toBe(1);
  expect(after.st[JAHRE].ok).toBe(1);
  expect(after.run.idx).toBe(1);
  expect(after.run.cur).toBeUndefined();
});

test('Rückmeldung: Urteil und „wann wieder“ auf einer Höhe; Lücke ohne wiederholten Satz, Vorlesen rechts daneben', async ({ page }) => {
  await page.addInitScript(fakeVoice);
  await seed(page, withRun('sv', [{ type:'cloze', id:JAHRE }, { type:'free', id:JAHRE }]));
  await page.goto(APP);
  await page.click('.today [data-a=daily]');
  await page.fill('#answer', 'på flera år');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb .sol')).toHaveCount(0);
  const [pill, hint, btn] = await Promise.all(['#fb .verdict', '#fb .nexthint', '#fb .vrow > [data-a=speak]'].map(s => page.locator(s).evaluate(e => e.getBoundingClientRect().toJSON())));
  // Vorher saß die Pille 5 px über der Mitte des Texts daneben
  expect(Math.abs((pill.top + pill.height / 2) - (hint.top + hint.height / 2))).toBeLessThan(1.5);
  expect(Math.abs((pill.top + pill.height / 2) - (btn.top + btn.height / 2))).toBeLessThan(1.5);
  expect(btn.left).toBeGreaterThan(hint.right);
  await expect(page.locator('#fb .vrow > [data-a=speak]')).toHaveAttribute('data-text', 'Jag har inte sett dig på flera år!');
  // Oben ist der Satz jetzt die Lösung zum Nachschlagen
  await page.click('.cloze [data-a=lookup][data-w=sett]');
  await expect(page.locator('.pop')).toBeVisible();
  await page.click('[data-a=popclose]');
  await page.click('[data-a=next]');
  // Übersetzung: Der Lösungssatz steht in der Rückmeldung, der Knopf mittig zu seiner ersten Zeile
  await page.fill('#answer', 'Jag har inte sett dig i flera år');
  await page.click('[data-a=check]');
  const line = await page.locator('#fb .sol').evaluate(e => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getClientRects()[0]; return b.top + b.height / 2; });
  expect(Math.abs(await center(page, '#fb .solrow .speak') - line)).toBeLessThan(3);
});

test('Fall aus dem Screenshot: „sesión“ und „surgió“ gelten, der zweite Versuch ist wieder der ganze Satz', async ({ page }) => {
  await seed(page, withRun('es', [{ type:'free', id:SITZUNG }]));
  await page.goto(APP);
  await page.click('.today [data-a=daily]');
  await page.fill('#answer', 'La sesión se puso tenso cuando surgió el tema de los sueldos');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb .verdict')).toHaveText('Falsch');
  await expect(page.locator('.tw-done .w-extra')).toHaveText(['tenso']);
  await expect(page.locator('#fb .sol .w-near, #fb .sol .w-miss')).toHaveText(['tensa']);
  await expect(page.locator('#fb')).toContainText('„tenso“ ist die männliche Form (angespannt), hier braucht es die weibliche Form: „tensa“.');
  // LanguageTool findet nichts: kein grünes „Keine Fehler gefunden“ neben „Falsch“
  await page.route('https://api.languagetool.org/**', r => r.fulfill({ headers:{ 'Access-Control-Allow-Origin':'*' }, json:{ matches:[] } }));
  await page.click('[data-a=ltfree]');
  await expect(page.locator('#fb .lt-none')).toHaveText('LanguageTool hat nichts gefunden.');
  await expect(page.locator('#fb .lt-ok')).toHaveCount(0);
  await page.click('[data-a=next]');
  // Die Lücke („se puso“) stimmte schon: noch einmal der ganze Satz statt „La reunión ___ tensa …“
  await expect(page.locator('.kicker')).toHaveText('Übersetze ins Spanische');
  await page.fill('#answer', 'La reunión se puso tensa cuando surgió el tema de los salarios');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb .verdict')).toHaveText('Richtig');
});
