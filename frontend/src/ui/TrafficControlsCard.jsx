import React, { useState } from "react";

export default function TrafficControlsCard({ title, onLevelChange }) {
  const [level, setLevel] = useState(3);

  function set(v) {
    setLevel(v);
    onLevelChange?.(v);
  }

  return (
    <div className="card glass card--wide">
      <div className="controls__top">
        <div className="card__title">{title}</div>
        <div className="controls__fan">🌀</div>
      </div>

      <div className="controls__levels">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            className={`chip ${level === v ? "chip--active" : ""}`}
            onClick={() => set(v)}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="controls__toggles">
        <Toggle label="Traffic Layer" defaultOn />
        <Toggle label="Incidents" />
        <Toggle label="Heatmap" defaultOn />
      </div>

      <div className="controls__temp">
        <div className="controls__tempLabel muted">Intensity</div>
        <div className="controls__tempPill">
          <button className="btnIcon" onClick={() => set(Math.max(1, level - 1))}>▾</button>
          <div className="controls__tempValue">{level}</div>
          <button className="btnIcon" onClick={() => set(Math.min(5, level + 1))}>▴</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button className={`toggle ${on ? "toggle--on" : ""}`} onClick={() => setOn((x) => !x)}>
      <span className="toggle__dot" />
      <span className="toggle__label">{label}</span>
      <span className="toggle__state muted">{on ? "ON" : "OFF"}</span>
    </button>
  );
}