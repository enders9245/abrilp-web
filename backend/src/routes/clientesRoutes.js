const express = require("express");
const router = express.Router();

const {
  getClientes,
  createCliente,
  updateEstadoCliente,
  deleteCliente,
} = require("../controllers/clientesController");

router.get("/", getClientes);
router.post("/", createCliente);
router.put("/:id/estado", updateEstadoCliente);
router.delete("/:id", deleteCliente);

module.exports = router;