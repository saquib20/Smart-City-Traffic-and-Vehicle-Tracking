import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapCard({ center }) {
  return (
    <div className="card glass mapCard">
      <div className="mapCard__overlay">
        <div className="search">
          <span className="muted">Search</span>
          <span className="search__icon">⌕</span>
        </div>

        <div className="zoom">
          <button className="zoom__btn">+</button>
          <button className="zoom__btn">–</button>
        </div>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: 300, width: "100%", borderRadius: 18 }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}