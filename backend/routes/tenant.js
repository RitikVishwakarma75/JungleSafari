// backend/routes/tenant.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Tenant = require("../models/tenant");
const Admin = require("../models/admin");

/**
 * 1. GET TENANT BY SLUG (Self-healing master tenant creation)
 */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    let tenant = await Tenant.findOne({ slug: slug.toLowerCase() });
    
    // Self-healing: if requesting default master tenant and not found, auto-create it!
    if (!tenant && slug.toLowerCase() === "corbett-trails") {
      tenant = await Tenant.create({
        name: "Corbett Trails",
        slug: "corbett-trails",
        email: "support@corbett.com",
        phone: "+91 98765 43210",
        themeColor: "#4caf50",
        logo: "🦁",
        address: "Ramnagar, Uttarakhand, India",
        plan: "Enterprise",
      });
      console.log("🌟 Master Tenant 'corbett-trails' auto-created successfully!");
    }

    if (!tenant) {
      return res.status(404).json({ message: "Operator not found" });
    }

    res.json(tenant);
  } catch (err) {
    console.error("GET Tenant Error:", err);
    res.status(500).json({ message: "Server error fetching operator config" });
  }
});

/**
 * 2. REGISTER A NEW OPERATOR (TENANT)
 * Automatically registers their admin account with password 'admin123'
 */
router.post("/", async (req, res) => {
  const { name, slug, email, phone, themeColor, logo, address, password } = req.body;
  if (!name || !slug || !email) {
    return res.status(400).json({ message: "Name, slug, and email are required" });
  }

  try {
    const exists = await Tenant.findOne({ slug: slug.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Operator slug already registered" });
    }

    const newTenant = await Tenant.create({
      name,
      slug: slug.toLowerCase(),
      email,
      phone,
      themeColor: themeColor || "#4caf50",
      logo: logo || "",
      address: address || "",
    });

    console.log(`🌟 Registered new SaaS Operator: ${name} (${slug})`);

    // 🔥 Auto-create corresponding admin account for the new operator!
    const adminExists = await Admin.findOne({ email: email.toLowerCase() });
    if (!adminExists) {
      const userPassword = password || "admin123";
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      await Admin.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        tenantId: slug.toLowerCase(),
      });
      console.log(`🔐 Auto-created Admin Account for ${name}: Email: ${email} | Pass: [User Chosen]`);
    }

    res.status(201).json(newTenant);
  } catch (err) {
    console.error("Register Tenant Error:", err);
    res.status(500).json({ message: "Failed to register operator" });
  }
});

module.exports = router;
