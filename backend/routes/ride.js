const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createRide,
  updateRide,
  deleteRide,
  getAllRides,
} = require("../controllers/rideController");

const router = express.Router();

// PUBLIC
router.get("/", getAllRides);

// ADMIN (Protected)
router.post("/", authMiddleware, createRide);
router.put("/:id", authMiddleware, updateRide);
router.delete("/:id", authMiddleware, deleteRide);

module.exports = router;
