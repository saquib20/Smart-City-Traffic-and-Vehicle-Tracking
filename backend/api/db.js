import { MongoClient } from "mongodb";
import { createClient } from "redis";
import "dotenv/config";

export const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (e) => console.error("Redis error:", e));

export const mongoClient = new MongoClient(process.env.MONGO_URL);

export async function initDb() {
  if (!redis.isOpen) await redis.connect();
  await mongoClient.connect();

  const db = mongoClient.db(process.env.MONGO_DB);

  // Collections
  const history = db.collection("vehicle_history");
  const trips = db.collection("trip_history");
  const hotspots = db.collection("hotspot_history");

  // Indexes (important)
  await history.createIndex({ vehicleId: 1, ts: -1 });
  await history.createIndex({ loc: "2dsphere" });

  await trips.createIndex({ vehicleId: 1, startTime: -1 });

  await hotspots.createIndex({ ts: -1 });

  return { db, history, trips, hotspots };
}
