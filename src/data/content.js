/* Satzbank. Format pro Zeile: Deutsch | Ziel | Lücke (Alternativen mit /) | Hinweis | Alternativen (mit ;;) */
const CONTENT = {
sv: {
bisats: `
Ich weiß, dass er heute nicht kommt. | Jag vet att han inte kommer idag. |  |  |  |  | Im att-Satz steht „inte“ vor dem Verb: att han inte kommer. Im Hauptsatz ist es umgekehrt: Han kommer inte.
Sie sagt, dass sie keine Zeit hat. | Hon säger att hon inte har tid. |  |  | Hon säger att hon inte har någon tid. |  | Im att-Satz steht „inte“ vor dem Verb: att hon inte har tid (oder: inte har någon tid).
Ich bleibe zu Hause, weil ich mich nicht gut fühle. | Jag stannar hemma eftersom jag inte mår bra. |  |  | Jag stannar hemma för att jag inte mår bra.;; Jag stannar hemma då jag inte mår bra. |  | Nach eftersom (weil) steht „inte“ vor dem Verb: eftersom jag inte mår bra. sich gut fühlen = må bra.
Wir machen einen Spaziergang, wenn es nicht regnet. | Vi tar en promenad om det inte regnar. |  |  | Vi går en promenad om det inte regnar. |  | Im om-Satz (wenn, falls) steht „inte“ vor dem Verb: om det inte regnar. einen Spaziergang machen = ta oder gå en promenad.
Das ist der Film, den ich noch nie gesehen habe. | Det är filmen som jag aldrig har sett. |  |  | Det är filmen jag aldrig har sett.;; Det är den film som jag aldrig har sett. |  | Im Relativsatz steht „aldrig“ vor dem Verb: som jag aldrig har sett. som darf hier auch fehlen: filmen jag aldrig har sett.
Er fragt, ob ich auch kommen will. | Han frågar om jag också vill komma. |  |  |  |  | Im Nebensatz steht auch „också“ vor dem Verb: … om jag också vill komma.
Ich glaube, dass sie immer zu spät kommt. | Jag tror att hon alltid kommer för sent. |  |  |  |  | Im att-Satz steht „alltid“ vor dem Verb: att hon alltid kommer för sent.
Ruf an, wenn du nicht kommen kannst. | Ring om du inte kan komma. |  |  | Ring mig om du inte kan komma. |  | Im om-Satz steht „inte“ vor dem Modalverb: om du inte kan komma.
Ich verstehe nicht, warum er nie antwortet. | Jag förstår inte varför han aldrig svarar. |  |  |  |  | Im Hauptsatz steht „inte“ nach dem Verb (förstår inte), im Nebensatz „aldrig“ davor (… varför han aldrig svarar).
Weißt du, ob das Restaurant heute geöffnet hat? | Vet du om restaurangen har öppet idag? |  |  | Vet du om restaurangen är öppen idag? |  | Indirekte Frage mit om (ob): erst das Subjekt, dann das Verb, und es wandert nicht ans Ende: … om restaurangen har öppet.
Sie ist traurig, weil ihr Freund sie nicht angerufen hat. | Hon är ledsen eftersom hennes pojkvän inte har ringt henne. |  |  | Hon är ledsen för att hennes pojkvän inte har ringt henne.;; Hon är ledsen eftersom hennes pojkvän inte har ringt till henne. |  | Nach eftersom steht „inte“ vor dem Hilfsverb: eftersom hennes pojkvän inte har ringt. anrufen = ringa någon oder ringa till någon.
Ich hoffe, dass du dich bald besser fühlst. | Jag hoppas att du snart mår bättre. |  |  | Jag hoppas att du mår bättre snart.;; Jag hoppas att du snart blir bättre.;; Jag hoppas att du blir bättre snart. |  | Im att-Satz steht „snart“ vor dem Verb oder am Satzende: att du snart mår bättre, att du mår bättre snart.
Obwohl er viel arbeitet, hat er nie Stress. | Fast han jobbar mycket har han aldrig stress. |  |  | Trots att han jobbar mycket har han aldrig stress.;; Fast han arbetar mycket har han aldrig stress. |  | Steht der Nebensatz vorn, folgt im Hauptsatz erst das Verb, dann das Subjekt: … har han aldrig stress. „aldrig“ steht dort nach dem Subjekt.
Wir können nicht gehen, bevor alle gegessen haben. | Vi kan inte gå innan alla har ätit. |  |  | Vi kan inte gå förrän alla har ätit. |  | Im Hauptsatz steht „inte“ nach dem Verb (kan inte gå), im Nebensatz wandert das Verb nicht ans Ende (innan alla har ätit). Nach Verneinung geht auch förrän.
Sag Bescheid, wenn du nicht mehr kannst. | Säg till om du inte orkar mer. |  |  | Säg till när du inte orkar mer.;; Säg till om du inte orkar längre. |  | Im om-Satz steht „inte“ vor dem Verb: om du inte orkar mer. nicht mehr können (keine Kraft mehr haben) = inte orka mer.
Ich bin froh, dass es nicht regnet. | Jag är glad att det inte regnar. |  |  | Jag är glad över att det inte regnar. |  | Im att-Satz steht „inte“ vor dem Verb: att det inte regnar.
Es ist schade, dass du nicht mitkommen kannst. | Det är synd att du inte kan följa med. |  |  | Det är synd att du inte kan komma med. |  | Im att-Satz steht „inte“ vor dem Modalverb: att du inte kan följa med. mitkommen = följa med.
Er sagt, dass er nie Fleisch isst. | Han säger att han aldrig äter kött. |  |  |  |  | Im att-Satz steht „aldrig“ vor dem Verb: att han aldrig äter kött.
Ich frage mich, warum sie nicht antwortet. | Jag undrar varför hon inte svarar. |  |  |  |  | Im Nebensatz mit varför steht „inte“ vor dem Verb: varför hon inte svarar.
Wenn ich keine Lust habe, bleibe ich zu Hause. | Om jag inte har lust stannar jag hemma. |  |  | När jag inte har lust stannar jag hemma. |  | Im Nebensatz steht „inte“ vor dem Verb (om jag inte har lust). Steht der Nebensatz vorn, folgt im Hauptsatz erst das Verb, dann das Subjekt: stannar jag.
Obwohl wir uns lange nicht gesehen hatten, erkannte ich sie sofort. | Fast vi inte hade setts på länge kände jag igen henne direkt. |  |  | Trots att vi inte hade setts på länge kände jag igen henne direkt.;; Fast vi inte hade träffats på länge kände jag igen henne direkt.;; Trots att vi inte hade träffats på länge kände jag igen henne direkt.;; Fast vi inte hade setts på länge kände jag genast igen henne. | B2 | Im Nebensatz steht „inte“ vor dem Verb (fast vi inte hade setts). Danach im Hauptsatz erst das Verb, dann das Subjekt: kände jag igen.
Er behauptet, dass er die E-Mail nie bekommen hat. | Han påstår att han aldrig har fått mejlet. |  |  | Han påstår att han aldrig fick mejlet.;; Han hävdar att han aldrig har fått mejlet.;; Han hävdar att han aldrig fick mejlet. | B2 | Im att-Satz steht „aldrig“ vor dem Verb: att han aldrig har fått mejlet. „har“ darf im Nebensatz auch fehlen: att han aldrig fått mejlet.
Ich wäre gekommen, wenn ich gewusst hätte, dass du nicht allein bist. | Jag hade kommit om jag hade vetat att du inte var ensam. |  |  | Jag skulle ha kommit om jag hade vetat att du inte var ensam.;; Jag hade kommit om jag hade vetat att du inte är ensam. | B2 | Nicht Wirkliches in der Vergangenheit: hade + Supinum in beiden Teilen (oder: skulle ha kommit). Im att-Satz steht „inte“ vor dem Verb: att du inte var ensam.
Kein Wunder, dass die Leute nicht mehr Zug fahren, wenn die Züge ständig Verspätung haben. | Det är inte konstigt att folk inte åker tåg längre när tågen hela tiden är försenade. |  |  | Det är inte konstigt att folk slutar åka tåg när tågen hela tiden är försenade.;; Det är inte konstigt att folk inte längre åker tåg när tågen hela tiden är försenade.;; Det är inte konstigt att folk inte åker tåg längre när tågen ständigt är försenade.;; Det är inte konstigt att folk inte åker tåg längre när tågen är försenade hela tiden. | B2 | Im att-Satz steht „inte“ vor dem Verb: att folk inte åker tåg längre (oder: inte längre åker tåg). „ständig“ = hela tiden oder ständigt.
`,
inversion: `
Heute arbeite ich nicht. | Idag jobbar jag inte. |  |  | Idag arbetar jag inte.;; Jag jobbar inte idag. |  | Steht etwas anderes vorn (idag), folgt erst das Verb, dann das Subjekt: Idag jobbar jag. „inte“ kommt nach dem Subjekt.
Morgen fahren wir nach Göteborg. | I morgon åker vi till Göteborg. |  |  | Vi åker till Göteborg i morgon. |  | Nach „i morgon“ vorn: erst das Verb, dann das Subjekt: I morgon åker vi. fahren, reisen = åka.
Am Wochenende schlafe ich immer lange. | På helgen sover jag alltid länge. |  |  | På helgerna sover jag alltid länge.;; Jag sover alltid länge på helgen.;; Jag sover alltid länge på helgerna. |  | Nach „på helgen“ vorn: sover jag. „alltid“ steht nach dem Subjekt.
Jetzt verstehe ich das. | Nu förstår jag det. |  |  | Jag förstår det nu.;; Nu fattar jag det. |  | Nach „nu“ vorn: erst das Verb, dann das Subjekt: Nu förstår jag det.
Im Sommer wohnen sie auf dem Land. | På sommaren bor de på landet. |  |  | De bor på landet på sommaren. |  | Nach „på sommaren“ vorn: bor de. auf dem Land = på landet.
Leider kann ich nicht kommen. | Tyvärr kan jag inte komma. |  |  | Jag kan tyvärr inte komma. |  | Nach „tyvärr“ vorn: kan jag. „inte“ steht nach dem Subjekt: Tyvärr kan jag inte komma.
Den Film habe ich schon gesehen. | Den filmen har jag redan sett. |  |  | Jag har redan sett den filmen. |  | Das Objekt vorn (den filmen) holt wie im Deutschen das Verb an die zweite Stelle: Den filmen har jag redan sett.
Wenn ich nach Hause komme, koche ich. | När jag kommer hem lagar jag mat. |  |  | Jag lagar mat när jag kommer hem. |  | Steht der Nebensatz vorn, folgt im Hauptsatz erst das Verb, dann das Subjekt: … lagar jag mat. kochen = laga mat.
Normalerweise trinke ich keinen Kaffee. | Vanligtvis dricker jag inte kaffe. |  |  | Normalt dricker jag inte kaffe.;; Jag dricker vanligtvis inte kaffe.;; Vanligtvis dricker jag inget kaffe. |  | Nach „vanligtvis“ vorn: dricker jag. keinen Kaffee = inte kaffe oder inget kaffe.
Um acht Uhr beginnt der Kurs. | Klockan åtta börjar kursen. |  |  | Kursen börjar klockan åtta. |  | Die Uhrzeit vorn holt das Verb an die zweite Stelle: Klockan åtta börjar kursen.
Vielleicht kommt sie später. | Kanske kommer hon senare. |  |  | Kanske hon kommer senare.;; Hon kommer kanske senare. |  | Nach „kanske“ vorn geht beides: kanske kommer hon (Inversion) oder kanske hon kommer.
In Schweden trinkt man viel Kaffee. | I Sverige dricker man mycket kaffe. |  |  | Man dricker mycket kaffe i Sverige. |  | Nach „i Sverige“ vorn: dricker man. man wie im Deutschen.
Nach dem Essen machen wir einen Spaziergang. | Efter maten tar vi en promenad. |  |  | Vi tar en promenad efter maten.;; Efter maten går vi en promenad. |  | Nach „efter maten“ vorn: tar vi. einen Spaziergang machen = ta oder gå en promenad.
Heute Abend sehe ich ihn nicht. | Ikväll träffar jag honom inte. |  |  | Ikväll träffar jag inte honom.;; Jag träffar honom inte ikväll.;; Jag träffar inte honom ikväll.;; Ikväll ser jag honom inte. |  | Nach „ikväll“ vorn: träffar jag. Ein Pronomen als Objekt steht meist vor „inte“ (träffar jag honom inte); „inte honom“ geht auch.
Im Winter wird es früh dunkel. | På vintern blir det mörkt tidigt. |  |  | Det blir mörkt tidigt på vintern.;; På vintern blir det tidigt mörkt. |  | Nach „på vintern“ vorn: blir det. dunkel werden = bli mörkt.
Nach der Arbeit gehe ich oft ins Fitnessstudio. | Efter jobbet går jag ofta till gymmet. |  |  | Efter jobbet går jag ofta på gym.;; Efter arbetet går jag ofta till gymmet.;; Jag går ofta till gymmet efter jobbet. |  | Nach „efter jobbet“ vorn: går jag. „ofta“ steht nach dem Subjekt.
Zum Glück hat niemand etwas gemerkt. | Som tur var märkte ingen något. |  |  | Lyckligtvis märkte ingen något.;; Som tur var märkte ingen någonting.;; Ingen märkte något, som tur var. |  | Nach „som tur var“ (zum Glück) vorn: erst das Verb, dann das Subjekt: märkte ingen. etwas merken = märka något.
Vielleicht regnet es morgen. | Kanske regnar det i morgon. |  |  | Det regnar kanske i morgon.;; Kanske det regnar i morgon. |  | Nach „kanske“ vorn geht beides: kanske regnar det (Inversion) oder kanske det regnar.
Hier wohne ich seit fünf Jahren. | Här har jag bott i fem år. |  |  | Jag har bott här i fem år. |  | Nach „här“ vorn: har jag bott. seit fünf Jahren (und noch immer) = Perfekt mit i: har bott i fem år.
Morgen früh muss ich arbeiten. | I morgon bitti måste jag jobba. |  |  | I morgon bitti måste jag arbeta.;; Jag måste jobba i morgon bitti. |  | Nach „i morgon bitti“ (morgen früh) vorn: måste jag.
Hätte ich das früher gewusst, hätte ich anders gehandelt. | Hade jag vetat det tidigare hade jag gjort annorlunda. |  |  | Om jag hade vetat det tidigare hade jag gjort annorlunda.;; Hade jag vetat det tidigare skulle jag ha gjort annorlunda.;; Om jag hade vetat det tidigare skulle jag ha gjort annorlunda.;; Hade jag vetat det tidigare hade jag handlat annorlunda.;; Jag hade gjort annorlunda om jag hade vetat det tidigare. | B2 | Bedingung ohne om: Das Verb steht vorn (Hade jag vetat …), wie im Deutschen „Hätte ich …“. Danach im Hauptsatz erst das Verb, dann das Subjekt: hade jag gjort.
Erst als es dunkel wurde, merkten wir, wie spät es war. | Först när det blev mörkt märkte vi hur sent det var. |  |  | Det var först när det blev mörkt som vi märkte hur sent det var. | B2 | Nach „först när …“ vorn: erst das Verb, dann das Subjekt: märkte vi. In der indirekten Frage bleibt die Reihenfolge: hur sent det var.
Trotz des schlechten Wetters kamen fast alle zum Fest. | Trots det dåliga vädret kom nästan alla till festen. |  |  | Nästan alla kom till festen trots det dåliga vädret. | B2 | Nach „trots …“ vorn: kom nästan alla. trotz des schlechten Wetters = trots det dåliga vädret (Artikel, Adjektiv auf -a, Nomen mit Endung).
Am meisten vermisse ich die langen Sommerabende. | Mest saknar jag de långa sommarkvällarna. |  |  | Jag saknar de långa sommarkvällarna mest.;; Det jag saknar mest är de långa sommarkvällarna. | B2 | Nach „mest“ vorn: saknar jag. vermissen = sakna.
`,
tempus: `
Gestern habe ich einen alten Freund getroffen. | Igår träffade jag en gammal vän. | träffade | (träffa) | Jag träffade en gammal vän igår.;; Igår träffade jag en gammal kompis. |  | Mit einem Zeitpunkt in der Vergangenheit (igår): Präteritum (träffade), auch wenn man im Deutschen „habe getroffen“ sagt.
Letztes Jahr sind wir nach Norwegen gefahren. | Förra året åkte vi till Norge. | åkte | (åka) | Vi åkte till Norge förra året. |  | Abgeschlossener Zeitraum (förra året): Präteritum (åkte).
Ich habe den Film noch nie gesehen. | Jag har aldrig sett filmen. | har aldrig sett | (se) |  |  | Erfahrung bis heute (noch nie): Perfekt (har aldrig sett). „aldrig“ steht zwischen har und dem Supinum.
Als ich Kind war, habe ich in Uppsala gewohnt. | När jag var barn bodde jag i Uppsala. | bodde | (bo) | Jag bodde i Uppsala när jag var barn. |  | Zeit in der Vergangenheit (när jag var barn): Präteritum (bodde).
Wann bist du angekommen? | När kom du fram? | kom | (komma fram) | När kom du? |  | Frage nach dem Zeitpunkt (när?): Präteritum, auch wenn man im Deutschen „bist angekommen“ sagt.
Ich habe gerade gegessen. | Jag har precis ätit. | har precis ätit/har just ätit | (äta) | Jag har just ätit. |  | Gerade eben passiert, mit Bezug zu jetzt: Perfekt (har precis ätit). precis und just heißen beide „gerade“.
Wir haben uns 2019 kennengelernt. | Vi träffades 2019. | träffades/träffade varandra | (träffas) | Vi träffade varandra 2019.;; Vi lärde känna varandra 2019.;; Vi träffades år 2019. |  | Jahreszahl in der Vergangenheit: Präteritum. sich kennenlernen = träffas (träffades) oder lära känna varandra.
Sie hat mir gestern eine Nachricht geschickt. | Hon skickade ett meddelande till mig igår. | skickade | (skicka) | Hon skickade mig ett meddelande igår.;; Igår skickade hon ett meddelande till mig. |  | Mit igår: Präteritum (skickade). jemandem etwas schicken = skicka något till någon oder skicka någon något.
Wann hast du das Buch gelesen? | När läste du boken? | läste | (läsa) |  |  | Frage nach dem Zeitpunkt (när?): Präteritum (läste).
Ich habe schon gegessen. | Jag har redan ätit. | har redan ätit | (äta) |  |  | Bezug zu jetzt (schon): Perfekt (har redan ätit). „redan“ steht zwischen har und dem Supinum.
Letzten Sommer haben wir viel gebadet. | I somras badade vi mycket. | badade | (bada) | Vi badade mycket i somras. |  | Mit „i somras“ (letzten Sommer): Präteritum (badade).
Vorgestern hat es den ganzen Tag geregnet. | I förrgår regnade det hela dagen. | regnade | (regna) | Det regnade hela dagen i förrgår. |  | Mit „i förrgår“ (vorgestern): Präteritum (regnade).
Hast du schon gegessen? | Har du ätit? | Har du ätit | (äta) | Har du redan ätit?;; Har du ätit än? |  | Frage, ob etwas bis jetzt passiert ist: Perfekt (har du ätit). „schon“ kann fehlen oder heißt redan, am Ende auch än.
Wir haben uns letzten Sommer kennengelernt. | Vi träffades i somras. | träffades | (träffas) | Vi lärde känna varandra i somras.;; I somras träffades vi. |  | Mit „i somras“: Präteritum. sich kennenlernen = träffas oder lära känna varandra.
Ich habe gerade eine Nachricht bekommen. | Jag har precis fått ett meddelande. | har precis fått/fick precis | (få) | Jag fick precis ett meddelande. |  | Gerade eben: Perfekt (har precis fått) oder, als abgeschlossener Moment, Präteritum (fick precis). Beides ist üblich.
Als ich nach Hause kam, schlief sie schon. | När jag kom hem sov hon redan. | sov | (sova) |  |  | Zeitpunkt in der Vergangenheit (när jag kom hem): Präteritum (sov).
Sie hat drei Jahre in Malmö gewohnt, jetzt wohnt sie in Umeå. | Hon bodde i Malmö i tre år, nu bor hon i Umeå. | bodde | (bo) |  |  | Abgeschlossen (jetzt wohnt sie woanders): Präteritum (bodde). Perfekt nur, wenn es bis heute andauert.
Hast du das Buch zu Ende gelesen? | Har du läst ut boken? | Har du läst ut | (läsa ut) | Har du läst klart boken? |  | Bezug zu jetzt (bist du fertig?): Perfekt. zu Ende lesen = läsa ut oder läsa klart.
Gestern Abend haben wir einen Film gesehen. | Igår kväll såg vi en film. | såg | (se) | Vi såg en film igår kväll. |  | Mit „igår kväll“ (gestern Abend): Präteritum (såg).
Als ich ankam, war der Zug schon abgefahren. | När jag kom fram hade tåget redan gått. | hade | (ha) | När jag kom dit hade tåget redan gått.;; När jag kom fram hade tåget redan åkt. | B2 | Vorvergangenheit: Was vor einem Zeitpunkt in der Vergangenheit schon passiert war, steht im Plusquamperfekt: hade + Supinum (hade gått).
Seit ich hier wohne, habe ich keinen so kalten Winter erlebt. | Sedan jag flyttade hit har jag aldrig upplevt en så kall vinter. | har jag aldrig upplevt | (uppleva) | Sen jag flyttade hit har jag aldrig upplevt en så kall vinter.;; Sedan jag flyttade hit har jag aldrig varit med om en så kall vinter.;; Så länge jag har bott här har jag aldrig upplevt en så kall vinter. | B2 | Bis heute (sedan …): Perfekt (har … upplevt). Steht der Nebensatz vorn, folgt erst das Verb, dann das Subjekt.
Wir hatten gerade gegessen, als es an der Tür klingelte. | Vi hade precis ätit när det ringde på dörren. | hade precis ätit | (äta) | Vi hade just ätit när det ringde på dörren.;; Vi hade precis ätit när det ringde på. | B2 | Vorvergangenheit: Es war vor dem Klingeln, also hade + Supinum (hade precis ätit).
Früher habe ich viel mehr gelesen als heute. | Förr läste jag mycket mer än nu. | läste | (läsa) | Förr läste jag mycket mer än idag.;; Jag läste mycket mer förr än nu. | B2 | „förr“ (früher) meint eine abgeschlossene Zeit: Präteritum (läste).
`,
partikel: `
Ich mag Kaffee. | Jag tycker om kaffe. |  |  | Jag gillar kaffe. |  | tycka om = mögen; „om“ ist betont und gehört zum Verb. gilla heißt dasselbe.
Kannst du deine Schwester mitbringen? | Kan du ta med din syster? |  |  | Kan du ta med dig din syster? |  | ta med (sig) = mitbringen; die Partikel steht direkt nach dem Verb: ta med din syster.
Ich erinnere mich nicht an seinen Namen. | Jag kommer inte ihåg hans namn. |  |  | Jag minns inte hans namn. |  | komma ihåg = sich erinnern; „inte“ steht zwischen Verb und Partikel: kommer inte ihåg. Auch: jag minns inte.
Wir besuchen morgen meine Oma. | Vi hälsar på min mormor i morgon. |  |  | Vi hälsar på min farmor i morgon.;; I morgon hälsar vi på min mormor.;; I morgon hälsar vi på min farmor. |  | hälsa på = besuchen (Menschen); „på“ ist betont. Oma: mormor (Mutter der Mutter) oder farmor (Mutter des Vaters).
Mach bitte das Licht aus. | Stäng av lampan, tack. |  |  | Släck lampan, tack.;; Stäng av ljuset, tack. |  | stänga av = ausmachen (Gerät, Licht); släcka = ausmachen, löschen (nur Licht und Feuer).
Gib nicht auf! | Ge inte upp! |  |  |  |  | ge upp = aufgeben; „inte“ steht zwischen Verb und Partikel: Ge inte upp!
Da stimme ich dir zu. | Där håller jag med dig. |  |  | Jag håller med dig där. |  | hålla med någon = jemandem zustimmen. Nach „där“ vorn: håller jag.
Er hat sich die Geschichte nur ausgedacht. | Han hittade bara på historien. |  |  | Han har bara hittat på historien. |  | hitta på = sich ausdenken; „på“ ist betont. „bara“ steht zwischen Verb und Partikel.
Wir verstehen uns gut. | Vi kommer bra överens. |  |  |  |  | komma överens = sich verstehen. „bra“ steht wie „inte“ zwischen Verb und Partikel.
Mach den Fernseher an. | Sätt på tv:n. |  |  | Slå på tv:n. |  | sätta på oder slå på = einschalten. tv:n = der Fernseher (Endung nach Doppelpunkt).
Ich ziehe nächsten Monat aus. | Jag flyttar ut nästa månad. |  |  | Nästa månad flyttar jag ut.;; Jag ska flytta ut nästa månad. |  | flytta ut = ausziehen (aus einer Wohnung). Für die Zukunft reicht wie im Deutschen das Präsens.
Sie hat das Angebot abgelehnt. | Hon tackade nej till erbjudandet. |  |  | Hon har tackat nej till erbjudandet. |  | tacka nej till = ablehnen; „nej“ ist betont wie eine Partikel.
Ich gebe nicht auf. | Jag ger inte upp. |  |  |  |  | ge upp = aufgeben; „inte“ steht zwischen Verb und Partikel: ger inte upp.
Kannst du den Fernseher ausmachen? | Kan du stänga av tv:n? |  |  | Kan du slå av tv:n? |  | stänga av oder slå av = ausschalten.
Ich komme morgen vorbei. | Jag tittar förbi i morgon. |  |  | I morgon tittar jag förbi.;; Jag kommer förbi i morgon. |  | titta förbi = kurz vorbeikommen; „förbi“ ist betont.
Du musst aufpassen. | Du måste se upp. |  |  | Du måste akta dig.;; Du måste passa dig. |  | se upp = aufpassen (vor einer Gefahr); „upp“ ist betont. Auch: akta dig, passa dig.
Ich habe meinen Schlüssel verloren. | Jag har tappat bort min nyckel. |  |  | Jag har tappat min nyckel. |  | tappa bort = verlieren, verlegen; tappa allein heißt auch fallen lassen.
Kannst du das Licht ausmachen? | Kan du stänga av lampan? |  |  | Kan du stänga av ljuset?;; Kan du släcka lampan?;; Kan du släcka ljuset? |  | stänga av = ausmachen; släcka geht nur bei Licht und Feuer.
Zieh deine Jacke an! | Ta på dig jackan! |  |  | Sätt på dig jackan! |  | ta på sig = anziehen; das Reflexivpronomen steht nach der Partikel: ta på dig jackan.
Sie hat sich um die Kinder gekümmert. | Hon tog hand om barnen. |  |  | Hon har tagit hand om barnen. |  | Feste Verbindung: ta hand om = sich kümmern um.
Wir müssen um sieben aufstehen. | Vi måste gå upp klockan sju. |  |  | Vi måste stiga upp klockan sju. |  | gå upp oder stiga upp = aufstehen; „upp“ ist betont.
Sie gibt nie auf. | Hon ger aldrig upp. |  |  |  |  | ge upp = aufgeben; „aldrig“ steht wie „inte“ zwischen Verb und Partikel: ger aldrig upp.
Wir müssen das Treffen auf nächste Woche verschieben. | Vi måste skjuta upp mötet till nästa vecka. |  |  | Vi måste flytta mötet till nästa vecka. | B2 | skjuta upp = verschieben (auf später). flytta mötet geht auch.
Da stimme ich dir nicht ganz zu. | Där håller jag inte riktigt med dig. |  |  | Jag håller inte riktigt med dig där.;; Jag håller inte helt med dig där. | B2 | hålla med = zustimmen; „inte riktigt“ steht zwischen Verb und Partikel: håller inte riktigt med.
Kannst du herausfinden, wann der Laden aufmacht? | Kan du ta reda på när affären öppnar? |  |  | Kan du ta reda på när butiken öppnar?;; Kan du kolla när affären öppnar? | B2 | Feste Verbindung: ta reda på = herausfinden.
Die Preise sind stark gestiegen. | Priserna har gått upp kraftigt. |  |  | Priserna har stigit kraftigt.;; Priserna har ökat kraftigt. | B2 | gå upp = steigen (Preise); „upp“ ist betont. Auch: stiga, öka.
`,
sin: `
Anna ruft ihre Mutter an. | Anna ringer sin mamma. | sin |  | Anna ringer till sin mamma. |  | Besitzerin ist das Subjekt (Anna): sin. hennes mamma wäre die Mutter einer anderen Frau.
Peter mag ihre Schwester (die Schwester von Lisa). | Peter tycker om hennes syster. | hennes |  | Peter gillar hennes syster. |  | Besitzerin ist Lisa, nicht das Subjekt Peter: hennes.
Sie hat ihr Handy verloren. | Hon har tappat sin mobil. | sin |  | Hon har tappat bort sin mobil. |  | Besitzerin ist das Subjekt (hon), mobil ist ein en-Wort: sin.
Er wäscht sein Auto. | Han tvättar sin bil. | sin |  |  |  | Besitzer ist das Subjekt (han), bil ist ein en-Wort: sin. hans bil wäre das Auto eines anderen.
Ich leihe mir sein Auto. | Jag lånar hans bil. | hans |  |  |  | Besitzer ist er, nicht das Subjekt jag: hans.
Die Kinder spielen mit ihren Freunden. | Barnen leker med sina kompisar. | sina |  | Barnen leker med sina vänner. |  | Besitzer ist das Subjekt (barnen), Mehrzahl: sina.
Sie verkauft ihr Haus. | Hon säljer sitt hus. | sitt |  |  |  | Besitzerin ist das Subjekt, hus ist ein ett-Wort: sitt.
Lisa und ihr Mann wohnen in Lund. | Lisa och hennes man bor i Lund. | hennes |  |  |  | „sin“ kann nicht selbst im Subjekt stehen: „Lisa och hennes man“ ist zusammen das Subjekt, also hennes.
Er hat seine Schlüssel vergessen. | Han har glömt sina nycklar. | sina |  |  |  | Besitzer ist das Subjekt, Mehrzahl (nycklar): sina.
Sie sagt, dass ihr Bruder krank ist. | Hon säger att hennes bror är sjuk. | hennes |  |  |  | Im Nebensatz ist „hennes bror“ das Subjekt; die Besitzerin (hon) steht im Hauptsatz, also hennes.
Jonas besucht seine Eltern jedes Wochenende. | Jonas hälsar på sina föräldrar varje helg. | sina |  | Jonas besöker sina föräldrar varje helg. |  | Besitzer ist das Subjekt (Jonas), Mehrzahl: sina.
Sie nimmt ihr Fahrrad zur Arbeit. | Hon tar sin cykel till jobbet. | sin |  |  |  | Besitzerin ist das Subjekt, cykel ist ein en-Wort: sin.
Lisa vermisst ihren Bruder. | Lisa saknar sin bror. | sin |  |  |  | Besitzerin ist das Subjekt (Lisa): sin.
Die Nachbarn verkaufen ihr Haus. | Grannarna säljer sitt hus. | sitt |  |  |  | Besitzer ist das Subjekt (grannarna), und es ist ein Haus (ett-Wort): sitt. sina nur bei mehreren Dingen.
Er hat seinen Pass vergessen. | Han har glömt sitt pass. | sitt |  |  |  | Besitzer ist das Subjekt, pass ist ein ett-Wort: sitt.
Erik und seine Frau wohnen in Lund. | Erik och hans fru bor i Lund. | hans |  |  |  | „sin“ kann nicht selbst im Subjekt stehen: „Erik och hans fru“ ist zusammen das Subjekt, also hans.
Maria leiht mir ihr Fahrrad. | Maria lånar ut sin cykel till mig. | sin |  |  |  | Besitzerin ist das Subjekt (Maria): sin. jemandem leihen = låna ut; låna allein heißt sich etwas leihen.
Sie sprechen oft über ihre Kinder. | De pratar ofta om sina barn. | sina |  | De talar ofta om sina barn. |  | Besitzer ist das Subjekt (de), Mehrzahl: sina.
Anna sagt, dass ihr Auto kaputt ist. | Anna säger att hennes bil är trasig. | hennes |  | Anna säger att hennes bil är sönder. |  | Im Nebensatz ist „hennes bil“ das Subjekt; die Besitzerin (Anna) steht im Hauptsatz, also hennes.
Die Firma hat ihren Hauptsitz nach Malmö verlegt. | Företaget har flyttat sitt huvudkontor till Malmö. | sitt |  |  | B2 | Besitzer ist das Subjekt (företaget), huvudkontor ist ein ett-Wort: sitt.
Jeder muss sein eigenes Gepäck tragen. | Var och en får bära sitt eget bagage. | sitt |  | Alla får bära sitt eget bagage.;; Var och en måste bära sitt eget bagage. | B2 | Bezieht sich auf das Subjekt (var och en): sitt eget bagage; bagage ist ein ett-Wort. får heißt hier „muss“.
Lena hat mir erzählt, dass ihr Bruder nach Kanada zieht. | Lena berättade för mig att hennes bror ska flytta till Kanada. | hennes |  | Lena har berättat för mig att hennes bror ska flytta till Kanada.;; Lena berättade för mig att hennes bror flyttar till Kanada. | B2 | Im Nebensatz ist „hennes bror“ das Subjekt; die Besitzerin (Lena) steht im Hauptsatz, also hennes.
Die Eltern haben ihr Haus ihren Kindern überlassen. | Föräldrarna har lämnat över sitt hus till sina barn. | sitt |  | Föräldrarna har överlåtit sitt hus till sina barn. | B2 | Beides gehört dem Subjekt (föräldrarna): sitt hus und sina barn.
`,
tid: `
Ich wohne seit zwei Jahren in Stockholm. | Jag har bott i Stockholm i två år. | i två år |  |  |  | seit + Dauer bis heute: Perfekt mit i (har bott i två år). sedan steht nur vor einem Zeitpunkt (sedan mars).
Wir haben uns vor drei Jahren kennengelernt. | Vi träffades för tre år sedan. | för tre år sedan/för tre år sen |  | Vi träffades för tre år sen.;; Vi lärde känna varandra för tre år sedan.;; Vi träffade varandra för tre år sedan. |  | vor + Zeitraum: för … sedan (för tre år sedan), umgangssprachlich sen. sich kennenlernen = träffas.
Der Zug fährt in zehn Minuten. | Tåget går om tio minuter. | om tio minuter |  | Tåget avgår om tio minuter. |  | in + Zeitraum (Zukunft): om (om tio minuter). i tio minuter hieße „zehn Minuten lang“.
Kommenden Montag habe ich frei. | På måndag är jag ledig. | På måndag |  | Jag är ledig på måndag. |  | Kommender Wochentag: på måndag. Letzter: i måndags.
Letzten Montag war ich krank. | I måndags var jag sjuk. | I måndags/Förra måndagen |  | Jag var sjuk i måndags.;; Förra måndagen var jag sjuk. |  | Letzter Wochentag: i måndags (mit -s). Kommender: på måndag.
Sie ist bei der Arbeit. | Hon är på jobbet. | på jobbet/på arbetet |  | Hon är på arbetet. |  | Arbeitsplatz und Einrichtungen: på (på jobbet, på bio, på sjukhuset).
Ich bin beim Zahnarzt. | Jag är hos tandläkaren. | hos tandläkaren |  |  |  | Bei einer Person: hos (hos tandläkaren, hos mamma).
Ich trinke morgens Kaffee. | Jag dricker kaffe på morgonen. | på morgonen/på morgnarna |  | Jag dricker kaffe på morgnarna. |  | Wiederkehrende Tageszeit (morgens): på morgonen.
Im Winter ist es dunkel. | På vintern är det mörkt. | På vintern/På vintrarna |  | Det är mörkt på vintern.;; På vintrarna är det mörkt. |  | Jahreszeit allgemein (im Winter): på vintern. Diesen Winter: i vinter.
Ich war zwei Wochen in Spanien. | Jag var i Spanien i två veckor. | i två veckor/två veckor |  | Jag var i Spanien två veckor. |  | Dauer in der Vergangenheit: i två veckor (das i kann auch fehlen).
Kommst du am Freitag? | Kommer du på fredag? | på fredag |  |  |  | Kommender Wochentag: på fredag.
Wir fahren um sechs Uhr los. | Vi åker klockan sex. | klockan sex/kl sex |  | Vi åker kl. sex.;; Vi åker iväg klockan sex. |  | Uhrzeit: klockan sex, ohne Präposition.
Ich habe sie seit Wochen nicht gesehen. | Jag har inte sett henne på flera veckor. | på flera veckor/på veckor |  | Jag har inte sett henne på veckor. |  | Verneinte Dauer (seit … nicht): på, nicht i (på flera veckor).
Ich habe ihn seit einer Woche nicht gesehen. | Jag har inte sett honom på en vecka. | på en vecka |  | Jag har inte träffat honom på en vecka. |  | Verneinte Dauer (seit … nicht): på, nicht i (på en vecka).
Wir sind in einer Stunde da. | Vi är där om en timme. | om en timme |  | Vi är framme om en timme. |  | in + Zeitraum (Zukunft): om (om en timme).
Sie hat vor einer Stunde angerufen. | Hon ringde för en timme sedan. | för en timme sedan/för en timme sen |  | Hon ringde för en timme sen. |  | vor + Zeitraum: för … sedan (för en timme sedan), umgangssprachlich sen.
Ich lerne seit März Schwedisch. | Jag har pluggat svenska sedan mars. | sedan mars/sen mars |  | Jag har läst svenska sedan mars.;; Jag har studerat svenska sedan mars.;; Jag har pluggat svenska sen mars. |  | seit + Zeitpunkt: sedan (sedan mars). seit + Dauer: i (i två år).
Am Samstag waren wir im Kino. | I lördags var vi på bio. | I lördags |  | Vi var på bio i lördags. |  | Letzter Wochentag: i lördags (mit -s).
Ich trainiere dreimal pro Woche. | Jag tränar tre gånger i veckan. | i veckan/per vecka |  | Jag tränar tre gånger per vecka. |  | Pro Woche: i veckan (oder per vecka).
Ich habe dich seit Jahren nicht gesehen! | Jag har inte sett dig på flera år! | på flera år |  | Jag har inte sett dig på många år!;; Jag har inte träffat dig på flera år! | B2 | Verneinte Dauer (seit … nicht): på, nicht i (på flera år).
Wir sind vor einer Woche umgezogen, und es fühlt sich schon wie zu Hause an. | Vi flyttade för en vecka sedan, och det känns redan som hemma. | för en vecka sedan/för en vecka sen |  | Vi flyttade för en vecka sen, och det känns redan som hemma. | B2 | vor einer Woche: för en vecka sedan. sich anfühlen wie = kännas som.
In zwei Wochen fange ich meine neue Stelle an. | Om två veckor börjar jag på mitt nya jobb. | Om två veckor |  | Jag börjar på mitt nya jobb om två veckor. | B2 | in + Zeitraum (Zukunft): om två veckor. Steht es vorn, folgt erst das Verb: Om två veckor börjar jag. eine Stelle antreten = börja på ett jobb.
Die Verhandlungen dauerten bis spät in die Nacht. | Förhandlingarna pågick till sent på natten. | till sent på natten |  | Förhandlingarna höll på till sent på natten. | B2 | bis: till; nachts: på natten (till sent på natten).
`,
framtid: `
Ich werde morgen anrufen. | Jag ska ringa i morgon. | ska ringa/ringer/kommer att ringa/kommer ringa |  | Jag ringer i morgon.;; Jag kommer att ringa i morgon.;; Jag kommer ringa i morgon. |  | Plan oder Zusage: ska ringa. Das Präsens (ringer) oder kommer att ringa geht auch.
Es wird morgen regnen. | Det kommer att regna i morgon. | kommer att regna/kommer regna |  | Det kommer regna i morgon.;; I morgon kommer det att regna.;; Det regnar i morgon. |  | Vorhersage ohne Absicht (Wetter): kommer att + Infinitiv oder das Präsens. ska passt nicht, weil niemand es plant.
Du musst nicht kommen. | Du behöver inte komma. | behöver inte |  |  |  | muss nicht = behöver inte. „måste inte“ ist mehrdeutig; darf nicht = får inte.
Hier darf man nicht rauchen. | Här får man inte röka. | får man inte |  |  |  | darf nicht = får inte. Nach „här“ vorn: erst das Verb, dann das Subjekt: Här får man inte röka.
Du solltest mehr schlafen. | Du borde sova mer. | borde/bör |  | Du bör sova mer. |  | Rat: borde (oder bör) = solltest.
Ich würde gern einen Kaffee bestellen. | Jag skulle vilja beställa en kaffe. | skulle vilja |  | Jag skulle vilja ha en kaffe. |  | Höflicher Wunsch: skulle vilja = würde gern, möchte.
Wir haben vor, im Sommer umzuziehen. | Vi tänker flytta i sommar. | tänker/ska/planerar att |  | Vi planerar att flytta i sommar.;; Vi ska flytta i sommar. |  | Absicht: tänker = haben vor (auch ska, planerar att).
Darf ich das Fenster aufmachen? | Får jag öppna fönstret? | Får/Kan |  | Kan jag öppna fönstret? |  | Um Erlaubnis bitten: Får jag …? (darf ich). Kan jag … geht auch.
Sie wird Ärztin. | Hon ska bli läkare. | ska bli/blir |  | Hon blir läkare. |  | werden = bli; ska bli, weil es ihr Plan ist (auch: blir).
Wir werden im Sommer heiraten. | Vi ska gifta oss i sommar. | ska gifta oss/kommer att gifta oss | (gifta sig) | Vi kommer att gifta oss i sommar.;; Vi kommer gifta oss i sommar. |  | Plan: ska gifta oss (auch kommer att). heiraten = gifta sig; i sommar = diesen Sommer.
Kannst du Schwedisch? | Kan du svenska? | Kan |  |  |  | Eine Sprache können: kunna ohne weiteres Verb (Kan du svenska?).
Ich muss jetzt gehen. | Jag måste gå nu. | måste |  |  |  | müssen = måste. Verneint, „muss nicht“, dagegen behöver inte.
Du darfst gern bleiben. | Du får gärna stanna. | får |  |  |  | får = darf; får gärna = darf gern.
Das Konzert wird bestimmt gut. | Konserten kommer säkert att bli bra. | kommer säkert att bli/blir säkert/kommer säkert bli |  | Konserten blir säkert bra.;; Konserten kommer säkert bli bra. |  | Vorhersage: kommer att bli; „säkert“ steht nach kommer. Das Präsens geht auch: blir säkert bra.
Wollen wir ins Kino gehen? | Ska vi gå på bio? | Ska vi |  |  |  | Vorschlag: Ska vi …? = Wollen wir …?
Ich möchte gern zahlen. | Jag skulle vilja betala. | skulle vilja |  | Jag vill gärna betala. |  | Höflicher Wunsch: skulle vilja = würde gern, möchte.
Was machst du am Wochenende? | Vad ska du göra i helgen? | ska du göra |  | Vad gör du i helgen? |  | Pläne: Vad ska du göra …? Das Präsens geht auch: Vad gör du i helgen?
Ich habe vor, im Sommer zu verreisen. | Jag tänker resa bort i sommar. | tänker |  | Jag planerar att resa bort i sommar.;; Jag ska resa bort i sommar. |  | Absicht: tänker = habe vor (auch ska, planerar att).
Du darfst das niemandem sagen. | Du får inte säga det till någon. | får inte |  | Du får inte berätta det för någon. |  | darf nicht = får inte (nicht „måste inte“).
Das wird bestimmt gut gehen. | Det kommer säkert att gå bra. | kommer säkert att gå/kommer säkert gå |  | Det kommer säkert gå bra.;; Det går säkert bra. |  | Vorhersage: kommer att gå bra; „säkert“ steht nach kommer. gut gehen = gå bra.
Ich habe vor, nächstes Jahr ein Sabbatjahr zu machen. | Jag tänker ta ett sabbatsår nästa år. | tänker |  | Jag planerar att ta ett sabbatsår nästa år.;; Jag ska ta ett sabbatsår nästa år. | B2 | Absicht: tänker = habe vor (auch ska, planerar att).
Wenn wir uns nicht beeilen, verpassen wir den letzten Bus. | Om vi inte skyndar oss kommer vi att missa sista bussen. | kommer vi att missa/missar vi/kommer vi missa |  | Om vi inte skyndar oss missar vi sista bussen.;; Om vi inte skyndar oss kommer vi missa sista bussen. | B2 | Folge in der Zukunft: kommer vi att missa oder einfach missar vi. Nach dem Nebensatz vorn: erst das Verb, dann das Subjekt. Im om-Satz steht „inte“ vor dem Verb.
Du brauchst morgen nicht früh aufzustehen. | Du behöver inte gå upp tidigt i morgon. | behöver inte |  | Du behöver inte stiga upp tidigt i morgon. | B2 | brauchst nicht = behöver inte. aufstehen = gå upp oder stiga upp.
Morgen dürfte es wieder wärmer werden. | Det lär bli varmare igen i morgon. | lär bli |  | Det blir nog varmare igen i morgon.;; Det kommer nog att bli varmare igen i morgon. | B2 | Vermutung: lär = dürfte, soll wohl (det lär bli varmare).
`,
passiv: `
Das Geschäft wird um neun Uhr geöffnet. | Affären öppnas klockan nio. | öppnas/öppnar | (öppna) | Affären öppnar klockan nio.;; Butiken öppnar klockan nio.;; Butiken öppnas klockan nio. |  | s-Passiv: öppnas (wird geöffnet). Bei Geschäften sagt man auch einfach: affären öppnar klockan nio.
Hier spricht man Schwedisch. | Här talar man svenska. | talar man/pratar man/talas/pratas |  | Här pratar man svenska.;; Här talas svenska. |  | Allgemeine Aussage mit man: här talar man svenska (auch s-Passiv: här talas svenska).
Es gibt kein Brot mehr. | Det finns inget bröd kvar. | Det finns |  | Det finns inte mer bröd.;; Det finns inget mer bröd. |  | es gibt = det finns. kein … mehr = inget … kvar oder inte mer ….
Das Essen wird um sechs serviert. | Maten serveras klockan sex. | serveras | (servera) |  |  | s-Passiv im Präsens: serveras (wird serviert).
Er wurde zum Chef gewählt. | Han valdes till chef. | valdes/blev vald | (välja) | Han blev vald till chef. |  | s-Passiv im Präteritum: valdes (wurde gewählt), auch blev vald. zum Chef = till chef, ohne Artikel.
Wie schreibt man das? | Hur stavar man det? | stavar man/skriver man/stavas/skrivs |  | Hur skriver man det?;; Hur stavas det? |  | Allgemeine Frage mit man: Hur stavar man det? (auch: Hur stavas det?)
Das Haus wurde 1920 gebaut. | Huset byggdes 1920. | byggdes/blev byggt | (bygga) | Huset blev byggt 1920.;; Huset byggdes år 1920. |  | s-Passiv im Präteritum: byggdes (wurde gebaut). blev byggt geht auch; byggt passt zu ett hus.
Gibt es hier ein Café? | Finns det ett kafé här? | Finns det |  | Finns det ett café här?;; Finns det något kafé här? |  | Gibt es …? = Finns det …? Das Verb steht vorn wie im Deutschen.
Die Tür muss geschlossen werden. | Dörren måste stängas. | stängas | (stänga) |  |  | Passiv nach Modalverb: Infinitiv mit -s (måste stängas).
Der Brief wurde gestern geschickt. | Brevet skickades igår. | skickades | (skicka) | Brevet skickades i går. |  | s-Passiv im Präteritum: skickades (wurde geschickt).
Es gibt viele Seen in Schweden. | Det finns många sjöar i Sverige. | Det finns |  | I Sverige finns det många sjöar. |  | es gibt = det finns. Steht „i Sverige“ vorn: I Sverige finns det många sjöar.
Wie sagt man das auf Schwedisch? | Hur säger man det på svenska? | säger man |  |  |  | Allgemeine Frage mit man: Hur säger man …?
Die Straße wird morgen gesperrt. | Vägen stängs av i morgon. | stängs av | (stänga av) | Vägen stängs av imorgon. |  | s-Passiv bei Partikelverben: Die Partikel steht danach: stängs av (stänga av = sperren).
Die Kinder müssen abgeholt werden. | Barnen måste hämtas. | hämtas | (hämta) |  |  | Passiv nach Modalverb: hämtas (abgeholt werden).
Das Haus wird gerade renoviert. | Huset renoveras just nu. | renoveras | (renovera) | Huset håller på att renoveras. |  | s-Passiv für einen laufenden Vorgang: renoveras just nu (wird gerade renoviert); auch håller på att renoveras.
Die Brücke wurde 1998 gebaut. | Bron byggdes 1998. | byggdes | (bygga) | Bron blev byggd 1998.;; Bron byggdes år 1998. |  | s-Passiv im Präteritum: byggdes; blev byggd geht auch (byggd passt zu en bro).
Das Paket wird morgen geliefert. | Paketet levereras i morgon. | levereras | (leverera) | Paketet kommer att levereras i morgon.;; Paketet kommer levereras i morgon. |  | Zukunft im Passiv: levereras i morgon (Präsens) oder kommer att levereras.
In Schweden isst man oft Fisch. | I Sverige äter man ofta fisk. | äter man |  |  |  | Allgemeine Aussage mit man; nach „I Sverige“ vorn Inversion: äter man.
Das Fenster wurde geöffnet. | Fönstret öppnades. | öppnades | (öppna) | Fönstret blev öppnat. |  | s-Passiv im Präteritum: öppnades; blev öppnat geht auch (öppnat passt zu ett fönster).
Die Rechnung muss bis Freitag bezahlt werden. | Räkningen måste betalas senast på fredag. | betalas | (betala) | Räkningen måste betalas före fredag.;; Räkningen måste betalas senast fredag. |  | Passiv nach Modalverb: betalas. bis Freitag (spätestens) = senast på fredag.
Das Gesetz wurde nach langer Debatte angenommen. | Lagen antogs efter en lång debatt. | antogs | (anta) | Lagen blev antagen efter en lång debatt. | B2 | s-Passiv im Präteritum: antogs (anta = beschließen, annehmen); blev antagen geht auch.
Es heißt, die Brücke soll abgerissen werden. | Det sägs att bron ska rivas. | sägs | (säga) | Det påstås att bron ska rivas. | B2 | Es heißt, … = det sägs att …; soll (geplant) = ska; Passiv nach ska: rivas (abgerissen werden).
Der Patient muss sofort operiert werden. | Patienten måste opereras omedelbart. | opereras | (operera) | Patienten måste opereras direkt.;; Patienten måste opereras genast. | B2 | Passiv nach Modalverb: opereras. sofort = omedelbart, direkt oder genast.
Die Wohnung wurde renoviert, bevor wir eingezogen sind. | Lägenheten renoverades innan vi flyttade in. | renoverades | (renovera) | Lägenheten blev renoverad innan vi flyttade in. | B2 | s-Passiv im Präteritum: renoverades. einziehen = flytta in.
`,
falska: `
Ich bleibe heute zu Hause. | Jag stannar hemma idag. | stannar |  | Idag stannar jag hemma. |  | bleiben = stanna. „bli“ heißt werden.
Das war wirklich lustig! | Det var verkligen roligt! | roligt/kul |  | Det var verkligen kul! |  | lustig (witzig) = rolig oder kul. Schwedisch „lustig“ heißt oft seltsam.
Ich habe nächste Woche Urlaub. | Jag har semester nästa vecka. | semester |  | Nästa vecka har jag semester. |  | Urlaub = semester. Das Semester an der Uni heißt termin.
Das Semester beginnt im August. | Terminen börjar i augusti. | Terminen |  |  |  | Semester (Uni) = termin. „semester“ heißt Urlaub.
Es wird kalt. | Det blir kallt. | blir |  |  |  | werden = bli (det blir kallt). „bleiben“ heißt stanna.
Ich habe einen Brief bekommen. | Jag har fått ett brev. | fått |  |  |  | bekommen = få. Schwedisch „bekomma“ heißt berühren (det bekommer mig inte = das lässt mich kalt).
Die Fahrt dauert drei Stunden. | Resan tar tre timmar. | Resan |  |  |  | Fahrt, Reise = resa. „fart“ heißt Geschwindigkeit.
Sie trägt einen roten Rock. | Hon har en röd kjol på sig. | kjol |  | Hon bär en röd kjol. |  | Rock (Kleidungsstück) = kjol. Schwedisch „rock“ ist ein Mantel (morgonrock = Bademantel) oder Rockmusik.
Der Hund ist sehr brav. | Hunden är väldigt snäll. | snäll/lydig |  | Hunden är mycket snäll.;; Hunden är väldigt lydig. |  | brav (artig) = snäll oder lydig.
Ich habe morgen einen Termin beim Arzt. | Jag har en tid hos läkaren i morgon. | en tid |  | Jag har en läkartid i morgon. |  | Termin (beim Arzt) = tid. „termin“ heißt Semester.
Ich bin froh, dass du hier bist. | Jag är glad att du är här. | glad |  | Jag är glad över att du är här. |  | froh = glad (Jag är glad att …).
Er läuft jeden Morgen fünf Kilometer. | Han springer fem kilometer varje morgon. | springer |  | Varje morgon springer han fem kilometer. |  | laufen, rennen = springa. „springen“ heißt hoppa.
Bist du wieder gesund? | Är du frisk igen? | frisk |  |  |  | gesund = frisk. „frisch“ heißt färsk (Brot, Obst) oder frisk (Luft).
Ich esse gern Käse. | Jag äter gärna ost. | ost |  | Jag gillar ost.;; Jag tycker om ost. |  | Käse = ost. Die Himmelsrichtung Osten heißt öster.
Das ist eine schwierige Frage. | Det är en svår fråga. | svår |  |  |  | schwierig = svår. „schwer“ im Sinn von Gewicht heißt tung.
Wir sind fast fertig. | Vi är nästan klara. | nästan |  | Vi är nästan färdiga. |  | fast (beinahe) = nästan. Schwedisch „fast“ heißt fest oder obwohl.
Er trägt Anzug und Krawatte. | Han har kostym och slips. | kostym och slips |  | Han bär kostym och slips.;; Han har på sig kostym och slips. |  | Anzug = kostym. Ein Kostüm (Verkleidung) heißt maskeraddräkt.
Die Zinsen sind gestiegen. | Räntan har gått upp. | Räntan |  | Räntan har stigit.;; Räntorna har gått upp. |  | Zinsen = ränta. Die Rente heißt pension.
`
},
es: {
serestar: `
Mein Bruder ist Arzt. | Mi hermano es médico. | es | (ser/estar) |  |  | Beruf: ser, ohne Artikel (es médico).
Ich bin müde. | Estoy cansado. | Estoy | (ser/estar) | Estoy cansada. |  | Zustand, wie es einem gerade geht: estar (estoy cansado, als Frau cansada).
Madrid liegt im Zentrum Spaniens. | Madrid está en el centro de España. | está | (ser/estar) | Madrid se encuentra en el centro de España. |  | Wo sich etwas befindet, auch eine Stadt: estar (Madrid está en el centro). Auch: se encuentra.
Die Party ist bei Ana. | La fiesta es en casa de Ana. | es | (ser/estar) |  |  | Wo ein Ereignis stattfindet: ser (la fiesta es en casa de Ana). Wo sich etwas befindet: estar.
Die Suppe ist kalt. | La sopa está fría. | está | (ser/estar) |  |  | Zustand, wie etwas gerade ist: estar (la sopa está fría).
Sie ist sehr nett. | Es muy simpática. | Es | (ser/estar) | Ella es muy simpática. |  | Charakter: ser (es muy simpática).
Wir sind fertig. | Estamos listos. | Estamos | (ser/estar) | Estamos listas. |  | estar listo = fertig, bereit. ser listo = klug.
Der Film ist langweilig. | La película es aburrida. | es | (ser/estar) |  |  | ser aburrido = langweilig (Eigenschaft). estar aburrido = sich langweilen.
Ich langweile mich. | Estoy aburrido. | Estoy | (ser/estar) | Estoy aburrida.;; Me aburro. |  | estar aburrido = sich langweilen (Zustand). ser aburrido = langweilig sein.
Es ist zehn Uhr. | Son las diez. | Son | (ser/estar) |  |  | Uhrzeit: ser (son las diez, es la una).
Die Tür ist offen. | La puerta está abierta. | está | (ser/estar) |  |  | Ergebnis, Zustand (offen): estar + Partizip (está abierta).
Wo bist du? | ¿Dónde estás? | estás | (ser/estar) |  |  | Wo sich jemand befindet: estar (¿Dónde estás?).
Das Essen ist sehr lecker! | ¡La comida está muy rica! | está | (ser/estar) | ¡La comida está riquísima! |  | estar rico = schmeckt gut (dieses Essen, jetzt). Bei Personen heißt ser rico reich.
Er ist intelligent. | Es inteligente. | Es | (ser/estar) | Él es inteligente. |  | Eigenschaft: ser (es inteligente).
Das Wasser ist sehr kalt. | El agua está muy fría. | está | (ser/estar) |  |  | Zustand (gerade kalt): estar. agua ist weiblich (el steht nur wegen des betonten a), darum fría.
Meine Schwester ist sehr klug. | Mi hermana es muy lista. | es | (ser/estar) | Mi hermana es muy inteligente. |  | ser listo = klug. estar listo = fertig, bereit.
Das Restaurant ist heute geschlossen. | El restaurante está cerrado hoy. | está | (ser/estar) | Hoy el restaurante está cerrado. |  | Zustand (heute geschlossen): estar + Partizip (está cerrado).
Es ist offensichtlich, dass das Projekt nicht gut geplant ist. | Es evidente que el proyecto no está bien planificado. | está | (ser/estar) | Es obvio que el proyecto no está bien planificado. | B2 | Ergebnis einer Handlung: estar + Partizip (está planificado).
Die Besprechung findet im großen Saal statt, der schon reserviert ist. | La reunión será en la sala grande, que ya está reservada. | será | (ser/estar) | La reunión es en la sala grande, que ya está reservada. | B2 | Wo ein Ereignis stattfindet: ser (será en la sala grande). Ergebnis „reserviert“: estar + Partizip (está reservada).
Ich habe es satt, dass du immer zu spät kommst. | Estoy harto de que siempre llegues tarde. | Estoy | (ser/estar) | Estoy harta de que siempre llegues tarde.;; Estoy cansado de que siempre llegues tarde. | B2 | Gefühlszustand: estar harto de (etwas satthaben). Nach estar harto de que folgt der Subjuntivo: llegues.
Der Film basiert auf einem Roman, der ein großer Erfolg war. | La película está basada en una novela que fue un gran éxito. | está | (ser/estar) |  | B2 | estar basado en = basieren auf (estar + Partizip).
`,
pasado: `
Als ich klein war, wohnte ich in Köln. | Cuando era pequeño, vivía en Colonia. | vivía | (vivir) | Cuando era pequeña, vivía en Colonia.;; Cuando era niño, vivía en Colonia.;; Cuando era niña, vivía en Colonia. |  | Hintergrund und Zustand in der Vergangenheit: Imperfecto (era pequeño, vivía).
Gestern habe ich meine Großmutter besucht. | Ayer visité a mi abuela. | visité | (visitar) | Visité a mi abuela ayer.;; Ayer fui a ver a mi abuela. |  | Abgeschlossen, mit Zeitpunkt (ayer): Indefinido (visité). Eine Person als Objekt bekommt a: visité a mi abuela.
Ich las gerade, als das Telefon klingelte. | Estaba leyendo cuando sonó el teléfono. | sonó | (sonar) | Leía cuando sonó el teléfono. |  | Laufende Handlung: Imperfecto (estaba leyendo); das Ereignis, das sie unterbricht: Indefinido (sonó).
Früher spielten wir jeden Sonntag Fußball. | Antes jugábamos al fútbol todos los domingos. | jugábamos | (jugar) | Antes jugábamos fútbol todos los domingos.;; Antes jugábamos al fútbol cada domingo. |  | Gewohnheit in der Vergangenheit (früher, jeden Sonntag): Imperfecto (jugábamos). jugar al fútbol, in Lateinamerika oft ohne al.
Letztes Jahr sind wir nach Mexiko gereist. | El año pasado viajamos a México. | viajamos/fuimos | (viajar) | El año pasado fuimos a México. |  | Abgeschlossen, mit Zeitraum (el año pasado): Indefinido (viajamos).
Es war kalt und es regnete. | Hacía frío y llovía. | llovía/estaba lloviendo | (llover) | Hacía frío y estaba lloviendo. |  | Wetter und Umstände als Hintergrund: Imperfecto (hacía frío, llovía).
Plötzlich ging das Licht aus. | De repente se apagó la luz. | se apagó | (apagarse) | De pronto se apagó la luz.;; De repente se fue la luz. |  | Plötzliches Ereignis (de repente): Indefinido (se apagó).
Sie war drei Jahre in Berlin. | Estuvo tres años en Berlín. | Estuvo/Vivió | (estar) | Ella estuvo tres años en Berlín.;; Vivió tres años en Berlín. |  | Begrenzte, abgeschlossene Dauer (tres años): Indefinido (estuvo).
Ich wusste das nicht. | No lo sabía. | sabía | (saber) | Yo no lo sabía.;; No sabía eso. |  | Wissen als Zustand: Imperfecto (sabía). Indefinido supe heißt „erfuhr“.
Wir haben uns in Barcelona kennengelernt. | Nos conocimos en Barcelona. | conocimos | (conocerse) |  |  | Einmaliges Ereignis: Indefinido (nos conocimos). sich kennenlernen = conocerse.
Er war müde, deshalb ging er früh ins Bett. | Estaba cansado, así que se acostó temprano. | se acostó | (acostarse) | Estaba cansado, por eso se acostó temprano. |  | Zustand als Hintergrund: Imperfecto (estaba cansado); was daraufhin geschah: Indefinido (se acostó).
Was hast du am Wochenende gemacht? | ¿Qué hiciste el fin de semana? | hiciste | (hacer) | ¿Qué has hecho este fin de semana? |  | Abgeschlossener Zeitraum (el fin de semana): Indefinido (hiciste). Für das gerade vergangene Wochenende sagt man in Spanien auch ¿Qué has hecho …?
Gestern regnete es den ganzen Tag. | Ayer llovió todo el día. | llovió | (llover) |  |  | Abgeschlossen, mit Zeitpunkt (ayer): Indefinido (llovió), auch wenn es den ganzen Tag dauerte.
Als Kind hatte ich einen Hund. | De niño tenía un perro. | tenía | (tener) | Cuando era niño tenía un perro.;; De niña tenía un perro.;; Cuando era niña tenía un perro.;; De pequeño tenía un perro.;; De pequeña tenía un perro. |  | Zustand in der Kindheit: Imperfecto (tenía). Als Kind = de niño, de pequeño oder cuando era niño.
Wir haben uns 2015 in Sevilla kennengelernt. | Nos conocimos en 2015 en Sevilla. | conocimos | (conocerse) | Nos conocimos en Sevilla en 2015. |  | Jahreszahl, einmaliges Ereignis: Indefinido (nos conocimos).
Es war schon spät, als wir ankamen. | Ya era tarde cuando llegamos. | era | (ser) |  |  | Uhrzeit und Umstände als Hintergrund: Imperfecto (era tarde); das Ereignis: Indefinido (llegamos).
Plötzlich war der Strom weg. | De repente se fue la luz. | se fue/se apagó | (irse) | De pronto se fue la luz.;; De repente se apagó la luz.;; De pronto se apagó la luz. |  | Plötzliches Ereignis: Indefinido. irse la luz = der Strom fällt aus.
Jeden Sommer fuhren wir ans Meer. | Todos los veranos íbamos a la playa. | íbamos | (ir) | Cada verano íbamos a la playa.;; Todos los veranos íbamos al mar. |  | Gewohnheit in der Vergangenheit (jeden Sommer): Imperfecto (íbamos).
Während ich das Abendessen machte, spielten die Kinder im Garten. | Mientras yo preparaba la cena, los niños jugaban en el jardín. | preparaba | (preparar) | Mientras preparaba la cena, los niños jugaban en el jardín.;; Mientras yo hacía la cena, los niños jugaban en el jardín. | B2 | Zwei Handlungen laufen gleichzeitig (mientras): beide im Imperfecto.
Als ich endlich die Schlüssel fand, war der Zug schon weg. | Cuando por fin encontré las llaves, el tren ya se había ido. | se había ido/había salido | (irse) | Cuando por fin encontré las llaves, el tren ya había salido. | B2 | Vorvergangenheit: Was vorher schon geschehen war, steht im Pluscuamperfecto (se había ido).
Wir warteten schon zwei Stunden, als man uns sagte, dass der Flug gestrichen war. | Llevábamos dos horas esperando cuando nos dijeron que el vuelo estaba cancelado. | Llevábamos | (llevar) | Hacía dos horas que esperábamos cuando nos dijeron que el vuelo estaba cancelado. | B2 | Dauer bis zu einem Punkt in der Vergangenheit: llevar im Imperfecto + Gerundium (llevábamos dos horas esperando).
Als Kind habe ich mich immer, wenn es regnete, mit einem Buch ans Fenster gesetzt. | De pequeña, siempre que llovía me sentaba a leer junto a la ventana. | me sentaba | (sentarse) | De pequeño, siempre que llovía me sentaba a leer junto a la ventana.;; De niña, siempre que llovía me sentaba a leer junto a la ventana.;; De niño, siempre que llovía me sentaba a leer junto a la ventana. | B2 | Wiederholte Gewohnheit (siempre que llovía): Imperfecto (llovía, me sentaba).
`,
perfecto: `
Heute habe ich viel gearbeitet. | Hoy he trabajado mucho. | he trabajado/trabajé | (trabajar) | Hoy trabajé mucho. |  | Mit hoy (der Tag läuft noch): in Spanien Perfecto (he trabajado); in Lateinamerika ist das Indefinido üblich (trabajé).
Hast du schon mal Paella gegessen? | ¿Has comido paella alguna vez? | Has comido | (comer) | ¿Alguna vez has comido paella?;; ¿Comiste paella alguna vez? |  | Erfahrung bis heute (alguna vez = schon mal): in Spanien Perfecto (has comido); in Lateinamerika ist das Indefinido üblich.
Diese Woche habe ich nicht gut geschlafen. | Esta semana no he dormido bien. | he dormido/dormí | (dormir) | Esta semana no dormí bien. |  | Mit esta semana (läuft noch): in Spanien Perfecto (no he dormido); in Lateinamerika ist das Indefinido üblich (no dormí).
Gestern habe ich nicht gut geschlafen. | Ayer no dormí bien. | dormí | (dormir) |  |  | Mit ayer (abgeschlossen): Indefinido (dormí), auch wenn man im Deutschen „habe geschlafen“ sagt.
Ich habe meine Schlüssel verloren. | He perdido mis llaves. | He perdido/Perdí | (perder) | Perdí mis llaves. |  | Ohne Zeitangabe, mit Folge für jetzt: in Spanien Perfecto (he perdido); perdí ist in Lateinamerika üblich.
Wir waren noch nie in Peru. | Nunca hemos estado en Perú. | hemos estado | (estar) | No hemos estado nunca en Perú.;; Nunca estuvimos en Perú. |  | Erfahrung bis heute (noch nie): in Spanien Perfecto, in Lateinamerika meist Indefinido. nunca vorn ohne no, hinten mit no: no hemos estado nunca.
2018 habe ich mein Studium beendet. | En 2018 terminé mis estudios. | terminé | (terminar) | En 2018 terminé la carrera. |  | Jahreszahl (abgeschlossen): Indefinido (terminé).
Hat Juan schon angerufen? | ¿Ya ha llamado Juan? | ha llamado/llamó | (llamar) | ¿Ha llamado ya Juan?;; ¿Ya llamó Juan? |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (ha llamado); llamó ist in Lateinamerika üblich.
Heute Morgen bin ich früh aufgestanden. | Esta mañana me he levantado temprano. | me he levantado/me levanté | (levantarse) | Esta mañana me levanté temprano. |  | Mit esta mañana (heute Morgen): in Spanien Perfecto (me he levantado); in Lateinamerika ist das Indefinido üblich (me levanté).
Ich habe es dir schon gesagt. | Ya te lo he dicho. | he dicho/dije | (decir) | Ya te lo dije. |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (he dicho).
Hast du den Brief geschrieben? | ¿Has escrito la carta? | Has escrito/Escribiste | (escribir) | ¿Escribiste la carta? |  | Ergebnis ohne Zeitpunkt: in Spanien Perfecto (has escrito).
Dieses Jahr sind wir noch nicht verreist. | Este año todavía no hemos viajado. | hemos viajado | (viajar) | Este año aún no hemos viajado.;; Este año todavía no viajamos. |  | Mit este año und todavía no (bis jetzt nicht): in Spanien Perfecto (no hemos viajado); in Lateinamerika ist das Indefinido üblich.
2015 bin ich nach Berlin gezogen. | En 2015 me mudé a Berlín. | me mudé | (mudarse) | En 2015 me fui a vivir a Berlín. |  | Jahreszahl: Indefinido (me mudé). umziehen = mudarse.
Hast du die Nachrichten schon gelesen? | ¿Ya has leído las noticias? | has leído/leíste | (leer) | ¿Has leído ya las noticias?;; ¿Ya leíste las noticias? |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (has leído).
Letzte Woche habe ich meine Schlüssel verloren. | La semana pasada perdí las llaves. | perdí | (perder) | La semana pasada perdí mis llaves. |  | Mit la semana pasada (abgeschlossen): Indefinido (perdí).
Heute Morgen habe ich den Bus verpasst. | Esta mañana he perdido el autobús. | he perdido/perdí | (perder) | Esta mañana perdí el autobús.;; Esta mañana he perdido el bus. |  | Mit esta mañana: in Spanien Perfecto (he perdido); in Lateinamerika ist das Indefinido üblich (perdí). den Bus verpassen = perder el autobús.
Ich war noch nie in Mexiko. | Nunca he estado en México. | he estado | (estar) | No he estado nunca en México.;; Nunca estuve en México. |  | Erfahrung bis heute (noch nie): in Spanien Perfecto (he estado); in Lateinamerika ist das Indefinido üblich.
Hast du deine Schlüssel gefunden? | ¿Has encontrado tus llaves? | Has encontrado/Encontraste | (encontrar) | ¿Encontraste tus llaves?;; ¿Ya has encontrado tus llaves? |  | Ergebnis ohne Zeitpunkt: in Spanien Perfecto (has encontrado).
Dieses Jahr sind wir so wenig gereist wie nie. | Este año hemos viajado menos que nunca. | hemos viajado/viajamos | (viajar) | Este año viajamos menos que nunca. | B2 | Mit este año (läuft noch): in Spanien Perfecto (hemos viajado); in Lateinamerika ist das Indefinido üblich. so wenig wie nie = menos que nunca.
Hast du jemals darüber nachgedacht, im Ausland zu leben? | ¿Alguna vez te has planteado vivir en el extranjero? | te has planteado | (plantearse) | ¿Te has planteado alguna vez vivir en el extranjero?;; ¿Alguna vez has pensado en vivir en el extranjero?;; ¿Alguna vez te planteaste vivir en el extranjero? | B2 | Erfahrung bis heute (alguna vez): in Spanien Perfecto; in Lateinamerika ist das Indefinido üblich. plantearse = ernsthaft in Erwägung ziehen.
Ich hatte noch keine Zeit, deine Nachricht zu lesen. | Todavía no he tenido tiempo de leer tu mensaje. | he tenido | (tener) | Aún no he tenido tiempo de leer tu mensaje.;; Todavía no he tenido tiempo para leer tu mensaje.;; Todavía no tuve tiempo de leer tu mensaje. | B2 | Mit todavía no (noch nicht): in Spanien Perfecto (no he tenido); in Lateinamerika ist das Indefinido üblich.
Seit die Bauarbeiten begonnen haben, haben wir keine Nacht gut geschlafen. | Desde que empezó la obra, no hemos dormido bien ni una noche. | hemos dormido | (dormir) | Desde que empezaron las obras, no hemos dormido bien ni una noche.;; Desde que comenzó la obra, no hemos dormido bien ni una noche. | B2 | Zeitraum bis jetzt (desde que …): Perfecto (no hemos dormido); der Beginn selbst im Indefinido (empezó).
`,
subjuntivo: `
Ich will, dass du kommst. | Quiero que vengas. | vengas | (venir) |  |  | Nach querer que (jemand will, dass ein anderer etwas tut): Subjuntivo (vengas).
Ich hoffe, dass es dir gut geht. | Espero que estés bien. | estés/te vaya | (estar) | Espero que te vaya bien. |  | Nach esperar que (Wunsch): Subjuntivo (estés). Auch: espero que te vaya bien.
Ich glaube nicht, dass er recht hat. | No creo que tenga razón. | tenga | (tener) |  |  | Nach verneintem creer que (Zweifel): Subjuntivo (tenga).
Ich glaube, dass er recht hat. | Creo que tiene razón. | tiene | (tener) |  |  | creo que (ohne Zweifel): Indikativ. Erst verneint folgt Subjuntivo: no creo que tenga razón.
Ruf mich an, wenn du ankommst. | Llámame cuando llegues. | llegues | (llegar) | Cuando llegues, llámame. |  | cuando mit Zukunftsbezug (noch nicht passiert): Subjuntivo (llegues).
Es ist wichtig, dass wir pünktlich sind. | Es importante que seamos puntuales. | seamos | (ser) |  |  | Wertung (es importante que): Subjuntivo.
Hoffentlich regnet es morgen nicht. | Ojalá no llueva mañana. | llueva | (llover) | Ojalá que no llueva mañana.;; Ojalá mañana no llueva. |  | Nach ojalá (hoffentlich) steht immer der Subjuntivo (llueva).
Ich freue mich, dass du hier bist. | Me alegro de que estés aquí. | estés | (estar) | Me alegra que estés aquí. |  | Nach einem Gefühl (me alegro de que, me alegra que): Subjuntivo (estés).
Ich erkläre es dir, damit du es verstehst. | Te lo explico para que lo entiendas. | entiendas/comprendas | (entender) | Te lo explico para que lo comprendas. |  | para que (damit) verlangt immer Subjuntivo.
Bevor du gehst, mach das Licht aus. | Antes de que te vayas, apaga la luz. | te vayas/salgas | (irse) | Antes de que salgas, apaga la luz.;; Antes de irte, apaga la luz.;; Apaga la luz antes de irte. |  | antes de que (bevor) verlangt immer Subjuntivo (te vayas). Bei gleichem Subjekt geht auch antes de + Infinitiv: antes de irte.
Es ist möglich, dass sie später kommt. | Es posible que venga más tarde. | venga/llegue | (venir) | Es posible que llegue más tarde.;; Puede que venga más tarde. |  | Möglichkeit (es posible que): Subjuntivo.
Ich suche eine Wohnung mit Balkon. | Busco un piso que tenga balcón. | tenga | (tener) | Busco un apartamento que tenga balcón.;; Busco un departamento que tenga balcón. |  | Gesuchtes, noch unbekanntes Ding im Relativsatz: Subjuntivo (un piso que tenga …). Ein bestimmtes, bekanntes: Indikativ.
Ich weiß, dass du müde bist. | Sé que estás cansado. | estás | (estar) | Sé que estás cansada. |  | saber que (Gewissheit): Indikativ.
Es ist klar, dass er heute kommt. | Está claro que viene hoy. | viene | (venir) |  |  | está claro que (Gewissheit): Indikativ. Verneint (no está claro que) folgt Subjuntivo.
Jedes Mal, wenn ich Zeit habe, rufe ich dich an. | Cada vez que tengo tiempo, te llamo. | tengo | (tener) |  |  | Gewohnheit (jedes Mal, wenn): Indikativ. Subjuntivo nur mit Zukunftsbezug (cuando llegues).
Ich bin sicher, dass sie recht hat. | Estoy seguro de que tiene razón. | tiene | (tener) | Estoy segura de que tiene razón. |  | estar seguro de que (Gewissheit): Indikativ.
Ich hoffe, dass du morgen Zeit hast. | Espero que tengas tiempo mañana. | tengas | (tener) | Espero que mañana tengas tiempo. |  | Nach esperar que (Wunsch): Subjuntivo (tengas).
Auch wenn es morgen regnet, machen wir den Ausflug. | Aunque llueva mañana, saldremos de excursión. | llueva | (llover) | Saldremos de excursión aunque llueva mañana. | B2 | aunque mit offener Zukunft (auch wenn es regnen sollte): Subjuntivo. Mit einer Tatsache (obwohl es regnet): Indikativ.
Ich suche eine Wohnung, die eine Terrasse hat und nicht zu teuer ist. | Busco un piso que tenga terraza y no sea muy caro. | tenga | (tener) | Busco un piso que tenga terraza y que no sea muy caro.;; Busco un apartamento que tenga terraza y no sea muy caro. | B2 | Gesuchtes, noch unbekanntes Ding im Relativsatz: Subjuntivo (un piso que tenga … y no sea …).
Es hat mich überrascht, dass sie mich nicht eingeladen hatten. | Me sorprendió que no me hubieran invitado. | hubieran invitado/hubiesen invitado | (invitar) | Me sorprendió que no me hubiesen invitado. | B2 | Gefühl (me sorprendió) über etwas, das davor geschehen war: Pluscuamperfecto de subjuntivo (hubieran invitado).
Wenn du einen Moment Zeit hast, ruf mich an. | Cuando tengas un momento, llámame. | tengas | (tener) | Llámame cuando tengas un momento.;; Cuando tengas un rato, llámame. | B2 | cuando mit Zukunftsbezug (noch nicht passiert): Subjuntivo (tengas). Bejahter Imperativ: Pronomen hängt an (llámame).
`,
porpara: `
Das Geschenk ist für dich. | El regalo es para ti. | para | (por/para) |  |  | Empfänger (für dich bestimmt): para ti. Deinetwegen: por ti.
Danke für alles. | Gracias por todo. | por | (por/para) |  |  | Dank für etwas: gracias por.
Ich lerne Spanisch, um in Mexiko zu arbeiten. | Estudio español para trabajar en México. | para | (por/para) | Aprendo español para trabajar en México. |  | Zweck (um … zu): para + Infinitiv.
Wir sind durch den Park gegangen. | Caminamos por el parque. | por | (por/para) | Paseamos por el parque.;; Hemos caminado por el parque. |  | Bewegung durch einen Ort: por (por el parque).
Ich habe das Handy für 200 Euro gekauft. | Compré el móvil por 200 euros. | por | (por/para) | Compré el celular por 200 euros.;; He comprado el móvil por 200 euros. |  | Preis, Tausch (für 200 Euro): por.
Der Bericht muss bis Freitag fertig sein. | El informe tiene que estar listo para el viernes. | para | (por/para) | El informe tiene que estar terminado para el viernes.;; El informe debe estar listo para el viernes. |  | Frist (bis Freitag): para.
Wegen des Regens sind wir zu Hause geblieben. | Por la lluvia nos quedamos en casa. | Por | (por/para) | Nos quedamos en casa por la lluvia.;; A causa de la lluvia nos quedamos en casa.;; Debido a la lluvia nos quedamos en casa. |  | Grund (wegen): por. Auch: a causa de, debido a.
Für mich ist das zu teuer. | Para mí es demasiado caro. | Para | (por/para) |  |  | Meinung, Standpunkt (für mich): para mí.
Der Zug nach Sevilla fährt um zehn. | El tren para Sevilla sale a las diez. | para | (por/para) | El tren a Sevilla sale a las diez. |  | Ziel einer Fahrt: para (oder a).
Schick es mir per E-Mail. | Mándamelo por correo electrónico. | por | (por/para) | Envíamelo por correo.;; Mándamelo por email. |  | Mittel, Weg (per E-Mail, per Telefon): por.
Deshalb bin ich nicht gekommen. | Por eso no vine. | Por eso |  | Por eso no he venido. |  | por eso = deshalb (Grund).
Endlich! | ¡Por fin! | Por fin |  |  |  | Feste Wendung: por fin = endlich.
Ich habe das Buch für zehn Euro gekauft. | Compré el libro por diez euros. | por | (por/para) | He comprado el libro por diez euros. |  | Preis (für zehn Euro): por.
Der Zug nach Madrid fährt um acht. | El tren para Madrid sale a las ocho. | para | (por/para) | El tren a Madrid sale a las ocho. |  | Ziel einer Fahrt: para (oder a).
Danke für deine Hilfe. | Gracias por tu ayuda. | por | (por/para) |  |  | Dank für etwas: gracias por.
Ich brauche den Bericht bis Montag. | Necesito el informe para el lunes. | para | (por/para) |  |  | Frist (bis Montag): para.
Wir sind zwei Wochen durch Peru gereist. | Viajamos por Perú durante dos semanas. | por | (por/para) | Viajamos dos semanas por Perú.;; Hemos viajado por Perú durante dos semanas. |  | Bewegung durch ein Land: por (por Perú). Dauer: durante dos semanas.
Für sein Alter spricht er sehr gut. | Para su edad, habla muy bien. | Para | (por/para) |  |  | Vergleich mit dem Üblichen (für sein Alter): para.
So sehr ich es auch versuche, ich verstehe es nicht. | Por mucho que lo intente, no consigo entenderlo. | Por | (por/para) | Por más que lo intente, no consigo entenderlo.;; Por mucho que lo intento, no consigo entenderlo. | B2 | por mucho que = so sehr auch (danach Subjuntivo).
Dafür, dass es sein erster Roman ist, ist er sehr gut geschrieben. | Para ser su primera novela, está muy bien escrita. | Para | (por/para) |  | B2 | Dafür, dass (Vergleich mit dem Erwartbaren): para ser …
Sie haben meinen Flug gegen einen früheren getauscht. | Me cambiaron el vuelo por uno más temprano. | por | (por/para) |  | B2 | Tausch, Ersatz (gegen): por.
Ich habe es deinetwegen getan, nicht meinetwegen. | Lo hice por ti, no por mí. | por | (por/para) |  | B2 | Wegen, zuliebe (deinetwegen): por ti. Für dich bestimmt: para ti.
`,
pronombres: `
Ich gebe es dir morgen. | Te lo doy mañana. |  |  | Mañana te lo doy.;; Te lo daré mañana. |  | Erst das indirekte Objekt (te), dann das direkte (lo), beide vor dem Verb: te lo doy.
Kannst du es mir erklären? | ¿Me lo puedes explicar? |  |  | ¿Puedes explicármelo? |  | Vor das konjugierte Verb (me lo puedes explicar) oder an den Infinitiv (puedes explicármelo); erst me, dann lo.
Ich habe ihr die Wahrheit gesagt. | Le dije la verdad. |  |  | Le he dicho la verdad. |  | ihr (indirektes Objekt) = le, vor dem Verb: le dije la verdad.
Ich habe es ihr schon gesagt. | Ya se lo he dicho. |  |  | Ya se lo dije. |  | le + lo wird zu se lo; beide vor dem konjugierten Verb: se lo he dicho.
Wir wollen sie (die Wohnung) morgen sehen. | La queremos ver mañana. |  |  | Queremos verla mañana.;; Mañana la queremos ver.;; Mañana queremos verla. |  | la (sie, die Wohnung) vor das konjugierte Verb (la queremos ver) oder an den Infinitiv (queremos verla).
Er bringt uns zum Flughafen. | Nos lleva al aeropuerto. |  |  |  |  | uns = nos, vor dem Verb: nos lleva al aeropuerto. a + el = al.
Sag es ihm nicht! | ¡No se lo digas! |  |  |  |  | Verneinter Imperativ: Pronomen davor (no se lo digas). Nur der bejahte hängt sie an: díselo.
Ich schenke meiner Mutter Blumen. | Le regalo flores a mi madre. |  |  | A mi madre le regalo flores.;; Le regalo flores a mi mamá. |  | Das indirekte Objekt steht oft doppelt: le … a mi madre.
Ich kann ihn nicht finden. | No lo puedo encontrar. |  |  | No puedo encontrarlo. |  | ihn = lo, vor das konjugierte Verb (no lo puedo encontrar) oder an den Infinitiv (no puedo encontrarlo).
Wir sehen uns morgen. | Nos vemos mañana. |  |  | Mañana nos vemos. |  | Gegenseitig (wir sehen uns): nos vemos.
Ich bin gerade dabei, es zu machen. | Lo estoy haciendo. |  |  | Estoy haciéndolo. |  | Mit Gerundium: vor das konjugierte Verb (lo estoy haciendo) oder angehängt (estoy haciéndolo).
Ich schenke es ihr. | Se lo regalo. |  |  |  |  | le + lo wird zu se lo (se lo regalo = ich schenke es ihr).
Kannst du sie mir leihen? (die Bücher) | ¿Me los puedes prestar? |  |  | ¿Puedes prestármelos? |  | Erst me, dann los (die Bücher, männlich Mehrzahl), vor das Verb oder an den Infinitiv: puedes prestármelos.
Ich rufe dich später an. | Te llamo más tarde. |  |  | Más tarde te llamo.;; Te llamo luego.;; Te llamaré más tarde. |  | dich = te, vor dem Verb: te llamo.
Sie hat ihn nicht gesehen. | No lo ha visto. |  |  | No le ha visto.;; No lo vio. |  | ihn = lo; in Spanien für Personen auch le. Vor dem Verb, auch vor haber: no lo ha visto.
Ich habe ihn gestern gesehen. | Lo vi ayer. |  |  | Ayer lo vi.;; Le vi ayer.;; Ayer le vi. |  | ihn = lo (in Spanien für Personen auch le), vor dem Verb: lo vi.
Kannst du mir das Salz geben? | ¿Me pasas la sal? |  |  | ¿Me puedes pasar la sal?;; ¿Puedes pasarme la sal? |  | Bitte als Frage im Präsens: ¿Me pasas la sal? mir = me, vor dem Verb.
Ich schenke ihnen ein Buch. | Les regalo un libro. |  |  |  |  | ihnen (indirektes Objekt) = les: les regalo un libro.
Ich habe es dir doch gesagt. | Te lo dije. |  |  | Ya te lo dije.;; Te lo he dicho.;; Ya te lo he dicho. |  | Erst te, dann lo, vor dem Verb: te lo dije. doch = ya, oder es bleibt weg.
Wenn du das Auto brauchst, leihe ich es dir gern. | Si necesitas el coche, te lo dejo sin problema. |  |  | Si necesitas el coche, te lo presto sin problema.;; Si te hace falta el coche, te lo dejo sin problema.;; Si necesitas el carro, te lo presto sin problema.;; Si necesitas el auto, te lo presto sin problema. | B2 | Erst te, dann lo: te lo dejo. leihen = dejar oder prestar.
Ich habe es ihm schon dreimal erklärt, und er versteht es immer noch nicht. | Ya se lo he explicado tres veces y sigue sin entenderlo. |  |  | Ya se lo expliqué tres veces y sigue sin entenderlo. | B2 | le + lo wird zu se lo, vor dem konjugierten Verb (se lo he explicado); am Infinitiv hängt das Pronomen an (entenderlo).
Die Schlüssel? Die habe ich zu Hause liegen lassen. | ¿Las llaves? Me las dejé en casa. |  |  | ¿Las llaves? Las dejé en casa.;; ¿Las llaves? Me las he dejado en casa. | B2 | dejarse algo = etwas liegen lassen: me las dejé (mir + sie, vor dem Verb).
Sag es mir, wenn du es weißt. | Dímelo cuando lo sepas. |  |  | Avísame cuando lo sepas. | B2 | Bejahter Imperativ: Pronomen hängen an (dímelo), erst me, dann lo.
`,
gustar: `
Mir gefallen die Bücher. | Me gustan los libros. | gustan | (gustar) |  |  | gustar richtet sich nach dem, was gefällt: los libros (Mehrzahl), also gustan.
Ich liebe Musik. | Me encanta la música. | encanta | (encantar) |  |  | encantar wie gustar: Es richtet sich nach la música (Einzahl): me encanta.
Interessiert dich Politik? | ¿Te interesa la política? | interesa | (interesar) |  |  | interesar wie gustar: Es richtet sich nach la política: te interesa.
Mir tut der Kopf weh. | Me duele la cabeza. | duele | (doler) |  |  | doler wie gustar: Es richtet sich nach la cabeza (Einzahl): me duele. Körperteile mit Artikel, nicht mit mi.
Mir tun die Füße weh. | Me duelen los pies. | duelen | (doler) |  |  | doler richtet sich nach los pies (Mehrzahl): me duelen.
Uns fehlen noch zwei Stühle. | Todavía nos faltan dos sillas. | faltan | (faltar) | Nos faltan dos sillas.;; Aún nos faltan dos sillas. |  | faltar wie gustar: Es richtet sich nach dos sillas (Mehrzahl): nos faltan.
Was hältst du von der Idee? | ¿Qué te parece la idea? | parece | (parecer) |  |  | parecer wie gustar: ¿Qué te parece …? = Was hältst du von …? Das Verb richtet sich nach la idea.
Meinem Vater gefällt Fußball nicht. | A mi padre no le gusta el fútbol. | le gusta | (gustar) | A mi papá no le gusta el fútbol. |  | Die Person steht doppelt: a mi padre … le gusta. Das Verb richtet sich nach el fútbol: gusta.
Die Jacke steht dir gut. | La chaqueta te queda bien. | queda/sienta | (quedar) | La chaqueta te sienta bien. |  | quedar bien = gut stehen, wie gustar: Das Verb richtet sich nach la chaqueta.
Mich stört der Lärm. | Me molesta el ruido. | molesta | (molestar) | El ruido me molesta. |  | molestar wie gustar: Es richtet sich nach el ruido: me molesta.
Gefallen dir die Fotos? | ¿Te gustan las fotos? | gustan | (gustar) |  |  | gustar richtet sich nach las fotos (Mehrzahl): te gustan.
Uns gefällt die Stadt sehr. | Nos gusta mucho la ciudad. | gusta | (gustar) | La ciudad nos gusta mucho. |  | gustar richtet sich nach la ciudad (Einzahl): nos gusta. mucho steht nach dem Verb.
Ihr schmeckt der Kaffee nicht. | No le gusta el café. | gusta | (gustar) | El café no le gusta.;; A ella no le gusta el café. |  | schmecken im Sinn von mögen = gustar: no le gusta el café. ihr = le.
Das ist mir egal. | Me da igual. | da | (dar igual) |  |  | Feste Wendung: me da igual = das ist mir egal.
Stört es dich, wenn ich das Fenster öffne? | ¿Te molesta si abro la ventana? | molesta | (molestar) |  |  | Was stört, ist ein ganzer Satz (si abro …): Verb im Singular, te molesta.
Hast du Lust auf ein Eis? | ¿Te apetece un helado? | apetece | (apetecer) |  |  | apetecer wie gustar: ¿Te apetece …? = Hast du Lust auf …?
Es stört mich, wenn Leute im Kino telefonieren. | Me molesta que la gente hable por teléfono en el cine. | molesta | (molestar) | Me molesta que la gente hable por el móvil en el cine. | B2 | Was stört, ist ein ganzer Satz: Verb im Singular (me molesta), danach que + Subjuntivo (hable).
Meine Eltern würden dich sehr gern kennenlernen. | A mis padres les encantaría conocerte. | encantaría | (encantar) |  | B2 | Was gefällt, ist ein Infinitiv (conocerte): Verb im Singular, hier im Konditional (encantaría).
Uns bleiben nur noch zwei Urlaubstage. | Nos quedan solo dos días de vacaciones. | quedan | (quedar) | Solo nos quedan dos días de vacaciones. | B2 | quedar (übrig sein) wie gustar: Es richtet sich nach dos días (Mehrzahl): nos quedan.
Es tut mir leid, dass du so früh gehst. | Me da pena que te vayas tan pronto. | da pena/da lástima | (dar pena) | Me da lástima que te vayas tan pronto. | B2 | Feste Wendung: me da pena que = es tut mir leid, dass; danach Subjuntivo (te vayas).
`,
condicional: `
Ich hätte gern einen Kaffee. | Me gustaría un café. | gustaría | (gustar) | Quería un café.;; Quisiera un café. |  | Höflicher Wunsch: Konditional, me gustaría = ich hätte gern.
Du solltest mehr schlafen. | Deberías dormir más. | Deberías | (deber) | Tendrías que dormir más. |  | Rat: Konditional von deber, deberías = du solltest.
Könntest du mir helfen? | ¿Podrías ayudarme? | Podrías | (poder) | ¿Me podrías ayudar? |  | Höfliche Bitte: Konditional, podrías = könntest du (Stamm podr-).
Wenn ich Zeit hätte, würde ich mehr reisen. | Si tuviera tiempo, viajaría más. | tuviera/tuviese | (tener) | Si tuviese tiempo, viajaría más. |  | Irreal (gedacht, nicht wirklich): si + Imperfecto de subjuntivo (tuviera), im Hauptsatz Konditional (viajaría).
Wenn es morgen regnet, bleiben wir zu Hause. | Si llueve mañana, nos quedamos en casa. | llueve | (llover) | Si llueve mañana, nos quedaremos en casa. |  | Realer Fall, der eintreten kann: si + Präsens (si llueve). Im si-Satz (wenn) nie Futur, Konditional oder Subjuntivo Präsens.
An deiner Stelle würde ich das nicht machen. | Yo en tu lugar no lo haría. | haría | (hacer) | Yo que tú, no lo haría.;; En tu lugar, no lo haría. |  | Rat mit yo en tu lugar: Konditional, hacer hat den Stamm har- (haría).
Wenn ich reich wäre, würde ich ein Haus am Meer kaufen. | Si fuera rico, compraría una casa junto al mar. | compraría | (comprar) | Si fuera rica, compraría una casa junto al mar.;; Si fuera rico, compraría una casa en la playa. |  | Irreal: si + Imperfecto de subjuntivo (fuera), im Hauptsatz Konditional (compraría).
Was würdest du tun? | ¿Qué harías? | harías | (hacer) |  |  | Gedachte Situation: Konditional, harías = würdest du tun; hacer hat den Stamm har-.
Es wäre besser, morgen zu gehen. | Sería mejor ir mañana. | Sería | (ser) |  |  | Abgeschwächte Aussage: Konditional, sería = es wäre.
Würdest du mir das Salz reichen? | ¿Me pasarías la sal? | pasarías | (pasar) |  |  | Höfliche Bitte („würdest du“): Konditional, pasarías.
Wenn ich du wäre, würde ich das Angebot annehmen. | Yo que tú, aceptaría la oferta. | aceptaría | (aceptar) | Si fuera tú, aceptaría la oferta.;; En tu lugar, aceptaría la oferta. |  | Rat mit yo que tú: Konditional (aceptaría).
Ich würde dich sehr gern sehen. | Me encantaría verte. | encantaría | (encantar) |  |  | Wunsch: Konditional, me encantaría = ich würde sehr gern.
Wenn es nicht regnen würde, würden wir spazieren gehen. | Si no lloviera, saldríamos a pasear. | saldríamos | (salir) | Si no lloviese, saldríamos a pasear. |  | Irreal: si + lloviera, im Hauptsatz Konditional; salir hat den Stamm saldr- (saldríamos).
Was würdest du an meiner Stelle sagen? | ¿Qué dirías tú en mi lugar? | dirías | (decir) | ¿Qué dirías en mi lugar? |  | Gedachte Situation: Konditional, decir hat den Stamm dir- (dirías).
Wir könnten morgen ins Kino gehen. | Podríamos ir al cine mañana. | Podríamos | (poder) | Mañana podríamos ir al cine. |  | Vorschlag: Konditional, podríamos = wir könnten (Stamm podr-).
Wenn ich du wäre, würde ich das nicht machen. | Yo que tú, no lo haría. | haría | (hacer) | Yo en tu lugar no lo haría.;; En tu lugar no lo haría.;; Yo que tú no lo haría. |  | Rat mit yo que tú: Konditional, hacer hat den Stamm har- (haría).
Es wäre toll, dich zu sehen. | Sería genial verte. | Sería/Estaría | (ser) | Sería estupendo verte.;; Estaría genial verte. |  | Gedachte Situation: Konditional, sería = es wäre.
Würdest du mit mir ins Kino gehen? | ¿Irías al cine conmigo? | Irías | (ir) |  |  | Höfliche Frage, Einladung: Konditional, irías = würdest du gehen.
An deiner Stelle würde ich nichts unterschreiben, ohne es vorher zu lesen. | Yo en tu lugar no firmaría nada sin leerlo antes. | firmaría | (firmar) | Yo que tú no firmaría nada sin leerlo antes. | B2 | Rat mit yo en tu lugar: Konditional (firmaría).
Wenn du mir Bescheid gesagt hättest, hätte ich dich am Bahnhof abgeholt. | Si me hubieras avisado, te habría recogido en la estación. | habría recogido/hubiera recogido | (recoger) | Si me hubieras avisado, te hubiera recogido en la estación.;; Si me hubieses avisado, te habría recogido en la estación. | B2 | Irreal in der Vergangenheit: si + hubiera + Partizip, im Hauptsatz habría (oder hubiera) + Partizip.
Es dürfte etwa zehn gewesen sein, als er ankam. | Serían las diez cuando llegó. | Serían/Eran | (ser) | Eran más o menos las diez cuando llegó. | B2 | Vermutung über die Vergangenheit: Konditional, serían las diez = es dürfte etwa zehn gewesen sein.
Würde es dir etwas ausmachen, das Fenster zu schließen? | ¿Te importaría cerrar la ventana? | importaría | (importar) |  | B2 | Höfliche Bitte: Konditional, ¿te importaría …? = würde es dir etwas ausmachen …?
`,
reflexivo: `
Ich stehe um sieben auf. | Me levanto a las siete. | Me levanto | (levantarse) |  |  | levantarse = aufstehen; das Pronomen steht vor dem Verb: me levanto.
Ich habe vergessen, dir zu schreiben. | Se me olvidó escribirte. | Se me olvidó/Olvidé/Me olvidé de | (olvidarse) | Olvidé escribirte.;; Me olvidé de escribirte. |  | Versehen: se me olvidó = es ist mir entfallen (auch: olvidé, me olvidé de).
Ich erinnere mich nicht an ihren Namen. | No me acuerdo de su nombre. | me acuerdo de/recuerdo | (acordarse) | No recuerdo su nombre. |  | acordarse de (me acuerdo de) oder recordar ohne Pronomen und ohne de (recuerdo su nombre).
Wir gehen jetzt. | Ya nos vamos. | nos vamos | (irse) | Nos vamos ya. |  | irse = weggehen (ya nos vamos = wir gehen jetzt); ir = irgendwohin gehen.
Mir ist das Glas runtergefallen. | Se me cayó el vaso. | Se me cayó | (caerse) |  |  | Versehen: se me cayó = es ist mir runtergefallen; das Verb richtet sich nach dem, was fällt (el vaso).
Hier spricht man Spanisch. | Aquí se habla español. | se habla | (hablar) |  |  | Unpersönliches se: se habla = man spricht.
Ich habe gemerkt, dass ich müde war. | Me di cuenta de que estaba cansado. | Me di cuenta de | (darse cuenta) | Me di cuenta de que estaba cansada. |  | darse cuenta de que = merken, dass; das de bleibt vor que. Zustand (müde): Imperfecto (estaba).
Sie bleibt zu Hause. | Se queda en casa. | Se queda | (quedarse) | Ella se queda en casa. |  | quedarse = bleiben (an einem Ort): se queda en casa.
Wie heißt du? | ¿Cómo te llamas? | te llamas | (llamarse) |  |  | llamarse = heißen: ¿Cómo te llamas?
Er duscht jeden Morgen. | Se ducha todas las mañanas. | Se ducha | (ducharse) | Se ducha cada mañana. |  | ducharse = duschen; jeden Morgen = todas las mañanas oder cada mañana.
Wir haben uns verlaufen. | Nos hemos perdido. | Nos hemos perdido/Nos perdimos | (perderse) | Nos perdimos. |  | perderse = sich verlaufen: nos hemos perdido (in Lateinamerika üblich: nos perdimos).
Er hat sich das Bein gebrochen. | Se ha roto la pierna. | Se ha roto/Se rompió | (romperse) | Se rompió la pierna. |  | Körperteil mit Artikel statt Possessiv: se ha roto la pierna (sein Bein).
Ich ziehe mich schnell an. | Me visto rápido. | Me visto | (vestirse) | Me visto rápidamente. |  | vestirse = sich anziehen; e wird zu i: me visto.
Sie hat sich die Haare gewaschen. | Se ha lavado el pelo. | Se ha lavado/Se lavó | (lavarse) | Se lavó el pelo. |  | Körperteil mit Artikel statt Possessiv: se ha lavado el pelo (ihre Haare).
Ich habe mich geirrt. | Me he equivocado. | Me he equivocado/Me equivoqué | (equivocarse) | Me equivoqué. |  | equivocarse = sich irren: me he equivocado (in Lateinamerika üblich: me equivoqué).
Wir treffen uns um acht vor dem Kino. | Nos vemos a las ocho delante del cine. | Nos vemos/Quedamos/Nos encontramos | (verse) | Quedamos a las ocho delante del cine.;; Nos encontramos a las ocho delante del cine. |  | verse = sich treffen, sehen; in Spanien auch quedar (quedamos a las ocho).
Er hat sich beim Fußball verletzt. | Se lesionó jugando al fútbol. | Se lesionó/Se hizo daño/Se ha lesionado | (lesionarse) | Se hizo daño jugando al fútbol.;; Se ha lesionado jugando al fútbol.;; Se lesionó jugando fútbol. |  | lesionarse = sich verletzen (beim Sport); auch hacerse daño. beim Fußball = jugando al fútbol.
Ich ziehe mich schnell um. | Me cambio rápido. | Me cambio | (cambiarse) | Me cambio de ropa rápido.;; Me cambio rápidamente. |  | cambiarse (de ropa) = sich umziehen.
Ich habe mich sehr gefreut. | Me alegré mucho. | Me alegré/Me he alegrado | (alegrarse) | Me he alegrado mucho. |  | alegrarse = sich freuen: me alegré mucho.
Ich habe zu spät gemerkt, dass ich im falschen Zug saß. | Me di cuenta demasiado tarde de que me había equivocado de tren. | Me di cuenta | (darse cuenta) |  | B2 | darse cuenta de que = merken, dass. equivocarse de tren = in den falschen Zug steigen; vorher geschehen: me había equivocado.
Mach dir keine Sorgen, mir wird schon etwas einfallen. | No te preocupes, ya se me ocurrirá algo. | se me ocurrirá | (ocurrirse) |  | B2 | se me ocurre = mir fällt ein; das Verb richtet sich nach dem Einfall (algo).
Wir haben seinen Geburtstag völlig vergessen. | Se nos olvidó por completo su cumpleaños. | Se nos olvidó/Nos olvidamos | (olvidarse) | Nos olvidamos por completo de su cumpleaños. | B2 | Versehen: se nos olvidó = es ist uns entfallen; das Verb richtet sich nach dem Vergessenen (su cumpleaños).
Mit der Zeit gewöhnst du dich an den Rhythmus der Stadt. | Con el tiempo te acostumbrarás al ritmo de la ciudad. | te acostumbrarás | (acostumbrarse) | Con el tiempo te vas a acostumbrar al ritmo de la ciudad.;; Con el tiempo te acostumbras al ritmo de la ciudad. | B2 | acostumbrarse a = sich gewöhnen an; a + el = al.
`,
preposiciones: `
Ich sehe meine Schwester. | Veo a mi hermana. | a |  |  |  | Person als direktes Objekt: persönliches a (veo a mi hermana).
Ich denke viel an dich. | Pienso mucho en ti. | en |  |  |  | pensar en = denken an.
Ich träume von einer Reise nach Chile. | Sueño con un viaje a Chile. | con |  |  |  | soñar con = träumen von.
Das hängt vom Wetter ab. | Depende del tiempo. | del |  | Eso depende del tiempo.;; Depende del clima. |  | depender de = abhängen von; de + el = del. Für das Wetter sagt man in Lateinamerika oft el clima.
Sie hat ihn geheiratet. | Se casó con él. | con |  |  |  | casarse con = heiraten (jemanden).
Wir sind im Kino. | Estamos en el cine. | en |  |  |  | Ort (wo?): en (en el cine).
Wir gehen ins Kino. | Vamos al cine. | al |  |  |  | Richtung (wohin?): a, mit el zusammengezogen zu al.
Ich wohne seit drei Jahren hier. | Vivo aquí desde hace tres años. | desde hace/hace |  | Llevo tres años viviendo aquí.;; Vivo aquí hace tres años.;; Hace tres años que vivo aquí. |  | seit + Zeitdauer: desde hace (desde hace tres años), auch hace tres años que vivo aquí oder llevo tres años viviendo aquí.
Er braucht lange, um zu antworten. | Tarda mucho en responder. | en |  | Tarda mucho en contestar. |  | tardar en = (lange) brauchen, um zu.
Sie hat sich in Pablo verliebt. | Se enamoró de Pablo. | de |  |  |  | enamorarse de = sich verlieben in.
Ich habe vor zwei Wochen angefangen. | Empecé hace dos semanas. | hace |  | Comencé hace dos semanas. |  | vor (zeitlich): hace (hace dos semanas).
Ich habe Angst vor Hunden. | Tengo miedo a los perros. | a/de |  | Tengo miedo de los perros. |  | Angst vor: miedo a oder miedo de.
Sie ist mit einem Spanier verheiratet. | Está casada con un español. | con |  |  |  | casado con = verheiratet mit.
Wir fahren mit dem Zug. | Vamos en tren. | en |  | Viajamos en tren. |  | Verkehrsmittel: en (en tren, en coche); zu Fuß: a pie.
Ich besuche meine Großeltern. | Visito a mis abuelos. | a |  |  |  | Personen als direktes Objekt: persönliches a (visito a mis abuelos).
Ich bin seit Montag krank. | Estoy enfermo desde el lunes. | desde |  | Estoy enferma desde el lunes. |  | seit + Zeitpunkt: desde (desde el lunes); seit + Dauer: desde hace.
Das hängt davon ab, was der Chef entscheidet. | Esto depende de lo que decida el jefe. | de |  | Eso depende de lo que decida el jefe. | B2 | depender de = abhängen von (de lo que …).
Am Ende habe ich mich für die kleinere Wohnung entschieden. | Al final me decidí por el piso más pequeño. | por |  | Al final me decidí por el apartamento más pequeño.;; Al final opté por el piso más pequeño. | B2 | decidirse por = sich entscheiden für.
Er beschwert sich immer über alles, tut aber nie etwas. | Siempre se queja de todo, pero nunca hace nada. | de |  |  | B2 | quejarse de = sich beschweren über.
Meine Schwester hat einen Mann aus Bilbao geheiratet. | Mi hermana se casó con un chico de Bilbao. | con |  | Mi hermana se casó con un hombre de Bilbao. | B2 | casarse con = heiraten (jemanden).
`,
falsos: `
Meine Firma ist in Madrid. | Mi empresa está en Madrid. | empresa/compañía |  | Mi compañía está en Madrid. |  | Firma = empresa. Spanisch „firma“ heißt Unterschrift.
Nimm einen Mantel mit, es ist kalt. | Llévate un abrigo, hace frío. | abrigo |  | Llévate un abrigo, que hace frío.;; Lleva un abrigo, hace frío. |  | Mantel = abrigo. Spanisch „mantel“ heißt Tischdecke.
Mein Sohn geht aufs Gymnasium. | Mi hijo va al instituto. | instituto/colegio |  | Mi hijo va al colegio. |  | Gymnasium = instituto. Spanisch „gimnasio“ heißt Fitnessstudio.
Meine Eltern bekommen eine gute Rente. | Mis padres cobran una buena pensión. | pensión/jubilación |  | Mis padres reciben una buena pensión.;; Mis padres cobran una buena jubilación. |  | Rente = pensión (oder jubilación). Spanisch „renta“ heißt Einkommen.
Die Konkurrenz ist groß. | La competencia es grande. | competencia |  | Hay mucha competencia. |  | Konkurrenz = competencia. Spanisch „concurrencia“ heißt Andrang, Publikum.
Hast du einen Prospekt vom Hotel? | ¿Tienes un folleto del hotel? | folleto |  |  |  | Prospekt = folleto. Spanisch „prospecto“ heißt Beipackzettel.
Ich gehe ins Fitnessstudio. | Voy al gimnasio. | gimnasio |  | Me voy al gimnasio. |  | Fitnessstudio = gimnasio. Das deutsche Gymnasium heißt instituto.
Unterschreib hier, bitte. | Firma aquí, por favor. | Firma |  |  |  | unterschreiben = firmar (firma aquí). Die Firma heißt empresa.
Die Tischdecke ist schmutzig. | El mantel está sucio. | mantel |  |  |  | Tischdecke = mantel. Der Mantel heißt abrigo.
Mein Lehrer ist sehr geduldig. | Mi profesor es muy paciente. | profesor/maestro |  | Mi maestro es muy paciente. |  | Spanisch „profesor“ ist jeder Lehrer, nicht nur an der Uni; maestro vor allem in der Grundschule.
Ich habe dir Pralinen mitgebracht. | Te he traído bombones. | bombones |  | Te traje bombones. |  | Pralinen = bombones. Ein Bonbon heißt caramelo.
Vor dem Kino ist eine lange Schlange. | Hay una cola larga delante del cine. | cola |  | Hay una larga cola delante del cine. |  | Warteschlange = cola. Die Schlange als Tier heißt serpiente.
Die Schuhe waren ein Schnäppchen. | Los zapatos fueron una ganga. | ganga |  | Los zapatos fueron un chollo.;; Los zapatos eran una ganga. |  | Schnäppchen = ganga (umgangssprachlich auch chollo).
Die Fernbedienung braucht neue Batterien. | El mando necesita pilas nuevas. | pilas |  | El mando a distancia necesita pilas nuevas.;; El control remoto necesita pilas nuevas. |  | Batterien (für Geräte) = pilas. Spanisch „batería“ ist ein Akku, eine Autobatterie oder das Schlagzeug.
Ich bin erkältet. | Estoy constipado. | constipado/resfriado/constipada/resfriada |  | Estoy resfriado.;; Estoy constipada.;; Estoy resfriada. |  | erkältet = constipado (oder resfriado). Verstopft heißt estreñido.
Die Ausgaben sind gestiegen. | Los gastos han subido. | gastos |  | Los gastos han aumentado.;; Los gastos subieron. |  | Ausgaben (Kosten) = gastos. Die Ausgabe eines Buchs heißt edición.
`
}
};

const WRITE_PROMPTS = [
  'Erzähl, was du letztes Wochenende gemacht hast.',
  'Beschreib deine Wohnung oder dein Zimmer.',
  'Wie sieht ein typischer Montag bei dir aus?',
  'Erzähl von deiner letzten Reise.',
  'Was würdest du mit einem Lottogewinn machen?',
  'Beschreib einen Freund oder eine Freundin.',
  'Was hast du heute gegessen, und was isst du am liebsten?',
  'Was planst du für den nächsten Sommer?',
  'Erzähl von einem Film oder einer Serie, die du magst.',
  'Was nervt dich im Alltag?',
  'Wo hast du als Kind gewohnt, und wie war es dort?',
  'Was machst du beruflich, und was gefällt dir daran?',
  'Warum lernst du diese Sprache?',
  'Beschreib deinen Lieblingsort in deiner Stadt.',
  'Was hast du gestern Abend gemacht?',
  'Erzähl von einem Missgeschick, das dir passiert ist.',
  'Was würdest du ändern, wenn du Bürgermeister wärst?',
  'Beschreib dein Lieblingsessen und wie man es zubereitet.',
  'Was hast du als Kind gern gespielt?',
  'Erzähl von einem Buch, das dich beeindruckt hat.',
  'Was machst du, wenn du schlecht gelaunt bist?',
  'Beschreib dein Wetter heute und was du dabei am liebsten machst.',
  'Was war die beste Entscheidung, die du je getroffen hast?',
  'Wohin würdest du gern einmal reisen, und warum?',
  'Erzähl von deinem letzten Einkauf.',
  'Was gefällt dir an deinem Wohnort, was nicht?',
  'Beschreib einen ganz normalen Sonntag.',
  'Erzähl von einem Konzert, Spiel oder Fest, bei dem du warst.',
  'Was hast du in letzter Zeit Neues gelernt?',
  'Wie hat sich dein Alltag in den letzten Jahren verändert?',
  'Erzähl einem neuen Kollegen, wie dein Arbeitstag aussieht.',
  'Schreib eine kurze Nachricht an einen Freund, den du lange nicht gesehen hast.',
  'Du hast etwas im Zug vergessen. Schreib an das Fundbüro.',
  'Beschreib ein Foto auf deinem Handy.',
  'Was würdest du tun, wenn du einen Tag lang unsichtbar wärst?',
  'Erzähl von einem Tier, das du kennst oder hattest.',
  'Was isst und trinkst du zum Frühstück, und war das schon immer so?',
  'Beschreib, wie du am liebsten Urlaub machst.',
  'Was nimmst du mit, wenn du für eine Woche verreist?',
  'Erzähl, wie du jemanden kennengelernt hast, der dir wichtig ist.',
  'Welche Gewohnheit möchtest du dir zulegen, und welche loswerden?',
  'Beschreib die Jahreszeit, die du am liebsten magst.',
  'Was war heute das Beste an deinem Tag?',
  'Schreib eine Bewertung für ein Restaurant, in dem du warst.'
];
