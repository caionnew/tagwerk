/* Satzbank. Format pro Zeile: Deutsch | Ziel | Lücke (Alternativen mit /) | Hinweis | Alternativen (mit ;;) */
const CONTENT = {
sv: {
bisats: `
Ich weiß, dass er heute nicht kommt. | Jag vet att han inte kommer idag. | | |
Sie sagt, dass sie keine Zeit hat. | Hon säger att hon inte har tid. | | |
Ich bleibe zu Hause, weil ich mich nicht gut fühle. | Jag stannar hemma eftersom jag inte mår bra. | | | Jag stannar hemma för att jag inte mår bra.
Wir machen einen Spaziergang, wenn es nicht regnet. | Vi tar en promenad om det inte regnar. | | |
Das ist der Film, den ich noch nie gesehen habe. | Det är filmen som jag aldrig har sett. | | |
Er fragt, ob ich auch kommen will. | Han frågar om jag också vill komma. | | |
Ich glaube, dass sie immer zu spät kommt. | Jag tror att hon alltid kommer för sent. | | |
Ruf an, wenn du nicht kommen kannst. | Ring om du inte kan komma. | | | Ring mig om du inte kan komma.
Ich verstehe nicht, warum er nie antwortet. | Jag förstår inte varför han aldrig svarar. | | |
Weißt du, ob das Restaurant heute geöffnet hat? | Vet du om restaurangen har öppet idag? | | | Vet du om restaurangen är öppen idag?
Sie ist traurig, weil ihr Freund sie nicht angerufen hat. | Hon är ledsen eftersom hennes pojkvän inte har ringt henne. | | | Hon är ledsen för att hennes pojkvän inte har ringt henne.
Ich hoffe, dass du dich bald besser fühlst. | Jag hoppas att du snart mår bättre. | | | Jag hoppas att du mår bättre snart.
Obwohl er viel arbeitet, hat er nie Stress. | Fast han jobbar mycket har han aldrig stress. | | | Trots att han jobbar mycket har han aldrig stress.;; Fast han arbetar mycket har han aldrig stress.
Wir können nicht gehen, bevor alle gegessen haben. | Vi kan inte gå innan alla har ätit. | | |
Sag Bescheid, wenn du nicht mehr kannst. | Säg till om du inte orkar mer. | | | Säg till när du inte orkar mer.
Ich bin froh, dass es nicht regnet. | Jag är glad att det inte regnar. | | | Jag är glad över att det inte regnar.
Es ist schade, dass du nicht mitkommen kannst. | Det är synd att du inte kan följa med. | | |
Er sagt, dass er nie Fleisch isst. | Han säger att han aldrig äter kött. | | |
Ich frage mich, warum sie nicht antwortet. | Jag undrar varför hon inte svarar. | | |
Wenn ich keine Lust habe, bleibe ich zu Hause. | Om jag inte har lust stannar jag hemma. | | | När jag inte har lust stannar jag hemma.
`,
inversion: `
Heute arbeite ich nicht. | Idag jobbar jag inte. | | | Idag arbetar jag inte.
Morgen fahren wir nach Göteborg. | I morgon åker vi till Göteborg. | | |
Am Wochenende schlafe ich immer lange. | På helgen sover jag alltid länge. | | | På helgerna sover jag alltid länge.
Jetzt verstehe ich das. | Nu förstår jag det. | | |
Im Sommer wohnen sie auf dem Land. | På sommaren bor de på landet. | | |
Leider kann ich nicht kommen. | Tyvärr kan jag inte komma. | | |
Den Film habe ich schon gesehen. | Den filmen har jag redan sett. | | |
Wenn ich nach Hause komme, koche ich. | När jag kommer hem lagar jag mat. | | |
Normalerweise trinke ich keinen Kaffee. | Vanligtvis dricker jag inte kaffe. | | | Normalt dricker jag inte kaffe.
Um acht Uhr beginnt der Kurs. | Klockan åtta börjar kursen. | | |
Vielleicht kommt sie später. | Kanske kommer hon senare. | | | Kanske hon kommer senare.;; Hon kommer kanske senare.
In Schweden trinkt man viel Kaffee. | I Sverige dricker man mycket kaffe. | | |
Nach dem Essen machen wir einen Spaziergang. | Efter maten tar vi en promenad. | | |
Heute Abend sehe ich ihn nicht. | Ikväll träffar jag honom inte. | | | Ikväll träffar jag inte honom.
Im Winter wird es früh dunkel. | På vintern blir det mörkt tidigt. | | |
Nach der Arbeit gehe ich oft ins Fitnessstudio. | Efter jobbet går jag ofta till gymmet. | | | Efter jobbet går jag ofta på gym.;; Efter arbetet går jag ofta till gymmet.
Zum Glück hat niemand etwas gemerkt. | Som tur var märkte ingen något. | | | Lyckligtvis märkte ingen något.;; Som tur var märkte ingen någonting.
Vielleicht regnet es morgen. | Kanske regnar det i morgon. | | | Det regnar kanske i morgon.;; Kanske det regnar i morgon.
Hier wohne ich seit fünf Jahren. | Här har jag bott i fem år. | | | Jag har bott här i fem år.
Morgen früh muss ich arbeiten. | I morgon bitti måste jag jobba. | | | I morgon bitti måste jag arbeta.
`,
tempus: `
Gestern habe ich einen alten Freund getroffen. | Igår träffade jag en gammal vän. | träffade | (träffa) |
Letztes Jahr sind wir nach Norwegen gefahren. | Förra året åkte vi till Norge. | åkte | (åka) |
Ich habe den Film noch nie gesehen. | Jag har aldrig sett filmen. | har aldrig sett | (se) |
Als ich Kind war, habe ich in Uppsala gewohnt. | När jag var barn bodde jag i Uppsala. | bodde | (bo) |
Wann bist du angekommen? | När kom du fram? | kom | (komma fram) |
Ich habe gerade gegessen. | Jag har precis ätit. | har precis ätit/har just ätit | (äta) | Jag har just ätit.
Wir haben uns 2019 kennengelernt. | Vi träffades 2019. | träffades/träffade varandra | (träffas) |
Sie hat mir gestern eine Nachricht geschickt. | Hon skickade ett meddelande till mig igår. | skickade | (skicka) | Hon skickade mig ett meddelande igår.
Wann hast du das Buch gelesen? | När läste du boken? | läste | (läsa) |
Ich habe schon gegessen. | Jag har redan ätit. | har redan ätit | (äta) |
Letzten Sommer haben wir viel gebadet. | I somras badade vi mycket. | badade | (bada) | Vi badade mycket i somras.
Vorgestern hat es den ganzen Tag geregnet. | I förrgår regnade det hela dagen. | regnade | (regna) |
Hast du schon gegessen? | Har du ätit? | Har du ätit | (äta) | Har du redan ätit?;; Har du ätit än?
Wir haben uns letzten Sommer kennengelernt. | Vi träffades i somras. | träffades | (träffas) | Vi lärde känna varandra i somras.;; I somras träffades vi.
Ich habe gerade eine Nachricht bekommen. | Jag har precis fått ett meddelande. | har precis fått/fick precis | (få) | Jag fick precis ett meddelande.
Als ich nach Hause kam, schlief sie schon. | När jag kom hem sov hon redan. | sov | (sova) |
Sie hat drei Jahre in Malmö gewohnt, jetzt wohnt sie in Umeå. | Hon bodde i Malmö i tre år, nu bor hon i Umeå. | bodde | (bo) |
Hast du das Buch zu Ende gelesen? | Har du läst ut boken? | Har du läst ut | (läsa ut) | Har du läst klart boken?
Gestern Abend haben wir einen Film gesehen. | Igår kväll såg vi en film. | såg | (se) | Vi såg en film igår kväll.
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
Wir verstehen uns gut. | Vi kommer bra överens. | | |
Mach den Fernseher an. | Sätt på tv:n. | | | Slå på tv:n.
Ich ziehe nächsten Monat aus. | Jag flyttar ut nästa månad. | | |
Sie hat das Angebot abgelehnt. | Hon tackade nej till erbjudandet. | | | Hon har tackat nej till erbjudandet.
Ich gebe nicht auf. | Jag ger inte upp. | | |
Kannst du den Fernseher ausmachen? | Kan du stänga av tv:n? | | | Kan du slå av tv:n?
Ich komme morgen vorbei. | Jag tittar förbi i morgon. | | | I morgon tittar jag förbi.;; Jag kommer förbi i morgon.
Du musst aufpassen. | Du måste se upp. | | |
Ich habe meinen Schlüssel verloren. | Jag har tappat bort min nyckel. | | | Jag har tappat min nyckel.
Kannst du das Licht ausmachen? | Kan du stänga av lampan? | | | Kan du stänga av ljuset?;; Kan du släcka lampan?;; Kan du släcka ljuset?
Zieh deine Jacke an! | Ta på dig jackan! | | | Sätt på dig jackan!
Sie hat sich um die Kinder gekümmert. | Hon tog hand om barnen. | | | Hon har tagit hand om barnen.
Wir müssen um sieben aufstehen. | Vi måste gå upp klockan sju. | | | Vi måste stiga upp klockan sju.
Sie gibt nie auf. | Hon ger aldrig upp. | | |
`,
sin: `
Anna ruft ihre Mutter an. | Anna ringer sin mamma. | sin | |
Peter mag ihre Schwester (die Schwester von Lisa). | Peter tycker om hennes syster. | hennes | | Peter gillar hennes syster.
Sie hat ihr Handy verloren. | Hon har tappat sin mobil. | sin | | Hon har tappat bort sin mobil.
Er wäscht sein Auto. | Han tvättar sin bil. | sin | |
Ich leihe mir sein Auto. | Jag lånar hans bil. | hans | |
Die Kinder spielen mit ihren Freunden. | Barnen leker med sina kompisar. | sina | | Barnen leker med sina vänner.
Sie verkauft ihr Haus. | Hon säljer sitt hus. | sitt | |
Lisa und ihr Mann wohnen in Lund. | Lisa och hennes man bor i Lund. | hennes | |
Er hat seine Schlüssel vergessen. | Han har glömt sina nycklar. | sina | |
Sie sagt, dass ihr Bruder krank ist. | Hon säger att hennes bror är sjuk. | hennes | |
Jonas besucht seine Eltern jedes Wochenende. | Jonas hälsar på sina föräldrar varje helg. | sina | |
Sie nimmt ihr Fahrrad zur Arbeit. | Hon tar sin cykel till jobbet. | sin | |
Lisa vermisst ihren Bruder. | Lisa saknar sin bror. | sin | |
Die Nachbarn verkaufen ihr Haus. | Grannarna säljer sitt hus. | sitt | |
Er hat seinen Pass vergessen. | Han har glömt sitt pass. | sitt | |
Erik und seine Frau wohnen in Lund. | Erik och hans fru bor i Lund. | hans | |
Maria leiht mir ihr Fahrrad. | Maria lånar ut sin cykel till mig. | sin | |
Sie sprechen oft über ihre Kinder. | De pratar ofta om sina barn. | sina | | De talar ofta om sina barn.
Anna sagt, dass ihr Auto kaputt ist. | Anna säger att hennes bil är trasig. | hennes | | Anna säger att hennes bil är sönder.
`,
tid: `
Ich wohne seit zwei Jahren in Stockholm. | Jag har bott i Stockholm i två år. | i två år | |
Wir haben uns vor drei Jahren kennengelernt. | Vi träffades för tre år sedan. | för tre år sedan/för tre år sen | | Vi träffades för tre år sen.
Der Zug fährt in zehn Minuten. | Tåget går om tio minuter. | om tio minuter | |
Kommenden Montag habe ich frei. | På måndag är jag ledig. | På måndag | | Jag är ledig på måndag.
Letzten Montag war ich krank. | I måndags var jag sjuk. | I måndags/Förra måndagen | | Jag var sjuk i måndags.
Sie ist bei der Arbeit. | Hon är på jobbet. | på jobbet/på arbetet | |
Ich bin beim Zahnarzt. | Jag är hos tandläkaren. | hos tandläkaren | |
Ich trinke morgens Kaffee. | Jag dricker kaffe på morgonen. | på morgonen/på morgnarna | | Jag dricker kaffe på morgnarna.
Im Winter ist es dunkel. | På vintern är det mörkt. | På vintern/På vintrarna | | Det är mörkt på vintern.
Ich war zwei Wochen in Spanien. | Jag var i Spanien i två veckor. | i två veckor/två veckor | |
Kommst du am Freitag? | Kommer du på fredag? | på fredag | |
Wir fahren um sechs Uhr los. | Vi åker klockan sex. | klockan sex/kl sex | |
Ich habe sie seit Wochen nicht gesehen. | Jag har inte sett henne på flera veckor. | på flera veckor/på veckor | |
Ich habe ihn seit einer Woche nicht gesehen. | Jag har inte sett honom på en vecka. | på en vecka | | Jag har inte träffat honom på en vecka.
Wir sind in einer Stunde da. | Vi är där om en timme. | om en timme | | Vi är framme om en timme.
Sie hat vor einer Stunde angerufen. | Hon ringde för en timme sedan. | för en timme sedan/för en timme sen | | Hon ringde för en timme sen.
Ich lerne seit März Schwedisch. | Jag har pluggat svenska sedan mars. | sedan mars/sen mars | | Jag har läst svenska sedan mars.;; Jag har studerat svenska sedan mars.;; Jag har pluggat svenska sen mars.
Am Samstag waren wir im Kino. | I lördags var vi på bio. | I lördags | | Vi var på bio i lördags.
Ich trainiere dreimal pro Woche. | Jag tränar tre gånger i veckan. | i veckan/per vecka | | Jag tränar tre gånger per vecka.
`,
framtid: `
Ich werde morgen anrufen. | Jag ska ringa i morgon. | ska ringa/ringer/kommer att ringa/kommer ringa | | Jag ringer i morgon.;; Jag kommer att ringa i morgon.
Es wird morgen regnen. | Det kommer att regna i morgon. | kommer att regna/kommer regna | | Det kommer regna i morgon.
Du musst nicht kommen. | Du behöver inte komma. | behöver inte | |
Hier darf man nicht rauchen. | Här får man inte röka. | får man inte | |
Du solltest mehr schlafen. | Du borde sova mer. | borde/bör | | Du bör sova mer.
Ich würde gern einen Kaffee bestellen. | Jag skulle vilja beställa en kaffe. | skulle vilja | | Jag skulle vilja ha en kaffe.
Wir haben vor, im Sommer umzuziehen. | Vi tänker flytta i sommar. | tänker/ska/planerar att | | Vi planerar att flytta i sommar.;; Vi ska flytta i sommar.
Darf ich das Fenster aufmachen? | Får jag öppna fönstret? | Får/Kan | | Kan jag öppna fönstret?
Sie wird Ärztin. | Hon ska bli läkare. | ska bli/blir | | Hon blir läkare.
Wir werden im Sommer heiraten. | Vi ska gifta oss i sommar. | ska gifta oss/kommer att gifta oss | (gifta sig) | Vi kommer att gifta oss i sommar.
Kannst du Schwedisch? | Kan du svenska? | Kan | |
Ich muss jetzt gehen. | Jag måste gå nu. | måste | |
Du darfst gern bleiben. | Du får gärna stanna. | får | |
Das Konzert wird bestimmt gut. | Konserten kommer säkert att bli bra. | kommer säkert att bli/blir säkert/kommer säkert bli | | Konserten blir säkert bra.;; Konserten kommer säkert bli bra.
Wollen wir ins Kino gehen? | Ska vi gå på bio? | Ska vi | |
Ich möchte gern zahlen. | Jag skulle vilja betala. | skulle vilja | | Jag vill gärna betala.
Was machst du am Wochenende? | Vad ska du göra i helgen? | ska du göra | | Vad gör du i helgen?
Ich habe vor, im Sommer zu verreisen. | Jag tänker resa bort i sommar. | tänker | | Jag planerar att resa bort i sommar.;; Jag ska resa bort i sommar.
Du darfst das niemandem sagen. | Du får inte säga det till någon. | får inte | | Du får inte berätta det för någon.
Das wird bestimmt gut gehen. | Det kommer säkert att gå bra. | kommer säkert att gå/kommer säkert gå | | Det kommer säkert gå bra.;; Det går säkert bra.
`,
passiv: `
Das Geschäft wird um neun Uhr geöffnet. | Affären öppnas klockan nio. | öppnas/öppnar | (öppna) | Affären öppnar klockan nio.;; Butiken öppnar klockan nio.;; Butiken öppnas klockan nio.
Hier spricht man Schwedisch. | Här talar man svenska. | talar man/pratar man/talas/pratas | | Här pratar man svenska.;; Här talas svenska.
Es gibt kein Brot mehr. | Det finns inget bröd kvar. | Det finns | | Det finns inte mer bröd.;; Det finns inget mer bröd.
Das Essen wird um sechs serviert. | Maten serveras klockan sex. | serveras | (servera) |
Er wurde zum Chef gewählt. | Han valdes till chef. | valdes/blev vald | (välja) | Han blev vald till chef.
Wie schreibt man das? | Hur stavar man det? | stavar man/skriver man/stavas/skrivs | | Hur skriver man det?;; Hur stavas det?
Das Haus wurde 1920 gebaut. | Huset byggdes 1920. | byggdes/blev byggt | (bygga) |
Gibt es hier ein Café? | Finns det ett kafé här? | Finns det | | Finns det ett café här?;; Finns det något kafé här?
Die Tür muss geschlossen werden. | Dörren måste stängas. | stängas | (stänga) |
Der Brief wurde gestern geschickt. | Brevet skickades igår. | skickades | (skicka) | Brevet skickades i går.
Es gibt viele Seen in Schweden. | Det finns många sjöar i Sverige. | Det finns | | I Sverige finns det många sjöar.
Wie sagt man das auf Schwedisch? | Hur säger man det på svenska? | säger man | |
Die Straße wird morgen gesperrt. | Vägen stängs av i morgon. | stängs av | (stänga av) | Vägen stängs av imorgon.
Die Kinder müssen abgeholt werden. | Barnen måste hämtas. | hämtas | (hämta) |
Das Haus wird gerade renoviert. | Huset renoveras just nu. | renoveras | (renovera) |
Die Brücke wurde 1998 gebaut. | Bron byggdes 1998. | byggdes | (bygga) | Bron blev byggd 1998.
Das Paket wird morgen geliefert. | Paketet levereras i morgon. | levereras | (leverera) | Paketet kommer att levereras i morgon.;; Paketet kommer levereras i morgon.
In Schweden isst man oft Fisch. | I Sverige äter man ofta fisk. | äter man | |
Das Fenster wurde geöffnet. | Fönstret öppnades. | öppnades | (öppna) | Fönstret blev öppnat.
Die Rechnung muss bis Freitag bezahlt werden. | Räkningen måste betalas senast på fredag. | betalas | (betala) | Räkningen måste betalas före fredag.
`,
falska: `
Ich bleibe heute zu Hause. | Jag stannar hemma idag. | stannar | |
Das war wirklich lustig! | Det var verkligen roligt! | roligt/kul | |
Ich habe nächste Woche Urlaub. | Jag har semester nästa vecka. | semester | |
Das Semester beginnt im August. | Terminen börjar i augusti. | Terminen | |
Es wird kalt. | Det blir kallt. | blir | |
Ich habe einen Brief bekommen. | Jag har fått ett brev. | fått | |
Die Fahrt dauert drei Stunden. | Resan tar tre timmar. | Resan | |
Sie trägt einen roten Rock. | Hon har en röd kjol på sig. | kjol | | Hon bär en röd kjol.
Der Hund ist sehr brav. | Hunden är väldigt snäll. | snäll/lydig | | Hunden är mycket snäll.
Ich habe morgen einen Termin beim Arzt. | Jag har en tid hos läkaren i morgon. | en tid | | Jag har en läkartid i morgon.
Ich bin froh, dass du hier bist. | Jag är glad att du är här. | glad | |
Er läuft jeden Morgen fünf Kilometer. | Han springer fem kilometer varje morgon. | springer | | Varje morgon springer han fem kilometer.
Bist du wieder gesund? | Är du frisk igen? | frisk | |
Ich esse gern Käse. | Jag äter gärna ost. | ost | | Jag gillar ost.
Das ist eine schwierige Frage. | Det är en svår fråga. | svår | |
Wir sind fast fertig. | Vi är nästan klara. | nästan | |
Er trägt Anzug und Krawatte. | Han har kostym och slips. | kostym och slips | | Han bär kostym och slips.;; Han har på sig kostym och slips.
Die Zinsen sind gestiegen. | Räntan har gått upp. | Räntan | | Räntan har stigit.
`
},
es: {
serestar: `
Mein Bruder ist Arzt. | Mi hermano es médico. | es | (ser/estar) |
Ich bin müde. | Estoy cansado. | Estoy | (ser/estar) | Estoy cansada.
Madrid liegt im Zentrum Spaniens. | Madrid está en el centro de España. | está | (ser/estar) |
Die Party ist bei Ana. | La fiesta es en casa de Ana. | es | (ser/estar) |
Die Suppe ist kalt. | La sopa está fría. | está | (ser/estar) |
Sie ist sehr nett. | Es muy simpática. | Es | (ser/estar) | Ella es muy simpática.
Wir sind fertig. | Estamos listos. | Estamos | (ser/estar) | Estamos listas.
Der Film ist langweilig. | La película es aburrida. | es | (ser/estar) |
Ich langweile mich. | Estoy aburrido. | Estoy | (ser/estar) | Estoy aburrida.;; Me aburro.
Es ist zehn Uhr. | Son las diez. | Son | (ser/estar) |
Die Tür ist offen. | La puerta está abierta. | está | (ser/estar) |
Wo bist du? | ¿Dónde estás? | estás | (ser/estar) |
Das Essen ist sehr lecker! | ¡La comida está muy rica! | está | (ser/estar) | ¡La comida está riquísima!
Er ist intelligent. | Es inteligente. | Es | (ser/estar) | Él es inteligente.
Das Wasser ist sehr kalt. | El agua está muy fría. | está | (ser/estar) |
Meine Schwester ist sehr klug. | Mi hermana es muy lista. | es | (ser/estar) | Mi hermana es muy inteligente.
Das Restaurant ist heute geschlossen. | El restaurante está cerrado hoy. | está | (ser/estar) | Hoy el restaurante está cerrado.
`,
pasado: `
Als ich klein war, wohnte ich in Köln. | Cuando era pequeño, vivía en Colonia. | vivía | (vivir) | Cuando era pequeña, vivía en Colonia.;; Cuando era niño, vivía en Colonia.;; Cuando era niña, vivía en Colonia.
Gestern habe ich meine Großmutter besucht. | Ayer visité a mi abuela. | visité | (visitar) |
Ich las gerade, als das Telefon klingelte. | Estaba leyendo cuando sonó el teléfono. | sonó | (sonar) | Leía cuando sonó el teléfono.
Früher spielten wir jeden Sonntag Fußball. | Antes jugábamos al fútbol todos los domingos. | jugábamos | (jugar) | Antes jugábamos fútbol todos los domingos.
Letztes Jahr sind wir nach Mexiko gereist. | El año pasado viajamos a México. | viajamos/fuimos | (viajar) | El año pasado fuimos a México.
Es war kalt und es regnete. | Hacía frío y llovía. | llovía/estaba lloviendo | (llover) | Hacía frío y estaba lloviendo.
Plötzlich ging das Licht aus. | De repente se apagó la luz. | se apagó | (apagarse) |
Sie war drei Jahre in Berlin. | Estuvo tres años en Berlín. | Estuvo/Vivió | (estar) | Ella estuvo tres años en Berlín.;; Vivió tres años en Berlín.
Ich wusste das nicht. | No lo sabía. | sabía | (saber) | Yo no lo sabía.;; No sabía eso.
Wir haben uns in Barcelona kennengelernt. | Nos conocimos en Barcelona. | conocimos | (conocerse) |
Er war müde, deshalb ging er früh ins Bett. | Estaba cansado, así que se acostó temprano. | se acostó | (acostarse) | Estaba cansado, por eso se acostó temprano.
Was hast du am Wochenende gemacht? | ¿Qué hiciste el fin de semana? | hiciste | (hacer) |
Gestern regnete es den ganzen Tag. | Ayer llovió todo el día. | llovió | (llover) |
Als Kind hatte ich einen Hund. | De niño tenía un perro. | tenía | (tener) | Cuando era niño tenía un perro.;; De niña tenía un perro.;; Cuando era niña tenía un perro.
Wir haben uns 2015 in Sevilla kennengelernt. | Nos conocimos en 2015 en Sevilla. | conocimos | (conocerse) | Nos conocimos en Sevilla en 2015.
Es war schon spät, als wir ankamen. | Ya era tarde cuando llegamos. | era | (ser) |
Plötzlich ging das Licht aus. | De repente se fue la luz. | se fue/se apagó | (irse) | De pronto se fue la luz.;; De repente se apagó la luz.
Jeden Sommer fuhren wir ans Meer. | Todos los veranos íbamos a la playa. | íbamos | (ir) | Cada verano íbamos a la playa.;; Todos los veranos íbamos al mar.
`,
perfecto: `
Heute habe ich viel gearbeitet. | Hoy he trabajado mucho. | he trabajado/trabajé | (trabajar) | Hoy trabajé mucho.
Hast du schon mal Paella gegessen? | ¿Has comido paella alguna vez? | Has comido | (comer) | ¿Alguna vez has comido paella?
Diese Woche habe ich nicht gut geschlafen. | Esta semana no he dormido bien. | he dormido/dormí | (dormir) | Esta semana no dormí bien.
Gestern habe ich nicht gut geschlafen. | Ayer no dormí bien. | dormí | (dormir) |
Ich habe meine Schlüssel verloren. | He perdido mis llaves. | He perdido/Perdí | (perder) | Perdí mis llaves.
Wir waren noch nie in Peru. | Nunca hemos estado en Perú. | hemos estado | (estar) | No hemos estado nunca en Perú.
2018 habe ich mein Studium beendet. | En 2018 terminé mis estudios. | terminé | (terminar) | En 2018 terminé la carrera.
Hat Juan schon angerufen? | ¿Ya ha llamado Juan? | ha llamado/llamó | (llamar) | ¿Ha llamado ya Juan?;; ¿Ya llamó Juan?
Heute Morgen bin ich früh aufgestanden. | Esta mañana me he levantado temprano. | me he levantado/me levanté | (levantarse) | Esta mañana me levanté temprano.
Ich habe es dir schon gesagt. | Ya te lo he dicho. | he dicho/dije | (decir) | Ya te lo dije.
Hast du den Brief geschrieben? | ¿Has escrito la carta? | Has escrito/Escribiste | (escribir) | ¿Escribiste la carta?
Dieses Jahr sind wir noch nicht verreist. | Este año todavía no hemos viajado. | hemos viajado | (viajar) | Este año aún no hemos viajado.
2015 bin ich nach Berlin gezogen. | En 2015 me mudé a Berlín. | me mudé | (mudarse) |
Hast du die Nachrichten schon gelesen? | ¿Ya has leído las noticias? | has leído/leíste | (leer) | ¿Has leído ya las noticias?;; ¿Ya leíste las noticias?
Letzte Woche habe ich meine Schlüssel verloren. | La semana pasada perdí las llaves. | perdí | (perder) | La semana pasada perdí mis llaves.
Heute Morgen habe ich den Bus verpasst. | Esta mañana he perdido el autobús. | he perdido/perdí | (perder) | Esta mañana perdí el autobús.;; Esta mañana he perdido el bus.
Ich war noch nie in Mexiko. | Nunca he estado en México. | he estado | (estar) | No he estado nunca en México.
Hast du deine Schlüssel gefunden? | ¿Has encontrado tus llaves? | Has encontrado/Encontraste | (encontrar) | ¿Encontraste tus llaves?;; ¿Ya has encontrado tus llaves?
`,
subjuntivo: `
Ich will, dass du kommst. | Quiero que vengas. | vengas | (venir) |
Ich hoffe, dass es dir gut geht. | Espero que estés bien. | estés/te vaya | (estar) |
Ich glaube nicht, dass er recht hat. | No creo que tenga razón. | tenga | (tener) |
Ich glaube, dass er recht hat. | Creo que tiene razón. | tiene | (tener) |
Ruf mich an, wenn du ankommst. | Llámame cuando llegues. | llegues | (llegar) |
Es ist wichtig, dass wir pünktlich sind. | Es importante que seamos puntuales. | seamos | (ser) |
Hoffentlich regnet es morgen nicht. | Ojalá no llueva mañana. | llueva | (llover) |
Ich freue mich, dass du hier bist. | Me alegro de que estés aquí. | estés | (estar) | Me alegra que estés aquí.
Ich erkläre es dir, damit du es verstehst. | Te lo explico para que lo entiendas. | entiendas/comprendas | (entender) |
Bevor du gehst, mach das Licht aus. | Antes de que te vayas, apaga la luz. | te vayas/salgas | (irse) |
Es ist möglich, dass sie später kommt. | Es posible que venga más tarde. | venga/llegue | (venir) |
Ich suche eine Wohnung mit Balkon. | Busco un piso que tenga balcón. | tenga | (tener) | Busco un apartamento que tenga balcón.;; Busco un departamento que tenga balcón.
Ich weiß, dass du müde bist. | Sé que estás cansado. | estás | (estar) | Sé que estás cansada.
Es ist klar, dass er heute kommt. | Está claro que viene hoy. | viene | (venir) |
Jedes Mal, wenn ich Zeit habe, rufe ich dich an. | Cada vez que tengo tiempo, te llamo. | tengo | (tener) |
Ich bin sicher, dass sie recht hat. | Estoy seguro de que tiene razón. | tiene | (tener) | Estoy segura de que tiene razón.
Ich hoffe, dass du morgen Zeit hast. | Espero que tengas tiempo mañana. | tengas | (tener) | Espero que mañana tengas tiempo.
`,
porpara: `
Das Geschenk ist für dich. | El regalo es para ti. | para | (por/para) |
Danke für alles. | Gracias por todo. | por | (por/para) |
Ich lerne Spanisch, um in Mexiko zu arbeiten. | Estudio español para trabajar en México. | para | (por/para) | Aprendo español para trabajar en México.
Wir sind durch den Park gegangen. | Caminamos por el parque. | por | (por/para) | Paseamos por el parque.;; Hemos caminado por el parque.
Ich habe das Handy für 200 Euro gekauft. | Compré el móvil por 200 euros. | por | (por/para) | Compré el celular por 200 euros.
Der Bericht muss bis Freitag fertig sein. | El informe tiene que estar listo para el viernes. | para | (por/para) |
Wegen des Regens sind wir zu Hause geblieben. | Por la lluvia nos quedamos en casa. | Por | (por/para) | Nos quedamos en casa por la lluvia.
Für mich ist das zu teuer. | Para mí es demasiado caro. | Para | (por/para) |
Der Zug nach Sevilla fährt um zehn. | El tren para Sevilla sale a las diez. | para | (por/para) | El tren a Sevilla sale a las diez.
Schick es mir per E-Mail. | Mándamelo por correo electrónico. | por | (por/para) | Envíamelo por correo.;; Mándamelo por email.
Deshalb bin ich nicht gekommen. | Por eso no vine. | Por eso | | Por eso no he venido.
Endlich! | ¡Por fin! | Por fin | |
Ich habe das Buch für zehn Euro gekauft. | Compré el libro por diez euros. | por | (por/para) | He comprado el libro por diez euros.
Der Zug nach Madrid fährt um acht. | El tren para Madrid sale a las ocho. | para | (por/para) | El tren a Madrid sale a las ocho.
Danke für deine Hilfe. | Gracias por tu ayuda. | por | (por/para) |
Ich brauche den Bericht bis Montag. | Necesito el informe para el lunes. | para | (por/para) |
Wir sind zwei Wochen durch Peru gereist. | Viajamos por Perú durante dos semanas. | por | (por/para) | Viajamos dos semanas por Perú.;; Hemos viajado por Perú durante dos semanas.
Für sein Alter spricht er sehr gut. | Para su edad, habla muy bien. | Para | (por/para) |
`,
pronombres: `
Ich gebe es dir morgen. | Te lo doy mañana. | | | Mañana te lo doy.
Kannst du es mir erklären? | ¿Me lo puedes explicar? | | | ¿Puedes explicármelo?
Ich habe ihr die Wahrheit gesagt. | Le dije la verdad. | | | Le he dicho la verdad.
Ich habe es ihr schon gesagt. | Ya se lo he dicho. | | | Ya se lo dije.
Wir wollen sie (die Wohnung) morgen sehen. | La queremos ver mañana. | | | Queremos verla mañana.;; Mañana la queremos ver.
Er bringt uns zum Flughafen. | Nos lleva al aeropuerto. | | |
Sag es ihm nicht! | ¡No se lo digas! | | |
Ich schenke meiner Mutter Blumen. | Le regalo flores a mi madre. | | | A mi madre le regalo flores.;; Le regalo flores a mi mamá.
Ich kann ihn nicht finden. | No lo puedo encontrar. | | | No puedo encontrarlo.
Wir sehen uns morgen. | Nos vemos mañana. | | | Mañana nos vemos.
Ich bin gerade dabei, es zu machen. | Lo estoy haciendo. | | | Estoy haciéndolo.
Ich schenke es ihr. | Se lo regalo. | | |
Kannst du sie mir leihen? (die Bücher) | ¿Me los puedes prestar? | | | ¿Puedes prestármelos?
Ich rufe dich später an. | Te llamo más tarde. | | | Más tarde te llamo.
Sie hat ihn nicht gesehen. | No lo ha visto. | | | No le ha visto.;; No lo vio.
Ich habe ihn gestern gesehen. | Lo vi ayer. | | | Ayer lo vi.;; Le vi ayer.;; Ayer le vi.
Kannst du mir das Salz geben? | ¿Me pasas la sal? | | | ¿Me puedes pasar la sal?;; ¿Puedes pasarme la sal?
Ich schenke ihnen ein Buch. | Les regalo un libro. | | |
Ich habe es dir doch gesagt. | Te lo dije. | | | Ya te lo dije.;; Te lo he dicho.;; Ya te lo he dicho.
`,
gustar: `
Mir gefallen die Bücher. | Me gustan los libros. | gustan | (gustar) |
Ich liebe Musik. | Me encanta la música. | encanta | (encantar) |
Interessiert dich Politik? | ¿Te interesa la política? | interesa | (interesar) |
Mir tut der Kopf weh. | Me duele la cabeza. | duele | (doler) |
Mir tun die Füße weh. | Me duelen los pies. | duelen | (doler) |
Uns fehlen noch zwei Stühle. | Todavía nos faltan dos sillas. | faltan | (faltar) | Nos faltan dos sillas.;; Aún nos faltan dos sillas.
Was hältst du von der Idee? | ¿Qué te parece la idea? | parece | (parecer) |
Meinem Vater gefällt Fußball nicht. | A mi padre no le gusta el fútbol. | le gusta | (gustar) |
Die Jacke steht dir gut. | La chaqueta te queda bien. | queda/sienta | (quedar) |
Mich stört der Lärm. | Me molesta el ruido. | molesta | (molestar) |
Gefallen dir die Fotos? | ¿Te gustan las fotos? | gustan | (gustar) |
Uns gefällt die Stadt sehr. | Nos gusta mucho la ciudad. | gusta | (gustar) | La ciudad nos gusta mucho.
Ihr schmeckt der Kaffee nicht. | No le gusta el café. | gusta | (gustar) | El café no le gusta.
Das ist mir egal. | Me da igual. | da | (dar igual) |
Stört es dich, wenn ich das Fenster öffne? | ¿Te molesta si abro la ventana? | molesta | (molestar) |
Hast du Lust auf ein Eis? | ¿Te apetece un helado? | apetece | (apetecer) |
`,
condicional: `
Ich hätte gern einen Kaffee. | Me gustaría un café. | gustaría | (gustar) | Quería un café.;; Quisiera un café.
Du solltest mehr schlafen. | Deberías dormir más. | Deberías | (deber) |
Könntest du mir helfen? | ¿Podrías ayudarme? | Podrías | (poder) | ¿Me podrías ayudar?
Wenn ich Zeit hätte, würde ich mehr reisen. | Si tuviera tiempo, viajaría más. | tuviera/tuviese | (tener) | Si tuviese tiempo, viajaría más.
Wenn es morgen regnet, bleiben wir zu Hause. | Si llueve mañana, nos quedamos en casa. | llueve | (llover) | Si llueve mañana, nos quedaremos en casa.
An deiner Stelle würde ich das nicht machen. | Yo en tu lugar no lo haría. | haría | (hacer) | Yo que tú, no lo haría.;; En tu lugar, no lo haría.
Wenn ich reich wäre, würde ich ein Haus am Meer kaufen. | Si fuera rico, compraría una casa junto al mar. | compraría | (comprar) | Si fuera rica, compraría una casa junto al mar.;; Si fuera rico, compraría una casa en la playa.
Was würdest du tun? | ¿Qué harías? | harías | (hacer) |
Es wäre besser, morgen zu gehen. | Sería mejor ir mañana. | Sería | (ser) |
Würdest du mir das Salz reichen? | ¿Me pasarías la sal? | pasarías | (pasar) |
Wenn ich du wäre, würde ich das Angebot annehmen. | Yo que tú, aceptaría la oferta. | aceptaría | (aceptar) | Si fuera tú, aceptaría la oferta.;; En tu lugar, aceptaría la oferta.
Ich würde dich sehr gern sehen. | Me encantaría verte. | encantaría | (encantar) |
Wenn es nicht regnen würde, würden wir spazieren gehen. | Si no lloviera, saldríamos a pasear. | saldríamos | (salir) | Si no lloviese, saldríamos a pasear.
Was würdest du an meiner Stelle sagen? | ¿Qué dirías tú en mi lugar? | dirías | (decir) | ¿Qué dirías en mi lugar?
Wir könnten morgen ins Kino gehen. | Podríamos ir al cine mañana. | Podríamos | (poder) | Mañana podríamos ir al cine.
An deiner Stelle würde ich das nicht machen. | Yo que tú, no lo haría. | haría | (hacer) | Yo en tu lugar no lo haría.;; En tu lugar no lo haría.;; Yo que tú no lo haría.
Es wäre toll, dich zu sehen. | Sería genial verte. | Sería/Estaría | (ser) | Sería estupendo verte.;; Estaría genial verte.
Würdest du mit mir ins Kino gehen? | ¿Irías al cine conmigo? | Irías | (ir) |
`,
reflexivo: `
Ich stehe um sieben auf. | Me levanto a las siete. | Me levanto | (levantarse) |
Ich habe vergessen, dir zu schreiben. | Se me olvidó escribirte. | Se me olvidó/Olvidé/Me olvidé de | (olvidarse) | Olvidé escribirte.;; Me olvidé de escribirte.
Ich erinnere mich nicht an ihren Namen. | No me acuerdo de su nombre. | me acuerdo de/recuerdo | (acordarse) | No recuerdo su nombre.
Wir gehen jetzt. | Ya nos vamos. | nos vamos | (irse) | Nos vamos ya.
Mir ist das Glas runtergefallen. | Se me cayó el vaso. | Se me cayó | (caerse) |
Hier spricht man Spanisch. | Aquí se habla español. | se habla | (hablar) |
Ich habe gemerkt, dass ich müde war. | Me di cuenta de que estaba cansado. | Me di cuenta de | (darse cuenta) | Me di cuenta de que estaba cansada.
Sie bleibt zu Hause. | Se queda en casa. | Se queda | (quedarse) | Ella se queda en casa.
Wie heißt du? | ¿Cómo te llamas? | te llamas | (llamarse) |
Er duscht jeden Morgen. | Se ducha todas las mañanas. | Se ducha | (ducharse) | Se ducha cada mañana.
Wir haben uns verlaufen. | Nos hemos perdido. | Nos hemos perdido/Nos perdimos | (perderse) | Nos perdimos.
Er hat sich das Bein gebrochen. | Se ha roto la pierna. | Se ha roto/Se rompió | (romperse) | Se rompió la pierna.
Ich ziehe mich schnell an. | Me visto rápido. | Me visto | (vestirse) | Me visto rápidamente.
Sie hat sich die Haare gewaschen. | Se ha lavado el pelo. | Se ha lavado/Se lavó | (lavarse) | Se lavó el pelo.
Ich habe mich geirrt. | Me he equivocado. | Me he equivocado/Me equivoqué | (equivocarse) | Me equivoqué.
Wir treffen uns um acht vor dem Kino. | Nos vemos a las ocho delante del cine. | Nos vemos/Quedamos/Nos encontramos | (verse) | Quedamos a las ocho delante del cine.;; Nos encontramos a las ocho delante del cine.
Er hat sich beim Fußball verletzt. | Se lesionó jugando al fútbol. | Se lesionó/Se hizo daño/Se ha lesionado | (lesionarse) | Se hizo daño jugando al fútbol.;; Se ha lesionado jugando al fútbol.;; Se lesionó jugando fútbol.
Ich ziehe mich schnell um. | Me cambio rápido. | Me cambio | (cambiarse) | Me cambio de ropa rápido.;; Me cambio rápidamente.
Ich habe mich sehr gefreut. | Me alegré mucho. | Me alegré/Me he alegrado | (alegrarse) | Me he alegrado mucho.
`,
preposiciones: `
Ich sehe meine Schwester. | Veo a mi hermana. | a | |
Ich denke viel an dich. | Pienso mucho en ti. | en | |
Ich träume von einer Reise nach Chile. | Sueño con un viaje a Chile. | con | |
Das hängt vom Wetter ab. | Depende del tiempo. | del | |
Sie hat ihn geheiratet. | Se casó con él. | con | |
Wir sind im Kino. | Estamos en el cine. | en | |
Wir gehen ins Kino. | Vamos al cine. | al | |
Ich wohne seit drei Jahren hier. | Vivo aquí desde hace tres años. | desde hace/hace | | Llevo tres años viviendo aquí.
Er braucht lange, um zu antworten. | Tarda mucho en responder. | en | | Tarda mucho en contestar.
Sie hat sich in Pablo verliebt. | Se enamoró de Pablo. | de | |
Ich habe vor zwei Wochen angefangen. | Empecé hace dos semanas. | hace | |
Ich habe Angst vor Hunden. | Tengo miedo a los perros. | a/de | | Tengo miedo de los perros.
Sie ist mit einem Spanier verheiratet. | Está casada con un español. | con | |
Wir fahren mit dem Zug. | Vamos en tren. | en | |
Ich besuche meine Großeltern. | Visito a mis abuelos. | a | |
Ich bin seit Montag krank. | Estoy enfermo desde el lunes. | desde | | Estoy enferma desde el lunes.
`,
falsos: `
Meine Firma ist in Madrid. | Mi empresa está en Madrid. | empresa/compañía | |
Nimm einen Mantel mit, es ist kalt. | Llévate un abrigo, hace frío. | abrigo | |
Mein Sohn geht aufs Gymnasium. | Mi hijo va al instituto. | instituto/colegio | | Mi hijo va al colegio.
Meine Eltern bekommen eine gute Rente. | Mis padres cobran una buena pensión. | pensión/jubilación | | Mis padres reciben una buena pensión.
Die Konkurrenz ist groß. | La competencia es grande. | competencia | | Hay mucha competencia.
Hast du einen Prospekt vom Hotel? | ¿Tienes un folleto del hotel? | folleto | |
Ich gehe ins Fitnessstudio. | Voy al gimnasio. | gimnasio | |
Unterschreib hier, bitte. | Firma aquí, por favor. | Firma | |
Die Tischdecke ist schmutzig. | El mantel está sucio. | mantel | |
Mein Lehrer ist sehr geduldig. | Mi profesor es muy paciente. | profesor/maestro | | Mi maestro es muy paciente.
Ich habe dir Pralinen mitgebracht. | Te he traído bombones. | bombones | | Te traje bombones.
Vor dem Kino ist eine lange Schlange. | Hay una cola larga delante del cine. | cola | | Hay una larga cola delante del cine.
Die Schuhe waren ein Schnäppchen. | Los zapatos fueron una ganga. | ganga | |
Die Fernbedienung braucht neue Batterien. | El mando necesita pilas nuevas. | pilas | | El mando a distancia necesita pilas nuevas.;; El control remoto necesita pilas nuevas.
Ich bin erkältet. | Estoy constipado. | constipado/resfriado/constipada/resfriada | | Estoy resfriado.;; Estoy constipada.;; Estoy resfriada.
Die Ausgaben sind gestiegen. | Los gastos han subido. | gastos | |
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
