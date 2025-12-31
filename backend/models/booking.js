// models/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true, // now frontend must send it
      trim: true,
    },

    zone: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    visitors: {
      type: Number, // ✅ FIXED
      required: true,
      min: 1,
    },

    safariType: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
