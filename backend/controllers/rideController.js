const Ride = require("../models/ride");

// ADMIN: Create Ride
async function createRide(req, res) {
  try {
    const ride = await Ride.create(req.body);
    res.status(201).json({ message: "Ride created", ride });
  } catch (err) {
    res.status(500).json({ message: "Failed to create ride" });
  }
}

// ADMIN: Update Ride
async function updateRide(req, res) {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Ride updated", ride });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
}

// ADMIN: Delete Ride
async function deleteRide(req, res) {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.json({ message: "Ride deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
}

// PUBLIC: Get All Active Rides
async function getAllRides(req, res) {
  try {
    const rides = await Ride.find({ isActive: true });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rides" });
  }
}

module.exports = {
  createRide,
  updateRide,
  deleteRide,
  getAllRides,
};
