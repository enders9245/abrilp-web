const express = require("express");
const router = express.Router();

const {
  getImplementaciones,
  createImplementacion,
  updateImplementacion,
  deleteImplementacion,
} = require("../controllers/implementacionesController");

router.get("/", getImplementaciones);
router.post("/", createImplementacion);
router.put("/:id", updateImplementacion);
router.delete("/:id", deleteImplementacion);

module.exports = router;