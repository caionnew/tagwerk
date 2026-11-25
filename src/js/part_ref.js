/* ---------- Nachschlagen: Themenblatt, Listen, Beispiele im Wörterbuch ---------- */
// Ein typischer Fehler zum Thema, aus denselben Bausteinen wie „Fehler finden“
function typicalError(lang, trap){
  const c = bankSpots(lang).filter(f => f.trap === trap);
  if (c.length) return pick(c)();
  const gen = SPOT_CATS[lang][trap];
  if (!gen) return null;
  for (let k = 0; k < 40; k++) { const d = gen(); if (d.trap === trap) return d; }
  return null;
}
// Drei kurze Beispiele aus der Satzbank, möglichst mit verschiedener Lösung (Grundform des letzten Lückenworts):
// bei „werden“ also ponerse, hacerse, quedarse statt dreimal quedarse, bei por/para beide. Ohne Lücke (Wortstellung) zählt nur die Kürze.
function topicExamples(lang, trap){
  const items = BANK[lang].filter(i => i.trap === trap);
  const seen = items.filter(i => stOf(i.id)), pool = (seen.length >= 3 ? seen : items).slice().sort((a, b) => a.target.length - b.target.length);
  // Schlüssel für „verschiedene Lösung“: Bei einer Auswahl zwischen festen Möglichkeiten (Hinweis „(por/para)“, „(ser/estar)“)
  // entscheidet das erste Wort der Lücke, sonst die Grundform des letzten Worts, das das Wörterbuch kennt (se ha quedado → quedar).
  // Reflexive Grundformen zählen wie die einfachen (quedarse = quedar).
  const lem = w => { const e = lookupWord(lang, w); return e && e.l ? e.l.toLowerCase().replace(/([aei]r)se$/, '$1') : ''; };
  const key = i => {
    const forms = [i.gap].concat(i.gapAlts || []).filter(Boolean).map(g => String(g).toLowerCase().split(' '));
    if (!forms.length) return i.id;
    if (/^\(\S+\/\S+\)$/.test(i.hint || '')) return lem(forms[0][0]) || forms[0][0];
    for (const ws of forms) for (const w of ws.slice().reverse()) { const l = lem(w); if (l) return l; }
    return forms[0][0];
  };
  // Zuerst unter den kürzesten zehn, fehlt dort eine andere Lösung, unter den nächsten zwanzig; erst dann dürfen sich Lösungen wiederholen
  const cand = shuffle(pool.slice(0, 10)).concat(shuffle(pool.slice(10, 30))), out = [], keys = new Set();
  cand.forEach(i => { if (out.length < 3 && !keys.has(key(i))) { out.push(i); keys.add(key(i)); } });
  cand.slice(0, 10).forEach(i => { if (out.length < 3 && !out.includes(i)) out.push(i); });
  return out.map(i => ({ target:i.target, de:i.de }));
}
function openTopic(lang, trap, tab){
  const tr = trapMeta(lang, trap); if (!tr) return;
  let examples;
  if (tr.kind === 'gen' && tr.gen) examples = Array.from({ length:3 }, () => { const d = GENS[tr.gen].make(); return { target:d.full || d.answers[0], de:d.deLine || (d.gap ? '' : d.prompt) }; });
  else examples = topicExamples(lang, trap);
  S.pop = { type:'topic', lang, trap, examples, err:typicalError(lang, trap), tab:tab || 'rule' };
  renderPopup();
}
// Themenblatt mit zwei Reitern (seit 24.75): „Regel“ (Erklärung, Beispiele, typischer Fehler) und „Deine Zahlen“. Aus der
// Themenliste in Fortschritt öffnet es auf „Deine Zahlen“, sonst auf „Regel“.
function topicSheetHtml(P){
  const tr = trapMeta(P.lang, P.trap), lang = P.lang, num = P.tab === 'num', err = P.err;
  const seg = `<div class="minseg dseg" role="radiogroup">${[['rule', 'Regel'], ['num', 'Deine Zahlen']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${(P.tab || 'rule') === k}" data-a="toptab" data-t="${k}">${l}</button>`).join('')}</div>`;
  const rule = `<p class="popde"><b>${termify(tr.short)}</b></p>
    ${tr.table ? `<div class="ttab">${tr.table.map(([v, when, ex]) => `<div class="tt-r"><span class="tt-v" lang="${lang}">${esc(v)}</span><span class="tt-d">${esc(when)}<span class="tt-x" lang="${lang}">${esc(ex)}</span></span></div>`).join('')}</div>` : ''}
    ${tr.rule ? `<p class="pop-t">${termify(tr.rule)}</p>` : ''}
    ${P.examples.length ? `<p class="pop-sub">Beispiele</p><ul class="exl">${P.examples.map(x => `<li><span class="wordrow" lang="${lang}">${linkWords(x.target, lang)}</span>${x.de ? `<span class="exg">${esc(x.de)}</span>` : ''}</li>`).join('')}</ul>` : ''}
    ${err ? `<p class="pop-sub">Typischer Fehler</p><p class="errx" lang="${lang}">${err.words.map((w, i) => err.wrong.includes(i) ? `<span class="w-bad">${esc(w)}</span>` : esc(w)).join(' ')}</p><p class="okx" lang="${lang}">${esc(err.full)}</p>` : ''}`;
  return `<div class="popov" data-a="popclose"></div><div class="pop tall" role="dialog" aria-label="${esc(tr.label)}">
    <p class="find-k">Thema</p><p class="pop-h">${esc(keepHyph(tr.label))}</p>${seg}
    ${num ? topicNumbersHtml(lang, P.trap) : rule}
    <div class="popfoot"><button type="button" class="ghost" data-a="popclose">Schließen</button>${S.view === 'run' ? '' : `<button type="button" class="primary" data-a="trapgo" data-l="${lang}" data-t="${P.trap}">10 Aufgaben üben</button>`}</div>
  </div>`;
}
// „Deine Zahlen“: Schätzung, Veränderung (die Quelle des Pfeils in der Themenliste), Verlauf über 12 Wochen, Stand der Sätze,
// Etappen und Sätze, die du bei Wiederholungen nicht wusstest. Hier steht auch „gefestigt“ je Thema.
function topicNumbersHtml(lang, trap){
  const M = topicModel(lang), x = M.topics.find(t => t.id === trap), clear = clearSet(lang).has(trap);
  let h = '';
  if (M.fitted && x && x.n >= MODEL.MIN_N) {
    const max = modelScale([x], M.mu);
    h += `<p class="dbig">${pctPill(x.mean, clear)}<span>geschätzt falsch${clear ? ', klar über Schnitt' : ''}</span></p>${modelStripHtml(x, M.mu, max)}${modelAxisHtml(max)}
      <p class="dsub">Wahrscheinlich ${pct(x.lo)} bis ${pct(x.hi)}; mit ${probPct(x.pAbove)} Wahrscheinlichkeit über deinem <button type="button" class="term" data-a="term" data-k="schaetzung">Schnitt</button> von ${pct(M.mu)}.</p>`;
  } else h += `<p class="dtxt">Noch zu wenige Aufgaben für eine Schätzung${x && x.n30 ? `; letzte 30 Tage ${x.k30} von ${x.n30} falsch` : ''}.</p>`;
  // Veränderung: dieselben Zahlen wie der Pfeil, montags neu
  const C = topicChange(lang), c = C.topics[trap], cnt = v => (v && v.n ? `${pct(v.k / v.n)} (${v.k} von ${v.n})` : 'keine Aufgaben');
  h += '<p class="pop-sub">Veränderung</p>';
  if (!C.ready) h += `<p class="dtxt">${x && x.n30 ? `Letzte 30 Tage ${x.k30} von ${x.n30} falsch. ` : ''}${C.from ? `Ab ${fmtDayShort(C.from)} vergleicht` : 'Sobald acht Wochen Aufgaben da sind, vergleicht'} die App jeden Montag die letzten vier Wochen mit den vier davor.</p>`;
  else {
    const head = `Vier Wochen bis ${fmtDM(addDays(C.mon, -1))}: ${cnt(c && c.A)} falsch, die vier davor ${cnt(c && c.B)}`;
    const tail = !c || c.p == null ? '. Zu wenige für einen Vergleich, es braucht je 5 Aufgaben.'
      : c.lvl ? `: <b class="dchg"><span class="nobr">${arrowSvg(c.better, c.lvl)}${changeWord(c).replace(' ', '</span> ')}</b>.`
      : Math.round(Math.max(c.p, 1 - c.p) * 100) === 50 ? ': besser und schlechter gleich wahrscheinlich, kein Pfeil.' : `: ${changeWord(c)}, zu unsicher für einen Pfeil.`;
    h += `<p class="dtxt">${head}${tail}</p>`;
  }
  const H = topicHistory(lang, trap);
  if (H.filter(w => w.mean != null).length >= 2) h += `<p class="pop-sub">Verlauf, 12 Wochen</p>${historySvg(H)}<p class="legend"><span class="mkey"><span><i class="dk-line"></i>Schätzung</span><span><i class="mk-band"></i>50 %</span><span><i class="dk-raw"></i>Woche, Größe nach Anzahl</span><span><i class="dk-mu"></i>Schnitt</span></span></p>`;
  // Stand der Sätze (Satz-Themen) mit dem Zuwachs an gefestigten seit 30 Tagen (bis 24.74 im Themenraster)
  const items = BANK[lang].filter(i => i.trap === trap);
  if (items.length) {
    const seen = items.filter(i => stOf(i.id)).length, mat = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length, ago = snapAgo(lang, 30), d = ago && ago.t ? mat - (ago.t[trap] || 0) : 0;
    h += `<p class="pop-sub">Stand</p><p class="dtxt">${items.length} Sätze im Thema, ${seen} geübt, ${mat} <button type="button" class="term" data-a="term" data-k="gefestigt">gefestigt</button>${d > 0 ? `, ${d} mehr als vor 30 Tagen` : ''}.</p>`;
  }
  // Etappen des Themas (part_stats.js): erreichte und, solange keine da ist, wie weit die Blöcke sind
  const et = (Array.isArray(DB.etap) ? DB.etap : []).filter(e => e.l === lang && e.k === trap), bl = ((DB.tblk || {})[lang] || {})[trap], done = bl ? bl.b.length * TOPIC_BLOCK + bl.cn : 0;
  h += `<p class="pop-sub">Etappen</p>${et.length ? `<ul class="dlist">${et.map(e => `<li><span class="dl-d">${fmtDM(e.d)}</span>${e.s === 2 ? 'Thema sitzt' : 'Fehler halbiert'}${e.b && e.c ? `: ${pct(e.b[1] / e.b[0], true)} → ${pct(e.c[1] / e.c[0], true)}` : ''}</li>`).join('')}</ul>`
    : `<p class="dtxt">Noch keine. Geprüft wird alle ${TOPIC_BLOCK} Aufgaben im Thema, zuerst nach ${2 * TOPIC_BLOCK}${done ? `; bisher ${done}` : ''}.</p>`}`;
  // Sätze des Themas, die du bei Wiederholungen nicht wusstest (lapses), die häufigsten zuerst
  const miss = items.filter(i => (stOf(i.id) || {}).lapses >= 1).sort((p, q) => stOf(q.id).lapses - stOf(p.id).lapses || String(stOf(q.id).last || '').localeCompare(String(stOf(p.id).last || ''))).slice(0, 3);
  if (miss.length) h += `<p class="pop-sub">Bei Wiederholungen nicht gewusst</p><ul class="exl">${miss.map(i => `<li><span class="wordrow" lang="${lang}">${linkWords(i.target, lang)}</span><span class="exg">${esc(i.de)} · ${stOf(i.id).lapses}×</span></li>`).join('')}</ul>`;
  return h;
}
// Verlauf: Linie und Fläche = Schätzung mit 50-%-Bereich am Ende jeder Woche, gestrichelt der Schnitt, Punkte = rohe Wochenquote
// (Fläche nach Anzahl der Aufgaben). Skala bis 50, 75 oder 100 %; eine Wochenquote darüber sitzt am oberen Rand.
function historySvg(H){
  const W = 320, Ht = 140, L = 30, R = 8, T = 10, B = 22, xs = i => L + i * (W - L - R) / 11;
  const est = H.map((w, i) => Object.assign({ i }, w)).filter(w => w.mean != null);
  const top = rateScale(Math.max(0.01, ...est.map(w => Math.max(w.hi50, w.mu)), ...H.filter(w => w.n >= 5).map(w => w.k / w.n))), y = v => T + (1 - Math.min(top, v) / top) * (Ht - T - B);
  let g = Array.from({ length:top < 1 ? top * 4 + 1 : 3 }, (_, i) => i * (top < 1 ? 0.25 : 0.5)).map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="gl"/><text x="${L - 4}" y="${(y(v) + 3).toFixed(1)}" class="yl">${Math.round(v * 100)}${v === top ? ' %' : ''}</text>`).join('');
  const P = (w, v) => `${xs(w.i).toFixed(1)},${y(v).toFixed(1)}`;
  g += `<polygon points="${est.map(w => P(w, w.hi50)).concat(est.slice().reverse().map(w => P(w, w.lo50))).join(' ')}" class="cband"/>`;
  g += `<polyline points="${est.map(w => P(w, w.mu)).join(' ')}" class="cmu"/><polyline points="${est.map(w => P(w, w.mean)).join(' ')}" class="cline"/>`;
  H.forEach((w, i) => { if (w.n) g += `<circle cx="${xs(i).toFixed(1)}" cy="${y(w.k / w.n).toFixed(1)}" r="${Math.min(6, 1.5 + Math.sqrt(w.n) * 0.6).toFixed(1)}" class="craw"/>`; });
  const now = est[est.length - 1]; if (now && now.i === 11) g += `<circle cx="${xs(11).toFixed(1)}" cy="${y(now.mean).toFixed(1)}" r="4" class="cnow"/>`;
  [[3, 'vor 8 Wochen'], [7, 'vor 4 Wochen'], [11, 'jetzt']].forEach(([i, t]) => { g += `<text x="${xs(i).toFixed(1)}" y="${Ht - 6}" class="xl${i === 11 ? ' xe' : ''}">${t}</text>`; });
  return `<svg viewBox="0 0 ${W} ${Ht}" class="dsvg" role="img" aria-label="Verlauf der geschätzten Fehlerquote über 12 Wochen">${g}</svg>`;
}
// Wo kommt das Wort sonst noch vor? Bevorzugt Sätze, die du schon geübt hast
function examplesFor(lang, w){
  const k = String(w).toLowerCase();
  const hits = BANK[lang].filter(i => tokens(i.target).some(t => t.toLowerCase() === k));
  return hits.sort((a, b) => (stOf(b.id) ? 1 : 0) - (stOf(a.id) ? 1 : 0) || a.target.length - b.target.length).slice(0, 2);
}
// Nächster Termin eines Fests ab heute
function nextDateOf(ev){
  const t = today(), y = dateOf(t).getFullYear();
  for (const yy of [y, y + 1]) { const dt = ev[1](yy); if (dt && dayDiff(ymd(dt), t) >= 0) return dt; }
  return null;
}
function viewRef(){
  const lang = S.lang, kind = S.ref, back = S.refFrom || 'extra';
  if (kind === 'topics') {
    return backBar('Grammatik kurz erklärt', back) + `<p class="lead-s">Alle Themen mit Regel, Beispielen und typischem Fehler.</p><div class="rows">${TRAPS[lang].map(tr => `<button type="button" class="row" data-a="topic" data-t="${tr.id}"><span class="txt"><span class="rt">${esc(tr.label)}</span><span class="rd">${esc(tr.short.length > 90 ? tr.short.slice(0, 88).replace(/\s\S*$/, '') + ' …' : tr.short)}</span></span></button>`).join('')}</div>`;
  }
  if (kind === 'kultur') return viewKultur(back);
  if (kind === 'terms') {
    return backBar('Grammatik-Begriffe', back) + `<p class="lead-s">Die Fachwörter aus den Erklärungen, in Alltagssprache und mit ${lang === 'sv' ? 'schwedischen' : 'spanischen'} Beispielen. In jeder Erklärung kannst du sie auch direkt antippen.</p><div class="rows">${termsFor(lang).sort((a, b) => a.t.localeCompare(b.t, 'de')).map(t => `<button type="button" class="row" data-a="term" data-k="${t.k}"><span class="txt"><span class="rt">${esc(t.t)}</span><span class="rd">${esc(t[lang][0].split('. ')[0].replace(/\.$/, ''))}.</span></span></button>`).join('')}</div>
      <h2 class="grp">Begriffe der App</h2><div class="rows">${TERMS.filter(t => t.app).sort((a, b) => a.t.localeCompare(b.t, 'de')).map(t => `<button type="button" class="row" data-a="term" data-k="${t.k}"><span class="txt"><span class="rt">${esc(t.t)}</span><span class="rd">${esc(t.app[0].split(/[.:] /)[0].replace(/\.$/, ''))}.</span></span></button>`).join('')}</div>`;
  }
  if (kind === 'friends') {
    return backBar('Falsche Freunde', back) + `<p class="lead-s">Wörter, die nach Deutsch klingen und etwas anderes bedeuten.</p><div class="rows">${FALSE_FRIENDS[lang].map(f => `<div class="row static ffrow"><span class="txt"><span class="rt"><span class="wordrow" lang="${lang}">${linkWords(f[0], lang)}</span> = ${esc(f[1])}</span><span class="rd">${esc(capFirst(f[2]))}.</span></span></div>`).join('')}</div>`;
  }
  const list = EVENTS[lang].map(ev => ({ ev, dt:nextDateOf(ev) })).filter(x => x.dt).sort((a, b) => a.dt - b.dt);
  return backBar(lang === 'sv' ? 'Feste in Schweden' : 'Feste in der spanischsprachigen Welt', back) + `<p class="lead-s">Nach dem nächsten Termin sortiert.</p><div class="rows">${list.map(({ ev, dt }) => { const n = dayDiff(ymd(dt), today()); return `<div class="row static feast"><span class="txt"><span class="rt">${esc(ev[0])}<span class="find-d"> · ${dt.getDate()}. ${MONTHS_FULL[dt.getMonth()]}${n === 0 ? ' · heute' : n === 1 ? ' · morgen' : n < 60 ? ` · in ${n} Tagen` : ''}</span></span><span class="rd">${esc(ev[2])}</span><span class="feast-p"><span class="wordrow" lang="${lang}">${linkWords(ev[3], lang)}</span> <span class="find-g">${esc(ev[4])}</span></span></span>${speakBtn(ev[3], lang)}</div>`; }).join('')}</div>`;
}

// Land & Leute: Karte und Sammlung. Der Beispielsatz lässt sich in die eigenen Sätze übernehmen, passende Lesetexte sind verlinkt.
function kulturBody(e, lang, small){
  const owned = (DB.own[lang] || []).some(o => o.target === e.ex[0]);
  const add = owned ? '<span class="kadd on">✓ Im Tagwerk</span>' : `<button type="button" class="kadd" data-a="kultadd" data-id="${e.id}" aria-label="Beispielsatz ins Tagwerk übernehmen">Ins Tagwerk</button>`;
  const texts = small ? [] : (e.txt || []).map(id => textById(lang, id)).filter(Boolean);
  return `<div class="khead"><p class="find-h"><span class="wordrow" lang="${lang}">${linkWords(e.title, lang)}</span></p>${add}</div>
    <p class="find-t">${esc(e.text)}</p>
    ${e.map ? mapSvg(e.map, mapLabel(e), small) : ''}
    ${e.vars ? `<div class="kvars">${e.vars.map((v, i) => `<div class="kvar${v[0] ? '' : ' nf'}">${v[0] ? `<span class="kf" aria-hidden="true">${v[0]}</span>` : ''}<span class="kw" lang="${lang}">${e.map && e.map.g && i < e.map.g.length ? `<span class="kdot mg${i}${(e.map.soft || []).includes(i) ? ' msoft' : ''}" aria-hidden="true"></span>` : ''}${esc(v[1])}</span><span class="kr">${esc(v[2])}</span></div>`).join('')}</div>` : ''}
    <div class="find-p"><span class="wordrow" lang="${lang}">${linkWords(e.ex[0], lang)}</span>${speakBtn(e.ex[0], lang)}<span class="find-g">${esc(e.ex[1])}</span></div>
    ${texts.length ? `<p class="kmore">${texts.length > 1 ? 'Lesetexte' : 'Lesetext'}: ${texts.map(t => `<button type="button" class="link" data-a="textopen" data-id="${t.id}" data-back="ref">${esc(t.title)}</button>`).join(' · ')}</p>` : ''}`;
}
// Übersicht: Filter nach Kategorie (mit Anzahl), Kategorien mit den Karten zuerst
function viewKultur(back){
  const lang = S.lang, list = KULTUR[lang], cats = Object.keys(KULTUR_CATS).filter(c => list.some(e => e.cat === c));
  const cur = cats.includes(S.kultCat) ? S.kultCat : 'alle';
  const chip = (c, label, n) => `<button type="button" role="radio" aria-checked="${cur === c}" data-a="kultcat" data-c="${c}">${label}<span class="kn">${n}</span></button>`;
  const cards = items => items.map(e => `<section class="find kcard">${kulturBody(e, lang)}</section>`).join('');
  return backBar('Land & Leute', back) + `<p class="lead-s">${lang === 'sv' ? 'Schweden und das Schwedische' : 'Spanien, Lateinamerika und das Spanische'} in ${list.length} Einblicken. „Ins Tagwerk“ übernimmt den Beispielsatz in deine Wiederholungen.</p>`
    + `<div class="kchips" role="radiogroup" aria-label="Kategorie">${chip('alle', 'Alle', list.length)}${cats.map(c => chip(c, KULTUR_CATS[c], list.filter(e => e.cat === c).length)).join('')}</div>`
    + (cur === 'alle' ? cats.map(c => `<h2 class="grp">${KULTUR_CATS[c]}</h2>${cards(list.filter(e => e.cat === c))}`).join('') : cards(list.filter(e => e.cat === cur)));
}

// Karten: Länder in Gruppenfarben, passend zu den Punkten an den Zeilen darunter. Daten aus geo.js (Natural Earth).
let mapSeq = 0;
function mapSvg(m, label, small){
  const g = GEO[m.v]; if (!g) return '';
  const col = {}; (m.g || []).forEach((keys, i) => keys.forEach(k => { col[k] = i; }));
  // soft: ganze Gruppe heller (Minderheit), half: einzelne Gebiete heller (gilt dort nur in einem Teil)
  const cls = k => col[k] != null ? `mg${col[k]}${(m.soft || []).includes(col[k]) || (m.half || []).includes(k) ? ' msoft' : ''}` : (m.ctx || []).includes(k) ? 'mctx' : 'mland';
  let extra = '';
  if (m.norrland && g.c.SWE) { const id = 'nc' + (++mapSeq); extra += `<clipPath id="${id}"><path d="${g.norrClip}"/></clipPath><path d="${g.c.SWE}" clip-path="url(#${id})" class="mnorr"/>`; }
  // Ein Teil eines Landes in Gruppenfarbe, etwa Schonen: das Land, beschnitten auf die Region
  if (m.clip && g.c[m.clip.k] && g[m.clip.p]) { const id = 'kc' + (++mapSeq); extra += `<clipPath id="${id}"><path d="${g[m.clip.p]}"/></clipPath><path d="${g.c[m.clip.k]}" clip-path="url(#${id})" class="mg${m.clip.g}"/>`; }
  if (m.polar && g.polar) extra += `<path d="${g.polar}" class="mpolar"/><text x="6" y="${(g.pts.Kiruna ? g.pts.Kiruna[1] + 12 : 40)}" class="mlab mlab-s">Polarkreis</text>`;
  // Ortsname rechts vom Punkt, mit „<“ am Ende links davon
  (m.pts || []).forEach(raw => { const left = raw.endsWith('<'), n = raw.replace(/[<>]$/, ''), p = g.pts[n]; if (!p) return; const right = raw.endsWith('>') || (!left && p[0] < g.w * 0.62); extra += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" class="mpt"/><text x="${p[0] + (right ? 5 : -5)}" y="${p[1] + 3.5}" text-anchor="${right ? 'start' : 'end'}" class="mlab">${n}</text>`; });
  return `<svg class="map${small ? ' map-sm' : ''} map-${m.v}" viewBox="0 0 ${g.w} ${g.h}" role="img" aria-label="${esc(label)}"><path d="${g.base}" class="mland"/>${g.frame ? `<path d="${g.frame}" class="mframe"/>` : ''}${Object.keys(g.c).map(k => `<path d="${g.c[k]}" class="${cls(k)}"/>`).join('')}${extra}</svg>`;
}
function mapLabel(e){
  if (e.vars && e.map && e.map.g && e.map.g.length) return 'Karte: ' + e.vars.slice(0, e.map.g.length).map(v => `${v[1]}: ${v[2]}`).join('; ');
  return 'Karte zu ' + e.title;
}
