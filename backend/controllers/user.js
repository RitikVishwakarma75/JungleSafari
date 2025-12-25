// controllers/user.js
const Booking = require("../models/booking");
const Contact = require("../models/contact");

// Handle Contact Form


async function handleContactForm(req, res) {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    await Contact.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      message,
    });

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}


// Handle Safari Booking



async function handleBookSafari(req, res) {
  const {
    fullName,
    email,
    phone,
    zone,
    date,
    visitors,
    safariType,
    message,
  } = req.body;

  // Basic validation
  if (
    !fullName ||
    !email ||
    !phone ||
    !zone ||
    !date ||
    !visitors ||
    !safariType
  ) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    const booking = await Booking.create({
      fullName,
      email,
      phone,
      zone,
      date: new Date(date), // ✅ ensure Date object
      visitors: Number(visitors), // ✅ ensure Number
      safariType,
      message,
    });

    console.log("✅ Safari booking saved:", booking._id);

    return res.status(201).json({
      message: "Safari booked successfully!",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
}


module.exports = { handleContactForm, handleBookSafari };
