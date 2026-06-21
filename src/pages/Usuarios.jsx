import { useEffect, useState } from "react";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol_id: "",
    estado: "ACTIVO",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resUsuarios = await api.get("/usuarios");
      const resRoles = await api.get("/roles");

      setUsuarios(resUsuarios.data);
      setRoles(resRoles.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar usuarios");
    }
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/usuarios/${idEditando}`, form);
        alert("Usuario actualizado correctamente");
      } else {
        await api.post("/usuarios", form);
        alert("Usuario registrado correctamente");
      }

      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar usuario");
    }
  };

  const editarUsuario = (usuario) => {
    setEditando(true);
    setIdEditando(usuario.id);

    setForm({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      rol_id: usuario.rol_id || "",
      estado: usuario.estado || "ACTIVO",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await api.delete(`/usuarios/${id}`);
      alert("Usuario eliminado correctamente");
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol_id: "",
      estado: "ACTIVO",
    });

    setEditando(false);
    setIdEditando(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>

      <form
        onSubmit={guardarUsuario}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <input
          className="border p-3 rounded"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded"
          placeholder={editando ? "Nueva contraseña opcional" : "Contraseña"}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editando}
        />

        <select
          className="border p-3 rounded"
          value={form.rol_id}
          onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
          required
        >
          <option value="">Seleccione rol</option>
          {roles
            .filter((rol) => rol.estado === "ACTIVO")
            .map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
        </select>

        <select
          className="border p-3 rounded"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded md:col-span-5">
          {editando ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="bg-gray-700 text-white font-bold p-3 rounded md:col-span-5"
          >
            Cancelar edición
          </button>
        )}
      </form>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b text-center">
                <td className="p-3">{usuario.id}</td>
                <td className="p-3">{usuario.nombre}</td>
                <td className="p-3">{usuario.email}</td>
                <td className="p-3">{usuario.rol || "Sin rol"}</td>

                <td className="p-3">
                  <span
                    className={
                      usuario.estado === "ACTIVO"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold"
                    }
                  >
                    {usuario.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarUsuario(usuario)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}