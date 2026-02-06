// frontend/src/utils/polylineAnim.js
// Utilities to animate a marker along a polyline (array of [lat, lng])

/**
 * Build cumulative arc-lengths for a polyline.
 * @param {Array<[number, number]>} latlngs
 * @returns {{ lengths: number[], total: number }}
 */
export function buildArcLengths(latlngs) {
  if (!Array.isArray(latlngs) || latlngs.length < 2) {
    return { lengths: [0], total: 0 };
  }

  const lengths = [0];
  let total = 0;

  for (let i = 1; i < latlngs.length; i++) {
    const [lat1, lng1] = latlngs[i - 1];
    const [lat2, lng2] = latlngs[i];
    const d = haversineMeters(lat1, lng1, lat2, lng2);
    total += d;
    lengths.push(total);
  }

  return { lengths, total };
}

/**
 * Returns an interpolated point at distance `dMeters` along the polyline.
 * @param {Array<[number, number]>} latlngs
 * @param {{ lengths: number[], total: number }} arc
 * @param {number} dMeters
 * @returns {[number, number]} [lat, lng]
 */
export function pointAt(latlngs, arc, dMeters) {
  if (!Array.isArray(latlngs) || latlngs.length === 0) return [0, 0];
  if (!arc || !Array.isArray(arc.lengths)) return latlngs[0];

  const total = arc.total ?? arc.lengths[arc.lengths.length - 1] ?? 0;
  if (total <= 0) return latlngs[0];

  // clamp distance
  const d = Math.max(0, Math.min(dMeters, total));

  // find segment where d lies
  let i = 1;
  while (i < arc.lengths.length && arc.lengths[i] < d) i++;

  if (i >= arc.lengths.length) return latlngs[latlngs.length - 1];

  const d0 = arc.lengths[i - 1];
  const d1 = arc.lengths[i];
  const t = d1 === d0 ? 0 : (d - d0) / (d1 - d0);

  const [latA, lngA] = latlngs[i - 1];
  const [latB, lngB] = latlngs[i];

  // linear interpolation in lat/lng space (good enough for small segments)
  const lat = latA + (latB - latA) * t;
  const lng = lngA + (lngB - lngA) * t;

  return [lat, lng];
}

// --- helpers ---
function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
