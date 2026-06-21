import { useEffect, useState } from "react";
import api from "../services/api";

export default function Vehiculos() {
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

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    const response = await api.get("/vehiculos");
    setVehiculos(response.data);
  };

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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Vehículos</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Total Vehículos</h3>
          <h2 className="text-3xl font-bold">{vehiculos.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Disponibles</h3>
          <h2 className="text-3xl font-bold text-green-600">
            {vehiculos.filter((v) => v.estado === "DISPONIBLE").length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Mantenimiento</h3>
          <h2 className="text-3xl font-bold text-yellow-600">
            {vehiculos.filter((v) => v.estado === "MANTENIMIENTO").length}
          </h2>
        </div>
      </div>

      <form
        onSubmit={guardarVehiculo}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-6 gap-4"
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

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded"
        >
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

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-black text-white">
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
                className="border-b text-center hover:bg-gray-100"
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
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold"
                        : vehiculo.estado === "OCUPADO"
                        ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold"
                        : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold"
                    }
                  >
                    {vehiculo.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => editarVehiculo(vehiculo)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarVehiculo(vehiculo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
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