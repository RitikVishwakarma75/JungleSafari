const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

async function autoCreateAdmin() {
  const existing = await Admin.findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (existing) {
    console.log("ℹ️ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("✅ Admin auto-created");
}

module.exports = autoCreateAdmin;
