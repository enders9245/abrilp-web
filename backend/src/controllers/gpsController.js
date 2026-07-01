const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "..", "data", "gpsPositions.json");

const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
};

const readPositions = () => {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
};

const writePositions = (positions) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(positions, null, 2), "utf8");
};

const seedFallbackPositions = () => {
  const positions = readPositions();
  if (positions.length > 0) {
    return positions;
  }

  const fallback = [
    {
      id: "veh-001",
      vehiculo_id: 1,
      placa: "ABC-123",
      conductor: "Carlos Rojas",
      estado: "En viaje",
      lat: -16.39889,
      lng: -71.535,
      velocidad: 58,
      bateria: 76,
      fecha: new Date().toISOString(),
      ultimaActualizacion: new Date().toLocaleString("es-PE"),
    },
    {
      id: "veh-002",
      vehiculo_id: 2,
      placa: "XYZ-789",
      conductor: "María Paredes",
      estado: "Parado",
      lat: -16.4012,
      lng: -71.5399,
      velocidad: 8,
      bateria: 43,
      fecha: new Date().toISOString(),
      ultimaActualizacion: new Date().toLocaleString("es-PE"),
    },
    {
      id: "veh-003",
      vehiculo_id: 3,
      placa: "QWE-456",
      conductor: "Luis Torres",
      estado: "Sin señal",
      lat: -16.395,
      lng: -71.542,
      velocidad: 0,
      bateria: 19,
      fecha: new Date().toISOString(),
      ultimaActualizacion: new Date().toLocaleString("es-PE"),
    },
  ];

  writePositions(fallback);
  return fallback;
};

const normalizePosition = (body = {}, vehiculoId) => {
  const lat = Number(body.lat ?? body.latitude ?? body.latitud ?? body.gps_latitude ?? body.gpsLat ?? body.coords?.lat);
  const lng = Number(body.lng ?? body.longitude ?? body.longitud ?? body.gps_longitude ?? body.gpsLng ?? body.coords?.lng);
  const velocidad = Number(body.velocidad ?? body.speed ?? body.velocity ?? body.velocidad_kmh ?? 0);
  const bateria = Number(body.bateria ?? body.battery ?? body.batteryLevel ?? 0);
  const vehiculoIdValue = Number(vehiculoId ?? body.vehiculo_id ?? body.vehicleId ?? body.vehiculoId ?? 1);

  return {
    id: body.id || `${vehiculoIdValue}-${Date.now()}`,
    vehiculo_id: Number.isFinite(vehiculoIdValue) ? vehiculoIdValue : 1,
    placa: body.placa || body.plate || body.vehiculo || "SIN PLACA",
    conductor: body.conductor || body.driver || "Sin conductor",
    estado: body.estado || body.status || (velocidad > 0 ? "En viaje" : "Parado"),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    velocidad: Number.isFinite(velocidad) ? velocidad : 0,
    bateria: Number.isFinite(bateria) ? bateria : 0,
    fecha: body.fecha || body.timestamp || new Date().toISOString(),
    ultimaActualizacion: new Date().toLocaleString("es-PE"),
  };
};

const upsertPosition = (payload) => {
  const positions = readPositions();
  const index = positions.findIndex(
    (item) => String(item.vehiculo_id) === String(payload.vehiculo_id)
  );

  if (index >= 0) {
    positions[index] = payload;
  } else {
    positions.push(payload);
  }

  writePositions(positions);
  return payload;
};

const simulateLiveMovement = (positions) => {
  const now = Date.now();
  return positions.map((position, index) => {
    const baseLat = Number(position.lat) || -16.4;
    const baseLng = Number(position.lng) || -71.54;
    const speed = Number(position.velocidad) || 0;
    const drift = speed > 0 ? 0.00018 : 0.00004;
    const lat = baseLat + Math.sin((now / 10000) + index) * drift;
    const lng = baseLng + Math.cos((now / 12000) + index) * drift;

    return {
      ...position,
      lat,
      lng,
      velocidad: speed > 0 ? Math.max(12, speed + Math.round(Math.sin(now / 6000 + index) * 6)) : speed,
      estado: speed > 25 ? "En viaje" : speed > 5 ? "Parado" : position.estado === "Sin señal" ? "Sin señal" : "Parado",
      bateria: Math.max(5, Number(position.bateria) - (speed > 0 ? 0 : 0)),
      fecha: new Date().toISOString(),
      ultimaActualizacion: new Date().toLocaleString("es-PE"),
    };
  });
};

const getLatestPositions = (req, res) => {
  const seeded = seedFallbackPositions();
  const positions = simulateLiveMovement(seeded)
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  writePositions(positions);
  res.json(positions);
};

const getPositionsByVehiculo = (req, res) => {
  const { vehiculoId } = req.params;
  const positions = seedFallbackPositions().filter(
    (item) => String(item.vehiculo_id) === String(vehiculoId)
  );

  res.json(positions.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
};

const storePosition = (req, res) => {
  const payload = normalizePosition(req.body, req.params.vehiculoId);
  const saved = upsertPosition(payload);

  res.json({
    success: true,
    message: "Ubicación actualizada correctamente",
    data: saved,
  });
};

const receiveWebhook = (req, res) => {
  const payload = normalizePosition(req.body, req.body.vehiculo_id || req.body.vehicleId || req.body.vehiculoId);
  const saved = upsertPosition(payload);

  res.json({
    success: true,
    message: "Webhook de GPS recibido correctamente",
    data: saved,
  });
};

module.exports = {
  getLatestPositions,
  getPositionsByVehiculo,
  storePosition,
  receiveWebhook,
};
