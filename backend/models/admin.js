// backend/models/admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
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
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    tenantId: {
      type: String,
      default: "corbett-trails", // separates operators by tenant boundaries
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
