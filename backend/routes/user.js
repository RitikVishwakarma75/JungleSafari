//Routes user.js 
const express = require("express");
const { handleBookSafari, handleContactForm, handleGetReviews, handleCreateReview } = require("../controllers/user");

const router = express.Router();

// Safari Booking Route
router.post("/booking", handleBookSafari);

// Contact Form Route
router.post("/contact", handleContactForm);

// Reviews Routes
router.get("/reviews", handleGetReviews);
router.post("/reviews", handleCreateReview);

module.exports = router;
