import React, { useEffect, useMemo, useState } from "react";
import { socket } from "./socket";

import DashboardTopBar from "./ui/DashboardTopBar";
import VehicleListCard from "./ui/VehicleListCard";
import LiveMapCard from "./ui/LiveMapCard";
import VehicleDetailsCard from "./ui/VehicleDetailsCard";
import TripHistoryCard from "./ui/TripHistoryCard";

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    socket.on("vehicles:update", (data) => {
      setVehicles(data);

      setSelectedId((prev) => {
        if (prev && data.some((v) => v.id === prev)) return prev;
        return data[0]?.id ?? null;
      });
    });

    return () => socket.off("vehicles:update");
  }, []);

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId) || null,
    [vehicles, selectedId]
  );

  // Demo trips (until you wire /api/trips)
  useEffect(() => {
    if (!selectedId) return;
    setTrips([
      {
        id: "T1",
        vehicleId: selectedId,
        from: "Charlottenplatz",
        to: "Hauptbahnhof",
        startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        durationMin: 14,
        status: "completed",
      },
      {
        id: "T2",
        vehicleId: selectedId,
        from: "Schlossplatz",
        to: "Charlottenplatz",
        startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        durationMin: 9,
        status: "running",
      },
    ]);
  }, [selectedId]);

  const center = useMemo(() => {
    const t = selected?.telemetry;
    if (t) return [t.lat, t.lon];
    return [48.7758, 9.1829]; // Stuttgart
  }, [selected]);

  return (
    <div className="dash">
      <div className="dash__container">
        <DashboardTopBar
          greeting= "Good Afternoon"
          location="Stuttgart"
          temperature="9°C"
        />

        {/* ✅ FINAL LAYOUT: LEFT (vehicles) | CENTER (map) | RIGHT (details+trips) */}
        <div className="dash__grid">
          <VehicleListCard
            vehicles={vehicles}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onManualTick={() => socket.emit("vehicles:tick")}
          />

          <LiveMapCard
            center={center}
            vehicles={vehicles}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="dash__rightCol">
            <VehicleDetailsCard vehicle={selected} />
            <TripHistoryCard trips={trips} />
          </div>
        </div>

        <div className="dash__footer muted">
          Live Map is centered • Markers update via Socket.IO • Click marker to select vehicle
        </div>
      </div>
    </div>
  );
}