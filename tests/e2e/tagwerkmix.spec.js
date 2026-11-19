// 24.54.0: Zeitschätzung aus dem eigenen Tempo; Verbformen als ganze Sätze, vorgelesen wird genau der angezeigte Lösungssatz.
const { test, expect, APP, seed, freshDB } = require('./helpers');
const pad = n => String(n).padStart(2, '0');
const ds = k => { const t = new Date(), d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

test('Heute: Die Zeitschätzung folgt dem Tempo der letzten Übungstage', async ({ page }) => {
  const db = freshDB('es');
  // Zehn Tage mit je 36 Aufgaben in 5½ Minuten: gut 9 Sekunden je Aufgabe
  for (let k = 1; k <= 10; k++) { db.log[ds(k)] = { es:{ n:36, secs:330 } }; db.done[ds(k)] = true; }
  await seed(page, db);
  await page.goto(APP);
  const n = Number((await page.locator('.today .num').first().textContent()).match(/(\d+) Aufgaben/)[1]);
  await expect(page.locator('.today .num-s')).toHaveText(`etwa ${Math.max(1, Math.round(n * 330 / 36 * 1.1 / 60))} Min.`);
});

test('Verbformen: ganzer Satz mit Ergänzung; vorgelesen wird der Lösungssatz, wie er dasteht', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    const fake = { speak:u => window.__spoken.push(u.text), cancel(){}, getVoices:() => [{ lang:'sv-SE', name:'sv' }, { lang:'es-ES', name:'es' }], onvoiceschanged:null, addEventListener(){} };
    Object.defineProperty(window, 'speechSynthesis', { value:fake, configurable:true });
    window.SpeechSynthesisUtterance = function(t){ this.text = t; };
  });
  const db = freshDB('es'); db.settings.autoplay = true;
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  if (await page.$('[data-a=form][data-g=conj]')) await page.click('[data-a=form][data-g=conj]');
  else { await page.click('[data-a=forms]'); await page.click('[data-a=gengo][data-g=conj]'); }
  for (let k = 0; k < 3; k++) {
    // Der Satz beginnt groß und hat nach der Lücke noch eine Ergänzung bis zum Punkt
    await expect(page.locator('.cloze')).toHaveText(/^(Normalmente|Ayer|Antes|Es importante que) \S+( siempre)?\s+\S.*\.$/);
    await page.fill('#answer', 'zzz');
    await page.click('[data-a=check]');
    const sol = (await page.locator('#fb .sol').textContent()).trim();
    expect(sol).toMatch(/^[A-Z].+\.$/);
    await expect.poll(() => page.evaluate(() => window.__spoken[window.__spoken.length - 1])).toBe(sol);
    await expect(page.locator('#fb [data-a=speak]')).toHaveAttribute('data-text', sol);
    await page.click('[data-a=next]');
  }
});
