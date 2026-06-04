// routes/newsletter.js
const express = require("express");
const Newsletter = require("../models/Newsletter");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });

    // Send newsletter subscription email! (non-blocking)
    sendEmail({
      to: email,
      subject: "🌿 Welcome to the Jungle Safari Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #c8e6c9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #1b5e20, #2e7d32); color: #fff; padding: 25px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">Subscription Confirmed!</h2>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.85;">WELCOME TO OUR WILDLIFE NEWSLETTER</p>
          </div>
          <div style="padding: 25px; color: #333; line-height: 1.6;">
            <h3>Dear Wildlife Explorer,</h3>
            <p>We are absolutely thrilled to welcome you to the official <strong>Jungle Safari Newsletter</strong> community! 🌳🐾</p>
            <p>You are now on the insider list to receive:</p>
            <ul style="padding-left: 20px; margin: 15px 0;">
              <li style="margin-bottom: 8px;">🚨 <strong>Live Predator Pathway Updates</strong>: Real-time tiger and leopard sighting hotspots.</li>
              <li style="margin-bottom: 8px;">📅 <strong>Safari Gate Status Notices</strong>: Seasonal opening schedules for Corbett & other national zones.</li>
              <li style="margin-bottom: 8px;">🏷️ <strong>Exclusive Booking Discounts</strong>: Early-bird seat reservation coupon offers.</li>
            </ul>
            <p>We promise to only send you high-quality, exciting forest updates and keep your inbox completely clutter-free.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
            <p style="text-align: center; font-weight: bold; color: #1b5e20; margin: 0;">🌳 May the Forest be with you! 🌳</p>
          </div>
        </div>
      `
    }).catch((err) => {
      console.error("❌ Failed to send newsletter subscription email to client:", err);
    });

    // Also send an email notification to the admin/owner vishwakarmaritik722@gmail.com (non-blocking)
    sendEmail({
      to: "vishwakarmaritik722@gmail.com",
      subject: `📧 New Newsletter Subscriber: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #c8e6c9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background: #2e7d32; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">New Newsletter Subscription</h2>
          </div>
          <div style="padding: 25px; color: #333; line-height: 1.6;">
            <p>A new visitor has subscribed to the Jungle Safari Newsletter:</p>
            <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      `
    }).catch((err) => {
      console.error("❌ Failed to send newsletter admin notification:", err);
    });

    res.status(201).json({ message: "Subscribed successfully 🌿" });
  } catch (err) {
    console.error("Newsletter Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
