require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");
const usuariosRoutes = require("./routes/usuariosRoutes");
const rucRoutes = require("./routes/rucRoutes");
const authRoutes = require("./routes/authRoutes");
const clientesRoutes = require("./routes/clientesRoutes");
const vehiculosRoutes = require("./routes/vehiculosRoutes");
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const condicionesRoutes = require("./routes/condicionesRoutes");
const implementacionesRoutes = require("./routes/implementacionesRoutes");
const facturasRoutes = require("./routes/facturasRoutes");
const rolesRoutes = require("./routes/rolesRoutes");
const app = express();
const dashboardRoutes = require("./routes/dashboardRoutes");
console.log("DECOLECTA_TOKEN:", process.env.DECOLECTA_TOKEN);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/dashboard", dashboardRoutes);
app.use(express.json());
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api/condiciones", condicionesRoutes);
app.use("/api/implementaciones", implementacionesRoutes);
app.use("/api/ruc", rucRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/roles", rolesRoutes);
app.get("/", (req, res) => {
  res.json({
    mensaje: "API AbrilP funcionando",
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});