// routes/newsletter.js
const express = require("express");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully 🌿" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
