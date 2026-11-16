# Änderungsverlauf

Versionen entsprechen der Cache-Version des Service Workers. Ab 24.0.0 setzt der Build sie automatisch.

## 24.20.2
- **Kachel „Tagwerke“ lesbar:** Zahl und Beschriftung wie bei den anderen Kacheln, darunter die Aufteilung nach Sprache (■ 2  ■ 1) in einer Zeile. Vorher brach „■ 2 ■ / 1 Tagwerke“ mitten zwischen Farbpunkt und Zahl um.

## 24.20.1
- **Genaue Erklärung statt allgemeiner:** Bei erzeugten Aufgaben mit eigener Erklärung verdrängte eine allgemeine Diagnose den passenden Text. Bei „Ich warte seit zwanzig Minuten“ stand deshalb nur „Ohne Zeitpunkt … Perfekt mit har“ statt „Dauert bis heute an: Perfekt mit „i“ + Zeitraum (jag har väntat … i tjugo minuter). Im Deutschen steht hier Präsens mit „seit“.“ Jetzt hat die eigene Erklärung Vorrang.

## 24.20.0
- **Woche im Kopf von „Heute“:** Die großen Wochenpunkte mitten in der Seite sind ein kompakter Streifen rechts neben dem Gruß: die letzten sieben Tage bis heute (auch montags aussagekräftig), darunter nur „5 in Folge“ bzw. „heute nötig“, wenn gestern der freie Tag war. Antippen führt zum Kalender.
- **Gleiche Kodierung wie die Übungstage:** gefüllt = Tagwerk, Farbe = Sprache (Schwedisch blau, Spanisch gelb, beide geteilt), Rand = nur geübt, gestrichelt = freier Tag. Die erklärenden Sätze und die Legende darunter entfallen.
- **Andere Sprache in einer Zeile:** Farbpunkt, Name, Kurzstand („1 fällig · gestern“ bzw. „Tagwerk heute erledigt“) und „Tagwerk starten“ (nach erledigtem Tag „Zusätzlich starten“); die Begründung der Sprachwahl steht in den Einstellungen.
- **Überblick in Zahlen statt Satz:** vier Kacheln (Übungstage, Tagwerke je Sprache mit Farbpunkt, Aufgaben, Stunden). Die alte Jahrestabelle entfällt, weil „Jahr für Jahr“ dasselbe ausführlicher zeigt. Kalendertext gekürzt.

## 24.19.0
- **Tagwerk je Sprache:** Die App merkt sich jetzt, in welcher Sprache ein Tagwerk gemacht wurde. Die Serie zählt weiter je Tag, egal welche Sprache. Ältere Tage werden der Sprache mit den meisten Aufgaben zugeordnet.
- **„Heute“ zeigt die Einheit klar:** Die Karte heißt „Heute · Schwedisch-Tagwerk“ mit „Schwedisch-Tagwerk starten“. „Tagwerk erledigt“ steht nur noch bei der Sprache, deren Tagwerk geschafft ist. Ist der Tag mit der anderen Sprache schon erledigt, heißt die Karte „Zusätzlich · Schwedisch-Tagwerk“ und sagt, dass es freiwillig ist. Vorher stand auch bei Schwedisch „erledigt“, und ein schwedisches Tagwerk ließ sich gar nicht mehr starten.
- **Die andere Sprache:** Der Kasten startet ihr Tagwerk direkt („Spanisch-Tagwerk“, nach erledigtem Tag „… zusätzlich“; ein pausiertes geht dort weiter) oder meldet „Spanisch-Tagwerk heute erledigt“. „Zuletzt gestern“ obwohl heute geübt ist behoben, jetzt „heute geübt“.
- **Statistik:** Überblick nennt die Tagwerke je Sprache, „Jahr für Jahr“ ebenso, der Kalender färbt erledigte Tage nach der Sprache des Tagwerks (beide geteilt), und das Tagesdetail sagt, welches Tagwerk erledigt wurde.

## 24.18.3
- **Lücke nach dem Prüfen ohne Doppelung:** Statt Eingabefeld plus Lösung daneben („¿ podrias Podrías ayudarme?“) steht die Lücke jetzt als Text im Satz: richtig grün unterstrichen; fast richtig zeigt die richtige Form gelb unterstrichen, weil sie als richtig zählt (¿Podrías ayudarme?); falsch zeigt deine Antwort durchgestrichen und die Lösung grün daneben. Gilt für Lücken aus der Satzbank und alle erzeugten Lücken.
- Test „Sprache des Tages“ wartet vor dem Neuladen auf das Speichern (die App speichert beim Verlassen ohnehin sofort).

## 24.18.2
- **Wochenpunkt unten in der Mitte behoben:** Der Punkt für heute, der sich nach dem Tagwerk füllt, trug denselben Klassennamen wie das Wörterbuch-Fenster und rutschte deshalb als schwebende Pille über die Tab-Leiste; in der Wochenreihe fehlte er dafür.
- **Adjektiv anpassen ohne geschenkte Aufgaben:** Bei männlichen Nomen auf -o in der Einzahl stand die Lösung schon als Hinweis da (el cuchillo + bonito → bonito). Solche Aufgaben kommen nicht mehr; männliche Nomen auf -a bleiben (el problema bonito), weil genau dort die Falle liegt.
- **Grundform bei „Fortgeschritten“ erst auf Tipp:** Statt „Grundform: deber“ steht „Grundform zeigen“; ein Tipp blendet sie ein, das Getippte bleibt stehen. Auswahl-Hinweise wie „ser oder estar“ oder die drei Optionen bleiben immer sichtbar, weil die Aufgabe sonst mehrdeutig wäre.

## 24.18.1
- **Umbauen „Ayer → Hoy“ eindeutig:** „Beginne mit Hoy …“ ließ auch das Präsens zu (Hoy vemos una película ist ein korrekter Satz). Jetzt steht dabei: „Dieselbe Handlung, nur heute schon passiert (nicht: passiert gerade).“
- **Lösung, Erklärung und Vorlesen passen zusammen:** Bei erzeugten Aufgaben zeigt eine falsche Antwort jetzt die Standardlösung (hier Perfecto: Hoy hemos visto …), so wie Erklärung und Vorlesen sie nennen. Vorher stand die lateinamerikanische Variante (Hoy vimos …) da, während die Stimme die spanische las. Bei „fast richtig“ und bei Sätzen aus der Satzbank bleibt es bei der Fassung, die deiner Antwort am nächsten ist; vorgelesen wird immer, was angezeigt wird.

## 24.18.0
- **Ein Tagwerk am Tag, Sprache nach Bedarf:** Beim ersten Öffnen des Tages wählt die App die Sprache, die es nötiger hat: fällige Wiederholungen im Verhältnis zur Tagwerk-Länge plus Tage seit dem letzten Üben. Die Wahl bleibt für den Tag; ein Wechsel von Hand gilt bis morgen. Wer nur eine Sprache lernt, merkt davon nichts.
- **Die andere Sprache bleibt sichtbar:** Auf „Heute“ steht unter dem Tagwerk ihr Stand („Spanisch: 14 Wiederholungen fällig, zuletzt vor 2 Tagen“), warum heute die andere dran ist, und „Stattdessen üben“ bzw. nach dem Tagwerk „Auch üben“.
- **Einstellung „Sprache beim Start“:** „Nach Bedarf“ (Standard) oder „Zuletzt gewählte“ wie bisher.

## 24.17.0
- **Begleiter im Schwedischen:** Die Übung „Adjektivendungen & bestimmte Form“ wechselt jetzt ab mit min/mitt/mina, din/ditt/dina, vår/vårt/våra (nach en/ett und Plural), der unbestimmten Form nach Possessivpronomen (mitt hus, nicht mitt huset) und den här/det här/de här mit bestimmter Form (det här huset). Nutzt die 80 Wörter der en/ett-Übung, dadurch deutlich mehr Abwechslung.
- **Neue Übung im Spanischen „Begleiter & Adjektive anpassen“:** nuestro/nuestra/nuestros/nuestras, este/esta/estos/estas, ese/esa, mi/mis, tu/tus und Adjektive (nuevo, viejo, pequeño, bonito, perfecto, típico) nach Geschlecht und Zahl, mit den Ausnahmen aus der el/la-Übung (el problema, la mano, la foto). Erklärung nennt Geschlecht, Zahl und die Ausnahme.
- **Wörterbuch Spanisch:** Mehrzahl und weibliche Formen werden auf die Grundform zurückgeführt (casas → casa, ciudades → ciudad, pequeñas → pequeño). Hilft auch beim Lesen und bei Wikipedia-Texten.

## 24.16.0
- **Verben mit Präposition erweitert:** Schwedisch von 15 auf 41 Fälle (u. a. bry sig om, ta hand om, längta efter, lita på, påminna om, beroende av, nöjd med, se fram emot, bestå av), Spanisch von 16 auf 42 (u. a. depender de, parecerse a, encargarse de, contar con, atreverse a, tratar de, convertirse en, volver a, acabar de, oler a). Nur eine Option ist jeweils richtig; wo zwei Präpositionen gehen (orolig för/över, quejarse de/por), steht die zweite nicht zur Wahl und die Erklärung nennt sie. Alle Wörter im Wörterbuch.
- Test: mindestens dreimal so viele Fälle wie die Wiederholungssperre sich merkt.

## 24.15.1
- **Zwei wackelige Tests behoben, die die Veröffentlichung von 24.15.0 stoppten:** Die Wiederholungssperre der Übungen gab bei kleinen Listen (15 Fälle, 12 gemerkt) nach 30 Zufallsversuchen auf; jetzt 200, die Präpositions-Übung wiederholt sich damit innerhalb einer Runde praktisch nie. Und ist der Schwerpunkt der Woche bei „Fortgeschritten“ ein schwaches Thema, kommen dort die einfachen Sätze zuerst, wie es für schwache Themen ohnehin gilt; vorher hing das vom Zufall ab.
- Geprüft mit 40 Durchläufen aller Einheitstests, auch in UTC wie auf GitHub.

## 24.15.0
- **Sätze aus Anki übernehmen:** Unter Einstellungen › Nachschub eine Datei aus AnkiDroid einlesen (Stapel exportieren als „Notizen als Klartext“). Die App liest Kopfzeilen, Tabulator oder Semikolon, Anführungszeichen, entfernt HTML, Tonverweise und Lückentext-Klammern, erkennt Sprache und Übersetzungsspalte (auch Englisch), zeigt eine Vorschau und übernimmt bis zu 1.500 Sätze je Datei in Stapelreihenfolge; Vorhandenes wird übersprungen, erneutes Einlesen holt die nächsten.
- **An Anki senden:** Im Wörterbuch-Fenster „An Anki“: Wort als Vorderseite, Grundform und Bedeutung plus der Satz aus dem Text als Rückseite, über das Teilen-Menü an AnkiDroid.
- **Neue Übung „Verben mit Präposition“:** tänka på, vänta på, rädd för, vänja sig vid; soñar con, pensar en, acordarse de, dejar de, tener ganas de. Lücke mit drei Optionen und Erklärung.
- **Lücken aus Lesetexten:** Nach den Fragen „Lücken aus dem Text“: acht Sätze des gerade gelesenen Textes mit je einem fehlenden, möglichst gebeugten Wort und der Grundform als Hilfe. Läuft auch im Wechsel der Grammatik-Übungen mit Sätzen aus bereits gelesenen Texten.

## 24.14.0
- **Nachschub für Fortgeschrittene:** Tatoeba-Nachschub zählt bei „Fortgeschritten“ nur Sätze, die auch drankommen (ab Mittelstufe oder schwaches Thema), und holt dann längere Sätze (6–14, später 7–18 Wörter). Vorher hätte die App nach etwa zwei Wochen auf Grundlagen-Sätze zurückgegriffen. Bei „Fortgeschritten“ ohne Nachschub weist die Einstellung darauf hin.
- **Neue Übung „Konnektoren & feste Verbindungen“ (B1–B2):** därför/dessutom/däremot, trots att, utan; sin embargo, por lo tanto, en cambio, para que, sino, en cuanto; dazu Kollokationen wie *fatta ett beslut*, *ta hänsyn till*, *tomar una decisión*, *hacer caso*, *dar miedo*. Lücke mit drei Optionen, Erklärung nach der Antwort, alle Wörter im Wörterbuch. Läuft im Wechsel mit den anderen Grammatik-Übungen und unter „Grammatik kurz erklärt“.
- **Schwerpunkt der Woche:** je Sprache ein Thema, montags automatisch gewählt (das mit den meisten Fehlern der letzten 30 Tage, sonst das mit den meisten offenen Sätzen ab Mittelstufe). Ein Drittel der neuen Sätze kommt daraus; auf „Heute“ sichtbar und mit „Anderes Thema“ wechselbar.

## 24.13.0
- **Etappen gehen nie aus:** Nach dem Ende der Listen geht es in gleichmäßigen Schritten weiter (Aufgaben je 25.000, Stunden je 250, gefestigte Sätze und Wörter je 500). Serien zählen nach zwei Jahren in ganzen Jahren weiter („3 Jahre in Folge“, dazwischen „1.000 Tage in Folge“). Neu: Übungstage insgesamt (10, 50, 100, 250, 500, 1.000, dann je 500), verzeihender als Serien, und Jahrestage („2 Jahre mit Tagwerk“).
- **Gleisplan mit Jahrestrennern:** Beim ganzen Weg stehen die Jahre zwischen den Etappen.
- **Jahr für Jahr:** Karte je Jahr mit Übungstagen (davon mit Tagwerk), Lernzeit, längster Serie, stärkstem Monat und je Sprache neue und gefestigte Sätze, Aufgaben und Zeit. So bleiben auch frühe Jahre sichtbar, wenn der Kalender sie nicht mehr zeigt.
- **Verlauf nach über 400 Tagen:** Umschalter „Letztes Jahr“ und „Seit Beginn“; die Zählung der geübten Sätze beginnt dabei richtig beim Stand vor dem Zeitraum.
- **Speicher für Jahre:** Tagesstände älter als 120 Tage werden auf Sonntage und Monatsenden zusammengefasst; nach fünf Jahren täglicher Nutzung bleiben die Daten deutlich unter 1,5 MB (Browser erlauben meist etwa 5 MB). Unter Einstellungen steht, wie viel gespeichert ist, mit Hinweis ab 3,5 MB.
- Test simuliert fünf Jahre Nutzung: Etappen, Jahreskarten, Speichergröße.

## 24.12.0
- **Übungstage neu kodiert:** Form zeigt den Einsatz (gefüllt: Tagwerk, Rand: nur etwas geübt, gestrichelt: freier Tag), Farbe die Sprache (Schwedisch blau, Spanisch gelb, beide geteilt). Die Stufe „Tagwerk und mehr“ entfällt: Sie hing an 25 Aufgaben und damit an der Länge des Tagwerks; die Menge zeigt das Minutendiagramm genauer.
- **Dein Weg als Gleisplan:** links Schwedisch, in der Mitte Gemeinsames (Serien, Aufgaben, Stunden), rechts Spanisch, alles auf derselben Zeitachse. Jede Spur beginnt am ersten Übungstag ihrer Sprache; die nächsten Ziele stehen oben als offene Punkte in ihrer Spur. So sieht man, wo die Sprachen gleich laufen und wo eine vorne liegt.

## 24.11.1
- **Veröffentlichung robust bei Wiederholung:** „Re-run jobs“ lud ein zweites Artefakt „github-pages“ in denselben Lauf, deploy-pages brach mit „Multiple artifacts named github-pages“ ab. Das Artefakt heißt jetzt je Versuch anders (`github-pages-<Versuch>`).
- **Aktionen auf Node 24:** checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5, upload-artifact v7; die Warnung zu Node 20 entfällt. Läufe fest auf Ubuntu 24.04 statt „ubuntu-latest“, das ab Oktober 2026 auf Ubuntu 26 wechselt.

## 24.11.0
- **Abstand Aufgabe–Antwort begrenzt:** Auf großen Handys lagen bis zu 560 px zwischen deutschem Satz und Lückensatz. Die Antwortzone sitzt jetzt höchstens 30 % der Bildhöhe unter der Aufgabe und immer in der unteren Hälfte; auf kleinen Handys weiter direkt über der Leiste.
- **Hörrunde wie Lesen und Übungen:** Zurück, Wiedergabe und Vor stehen unten in der Leiste statt mitten im Bild.
- **Tagesplan ruhiger:** Die Beschreibungen („gezielt zu typischen Fehlern“) stehen unter der Zeile statt rechtsbündig in schmalen Spalten umbrochen.
- **Einheitliche Ecken und Innenabstände:** Flächen 18 px Radius, Bedienelemente 14 px; Rückmeldung, Hinweise und Hörrunden-Karte angeglichen.
- **Bewegung, wo sie etwas erklärt:** Wortkästchen gleiten an ihren Platz in der Antwort und zurück; das gerade geschaffte Stück im Fortschrittsbalken füllt sich; nach dem Tagwerk füllt sich auf „Heute“ der Punkt für heute. Alles kurz, alles als Antwort auf eine Handlung, und bei „Bewegung reduzieren“ aus.

## 24.10.1
- **Rundenende wie die Übungen:** „Fertig“ und „Noch eine Runde“ bzw. „Weiter üben“ stehen unten in der Leiste (Nebenweg links, Hauptweg rechts), die Tab-Leiste ist auf diesem Bildschirm ausgeblendet. Vorher hingen die Knöpfe mitten im Bild über einer leeren Fläche.
- **Ehrlicher Text:** „Sitzt: 3 Sätze …“ versprach nach einem einzigen Treffer zu viel. Jetzt „Nächste Wiederholung: 3 Sätze kommen übermorgen wieder“, Spannen als „in 2 bis 3 Wochen“.
- **Keine doppelte Zahl:** „richtig in Folge“ erscheint nur noch, wenn die Runde nicht fehlerfrei war; sonst sagt „Alle 3 auf Anhieb richtig“ schon dasselbe.

## 24.10.0
- **Aufgabe oben, Antwort unten, bei allen Übungen gleich:** Die Antwortzone (Wortkästchen, Wörter zum Antippen, Auswahl, Eingabefeld, Lückensatz, Abspielen beim Hördiktat) sitzt direkt über der Knopfleiste, die Rückmeldung erscheint zwischen Antwort und „Weiter“. Antippen, Prüfen und Weiter liegen damit im Daumenbereich, und mit Tastatur sitzt das Feld direkt über ihr. Vorher lag bei „Fehler finden“ und Genus das Antippen oben und „Weiter“ ganz unten.
- **Kein Sonderfall mehr:** Genus schaltete nach richtiger Antwort als einzige Übung von selbst weiter. Jetzt geht es überall mit „Weiter“ (oder Enter) weiter.
- Browser-Test: Abstand zwischen Antwortzone und Leiste und Lage der Rückmeldung für jede Übungsart eines Tagwerks.

## 24.9.0
- **Modi ehrlich benannt:** „Lesen und hören“ und „Nur hören“. Beim Lesen heißt der Knopf unten „Vorlesen“ statt nur ▶, damit klar ist, dass es Ton gibt. Ein dritter Modus „nur lesen“ wäre derselbe Bildschirm ohne Antippen und entfällt.
- **Niveau:** Einstellung „Grundlagen / Mittel / Fortgeschritten“. Fortgeschritten: schwere Sätze zuerst, Grundlagen-Sätze nur in Themen mit vielen Fehlern der letzten 30 Tage (dort dann bewusst die einfachsten zuerst) oder wenn sonst nichts mehr da ist; sitzt die Grammatik-Übung des Tages (85 % der letzten 15+), kommen davon nur zwei Aufgaben; Lesetexte nach Schwierigkeit sortiert.
- **Mehr Stoff auf B2:** 32 schwedische und 40 spanische Sätze in allen Themen außer den falschen Freunden (Plusquamperfekt, irreale Bedingungen, Subjuntivo nach aunque/cuando/Relativsatz, Konditional der Vermutung, Passiv mit -s, Partikelverben wie *hålla med*, *ta reda på*), alle Wörter im Wörterbuch. Zwei spanische Lesetexte auf B2 (*La España vaciada*, *Las lenguas de España*).
- **Satzbank:** optionale sechste Spalte für das Niveau (A2, B1, B2); ohne Angabe schätzt die App nach Länge, Nebensätzen und anspruchsvollen Formen.

## 24.8.0
- **Lesen oder nur hören wird vorher gewählt:** Umschalter oben in der Übersicht, gemerkt für alle Texte. Wer hören will, sieht den Text vorher nicht; im Text selbst gibt es dafür keinen Umschalter mehr, beim Hören nur „Text zeigen“.
- **Leiste unten:** Noch einmal (aktueller Satz, in der ersten Sekunde der davor), Wiedergabe, „Langsam“ mit Schildkröte als klarer Ein/Aus-Schalter statt „1×“ (gemerkt). Vor/Zurück entfallen, Sätze springt man durch Antippen an.
- **Satz antippen:** Beim Lesen öffnet ein Wort wie überall das Wörterbuch, dort gibt es jetzt „Ganzen Satz anhören“. Beim Hören spielt ein verschwommener Satz beim ersten Antippen noch einmal, beim zweiten wird er sichtbar.
- **Fragen erst nach dem Text:** Beim Lesen über „Gelesen, zu den Fragen“, beim Hören kommen sie von selbst nach dem letzten Satz („Fragen jetzt“ geht immer). Nach jeder Antwort steht die Textstelle mit der Lösung darunter, am Ende sind diese Stellen im Text unterstrichen. Weiter geht es per Knopf, nicht mehr automatisch, damit die Textstelle gelesen werden kann.

## 24.7.0
- **Lesen neu gestaltet:** Der Text steht vorn, nicht die Knöpfe. Kopf mit Thema, Niveau, Satzzahl, Titel in der Schrift der Zielsprache und einem schmalen Fortschrittsbalken. Die Steuerung sitzt als ruhige Leiste unten (zurück, Wiedergabe, vor, Tempo, „Nur hören“) und bleibt beim Scrollen erreichbar.
- **Mitlesen:** Der vorgelesene Satz ist hervorgehoben, und die Ansicht folgt ihm sanft, nur wenn er aus dem Bild rutscht.
- **Nur hören statt zweier Reiter:** Der Text wird verschwommen statt versteckt. Antippen deckt einen einzelnen Satz auf, nach der letzten Frage wird alles scharf.
- **Fragen einzeln:** Frage 1 von 3 mit Punkten; nach einer richtigen Antwort geht es von selbst weiter, nach einer falschen bleibt die Lösung stehen, bis man „Nächste Frage“ tippt. Danach Ergebnis, Sätze zum Übernehmen und **Nächster Text** (der nächste ungelesene).
- **Nachgeschlagen:** Wörter, die man im Text antippt, sammeln sich am Ende mit ihrer Bedeutung.
- **Übersicht als Karten** mit Thema, Niveau, erstem Satz als Vorschau und Stand („Neu“, „2 von 3“, „gehört“).

## 24.6.0
- **Lesen und Hören:** sieben eigene Texte je Sprache, quer durch Natur, Geschichte, Kultur, Gesellschaft, Reisen und Kurioses (Schwedisch B1–B2, Spanisch A2–B1). Jeder Text lässt sich lesen (Wörter antippbar, Vorlesen mit Hervorhebung) oder nur hören (Text verdeckt, Satz für Satz, langsam, Satz wiederholen). Danach drei Verständnisfragen und zwei Sätze, die man in die Wiederholung übernehmen kann. Ergebnis und „gehört“ stehen in der Liste.
- **Wikipedia-Fundstück (online):** ein zufälliger Artikel aus der schwedischen bzw. spanischen Wikipedia über die offizielle API, mit Quelle und Lizenzhinweis, ebenfalls zum Lesen oder Hören. Die Texte der App selbst sind eigene Texte und brauchen kein Internet.
- **Termux:** `tagwerk` wird als echter Befehl angelegt statt als Alias, `docs/INSTALL.md` entsprechend.

## 24.5.0
- **Rundenende neu:** Leiste mit einem Feld je Aufgabe (richtig, fast richtig, falsch), Kennzahlen nur wenn aussagekräftig (Minuten, neue Sätze, richtig in Folge), „Sitzt: … kommen erst in … wieder“, „Noch nicht sicher“ mit **Gleich nochmal üben** (ändert den Wiederholungsplan nicht), Hinweis auf ein offenes Tagwerk, „Noch eine Runde“ als Hauptknopf außerhalb des Tagwerks, „Fehlerfrei“ bei einer perfekten Runde.
- **Serie in der Runde:** bei 3, 5, 10 … ersten Versuchen in Folge ein kurzer Hinweis.
- **Richtige Antworten werden erkannt:** Ziffern und Zahlwörter, *arbeta*/*jobba*, *mej*/*mig*, *sen*/*sedan* gelten als gleich. Tippfehler (vertauscht, Nachbartaste, Doppelbuchstabe) zählen als „fast richtig“ mit Hinweis; nicht bei Endungen, Stammwechsel, Lückenwort oder ausgeschriebener Uhrzeit. Test über alle Musterlösungen und Alternativen.
- **Grammatik oder Wortschatz:** Funktionswörter und andere Formen desselben Wortes sind Grammatik, ein anderes Inhaltswort ist Wortschatz. Wortschatzfehler belasten nicht mehr das Grammatikthema (Fehlerquellen), erscheinen als eigene Fehlerart „Wortschatz“, und die Rückmeldung sagt „Die Grammatik passt, nur … statt …“. In Grammatik-Übungen zählt so ein Fehler als „fast richtig“, in der Satzbank weiter als falsch.
- **Hörrunde:** geübte Sätze nebenbei hören (Satz, Deutsch, Satz langsam), läuft von allein, Bildschirm bleibt an, zählt als Lernzeit.
- **Inhalt:** Satzbank Schwedisch 177 statt 131, Spanisch 192 statt 163 Sätze, nur in dünnen Themen; alle neuen Wörter im Wörterbuch.
- **Aufgeräumt:** ungenutzte Hilfsfunktionen, doppelte Speicher-Anfrage und zusammengehörige CSS-Regeln zusammengeführt (Darstellung unverändert).

## 24.4.1
- **Neues Symbol kam nicht an:** Firefox merkt sich Symbole pro Dateiname; bei gleichem Namen (`icon-512.png`) zeigte es nach Neuinstallation weiter das alte. Der Build hängt jetzt einen Inhalts-Hash an (`icon-512.89186482.png`) und setzt die Namen in Manifest, Service Worker und Seite ein. Jedes geänderte Symbol hat damit eine neue Adresse.
- **Updates ohne Umweg über den Browser-Zwischenspeicher:** GitHub Pages erlaubt 10 Minuten Zwischenspeicher. Der Service Worker lädt beim Installieren jetzt am Zwischenspeicher vorbei und fragt im Hintergrund beim Server nach, sonst konnten alte Dateien im neuen Cache landen.
- **Versionsnummer** unter Einstellungen › Über Tagwerk.
- Lässt sich der gespeicherte Stand nicht lesen, legt die App ihn unter `tagwerk-offline-v1-unlesbar` ab, bevor etwas überschrieben wird.
- Einheitstest für den Build (Version, Symbolnamen, Verweise).

## 24.4.0
- **Knopfleiste im Dunkelmodus:** In Firefox für Android waren „Prüfen“ und „Weiter“ im Dunkelmodus unsichtbar, ließen sich aber antippen. Die Leiste ist jetzt kein festes Element mehr (`position:fixed`), sondern steht unten im Fluss und bleibt beim Scrollen sichtbar (`sticky`); Aussehen und Platz sind gleich. Wechselt das System zwischen hell und dunkel, zeichnet die App neu und färbt die Statusleiste passend. Nachgestellt in echtem Firefox (Gecko 160, Desktop) in hell und dunkel; das Verhalten auf Android ließ sich hier nicht nachstellen.
- **Hördiktat spielt von selbst:** Der Satz kommt beim Erscheinen einmal, ohne „Abspielen“, auch nach „Weiter“. Verweigert der Browser den Ton (etwa nach einem Neustart mitten in der Runde), bleibt es still, und eine Aufnahme wird deshalb nicht mehr fälschlich als gesperrt gemerkt.
- **Symbol:** Die Sonne sinkt tiefer in die Welle, das Motiv sitzt mittiger.
- **Updates per Termux:** `tools/einspielen.sh` und Weg C in `docs/INSTALL.md`: Repository vom Handy aus einrichten, danach ist jedes Update eine `.patch`-Datei und ein Befehl.
- Browser-Tests: Hördiktat ohne Antippen, Knopfleiste unten im Bild (31 Tests).

## 24.3.0
- **Schreibmarke beim Umbauen:** Das Feld mit vorgegebenem Satzanfang („Tyvärr …“) bekam den Fokus, die Marke stand aber vor dem ersten Wort; auch die Knöpfe å, ä, ö fügten dort ein. Jetzt steht sie am Ende, beim Öffnen und beim erneuten Antippen. Ein Browser-Test prüft beides für Schwedisch und Spanisch (mit der alten Fassung schlägt er fehl).
- **Mehr Abwechslung:** Wortstellung, Fehler finden und Umbauen auf Schwedisch teilten sich 9 Bausteine, „dricker kaffe“ kam fast jede Runde. Jetzt 30 (Pilze sammeln, Unihockey, bar zahlen, Ski fahren, im See baden, Urlaub im Juli …). Spanisch Umbauen: 22 statt 10 Bausteine für Zeiten, 16 statt 10 für den Subjuntivo. Alle neuen Wörter stehen im Wörterbuch.
- **Lesetipps nach dem Tagwerk:** Schwedisch 8 Sidor, SVT Nyheter, Svenska Yle; Spanisch Noticias fácil, RTVE Noticias, BBC Mundo. Alle frei lesbar, ohne Bezahlschranke. Klartext und Dreaming Spanish entfallen.
- **Backup zuverlässiger:** Die Download-Adresse blieb nur 1,5 Sekunden gültig; Firefox für Android fragt vorher nach und konnte dann ins Leere laden. Jetzt 2 Minuten. Die Dateiauswahl filtert nicht mehr nach JSON (Android graut solche Dateien teils aus), stattdessen wird der Inhalt geprüft; dieselbe Datei lässt sich mehrfach wählen. Nach dem Einspielen steht da, wie viele Sätze und Übungstage übernommen wurden. Wo der Browser Dateien teilen kann, gibt es „Backup teilen“. Browser-Tests: Export, Import auf einem leeren Gerät, Neustart, Rückgängig, fremde Datei.
- **Neues Symbol „Ring und Welle“:** Der Ring des å als Sonne, die Tilde des ñ als Welle. Rund mit durchsichtigen Ecken (`any`) und randlos für Android-Masken (`maskable`), damit es nicht mehr als Quadrat zwischen runden Symbolen steht. Zehn Entwürfe in `design/icons/`, Wechsel mit `npm run icons -- <name>`.
- „Morgen kommt 1 Satz“ statt „Morgen kommen 1 Satz“; ebenso beim Übernehmen eines einzelnen Satzes.

## 24.2.0
- **Lücke im falschen Wort:** Die Lücke wurde per Zeichensuche gesetzt und traf das erste Vorkommen, auch mitten in einem Wort: „Pi[en]so mucho en ti“ statt „Pienso mucho [en] ti“ und „La fi[es]ta es en casa de Ana“ statt „La fiesta [es] en casa“. Jetzt zählen nur ganze Wörter; ein Test prüft alle 233 Lückensätze.
- **Übersetzung:** „Ich denke oft an dich“ hieß „Pienso mucho en ti“ (mucho = viel). Jetzt „Ich denke viel an dich“. Ein Abgleich bedeutungstragender Wörter (oft, immer, nie, viel, heute, gestern, morgen) über die ganze Satzbank fand keinen weiteren Fall.
- **Land & Leute:** Die Karte „patata, papa, palta“ mischte zwei Themen. Jetzt „¿aguacate o palta?“: zwei Namen aus Nahuatl und Quechua, mit Karte der beiden Verbreitungsgebiete und passendem Beispielsatz.

## 24.1.0
- **Uhrzeiten und Preise:** Die Zifferntastatur am Handy hat keinen Doppelpunkt und kein €. Uhrzeiten gelten jetzt auch mit Komma oder ganz ohne Trennzeichen (7,45 und 745), der Platzhalter lautet „z. B. 7.45“ und ein Hinweis nennt die Trennzeichen. Beim Preis steht die Währung sichtbar im Feld; eingegeben wird nur die Zahl.
- **Amerika-Karte flächentreu:** Lambert flächentreu azimutal mit Mittelpunkt 57,5° W 10° N statt Plattkarte. Vorher erschienen Patagonien und Spanien bis zu 78 % zu groß. Begründung und Messwerte in `docs/CONTENT.md`, nachrechenbar mit `tools/projection_check.js`.

## 24.0.0
- **Keine Wiederholungen mehr:** Jeder Generator merkt sich seine letzten 12 Aufgaben, auch über Runden hinweg (vorher z. B. bei por/para fast jede Runde eine Doppelung). Hördiktat, Nachsprechen und „Thema üben“ bevorzugen Sätze, die zuletzt nicht dran waren. Das Fundstück zeigt nie zweimal hintereinander dieselbe Karte.
- **Fortschritt ruhiger:** Sprachkarte mit drei Kennzahlen statt vier Absätzen, antippbare Begriffe „gefestigt“, „verankert“, „abrufbar“, Themenraster statt Liste, „Stand der Sätze“ in einer Zeile. Behoben: Pfeil in der Themenliste brach in eine eigene Zeile um.
- **Langfristig sichtbar:** „Dein Weg“ mit Etappen, rückwirkend aus den Tagesdaten; Wortschatz und gefestigte Sätze je Thema im Tagesstand; Zuwachs über 30 Tage.
- **Schreiben:** Textprofil offline (Zeitformen, Nebensätze, Verbindungswörter, Satzlänge, LIX, neu Gelerntes), treffsichere Hinweise zu den Fallen der App, freiwillige Extra-Aufgabe, Wörter zum Einbauen, Textarchiv, Verlauf in der Statistik.
- **Karten:** Natural-Earth-Karten bei spanischen Wortvarianten, „Spanisch in der Welt“, Finnlandschwedisch, Norrland mit Polarkreis, Skandinavien.
- Tagesplan auf „Heute“ kürzer, Bezeichnungen brechen nicht mehr um.
- Repository mit Node-Build, 98 Einheitstests, 25 Browser-Tests, CI und automatischer Veröffentlichung.

## 23
Fehlerquellen nach Thema, Übungsart und Fehlerart; Tageszeit; Wortschatz; Land & Leute mit Übernahme von Beispielsätzen; „Meine ist auch richtig“ nicht mehr bei eindeutigen Lückenaufgaben; verweigerte Tatoeba-Aufnahmen werden gemerkt, Namensnennung mit Link.

## 22
Fachbegriffe antippbar, Liste „Grammatik-Begriffe“; Kalender mit fester Kästchengröße zum Wischen bis zum ersten Übungstag; 3, 6 oder 10 weitere neue Sätze.

## 21
Fortschritt in Reiter geteilt (Überblick, Schwedisch, Spanisch); Übungsseite nach Zweck gruppiert; Themenblatt mit Regel, Beispielen und typischem Fehler; Beispiele aus eigenen Sätzen im Wörterbuch; Nachschlagelisten für Regeln, falsche Freunde und Feste; Regeltexte korrigiert („måste inte“, Partikelverben).

## 20
Neue Übungsformen: Fehler finden, Umbauen, Uhrzeiten & Zahlen, en/ett und el/la; Konjugation mit Rechtschreibregeln.

## 19
Aussprache prüfen mit Spracherkennung, Vibration, Teilen an die App, Schnellzugriffe, Stempel nach dem Tagwerk.

## 16 bis 18
Rundenergebnis zählt nur den ersten Versuch, Symbole, Begrüßung, Fundstück, eigene Einstellungsseite, Rundenlänge, Langzeitstatistik, Jahrestabelle.

## 13 bis 15
Wortkästchen mit festen Plätzen, Verlaufsdiagramm, Wochenbalken mit Ziel-Linie.

## 10 bis 12
Abbrechen-Hinweise, Wortstellung, Wörterbuch-Fenster.

## 5 bis 9
Lückenbreite, Zeitformen, Übungslogik; Umstieg von Leitner auf FSRS-6.
