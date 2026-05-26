// backend/models/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "🦁", // Predefined wildlife emoji/preset
    },
    tenantId: {
      type: String,
      default: "corbett-trails", // partitions client reviews by tenant slug
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
