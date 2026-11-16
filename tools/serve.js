#!/usr/bin/env node
// Kleiner Webserver für dist/: für die Browser-Tests und zum Ausprobieren am Rechner.
// Über http://localhost läuft die App wie auf GitHub Pages, mit Service Worker und eigenem Speicher je Herkunft.
// Aufruf: node tools/serve.js [Port]   (Standard 8080; Browser-Tests nutzen 4173)
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', process.env.OUT_DIR || 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json',
  '.webmanifest':'application/manifest+json', '.png':'image/png', '.svg':'image/svg+xml', '.css':'text/css; charset=utf-8' };
http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, path.normalize(rel));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }).end('Nicht gefunden'); return; }
    res.writeHead(200, { 'Content-Type':TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(body);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`Tagwerk unter http://localhost:${PORT}/`));
