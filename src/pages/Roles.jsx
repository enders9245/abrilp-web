/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "ACTIVO",
  });
  const cargarRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar roles");
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const guardarRol = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/roles/${idEditando}`, form);
        alert("Rol actualizado correctamente");
      } else {
        await api.post("/roles", form);
        alert("Rol registrado correctamente");
      }

      limpiarFormulario();
      cargarRoles();
    } catch (error) {
      console.error(error);
      alert("Error al guardar rol");
    }
  };

  const editarRol = (rol) => {
    setEditando(true);
    setIdEditando(rol.id);

    setForm({
      nombre: rol.nombre || "",
      descripcion: rol.descripcion || "",
      estado: rol.estado || "ACTIVO",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarRol = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este rol?")) return;

    try {
      await api.delete(`/roles/${id}`);
      alert("Rol eliminado correctamente");
      cargarRoles();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar. Puede estar usado por un usuario.");
    }
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
      estado: "ACTIVO",
    });

    setEditando(false);
    setIdEditando(null);
  };

  return (
    <div className="p-8 bg-[var(--bg)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Roles</h1>

      <form
        onSubmit={guardarRol}
        className="card section-card p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          className="border p-3 rounded"
          placeholder="Nombre del rol"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded md:col-span-2"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) =>
            setForm({ ...form, descripcion: e.target.value })
          }
        />

        <select
          className="border p-3 rounded"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <button className="btn-primary font-bold p-3 rounded md:col-span-4">
          {editando ? "Actualizar Rol" : "Guardar Rol"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="bg-gray-700 text-white font-bold p-3 rounded md:col-span-4"
          >
            Cancelar edición
          </button>
        )}
      </form>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header-primary text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id} className="border-b text-center hover:bg-[var(--surface-soft)]">
                <td className="p-3">{rol.id}</td>
                <td className="p-3 font-bold">{rol.nombre}</td>
                <td className="p-3">{rol.descripcion}</td>

                <td className="p-3">
                  <span
                    className={
                      rol.estado === "ACTIVO"
                        ? "badge-success"
                        : "badge-danger"
                    }
                  >
                    {rol.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarRol(rol)}
                    className="btn-secondary text-primary font-semibold px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarRol(rol.id)}
                    className="btn-danger font-semibold px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No hay roles registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}