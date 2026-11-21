// Erster Kontakt mit einem Satz (24.55.0): Feste Wendungen bekommen ihr wörtliches Bild als Hinweis, „Weiß ich nicht“ zählt wie
// eine falsche Antwort (Wiederholung, Rückfall), Kacheln liegen nie schon in einer gültigen Reihenfolge.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const J = code => JSON.parse(JSON.stringify(app.run(code)));
const BANK = app.get('BANK');
const blank = niveau => ({ v:3, settings:{ size:'normal', lang:'sv', niveau }, used:{}, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, focus:{} });
const world = BANK.sv.find(i => i.gap === 'världen'), flies = BANK.sv.find(i => i.gap === 'flugor');
// Eine Lückenaufgabe zeigen und den Kopf (Aufgabe und Hinweise) zurückgeben
function kicker(id, { niveau = 'fort', seen = false, requeue = false, tip = false, done = false } = {}){
  app.setDB(blank(niveau));
  if (seen) app.run(`DB.st[${JSON.stringify(id)}] = { s:2, d:5, ivl:2, last:addDays(today(), -2), due:today(), reps:1, ok:1, bad:0, alts:[] }`);
  app.run(`buildBank(); S.lang = 'sv'; S.view = 'run'; S.run = { kind:'trap', lang:'sv', queue:[{ type:'cloze', id:${JSON.stringify(id)}${requeue ? ', requeue:true' : ''} }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };
    S.run.cur = { input:'', state:${done ? "'done', result:'bad', gaveUp:true" : "'answer'"}, tip:${tip} };`);
  return app.run('viewRun()').match(/<p class="kicker">[\s\S]*?<\/p>/)[0];
}

test('Wendung beim ersten Kontakt: bei „Fortgeschritten“ „Wörtlich zeigen“, auf Tipp das Bild', () => {
  assert.equal(world.note.includes('(wörtlich: nicht die ganze Welt)'), true);
  const k = kicker(world.id);
  assert.ok(k.includes('data-a="showtip">Wörtlich zeigen</button>'), k);
  assert.ok(!k.includes('nicht die ganze Welt'), 'Bild erst auf Tipp');
  const shown = kicker(world.id, { tip:true });
  assert.ok(shown.includes('<span class="hintw" lang="de">wörtlich: nicht die ganze Welt</span>'), shown);
  // Nach dem Prüfen steht es da, damit die Zeile nicht springt
  assert.ok(kicker(world.id, { done:true }).includes('wörtlich: nicht die ganze Welt'));
});
test('Wendung beim ersten Kontakt, Niveau „Mittel“: das Bild steht gleich da', () => {
  assert.ok(kicker(world.id, { niveau:'mittel' }).includes('wörtlich: nicht die ganze Welt'));
});
test('Kein Bild ab dem zweiten Kontakt, beim zweiten Versuch in derselben Runde und wenn das Bild im Deutschen steht', () => {
  assert.ok(!kicker(world.id, { seen:true, tip:true }).includes('wörtlich'), 'zweiter Kontakt: Abruf ohne Hilfe');
  assert.ok(!kicker(world.id, { requeue:true, tip:true }).includes('wörtlich'), 'gerade gesehen');
  assert.ok(!kicker(flies.id, { tip:true }).includes('wörtlich'), 'zwei Fliegen: Bild steht schon im Deutschen');
});
test('Grundform bleibt wie bisher: bei „Fortgeschritten“ auf Tipp', () => {
  const it = BANK.sv.find(i => /^\([a-zåäö ]+\)$/.test(i.hint));
  assert.ok(kicker(it.id).includes('>Grundform zeigen</button>'));
  assert.ok(kicker(it.id, { tip:true }).includes(`Grundform: ${it.hint.replace(/[()]/g, '')}`));
});

// „Weiß ich nicht“ setzte vorher nicht, ob der Satz schon bekannt und fällig war: Eine aufgegebene Wiederholung zählte im
// Tagesprotokoll als neuer Satz, nicht als Wiederholung, und nicht als Rückfall (fehlte dann bei „Hartnäckige Sätze“).
test('„Weiß ich nicht“ bei einer fälligen Wiederholung: zählt als Wiederholung und Rückfall, nicht als neuer Satz', () => {
  const id = BANK.sv.find(i => i.kind === 'form' && i.gap).id;
  app.setDB(blank('fort'));
  app.run(`buildBank(); DB.st[${JSON.stringify(id)}] = { s:20, d:5, ivl:25, last:addDays(today(), -25), due:today(), reps:3, ok:3, bad:0, lapses:0, alts:[] };
    S.lang = 'sv'; S.view = 'run'; S.run = { kind:'daily', lang:'sv', queue:[{ type:'cloze', id:${JSON.stringify(id)} }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };
    S.run.cur = { input:'', state:'answer' }; giveUp(); next();`);
  const log = J(`dayLog(today(), 'sv')`), st = J(`DB.st[${JSON.stringify(id)}]`);
  assert.equal(log.fresh || 0, 0, 'kein neuer Satz');
  assert.equal(log.rev, 1); assert.equal(log.revOk, 0);
  assert.equal(log.revM, 1, 'gefestigter Satz: zählt beim Behalten gefestigter Sätze'); assert.equal(log.revMOk, 0);
  assert.equal(st.lapses, 1);
});
test('„Weiß ich nicht“ bei einem neuen Satz: neuer Satz, kein Rückfall', () => {
  const id = BANK.sv.find(i => i.kind === 'form' && i.gap).id;
  app.setDB(blank('fort'));
  app.run(`buildBank(); S.lang = 'sv'; S.view = 'run'; S.run = { kind:'daily', lang:'sv', queue:[{ type:'cloze', id:${JSON.stringify(id)} }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };
    S.run.cur = { input:'', state:'answer' }; giveUp(); next();`);
  assert.equal(J(`dayLog(today(), 'sv')`).fresh, 1);
  assert.equal(J(`DB.st[${JSON.stringify(id)}]`).lapses || 0, 0);
});

// Kacheln: Vorher wurde nur die Reihenfolge des Zielsatzes vermieden, nicht die einer Alternative. „Heute arbeite ich nicht.“
// lag dann gelegentlich als „jag jobbar inte Idag“ da, und das gilt (Jag jobbar inte idag.).
test('Kacheln liegen nie in einer gültigen Reihenfolge, auch nicht in der einer Alternative (jeder Zufall)', () => {
  const item = BANK.sv.find(i => i.target === 'Idag jobbar jag inte.');
  assert.ok(item && item.alts.includes('Jag jobbar inte idag.'), 'Beispiel aus dem Fehlerfall');
  const orders = J(`(() => { const orig = Math.random, seen = new Set(), bad = [];
    const items = BANK.sv.concat(BANK.es).filter(i => i.kind === 'order').slice(0, 120);
    try {
      for (const fixed of [0, 0.2, 0.5, 0.8, 0.999]) {
        Math.random = () => fixed;
        items.forEach(it => {
          S.run = { kind:'trap', lang:it.lang, queue:[{ type:'tiles', id:it.id }], idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };
          prepCur();
          const keys = [it.target].concat(it.alts).map(tileKey), got = S.run.queue[0].pool.filter(x => !x.extra).map(x => x.t.toLowerCase()).join(' ');
          if (keys.includes(got) && tileTokens(it.target).length > 2) bad.push(it.target + ' ← ' + got);
          seen.add(it.id);
        });
      }
    } finally { Math.random = orig; }
    return { bad, n:seen.size };
  })()`);
  assert.ok(orders.n >= 60, String(orders.n));
  assert.deepEqual(orders.bad, []);
});

// Erster Kontakt je Thema und Monat (24.61.0): Grundlage für „neue Sätze beim ersten Mal richtig“, über Monate vergleichbar
test('Erstkontakt: nur der erste Versuch an einem neuen Satz zählt, je Monat, Thema und Stufe', () => {
  // Ein Lückenthema mit mindestens drei B2-Sätzen
  const gapB2 = t => BANK.sv.filter(i => i.trap === t && i.kind === 'form' && i.gap && i.lvl === 3);
  const trap = [...new Set(BANK.sv.map(i => i.trap))].find(t => gapB2(t).length >= 3);
  const [a, b, seen] = gapB2(trap), two = [a, b];
  app.setDB(blank('fort'));
  app.run(`buildBank(); DB.st[${JSON.stringify(seen.id)}] = { s:2, d:5, ivl:2, last:addDays(today(), -2), due:today(), reps:1, ok:1, bad:0, alts:[] };
    S.lang = 'sv'; S.view = 'run'; S.run = { kind:'daily', lang:'sv', queue:${JSON.stringify([two[0], two[1], seen].map(i => ({ type:'cloze', id:i.id })))}, idx:0, ok:0, bad:0, res:[], missed:[], secs:0 };
    S.run.cur = { state:'answer', input:${JSON.stringify(two[0].gap)} }; check(); next();
    S.run.cur = { input:'', state:'answer' }; giveUp(); next();
    S.run.cur = { state:'answer', input:'zzz' }; check(); next();
    S.run.cur = { state:'answer', input:${JSON.stringify(b.gap)} }; check(); next();`);
  assert.equal(J('S.run.queue[3].requeue && S.run.queue[3].id'), b.id, 'vierte Aufgabe: zweiter Versuch am aufgegebenen Satz');
  const month = J('today().slice(0, 7)'), first = J('DB.first');
  // Richtig und „Weiß ich nicht“ bei zwei neuen Sätzen; der bekannte Satz und der zweite Versuch in derselben Runde zählen nicht
  assert.deepEqual(first, { sv:{ [month]:{ [`${trap}:3`]:[2, 1] } } });
  // Die Fehlerquellen zählen weiter alle ersten Versuche, auch die Wiederholung
  assert.deepEqual(J(`DB.tlog[today()].sv['p:${trap}']`), [3, 2]);
});
test('Erstkontakt: Tatoeba-Sätze getrennt, eigene Sätze und Grammatik-Generatoren nicht', () => {
  app.setDB(blank('fort'));
  app.run(`DB.tat.sv.push({ id:'sv:tat1', de:'Ich weiß, dass er heute nicht kommt.', target:'Jag vet att han inte kommer idag.', trap:'bisats', auto:true });
    DB.own.sv.push({ id:'sv:own1', de:'Mein Satz.', target:'Min mening.' }); buildBank();
    recordAnswer('sv', { type:'tiles', id:'sv:tat1' }, { wasSeen:false, input:'' }, true);
    recordAnswer('sv', { type:'tiles', id:'sv:own1' }, { wasSeen:false, input:'' }, false);
    recordAnswer('sv', { type:'free', id:'sv:tat1' }, { wasSeen:false, input:'x' }, false);`);
  assert.deepEqual(J('DB.first.sv[today().slice(0, 7)]'), { 'bisats:t':[1, 0] });
});
test('Erstkontakt: alter Stand ohne Zähler lädt, Backup behält ihn', () => {
  app.run(`adoptDB(${JSON.stringify(blank('fort'))})`);
  assert.equal(J('DB.first === undefined'), true);
  app.run(`DB.first = { es:{ '2026-11':{ 'condicional:3':[20, 6] } } }; adoptDB(JSON.parse(backupText()))`);
  assert.deepEqual(J('DB.first'), { es:{ '2026-11':{ 'condicional:3':[20, 6] } } });
});
