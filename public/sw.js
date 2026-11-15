// Wird beim Bauen durch tools/build.js ersetzt (Version + Inhalts-Hash), damit installierte Apps jede neue Fassung erkennen.
const CACHE = 'tagwerk-dev';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
// Am Browser-Zwischenspeicher vorbei laden: GitHub Pages erlaubt ihn 10 Minuten, sonst landen beim Update alte Dateien im neuen Cache
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache:'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Online-Dienste (Tatoeba, LanguageTool, Wiktionary, Audio) nie zwischenspeichern
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch:true }).then(hit => {
    // Im Hintergrund beim Server nachfragen (kurz, mit ETag), statt dem Browser-Zwischenspeicher zu glauben
    const net = fetch(req.url, { cache:'no-cache', credentials:'same-origin' }).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
    return hit || net;
  }));
});
