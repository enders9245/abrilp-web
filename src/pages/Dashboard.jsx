import { useEffect, useState } from "react";
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

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      const response = await api.get("/dashboard/resumen");
      setResumen(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar dashboard");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Clientes</p>
          <h2 className="text-3xl font-bold">{resumen.clientes}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Vehículos</p>
          <h2 className="text-3xl font-bold">{resumen.vehiculos}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Cotizaciones</p>
          <h2 className="text-3xl font-bold">{resumen.cotizaciones}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Facturas</p>
          <h2 className="text-3xl font-bold">{resumen.facturas}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Ingresos</p>
          <h2 className="text-2xl font-bold">
            S/ {Number(resumen.ingresos || 0).toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow h-[420px]">
        <h2 className="text-xl font-bold mb-4">Ingresos Mensuales</h2>
        <RevenueChart />
      </div>
    </div>
  );
}