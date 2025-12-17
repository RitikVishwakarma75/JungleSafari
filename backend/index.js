const express = require("express");
const connectMongoDb = require("./connection");
const applyCommonMiddleware = require("./middlewares/applyCommonMiddleware");
const userRouter = require("./routes/user");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectMongoDb();

// Apply common middleware
applyCommonMiddleware(app);

// Use combined routes
app.use("/api", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
