const express = require("express");
const router = express.Router();

const {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} = require("../controllers/rolesController");

router.get("/", getRoles);
router.post("/", createRol);
router.put("/:id", updateRol);
router.delete("/:id", deleteRol);

module.exports = router;