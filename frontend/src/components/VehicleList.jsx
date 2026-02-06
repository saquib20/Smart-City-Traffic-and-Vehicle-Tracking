import React from "react";

export default function VehicleList({ vehicles, selectedId, onSelect, onPatch, onDelete }) {
  if (!vehicles.length) return <div className="muted">No vehicles yet.</div>;

  return (
    <div className="list">
      {vehicles.map((v) => (
        <div
          key={v.id}
          className={`listItem ${selectedId === v.id ? "selected" : ""}`}
          onClick={() => onSelect(v.id)}
          role="button"
          tabIndex={0}
        >
          <div className="listTop">
            <div>
              <b>{v.name}</b> <span className="pill">{v.type}</span>
            </div>
            <div className="muted">{v.id}</div>
          </div>

          <div className="muted">
            {v.status} • {v.speed} km/h • ({v.lat.toFixed(4)}, {v.lon.toFixed(4)})
          </div>

          <div className="actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="btnSmall"
              onClick={() => onPatch(v.id, { status: v.status === "moving" ? "stopped" : "moving" })}
            >
              Toggle Move
            </button>
            <button className="btnSmall danger" onClick={() => onDelete(v.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}