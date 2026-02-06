import "dotenv/config";
import { fetchGtfsRt } from "./gtfsrt.js";
import { redis } from "./db.js";

function gridCell(lat, lon, cellSize = 0.0025) {
  // ~0.0025 degrees ~= ~250m (rough)
  const gx = Math.floor(lon / cellSize);
  const gy = Math.floor(lat / cellSize);
  return { gx, gy, key: `grid:${gx}:${gy}` };
}

export async function ingestGtfsRt({ historyCol }) {
  const feedUrl = process.env.GTFS_RT_URL;
  if (!feedUrl) throw new Error("Missing GTFS_RT_URL in .env");

  const feed = await fetchGtfsRt(feedUrl);

  // Try to extract VehiclePositions (best case)
  const vehicles = [];
  for (const e of feed.entity) {
    if (!e.vehicle) continue;
    const v = e.vehicle;
    const lat = v.position?.latitude;
    const lon = v.position?.longitude;
    if (lat == null || lon == null) continue;

    vehicles.push({
      vehicleId: v.vehicle?.id || e.id,
      tripId: v.trip?.tripId || null,
      routeId: v.trip?.routeId || null,
      lat,
      lon,
      bearing: v.position?.bearing ?? null,
      speed: v.position?.speed ?? null,
      ts: v.timestamp ? new Date(Number(v.timestamp) * 1000) : new Date(),
    });
  }

  // If feed has no vehicle positions, this will be empty.
  // (Then you can switch to stop/departure based realtime or estimated position.)
  for (const v of vehicles) {
    // 1) LIVE state in Redis (TTL 30s)
    await redis.set(`pt:veh:${v.vehicleId}`, JSON.stringify(v), { EX: 30 });

    // 2) HISTORY in MongoDB
    await historyCol.insertOne({
      vehicleId: v.vehicleId,
      routeId: v.routeId,
      tripId: v.tripId,
      ts: v.ts,
      loc: { type: "Point", coordinates: [v.lon, v.lat] },
      speed: v.speed,
      bearing: v.bearing,
    });

    // 3) HOTSPOT grid cell counter (TTL 60s)
    const cell = gridCell(v.lat, v.lon);
    await redis.incr(cell.key);
    await redis.expire(cell.key, 60);
  }

  return { vehicleCount: vehicles.length };
}
