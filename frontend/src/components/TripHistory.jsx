import React from "react";

export default function TripHistory({ trips }) {
  if (!trips.length) return <div className="muted">No trips found.</div>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Trip</th>
          <th>Vehicle</th>
          <th>From</th>
          <th>To</th>
          <th>Started</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.vehicleId}</td>
            <td>{t.start}</td>
            <td>{t.end}</td>
            <td>{new Date(t.startedAt).toLocaleString()}</td>
            <td>{t.durationMin} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}