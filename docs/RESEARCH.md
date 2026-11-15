# Forschungsgrundlagen und Festlegungen

Tagwerk stützt sich, wo möglich, auf Studien. Wo es keine belastbaren Ergebnisse gibt, steht das hier ausdrücklich als eigene Festlegung.

## Wiederholung: FSRS-6

- Verfahren: FSRS-6 mit Standardparametern, Ziel 90 % Behalten, Intervalle höchstens 3650 Tage, Zufallsstreuung nach den offiziellen Regeln.
- Benchmark des Projekts open-spaced-repetition über 9.999 Anki-Sammlungen mit rund 350 Millionen Wiederholungen: FSRS-6 (optimiert) Log-Loss 0,344, besser als SM-2 in 99,6 % der Sammlungen. Zum Vergleich: Leitner 0,397, SM-2 0,354. Einschränkung: Die Metrik misst Vorhersagegüte, nicht Lernerfolg; SuperMemo bestreitet ihre Aussagekraft.
- Umsetzung geprüft gegen die Referenz py-fsrs 6.3.3: 400 Wiederholungen, Abweichung von Stabilität und Schwierigkeit unter 10⁻⁹, alle Intervalle gleich (`tests/unit/fsrs.test.js`).

## Interleaving (Mischen verwechselbarer Themen)

Brunmair & Richter (2019), *Psychological Bulletin*: Metaanalyse über 59 Studien und 238 Effektstärken, Hedges' g = 0,42, stärker bei ähnlichen Kategorien. Einschränkung der Autoren: bei Wörtern und Fachtexten schwächer. Tagwerk mischt darum gezielt verwechselbare Paare (Präteritum/Perfekt, ser/estar, por/para).

## Gewohnheit und Serie

Lally et al. (2010), 96 Teilnehmende über 12 Wochen: Median 66 Tage bis zur Automatisierung, Spanne 18 bis 254 Tage; ein einzelner verpasster Tag beeinflusste die Gewohnheitsbildung kaum. Daher die Serienregel mit einem freien Tag pro Woche. Ob verlorene Serien die Motivation senken, ist nicht belegt.

## Schreiben: Komplexität statt Note

- Die Forschung zu Komplexität, Genauigkeit und Flüssigkeit (complexity, accuracy, fluency; etwa Housen & Kuiken 2009, *Applied Linguistics*) beschreibt Lernertexte über messbare Merkmale wie Satzlänge, Nebensätze und Formenvielfalt. Tagwerk zeigt solche Merkmale einzeln, statt sie zu einer Note zu verrechnen.
- Swains Output-Hypothese (1985): Wer gezielt Formen produzieren muss, die er noch nicht sicher beherrscht („pushed output“), bemerkt eigene Lücken. Darauf beruhen die freiwilligen Extra-Aufgaben.
- LIX (Björnsson 1968) ist ein schwedischer Lesbarkeitsindex: Wörter pro Satz plus Prozent langer Wörter. Für Spanisch nur grober Vergleichswert.
- Verworfen: automatische Niveaustufen (A2, B1 …). Aus kurzen Texten ohne Sprachmodell nicht verlässlich.
- Die Offline-Hinweise prüfen nur die Fallen der App und sind auf Treffsicherheit ausgelegt: im Test 0 Fehlalarme bei 31 korrekten Sätzen, 15 von 15 typischen Fehlern erkannt. Der Testsatz ist selbst erstellt; echte Texte enthalten Fehler, die keine Regel erfasst.

## Weitere Grundlagen

- Korrektives Feedback hilft, Lücken zu bemerken; darum zeigt jede falsche Antwort Lösung, Markierung und Regel.
- Lesen gelingt flüssig ab etwa 98 % bekannter Wörter; Tatoeba-Sätze werden mit dem Fortschritt länger.
- Shadowing verbessert Verständlichkeit und Flüssigkeit; Effekte auf einzelne Laute sind uneinheitlich.
- Eine Duolingo-eigene Studie (258 Teilnehmende) fand bei 66 % der Spanischlernenden A2 beim Sprechen; als interessengeleitete Studie nur eingeschränkt aussagekräftig.

## Eigene Festlegungen ohne Studienbeleg

„Gefestigt“ ab 21 Tagen Intervall (wie Ankis „mature“), „verankert“ ab 365 Tagen, die Meilenstein-Schwellen, die Stufen der Satzlänge beim Nachschub, die Wiederholungssperre von 12 Aufgaben und die Auswahlregeln des Fundstücks.
