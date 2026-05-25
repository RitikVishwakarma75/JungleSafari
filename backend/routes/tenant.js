// backend/routes/tenant.js
const express = require("express");
const router = express.Router();
const Tenant = require("../models/tenant");

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
 */
router.post("/", async (req, res) => {
  const { name, slug, email, phone, themeColor } = req.body;
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
    });

    res.status(201).json(newTenant);
  } catch (err) {
    console.error("Register Tenant Error:", err);
    res.status(500).json({ message: "Failed to register operator" });
  }
});

module.exports = router;
