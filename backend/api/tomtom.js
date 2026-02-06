import axios from "axios";
import "dotenv/config";

const KEY = process.env.TOMTOM_API_KEY;

export async function tomtomRoute(from, to) {
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${from}:${to}/json`;
  const { data } = await axios.get(url, {
    params: { key: KEY, routeRepresentation: "polyline" },
  });
  return data;
}

export async function tomtomIncidents(bbox) {
  const url = "https://api.tomtom.com/traffic/services/5/incidentDetails";
  const { data } = await axios.get(url, { params: { bbox, key: KEY } });
  return data;
}

export async function tomtomFlowTileUrl(z, x, y) {
  // Leaflet overlay can use this URL directly
  return `https://api.tomtom.com/traffic/map/4/tile/flow/relative/${z}/${x}/${y}.png?key=${KEY}`;
}
