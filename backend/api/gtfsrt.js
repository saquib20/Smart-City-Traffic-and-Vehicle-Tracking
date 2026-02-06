import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export async function fetchGtfsRt(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GTFS-RT fetch failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    new Uint8Array(buf)
  );
}
