import React from "react";

export default function VehicleDetailsCard({ vehicle }) {
  const t = vehicle?.telemetry;

  return (
    <div className="card glass">
      <div className="card__head">
        <div>
          <div className="card__title">Selected Vehicle</div>
          <div className="muted">Real-time telemetry</div>
        </div>
        <div className="thumb" />
      </div>

      {!vehicle ? (
        <div className="muted">No vehicle selected</div>
      ) : (
        <>
          <div className="h1">{vehicle.name}</div>
          <div className="muted" style={{ marginTop: 2 }}>
            ID: {vehicle.id} • Driver: {vehicle.driver?.name ?? "—"} • Type: {vehicle.type}
          </div>

          <div className="kpiRow">
            <KPI label="Speed" value={`${t?.speedKmh ?? 0} km/h`} />
            <KPI label="Battery" value={`${t?.batteryPct ?? 0}%`} />
            <KPI label="Status" value={t?.status ?? "—"} />
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Updated: {t?.updatedAt ? new Date(t.updatedAt).toLocaleString() : "—"}
          </div>

          <div className="loc">
            <div className="muted">Location</div>
            <div className="loc__val">
              Lat: {t?.lat?.toFixed?.(5) ?? "—"} | Lon: {t?.lon?.toFixed?.(5) ?? "—"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="kpi">
      <div className="kpi__label muted">{label}</div>
      <div className="kpi__value">{value}</div>
    </div>
  );
}