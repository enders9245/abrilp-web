const express = require("express");
const router = express.Router();

const {
  getEmpresa,
  updateEmpresa,
} = require("../controllers/empresaController");

router.get("/", getEmpresa);
router.put("/", updateEmpresa);

module.exports = router;