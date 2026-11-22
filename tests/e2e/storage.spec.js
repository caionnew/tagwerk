// Speicheranzeige: Belegung bis etwa 5 MB samt anderer Seiten unter derselben Adresse, Warnung ab 3 MB, dauerhaft speichern.
const { test, expect, APP, seed, richDB } = require('./helpers');
// Der Browser lehnt beim Start ab (keine Handlung), auf Knopfdruck stimmt er zu
const stubPersist = page => page.addInitScript(() => {
  let asks = 0; const s = navigator.storage;
  s.persisted = () => Promise.resolve(asks > 1);
  s.persist = () => Promise.resolve(++asks > 1);
});
test('Einstellungen zeigen die Belegung, fremde Daten und ob der Browser die Daten dauerhaft behält', async ({ page }) => {
  await stubPersist(page);
  await page.addInitScript(() => { if (!localStorage.getItem('andere-app')) localStorage.setItem('andere-app', 'x'.repeat(200 * 1024)); });
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await expect(page.locator('.notice.warn')).toHaveCount(0);
  await page.click('[data-a=settings] >> nth=0');
  const row = page.locator('.row.store');
  await expect(row.locator('.rt')).toHaveText(/^Gespeichert: 2\d\d KB von etwa 5\sMB$/);
  await expect(row.locator('.mbar')).toHaveAttribute('aria-label', /^[45]\u00a0% belegt$/);
  await expect(row.locator('.rd')).toContainText('Davon 200 KB von anderen Seiten unter 127.0.0.1:4173.');
  await expect(row.locator('.rd')).toContainText('Der Browser darf die Daten bei Platzmangel löschen.');
  await row.locator('[data-a=persist]').click();
  await expect(page.locator('.notice')).toHaveText('Der Browser behält deine Daten jetzt dauerhaft.');
  await expect(row.locator('.rd')).toContainText('Der Browser behält die Daten dauerhaft.');
  await expect(row.locator('[data-a=persist]')).toHaveCount(0);
});
test('Ab 3 MB warnt „Heute“ und führt zu den Einstellungen', async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem('andere-app')) localStorage.setItem('andere-app', 'x'.repeat(3300 * 1024)); });
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const warn = page.locator('.notice.warn');
  await expect(warn).toContainText(/Der Speicher ist zu 6\d\u00a0% voll\. Exportier bitte ein Backup\./);
  await warn.locator('[data-a=toSettings]').click();
  await expect(page.locator('.row.store.warn .rd')).toContainText('Der Speicher wird knapp.');
});
