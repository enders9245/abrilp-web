/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Vehiculos() {
  const { user } = useAuth();
  const esOperador = String(user?.rol || "").toLowerCase() === "operador";
  const [vehiculos, setVehiculos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [vehiculoId, setVehiculoId] = useState(null);

  const [form, setForm] = useState({
    placa: "",
    marca: "",
    modelo: "",
    capacidad: "",
    anio: "",
    estado: "DISPONIBLE",
  });

  const cargarVehiculos = async () => {
    try {
      const response = await api.get("/vehiculos");
      setVehiculos(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar vehículos");
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const limpiarFormulario = () => {
    setForm({
      placa: "",
      marca: "",
      modelo: "",
      capacidad: "",
      anio: "",
      estado: "DISPONIBLE",
    });

    setEditando(false);
    setVehiculoId(null);
  };

  const guardarVehiculo = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/vehiculos/${vehiculoId}`, form);
        alert("Vehículo actualizado correctamente");
      } else {
        await api.post("/vehiculos", form);
        alert("Vehículo registrado correctamente");
      }

      limpiarFormulario();
      cargarVehiculos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar vehículo");
    }
  };

  const editarVehiculo = (vehiculo) => {
    setEditando(true);
    setVehiculoId(vehiculo.id);

    setForm({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      capacidad: vehiculo.capacidad,
      anio: vehiculo.anio,
      estado: vehiculo.estado,
    });
  };

  const eliminarVehiculo = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este vehículo?");

    if (!confirmar) return;

    try {
      await api.delete(`/vehiculos/${id}`);
      alert("Vehículo eliminado correctamente");
      cargarVehiculos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar vehículo");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-primary">Vehículos</h1>
        <p className="text-sm text-muted">Registra y administra la flota</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="text-sm text-muted">Total Vehículos</h3>
          <h2 className="text-3xl font-bold">{vehiculos.length}</h2>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-muted">Disponibles</h3>
          <h2 className="text-3xl font-bold text-primary">
            {vehiculos.filter((v) => v.estado === "DISPONIBLE").length}
          </h2>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-muted">Mantenimiento</h3>
          <h2 className="text-3xl font-bold text-primary">
            {vehiculos.filter((v) => v.estado === "MANTENIMIENTO").length}
          </h2>
        </div>
      </div>

      {!esOperador && (
        <form
          onSubmit={guardarVehiculo}
          className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4"
        >
        <input
          className="border p-3 rounded"
          placeholder="Placa"
          value={form.placa}
          onChange={(e) => setForm({ ...form, placa: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded"
          placeholder="Marca"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded"
          placeholder="Modelo"
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          required
        />

        <input
          className="border p-3 rounded"
          placeholder="Capacidad"
          value={form.capacidad}
          onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
        />

        <input
          className="border p-3 rounded"
          placeholder="Año"
          type="number"
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: e.target.value })}
        />

        <select
          className="border p-3 rounded"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="DISPONIBLE">DISPONIBLE</option>
          <option value="OCUPADO">OCUPADO</option>
          <option value="MANTENIMIENTO">MANTENIMIENTO</option>
        </select>

        <button type="submit" className="btn-primary font-bold p-3 rounded">
          {editando ? "Actualizar Vehículo" : "Guardar Vehículo"}
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
      )}

      {esOperador && (
        <div className="mb-6 rounded-2xl border border-[#eadfe8] bg-[#fcf7fa] p-4 text-sm text-muted">
          Tu rol permite ver la información de vehículos, pero no editar ni modificar registros.
        </div>
      )}

      <div className="card p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--primary)' }} className="text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Placa</th>
              <th className="p-3">Marca</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Capacidad</th>
              <th className="p-3">Año</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr
                key={vehiculo.id}
                className="border-b text-center hover:bg-[var(--surface-soft)]"
              >
                <td className="p-3">{vehiculo.id}</td>
                <td className="p-3">{vehiculo.placa}</td>
                <td className="p-3">{vehiculo.marca}</td>
                <td className="p-3">{vehiculo.modelo}</td>
                <td className="p-3">{vehiculo.capacidad}</td>
                <td className="p-3">{vehiculo.anio}</td>

                <td className="p-3">
                  <span
                    className={
                      vehiculo.estado === "DISPONIBLE"
                        ? "badge-success"
                        : vehiculo.estado === "OCUPADO"
                        ? "badge-danger"
                        : "badge-primary"
                    }
                  >
                    {vehiculo.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  {!esOperador && (
                    <>
                      <button
                        onClick={() => editarVehiculo(vehiculo)}
                        className="btn-secondary text-primary font-semibold px-3 py-1 rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarVehiculo(vehiculo.id)}
                        className="btn-danger font-semibold px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}

                  {esOperador && <span className="text-sm text-muted">Solo lectura</span>}
                </td>
              </tr>
            ))}

            {vehiculos.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No hay vehículos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}