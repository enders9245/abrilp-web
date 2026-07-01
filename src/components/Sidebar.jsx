import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  FaChartPie,
  FaUsers,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaTruck,
  FaMapMarkedAlt,
  FaUserShield,
  FaUserTag,
  FaCog,
  FaListAlt,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const normalizarRol = (rol) => {
    if (!rol) return "";

    const r = String(rol).trim().toUpperCase();

    if (r === "ADMIN" || r === "ADMINISTRADOR") return "Administrador";
    if (r === "SECRETARIA" || r === "SECRETARIO") return "Secretaria";
    if (r === "OPERADOR") return "Operador";

    return rol;
  };

  const rol = normalizarRol(storedUser?.rol);
  const puedeVer = (rolesPermitidos) => rolesPermitidos.includes(rol);

  const itemClass = (path) =>
    location.pathname === path
      ? "flex items-center gap-3 p-3 rounded-2xl bg-white/15 text-white font-semibold shadow-inner"
      : "flex items-center gap-3 p-3 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className="w-72 min-h-screen flex flex-col border-r border-white/10 bg-[linear-gradient(180deg,_#2a0b1b_0%,_#180612_100%)] text-white">
      <div className="p-6 border-b border-white/10 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 p-2 shadow-lg">
          <img src={logo} alt="Logo ABRILP" className="h-14 w-14 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-[#f7d8e2]">ABRILP</h1>
        <p className="text-sm text-white/70">Transportes y Servicios</p>

        <div className="mt-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
          {rol || "Sin rol"}
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
            <>
              <li>
                <Link to="/vehiculos" className={itemClass("/vehiculos")}>
                  <FaTruck />
                  Vehículos
                </Link>
              </li>

              <li>
                <Link to="/monitoreo-gps" className={itemClass("/monitoreo-gps")}>
                  <FaMapMarkedAlt />
                  Monitoreo GPS
                </Link>
              </li>
            </>
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
                <Link to="/implementaciones" className={itemClass("/implementaciones")}>
                  <FaTools />
                  Implementaciones
                </Link>
              </li>

              <li>
                <Link to="/configuracion-empresa" className={itemClass("/configuracion-empresa")}>
                  <FaCog />
                  Empresa
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={cerrarSesion}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#f5e0e7] px-3 py-3 font-semibold text-[#7a1f3d] transition hover:bg-[#f8e9ee]"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}