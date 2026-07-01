import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[linear-gradient(135deg,_#f8f1f5_0%,_#f2e8f2_100%)] text-[#28131d]">
      {sidebarOpen && <Sidebar />}

      <main className="flex-1">
        <div className="border-b border-[#eadfe8] bg-white/80 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 rounded-2xl bg-[#7a1f3d] px-4 py-2 font-semibold text-white shadow-lg"
            >
              <FaBars />
              {sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-2xl border border-[#ecdce5] bg-[#f8eff4] px-4 py-2 font-semibold text-[#7a1f3d]"
            >
              <FaHome />
              Dashboard
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}