/* ---------- Vorlesen & Aufnahme ---------- */
const canSpeak = () => !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
function voiceFor(lang){
  if (!canSpeak()) return null;
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(lang)) || null;
}
function speak(text, lang, rate){
  if (!canSpeak()) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG[lang].tts; u.rate = rate || 0.9;
    const v = voiceFor(lang); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.3 8.6a4.8 4.8 0 0 1 0 6.8M18.9 6a8.4 8.4 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const speakItemBtn = item => (item.tat && item.tat.audio ? `<button type="button" class="speak native" data-a="speakItem" data-id="${esc(item.id)}" aria-label="Aufnahme abspielen">${ICON}</button>` : speakBtn(item.target, item.lang));
const speakBtn = (text, lang) => (canSpeak() ? `<button type="button" class="speak" data-a="speak" data-lang="${lang}" data-text="${esc(text)}" aria-label="Vorlesen">${ICON}</button>` : '');
let rec = null, recUrl = null;
async function recStart(){
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    const chunks = [];
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (recUrl) URL.revokeObjectURL(recUrl);
      recUrl = URL.createObjectURL(new Blob(chunks, { type:rec.mimeType || 'audio/webm' }));
      if (S.shadow) { S.shadow.recording = false; S.shadow.hasRec = true; render(); }
    };
    rec.start();
    S.shadow.recording = true; render();
  } catch (e) { note('Kein Zugriff aufs Mikrofon. Erlaub ihn in den Browser-Einstellungen für diese Seite.', 'warn'); render(); }
}
function recStop(){ if (rec && rec.state === 'recording') rec.stop(); }
const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

