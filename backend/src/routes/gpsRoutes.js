const express = require("express");
const router = express.Router();

const {
  getLatestPositions,
  getPositionsByVehiculo,
  storePosition,
  receiveWebhook,
} = require("../controllers/gpsController");

router.get("/", getLatestPositions);
router.get("/webhook", receiveWebhook);
router.get("/:vehiculoId", getPositionsByVehiculo);
router.post("/webhook", receiveWebhook);
router.post("/:vehiculoId", storePosition);

module.exports = router;
