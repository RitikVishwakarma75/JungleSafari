// backend/models/tenant.js
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
      trim: true,
    },
    stripeAccountId: {
      type: String,
      default: "acct_simulated_merchant",
    },
    themeColor: {
      type: String,
      default: "#4caf50", // Hex color representing their main theme
    },
    logo: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["Basic", "Pro", "Enterprise"],
      default: "Pro",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
