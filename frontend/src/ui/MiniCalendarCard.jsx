import React from "react";

export default function MiniCalendarCard({ dateLabel, items }) {
  return (
    <div className="card glass">
      <div className="calendar__top">
        <div className="calendar__icon">🗓️</div>
        <div className="calendar__date">{dateLabel}</div>
      </div>

      <div className="calendar__list">
        {items.map((it, idx) => (
          <div key={idx} className="calendar__item">
            <div className="calendar__itemTitle">{it.title}</div>
            <div className="calendar__itemTime">{it.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}