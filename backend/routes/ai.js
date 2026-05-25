// backend/routes/ai.js
const express = require("express");
const router = express.Router();
const {
  generateItinerary,
  parseChatSession,
  predictSighting,
  analyzeImage,
} = require("../utils/gemini");

/**
 * 1. AI ITINERARY GENERATOR
 * Body: { duration, groupType, interests }
 */
router.post("/planner", async (req, res) => {
  try {
    const { duration, groupType, interests } = req.body;
    if (!duration || !groupType || !interests) {
      return res.status(400).json({ message: "Duration, groupType, and interests are required" });
    }

    const data = await generateItinerary(duration, groupType, interests);
    res.json(data);
  } catch (err) {
    console.error("AI Planner Route Error:", err);
    res.status(500).json({ message: "Failed to generate AI itinerary" });
  }
});

/**
 * 2. NATURAL CONVERSATIONAL BOOKING AGENT
 * Body: { messages }
 */
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const result = await parseChatSession(messages);
    res.json(result);
  } catch (err) {
    console.error("AI Chatbot Route Error:", err);
    res.status(500).json({ message: "Failed to process chat message" });
  }
});

/**
 * 3. AI SIGHTING PROBABILITY PREDICTOR
 * Body: { zone, date }
 */
router.post("/predict-sighting", async (req, res) => {
  try {
    const { zone, date } = req.body;
    if (!zone || !date) {
      return res.status(400).json({ message: "Zone and date are required" });
    }

    const predictions = await predictSighting(zone, date);
    res.json(predictions);
  } catch (err) {
    console.error("AI Predictor Route Error:", err);
    res.status(500).json({ message: "Failed to predict sightings" });
  }
});

/**
 * 4. AI WILDLIFE IMAGE SCANNER (VISION)
 * Body: { imageBase64 }
 */
router.post("/scan-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: "imageBase64 data is required" });
    }

    const analysis = await analyzeImage(imageBase64);
    res.json(analysis);
  } catch (err) {
    console.error("AI Scanner Route Error:", err);
    res.status(500).json({ message: "Failed to scan wildlife image" });
  }
});

module.exports = router;
