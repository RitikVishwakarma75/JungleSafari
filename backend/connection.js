/// connection.js
require("dotenv").config(); // 🔥 Load env

const mongoose = require("mongoose");

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDb;
