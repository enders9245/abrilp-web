/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import RevenueChart from "../components/RevenueChart";

export default function Dashboard() {
  const [resumen, setResumen] = useState({
    clientes: 0,
    vehiculos: 0,
    cotizaciones: 0,
    facturas: 0,
    ingresos: 0,
  });
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cargarResumen = async () => {
    try {
      const response = await api.get("/dashboard/resumen");
      setResumen(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      alert("Error al cargar dashboard");
    }
  };

  const cargarIngresosMensuales = async () => {
    try {
      const response = await api.get("/dashboard/ingresos-mensuales");
      setIngresosMensuales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarResumen();
    cargarIngresosMensuales();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-8">
        <div className="card section-card p-6 border-primary-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Acciones rápidas</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Navega por el sistema con un clic</h2>
            </div>
            <button
              type="button"
              onClick={cargarResumen}
              className="btn-secondary px-5 py-3 rounded-xl"
            >
              Actualizar datos
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/clientes" className="btn-outline-primary px-4 py-4 rounded-2xl text-left">
              Clientes
            </Link>
            <Link to="/cotizaciones" className="btn-outline-primary px-4 py-4 rounded-2xl text-left">
              Cotizaciones
            </Link>
            <Link to="/facturas" className="btn-outline-primary px-4 py-4 rounded-2xl text-left">
              Facturas
            </Link>
            <Link to="/vehiculos" className="btn-outline-primary px-4 py-4 rounded-2xl text-left">
              Vehículos
            </Link>
          </div>
        </div>

        <div className="card section-card p-6 border-primary-100">
          <p className="text-sm text-slate-500">Última actualización</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {lastUpdated
              ? new Intl.DateTimeFormat("es-PE", {
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(lastUpdated)
              : "Nunca"}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Usa los enlaces rápidos para ir a los módulos más usados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="card p-6 bg-white/95 border border-slate-200 shadow-[0_16px_40px_rgba(94,32,63,0.06)]">
          <p className="text-sm text-slate-500">Clientes</p>
          <h2 className="text-3xl font-bold text-slate-900">{resumen.clientes}</h2>
        </div>

        <div className="card p-6 bg-white/95 border border-slate-200 shadow-[0_16px_40px_rgba(94,32,63,0.06)]">
          <p className="text-sm text-slate-500">Vehículos</p>
          <h2 className="text-3xl font-bold text-slate-900">{resumen.vehiculos}</h2>
        </div>

        <div className="card p-6 bg-white/95 border border-slate-200 shadow-[0_16px_40px_rgba(94,32,63,0.06)]">
          <p className="text-sm text-slate-500">Cotizaciones</p>
          <h2 className="text-3xl font-bold text-slate-900">{resumen.cotizaciones}</h2>
        </div>

        <div className="card p-6 bg-white/95 border border-slate-200 shadow-[0_16px_40px_rgba(94,32,63,0.06)]">
          <p className="text-sm text-slate-500">Facturas</p>
          <h2 className="text-3xl font-bold text-slate-900">{resumen.facturas}</h2>
        </div>

        <div className="card p-6 bg-white/95 border border-slate-200 shadow-[0_16px_40px_rgba(94,32,63,0.06)]">
          <p className="text-sm text-slate-500">Ingresos</p>
          <h2 className="text-2xl font-bold text-slate-900">S/ {Number(resumen.ingresos || 0).toFixed(2)}</h2>
        </div>
      </div>

      <RevenueChart data={ingresosMensuales} />
    </div>
  );
}
