const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Admin = require("../models/admin");
const { getAllBookings } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* =======================
   ADMIN LOGIN
======================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   ADMIN SIGNUP (RESTRICTED)
======================= */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, inviteCode } = req.body;

    if (!email || !password || !inviteCode) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (inviteCode !== process.env.ADMIN_INVITE_CODE) {
      return res.status(403).json({ message: "Invalid invite code" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword });

    res.json({ message: "Admin created successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   FORGOT PASSWORD (SECURE)
======================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    // 🔐 Always return same response (no email leak)
    if (!admin) {
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    // 🔐 Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    admin.resetToken = hashedToken;
    admin.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min

    await admin.save();

    // 📧 Replace console.log with email service later
    console.log(
      `Reset link: http://localhost:5173/admin/reset-password/${rawToken}`
    );

    res.json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   RESET PASSWORD (SECURE)
======================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    // 🔐 Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;

    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   GET ALL BOOKINGS
======================= */
router.get("/bookings", authMiddleware, getAllBookings);

module.exports = router;
