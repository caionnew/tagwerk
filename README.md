# Tagwerk

Eine Lern-App für **Schwedisch und Spanisch**, die jeden Tag ein kurzes „Tagwerk“ zusammenstellt: neue Sätze, fällige Wiederholungen und gemischte Grammatik. Sie läuft offline auf dem Handy, braucht kein Konto und keine KI und speichert alles nur auf dem Gerät.

<p>
<img src="docs/screenshots/heute.png" width="190" alt="Startseite mit Tagesplan">
<img src="docs/screenshots/fortschritt.png" width="190" alt="Fortschritt mit Kennzahlen und Verlauf">
<img src="docs/screenshots/schreiben.png" width="190" alt="Textprofil mit Hinweisen">
<img src="docs/screenshots/land-und-leute.png" width="190" alt="Land und Leute mit Karte">
</p>

## Was die App kann

- **Sätze statt Vokabeln**, geplant mit FSRS-6 (dem Verfahren aus Anki), geprüft gegen die offizielle Referenz.
- **Übungsformen:** Wortkästchen, Lücken, freies Übersetzen, Hördiktat, Nachsprechen mit Aussprache-Prüfung, Fehler finden, Umbauen, Uhrzeiten & Zahlen, Genus. Grammatik-Generatoren erzeugen beliebig viele neue Aufgaben, ohne sich zu wiederholen.
- **Gezielt zu typischen Fehlern** deutschsprachiger Lernender: Inversion, „inte“ im Nebensatz, Präteritum oder Perfekt, ser oder estar, Subjuntivo, por oder para und mehr. Zu jedem Thema ein Blatt mit Regel, Beispielen und typischem Fehler; Fachbegriffe sind antippbar.
- **Schreiben** mit Textprofil (Zeitformen, Nebensätze, Satzlänge, LIX), treffsicheren Offline-Hinweisen, freiwilligen Extra-Aufgaben und Archiv. Online-Prüfung mit LanguageTool auf Wunsch.
- **Wörterbuch** für jedes angezeigte Wort, offline, mit Beispielen aus den eigenen Sätzen.
- **Land & Leute:** Alltag, Gesellschaft, Geografie und Sprachvarianten, teils mit Karte; Beispielsätze lassen sich in die Wiederholung übernehmen. Feste mit berechneten Terminen, falsche Freunde.
- **Fortschritt:** Serie mit einem freien Tag pro Woche, Kalender, Lernminuten, Behalten, Fehlerquellen, Themenraster, „Dein Weg“ mit Etappen, Entwicklung der eigenen Texte.
- **Lesen und Hören:** kurze Texte zu allem Möglichen, zum Lesen oder nur Hören, mit Verständnisfragen; dazu ein zufälliger Wikipedia-Artikel (online).
- **Hörrunde:** geübte Sätze nebenbei hören, Satz, Deutsch, langsam, ohne Antippen.
- **Nachschub** von Tatoeba, sobald die eingebauten Sätze zur Neige gehen (online, abschaltbar).

## Auf dem Handy installieren

Siehe [docs/INSTALL.md](docs/INSTALL.md). Kurz: Die sechs Dateien aus `dist/` auf GitHub Pages hochladen, den Link in Chrome oder Firefox öffnen, „App installieren“. Vom Handy mit Termux geht auch das ganze Repository samt automatischer Veröffentlichung (Weg C); Updates kommen dann als eine `.patch`-Datei.

## Entwickeln

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install                 # Entwicklungswerkzeuge (Playwright, Kartenwerkzeuge)
npm run build               # → dist/
npm test                    # Einheitstests, ohne Browser (159 Tests)
npx playwright install chromium
npm run test:e2e            # Browser-Tests in Handygröße (42 Tests)
npm run serve               # lokal unter http://localhost:8080 ansehen
```

Eigenes Chromium statt Download: `CHROMIUM_PATH=/pfad/zu/chrome npm run test:e2e`.

Weitere Befehle: `npm run icons -- <name>` erzeugt die App-Symbole aus einem Entwurf in `design/icons/`, `npm run geo` erzeugt die Kartendaten neu, `npm run screenshots` die Bilder oben, `python3 tools/fsrs_reference.py` die FSRS-Referenz (braucht `pip install fsrs==6.3.3`).

## Aufbau

```
src/
  index.html          Gerüst mit Platzhaltern für CSS und JavaScript
  style.css           alle Stile, helles und dunkles Farbschema
  data/               Inhalte: Satzbank, Wörterbuch, Begriffe, Feste, Land & Leute, Kartendaten
  js/                 Logik: Generatoren, Übungsformen, Wiederholung, Prüfung, Statistik, Schreiben, Ansichten
public/               Manifest, Service Worker, Symbole (aus design/icons/, siehe tools/icons.js)
design/icons/         Entwürfe für das App-Symbol als SVG; AKTIV nennt den verwendeten
tools/                Build, Symbole, Kartendaten, FSRS-Referenz, Bildschirmfotos, einspielen.sh (Updates per Termux)
tests/
  unit/               Node-Tests ohne Browser
  e2e/                Playwright-Tests
  helpers/, fixtures/ Lader für die VM, FSRS-Referenzdaten
docs/                 Installation, Architektur, Inhalte, Forschungsgrundlagen
.github/workflows/    CI (Tests) und Pages (Veröffentlichung)
```

Details: [Architektur](docs/ARCHITECTURE.md) · [Inhalte pflegen](docs/CONTENT.md) · [Forschungsgrundlagen](docs/RESEARCH.md) · [Änderungen](CHANGELOG.md)

## Daten und Datenschutz

Der gesamte Lernstand liegt im Speicher des Browsers auf dem Handy. Es gibt kein Konto, keinen Server, keine Tracker und keine fremden Schriften. Nur bei einer Aktion werden Online-Dienste gefragt: Tatoeba (Suchwort bzw. Sprache für Nachschub), LanguageTool (dein Text, nur bei „Online prüfen“), Wiktionary (das nachgeschlagene Wort, nur wenn es nicht im eingebauten Wörterbuch steht) und die Spracherkennung von Chrome (nur bei „Aussprache prüfen“).

## Quellen und Lizenzen

- Beispielsätze und Aufnahmen von [Tatoeba](https://tatoeba.org) werden zur Laufzeit geladen und mit Urheber und Lizenz angezeigt (CC BY 2.0 FR bzw. CC0; Aufnahmen nach Lizenz der Sprecher).
- Kartendaten: [Natural Earth](https://www.naturalearthdata.com) (gemeinfrei), aufbereitet über [world-atlas](https://github.com/topojson/world-atlas).
- FSRS: Verfahren des Projekts [open-spaced-repetition](https://github.com/open-spaced-repetition); die Umsetzung hier ist eigenständig.
- Satzbank, Wörterbuch, Texte und Code dieser App: eigene Inhalte. Eine Lizenz für das Repository ist noch nicht festgelegt.
