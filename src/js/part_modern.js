/* ---------- Spracherkennung (Chrome, online): beim Nachsprechen und zum Sprechen von Antworten ---------- */
const SRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const canListen = () => !!SRec;
let activeRec = null;
// onInterim (optional): Zwischenstand beim Sprechen, für Rückmeldung in Echtzeit
function listen(lang, done, onInterim){
  if (!SRec) return done({ ok:false, err:'unsupported' });
  if (activeRec) { try { activeRec.abort(); } catch (e) {} }
  const rec = new SRec();
  rec.lang = LANG[lang].tts; rec.interimResults = !!onInterim; rec.maxAlternatives = 4; rec.continuous = false;
  let fin = false;
  const end = r => { if (fin) return; fin = true; activeRec = null; done(r); };
  rec.onresult = e => {
    const r = e.results[0];
    if (onInterim && !r.isFinal) { try { onInterim(r[0].transcript); } catch (x) {} return; }
    end({ ok:true, alts:Array.from(r).map(a => a.transcript) });
  };
  rec.onerror = e => end({ ok:false, err:e.error || 'error' });
  rec.onend = () => end({ ok:false, err:'no-speech' });
  try { rec.start(); activeRec = rec; } catch (e) { end({ ok:false, err:'busy' }); }
}
const LISTEN_ERR = {
  'not-allowed':'Das Mikrofon ist für Tagwerk nicht freigegeben. Du kannst es in den Chrome-Einstellungen der Seite erlauben.',
  'service-not-allowed':'Die Spracherkennung ist hier nicht verfügbar.',
  network:'Die Spracherkennung braucht Internet.',
  'no-speech':'Nichts gehört. Tipp nochmal und sprich direkt los.',
  'audio-capture':'Kein Mikrofon gefunden.',
  unsupported:'Dieser Browser hat keine Spracherkennung. In Chrome geht es.'
};
// Zahlen als Ziffer oder Wort gelten gleich (die Erkennung schreibt oft „3“ statt „tre“)
const NUM_WORDS = {
  sv:{ 1:['en', 'ett'], 2:['två'], 3:['tre'], 4:['fyra'], 5:['fem'], 6:['sex'], 7:['sju'], 8:['åtta'], 9:['nio'], 10:['tio'], 11:['elva'], 12:['tolv'], 15:['femton'], 20:['tjugo'], 30:['trettio'], 100:['hundra'] },
  es:{ 1:['uno', 'un', 'una'], 2:['dos'], 3:['tres'], 4:['cuatro'], 5:['cinco'], 6:['seis'], 7:['siete'], 8:['ocho'], 9:['nueve'], 10:['diez'], 11:['once'], 12:['doce'], 15:['quince'], 20:['veinte'], 30:['treinta'], 100:['cien'] }
};
const numSame = (a, b, lang) => a === b || Object.values(NUM_WORDS[lang]).some(ws => ws.includes(a) && ws.includes(b));

/* ---------- Vibration als leise Rückmeldung (Android) ---------- */
function buzz(kind){
  if (DB.settings.haptics === false || !navigator.vibrate) return;
  // Etappe: kurz, kurz, lang (seit 24.63); falsch: zweimal kurz; richtig: ein Tick
  try { navigator.vibrate(kind === 'mile' ? [14, 70, 14, 70, 60] : kind === 'bad' ? [16, 70, 16] : 10); } catch (e) {}
}

/* ---------- Begrüßung in der Zielsprache ---------- */
const WDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
function greeting(lang){
  const ev = nextEvent(lang, today(), 0);
  if (ev) return ev.ev[3];
  const h = new Date().getHours();
  if (lang === 'sv') return h < 5 ? 'Sent uppe?' : h < 10 ? 'God morgon!' : h < 17 ? 'Hej!' : h < 23 ? 'God kväll!' : 'Sent uppe?';
  return h < 5 ? '¿Trasnochando?' : h < 12 ? '¡Buenos días!' : h < 20 ? '¡Buenas tardes!' : '¡Buenas noches!';
}

/* ---------- Symbole (Linien, 24er Raster) ---------- */
const ICO = (d, extra) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"${extra || ''}><path d="${d}"/></svg>`;
const ICONS = {
  quick:ICO('M13 2 4 14h7l-1 8 9-12h-7l1-8Z'),
  dict:ICO('M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5Z'),
  shadow:ICO('M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3'),
  pickTopic:ICO('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'),
  forms:ICO('M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5'),
  write:ICO('M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4'),
  tat:ICO('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5'),
  own:ICO('M12 5v14M5 12h14'),
  home:ICO('M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'),
  extra:ICO('M4 6h16M4 12h16M4 18h10'),
  progress:ICO('M4 20V10M10 20V4M16 20v-7M22 20H2'),
  mic:ICO('M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3'),
  spot:ICO('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.7-1.8L20 20M8.5 8.5l4 4m0-4-4 4'),
  trans:ICO('M4 8h13l-3-3M20 16H7l3 3'),
  time:ICO('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2'),
  globe:ICO('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z'),
  terms:ICO('M4 19V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12v-4M9 7h5M9 10h3'),
  book:ICO('M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2V5Zm8-2h6a2 2 0 0 1 2 2v17a2 2 0 0 0-2-2h-6'),
  friends:ICO('M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5'),
  feast:ICO('M5 21V8l7-5 7 5v13M9 21v-6h6v6M3 21h18'),
  genus:ICO('M7.5 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4 20h7M13 20h7')
};

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
