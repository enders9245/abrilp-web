import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}

      <main className="flex-1">
        <div className="bg-white shadow p-4 flex gap-3 items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaBars />
            {sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-yellow-500 text-black px-4 py-2 rounded font-bold flex items-center gap-2"
          >
            <FaHome />
            Dashboard
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}