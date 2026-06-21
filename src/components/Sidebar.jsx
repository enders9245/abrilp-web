import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  FaChartPie,
  FaUsers,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaTruck,
  FaUserShield,
  FaUserTag,
  FaCog,
  FaListAlt,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

 const normalizarRol = (rol) => {
  if (!rol) return "";

  const r = String(rol).trim().toUpperCase();

  if (r === "ADMIN" || r === "ADMINISTRADOR") return "Administrador";
  if (r === "SECRETARIA" || r === "SECRETARIO") return "Secretaria";
  if (r === "OPERADOR") return "Operador";

  return rol;
};

const rol = normalizarRol(user?.rol);

  const puedeVer = (rolesPermitidos) => rolesPermitidos.includes(rol);

  const itemClass = (path) =>
    location.pathname === path
      ? "flex items-center gap-3 p-3 rounded-xl bg-yellow-500 text-black font-bold"
      : "flex items-center gap-3 p-3 rounded-xl text-gray-200 hover:bg-yellow-500 hover:text-black transition";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 bg-[#050505] text-white min-h-screen flex flex-col border-r border-yellow-500/40">
      <div className="p-6 border-b border-yellow-500/50 text-center">
        <img
          src={logo}
          alt="Logo ABRILP"
          className="w-28 h-28 object-contain mx-auto mb-3"
        />

        <h1 className="text-3xl font-bold text-yellow-500">ABRILP</h1>

        <p className="text-sm text-gray-400">Transportes y Servicios</p>

        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/40 rounded-full px-3 py-1 text-xs text-yellow-400">
          Rol: {rol || "Sin rol"}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className={itemClass("/dashboard")}>
              <FaChartPie />
              Dashboard
            </Link>
          </li>

          {puedeVer(["Administrador", "Secretaria"]) && (
            <li>
              <Link to="/clientes" className={itemClass("/clientes")}>
                <FaUsers />
                Clientes
              </Link>
            </li>
          )}

          {puedeVer(["Administrador", "Secretaria"]) && (
            <li>
              <Link to="/cotizaciones" className={itemClass("/cotizaciones")}>
                <FaClipboardList />
                Cotizaciones
              </Link>
            </li>
          )}

          {puedeVer(["Administrador", "Secretaria"]) && (
            <li>
              <Link to="/facturas" className={itemClass("/facturas")}>
                <FaFileInvoiceDollar />
                Facturas
              </Link>
            </li>
          )}

          {puedeVer(["Administrador", "Operador"]) && (
            <li>
              <Link to="/vehiculos" className={itemClass("/vehiculos")}>
                <FaTruck />
                Vehículos
              </Link>
            </li>
          )}

          {puedeVer(["Administrador"]) && (
            <>
              <li>
                <Link to="/usuarios" className={itemClass("/usuarios")}>
                  <FaUserShield />
                  Usuarios
                </Link>
              </li>

              <li>
                <Link to="/roles" className={itemClass("/roles")}>
                  <FaUserTag />
                  Roles
                </Link>
              </li>

              <li>
                <Link to="/condiciones" className={itemClass("/condiciones")}>
                  <FaListAlt />
                  Condiciones PDF
                </Link>
              </li>

              <li>
                <Link
                  to="/implementaciones"
                  className={itemClass("/implementaciones")}
                >
                  <FaTools />
                  Implementaciones
                </Link>
              </li>

              <li>
                <Link
                  to="/configuracion-empresa"
                  className={itemClass("/configuracion-empresa")}
                >
                  <FaCog />
                  Empresa
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-yellow-500/30">
        <button
          onClick={cerrarSesion}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}