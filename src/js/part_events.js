/* ---------- Ereignisse ---------- */
function nextPrompt(){
  DB.used = DB.used || {}; let used = DB.used.write || [];
  let pool = WRITE_PROMPTS.filter(p => !used.includes(p));
  if (!pool.length) { used = []; pool = WRITE_PROMPTS.slice(); }
  const p = pick(pool); used.push(p); DB.used.write = used; save();
  return p;
}
function saveDraft(){ if (!S.write) return; DB.draft = DB.draft || {}; DB.draft[S.write.lang] = { prompt:S.write.prompt, text:S.write.text, id:S.write.id, extra:S.write.extra }; save(); }
// Neue Schreibaufgabe: eigene Kennung fürs Archiv, Extra-Aufgabe (falls gewünscht) und Wörter zum Einbauen (Grundform, gebeugt zählt auch)
function newWrite(lang, prompt, text, keep){
  return Object.assign({ lang, prompt, text:text || '', copied:false, lt:null, prof:null, id:'w' + Date.now().toString(36), extra:DB.settings.wextra === false ? '' : pickExtra(lang) }, suggWords(lang), keep || {});
}
let draftTimer = null;
function saveDraftSoon(){ clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 800); }
// Ein Kästchen gleitet von seiner alten an die neue Stelle; bei „Bewegung reduzieren“ springt es wie bisher
function flyFrom(from, sel){
  const el = document.querySelector(sel); if (!el || !el.animate) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const to = el.getBoundingClientRect(), dx = from.left - to.left, dy = from.top - to.top;
  if (Math.abs(dx) + Math.abs(dy) < 2) return;
  el.animate([{ transform:`translate(${dx}px, ${dy}px)` }, { transform:'none' }], { duration:200, easing:'cubic-bezier(.2,.8,.2,1)' });
}
function goView(v){ S.view = v; render(); window.scrollTo(0, 0); }
document.addEventListener('pointerdown', e => { if (e.target.closest('[data-c]')) e.preventDefault(); });
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b || b.disabled) return;
  const a = b.dataset.a;
  if (!['coldel', 'reset'].includes(a)) S.armed = null;
  if (a === 'reset' && S.armed && S.armed !== 'reset:' + (b.dataset.l || S.lang)) S.armed = null;
  if (S.pop && !['popclose', 'popext', 'popweb', 'lookup', 'speak', 'topic', 'term'].includes(a)) { S.pop = null; renderPopup(); }
  const r = S.run;
  switch (a) {
    case 'tab': {
      S.notice = null;
      if (S.view === 'write' && S.write && S.write.text.trim()) saveDraft();
      if (r && r.finished) S.run = null;
      goView(b.dataset.v); break;
    }
    case 'lang': S.lang = b.dataset.l; DB.settings.lang = S.lang; DB.dayLang = { d:today(), l:S.lang, manual:true }; S.notice = null; save(); render(); break;
    case 'langmode': DB.settings.langMode = b.dataset.v === 'last' ? 'last' : 'auto'; save(); render(); break;
    case 'daily': { const d = openDaily(); if (d && d.lang === S.lang) { resumeDaily(); render(); window.scrollTo(0, 0); } else startRun('daily'); break; }
    case 'quick': startRun('quick'); break;
    case 'pickTopic': goView('pickTopic'); break;
    case 'trapgo': if (b.dataset.l && b.dataset.l !== S.lang) S.lang = b.dataset.l; startRun('trap', { trap:b.dataset.t }); break;
    case 'forms': { const g = genIds(S.lang); if (g.length === 1) startRun('gen', { gen:g[0] }); else goView('pickGen'); break; }
    case 'gengo': startRun('gen', { gen:b.dataset.g }); break;
    case 'dict': startRun('dict'); break;
    case 'again': if (r) { S.lang = r.lang; startRun(r.kind, { trap:r.trap, gen:r.gen, text:r.text, body:r.wiki && r.wiki.body, title:r.wiki && r.wiki.title }); } break;
    case 'check': check(); break;
    case 'giveup': giveUp(); setTimeout(() => { DB.used = DB.used || {}; DB.used.gaveup = true; save(); }, 0); break;
    case 'accept': DB.used = DB.used || {}; DB.used.accept = true; selfAccept(); break;
    case 'next': next(); break;
    case 'endrun': if (r) { r.ended = true; if (r.cur && r.cur.state === 'done') { r.endless = false; r.queue = r.queue.slice(0, r.idx + 1); next(); } else finishRun(); } break;
    case 'quit': {
      if (!r) break;
      if (r.kind === 'daily') {
        S.dailyRun = r; persistRun();
        S.view = 'home'; render(); window.scrollTo(0, 0); break;
      }
      // Beenden ist nie verlustreich: Antworten sind schon gespeichert, offene Aufgaben entfallen einfach
      if (r.cur && r.cur.state === 'done') { r.ended = true; r.queue = r.queue.slice(0, r.idx + 1); next(); break; }
      r.ended = true;
      if (r.kind === 'extraNew') r.leftNew = r.queue.slice(r.idx).filter(ex => ex.id && !stOf(ex.id)).length;
      finishRun(); break;
    }
    case 'pickt': {
      const ex = r.queue[r.idx]; const i = Number(b.dataset.i), from = b.getBoundingClientRect();
      ex.picked.push(i); render(); flyFrom(from, `.tiles-ans [data-i="${i}"]`);
      if (DB.settings.autoplay) { const p = ex.pool.find(x => x.i === i); if (p) speak(p.t, r.lang); }
      break;
    }
    case 'unpick': { const ex = r.queue[r.idx]; const i = Number(b.dataset.i), from = b.getBoundingClientRect(); ex.picked = ex.picked.filter(x => x !== i); render(); flyFrom(from, `.tiles-pool [data-a=pickt][data-i="${i}"]`); break; }
    case 'resetTiles': { r.queue[r.idx].picked = []; render(); break; }
    case 'play': playItem(itemById(r.queue[r.idx].id), Number(b.dataset.rate)); break;
    case 'speakItem': playItem(itemById(b.dataset.id)); break;
    case 'speak': speak(b.dataset.text, b.dataset.lang); break;
    case 'char': {
      const box = document.querySelector('#app .tw:not([readonly])'); if (!box) break;
      // Ohne Fokus im Feld (oder Schreibmarke nie gesetzt) ans Ende schreiben, nicht an Position 0
      const focused = document.activeElement === box || box.dataset.touched === '1';
      const s0 = !focused || box.selectionStart == null ? box.value.length : box.selectionStart;
      const s1 = !focused || box.selectionEnd == null ? box.value.length : box.selectionEnd;
      let ch = b.dataset.c;
      const before = box.value.slice(0, s0).trim();
      if (box.tagName === 'TEXTAREA' && /[a-zåäöéáíóúñü]/.test(ch) && (!before || /[.!?¿¡]$/.test(before))) ch = ch.toUpperCase();
      box.value = box.value.slice(0, s0) + ch + box.value.slice(s1);
      box.selectionStart = box.selectionEnd = s0 + ch.length;
      box.focus(); box.dispatchEvent(new Event('input', { bubbles:true }));
      break;
    }
    case 'radio': startRadio(); break;
    case 'texts': stopReading(); S.text = null; goView('texts'); break;
    case 'textopen': openText(S.lang, b.dataset.id, null, b.dataset.back); break;
    case 'kultcat': S.kultCat = b.dataset.c; render(); break;
    case 'wiki': openWiki(); break;
    case 'tplayall': case 'treplay': case 'tslow': case 'tshowall': case 'treveal': case 'tsay': case 'tquiz': case 'tqnext': case 'tpick': case 'tkeep': case 'tnexttext': readCmd(b.dataset.a, b); break;
    case 'tdefmode': DB.settings.textMode = b.dataset.v === 'listen' ? 'listen' : 'read'; save(); render(); break;
    case 'rplay': case 'rnext': case 'rprev': case 'rde': case 'rshow': case 'rslow': radioCmd(b.dataset.a); break;
    case 'shadow': case 'shhear': case 'shalong': case 'shrec': case 'shstop': case 'shcancel': case 'shslow': case 'shhints': case 'shpo': case 'shpm': case 'shpab':
    case 'shseek': case 'shnext': case 'shquit': case 'shone': case 'shall': case 'shmine': case 'pron': shadowCmd(a, b, e); break;
    case 'write': {
      const dr = DB.draft && DB.draft[S.lang];
      S.write = dr && dr.text ? newWrite(S.lang, dr.prompt, dr.text, Object.assign({ restored:true }, dr.id ? { id:dr.id } : {}, dr.extra != null ? { extra:dr.extra } : {})) : newWrite(S.lang, nextPrompt());
      goView('write'); break;
    }
    case 'wsugg': { const w = S.write, wt = $('#wtext'); if (!w) break; if (wt) w.text = wt.value; Object.assign(w, suggWords(w.lang, (w.sugg || []).map(x => x.base))); render(); break; }
    case 'wnew': { const wt = $('#wtext'); const keepText = wt ? wt.value : S.write.text; S.write = newWrite(S.write.lang, nextPrompt(), keepText); saveDraft(); render(); break; }
    case 'weval': {
      const wt = $('#wtext'); if (wt) S.write.text = wt.value;
      const a = analyzeText(S.write.lang, S.write.text); S.write.prof = a;
      if (a.words >= 8) saveText(S.write, a);
      saveDraft(); render();
      const pr = $('.wprof'); if (pr) pr.scrollIntoView({ block:'start', behavior:'smooth' });
      break;
    }
    case 'wextra': { const wt = $('#wtext'); if (wt) S.write.text = wt.value; S.write.extra = pickExtra(S.write.lang, S.write.extra); DB.settings.wextra = true; save(); render(); break; }
    case 'wextraoff': { const wt = $('#wtext'); if (wt) S.write.text = wt.value; S.write.extra = ''; DB.settings.wextra = false; save(); render(); break; }
    case 'wopen': { const wt = $('#wtext'); if (wt) S.write.text = wt.value; S.write.openId = S.write.openId === b.dataset.id ? null : b.dataset.id; render(); break; }
    case 'wcopy': {
      const t = $('#wtext').value; S.write.text = t;
      if (!t.trim()) break;
      const done = () => { S.write.copied = true; logAct(S.write.lang); save(); render(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => { $('#wtext').select(); try { document.execCommand('copy'); } catch (err) {} done(); });
      else { $('#wtext').select(); try { document.execCommand('copy'); } catch (err) {} done(); }
      break;
    }
    case 'wlt': {
      const wt = $('#wtext'); const w = S.write; w.text = wt.value;
      if (!w.text.trim()) break;
      if (navigator.onLine === false) { w.lt = offlineMsg; render(); break; }
      w.lt = 'loading'; render();
      languageTool(w.text, w.lang).then(m => { if (S.write === w) { w.lt = m; logAct(w.lang); save(); render(); } })
        .catch(() => { if (S.write === w) { w.lt = 'LanguageTool ist gerade nicht erreichbar. Versuch es in einer Minute noch einmal.'; render(); } });
      break;
    }
    case 'wfix': {
      const w = S.write; if (!Array.isArray(w.lt)) break;
      const m = w.lt[Number(b.dataset.k)];
      w.text = w.text.slice(0, m.offset) + b.dataset.r + w.text.slice(m.offset + m.length);
      w.lt = 'Übernommen. Noch einmal prüfen, um den Rest zu sehen.'; render(); break;
    }
    case 'ltfree': {
      const c = r.cur; if (!c) break;
      if (navigator.onLine === false) { c.lt = offlineMsg; render(); break; }
      c.lt = 'loading'; render();
      languageTool(c.input, r.lang).then(m => { if (S.run === r && r.cur === c) { c.lt = m; render(); } })
        .catch(() => { if (S.run === r && r.cur === c) { c.lt = 'LanguageTool ist gerade nicht erreichbar.'; render(); } });
      break;
    }
    case 'tat': S.notice = null; S.tat = { lang:S.lang, mode:'topic', trap:(TRAPS[S.lang].find(x => TAT_Q[S.lang][x.id]) || {}).id, word:'', status:'idle', results:[], picked:{} }; goView('tat'); break;
    case 'tatmode': { const t = S.tat; const sel = $('#tatTrap'); if (sel) t.trap = sel.value; t.mode = b.dataset.m; t.status = 'idle'; t.results = []; render(); break; }
    case 'tatgo': {
      const t = S.tat; S.notice = null;
      const sel = $('#tatTrap'); if (sel) t.trap = sel.value;
      const wf = $('#tatWord'); if (wf) t.word = wf.value.trim();
      if (t.mode === 'word' && !t.word) break;
      if (navigator.onLine === false) { t.status = 'error'; t.err = offlineMsg; render(); break; }
      t.status = 'loading'; t.results = []; t.picked = {}; render();
      tatoebaFetch(t.lang, t.trap, t.mode === 'word' ? t.word : '').then(list => {
        if (S.tat !== t) return;
        t.results = list; t.picked = {}; list.forEach((x, i) => { t.picked[i] = true; }); t.status = 'done'; render();
      }).catch(() => { if (S.tat !== t) return; t.status = 'error'; t.err = 'Tatoeba ist gerade nicht erreichbar. Versuch es später noch einmal.'; render(); });
      break;
    }
    case 'tatpick': { const i = Number(b.dataset.i); S.tat.picked[i] = !S.tat.picked[i]; render(); break; }
    case 'tatplay': { const x = S.tat.results[Number(b.dataset.i)]; if (x && x.audio) { if (audioEl) audioEl.pause(); audioEl = new Audio(x.audio.url); audioEl.play().catch(() => speak(x.target, S.tat.lang)); } break; }
    case 'tatadd': {
      const t = S.tat; const trap = t.mode === 'word' ? 'eigene' : t.trap;
      let n = 0;
      t.results.forEach((x, i) => {
        if (!t.picked[i]) return;
        const id = t.lang + ':tat:' + x.tid;
        if (DB.tat[t.lang].some(o => o.id === id)) return;
        DB.tat[t.lang].push({ id, trap, de:x.de, target:x.target, owner:x.owner, license:x.license, audio:x.audio, created:today() }); n++;
      });
      if (DB.tat[t.lang].length > 400) DB.tat[t.lang] = DB.tat[t.lang].slice(-400);
      save(); buildBank();
      note(n === 1 ? '1 Satz übernommen. Er kommt in einem der nächsten Tagwerke als neuer Satz dran.' : `${n} Sätze übernommen. Sie kommen in den nächsten Tagwerken als neue Sätze dran.`, 'ok');
      t.status = 'idle'; t.results = []; t.picked = {}; render(); window.scrollTo(0, 0); break;
    }
    case 'own': S.notice = null; if (!S.own || S.own.lang !== S.lang) S.own = { lang:S.lang, de:'', t:'' }; goView('own'); break;
    case 'ownsave': {
      const de = $('#ownDe').value.trim(), t = $('#ownT').value.trim();
      if (!de || !t) { S.own.de = de; S.own.t = t; note('Bitte beide Felder ausfüllen.', 'warn'); render(); break; }
      const id = S.own.lang + ':own:' + hash(t);
      if (!DB.own[S.own.lang].some(o => o.id === id)) DB.own[S.own.lang].push({ id, de, target:t, created:today() });
      save(); buildBank(); note('Gespeichert. Der Satz kommt im nächsten Tagwerk als neuer Satz dran.', 'ok'); S.own = { lang:S.own.lang, de:'', t:'' }; render(); break;
    }
    case 'coldel': {
      const id = b.dataset.id;
      if (S.armed === 'del:' + id) {
        DB.own[S.lang] = DB.own[S.lang].filter(o => o.id !== id);
        DB.tat[S.lang] = DB.tat[S.lang].filter(o => o.id !== id);
        delete DB.st[id]; S.armed = null; save(); buildBank();
      } else S.armed = 'del:' + id;
      render(); break;
    }
    case 'size': DB.settings.size = b.dataset.s; save(); render(); break;
    case 'niveau': DB.settings.niveau = ['grund', 'mittel', 'fort'].includes(b.dataset.v) ? b.dataset.v : 'mittel'; S.dailyPlanCache = null; save(); render(); break;
    case 'undoimport': if (S.undoDB) { DB = JSON.parse(S.undoDB); S.undoDB = null; save(); buildBank(); runsFromDB(); note('Vorheriger Stand wiederhergestellt.', 'ok'); render(); } break;
    case 'reload': location.reload(); break;
    // Bonus „Eigener Satz“ am Rundenende
    case 'bonus': {
      if (!r) break;
      r.bonus = Object.assign({ k:0, text:'' }, r.bonus, { open:true }); render();
      const t = $('#bonusText'); if (t) { t.scrollIntoView({ block:'center' }); try { t.focus({ preventScroll:true }); } catch (e) {} }
      break;
    }
    case 'bonusnext': if (r && r.bonus) { const t = $('#bonusText'); if (t) r.bonus.text = t.value; r.bonus.k++; r.bonus.res = null; r.bonus.lt = undefined; render(); } break;
    case 'bonuscheck': {
      const bo = r && r.bonus, t = $('#bonusText'); if (!bo || !t) break;
      bo.text = t.value; bo.lt = undefined;
      const cands = bonusCands(r); if (!cands.length) break;
      bo.res = bonusCheck(r.lang, bo.text, cands[bo.k % cands.length]);
      if (bo.res.ok && !bo.logged) { bo.logged = true; logAct(r.lang); save(); }
      // Eigener Satz: gleich mit LanguageTool prüfen (Grammatik, Rechtschreibung), nicht erst auf Nachfrage
      if (bo.res.own) {
        if (navigator.onLine === false) bo.lt = 'Ohne Internet nur diese Grundprüfung. Grammatik und Rechtschreibung prüft LanguageTool, sobald du online bist.';
        else {
          // Nur die neueste Prüfung zählt. Wurde inzwischen weitergetippt, fällt die Antwort weg (kein „Wird geprüft“, das hängen bleibt)
          const text = bo.text, req = bo.req = (bo.req || 0) + 1; bo.lt = 'loading';
          const apply = v => {
            if (S.run !== r || bo.req !== req) return;
            // Weitergetippt: nur die Zeile „Wird geprüft“ entfernen, nicht neu zeichnen (die Tastatur bliebe sonst nicht offen)
            if (bo.text !== text) { bo.lt = undefined; const d = document.querySelector('.bonus .dots'); if (d) d.closest('p').remove(); return; }
            bo.lt = v; bo.ltText = text; render();
          };
          languageTool(text, r.lang).then(apply).catch(() => apply('LanguageTool ist gerade nicht erreichbar. Tipp in einer Minute noch einmal auf Prüfen.'));
        }
      }
      render(); break;
    }
    case 'persist':
      navigator.storage.persist().then(p => { STORE.persisted = !!p; note(p ? 'Der Browser behält deine Daten jetzt dauerhaft.' : 'Der Browser hat abgelehnt. Ein Backup schützt deinen Stand trotzdem.', p ? 'ok' : 'warn'); render(); }).catch(() => {});
      break;
    case 'nagoff': DB.used = DB.used || {}; DB.used.backupNag = today(); save(); render(); break;
    case 'dictate': {
      if (S.listening || !r || !r.cur) break;
      S.listening = true; render();
      listen(r.lang, res => {
        S.listening = false;
        if (res.ok && r.cur && r.cur.state === 'answer') { const t = res.alts[0].trim(); r.cur.input = t.charAt(0).toUpperCase() + t.slice(1); S.focus = true; }
        else if (!res.ok) note(LISTEN_ERR[res.err] || 'Die Spracherkennung hat nicht geklappt.', 'warn');
        render();
      });
      break;
    }
    case 'haptics': DB.settings.haptics = DB.settings.haptics === false; save(); render(); if (DB.settings.haptics !== false) buzz('ok'); break;
    case 'form': startRun('form', { gen:b.dataset.g }); break;
    case 'spotpick': choose(b.dataset.i); break;
    case 'spotnone': choose('none'); break;
    case 'genuspick': choose(b.dataset.v); break;
    case 'tplay': { const ex = r && r.queue[r.idx]; if (ex && ex.data) speak(ex.data.say, r.lang, Number(b.dataset.rate)); break; }
    case 'ptab': { const t = b.dataset.t; S.ptab = t; if (t !== 'all') { S.lang = t; DB.settings.lang = t; save(); } S.calDay = null; S.minDay = null; render(); window.scrollTo(0, 0); break; }
    case 'term': S.pop = { type:'term', k:b.dataset.k, lang:(S.view === 'run' && S.run && S.run.lang) || S.lang }; renderPopup(); break;
    case 'topic': openTopic(b.dataset.l || ((S.view === 'run' || S.view === 'runDone') && S.run && S.run.lang) || S.lang, b.dataset.t); break;
    case 'ref': S.ref = b.dataset.r; S.kultCat = null; S.refFrom = ['home', 'extra', 'progress'].includes(S.view) ? S.view : 'extra'; goView('ref'); break;
    case 'wayall': S.wayAll = !S.wayAll; render(); break;
    case 'mileall': S.mileAll = !S.mileAll; render(); break;
    // Vom Rundenende zu „Dein Weg“ im Überblick
    case 'toway': { if (r && r.finished) S.run = null; S.ptab = 'all'; S.calDay = null; S.minDay = null; goView('progress'); const el = document.getElementById('way'); if (el) el.scrollIntoView({ block:'start' }); break; }
    case 'textgap': if (b.dataset.id === 'wiki') { const w = S.text && S.text.wiki; if (w) startRun('textgap', { body:w.body, title:w.title }); } else startRun('textgap', { text:b.dataset.id }); break;
    case 'otherdaily': { const l = b.dataset.l; S.lang = l; DB.settings.lang = l; DB.dayLang = { d:today(), l, manual:true }; save(); const d = openDaily(); if (d && d.lang === l) { resumeDaily(); render(); window.scrollTo(0, 0); } else startRun('daily'); break; }
    case 'showtip': if (S.run && S.run.cur) { S.run.cur.tip = true; render(); const a = document.getElementById('answer'); if (a) a.focus(); } break;
    case 'pcrange': S.pcAll = b.dataset.v === '1'; render(); break;
    case 'focusnext': { const c = focusCandidates(S.lang), cur = focusTrap(S.lang), nx = c[(c.indexOf(cur) + 1) % c.length]; DB.focus[S.lang] = { trap:nx, week:mondayOf(today()) }; S.dailyPlanCache = null; save(); render(); break; }
    case 'errtab': S.errTab = b.dataset.t; render(); break;
    case 'kultadd': {
      const lang = S.lang, e = KULTUR[lang].find(x => x.id === b.dataset.id); if (!e) break;
      const id = lang + ':own:' + hash(e.ex[0]);
      if (!DB.own[lang].some(o => o.id === id)) DB.own[lang].push({ id, de:e.ex[1].replace(/\s*\([^)]*\)\s*$/, ''), target:e.ex[0], created:today(), src:'kultur' });
      save(); buildBank(); render(); break;
    }
    case 'voiceoff': DB.used = DB.used || {}; DB.used.voiceWarn = today(); save(); render(); break;
    case 'introok': DB.used = DB.used || {}; DB.used.intro = true; save(); render(); break;
    case 'calrange': S.calRange = b.dataset.r; S.calDay = null; render(); break;
    case 'refill': DB.settings.refill = !DB.settings.refill; save(); render(); if (DB.settings.refill) { refill('sv'); refill('es'); } break;
    case 'moreNew': startRun('extraNew', { n:Number(b.dataset.n) || 0 }); break;
    case 'lookup': {
      const w = (b.dataset.w || '').trim(); if (!w || /^\d+$/.test(w)) break;
      const lang = (S.view === 'run' && S.run && S.run.lang) || (S.view === 'text' && S.text && S.text.lang) || (S.view === 'shadow' && S.shadow && S.shadow.lang) || S.lang;
      const sent = S.view === 'text' && b.closest('.rs-s[data-i]');
      if (S.view === 'text' && S.text && S.text.looked && !S.text.looked.includes(w)) { S.text.looked.push(w); setTimeout(render, 0); }
      DB.used = DB.used || {}; DB.used.lookup = true;
      // Für Lesetext-Lücken merken (nur eingebaute Texte, Wikipedia-Fundstücke haben keine feste Kennung)
      if (S.view === 'text' && S.text && S.text.id) rememberLooked(lang, S.text.id, w);
      save();
      S.pop = { lang, w, entry:lookupWord(lang, w), status:'idle', web:[], si:sent ? Number(sent.dataset.i) : null, sent:sent ? sent.textContent.trim() : '' };
      renderPopup(); break;
    }
    case 'popclose': S.pop = null; renderPopup(); break;
    case 'popext': { const P = S.pop; if (!P) break; window.open(P.lang === 'es' ? `https://dict.leo.org/spanisch-deutsch/${encodeURIComponent(P.w)}` : `https://sv-de.dict.cc/?s=${encodeURIComponent(P.w)}`, '_blank', 'noopener'); break; }
    case 'popweb': {
      const P = S.pop; if (!P) break;
      if (navigator.onLine === false) { P.status = 'error'; P.err = 'Keine Verbindung.'; renderPopup(); break; }
      P.status = 'loading'; renderPopup();
      wiktionary(P.lang, P.w).then(list => { if (S.pop === P) { P.status = 'web'; P.web = list; renderPopup(); } })
        .catch(() => { if (S.pop === P) { P.status = 'web'; P.web = []; renderPopup(); } });
      break;
    }
    case 'autoplay': DB.settings.autoplay = !DB.settings.autoplay; save(); render(); break;
    case 'calday': S.calDay = S.calDay === b.dataset.d ? null : b.dataset.d; render(); break;
    case 'mpick': S.minDay = S.minDay === b.dataset.k ? null : b.dataset.k; render(); break;
    case 'toSettings': case 'settings': S.notice = null; S.settingsFrom = ['home', 'extra', 'progress'].includes(S.view) ? S.view : 'home'; goView('settings'); break;
    case 'colall': S.colAll = !S.colAll; render(); break;
    case 'findopen': S.findOpen = b.dataset.id; render(); break;
    case 'export': {
      flushSave();
      const name = backupName(), blob = new Blob([backupText()], { type:'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); link.download = name;
      document.body.appendChild(link); link.click();
      DB.lastBackup = today(); save();
      // Firefox für Android lädt erst nach seiner Rückfrage herunter; die Adresse muss so lange gültig bleiben
      setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 120000);
      note(`Backup ${name} wird gespeichert, meist im Ordner „Downloads“.`, 'ok'); render();
      break;
    }
    case 'shareBackup': {
      flushSave();
      const file = backupFile();
      navigator.share({ files:[file], title:'Tagwerk-Backup' })
        .then(() => { DB.lastBackup = today(); save(); note('Backup geteilt.', 'ok'); render(); })
        .catch(err => { if (!err || err.name !== 'AbortError') { note('Teilen hat nicht geklappt. Nimm „Backup exportieren“.', 'warn'); render(); } });
      break;
    }
    case 'reset': {
      const key = 'reset:' + (b.dataset.l || S.lang);
      if (S.armed === key) {
        const lang = b.dataset.l || S.lang;
        Object.keys(DB.st).forEach(id => { if (id.startsWith(lang + ':')) delete DB.st[id]; });
        DB.own[lang] = []; DB.tat[lang] = [];
        Object.keys(DB.gen).forEach(g => { if (GENS[g] && GENS[g].lang === lang) delete DB.gen[g]; });
        Object.values(DB.log).forEach(d => { delete d[lang]; });
        if (DB.snap) Object.values(DB.snap).forEach(d => { delete d[lang]; });
        if (DB.genus) delete DB.genus[lang];
        if (DB.pace) delete DB.pace[lang];
        if (DB.first) delete DB.first[lang];
        // Fehlerprotokoll und Themen-Etappen dieser Sprache (bis 24.62 blieb das Fehlerprotokoll beim Zurücksetzen stehen)
        if (DB.tlog) Object.values(DB.tlog).forEach(d => { delete d[lang]; });
        if (DB.tblk) delete DB.tblk[lang];
        if (Array.isArray(DB.etap)) DB.etap = DB.etap.filter(e => e.l !== lang);
        if (Array.isArray(DB.way)) DB.way = DB.way.filter(e => e.l !== lang);
        if (DB.logArch && DB.logArch.m) Object.values(DB.logArch.m).forEach(m => { delete m[lang]; });
        // Beim Lesen nachgeschlagene Wörter dieser Sprache (für Lesetext-Lücken)
        if (DB.used && DB.used.looked) Object.keys(DB.used.looked).forEach(k => { if (k.startsWith(lang + ':')) delete DB.used.looked[k]; });
        if (DB.run && DB.run.lang === lang) DB.run = null;
        if (S.dailyRun && S.dailyRun.lang === lang) S.dailyRun = null;
        S.armed = null; save(); buildBank(); note(`${LANG[lang].deName} ist zurückgesetzt.`, 'ok');
      } else S.armed = key;
      render(); break;
    }
  }
});
// Beim ersten Antippen eines Felds mit vorgegebenem Satzanfang: Schreibmarke ans Ende.
// Android setzt sie sonst an die Stelle des Fingers, oft vor das erste Wort.
document.addEventListener('focusin', e => {
  const el = e.target;
  if (el.classList && el.classList.contains('tw')) el.dataset.touched = '1';
  if (el.id !== 'answer' || el.readOnly || !S.run || !S.run.cur) return;
  const ex = S.run.queue && S.run.queue[S.run.idx], start = ex && ex.data && ex.data.start;
  if (!start) return;
  const fix = () => { if (document.activeElement === el && el.value === start) caretToEnd(el); };
  fix(); setTimeout(fix, 0); setTimeout(fix, 120);
});
document.addEventListener('input', e => {
  const r = S.run;
  if (e.target.id === 'answer' && r && r.cur) { r.cur.input = e.target.value; sizeGap(e.target); }
  if (e.target.id === 'wtext' && S.write) { S.write.text = e.target.value; saveDraftSoon(); }
  if (e.target.id === 'bonusText' && r && r.bonus) r.bonus.text = e.target.value;
  if (e.target.id === 'ownDe' && S.own) S.own.de = e.target.value;
  if (e.target.id === 'ownT' && S.own) S.own.t = e.target.value;
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
  if (e.target.id === 'answer' && S.run && S.run.cur) {
    e.preventDefault();
    if (S.run.cur.state === 'answer') check(); else next();
  }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'tatTrap' && S.tat) S.tat.trap = el.value;
  if (el.id === 'importFile' && el.files && el.files[0]) {
    const fr = new FileReader();
    fr.onload = () => {
      const d = parseBackup(String(fr.result || ''));
      if (!d) note('Diese Datei ist kein Tagwerk-Backup.', 'warn');
      else {
        S.undoDB = JSON.stringify(DB);
        applyBackup(d);
        S.notice = { text:`Backup eingespielt: ${backupSummary()}.`, kind:'ok', action:{ label:'Rückgängig', a:'undoimport' } };
      }
      el.value = '';
      render();
    };
    fr.onerror = () => { el.value = ''; note('Die Datei ließ sich nicht lesen.', 'warn'); render(); };
    fr.readAsText(el.files[0]);
  }
});

window.addEventListener('pagehide', () => { if (S.write && S.view === 'write') { DB.draft = DB.draft || {}; DB.draft[S.write.lang] = { prompt:S.write.prompt, text:S.write.text }; } flushSave(); });
/* ---------- Zurück-Geste (Android, auch Firefox): innerhalb der App einen Schritt zurück ----------
   Solange es in der App ein „zurück“ gibt, liegt ein Eintrag im Browserverlauf darüber. Die Geste nimmt ihn weg (popstate),
   die App geht einen Schritt zurück, über dieselben Knöpfe wie in der Oberfläche, und legt bei Bedarf wieder einen an.
   Auf „Heute“ ohne offenes Fenster verlässt die Geste die App wie gewohnt. */
let navArmed = false;
const atRoot = () => S.view === 'home' && !S.pop;
function armBack(){
  if (navArmed || atRoot()) return;
  try { history.pushState({ tw:1 }, ''); navArmed = true; } catch (e) {}
}
function inAppBack(){
  if (S.pop) { S.pop = null; renderPopup(); return true; }
  const q = sel => { const b = document.querySelector(sel); return b && !b.disabled ? b : null; };
  if (S.view === 'shadow' && S.shadow && shBusy(S.shadow)) { shadowCmd('shcancel'); return true; }
  const b = q('#app .backbar .x') || q('#app .runbar .x') || (S.view === 'runDone' ? q('#app .actionbar [data-a=tab][data-v=home]') || q('#app .actionbar [data-a=tab]') : null);
  if (b) { b.click(); return true; }
  if (S.view !== 'home') { goView('home'); return true; }
  return false;
}
window.addEventListener('popstate', () => {
  navArmed = false;
  // Nichts mehr zurückzunehmen (alter Eintrag nach Neustart oder Tab-Wechsel): wie der Browser weiter zurück, also die App verlassen
  if (!inAppBack()) { try { history.back(); } catch (e) {} return; }
  armBack();
});
// Verbindung kommt oder geht: Menüs mit Online-Diensten zeigen es gleich an
['online', 'offline'].forEach(ev => window.addEventListener(ev, () => { if (['extra', 'texts'].includes(S.view)) render(); }));
document.addEventListener('visibilitychange', () => { if (document.hidden) { if (S.shadow) { shRecStop(); shStopPlay(); } if (S.write && S.view === 'write') { DB.draft = DB.draft || {}; DB.draft[S.write.lang] = { prompt:S.write.prompt, text:S.write.text }; } flushSave(); } });
// Hell/Dunkel: Statusleiste in der Farbe der App und neu zeichnen, wenn das System umschaltet (auch mitten in einer Übung)
function syncThemeColor(){
  try {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if (bg) document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.removeAttribute('media'); m.setAttribute('content', bg); });
  } catch (e) {}
}
try {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => { syncThemeColor(); render(); };
  if (mq.addEventListener) mq.addEventListener('change', onScheme); else if (mq.addListener) mq.addListener(onScheme);
} catch (e) {}
/* ---------- Start ---------- */
load();
buildBank();
// Sprache des Tages erst nach dem Aufbau der Satzbank, sonst zählen die fälligen Wiederholungen nicht
S.lang = dayLang(); DB.settings.lang = S.lang; save();
buildGloss();
// Erreichte Etappen festhalten, bevor Tagesstände und Fehlerprotokoll ausgedünnt werden (Daten bleiben so stabil)
persistWay();
pruneTlog();
compactSnaps();
snapshot();
// Den Browser bitten, die Daten dauerhaft zu behalten und nicht bei Speicherknappheit zu löschen
measureStore();
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).then(p => { STORE.persisted = !!p; if (S.view === 'settings') render(); }).catch(() => {}); } catch (e) {}
restoreRun();
syncThemeColor();
if (!handleLaunch()) render(); else if (S.view === 'own') render();
setTimeout(() => { refill('sv'); refill('es'); }, 1500);
if (canSpeak()) { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => { if (S.view === 'extra') render(); }; }
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  // Nach einem Update: Hinweis, sobald die neue Version bereitsteht (nicht beim allerersten Installieren)
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    S.notice = { text:'Eine neue Version ist da.', kind:'ok', action:{ label:'Neu laden', a:'reload' } };
    if (S.view !== 'run') render();
  });
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
