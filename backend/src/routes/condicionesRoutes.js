const express = require("express");
const router = express.Router();

const {
  getCondiciones,
  createCondicion,
  updateCondicion,
  deleteCondicion,
} = require("../controllers/condicionesController");

router.get("/", getCondiciones);
router.post("/", createCondicion);
router.put("/:id", updateCondicion);
router.delete("/:id", deleteCondicion);

module.exports = router;