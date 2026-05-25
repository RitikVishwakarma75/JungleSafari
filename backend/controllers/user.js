// controllers/user.js
const Booking = require("../models/booking");
const Contact = require("../models/contact");
const sendTicketEmail = require("../utils/ticketEmail");

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
    selectedSeats,
    totalPrice,
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
      selectedSeats: selectedSeats || [],
      totalPrice: totalPrice || 0,
      status: "approved", // Successful payment via checkout triggers approval
    });

    console.log("✅ Safari booking saved:", booking._id);

    // Send boarding ticket email immediately!
    await sendTicketEmail(booking);

    return res.status(201).json({
      message: "Safari booked and payment processed successfully!",
      bookingId: booking._id,
      booking: booking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
}


module.exports = { handleContactForm, handleBookSafari };
