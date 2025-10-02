import { useState, useEffect } from "react";

// Helper to convert JSON -> CSV
function convertToCSV(records) {
  if (records.length === 0) return "";
  const headers = Object.keys(records[0]);
  const rows = records.map((r) =>
    headers.map((h) => `"${r[h] ?? ""}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// Helper to parse CSV -> JSON
function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.replace(/"/g, ""));
  return lines.map((line) => {
    const values = line.split(",").map((v) => v.replace(/"/g, ""));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });
}

export default function EVTrackerApp() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    date: "",
    initialReading: "",
    finalReading: "",
    consumption: "",
    initialBattery: "",
    finalBattery: "",
    duration: "", // stored as string HH:MM or HH:MM:SS
    amperes: "",
    kmStart: "",
    kmEnd: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("evRecords");
    if (stored) setRecords(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("evRecords", JSON.stringify(records));
  }, [records]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const kmTotal =
      form.kmStart && form.kmEnd
        ? Number(form.kmEnd) - Number(form.kmStart)
        : "";

    const batteryUsage =
      form.initialBattery && form.finalBattery
        ? Number(form.finalBattery) - Number(form.initialBattery)
        : "";

    const newRecord = { ...form, kmTotal, batteryUsage };

    if (editIndex !== null) {
      const updated = [...records];
      updated[editIndex] = newRecord;
      setRecords(updated);
      setEditIndex(null);
    } else {
      setRecords([...records, newRecord]);
    }

    setForm({
      date: "",
      initialReading: "",
      finalReading: "",
      consumption: "",
      initialBattery: "",
      finalBattery: "",
      duration: "",
      amperes: "",
      kmStart: "",
      kmEnd: ""
    });
  };

  const handleEdit = (index) => {
    setForm(records[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Delete all records?")) {
      setRecords([]);
      localStorage.removeItem("evRecords");
    }
  };

  const exportCSV = () => {
    const csv = convertToCSV(records);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evRecords.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = parseCSV(event.target.result);
        setRecords(imported);
      } catch {
        alert("Invalid CSV file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🚗 EV Tracker</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow">
        <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded" required />

        <input type="number" name="initialReading" placeholder="Initial Meter" value={form.initialReading} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="finalReading" placeholder="Final Meter" value={form.finalReading} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="consumption" placeholder="Consumption (kWh)" value={form.consumption} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="initialBattery" placeholder="% Inicial" min="0" max="100" value={form.initialBattery} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="finalBattery" placeholder="% Final" min="0" max="100" value={form.finalBattery} onChange={handleChange} className="border p-2 rounded" />

        <input type="text" name="duration" placeholder="Duration (HH:MM or HH:MM:SS)" value={form.duration} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="amperes" placeholder="Amperes" value={form.amperes} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="kmStart" placeholder="KM Start" value={form.kmStart} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="kmEnd" placeholder="KM End" value={form.kmEnd} onChange={handleChange} className="border p-2 rounded" />

        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {editIndex !== null ? "Update Record" : "Add Record"}
        </button>
      </form>

      {/* Actions */}
      <div className="mt-4 flex gap-4">
        <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export CSV
        </button>
        <label className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer">
          Import CSV
          <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
        </label>
        <button onClick={handleDeleteAll} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Delete All
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Consumption (kWh)</th>
              <th className="p-2">Duration</th>
              <th className="p-2">%Inicial → %Final</th>
              <th className="p-2">Battery Usage</th>
              <th className="p-2">Amps</th>
              <th className="p-2">KM Start→End</th>
              <th className="p-2">KM Total</th>
              <th className="p-2">Meter Init→Final</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{rec.date}</td>
                <td className="p-2">{rec.consumption}</td>
                <td className="p-2">{rec.duration}</td>
                <td className="p-2">{rec.initialBattery} → {rec.finalBattery}</td>
                <td className="p-2">{rec.batteryUsage}</td>
                <td className="p-2">{rec.amperes}</td>
                <td className="p-2">{rec.kmStart} → {rec.kmEnd}</td>
                <td className="p-2">{rec.kmTotal}</td>
                <td className="p-2">{rec.initialReading} → {rec.finalReading}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(i)} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
                  <button onClick={() => handleDelete(i)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">No records yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}