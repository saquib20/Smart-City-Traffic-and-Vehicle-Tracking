import React, { useState } from "react";

export default function VehicleForm({ onCreate }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "car",
    lat: 48.7758,
    lon: 9.1829,
    speed: 0,
    status: "stopped",
  });
  const [err, setErr] = useState("");

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await onCreate({
        ...form,
        lat: Number(form.lat),
        lon: Number(form.lon),
        speed: Number(form.speed),
      });
      setForm((f) => ({ ...f, id: "", name: "" }));
    } catch (ex) {
      setErr(ex?.message || "Create failed");
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="row">
        <input
          placeholder="ID (e.g., V3)"
          value={form.id}
          onChange={(e) => update("id", e.target.value)}
          required
        />
        <input
          placeholder="Name (e.g., Taxi 7)"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className="row">
        <select value={form.type} onChange={(e) => update("type", e.target.value)}>
          <option value="car">car</option>
          <option value="bus">bus</option>
          <option value="van">van</option>
          <option value="truck">truck</option>
        </select>
        <select value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option value="moving">moving</option>
          <option value="stopped">stopped</option>
        </select>
        <input
          type="number"
          placeholder="Speed"
          value={form.speed}
          onChange={(e) => update("speed", e.target.value)}
          min="0"
        />
      </div>

      <div className="row">
        <input type="number" step="0.0001" value={form.lat} onChange={(e) => update("lat", e.target.value)} />
        <input type="number" step="0.0001" value={form.lon} onChange={(e) => update("lon", e.target.value)} />
      </div>

      <button className="btn" type="submit">Add Vehicle</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
}