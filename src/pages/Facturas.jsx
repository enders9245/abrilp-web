/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";
import { generarFacturaPDF } from "../utils/generarFacturaPDF";

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [cargandoPDF, setCargandoPDF] = useState(null);
  const cargarFacturas = async () => {
    try {
      const response = await api.get("/facturas");
      setFacturas(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar facturas");
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const anularFactura = async (id) => {
    if (!confirm("¿Seguro que deseas anular esta factura?")) return;

    try {
      await api.put(`/facturas/${id}/anular`);
      alert("Factura anulada correctamente");
      cargarFacturas();
    } catch (error) {
      console.error(error);
      alert("Error al anular factura");
    }
  };

  const descargarPDF = async (factura) => {
    try {
      setCargandoPDF(factura.id);

      const resEmpresa = await api.get("/empresa");
      const resItems = await api.get(
        `/cotizaciones/${factura.cotizacion_id}/items`
      );

      await generarFacturaPDF(
        factura,
        resEmpresa.data,
        resItems.data
      );
    } catch (error) {
      console.error(error);
      alert("Error al generar PDF de factura");
    } finally {
      setCargandoPDF(null);
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="card section-card p-6 border-primary-100">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-primary">Facturas</h1>
          <p className="text-sm text-muted">Listado de facturas y generación de PDF</p>
        </div>
      </div>

      <div className="card p-4 overflow-x-auto border-primary-100">
        <table className="w-full">
          <thead>
            <tr className="table-header-primary text-white">
              <th className="p-3">Factura</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cotización</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">RUC</th>
              <th className="p-3">Servicio</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">IGV</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">PDF</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id} className="border-b text-center">
                <td className="p-3 font-bold">{factura.codigo}</td>
                <td className="p-3">{factura.fecha}</td>
                <td className="p-3">{factura.cotizacion_codigo}</td>
                <td className="p-3">{factura.cliente}</td>
                <td className="p-3">{factura.cliente_ruc}</td>
                <td className="p-3">{factura.servicio}</td>
                <td className="p-3">
                  S/ {Number(factura.subtotal).toFixed(2)}
                </td>
                <td className="p-3">
                  S/ {Number(factura.igv).toFixed(2)}
                </td>
                <td className="p-3 font-bold">
                  S/ {Number(factura.total).toFixed(2)}
                </td>

                <td className="p-3">
                  <span
                    className={
                      factura.estado === "EMITIDA"
                        ? "badge-success"
                        : "badge-danger"
                    }
                  >
                    {factura.estado}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => descargarPDF(factura)}
                    disabled={cargandoPDF === factura.id}
                    className="action-btn bg-primary hover:bg-primary-600 disabled:bg-gray-400 text-white"
                  >
                    {cargandoPDF === factura.id ? "..." : "PDF"}
                  </button>
                </td>

                <td className="p-3">
                  {factura.estado === "EMITIDA" ? (
                    <button
                      onClick={() => anularFactura(factura.id)}
                      className="action-btn btn-danger"
                    >
                      Anular
                    </button>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>
              </tr>
            ))}

            {facturas.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center p-6 text-gray-500">
                  No hay facturas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}