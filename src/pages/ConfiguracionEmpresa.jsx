import { useEffect, useState } from "react";
import api from "../services/api";

export default function ConfiguracionEmpresa() {
  const [form, setForm] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
    representante: "",
    logo: "",
  });

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const cargarEmpresa = async () => {
    try {
      const response = await api.get("/empresa");
      setForm(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar datos de empresa");
    }
  };

  const guardarEmpresa = async (e) => {
    e.preventDefault();

    try {
      await api.put("/empresa", form);
      alert("Datos de empresa actualizados correctamente");
      cargarEmpresa();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar empresa");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Configuración de Empresa
      </h1>

      <form
        onSubmit={guardarEmpresa}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          className="border p-3 rounded"
          placeholder="Nombre de empresa"
          value={form.nombre || ""}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="RUC"
          value={form.ruc || ""}
          onChange={(e) =>
            setForm({ ...form, ruc: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="Dirección"
          value={form.direccion || ""}
          onChange={(e) =>
            setForm({ ...form, direccion: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="Teléfono"
          value={form.telefono || ""}
          onChange={(e) =>
            setForm({ ...form, telefono: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="Correo"
          value={form.correo || ""}
          onChange={(e) =>
            setForm({ ...form, correo: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="Representante legal"
          value={form.representante || ""}
          onChange={(e) =>
            setForm({ ...form, representante: e.target.value })
          }
        />

        <input
          className="border p-3 rounded md:col-span-2"
          placeholder="Logo URL o nombre de archivo"
          value={form.logo || ""}
          onChange={(e) =>
            setForm({ ...form, logo: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded md:col-span-2"
        >
          Guardar Configuración
        </button>
      </form>
    </div>
  );
}