/* ---------- Satzzeichen und Wortgrenzen ----------
   Eine Stelle für Prüfung, Wörterbuch, Wortkästchen und Anzeige. Beim Vergleichen zählen Satzzeichen nicht; der Doppelpunkt
   nur am Wortende, denn im Schwedischen gehört er ins Wort (tv:n, USA:s). Apostroph und Bindestrich gehören immer zum Wort. */
const P_OPEN = '¿¡"„“«(';          // vor einem Wort
const P_CLOSE = '.!?,;:"„“”»)…';   // nach einem Wort
const P_INV = '¿¡';                // spanische Frage und Ausruf am Satzanfang
const P_STOP = '.!?';              // Satzende
const P_END = P_STOP + '…';        // Satzende, auch mit Auslassungszeichen
const P_PAUSE = ',;:–—';           // Pause im Satz (Komma, Doppelpunkt, Gedankenstrich)
const rxSet = s => `[${s.replace(/[\\\]^-]/g, '\\$&')}]`;
const RX_PUNCT = new RegExp(`${rxSet('.!?¡¿,;"„“”«»()…–—')}|:(?=\\s|$)`, 'g');
const RX_EDGE = new RegExp(`^${rxSet(P_OPEN)}+|${rxSet(P_CLOSE)}+$`, 'g');
const RX_PARTS = new RegExp(`^(${rxSet(P_OPEN)}*)([^]*?)(${rxSet(P_CLOSE)}*)$`);
const RX_ENDS = new RegExp(`${rxSet(P_END)}$`);
const str = s => (s == null ? '' : String(s));
// Satz ohne Satzzeichen, an ihrer Stelle ein Leerzeichen (Vergleiche, Wortlisten)
const unpunct = s => str(s).replace(RX_PUNCT, ' ');
// Wort ohne Satzzeichen, auch innen (Schlüssel für den Vergleich einzelner Wörter)
const punctKey = w => str(w).replace(RX_PUNCT, '');
// Wort ohne Satzzeichen davor und danach (Nachschlagen, Anzeige)
const wordCore = w => str(w).replace(RX_EDGE, '');
// Wort in Zeichen davor, Kern und Zeichen danach (¿Qué → ¿ · Qué, tv:n. → tv:n · .)
const wordParts = w => { const m = RX_PARTS.exec(str(w)); return { pre:m[1], core:m[2], post:m[3] }; };
const endsSentence = w => RX_ENDS.test(str(w));
