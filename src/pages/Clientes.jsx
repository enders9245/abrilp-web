/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [consultando, setConsultando] = useState(false);

  const [form, setForm] = useState({
    razon_social: "",
    ruc: "",
    telefono: "",
    direccion: "",
  });

  async function cargarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar clientes");
    }
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  const consultarRUC = async () => {
    if (!form.ruc || form.ruc.length !== 11) {
      alert("El RUC debe tener 11 dígitos");
      return;
    }

    try {
      setConsultando(true);

      const response = await api.get(`/ruc/${form.ruc}`);

      setForm({
        ...form,
        razon_social: response.data.razon_social || "",
        direccion: response.data.direccion || "",
      });

      alert("Datos encontrados correctamente");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo consultar el RUC");
    } finally {
      setConsultando(false);
    }
  };

  const crearCliente = async (e) => {
    e.preventDefault();

    try {
      await api.post("/clientes", form);

      alert("Cliente registrado correctamente");

      setForm({
        razon_social: "",
        ruc: "",
        telefono: "",
        direccion: "",
      });

      cargarClientes();
    } catch (error) {
      console.error(error);
      alert("Error al registrar cliente");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/clientes/${id}/estado`, { estado });
      cargarClientes();
    } catch (error) {
      console.error(error);
      alert("Error al cambiar estado");
    }
  };

  const eliminarCliente = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

    try {
      await api.delete(`/clientes/${id}`);
      alert("Cliente eliminado correctamente");
      cargarClientes();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar. Puede estar usado en una cotización.");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="card section-card p-6 border-primary-100">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-primary">Clientes</h1>
          <p className="text-sm text-muted">Gestiona tus clientes y su información</p>
        </div>
      </div>

      <form
        onSubmit={crearCliente}
        className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 border-primary-100"
      >
        <input
          className="border p-3 rounded"
          placeholder="RUC"
          maxLength="11"
          value={form.ruc}
          onChange={(e) => setForm({ ...form, ruc: e.target.value })}
          required
        />

        <button
          type="button"
          onClick={consultarRUC}
          disabled={consultando}
          className="btn-outline-primary font-bold p-3 rounded disabled:bg-gray-400 disabled:text-white"
        >
          {consultando ? "Consultando..." : "Consultar RUC"}
        </button>

        <input
          className="border p-3 rounded md:col-span-2"
          placeholder="Razón social"
          value={form.razon_social}
          onChange={(e) =>
            setForm({ ...form, razon_social: e.target.value })
          }
          required
        />

        <input
          className="border p-3 rounded"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          className="border p-3 rounded md:col-span-3"
          placeholder="Dirección"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />

        <button className="btn-primary font-bold p-3 rounded md:col-span-4">
          Guardar Cliente
        </button>
      </form>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--primary)' }} className="text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Razón Social</th>
              <th className="p-3">RUC</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b text-center">
                <td className="p-3">{cliente.id}</td>
                <td className="p-3">{cliente.razon_social}</td>
                <td className="p-3">{cliente.ruc}</td>
                <td className="p-3">{cliente.telefono}</td>
                <td className="p-3">{cliente.direccion}</td>

                <td className="p-3">
                  <select
                    className={
                      cliente.estado === "ACTIVO"
                        ? "form-control badge-success"
                        : "form-control badge-danger"
                    }
                    value={cliente.estado}
                    onChange={(e) =>
                      cambiarEstado(cliente.id, e.target.value)
                    }
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => eliminarCliente(cliente.id)}
                    className="action-btn btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}