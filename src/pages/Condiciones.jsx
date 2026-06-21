import { useEffect, useState } from "react";
import api from "../services/api";

export default function Condiciones() {
  const [condiciones, setCondiciones] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [estado, setEstado] = useState("ACTIVO");

  useEffect(() => {
    cargarCondiciones();
  }, []);

  const cargarCondiciones = async () => {
    try {
      const response = await api.get("/condiciones");
      setCondiciones(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar condiciones");
    }
  };

  const guardarCondicion = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/condiciones/${idEditando}`, {
          descripcion,
          estado,
        });

        alert("Condición actualizada correctamente");
      } else {
        await api.post("/condiciones", {
          descripcion,
        });

        alert("Condición registrada correctamente");
      }

      limpiarFormulario();
      cargarCondiciones();
    } catch (error) {
      console.error(error);
      alert("Error al guardar condición");
    }
  };

  const editarCondicion = (condicion) => {
    setEditando(true);
    setIdEditando(condicion.id);
    setDescripcion(condicion.descripcion);
    setEstado(condicion.estado);
  };

  const eliminarCondicion = async (id) => {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar esta condición?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/condiciones/${id}`);
      alert("Condición eliminada correctamente");
      cargarCondiciones();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar condición");
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
        Condiciones del Servicio
      </h1>

      <form
        onSubmit={guardarCondicion}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <textarea
          className="border p-3 rounded md:col-span-3"
          placeholder="Escribe una condición del servicio"
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

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 font-bold p-3 rounded"
        >
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
            {condiciones.map((condicion) => (
              <tr
                key={condicion.id}
                className="border-b text-center hover:bg-gray-100"
              >
                <td className="p-3">{condicion.id}</td>

                <td className="p-3 text-left">
                  {condicion.descripcion}
                </td>

                <td className="p-3">
                  <span
                    className={
                      condicion.estado === "ACTIVO"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold"
                    }
                  >
                    {condicion.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarCondicion(condicion)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCondicion(condicion.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {condiciones.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500"
                >
                  No hay condiciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}