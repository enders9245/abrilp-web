import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { generarCotizacionPDF } from "../utils/generarCotizacionPDF";

export default function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [cargandoPDF, setCargandoPDF] = useState(null);

  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    fecha: "",
    descripcion: "",
  });

  const [item, setItem] = useState({
    vehiculo_id: "",
    descripcion: "",
    precio: "",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resCot, resCli, resVeh] = await Promise.all([
        api.get("/cotizaciones"),
        api.get("/clientes"),
        api.get("/vehiculos"),
      ]);

      setCotizaciones(resCot.data);
      setClientes(resCli.data);
      setVehiculos(resVeh.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar datos");
    }
  };

  const vehiculoItemSeleccionado = vehiculos.find(
    (v) => String(v.id) === String(item.vehiculo_id)
  );

  const agregarItem = () => {
    if (!item.vehiculo_id || !item.descripcion || !item.precio) {
      alert("Selecciona vehículo, descripción y precio por día");
      return;
    }

    const precio = Number(item.precio || 0);

    setItems([
      ...items,
      {
        vehiculo_id: item.vehiculo_id,
        descripcion: item.descripcion,
        unidad: vehiculoItemSeleccionado
          ? `${vehiculoItemSeleccionado.placa} - ${vehiculoItemSeleccionado.marca} ${vehiculoItemSeleccionado.modelo}`
          : "-",
        cantidad: 1,
        precio,
        total: precio,
      },
    ]);

    setItem({
      vehiculo_id: "",
      descripcion: "",
      precio: "",
    });
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotalDia = items.reduce(
    (acc, item) => acc + Number(item.precio || 0),
    0
  );

  const igvDia = subtotalDia * 0.18;
  const totalDia = subtotalDia + igvDia;
  const totalMensual = totalDia * 30;

  const limpiarFormulario = () => {
    setForm({
      cliente_id: "",
      fecha: "",
      descripcion: "",
    });

    setItem({
      vehiculo_id: "",
      descripcion: "",
      precio: "",
    });

    setItems([]);
    setEditando(false);
    setIdEditando(null);
  };

  const guardarCotizacion = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Agrega al menos un ítem");
      return;
    }

    try {
      const data = {
  ...form,
  fecha: form.fecha,
  servicio: items[0].descripcion,
  items,
};

      if (editando) {
        await api.put(`/cotizaciones/${idEditando}`, data);
        alert("Cotización actualizada correctamente");
      } else {
        await api.post("/cotizaciones", data);
        alert("Cotización creada correctamente");
      }

      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar cotización");
    }
  };

  const editarCotizacion = async (cot) => {
    try {
      const resItems = await api.get(`/cotizaciones/${cot.id}/items`);

      setEditando(true);
      setIdEditando(cot.id);

      setForm({
        cliente_id: cot.cliente_id || "",
        fecha: String(cot.fecha).split("T")[0],
        descripcion: cot.descripcion || "",
      });

      setItems(
        resItems.data.map((item) => ({
          vehiculo_id: item.vehiculo_id,
          descripcion: item.descripcion,
          unidad: item.unidad,
          cantidad: Number(item.cantidad || 1),
          precio: Number(item.precio || 0),
          total: Number(item.total || item.precio || 0),
        }))
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      alert("Error al cargar cotización para editar");
    }
  };

  const eliminarCotizacion = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta cotización?");

    if (!confirmar) return;

    try {
      await api.delete(`/cotizaciones/${id}`);
      alert("Cotización eliminada correctamente");
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar cotización");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/cotizaciones/${id}/estado`, { estado });
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar estado");
    }
  };

  const generarFactura = async (cot) => {
    try {
      await api.post("/facturas", {
        cotizacion_id: cot.id,
      });

      alert("Factura generada correctamente");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al generar factura");
    }
  };

  const descargarPDF = async (cot) => {
    try {
      setCargandoPDF(cot.id);

      const resEmpresa = await api.get("/empresa");
      const resCondiciones = await api.get("/condiciones");
      const resItems = await api.get(`/cotizaciones/${cot.id}/items`);
      const resImplementaciones = await api.get("/implementaciones");

      await generarCotizacionPDF(
        {
          ...cot,
          items: resItems.data,
          implementaciones: resImplementaciones.data,
        },
        resEmpresa.data,
        resCondiciones.data
      );
    } catch (error) {
      console.error(error);
      alert("Error al generar PDF");
    } finally {
      setCargandoPDF(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return String(fecha).split("T")[0];
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cotizaciones</h1>

        <div className="flex gap-3">
          <Link
            to="/vehiculos"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
          >
            Editar Vehículos
          </Link>

          <Link
            to="/implementaciones"
            className="bg-green-600 text-white px-4 py-2 rounded font-bold"
          >
            Editar Implementación
          </Link>

          <Link
            to="/condiciones"
            className="bg-black text-white px-4 py-2 rounded font-bold"
          >
            Editar Condiciones
          </Link>
        </div>
      </div>

      <form
        onSubmit={guardarCotizacion}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editando ? "Editar Cotización" : "Nueva Cotización"}
          </h2>

          {editando && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            className="border p-3 rounded"
            value={form.cliente_id}
            onChange={(e) =>
              setForm({ ...form, cliente_id: e.target.value })
            }
            required
          >
            <option value="">CLIENTE: Seleccione cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razon_social}
              </option>
            ))}
          </select>

       <input
  type="date"
  className="border p-3 rounded"
  value={form.fecha}
  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
  required
/>
        </div>

        <textarea
          className="border p-3 rounded w-full mb-6"
          rows="3"
          placeholder="PRESENTE: Texto de presentación"
          value={form.descripcion}
          onChange={(e) =>
            setForm({ ...form, descripcion: e.target.value })
          }
        />

        <h2 className="text-xl font-bold mb-4">
          Propuesta Económica - Ítems por Vehículo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            className="border p-3 rounded"
            value={item.vehiculo_id}
            onChange={(e) =>
              setItem({ ...item, vehiculo_id: e.target.value })
            }
          >
            <option value="">Seleccione vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
              </option>
            ))}
          </select>

          <input
            className="border p-3 rounded"
            placeholder="Descripción del servicio"
            value={item.descripcion}
            onChange={(e) =>
              setItem({ ...item, descripcion: e.target.value })
            }
          />

          <input
            className="border p-3 rounded bg-gray-100"
            value={
              vehiculoItemSeleccionado
                ? `${vehiculoItemSeleccionado.placa} - ${vehiculoItemSeleccionado.marca} ${vehiculoItemSeleccionado.modelo}`
                : "Unidad vehicular"
            }
            readOnly
          />

          <input
            className="border p-3 rounded"
            type="number"
            step="0.01"
            placeholder="Precio por día sin IGV"
            value={item.precio}
            onChange={(e) => setItem({ ...item, precio: e.target.value })}
          />
        </div>

        {vehiculoItemSeleccionado && (
          <div className="bg-gray-50 border rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-2">Vehículo seleccionado</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <p>Marca: {vehiculoItemSeleccionado.marca}</p>
              <p>Modelo: {vehiculoItemSeleccionado.modelo}</p>
              <p>Placa: {vehiculoItemSeleccionado.placa}</p>
              <p>Año: {vehiculoItemSeleccionado.anio || "-"}</p>
              <p>Capacidad: {vehiculoItemSeleccionado.capacidad || "-"}</p>
              <p>Estado: {vehiculoItemSeleccionado.estado}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={agregarItem}
          className="bg-black text-white px-4 py-2 rounded mb-6"
        >
          Agregar Ítem
        </button>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-2">N°</th>
                <th className="p-2">DESCRIPCIÓN</th>
                <th className="p-2">UNIDAD VEHICULAR</th>
                <th className="p-2">PRECIO POR DÍA</th>
                <th className="p-2">30 DÍAS</th>
                <th className="p-2">ACCIÓN</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, index) => (
                <tr key={index} className="border-b text-center">
                  <td className="p-2">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="p-2">{it.descripcion}</td>
                  <td className="p-2">{it.unidad}</td>
                  <td className="p-2">S/ {Number(it.precio).toFixed(2)}</td>

                  <td className="p-2 font-bold">
                    S/ {(Number(it.precio) * 30).toFixed(2)}
                  </td>

                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => eliminarItem(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No hay ítems agregados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl mb-6">
          <p>Subtotal por día: S/ {subtotalDia.toFixed(2)}</p>
          <p>IGV 18%: S/ {igvDia.toFixed(2)}</p>

          <p className="font-bold text-lg">
            Total por día incluye IGV: S/ {totalDia.toFixed(2)}
          </p>

          <p className="font-bold text-lg">
            Total 30 días incluye IGV: S/ {totalMensual.toFixed(2)}
          </p>
        </div>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded w-full">
          {editando ? "Actualizar Cotización" : "Generar Cotización"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3">Código</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Vehículo Principal</th>
              <th className="p-3">Servicio</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">IGV</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Factura</th>
              <th className="p-3">PDF</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cotizaciones.map((cot) => (
              <tr key={cot.id} className="border-b text-center">
                <td className="p-3 font-bold">{cot.codigo}</td>

                <td className="p-3">{formatearFecha(cot.fecha)}</td>

                <td className="p-3">{cot.cliente}</td>

                <td className="p-3">
                  {cot.placa} - {cot.marca} {cot.modelo}
                </td>

                <td className="p-3">{cot.servicio}</td>

                <td className="p-3">
                  S/ {Number(cot.subtotal).toFixed(2)}
                </td>

                <td className="p-3">
                  S/ {Number(cot.igv).toFixed(2)}
                </td>

                <td className="p-3 font-bold">
                  S/ {Number(cot.total).toFixed(2)}
                </td>

                <td className="p-3">
                  <select
                    className="border p-2 rounded"
                    value={cot.estado}
                    onChange={(e) =>
                      cambiarEstado(cot.id, e.target.value)
                    }
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADA">APROBADA</option>
                    <option value="RECHAZADA">RECHAZADA</option>
                  </select>
                </td>

                <td className="p-3">
                  {cot.estado === "APROBADA" ? (
                    <button
                      onClick={() => generarFactura(cot)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      Factura
                    </button>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => descargarPDF(cot)}
                    disabled={cargandoPDF === cot.id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    {cargandoPDF === cot.id ? "..." : "PDF"}
                  </button>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarCotizacion(cot)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCotizacion(cot.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {cotizaciones.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center p-6 text-gray-500">
                  No hay cotizaciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}