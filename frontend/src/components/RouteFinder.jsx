import React, { useState } from "react";

export default function RouteFinder({ onRoute }) {
  const [from, setFrom] = useState("Charlottenplatz");
  const [to, setTo] = useState("Hauptbahnhof");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await onRoute(from, to);
    } catch (ex) {
      setErr(ex?.message || "Route failed");
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="row">
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" />
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" />
      </div>
      <button className="btn" type="submit">Find Route</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
}