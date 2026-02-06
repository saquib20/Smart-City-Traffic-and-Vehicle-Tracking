import { initDb } from "./db.js";
import { ingestGtfsRt } from "./ingest.js";

const ctx = await initDb();
const historyCol = ctx.history;

async function tick() {
  try {
    const result = await ingestGtfsRt({ historyCol });
    console.log("GTFS ingest:", result);
  } catch (e) {
    console.error("GTFS ingest error:", e.message);
  }
}

setInterval(tick, 5000);
tick();
