import { useState } from "react";

export default function EVTrackerApp() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    date: "",
    initialReading: "",
    finalReading: "",
    batteryStart: "",
    batteryEnd: "",
    timeSpent: "",
    kmStart: "",
    kmEnd: "",
    amperes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const consumption = form.finalReading - form.initialReading;
    const kmTotal = form.kmEnd - form.kmStart;

    const newRecord = { ...form, consumption, kmTotal };
    setRecords([...records, newRecord]);
    setForm({
      date: "",
      initialReading: "",
      finalReading: "",
      batteryStart: "",
      batteryEnd: "",
      timeSpent: "",
      kmStart: "",
      kmEnd: "",
      amperes: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">🚗 EV Recharge Tracker</h1>

      {/* Input form */}
      <div className="bg-white shadow-md p-4 rounded mb-6 grid grid-cols-2 gap-4">
        <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="initialReading" placeholder="Initial Reading" value={form.initialReading} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="finalReading" placeholder="Final Reading" value={form.finalReading} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="batteryStart" placeholder="Battery Start %" value={form.batteryStart} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="batteryEnd" placeholder="Battery End %" value={form.batteryEnd} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="timeSpent" placeholder="Time Spent" value={form.timeSpent} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="kmStart" placeholder="Start KM" value={form.kmStart} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="kmEnd" placeholder="End KM" value={form.kmEnd} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="amperes" placeholder="Amperes" value={form.amperes} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Record
      </button>

      {/* Records Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-collapse border-gray-400">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Consumption (kWh)</th>
              <th className="p-2 border">KM Driven</th>
              <th className="p-2 border">Battery Start</th>
              <th className="p-2 border">Battery End</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {records.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border">{r.date}</td>
                <td className="p-2 border">{r.consumption}</td>
                <td className="p-2 border">{r.kmTotal}</td>
                <td className="p-2 border">{r.batteryStart}%</td>
                <td className="p-2 border">{r.batteryEnd}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
