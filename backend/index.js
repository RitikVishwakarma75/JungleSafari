// backend/index.js
require("dotenv").config();

const express = require("express");
const connectMongoDb = require("./connection");
const applyCommonMiddleware = require("./middlewares/applyCommonMiddleware");

const userRouter = require("./routes/user");
const rideRouter = require("./routes/ride");
const adminRouter = require("./routes/admin");
const newsletterRoute = require("./routes/newsletter");
const aiRouter = require("./routes/ai");
const sightingRouter = require("./routes/sighting");
const tenantRouter = require("./routes/tenant");
const guideRouter = require("./routes/guide");
const autoCreateAdmin = require("./utils/autoCreateAdmin");

const app = express();
const PORT = process.env.PORT || 5000;

applyCommonMiddleware(app);

app.use("/api", userRouter);
app.use("/api/rides", rideRouter);
app.use("/api/admin", adminRouter);
app.use("/api", newsletterRoute);
app.use("/api/ai", aiRouter);
app.use("/api/sightings", sightingRouter);
app.use("/api/tenants", tenantRouter);
app.use("/api/tenant", tenantRouter);
app.use("/api/guide", guideRouter);

connectMongoDb().then(async () => {
  await autoCreateAdmin();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
