# Tagwerk: Anleitung für die Arbeit am Repo

Du übernimmst die Weiterentwicklung meiner Sprachlern-App „Tagwerk“. Antworte auf Deutsch, knapp, mit Entscheidung und Begründung; bewerte Ideen ehrlich (gern mit Noten A–D) und sag, wenn der Status quo die beste Lösung ist.

## Projekt
- Offline-PWA ohne Framework, ohne KI, ohne Konto, ohne Tracker. Lernen von Schwedisch und Spanisch, Oberfläche Deutsch. Ich bin in beiden Sprachen fortgeschritten (Einstellung „Fortgeschritten“).
- Repo: github.com/caionnew/tagwerk (öffentlich), App: https://caionnew.github.io/tagwerk. GitHub Actions: Workflow „Pages“ (bauen, Einheitstests, veröffentlichen) und „CI“ (Einheitstests, Browser-Tests in Chromium und Firefox, beide verbindlich).
- Die aktuelle Version steht in package.json und oben in CHANGELOG.md, die Testzahlen in README.md.
- Diese Datei (CLAUDE.md) ist die Anleitung; mein Eingangstext verweist nur noch hierher.
- Doku:
  - docs/IDEEN.md: Fahrplan und alle bewerteten Ideen mit Noten, auch „zurückgestellt“ und „bewusst nicht“. Was umgesetzt ist, kommt dort heraus.
  - docs/ARCHITECTURE.md (Aufbau, Module, Speicherformat, Gestaltungssystem), docs/CONTENT.md (Inhaltsformat, Regeln für Texte und Generatoren), docs/RESEARCH.md (Studien und eigene Festlegungen), docs/INSTALL.md, CHANGELOG.md.
  - Lies vor der Arbeit IDEEN.md und die obersten Einträge im CHANGELOG, dann die Teile der übrigen Doku, die die Aufgabe berührt.
- Mein Lernstand liegt im localStorage unter „tagwerk-offline-v1“ und darf nie verloren gehen. Änderungen am Datenformat immer abwärtskompatibel: Alte Stände und alte Backups müssen weiter laden, auch mit offenem Tagwerk.

## So kommen Änderungen zu mir
- Ich nutze Android, Firefox (Dunkelmodus), die App als installierte PWA, dazu Termux.
- Du lieferst je Änderung eine Datei `tagwerk-<version>.patch` (git format-patch) unter /mnt/user-data/outputs und schickst sie mir.
- Ich lade sie herunter und tippe in Termux `tagwerk`. Das Skript tools/einspielen.sh holt den aktuellen Stand, spielt die neueste tagwerk-*.patch aus Downloads ein (git am --3way, bei Konflikt Abbruch ohne Änderung), pusht und verschiebt die Datei. Du musst mir das nicht jedes Mal erklären.

## Arbeitsweise
1. Stand holen:
   - Neue Sitzung: Repo nach /home/claude/work/repo klonen, `npm ci`.
   - Laufende Sitzung: `git fetch`, dann `git cherry -v origin/main`. Zeilen mit „+“ sind gelieferte Commits, die noch nicht angekommen sind (git am vergibt neue Hashes, darum nicht `origin/main..HEAD`). Gibt es welche: `git rebase origin/main`, weiterarbeiten und alle ausstehenden Commits zusammen als eine Datei liefern (`git format-patch origin/main --stdout`); sag mir dann, dass ich die ältere Datei aus Downloads löschen soll. Gibt es keine: `git reset --hard origin/main`.
2. Ändern, dann `node tools/build.js` (Ausgabe dist/index.html, eine Datei).
3. Tests:
   - Einheitstests samt ESLint mit `npm test`, zweimal: einmal so (die Arbeitsumgebung läuft wie GitHub in UTC) und einmal mit meiner Zeitzone, `TZ=Europe/Berlin npm test`, weil „heute“ an der Ortszeit hängt.
   - Browser-Tests: `CHROMIUM_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux64/chrome | head -1) npx playwright test --project=chromium`. Firefox fehlt dort; das prüft die CI.
   - Keine Tests, die vom Zufall abhängen; wo Zufall nötig ist, mit festem Startwert. Startdaten in Browser-Tests über `seed()`; Neuladen behält den Speicher.
   - Rund um Mitternacht (UTC oder Ortszeit) können datumsabhängige Tests scheitern; dann danach wiederholen.
   - Ändern sich Sätze oder Alternativen, nennt tests/unit/kombinationen.test.js neue erzeugte Fassungen (Kombinationen, -se): alle lesen, falsche mit „nicht: …“ in den Alternativen ausschließen, dann `node tools/kombinationen.js --write`.
   - Kommen Verben ins Wörterbuch, nennt tests/unit/verbformen.test.js ihre abgeleiteten Formen: lesen; falsche Gruppe oder fehlender Stammwechsel in die Listen in src/js/verbformen.js (SV_G2, SV_G3, SV_STRONG, SV_INTRANS, Vorsilben in SV_PREFIX; ES_IE, ES_UE, ES_EI, ES_ACC_IAR), dann `node tools/verbformen.js --write`.
4. Sichtprüfung bei UI-Änderungen: `npm run sicht -- --vs origin/main` macht Vorher/Nachher aller Ansichten in 390×844 und 411×923, hell und dunkel. Neue Ansichten in tools/sicht.js aufnehmen und die Bilder wirklich ansehen. Wenn ich ein Backup (JSON) mitschicke, damit prüfen: Echte Daten zeigen mehr als Testprofile.
5. Ändert sich Speicher, Backup oder eine Aufgabenart: den vorigen Stand mit `git worktree` bauen, dort mit offenem Tagwerk exportieren, im neuen Stand auf leerem Gerät einspielen, weiterüben, wieder exportieren und einspielen.
6. Release:
   - Version mit `npm version X.Y.Z --no-git-tag-version` erhöhen (package.json und package-lock.json).
   - Neuer Abschnitt oben in CHANGELOG.md, Testzahlen in README.md, Doku bei Bedarf (ARCHITECTURE, CONTENT, RESEARCH; in IDEEN Umgesetztes heraus, neu Bewertetes hinein). Ändern sich Arbeitsweise, Module oder Entscheidungen, auch diese Datei (CLAUDE.md); tests/unit/anleitung.test.js prüft, dass jede genannte Datei existiert und jedes Modul genannt ist.
   - Commit „X.Y.Z: Kurzbeschreibung“, dann `git format-patch -1 --stdout > /mnt/user-data/outputs/tagwerk-X.Y.Z.patch`.
   - Trockenlauf: frische Bare-Kopie von GitHub klonen, daraus eine Arbeitskopie (mit git user.name und user.email), Patch in ein falsches HOME unter storage/downloads legen, `HOME=… sh tools/einspielen.sh`, bauen (node_modules verlinken), `cmp dist/index.html` gegen deinen Build.
   - Reine Teständerungen ohne Versionssprung, als `tagwerk-<version>-tests.patch`.

## Code-Landkarte (Details in docs/ARCHITECTURE.md)
- src/js/part_text.js: Satzzeichen und Wortgrenzen an einer Stelle (unpunct, punctKey, wordCore, wordParts, endsSentence); kommt im Build zuerst. Keine eigenen Zeichenlisten in anderen Dateien (Test).
- src/js/part_head.js: Themen (TRAPS, Wortschatz-Themen mit vocab:true), Zustand, load/save, Backup (parseBackup, applyBackup), Satzbank-Aufbau (Niveau je Satz), pickNew, Tagesplan, Sprache des Tages, Tagwerk je Sprache, Schwerpunkt der Woche, Wiederholungssperre der Generatoren.
- src/js/part_fsrs.js: FSRS-6. part_check.js: Antwortprüfung, geprüfter Teil, Rundenende.
- src/js/part_views.js: alle Ansichten; part_events.js: Klicks über data-a, Export und Import; part_start.js: Begrüßung; part_icons.js: Symbole.
- src/js/part_stats.js: Themenliste im Sprach-Tab (topicListHtml, mit Veränderungspfeilen), Karte „Wie du Fehler machst“ (errorWaysHtml; mistake: Fehlerart; Wortschatz-Themen prüfen das Wort, nicht die Form), hartnäckige Sätze; part_model.js: Fehlermodell je Thema und je Übungsart (rateModel: Beta-Binomial mit Vergessen, empirisch-bayessch: Schätzung, Bereich, höchste Quoten topRates zum Anzeigen, „klar über Schnitt“ clearSet mit Hysterese 90/60 zum Handeln (Wechsel durch eine Runde: clearChanges, oben am Rundenende), Veränderung topicChange vier gegen vier Wochen mit pLess, Verlauf topicHistory, Thompson-Sampling für den Schwerpunkt), eine Rechnung für Heute, Themenliste, Themenblatt, Schwerpunkt, „Als Nächstes“, Grundlagensätze; part_ref.js: Themenblatt mit „Regel“ und „Deine Zahlen“; part_long.js: „Dein Weg“, Jahr für Jahr; part_verlauf.js: Verlauf im Sprach-Tab mit den Reitern Sätze, Wörter, Gedächtnis (Behaltensdauer: Quartile der FSRS-Stabilität im Tagesstand sp), monotone Kurven, Antippen und Ziehen zeigt einen Tag.
- src/js/part_series.js: Reihen (Lesetexte in Fortsetzungen: Übersicht, „Bisher“, nächster Teil, Fortsetzung auf „Heute“), liest im Leser von part_read.js.
- src/js/part_read.js: Lesen und Hören; part_radio.js: Hörrunde; part_shadow.js: Nachsprechen; part_speech.js: Vorlesen und Aufnahme; part_write.js: Schreiben; part_ref.js: Themenblatt, Karten; part_online.js: Tatoeba, LanguageTool.
- src/js/generators.js (GENS, darunter Nomen tauschen mit SWAP_ES) und forms.js: erzeugte Übungen, Fehler finden, Umbauen, Uhrzeiten, Genus.
- src/data/content.js: Satzbank, je Zeile „Deutsch | Ziel | Lücke | Hinweis | Alternativen | Niveau | Erklärung“ (Niveau optional, Erklärung Pflicht). Kombinationen von Alternativen und -se zu -ra erzeugt part_head.js (altsMade), beim ersten Zugriff je Satz.
- src/data/gloss.js: Wörterbuch. Jedes Wort aus Satzbank (auch Alternativen und erzeugte Fassungen), Generatoren und Lesetexten muss nachschlagbar sein (Test). Verbformen nicht von Hand eintragen, nur die Grundform (Infinitiv mit Bedeutung als Verb): glossForms leitet die Formen ab, Einträge von Hand gehen vor.
- src/js/verbformen.js: Verbformen beider Sprachen an einer Stelle (esConj, conjugate, svConj, svGroup), für Wörterbuch, Prüfung und Übungsformen.
- src/data/reihen.js: Reihen, Inhalte in Paketen; Aufbau und Regeln in docs/REIHEN.md (Fakten mit Quellen, „Was ist echt?“, keine erfundenen Zitate).
- src/data/texte.js: Lesetexte; kultur.js, geo.js: Land & Leute; terms.js: Fachbegriffe; fundstueck.js: Feste, falsche Freunde.
- tests/unit (App in Node über tests/helpers/load.js), tests/e2e (helpers.js: freshDB, richDB, seed, answerWrong, stored); tools/sicht.js, tools/einspielen.sh, tools/kombinationen.js, tools/verbformen.js.

## Festgelegte Entscheidungen
- Ein Tagwerk am Tag ist die Einheit, in einer Sprache, gewählt nach Bedarf. Die andere Sprache steht auf „Heute“ mit Stand und „Tagwerk starten“. Die Serie zählt je Tag, Tagwerke werden je Sprache gezählt.
- Übungen: Aufgabe oben, Antwort unten (Abstand höchstens 30 % der Bildhöhe), Knopfleiste unten, Nebenweg links, Hauptweg rechts. Kein automatisches Weiter.
- Einheitliche Kodierung für Kalender und Wochenstreifen: gefüllt = Tagwerk, Farbe = Sprache (Schwedisch blau, Spanisch gelb, beide diagonal geteilt), Rand = nur geübt, gestrichelt = freier Tag.
- Gestaltung nur mit den festen Stufen aus style.css (Radien: Flächen 18 px, Bedienelemente 14 px). Bewegung als Antwort auf eine Handlung, am Feiertag einmal beim ersten Öffnen von „Heute“; kurz, `prefers-reduced-motion` wird respektiert.
- Keine Herzen, Ligen, Konfettiregen oder Gimmicks. Kleine Freuden mit etwas Bewegung sind erwünscht, wenn sie gut aussehen und nicht kitschig sind: kurz, einmal, aus dem Bild der App (Stempel, Tinte, Papier) oder aus der Kultur der Sprache (Feiertage, Wochentage). Lieber Grafik statt viel Text, wo es Klarheit bringt.
- Große Zeilen, die mit ¡ oder ¿ beginnen, über `hangLead`: Das Zeichen hängt vor der Kante, die Buchstaben fluchten mit der Zeile darüber oder darunter.
- Kein Text, wo die Oberfläche für sich spricht: keine Bedienhinweise („Tipp auf …“), keine Ankündigungen („erscheint, sobald …“), keine Implementierungsdetails (Verfahren, Planung, woher etwas kommt). Was noch nicht geht, fehlt einfach. Hinweise nur bei Fehlern, drohendem Datenverlust und Datenschutz; Lizenzangaben bleiben.
- Statistik: Jede Zahl sagt, was sie zählt (Erklärung oben, nicht erst darunter). Aufteilungen als Anzahl, Quoten als Prozent; bei kleinen Mengen keine Scheingenauigkeit.
- Auswahlaufgaben haben genau eine richtige Option. Listen in Generatoren mindestens dreimal so groß wie die Wiederholungssperre (12).
- Weder Hinweis noch Auswahl einer Aufgabe darf die Lösung verraten: Aufgaben nie nach ihrer Lösung aussortieren oder neu würfeln. Deutsche Stichwörter nur, wo sie eindeutig sind.
- Oberfläche deutsch; Zielsprache nur, wo die Bedeutung aus dem Zusammenhang klar ist und sich täglich wiederholt (Gruß, Datum, Zuruf; Serie ab „Mittel“; bei „Fortgeschritten“ die ganze Aufgabe: Anweisungen, Urteil, Schreibaufgabe, mit Deutsch auf Tipp). Navigation, Knöpfe, Statistik, Regeln und Erklärungen bleiben deutsch.
- Bei „Fortgeschritten“ ist die Grundform verdeckt und erscheint erst auf Tipp. Erzeugte Aufgaben zeigen bei falscher Antwort die Standardlösung, vorgelesen wird, was angezeigt wird.
- Inhalte sachlich korrekt und idiomatisch. Wo zwei Lösungen gehen, als Alternative aufnehmen oder aus den Optionen nehmen. Bei erzeugten Sätzen alle Fassungen lesen, nicht nur Stichproben.

## Stand
- Ich nutze die App seit dem 15.11.2026.
- Was als Nächstes kommt, was zurückgestellt ist und was bewusst nicht kommt, steht in docs/IDEEN.md, nicht hier.
