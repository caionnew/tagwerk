# Architektur

Tagwerk ist eine einzelne HTML-Datei ohne Framework und ohne Laufzeit-Abhängigkeiten. Das hält die App klein (rund 450 KB), offline-fähig und über Jahre wartbar.

## Build

`tools/build.js` setzt `src/index.html` (Gerüst mit Platzhaltern), `src/style.css` und alle Skripte in fester Reihenfolge zu `dist/index.html` zusammen, prüft das JavaScript auf Syntaxfehler und kopiert `public/` dazu. Die Cache-Version im Service Worker wird aus Paketversion und Inhalts-Hash gebildet (`tagwerk-24.0.0-1f89fd26`); jede inhaltliche Änderung erzeugt eine neue Version, und installierte Apps zeigen „Eine neue Version ist da“. Symbole bekommen einen Inhalts-Hash im Dateinamen (`icon-512.89186482.png`), weil Firefox Symbole pro Adresse zwischenspeichert; die Verweise in Manifest, Service Worker und `index.html` setzt der Build. Die Versionsnummer aus `package.json` ersetzt `'@VERSION@'` (`APP_VERSION`) und steht unter Einstellungen.

Alle Skripte laufen in einer gemeinsamen Funktion mit `'use strict'`. Die Reihenfolge steht in `ORDER` in `tools/build.js`: Daten und Generatoren zuerst, Ansichten und Ereignisse zuletzt.

## Module

| Datei | Aufgabe |
|---|---|
| `data/content.js` | Satzbank (`CONTENT`) |
| `js/generators.js` | Konjugation, Grammatik-Generatoren (`GENS`) |
| `js/forms.js` | Übungsformen: Fehler finden, Umbauen, Uhrzeiten & Zahlen, Genus |
| `data/gloss.js` | Wörterbuch, `lookupWord()`, Wiktionary-Abfrage |
| `data/fundstueck.js` | Feste, falsche Freunde, Begrüßung, Auswahl des Fundstücks |
| `data/terms.js` | Fachbegriffe, `termify()` macht sie in Erklärungen antippbar |
| `data/kultur.js`, `data/geo.js` | Land & Leute, Kartendaten |
| `data/texte.js` | Lesetexte mit Fragen und übernehmbaren Sätzen |
| `js/part_head.js` | Konstanten, Themen (`TRAPS`), Speicher, Satzbank-Aufbau, Tagesplan, Runden, Wiederholungssperre, Serie, Tagesstand |
| `js/part_fsrs.js` | FSRS-6 (Wiederholungsplanung) |
| `js/part_check.js` | Antworten prüfen (Gleichwertiges, Tippfehler, geprüfter Teil), Rundenablauf, „Gleich nochmal“, „Meine ist auch richtig“ |
| `js/part_online.js` | Tatoeba (Nachschub, Suche, Aufnahmen), LanguageTool |
| `js/part_speech.js` | Vorlesen, Aufnahme, Aussprache prüfen |
| `js/part_radio.js` | Hörrunde: Sätze nebenbei hören |
| `js/part_read.js` | Lesen und Hören: Texte, Fragen, Wikipedia-Fundstück |
| `js/part_modern.js` | Symbole, Vibration, Teilen, Schnellzugriffe |
| `js/part_stats.js` | Fehlerquellen und Fehlerart (Grammatik oder Wortschatz), Uhrzeiten, Wortschatz |
| `js/part_long.js` | Dein Weg, Themenraster, Veränderung über 30 Tage |
| `js/part_write.js` | Textprofil, Hinweise, Extra-Aufgaben, Textarchiv |
| `js/part_ref.js` | Themenblatt, Nachschlagelisten, Kulturkarten, Karten |
| `js/part_views.js` | Alle Ansichten als HTML-Vorlagen, `render()` |
| `js/part_events.js` | Ereignisse, Aktionen, Start |

## Darstellung und Ereignisse

Übungen folgen einem Aufbau: oben die Aufgabe (Anweisung, Vorlage), darunter ein Abstandshalter (`.ex-sp`, höchstens 30 % der Bildhöhe), dann in `.ex-a` die Antwortzone in der unteren Bildhälfte, dazwischen nach dem Antworten die Rückmeldung (`#fb`). Neue Übungsarten legen ihre Eingabe in `.ex-a`; `tests/e2e/layout.spec.js` prüft das für alle Arten.


`render()` erzeugt die aktuelle Ansicht als Zeichenkette und setzt sie in `#app`. Alle Benutzeraktionen laufen über ein einziges Klick-Ereignis: Elemente tragen `data-a="aktion"`, `part_events.js` verteilt sie. Laufzeitzustand liegt in `S` (aktuelle Ansicht, laufende Runde, offene Fenster), alles Dauerhafte in `DB`.

## Datenspeicher

`DB` liegt als JSON unter `localStorage['tagwerk-offline-v1']` und wird 150 ms nach jeder Änderung gespeichert, sofort beim Wechsel in den Hintergrund. Backup und Wiederherstellung exportieren genau dieses Objekt (`backupText`, `parseBackup`, `applyBackup` in `part_head.js`). Der Speicher gehört zur Adresse (Origin), nicht zu den Dateien: Ein Update unter demselben Link behält den Stand.

| Feld | Inhalt |
|---|---|
| `settings` | Rundenlänge, Sprache, Nachschub, Vorlesen, Extra-Aufgaben beim Schreiben |
| `st[id]` | Lernstand je Satz: FSRS-Stabilität `s`, Schwierigkeit `d`, Intervall `ivl`, `due`, `last`, Zähler, eigene richtige Fassungen |
| `log[datum][sprache]` | Aufgaben, neue Sätze, Wiederholungen, gefestigt, Sekunden |
| `done[datum]` | Tagwerk erledigt |
| `snap[datum][sprache]` | Tagesstand (älter als 120 Tage nur sonntags und am Monatsende, `compactSnaps`): geübt `n`, gefestigt `m`, abrufbar `k`, Wortschatz `w`, gefestigt je Thema `t` |
| `tlog[datum]` | Fehlerquellen je Thema (`p:`), Übungsart (`t:`), Fehlerart (`e:`), Stunden `h`; nach 120 Tagen gelöscht |
| `gen`, `genus` | Ergebnisse der erzeugten Aufgaben und der Genus-Wörter |
| `own`, `tat` | eigene Sätze, Sätze von Tatoeba |
| `texts` | Textarchiv mit Messwerten (höchstens 500) |
| `used` | Hinweise, Wiederholungsgedächtnis der Generatoren und Runden, Schreibaufgaben |

Ältere Speicherstände werden beim Laden ergänzt; Felder werden nie umbenannt, damit Backups aus allen Versionen lesbar bleiben.

## App-Symbol

`design/icons/*.svg` sind Entwürfe auf 512 × 512 mit dem Motiv im inneren Kreis (80 %, sichere Zone für Masken). `tools/icons.js` rendert den in `design/icons/AKTIV` genannten Entwurf zu `public/icon-192.png` und `icon-512.png` (rund, Ecken durchsichtig, `purpose: any`) und `icon-maskable-512.png` (randlos, `purpose: maskable`). Farben aus der App: Blau `#1D5689`, Safran `#E3A21A`, Papier `#F3F5F4`.

## Bewegung

Nur als Antwort auf eine Handlung und kurz: Rückmeldung und Fenster blenden ein, Wortkästchen gleiten (FLIP mit der Web Animations API, `flyFrom`), der Fortschrittsbalken füllt sich, das Rundenende baut seine Ergebnisleiste einmal auf, der Tagesstempel zeichnet sich. `prefers-reduced-motion: reduce` schaltet alles ab.

## Online und offline

Offline funktioniert alles außer: Wikipedia-Fundstück, Nachschub und Suche bei Tatoeba, Textprüfung mit LanguageTool, Wiktionary-Erklärungen für unbekannte Wörter, Aussprache prüfen (Spracherkennung von Chrome). Diese Dienste werden nur bei einer Aktion angefragt und nie zwischengespeichert. Die App lädt keine fremden Schriften, Skripte oder Tracker.

## Tests

- `tests/unit/` (Node, ohne Browser): Inhalte, Wörterbuch-Abdeckung, FSRS gegen die Referenz, Wiederholungssperre, Rundenauswahl, Serienregel, Feste, Fehlerart, Schreibprüfung. `tests/helpers/load.js` lädt die Quellen in eine VM und ersetzt die Oberfläche durch Platzhalter.
- `tests/e2e/` (Playwright, Handygröße): Start, kompletter Tagwerk-Durchlauf, Wortkästchen, „Meine ist auch richtig“, Nachschlagen, Fortschritt, Schreiben, Land & Leute, Teilen, Schnellzugriff, reduzierte Bewegung. Jeder Test schlägt fehl, sobald die Seite einen JavaScript-Fehler wirft.
