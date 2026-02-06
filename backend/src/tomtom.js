// backend/src/tomtom.js
export async function getTomTomRoutePolyline({ fromLat, fromLon, toLat, toLon }) {
  const key = process.env.TOMTOM_API_KEY;
  if (!key) throw new Error("Missing TOMTOM_API_KEY in backend/.env");

  // TomTom routing format: "lat,lon:lat,lon"
  const loc = `${fromLat},${fromLon}:${toLat},${toLon}`;

  const url =
    `https://api.tomtom.com/routing/1/calculateRoute/${encodeURIComponent(loc)}/json` +
    `?key=${encodeURIComponent(key)}` +
    `&routeType=fastest` +
    `&traffic=true` +
    `&routeRepresentation=polyline`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TomTom error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const points = data?.routes?.[0]?.legs?.[0]?.points ?? [];

  // Convert TomTom points => Leaflet polyline points: [lat, lon]
  return points.map((p) => [p.latitude, p.longitude]);
}
