import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex gap-6 shadow-md">
      <Link
        to="/"
        className={`hover:underline ${location.pathname === "/" ? "font-bold underline" : ""}`}
      >
        ⚡ Factura Electricidad
      </Link>
      <Link
        to="/ev-tracker"
        className={`hover:underline ${location.pathname === "/ev-tracker" ? "font-bold underline" : ""}`}
      >
        🚗 EV Tracker
      </Link>
    </nav>
  );
}
