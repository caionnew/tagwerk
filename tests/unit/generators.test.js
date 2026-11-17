// Durchsicht der erzeugten Aufgaben: weitere richtige Fassungen, keine falschen Sätze, Adjektive nur, wo sie inhaltlich passen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };

function seeded(seed){ let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
function withSeed(seed, fn){ const orig = Math.random; Math.random = seeded(seed); try { return fn(); } finally { Math.random = orig; } }
const answer = (data, input) => run(`(() => {
  S.run = { lang:'${data.lang}', queue:[{ type:'gen', gen:'${data.gen}', data:${JSON.stringify(data.d)} }], idx:0, res:[], cur:{ state:'answer', input:${JSON.stringify(input)} } };
  check(); return S.run.cur.result; })()`);

test('Uhrzeit in Worten: „klockan är …“, „en punto“ und die Digitalform zählen als richtig', () => {
  const sv = run("timeWords('sv', 3, 15)"), sv0 = run("timeWords('sv', 3, 0)");
  assert.ok(sv.includes('kvart över tre') && sv.includes('klockan är kvart över tre') && sv.includes('klockan kvart över tre'));
  assert.ok(sv0.includes('klockan är tre') && !sv0.includes('klockan är klockan tre'));
  assert.equal(new Set(sv0).size, sv0.length, 'keine doppelten Fassungen');
  const es40 = run("timeWords('es', 12, 40)");
  assert.equal(es40[0], 'la una menos veinte', 'Standard bleibt vorn (wird vorgelesen)');
  assert.ok(es40.includes('son las doce y cuarenta'));
  assert.ok(run("timeWords('es', 1, 0)").includes('es la una en punto'));
  assert.ok(run("timeWords('es', 3, 15)").includes('las tres y quince'));
  assert.deepEqual(run("timeWords('es', 3, 10)"), ['las tres y diez', 'son las tres y diez']);
  const d = { kind:'time', mode:'write', answers:es40, full:'Es la una menos veinte.', note:'', label:'', trap:'zeit' };
  assert.equal(answer({ lang:'es', gen:'time_es', d }, 'Son las doce y cuarenta.'), 'ok');
});
test('Umbauen Spanisch: Subjektpronomen und „Ojalá que“ sind auch richtig, kein „su madre“ bei tú', () => {
  const seen = { pron:0, ojala:0 };
  withSeed(5, () => {
    for (let i = 0; i < 400; i++) {
      const d = run('GENS.trans_es.make()');
      assert.ok(!/su madre/.test(d.src), d.src);
      if (d.answers.some(a => / (tú|nosotros|yo) /.test(a))) seen.pron++;
      if (d.start === 'Ojalá ') { seen.ojala++; assert.ok(d.answers.includes(d.answers[0].replace('Ojalá ', 'Ojalá que ')), d.answers[0]); }
      if (d.start === 'Ayer ' && / (trabajamos|comimos|salimos) /.test(d.answers[0]) && !/Ana/.test(d.answers[0])) assert.ok(d.answers.includes(d.answers[0].replace('Ayer ', 'Ayer nosotros ')));
    }
  });
  assert.ok(seen.pron > 20 && seen.ojala > 5, JSON.stringify(seen));
});
test('Adjektiv anpassen: nur Adjektive, die zum Nomen passen; Possessiv nicht bei „väder“', () => {
  const FIT = app.get('ADJ_FIT_ES'), ADJ = app.get('ADJ_ES');
  withSeed(9, () => {
    for (let i = 0; i < 600; i++) {
      const d = run('genDetEs()');
      if (d.label !== 'Adjektiv anpassen') continue;
      const [, noun, adj] = d.full.split(' ');
      const base = FIT[noun] ? noun : noun.replace(/s$/, '');
      assert.ok(FIT[base], `kein Adjektiv zu ${noun}`);
      assert.ok(FIT[base].split('').map(k => ADJ[k]).includes(d.hint), `${d.hint} passt nicht zu ${noun}`);
      assert.ok(!/^(sangre|gente|leche|sal|verdad|miedo|vez|razón)$/.test(base), d.full);
      assert.ok(adj);
    }
    for (let i = 0; i < 400; i++) { const d = run('genDetSv()'); assert.ok(!/^(mitt|ditt|vårt) (väder|ögonblick)$/.test(d.full), d.full); }
  });
});
test('ser/estar: „nervioso“ und „triste“ nur mit „hoy“, sonst wäre ser auch richtig', () => {
  let n = 0;
  withSeed(3, () => {
    for (let i = 0; i < 1500; i++) {
      const d = run('genSerEstar()');
      if (!/ (nervios|triste)/.test(d.prompt)) continue;
      n++;
      assert.ok(/ hoy\.$/.test(d.prompt) && / heute /.test(d.deLine), d.prompt);
      assert.match(d.note, /ser (nervioso|triste) hieße/);
    }
  });
  assert.ok(n > 5, String(n));
});
test('Präpositionen und Konnektoren: keine falschen Formen wie „con ti“, genau eine passende Option', () => {
  for (const key of ['PREP_ES', 'PREP_SV', 'VERB_ES', 'VERB_SV']) {
    for (const [p, a, opts] of app.get(key)) {
      const full = p.replace('___', a);
      assert.ok(!/\bcon (ti|mí|sí)\b/i.test(full), full);
      assert.equal(opts.filter(o => o.toLowerCase() === a.toLowerCase()).length, 1, full);
      assert.equal(new Set(opts.map(o => o.toLowerCase())).size, 3, full);
    }
  }
  // fiarse en ist (selten) auch richtig, darum keine Option „en“
  const fia = app.get('PREP_ES').find(x => /fía/.test(x[0]));
  assert.ok(!fia[2].includes('en'));
});
test('el oder la: keine Wörter mit zwei richtigen Genera (radio, mar)', () => {
  const es = app.get('GENUS').es.map(x => x[0]);
  assert.ok(!es.includes('radio') && !es.includes('mar'));
  assert.ok(app.run("lookupWord('es', 'radio')"), 'radio bleibt nachschlagbar');
});
test('Fehler finden Spanisch: Erklärung nennt den Auslöser im Satz', () => {
  app.run('BANK_SPOTS_ES = bankSpotsEs()');
  const n = run('BANK_SPOTS_ES.length'), notes = [];
  for (let i = 0; i < n; i++) notes.push(run(`BANK_SPOTS_ES[${i}]()`));
  const q = notes.find(d => d.full === 'Quiero que vengas.');
  assert.ok(q && /querer que/.test(q.note) && /vengas/.test(q.note), q && q.note);
  const p = notes.find(d => d.full === 'La semana pasada perdí las llaves.');
  assert.ok(p && /„la semana pasada“/.test(p.note) && /perdí, nicht he perdido/.test(p.note), p && p.note);
  assert.ok(notes.every(d => d.note && d.note.length > 20));
});
test('Fehler finden Spanisch: keine Sätze, in denen auch der Indikativ stimmt (alguien que, lo que, un … que, aunque)', () => {
  app.run('BANK_SPOTS_ES = bankSpotsEs()');
  const n = run('BANK_SPOTS_ES.length');
  for (let i = 0; i < n; i++) { const d = run(`BANK_SPOTS_ES[${i}]()`); assert.ok(!/\b(alguien que|lo que|un \S+ que|una \S+ que|aunque)\b/i.test(d.full), d.full); }
});
test('Pluralklassen: bestimmte Mehrzahl auf -na oder -en, Zeitwörter nur unbestimmt, Erklärung nennt beide Formen', () => {
  const P = app.get('PLURAL_SV');
  assert.ok(P.length >= 36, String(P.length));
  for (const [sg, art, pl, defPl, , , cls, fl] of P) {
    assert.ok(/(na|en)$/.test(defPl), defPl);
    assert.ok(['en', 'ett'].includes(art), sg);
    assert.ok(app.get('PLURAL_NOTE')[cls], cls);
    assert.ok(['', 'm', 't'].includes(fl), sg);
    assert.ok(pl.length >= 2, sg);
  }
  const seen = new Set();
  withSeed(4, () => {
    for (let i = 0; i < 800; i++) {
      const d = run('genPluralSv()'), n = P.find(x => x[2] === d.answers[0] || x[3] === d.answers[0]);
      assert.ok(n, d.full);
      if (n[7] === 't') assert.ok(!/^(de här|Var är)/.test(d.prompt), d.full);
      if (n[7] !== 'm') assert.ok(!/^Var är/.test(d.prompt), d.full);
      assert.match(d.note, new RegExp(`${n[0]} → ${n[2]}, bestimmt ${n[3]}`));
      seen.add(n[0]);
    }
  });
  assert.ok(seen.size > 40, String(seen.size));
});
test('Verbalperiphrasen: Lücke im Satz, erste Lösung ergibt den vollen Satz, Muster als Hinweis, Thema mit Sätzen', () => {
  const L = app.get('PERI_ES');
  assert.ok(L.length >= 36, String(L.length));
  assert.equal(new Set(L.map(x => x[0])).size, L.length, 'doppelte Sätze');
  for (const [p, ans, pat, de, note] of L) {
    assert.ok(p.includes('___') && ans.length >= 1 && pat && de && note, p);
    assert.doesNotMatch(p.replace('___', ans[0]), /\b(a|de) el\b/i, p);
  }
  const tr = app.get('TRAPS').es.find(t => t.id === 'perifrasis');
  assert.ok(tr && tr.gen === 'perifrasis' && tr.kind === 'form');
  const items = app.get('BANK').es.filter(i => i.trap === 'perifrasis');
  assert.ok(items.length >= 24 && items.every(i => i.note && i.gap), String(items.length));
  assert.ok(app.get('TRAPS').sv.find(t => t.id === 'plural' && t.gen === 'plural_sv'));
});
test('Modalpartikeln: eigenes Satzthema, jede Lücke ist die Partikel, Erklärung je Satz', () => {
  const tr = app.get('TRAPS').sv.find(t => t.id === 'modal');
  assert.ok(tr && tr.kind === 'form');
  const items = app.get('BANK').sv.filter(i => i.trap === 'modal');
  assert.ok(items.length >= 24, String(items.length));
  for (const i of items) {
    assert.ok(i.note && i.gap, i.target);
    assert.ok(/^(ju|väl|nog|jo|visst|då|nu|bara|nämligen|faktiskt|alltså|egentligen|nu en gång)$/i.test(i.gap), i.gap);
  }
});
test('Redewendungen: Satzthema in beiden Sprachen, Lücke auf dem Schlüsselwort, Erklärung mit wörtlicher Bedeutung oder Entsprechung', () => {
  for (const lang of ['sv', 'es']) {
    const tr = app.get('TRAPS')[lang].find(t => t.id === 'idiom');
    assert.ok(tr && tr.kind === 'form', lang);
    const items = app.get('BANK')[lang].filter(i => i.trap === 'idiom');
    assert.ok(items.length >= 24, `${lang}: ${items.length}`);
    for (const i of items) assert.ok(i.note && i.gap && i.note.includes('='), i.target);
  }
});
