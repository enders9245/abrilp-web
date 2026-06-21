const express = require("express");
const router = express.Router();

const {
  getCotizaciones,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
  updateEstadoCotizacion,
  getCotizacionItems,
} = require("../controllers/cotizacionesController");

router.get("/", getCotizaciones);
router.post("/", createCotizacion);
router.put("/:id", updateCotizacion);
router.delete("/:id", deleteCotizacion);
router.put("/:id/estado", updateEstadoCotizacion);
router.get("/:id/items", getCotizacionItems);

module.exports = router;