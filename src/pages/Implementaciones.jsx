import { useEffect, useState } from "react";
import api from "../services/api";

export default function Implementaciones() {
  const [implementaciones, setImplementaciones] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  useEffect(() => {
    cargarImplementaciones();
  }, []);

  const cargarImplementaciones = async () => {
    try {
      const response = await api.get("/implementaciones");
      setImplementaciones(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar implementaciones");
    }
  };

  const guardarImplementacion = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/implementaciones/${idEditando}`, {
          descripcion,
          estado,
        });

        alert("Implementación actualizada correctamente");
      } else {
        await api.post("/implementaciones", {
          descripcion,
        });

        alert("Implementación registrada correctamente");
      }

      limpiarFormulario();
      cargarImplementaciones();
    } catch (error) {
      console.error(error);
      alert("Error al guardar implementación");
    }
  };

  const editarImplementacion = (item) => {
    setEditando(true);
    setIdEditando(item.id);
    setDescripcion(item.descripcion);
    setEstado(item.estado);
  };

  const eliminarImplementacion = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta implementación?");

    if (!confirmar) return;

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
    setDescripcion("");
    setEstado("ACTIVO");
    setEditando(false);
    setIdEditando(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Implementación Incluida
      </h1>

      <form
        onSubmit={guardarImplementacion}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          className="border p-3 rounded md:col-span-2"
          placeholder="Ejemplo: SOAT vigente"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <select
          className="border p-3 rounded"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <button className="bg-yellow-500 hover:bg-yellow-600 font-bold p-3 rounded">
          {editando ? "Actualizar" : "Guardar"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold p-3 rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {implementaciones.map((item) => (
              <tr key={item.id} className="border-b text-center hover:bg-gray-100">
                <td className="p-3">{item.id}</td>

                <td className="p-3 text-left">{item.descripcion}</td>

                <td className="p-3">
                  <span
                    className={
                      item.estado === "ACTIVO"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold"
                    }
                  >
                    {item.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarImplementacion(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarImplementacion(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {implementaciones.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
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