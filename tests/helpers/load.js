// Lädt die App-Quellen ohne Browser in eine VM. Oberflächenfunktionen werden durch leere Platzhalter ersetzt,
// damit Logik (Generatoren, Auswahl, Prüfung, Statistik) direkt testbar ist.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { ORDER } = require('../../tools/build.js');
const SRC = path.join(__dirname, '..', '..', 'src');
function loadApp({ voices = false, exclude = ['js/part_events.js'] } = {}){
  const store = {};
  const speech = voices ? { getVoices:() => [{ lang:'sv-SE' }, { lang:'es-ES' }], speak(){}, cancel(){} } : undefined;
  const Utter = voices ? function(){} : undefined;
  const sandbox = {
    console, Math, Date, URL, setTimeout:() => 0, clearTimeout(){},
    window:{ scrollTo(){}, speechSynthesis:speech, SpeechSynthesisUtterance:Utter, matchMedia:() => ({ matches:false, addEventListener(){} }) },
    speechSynthesis:speech, SpeechSynthesisUtterance:Utter,
    document:{ getElementById:() => null, querySelector:() => null, querySelectorAll:() => [], addEventListener(){}, documentElement:{ classList:{ add(){}, remove(){} }, scrollHeight:0 } },
    localStorage:{ getItem:k => (k in store ? store[k] : null), setItem:(k, v) => { store[k] = String(v); }, removeItem:k => { delete store[k]; } },
    navigator:{ onLine:false }, location:{ search:'' }
  };
  vm.createContext(sandbox);
  const code = ORDER.filter(f => !exclude.includes(f)).map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
  const stubs = 'function render(){} function renderPopup(){} function goView(v){ S.view = v; } function note(){}';
  vm.runInContext(`${code}\n${stubs}\nbuildGloss(); buildBank();\nglobalThis.__get = n => eval(n); globalThis.__setDB = d => { DB = d; };`, sandbox, { filename:'tagwerk-test-bundle.js' });
  return {
    get:name => sandbox.__get(name),
    run:code => vm.runInContext(code, sandbox),
    setDB:d => sandbox.__setDB(d),
    store
  };
}
module.exports = { loadApp, SRC };
