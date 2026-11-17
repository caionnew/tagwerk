// Erzeugt geo.js: vereinfachte Ländergrenzen (Natural Earth, gemeinfrei) als SVG-Pfade für drei Kartenausschnitte.
// Aufruf: node tools/build_geo.js  (braucht: npm i world-atlas@2 topojson-client@3 topojson-server@3 topojson-simplify@3 d3-geo@3)
// Für Spanien mit seinen autonomen Gemeinschaften zusätzlich Natural Earth „admin 1“ (10m, gemeinfrei, rund 40 MB):
//   curl -L -o tools/ne_10m_admin_1_states_provinces.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
// oder den Pfad in GEO_ADMIN1 angeben. Die Datei bleibt außerhalb von Git.
const path = require('path'), fs = require('fs');
const req = m => require(require.resolve(m, { paths:[process.env.GEO_MODULES || path.join(__dirname, '..', 'node_modules'), path.join(__dirname, 'node_modules')] }));
const topo = req('world-atlas/countries-50m.json');
const { feature } = req('topojson-client');
const { presimplify, simplify, quantile } = req('topojson-simplify');
const d3 = req('d3-geo');
const { topology } = req('topojson-server');
const { merge } = req('topojson-client');
const pre = presimplify(JSON.parse(JSON.stringify(topo)));
const NAME = { Spain:'ESP', Mexico:'MEX', Guatemala:'GTM', Honduras:'HND', 'El Salvador':'SLV', Nicaragua:'NIC', 'Costa Rica':'CRI', Panama:'PAN', Cuba:'CUB', 'Dominican Rep.':'DOM', 'Puerto Rico':'PRI', Colombia:'COL', Venezuela:'VEN', Ecuador:'ECU', Peru:'PER', Bolivia:'BOL', Chile:'CHL', Argentina:'ARG', Uruguay:'URY', Paraguay:'PRY', 'Eq. Guinea':'GNQ', 'United States of America':'USA',
  Sweden:'SWE', Norway:'NOR', Finland:'FIN', Denmark:'DNK', 'Åland':'ALA' };
const r1 = x => Math.round(x * 10) / 10;
function pathOf(proj, geo){ return (d3.geoPath(proj)(geo) || '').replace(/-?\d+\.\d+/g, m => String(r1(Number(m)))).replace(/,/g, ' ').replace(/ ?([MLZ]) ?/g, '$1'); }
function view(cfg){
  const simp = simplify(pre, quantile(pre, cfg.q));
  const feats = feature(simp, simp.objects.countries).features;
  const proj = cfg.proj();
  const fitObj = { type:'FeatureCollection', features:feats.filter(f => cfg.fit.includes(NAME[f.properties.name])) };
  const box = cfg.fitBox || fitObj;
  if (cfg.autoHeight) {
    // Höhe aus dem Seitenverhältnis des Ausschnitts in dieser Projektion, damit nichts gestaucht oder leer bleibt
    proj.fitWidth(cfg.w - 8, box);
    const [[, y0], [, y1]] = d3.geoPath(proj).bounds(box);
    cfg.h = Math.ceil(y1 - y0 + 8);
    proj.fitExtent([[4, 4], [cfg.w - 4, cfg.h - 4]], box);
  } else proj.fitExtent([[4, 4], [cfg.w - 4, cfg.h - 4]], box);
  proj.clipExtent([[0, 0], [cfg.w, cfg.h]]);
  const c = {}, base = [];
  feats.forEach(f => { const k = NAME[f.properties.name], p = pathOf(proj, f); if (!p) return; if (k && cfg.keys.includes(k)) c[k] = p; else base.push(p); });
  const pts = {}; Object.entries(cfg.pts || {}).forEach(([n, ll]) => { const p = proj(ll); pts[n] = [r1(p[0]), r1(p[1])]; });
  const out = { w:cfg.w, h:cfg.h, base:base.join(''), c, pts };
  if (cfg.extra) Object.assign(out, cfg.extra(proj));
  return out;
}
// Ring im Uhrzeigersinn (von oben gesehen): d3-geo deutet sonst das Band als „alles außer dem Band“
const band = (lat0, lat1, lon0, lon1) => { const ring = []; for (let x = lon0; x <= lon1; x += 0.5) ring.push([x, lat1]); for (let x = lon1; x >= lon0; x -= 0.5) ring.push([x, lat0]); ring.push([lon0, lat1]); return { type:'Polygon', coordinates:[ring] }; };
const hispKeys = ['ESP', 'MEX', 'GTM', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'DOM', 'PRI', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'CHL', 'ARG', 'URY', 'PRY', 'GNQ', 'USA'];
const GEO = {
  // Flächentreue Azimutalprojektion nach Lambert, Mitte 57,5° W 10° N: flächentreu, weil die Karte Länder einfärbt;
  // Mittelpunkt per Minimax über die Winkelverzerrung aller Länder (tools/projection_check.js --search): ω max 22°.
  hisp:view({ w:340, autoHeight:true, q:0.12, keys:hispKeys, fit:[],
    fitBox:{ type:'Feature', geometry:{ type:'MultiPoint', coordinates:[[-124.5, 48.5], [-67, 47.5], [3.5, 43.8], [-9.5, 43.8], [11.5, 1], [-68.5, -55.8], [-117.5, 32.5], [-34.8, -7.5]] } },
    proj:() => d3.geoAzimuthalEqualArea().rotate([57.5, -10]) }),
  // Norden: Transversale Mercator um 15° O wie SWEREF 99 TM. Winkeltreu, Flächenfehler über SE, NO, FI, DK höchstens 1,8 %.
  // Ausschnitt an den Küsten entlang (Nordkap 71,2° N, Varanger 70,4° N), damit oben kein leerer Streifen bleibt; Höhe folgt daraus.
  nord:view({ w:240, autoHeight:true, q:0.06, keys:['SWE', 'NOR', 'FIN', 'DNK', 'ALA'], fit:['SWE', 'FIN', 'NOR', 'DNK'],
    fitBox:{ type:'Feature', geometry:{ type:'MultiPoint', coordinates:[[5, 54.5], [31.5, 54.5], [4.8, 61.5], [25.8, 71.2], [31.5, 70.4]] } },
    proj:() => d3.geoTransverseMercator().rotate([-15, 0]),
    pts:{ Kiruna:[20.2253, 67.8558], Stockholm:[18.0686, 59.3293], Göteborg:[11.9746, 57.7089], Malmö:[13.0038, 55.605], Helsingfors:[24.9384, 60.1699], Mariehamn:[19.9348, 60.0973], Oslo:[10.7522, 59.9139], Köpenhamn:[12.5683, 55.6761] },
    extra:proj => ({
      polar:pathOf(proj, { type:'LineString', coordinates:Array.from({ length:61 }, (_, i) => [0 + i * 0.6, 66.5634]) }),
      norrClip:pathOf(proj, band(60.6, 72, 5, 31)),
      // Schonen (Skåne län), grob: Nordgrenze zu Halland und Småland, Ostgrenze zu Blekinge, sonst durchs Meer. Im Uhrzeigersinn.
      skaneClip:pathOf(proj, { type:'Polygon', coordinates:[[[12.2, 56.47], [12.85, 56.47], [13.15, 56.44], [13.45, 56.42], [13.75, 56.47], [14.05, 56.5], [14.3, 56.44], [14.45, 56.3], [14.52, 56.03], [14.7, 55.7], [14.5, 55.2], [12.9, 55.1], [12.2, 55.4], [12.2, 56.47]]] })
    }) })
};
// Spanien: Provinzen aus Natural Earth admin 1, zu autonomen Gemeinschaften zusammengelegt (Schlüssel nach ISO 3166-2),
// Nachbarländer als Grundfläche, Andorra einzeln. Die Kanaren stehen auf 0,75 verkleinert in einem Kasten unten links (dafür reicht der Ausschnitt nach Westen bis 12° W).
const ES_REGION = { 'Andalucía':'ES-AN', 'Aragón':'ES-AR', 'Asturias':'ES-AS', 'Islas Baleares':'ES-IB', 'Canary Is.':'ES-CN', 'Cantabria':'ES-CB',
  'Castilla y León':'ES-CL', 'Castilla-La Mancha':'ES-CM', 'Cataluña':'ES-CT', 'Extremadura':'ES-EX', 'Galicia':'ES-GA', 'La Rioja':'ES-RI',
  'Madrid':'ES-MD', 'Murcia':'ES-MC', 'Foral de Navarra':'ES-NC', 'País Vasco':'ES-PV', 'Valenciana':'ES-VC', 'Ceuta':'ES-CE', 'Melilla':'ES-ML' };
function iberView(){
  const file = process.env.GEO_ADMIN1 || path.join(__dirname, 'ne_10m_admin_1_states_provinces.geojson');
  if (!fs.existsSync(file)) { console.error('Für den Ausschnitt Spanien fehlt Natural Earth admin 1, siehe Kopf dieser Datei:', file); process.exit(1); }
  const all = JSON.parse(fs.readFileSync(file, 'utf8')).features;
  const near = f => { const b = d3.geoBounds(f); return b[1][0] > -19 && b[0][0] < 6 && b[1][1] > 27 && b[0][1] < 45.5; };
  const feats = all.filter(f => ['ESP', 'PRT', 'FRA', 'AND', 'MAR', 'DZA'].includes(f.properties.adm0_a3) && near(f))
    .map(f => ({ type:'Feature', properties:{ k:f.properties.adm0_a3 === 'ESP' ? ES_REGION[f.properties.region] : f.properties.adm0_a3 }, geometry:f.geometry }));
  const miss = feats.filter(f => !f.properties.k); if (miss.length) throw new Error('Region ohne Schlüssel');
  const topo = topology({ a:{ type:'FeatureCollection', features:feats } }, 1e5);
  const pre2 = presimplify(topo), simp = simplify(pre2, quantile(pre2, 0.03));
  const keys = [...new Set(feats.map(f => f.properties.k))];
  const shape = k => merge(simp, simp.objects.a.geometries.filter(g => g.properties.k === k));
  const w = 300, main = d3.geoAzimuthalEqualArea().rotate([3.5, -40]);
  const box = { type:'Feature', geometry:{ type:'MultiPoint', coordinates:[[-12, 34.95], [4.4, 34.95], [-12, 43.85], [4.4, 43.85]] } };
  main.fitWidth(w - 8, box);
  const [[, y0], [, y1]] = d3.geoPath(main).bounds(box), h = Math.ceil(y1 - y0 + 8);
  main.fitExtent([[4, 4], [w - 4, h - 4]], box); main.clipExtent([[0, 0], [w, h]]);
  // Kasten für die Kanaren: gleiche Projektion, verkleinert, links unten
  const cn = { type:'Feature', geometry:{ type:'MultiPoint', coordinates:[[-18.2, 27.6], [-13.3, 29.45]] } };
  const ins = d3.geoAzimuthalEqualArea().rotate([15.7, -28.5]).scale(main.scale() * 0.75).translate([0, 0]);
  const [[cx0, cy0], [cx1, cy1]] = d3.geoPath(ins).bounds(cn), pad = 4, bw = cx1 - cx0 + 2 * pad, bh = cy1 - cy0 + 2 * pad;
  ins.translate([2 + pad - cx0, h - 2 - bh + pad - cy0]);
  const c = {}, base = [];
  keys.forEach(k => { const g = shape(k); const p = k === 'ES-CN' ? pathOf(ins, g) : pathOf(main, g); if (!p) return; if (k.startsWith('ES-') || k === 'AND') c[k] = p; else base.push(p); });
  const pts = {}; Object.entries({ Madrid:[-3.7038, 40.4168], Barcelona:[2.1734, 41.3851], Sevilla:[-5.9845, 37.3891], Ceuta:[-5.3213, 35.8894], Melilla:[-2.9381, 35.2923] }).forEach(([n, ll]) => { const p = main(ll); pts[n] = [r1(p[0]), r1(p[1])]; });
  return { w, h, base:base.join(''), c, pts, frame:`M2 ${r1(h - 2 - bh)}h${r1(bw)}v${r1(bh)}h${r1(-bw)}Z` };
}
GEO.iber = iberView();
const js = `/* Kartendaten, erzeugt mit tools/build_geo.js aus Natural Earth (gemeinfrei) über world-atlas. Nicht von Hand bearbeiten. */\nconst GEO = ${JSON.stringify(GEO)};\n`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'geo.js'), js);
console.log('geo.js', (js.length / 1024).toFixed(1), 'KB · hisp', Object.keys(GEO.hisp.c).length, 'Länder · nord', Object.keys(GEO.nord.c).length, 'Länder · iber', Object.keys(GEO.iber.c).length, 'Gebiete');
