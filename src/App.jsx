// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ElectricityBillCalculator from "./pages/ElectricityBillCalculator";
import EVTrackerApp from "./components/EVTracker/EVTrackerApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ElectricityBillCalculator />} />
          <Route path="/ev-tracker" element={<EVTrackerApp />} />
        </Routes>
      </div>
    </div>
  );
}
