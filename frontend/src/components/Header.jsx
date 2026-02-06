import React from "react";

export default function Header({ onSimulateTick }) {
  return (
    <div className="header">
      <div>
        <div className="title">Smart City Tracker</div>
        <div className="muted">React + Node + WebSocket live vehicles + OSM map</div>
      </div>
      <button className="btn" onClick={onSimulateTick}>
        Simulate Live Tick
      </button>
    </div>
  );
}