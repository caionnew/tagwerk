/* ---------- Begrüßung in der Zielsprache ----------
   Jeden Tag eine andere, innerhalb einer Tageszeit dieselbe (sonst wechselte sie bei jedem Neuzeichnen). Vorrang: Feiertag,
   erster Tag überhaupt, Rückkehr nach drei und mehr Tagen ohne Üben, Tagwerk in dieser Sprache erledigt, heute schon geübt,
   dann Wochentag (Freitagabend fredagsmys, Mittwoch lillördag), dann Tageszeit (am frühen Nachmittag mal fika oder die Frage nach
   dem Mittagessen). Kurz genug für eine Zeile neben dem Wochenstreifen (höchstens 16 Zeichen). Jedes Wort ist antippbar, darum
   stehen alle im Wörterbuch, Wendungen beim Wort, das sie trägt (länge sen = lange her). */
const GREET = {
  sv:{
    late:['Sent uppe?', 'Nattuggla?', 'Sömnlös?'],
    morning:['God morgon!', 'Godmorgon!', 'Morrn!', 'Kaffe först?', 'Pigg i dag?'],
    early:['Tidigt ute!'], // dazu noon: fika am frühen Nachmittag, im Spanischen die Frage nach dem Mittagessen
    day:['Hej!', 'Hallå där!', 'Tjena!', 'Hej på dig!', 'Hej hej!'],
    noon:['Dags för fika?'],
    evening:['God kväll!', 'Hej!', 'Hallå där!', 'Kvällspass?'],
    first:['Nu kör vi!'], back:['Länge sen!', 'Välkommen åter!'], again:['Hej igen!'], done:['Bra jobbat!', 'Snyggt jobbat!', 'Klart för i dag!'],
    // Wochentag (0 = Sonntag) und Tageszeit
    week:{ 1:{ morning:['Måndag igen!'] }, 3:{ evening:['Glad lillördag!'] }, 5:{ day:['Äntligen fredag!'], evening:['Fredagsmys!'] }, 6:{ evening:['Lördagskväll!'] }, 0:{ day:['Skön söndag!'] } }
  },
  es:{
    late:['¿Trasnochando?', '¡Qué tarde es!', '¿Sin sueño?'],
    morning:['¡Buenos días!', '¡Buen día!', '¿Un cafecito?', '¡Arriba!'],
    early:['¡Qué madrugón!'],
    day:['¡Buenas tardes!', '¡Hola!', '¡Buenas!', '¿Qué tal?', '¡Hola, hola!'],
    noon:['¿Ya has comido?'],
    evening:['¡Buenas noches!', '¿Qué tal el día?', '¡Buenas!'],
    first:['¡Empezamos!'], back:['¡Cuánto tiempo!', '¡Qué bien verte!'], again:['¡Hola de nuevo!'], done:['¡Bien hecho!', '¡Buen trabajo!', '¡Así se hace!'],
    week:{ 1:{ morning:['¡Feliz lunes!'] }, 5:{ day:['¡Ya es viernes!'], evening:['¡Ya es viernes!'] }, 6:{ evening:['¡Buen finde!'] }, 0:{ day:['¡Feliz domingo!'] } }
  }
};
// Feiertage (seit 24.90.0): [erster Tag im Jahr, Anzahl Tage, Gruß, Zeichen]. Das erste passende gilt, darum Einzeltage vor
// Zeiträumen (Inocentes vor „¡Felices fiestas!“). Datum über den Namen aus EVENTS (fundstueck.js), wo das Fest dort steht.
// Feste ohne Gruß hier (Alla helgons dag, Día de Muertos, La Tomatina) bekommen den gewöhnlichen. Zeichen: kleine Linienzeichnung
// hinter dem Gruß (ORN), beim ersten Öffnen am Tag einmal bewegt. Höchstens 18 Zeichen; was nicht in eine Zeile passt, wird kleiner
// (fitGreeting).
const feastDay = (lang, name) => y => { const e = EVENTS[lang].find(x => x[0] === name); return e ? e[1](y) : null; };
const adventDay = n => y => { for (let d = 27; d <= 33; d++) { const x = new Date(y, 10, d); if (x.getDay() === 0) return new Date(y, 10, d + 7 * (n - 1)); } return null; };
const HOLIDAY_GREET = {
  sv:[
    [feastDay('sv', 'Fettisdagen'), 1, 'Semmeldags!'],
    [fromEaster(-1), 3, 'Glad påsk!'],
    [feastDay('sv', 'Våffeldagen'), 1, 'Våffeldags!'],
    [feastDay('sv', 'Valborg'), 1, 'Glad valborg!', 'fire'],
    [feastDay('sv', 'Nationaldagen'), 1, 'Glad nationaldag!'],
    [feastDay('sv', 'Midsommar'), 2, 'Glad midsommar!', 'sun'],
    [feastDay('sv', 'Surströmmingspremiär'), 1, 'Håll för näsan!'],
    [feastDay('sv', 'Kanelbullens dag'), 1, 'Kanelbulle?'],
    [feastDay('sv', 'Mårtensafton'), 1, 'Mårtensgås?'],
    [feastDay('sv', 'Lucia'), 1, 'Glad lucia!', 'candle'],
    [fixed(12, 23), 1, 'Lillejulafton!', 'star'],
    [feastDay('sv', 'Julafton'), 3, 'God jul!', 'star'],
    [fixed(12, 27), 4, 'God fortsättning!'],
    [feastDay('sv', 'Nyårsafton'), 1, 'Gott nytt år!', 'spark'],
    [fixed(1, 1), 1, 'Gott nytt år!', 'spark'],
    [fixed(1, 2), 5, 'Gott nytt år!'],
    // Adventssonntage zuletzt: Lucia (2026 der dritte Advent) und Heiligabend gehen vor
    [adventDay(1), 1, 'Trevlig advent!', 'candle'], [adventDay(2), 1, 'Trevlig advent!', 'candle'],
    [adventDay(3), 1, 'Trevlig advent!', 'candle'], [adventDay(4), 1, 'Trevlig advent!', 'candle']
  ],
  es:[
    [fixed(1, 1), 1, '¡Feliz Año Nuevo!', 'spark'],
    [fixed(1, 2), 4, '¡Feliz año!'],
    [feastDay('es', 'Día de Reyes'), 1, '¡Felices Reyes!', 'star'],
    [feastDay('es', 'Carnaval'), 1, '¡Feliz Carnaval!'],
    [feastDay('es', 'Las Fallas'), 1, '¡Felices Fallas!', 'fire'],
    [fromEaster(0), 1, '¡Feliz Pascua!'],
    [feastDay('es', 'Sant Jordi'), 1, '¡Feliz Sant Jordi!'],
    [feastDay('es', 'Noche de San Juan'), 1, '¡Feliz San Juan!', 'fire'],
    [feastDay('es', 'Independencia de México'), 1, '¡Viva México!'],
    [feastDay('es', 'Fiestas Patrias'), 1, '¡Viva Chile!'],
    [feastDay('es', 'Fiesta Nacional'), 1, '¡Hoy es fiesta!'],
    [feastDay('es', 'Nochebuena'), 1, '¡Feliz Nochebuena!', 'star'],
    [fixed(12, 25), 1, '¡Feliz Navidad!', 'star'],
    [feastDay('es', 'Día de los Inocentes'), 1, '¡No te fíes hoy!'],
    [fixed(12, 26), 5, '¡Felices fiestas!'],
    [feastDay('es', 'Nochevieja'), 1, '¡Feliz Nochevieja!', 'spark']
  ]
};
function holidayGreet(lang, t){
  const y = Number(t.slice(0, 4));
  for (const [rule, n, g, orn] of HOLIDAY_GREET[lang]) {
    const d = rule(y); if (!d) continue;
    const k = dayDiff(t, ymd(d));
    if (k >= 0 && k < n) return { g, orn:orn || '' };
  }
  return null;
}
// Zeichen zum Feiertagsgruß, 24er Raster wie die Symbole: Kerze (Advent, Lucia), Stern (Weihnachten, Reyes), Feuerwerk (Neujahr),
// Sonne (Mittsommer), Feuer (Valborg, Fallas, San Juan). Was sich bewegt, hat eine eigene Klasse (Flamme, Strahlen).
const ORN_RAYS = (r1, r2) => Array.from({ length:8 }, (_, i) => { const a = Math.PI / 4 * i - Math.PI / 2, c = Math.cos(a), s = Math.sin(a); return `M${(12 + r1 * c).toFixed(1)} ${(12 + r1 * s).toFixed(1)}L${(12 + r2 * c).toFixed(1)} ${(12 + r2 * s).toFixed(1)}`; }).join('');
const ORN = {
  candle:'<path d="M8.8 21.2v-9.4h6.4v9.4M6.5 21.2h11M12 9.4v2.4"/><path class="orn-fl" d="M12 9.4c-2.2-1.6-2.5-4 0-7 2.5 3 2.2 5.4 0 7Z"/>',
  star:'<path class="orn-st" d="m12 3.2 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.2Z"/>',
  spark:`<path class="orn-ry" d="${ORN_RAYS(4.2, 9.6)}"/><circle cx="12" cy="12" r="1.3"/>`,
  sun:`<circle cx="12" cy="12" r="3.8"/><path class="orn-ry" d="${ORN_RAYS(6.3, 9.4)}"/>`,
  fire:'<path class="orn-fl" d="M12 19.6c-3 0-5-1.9-5-4.6 0-2.4 1.6-3.8 2.8-5.6.4 1.4 1.1 2.3 2.1 2.7-.3-2.7.8-5.1 3.1-7-.2 2.4.7 3.9 1.7 5.3.9 1.3 1.6 2.6 1.6 4.4 0 3-2.3 4.8-6.3 4.8Z"/><path d="M5 21.5 19 19M19 21.5 5 19"/>'
};
// Tageszeit wie bisher: Schwedisch Morgen bis 10, Tag bis 17, Abend bis 23; Spanisch días bis 12, tardes bis 20, noches danach
function greetSlot(lang, h){
  if (lang === 'sv') return h < 5 || h >= 23 ? 'late' : h < 10 ? 'morning' : h < 17 ? 'day' : 'evening';
  return h < 5 ? 'late' : h < 12 ? 'morning' : h < 20 ? 'day' : 'evening';
}
function greeting(lang, now = new Date()){
  const t = fmt(now), hol = holidayGreet(lang, t);
  if (hol) return hol.g;
  const G = GREET[lang], di = dayIndex(t), on = (list, k = 0) => list[(di + k) % list.length];
  const days = Object.keys(DB.log).filter(d => d < t && ['sv', 'es'].some(l => dayLog(d, l).n)).sort();
  const todayAny = ['sv', 'es'].some(l => dayLog(t, l).n);
  if (!days.length && !todayAny) return G.first[0];
  if (!todayAny && days.length && dayDiff(t, days[days.length - 1]) >= 3) return on(G.back);
  if (doneIn(t, lang)) return on(G.done);
  if (dayLog(t, lang).n) return on(G.again);
  const h = now.getHours(), slot = greetSlot(lang, h), wk = (G.week[now.getDay()] || {})[slot];
  if (wk) return on(wk);
  // Früh am Morgen (bis 7) und am frühen Nachmittag (14 bis 16) jeden zweiten Tag die besondere Fassung
  if (h >= 5 && h < 7 && slot === 'morning' && di % 2) return on(G.early);
  if (h >= 14 && h < 16 && di % 2) return on(G.noon);
  return on(G[slot]);
}
// Gruß für den Kopf von „Heute“: Wörter antippbar, am Feiertag mit Zeichen. Bewegt wird das Zeichen nur beim ersten Zeichnen am Tag.
function greetHtml(lang, now = new Date()){
  const t = fmt(now), g = greeting(lang, now), hol = holidayGreet(lang, t), orn = hol && hol.g === g ? hol.orn : '';
  const anim = orn && S.greetAnim !== t + lang;
  if (anim) S.greetAnim = t + lang;
  return `<p class="hello-g wordrow" lang="${lang}">${hangLead(linkWords(g, lang))}${orn ? `<svg class="orn orn-${orn}${anim ? ' go' : ''}" viewBox="0 0 24 24" aria-hidden="true">${ORN[orn]}</svg>` : ''}</p>`;
}
// Der Gruß steht in einer Zeile neben der Woche (CSS: nowrap). Wie breit er ist, hängt an der Schrift des Geräts: Noto Serif und
// Georgia laufen gut ein Sechstel breiter als Times, DejaVu Serif (Linux ohne Noto, so in der CI) noch breiter. Darum gemessen statt
// gezählt: Ist er breiter als seine Spalte, wird er im selben Verhältnis kleiner (bis 24.90 in zwei festen Stufen, die bei breiten
// Schriften nicht reichten), nicht unter 12 px.
// Hängende Satzzeichen (seit 24.94.0): Beginnt eine große Zeile mit ¡ oder ¿, steht das Zeichen vor der linken Kante, damit die
// Buchstaben mit der Zeile darüber oder darunter fluchten („¡Poco a poco!“ unter „Runde beendet“, „¡Hola!“ über dem Datum). So
// macht man es im Satz mit Anführungszeichen am Zeilenanfang. Nur für große Zeilen (Gruß, Zuruf, Radio, Titel der Lesetexte),
// nicht für Fließtext und Aufgaben: Dort sind die Zeichen klein und ¿ kann mitten im Absatz am Zeilenanfang landen. Das Zeichen
// bleibt im antippbaren Wort.
function hangLead(html){ return html.replace(/^((?:<[^>]+>)*)([¡¿])/, (m, tags, c) => `${tags}<span class="hang${c === '¿' ? ' q' : ''}">${c}</span>`); }
// Wie breit ¡ und ¿ sind, hängt an der Schrift des Geräts (Noto Serif schmaler als DejaVu): gemessen, in em, damit es fitGreeting
// übersteht. CSS hat einen Näherungswert für den ersten Bildaufbau und für Umgebungen ohne Messung.
function fitHang(){
  if (typeof getComputedStyle !== 'function') return;
  for (const h of document.querySelectorAll('#app .hang')) {
    const w = h.getBoundingClientRect().width, fs = parseFloat(getComputedStyle(h).fontSize);
    if (w && fs) h.style.marginLeft = -(w / fs).toFixed(3) + 'em';
  }
}
function fitGreeting(){
  const g = $('#app .hello-g');
  if (!g || typeof getComputedStyle !== 'function' || !g.clientWidth) return;
  const w = g.clientWidth, sw = g.scrollWidth;
  if (sw <= w) return;
  g.style.fontSize = Math.max(12, Math.floor(parseFloat(getComputedStyle(g).fontSize) * w / sw * 10) / 10) + 'px';
}
// Datum im Kopf in der Zielsprache (seit 24.91.0), antippbar: „lördag 28 november“ (klein, ohne Komma und Punkt), „sábado, 28 de
// noviembre“. So kommen Wochentage und Monate jeden Tag einmal vorbei.
const DATE_WORDS = {
  sv:{ d:['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'], m:['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'] },
  es:{ d:['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], m:['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] }
};
function dateIn(lang, dt){
  const W = DATE_WORDS[lang], d = W.d[dt.getDay()], m = W.m[dt.getMonth()];
  return lang === 'sv' ? `${d} ${dt.getDate()} ${m}` : `${d}, ${dt.getDate()} de ${m}`;
}
// Antippbar sind die Wörter, nicht die Zahl (das Wörterbuch kennt Zahlen als Wort)
const dateHtml = (lang, dt) => dateIn(lang, dt).split(/( \d+ )/).map(x => (/^ \d+ $/.test(x) ? x : linkWords(x, lang))).join('');
// Zielsprache je Niveau (seit 24.92.0): Ab „Mittel“ steht auch die Serie im Kopf in der Zielsprache, bei „Fortgeschritten“ dazu die
// Anweisungen der Aufgaben (Deutsch auf Tipp). Deutsch bleibt, wo es aufs Verstehen ankommt: Leiste, Knöpfe, Statistik, Regeln.
const niveau = () => DB.settings.niveau || 'mittel';
const STREAK_TL = {
  sv:{ n:n => `${n} ${n === 1 ? 'dag' : 'dagar'} i rad`, start:'Serien börjar i dag', risk:'Öva i dag!' },
  es:{ n:n => `${n} ${n === 1 ? 'día seguido' : 'días seguidos'}`, start:'Hoy empieza la racha', risk:'¡Hoy toca!' }
};
// Anweisungen: deutsch → Zielsprache. Was hier fehlt, bleibt deutsch. Lesetext-Lücken („Aus „Vasaloppet““, „Nachgeschlagen in …“) über das Muster.
const KICK_TL = {
  sv:{ 'Ergänze die Lücke':'Fyll i luckan', 'Übersetze ins Schwedische':'Översätt till svenska', 'Bring die Wörter in die richtige Reihenfolge':'Sätt orden i rätt ordning',
    'Ein Wort bleibt übrig':'Ett ord blir över', 'Hör zu und schreib den Satz auf':'Lyssna och skriv meningen', 'echte Aufnahme':'riktig inspelning',
    'Tipp auf das falsche Wort. Stimmt der Satz, tipp auf „Kein Fehler“.':'Tryck på ordet som är fel. Stämmer meningen: ”Kein Fehler”.', 'Gefunden. Wie heißt es richtig?':'Hittat! Hur ska det vara?',
    'Finde den Fehler':'Hitta felet', 'Bau den Satz um':'Skriv om meningen', 'Welches Wort passt?':'Vilket ord passar?', 'Welche Präposition?':'Vilken preposition?',
    'Welches Possessivpronomen?':'Vilket possessivpronomen?', 'Welche Form nach dem Possessivpronomen?':'Vilken form efter possessivpronomenet?', 'Welche Form nach den/det här?':'Vilken form efter den/det här?',
    'den, det oder de?':'den, det eller de?', 'en oder ett?':'en eller ett?', 'Setz die Mehrzahl ein':'Skriv pluralformen', 'Setz die bestimmte Mehrzahl ein':'Skriv bestämd form plural',
    'Schreib die Uhrzeit in Worten':'Skriv klockslaget med bokstäver', 'Schreib die Uhrzeit als Zahl':'Skriv klockslaget med siffror', 'Hör zu und schreib die Uhrzeit als Zahl':'Lyssna och skriv klockslaget med siffror',
    'Schreib den Preis in Worten':'Skriv priset med bokstäver', 'Schreib den Preis als Zahl':'Skriv priset med siffror', 'Hör zu und schreib den Preis als Zahl':'Lyssna och skriv priset med siffror' },
  es:{ 'Ergänze die Lücke':'Completa el hueco', 'Übersetze ins Spanische':'Traduce al español', 'Bring die Wörter in die richtige Reihenfolge':'Ordena las palabras',
    'Ein Wort bleibt übrig':'Sobra una palabra', 'Hör zu und schreib den Satz auf':'Escucha y escribe la frase', 'echte Aufnahme':'grabación real',
    'Tipp auf das falsche Wort. Stimmt der Satz, tipp auf „Kein Fehler“.':'Toca la palabra incorrecta. Si la frase está bien: «Kein Fehler».', 'Gefunden. Wie heißt es richtig?':'¡Bien visto! ¿Cómo se dice correctamente?',
    'Finde den Fehler':'Encuentra el error', 'Bau den Satz um':'Transforma la frase', 'Tausch das Nomen aus und pass den Satz an':'Cambia el sustantivo y adapta la frase',
    'Welches Wort passt?':'¿Qué palabra encaja?', 'Welche Präposition?':'¿Qué preposición?', 'el oder la?':'¿el o la?', 'Setz die passende Form ein':'Escribe la forma correcta',
    'Setz die passende Verbform ein':'Escribe la forma verbal correcta', 'Setz por oder para ein':'Escribe por o para', 'Setz ser oder estar ein':'Escribe ser o estar',
    'Schreib die Uhrzeit in Worten':'Escribe la hora con letras', 'Schreib die Uhrzeit als Zahl':'Escribe la hora en cifras', 'Hör zu und schreib die Uhrzeit als Zahl':'Escucha y escribe la hora en cifras',
    'Schreib den Preis in Worten':'Escribe el precio con letras', 'Schreib den Preis als Zahl':'Escribe el precio en cifras', 'Hör zu und schreib den Preis als Zahl':'Escucha y escribe el precio en cifras' }
};
function kickTL(lang, de){
  const m = /^(Aus|Nachgeschlagen in) „(.+)“$/.exec(de);
  if (m && m[1] === 'Aus') return lang === 'sv' ? `Ur ”${m[2]}”` : `Del texto «${m[2]}»`;
  if (m) return lang === 'sv' ? `Uppslaget i ”${m[2]}”` : `Buscado en «${m[2]}»`;
  if (de === 'Ergänze aus dem Text') return lang === 'sv' ? 'Fyll i från texten' : 'Completa con el texto';
  return KICK_TL[lang][de] || '';
}
// Anweisung einer Aufgabe: bei „Fortgeschritten“ in der Zielsprache, Tipp zeigt sie deutsch (c.kickDe, nur für diese Aufgabe)
function kick(de, lang, c){
  const tl = niveau() === 'fort' && !(c && c.kickDe) ? kickTL(lang, de) : '';
  return tl ? `<button type="button" class="kick-tl" data-a="kickde" lang="${lang}" title="${esc(de)}">${esc(tl)}</button>` : esc(de);
}
/* ---------- Start über Teilen oder App-Verknüpfung ---------- */
function guessLang(text){
  const t = ' ' + text.toLowerCase() + ' ';
  let sv = (t.match(/[åäö]/g) || []).length * 2, es = (t.match(/[ñ¿¡áíóú]/g) || []).length * 2;
  ['och', 'jag', 'att', 'är', 'det', 'inte', 'som', 'på'].forEach(w => { if (t.includes(' ' + w + ' ')) sv++; });
  ['el', 'la', 'que', 'los', 'una', 'por', 'con', 'es'].forEach(w => { if (t.includes(' ' + w + ' ')) es++; });
  return sv > es ? 'sv' : es > sv ? 'es' : S.lang;
}
function handleLaunch(){
  let q;
  try { q = new URLSearchParams(location.search); } catch (e) { return false; }
  const shared = [q.get('title'), q.get('text')].filter(Boolean).join(' ').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  const go = q.get('go');
  if (!shared && !go) return false;
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
  if (shared) {
    const lang = guessLang(shared);
    S.lang = lang; DB.settings.lang = lang;
    S.own = { lang, de:'', t:shared.slice(0, 240) };
    S.view = 'own';
    S.notice = { text:`Geteilter Text übernommen (${LANG[lang].deName}). Kürze ihn bei Bedarf auf einen Satz und ergänze die Übersetzung.`, kind:'ok' };
    return true;
  }
  if (go === 'daily') { startRun('daily'); return true; }
  if (go === 'quick') { startRun('quick'); return true; }
  if (go === 'own') { S.own = { lang:S.lang, de:'', t:'' }; S.view = 'own'; return true; }
  return false;
}
