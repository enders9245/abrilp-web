const express = require("express");
const router = express.Router();

const { consultarRuc } = require("../controllers/rucController");

router.get("/:ruc", consultarRuc);

module.exports = router;