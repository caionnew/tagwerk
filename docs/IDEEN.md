# Ideen für Tagwerk

Lohnende, noch nicht umgesetzte Ideen, mit Bewertung (A bis D) und den Gründen, dazu der Fahrplan für die nächsten Updates. Was umgesetzt ist, kommt hier heraus und steht im [Änderungsverlauf](../CHANGELOG.md). Themen für Lesetexte stehen getrennt in [THEMEN.md](THEMEN.md).

Stand: 17. November 2026 (nach 24.38.0)

Bewertet nach: Wirkung aufs Lernen auf fortgeschrittenem Niveau, wie oft es im Alltag greift (täglich im Tagwerk oder selten), Passung zu den Grundsätzen (offline, ohne KI, ohne Spielerei), Aufwand und Fehlerrisiko.

## Lagebild

- **Die App ist breit, die Inhalte sind schmal.** Übungsformen, Wiederholung, Schreiben, Lesen, Hören, Nachsprechen, Statistik: fast alles da. Aber es gibt 209 schwedische und 232 spanische Sätze, davon nur 32 bzw. 40 als B2 markiert. Bei „Normal“ (6 neue Sätze am Tag) reichen sie 35 bzw. 39 Tage; bei „Fortgeschritten“ kommen die B2-Sätze zuerst und sind nach gut einer Woche verbraucht. Danach bleibt nur der Nachschub von Tatoeba: ohne Themenwahl nach Fehlern, ohne Erklärung je Satz, ohne geprüfte Alternativen.
- **Die Themen sind die klassischen A2/B1-Fallen** (Inversion, „inte“, ser/estar, por/para). Was auf B2/C1 schwer bleibt, fehlt: Modalpartikeln, Verbalperiphrasen, Subjuntivo im Satzgefüge, Redewendungen, Pluralklassen.
- **Prüfqualität ist die größte Quelle für Ärger.** In einer kurzen Durchsicht (24.34–24.35) fanden sich ein grammatischer Fehler („de el“), unidiomatisches Deutsch, richtige Antworten, die als falsch galten („i gymmet“, Subjekt vorn bei Inversion), und bei rund der Hälfte der Sätze eine Erklärung, die nicht zum Satz passte. Jede falsche „Falsch“-Wertung kostet täglich Zeit und Vertrauen. 24.37 hat alle Generatoren durchgesehen (ein grammatischer Fehler, „con ti“; sechs Auswahlaufgaben mit einer zweiten vertretbaren Option; fehlende richtige Fassungen bei Uhrzeiten und beim Umbauen). 24.38 hat die Satzbank durchgesehen: Jeder der 441 Sätze hat jetzt eine Erklärung, rund 130 weitere richtige Fassungen sind dazugekommen, und zwei Regeln gelten für alle Sätze (fehlendes „har“ im schwedischen Nebensatz, betontes spanisches Subjektpronomen).
- **Seit 24.37 laufen die Browser-Tests auch in Firefox,** vorerst als Information in der CI. Firefox hat keine Spracherkennung; was darauf aufbaut, kommt bei dir nicht an.

## Fahrplan

Erst die Prüfung absichern (alles Neue baut darauf auf), dann der große Hebel: Inhalte auf B2/C1. Lesetexte danach, weil sie seltener genutzt werden als das Tagwerk.

1. **24.39 und 24.40: B2/C1-Sätze.** Je Thema 12 neue Sätze (Schwedisch rund 130, Spanisch rund 140), alle mit Niveau, Erklärung und Alternativen von Anfang an. Damit reicht „Fortgeschritten“ für Monate statt eine Woche.
2. **24.41: Neue Themen für Fortgeschrittene.** Spanisch: Verbalperiphrasen (llevar + Gerundium, acabar de, volver a, soler, ponerse a, dejar de, estar a punto de) mit Generator und Sätzen. Schwedisch: Pluralklassen mit bestimmten Pluralformen als Generator. Danach Modalpartikeln (Schwedisch) und Subjuntivo im Satzgefüge (Spanisch) als Satzthemen.
3. **24.42: Redewendungen** in beiden Sprachen als Thema in der Satzbank (statt Sprichwörtern als eigene Übung, siehe unten).
4. **24.43 und 24.44: 16 Lesetexte B2/C1** aus [THEMEN.md](THEMEN.md), Abschnitt „Nächste Runde“, je 8 Schwedisch und Spanisch.
5. **Danach:** Wochenbilanz zum Schwerpunkt, Korrekturen aus dem Schreiben ins Tagwerk, Hörunterscheidung für die spanische Betonung.

## Bewertet: lohnend

### Inhalte und Niveau

1. **B2/C1-Sätze, je Thema 12 neue (A).** Der größte Hebel: wirkt jeden Tag und behebt den Engpass oben. Aufwand hoch, Fehlerrisiko beherrschbar mit denselben Regeln wie bei der Durchsicht (Erklärung je Satz, Alternativen, idiomatisches Deutsch, Prüfung an Quellen bei Zweifel).
2. **Verbalperiphrasen, Spanisch (A−).** Auf B2 häufig und für Deutschsprachige ungewohnt (llevamos dos horas esperando, acabo de llegar, vuelve a intentarlo). Feste Bausteine, daher als Generator machbar.
3. **Pluralklassen, Schwedisch (B+).** Auch Fortgeschrittene greifen bei datorer, äpplen, möss daneben, dazu die bestimmten Pluralformen. Als Generator aus einer geprüften Liste (mindestens 36 Wörter, dreimal die Wiederholungssperre). Steht in deiner Liste „Offen“.
4. **Modalpartikeln, Schwedisch (B+).** ju, väl, nog, visst, ändå, då, nämligen: Sie machen Sprache natürlich, und Deutsch hat Gegenstücke (ja, wohl, doch, eben), die aber nicht eins zu eins passen. Nur als Sätze mit Erklärung, nicht erzeugt; die Bedeutung hängt am Zusammenhang.
5. **Subjuntivo im Satzgefüge, Spanisch (B+).** aunque mit Tatsache oder Annahme, como si, sin que, el que + Subjuntivo, Zeitenfolge (quería que vinieras). Erweitert das vorhandene Thema um die B2-Fälle.
6. **Redewendungen statt Sprichwörter (B+).** Im Alltag hört man „ta det lugnt“, „dra alla över en kam“, „no tener pelos en la lengua“ viel öfter als Sprichwörter. Als Thema in der Satzbank laufen sie durch Tagwerk und Wiederholung; eine eigene Übungsform bräuchte es nicht. Ersetzt die frühere Idee „Sprichwörter als eigene Übung“ (Idee des Nutzers, B+ → hier aufgegangen).
7. **16 Lesetexte B2/C1 (B+).** Gewünscht und wertvoll fürs Leseverstehen. Seltener genutzt als das Tagwerk und aufwendig (Fakten prüfen), daher nach den Sätzen.
8. **Adjektivsteigerung, Schwedisch (B).** bra, bättre, bäst; gammal, äldre, äldst; få, färre, färst. Kleiner Generator, begrenzter Nutzen auf B2.

### Prüfung und Rückmeldung

9. **Verwechslung beim Namen nennen (B).** Erkennt die Prüfung ein vertauschtes Paar (por/para, ser/estar, en/ett, sin/hans), steht in einer Zeile, was hier gilt und warum. Ergänzt die Erklärung je Satz um die gemachte Verwechslung; für Präteritum/Perfekt gibt es das schon.

### Hören und Sprechen

10. **Hörunterscheidung, spanische Betonung (B+), sonst Minimalpaare (B).** término, termino, terminó: Betonung entscheidet über die Bedeutung, und die Akzente zählen beim Prüfen nur als „fast richtig“. Schwedische Paare (tak, tack) bringen auf deinem Niveau weniger. Paare nur aus geprüften Listen.
11. **Unterwegs: Deutsch hören, selbst sagen, dann die Lösung (B).** Anders als die Hörrunde (erst die Zielsprache) übt das den Abruf, ohne Antippen. Ohne Wertung, also ohne Wirkung auf die Wiederholung; nutzt die Bildschirmsperre-Lösung der Hörrunde.
12. **Muttersprachler-Aufnahmen offline (B, vorher B+).** Nutzen klar, Machbarkeit offen: Tatoeba liefert die Dateien vermutlich ohne CORS-Freigabe, dann wären sie im Cache nur undurchsichtig nutzbar, und der Speicher wächst. Erst prüfen, dann entscheiden.
13. **Diktat ganzer Lesetexte (B−).** Längeres Hören mit Zusammenhang; die Hörrunde und das Diktat decken viel davon schon ab.

### Schreiben

14. **Korrekturen aus dem Schreiben ins Tagwerk (B+, vorher A−).** Aus eigenen Fehlern lernt man am meisten. Herabgestuft, weil LanguageTool für Schwedisch fast nur die Rechtschreibung prüft und es nur greift, wenn du regelmäßig schreibst.

### Planung und Rückblick

15. **Wochenbilanz zum Schwerpunkt (B).** „Wortstellung im Nebensatz: vor der Woche 38 % Fehler, in der Woche 15 %.“ Schließt den Kreis zum Schwerpunkt der Woche; die Daten liegen in den Fehlerquellen. Wenig Aufwand. Steht in deiner Liste „Offen“.
16. **Nachschub nach Worthäufigkeit (B−, vorher B+).** Hilft erst, wenn die eingebauten Sätze aufgebraucht sind und der Nachschub läuft; kuratierte B2/C1-Sätze bringen mehr. Braucht eine frei lizenzierte Häufigkeitsliste.
17. **Hartnäckige Sätze anders üben (B−).** Ab vier Fehlversuchen erst die Lücke statt des ganzen Satzes, mit der Regel davor. FSRS holt solche Sätze ohnehin oft; erst angehen, wenn sie sich in der Statistik häufen.

### Technik

18. **Firefox-Job verbindlich machen (B).** Sobald er ein paar Läufe grün ist, zählt er wie Chromium. Bis dahin zeigt er Abweichungen, ohne ein Update aufzuhalten.

## Offen: Rückmeldung von dir

- Ob „An Anki“ in Firefox Vorder- und Rückseite richtig an AnkiDroid übergibt.
- Wie der Firefox-Job nach dem Push ausgeht (GitHub → Actions → CI → Job „firefox“). Bei Rot genügt ein Bildschirmfoto der Fehlerliste.

## Nach echter Nutzung nachstellen

- **Nachsprechen, Schwellen (seit 24.26.0).** Pause ab 0,35 s, Stopp nach 1,2 s Stille, Tempo-Urteil bei 0,8 bis 1,25 des Originals. Begründete Startwerte, nur mit vorgetäuschtem Mikrofon getestet. Nachstellen, wenn die Aufnahme am Handy zu früh stoppt oder Stockungen falsch markiert.
- **Tempo bei Tatoeba-Aufnahmen.** Das genaue Urteil gibt es nur, wenn der Tatoeba-Server das Auslesen der Datei erlaubt (CORS). Ungetestet; sonst steht dort „ca.“ ohne Urteil.

## Geprüft und zurückgestellt

- **Schriftgröße einstellbar (C+, vorher B).** Bisher kein Bedarf; die Übungen sind auf feste Höhen ausgelegt, jede Stufe bräuchte eigene Layout-Tests.
- **Üben-Seite straffen (C+).** 20 Einträge in sechs Gruppen; lang, aber gegliedert. Erst angehen, wenn etwas Neues dazukommt.
- **Eigene FSRS-Parameter aus deinen Wiederholungen (C).** Bräuchte ein Protokoll jeder Wiederholung (Speicher) und Monate an Daten; die Standardparameter treffen im Benchmark bereits gut.
- **Größeres Offline-Wörterbuch (C).** Frei lizenzierte Deutsch-Schwedisch-Daten sind dünn, dict.cc ist nicht frei; Wiktionary gibt es online schon.
- **Vorlesen schneller als normal (C+).** Für Fortgeschrittene denkbar (1,1-fach), aber die Computerstimme klingt dann gepresst; echte Aufnahmen wären der bessere Weg.
- **Code in kleinere Dateien teilen (C).** Kein Nutzen für dich; erst, wenn eine Datei beim Ändern stört.
- **Schriftgrößen zusammenlegen (C).** Elf Größen zwischen 12 und 17 px; Zusammenlegen verschiebt überall halbe Pixel, ohne sichtbaren Gewinn. Erst bei einer größeren Gestaltungsrunde.
- **Konjugation beim Nachschlagen (C+).** Tabellen gibt es intern, auf Fortgeschrittenen-Niveau selten gebraucht.
- **Erinnerung über eine Kalenderdatei (C+).** Ohne Server keine verlässlichen Benachrichtigungen; ein täglicher Kalendertermin mit Link zur App ginge, ersetzt aber kaum einen selbst gestellten Wecker.
- **Kurze Dialoge zum Mitspielen (C+).** Wertvoll, aber jeder Dialog muss von Hand geschrieben und geprüft werden; Lesetexte bringen pro Aufwand mehr.
- **Wörter zum Einbauen passend zur Schreibaufgabe (C).** Die App weiß nicht, welches Wort zu welchem Thema passt; das wäre Raten. Stattdessen gibt es seit 24.29.0 fünf Grundformen und „Andere Wörter“.
- **Zurück auf „Heute“ in Firefox.** Die Geste verlässt dort die App, Firefox zeigt dann je nach Version eine leere Seite. Eine Web-App kann sich nicht selbst schließen, und die Geste auf „Heute“ abzufangen hieße, Nutzer in der App festzuhalten.

- **„Meine ist auch richtig“ ausbauen (C).** Du meldest Fälle direkt; das bleibt der schnellere Weg zu einer Korrektur, die für alle gilt. Der Knopf bleibt für unterwegs, wie er ist.

## Bewusst nicht

- **Freies Sprechen mit Spracherkennung (D).** Firefox hat keine Spracherkennung; bei dir käme es nicht an. Nachsprechen wertet Tempo und Pausen ohne Erkennung aus.
- **Abgleich zwischen Geräten (D).** Bräuchte Server und Konto. Das Backup leistet das von Hand.
- **Prüfungsvorbereitung (Swedex, DELE) (D).** Andere Ziele, andere Inhalte.
- Ranglisten, Herzen, Belohnungen, Konfetti, Wortschatz-Schätzungen als Spielerei; KI, Konto, Tracker. Sie widersprechen den Grundsätzen der App oder bringen beim Lernen wenig.
