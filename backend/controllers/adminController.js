// backend/controllers/adminController.js
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/booking");

async function adminLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Enforces strict multi-tenant boundary checks on bookings list queries.
 * Master developer admin (corbett-trails) sees global statistics.
 */
async function getAllBookings(req, res) {
  try {
    const query = {};
    
    // If the admin is scoped to a specific tenant, isolate their database queries!
    if (req.admin && req.admin.tenantId && req.admin.tenantId !== "corbett-trails") {
      query.tenantId = req.admin.tenantId;
      console.log(`🔒 [Data Isolation] Scoped bookings query for tenant: ${req.admin.tenantId}`);
    } else {
      console.log("🔓 [Global Override] Scoped bookings query as Master Super Admin");
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
}

module.exports = { adminLogin, getAllBookings };
