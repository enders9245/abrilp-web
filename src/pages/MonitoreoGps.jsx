import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const estadoClasses = {
  "En viaje": "bg-emerald-100 text-emerald-700",
  Parado: "bg-amber-100 text-amber-700",
  "Sin señal": "bg-rose-100 text-rose-700",
};

export default function MonitoreoGps() {
  const { user } = useAuth();
  const esOperador = String(user?.rol || "").toLowerCase() === "operador";
  const [vehiculosBase, setVehiculosBase] = useState([]);
  const [gpsData, setGpsData] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const cargarDatos = async () => {
    try {
      const [vehiculosResult, gpsResult] = await Promise.allSettled([
        api.get("/vehiculos"),
        api.get("/gps"),
      ]);

      const vehiculos = vehiculosResult.status === "fulfilled" && Array.isArray(vehiculosResult.value?.data)
        ? vehiculosResult.value.data
        : [];
      const gps = gpsResult.status === "fulfilled" && Array.isArray(gpsResult.value?.data)
        ? gpsResult.value.data
        : [];

      setVehiculosBase(vehiculos);
      setGpsData(gps);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const vehiculosCombinados = useMemo(() => {
    const gpsPorVehiculo = new Map();

    gpsData.forEach((item) => {
      gpsPorVehiculo.set(String(item.vehiculo_id), item);
    });

    const base = vehiculosBase.length ? vehiculosBase : [];

    return base.map((vehiculo) => {
      const gps = gpsPorVehiculo.get(String(vehiculo.id));
      return {
        ...vehiculo,
        ...gps,
        placa: gps?.placa || vehiculo.placa || "Sin placa",
        conductor: gps?.conductor || vehiculo.conductor || "Sin conductor",
        estado: gps?.estado || vehiculo.estado || "Sin señal",
        lat: gps?.lat ?? vehiculo.lat ?? null,
        lng: gps?.lng ?? vehiculo.lng ?? null,
        velocidad: gps?.velocidad ?? vehiculo.velocidad ?? 0,
        bateria: gps?.bateria ?? vehiculo.bateria ?? 0,
        ultimaActualizacion: gps?.ultimaActualizacion || vehiculo.ultimaActualizacion || "Sin datos",
      };
    });
  }, [vehiculosBase, gpsData]);

  useEffect(() => {
    if (!vehiculosCombinados.length) {
      setVehiculoSeleccionado(null);
      return;
    }

    if (!vehiculoSeleccionado || !vehiculosCombinados.some((vehiculo) => vehiculo.id === vehiculoSeleccionado.id)) {
      setVehiculoSeleccionado(vehiculosCombinados[0]);
    }
  }, [vehiculosCombinados, vehiculoSeleccionado]);

  const resumen = useMemo(() => {
    if (!vehiculosCombinados.length) {
      return {
        activos: 0,
        enMovimiento: 0,
        sinSeñal: 0,
        bateriaPromedio: 0,
      };
    }

    const activos = vehiculosCombinados.filter((vehiculo) => vehiculo.estado !== "Sin señal").length;
    const enMovimiento = vehiculosCombinados.filter((vehiculo) => vehiculo.velocidad > 20).length;
    const bateriaPromedio = Math.round(
      vehiculosCombinados.reduce((total, vehiculo) => total + Number(vehiculo.bateria || 0), 0) /
        Math.max(vehiculosCombinados.length, 1)
    );

    return {
      activos,
      enMovimiento,
      sinSeñal: vehiculosCombinados.length - activos,
      bateriaPromedio,
    };
  }, [vehiculosCombinados]);

  const eventosRecientes = useMemo(() => {
    if (!vehiculosCombinados.length) {
      return [];
    }

    return vehiculosCombinados.slice(0, 3).map((vehiculo) => ({
      id: vehiculo.id,
      titulo: `${vehiculo.placa} • ${vehiculo.estado}`,
      detalle:
        vehiculo.estado === "En viaje"
          ? `Ruta activa a ${vehiculo.velocidad} km/h y batería ${vehiculo.bateria}%`
          : vehiculo.estado === "Parado"
            ? `Parada detectada con ${vehiculo.bateria}% de batería`
            : `Sin conexión de GPS desde ${vehiculo.ultimaActualizacion}`,
    }));
  }, [vehiculosCombinados]);

  const mapaUrl = useMemo(() => {
    if (!vehiculoSeleccionado || vehiculoSeleccionado.lat == null || vehiculoSeleccionado.lng == null) {
      return "https://www.openstreetmap.org/export/embed.html?bbox=-71.55%2C-16.42%2C-71.50%2C-16.38&layer=mapnik";
    }

    const lat = Number(vehiculoSeleccionado.lat);
    const lng = Number(vehiculoSeleccionado.lng);
    const bbox = `${lng - 0.008}%2C${lat - 0.008}%2C${lng + 0.008}%2C${lat + 0.008}`;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [vehiculoSeleccionado]);

  const enviarPosicionPrueba = async () => {
    if (!vehiculoSeleccionado) return;

    try {
      setActualizando(true);
      const payload = {
        placa: vehiculoSeleccionado.placa,
        conductor: vehiculoSeleccionado.conductor,
        estado: "En viaje",
        lat: Number(vehiculoSeleccionado.lat ?? -16.39889) + 0.0005,
        lng: Number(vehiculoSeleccionado.lng ?? -71.535) + 0.0005,
        velocidad: 58,
        bateria: 76,
      };

      await api.post(`/gps/${vehiculoSeleccionado.id}`, payload);
      await cargarDatos();
    } catch (error) {
      console.error(error);
    } finally {
      setActualizando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card section-card p-6 border-primary-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#a43f63]">Monitoreo GPS</p>
            <h1 className="text-3xl font-extrabold text-primary">Panel operativo en tiempo real</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Supervisa ubicación, estado, velocidad y batería de los vehículos con una vista más cercana a un sistema de operación real.
            </p>
          </div>

          <div className="rounded-2xl border border-[#eadfe8] bg-white/80 px-4 py-3 text-sm text-muted">
            Información cargada desde el backend cuando exista un registro válido.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Vehículos activos</p>
          <p className="mt-2 text-3xl font-extrabold text-primary">{resumen.activos}</p>
        </div>
        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">En movimiento</p>
          <p className="mt-2 text-3xl font-extrabold text-primary">{resumen.enMovimiento}</p>
        </div>
        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Sin señal</p>
          <p className="mt-2 text-3xl font-extrabold text-primary">{resumen.sinSeñal}</p>
        </div>
        <div className="card p-4 border-primary-100">
          <p className="text-sm text-muted">Batería promedio</p>
          <p className="mt-2 text-3xl font-extrabold text-primary">{resumen.bateriaPromedio}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-4 border-primary-100">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">Mapa de seguimiento</h2>
              <p className="text-sm text-muted">Vista en vivo de la ubicación del vehículo seleccionado.</p>
            </div>

            <button
              type="button"
              onClick={enviarPosicionPrueba}
              disabled={actualizando || !vehiculoSeleccionado || esOperador}
              className="btn-primary rounded-full px-4 py-2 text-sm disabled:opacity-60"
            >
              {actualizando ? "Actualizando…" : esOperador ? "Solo lectura" : "Actualizar datos"}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#eadfe8]">
            <iframe
              title="Mapa GPS"
              src={mapaUrl}
              className="h-[430px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4 border-primary-100">
            <h3 className="text-lg font-bold text-primary">Vehículos conectados</h3>
            <div className="mt-4 space-y-3">
              {cargando ? (
                <p className="text-sm text-muted">Cargando ubicaciones…</p>
              ) : vehiculosCombinados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d8c2ce] bg-[#fcf8fa] p-4 text-sm text-muted">
                  No hay datos de GPS disponibles aún. Cuando el sistema reciba posiciones reales, aparecerán aquí.
                </div>
              ) : (
                vehiculosCombinados.map((vehiculo) => (
                  <button
                    key={vehiculo.id}
                    type="button"
                    onClick={() => setVehiculoSeleccionado(vehiculo)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      vehiculoSeleccionado?.id === vehiculo.id
                        ? "border-[#7a1f3d] bg-[#f9f0f3]"
                        : "border-[#eadfe8] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#2d1420]">{vehiculo.placa}</p>
                        <p className="text-xs text-muted">{vehiculo.marca || "Vehículo"}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estadoClasses[vehiculo.estado] || "bg-slate-100 text-slate-700"}`}>
                        {vehiculo.estado}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-muted">
                      <span>Conductor: {vehiculo.conductor}</span>
                      <span>{vehiculo.velocidad} km/h</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">Última señal: {vehiculo.ultimaActualizacion}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card p-4 border-primary-100">
            <h3 className="text-lg font-bold text-primary">Detalle del vehículo</h3>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              {vehiculoSeleccionado ? (
                <>
                  <div className="rounded-2xl bg-[#f8f3f6] p-3">
                    <p className="font-semibold text-[#2d1420]">Placa</p>
                    <p>{vehiculoSeleccionado.placa}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f3f6] p-3">
                    <p className="font-semibold text-[#2d1420]">Conductor</p>
                    <p>{vehiculoSeleccionado.conductor}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f3f6] p-3">
                    <p className="font-semibold text-[#2d1420]">Velocidad</p>
                    <p>{vehiculoSeleccionado.velocidad} km/h</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f3f6] p-3">
                    <p className="font-semibold text-[#2d1420]">Batería</p>
                    <p>{vehiculoSeleccionado.bateria}%</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f3f6] p-3">
                    <p className="font-semibold text-[#2d1420]">Coordenadas</p>
                    <p>{vehiculoSeleccionado.lat}, {vehiculoSeleccionado.lng}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted">Selecciona un vehículo para ver su detalle.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 border-primary-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-primary">Actividad reciente</h3>
            <p className="text-sm text-muted">Eventos y cambios del estado de los vehículos.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {eventosRecientes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8c2ce] bg-[#fcf8fa] p-4 text-sm text-muted md:col-span-3">
              Todavía no hay actividad registrada para mostrar.
            </div>
          ) : (
            eventosRecientes.map((evento) => (
              <div key={evento.id} className="rounded-2xl border border-[#eadfe8] bg-[#faf6f8] p-3">
                <p className="font-semibold text-[#2d1420]">{evento.titulo}</p>
                <p className="mt-1 text-sm text-muted">{evento.detalle}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
