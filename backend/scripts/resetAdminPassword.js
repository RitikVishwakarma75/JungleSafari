// backend/scripts/resetAdminPassword.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

async function resetAdminPassword() {
  try {
    if (!process.env.NEW_ADMIN_PASSWORD) {
      throw new Error("NEW_ADMIN_PASSWORD missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(
      process.env.NEW_ADMIN_PASSWORD,
      10
    );

    const result = await Admin.updateOne(
      { email: process.env.ADMIN_EMAIL },
      { password: hashedPassword }
    );

    if (result.matchedCount === 0) {
      console.log("❌ Admin not found");
    } else {
      console.log("✅ Admin password reset successfully");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

resetAdminPassword();
