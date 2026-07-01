/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { generarCotizacionPDF } from "../utils/generarCotizacionPDF";

const RESPONSABILIDADES_DEFAULT = {
  dueno: [
    "Transporte de Arequipa a Espinar.",
    "Mantenimiento preventivo del vehículo.",
    "Desgaste normal de llantas.",
    "Fallas mecánicas y eléctricas.",
  ],
  contratante: [
    "Choques ocasionados durante la operación.",
    "Daños operacionales del vehículo.",
  ],
};

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

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const [item, setItem] = useState({
    vehiculo_id: "",
    descripcion: "",
    precio: "",
  });

  const [items, setItems] = useState([]);
  const [responsabilidades, setResponsabilidades] = useState(() => {
    try {
      const guardadas = localStorage.getItem("responsabilidades_cotizacion");
      if (guardadas) {
        return JSON.parse(guardadas);
      }
    } catch {
      // usar valores por defecto si no hay almacenamiento válido
    }

    return RESPONSABILIDADES_DEFAULT;
  });
  const [responsabilidadInput, setResponsabilidadInput] = useState({
    texto: "",
    tipo: "dueno",
  });
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

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "responsabilidades_cotizacion",
      JSON.stringify(responsabilidades)
    );
  }, [responsabilidades]);

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

  const agregarResponsabilidad = () => {
    const texto = responsabilidadInput.texto.trim();

    if (!texto) {
      alert("Escribe una responsabilidad antes de agregarla");
      return;
    }

    setResponsabilidades((prev) => ({
      ...prev,
      [responsabilidadInput.tipo]: [
        ...prev[responsabilidadInput.tipo],
        texto,
      ],
    }));

    setResponsabilidadInput((prev) => ({ ...prev, texto: "" }));
  };

  const eliminarResponsabilidad = (tipo, index) => {
    setResponsabilidades((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((_, i) => i !== index),
    }));
  };

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
        servicio: items[0]?.descripcion || form.descripcion,
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
        resCondiciones.data,
        responsabilidades
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

  const totalCotizaciones = cotizaciones.length;
  const pendientes = cotizaciones.filter((cot) => cot.estado === "PENDIENTE").length;
  const aprobadas = cotizaciones.filter((cot) => cot.estado === "APROBADA").length;
  const montoTotal = cotizaciones.reduce((acc, cot) => acc + Number(cot.total || 0), 0);

  const cotizacionesFiltradas = cotizaciones.filter((cot) => {
    const texto = `${cot.codigo || ""} ${cot.cliente || ""} ${cot.servicio || ""}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.trim().toLowerCase());
    const coincideEstado = filtroEstado === "TODOS" || cot.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "APROBADA":
        return "status-badge status-approved";
      case "RECHAZADA":
        return "status-badge status-rejected";
      default:
        return "status-badge status-pending";
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="card section-card p-6 border-primary-100">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.32em] text-[#a43f63]">
              Gestión profesional
            </p>
            <h1 className="text-3xl font-extrabold text-primary">Cotizaciones</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Crea, revisa y aprueba propuestas con una experiencia más ordenada, rápida y lista para presentar a clientes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/vehiculos" className="btn-outline-primary px-4 py-2 rounded font-bold">
              Editar Vehículos
            </Link>

            <Link to="/implementaciones" className="btn-outline-primary px-4 py-2 rounded font-bold">
              Editar Implementación
            </Link>

            <Link to="/condiciones" className="btn-outline-primary px-4 py-2 rounded font-bold">
              Editar Condiciones
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Total de cotizaciones</p>
          <p className="mt-2 text-3xl font-black text-primary">{totalCotizaciones}</p>
        </div>

        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Pendientes</p>
          <p className="mt-2 text-3xl font-black text-[#a35a2d]">{pendientes}</p>
        </div>

        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Monto total</p>
          <p className="mt-2 text-3xl font-black text-[#2f8f61]">S/ {montoTotal.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={guardarCotizacion} className="card p-6 mb-8 border-primary-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-primary">{editando ? "Editar Cotización" : "Nueva Cotización"}</h2>

          {editando && (
            <button type="button" onClick={limpiarFormulario} className="bg-gray-700 text-white px-4 py-2 rounded">
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            className="form-control"
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
  className="form-control"
  value={form.fecha}
  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
  required
/>
        </div>

        <textarea className="form-control w-full mb-6" rows="3" placeholder="PRESENTE: Texto de presentación" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />

        <div className="card p-4 mb-6 border-primary-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-primary">Responsabilidades del servicio</h3>
              <p className="text-sm text-muted">Edita quién asume cada responsabilidad para la cotización y el PDF.</p>
            </div>

            <button
              type="button"
              onClick={() => setResponsabilidades(RESPONSABILIDADES_DEFAULT)}
              className="btn-secondary px-3 py-2 rounded"
            >
              Restablecer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3 mb-4">
            <input
              className="form-control"
              placeholder="Agregar responsabilidad"
              value={responsabilidadInput.texto}
              onChange={(e) =>
                setResponsabilidadInput((prev) => ({
                  ...prev,
                  texto: e.target.value,
                }))
              }
            />

            <select
              className="form-control"
              value={responsabilidadInput.tipo}
              onChange={(e) =>
                setResponsabilidadInput((prev) => ({
                  ...prev,
                  tipo: e.target.value,
                }))
              }
            >
              <option value="dueno">Dueño del vehículo</option>
              <option value="contratante">Empresa contratante</option>
            </select>

            <button
              type="button"
              onClick={agregarResponsabilidad}
              className="btn-primary px-4 py-2 rounded"
            >
              Agregar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#eadfe8] bg-[#f9f2f6] p-4">
              <h4 className="font-semibold text-primary mb-3">Asume el Dueño del Vehículo</h4>
              <ul className="space-y-2">
                {responsabilidades.dueno.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => eliminarResponsabilidad("dueno", index)}
                      className="text-xs font-semibold text-[#7a1f3d]"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#eadfe8] bg-[#fbf6ef] p-4">
              <h4 className="font-semibold text-[#a35a2d] mb-3">Asume la Empresa Contratante</h4>
              <ul className="space-y-2">
                {responsabilidades.contratante.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => eliminarResponsabilidad("contratante", index)}
                      className="text-xs font-semibold text-[#a35a2d]"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">
          Propuesta Económica - Ítems por Vehículo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            className="form-control"
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
            className="form-control"
            placeholder="Descripción del servicio"
            value={item.descripcion}
            onChange={(e) =>
              setItem({ ...item, descripcion: e.target.value })
            }
          />

          <input
            className="form-control bg-[var(--surface-soft)]"
            value={
              vehiculoItemSeleccionado
                ? `${vehiculoItemSeleccionado.placa} - ${vehiculoItemSeleccionado.marca} ${vehiculoItemSeleccionado.modelo}`
                : "Unidad vehicular"
            }
            readOnly
          />

          <input
            className="form-control"
            type="number"
            step="0.01"
            placeholder="Precio por día sin IGV"
            value={item.precio}
            onChange={(e) => setItem({ ...item, precio: e.target.value })}
          />
        </div>

        {vehiculoItemSeleccionado && (
          <div className="card p-4 mb-6">
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

        <button type="button" onClick={agregarItem} className="btn-primary px-4 py-2 rounded mb-6">
          Agregar Ítem
        </button>

        <div className="card p-4 mb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header-primary text-white">
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
                      className="action-btn btn-danger"
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

        <div className="card p-4 mb-6" style={{ borderColor: 'var(--border)' }}>
          <p>Subtotal por día: S/ {subtotalDia.toFixed(2)}</p>
          <p>IGV 18%: S/ {igvDia.toFixed(2)}</p>

          <p className="font-bold text-lg">
            Total por día incluye IGV: S/ {totalDia.toFixed(2)}
          </p>

          <p className="font-bold text-lg">
            Total 30 días incluye IGV: S/ {totalMensual.toFixed(2)}
          </p>
        </div>

        <button className="btn-primary font-bold p-3 rounded w-full">
          {editando ? "Actualizar Cotización" : "Generar Cotización"}
        </button>
      </form>

      <div className="card p-4 overflow-x-auto">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary">Historial de cotizaciones</h3>
            <p className="text-sm text-muted">Filtra por estado o búsqueda rápida para encontrar propuestas de forma inmediata.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="form-control min-w-[220px]"
              placeholder="Buscar por código, cliente o servicio"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              className="form-control min-w-[150px]"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="APROBADA">Aprobadas</option>
              <option value="RECHAZADA">Rechazadas</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--primary)' }} className="text-white">
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
            {cotizacionesFiltradas.map((cot) => (
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
                  <span className={getEstadoBadge(cot.estado)}>{cot.estado}</span>
                  <select
                    className="form-control mt-2"
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

                <td className="p-3 text-center">
                  {cot.estado === "APROBADA" ? (
                    <button onClick={() => generarFactura(cot)} className="action-btn bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-full text-sm">
                      Factura
                    </button>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>

                <td className="p-3 text-center">
                  <button onClick={() => descargarPDF(cot)} disabled={cargandoPDF === cot.id} className="action-btn bg-primary hover:bg-primary-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-full text-sm">
                    {cargandoPDF === cot.id ? "..." : "PDF"}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button onClick={() => editarCotizacion(cot)} className="action-btn bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-full text-sm">
                      Editar
                    </button>

                    <button onClick={() => eliminarCotizacion(cot.id)} className="action-btn btn-danger px-3 py-2 rounded-full text-sm">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {cotizacionesFiltradas.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center p-6 text-gray-500">
                  No hay cotizaciones que coincidan con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}