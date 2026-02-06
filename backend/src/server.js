// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { neo4jDriver } from "./neo4j.js";
console.log("TOMTOM_API_KEY:", process.env.TOMTOM_API_KEY ? "✅ Loaded" : "❌ Missing");


import { getTomTomRoutePolyline } from "./tomtom.js";
// If you already use Neo4j endpoints, keep your imports too:
// import { neo4jDriver } from "./neo4j.js";

const app = express();

app.use(express.json());

// ✅ CORS for Vite frontend
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ✅ Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

/**
 * ✅ Road segment polyline (TomTom)
 * GET /api/road/segment?fromLat=..&fromLon=..&toLat=..&toLon=..
 */
app.get("/api/road/segment", async (req, res) => {
  try {
    const { fromLat, fromLon, toLat, toLon } = req.query;

    if (!fromLat || !fromLon || !toLat || !toLon) {
      return res.status(400).json({
        error: "Missing query params. Required: fromLat, fromLon, toLat, toLon",
      });
    }

    const polyline = await getTomTomRoutePolyline({
      fromLat: Number(fromLat),
      fromLon: Number(fromLon),
      toLat: Number(toLat),
      toLon: Number(toLon),
    });

    res.json({ polyline });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * ✅ Your existing Neo4j shortest-path route endpoint can stay here (optional)
 * Example: /api/route?from=n1&to=n3
 * Keep your existing code if you already implemented it.
 */

// app.get("/api/route", async (req, res) => { ... })

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ CORS allowed origin: ${FRONTEND_ORIGIN}`);
});
// End of backend/src/server.js