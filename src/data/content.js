/* Satzbank. Format pro Zeile: Deutsch | Ziel | Lücke (Alternativen mit /) | Hinweis | Alternativen (mit ;;) */
const CONTENT = {
sv: {
bisats: `
Ich weiß, dass er heute nicht kommt. | Jag vet att han inte kommer idag. | | |
Sie sagt, dass sie keine Zeit hat. | Hon säger att hon inte har tid. | | |
Ich bleibe zu Hause, weil ich mich nicht gut fühle. | Jag stannar hemma eftersom jag inte mår bra. | | | Jag stannar hemma för att jag inte mår bra.
Wir machen einen Spaziergang, wenn es nicht regnet. | Vi tar en promenad om det inte regnar. | | |
Das ist der Film, den ich noch nie gesehen habe. | Det är filmen som jag aldrig har sett. | | |
Er fragt, ob ich auch kommen will. | Han frågar om jag också vill komma. |  |  |  |  | Im Nebensatz steht auch „också“ vor dem Verb: … om jag också vill komma.
Ich glaube, dass sie immer zu spät kommt. | Jag tror att hon alltid kommer för sent. | | |
Ruf an, wenn du nicht kommen kannst. | Ring om du inte kan komma. | | | Ring mig om du inte kan komma.
Ich verstehe nicht, warum er nie antwortet. | Jag förstår inte varför han aldrig svarar. |  |  |  |  | Im Hauptsatz steht „inte“ nach dem Verb (förstår inte), im Nebensatz „aldrig“ davor (… varför han aldrig svarar).
Weißt du, ob das Restaurant heute geöffnet hat? | Vet du om restaurangen har öppet idag? |  |  | Vet du om restaurangen är öppen idag? |  | Indirekte Frage mit om (ob): erst das Subjekt, dann das Verb, und es wandert nicht ans Ende: … om restaurangen har öppet.
Sie ist traurig, weil ihr Freund sie nicht angerufen hat. | Hon är ledsen eftersom hennes pojkvän inte har ringt henne. | | | Hon är ledsen för att hennes pojkvän inte har ringt henne.
Ich hoffe, dass du dich bald besser fühlst. | Jag hoppas att du snart mår bättre. | | | Jag hoppas att du mår bättre snart.
Obwohl er viel arbeitet, hat er nie Stress. | Fast han jobbar mycket har han aldrig stress. |  |  | Trots att han jobbar mycket har han aldrig stress.;; Fast han arbetar mycket har han aldrig stress. |  | Steht der Nebensatz vorn, folgt im Hauptsatz erst das Verb, dann das Subjekt: … har han aldrig stress. „aldrig“ steht dort nach dem Subjekt.
Wir können nicht gehen, bevor alle gegessen haben. | Vi kan inte gå innan alla har ätit. |  |  |  |  | Im Hauptsatz steht „inte“ nach dem Verb (kan inte gå). Im Nebensatz wandert das Verb nicht ans Ende: … innan alla har ätit.
Sag Bescheid, wenn du nicht mehr kannst. | Säg till om du inte orkar mer. | | | Säg till när du inte orkar mer.
Ich bin froh, dass es nicht regnet. | Jag är glad att det inte regnar. | | | Jag är glad över att det inte regnar.
Es ist schade, dass du nicht mitkommen kannst. | Det är synd att du inte kan följa med. | | |
Er sagt, dass er nie Fleisch isst. | Han säger att han aldrig äter kött. | | |
Ich frage mich, warum sie nicht antwortet. | Jag undrar varför hon inte svarar. | | |
Wenn ich keine Lust habe, bleibe ich zu Hause. | Om jag inte har lust stannar jag hemma. |  |  | När jag inte har lust stannar jag hemma. |  | Im Nebensatz steht „inte“ vor dem Verb (om jag inte har lust). Steht der Nebensatz vorn, folgt im Hauptsatz erst das Verb, dann das Subjekt: stannar jag.
Obwohl wir uns lange nicht gesehen hatten, erkannte ich sie sofort. | Fast vi inte hade setts på länge kände jag igen henne direkt. |  |  | Trots att vi inte hade setts på länge kände jag igen henne direkt.;; Fast vi inte hade träffats på länge kände jag igen henne direkt.;; Trots att vi inte hade träffats på länge kände jag igen henne direkt. | B2 | Im Nebensatz steht „inte“ vor dem Verb (fast vi inte hade setts). Danach im Hauptsatz erst das Verb, dann das Subjekt: kände jag igen.
Er behauptet, dass er die E-Mail nie bekommen hat. | Han påstår att han aldrig har fått mejlet. |  |  | Han påstår att han aldrig fick mejlet.;; Han hävdar att han aldrig har fått mejlet.;; Han hävdar att han aldrig fick mejlet. | B2
Ich wäre gekommen, wenn ich gewusst hätte, dass du nicht allein bist. | Jag hade kommit om jag hade vetat att du inte var ensam. |  |  | Jag skulle ha kommit om jag hade vetat att du inte var ensam.;; Jag hade kommit om jag hade vetat att du inte är ensam. | B2
Kein Wunder, dass die Leute nicht mehr Zug fahren, wenn die Züge ständig Verspätung haben. | Det är inte konstigt att folk inte åker tåg längre när tågen hela tiden är försenade. |  |  | Det är inte konstigt att folk slutar åka tåg när tågen hela tiden är försenade.;; Det är inte konstigt att folk inte längre åker tåg när tågen hela tiden är försenade.;; Det är inte konstigt att folk inte åker tåg längre när tågen ständigt är försenade.;; Det är inte konstigt att folk inte åker tåg längre när tågen är försenade hela tiden. | B2
`,
inversion: `
Heute arbeite ich nicht. | Idag jobbar jag inte. | | | Idag arbetar jag inte.;; Jag jobbar inte idag.
Morgen fahren wir nach Göteborg. | I morgon åker vi till Göteborg. | | | Vi åker till Göteborg i morgon.
Am Wochenende schlafe ich immer lange. | På helgen sover jag alltid länge. | | | På helgerna sover jag alltid länge.;; Jag sover alltid länge på helgen.
Jetzt verstehe ich das. | Nu förstår jag det. | | | Jag förstår det nu.
Im Sommer wohnen sie auf dem Land. | På sommaren bor de på landet. | | | De bor på landet på sommaren.
Leider kann ich nicht kommen. | Tyvärr kan jag inte komma. | | | Jag kan tyvärr inte komma.
Den Film habe ich schon gesehen. | Den filmen har jag redan sett. | | | Jag har redan sett den filmen.
Wenn ich nach Hause komme, koche ich. | När jag kommer hem lagar jag mat. | | | Jag lagar mat när jag kommer hem.
Normalerweise trinke ich keinen Kaffee. | Vanligtvis dricker jag inte kaffe. | | | Normalt dricker jag inte kaffe.;; Jag dricker vanligtvis inte kaffe.
Um acht Uhr beginnt der Kurs. | Klockan åtta börjar kursen. | | | Kursen börjar klockan åtta.
Vielleicht kommt sie später. | Kanske kommer hon senare. |  |  | Kanske hon kommer senare.;; Hon kommer kanske senare. |  | Nach „kanske“ vorn geht beides: kanske kommer hon (Inversion) oder kanske hon kommer.
In Schweden trinkt man viel Kaffee. | I Sverige dricker man mycket kaffe. | | | Man dricker mycket kaffe i Sverige.
Nach dem Essen machen wir einen Spaziergang. | Efter maten tar vi en promenad. | | | Vi tar en promenad efter maten.
Heute Abend sehe ich ihn nicht. | Ikväll träffar jag honom inte. | | | Ikväll träffar jag inte honom.;; Jag träffar honom inte ikväll.;; Jag träffar inte honom ikväll.
Im Winter wird es früh dunkel. | På vintern blir det mörkt tidigt. | | | Det blir mörkt tidigt på vintern.
Nach der Arbeit gehe ich oft ins Fitnessstudio. | Efter jobbet går jag ofta till gymmet. | | | Efter jobbet går jag ofta på gym.;; Efter arbetet går jag ofta till gymmet.;; Jag går ofta till gymmet efter jobbet.
Zum Glück hat niemand etwas gemerkt. | Som tur var märkte ingen något. | | | Lyckligtvis märkte ingen något.;; Som tur var märkte ingen någonting.;; Ingen märkte något, som tur var.
Vielleicht regnet es morgen. | Kanske regnar det i morgon. |  |  | Det regnar kanske i morgon.;; Kanske det regnar i morgon. |  | Nach „kanske“ vorn geht beides: kanske regnar det (Inversion) oder kanske det regnar.
Hier wohne ich seit fünf Jahren. | Här har jag bott i fem år. | | | Jag har bott här i fem år.
Morgen früh muss ich arbeiten. | I morgon bitti måste jag jobba. | | | I morgon bitti måste jag arbeta.;; Jag måste jobba i morgon bitti.
Hätte ich das früher gewusst, hätte ich anders gehandelt. | Hade jag vetat det tidigare hade jag gjort annorlunda. |  |  | Om jag hade vetat det tidigare hade jag gjort annorlunda.;; Hade jag vetat det tidigare skulle jag ha gjort annorlunda.;; Om jag hade vetat det tidigare skulle jag ha gjort annorlunda.;; Hade jag vetat det tidigare hade jag handlat annorlunda.;; Jag hade gjort annorlunda om jag hade vetat det tidigare. | B2 | Bedingung ohne om: Das Verb steht vorn (Hade jag vetat …), wie im Deutschen „Hätte ich …“. Danach im Hauptsatz erst das Verb, dann das Subjekt: hade jag gjort.
Erst als es dunkel wurde, merkten wir, wie spät es war. | Först när det blev mörkt märkte vi hur sent det var. |  |  |  | B2
Trotz des schlechten Wetters kamen fast alle zum Fest. | Trots det dåliga vädret kom nästan alla till festen. |  |  | Nästan alla kom till festen trots det dåliga vädret. | B2
Am meisten vermisse ich die langen Sommerabende. | Mest saknar jag de långa sommarkvällarna. |  |  | Jag saknar de långa sommarkvällarna mest.;; Det jag saknar mest är de långa sommarkvällarna. | B2
`,
tempus: `
Gestern habe ich einen alten Freund getroffen. | Igår träffade jag en gammal vän. | träffade | (träffa) |
Letztes Jahr sind wir nach Norwegen gefahren. | Förra året åkte vi till Norge. | åkte | (åka) |
Ich habe den Film noch nie gesehen. | Jag har aldrig sett filmen. | har aldrig sett | (se) |
Als ich Kind war, habe ich in Uppsala gewohnt. | När jag var barn bodde jag i Uppsala. | bodde | (bo) |  |  | Zeit in der Vergangenheit (när jag var barn): Präteritum (bodde).
Wann bist du angekommen? | När kom du fram? | kom | (komma fram) |  |  | Frage nach dem Zeitpunkt (när?): Präteritum, auch wenn man im Deutschen „bist angekommen“ sagt.
Ich habe gerade gegessen. | Jag har precis ätit. | har precis ätit/har just ätit | (äta) | Jag har just ätit.
Wir haben uns 2019 kennengelernt. | Vi träffades 2019. | träffades/träffade varandra | (träffas) |
Sie hat mir gestern eine Nachricht geschickt. | Hon skickade ett meddelande till mig igår. | skickade | (skicka) | Hon skickade mig ett meddelande igår.
Wann hast du das Buch gelesen? | När läste du boken? | läste | (läsa) |  |  | Frage nach dem Zeitpunkt (när?): Präteritum (läste).
Ich habe schon gegessen. | Jag har redan ätit. | har redan ätit | (äta) |
Letzten Sommer haben wir viel gebadet. | I somras badade vi mycket. | badade | (bada) | Vi badade mycket i somras.
Vorgestern hat es den ganzen Tag geregnet. | I förrgår regnade det hela dagen. | regnade | (regna) |
Hast du schon gegessen? | Har du ätit? | Har du ätit | (äta) | Har du redan ätit?;; Har du ätit än?
Wir haben uns letzten Sommer kennengelernt. | Vi träffades i somras. | träffades | (träffas) | Vi lärde känna varandra i somras.;; I somras träffades vi.
Ich habe gerade eine Nachricht bekommen. | Jag har precis fått ett meddelande. | har precis fått/fick precis | (få) | Jag fick precis ett meddelande.
Als ich nach Hause kam, schlief sie schon. | När jag kom hem sov hon redan. | sov | (sova) |  |  | Zeitpunkt in der Vergangenheit (när jag kom hem): Präteritum (sov).
Sie hat drei Jahre in Malmö gewohnt, jetzt wohnt sie in Umeå. | Hon bodde i Malmö i tre år, nu bor hon i Umeå. | bodde | (bo) |  |  | Abgeschlossen (jetzt wohnt sie woanders): Präteritum (bodde). Perfekt nur, wenn es bis heute andauert.
Hast du das Buch zu Ende gelesen? | Har du läst ut boken? | Har du läst ut | (läsa ut) | Har du läst klart boken?
Gestern Abend haben wir einen Film gesehen. | Igår kväll såg vi en film. | såg | (se) | Vi såg en film igår kväll.
Als ich ankam, war der Zug schon abgefahren. | När jag kom fram hade tåget redan gått. | hade | (ha) | När jag kom dit hade tåget redan gått.;; När jag kom fram hade tåget redan åkt. | B2 | Vorvergangenheit: Was vor einem Zeitpunkt in der Vergangenheit schon passiert war, steht im Plusquamperfekt: hade + Supinum (hade gått).
Seit ich hier wohne, habe ich keinen so kalten Winter erlebt. | Sedan jag flyttade hit har jag aldrig upplevt en så kall vinter. | har jag aldrig upplevt | (uppleva) | Sen jag flyttade hit har jag aldrig upplevt en så kall vinter.;; Sedan jag flyttade hit har jag aldrig varit med om en så kall vinter.;; Så länge jag har bott här har jag aldrig upplevt en så kall vinter. | B2 | Bis heute (sedan …): Perfekt (har … upplevt). Steht der Nebensatz vorn, folgt erst das Verb, dann das Subjekt.
Wir hatten gerade gegessen, als es an der Tür klingelte. | Vi hade precis ätit när det ringde på dörren. | hade precis ätit | (äta) | Vi hade just ätit när det ringde på dörren.;; Vi hade precis ätit när det ringde på. | B2 | Vorvergangenheit: Es war vor dem Klingeln, also hade + Supinum (hade precis ätit).
Früher habe ich viel mehr gelesen als heute. | Förr läste jag mycket mer än nu. | läste | (läsa) | Förr läste jag mycket mer än idag.;; Jag läste mycket mer förr än nu. | B2 | „förr“ (früher) meint eine abgeschlossene Zeit: Präteritum (läste).
`,
partikel: `
Ich mag Kaffee. | Jag tycker om kaffe. | | | Jag gillar kaffe.
Kannst du deine Schwester mitbringen? | Kan du ta med din syster? | | | Kan du ta med dig din syster?
Ich erinnere mich nicht an seinen Namen. | Jag kommer inte ihåg hans namn. | | |
Wir besuchen morgen meine Oma. | Vi hälsar på min mormor i morgon. | | | Vi hälsar på min farmor i morgon.;; I morgon hälsar vi på min mormor.;; I morgon hälsar vi på min farmor.
Mach bitte das Licht aus. | Stäng av lampan, tack. | | | Släck lampan, tack.;; Stäng av ljuset, tack.
Gib nicht auf! | Ge inte upp! | | |
Da stimme ich dir zu. | Där håller jag med dig. | | | Jag håller med dig där.
Er hat sich die Geschichte nur ausgedacht. | Han hittade bara på historien. | | | Han har bara hittat på historien.
Wir verstehen uns gut. | Vi kommer bra överens. |  |  |  |  | komma överens = sich verstehen. „bra“ steht wie „inte“ zwischen Verb und Partikel.
Mach den Fernseher an. | Sätt på tv:n. | | | Slå på tv:n.
Ich ziehe nächsten Monat aus. | Jag flyttar ut nästa månad. | | |
Sie hat das Angebot abgelehnt. | Hon tackade nej till erbjudandet. |  |  | Hon har tackat nej till erbjudandet. |  | tacka nej till = ablehnen; „nej“ ist betont wie eine Partikel.
Ich gebe nicht auf. | Jag ger inte upp. | | |
Kannst du den Fernseher ausmachen? | Kan du stänga av tv:n? | | | Kan du slå av tv:n?
Ich komme morgen vorbei. | Jag tittar förbi i morgon. | | | I morgon tittar jag förbi.;; Jag kommer förbi i morgon.
Du musst aufpassen. | Du måste se upp. | | |
Ich habe meinen Schlüssel verloren. | Jag har tappat bort min nyckel. | | | Jag har tappat min nyckel.
Kannst du das Licht ausmachen? | Kan du stänga av lampan? | | | Kan du stänga av ljuset?;; Kan du släcka lampan?;; Kan du släcka ljuset?
Zieh deine Jacke an! | Ta på dig jackan! |  |  | Sätt på dig jackan! |  | ta på sig = anziehen; das Reflexivpronomen steht nach der Partikel: ta på dig jackan.
Sie hat sich um die Kinder gekümmert. | Hon tog hand om barnen. |  |  | Hon har tagit hand om barnen. |  | Feste Verbindung: ta hand om = sich kümmern um.
Wir müssen um sieben aufstehen. | Vi måste gå upp klockan sju. | | | Vi måste stiga upp klockan sju.
Sie gibt nie auf. | Hon ger aldrig upp. | | |
Wir müssen das Treffen auf nächste Woche verschieben. | Vi måste skjuta upp mötet till nästa vecka. |  |  | Vi måste flytta mötet till nästa vecka. | B2
Da stimme ich dir nicht ganz zu. | Där håller jag inte riktigt med dig. |  |  | Jag håller inte riktigt med dig där.;; Jag håller inte helt med dig där. | B2
Kannst du herausfinden, wann der Laden aufmacht? | Kan du ta reda på när affären öppnar? |  |  | Kan du ta reda på när butiken öppnar?;; Kan du kolla när affären öppnar? | B2 | Feste Verbindung: ta reda på = herausfinden.
Die Preise sind stark gestiegen. | Priserna har gått upp kraftigt. |  |  | Priserna har stigit kraftigt.;; Priserna har ökat kraftigt. | B2
`,
sin: `
Anna ruft ihre Mutter an. | Anna ringer sin mamma. | sin | |
Peter mag ihre Schwester (die Schwester von Lisa). | Peter tycker om hennes syster. | hennes |  | Peter gillar hennes syster. |  | Besitzerin ist Lisa, nicht das Subjekt Peter: hennes.
Sie hat ihr Handy verloren. | Hon har tappat sin mobil. | sin | | Hon har tappat bort sin mobil.
Er wäscht sein Auto. | Han tvättar sin bil. | sin | |
Ich leihe mir sein Auto. | Jag lånar hans bil. | hans |  |  |  | Besitzer ist er, nicht das Subjekt jag: hans.
Die Kinder spielen mit ihren Freunden. | Barnen leker med sina kompisar. | sina | | Barnen leker med sina vänner.
Sie verkauft ihr Haus. | Hon säljer sitt hus. | sitt | |
Lisa und ihr Mann wohnen in Lund. | Lisa och hennes man bor i Lund. | hennes |  |  |  | „sin“ kann nicht selbst im Subjekt stehen: „Lisa och hennes man“ ist zusammen das Subjekt, also hennes.
Er hat seine Schlüssel vergessen. | Han har glömt sina nycklar. | sina | |
Sie sagt, dass ihr Bruder krank ist. | Hon säger att hennes bror är sjuk. | hennes |  |  |  | Im Nebensatz ist „hennes bror“ das Subjekt; die Besitzerin (hon) steht im Hauptsatz, also hennes.
Jonas besucht seine Eltern jedes Wochenende. | Jonas hälsar på sina föräldrar varje helg. | sina | |
Sie nimmt ihr Fahrrad zur Arbeit. | Hon tar sin cykel till jobbet. | sin | |
Lisa vermisst ihren Bruder. | Lisa saknar sin bror. | sin | |
Die Nachbarn verkaufen ihr Haus. | Grannarna säljer sitt hus. | sitt | |
Er hat seinen Pass vergessen. | Han har glömt sitt pass. | sitt | |
Erik und seine Frau wohnen in Lund. | Erik och hans fru bor i Lund. | hans |  |  |  | „sin“ kann nicht selbst im Subjekt stehen: „Erik och hans fru“ ist zusammen das Subjekt, also hans.
Maria leiht mir ihr Fahrrad. | Maria lånar ut sin cykel till mig. | sin | |
Sie sprechen oft über ihre Kinder. | De pratar ofta om sina barn. | sina | | De talar ofta om sina barn.
Anna sagt, dass ihr Auto kaputt ist. | Anna säger att hennes bil är trasig. | hennes |  | Anna säger att hennes bil är sönder. |  | Im Nebensatz ist „hennes bil“ das Subjekt; die Besitzerin (Anna) steht im Hauptsatz, also hennes.
Die Firma hat ihren Hauptsitz nach Malmö verlegt. | Företaget har flyttat sitt huvudkontor till Malmö. | sitt |  |  | B2
Jeder muss sein eigenes Gepäck tragen. | Var och en får bära sitt eget bagage. | sitt |  | Alla får bära sitt eget bagage.;; Var och en måste bära sitt eget bagage. | B2
Lena hat mir erzählt, dass ihr Bruder nach Kanada zieht. | Lena berättade för mig att hennes bror ska flytta till Kanada. | hennes |  | Lena har berättat för mig att hennes bror ska flytta till Kanada.;; Lena berättade för mig att hennes bror flyttar till Kanada. | B2 | Im Nebensatz ist „hennes bror“ das Subjekt; die Besitzerin (Lena) steht im Hauptsatz, also hennes.
Die Eltern haben ihr Haus ihren Kindern überlassen. | Föräldrarna har lämnat över sitt hus till sina barn. | sitt |  |  | B2
`,
tid: `
Ich wohne seit zwei Jahren in Stockholm. | Jag har bott i Stockholm i två år. | i två år | |
Wir haben uns vor drei Jahren kennengelernt. | Vi träffades för tre år sedan. | för tre år sedan/för tre år sen | | Vi träffades för tre år sen.
Der Zug fährt in zehn Minuten. | Tåget går om tio minuter. | om tio minuter | |
Kommenden Montag habe ich frei. | På måndag är jag ledig. | På måndag |  | Jag är ledig på måndag. |  | Kommender Wochentag: på måndag. Letzter: i måndags.
Letzten Montag war ich krank. | I måndags var jag sjuk. | I måndags/Förra måndagen |  | Jag var sjuk i måndags. |  | Letzter Wochentag: i måndags (mit -s). Kommender: på måndag.
Sie ist bei der Arbeit. | Hon är på jobbet. | på jobbet/på arbetet |  |  |  | Arbeitsplatz und Einrichtungen: på (på jobbet, på bio, på sjukhuset).
Ich bin beim Zahnarzt. | Jag är hos tandläkaren. | hos tandläkaren |  |  |  | Bei einer Person: hos (hos tandläkaren, hos mamma).
Ich trinke morgens Kaffee. | Jag dricker kaffe på morgonen. | på morgonen/på morgnarna |  | Jag dricker kaffe på morgnarna. |  | Wiederkehrende Tageszeit (morgens): på morgonen.
Im Winter ist es dunkel. | På vintern är det mörkt. | På vintern/På vintrarna |  | Det är mörkt på vintern. |  | Jahreszeit allgemein (im Winter): på vintern. Diesen Winter: i vinter.
Ich war zwei Wochen in Spanien. | Jag var i Spanien i två veckor. | i två veckor/två veckor | |
Kommst du am Freitag? | Kommer du på fredag? | på fredag |  |  |  | Kommender Wochentag: på fredag.
Wir fahren um sechs Uhr los. | Vi åker klockan sex. | klockan sex/kl sex |  |  |  | Uhrzeit: klockan sex, ohne Präposition.
Ich habe sie seit Wochen nicht gesehen. | Jag har inte sett henne på flera veckor. | på flera veckor/på veckor |  |  |  | Verneinte Dauer (seit … nicht): på, nicht i (på flera veckor).
Ich habe ihn seit einer Woche nicht gesehen. | Jag har inte sett honom på en vecka. | på en vecka |  | Jag har inte träffat honom på en vecka. |  | Verneinte Dauer (seit … nicht): på, nicht i (på en vecka).
Wir sind in einer Stunde da. | Vi är där om en timme. | om en timme | | Vi är framme om en timme.
Sie hat vor einer Stunde angerufen. | Hon ringde för en timme sedan. | för en timme sedan/för en timme sen | | Hon ringde för en timme sen.
Ich lerne seit März Schwedisch. | Jag har pluggat svenska sedan mars. | sedan mars/sen mars |  | Jag har läst svenska sedan mars.;; Jag har studerat svenska sedan mars.;; Jag har pluggat svenska sen mars. |  | seit + Zeitpunkt: sedan (sedan mars). seit + Dauer: i (i två år).
Am Samstag waren wir im Kino. | I lördags var vi på bio. | I lördags |  | Vi var på bio i lördags. |  | Letzter Wochentag: i lördags (mit -s).
Ich trainiere dreimal pro Woche. | Jag tränar tre gånger i veckan. | i veckan/per vecka |  | Jag tränar tre gånger per vecka. |  | Pro Woche: i veckan (oder per vecka).
Ich habe dich seit Jahren nicht gesehen! | Jag har inte sett dig på flera år! | på flera år |  | Jag har inte sett dig på många år!;; Jag har inte träffat dig på flera år! | B2 | Verneinte Dauer (seit … nicht): på, nicht i (på flera år).
Wir sind vor einer Woche umgezogen, und es fühlt sich schon wie zu Hause an. | Vi flyttade för en vecka sedan, och det känns redan som hemma. | för en vecka sedan/för en vecka sen |  | Vi flyttade för en vecka sen, och det känns redan som hemma. | B2
In zwei Wochen fange ich meine neue Stelle an. | Om två veckor börjar jag på mitt nya jobb. | Om två veckor |  | Jag börjar på mitt nya jobb om två veckor. | B2
Die Verhandlungen dauerten bis spät in die Nacht. | Förhandlingarna pågick till sent på natten. | till sent på natten |  | Förhandlingarna höll på till sent på natten. | B2 | bis: till; nachts: på natten (till sent på natten).
`,
framtid: `
Ich werde morgen anrufen. | Jag ska ringa i morgon. | ska ringa/ringer/kommer att ringa/kommer ringa | | Jag ringer i morgon.;; Jag kommer att ringa i morgon.
Es wird morgen regnen. | Det kommer att regna i morgon. | kommer att regna/kommer regna | | Det kommer regna i morgon.
Du musst nicht kommen. | Du behöver inte komma. | behöver inte | |
Hier darf man nicht rauchen. | Här får man inte röka. | får man inte | |
Du solltest mehr schlafen. | Du borde sova mer. | borde/bör |  | Du bör sova mer. |  | Rat: borde (oder bör) = solltest.
Ich würde gern einen Kaffee bestellen. | Jag skulle vilja beställa en kaffe. | skulle vilja |  | Jag skulle vilja ha en kaffe. |  | Höflicher Wunsch: skulle vilja = würde gern, möchte.
Wir haben vor, im Sommer umzuziehen. | Vi tänker flytta i sommar. | tänker/ska/planerar att |  | Vi planerar att flytta i sommar.;; Vi ska flytta i sommar. |  | Absicht: tänker = haben vor (auch ska, planerar att).
Darf ich das Fenster aufmachen? | Får jag öppna fönstret? | Får/Kan | | Kan jag öppna fönstret?
Sie wird Ärztin. | Hon ska bli läkare. | ska bli/blir |  | Hon blir läkare. |  | werden = bli; ska bli, weil es ihr Plan ist (auch: blir).
Wir werden im Sommer heiraten. | Vi ska gifta oss i sommar. | ska gifta oss/kommer att gifta oss | (gifta sig) | Vi kommer att gifta oss i sommar.
Kannst du Schwedisch? | Kan du svenska? | Kan |  |  |  | Eine Sprache können: kunna ohne weiteres Verb (Kan du svenska?).
Ich muss jetzt gehen. | Jag måste gå nu. | måste |  |  |  | müssen = måste. Verneint, „muss nicht“, dagegen behöver inte.
Du darfst gern bleiben. | Du får gärna stanna. | får |  |  |  | får = darf; får gärna = darf gern.
Das Konzert wird bestimmt gut. | Konserten kommer säkert att bli bra. | kommer säkert att bli/blir säkert/kommer säkert bli | | Konserten blir säkert bra.;; Konserten kommer säkert bli bra.
Wollen wir ins Kino gehen? | Ska vi gå på bio? | Ska vi |  |  |  | Vorschlag: Ska vi …? = Wollen wir …?
Ich möchte gern zahlen. | Jag skulle vilja betala. | skulle vilja |  | Jag vill gärna betala. |  | Höflicher Wunsch: skulle vilja = würde gern, möchte.
Was machst du am Wochenende? | Vad ska du göra i helgen? | ska du göra | | Vad gör du i helgen?
Ich habe vor, im Sommer zu verreisen. | Jag tänker resa bort i sommar. | tänker |  | Jag planerar att resa bort i sommar.;; Jag ska resa bort i sommar. |  | Absicht: tänker = habe vor (auch ska, planerar att).
Du darfst das niemandem sagen. | Du får inte säga det till någon. | får inte |  | Du får inte berätta det för någon. |  | darf nicht = får inte (nicht „måste inte“).
Das wird bestimmt gut gehen. | Det kommer säkert att gå bra. | kommer säkert att gå/kommer säkert gå | | Det kommer säkert gå bra.;; Det går säkert bra.
Ich habe vor, nächstes Jahr ein Sabbatjahr zu machen. | Jag tänker ta ett sabbatsår nästa år. | tänker |  | Jag planerar att ta ett sabbatsår nästa år.;; Jag ska ta ett sabbatsår nästa år. | B2 | Absicht: tänker = habe vor (auch ska, planerar att).
Wenn wir uns nicht beeilen, verpassen wir den letzten Bus. | Om vi inte skyndar oss kommer vi att missa sista bussen. | kommer vi att missa/missar vi/kommer vi missa |  | Om vi inte skyndar oss missar vi sista bussen.;; Om vi inte skyndar oss kommer vi missa sista bussen. | B2
Du brauchst morgen nicht früh aufzustehen. | Du behöver inte gå upp tidigt i morgon. | behöver inte |  | Du behöver inte stiga upp tidigt i morgon. | B2
Morgen dürfte es wieder wärmer werden. | Det lär bli varmare igen i morgon. | lär bli |  | Det blir nog varmare igen i morgon.;; Det kommer nog att bli varmare igen i morgon. | B2 | Vermutung: lär = dürfte, soll wohl (det lär bli varmare).
`,
passiv: `
Das Geschäft wird um neun Uhr geöffnet. | Affären öppnas klockan nio. | öppnas/öppnar | (öppna) | Affären öppnar klockan nio.;; Butiken öppnar klockan nio.;; Butiken öppnas klockan nio.
Hier spricht man Schwedisch. | Här talar man svenska. | talar man/pratar man/talas/pratas |  | Här pratar man svenska.;; Här talas svenska. |  | Allgemeine Aussage mit man: här talar man svenska (auch s-Passiv: här talas svenska).
Es gibt kein Brot mehr. | Det finns inget bröd kvar. | Det finns | | Det finns inte mer bröd.;; Det finns inget mer bröd.
Das Essen wird um sechs serviert. | Maten serveras klockan sex. | serveras | (servera) |
Er wurde zum Chef gewählt. | Han valdes till chef. | valdes/blev vald | (välja) | Han blev vald till chef.
Wie schreibt man das? | Hur stavar man det? | stavar man/skriver man/stavas/skrivs |  | Hur skriver man det?;; Hur stavas det? |  | Allgemeine Frage mit man: Hur stavar man det? (auch: Hur stavas det?)
Das Haus wurde 1920 gebaut. | Huset byggdes 1920. | byggdes/blev byggt | (bygga) |
Gibt es hier ein Café? | Finns det ett kafé här? | Finns det | | Finns det ett café här?;; Finns det något kafé här?
Die Tür muss geschlossen werden. | Dörren måste stängas. | stängas | (stänga) |
Der Brief wurde gestern geschickt. | Brevet skickades igår. | skickades | (skicka) | Brevet skickades i går.
Es gibt viele Seen in Schweden. | Det finns många sjöar i Sverige. | Det finns | | I Sverige finns det många sjöar.
Wie sagt man das auf Schwedisch? | Hur säger man det på svenska? | säger man |  |  |  | Allgemeine Frage mit man: Hur säger man …?
Die Straße wird morgen gesperrt. | Vägen stängs av i morgon. | stängs av | (stänga av) | Vägen stängs av imorgon.
Die Kinder müssen abgeholt werden. | Barnen måste hämtas. | hämtas | (hämta) |
Das Haus wird gerade renoviert. | Huset renoveras just nu. | renoveras | (renovera) |
Die Brücke wurde 1998 gebaut. | Bron byggdes 1998. | byggdes | (bygga) | Bron blev byggd 1998.
Das Paket wird morgen geliefert. | Paketet levereras i morgon. | levereras | (leverera) | Paketet kommer att levereras i morgon.;; Paketet kommer levereras i morgon.
In Schweden isst man oft Fisch. | I Sverige äter man ofta fisk. | äter man |  |  |  | Allgemeine Aussage mit man; nach „I Sverige“ vorn Inversion: äter man.
Das Fenster wurde geöffnet. | Fönstret öppnades. | öppnades | (öppna) | Fönstret blev öppnat.
Die Rechnung muss bis Freitag bezahlt werden. | Räkningen måste betalas senast på fredag. | betalas | (betala) | Räkningen måste betalas före fredag.
Das Gesetz wurde nach langer Debatte angenommen. | Lagen antogs efter en lång debatt. | antogs | (anta) | Lagen blev antagen efter en lång debatt. | B2
Es heißt, die Brücke soll abgerissen werden. | Det sägs att bron ska rivas. | sägs | (säga) | Det påstås att bron ska rivas. | B2
Der Patient muss sofort operiert werden. | Patienten måste opereras omedelbart. | opereras | (operera) | Patienten måste opereras direkt.;; Patienten måste opereras genast. | B2
Die Wohnung wurde renoviert, bevor wir eingezogen sind. | Lägenheten renoverades innan vi flyttade in. | renoverades | (renovera) | Lägenheten blev renoverad innan vi flyttade in. | B2
`,
falska: `
Ich bleibe heute zu Hause. | Jag stannar hemma idag. | stannar |  |  |  | bleiben = stanna. „bli“ heißt werden.
Das war wirklich lustig! | Det var verkligen roligt! | roligt/kul |  |  |  | lustig (witzig) = rolig oder kul. Schwedisch „lustig“ heißt oft seltsam.
Ich habe nächste Woche Urlaub. | Jag har semester nästa vecka. | semester |  |  |  | Urlaub = semester. Das Semester an der Uni heißt termin.
Das Semester beginnt im August. | Terminen börjar i augusti. | Terminen |  |  |  | Semester (Uni) = termin. „semester“ heißt Urlaub.
Es wird kalt. | Det blir kallt. | blir |  |  |  | werden = bli (det blir kallt). „bleiben“ heißt stanna.
Ich habe einen Brief bekommen. | Jag har fått ett brev. | fått |  |  |  | bekommen = få. Schwedisch „bekomma“ heißt berühren (det bekommer mig inte = das lässt mich kalt).
Die Fahrt dauert drei Stunden. | Resan tar tre timmar. | Resan |  |  |  | Fahrt, Reise = resa. „fart“ heißt Geschwindigkeit.
Sie trägt einen roten Rock. | Hon har en röd kjol på sig. | kjol |  | Hon bär en röd kjol. |  | Rock (Kleidungsstück) = kjol. Schwedisch „rock“ ist ein Mantel (morgonrock = Bademantel) oder Rockmusik.
Der Hund ist sehr brav. | Hunden är väldigt snäll. | snäll/lydig |  | Hunden är mycket snäll. |  | brav (artig) = snäll oder lydig.
Ich habe morgen einen Termin beim Arzt. | Jag har en tid hos läkaren i morgon. | en tid |  | Jag har en läkartid i morgon. |  | Termin (beim Arzt) = tid. „termin“ heißt Semester.
Ich bin froh, dass du hier bist. | Jag är glad att du är här. | glad |  |  |  | froh = glad (Jag är glad att …).
Er läuft jeden Morgen fünf Kilometer. | Han springer fem kilometer varje morgon. | springer |  | Varje morgon springer han fem kilometer. |  | laufen, rennen = springa. „springen“ heißt hoppa.
Bist du wieder gesund? | Är du frisk igen? | frisk |  |  |  | gesund = frisk. „frisch“ heißt färsk (Brot, Obst) oder frisk (Luft).
Ich esse gern Käse. | Jag äter gärna ost. | ost |  | Jag gillar ost. |  | Käse = ost. Die Himmelsrichtung Osten heißt öster.
Das ist eine schwierige Frage. | Det är en svår fråga. | svår |  |  |  | schwierig = svår. „schwer“ im Sinn von Gewicht heißt tung.
Wir sind fast fertig. | Vi är nästan klara. | nästan |  |  |  | fast (beinahe) = nästan. Schwedisch „fast“ heißt fest oder obwohl.
Er trägt Anzug und Krawatte. | Han har kostym och slips. | kostym och slips |  | Han bär kostym och slips.;; Han har på sig kostym och slips. |  | Anzug = kostym. Ein Kostüm (Verkleidung) heißt maskeraddräkt.
Die Zinsen sind gestiegen. | Räntan har gått upp. | Räntan |  | Räntan har stigit. |  | Zinsen = ränta. Die Rente heißt pension.
`
},
es: {
serestar: `
Mein Bruder ist Arzt. | Mi hermano es médico. | es | (ser/estar) |
Ich bin müde. | Estoy cansado. | Estoy | (ser/estar) | Estoy cansada.
Madrid liegt im Zentrum Spaniens. | Madrid está en el centro de España. | está | (ser/estar) |
Die Party ist bei Ana. | La fiesta es en casa de Ana. | es | (ser/estar) |  |  | Wo ein Ereignis stattfindet: ser (la fiesta es en casa de Ana). Wo sich etwas befindet: estar.
Die Suppe ist kalt. | La sopa está fría. | está | (ser/estar) |
Sie ist sehr nett. | Es muy simpática. | Es | (ser/estar) | Ella es muy simpática.
Wir sind fertig. | Estamos listos. | Estamos | (ser/estar) | Estamos listas. |  | estar listo = fertig, bereit. ser listo = klug.
Der Film ist langweilig. | La película es aburrida. | es | (ser/estar) |  |  | ser aburrido = langweilig (Eigenschaft). estar aburrido = sich langweilen.
Ich langweile mich. | Estoy aburrido. | Estoy | (ser/estar) | Estoy aburrida.;; Me aburro. |  | estar aburrido = sich langweilen (Zustand). ser aburrido = langweilig sein.
Es ist zehn Uhr. | Son las diez. | Son | (ser/estar) |  |  | Uhrzeit: ser (son las diez, es la una).
Die Tür ist offen. | La puerta está abierta. | está | (ser/estar) |
Wo bist du? | ¿Dónde estás? | estás | (ser/estar) |
Das Essen ist sehr lecker! | ¡La comida está muy rica! | está | (ser/estar) | ¡La comida está riquísima! |  | estar rico = schmeckt gut (Eindruck beim Essen). ser rico = reich.
Er ist intelligent. | Es inteligente. | Es | (ser/estar) | Él es inteligente.
Das Wasser ist sehr kalt. | El agua está muy fría. | está | (ser/estar) |
Meine Schwester ist sehr klug. | Mi hermana es muy lista. | es | (ser/estar) | Mi hermana es muy inteligente. |  | ser listo = klug. estar listo = fertig, bereit.
Das Restaurant ist heute geschlossen. | El restaurante está cerrado hoy. | está | (ser/estar) | Hoy el restaurante está cerrado.
Es ist offensichtlich, dass das Projekt nicht gut geplant ist. | Es evidente que el proyecto no está bien planificado. | está | (ser/estar) | Es obvio que el proyecto no está bien planificado. | B2 | Ergebnis einer Handlung: estar + Partizip (está planificado).
Die Besprechung findet im großen Saal statt, der schon reserviert ist. | La reunión será en la sala grande, que ya está reservada. | será | (ser/estar) | La reunión es en la sala grande, que ya está reservada. | B2 | Wo ein Ereignis stattfindet: ser (será en la sala grande). Ergebnis „reserviert“: estar + Partizip (está reservada).
Ich habe es satt, dass du immer zu spät kommst. | Estoy harto de que siempre llegues tarde. | Estoy | (ser/estar) | Estoy harta de que siempre llegues tarde.;; Estoy cansado de que siempre llegues tarde. | B2
Der Film basiert auf einem Roman, der ein großer Erfolg war. | La película está basada en una novela que fue un gran éxito. | está | (ser/estar) |  | B2 | estar basado en = basieren auf (estar + Partizip).
`,
pasado: `
Als ich klein war, wohnte ich in Köln. | Cuando era pequeño, vivía en Colonia. | vivía | (vivir) | Cuando era pequeña, vivía en Colonia.;; Cuando era niño, vivía en Colonia.;; Cuando era niña, vivía en Colonia.
Gestern habe ich meine Großmutter besucht. | Ayer visité a mi abuela. | visité | (visitar) |
Ich las gerade, als das Telefon klingelte. | Estaba leyendo cuando sonó el teléfono. | sonó | (sonar) | Leía cuando sonó el teléfono. |  | Laufende Handlung: Imperfecto (estaba leyendo); das Ereignis, das sie unterbricht: Indefinido (sonó).
Früher spielten wir jeden Sonntag Fußball. | Antes jugábamos al fútbol todos los domingos. | jugábamos | (jugar) | Antes jugábamos fútbol todos los domingos.
Letztes Jahr sind wir nach Mexiko gereist. | El año pasado viajamos a México. | viajamos/fuimos | (viajar) | El año pasado fuimos a México.
Es war kalt und es regnete. | Hacía frío y llovía. | llovía/estaba lloviendo | (llover) | Hacía frío y estaba lloviendo.
Plötzlich ging das Licht aus. | De repente se apagó la luz. | se apagó | (apagarse) |
Sie war drei Jahre in Berlin. | Estuvo tres años en Berlín. | Estuvo/Vivió | (estar) | Ella estuvo tres años en Berlín.;; Vivió tres años en Berlín. |  | Begrenzte, abgeschlossene Dauer (tres años): Indefinido (estuvo).
Ich wusste das nicht. | No lo sabía. | sabía | (saber) | Yo no lo sabía.;; No sabía eso. |  | Wissen als Zustand: Imperfecto (sabía). Indefinido supe heißt „erfuhr“.
Wir haben uns in Barcelona kennengelernt. | Nos conocimos en Barcelona. | conocimos | (conocerse) |
Er war müde, deshalb ging er früh ins Bett. | Estaba cansado, así que se acostó temprano. | se acostó | (acostarse) | Estaba cansado, por eso se acostó temprano. |  | Zustand als Hintergrund: Imperfecto (estaba cansado); was daraufhin geschah: Indefinido (se acostó).
Was hast du am Wochenende gemacht? | ¿Qué hiciste el fin de semana? | hiciste | (hacer) |
Gestern regnete es den ganzen Tag. | Ayer llovió todo el día. | llovió | (llover) |
Als Kind hatte ich einen Hund. | De niño tenía un perro. | tenía | (tener) | Cuando era niño tenía un perro.;; De niña tenía un perro.;; Cuando era niña tenía un perro.
Wir haben uns 2015 in Sevilla kennengelernt. | Nos conocimos en 2015 en Sevilla. | conocimos | (conocerse) | Nos conocimos en Sevilla en 2015.
Es war schon spät, als wir ankamen. | Ya era tarde cuando llegamos. | era | (ser) |  |  | Uhrzeit und Umstände als Hintergrund: Imperfecto (era tarde); das Ereignis: Indefinido (llegamos).
Plötzlich ging das Licht aus. | De repente se fue la luz. | se fue/se apagó | (irse) | De pronto se fue la luz.;; De repente se apagó la luz.
Jeden Sommer fuhren wir ans Meer. | Todos los veranos íbamos a la playa. | íbamos | (ir) | Cada verano íbamos a la playa.;; Todos los veranos íbamos al mar.
Während ich das Abendessen machte, spielten die Kinder im Garten. | Mientras yo preparaba la cena, los niños jugaban en el jardín. | preparaba | (preparar) | Mientras preparaba la cena, los niños jugaban en el jardín.;; Mientras yo hacía la cena, los niños jugaban en el jardín. | B2 | Zwei Handlungen laufen gleichzeitig (mientras): beide im Imperfecto.
Als ich endlich die Schlüssel fand, war der Zug schon weg. | Cuando por fin encontré las llaves, el tren ya se había ido. | se había ido/había salido | (irse) | Cuando por fin encontré las llaves, el tren ya había salido. | B2 | Vorvergangenheit: Was vorher schon geschehen war, steht im Pluscuamperfecto (se había ido).
Wir warteten schon zwei Stunden, als man uns sagte, dass der Flug gestrichen war. | Llevábamos dos horas esperando cuando nos dijeron que el vuelo estaba cancelado. | Llevábamos | (llevar) | Hacía dos horas que esperábamos cuando nos dijeron que el vuelo estaba cancelado. | B2 | Dauer bis zu einem Punkt in der Vergangenheit: llevar im Imperfecto + Gerundium (llevábamos dos horas esperando).
Als Kind habe ich mich immer, wenn es regnete, mit einem Buch ans Fenster gesetzt. | De pequeña, siempre que llovía me sentaba a leer junto a la ventana. | me sentaba | (sentarse) | De pequeño, siempre que llovía me sentaba a leer junto a la ventana.;; De niña, siempre que llovía me sentaba a leer junto a la ventana.;; De niño, siempre que llovía me sentaba a leer junto a la ventana. | B2
`,
perfecto: `
Heute habe ich viel gearbeitet. | Hoy he trabajado mucho. | he trabajado/trabajé | (trabajar) | Hoy trabajé mucho.
Hast du schon mal Paella gegessen? | ¿Has comido paella alguna vez? | Has comido | (comer) | ¿Alguna vez has comido paella?
Diese Woche habe ich nicht gut geschlafen. | Esta semana no he dormido bien. | he dormido/dormí | (dormir) | Esta semana no dormí bien.
Gestern habe ich nicht gut geschlafen. | Ayer no dormí bien. | dormí | (dormir) |
Ich habe meine Schlüssel verloren. | He perdido mis llaves. | He perdido/Perdí | (perder) | Perdí mis llaves. |  | Ohne Zeitangabe, mit Folge für jetzt: in Spanien Perfecto (he perdido); perdí ist in Lateinamerika üblich.
Wir waren noch nie in Peru. | Nunca hemos estado en Perú. | hemos estado | (estar) | No hemos estado nunca en Perú.
2018 habe ich mein Studium beendet. | En 2018 terminé mis estudios. | terminé | (terminar) | En 2018 terminé la carrera.
Hat Juan schon angerufen? | ¿Ya ha llamado Juan? | ha llamado/llamó | (llamar) | ¿Ha llamado ya Juan?;; ¿Ya llamó Juan? |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (ha llamado); llamó ist in Lateinamerika üblich.
Heute Morgen bin ich früh aufgestanden. | Esta mañana me he levantado temprano. | me he levantado/me levanté | (levantarse) | Esta mañana me levanté temprano.
Ich habe es dir schon gesagt. | Ya te lo he dicho. | he dicho/dije | (decir) | Ya te lo dije. |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (he dicho).
Hast du den Brief geschrieben? | ¿Has escrito la carta? | Has escrito/Escribiste | (escribir) | ¿Escribiste la carta? |  | Ergebnis ohne Zeitpunkt: in Spanien Perfecto (has escrito).
Dieses Jahr sind wir noch nicht verreist. | Este año todavía no hemos viajado. | hemos viajado | (viajar) | Este año aún no hemos viajado. |  | Mit este año (wie esta semana) und todavía no: Perfecto.
2015 bin ich nach Berlin gezogen. | En 2015 me mudé a Berlín. | me mudé | (mudarse) |
Hast du die Nachrichten schon gelesen? | ¿Ya has leído las noticias? | has leído/leíste | (leer) | ¿Has leído ya las noticias?;; ¿Ya leíste las noticias? |  | Mit ya (schon), ohne Zeitpunkt: in Spanien Perfecto (has leído).
Letzte Woche habe ich meine Schlüssel verloren. | La semana pasada perdí las llaves. | perdí | (perder) | La semana pasada perdí mis llaves.
Heute Morgen habe ich den Bus verpasst. | Esta mañana he perdido el autobús. | he perdido/perdí | (perder) | Esta mañana perdí el autobús.;; Esta mañana he perdido el bus.
Ich war noch nie in Mexiko. | Nunca he estado en México. | he estado | (estar) | No he estado nunca en México.
Hast du deine Schlüssel gefunden? | ¿Has encontrado tus llaves? | Has encontrado/Encontraste | (encontrar) | ¿Encontraste tus llaves?;; ¿Ya has encontrado tus llaves? |  | Ergebnis ohne Zeitpunkt: in Spanien Perfecto (has encontrado).
Dieses Jahr sind wir so wenig gereist wie nie. | Este año hemos viajado menos que nunca. | hemos viajado/viajamos | (viajar) | Este año viajamos menos que nunca. | B2
Hast du jemals darüber nachgedacht, im Ausland zu leben? | ¿Alguna vez te has planteado vivir en el extranjero? | te has planteado | (plantearse) | ¿Te has planteado alguna vez vivir en el extranjero?;; ¿Alguna vez has pensado en vivir en el extranjero? | B2
Ich hatte noch keine Zeit, deine Nachricht zu lesen. | Todavía no he tenido tiempo de leer tu mensaje. | he tenido | (tener) | Aún no he tenido tiempo de leer tu mensaje.;; Todavía no he tenido tiempo para leer tu mensaje. | B2 | Mit todavía no (noch nicht): Perfecto (no he tenido).
Seit die Bauarbeiten begonnen haben, haben wir keine Nacht gut geschlafen. | Desde que empezó la obra, no hemos dormido bien ni una noche. | hemos dormido | (dormir) | Desde que empezaron las obras, no hemos dormido bien ni una noche. | B2 | Zeitraum bis jetzt (desde que …): Perfecto (no hemos dormido); der Beginn selbst im Indefinido (empezó).
`,
subjuntivo: `
Ich will, dass du kommst. | Quiero que vengas. | vengas | (venir) |
Ich hoffe, dass es dir gut geht. | Espero que estés bien. | estés/te vaya | (estar) |
Ich glaube nicht, dass er recht hat. | No creo que tenga razón. | tenga | (tener) |
Ich glaube, dass er recht hat. | Creo que tiene razón. | tiene | (tener) |  |  | creo que (ohne Zweifel): Indikativ. Erst verneint folgt Subjuntivo: no creo que tenga razón.
Ruf mich an, wenn du ankommst. | Llámame cuando llegues. | llegues | (llegar) |
Es ist wichtig, dass wir pünktlich sind. | Es importante que seamos puntuales. | seamos | (ser) |  |  | Wertung (es importante que): Subjuntivo.
Hoffentlich regnet es morgen nicht. | Ojalá no llueva mañana. | llueva | (llover) |
Ich freue mich, dass du hier bist. | Me alegro de que estés aquí. | estés | (estar) | Me alegra que estés aquí.
Ich erkläre es dir, damit du es verstehst. | Te lo explico para que lo entiendas. | entiendas/comprendas | (entender) |  |  | para que (damit) verlangt immer Subjuntivo.
Bevor du gehst, mach das Licht aus. | Antes de que te vayas, apaga la luz. | te vayas/salgas | (irse) |  |  | antes de que (bevor) verlangt immer Subjuntivo.
Es ist möglich, dass sie später kommt. | Es posible que venga más tarde. | venga/llegue | (venir) |  |  | Möglichkeit (es posible que): Subjuntivo.
Ich suche eine Wohnung mit Balkon. | Busco un piso que tenga balcón. | tenga | (tener) | Busco un apartamento que tenga balcón.;; Busco un departamento que tenga balcón. |  | Gesuchtes, noch unbekanntes Ding im Relativsatz: Subjuntivo (un piso que tenga …). Ein bestimmtes, bekanntes: Indikativ.
Ich weiß, dass du müde bist. | Sé que estás cansado. | estás | (estar) | Sé que estás cansada. |  | saber que (Gewissheit): Indikativ.
Es ist klar, dass er heute kommt. | Está claro que viene hoy. | viene | (venir) |  |  | está claro que (Gewissheit): Indikativ. Verneint (no está claro que) folgt Subjuntivo.
Jedes Mal, wenn ich Zeit habe, rufe ich dich an. | Cada vez que tengo tiempo, te llamo. | tengo | (tener) |  |  | Gewohnheit (jedes Mal, wenn): Indikativ. Subjuntivo nur mit Zukunftsbezug (cuando llegues).
Ich bin sicher, dass sie recht hat. | Estoy seguro de que tiene razón. | tiene | (tener) | Estoy segura de que tiene razón. |  | estar seguro de que (Gewissheit): Indikativ.
Ich hoffe, dass du morgen Zeit hast. | Espero que tengas tiempo mañana. | tengas | (tener) | Espero que mañana tengas tiempo.
Auch wenn es morgen regnet, machen wir den Ausflug. | Aunque llueva mañana, saldremos de excursión. | llueva | (llover) | Saldremos de excursión aunque llueva mañana. | B2 | aunque mit offener Zukunft (auch wenn es regnen sollte): Subjuntivo. Mit einer Tatsache (obwohl es regnet): Indikativ.
Ich suche eine Wohnung, die eine Terrasse hat und nicht zu teuer ist. | Busco un piso que tenga terraza y no sea muy caro. | tenga | (tener) | Busco un piso que tenga terraza y que no sea muy caro.;; Busco un apartamento que tenga terraza y no sea muy caro. | B2 | Gesuchtes, noch unbekanntes Ding im Relativsatz: Subjuntivo (un piso que tenga … y no sea …).
Es hat mich überrascht, dass sie mich nicht eingeladen hatten. | Me sorprendió que no me hubieran invitado. | hubieran invitado/hubiesen invitado | (invitar) | Me sorprendió que no me hubiesen invitado. | B2 | Gefühl (me sorprendió) über etwas, das davor geschehen war: Pluscuamperfecto de subjuntivo (hubieran invitado).
Wenn du einen Moment Zeit hast, ruf mich an. | Cuando tengas un momento, llámame. | tengas | (tener) | Llámame cuando tengas un momento. | B2
`,
porpara: `
Das Geschenk ist für dich. | El regalo es para ti. | para | (por/para) |  |  | Empfänger (für dich bestimmt): para ti. Deinetwegen: por ti.
Danke für alles. | Gracias por todo. | por | (por/para) |
Ich lerne Spanisch, um in Mexiko zu arbeiten. | Estudio español para trabajar en México. | para | (por/para) | Aprendo español para trabajar en México.
Wir sind durch den Park gegangen. | Caminamos por el parque. | por | (por/para) | Paseamos por el parque.;; Hemos caminado por el parque.
Ich habe das Handy für 200 Euro gekauft. | Compré el móvil por 200 euros. | por | (por/para) | Compré el celular por 200 euros.
Der Bericht muss bis Freitag fertig sein. | El informe tiene que estar listo para el viernes. | para | (por/para) |
Wegen des Regens sind wir zu Hause geblieben. | Por la lluvia nos quedamos en casa. | Por | (por/para) | Nos quedamos en casa por la lluvia.
Für mich ist das zu teuer. | Para mí es demasiado caro. | Para | (por/para) |  |  | Meinung, Standpunkt (für mich): para mí.
Der Zug nach Sevilla fährt um zehn. | El tren para Sevilla sale a las diez. | para | (por/para) | El tren a Sevilla sale a las diez.
Schick es mir per E-Mail. | Mándamelo por correo electrónico. | por | (por/para) | Envíamelo por correo.;; Mándamelo por email. |  | Mittel, Weg (per E-Mail, per Telefon): por.
Deshalb bin ich nicht gekommen. | Por eso no vine. | Por eso |  | Por eso no he venido. |  | por eso = deshalb (Grund).
Endlich! | ¡Por fin! | Por fin |  |  |  | Feste Wendung: por fin = endlich.
Ich habe das Buch für zehn Euro gekauft. | Compré el libro por diez euros. | por | (por/para) | He comprado el libro por diez euros.
Der Zug nach Madrid fährt um acht. | El tren para Madrid sale a las ocho. | para | (por/para) | El tren a Madrid sale a las ocho.
Danke für deine Hilfe. | Gracias por tu ayuda. | por | (por/para) |
Ich brauche den Bericht bis Montag. | Necesito el informe para el lunes. | para | (por/para) |
Wir sind zwei Wochen durch Peru gereist. | Viajamos por Perú durante dos semanas. | por | (por/para) | Viajamos dos semanas por Perú.;; Hemos viajado por Perú durante dos semanas.
Für sein Alter spricht er sehr gut. | Para su edad, habla muy bien. | Para | (por/para) |  |  | Vergleich mit dem Üblichen (für sein Alter): para.
So sehr ich es auch versuche, ich verstehe es nicht. | Por mucho que lo intente, no consigo entenderlo. | Por | (por/para) | Por más que lo intente, no consigo entenderlo.;; Por mucho que lo intento, no consigo entenderlo. | B2 | por mucho que = so sehr auch (danach Subjuntivo).
Dafür, dass es sein erster Roman ist, ist er sehr gut geschrieben. | Para ser su primera novela, está muy bien escrita. | Para | (por/para) |  | B2 | Dafür, dass (Vergleich mit dem Erwartbaren): para ser …
Sie haben meinen Flug gegen einen früheren getauscht. | Me cambiaron el vuelo por uno más temprano. | por | (por/para) |  | B2 | Tausch, Ersatz (gegen): por.
Ich habe es deinetwegen getan, nicht meinetwegen. | Lo hice por ti, no por mí. | por | (por/para) |  | B2 | Wegen, zuliebe (deinetwegen): por ti. Für dich bestimmt: para ti.
`,
pronombres: `
Ich gebe es dir morgen. | Te lo doy mañana. | | | Mañana te lo doy.
Kannst du es mir erklären? | ¿Me lo puedes explicar? |  |  | ¿Puedes explicármelo? |  | Vor das konjugierte Verb (me lo puedes explicar) oder an den Infinitiv (puedes explicármelo); erst me, dann lo.
Ich habe ihr die Wahrheit gesagt. | Le dije la verdad. | | | Le he dicho la verdad.
Ich habe es ihr schon gesagt. | Ya se lo he dicho. |  |  | Ya se lo dije. |  | le + lo wird zu se lo; beide vor dem konjugierten Verb: se lo he dicho.
Wir wollen sie (die Wohnung) morgen sehen. | La queremos ver mañana. | | | Queremos verla mañana.;; Mañana la queremos ver.
Er bringt uns zum Flughafen. | Nos lleva al aeropuerto. | | |
Sag es ihm nicht! | ¡No se lo digas! |  |  |  |  | Verneinter Imperativ: Pronomen davor (no se lo digas). Nur der bejahte hängt sie an: díselo.
Ich schenke meiner Mutter Blumen. | Le regalo flores a mi madre. |  |  | A mi madre le regalo flores.;; Le regalo flores a mi mamá. |  | Das indirekte Objekt steht oft doppelt: le … a mi madre.
Ich kann ihn nicht finden. | No lo puedo encontrar. | | | No puedo encontrarlo.
Wir sehen uns morgen. | Nos vemos mañana. | | | Mañana nos vemos.
Ich bin gerade dabei, es zu machen. | Lo estoy haciendo. |  |  | Estoy haciéndolo. |  | Mit Gerundium: vor das konjugierte Verb (lo estoy haciendo) oder angehängt (estoy haciéndolo).
Ich schenke es ihr. | Se lo regalo. |  |  |  |  | le + lo wird zu se lo (se lo regalo = ich schenke es ihr).
Kannst du sie mir leihen? (die Bücher) | ¿Me los puedes prestar? | | | ¿Puedes prestármelos?
Ich rufe dich später an. | Te llamo más tarde. | | | Más tarde te llamo.
Sie hat ihn nicht gesehen. | No lo ha visto. | | | No le ha visto.;; No lo vio.
Ich habe ihn gestern gesehen. | Lo vi ayer. | | | Ayer lo vi.;; Le vi ayer.;; Ayer le vi.
Kannst du mir das Salz geben? | ¿Me pasas la sal? | | | ¿Me puedes pasar la sal?;; ¿Puedes pasarme la sal?
Ich schenke ihnen ein Buch. | Les regalo un libro. | | |
Ich habe es dir doch gesagt. | Te lo dije. | | | Ya te lo dije.;; Te lo he dicho.;; Ya te lo he dicho.
Wenn du das Auto brauchst, leihe ich es dir gern. | Si necesitas el coche, te lo dejo sin problema. |  |  | Si necesitas el coche, te lo presto sin problema.;; Si te hace falta el coche, te lo dejo sin problema. | B2
Ich habe es ihm schon dreimal erklärt, und er versteht es immer noch nicht. | Ya se lo he explicado tres veces y sigue sin entenderlo. |  |  | Ya se lo expliqué tres veces y sigue sin entenderlo. | B2 | le + lo wird zu se lo, vor dem konjugierten Verb (se lo he explicado); am Infinitiv hängt das Pronomen an (entenderlo).
Die Schlüssel? Die habe ich zu Hause liegen lassen. | ¿Las llaves? Me las dejé en casa. |  |  | ¿Las llaves? Las dejé en casa.;; ¿Las llaves? Me las he dejado en casa. | B2 | dejarse algo = etwas liegen lassen: me las dejé (mir + sie, vor dem Verb).
Sag es mir, wenn du es weißt. | Dímelo cuando lo sepas. |  |  | Avísame cuando lo sepas. | B2 | Bejahter Imperativ: Pronomen hängen an (dímelo), erst me, dann lo.
`,
gustar: `
Mir gefallen die Bücher. | Me gustan los libros. | gustan | (gustar) |
Ich liebe Musik. | Me encanta la música. | encanta | (encantar) |
Interessiert dich Politik? | ¿Te interesa la política? | interesa | (interesar) |
Mir tut der Kopf weh. | Me duele la cabeza. | duele | (doler) |
Mir tun die Füße weh. | Me duelen los pies. | duelen | (doler) |
Uns fehlen noch zwei Stühle. | Todavía nos faltan dos sillas. | faltan | (faltar) | Nos faltan dos sillas.;; Aún nos faltan dos sillas.
Was hältst du von der Idee? | ¿Qué te parece la idea? | parece | (parecer) |  |  | parecer wie gustar: ¿Qué te parece …? = Was hältst du von …? Das Verb richtet sich nach la idea.
Meinem Vater gefällt Fußball nicht. | A mi padre no le gusta el fútbol. | le gusta | (gustar) |
Die Jacke steht dir gut. | La chaqueta te queda bien. | queda/sienta | (quedar) |  |  | quedar bien = gut stehen, wie gustar: Das Verb richtet sich nach la chaqueta.
Mich stört der Lärm. | Me molesta el ruido. | molesta | (molestar) |
Gefallen dir die Fotos? | ¿Te gustan las fotos? | gustan | (gustar) |
Uns gefällt die Stadt sehr. | Nos gusta mucho la ciudad. | gusta | (gustar) | La ciudad nos gusta mucho.
Ihr schmeckt der Kaffee nicht. | No le gusta el café. | gusta | (gustar) | El café no le gusta.
Das ist mir egal. | Me da igual. | da | (dar igual) |  |  | Feste Wendung: me da igual = das ist mir egal.
Stört es dich, wenn ich das Fenster öffne? | ¿Te molesta si abro la ventana? | molesta | (molestar) |  |  | Was stört, ist ein ganzer Satz (si abro …): Verb im Singular, te molesta.
Hast du Lust auf ein Eis? | ¿Te apetece un helado? | apetece | (apetecer) |  |  | apetecer wie gustar: ¿Te apetece …? = Hast du Lust auf …?
Es stört mich, wenn Leute im Kino telefonieren. | Me molesta que la gente hable por teléfono en el cine. | molesta | (molestar) | Me molesta que la gente hable por el móvil en el cine. | B2 | Was stört, ist ein ganzer Satz: Verb im Singular (me molesta), danach que + Subjuntivo (hable).
Meine Eltern würden dich sehr gern kennenlernen. | A mis padres les encantaría conocerte. | encantaría | (encantar) |  | B2 | Was gefällt, ist ein Infinitiv (conocerte): Verb im Singular, hier im Konditional (encantaría).
Uns bleiben nur noch zwei Urlaubstage. | Nos quedan solo dos días de vacaciones. | quedan | (quedar) | Solo nos quedan dos días de vacaciones. | B2
Es tut mir leid, dass du so früh gehst. | Me da pena que te vayas tan pronto. | da pena/da lástima | (dar pena) | Me da lástima que te vayas tan pronto. | B2 | Feste Wendung: me da pena que = es tut mir leid, dass; danach Subjuntivo (te vayas).
`,
condicional: `
Ich hätte gern einen Kaffee. | Me gustaría un café. | gustaría | (gustar) | Quería un café.;; Quisiera un café. |  | Höflicher Wunsch: Konditional, me gustaría = ich hätte gern.
Du solltest mehr schlafen. | Deberías dormir más. | Deberías | (deber) |  |  | Rat: Konditional von deber, deberías = du solltest.
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
An deiner Stelle würde ich das nicht machen. | Yo que tú, no lo haría. | haría | (hacer) | Yo en tu lugar no lo haría.;; En tu lugar no lo haría.;; Yo que tú no lo haría. |  | Rat mit yo que tú: Konditional, hacer hat den Stamm har- (haría).
Es wäre toll, dich zu sehen. | Sería genial verte. | Sería/Estaría | (ser) | Sería estupendo verte.;; Estaría genial verte. |  | Gedachte Situation: Konditional, sería = es wäre.
Würdest du mit mir ins Kino gehen? | ¿Irías al cine conmigo? | Irías | (ir) |  |  | Höfliche Frage, Einladung: Konditional, irías = würdest du gehen.
An deiner Stelle würde ich nichts unterschreiben, ohne es vorher zu lesen. | Yo en tu lugar no firmaría nada sin leerlo antes. | firmaría | (firmar) | Yo que tú no firmaría nada sin leerlo antes. | B2 | Rat mit yo en tu lugar: Konditional (firmaría).
Wenn du mir Bescheid gesagt hättest, hätte ich dich am Bahnhof abgeholt. | Si me hubieras avisado, te habría recogido en la estación. | habría recogido/hubiera recogido | (recoger) | Si me hubieras avisado, te hubiera recogido en la estación.;; Si me hubieses avisado, te habría recogido en la estación. | B2 | Irreal in der Vergangenheit: si + hubiera + Partizip, im Hauptsatz habría (oder hubiera) + Partizip.
Es dürfte etwa zehn gewesen sein, als er ankam. | Serían las diez cuando llegó. | Serían/Eran | (ser) | Eran más o menos las diez cuando llegó. | B2 | Vermutung über die Vergangenheit: Konditional, serían las diez = es dürfte etwa zehn gewesen sein.
Würde es dir etwas ausmachen, das Fenster zu schließen? | ¿Te importaría cerrar la ventana? | importaría | (importar) |  | B2 | Höfliche Bitte: Konditional, ¿te importaría …? = würde es dir etwas ausmachen …?
`,
reflexivo: `
Ich stehe um sieben auf. | Me levanto a las siete. | Me levanto | (levantarse) |
Ich habe vergessen, dir zu schreiben. | Se me olvidó escribirte. | Se me olvidó/Olvidé/Me olvidé de | (olvidarse) | Olvidé escribirte.;; Me olvidé de escribirte. |  | Versehen: se me olvidó = es ist mir entfallen (auch: olvidé, me olvidé de).
Ich erinnere mich nicht an ihren Namen. | No me acuerdo de su nombre. | me acuerdo de/recuerdo | (acordarse) | No recuerdo su nombre. |  | acordarse de (me acuerdo de) oder recordar ohne Pronomen und ohne de (recuerdo su nombre).
Wir gehen jetzt. | Ya nos vamos. | nos vamos | (irse) | Nos vamos ya. |  | irse = weggehen (ya nos vamos = wir gehen jetzt); ir = irgendwohin gehen.
Mir ist das Glas runtergefallen. | Se me cayó el vaso. | Se me cayó | (caerse) |  |  | Versehen: se me cayó = es ist mir runtergefallen; das Verb richtet sich nach dem, was fällt (el vaso).
Hier spricht man Spanisch. | Aquí se habla español. | se habla | (hablar) |  |  | Unpersönliches se: se habla = man spricht.
Ich habe gemerkt, dass ich müde war. | Me di cuenta de que estaba cansado. | Me di cuenta de | (darse cuenta) | Me di cuenta de que estaba cansada.
Sie bleibt zu Hause. | Se queda en casa. | Se queda | (quedarse) | Ella se queda en casa.
Wie heißt du? | ¿Cómo te llamas? | te llamas | (llamarse) |
Er duscht jeden Morgen. | Se ducha todas las mañanas. | Se ducha | (ducharse) | Se ducha cada mañana.
Wir haben uns verlaufen. | Nos hemos perdido. | Nos hemos perdido/Nos perdimos | (perderse) | Nos perdimos.
Er hat sich das Bein gebrochen. | Se ha roto la pierna. | Se ha roto/Se rompió | (romperse) | Se rompió la pierna. |  | Körperteil mit Artikel statt Possessiv: se ha roto la pierna (sein Bein).
Ich ziehe mich schnell an. | Me visto rápido. | Me visto | (vestirse) | Me visto rápidamente.
Sie hat sich die Haare gewaschen. | Se ha lavado el pelo. | Se ha lavado/Se lavó | (lavarse) | Se lavó el pelo. |  | Körperteil mit Artikel statt Possessiv: se ha lavado el pelo (ihre Haare).
Ich habe mich geirrt. | Me he equivocado. | Me he equivocado/Me equivoqué | (equivocarse) | Me equivoqué.
Wir treffen uns um acht vor dem Kino. | Nos vemos a las ocho delante del cine. | Nos vemos/Quedamos/Nos encontramos | (verse) | Quedamos a las ocho delante del cine.;; Nos encontramos a las ocho delante del cine.
Er hat sich beim Fußball verletzt. | Se lesionó jugando al fútbol. | Se lesionó/Se hizo daño/Se ha lesionado | (lesionarse) | Se hizo daño jugando al fútbol.;; Se ha lesionado jugando al fútbol.;; Se lesionó jugando fútbol.
Ich ziehe mich schnell um. | Me cambio rápido. | Me cambio | (cambiarse) | Me cambio de ropa rápido.;; Me cambio rápidamente.
Ich habe mich sehr gefreut. | Me alegré mucho. | Me alegré/Me he alegrado | (alegrarse) | Me he alegrado mucho.
Ich habe zu spät gemerkt, dass ich im falschen Zug saß. | Me di cuenta demasiado tarde de que me había equivocado de tren. | Me di cuenta | (darse cuenta) |  | B2
Mach dir keine Sorgen, mir wird schon etwas einfallen. | No te preocupes, ya se me ocurrirá algo. | se me ocurrirá | (ocurrirse) |  | B2 | se me ocurre = mir fällt ein; das Verb richtet sich nach dem Einfall (algo).
Wir haben seinen Geburtstag völlig vergessen. | Se nos olvidó por completo su cumpleaños. | Se nos olvidó/Nos olvidamos | (olvidarse) | Nos olvidamos por completo de su cumpleaños. | B2 | Versehen: se nos olvidó = es ist uns entfallen; das Verb richtet sich nach dem Vergessenen (su cumpleaños).
Mit der Zeit gewöhnst du dich an den Rhythmus der Stadt. | Con el tiempo te acostumbrarás al ritmo de la ciudad. | te acostumbrarás | (acostumbrarse) |  | B2
`,
preposiciones: `
Ich sehe meine Schwester. | Veo a mi hermana. | a |  |  |  | Person als direktes Objekt: persönliches a (veo a mi hermana).
Ich denke viel an dich. | Pienso mucho en ti. | en |  |  |  | pensar en = denken an.
Ich träume von einer Reise nach Chile. | Sueño con un viaje a Chile. | con |  |  |  | soñar con = träumen von.
Das hängt vom Wetter ab. | Depende del tiempo. | del |  |  |  | depender de = abhängen von; de + el = del.
Sie hat ihn geheiratet. | Se casó con él. | con |  |  |  | casarse con = heiraten (jemanden).
Wir sind im Kino. | Estamos en el cine. | en |  |  |  | Ort (wo?): en (en el cine).
Wir gehen ins Kino. | Vamos al cine. | al |  |  |  | Richtung (wohin?): a, mit el zusammengezogen zu al.
Ich wohne seit drei Jahren hier. | Vivo aquí desde hace tres años. | desde hace/hace |  | Llevo tres años viviendo aquí. |  | seit + Zeitdauer: desde hace (desde hace tres años).
Er braucht lange, um zu antworten. | Tarda mucho en responder. | en |  | Tarda mucho en contestar. |  | tardar en = (lange) brauchen, um zu.
Sie hat sich in Pablo verliebt. | Se enamoró de Pablo. | de |  |  |  | enamorarse de = sich verlieben in.
Ich habe vor zwei Wochen angefangen. | Empecé hace dos semanas. | hace |  |  |  | vor (zeitlich): hace (hace dos semanas).
Ich habe Angst vor Hunden. | Tengo miedo a los perros. | a/de |  | Tengo miedo de los perros. |  | Angst vor: miedo a oder miedo de.
Sie ist mit einem Spanier verheiratet. | Está casada con un español. | con |  |  |  | casado con = verheiratet mit.
Wir fahren mit dem Zug. | Vamos en tren. | en |  |  |  | Verkehrsmittel: en (en tren, en coche); zu Fuß: a pie.
Ich besuche meine Großeltern. | Visito a mis abuelos. | a |  |  |  | Personen als direktes Objekt: persönliches a (visito a mis abuelos).
Ich bin seit Montag krank. | Estoy enfermo desde el lunes. | desde |  | Estoy enferma desde el lunes. |  | seit + Zeitpunkt: desde (desde el lunes); seit + Dauer: desde hace.
Das hängt davon ab, was der Chef entscheidet. | Esto depende de lo que decida el jefe. | de |  | Eso depende de lo que decida el jefe. | B2 | depender de = abhängen von (de lo que …).
Am Ende habe ich mich für die kleinere Wohnung entschieden. | Al final me decidí por el piso más pequeño. | por |  |  | B2 | decidirse por = sich entscheiden für.
Er beschwert sich immer über alles, tut aber nie etwas. | Siempre se queja de todo, pero nunca hace nada. | de |  |  | B2 | quejarse de = sich beschweren über.
Meine Schwester hat einen Mann aus Bilbao geheiratet. | Mi hermana se casó con un chico de Bilbao. | con |  | Mi hermana se casó con un hombre de Bilbao. | B2 | casarse con = heiraten (jemanden).
`,
falsos: `
Meine Firma ist in Madrid. | Mi empresa está en Madrid. | empresa/compañía |  |  |  | Firma = empresa. Spanisch „firma“ heißt Unterschrift.
Nimm einen Mantel mit, es ist kalt. | Llévate un abrigo, hace frío. | abrigo |  |  |  | Mantel = abrigo. Spanisch „mantel“ heißt Tischdecke.
Mein Sohn geht aufs Gymnasium. | Mi hijo va al instituto. | instituto/colegio |  | Mi hijo va al colegio. |  | Gymnasium = instituto. Spanisch „gimnasio“ heißt Fitnessstudio.
Meine Eltern bekommen eine gute Rente. | Mis padres cobran una buena pensión. | pensión/jubilación |  | Mis padres reciben una buena pensión. |  | Rente = pensión (oder jubilación). Spanisch „renta“ heißt Einkommen.
Die Konkurrenz ist groß. | La competencia es grande. | competencia |  | Hay mucha competencia. |  | Konkurrenz = competencia. Spanisch „concurrencia“ heißt Andrang, Publikum.
Hast du einen Prospekt vom Hotel? | ¿Tienes un folleto del hotel? | folleto |  |  |  | Prospekt = folleto. Spanisch „prospecto“ heißt Beipackzettel.
Ich gehe ins Fitnessstudio. | Voy al gimnasio. | gimnasio |  |  |  | Fitnessstudio = gimnasio. Das deutsche Gymnasium heißt instituto.
Unterschreib hier, bitte. | Firma aquí, por favor. | Firma |  |  |  | unterschreiben = firmar (firma aquí). Die Firma heißt empresa.
Die Tischdecke ist schmutzig. | El mantel está sucio. | mantel |  |  |  | Tischdecke = mantel. Der Mantel heißt abrigo.
Mein Lehrer ist sehr geduldig. | Mi profesor es muy paciente. | profesor/maestro |  | Mi maestro es muy paciente. |  | Spanisch „profesor“ ist jeder Lehrer, nicht nur an der Uni; maestro vor allem in der Grundschule.
Ich habe dir Pralinen mitgebracht. | Te he traído bombones. | bombones |  | Te traje bombones. |  | Pralinen = bombones. Ein Bonbon heißt caramelo.
Vor dem Kino ist eine lange Schlange. | Hay una cola larga delante del cine. | cola |  | Hay una larga cola delante del cine. |  | Warteschlange = cola. Die Schlange als Tier heißt serpiente.
Die Schuhe waren ein Schnäppchen. | Los zapatos fueron una ganga. | ganga |  |  |  | Schnäppchen = ganga (umgangssprachlich auch chollo).
Die Fernbedienung braucht neue Batterien. | El mando necesita pilas nuevas. | pilas |  | El mando a distancia necesita pilas nuevas.;; El control remoto necesita pilas nuevas. |  | Batterien (für Geräte) = pilas. Spanisch „batería“ ist ein Akku, eine Autobatterie oder das Schlagzeug.
Ich bin erkältet. | Estoy constipado. | constipado/resfriado/constipada/resfriada |  | Estoy resfriado.;; Estoy constipada.;; Estoy resfriada. |  | erkältet = constipado (oder resfriado). Verstopft heißt estreñido.
Die Ausgaben sind gestiegen. | Los gastos han subido. | gastos |  |  |  | Ausgaben (Kosten) = gastos. Die Ausgabe eines Buchs heißt edición.
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
