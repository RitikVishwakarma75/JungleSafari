// backend/routes/sighting.js
const express = require("express");
const router = express.Router();
const Sighting = require("../models/sighting");

/**
 * 1. GET ALL SIGHTINGS
 */
router.get("/", async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({ createdAt: -1 });
    res.json(sightings);
  } catch (err) {
    console.error("GET Sightings Error:", err);
    res.status(500).json({ message: "Failed to fetch sightings" });
  }
});

/**
 * 2. CREATE A SIGHTING
 */
router.post("/", async (req, res) => {
  try {
    const { animalName, zone, date, time, description, imageUrl, tags, reportedBy, lat, lng } = req.body;
    
    if (!animalName || !zone || !date || !time || !imageUrl) {
      return res.status(400).json({ message: "Missing required sighting details" });
    }

    const newSighting = await Sighting.create({
      animalName,
      zone,
      date,
      time,
      description,
      imageUrl,
      tags: tags || [],
      reportedBy: reportedBy || "Anonymous Tourist",
      lat: lat || 29.52,
      lng: lng || 78.78,
    });

    res.status(201).json(newSighting);
  } catch (err) {
    console.error("POST Sighting Error:", err);
    res.status(500).json({ message: "Failed to save sighting" });
  }
});

/**
 * 3. LIKE A SIGHTING
 */
router.post("/:id/like", async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }

    sighting.likes += 1;
    await sighting.save();

    res.json(sighting);
  } catch (err) {
    console.error("Like Sighting Error:", err);
    res.status(500).json({ message: "Failed to like sighting" });
  }
});

module.exports = router;
