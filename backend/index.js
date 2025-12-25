// index.js
require("dotenv").config(); // 🔥 Load env first

const express = require("express");
const connectMongoDb = require("./connection");
const applyCommonMiddleware = require("./middlewares/applyCommonMiddleware");
const userRouter = require("./routes/user");
const rideRouter = require("./routes/ride");
const adminRouter = require("./routes/admin");


const app = express();

// Read PORT from .env
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectMongoDb();

// Apply common middleware
applyCommonMiddleware(app);

// after app.use("/api", userRouter);
app.use("/api/rides", rideRouter);

// Routes
app.use("/api", userRouter);

app.use("/api/admin", adminRouter);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
