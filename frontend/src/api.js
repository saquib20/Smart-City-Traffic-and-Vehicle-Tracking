const API_BASE = "http://localhost:4000/api";

export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Request failed");
  return data;
}


// ✅ Road-following segment polyline from TomTom via backend proxy
export async function fetchRoadSegment(from, to) {
  const url =
    `${API_BASE}/api/road/segment` +
    `?fromLat=${encodeURIComponent(from[0])}` +
    `&fromLon=${encodeURIComponent(from[1])}` +
    `&toLat=${encodeURIComponent(to[0])}` +
    `&toLon=${encodeURIComponent(to[1])}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Segment API failed: ${res.status}`);
  return res.json(); // { polyline: [[lat, lon], ...] }
}

export const api = {
  health: () => fetchJSON("/health"),
  listVehicles: () => fetchJSON("/vehicles"),
  createVehicle: (payload) => fetchJSON("/vehicles", { method: "POST", body: JSON.stringify(payload) }),
  patchVehicle: (id, payload) => fetchJSON(`/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteVehicle: (id) => fetchJSON(`/vehicles/${id}`, { method: "DELETE" }),
  listTrips: (vehicleId) => fetchJSON(vehicleId ? `/trips?vehicleId=${encodeURIComponent(vehicleId)}` : "/trips"),
  getRoute: (from, to) => fetchJSON(`/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
};


export async function fetchRoute(from = "n1", to = "n3") {
  const res = await fetch(`${API_BASE}/api/route?from=${from}&to=${to}`);
  if (!res.ok) throw new Error(`Route API failed: ${res.status}`);
  return res.json();
}
