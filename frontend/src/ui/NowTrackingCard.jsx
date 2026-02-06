import React from "react";

export default function NowTrackingCard({
  title,
  main,
  sub,
  progress,
  metaLeft,
  metaRight,
  onPrev,
  onPlay,
  onNext,
}) {
  return (
    <div className="card glass card--wide">
      <div className="now__top">
        <div>
          <div className="card__title">{title}</div>
          <div className="now__main">{main}</div>
          <div className="muted now__sub">{sub}</div>
        </div>

        <div className="now__thumb" aria-hidden />
      </div>

      <div className="now__bar">
        <div className="now__meta muted">{metaLeft}</div>
        <div className="progress">
          <div className="progress__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="now__meta muted">{metaRight}</div>
      </div>

      <div className="now__controls">
        <button className="btnIcon" onClick={onPrev} title="Previous">⏮</button>
        <button className="btnIcon btnIcon--primary" onClick={onPlay} title="Play">▶</button>
        <button className="btnIcon" onClick={onNext} title="Next">⏭</button>
      </div>
    </div>
  );
}