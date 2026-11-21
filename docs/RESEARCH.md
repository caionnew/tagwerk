# Forschungsgrundlagen und Festlegungen

Tagwerk stützt sich, wo möglich, auf Studien. Wo es keine belastbaren Ergebnisse gibt, steht das hier ausdrücklich als eigene Festlegung.

## Wiederholung: FSRS-6

- Verfahren: FSRS-6 mit Standardparametern, Ziel 90 % Behalten, Intervalle höchstens 3650 Tage, Zufallsstreuung nach den offiziellen Regeln.
- Benchmark des Projekts open-spaced-repetition über 9.999 Anki-Sammlungen mit rund 350 Millionen Wiederholungen: FSRS-6 (optimiert) Log-Loss 0,344, besser als SM-2 in 99,6 % der Sammlungen. Zum Vergleich: Leitner 0,397, SM-2 0,354. Einschränkung: Die Metrik misst Vorhersagegüte, nicht Lernerfolg; SuperMemo bestreitet ihre Aussagekraft.
- Umsetzung geprüft gegen die Referenz py-fsrs 6.3.3: 400 Wiederholungen, Abweichung von Stabilität und Schwierigkeit unter 10⁻⁹, alle Intervalle gleich (`tests/unit/fsrs.test.js`).

## Interleaving (Mischen verwechselbarer Themen)

Brunmair & Richter (2019), *Psychological Bulletin*: Metaanalyse über 59 Studien und 238 Effektstärken, Hedges' g = 0,42, stärker bei ähnlichen Kategorien. Einschränkung der Autoren: bei Wörtern und Fachtexten schwächer. Tagwerk mischt darum gezielt verwechselbare Paare (Präteritum/Perfekt, ser/estar, por/para).

Im Tagwerk selbst (eigene Festlegung, 24.54.0): kein Thema mit mehr als einem Viertel der Wiederholungen, und das Thema der letzten Aufgabe kommt als Nächstes nur mit halbem Gewicht, wie die Fehlerart bei „Fehler finden“. Ein Verbot wäre selbst eine Regel, die man mit der Zeit durchschaut („gerade war X, also sicher nicht X“). Simuliert über 20.000 Tagwerke: reiner Zufall 2,3 direkte Wiederholungen je Tagwerk und in 17 % der Tagwerke ein Dreierblock; mit halbem Gewicht 1,3 und 6 %; nach Thema X folgt X in 9 % statt 15 % der Fälle, also selten, aber nicht ausgeschlossen. Vorher kamen bei vielen fälligen Sätzen eines Themas oft vier, fünf davon hintereinander, und die Lösung war absehbar, bevor man den Satz gelesen hatte.

## Fehler finden: Prüfen statt Suchen

- Fehler zu erkennen (Grammatikalitätsurteil) übt nur dann das Urteil, wenn der Satz auch richtig sein kann. Steckt sicher ein Fehler im Satz und gibt es nur einen Kandidaten, wird daraus Suchen. Darum ist rund jeder dritte bis zweite Satz richtig.
- Ob ein Satz richtig ist, entscheidet jedes Mal unabhängig der Zufall. Jede Abhängigkeit von den vorigen Sätzen (etwa „höchstens drei richtige in Folge“) wird mit der Zeit zum Hinweis und ersetzt das Urteil.
- Die Fehlerart wird nach Wahrscheinlichkeit gewählt: mehr Übung, wo Fehler auftreten; gemischt (siehe Interleaving), aber ohne Verbot, damit keine durchschaubare Regel entsteht.
- Wo die Verbesserung nicht aus dem Finden folgt, wird die richtige Form eingetippt (Produktion statt Wiedererkennen, vgl. Swains Output-Hypothese unten).

## Neue Sätze: Raten nur mit Anhaltspunkt

Ein neuer Satz kommt gleich als Lücke, nicht erst zum Lesen. Raten vor der Lösung kann das Behalten verbessern, aber vor allem, wenn die Vermutung in die Nähe der Lösung führt: Grimaldi & Karpicke (2012, *Memory & Cognition*) fanden den Vorteil beim späteren Abruf für verwandte Wortpaare, nicht für unverwandte; Potts & Shanks (2014, *Journal of Experimental Psychology: General*) fanden ihn auch bei unbekannten Wörtern, gemessen allerdings mit Auswahlaufgaben; eine Nachfolgestudie mit seltenen Wörtern fand ihn nur beim Wiedererkennen, nicht beim Abruf zum Stichwort. Bei Grammatik-Sätzen führen Regel und Deutsch zur Lösung, das Raten ist begründet. Bei einer festen Wendung mit fremdem Bild (Ende der Welt → hela världen) führt nichts dorthin. Darum bekommt sie beim ersten Kontakt ihr wörtliches Bild als Hinweis (eigene Festlegung, 24.55.0): Man baut die Wendung selbst aus dem Bild, statt sie zu raten, und ab dem zweiten Kontakt muss das Bild aus dem Gedächtnis kommen. Verworfen: jeden neuen Satz erst zeigen (verdoppelt die Zeit für Sätze, die sich herleiten lassen), Auswahl beim ersten Kontakt (wieder Raten, nur zwischen weniger Möglichkeiten).

## Gewohnheit und Serie

Lally et al. (2010), 96 Teilnehmende über 12 Wochen: Median 66 Tage bis zur Automatisierung, Spanne 18 bis 254 Tage; ein einzelner verpasster Tag beeinflusste die Gewohnheitsbildung kaum. Daher die Serienregel mit einem Pausetag pro Woche. Silverman und Barasch (2023) fanden, dass nach einer gerissenen Serie weniger weitergemacht wird; ein Grund mehr für den Pausetag.

## Etappen (seit 24.63)

- Rückmeldung, die über Können informiert, stärkt die Motivation; erwartete Belohnungen schwächen sie (Deci, Koestner und Ryan 1999, Metaanalyse). Darum zeigt die Etappe, was sie bedeutet (die gefestigten Sätze selbst, die Fehlerquote eines Themas), und kommt ohne Punkte oder Abzeichen aus.
- Das Ende einer Erfahrung prägt die Erinnerung an sie (Kahneman et al. 1993, peak-end). Darum steht die Etappe am Rundenende, direkt unter dem Titel.
- Sichtbarer Fortschritt trägt den Tag (Amabile und Kramer 2011), Nähe zum Ziel spornt an (Kivetz, Urminsky und Zheng 2006): darum die nächste Etappe mit Abstand.
- Neuanfänge wie ein Monatsbeginn erhöhen die Bereitschaft, ein Ziel anzugehen (Dai, Milkman und Riis 2014): darum die Monatsbilanz beim ersten Tagwerk im Monat.

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

„Gefestigt“ ab 21 Tagen Intervall (wie Ankis „mature“), „verankert“ ab 365 Tagen, die Meilenstein-Schwellen, die Schwellen der Themen-Etappen (erste 40 Aufgaben gegen die letzten 40 bis 60; „halbiert“ mit mindestens 10 Prozentpunkten Abstand und z ≥ 2, „sitzt“ ab 20 % am Anfang und Wilson-Obergrenze ≤ 15 %, also höchstens 3 von 60 falsch), die Stufen der Satzlänge beim Nachschub, die Wiederholungssperre von 12 Aufgaben, die Auswahlregeln des Fundstücks und bei „Fehler finden“ der Anteil richtiger Sätze (40 %) sowie die Gewichte der Fehlerarten (0,5 bis 2 nach eigener Fehlerquote, ½ für die Art der letzten Aufgabe).
