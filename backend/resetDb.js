// backend/resetDb.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/admin");
const Booking = require("./models/booking");
const Tenant = require("./models/tenant");
const Contact = require("./models/contact");
const Guide = require("./models/guide");
const Sighting = require("./models/sighting");
const Newsletter = require("./models/Newsletter");

async function resetDatabase() {
  console.log("🔄 Connecting to MongoDB Atlas cloud database...");
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in your environment variables!");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected successfully.");

    console.log("🧹 Purging collections...");
    await Promise.all([
      Admin.deleteMany({}),
      Booking.deleteMany({}),
      Tenant.deleteMany({}),
      Contact.deleteMany({}),
      Guide.deleteMany({}),
      Sighting.deleteMany({}),
      Newsletter.deleteMany({}),
    ]);
    console.log("✅ Wiped all tables clean.");

    console.log("🌱 Seeding default master tenant (Corbett Trails)...");
    const defaultTenant = await Tenant.create({
      name: "Corbett Trails",
      slug: "corbett-trails",
      email: "support@corbett.com",
      phone: "+91 98765 43210",
      themeColor: "#4caf50",
      plan: "Enterprise",
    });
    console.log(`✅ Seeded master tenant: ${defaultTenant.name}`);

    console.log("🌱 Seeding default master administrator account...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const defaultAdmin = await Admin.create({
      email: "admin@corbett.com",
      password: hashedPassword,
      tenantId: "corbett-trails",
    });
    console.log(`✅ Seeded admin: ${defaultAdmin.email} | Pass: admin123`);

    console.log("\n============================================================");
    console.log("🎉 DATABASE RESET COMPLETED SUCCESSFULLY!");
    console.log("Your cloud database is now 100% clean and ready for new SaaS onboarding!");
    console.log("============================================================\n");

  } catch (err) {
    console.error("❌ Database Reset Failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

resetDatabase();
