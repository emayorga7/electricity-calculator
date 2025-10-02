import { useState, useEffect } from "react";
import { tiers } from "./constants/tiers";
import { calculateTotal } from "./utils/billingLogic";
import BreakdownSection from "./components/BreakdownSection";
import { calculateUsage, computeProjections } from "./utils/estimation";
import { BarChart3Icon, EyeIcon } from "lucide-react";
import { DESCRIPTIONS } from "./constants/descriptions";
import BreakdownRow from "./components/BreakdownRow";
import { enrichDescriptions } from "./utils/enrichBreakdown";

export default function ElectricityBillCalculator() {
  const today = new Date();
  const suggestedStartDate = new Date(today);
  if (today.getDate() >= 9) {
    suggestedStartDate.setDate(9);
  } else {
    suggestedStartDate.setMonth(today.getMonth() - 1);
    suggestedStartDate.setDate(9);
  }

  const [initialReading, setInitialReading] = useState(0);
  const [currentReading, setCurrentReading] = useState(0);
  const [readingDate, setReadingDate] = useState(today.toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(suggestedStartDate.toISOString().split("T")[0]);
  const [consumption, setConsumption] = useState(0);
  const [total, setTotal] = useState(0);
  const [projectedTotal, setProjectedTotal] = useState(0);
  const [avgPerDay, setAvgPerDay] = useState(0);
  const [projectedKwh, setProjectedKwh] = useState(0);
  const [showProjected, setShowProjected] = useState(false);
  const [breakdown, setBreakdown] = useState({});
  const [projectedBreakdown, setProjectedBreakdown] = useState({});
  const [isInitialLocked, setIsInitialLocked] = useState(false);
  const [savedInitialReading, setSavedInitialReading] = useState(null);

  useEffect(() => {
      const storedReading = localStorage.getItem("initialReading");
      if (storedReading !== null) {
        setInitialReading(Number(storedReading));
        setIsInitialLocked(true);
        setSavedInitialReading(Number(storedReading));
      }
    }, []);
  
  useEffect(() => {
    const usage = calculateUsage(currentReading, initialReading);
    setConsumption(usage);

    const { bill, breakdown: newBreakdown } = calculateTotal(usage);
    setTotal(bill.toFixed(2));
    const enrichedBreakdown = enrichDescriptions(newBreakdown);
    setBreakdown(enrichedBreakdown);

    if (startDate && readingDate) {
      const { projectedUsage, avgPerDay } = computeProjections(usage, startDate, readingDate);
      setAvgPerDay(avgPerDay.toFixed(2));
      setProjectedKwh(projectedUsage);

      const { bill: projectedBill, breakdown: projectedBreakdownData } = calculateTotal(projectedUsage);
      setProjectedTotal(projectedBill.toFixed(2));
      const enrichedProjected = enrichDescriptions(projectedBreakdownData);
      setProjectedBreakdown(enrichedProjected);
    } else {
      setProjectedTotal(0);
      setProjectedBreakdown({});
    }
  }, [initialReading, currentReading, startDate, readingDate]);

  const activeBreakdown = showProjected ? projectedBreakdown : breakdown;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="bg-blue-700 text-white py-4 px-6 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Factura de Electricidad ESPH</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Inicial</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lectura Inicial (kWh)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={initialReading}
                onChange={(e) => setInitialReading(Number(e.target.value))}
                disabled={isInitialLocked}
              />
              {!isInitialLocked && (
                <button
                  onClick={() => {
                    localStorage.setItem("initialReading", initialReading);
                    setIsInitialLocked(true);
                    setSavedInitialReading(initialReading);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
              )}
            </div>
            {isInitialLocked && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mt-1">
                  Lectura guardada: {savedInitialReading} kWh
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem("initialReading");
                    setIsInitialLocked(false);
                    setInitialReading(0);
                  }}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Iniciar Nuevo Ciclo
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Lectura</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={readingDate}
              onChange={(e) => setReadingDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lectura Actual (kWh)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={currentReading}
              onChange={(e) => setCurrentReading(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Consumo:</strong> {consumption} kWh</p>
          <p><strong>Estimado a hoy:</strong> ₡{total}</p>
          {projectedTotal > 0 && (
            <>
              <p><strong>Promedio por día:</strong> {avgPerDay} kWh</p>
              <p><strong>Consumo Proyectado:</strong> {projectedKwh} kWh</p>
              <p><strong>Factura Proyectada:</strong> ₡{projectedTotal}</p>
            </>
          )}
        </div>
      </div>

      {projectedTotal > 0 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${!showProjected ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'} hover:bg-blue-500 hover:text-white`}
            onClick={() => setShowProjected(false)}
          >
            <EyeIcon size={16} /> Desglose Actual
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${showProjected ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'} hover:bg-blue-500 hover:text-white`}
            onClick={() => setShowProjected(true)}
          >
            <BarChart3Icon size={16} /> Desglose Proyectado
          </button>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-collapse border-gray-400">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border border-gray-400 text-left">RUBRO</th>
              <th className="p-2 border border-gray-400 text-left">DESCRIPCIÓN</th>
              <th className="p-2 border border-gray-400 text-right">IMPORTE</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.entries(activeBreakdown).map(([label, data]) => (
              <BreakdownRow key={label} label={label} data={data} />
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="p-2 border border-gray-400"></td>
              <td className="p-2 border border-gray-400 text-right">TOTAL</td>
              <td className="p-2 border border-gray-400 text-right">₡{showProjected ? projectedTotal : total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
