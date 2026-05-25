// backend/models/guide.js
const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    tenantId: {
      type: String,
      required: true,
      default: "corbett-trails", // links guide to respective operator
    },
    assignedVehicle: {
      type: String,
      default: "Jeep Gypsy (UA-04-1234)",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guide", guideSchema);
