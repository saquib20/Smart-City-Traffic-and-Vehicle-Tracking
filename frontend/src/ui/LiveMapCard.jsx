import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from "react-leaflet";
import L from "leaflet";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { buildArcLengths, pointAt } from "../utils/polylineAnim";
import { fetchRoadSegment } from "../api";


// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: shadow,
});

const UPDATE_MS = 3000; // your vehicle update interval

export default function LiveMapCard({ center, vehicles = [], selectedId, onSelect }) {
  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId) || null,
    [vehicles, selectedId]
  );

  // Base fallback center
  const fallbackCenter = center ?? [48.7758, 9.1829];

  // Store last raw GPS for selected vehicle
  const lastRawRef = useRef(null);

  // Road polyline segment for selected vehicle (prev -> next)
  const [segment, setSegment] = useState([]);

  // Animated position for selected marker
  const [animatedPos, setAnimatedPos] = useState(fallbackCenter);

  // Whenever selected vehicle telemetry changes (every ~3s), fetch TomTom road segment and animate
  useEffect(() => {
    if (!selected?.telemetry) return;

    const next = [selected.telemetry.lat, selected.telemetry.lon];
    const prev = lastRawRef.current ?? next;

    // update last raw
    lastRawRef.current = next;

    // If prev == next, do nothing
    if (prev[0] === next[0] && prev[1] === next[1]) return;

    let cancelled = false;
    let rafId = 0;

    fetchRoadSegment(prev, next)
      .then(({ polyline }) => {
        if (cancelled) return;

        // If TomTom returns empty, fallback to straight line
        const pts = Array.isArray(polyline) && polyline.length >= 2 ? polyline : [prev, next];

        setSegment(pts);

        const lens = buildArcLengths(pts);
        const start = performance.now();

        const tick = (now) => {
          if (cancelled) return;

          const t = Math.min(1, (now - start) / UPDATE_MS);
          const p = pointAt(pts, lens, t);

          if (p) setAnimatedPos(p);

          if (t < 1) {
            rafId = requestAnimationFrame(tick);
          }
        };

        rafId = requestAnimationFrame(tick);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: no segment + jump (should be rare if key works)
        setSegment([]);
        setAnimatedPos(next);
      });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [selectedId, selected?.telemetry?.lat, selected?.telemetry?.lon]);

  // Map center: keep map around animated marker if selected, else use provided center
  const mapCenter = selected ? animatedPos : fallbackCenter;

  return (
    <div className="card glass mapCard mapCard--center">
      <div className="mapCard__overlay">
        <div className="searchPill">
          <span className="muted">Live Map</span>
          <span className="muted">🛰️</span>
        </div>

        <div className="mapCard__stats">
          <div className="miniStat">
            <div className="miniStat__label muted">Selected</div>
            <div className="miniStat__value">{selected?.name ?? "—"}</div>
          </div>

          <div className="miniStat">
            <div className="miniStat__label muted">Vehicles</div>
            <div className="miniStat__value">{vehicles.length}</div>
          </div>

          <div className="miniStat">
            <div className="miniStat__label muted">Update</div>
            <div className="miniStat__value">3s</div>
          </div>
        </div>
      </div>

      <div className="mapFrame">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          key={`map-${selectedId ?? "none"}`}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ Road segment polyline for selected vehicle */}
          {segment.length > 1 && (
            <Polyline
              positions={segment}
              pathOptions={{ color: "#7dd3fc", weight: 7, opacity: 0.95 }}
            />
          )}

          {/* Glow highlight around selected marker */}
          {selected && (
            <CircleMarker
              center={animatedPos}
              radius={22}
              pathOptions={{ opacity: 0.0, fillOpacity: 0.18 }}
            />
          )}

          {/* Selected marker uses animated position */}
          {selected && (
            <Marker position={animatedPos}>
              <Popup>
                <b>{selected.name}</b> ({selected.id})<br />
                Driver: {selected.driver?.name ?? "—"}<br />
                Status: {selected.telemetry?.status ?? "—"} • {selected.telemetry?.speedKmh ?? "—"} km/h<br />
                Battery: {selected.telemetry?.batteryPct ?? "—"}%
              </Popup>
            </Marker>
          )}

          {/* Other vehicles remain as normal markers */}
          {vehicles
            .filter((v) => v.id !== selectedId)
            .map((v) => {
              const t = v.telemetry;
              if (!t) return null;
              return (
                <Marker
                  key={v.id}
                  position={[t.lat, t.lon]}
                  eventHandlers={{ click: () => onSelect(v.id) }}
                >
                  <Popup>
                    <b>{v.name}</b> ({v.id})<br />
                    Driver: {v.driver?.name ?? "—"}<br />
                    Status: {t.status} • {t.speedKmh} km/h<br />
                    Battery: {t.batteryPct}%
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
