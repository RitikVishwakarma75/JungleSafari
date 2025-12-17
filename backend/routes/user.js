//Routes user.js 
const express = require("express");
const { handleBookSafari, handleContactForm } = require("../controllers/user");

const router = express.Router();

// Safari Booking Route
router.post("/booking", handleBookSafari);

// Contact Form Route
router.post("/contact", handleContactForm);

module.exports = router;
