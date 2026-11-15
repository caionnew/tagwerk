/* Lesetexte: eigene Texte (keine Übernahmen), Fakten geprüft. Je Text drei Verständnisfragen auf Deutsch,
   die erste Antwort ist die richtige (die App mischt die Reihenfolge), und zwei Sätze zum Übernehmen mit Übersetzung.
   Absätze im Text mit Leerzeile trennen. Jeder Satz endet mit . ! oder ?, damit Vorlesen und Antippen satzweise gehen. */
const TEXTS = {
sv:[
{ id:'allemansratten', topic:'Natur', level:'B1', title:'Allemansrätten',
  body:`I Sverige får alla röra sig fritt i naturen, även på mark som någon annan äger. Det kallas allemansrätten. Du får vandra i skogen, bada i sjöar och plocka bär och svamp. Du får också tälta ett eller två dygn på samma ställe, om du inte är för nära ett hus.

Men rätten kommer med ansvar. Man ska inte störa djur eller människor, och man får inte skada träd eller lämna skräp efter sig. Att göra upp eld är ofta förbjudet på sommaren, när det är torrt. Regeln är enkel: inte störa, inte förstöra.

Allemansrätten är ingen vanlig lag med många paragrafer. Den är en gammal sedvänja som nämns i grundlagen.`,
  q:[['Was erlaubt die Allemansrätten?', ['Im Wald wandern und Beeren pflücken, auch auf fremdem Land', 'Überall Feuer machen', 'Bäume fällen, wenn man Holz braucht']],
     ['Wie lange darf man an einem Ort zelten?', ['Ein oder zwei Tage', 'Eine Woche', 'Gar nicht']],
     ['Was ist die Allemansrätten?', ['Eine alte Tradition, die im Grundgesetz erwähnt wird', 'Ein Gesetz mit vielen Paragrafen', 'Eine Regel nur für Nationalparks']]],
  keep:[['Du får vandra i skogen, bada i sjöar och plocka bär och svamp.', 'Du darfst im Wald wandern, in Seen baden und Beeren und Pilze sammeln.'],
        ['Regeln är enkel: inte störa, inte förstöra.', 'Die Regel ist einfach: nicht stören, nicht zerstören.']] },
{ id:'vasa', topic:'Geschichte', level:'B2', title:'Regalskeppet Vasa',
  body:`Den 10 augusti 1628 seglade det nya krigsskeppet Vasa ut från Stockholm. Skeppet var stort, vackert och fullt av kanoner. Kungen, Gustav II Adolf, ville visa hela Europa hur mäktigt Sverige var. Men efter bara drygt tusen meter kom en vindby. Vasa lutade, vatten forsade in genom kanonportarna och skeppet sjönk mitt i hamnen.

Skeppet var helt enkelt för smalt och för högt. Det låg kvar på botten i 333 år. I Östersjöns kalla vatten, som bara innehåller lite salt, kan skeppsmasken inte leva, och därför var träet väl bevarat. År 1961 lyftes Vasa upp. I dag står skeppet i Vasamuseet, ett av de mest besökta museerna i Skandinavien.`,
  q:[['Warum sank die Vasa?', ['Sie war zu schmal und zu hoch', 'Sie stieß gegen einen Felsen', 'Sie wurde im Krieg beschossen']],
     ['Wann wurde das Schiff gehoben?', ['1961', '1628', '1990']],
     ['Warum blieb das Holz so gut erhalten?', ['Im wenig salzigen Wasser der Ostsee lebt der Schiffsbohrwurm nicht', 'Das Schiff war mit Metall verkleidet', 'Es lag tief im Sand vergraben']]],
  keep:[['Skeppet var helt enkelt för smalt och för högt.', 'Das Schiff war einfach zu schmal und zu hoch.'],
        ['År 1961 lyftes Vasa upp.', '1961 wurde die Vasa gehoben.']] },
{ id:'midnattssol', topic:'Natur', level:'B1', title:'Midnattssol och mörkertid',
  body:`Norr om polcirkeln är året fullt av kontraster. På sommaren går solen inte ner på flera veckor. I Kiruna kan man se midnattssolen från slutet av maj till mitten av juli. Många har svårt att sova och sätter upp mörka gardiner.

På vintern är det tvärtom. Då kommer solen inte upp över horisonten, och det kallas mörkertid. Helt mörkt är det ändå inte. Mitt på dagen blir himlen blå och rosa i några timmar, och snön lyser upp landskapet.

Den som bor i norr lär sig att leva med ljuset. På sommaren grillar folk mitt i natten, och på vintern tänder man levande ljus och letar efter norrsken.`,
  q:[['Wann sieht man in Kiruna die Mitternachtssonne?', ['Von Ende Mai bis Mitte Juli', 'Im Dezember', 'Das ganze Jahr über']],
     ['Was ist „mörkertid“?', ['Die Zeit, in der die Sonne nicht über den Horizont kommt', 'Die Stunden nach Mitternacht', 'Ein Fest im Winter']],
     ['Wie ist es mittags in der „mörkertid“?', ['Der Himmel wird für einige Stunden blau und rosa', 'Es ist völlig schwarz', 'Die Sonne scheint kurz']]],
  keep:[['På sommaren går solen inte ner på flera veckor.', 'Im Sommer geht die Sonne mehrere Wochen lang nicht unter.'],
        ['På vintern är det tvärtom.', 'Im Winter ist es umgekehrt.']] },
{ id:'astrid', topic:'Kultur', level:'B1', title:'Astrid Lindgren',
  body:`Astrid Lindgren föddes 1907 på en gård utanför Vimmerby i Småland. Som barn lekte hon mycket ute, och många av hennes berättelser handlar om fria barn i naturen.

Hon började skriva på allvar när hennes dotter Karin var sjuk och ville höra en saga. Karin hittade själv på namnet Pippi Långstrump. Boken kom ut 1945 och blev en succé. Pippi är starkare än alla vuxna, bor ensam med en häst och en apa och bestämmer själv över sitt liv.

Astrid Lindgren skrev också om Emil i Lönneberga, Ronja Rövardotter och bröderna Lejonhjärta. Hennes böcker är översatta till över hundra språk.`,
  q:[['Wer hat sich den Namen Pippi Langstrumpf ausgedacht?', ['Astrids Tochter Karin', 'Astrid Lindgren selbst', 'Ihr Verlag']],
     ['Wann erschien das erste Pippi-Buch?', ['1945', '1907', '1965']],
     ['Mit wem lebt Pippi zusammen?', ['Mit einem Pferd und einem Affen', 'Mit ihren Eltern', 'Mit einem Hund und einer Katze']]],
  keep:[['Hon började skriva på allvar när hennes dotter Karin var sjuk och ville höra en saga.', 'Sie begann ernsthaft zu schreiben, als ihre Tochter Karin krank war und ein Märchen hören wollte.'],
        ['Hennes böcker är översatta till över hundra språk.', 'Ihre Bücher sind in über hundert Sprachen übersetzt.']] },
{ id:'surstromming', topic:'Kurioses', level:'B1', title:'Surströmming',
  body:`Surströmming är strömming från Östersjön som får jäsa i flera månader. Fisken läggs först i saltlake och sedan i burkar. Under jäsningen bildas gaser, och därför kan burkarna bli runda och buckliga.

Lukten är berömd, och många tycker att den är fruktansvärd. Därför öppnar man burken utomhus, gärna under vatten eller i en hink. Den som vågar smaka äter fisken på tunnbröd med potatis, lök och gräddfil.

Traditionen är starkast i Norrland, särskilt längs Höga kusten. Säsongen börjar i augusti, och då bjuder många in till surströmmingsfest. Några älskar det, andra flyr så fort burken öppnas.`,
  q:[['Warum werden die Dosen rund?', ['Beim Gären entstehen Gase', 'Sie werden zu warm gelagert', 'Man füllt zu viel Fisch hinein']],
     ['Wo öffnet man die Dose am besten?', ['Draußen, gern unter Wasser oder in einem Eimer', 'In der Küche am offenen Fenster', 'Im Kühlschrank']],
     ['Womit isst man Surströmming?', ['Mit Tunnbröd, Kartoffeln, Zwiebeln und Sauerrahm', 'Mit Reis und Sojasoße', 'Mit süßem Gebäck']]],
  keep:[['Lukten är berömd, och många tycker att den är fruktansvärd.', 'Der Geruch ist berühmt, und viele finden ihn furchtbar.'],
        ['Några älskar det, andra flyr så fort burken öppnas.', 'Manche lieben es, andere fliehen, sobald die Dose geöffnet wird.']] },
{ id:'ishotellet', topic:'Reisen', level:'B1', title:'Ett hotell av is',
  body:`I Jukkasjärvi, inte långt från Kiruna, byggs ett hotell av is varje vinter. Isen tas från Torne älv på våren, sparas i kalla hallar och används när det blir kallt igen.

Konstnärer från hela världen formar rummen. Det finns sängar, stolar och lampor av is, och varje rum ser annorlunda ut. Inne är det runt minus fem grader. Gästerna sover i varma sovsäckar på renfällar.

På våren smälter hotellet och vattnet rinner tillbaka till älven. Sedan några år finns det också en del som är öppen hela året, med kylning som drivs av solenergi.`,
  q:[['Woher kommt das Eis?', ['Aus dem Fluss Torne älv', 'Aus einer Eisfabrik', 'Aus Grönland']],
     ['Wie kalt ist es in den Zimmern?', ['Etwa minus fünf Grad', 'Etwa null Grad', 'Etwa minus zwanzig Grad']],
     ['Was passiert im Frühling?', ['Das Hotel schmilzt, das Wasser fließt zurück in den Fluss', 'Es wird abgebaut und eingelagert', 'Es bleibt bis zum nächsten Winter stehen']]],
  keep:[['Inne är det runt minus fem grader.', 'Drinnen sind es etwa minus fünf Grad.'],
        ['Gästerna sover i varma sovsäckar på renfällar.', 'Die Gäste schlafen in warmen Schlafsäcken auf Rentierfellen.']] },
{ id:'foraldraledig', topic:'Gesellschaft', level:'B2', title:'Föräldraledighet',
  body:`I Sverige har föräldrar rätt till 480 dagar med föräldrapenning per barn. Dagarna kan delas mellan föräldrarna, men 90 dagar är reserverade för var och en av dem. Om en förälder inte tar sina dagar, försvinner de.

Systemet infördes 1974, och Sverige blev då det första landet i världen där även pappor kunde vara föräldralediga med ersättning. I dag är det vanligt att se pappor med barnvagn mitt på dagen. De kallas ibland lattepappor.

Ändå tar mammor fortfarande ut de flesta dagarna. Debatten handlar därför ofta om hur ledigheten ska delas mer jämnt.`,
  q:[['Wie viele Tage Elterngeld gibt es pro Kind?', ['480', '90', '365']],
     ['Was passiert mit reservierten Tagen, die ein Elternteil nicht nimmt?', ['Sie verfallen', 'Der andere Elternteil bekommt sie', 'Man bekommt sie ausgezahlt']],
     ['Was war 1974 besonders?', ['Als erstes Land konnten auch Väter bezahlte Elternzeit nehmen', 'Das Kindergeld wurde abgeschafft', 'Kitas wurden kostenlos']]],
  keep:[['Om en förälder inte tar sina dagar, försvinner de.', 'Wenn ein Elternteil seine Tage nicht nimmt, verfallen sie.'],
        ['I dag är det vanligt att se pappor med barnvagn mitt på dagen.', 'Heute sieht man oft Väter mit Kinderwagen mitten am Tag.']] }
],
es:[
{ id:'siesta', topic:'Alltag', level:'A2', title:'La siesta',
  body:`Mucha gente cree que en España todo el mundo duerme la siesta. No es verdad. La mayoría de los españoles trabaja por la tarde y no tiene tiempo para dormir.

Lo que sí es típico es una pausa larga a mediodía. En muchos pueblos las tiendas cierran entre las dos y las cinco. La gente come tranquilamente, a veces con la familia, y la comida de mediodía es la más importante del día.

En verano, cuando hace mucho calor, una siesta corta es una buena idea. Algunos médicos dicen que veinte minutos son suficientes. Si duermes más, puedes despertarte cansado.`,
  q:[['Schlafen alle Spanier Siesta?', ['Nein, die meisten arbeiten nachmittags', 'Ja, jeden Tag', 'Nur im Winter']],
     ['Was ist in vielen Dörfern typisch?', ['Die Geschäfte schließen zwischen zwei und fünf', 'Die Geschäfte sind nachts offen', 'Mittags isst man nichts']],
     ['Wie lang sollte eine Siesta laut einigen Ärzten sein?', ['Zwanzig Minuten', 'Zwei Stunden', 'Eine Stunde']]],
  keep:[['En muchos pueblos las tiendas cierran entre las dos y las cinco.', 'In vielen Dörfern schließen die Geschäfte zwischen zwei und fünf.'],
        ['Algunos médicos dicen que veinte minutos son suficientes.', 'Einige Ärzte sagen, dass zwanzig Minuten genügen.']] },
{ id:'castells', topic:'Kultur', level:'B1', title:'Los castells',
  body:`En Cataluña, en las fiestas de muchos pueblos, grupos de personas construyen torres humanas. Se llaman castells, que significa castillos en catalán.

Abajo, cientos de personas forman la pinya, una base fuerte que sostiene la torre. Encima suben los demás, de pie sobre los hombros de los otros. Cuanto más alto, más ligeros son. Arriba del todo sube un niño o una niña, que lleva casco y levanta la mano para saludar. En ese momento el castell está completo.

Esta tradición tiene más de doscientos años. Desde 2010 es Patrimonio Cultural Inmaterial de la Humanidad.`,
  q:[['Was bedeutet „castells“?', ['Burgen', 'Türme', 'Feste']],
     ['Wer steht ganz oben?', ['Ein Kind mit Helm', 'Der stärkste Mann', 'Die Leiterin der Gruppe']],
     ['Seit wann sind die castells Weltkulturerbe?', ['Seit 2010', 'Seit 1810', 'Seit 1990']]],
  keep:[['Cuanto más alto, más ligeros son.', 'Je höher, desto leichter sind sie.'],
        ['Esta tradición tiene más de doscientos años.', 'Diese Tradition ist über zweihundert Jahre alt.']] },
{ id:'camino', topic:'Reisen', level:'A2', title:'El Camino de Santiago',
  body:`Cada año, cientos de miles de personas caminan hacia Santiago de Compostela, una ciudad en Galicia, en el noroeste de España. Es el Camino de Santiago.

Hay muchos caminos diferentes. El más famoso, el Camino Francés, empieza en los Pirineos y tiene unos ochocientos kilómetros. Por la noche, los peregrinos duermen en albergues baratos.

Cada peregrino tiene una credencial, un pequeño pasaporte. En los albergues, bares e iglesias le ponen sellos. Quien camina por lo menos los últimos cien kilómetros recibe al final la Compostela, un certificado. Muchos dicen que lo más bonito no es la meta, sino la gente que conocen por el camino.`,
  q:[['Wo liegt Santiago de Compostela?', ['In Galicien, im Nordwesten Spaniens', 'In Andalusien', 'In Katalonien']],
     ['Wofür ist die „credencial“?', ['Für Stempel unterwegs', 'Als Busfahrkarte', 'Als Eintritt in die Kathedrale']],
     ['Was bekommt man für die letzten 100 km zu Fuß?', ['Die Compostela, ein Zertifikat', 'Eine Medaille', 'Ein kostenloses Hotelzimmer']]],
  keep:[['Hay muchos caminos diferentes.', 'Es gibt viele verschiedene Wege.'],
        ['Por la noche, los peregrinos duermen en albergues baratos.', 'Nachts schlafen die Pilger in günstigen Herbergen.']] },
{ id:'galapagos', topic:'Natur', level:'B1', title:'Las islas Galápagos',
  body:`Las islas Galápagos están en el océano Pacífico, a unos mil kilómetros de la costa de Ecuador. Son islas volcánicas, y algunas todavía tienen volcanes activos.

Muchos animales de las islas no existen en ningún otro lugar del mundo. Hay tortugas gigantes que pueden vivir más de cien años, iguanas que nadan en el mar y pájaros con patas azules. Como casi no tienen enemigos, muchos animales no tienen miedo de las personas.

En 1835 llegó Charles Darwin. Lo que observó allí le ayudó más tarde a desarrollar su teoría de la evolución. Hoy casi todo el archipiélago es parque nacional, y muchas zonas solo se pueden visitar con un guía.`,
  q:[['Zu welchem Land gehören die Galápagos-Inseln?', ['Ecuador', 'Peru', 'Chile']],
     ['Warum haben viele Tiere keine Angst vor Menschen?', ['Sie haben kaum Feinde', 'Sie werden gefüttert', 'Sie sind gezüchtet']],
     ['Wer kam 1835 auf die Inseln?', ['Charles Darwin', 'Christoph Kolumbus', 'Alexander von Humboldt']]],
  keep:[['Muchos animales de las islas no existen en ningún otro lugar del mundo.', 'Viele Tiere der Inseln gibt es nirgendwo sonst auf der Welt.'],
        ['En 1835 llegó Charles Darwin.', '1835 kam Charles Darwin.']] },
{ id:'machupicchu', topic:'Geschichte', level:'B1', title:'Machu Picchu',
  body:`Machu Picchu es una ciudad inca construida en el siglo quince en las montañas de Perú, a unos dos mil cuatrocientos metros de altura. Los incas la construyeron con piedras tan bien cortadas que entre ellas no cabe ni un cuchillo.

Cuando llegaron los españoles, la ciudad ya estaba abandonada, y nunca la encontraron. Por eso se conservó tan bien. En 1911 el explorador estadounidense Hiram Bingham la dio a conocer al mundo, aunque los campesinos de la zona siempre supieron que estaba allí.

Hoy es Patrimonio de la Humanidad y una de las ruinas más visitadas de América. Para protegerla, el número de visitantes por día está limitado.`,
  q:[['Wann wurde Machu Picchu gebaut?', ['Im 15. Jahrhundert', 'Im 18. Jahrhundert', 'Vor 3000 Jahren']],
     ['Warum ist die Stadt so gut erhalten?', ['Die Spanier haben sie nie gefunden', 'Sie lag unter Schnee begraben', 'Sie wurde 1911 neu aufgebaut']],
     ['Was gilt heute für Besucher?', ['Die Zahl pro Tag ist begrenzt', 'Der Eintritt ist verboten', 'Man darf nur nachts hinein']]],
  keep:[['Cuando llegaron los españoles, la ciudad ya estaba abandonada, y nunca la encontraron.', 'Als die Spanier kamen, war die Stadt schon verlassen, und sie fanden sie nie.'],
        ['Por eso se conservó tan bien.', 'Deshalb blieb sie so gut erhalten.']] },
{ id:'muertos', topic:'Kultur', level:'A2', title:'El Día de Muertos',
  body:`En México, el 1 y el 2 de noviembre se celebra el Día de Muertos. No es un día triste. Las familias recuerdan a las personas que han muerto y creen que esos días vuelven a visitarlas.

En casa preparan una ofrenda, una especie de altar con fotos, velas y flores naranjas de cempasúchil. También ponen la comida favorita de los muertos y el pan de muerto, un pan dulce que solo se hace en esta época.

Muchas familias pasan la noche en el cementerio. Limpian las tumbas, las decoran con flores, comen juntos y a veces hay música. Las calaveras de azúcar, de muchos colores, son uno de los símbolos más conocidos de la fiesta.`,
  q:[['Wann wird der Día de Muertos gefeiert?', ['Am 1. und 2. November', 'Am 31. Dezember', 'Im Frühling']],
     ['Was ist eine „ofrenda“?', ['Eine Art Altar mit Fotos, Kerzen und Blumen', 'Ein Kostüm', 'Ein Lied']],
     ['Wie ist die Stimmung an diesen Tagen?', ['Nicht traurig, man erinnert sich gemeinsam', 'Sehr still und traurig', 'Wie an Weihnachten mit Geschenken']]],
  keep:[['No es un día triste.', 'Es ist kein trauriger Tag.'],
        ['Muchas familias pasan la noche en el cementerio.', 'Viele Familien verbringen die Nacht auf dem Friedhof.']] },
{ id:'tomatina', topic:'Kurioses', level:'A2', title:'La Tomatina',
  body:`Cada año, el último miércoles de agosto, el pueblo de Buñol, cerca de Valencia, se pone rojo. Es la Tomatina, una batalla de tomates.

Llegan a la plaza camiones llenos de tomates maduros, y durante una hora miles de personas se los tiran unos a otros. Las reglas son pocas: hay que aplastar los tomates antes de tirarlos, para no hacer daño, y no se puede romper la ropa de otros.

Cuando termina la batalla, las calles están cubiertas de una salsa roja. Los bomberos limpian todo con agua, y los participantes se lavan en duchas o en el río. Nadie sabe exactamente cómo empezó, pero la primera Tomatina fue en 1945.`,
  q:[['Wann findet die Tomatina statt?', ['Am letzten Mittwoch im August', 'Am ersten Sonntag im Mai', 'An Silvester']],
     ['Welche Regel gilt?', ['Tomaten vor dem Werfen zerdrücken', 'Nur Grün tragen', 'Nur Kinder dürfen werfen']],
     ['Seit wann gibt es die Tomatina?', ['Seit 1945', 'Seit dem Mittelalter', 'Seit 2001']]],
  keep:[['Cuando termina la batalla, las calles están cubiertas de una salsa roja.', 'Wenn die Schlacht vorbei ist, sind die Straßen mit einer roten Soße bedeckt.'],
        ['Nadie sabe exactamente cómo empezó, pero la primera Tomatina fue en 1945.', 'Niemand weiß genau, wie es anfing, aber die erste Tomatina war 1945.']] }
]
};
const textSentences = body => body.split(/\n\s*\n/).map(p => p.trim().split(/(?<=[.!?])\s+(?=[A-ZÅÄÖÁÉÍÓÚÑ¿¡0-9])/));
