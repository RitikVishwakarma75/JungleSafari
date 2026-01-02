/// connection.js
const mongoose = require("mongoose");

const connectMongoDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    return connection; // Promise return
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDb;

