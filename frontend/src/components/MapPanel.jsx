import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons in Vite
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker1x, shadowUrl: shadow });

export default function MapPanel({ vehicles, selectedVehicleId, route }) {
  const center = useMemo(() => {
    const sel = vehicles.find((v) => v.id === selectedVehicleId);
    if (sel) return [sel.lat, sel.lon];
    return [48.7758, 9.1829]; // Stuttgart-ish
  }, [vehicles, selectedVehicleId]);

  const routeLine = route?.path?.map((p) => [p.lat, p.lon]) || null;

  return (
    <MapContainer center={center} zoom={13} style={{ height: 420, width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehicles.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lon]}>
          <Popup>
            <b>{v.name}</b> ({v.id})<br />
            Type: {v.type}<br />
            Status: {v.status}<br />
            Speed: {v.speed} km/h
          </Popup>
        </Marker>
      ))}

      {routeLine && <Polyline positions={routeLine} />}
    </MapContainer>
  );
}