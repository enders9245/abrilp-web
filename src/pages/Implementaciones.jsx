/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Implementaciones() {
  const [implementaciones, setImplementaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [form, setForm] = useState({
    descripcion: "",
    estado: "ACTIVO",
    categoria: "General",
    mostrar_pdf: "SI",
    orden: 1,
  });
  const cargarImplementaciones = async () => {
    try {
      const response = await api.get("/implementaciones");
      setImplementaciones(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar implementaciones");
    }
  };

  useEffect(() => {
    cargarImplementaciones();
  }, []);

  const guardarImplementacion = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/implementaciones/${idEditando}`, form);
        alert("Implementación actualizada correctamente");
      } else {
        await api.post("/implementaciones", form);
        alert("Implementación registrada correctamente");
      }

      limpiarFormulario();
      cargarImplementaciones();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al guardar implementación");
    }
  };

  const editarImplementacion = (item) => {
    setEditando(true);
    setIdEditando(item.id);

    setForm({
      descripcion: item.descripcion || "",
      estado: item.estado || "ACTIVO",
      categoria: item.categoria || "General",
      mostrar_pdf: item.mostrar_pdf || "SI",
      orden: item.orden || 1,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cambiarEstadoRapido = async (item) => {
    try {
      await api.put(`/implementaciones/${item.id}`, {
        descripcion: item.descripcion,
        estado: item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO",
        categoria: item.categoria || "General",
        mostrar_pdf: item.mostrar_pdf || "SI",
        orden: item.orden || 1,
      });

      cargarImplementaciones();
    } catch (error) {
      console.error(error);
      alert("Error al cambiar estado");
    }
  };

  const eliminarImplementacion = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta implementación?")) return;

    try {
      await api.delete(`/implementaciones/${id}`);
      alert("Implementación eliminada correctamente");
      cargarImplementaciones();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar implementación");
    }
  };

  const limpiarFormulario = () => {
    setForm({
      descripcion: "",
      estado: "ACTIVO",
      categoria: "General",
      mostrar_pdf: "SI",
      orden: 1,
    });

    setEditando(false);
    setIdEditando(null);
  };

  const implementacionesFiltradas = useMemo(() => {
    return implementaciones.filter((item) => {
      const texto = `${item.descripcion} ${item.estado} ${item.categoria} ${item.mostrar_pdf}`
        .toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      const coincideEstado =
        filtroEstado === "TODOS" || item.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [implementaciones, busqueda, filtroEstado]);

  const totalActivos = implementaciones.filter((i) => i.estado === "ACTIVO").length;
  const totalPDF = implementaciones.filter((i) => i.mostrar_pdf === "SI").length;

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Implementaciones</h1>
        <p className="text-sm text-slate-600">Administra las implementaciones del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total</p>
          <h2 className="text-3xl font-bold text-slate-900">{implementaciones.length}</h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Activas</p>
          <h2 className="text-3xl font-bold text-primary">{totalActivos}</h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Mostrar en PDF</p>
          <h2 className="text-3xl font-bold text-primary">{totalPDF}</h2>
        </div>
      </div>

      <form onSubmit={guardarImplementacion} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4">
        <input
          className="form-control md:col-span-2"
          placeholder="Ejemplo: SOAT vigente"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          required
        />

        <input
          className="form-control"
          placeholder="Categoría"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        />

        <input
          className="form-control"
          type="number"
          placeholder="Orden"
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
        />

        <select
          className="form-control"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <select
          className="border p-3 rounded"
          value={form.mostrar_pdf}
          onChange={(e) => setForm({ ...form, mostrar_pdf: e.target.value })}
        >
          <option value="SI">Mostrar PDF</option>
          <option value="NO">No mostrar</option>
        </select>

        <button className="btn-primary font-bold p-3 rounded md:col-span-6">
          {editando ? "Actualizar implementación" : "Guardar implementación"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold p-3 rounded md:col-span-6"
          >
            Cancelar edición
          </button>
        )}
      </form>

      <div className="card p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="form-control md:col-span-2"
          placeholder="Buscar implementación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="form-control"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="ACTIVO">Activos</option>
          <option value="INACTIVO">Inactivos</option>
        </select>
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header-primary text-white">
              <th className="p-3">Orden</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">PDF</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {implementacionesFiltradas.map((item) => (
              <tr key={item.id} className="border-b text-center hover:bg-[var(--surface-soft)]">
                <td className="p-3 font-bold">{item.orden}</td>
                <td className="p-3 text-left">{item.descripcion}</td>
                <td className="p-3">{item.categoria}</td>

                <td className="p-3">
                  <span className={ item.mostrar_pdf === "SI" ? "badge-primary" : "bg-[var(--surface-soft)] text-slate-600 px-3 py-1 rounded-full text-sm font-bold" }>
                    {item.mostrar_pdf}
                  </span>
                </td>

                <td className="p-3">
                  <button type="button" onClick={() => cambiarEstadoRapido(item)} className={ item.estado === "ACTIVO" ? "badge-success" : "badge-danger" }>
                    {item.estado}
                  </button>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button onClick={() => editarImplementacion(item)} className="btn-secondary text-primary font-semibold px-3 py-1 rounded">
                    Editar
                  </button>

                  <button onClick={() => eliminarImplementacion(item.id)} className="btn-danger font-semibold px-3 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {implementacionesFiltradas.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-slate-500">
                  No hay implementaciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}