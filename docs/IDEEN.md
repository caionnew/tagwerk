# Ideen für Tagwerk

Lohnende, noch nicht umgesetzte Ideen, mit Bewertung (A bis D) und den Gründen. Was umgesetzt ist, kommt hier heraus und steht im [Änderungsverlauf](../CHANGELOG.md). Themen für Lesetexte stehen getrennt in [THEMEN.md](THEMEN.md).

Stand: 17. November 2026 (nach 24.34.1)

## Als Nächstes

**16 Lesetexte B2/C1** aus [THEMEN.md](THEMEN.md), Abschnitt „Nächste Runde“. Fakten vorher an Quellen prüfen, objektiv statt krampfhaft ausgewogen, je drei Fragen und Sätze fürs Tagwerk.

## Lohnend

1. **Korrekturen aus dem Schreiben ins Tagwerk (A−).** Schlägt LanguageTool eine Korrektur vor, nimmt ein Tippen den verbesserten Satz als eigenen Satz ins Tagwerk auf. Aus eigenen Fehlern lernt man am meisten; Prüfung und eigene Sätze gibt es schon. Grenze: Für Schwedisch prüft LanguageTool vor allem die Rechtschreibung. Den Satz vor dem Übernehmen zeigen und bearbeitbar lassen; LanguageTool kann danebenliegen.

2. **Hörunterscheidung, Minimalpaare (B+, Spanisch A).** „Welches Wort hörst du?“ Spanisch: Betonung (término, termino, terminó; público, publico, publicó), r und rr (pero, perro; caro, carro). Schwedisch: kurzer und langer Vokal (tak, tack; glas, glass), sj- und tj-Laut. Die Computerstimme spricht das zuverlässig. Den schwedischen Wortton (anden, anden; tomten, tomten) weglassen, solange die Stimme ihn nicht sicher trifft. Paare nur aus geprüften Listen, nicht erzeugt.

3. **Muttersprachler-Aufnahmen offline (B+).** Einmal gehörte Tatoeba-Aufnahmen im Cache des Service Workers ablegen (eigener Speicher, nicht der Lernstand in localStorage), mit Obergrenze. Dann haben Hörrunde, Nachsprechen und Diktat auch ohne Netz echte Stimmen statt der Computerstimme. Prüfen: ob Tatoeba das Abspielen aus dem Cache erlaubt (undurchsichtige Antworten), Speicherbedarf je Aufnahme.

4. **Nachschub nach Worthäufigkeit (B+).** Beim Nachschub von Tatoeba Sätze bevorzugen, die häufige Wörter enthalten, die noch in keinem eigenen Satz vorkommen. Braucht je Sprache eine frei lizenzierte Häufigkeitsliste (etwa 5 000 Grundformen, rund 50 KB). Unsichtbar, macht den Nachschub aber nützlicher.

5. **Sprichwörter als eigene Übung (B+).** Bedeutung erkennen (Auswahl), Lücke ergänzen, in einem eigenen Satz verwenden, dazu kurz Herkunft und Gebrauch. Eine Liste je Sprache mit mindestens 36 geprüften Einträgen (dreimal die Wiederholungssperre). Idee des Nutzers.

6. **Diktat ganzer Lesetexte (B).** Einen bekannten Text Satz für Satz mitschreiben: längeres Hören mit Zusammenhang statt Einzelsätzen. Nutzt Lesetexte und Diktat, die es schon gibt.

7. **Schriftgröße einstellbar (B).** Größere Schrift für Lesetexte und Übungssätze, in den Einstellungen. Wenig Aufwand. Die Übungen sind auf feste Höhen ausgelegt (Antwortzone, Leiste unten); die Layout-Tests müssen dann mit der größeren Stufe laufen.

## Nach echter Nutzung nachstellen

- **Nachsprechen, Schwellen (seit 24.26.0).** Pause ab 0,35 s, Stopp nach 1,2 s Stille, Tempo-Urteil bei 0,8 bis 1,25 des Originals. Begründete Startwerte, nur mit vorgetäuschtem Mikrofon getestet. Nachstellen, wenn die Aufnahme am Handy zu früh stoppt oder Stockungen falsch markiert.
- **Tempo bei Tatoeba-Aufnahmen.** Das genaue Urteil gibt es nur, wenn der Tatoeba-Server das Auslesen der Datei erlaubt (CORS). Ungetestet; sonst steht dort „ca.“ ohne Urteil.

## Geprüft und zurückgestellt

- **Schriftgrößen zusammenlegen (C).** Elf Größen zwischen 12 und 17 px; Zusammenlegen verschiebt überall halbe Pixel, ohne sichtbaren Gewinn. Erst bei einer größeren Gestaltungsrunde.
- **Konjugation beim Nachschlagen (C+).** Tabellen gibt es intern, auf Fortgeschrittenen-Niveau selten gebraucht.
- **Erinnerung über eine Kalenderdatei (C+).** Ohne Server keine verlässlichen Benachrichtigungen; ein täglicher Kalendertermin mit Link zur App ginge, ersetzt aber kaum einen selbst gestellten Wecker.
- **Kurze Dialoge zum Mitspielen (C+).** Wertvoll, aber jeder Dialog muss von Hand geschrieben und geprüft werden; Lesetexte bringen pro Aufwand mehr.
- **Wörter zum Einbauen passend zur Schreibaufgabe (C).** Die App weiß nicht, welches Wort zu welchem Thema passt; das wäre Raten. Stattdessen gibt es seit 24.29.0 fünf Grundformen und „Andere Wörter“.
- **Zurück auf „Heute“ in Firefox.** Die Geste verlässt dort die App, Firefox zeigt dann je nach Version eine leere Seite. Eine Web-App kann sich nicht selbst schließen, und die Geste auf „Heute“ abzufangen hieße, Nutzer in der App festzuhalten.

## Bewusst nicht

Ranglisten, Herzen, Belohnungen, Konfetti, Wortschatz-Schätzungen als Spielerei; KI, Konto, Tracker. Sie widersprechen den Grundsätzen der App oder bringen beim Lernen wenig.
