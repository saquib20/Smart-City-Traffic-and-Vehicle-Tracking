import React from "react";

export default function StatCard({
  title,
  bigValue,
  bigUnit,
  battery,
  onBoost,
  onBrake,
  onCharge,
}) {
  return (
    <div className="card glass card--tall">
      <div className="card__title">{title}</div>

      <div className="speed">
        <div className="speed__value">{bigValue}</div>
        <div className="speed__unit">{bigUnit}</div>
      </div>

      <div className="divider" />

      <div className="battery">
        <div className="battery__ring">
          <div className="battery__ringInner">
            <div className="battery__icon" />
            <div className="battery__pct">{battery}%</div>
          </div>
          <div className="battery__label muted">Charge</div>
        </div>

        <div className="battery__actions">
          <button className="btn btn--ghost" onClick={onBrake}>Brake</button>
          <button className="btn" onClick={onBoost}>Boost</button>
          <button className="btn btn--ghost" onClick={onCharge}>+10%</button>
        </div>
      </div>
    </div>
  );
}