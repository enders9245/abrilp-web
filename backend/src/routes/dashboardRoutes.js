const express = require("express");
const router = express.Router();

const {
  getResumen,
  getIngresosMensuales,
} = require("../controllers/dashboardController");

router.get("/resumen", getResumen);
router.get("/ingresos-mensuales", getIngresosMensuales);

module.exports = router;