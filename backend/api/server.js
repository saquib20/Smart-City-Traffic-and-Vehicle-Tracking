import express from "express";
import cors from "cors";
import "dotenv/config";

import { initDb, redis } from "./db.js";
import { tomtomRoute, tomtomIncidents } from "./tomtom.js";
import { ingestGtfsRt } from "./ingest.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const ctx = await initDb();
const historyCol = ctx.history;

// 1) Health
app.get("/health", (req, res) => res.json({ ok: true }));

// 2) TomTom: route
app.get("/tomtom/route", async (req, res) => {
  try {
    const from = req.query.from ?? "48.7758,9.1829";
    const to = req.query.to ?? "48.7830,9.2000";
    const data = await tomtomRoute(from, to);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3) TomTom: incidents
app.get("/tomtom/incidents", async (req, res) => {
  try {
    const bbox = req.query.bbox ?? "9.10,48.72,9.30,48.83";
    const data = await tomtomIncidents(bbox);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4) Trigger GTFS-RT ingest manually (for testing)
app.get("/pt/ingest", async (req, res) => {
  try {
    const result = await ingestGtfsRt({ historyCol });
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5) LIVE vehicles from Redis
app.get("/pt/live", async (req, res) => {
  try {
    const keys = await redis.keys("pt:veh:*");
    const values = keys.length ? await redis.mGet(keys) : [];
    const vehicles = values
      .filter(Boolean)
      .map((s) => JSON.parse(s));
    res.json({ count: vehicles.length, vehicles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 6) Vehicle history from MongoDB (last N points)
app.get("/pt/history", async (req, res) => {
  try {
    const vehicleId = req.query.vehicleId;
    const limit = Number(req.query.limit ?? 200);

    if (!vehicleId) return res.status(400).json({ error: "vehicleId required" });

    const items = await historyCol
      .find({ vehicleId })
      .sort({ ts: -1 })
      .limit(limit)
      .toArray();

    // return in chronological order for polyline
    items.reverse();
    res.json({ vehicleId, count: items.length, points: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 7) Hotspot grid for “potential traffic areas”
app.get("/pt/hotspots", async (req, res) => {
  try {
    const keys = await redis.keys("grid:*");
    const values = keys.length ? await redis.mGet(keys) : [];
    const hotspots = keys.map((k, i) => {
      const parts = k.split(":"); // grid:gx:gy
      return { gx: Number(parts[1]), gy: Number(parts[2]), count: Number(values[i] ?? 0) };
    }).filter(h => h.count > 0);

    res.json({ count: hotspots.length, hotspots });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`✅ API: http://localhost:${PORT}`));
