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

