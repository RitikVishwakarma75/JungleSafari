// backend/utils/autoCreateAdmin.js
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

async function autoCreateAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing");
    return;
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("ℹ️ Admin already exists:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    password: hashedPassword,
  });

  console.log("✅ Admin auto-created:", email);
}

module.exports = autoCreateAdmin;
