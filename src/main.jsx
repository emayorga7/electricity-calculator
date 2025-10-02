import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ElectricityBillCalculator from './App.jsx';
import EVTrackerApp from './components/EVTracker/EVTrackerApp.jsx';
import NavBar from './components/NavBar.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ElectricityBillCalculator />} />
        <Route path="/ev-tracker" element={<EVTrackerApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
