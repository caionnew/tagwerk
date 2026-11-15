// Niveau: Schätzung je Satz, Verteilung der Satzbank, Auswahl neuer Sätze für Fortgeschrittene.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const estLevel = app.get('estLevel'), BANK = app.get('BANK');
test('Schätzung: kurze Hauptsätze leicht, Nebensätze und anspruchsvolle Formen schwer', () => {
  assert.equal(estLevel('sv', 'Nu förstår jag det.'), 1);
  assert.equal(estLevel('es', 'Estoy cansado.'), 1);
  assert.equal(estLevel('sv', 'Fast vi inte hade setts på länge kände jag igen henne direkt.'), 3);
  assert.equal(estLevel('es', 'Si me hubieras avisado, te habría recogido en la estación.'), 3);
  assert.ok(estLevel('sv', 'Jag vet att han inte kommer idag.') >= 2);
});
test('Satzbank je Sprache: mindestens 60 Sätze ab Mittelstufe, davon mindestens 30 schwere', () => {
  for (const lang of ['sv', 'es']) {
    const n = BANK[lang].length, l = [1, 2, 3].map(k => BANK[lang].filter(i => i.lvl === k).length);
    assert.ok(l[1] + l[2] >= 60, `${lang}: ${l.join('/')} von ${n}`);
    assert.ok(l[2] >= 30, `${lang}: nur ${l[2]} schwere Sätze`);
  }
});
const pick = (niv, tlog) => app.run(`(() => { DB.st = {}; DB.focus = {}; DB.tlog = ${JSON.stringify(tlog || {})}; DB.settings.niveau = '${niv}'; return pickNew('sv', 12).map(i => i.lvl + ':' + i.trap); })()`);
test('Fortgeschritten: keine Grundlagen-Sätze, solange schwerere da sind', () => {
  const got = Array.from(pick('fort'));
  assert.equal(got.length, 12);
  assert.ok(got.every(x => !x.startsWith('1:')), got.join(' '));
});
test('Fortgeschritten mit vielen Fehlern in einem Thema: dort kommen auch einfache Sätze', () => {
  const t = app.run('today()');
  const got = Array.from(pick('fort', { [t]:{ sv:{ 'p:partikel':[10, 6] } } }));
  assert.ok(got.some(x => x === '1:partikel'), got.join(' '));
});
test('Grundlagen: leichte zuerst; Mittel: alle Stufen', () => {
  const minOf = Object.fromEntries(['bisats', 'inversion', 'tempus', 'partikel', 'sin', 'tid', 'framtid', 'passiv', 'falska'].map(t => [t, Math.min(...BANK.sv.filter(i => i.trap === t).map(i => i.lvl))]));
  for (const x of Array.from(pick('grund')).slice(0, 9)) { const [l, t] = x.split(':'); assert.equal(Number(l), minOf[t], x); }
  const m = Array.from(pick('mittel')); assert.equal(m.length, 12);
});
test('Schwerpunkt der Woche: schwächstes Thema, bleibt die Woche über, ein Drittel der neuen Sätze', () => {
  const t = app.run('today()');
  app.run(`DB.st = {}; DB.focus = {}; DB.settings.niveau = 'mittel'; DB.tlog = { '${t}':{ sv:{ 'p:passiv':[10, 7], 'p:tid':[10, 1] } } };`);
  assert.equal(app.run("focusTrap('sv')"), 'passiv');
  app.run(`DB.tlog = { '${t}':{ sv:{ 'p:tid':[10, 9] } } };`);
  assert.equal(app.run("focusTrap('sv')"), 'passiv', 'innerhalb der Woche stabil');
  const got = Array.from(app.run("pickNew('sv', 6).map(i => i.trap)"));
  assert.ok(got.filter(x => x === 'passiv').length >= 2, got.join(' '));
});
test('Konnektoren & feste Verbindungen: Lücke mit drei Optionen, Lösung unter den Optionen', () => {
  for (const g of ['verbind_sv', 'verbind_es']) for (let k = 0; k < 40; k++) {
    const d = app.run(`GENS.${g}.make()`);
    assert.ok(d.gap && d.prompt.includes('___'));
    assert.ok(d.hint.split(' / ').map(x => x.toLowerCase()).includes(d.answers[0]), d.prompt);
  }
});
test('Verben mit Präposition: je Sprache mindestens 36 Fälle (dreimal so viele wie gemerkt), eindeutig, Lösung unter den Optionen', () => {
  for (const name of ['PREP_SV', 'PREP_ES']) {
    const list = app.get(name);
    assert.ok(list.length >= 36, `${name}: ${list.length}`);
    assert.equal(new Set(list.map(x => x[0])).size, list.length);
    assert.ok(list.every(x => x[2].includes(x[1]) && new Set(x[2]).size === 3));
  }
});
test('Begleiter: min/mitt nach en/ett, den/det här + bestimmte Form; nuestro/a/os/as und Adjektiv passen zum Nomen', () => {
  const G = app.get('GENUS');
  for (let k = 0; k < 300; k++) {
    const d = app.run('genDetSv()');
    if (/^___ \S+$/.test(d.prompt) && ['min', 'mitt', 'din', 'ditt', 'vår', 'vårt'].includes(d.answers[0])) {
      const n = G.sv.find(x => x[0] === d.prompt.slice(4)); if (n) assert.equal(/t$/.test(d.answers[0]), n[1] === 'ett', d.prompt);
    }
    const e = app.run('genDetEs()'), parts = e.full.split(' '), adj = /^(el|la|los|las)$/.test(parts[0]), noun = parts[1];
    const n = G.es.find(x => x[0] === noun) || G.es.find(x => x[0] + 's' === noun), fem = n[1] === 'la', pl = noun !== n[0], idx = 1 + (fem ? 1 : 0) + (pl ? 2 : 0);
    const table = [...app.get('POSS_ES'), ...app.get('DEM_ES')].find(t => t[0] === e.hint);
    const want = adj ? e.hint.replace(/o$/, fem ? 'a' : 'o') + (pl ? 's' : '') : table[idx];
    assert.equal(e.answers[0], want, e.full);
  }
  assert.equal(app.run("lookupWord('es', 'problemas').l"), 'problema');
  assert.equal(app.run("lookupWord('es', 'pequeñas').l"), 'pequeño');
});
test('Sprache des Tages: die nötigere Sprache, fest für den Tag, Wechsel von Hand gilt bis morgen', () => {
  const t = app.run('today()'), d = k => app.run(`addDays(today(), -${k})`);
  app.run(`DB.st = {}; DB.settings.langMode = 'auto'; DB.dayLang = {}; DB.log = { '${d(1)}':{ sv:{ n:20 } }, '${d(4)}':{ es:{ n:20 } } };`);
  assert.equal(app.run('dayLang()'), 'es', 'Spanisch länger nicht geübt');
  app.run(`DB.log['${d(1)}'] = { es:{ n:20 } }; DB.log['${d(5)}'] = { sv:{ n:20 } };`);
  assert.equal(app.run('dayLang()'), 'es', 'innerhalb des Tages fest');
  app.run(`DB.dayLang = { d:'${t}', l:'sv', manual:true };`);
  assert.equal(app.run('dayLang()'), 'sv', 'Wechsel von Hand gilt');
  app.run(`DB.dayLang = {}; DB.log = { '${d(1)}':{ sv:{ n:20 } } };`);
  assert.equal(app.run('dayLang()'), 'sv', 'nur eine Sprache aktiv');
  app.run(`DB.settings.langMode = 'last'; DB.settings.lang = 'es';`);
  assert.equal(app.run('dayLang()'), 'es', 'Einstellung „Zuletzt gewählte“');
  app.run(`DB.settings.langMode = 'auto';`);
});
test('Umbauen „Ayer → Hoy“: Ziel ist benannt (heute schon passiert), Perfecto steht als Standardlösung vorn', () => {
  let seen = 0;
  for (let k = 0; k < 300 && seen < 5; k++) {
    const d = app.run('GENS.trans_es.make()');
    if (d.start !== 'Hoy ') continue;
    seen++;
    assert.ok(/schon passiert/.test(d.aim), d.src);
    assert.ok(/ (he|has|ha|hemos|habéis|han) \S+ /.test(d.answers[0]), d.answers[0]);
  }
  assert.ok(seen >= 1);
});
test('Adjektiv anpassen: keine Aufgabe, deren Lösung schon als Hinweis dasteht (außer männlich auf -a)', () => {
  for (let k = 0; k < 400; k++) {
    const d = app.run('genDetEs()');
    if (d.label === 'Adjektiv anpassen' && d.answers[0] === d.hint) assert.ok(/a$/.test(d.full.split(' ')[1]), d.full);
  }
});
