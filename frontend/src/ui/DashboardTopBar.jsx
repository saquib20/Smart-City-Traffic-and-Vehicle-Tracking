import React, { useMemo } from "react";

export default function DashboardTopBar({ greeting, location, temperature }) {
  const now = useMemo(() => new Date(), []);
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="topbar glass">
      <div className="topbar__pill">
        <span className="topbar__time">{time}</span>
        <span className="dot" />
        <span className="muted">{date}</span>
      </div>

      <div className="topbar__center">
        <div className="avatar" />
        <div className="topbar__greeting">{greeting}</div>
      </div>

      <div className="topbar__pill">
        <span className="muted">📍</span>
        <span>{location}</span>
        <span className="dot" />
        <span className="muted">{temperature}</span>
        <span className="dot" />
        <span className="muted">▮▮▮▮</span>
      </div>
    </div>
  );
}