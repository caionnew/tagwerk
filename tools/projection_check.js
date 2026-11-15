// Vergleicht Kartenprojektionen über allen Grenzpunkten der dargestellten Länder (Aufruf: node tools/projection_check.js).
// Tissot-Indikatrix numerisch: Halbachsen a, b aus der Jacobi-Matrix der Projektion (Kugel, Längen in Grad-Bogenmaß).
const topo = require('world-atlas/countries-50m.json'), { feature } = require('topojson-client'), d3 = require('d3-geo');
const feats = feature(topo, topo.objects.countries).features;
const R = Math.PI / 180;
function tissot(proj, lon, lat){
  const h = 1e-3, p = proj([lon, lat]), px = proj([lon + h, lat]), py = proj([lon, lat + h]);
  // Ableitungen nach Bogenlänge auf der Einheitskugel: Ost-West um cos(φ) gekürzt
  const dx = [(px[0] - p[0]) / (h * R * Math.cos(lat * R)), (px[1] - p[1]) / (h * R * Math.cos(lat * R))];
  const dy = [(py[0] - p[0]) / (h * R), (py[1] - p[1]) / (h * R)];
  const E = dx[0] ** 2 + dx[1] ** 2, G = dy[0] ** 2 + dy[1] ** 2, F = dx[0] * dy[0] + dx[1] * dy[1];
  const s = Math.sqrt((E - G) ** 2 + 4 * F * F), a = Math.sqrt((E + G + s) / 2), b = Math.sqrt(Math.max(0, (E + G - s) / 2));
  return { area:a * b, omega:2 * Math.asin((a - b) / (a + b)) / R };
}
function measure(name, proj, keys, box){
  const pts = [];
  feats.filter(f => keys.includes(f.properties.name)).forEach(f => { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates; polys.forEach(pl => pl[0].forEach((c, i) => { if (i % 3 === 0 && (!box || (c[0] >= box[0] && c[0] <= box[1] && c[1] >= box[2] && c[1] <= box[3]))) pts.push(c); })); });
  let amin = Infinity, amax = 0, omax = 0, osum = 0;
  pts.forEach(([lo, la]) => { const t = tissot(proj, lo, la); amin = Math.min(amin, t.area); amax = Math.max(amax, t.area); omax = Math.max(omax, t.omega); osum += t.omega; });
  console.log(`${name.padEnd(44)} Flächenfaktor max/min ${(amax / amin).toFixed(3)}   ω max ${omax.toFixed(1)}°   ω Mittel ${(osum / pts.length).toFixed(1)}°`);
}
const HISP = ['Spain', 'Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Dominican Rep.', 'Puerto Rico', 'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Chile', 'Argentina', 'Uruguay', 'Paraguay', 'Eq. Guinea', 'United States of America'];
console.log('— Spanischsprachige Welt, sichtbarer Ausschnitt 125° W–15° O, 57° S–50° N —');
const BOX = [-125, 15, -57, 50];
measure('Plattkarte (bisher)', d3.geoEquirectangular(), HISP, BOX);
measure('Mercator (zum Vergleich)', d3.geoMercator(), HISP, BOX);
measure('Natural Earth 1, 50° W (Kompromiss)', d3.geoNaturalEarth1().rotate([50, 0]), HISP, BOX);
measure('Equal Earth, 50° W', d3.geoEqualEarth().rotate([50, 0]), HISP, BOX);
measure('Equal Earth, 55° W', d3.geoEqualEarth().rotate([55, 0]), HISP, BOX);
measure('Lambert flächentreu azimutal, 50° W 0°', d3.geoAzimuthalEqualArea().rotate([50, 0]), HISP, BOX);
measure('Lambert flächentreu azimutal, 55° W 10° N', d3.geoAzimuthalEqualArea().rotate([55, -10]), HISP, BOX);
const NORD = ['Sweden', 'Norway', 'Finland', 'Denmark', 'Åland'];
console.log('— Norden (SE, NO, FI, DK, Åland) —');
measure('Transversale Mercator 15° O (bisher, SWEREF 99 TM)', d3.geoTransverseMercator().rotate([-15, 0]), NORD);
measure('Lambert flächentreu azimutal, Mitte 17° O 63° N', d3.geoAzimuthalEqualArea().rotate([-17, -63]), NORD);
measure('Lambert winkeltreu konisch (EPSG:3034-artig)', d3.geoConicConformal().parallels([57, 68]).rotate([-17, 0]), NORD);
// Rastersuche: Mittelpunkt der flächentreuen Azimutalprojektion, Minimax-Kriterium.
// Jedes Land zählt gleich (nicht jeder Grenzpunkt), damit lange Küsten wie Chile das Ergebnis nicht bestimmen.
if (process.argv.includes('--search')) {
  const byCountry = HISP.map(n => { const pts = []; feats.filter(f => f.properties.name === n).forEach(f => { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates; polys.forEach(pl => pl[0].forEach((c, i) => { if (i % 3 === 0 && c[0] >= BOX[0] && c[0] <= BOX[1] && c[1] >= BOX[2] && c[1] <= BOX[3]) pts.push(c); })); }); return pts; }).filter(p => p.length);
  let best = null;
  for (let lo = -85; lo <= -30; lo += 2.5) for (let la = -20; la <= 30; la += 2.5) {
    const pr = d3.geoAzimuthalEqualArea().rotate([-lo, -la]);
    const per = byCountry.map(pts => { let m = 0, s = 0; pts.forEach(([x, y]) => { const t = tissot(pr, x, y); m = Math.max(m, t.omega); s += t.omega; }); return { m, mean:s / pts.length }; });
    const r = { lo, la, mx:Math.max(...per.map(x => x.m)), mean:per.reduce((a, x) => a + x.mean, 0) / per.length };
    if (!best || r.mx < best.mx - 1e-9 || (Math.abs(r.mx - best.mx) < 1e-9 && r.mean < best.mean)) best = r;
  }
  console.log(`Minimax-Mittelpunkt: ${-best.lo}° W ${best.la >= 0 ? best.la + '° N' : -best.la + '° S'} · ω max ${best.mx.toFixed(1)}° · ω Mittel je Land ${best.mean.toFixed(1)}°`);
}
