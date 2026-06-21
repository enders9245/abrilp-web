const express = require("express");
const router = express.Router();

const {
  getFacturas,
  createFacturaDesdeCotizacion,
  anularFactura,
} = require("../controllers/facturasController");

router.get("/", getFacturas);
router.post("/", createFacturaDesdeCotizacion);
router.put("/:id/anular", anularFactura);

module.exports = router;