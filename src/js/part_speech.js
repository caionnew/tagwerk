/* ---------- Vorlesen & Aufnahme ---------- */
const canSpeak = () => !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
function voiceFor(lang){
  if (!canSpeak()) return null;
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(lang)) || null;
}
// ev (optional): start(), end(fehler), word(Zeichenposition) für Messung und Mitlesen
function speak(text, lang, rate, ev){
  if (!canSpeak()) { if (ev) ev.end(true); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG[lang].tts; u.rate = rate || 0.9;
    const v = voiceFor(lang); if (v) u.voice = v;
    if (ev) {
      u.onstart = () => ev.start('tts');
      u.onend = () => ev.end(false);
      u.onerror = () => ev.end(true);
      u.onboundary = e => { if (!e.name || e.name === 'word') ev.word(e.charIndex); };
    }
    speechSynthesis.speak(u);
  } catch (e) { if (ev) ev.end(true); }
}
const ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.3 8.6a4.8 4.8 0 0 1 0 6.8M18.9 6a8.4 8.4 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const speakItemBtn = item => (item.tat && item.tat.audio ? `<button type="button" class="speak native" data-a="speakItem" data-id="${esc(item.id)}" aria-label="Aufnahme abspielen">${ICON}</button>` : speakBtn(item.target, item.lang));
const speakBtn = (text, lang) => (canSpeak() ? `<button type="button" class="speak" data-a="speak" data-lang="${lang}" data-text="${esc(text)}" aria-label="Vorlesen">${ICON}</button>` : '');
const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
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
