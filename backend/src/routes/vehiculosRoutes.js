const express = require("express");
const router = express.Router();

const {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} = require("../controllers/vehiculosController");

router.get("/", getVehiculos);
router.post("/", createVehiculo);
router.put("/:id", updateVehiculo);
router.delete("/:id", deleteVehiculo);

module.exports = router;