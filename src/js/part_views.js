/* ---------- Ansichten ---------- */
const FOCUS_VIEWS = ['run', 'runDone', 'radio', 'texts', 'text', 'shadow', 'write', 'own', 'tat', 'pickTopic', 'pickGen', 'settings', 'ref'];
const linkWords = (text, lang) => String(text).split(' ').map(w => /[A-Za-zÀ-ÿ0-9]/.test(w) ? `<span data-a="lookup" data-w="${esc(w.replace(/^[¿¡"„“«(]+|[.!?,;:"„“”»)…]+$/g, ''))}">${esc(w)}</span>` : esc(w)).join(' ');
const MONTHS_FULL = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function monthRecap(){
  const t = today(), day = Number(t.slice(8, 10));
  // Nach dem ersten Tagwerk des Monats steht die Bilanz am Rundenende (monthCard); hier dann nicht noch einmal
  if (day > 7 || (DB.used && (DB.used.monthShown || '') >= t.slice(0, 7))) return '';
  const y = Number(t.slice(0, 4)), m = Number(t.slice(5, 7));
  const pm = m === 1 ? 12 : m - 1, py = m === 1 ? y - 1 : y, prefix = `${py}-${String(pm).padStart(2, '0')}-`;
  let days = 0, n = 0, secs = 0, mat = 0;
  Object.keys(DB.log).filter(k => k.startsWith(prefix)).forEach(k => {
    let any = false;
    ['sv', 'es'].forEach(l => { const x = dayLog(k, l); if (x.n) { any = true; n += x.n; } secs += x.secs || 0; mat += x.mat || 0; });
    if (any) days++;
  });
  if (!n) return '';
  let yearLine = '';
  if (m === 1) {
    let yd = 0, yn = 0, ys = 0, ym = 0;
    Object.keys(DB.log).filter(k => k.startsWith(`${y - 1}-`)).forEach(k => { let any = false; ['sv', 'es'].forEach(l => { const x = dayLog(k, l); if (x.n) { any = true; yn += x.n; } ys += x.secs || 0; ym += x.mat || 0; }); if (any) yd++; });
    if (yd) yearLine = `<p class="recap"><b>Dein Jahr ${y - 1}:</b> an ${plural(yd, 'Tag', 'Tagen')} geübt, ${yn.toLocaleString('de-DE')} Aufgaben${ys ? `, ${fmtMin(ys)}` : ''}${ym ? `, ${plural(ym, 'Satz', 'Sätze')} neu gefestigt` : ''}.</p>`;
  }
  return yearLine + `<p class="recap"><b>${MONTHS_FULL[pm - 1]}:</b> an ${plural(days, 'Tag', 'Tagen')} geübt, ${n} Aufgaben${secs ? `, ${fmtMin(secs)}` : ''}${mat ? `, ${plural(mat, 'Satz', 'Sätze')} neu gefestigt` : ''}.</p>`;
}
const langSeg = () => `<div class="langseg" role="radiogroup" aria-label="Sprache">${['es', 'sv'].map(k => `<button type="button" role="radio" aria-checked="${S.lang === k}" data-a="lang" data-l="${k}" lang="${k}">${LANG[k].name}</button>`).join('')}</div>`;
const noticeHtml = () => (S.notice ? `<div class="notice ${S.notice.kind}" role="status"><span>${esc(S.notice.text)}</span>${S.notice.action ? `<button type="button" class="link" data-a="${S.notice.action.a}">${esc(S.notice.action.label)}</button>` : ''}</div>` : '');
const charbar = lang => `<div class="chars">${LANG[lang].chars.map(c => `<button type="button" class="ch" data-a="char" data-c="${c}" lang="${lang}" aria-label="${c} einfügen">${c}</button>`).join('')}</div>`;
const backBar = (title, to) => `<div class="backbar"><button type="button" class="x" data-a="tab" data-v="${to || 'extra'}" aria-label="Zurück">‹</button><h1 class="vt">${esc(title)}</h1></div>`;
const row = (a, title, desc, extra, ico) => `<button type="button" class="row${ICONS[ico || a] ? ' has-ico' : ''}" data-a="${a}"${extra || ''}>${ICONS[ico || a] ? `<span class="rico">${ICONS[ico || a]}</span>` : ''}<span class="txt"><span class="rt">${esc(title)}</span>${desc ? `<span class="rd">${esc(desc)}</span>` : ''}</span></button>`;

function tabs(){
  const nav = $('#tabs');
  const focus = FOCUS_VIEWS.includes(S.view);
  nav.hidden = focus;
  document.body.classList.toggle('focus', focus);
  if (focus) return;
  let active = S.view;
  if (S.view === 'runDone') active = S.run && S.run.kind === 'daily' ? 'home' : 'extra';
  nav.innerHTML = [['home','Heute'], ['extra','Üben'], ['progress','Fortschritt']].map(([v, l]) => `<button type="button" data-a="tab" data-v="${v}"${active === v ? ' aria-current="page"' : ''}>${ICONS[v]}<span>${l}</span></button>`).join('');
}
const GEAR = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>';
const gearBtn = () => `<button type="button" class="iconbtn" data-a="settings" aria-label="Einstellungen">${GEAR}</button>`;
function topLine(){ return `<div class="topline">${langSeg()}${gearBtn()}</div>`; }
// Woche im Kopf von „Heute“: dieselbe Kodierung wie die Übungstage (gefüllt = Tagwerk, Farbe = Sprache, beide geteilt;
// Rand = nur geübt; gestrichelt = Pausetag, die Serie hält). Zwei Teile für zwei Zeilen: die Quadrate stehen auf der
// Grundlinie des Grußes, die Serie auf der Grundlinie des Datums. Beide führen zum Kalender; vorgelesen wird nur das erste.
function weekStrip(){
  // Die letzten sieben Tage bis heute (statt Kalenderwoche): auch montags aussagekräftig
  const sd = streakData(), t = today(), y = addDays(t, -1);
  const cells = Array.from({ length:7 }, (_, i) => addDays(t, i - 6)).map(ds => {
    const sv = (dayLog(ds, 'sv').n || 0) > 0, es = (dayLog(ds, 'es').n || 0) > 0;
    let cls = '';
    if (DB.done[ds]) { const a = doneIn(ds, 'sv'), b = doneIn(ds, 'es'); cls = a && b ? 'db' : a ? 'ds' : b ? 'de' : sv && es ? 'db' : sv ? 'ds' : 'de'; }
    else if (sv || es) cls = sv && es ? 'pb' : sv ? 'ps' : 'pe';
    else if (sd.free.has(ds)) cls = 'fr';
    return `<span class="wk${cls ? ' ' + cls : ''}${ds === t ? ' now' : ''}${ds > t ? ' fut' : ''}${ds === t && S.justDone === t ? ' fillnow' : ''}"><i></i></span>`;
  }).join('');
  const risk = sd.current && !DB.done[t] && sd.free.has(y);
  const cap = sd.current ? `${sd.current} in Folge` : 'Serie startet heute';
  const label = `${plural(sd.current, 'Tag', 'Tage')} in Folge${DB.done[t] ? ', heute erledigt' : risk ? ', gestern war dein Pausetag, heute braucht es ein Tagwerk' : ''}`;
  return {
    strip:`<button type="button" class="weekstrip" data-a="tab" data-v="progress" aria-label="${label}. Zum Kalender"><span class="wks">${cells}</span></button>`,
    count:`<button type="button" class="wkc${risk ? ' warn' : ''}" data-a="tab" data-v="progress" tabindex="-1" aria-hidden="true">${risk ? 'heute nötig' : cap}</button>`
  };
}
function findHtml(lang){
  const f = fundstueck(lang);
  if (f.kind === 'event') {
    const when = f.diff === 0 ? 'heute' : f.diff === 1 ? 'morgen' : `in ${f.diff} Tagen`;
    return `<section class="find"><p class="find-k">${lang === 'sv' ? 'Bald in Schweden' : 'Bald in der spanischsprachigen Welt'} · ${when}</p>
      <p class="find-h">${esc(f.ev[0])}<span class="find-d"> · ${f.dt.getDate()}. ${MONTHS_FULL[f.dt.getMonth()]}</span></p>
      <p class="find-t">${esc(f.ev[2])}</p>
      <div class="find-p"><span class="wordrow" lang="${lang}">${linkWords(f.ev[3], lang)}</span>${speakBtn(f.ev[3], lang)}<span class="find-g">${esc(f.ev[4])}</span></div>
      <button type="button" class="link find-more" data-a="ref" data-r="feasts">Alle Feste im Jahr</button></section>`;
  }
  if (f.kind === 'recall') {
    const open = S.findOpen === f.item.id;
    const ago = f.ago < 14 ? `vor ${f.ago} Tagen` : f.ago < 60 ? `vor ${Math.round(f.ago / 7)} Wochen` : `vor ${Math.round(f.ago / 30)} Monaten`;
    return `<section class="find"><p class="find-k">Erinnerst du dich? · zuletzt ${ago} geübt</p>
      <p class="find-h find-de" lang="de">${esc(f.item.de)}</p>
      ${open ? `<div class="find-p reveal"><span class="wordrow" lang="${lang}">${linkWords(f.item.target, lang)}</span>${speakBtn(f.item.target, lang)}</div><p class="find-g" style="margin:6px 0 0">Zählt nicht für den Wiederholungsplan.</p>` : `<button type="button" class="link" data-a="findopen" data-id="${f.item.id}">Auflösen</button>`}</section>`;
  }
  if (f.kind === 'kultur') return `<section class="find"><p class="find-k">Land & Leute · ${KULTUR_CATS[f.e.cat]}</p>${kulturBody(f.e, lang, true)}<button type="button" class="link find-more" data-a="ref" data-r="kultur">Alle ${KULTUR[lang].length} ansehen</button></section>`;
  const ff = f.ff;
  return `<section class="find"><p class="find-k">Falscher Freund</p>
    <p class="find-h"><span class="wordrow" lang="${lang}">${esc(ff[0])}</span> = ${esc(ff[1])}</p>
    <p class="find-t">Achtung: ${esc(ff[2])}.</p>
    <button type="button" class="link find-more" data-a="ref" data-r="friends">Alle ${FALSE_FRIENDS[lang].length} falschen Freunde</button></section>`;
}
function backupHint(){
  const tot = totals(), t = today();
  if (tot.days < 30) return '';
  const since = DB.lastBackup ? dayDiff(t, DB.lastBackup) : tot.days;
  const nag = DB.used && DB.used.backupNag;
  if (since < 90 || (nag && dayDiff(t, nag) < 30)) return '';
  return `<div class="notice ok"><span>${DB.lastBackup ? `Dein letztes Backup ist ${Math.round(since / 30)} Monate her.` : `Du übst seit ${tot.days} Tagen und hast noch kein Backup.`} Der Fortschritt liegt nur auf diesem Gerät.</span><button type="button" class="link" data-a="export">Sichern</button><button type="button" class="link dim" data-a="nagoff">Später</button></div>`;
}
function viewHome(){
  const lang = S.lang;
  const od = openDaily();
  const running = od && od.lang === lang;
  const doneToday = doneIn(today(), lang), dayDone = !!DB.done[today()], doneOther = dayDone && !doneToday ? activeLangs().find(l => l !== lang && doneIn(today(), l)) : null;
  const intro = !(DB.used && DB.used.intro) ? `<section class="intro"><p class="intro-h">So funktioniert Tagwerk</p><p>Einmal am Tag eine Runde von etwa 5 bis 10 Minuten: neue Sätze, Wiederholungen und kurzes Grammatik-Training. Jeder Satz kommt wieder, bevor du ihn vergessen würdest. Was du nicht wusstest, schon am nächsten Tag, was sitzt, erst nach Wochen.</p><button type="button" class="link" data-a="introok">Verstanden</button></section>` : '';
  let card;
  if (running) {
    const left = od.queue.length - od.idx;
    card = `<p class="eyebrow">Tagwerk läuft</p><p class="num">Noch ${plural(left, 'Aufgabe', 'Aufgaben')}</p><p class="breakdown">Etwa ${minutes(od.queue.slice(od.idx), od.lang)} Minuten. Du machst dort weiter, wo du aufgehört hast.</p><button type="button" class="primary" data-a="daily">Fortsetzen</button>`;
  } else if (doneToday) {
    // Die andere Sprache erst hier, als Angebot: vorher wählt die App die Sprache des Tages nach Bedarf, und oben lässt sie sich wechseln
    const other = activeLangs().find(l => l !== lang), op = other && !doneIn(today(), other) ? dailyPlan(other) : null;
    const otherRow = op && op.queue.length ? `<button type="button" class="row" data-a="otherdaily" data-l="${other}"><span class="txt"><span class="rt">${LANG[other].deName}-Tagwerk zusätzlich</span><span class="rd">Etwa ${minutes(op.queue, other)} Minuten${[op.due ? plural(op.due, 'Wiederholung', 'Wiederholungen') : '', op.fresh ? plural(op.fresh, 'neuer Satz', 'neue Sätze') : '', op.genN ? plural(op.genN, 'Grammatik-Aufgabe', 'Grammatik-Aufgaben') : ''].filter(Boolean).map((x, i) => (i ? ', ' : ': ') + x).join('')}.</span></span></button>` : '';
    card = `<p class="eyebrow">Heute</p><p class="num">Tagwerk erledigt</p>${todayHtml(lang)}<p class="breakdown">Wenn du noch Zeit hast:</p>
      <div class="choices">
        ${otherRow}
        <button type="button" class="row" data-a="tab" data-v="extra"><span class="txt"><span class="rt">Weiter üben</span><span class="rd">Kurze Runden, Grammatik, Lesen, Schreiben</span></span></button>
        ${(() => { const avail = BANK[lang].filter(i => !stOf(i.id)).length; if (!avail) return ''; const opts = [3, 6, 10].filter(n => n <= avail); if (!opts.length) opts.push(avail);
          return `<div class="row chiprow"><span class="txt"><span class="rt">Weitere neue Sätze lernen</span><span class="rd">Ab morgen in der Wiederholung</span></span><span class="chips" role="group" aria-label="Wie viele?">${opts.map(n => `<button type="button" class="chip" data-a="moreNew" data-n="${n}">${n}</button>`).join('')}</span></div>`; })()}
      </div>`;
  } else {
    const p = dailyPlan(lang);
    const parts = [];
    if (p.due) parts.push(`<li><b>${p.due}</b> ${p.due === 1 ? 'Wiederholung' : 'Wiederholungen'}<span>Sätze, die heute wieder dran sind</span></li>`);
    if (p.fresh) parts.push(`<li><b>${p.fresh}</b> ${p.fresh === 1 ? 'neuer Satz' : 'neue Sätze'}<span>gezielt zu typischen Fehlern</span></li>`);
    if (p.genN) { const lab = p.genLabels; parts.push(`<li><b>${p.genN}</b> Grammatik-Aufgaben<span>${esc(lab.length > 2 ? `${lab.slice(0, 2).join(', ')} und ${lab.length - 2} weitere` : lab.join(' und '))}</span></li>`); }
    card = `<p class="eyebrow">${doneOther ? `Zusätzlich · ${LANG[lang].deName}-Tagwerk` : `Heute · ${LANG[lang].deName}-Tagwerk`}</p><p class="num">${plural(p.queue.length, 'Aufgabe', 'Aufgaben')}<span class="num-s">etwa ${minutes(p.queue, lang)} Min.</span></p>${doneOther ? `<p class="hint" style="margin-top:2px">Dein Tagwerk für heute ist mit ${LANG[doneOther].deName} erledigt. Dieses ist freiwillig.</p>` : ''}
      <ul class="plan2">${parts.join('')}</ul>
      ${(() => { const ft = focusTrap(lang); return ft ? `<p class="hint focusline">Schwerpunkt der Woche: <b>${esc(trapMeta(lang, ft).label)}</b> <button type="button" class="link" data-a="focusnext">Ändern</button></p>` : ''; })()}
      <button type="button" class="primary" data-a="daily">${LANG[lang].deName}-Tagwerk starten</button>
      <p class="hint lenlink">${size().label}, ${size().newPer} neue Sätze pro Tag <button type="button" class="link" data-a="toSettings">Länge ändern</button></p>`;
    if (!p.fresh) card += DB.settings.refill ? `<p class="hint">Gerade keine neuen Sätze vorrätig. Neue kommen automatisch von Tatoeba, sobald du online bist.</p>` : `<p class="hint">Alle Sätze sind eingeführt. <button type="button" class="link" data-a="tat">Beispielsätze suchen</button></p>`;
  }
  const dnow = dateOf(today());
  const ws = weekStrip();
  const hello = `<header class="hello"><p class="hello-g wordrow" lang="${lang}">${linkWords(greeting(lang), lang)}</p>${ws.strip}<p class="hello-d">${WDAYS_FULL[dnow.getDay()]}, ${dnow.getDate()}. ${MONTHS_FULL[dnow.getMonth()]}</p>${ws.count}</header>`;
  return `${topLine()}${hello}${noticeHtml() || storeHint() || backupHint()}${intro}${monthRecap()}<section class="today hero">${card}</section>${weakHtml(lang)}${findHtml(lang)}`;
}
// Was heute in dieser Sprache passiert ist: Zeit, Neues, Wiederholungen, alles Üben des Tages zusammen
function todayHtml(lang){
  const x = dayLog(today(), lang);
  if (!x.n) return '';
  const kp = [], mins = Math.round((x.secs || 0) / 60);
  if (mins >= 1) kp.push([mins, mins === 1 ? 'Minute' : 'Minuten']);
  if (x.fresh) kp.push([x.fresh, x.fresh === 1 ? 'neuer Satz' : 'neue Sätze']);
  if (x.rev) kp.push([`${x.revOk || 0}/${x.rev}`, x.rev === 1 ? 'Wiederholung gewusst' : 'Wiederholungen gewusst']);
  if (kp.length < 3) kp.unshift([x.n, x.n === 1 ? 'Aufgabe' : 'Aufgaben']);
  const tiles = kp.slice(0, 3);
  return `<div class="kpis today-kpis" style="grid-template-columns:repeat(${tiles.length}, 1fr)" aria-label="Heute">${tiles.map(([v, l]) => `<div><b>${esc(String(v))}</b><span>${l}</span></div>`).join('')}</div>${x.mat ? `<p class="hint today-mat">${plural(x.mat, 'Satz', 'Sätze')} heute <button type="button" class="term" data-a="term" data-k="gefestigt">gefestigt</button>.</p>` : ''}`;
}
// Themen einer Sprache: alle aus TRAPS, dazu „Eigene Sätze“, sobald es welche gibt
const topicIds = lang => TRAPS[lang].map(t => t.id).concat(BANK[lang].some(i => i.trap === 'eigene') ? ['eigene'] : []);
// Anteil richtig eines erzeugten Bereichs (0 bis 1): die letzten bis zu 50 Aufgaben, ohne diese Liste alle bisherigen.
// Erst ab 10 Aufgaben, sonst null: Eine Quote aus drei Versuchen wäre Scheingenauigkeit.
function genRate(g){
  const st = DB.gen[g] || { ok:0, bad:0 }, n = st.ok + st.bad, rc = st.recent || [];
  if (rc.length >= 10) return rc.reduce((a, x) => a + x, 0) / rc.length;
  return n >= 10 ? st.ok / n : null;
}
// Stand eines erzeugten Bereichs in Worten, gleich für „Thema üben“ und „Grammatik-Training“: ab 10 Aufgaben derselbe Anteil
// wie der Balken in Prozent, darunter als Anzahl („3 Aufgaben, 2 richtig“).
function genStatText(g){
  const st = DB.gen[g] || { ok:0, bad:0 }, n = st.ok + st.bad, rc = st.recent || [], r = genRate(g);
  if (r != null) return rc.length >= 10 ? `Zuletzt ${pct(r)} richtig (letzte ${rc.length})` : `Bisher ${pct(r)} richtig`;
  return n ? `${plural(n, 'Aufgabe', 'Aufgaben')}, ${st.ok} richtig` : 'Noch nicht geübt';
}
// Zeilen für „Thema üben“. Satz-Themen haben einen festen Bestand, ihr Balken zeigt den gefestigten Anteil daran.
// Erzeugte Themen haben keinen Bestand; ihr Balken zeigt den Anteil richtig, in eigener Gruppe und Farbe, erst ab 10 Aufgaben.
function topicRows(lang){
  return topicIds(lang).map(id => {
    const tr = trapMeta(lang, id);
    if (tr.kind === 'gen') {
      const g = DB.gen[tr.gen] || { ok:0, bad:0 };
      return { id, label:tr.label, gen:true, rate:genRate(tr.gen), text:genStatText(tr.gen), touched:g.ok + g.bad > 0 };
    }
    const items = BANK[lang].filter(i => i.trap === id);
    const seen = items.filter(i => stOf(i.id)).length;
    const mature = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length;
    return { id, label:tr.label, pct:items.length ? Math.round(mature / items.length * 100) : 0, text:seen ? `${seen} von ${items.length} Sätzen geübt, ${mature} gefestigt` : `${items.length} Sätze, noch nicht begonnen`, touched:seen > 0 };
  });
}
const rowText = r => `<span class="txt"><span class="rt">${esc(r.label)}</span><span class="rd">${esc(r.text)}</span></span>`;
const barRow = r => rowText(r) + (r.gen ? (r.rate == null ? '' : `<span class="bar qbar" aria-hidden="true"><span style="width:${Math.max(3, Math.round(r.rate * 100))}%"></span></span>`)
  : `<span class="bar" aria-hidden="true"><span style="width:${Math.max(3, r.pct)}%"></span></span>`);
// Themen mit den meisten Fehlern der letzten 30 Tage, dieselben Zahlen und dieselbe Reihenfolge wie „Fehlerquellen nach Thema“:
// nach Anzahl der Fehler, bei Gleichstand mehr Aufgaben zuerst. Erst ab 8 Fehlern in der Sprache (wie dort) und je Thema
// mindestens 2; vorher sagt die Liste nichts. Nur Themen, die sich üben lassen (nicht Genus, Uhrzeiten, Zahlen).
function weakTopics(lang){
  const s = errStats(lang, 30); if (s.bad < 8) return [];
  const ids = new Set(topicIds(lang));
  return Object.keys(s.p).filter(id => ids.has(id) && s.p[id][1] >= 2).map(id => ({ id, label:trapMeta(lang, id).label, n:s.p[id][0], bad:s.p[id][1] }))
    .sort((a, b) => b.bad - a.bad || b.n - a.n).slice(0, 3);
}
// Balken wie in den Fehlerquellen: Aufgaben (grau) und Fehler (rot) auf einer gemeinsamen Skala
function weakHtml(lang){
  const list = weakTopics(lang);
  if (!list.length) return '';
  const max = Math.max(...list.map(x => x.n)), w = v => +(v / max * 100).toFixed(1);
  return `<h2 class="grp">Meiste Fehler, letzte 30 Tage</h2><div class="rows">${list.map(x => `<button type="button" class="row bars" data-a="trapgo" data-t="${x.id}">${rowText({ label:x.label, text:`${x.bad} Fehler bei ${x.n} Aufgaben` })}<span class="bar wbar" aria-hidden="true"><span class="w-all" style="width:max(6px, ${w(x.n)}%)"></span><span class="w-bad" style="width:max(3px, ${w(x.bad)}%)"></span></span></button>`).join('')}</div>`;
}
function viewExtra(){
  const lang = S.lang, L = LANG[lang];
  // Dienste mit Internet: Hinweis nur, wenn gerade keine Verbindung besteht (statt immer „(online)“)
  const net = d => navigator.onLine === false ? 'Braucht eine Internetverbindung' : d;
  const seen = BANK[lang].filter(i => stOf(i.id)).length;
  const noVoice = canSpeak() && !voiceFor(lang);
  const later = 'Geht, sobald du drei Sätze geübt hast';
  const withAudio = BANK[lang].filter(i => stOf(i.id) && i.tat && i.tat.audio && !i.tat.audio.blocked).length;
  const canHear = canSpeak() || withAudio >= 3;
  const noHear = 'Diese Ansicht kann nicht vorlesen. In Chrome oder der installierten App geht es.';
  const off = !canHear || seen < 3 ? ' disabled' : '';
  const g = (k, t, dsc, ico) => row('form', t, dsc, ` data-g="${k}_${lang}"`, ico);
  return `${topLine()}${noticeHtml()}
  ${noVoice && !(DB.used && DB.used.voiceWarn && dayDiff(today(), DB.used.voiceWarn) < 30) ? `<div class="notice warn"><span>Zum Vorlesen fehlt eine ${L.deName}-Stimme. Du kannst sie in den Android-Einstellungen unter „Sprachausgabe“ herunterladen.</span><button type="button" class="link dim" data-a="voiceoff">Ausblenden</button></div>` : ''}
  <h2 class="grp">Kurz zwischendurch</h2>
  <div class="rows">${row('quick', 'Kurze Runde', seen < 3 ? '6 Grammatik-Aufgaben für den Anfang' : '6 Aufgaben aus bekannten Sätzen')}${g('genus', lang === 'sv' ? 'en oder ett?' : 'el oder la?', 'Das Genus in schnellen Runden', 'genus')}${g('time', 'Uhrzeiten & Zahlen', 'Für Bahnhof, Laden und Verabredung', 'time')}</div>
  <h2 class="grp">Grammatik</h2>
  <div class="rows">${row('pickTopic', 'Thema üben', '10 Aufgaben zu einem Thema')}${row('forms', 'Grammatik-Training', `Endlos neue Aufgaben, ${genIds(lang).length} Bereiche`)}${g('spot', 'Fehler finden', 'Richtig oder falsch? Fehler finden und verbessern', 'spot')}${g('trans', 'Umbauen', 'Sätze umformen, ganz ohne Deutsch', 'trans')}</div>
  <h2 class="grp">Lesen und Hören</h2>
  <div class="rows">${row('texts', 'Lesetexte', `${TEXTS[lang].length} kurze Texte zum Lesen oder Hören, mit Fragen`, '', 'book')}${row('wiki', 'Wikipedia-Fundstück', net('Ein ausgezeichneter Artikel, gern mit Bezug zum Land'), '', 'book')}</div>
  <h2 class="grp">Hören und Sprechen</h2>
  <div class="rows">${row('dict', 'Hördiktat', !canHear ? noHear : seen < 3 ? later : 'Hören und aufschreiben', off)}${row('shadow', 'Nachsprechen', !canHear ? noHear : seen < 3 ? later : canRecord() ? 'Hören, mitsprechen, aufnehmen und vergleichen' : canListen() ? 'Mitsprechen und von der Spracherkennung prüfen lassen' : 'Hören und mitsprechen', off)}${row('radio', 'Hörrunde', !canSpeak() ? noHear : seen < 3 ? later : 'Geübte Sätze nebenbei hören, ohne Antippen', !canSpeak() || seen < 3 ? ' disabled' : '', 'dict')}</div>
  <h2 class="grp">Schreiben und Sammeln</h2>
  <div class="rows">${row('write', 'Text schreiben', 'Ein paar Sätze, mit Auswertung')}${row('tat', 'Beispielsätze suchen', net('Echte Sätze aus Tatoeba'))}${row('own', 'Eigenen Satz eintragen', 'Aus Podcast, Gespräch oder Korrektur')}</div>
  <h2 class="grp">Nachschlagen</h2>
  <div class="rows">${row('ref', 'Grammatik kurz erklärt', 'Alle Regeln mit Beispielen', ' data-r="topics"', 'book')}${row('ref', 'Grammatik-Begriffe', `${termsFor(lang).length} Fachwörter wie ${lang === 'sv' ? 'Supinum und Inversion' : 'Subjuntivo und Gerundium'}, in Alltagssprache`, ' data-r="terms"', 'terms')}${row('ref', 'Land & Leute', `${KULTUR[lang].length} Einblicke in Sprache, Alltag und Gesellschaft`, ' data-r="kultur"', 'globe')}${row('ref', 'Falsche Freunde', `${FALSE_FRIENDS[lang].length} Wörter, die anders gemeint sind`, ' data-r="friends"', 'friends')}${row('ref', lang === 'sv' ? 'Feste in Schweden' : 'Feste und Feiertage', `${EVENTS[lang].length} Feste, nach Datum sortiert`, ' data-r="feasts"', 'feast')}</div>`;
}
function viewPickTopic(){
  const lang = S.lang;
  const rows = topicRows(lang), list = rs => `<div class="rows">${rs.map(r => `<button type="button" class="row bars" data-a="trapgo" data-t="${r.id}">${barRow(r)}</button>`).join('')}</div>`;
  const gens = rows.filter(r => r.gen);
  return backBar('Thema üben') + `<p class="lead-s">10 Aufgaben zu einem Thema.</p>
    <h2 class="grp">Sätze</h2><p class="lead-s grp-lead">Der Balken zeigt, wie viele Sätze im Thema <button type="button" class="term" data-a="term" data-k="gefestigt">gefestigt</button> sind.</p>${list(rows.filter(r => !r.gen))}
    ${gens.length ? `<h2 class="grp">Immer neu erzeugt</h2><p class="lead-s grp-lead">Der grüne Balken zeigt den Anteil richtiger Antworten, ab 10 Aufgaben.</p>${list(gens)}` : ''}`;
}
function viewPickGen(){
  const lang = S.lang;
  return backBar('Grammatik-Training') + `<p class="lead-s">Die Aufgaben werden nach festen Regeln immer neu erzeugt. Du kannst jederzeit aufhören.</p><div class="rows">${genIds(lang).map(g => row('gengo', GENS[g].label, genStatText(g), ` data-g="${g}"`)).join('')}</div>`;
}
function runBar(r){
  const ex = r.queue[r.idx];
  let topic = '';
  if (ex.type === 'gen') topic = GENS[ex.gen].label;
  else if (ex.type === 'dict') topic = 'Hördiktat';
  else topic = trapMeta(r.lang, itemById(ex.id).trap).label;
  const prog = r.endless
    ? `<span class="count grow">${r.ok} richtig, ${r.bad} falsch</span>`
    : progressBar(r);
  const x = r.kind === 'daily'
    ? `<button type="button" class="x xt" data-a="quit" aria-label="Pausieren, später an derselben Stelle weitermachen">Pause</button>`
    : `<button type="button" class="x xt" data-a="${r.endless ? 'endrun' : 'quit'}" aria-label="Runde jetzt beenden, Antworten bleiben gespeichert">Beenden</button>`;
  const chosen = r.kind === 'trap' || r.kind === 'gen';
  const line = chosen ? esc(topic) + (ex.requeue ? ', zweiter Versuch' : '') : (ex.requeue ? 'Zweiter Versuch' : '');
  return `<div class="runbar">${x}${prog}</div>${line ? `<p class="topic">${line}</p>` : '<div class="topic-sp"></div>'}`;
}
// Stand je Aufgabe der Runde: ok, near, bad (beantwortet), done (Ergebnis unbekannt), cur (offen), '' (kommt noch). Farben wie in der Auswertung am Ende.
// Erste Versuche ohne gespeichertes Ergebnis (Runde aus einer älteren Version) nehmen es aus r.res, das sie in Reihenfolge enthält.
function runMarks(r){
  const res = r.res || []; let k = 0;
  return r.queue.map((ex, i) => {
    if (i < r.idx) { const x = ex.requeue ? null : res[k++]; return ex.got || (x ? (x.good ? (x.near ? 'near' : 'ok') : 'bad') : 'done'); }
    if (i === r.idx) return r.cur && r.cur.state === 'done' && r.cur.result ? r.cur.result : 'cur';
    return '';
  });
}
// Fortschritt als Leiste: ein Feld je Aufgabe, beantwortete in der Farbe ihres Ergebnisses (schon beim Prüfen),
// zweite Versuche als eigene Gruppe am Ende. Bei vielen Aufgaben rücken die Felder enger zusammen.
function progressBar(r){
  const marks = runMarks(r), n = r.queue.length, c = r.cur;
  const re1 = r.queue.findIndex(ex => ex.requeue);
  const cnt = { ok:0, near:0, bad:0 }; let open = 0;
  marks.forEach((m, i) => { if (r.queue[i].requeue) { if (!m || m === 'cur') open++; } else if (cnt[m] != null) cnt[m]++; });
  const parts = [cnt.ok && `${cnt.ok} richtig`, cnt.near && `${cnt.near} fast richtig`, cnt.bad && `${cnt.bad} falsch`, open && plural(open, 'zweiter Versuch folgt', 'zweite Versuche folgen')].filter(Boolean);
  const aria = `Aufgabe ${r.idx + 1} von ${n}${parts.length ? ': ' + parts.join(', ') : ''}`;
  const segs = marks.map((m, i) => `<i class="seg${m ? ' s-' + m : ''}${r.queue[i].requeue ? ' re' : ''}${i === re1 ? ' re1' : ''}${i === r.idx && c && c.enter && m !== 'cur' ? ' just' : ''}"></i>`).join('');
  return `<div class="progress${n > 44 ? ' d2' : n > 30 ? ' d1' : ''}" role="img" aria-label="${aria}">${segs}</div><span class="count" aria-hidden="true">${r.idx + 1}/${n}</span>`;
}
// Hinweis als Chip. Bei „Fortgeschritten“ bleiben Grundform, wörtliches Bild und das Muster einer Periphrase (acabar de + Infinitiv)
// verdeckt, bis man sie antippt: Sie verraten, welches Wort gesucht ist. Auswahl-Hinweise (ser oder estar, Optionen) bleiben sichtbar.
function tipChip(text, lang, c, kind0){
  const kind = kind0 || (/^Grundform/.test(text) ? 'Grundform' : /^wörtlich/.test(text) ? 'Wörtlich' : '');
  const hide = (DB.settings.niveau || 'mittel') === 'fort' && kind && !c.tip && c.state !== 'done';
  return hide ? `<button type="button" class="hintw tipbtn" data-a="showtip">${kind} zeigen</button>` : `<span class="hintw" lang="${lang}">${esc(text)}</span>`;
}
// Lücke nach dem Prüfen als Text statt Eingabefeld: richtig grün; fast richtig zeigt die richtige Form (zählt ja als richtig);
// falsch zeigt deine Antwort durchgestrichen und die Lösung daneben. So steht nie dasselbe Wort doppelt da.
function gapDone(c, want, lang){
  if (c.result === 'ok') return `<span class="gapdone ok" lang="${lang}">${esc(c.input.trim() || want)}</span>`;
  if (c.result === 'near') return `<span class="gapdone near" lang="${lang}">${esc(want)}</span>`;
  return `${c.input.trim() && !c.gaveUp ? `<s class="gapdone bad" lang="${lang}">${esc(c.input.trim())}</s> ` : ''}<span class="gapdone fix" lang="${lang}">${esc(want)}</span>`;
}
function viewRun(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur, lang = r.lang, L = LANG[lang];
  const done = c.state === 'done';
  let body = '';
  if (ex.type === 'tiles') {
    const item = itemById(ex.id);
    const picked = ex.picked.map(i => ex.pool.find(p => p.i === i));
    const marks = done && c.result !== 'ok' ? orderMarks(picked.map(p => p.t), item.target) : null;
    const rows = tileRows(ex.pool.filter(p => !p.extra).map(p => p.t));
    const ans = picked.length
      ? picked.map((p, k) => `<button type="button" class="tile${done ? (marks ? ' ' + marks[k] : ' ok') : ''}" data-a="unpick" data-i="${p.i}" lang="${lang}"${done ? ' disabled' : ''}>${esc(p.t)}</button>`).join('')
      : '<span class="ph">Tippe die Wörter unten der Reihe nach an</span>';
    // Die Kästchen behalten ihren Platz: Gewählte bleiben als leerer Umriss stehen, damit nichts verrutscht
    const pool = ex.pool.map(p => ex.picked.includes(p.i) ? `<button type="button" class="tile ghost" disabled tabindex="-1" aria-hidden="true" lang="${lang}">${esc(p.t)}</button>` : `<button type="button" class="tile" data-a="pickt" data-i="${p.i}" lang="${lang}">${esc(p.t)}</button>`).join('');
    body = `<p class="kicker">Bring die Wörter in die richtige Reihenfolge${ex.extra ? '<span class="hintw">Ein Wort bleibt übrig</span>' : ''}</p><p class="de" lang="de">${esc(item.de)}</p>
      <div class="ex-a"><div class="tiles-ans" style="min-height:${rows * 52 + 18}px" aria-label="Deine Antwort">${ans}</div>
      ${done ? '' : `<div class="tiles-pool">${pool}</div>`}</div>`;
  } else if (ex.type === 'cloze') {
    const item = itemById(ex.id);
    const pos = gapPos(item.target, item.gap);
    const cls = done ? (c.result === 'ok' ? ' ok' : c.result === 'near' ? ' near' : ' bad') : '';
    const field = done ? gapDone(c, item.gap, lang) : `<input type="text" id="answer" class="gapin${cls}" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(c.input)}" aria-label="Lücke">`;
    const h = item.hint.replace(/[()]/g, '').trim();
    const hintTxt = !h ? '' : h.includes('/') ? h.split('/').map(x => x.trim()).join(' oder ') : `Grundform: ${h}`;
    // Feste Wendung beim ersten Kontakt: das wörtliche Bild als Hinweis, danach nicht mehr (dann ist es Abruf)
    const lit = !ex.requeue && !stOf(item.id) ? literalOf(item) : '';
    body = `<p class="kicker">Ergänze die Lücke${hintTxt ? tipChip(hintTxt, lang, c) : ''}${lit ? tipChip(`wörtlich: ${lit}`, 'de', c) : ''}</p><p class="de" lang="de">${esc(item.de)}</p>
      <div class="ex-a"><p class="cloze" lang="${lang}">${pos >= 0 ? `${esc(item.target.slice(0, pos))}${field}${esc(item.target.slice(pos + item.gap.length))}` : field}</p>
      ${done ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'free') {
    const item = itemById(ex.id);
    const micTip = !done && !canListen() && (DB.used && DB.used.mic || 0) < 3 ? '<p class="src">Tipp: Mit dem Mikrofon deiner Tastatur kannst du die Antwort auch sprechen. Das übt nebenbei das Sprechen.</p>' : '';
    body = `<p class="kicker">Übersetze ${L.deAcc}</p><p class="de" lang="de">${esc(item.de)}</p>${micTip}
      <div class="ex-a"><textarea id="answer" class="tw" lang="${lang}" rows="3" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done" placeholder="${esc(L.ph)}"${done ? ' readonly' : ''}>${esc(c.input)}</textarea>
      ${done ? '' : `<div class="inrow">${charbar(lang)}${canListen() ? `<button type="button" class="micbtn${S.listening ? ' on' : ''}" data-a="dictate" aria-label="Antwort sprechen">${ICONS.mic}</button>` : ''}</div>`}</div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'spot') {
    const d = ex.data, fixing = !done && c.fixing, locked = done || fixing;
    // Gefundene Stelle beim Verbessern; nach der Lösung: getroffen, daneben (im richtigen Satz ohne Durchstreichen), übersehen
    const wrongText = d.wrong.map((i, k) => (k && i > d.wrong[k - 1] + 1 ? '… ' : '') + d.words[i].replace(/[.,!?]$/, '')).join(' ');
    const kicker = c.fixing ? 'Gefunden. Wie heißt es richtig?' : 'Tipp auf das falsche Wort. Stimmt der Satz, tipp auf „Kein Fehler“.';
    body = `<p class="kicker">${kicker}</p><p class="de" lang="de">${esc(d.deLine)}</p>
      <div class="ex-a"><p class="spot${c.intro ? ' enter' : ''}" lang="${lang}">${d.words.map((w, i) => {
        const cls = c.fixing ? (d.wrong.includes(i) ? (done && c.result !== 'bad' ? ' hit' : ' found') : '') : !done ? '' : i === c.pick ? (d.wrong.includes(i) ? ' hit' : ' alarm') : d.wrong.includes(i) ? ' was' : '';
        return `<button type="button" class="sw-w${cls}" data-a="spotpick" data-i="${i}"${locked ? ' disabled' : ''}>${esc(w)}</button>`;
      }).join(' ')}</p>${c.fixing ? `<label class="fixlbl" for="answer">Statt <span lang="${lang}">„${esc(wrongText)}“</span>:</label>
      <input type="text" id="answer" class="tw" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Richtige Form">
      ${done ? '' : charbar(lang)}` : ''}</div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'genus') {
    const d = ex.data;
    body = `<p class="kicker">${esc(d.label)}</p>
      <div class="genus${c.intro ? ' enter' : ''}"><p class="genus-w" lang="${lang}">${esc(d.word)}</p><p class="genus-de">${esc(d.deLine)}</p></div>
      <div class="ex-a"><div class="genus-opts">${d.options.map(o => `<button type="button" class="genus-o${done ? (o === d.answer ? ' right' : o === c.input ? ' wrong' : '') : ''}" data-a="genuspick" data-v="${o}"${done ? ' disabled' : ''} lang="${lang}">${o}</button>`).join('')}</div></div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'time') {
    const d = ex.data;
    const shown = d.mode === 'write' ? `<p class="clockbig">${d.clock ? esc(d.clock) : `${d.num} ${lang === 'sv' ? 'kr' : '€'}`}</p>`
      : d.mode === 'hear' ? `<div class="btnrow tight" style="margin:4px 0 14px"><button type="button" class="ghost icon" data-a="tplay" data-rate="0.9">${ICON} Abspielen</button><button type="button" class="ghost icon" data-a="tplay" data-rate="0.65">${PICO.slow} Langsam</button></div>${done ? `<p class="de" lang="${lang}">${esc(d.say)}</p>` : ''}`
      : `<p class="de" lang="${lang}">${esc(d.say)}</p>`;
    body = `<p class="kicker">${esc(d.label)}</p>${d.mode === 'hear' ? '' : shown}
      <div class="ex-a">${d.mode === 'hear' ? shown : ''}${d.mode !== 'write' && !d.clock ? `<div class="unitwrap">` : ''}<input type="text" id="answer" class="tw${d.mode !== 'write' ? ' numin' : ''}" lang="${d.mode === 'write' ? lang : 'de'}" inputmode="${d.mode === 'write' ? 'text' : (d.clock ? 'decimal' : 'numeric')}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${d.mode === 'write' ? esc(L.ph) : d.clock ? 'z. B. 7.45' : 'z. B. 47'}" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Antwort">${d.mode !== 'write' && !d.clock ? `<span class="unit" aria-hidden="true">${lang === 'sv' ? 'kr' : '€'}</span></div>` : ''}
      ${d.mode !== 'write' && d.clock && !done ? '<p class="vocab" style="margin-top:10px">Punkt, Komma oder Leerzeichen statt Doppelpunkt geht auch.</p>' : ''}
      ${done || d.mode !== 'write' ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'trans') {
    const d = ex.data;
    body = `<p class="kicker">${esc(d.label)}</p><p class="de" lang="${lang}">${esc(d.src)}</p><p class="vocab">Beginne mit „${esc(d.start.trim())} …“${d.aim ? `. ${esc(d.aim)}` : ''}</p>
      <div class="ex-a"><textarea id="answer" class="tw" lang="${lang}" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done"${done ? ' readonly' : ''} aria-label="Umgebauter Satz">${esc(c.input)}</textarea>
      ${done ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'gen') {
    const d = ex.data;
    if (d.gap) {
      const pos = d.prompt.indexOf('___');
      const cls = done ? (c.result === 'ok' ? ' ok' : c.result === 'near' ? ' near' : ' bad') : '';
      const field = done ? gapDone(c, d.full.slice(pos, d.full.length - (d.prompt.length - pos - 3)), lang) : `<input type="text" id="answer" class="gapin${cls}" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(c.input)}"${d.ph ? ` placeholder="${esc(d.ph)}"` : ''}${done ? ' readonly' : ''} aria-label="Lücke${d.ph ? `, beginnt mit ${esc(d.ph.replace('…', ''))}` : ''}">${done && c.result !== 'ok' ? ` <span class="gapfix">${esc(d.answers[0])}</span>` : ''}`;
      body = `<p class="kicker">${esc(d.label)}${d.hint ? tipChip(d.hint, lang, c, d.tip) : ''}</p>${d.deLine ? `<p class="de" lang="de">${esc(d.deLine)}</p>` : ''}
        <div class="ex-a"><p class="cloze" lang="${lang}">${esc(d.prompt.slice(0, pos))}${field}${esc(d.prompt.slice(pos + 3))}</p>
        ${done ? '' : charbar(lang)}</div>`;
    } else {
      body = `<p class="kicker">${esc(d.label)}</p><p class="de" lang="${d.sub ? lang : 'de'}">${esc(d.prompt)}</p>${d.sub ? `<p class="vocab">${esc(d.sub)}</p>` : ''}
        <div class="ex-a"><input type="text" id="answer" class="tw" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(L.ph)}" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Antwort">
        ${done ? '' : charbar(lang)}</div>`;
    }
  } else if (ex.type === 'dict') {
    const item = itemById(ex.id);
    body = `<p class="kicker">Hör zu und schreib den Satz auf${item.tat && item.tat.audio ? '<span class="hintw">echte Aufnahme</span>' : ''}</p>
      <div class="ex-a"><div class="btnrow tight" style="margin:0 0 14px"><button type="button" class="ghost icon" data-a="play" data-rate="0.9">${ICON} Abspielen</button><button type="button" class="ghost icon" data-a="play" data-rate="0.65">${PICO.slow} Langsam</button></div>
      <textarea id="answer" class="tw" lang="${lang}" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done"${done ? ' readonly' : ''} aria-label="Was du hörst">${esc(c.input)}</textarea>
      ${done ? '' : charbar(lang)}</div>`;
  }
  let actions;
  if (!done) {
    actions = ex.type === 'gen' && ex.data.kind === 'spot' && !c.fixing ? '<button type="button" class="ghost" data-a="giveup">Weiß ich nicht</button><button type="button" class="ghost wide" data-a="spotnone">Kein Fehler</button>'
      : ex.type === 'gen' && ex.data.kind === 'genus' ? '<button type="button" class="ghost" data-a="giveup">Weiß ich nicht</button>' : `${ex.type === 'tiles' ? `<button type="button" class="ghost" data-a="resetTiles"${ex.picked.length ? '' : ' disabled'}>Zurücksetzen</button>` : '<button type="button" class="ghost" data-a="giveup">Weiß ich nicht</button>'}<button type="button" class="primary" data-a="check">Prüfen</button>`;
  } else {
    // Eindeutige Aufgaben: Auswahl (Fehler finden, Genus, ser/estar, por/para), Verbform in der Lücke, Uhrzeit als Zahl
    const fixedAnswer = ex.type === 'gen' && (['spot', 'genus'].includes(ex.data.kind) || ex.data.gap || (ex.data.kind === 'time' && ex.data.mode !== 'write'));
    const canAccept = c.result === 'bad' && !c.gaveUp && !!c.input && ex.type !== 'dict' && ex.type !== 'tiles' && !fixedAnswer;
    actions = `${canAccept ? '<button type="button" class="ghost" data-a="accept">Meine ist auch richtig</button>' : ''}<button type="button" class="primary" data-a="next">Weiter</button>`;
  }
  body = body.replace('<div class="ex-a">', '<div class="ex-sp" aria-hidden="true"></div><div class="ex-a">');
  return runBar(r) + `<section class="ex">${body}<div id="fb" class="${done ? 'fb-' + c.result + (c.gaveUp ? ' fb-gave' : '') + (c.enter ? ' enter' : '') : ''}" aria-live="polite">${done ? feedbackHtml(r, ex, c) : ''}</div></section><div class="actionbar"><div class="in">${actions}</div></div>`;
}
// Die Lösung, die im Rückmeldefeld steht. Genau sie wird vorgelesen, automatisch und über den Knopf daneben.
// Erzeugte Aufgaben: der ganze Satz (bei Lücken nie nur das Wort). Satzbank: deine nächstliegende richtige Fassung.
function solShown(lang, ex, c){
  if (ex.type === 'gen' && ['spot', 'genus', 'time'].includes(ex.data.kind)) return ex.data.full;
  const item = ex.id ? itemById(ex.id) : null;
  const solution = ex.type === 'gen' ? (ex.data.full || ex.data.answers[0]) : item.target;
  const showDiff = c.result !== 'ok' && c.diff && c.input && !c.gaveUp && ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap);
  return showDiff && c.best ? c.best : solution;
}
// Lösungssatz mit dem gesuchten Teil fett, wenn er darin vorkommt (Uhrzeit oder Preis in Worten)
const boldIn = (full, part) => { const i = part ? full.toLowerCase().indexOf(part.toLowerCase()) : -1; return i < 0 ? esc(full) : `${esc(full.slice(0, i))}<b>${esc(full.slice(i, i + part.length))}</b>${esc(full.slice(i + part.length))}`; };
const ivlText = n => (n <= 1 ? 'morgen wieder' : n === 2 ? 'übermorgen wieder' : n < 14 ? `in etwa ${n} Tagen wieder` : n < 60 ? `in etwa ${Math.round(n / 7)} Wochen wieder` : n < 540 ? `in etwa ${Math.round(n / 30)} Monaten wieder` : `in etwa ${Math.round(n / 365)} Jahr${Math.round(n / 365) > 1 ? 'en' : ''} wieder`);
function feedbackHtml(r, ex, c){
  const lang = r.lang;
  const near = lang === 'sv' ? 'Achte auf å, ä und ö.' : 'Achte auf die Akzente.';
  const pill = c.result === 'ok' ? '<span class="verdict v-ok">Richtig</span>' : c.result === 'near' ? '<span class="verdict v-mid">Fast richtig</span>' : c.gaveUp ? '<span class="verdict v-bad">Lösung</span>' : '<span class="verdict v-bad">Falsch</span>';
  const next = c.nextIvl ? `<span class="nexthint">${c.result === 'bad' ? 'gleich noch einmal, dann morgen wieder' : ivlText(c.nextIvl)}</span>` : '';
  const combo = c.combo >= 3 && (c.combo === 3 || c.combo % 5 === 0) ? `<span class="combo">${c.combo} in Folge</span>` : '';
  let out = `<div class="vrow">${pill}${combo}${next}</div>`;
  if (ex.type === 'gen' && ex.data.kind === 'spot') {
    const d = ex.data, fixed = d.full.split(' '), clean = d.wrong.length === 0;
    // Geänderte Wörter über die längste gemeinsame Folge: auch wenn die Verbesserung kürzer ist („he ido“ → „fui“)
    const changed = spotChanged(d.words, fixed);
    const fixWord = d.fix ? d.fix[0] : '';
    const line = clean ? (c.result === 'ok' ? 'Der Satz stimmt.' : 'Der Satz war richtig.')
      : c.none ? `Hier steckt ein Fehler: <span lang="${lang}">„${esc(d.wrong.map(i => d.words[i].replace(/[.,!?]$/, '')).join(' '))}“</span>.`
      : c.fixBad ? `Fehler gefunden, aber richtig heißt es <span lang="${lang}">„${esc(fixWord)}“</span>.`
      : c.result === 'near' ? (lang === 'sv' ? 'Achte auf å, ä und ö.' : 'Achte auf die Akzente.') : '';
    if (line) out += `<p class="expl spotline">${line}</p>`;
    out += `<div class="solrow"><p class="sol" lang="${lang}">${fixed.map((w, i) => `<span data-a="lookup" data-w="${esc(w.replace(/[.,!?¿¡]/g, ''))}"${changed.has(i) ? ' class="w-fix"' : ''}>${esc(w)}</span>`).join(' ')}</p>${speakBtn(d.full, lang)}</div>`;
    out += `<p class="expl">${termify(d.note)}</p>`;
    const tr = trapMeta(lang, d.trap); if (tr) out += `<p class="src">Thema: ${esc(tr.label)}</p>`;
    return out;
  }
  if (ex.type === 'gen' && ex.data.kind === 'genus') {
    const d = ex.data;
    out += `<div class="solrow"><p class="sol" lang="${lang}"><b>${esc(d.answer)}</b> ${esc(d.word)}</p>${speakBtn(d.full, lang)}</div>`;
    if (d.note) out += `<p class="expl">${termify(d.note)}</p>`;
    return out;
  }
  if (ex.type === 'gen' && ex.data.kind === 'time') {
    const d = ex.data;
    // Schreiben: Zahl und ganzer Satz, das Gesuchte fett (vorher nur das Wort, der Knopf daneben las nichts vor)
    out += `<div class="solrow"><p class="sol" lang="${lang}">${d.mode === 'write' ? `${esc(d.clock || `${d.num} ${lang === 'sv' ? 'kr' : '€'}`)} = ${boldIn(d.full, d.answers[0])}` : esc(`${d.full.replace(/\.$/, '')} = ${d.clock || d.num}`)}</p>${speakBtn(d.full, lang)}</div>`;
    const also = d.mode === 'write' && d.clock ? d.answers.slice(1).filter(a => !/^(son|es) /.test(a) && a !== d.answers[0]) : [];
    if (also.length) out += `<p class="legend">Auch richtig: ${esc(also.join(', '))}</p>`;
    if (d.note) out += `<p class="expl">${termify(d.note)}</p>`;
    return out;
  }
  if (ex.type === 'dict') {
    const item = itemById(ex.id);
    return out + `<p class="diff" lang="${lang}">${c.diff.html}</p><p class="gloss">${esc(item.de)}</p>${c.result !== 'ok' ? '<p class="legend"><span class="w-near">Gelb</span>: Schreibung falsch. <span class="w-miss">Rot</span>: Wort fehlt oder ist falsch.</p>' : ''}`;
  }
  const item = ex.id ? itemById(ex.id) : null;
  const tr = item ? trapMeta(lang, item.trap) : null;
  const solution = ex.type === 'gen' ? (ex.data.full || ex.data.answers[0]) : item.target;
  if (c.mine && c.result !== 'ok' && !c.gaveUp) out += `<p class="yours" lang="${lang}"><span class="lbl-s">Du:</span> ${c.mine}</p>`;
  const showDiff = c.result !== 'ok' && c.diff && c.input && !c.gaveUp && ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap);
  const sol = solShown(lang, ex, c);
  const sBtn = item && item.tat && item.tat.audio && sol === item.target ? speakItemBtn(item) : speakBtn(sol, lang);
  out += `<div class="solrow"><p class="sol" lang="${lang}">${showDiff ? c.diff.html : linkWords(sol, lang)}</p>${sBtn}</div>`;
  const vocabLine = c.vocab && c.vocab.length ? `<p class="expl">Die Grammatik passt, nur ${c.vocab.length === 1 ? 'ein Wort ist' : 'Wörter sind'} anders: ${c.vocab.slice(0, 2).map(([x, w]) => `<span lang="${lang}">„${esc(x)}“</span> statt <span lang="${lang}">„${esc(w)}“</span>`).join(', ')}.</p>` : '';
  if (c.result === 'near' && c.why && c.why.kind === 'vocab') out += vocabLine;
  else if (c.result === 'near') out += `<p class="expl">${c.why && c.why.kind === 'typo' ? `Zählt als richtig, nur ein Tippfehler: <span lang="${lang}">„${esc(c.why.typed)}“</span> statt <span lang="${lang}">„${esc(c.why.want)}“</span>.` : near}</p>`;
  if (c.result === 'bad' && vocabLine) out += vocabLine;
  if (c.result === 'bad') {
    // Fehlt ein Reflexivpronomen (quedamos statt nos quedamos), steht das zuerst: Es ist der konkrete Fehler, die Erklärung des Satzes kommt danach.
    if (c.refl && !c.keyOk) out += `<p class="expl">${termify(c.refl)}</p>`;
    if (c.keyOk) out += `<p class="expl">${termify(c.keyOk)}. ${c.refl ? `Aber ${termify(c.refl)}` : 'Der Unterschied liegt woanders.'}</p>`;
    // Eigene Erklärung (Satzbank oder erzeugte Aufgabe) passt genau zum Satz und geht vor der allgemeinen Diagnose.
    // Die Diagnose sieht nur, ob „har …“ fehlt; bei einem Satz zur Wortstellung führte sie in die Irre.
    else if (!(ex.type === 'gen' && (ex.data.kind || ex.data.note)) && !(item && item.note) && diag(lang, c.input, solution)) out += `<p class="expl">${termify(diag(lang, c.input, solution))}</p>`;
    else if (ex.type === 'gen') out += `<p class="expl">${termify(ex.data.note)}</p>`;
    else if (tr && (item.note || tr.short)) out += `<p class="expl">${termify(item.note || tr.short)}</p>${tr.id !== 'eigene' ? `<button type="button" class="link more-l" data-a="topic" data-t="${tr.id}">Regel und Beispiele</button>` : ''}`;
    if (ex.type === 'free' && !c.gaveUp && c.input) {
      if (c.lt === undefined) out += `<p class="hint">Unsicher, ob deine Fassung auch stimmt? <button type="button" class="link" data-a="ltfree">Mit LanguageTool prüfen (online)</button></p>`;
      else if (c.lt === 'loading') out += `<p class="hint"><span class="dots">Prüfe</span></p>`;
      else if (typeof c.lt === 'string') out += `<p class="hint">${esc(c.lt)}</p>`;
      else out += ltHtml(c.input, c.lt, lang, false) + `<p class="src">Geprüft von <a href="https://languagetool.org" target="_blank" rel="noopener">LanguageTool</a>. Ob die Bedeutung passt, prüft es nicht.</p>`;
    }
  }
  if (c.result === 'bad' && ex.type === 'free' && !c.gaveUp && c.input && !(DB.used && DB.used.accept)) out += `<p class="hint">Gibt es mehrere richtige Übersetzungen und deine ist eine davon, tipp auf „Meine ist auch richtig“. Die App merkt sich deine Fassung.</p>`;
  if (!(r.kind === 'trap' || r.kind === 'gen' || r.kind === 'form')) { const own = ex.type === 'gen' && ex.data.trap ? trapMeta(lang, ex.data.trap) : null; const tl = own ? own.label : ex.type === 'gen' ? GENS[ex.gen].label : (tr && tr.id !== 'eigene' ? tr.label : ''); if (tl) out += `<p class="src">Thema: ${esc(tl)}</p>`; }
  if (!(DB.used && DB.used.lookup)) out += `<p class="src">Tipp auf ein Wort der Lösung, um es nachzuschlagen.</p>`;
  if (item && item.tat) out += `<p class="src">Quelle: Tatoeba${item.tat.owner ? ', ' + esc(item.tat.owner) : ''} (${esc(item.tat.license)})${item.tat.audio ? `. Aufnahme: ${item.tat.audio.attr ? `<a href="${esc(item.tat.audio.attr)}" target="_blank" rel="noopener">${esc(item.tat.audio.author)}</a>` : esc(item.tat.audio.author)}` : ''}</p>`;
  return out;
}
// Wortstellung: richtig stehende, verschobene und überzählige Wörter unterscheiden
function orderMarks(order, target){
  const a = order.map(x => x.toLowerCase()), b = tileTokens(target).map(x => x.toLowerCase());
  const m = a.length, n = b.length, dp = Array.from({ length:m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const keep = new Array(m).fill(false); let i = 0, j = 0;
  while (i < m && j < n) { if (a[i] === b[j]) { keep[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  const left = {}; b.forEach(w => { left[w] = (left[w] || 0) + 1; });
  a.forEach((w, k) => { if (keep[k]) left[w]--; });
  return a.map((w, k) => { if (keep[k]) return 'ok'; if (left[w] > 0) { left[w]--; return 'moved'; } return 'extra'; });
}
function tileRows(tokens){
  const W = Math.min(window.innerWidth || 380, 600) - 58;
  let rows = 1, x = 0;
  tokens.forEach(t => { const w = t.length * 10.8 + 34; if (x && x + w > W) { rows++; x = w; } else x += w; });
  return rows;
}
// Erkennt typische Fehler in der Antwort selbst, damit die Erklärung zum gemachten Fehler passt
function diag(lang, input, solution){
  if (!input) return '';
  const a = ' ' + norm(input, lang) + ' ', b = ' ' + norm(solution, lang) + ' ';
  if (lang === 'es') {
    const perf = /\s(he|has|ha|hemos|habéis|han)\s+\S+(ado|ido|to|cho|so)\s/;
    if (perf.test(a) && !perf.test(b)) return 'Mit einem abgeschlossenen Zeitpunkt wie ayer, el año pasado oder en 2018 steht Indefinido, nicht Perfecto (he …).';
    if (!perf.test(a) && perf.test(b) && /(hoy|esta semana|esta mañana|nunca|alguna vez|ya)/.test(b)) return 'Bei heute, diese Woche oder Erfahrungen (nunca, alguna vez) nimmt man in Spanien das Perfecto (he …).';
  }
  if (lang === 'sv') {
    const perf = /\s(har|hade)\s+(\S+\s+)?\S+(at|it|tt|t)\s/;
    if (perf.test(a) && !perf.test(b)) return 'Mit einem Zeitpunkt in der Vergangenheit steht Präteritum, nicht „har …“.';
    if (!perf.test(a) && perf.test(b)) return 'Ohne Zeitpunkt, als Erfahrung oder bis heute andauernd: Perfekt mit „har …“.';
  }
  return '';
}
function ltHtml(text, matches, lang, fixable){
  if (!matches.length) return `<p class="lt-ok">Keine Fehler gefunden.</p>`;
  return `<ul class="ltlist">${matches.map((m, k) => `<li><mark lang="${lang}">${esc(text.substr(m.offset, m.length) || '…')}</mark> <span>${esc(m.message)}</span>${m.reps.length ? `<span class="reps">${m.reps.map(rp => fixable ? `<button type="button" class="rep" data-a="wfix" data-k="${k}" data-r="${esc(rp)}" lang="${lang}">${esc(rp)}</button>` : `<span class="rep" lang="${lang}">${esc(rp)}</span>`).join('')}</span>` : ''}</li>`).join('')}</ul>`;
}
// Frei lesbare Quellen ohne Bezahlschranke, Texte auch außerhalb des Landes erreichbar (nur Videos sind dort teils gesperrt)
const READING = {
  sv:[['8 Sidor', 'https://8sidor.se'], ['SVT Nyheter', 'https://www.svt.se/nyheter/'], ['Svenska Yle', 'https://svenska.yle.fi']],
  es:[['Noticias fácil', 'https://www.discapnet.es/lectura-facil/inicio'], ['RTVE Noticias', 'https://www.rtve.es/noticias/'], ['BBC Mundo', 'https://www.bbc.com/mundo']]
};
const readLink = ([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name.replace(/ /g, '\u00a0')}</a>`;
// Themen der Runde: je Thema ein Punkt pro Aufgabe (erster Versuch). Sätze nach ihrem Thema, erzeugte Aufgaben nach Generator.
function roundTopics(r){
  const lang = r.lang, map = new Map();
  (r.res || []).forEach(x => {
    let key, label, trap = null;
    if (x.id) { const it = itemById(x.id), tr = it && trapMeta(lang, it.trap); if (!tr) return; key = tr.id; label = tr.label; trap = tr.id; }
    else if (x.gen && x.trap && trapMeta(lang, x.trap)) { const tr = trapMeta(lang, x.trap); key = tr.id; label = tr.label; trap = tr.id; }
    else if (x.gen && GENS[x.gen]) { const tr = TRAPS[lang].find(t => t.gen === x.gen); key = tr ? tr.id : x.gen; label = tr ? tr.label : GENS[x.gen].label; trap = tr ? tr.id : null; }
    else return;
    const t = map.get(key) || { key, label, trap, gen:x.gen || null, dots:[], bad:0 };
    t.dots.push(x.good ? (x.near ? 'near' : 'ok') : 'bad'); if (!x.good) t.bad++;
    map.set(key, t);
  });
  return [...map.values()].sort((a, b) => b.bad - a.bad || b.dots.length - a.dots.length);
}
// Nach einer fehlerfreien Übungsrunde: das Thema, das in den letzten 30 Tagen am häufigsten hakte (ab 5 Aufgaben, mindestens jede fünfte falsch).
// Noch eine Runde vom selben bringt dann am wenigsten.
function nextTopicHtml(r){
  if (r.kind === 'daily' || r.bad || (r.ok || 0) < 3) return '';
  const lang = r.lang, s = errStats(lang, 30), here = new Set(roundTopics(r).map(t => t.trap).filter(Boolean));
  const list = Object.keys(s.p).filter(id => id !== 'eigene' && trapMeta(lang, id) && !here.has(id))
    .map(id => ({ id, n:s.p[id][0], bad:s.p[id][1] })).filter(x => x.n >= 5 && x.bad * 5 >= x.n)
    .sort((a, b) => b.bad / b.n - a.bad / a.n || b.n - a.n);
  if (!list.length) return '';
  const x = list[0];
  return `<h2 class="grp">Als Nächstes</h2><p class="hint bundle"><b>${esc(trapLabel(lang, x.id))}</b>: in den letzten 30 Tagen ${x.bad} von ${x.n} falsch. <button type="button" class="link inl" data-a="trapgo" data-t="${x.id}">Thema üben</button></p>`;
}
function topicsHtml(r){
  const tps = roundTopics(r);
  if (tps.length < 2) return '';
  // Fehler bündeln: Hakt es mindestens zweimal im selben Thema, ist das der nächste Schritt (andere Sätze, gleiche Regel)
  // Nur wenn ein Thema klar vorn liegt: mindestens zwei Fehler und mehr als jedes andere Thema
  const nBad = tps.reduce((a, t) => a + t.bad, 0), worst = tps[0].bad >= 2 && tps[0].bad > tps[1].bad ? tps[0] : null;
  const go = t => (t.trap && t.trap !== 'eigene' ? `data-a="trapgo" data-t="${t.trap}"` : t.gen ? `data-a="form" data-g="${t.gen}"` : '');
  const bundle = worst && go(worst) ? `<p class="hint bundle">${worst.bad === nBad ? (nBad === 2 ? 'Beide Fehler' : `Alle ${nBad} Fehler`) : `${worst.bad} von ${nBad} Fehlern`}: <b>${esc(worst.label)}</b>. <button type="button" class="link inl" ${go(worst)}>Thema üben</button></p>` : '';
  const dot = d => `<i class="d-${d}"></i>`;
  const rows = tps.slice(0, 5).map(t => {
    const sheet = t.trap && t.trap !== 'eigene';
    const ok = t.dots.length - t.bad, aria = `${ok} richtig${t.bad ? `, ${t.bad} falsch` : ''}`;
    const inner = `<span class="txt"><span class="rt">${esc(t.label)}</span></span><span class="tdots" role="img" aria-label="${aria}">${t.dots.slice(0, 12).map(dot).join('')}${t.dots.length > 12 ? `<b>+${t.dots.length - 12}</b>` : ''}</span>`;
    return sheet ? `<button type="button" class="row trow" data-a="topic" data-t="${t.trap}">${inner}</button>` : `<div class="row static trow">${inner}</div>`;
  }).join('');
  return `<h2 class="grp">Themen dieser Runde</h2>${bundle}<div class="rows">${rows}</div>${tps.length > 5 ? `<p class="legend">und ${plural(tps.length - 5, 'weiteres Thema', 'weitere Themen')}</p>` : ''}`;
}
// Bonus „Eigener Satz“: ein Ausdruck aus der Runde in einem selbst formulierten Satz. Bei Sätzen mit Lücke ist es die Lücke
// (der Grammatikpunkt), sonst das Inhaltswort, das in der ganzen Satzbank am seltensten vorkommt (Alltagswörter fallen so weg).
function bonusCands(r){
  const lang = r.lang, res = (r.res || []).filter(x => x.id);
  const freq = new Map();
  BANK[lang].forEach(i => new Set(wTokens(i.target).map(w => lemmaOf(lang, w) || w)).forEach(b => freq.set(b, (freq.get(b) || 0) + 1)));
  const fq = w => freq.get(lemmaOf(lang, w) || w) || 0;
  const skip = w => w.length < 4 || W_STOP.has(w) || W_SUBS[lang].includes(w) || W_CONN[lang].includes(w) || isFunc(lang, w) || NAMES.includes(w);
  const seen = new Set(), all = [];
  res.forEach((x, i) => {
    const item = itemById(x.id); if (!item || seen.has(item.id)) return; seen.add(item.id);
    let c = null;
    if (item.gap) c = { expr:item.gap, hint:item.hint || '', score:-1 };
    else {
      const ws = wTokens(item.target).filter(w => !skip(w));
      if (ws.length) {
        const w = ws.reduce((a, b) => (fq(b) < fq(a) || (fq(b) === fq(a) && b.length > a.length) ? b : a));
        const e = lookupWord(lang, w);
        c = { expr:w, de:e ? e.de.split(';')[0].trim() : '', score:fq(w) };
      }
    }
    // Zuerst Neues und Gewusstes (anwenden, was gerade sitzt), darin Lücken vor seltenen Wörtern
    if (c) all.push(Object.assign(c, { id:item.id, trap:item.trap, bucket:(x.good ? 0 : 2) + (x.fresh ? 0 : 1), i }));
  });
  const out = [];
  all.sort((a, b) => a.bucket - b.bucket || a.score - b.score || a.i - b.i).forEach(c => {
    if (!out.some(o => o.expr.toLowerCase() === c.expr.toLowerCase())) out.push({ expr:c.expr, de:c.de || '', hint:c.hint || '', id:c.id, trap:c.trap });
  });
  return out.slice(0, 8);
}
// Prüfung ohne Netz: ganzer Satz, Ausdruck kommt vor (Inhaltswörter auch in anderer Form), nicht bloß der Übungssatz
function bonusCheck(lang, text, cand){
  const toks = tokens(text).map(w => w.toLowerCase()), item = itemById(cand.id);
  if (toks.length < 3) return { ok:false, msg:'Bitte einen ganzen Satz, mindestens drei Wörter.' };
  const model = item ? tokens(item.target).map(w => deacc(w.toLowerCase())) : [];
  const same = toks.filter(w => model.includes(deacc(w))).length;
  if (item && (norm(text, lang) === norm(item.target, lang) || (same / Math.max(toks.length, model.length) >= 0.8))) return { ok:false, msg:'Das ist fast der Satz aus der Übung. Schreib einen eigenen.' };
  // Ab hier ist es ein eigener Satz: LanguageTool prüft ihn in jedem Fall, der Ausdruck ist nur die Aufgabe dazu
  const has = tokens(cand.expr).map(w => w.toLowerCase()).every(w => toks.some(t => deacc(t) === deacc(w) || (!isFunc(lang, w) && w.length >= 4 && sameWord(lang, t, w))));
  return has ? { ok:true, own:true, msg:`„${cand.expr}“ steckt drin.` } : { ok:false, own:true, msg:`„${cand.expr}“ kommt noch nicht vor.` };
}
function bonusHtml(r){
  const cands = bonusCands(r), lang = r.lang;
  if (!cands.length) return '';
  const b = r.bonus, c = cands[(b ? b.k : 0) % cands.length];
  const ex = `<b lang="${lang}">${esc(c.expr)}</b>${c.hint ? ` <span class="bde">${esc(c.hint)}</span>` : c.de ? ` <span class="bde">– ${esc(c.de)}</span>` : ''}`;
  if (!b || !b.open) return `<h2 class="grp">Bonus</h2><div class="rows"><button type="button" class="row" data-a="bonus"><span class="txt"><span class="rt">Eigener Satz</span><span class="rd">Schreib einen Satz mit „${esc(c.expr)}“, ganz ohne Vorlage.</span></span></button></div>`;
  const item = itemById(c.id), tr = trapMeta(lang, c.trap);
  const lt = b.lt === 'loading' ? '<p class="hint"><span class="dots">Wird geprüft</span></p>'
    : typeof b.lt === 'string' ? `<p class="hint">${esc(b.lt)}</p>`
    : b.lt ? ltHtml(b.ltText || b.text, b.lt, lang, false) + `<p class="src">Geprüft von <a href="https://languagetool.org" target="_blank" rel="noopener">LanguageTool</a>. Ob die Bedeutung passt, prüft es nicht.${lang === 'sv' ? ' Für Schwedisch vor allem die Rechtschreibung.' : ''}</p>` : '';
  const res = b.res ? `<p class="hint bres ${b.res.ok ? 'is-ok' : 'is-warn'}">${esc(b.res.msg)}${b.res.ok ? ` ${speakBtn(b.text, lang)}` : ''}</p>` : '';
  return `<h2 class="grp">Bonus: eigener Satz</h2><section class="chart bonus">
    <p class="bq">Schreib einen eigenen Satz mit ${ex}</p>
    ${tr && tr.id !== 'eigene' ? `<p class="legend">Thema: ${esc(tr.label)}</p>` : ''}
    ${item ? `<p class="bmodel"><span class="rt wordrow" lang="${lang}">${linkWords(item.target, lang)}</span>${item.de ? `<span class="rd">${esc(item.de)}</span>` : ''}</p>` : ''}
    <textarea id="bonusText" class="tw" lang="${lang}" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="Dein Satz">${esc(b.text || '')}</textarea>
    ${charbar(lang)}
    ${res}${lt}
    <div class="btnrow">${cands.length > 1 ? '<button type="button" class="ghost" data-a="bonusnext">Anderer Ausdruck</button>' : ''}<button type="button" class="ghost" data-a="bonuscheck">Prüfen</button></div>
  </section>`;
}
// Etappe am Rundenende (seit 24.63): Ausschnitt aus „Dein Weg“ mit der vorigen, der heutigen und der nächsten Etappe derselben Art.
// Bei mehreren Etappen eine Hauptetappe, die übrigen in einer Zeile. Bei gefestigten oder verankerten Sätzen die Sätze selbst.
const fmtDM = ds => { const x = dateOf(ds); return `${x.getDate()}. ${MONTHS[x.getMonth()]}${ds.slice(0, 4) !== today().slice(0, 4) ? ' ' + ds.slice(0, 4) : ''}`; };
function mileHtml(r){
  const miles = (r.miles || []).slice().sort((a, b) => wayPrio(a) - wayPrio(b)), m = miles[0];
  if (!m) return '';
  const lane = m.l || 'x', w = wayEvents().done, topic = m.k === 'topic';
  const prev = w.filter(e => e.k === m.k && (e.l || '') === (m.l || '') && wayKey(e) !== wayKey(m) && e.d <= m.d && (topic ? e.trap === m.trap : e.v == null || m.v == null || e.v < m.v)).pop();
  const nx = wayNext(m), when = e => (e.d === today() ? 'heute' : fmtDM(e.d));
  const lab = (t, l) => `${esc(t)}${l ? ` <span class="wl-lang">${LANG[l].deName}</span>` : ''}`;
  const row = (cls, t, right) => `<li class="mr ${cls}"><i></i><span class="mr-t">${t}</span><span class="mr-d">${right}</span></li>`;
  // Themen-Etappen: das Thema einmal als Überschrift, in der Leiste nur die Stufe mit der Fehlerquote vorher und nachher
  const rate = x => fmtPct(x[1] / x[0]);
  const step = e => `${esc(e.st)}${e.b && e.c ? `<span class="mr-s">von ${rate(e.b)} auf ${rate(e.c)}</span>` : ''}`;
  const head = topic ? `<p class="mr-h">${lab(trapLabel(m.l, m.trap), m.l)}</p>` : '';
  const rail = topic
    ? `<ol class="mrail rl-${lane}">${prev ? row('done', step(prev), fmtDM(prev.d)) : ''}${row('now', step(m), when(m))}${nx ? row('next', 'Nächste Halbierung', esc(nx.rest)) : ''}</ol>`
    : `<ol class="mrail rl-${lane}">${prev ? row('done', lab(prev.t, prev.l), fmtDM(prev.d)) : ''}${row('now', lab(m.t, m.l), when(m))}${nx ? row('next', esc(nx.t), esc(nx.rest)) : ''}</ol>`;
  const counts = topic && m.b && m.c ? `<p class="mr-x">${m.b[0] === m.c[0] ? `Je ${fmtN(m.b[0])} Aufgaben: vorher ${m.b[1]} falsch, zuletzt ${m.c[1]}.` : `Vorher ${m.b[1]} von ${m.b[0]} Aufgaben falsch, zuletzt ${m.c[1]} von ${m.c[0]}.`}</p>` : '';
  const list = m.k === 'mature' ? (r.crossed && r.crossed.mature) || [] : m.k === 'anchored' ? (r.crossed && r.crossed.anchored) || [] : [];
  const times = n => (['', 'einmal', 'zweimal', 'dreimal', 'viermal', 'fünfmal', 'sechsmal', 'siebenmal', 'achtmal', 'neunmal', 'zehnmal', 'elfmal', 'zwölfmal'][n] || `${n}-mal`);
  const show = S.mileAll ? list : list.slice(0, 3);
  const sents = list.length ? `<p class="mile-eb">${m.k === 'anchored' ? 'Heute verankert' : 'Heute gefestigt'}</p><div class="msents">${show.map(x => {
    const it = itemById(x.id); if (!it) return '';
    const tag = x.bad ? `<span class="ms-tag">${times(x.bad)} falsch, jetzt ${x.ivl} Tage Abstand</span>` : '';
    return `<div class="ms"><span class="txt"><span class="rt wordrow" lang="${r.lang}">${linkWords(it.target, r.lang)}</span><span class="rd">${esc(it.de)}</span>${tag}</span>${speakBtn(it.target, r.lang)}</div>`;
  }).join('')}</div>${list.length > 3 ? `<button type="button" class="link mr-more" data-a="mileall">${S.mileAll ? 'Weniger zeigen' : `und ${list.length - 3} weitere`}</button>` : ''}` : '';
  const also = miles.length > 1 ? `<p class="mr-also">Außerdem: ${miles.slice(1).map(e => esc(e.t) + (e.l && e.l !== r.lang ? ` (${LANG[e.l].deName})` : '')).join(', ')}.</p>` : '';
  const links = `<p class="mr-links">${topic && m.trap ? `<button type="button" class="link" data-a="topic" data-l="${m.l}" data-t="${m.trap}">Themenblatt</button>` : ''}<button type="button" class="link" data-a="toway">Dein Weg</button></p>`;
  return `<section class="mile" aria-label="Etappe"><p class="mile-eb">${miles.length > 1 ? 'Etappen' : 'Etappe'}</p>${head}${rail}${counts}${sents}${also}${links}</section>`;
}
// Monatsbilanz beim ersten Tagwerk eines Monats: drei Zahlen und der Vormonat als Kalender in derselben Kodierung wie „Übungstage“
function monthHtml(mo){
  if (!mo) return '';
  const [Y, M] = mo.ym.split('-').map(Number), first = `${mo.ym}-01`, nDays = new Date(Y, M, 0).getDate(), lead = (dateOf(first).getDay() + 6) % 7;
  const cell = 20, gap = 4, step = cell + gap, top = 16, free = streakData().free;
  let out = ['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((w, i) => `<text x="${i * step + cell / 2}" y="10" text-anchor="middle">${w}</text>`).join('') + '<defs><linearGradient id="calpb" x1="0" y1="0" x2="1" y2="1"><stop offset=".5" style="stop-color:var(--sv)"/><stop offset=".5" style="stop-color:var(--es)"/></linearGradient></defs>';
  for (let i = 0; i < nDays; i++) {
    const ds = addDays(first, i), pos = lead + i, x = (pos % 7) * step, y = top + Math.floor(pos / 7) * step;
    const sv = dayLog(ds, 'sv').n || 0, es = dayLog(ds, 'es').n || 0, n = sv + es, ts = doneIn(ds, 'sv'), te = doneIn(ds, 'es'), kind = DB.done[ds] ? 'd' : n ? 'p' : '';
    const lang = kind === 'd' ? (ts && te ? 'b' : ts ? 's' : te ? 'e' : sv && es ? 'b' : sv ? 's' : 'e') : sv && es ? 'b' : sv ? 's' : es ? 'e' : '';
    if (kind === 'd' && lang === 'b') out += `<g><rect class="ds" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="4"/><path class="de" d="M${x + cell} ${y + 2}V${y + cell - 4}Q${x + cell} ${y + cell} ${x + cell - 4} ${y + cell}H${x + 2}Z"/></g>`;
    else out += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="4" class="${kind ? kind + lang : 'c0'}${free.has(ds) && !n ? ' fr' : ''}"/>`;
  }
  const rows = Math.ceil((lead + nDays) / 7), W = 7 * step - gap, H = top + rows * step - gap;
  const g = mo.gain.sv + mo.gain.es, both = mo.gain.sv && mo.gain.es;
  const kp = [[mo.tw, mo.tw === 1 ? 'Tagwerk' : 'Tagwerke'], [g ? `+${g}` : 0, both ? 'gefestigt, beide Sprachen' : 'neu gefestigt'], [mo.et, mo.et === 1 ? 'Etappe' : 'Etappen']];
  return `<section class="month" aria-label="Rückblick ${MONTHS_FULL[M - 1]}"><p class="mile-eb">Dein ${MONTHS_FULL[M - 1]}</p>
    <div class="kpis month-kpis">${kp.map(([v, l]) => `<div><b>${esc(String(v))}</b><span>${l}</span></div>`).join('')}</div>
    <svg class="cal mcal" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${mo.days} Übungstage im ${MONTHS_FULL[M - 1]}">${out}</svg>
    <p class="legend">${mo.days} von ${nDays} Tagen geübt. Gefüllt: Tagwerk, Rand: nur etwas geübt.</p>
    ${mo.year ? `<p class="recap"><b>Dein Jahr ${mo.year.y}:</b> an ${plural(mo.year.days, 'Tag', 'Tagen')} geübt, ${mo.year.n.toLocaleString('de-DE')} Aufgaben${mo.year.secs ? `, ${fmtMin(mo.year.secs)}` : ''}.</p>` : ''}</section>`;
}
// Stempel: an Etappentagen mit Siegelrand in der Sprachfarbe (B2); außerhalb des Tagwerks statt des Hakens der Punkt aus „Dein Weg“
const SEAL_PATH = (() => {
  const N = 24, c = 28, r1 = 31, r2 = 36, p = (r, a) => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
  let d = '';
  for (let i = 0; i < N; i++) { const a0 = 2 * Math.PI * i / N - Math.PI / 2, a1 = 2 * Math.PI * (i + 1) / N - Math.PI / 2; if (!i) d = `M${p(r1, a0)}`; d += `Q${p(r2, (a0 + a1) / 2)} ${p(r1, a1)}`; }
  return d + 'Z';
})();
function stampSvg(r, daily, sealed){
  if (!daily && !sealed) return '';
  const draw = r.stamped ? '' : ' draw';
  if (!sealed) return `<svg class="stamp${draw}" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="25"/><path d="M17 29.5l7.5 7.5L40 21"/></svg>`;
  return `<svg class="stamp seal${daily ? '' : ' nd'}${draw}" viewBox="-10 -10 76 76" aria-hidden="true"><path class="sl" pathLength="100" d="${SEAL_PATH}"/><circle cx="28" cy="28" r="25"/>${daily ? '<path d="M17 29.5l7.5 7.5L40 21"/>' : '<circle class="dot" cx="28" cy="28" r="7"/>'}</svg>`;
}
function viewRunDone(){
  const r = S.run, lang = r.lang;
  const daily = r.kind === 'daily';
  const total = r.ok + r.bad, res = r.res || [], missed = r.missed || [];
  const perfect = total > 0 && !r.bad;
  const title = daily ? 'Tagwerk erledigt' : perfect && total >= 3 ? 'Fehlerfrei' : 'Runde beendet';
  const lead = !total ? 'Keine Aufgabe beantwortet.' : perfect ? (total === 1 ? 'Auf Anhieb richtig.' : `Alle ${total} auf Anhieb richtig.`) : `${r.ok} von ${total} auf Anhieb richtig.`;
  // Ergebnis je Aufgabe als Leiste: auf einen Blick, wo es gehakt hat
  const nOk = res.filter(x => x.good && !x.near).length, nNear = res.filter(x => x.near).length, nBad = res.length - nOk - nNear;
  const strip = res.length > 1 ? `<div class="rstrip${r.stamped ? '' : ' anim'}" role="img" aria-label="Ergebnis je Aufgabe: ${nOk} richtig${nNear ? `, ${nNear} fast richtig` : ''}${nBad ? `, ${nBad} falsch` : ''}">${res.map((x, k) => `<i class="rs ${x.good ? (x.near ? 'rs-near' : 'rs-ok') : 'rs-bad'}" style="--i:${k}"></i>`).join('')}</div>` : '';
  // Kennzahlen nur, wenn sie etwas sagen
  const fresh = res.filter(x => x.fresh).length;
  const kp = [];
  const mins = Math.round((r.secs || 0) / 60);
  if (mins >= 1) kp.push([mins, mins === 1 ? 'Minute' : 'Minuten']);
  if (fresh) kp.push([fresh, fresh === 1 ? 'neuer Satz' : 'neue Sätze']);
  if ((r.best || 0) >= 3 && r.best < total) kp.push([r.best, 'richtig in Folge']);
  const kpis = kp.length >= 2 ? `<div class="kpis done-kpis" style="grid-template-columns:repeat(${Math.min(3, kp.length)}, 1fr)">${kp.slice(0, 3).map(([v, l]) => `<div><b>${esc(String(v))}</b><span>${l}</span></div>`).join('')}</div>` : '';
  // Was die Wiederholungsplanung daraus macht
  const sits = res.filter(x => x.good && x.ivl > 1).map(x => x.ivl);
  const dWhen = n => (n === 2 ? 'übermorgen' : n < 14 ? `in ${n} Tagen` : n < 60 ? `in ${Math.round(n / 7)} Wochen` : `in ${Math.round(n / 30)} Monaten`);
  const span = sits.length ? (() => {
    const lo = Math.min(...sits), hi = Math.max(...sits);
    const unit = n => (n < 14 ? ['Tagen', n] : n < 60 ? ['Wochen', Math.round(n / 7)] : ['Monaten', Math.round(n / 30)]);
    const [ul, nl] = unit(lo), [uh, nh] = unit(hi);
    const when = dWhen(lo) === dWhen(hi) ? dWhen(lo) : lo === 2 ? `übermorgen bis ${dWhen(hi)}` : ul === uh ? `in ${nl} bis ${nh} ${ul}` : `${dWhen(lo)} bis ${dWhen(hi).replace(/^in /, '')}`;
    return `<p class="sits"><b>Nächste Wiederholung:</b> ${sits.length === 1 ? '1 Satz kommt' : `${sits.length} Sätze kommen`} ${when} wieder.</p>`;
  })() : '';
  const sk = daily && !(r.miles || []).some(e => e.k === 'streak') ? (() => { const n = streak(); return n >= 2 ? `<p class="hint">Tag ${n} in Folge.</p>` : ''; })() : '';
  const tomorrow = daily ? (() => { const n = forecast(lang)[1].n; return n ? `<p class="hint">Morgen ${n === 1 ? 'kommt 1 Satz' : `kommen ${n} Sätze`} zur Wiederholung.</p>` : ''; })() : '';
  const missedHtml = missed.length ? `<h2 class="grp">Noch nicht sicher</h2>
    <div class="rows">${missed.slice(0, 6).map(x => `<div class="row static"><span class="txt"><span class="rt wordrow" lang="${lang}">${linkWords(x.target, lang)}</span>${x.de ? `<span class="rd">${esc(x.de)}</span>` : ''}</span>${speakBtn(x.target, lang)}</div>`).join('')}</div>
    ${missed.length > 6 ? `<p class="legend">und ${missed.length - 6} weitere</p>` : ''}${missed.some(x => x.id) ? '<p class="legend">Sie kommen morgen wieder.</p>' : ''}` : '';
  const nudge = !daily && !DB.done[today()] && !S.dailyRun ? `<div class="notice ok"><span>Das Tagwerk für heute steht noch aus.</span><button type="button" class="link" data-a="daily">Starten</button></div>` : !daily && S.dailyRun && S.dailyRun.lang === lang ? `<div class="notice ok"><span>Dein Tagwerk ist noch offen.</span><button type="button" class="link" data-a="daily">Fortsetzen</button></div>` : '';
  const buttons = daily
    ? '<button type="button" class="ghost" data-a="tab" data-v="extra">Weiter üben</button><button type="button" class="primary" data-a="tab" data-v="home">Fertig</button>'
    : '<button type="button" class="ghost" data-a="tab" data-v="extra">Fertig</button><button type="button" class="primary" data-a="again">Noch eine Runde</button>';
  const reading = daily ? `<p class="hint readtip">Zum Lesen: ${READING[lang].map(readLink).join(', ').replace(/, ([^,]*)$/, ' oder $1')}.</p>` : '';
  return `<div class="donebox">
    ${stampSvg(r, daily, !!(r.miles && r.miles.length))}
    <h1 class="done-h">${title}</h1>
    ${mileHtml(r)}
    <p class="lead">${lead}</p>
    ${r.ended && r.kind === 'extraNew' && r.leftNew ? `<p class="hint" style="margin-top:0">${plural(r.leftNew, 'neuer Satz bleibt', 'neue Sätze bleiben')} für später.</p>` : ''}
    ${strip}${kpis}${span}
    ${sk}${tomorrow}
    ${monthHtml(r.month)}
    ${topicsHtml(r)}
    ${nextTopicHtml(r)}
    ${missedHtml}
    ${bonusHtml(r)}
    ${nudge}
    ${reading}
  </div><div class="actionbar"><div class="in">${buttons}</div></div>`;
}
function viewWrite(){
  const w = S.write, lang = w.lang, L = LANG[lang];
  const ex = w.extra && W_EXTRA[lang].find(x => x.k === w.extra);
  const ltBlock = w.lt === 'loading' ? '<p class="hint"><span class="dots">Wird geprüft</span></p>'
    : typeof w.lt === 'string' ? `<p class="hint">${esc(w.lt)}</p>`
    : w.lt ? ltHtml(w.text, w.lt, lang, true) + `<p class="src">Geprüft von <a href="https://languagetool.org" target="_blank" rel="noopener">LanguageTool</a>. Dein Text wurde dafür an LanguageTool gesendet.${lang === 'sv' ? ' Für Schwedisch prüft es vor allem die Rechtschreibung.' : ''}</p>` : '';
  return backBar('Text schreiben') + `
    <p class="kicker">${w.restored ? 'Dein Entwurf von vorhin' : `Schreib 4 bis 6 Sätze auf ${L.deName}`}</p>
    <p class="de" lang="de">${esc(w.prompt)}</p>
    <p class="vocab"><button type="button" class="link" data-a="wnew">Andere Aufgabe</button></p>
    ${ex ? `<div class="wextra"><span class="wx-t">Extra: ${esc(ex.t)}</span><span class="wx-b"><button type="button" class="link dim" data-a="wextra">Andere</button><button type="button" class="link dim" data-a="wextraoff">Ohne</button></span></div>` : `<p class="vocab"><button type="button" class="link dim" data-a="wextra">Mit Extra-Aufgabe schreiben</button></p>`}
    ${w.sugg && w.sugg.length ? `<p class="wsugg">Aus deinen neuen Sätzen, gern gebeugt: ${w.sugg.map(x => `<button type="button" class="wchip" data-a="lookup" data-w="${esc(x.base)}" lang="${lang}">${esc(x.base)}</button>`).join('')}${w.suggMore ? ' <button type="button" class="link dim" data-a="wsugg">Andere Wörter</button>' : ''}</p>` : ''}
    <textarea id="wtext" class="tw" lang="${lang}" rows="7" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="${esc(L.ph)}">${esc(w.text)}</textarea>
    ${charbar(lang)}
    ${w.prof ? profileHtml(lang, w.prof, w.extra) : ''}
    ${ltBlock}
    ${w.copied ? '<p class="hint">Kopiert. Muttersprachler korrigieren ihn etwa in HelloTalk oder Tandem.</p>' : `<p class="hint"><button type="button" class="link dim" data-a="wcopy">Kopieren, um ihn Muttersprachlern zu zeigen</button></p>`}
    ${archiveHtml(lang)}
    <div class="actionbar"><div class="in"><button type="button" class="ghost" data-a="wlt">Online prüfen</button><button type="button" class="primary" data-a="weval">Auswerten</button></div></div>`;
}

function viewOwn(){
  const o = S.own, lang = o.lang, L = LANG[lang];
  return backBar('Eigenen Satz eintragen') + noticeHtml() + `<p class="lead-s">Der Satz kommt als neuer Satz in dein Tagwerk und wird wiederholt wie alle anderen. Trag nur Sätze ein, bei denen du sicher bist, dass sie stimmen.</p><section class="form">
    <label>Auf Deutsch<input type="text" id="ownDe" value="${esc(o.de)}" placeholder="Ich habe den Zug verpasst."></label>
    <label>Auf ${L.deName}<input type="text" id="ownT" class="tw" lang="${lang}" value="${esc(o.t)}" placeholder="${esc(L.ph)}" autocorrect="off" spellcheck="false"></label>
    ${charbar(lang)}
  </section>
  <div class="actionbar"><div class="in"><button type="button" class="primary" data-a="ownsave">Satz speichern</button></div></div>`;
}
function viewTat(){
  const t = S.tat, lang = t.lang;
  const trapOpts = TRAPS[lang].filter(x => TAT_Q[lang][x.id]).map(x => `<option value="${x.id}"${t.trap === x.id ? ' selected' : ''}>${esc(x.label)}</option>`).join('');
  const picked = Object.values(t.picked).filter(Boolean).length;
  let res = '';
  if (t.status === 'loading') res = '<p class="hint"><span class="dots">Suche</span></p>';
  else if (t.status === 'error') res = `<p class="notice warn">${esc(t.err)}</p>`;
  else if (t.status === 'done') {
    res = t.results.length
      ? `<p class="hint">Tippe an, was du übernehmen möchtest.</p><div class="rows picklist">${t.results.map((x, i) => `<div class="row pickrow${t.picked[i] ? ' on' : ''}"><button type="button" class="pickbtn" data-a="tatpick" data-i="${i}" aria-pressed="${!!t.picked[i]}"><span class="check" aria-hidden="true"></span><span class="txt"><span class="rt" lang="${lang}">${esc(x.target)}</span><span class="rd">${esc(x.de)}</span></span></button>${x.audio ? `<button type="button" class="speak native" data-a="tatplay" data-i="${i}" aria-label="Aufnahme abspielen">${ICON}</button>` : ''}</div>`).join('')}</div>
        <p class="src">Aus <a href="https://tatoeba.org" target="_blank" rel="noopener">Tatoeba</a>, nur Sätze von Muttersprachlern (CC BY 2.0 FR). Der farbige Lautsprecher spielt eine echte Aufnahme.</p>`
      : '<p class="hint">Nichts Neues gefunden. Probier ein anderes Thema oder eine andere Wortform.</p>';
  }
  const bar = t.status === 'done' && t.results.length
    ? `<button type="button" class="ghost" data-a="tatgo">Neu suchen</button><button type="button" class="primary" data-a="tatadd"${picked ? '' : ' disabled'}>${picked ? `${plural(picked, 'Satz', 'Sätze')} übernehmen` : 'Nichts ausgewählt'}</button>`
    : `<button type="button" class="primary" data-a="tatgo">Suchen</button>`;
  return backBar('Beispielsätze suchen') + noticeHtml() + `<p class="lead-s">Echte Sätze von Muttersprachlern mit deutscher Übersetzung, aus der freien Sammlung Tatoeba. Was du übernimmst, kommt als neue Sätze in dein Tagwerk.</p><section class="form">
    <div class="seg2" role="radiogroup"><button type="button" role="radio" aria-checked="${t.mode === 'topic'}" data-a="tatmode" data-m="topic">Nach Thema</button><button type="button" role="radio" aria-checked="${t.mode === 'word'}" data-a="tatmode" data-m="word">Nach Wort</button></div>
    ${t.mode === 'topic' ? `<select id="tatTrap" aria-label="Thema">${trapOpts}</select>` : `<input type="text" id="tatWord" class="tw" lang="${lang}" value="${esc(t.word)}" placeholder="z. B. ${lang === 'sv' ? 'orkar' : 'aprovechar'}" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Wort"><p class="hint">Gesucht wird genau die eingegebene Form, also zum Beispiel „orkar“ statt „orka“.</p>`}
  </section>${res}<div class="actionbar"><div class="in">${bar}</div></div>`;
}
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const WDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const pct = x => Math.round(x * 100) + ' %';
// Lernzeit als Kennzahl, Zahl groß, Einheit darunter: bis 10 Stunden in Minuten („81 Minuten“, nie „1 Stunden“),
// dann Stunden mit einer Nachkommastelle, ab 100 Stunden ganz
const bigTime = secs => {
  const m = Math.round(secs / 60); if (m < 600) return [String(m), m === 1 ? 'Minute' : 'Minuten'];
  const h = m / 60; return [h < 100 ? h.toFixed(1).replace('.', ',') : Math.round(h).toLocaleString('de-DE'), 'Stunden'];
};
function fmtMin(secs){
  const m = Math.round(secs / 60);
  if (secs > 0 && m < 1) return 'unter 1 Min.';
  if (m < 60) return m + ' Min.';
  return Math.floor(m / 60) + ' Std.' + (m % 60 ? ' ' + (m % 60) + ' Min.' : '');
}
const dateOf = ds => { const [y, m, d] = ds.split('-').map(Number); return new Date(y, m - 1, d); };
function calendarSvg(){
  const t = today(), first = totals().first;
  const since = first ? Math.floor(dayDiff(mondayOf(t), mondayOf(first)) / 7) + 1 : 1;
  const weeks = Math.min(156, Math.max(17, since));
  const cell = 13, gap = 3, top = 14, step = cell + gap;
  const start = addDays(mondayOf(t), -7 * (weeks - 1)), free = streakData().free;
  // Geteilter Rand für „an beiden Sprachen etwas geübt“: oben links Schwedisch, unten rechts Spanisch (wie die gefüllte Kachel)
  let out = '<defs><linearGradient id="calpb" x1="0" y1="0" x2="1" y2="1"><stop offset=".5" style="stop-color:var(--sv)"/><stop offset=".5" style="stop-color:var(--es)"/></linearGradient></defs>', active = 0, total = 0, lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const dw = dateOf(addDays(start, w * 7)), mo = dw.getMonth();
    if (mo !== lastMonth) { out += `<text x="${w * step}" y="9">${MONTHS[mo]}${mo === 0 ? ' ' + String(dw.getFullYear()).slice(2) : ''}</text>`; lastMonth = mo; }
    for (let k = 0; k < 7; k++) {
      const ds = addDays(start, w * 7 + k);
      if (ds > t) continue;
      const sv = dayLog(ds, 'sv').n || 0, es = dayLog(ds, 'es').n || 0, n = sv + es;
      if (first && ds >= first) { total++; if (n) active++; }
      // Form = Einsatz (gefüllt: Tagwerk, Umriss: etwas geübt, gestrichelt: Pausetag), Farbe = Sprache, beide Sprachen geteilt
      const ts = doneIn(ds, 'sv'), te = doneIn(ds, 'es'), kind = DB.done[ds] ? 'd' : n ? 'p' : '';
      const x = w * step, y = top + k * step, lang = kind === 'd' ? (ts && te ? 'b' : ts ? 's' : te ? 'e' : sv && es ? 'b' : sv ? 's' : 'e') : sv && es ? 'b' : sv ? 's' : es ? 'e' : '';
      const state = `${ds === t ? ' now' : ''}${S.calDay === ds ? ' sel' : ''}`;
      if (kind === 'd' && lang === 'b') out += `<g data-a="calday" data-d="${ds}"><rect class="ds" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3"/><path class="de" d="M${x + cell} ${y + 1.5}V${y + cell - 3}Q${x + cell} ${y + cell} ${x + cell - 3} ${y + cell}H${x + 1.5}Z"/><rect class="ov${state}" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3"/></g>`;
      else out += `<rect data-a="calday" data-d="${ds}" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" class="${kind ? kind + lang : 'c0'}${free.has(ds) && !n ? ' fr' : ''}${state}"/>`;
    }
  }
  const W = weeks * step - gap, H = top + 7 * step - gap;
  const days = ['Mo', 'Mi', 'Fr'].map((l, i) => `<text x="0" y="${top + i * 2 * step + cell - 2}">${l}</text>`).join('');
  return {
    svg:`<div class="calwrap"><svg class="cal cal-days" width="20" height="${H}" viewBox="0 0 20 ${H}" aria-hidden="true">${days}</svg><div class="calscroll" id="calscroll"><svg class="cal" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Übungstage">${out}</svg></div></div>`,
    active, total, first, scrollable:since > 20
  };
}
/* ---------- Lernminuten der letzten 14 Tage; Antippen zeigt, was an dem Tag lief (wie im Kalender) ---------- */
const MIN_LANGS = ['sv', 'es'];
// Summe über Tage je Sprache: Protokoll (Minuten, Aufgaben, neu, Wiederholungen, gefestigt) und Fehlerquellen (erste Versuche, Themen)
function actOf(days, l){
  const o = { n:0, secs:0, fresh:0, rev:0, revOk:0, mat:0, first:0, bad:0, tw:0, topics:{} };
  days.forEach(ds => {
    const x = dayLog(ds, l); ['n', 'secs', 'fresh', 'rev', 'revOk', 'mat'].forEach(k => { o[k] += x[k] || 0; });
    if (doneIn(ds, l)) o.tw++;
    const t = DB.tlog && DB.tlog[ds] && DB.tlog[ds][l]; if (!t) return;
    Object.keys(t).forEach(k => {
      const v = t[k]; if (!Array.isArray(v)) return;
      if (k.startsWith('t:')) { o.first += v[0]; o.bad += v[1]; }
      else if (k.startsWith('p:')) { const c = o.topics[k.slice(2)] = o.topics[k.slice(2)] || [0, 0]; c[0] += v[0]; c[1] += v[1]; }
    });
  });
  return o;
}
function minSpan(){
  const t = today();
  return Array.from({ length:14 }, (_, k) => { const ds = addDays(t, k - 13); return { key:ds, days:[ds] }; });
}
const minSecs = x => MIN_LANGS.reduce((a, l) => a + x.act[l].secs, 0);
const minTasks = x => MIN_LANGS.reduce((a, l) => a + x.act[l].n, 0);
// Wie im Kalender: nichts vorgewählt; ein Tipp öffnet die Karte, ein zweiter auf dieselbe Säule schließt sie
function minPicked(data){ return S.minDay && data.some(x => x.key === S.minDay) ? S.minDay : null; }
const fmtDayLong = ds => { const d = dateOf(ds); return `${WDAYS_FULL[d.getDay()]}, ${d.getDate()}. ${MONTHS_FULL[d.getMonth()]}`; };
const fmtDayShort = ds => { const d = dateOf(ds); return `${d.getDate()}. ${MONTHS_FULL[d.getMonth()]}`; };
function relDay(ds){ const k = dayDiff(today(), ds); return k === 0 ? 'heute' : k === 1 ? 'gestern' : k === 2 ? 'vorgestern' : ''; }
// Stunden (Anzahl Aufgaben je Stunde) als Zeitspannen: 7, 8, 21 → „7–9 und 21–22 Uhr“
function hourSpans(h){
  const hs = Object.keys(h || {}).map(Number).filter(k => h[k] > 0).sort((a, b) => a - b); if (!hs.length) return '';
  const out = []; let a = hs[0], b = hs[0];
  hs.slice(1).concat(null).forEach(x => { if (x === b + 1) { b = x; return; } out.push(`${a}–${b + 1}`); if (x != null) { a = x; b = x; } });
  return (out.length > 1 ? out.slice(0, -1).join(', ') + ' und ' + out[out.length - 1] : out[0]) + ' Uhr';
}
function minChart(data, sel){
  const t = today(), H = 96, free = streakData().free;
  const mins = data.map(x => minSecs(x) / 60);
  const max = Math.max(5, ...mins);
  // Durchschnitt pro Übungstag, ab drei Übungstagen
  const base = mins.filter(m => m > 0), avg = base.length >= 3 ? base.reduce((a, m) => a + m, 0) / base.length : 0;
  const cols = data.map((x, i) => {
    const m = mins[i], n = minTasks(x), unm = n > 0 && m === 0, d = dateOf(x.key), fr = free.has(x.key) && !n;
    const what = unm ? 'geübt, ohne Zeitmessung' : m ? fmtMin(minSecs(x)) : fr ? 'Pausetag' : 'nicht geübt';
    const seg = l => (x.act[l].secs ? `<span class="m-${l}" style="height:${(x.act[l].secs / 60 / max * 100).toFixed(1)}%"></span>` : '');
    const val = unm ? '–' : m > 0 && m < 1 ? '<1' : Math.round(m) || '';
    return `<button type="button" class="mc${x.key === sel ? ' sel' : ''}${x.key === t ? ' now' : ''}${unm ? ' unm' : ''}${fr ? ' fr' : ''}${i && d.getDay() === 1 ? ' mon' : ''}" data-a="mpick" data-k="${x.key}" aria-pressed="${x.key === sel}" aria-label="${fmtDayShort(x.key)}: ${what}"><span class="mcv">${val}</span><span class="mcb">${seg('sv')}${seg('es')}</span><span class="mcl">${WDAYS[d.getDay()]}</span></button>`;
  }).join('');
  const line = avg ? `<span class="mavg" style="top:${(17 + (1 - avg / max) * H).toFixed(1)}px" aria-hidden="true"></span>` : '';
  return { html:`<div class="mchart" role="group" aria-label="Lernminuten pro Tag, letzte 14 Tage">${line}${cols}</div>`, avg };
}
// Tag im Detail, gleich für Lernminuten und Kalender: Titel, darunter Datum und Uhrzeit,
// dann eine kleine Tabelle je Sprache. Das Quadrat folgt dem Kalender: gefüllt = Tagwerk, Rand = nur geübt.
const minVal = secs => (!secs ? '–' : secs < 30 ? '<1' : String(Math.round(secs / 60)));
function actTable(rows){
  const head = '<thead><tr><th scope="col"><span class="sr-only">Sprache</span></th><th scope="col">Min.</th><th scope="col">Aufgaben</th><th scope="col">richtig</th><th scope="col">neu</th></tr></thead>';
  const body = rows.map(({ l, a, tw }) => `<tr><th scope="row"><i class="sq ${tw ? 'd' : 'p'}${l === 'sv' ? 's' : 'e'}" aria-hidden="true"></i>${LANG[l].deName}${tw ? '<span class="sr-only">, Tagwerk erledigt</span>' : ''}</th><td>${minVal(a.secs)}</td><td>${a.n}</td><td>${a.first ? pct((a.first - a.bad) / a.first) : '–'}</td><td>${a.fresh}</td></tr>`).join('');
  return `<table class="dt">${head}<tbody>${body}</tbody></table>`;
}
// Themen mit den meisten Fehlern, über beide Sprachen; antippen öffnet das Themenblatt in der Sprache des Themas
function errLine(rows){
  const all = [];
  rows.forEach(({ l, a }) => Object.entries(a.topics).forEach(([id, v]) => { if (v[1] > 0) all.push({ l, id, bad:v[1], n:v[0] }); }));
  const top = all.sort((x, y) => y.bad - x.bad || y.n - x.n).slice(0, 2).map(x => { const tr = trapMeta(x.l, x.id); return !tr ? '' : tr.id === 'eigene' ? esc(tr.label) : `<button type="button" class="term" data-a="topic" data-l="${x.l}" data-t="${tr.id}">${esc(tr.label)}</button>`; }).filter(Boolean);
  return top.length ? `<p class="dc-x">Fehler bei ${top.join(' und ')}.</p>` : '';
}
function detailCard(title, sub, rows, empty, extra){
  return `<div class="dcard" aria-live="polite"><p class="dc-h">${title}</p>${sub ? `<p class="dc-s">${sub}</p>` : ''}${rows.length ? actTable(rows) + errLine(rows) : `<p class="dc-n">${empty}</p>`}${extra || ''}</div>`;
}
function dayCard(ds){
  const rows = MIN_LANGS.map(l => ({ l, a:actOf([ds], l) })).filter(r => r.a.n).map(r => Object.assign(r, { tw:r.a.tw > 0 }));
  const rel = relDay(ds), hours = rows.length ? hourSpans(DB.tlog && DB.tlog[ds] && DB.tlog[ds].h) : '';
  const title = rel ? rel[0].toUpperCase() + rel.slice(1) : fmtDayLong(ds);
  const sub = [rel ? fmtDayLong(ds) : '', hours].filter(Boolean).join(' · ');
  const empty = ds === today() ? 'Noch nicht geübt.' : streakData().free.has(ds) ? 'Pausetag, die Serie lief weiter.' : 'Nicht geübt.';
  // Etappen dieses Tages, wie in „Dein Weg“ (seit 24.63)
  const ms = wayEvents().done.filter(e => e.d === ds);
  const extra = ms.length ? `<ul class="dc-m">${ms.map(e => `<li><i class="sq rl-${e.l || 'x'}-sq" aria-hidden="true"></i>${esc(e.t)}${e.l ? ` <span class="wl-lang">${LANG[e.l].deName}</span>` : ''}</li>`).join('')}</ul>` : '';
  return detailCard(title, sub, rows, empty, extra);
}
function minutesHtml(){
  const data = minSpan().map(x => Object.assign(x, { act:Object.fromEntries(MIN_LANGS.map(l => [l, actOf(x.days, l)])) }));
  if (!data.some(x => minTasks(x) > 0) && !Object.keys(DB.log).some(k => MIN_LANGS.some(l => (dayLog(k, l).secs || 0) > 0))) return '';
  const sel = minPicked(data), ch = minChart(data, sel), total = data.reduce((a, x) => a + minSecs(x), 0);
  const big = bigTime;
  const practiced = data.filter(x => minTasks(x) > 0).length, withTime = data.filter(x => minSecs(x) > 0).length;
  const [tv, tu] = big(total), [av, au] = big(withTime ? total / withTime : 0);
  const kp = [[total ? tv : '–', `${tu} in 14 Tagen`], [`${practiced} von 14`, 'Tagen geübt'], [withTime ? av : '–', `${au} pro Übungstag`]];
  // Vergleich mit den 14 Tagen davor, wenn damals schon geübt wurde
  let prevTxt = '';
  const f = totals().first, pStart = addDays(today(), -27);
  if (f && f <= pStart) {
    let ps = 0; for (let k = 0; k < 14; k++) MIN_LANGS.forEach(l => { ps += dayLog(addDays(pStart, k), l).secs || 0; });
    const [pv, pu] = big(ps);
    prevTxt = ps ? `Die 14 Tage davor: ${pv} ${pu}.` : 'Die 14 Tage davor: nicht geübt.';
  }
  const avgKey = ch.avg ? '<span><i class="mavgk"></i>Durchschnitt</span>' : '';
  const key = activeLangs().length > 1 ? `<p class="legend keyrow mkey"><span><i class="sq m-sv"></i>Schwedisch</span><span><i class="sq m-es"></i>Spanisch</span>${avgKey}</p>` : avgKey ? `<p class="legend keyrow mkey">${avgKey}</p>` : '';
  const unm = data.some(x => minTasks(x) > 0 && !minSecs(x)) ? '<p class="legend">„–“: geübt, noch ohne Zeitmessung.</p>' : '';
  return `<h2 class="grp">Lernminuten, letzte 14 Tage</h2><div class="chart mins">
    <div class="kpis mk">${kp.map(([v, lab]) => `<div><b>${v}</b><span>${lab}</span></div>`).join('')}</div>
    ${prevTxt ? `<p class="legend mprev">${prevTxt}</p>` : ''}
    ${ch.html}${key}${unm}
    ${sel ? dayCard(sel) : '<p class="legend mhint">Tipp auf einen Tag für Details.</p>'}
  </div>`;
}
function forecast(lang){
  const t = today();
  return Array.from({ length:7 }, (_, k) => {
    const ds = addDays(t, k);
    const n = BANK[lang].filter(i => { const s = stOf(i.id); return s && (k === 0 ? s.due <= t : s.due === ds); }).length;
    return { label:k === 0 ? 'heute' : WDAYS[dateOf(ds).getDay()], n };
  });
}
// Behalten pro Woche, damit man Trends sieht (etwa wenn zu viel Neues dazukam)
function retTrend(lang){
  const weeks = [], mo = mondayOf(today());
  for (let w = 7; w >= 0; w--) {
    const start = addDays(mo, -7 * w); let rev = 0, ok = 0;
    for (let k = 0; k < 7; k++) { const x = dayLog(addDays(start, k), lang); rev += x.rev || 0; ok += x.revOk || 0; }
    weeks.push({ start, rev, ok });
  }
  if (weeks.filter(x => x.rev >= 10).length < 3) return '';
  const W = 340, H = 132, L = 26, R = 6, T = 16, B = 18, bw = (W - L - R) / 8;
  const y = p => T + (1 - (Math.max(0.5, p) - 0.5) / 0.5) * (H - T - B);
  let g = '';
  [0.5, 0.75, 1].forEach(p => { g += `<line x1="${L}" x2="${W - R}" y1="${y(p)}" y2="${y(p)}" class="gl"/><text x="${L - 4}" y="${y(p) + 3}" class="yl">${Math.round(p * 100)}</text>`; });
  weeks.forEach((x, i) => {
    const cx = L + i * bw + bw / 2, d = dateOf(x.start);
    if (x.rev >= 10) {
      const p = x.ok / x.rev, top = Math.min(y(p), H - B - 4), tall = H - B - top > 18;
      g += `<rect x="${cx - bw * 0.3}" y="${top}" width="${bw * 0.6}" height="${H - B - top}" rx="3" class="${p < 0.8 ? 'bw' : 'bo'}"/><text x="${cx}" y="${tall ? top + 12 : top - 4}" class="vl${tall ? ' in' : ''}">${Math.round(p * 100)}</text>`;
    } else g += `<rect x="${cx - bw * 0.3}" y="${y(0.5) - 2}" width="${bw * 0.6}" height="2" class="bn"/>`;
    g += `<text x="${cx}" y="${H - 4}" class="xl">${d.getDate()}.${d.getMonth() + 1}.</text>`;
  });
  g += `<line x1="${L}" x2="${W - R}" y1="${y(0.9)}" y2="${y(0.9)}" class="tgt"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="rtsvg" role="img" aria-label="Behalten pro Woche, letzte acht Wochen">${g}</svg>
  <p class="legend"><span class="tgtl"></span>Ziel 90\u00a0%. Prozent pro Woche ab dem genannten Montag, Wochen mit weniger als 10 Wiederholungen bleiben leer.</p>`;
}
// Verlauf: geübte, geschätzt abrufbare und gefestigte Sätze über die Zeit
function niceStep(max){ const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))); return [1, 2, 5, 10].map(m => m * p).find(v => v >= raw) || p * 10; }
function progressChart(lang){
  const days = Object.keys(DB.log).filter(k => (dayLog(k, lang).n || 0) > 0).sort();
  if (!days.length) return '';
  const t = today(), first = days[0], long = dayDiff(t, first) > 400, all = long && S.pcAll;
  const start = long && !all ? addDays(t, -365) : first, span = dayDiff(t, start);
  if (span < 13) return `<h2 class="grp">Verlauf</h2><p class="legend" style="margin:0 4px 8px">Erscheint, sobald du zwei Wochen dabei bist.</p>`;
  const step = span > 180 ? 7 : span > 70 ? 3 : 1;
  const pts = []; let cum = start > first ? days.filter(d => d < start).reduce((a, d) => a + (dayLog(d, lang).fresh || 0), 0) : 0, snapFrom = null;
  for (let k = 0; k <= span; k++) {
    const ds = addDays(start, k);
    cum += dayLog(ds, lang).fresh || 0;
    if (k % step && k !== span) continue;
    let sn = null;
    for (let b = 0; b < step && !sn; b++) { const x = DB.snap && DB.snap[addDays(ds, -b)]; if (x && x[lang]) sn = x[lang]; }
    if (sn && !snapFrom) snapFrom = ds;
    pts.push({ ds, n:cum, m:sn ? sn.m : null, k:sn ? sn.k : null });
  }
  const last = pts[pts.length - 1];
  const max = Math.max(4, ...pts.map(p => Math.max(p.n, p.m || 0, p.k || 0)));
  const st = niceStep(max), top = Math.ceil(max / st) * st;
  const W = 340, H = 168, L = 30, R = 36, T = 10, B = 20;
  const X = i => L + (pts.length === 1 ? 0 : i / (pts.length - 1)) * (W - L - R);
  const Y = v => T + (1 - v / top) * (H - T - B);
  let g = '';
  for (let v = 0; v <= top; v += st) g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${L - 5}" y="${Y(v) + 3}" class="yl">${v}</text>`;
  const path = key => { let dstr = '', pen = false; pts.forEach((p, i) => { const v = p[key]; if (v == null) { pen = false; return; } dstr += `${pen ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`; pen = true; }); return dstr; };
  const series = [['n', 'ln-n', 'geübt'], ['k', 'ln-k', 'abrufbar'], ['m', 'ln-m', 'gefestigt']];
  const ends = [];
  series.forEach(([key, cls]) => {
    const dstr = path(key); if (!dstr) return;
    g += `<path d="${dstr}" class="${cls}"/>`;
    if (last[key] != null) ends.push({ v:last[key], y:Y(last[key]), cls });
  });
  ends.sort((a, b) => a.y - b.y).forEach((e, i, arr) => { if (i && e.y - arr[i - 1].y < 11) e.y = arr[i - 1].y + 11; g += `<text x="${W - R + 4}" y="${e.y + 3}" class="el ${e.cls}">${e.v}</text>`; });
  const fmt = ds => { const x = dateOf(ds); return `${x.getDate()}. ${MONTHS[x.getMonth()]}`; };
  const fmtAx = ds => { const x = dateOf(ds); return span > 300 ? `${MONTHS[x.getMonth()]} ${x.getFullYear()}` : fmt(ds); };
  [0, Math.floor((pts.length - 1) / 2), pts.length - 1].forEach((i, j) => { g += `<text x="${X(i)}" y="${H - 5}" class="xl" text-anchor="${j === 0 ? 'start' : j === 2 ? 'end' : 'middle'}">${fmtAx(pts[i].ds)}</text>`; });
  const late = snapFrom && snapFrom !== start;
  const rangeSeg = long ? `<div class="seg2 pcr" role="radiogroup">${[[false, 'Letztes Jahr'], [true, 'Seit Beginn']].map(([v, l]) => `<button type="button" role="radio" aria-checked="${!!all === v}" data-a="pcrange" data-v="${v ? 1 : 0}">${l}</button>`).join('')}</div>` : '';
  return `<h2 class="grp">Verlauf</h2>${rangeSeg}<div class="chart">
    <svg viewBox="0 0 ${W} ${H}" class="pcsvg" role="img" aria-label="Verlauf der geübten, abrufbaren und gefestigten Sätze">${g}</svg>
    <p class="legend calleg"><span><i class="lk ln-n"></i>geübt</span><span><i class="lk ln-k"></i>geschätzt abrufbar</span><span><i class="lk ln-m"></i>gefestigt</span></p>
    ${late ? `<p class="legend">Abrufbar und gefestigt werden seit dem ${fmt(snapFrom)} erfasst.</p>` : !snapFrom ? '<p class="legend">Abrufbar und gefestigt werden ab heute erfasst.</p>' : ''}
  </div>`;
}
function totals(){
  const keys = Object.keys(DB.log).sort();
  let n = 0, secs = 0, days = 0; const years = {};
  keys.forEach(k => {
    let any = false; const y = k.slice(0, 4); years[y] = years[y] || { days:0, n:0, secs:0, mat:0 };
    ['sv', 'es'].forEach(l => { const x = dayLog(k, l); n += x.n || 0; secs += x.secs || 0; years[y].n += x.n || 0; years[y].secs += x.secs || 0; years[y].mat += x.mat || 0; if (x.n) any = true; });
    if (any) { days++; years[y].days++; }
  });
  // Herausgefallene Tage (älter als 400 Übungstage) aus der Monatssumme
  const A = DB.logArch || {}, logFirst = keys.find(k => ['sv', 'es'].some(l => dayLog(k, l).n));
  Object.keys(A.m || {}).forEach(ym => { const y = ym.slice(0, 4), M = A.m[ym]; years[y] = years[y] || { days:0, n:0, secs:0, mat:0 }; years[y].days += M.days || 0; ['sv', 'es'].forEach(l => { const x = M[l] || {}; years[y].n += x.n || 0; years[y].secs += x.secs || 0; years[y].mat += x.mat || 0; }); });
  const first = A.first && (!logFirst || A.first < logFirst) ? A.first : logFirst;
  return { n:n + archSum('n'), secs:secs + archSum('secs'), first, days:days + archSum('days'), years };
}
function viewProgress(){
  const tab = S.ptab || 'all';
  const lang = tab === 'all' ? S.lang : tab, L = LANG[lang];
  const sd = streakData(), tot = totals();
  const cal = calendarSvg();
  const items = BANK[lang];
  const practiced = items.filter(i => stOf(i.id)).length;
  const mature = matureCount(lang), hiM = matureHigh(lang), nextM = nextMilestone(hiM), prevM = prevMilestone(hiM);
  const known = Math.round(knownEstimate(lang));
  const secs7 = sumLog(lang, 7, 'secs');
  const rev30 = sumLog(lang, 30, 'rev'), revOk30 = sumLog(lang, 30, 'revOk'), revM30 = sumLog(lang, 30, 'revM'), revMOk30 = sumLog(lang, 30, 'revMOk');
  const fc = forecast(lang), fcMax = Math.max(1, ...fc.map(f => f.n)), cap = size().maxRev;
  const dist = { anchored:0, mature:0, young:0, neu:0 };
  items.forEach(i => { const st = stOf(i.id); if (!st) dist.neu++; else if ((st.ivl || 0) >= ANCHORED) dist.anchored++; else if ((st.ivl || 0) >= MATURE) dist.mature++; else dist.young++; });
  const collected = DB.own[lang].map(o => ({ id:o.id, de:o.de, target:o.target })).concat(DB.tat[lang].filter(o => !o.auto).map(o => ({ id:o.id, de:o.de, target:o.target })));
  const firstDate = tot.first ? dateOf(tot.first) : null;
  const ret = rev30 >= 10 ? revOk30 / rev30 : null;
  const tabs = `<div class="ptabs" role="tablist">${[['all', 'Überblick'], ['sv', 'Schwedisch'], ['es', 'Spanisch']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-a="ptab" data-t="${k}">${l}</button>`).join('')}</div>`;
  if (tab === 'all') {
    const tw = activeLangs().reduce((a, l) => a + tagwerkCount(l), 0);
    const summary = ['sv', 'es'].map(l => {
      const n = BANK[l].filter(i => stOf(i.id)).length; if (!n) return '';
      const r30 = sumLog(l, 30, 'rev'), ok30 = sumLog(l, 30, 'revOk');
      const lastDay = Object.keys(DB.log).filter(k => (dayLog(k, l).n || 0) > 0).sort().pop();
      const ago = lastDay ? dayDiff(today(), lastDay) : null;
      return `<button type="button" class="langsum" data-a="ptab" data-t="${l}"><span class="ls-h">${LANG[l].deName}</span><span class="ls-n">${matureCount(l)}</span><span class="ls-l">gefestigte Sätze</span><span class="ls-s">${r30 >= 10 ? `Behalten ${pct(ok30 / r30)}` : `${n} Sätze geübt`}${ago != null ? `<br>${ago === 0 ? 'heute geübt' : ago === 1 ? 'gestern geübt' : `vor ${ago} Tagen geübt`}` : ''}</span></button>`;
    }).filter(Boolean).join('');
    return `<div class="topline"><h1 class="vt">Fortschritt</h1>${gearBtn()}</div>${noticeHtml()}${tabs}
  <section class="today">
    <p class="num">${plural(sd.current, 'Tag', 'Tage')} in Folge</p>
    <p class="breakdown">Längste Serie: ${plural(sd.longest, 'Tag', 'Tage')}. Ein Tagwerk am Tag, egal in welcher Sprache; ein Pausetag pro Woche hält die Serie.</p>
    ${firstDate ? `<div class="kpis k4"><div><b>${tot.days.toLocaleString('de-DE')}</b><span>${tot.days === 1 ? 'Übungstag' : 'Übungstage'}</span></div><div><b>${tw.toLocaleString('de-DE')}</b><span>${tw === 1 ? 'Tagwerk' : 'Tagwerke'}</span></div><div><b>${tot.n.toLocaleString('de-DE')}</b><span>${tot.n === 1 ? 'Aufgabe' : 'Aufgaben'}</span></div><div><b>${bigTime(tot.secs)[0]}</b><span>${bigTime(tot.secs)[1]}</span></div></div>${activeLangs().length > 1 ? `<p class="kmeta"><span>Tagwerke:</span>${activeLangs().map(l => `<span class="kmi"><i class="sq rl-${l}-sq"></i>${LANG[l].deName} ${tagwerkCount(l).toLocaleString('de-DE')}</span>`).join('')}</p>` : ''}<p class="kmeta">seit ${firstDate.getDate()}. ${MONTHS[firstDate.getMonth()]} ${firstDate.getFullYear()}</p>` : ''}
  </section>
  <h2 class="grp">Übungstage</h2>
  <div class="chart">${cal.svg}
    <p class="legend calleg"><span><i class="sq ds"></i>Tagwerk Schwedisch</span><span><i class="sq de"></i>Tagwerk Spanisch</span><span><i class="sq db"></i>beide Sprachen</span><span><i class="sq pb"></i>nur etwas geübt</span><span><i class="sq c0 fr"></i>Pausetag, Serie hält</span></p>
    ${S.calDay ? dayCard(S.calDay) : `<p class="legend chint">${cal.first ? `${cal.active} von ${cal.total} Tagen geübt. Tipp auf einen Tag für Details${cal.scrollable ? ', wischen für frühere Wochen' : ''}.` : 'Noch keine Übungstage.'}</p>`}</div>
  ${minutesHtml()}
  ${hoursHtml()}

  ${summary ? `<h2 class="grp">Sprachen</h2><div class="langsums">${summary}</div>` : ''}
  ${wayHtml()}${yearsHtml()}`;
  }
  return `<div class="topline"><h1 class="vt">Fortschritt</h1>${gearBtn()}</div>${noticeHtml()}${tabs}
  <section class="today">
    <p class="eyebrow">${L.deName}</p>
    <p class="num">${mature} <button type="button" class="term" data-a="term" data-k="gefestigt">${mature === 1 ? 'gefestigter Satz' : 'gefestigte Sätze'}</button></p>
    <div class="mbar" aria-hidden="true"><span style="width:${Math.max(0, Math.round((mature - prevM) / Math.max(1, nextM - prevM) * 100))}%"></span></div>
    <p class="hint" style="margin-top:6px">Nächstes Ziel: ${nextM}${mature ? `, noch ${nextM - mature}` : ''}.</p>
    ${practiced ? (() => { const v = vocabCount(lang), ago = snapAgo(lang, 30), dv = ago && ago.w != null ? v.all - ago.w : null;
      return `<div class="kpis">
        <div><b>${known}</b><span>von ${practiced} <button type="button" class="term" data-a="term" data-k="abrufbar">abrufbar</button></span></div>
        <div><b>${v.all.toLocaleString('de-DE')}</b><span>Wörter${dv ? ` <span class="up">+${dv}</span>` : ''}</span></div>
        <div><b>${secs7 ? fmtMin(secs7).replace(/\.$/, '') : '–'}</b><span>letzte 7 Tage</span></div>
      </div>`; })() : ''}
  </section>
  ${progressChart(lang)}
  <h2 class="grp">Behalten, letzte 30 Tage</h2>
  <div class="chart"><p class="stat">${ret != null ? `<b>${pct(ret)}</b> Von ${rev30} fälligen Sätzen wusstest du ${revOk30} beim ersten Versuch noch.` : rev30 ? `Erst ${plural(rev30, 'Wiederholung', 'Wiederholungen')}. Ab 10 gibt es hier eine Quote.` : 'Noch keine Wiederholungen. Sätze kommen ab dem Tag nach dem ersten Üben wieder.'}</p>
  ${retTrend(lang)}
  ${revM30 >= 10 ? `<p class="legend">Bei gefestigten Sätzen: ${pct(revMOk30 / revM30)} (${revMOk30} von ${revM30}).</p>` : ''}
  ${ret != null ? `<p class="legend">Die Wiederholungen sind so geplant, dass du etwa 90 % noch weißt. ${ret < 0.8 ? 'Du liegst deutlich darunter. Meist heißt das: zu viel Neues auf einmal. Ein kürzeres Tagwerk hilft.' : ret > 0.95 ? ((DB.settings.niveau || 'mittel') === 'fort' ? 'Du liegst deutlich darüber. Ein längeres Tagwerk würde dich nicht überfordern.' : 'Du liegst deutlich darüber. Wenn dir die Sätze leicht fallen: Das Niveau <button type="button" class="link inl" data-a="settings">„Fortgeschritten“</button> bringt längere und schwerere.') : 'Du liegst im Plan.'}</p>` : ''}</div>
  <h2 class="grp">Stand der Sätze</h2>
  <div class="chart"><div class="stack" aria-hidden="true">${['anchored', 'mature', 'young', 'neu'].map(k => dist[k] ? `<span class="s-${k}" style="flex:${dist[k]}"></span>` : '').join('')}</div>
  <p class="legend distline"><span><span class="sq s-anchored"></span>${dist.anchored} <button type="button" class="term" data-a="term" data-k="verankert">verankert</button></span><span><span class="sq s-mature"></span>${dist.mature} <button type="button" class="term" data-a="term" data-k="gefestigt">gefestigt</button></span><span><span class="sq s-young"></span>${dist.young} im Aufbau</span><span><span class="sq s-neu"></span>${dist.neu} neu</span></p></div>
  <h2 class="grp">Wiederholungen der nächsten Tage</h2>
  <div class="chart">${fc.every(f => !f.n) ? '<p class="stat" style="margin:0">In den nächsten sieben Tagen ist nichts fällig.</p>' : ''}<div class="fc${fc.every(f => !f.n) ? ' empty' : ''}">${fc.map(f => `<div class="fcd"><span class="fcn">${f.n}</span><span class="fcb"><span style="height:${Math.round(f.n / fcMax * 100)}%"></span></span><span class="fcl">${f.label}</span></div>`).join('')}</div>
  ${fc.some(f => f.n > cap) ? `<p class="legend">Höchstens ${cap} je Tagwerk, der Rest kommt am Tag darauf.</p>` : ''}</div>
  ${errorSourcesHtml(lang)}
  ${topicGridHtml(lang)}
  ${writingTrendHtml(lang)}
  ${(() => { const gl = (DB.genus && DB.genus[lang]) || {}, traps = Object.keys(gl).filter(w => gl[w].last === 0);
    const gens = genIds(lang).map(g => { const rc = (DB.gen[g] && DB.gen[g].recent) || []; return rc.length >= 10 ? `${GENS[g].short || GENS[g].label} ${Math.round(rc.reduce((a, x) => a + x, 0) / rc.length * 100)} %` : ''; }).filter(Boolean);
    return gens.length || traps.length ? `<p class="legend" style="margin:6px 4px 0">${gens.length ? `Erzeugte Aufgaben, zuletzt richtig: ${esc(gens.join(', '))}.` : ''}${traps.length ? ` Genus-Fallen: ${esc(traps.slice(0, 6).map(w => { const it = GENUS[lang].find(x => x[0] === w); return it ? `${it[1]} ${w}` : w; }).join(', '))}. <button type="button" class="link inl" data-a="form" data-g="genus_${lang}">Genus üben</button>` : ''}</p>` : ''; })()}
  ${collected.length ? `<h2 class="grp">Gesammelte Sätze (${collected.length})</h2><div class="rows">${collected.slice().reverse().slice(0, S.colAll ? 9999 : 5).map(o => `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(o.target)}</span><span class="rd">${esc(o.de)}</span></span><button type="button" class="link${S.armed === 'del:' + o.id ? ' armed' : ''}" data-a="coldel" data-id="${o.id}">${S.armed === 'del:' + o.id ? 'Wirklich entfernen?' : 'Entfernen'}</button>${S.armed === 'del:' + o.id ? '<span class="armnote">Der Lernstand geht verloren.</span>' : ''}</div>`).join('')}</div>${collected.length > 5 ? `<div class="btnrow"><button type="button" class="ghost" data-a="colall">${S.colAll ? 'Weniger anzeigen' : `Alle ${collected.length} anzeigen`}</button></div>` : ''}` : ''}

`;
}

function popupHtml(){
  const P = S.pop; if (!P) return '';
  if (P.type === 'topic') return topicSheetHtml(P);
  if (P.type === 'term') return termSheetHtml(P);
  const e = P.entry;
  let body;
  const exs = examplesFor(P.lang, P.w);
  if (e) body = `${e.l ? `<p class="popl">Grundform: <b lang="${P.lang}">${esc(e.l)}</b></p>` : ''}<p class="popde">${termify(e.de)}</p>${exs.length ? `<p class="pop-sub">In deinen Sätzen</p><ul class="exl">${exs.map(x => `<li><span lang="${P.lang}" class="exs">${esc(x.target)}</span><span class="exg">${esc(x.de)}</span></li>`).join('')}</ul>` : ''}`;
  else if (P.status === 'loading') body = '<p class="popl"><span class="dots">Suche bei Wiktionary</span></p>';
  else if (P.status === 'web') body = P.web.length ? `<ul class="popweb">${P.web.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="src">Aus dem englischen Wiktionary</p>` : '<p class="popl">Auch bei Wiktionary nichts gefunden.</p>';
  else if (P.status === 'error') body = `<p class="popl">${esc(P.err)}</p>`;
  else body = `<p class="popl">Nicht im eingebauten Wörterbuch.</p><button type="button" class="go" data-a="popweb">Online nachsehen</button>`;
  return `<div class="popov" data-a="popclose"></div><div class="pop" role="dialog" aria-label="Wörterbuch">
    <div class="pophead"><span class="popw" lang="${P.lang}">${esc(P.w)}</span>${speakBtn(P.w, P.lang)}</div>
    ${body}
    ${P.si != null && S.view === 'text' ? `<button type="button" class="ghost icon popsay" data-a="tsay" data-i="${P.si}">${ICON} Ganzen Satz anhören</button>` : ''}
    <div class="popfoot"><span class="poplinks"><button type="button" class="link" data-a="popext">Bei ${P.lang === 'es' ? 'LEO' : 'dict.cc'}</button></span><button type="button" class="ghost" data-a="popclose">Schließen</button></div>
  </div>`;
}
function renderPopup(){ const el = document.getElementById('pop'); if (el) el.innerHTML = popupHtml(); document.body.classList.toggle('has-pop', !!S.pop); armBack(); }
// Speicher: Balken bis zur Grenze von etwa 5 MB, Anteil anderer Seiten unter derselben Adresse, dauerhaft ja oder nein
const fmtMB = n => (n >= 1024 * 1024 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const storePct = () => Math.min(100, Math.round(storeUsed() / STORE.limit * 100));
function storeRow(){
  if (!STORE.own) STORE.own = JSON.stringify(DB).length;
  const warn = storeUsed() >= STORE_WARN;
  const other = STORE.other >= 10240 ? ` Davon ${fmtMB(STORE.other)} von anderen Seiten unter ${esc(location.host || 'dieser Adresse')}.` : '';
  const pers = STORE.persisted === true ? ' Der Browser behält die Daten dauerhaft.' : STORE.persisted === false ? ' Der Browser darf die Daten bei Platzmangel löschen.' : '';
  const text = ((warn ? 'Der Speicher wird knapp. Exportier bitte ein Backup.' : '') + other + pers).trim();
  return `<div class="row static store${warn ? ' warn' : ''}"><span class="txt"><span class="rt">Gespeichert: ${fmtMB(storeUsed())} von etwa 5\u00a0MB</span><span class="mbar" role="img" aria-label="${storePct()} % belegt"><span style="width:${Math.max(2, storePct())}%"></span></span>${text ? `<span class="rd">${text}</span>` : ''}${STORE.persisted === false ? '<button type="button" class="link" data-a="persist">Dauerhaft speichern</button>' : ''}</span></div>`;
}
const storeHint = () => (storeUsed() >= STORE_WARN ? `<div class="notice warn"><span>Der Speicher ist zu ${storePct()} % voll. Exportier bitte ein Backup.</span><button type="button" class="link" data-a="toSettings">Ansehen</button></div>` : '');
function viewSettings(){
  const L = LANG[S.lang];
  const autoN = DB.tat[S.lang].filter(o => o.auto).length;
  return backBar('Einstellungen', S.settingsFrom || 'home') + noticeHtml() + `
  <h2 class="grp">Länge des Tagwerks</h2>
  <p class="setl-n">Gilt ab dem nächsten Tagwerk.</p>
  <div class="seg3" role="radiogroup">${Object.entries(SIZES).map(([k, v]) => `<button type="button" role="radio" aria-checked="${DB.settings.size === k}" data-a="size" data-s="${k}">${v.label}<span>${v.newPer} neue Sätze, höchstens ${v.maxRev} Wiederholungen</span></button>`).join('')}</div>
  <h2 class="grp">Sprache beim Start</h2>
  <div class="seg2" role="radiogroup">${[['auto', 'Nach Bedarf'], ['last', 'Zuletzt gewählte']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${(DB.settings.langMode || 'auto') === k}" data-a="langmode" data-v="${k}">${l}</button>`).join('')}</div>
  <p class="setl-n">${(DB.settings.langMode || 'auto') === 'auto' ? 'Die App nimmt die Sprache, in der mehr fällig ist oder die länger nicht dran war. Ein Wechsel oben auf „Heute“ gilt bis morgen.' : 'Die App öffnet in der zuletzt gewählten Sprache.'}</p>
  <h2 class="grp">Mein Niveau</h2>
  <div class="seg3" role="radiogroup">${[['grund', 'Grundlagen'], ['mittel', 'Mittel'], ['fort', 'Fortgeschritten']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${(DB.settings.niveau || 'mittel') === k}" data-a="niveau" data-v="${k}">${l}</button>`).join('')}</div>
  <p class="setl-n">${{ grund:'Kurze, einfache Sätze zuerst.', mittel:'Neue Sätze aus allen Stufen, gemischt.', fort:'Lange und anspruchsvolle Sätze zuerst. Einfache nur in Themen, in denen du zuletzt öfter Fehler gemacht hast. Sichere Grammatik-Übungen kommen seltener, Lesetexte sind nach Schwierigkeit sortiert.' }[DB.settings.niveau || 'mittel']}${DB.settings.niveau === 'fort' && !DB.settings.refill ? ' Die eingebauten Sätze ab Mittelstufe reichen für etwa zwei Wochen. Schalte unten „Neue Sätze automatisch von Tatoeba holen“ ein, dann kommen danach lange Sätze passend zu den Themen nach.' : ''}</p>
  <h2 class="grp">Vorlesen</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${!!DB.settings.autoplay}" data-a="autoplay"><span class="txt"><span class="rt">Lösung nach dem Prüfen vorlesen</span><span class="rd">Verbindet Schriftbild und Aussprache. Unterwegs ohne Kopfhörer besser aus.</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>
  ${navigator.vibrate ? `<h2 class="grp">Vibration</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${DB.settings.haptics !== false}" data-a="haptics"><span class="txt"><span class="rt">Kurz vibrieren nach dem Prüfen</span><span class="rd">Einmal bei richtig, zweimal bei falsch</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>` : ''}
  <h2 class="grp">Nachschub</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${!!DB.settings.refill}" data-a="refill"><span class="txt"><span class="rt">Neue Sätze automatisch von Tatoeba holen</span><span class="rd">Sobald die eingebauten Sätze zur Neige gehen und du online bist. Mit deinem Fortschritt werden die Sätze länger.${autoN ? ` Bisher ${autoN} Sätze für ${L.deName}.` : ''}</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>
  <h2 class="grp">Daten</h2>
  <div class="rows">
    ${storeRow()}
    <button type="button" class="row" data-a="export"><span class="txt"><span class="rt">Backup exportieren</span><span class="rd">Dein Fortschritt liegt nur auf diesem Gerät. ${DB.lastBackup ? `Letztes Backup am ${dateOf(DB.lastBackup).getDate()}. ${MONTHS_FULL[dateOf(DB.lastBackup).getMonth()]} ${dateOf(DB.lastBackup).getFullYear()}.` : 'Noch kein Backup gemacht.'}</span></span></button>
    ${canShareBackup() ? '<button type="button" class="row" data-a="shareBackup"><span class="txt"><span class="rt">Backup teilen</span><span class="rd">Etwa in Google Drive oder per Mail sichern</span></span></button>' : ''}
    <label class="row"><span class="txt"><span class="rt">Backup einspielen</span><span class="rd">Ersetzt den aktuellen Stand. Danach lässt es sich rückgängig machen.</span></span><input type="file" id="importFile" hidden></label>
    ${['sv', 'es'].map(l => `<button type="button" class="row danger${S.armed === 'reset:' + l ? ' armed' : ''}" data-a="reset" data-l="${l}"><span class="txt"><span class="rt">${S.armed === 'reset:' + l ? 'Wirklich zurücksetzen?' : `${LANG[l].deName} zurücksetzen`}</span><span class="rd">${S.armed === 'reset:' + l ? 'Löscht Fortschritt, Statistik und gesammelte Sätze dieser Sprache. Nicht rückgängig zu machen.' : 'Löscht Fortschritt und gesammelte Sätze dieser Sprache'}</span></span></button>`).join('')}
  </div>
  <h2 class="grp">Über Tagwerk</h2>
  <p class="src" style="margin-top:0">Die Wiederholungen plant FSRS-6, dasselbe Verfahren wie in Anki. Lernminuten werden pro Aufgabe gemessen, Pausen über zwei Minuten zählen nicht. Internet brauchen nur die Beispielsätze von Tatoeba, die Textprüfung mit LanguageTool und das Wörterbuch.</p>
  <p class="src">Version ${esc(APP_VERSION)}</p>`;
}
function render(){
  if (S.view !== 'radio' && S.radio) stopRadio();
  if (S.view !== 'text' && S.text && S.text.playing) stopReading();
  // Nachsprechen verlassen: Mikrofon und Wiedergabe sofort aus, Aufnahmen verwerfen
  if (S.view !== 'shadow' && S.shadow) { shTeardown(); S.shadow = null; }
  if ((S.view === 'run' || S.view === 'runDone') && !S.run) S.view = 'home';
  const lang = (S.view === 'run' || S.view === 'runDone') ? S.run.lang : S.lang;
  document.body.dataset.lang = lang;
  tabs();
  let h = '';
  switch (S.view) {
    case 'home': h = viewHome(); break;
    case 'extra': h = viewExtra(); break;
    case 'pickTopic': h = viewPickTopic(); break;
    case 'pickGen': h = viewPickGen(); break;
    case 'run': h = viewRun(); break;
    case 'runDone': h = viewRunDone(); break;
    case 'shadow': h = viewShadow(); break;
    case 'radio': h = viewRadio(); break;
    case 'texts': h = viewTexts(); break;
    case 'text': h = S.text && !S.text.id && !S.text.wiki ? viewWikiLoading() : viewText(); break;
    case 'write': h = viewWrite(); break;
    case 'own': h = viewOwn(); break;
    case 'tat': h = viewTat(); break;
    case 'settings': h = viewSettings(); break;
    case 'ref': h = viewRef(); break;
    default: h = viewProgress();
  }
  $('#app').innerHTML = h;
  renderPopup();
  document.body.classList.toggle('has-actions', !!$('#app .actionbar'));
  if (S.view === 'tat') { const w = $('#tatWord'); if (w) w.addEventListener('input', ev => { S.tat.word = ev.target.value; }); }
  sizeGap($('#answer'));
  // Hördiktat: Satz beim Erscheinen einmal abspielen. render() läuft im Klick auf „Weiter“ bzw. „Hördiktat“,
  // daher erlaubt der Browser den Ton; nach einem Neustart mitten in der Runde bleibt es ggf. still.
  if (S.view === 'run' && S.run && S.run.cur && S.run.cur.intro && S.run.cur.state === 'answer') {
    const ex = S.run.queue[S.run.idx], run = S.run;
    if (ex && ex.type === 'dict') setTimeout(() => { if (S.run === run && run.queue[run.idx] === ex && run.cur.state === 'answer') playItem(itemById(ex.id), 0.9, true); }, 300);
  }
  if (S.run && S.run.cur) { S.run.cur.enter = false; S.run.cur.intro = false; }
  const cs = $('#calscroll');
  if (cs) { cs.scrollLeft = S.calScroll != null ? S.calScroll : cs.scrollWidth; cs.addEventListener('scroll', () => { S.calScroll = cs.scrollLeft; }, { passive:true }); }
  if (S.view === 'runDone' && S.run) S.run.stamped = true;
  if (S.view === 'home' && S.justDone) S.justDone = null;
  if (S.focus) { S.focus = false; const el = $('#answer'); if (el && !el.readOnly) { try { el.focus({ preventScroll:true }); } catch (e) {} caretToEnd(el); } }
  armBack();
}
// Vorgegebener Satzanfang („Tyvärr …“): Schreibmarke ans Ende, nicht davor
function caretToEnd(el){
  if (!el || el.readOnly || !el.value || typeof el.setSelectionRange !== 'function') return;
  try { const n = el.value.length; el.setSelectionRange(n, n); } catch (e) {}
}
// Lücke: immer gleich breit, solange sie leer ist (verrät nichts über die Lösung), und wächst mit dem Getippten
let gapMeasure = null;
const NATIVE_GAP = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('field-sizing', 'content');
function sizeGap(el){
  if (!el || !el.classList || !el.classList.contains('gapin') || NATIVE_GAP) return;
  const val = el.value || '';
  if (!val) { el.style.width = ''; return; }
  let w = 0;
  try {
    if (!gapMeasure) { gapMeasure = document.createElement('span'); gapMeasure.className = 'gapmeasure'; gapMeasure.setAttribute('aria-hidden', 'true'); document.body.appendChild(gapMeasure); }
    gapMeasure.style.font = getComputedStyle(el).font;
    gapMeasure.style.letterSpacing = getComputedStyle(el).letterSpacing;
    gapMeasure.textContent = val;
    w = gapMeasure.getBoundingClientRect().width;
  } catch (e) {}
  const box = el.closest('.cloze');
  const max = box ? box.getBoundingClientRect().width : 0;
  if (w > 0) el.style.width = `${Math.round(Math.min(max || Infinity, w * 1.2 + 30))}px`;
  else el.style.width = `calc(${val.length + 2}ch + 12px)`;
}
function scrollFb(){ const f = $('#fb'); if (f && f.innerHTML) { try { f.scrollIntoView({ block:'nearest', behavior:'smooth' }); } catch (e) {} } }
