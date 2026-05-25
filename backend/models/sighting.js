// backend/models/sighting.js
const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema(
  {
    animalName: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      enum: ["Morning", "Evening"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true, // stores base64 image data
    },
    tags: {
      type: [String],
      default: [],
    },
    reportedBy: {
      type: String,
      default: "Anonymous Tourist",
    },
    likes: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 29.52, // Jim Corbett default latitude
    },
    lng: {
      type: Number,
      default: 78.78, // Jim Corbett default longitude
    },
    tenantId: {
      type: String,
      default: "corbett-trails", // partitions community sightings by tenant operator
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sighting", sightingSchema);
