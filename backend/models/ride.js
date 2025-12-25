const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    zone: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["Jeep", "Canter", "Elephant"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
