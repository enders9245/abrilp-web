import { FaBell, FaCog } from "react-icons/fa";

export default function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const nombre = user?.nombre || "Usuario";
  const rol = user?.rol || "Operador";

  return (
    <div className="mb-6 flex items-center justify-between rounded-[24px] border border-[#eadfe8] bg-white/90 p-4 shadow-[0_14px_40px_rgba(90,20,48,0.08)] backdrop-blur">
      <div>
        <h2 className="text-2xl font-bold text-[#28131d]">Dashboard</h2>
        <p className="text-sm text-[#6f5b69]">Panel de control ABRILP</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-[#f7ebf2] p-2 text-[#7a1f3d] shadow-sm">
          <FaBell size={18} />
          <FaCog size={18} />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1f3d] to-[#6d3da4] font-bold text-white">
            {nombre.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-[#28131d]">{nombre}</p>
            <p className="text-sm text-[#6f5b69]">{rol}</p>
          </div>
        </div>
      </div>
    </div>
  );
}