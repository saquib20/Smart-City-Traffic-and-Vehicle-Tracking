import React from "react";

export default function VehicleListCard({ vehicles, selectedId, onSelect, onManualTick }) {
  return (
    <div className="card glass card--left">
      <div className="card__head">
        <div>
          <div className="card__title">Vehicles</div>
          <div className="muted">Live tracking</div>
        </div>
        <button className="btn btn--ghost btn--small" onClick={onManualTick}>
          Manual Tick
        </button>
      </div>

      <div className="list">
        {vehicles.map((v) => {
          const active = v.id === selectedId;
          const status = v.telemetry?.status ?? "—";
          const speed = v.telemetry?.speedKmh ?? 0;
          const battery = v.telemetry?.batteryPct ?? 0;

          return (
            <button
              key={v.id}
              className={`listItem ${active ? "listItem--active" : ""}`}
              onClick={() => onSelect(v.id)}
            >
              <div className="listItem__top">
                <div className="listItem__name">
                  {v.name} <span className="pill">{v.type}</span>
                </div>
                <div className="muted">{v.id}</div>
              </div>

              <div className="listItem__meta">
                <span className={`badge ${status === "moving" ? "badge--ok" : "badge--warn"}`}>
                  {status}
                </span>
                <span className="muted">{v.driver?.name ?? "—"}</span>
                <span className="dotSmall" />
                <span className="muted">{speed} km/h</span>
                <span className="dotSmall" />
                <span className="muted">{battery}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}