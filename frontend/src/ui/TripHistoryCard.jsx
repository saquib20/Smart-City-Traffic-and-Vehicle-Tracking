import React from "react";

export default function TripHistoryCard({ trips }) {
  return (
    <div className="card glass">
      <div className="card__head">
        <div>
          <div className="card__title">Trip History</div>
          <div className="muted">Recent trips</div>
        </div>
      </div>

      {!trips?.length ? (
        <div className="muted">No trips yet.</div>
      ) : (
        <div className="tableWrap">
          <table className="darkTable">
            <thead>
              <tr>
                <th>Trip</th>
                <th>From</th>
                <th>To</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.from}</td>
                  <td>{t.to}</td>
                  <td className="muted">
                    {new Date(t.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td>{t.durationMin}m</td>
                  <td>
                    <span className={`badge ${t.status === "running" ? "badge--ok" : "badge--muted"}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}