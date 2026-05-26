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
const Review = require("./models/review");

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
      Review.deleteMany({}),
    ]);
    console.log("✅ Wiped all tables clean.");

    console.log("🌱 Seeding default master tenant (Corbett Trails)...");
    const defaultTenant = await Tenant.create({
      name: "Corbett Trails",
      slug: "corbett-trails",
      email: "support@corbett.com",
      phone: "+91 98765 43210",
      themeColor: "#4caf50",
      logo: "🦁",
      address: "Ramnagar, Uttarakhand, India",
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

    console.log("🌱 Seeding default master reviews...");
    await Review.create([
      {
        name: "Rohit Sharma",
        location: "Delhi, India",
        rating: 5,
        comment: "An unforgettable experience! The Dhikala safari was breathtaking and our guide was incredibly knowledgeable.",
        avatar: "🐯",
        tenantId: "corbett-trails",
      },
      {
        name: "Sneha Kapoor",
        location: "Mumbai, India",
        rating: 4,
        comment: "Loved the serene beauty of Jhirna and Garjiya zones. Perfect for family trips and photography.",
        avatar: "🐘",
        tenantId: "corbett-trails",
      },
      {
        name: "Amit Verma",
        location: "Bangalore, India",
        rating: 5,
        comment: "Phato Zone was incredible! Dense greenery and high chances of spotting tigers. Definitely recommend the treehouse stay.",
        avatar: "🦌",
        tenantId: "corbett-trails",
      },
      {
        name: "Priya Singh",
        location: "Noida, India",
        rating: 4,
        comment: "Bijrani and Dhela zones are a photographer's dream. The staff made our safari experience seamless and enjoyable.",
        avatar: "🐒",
        tenantId: "corbett-trails",
      }
    ]);
    console.log("✅ Seeded default reviews.");

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
