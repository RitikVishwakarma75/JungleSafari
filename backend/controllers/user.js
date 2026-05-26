// controllers/user.js
const Booking = require("../models/booking");
const Contact = require("../models/contact");
const sendTicketEmail = require("../utils/ticketEmail");
const sendEmail = require("../utils/sendEmail");
const Review = require("../models/review");

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

    // Send confirmation email to client! (non-blocking background dispatch)
    sendEmail({
      to: email,
      subject: "🌿 Thank you for contacting Jungle Safari!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #c8e6c9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background: #2e7d32; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Inquiry Confirmed</h2>
          </div>
          <div style="padding: 25px; color: #333; line-height: 1.6;">
            <h3>Hello ${firstName} ${lastName},</h3>
            <p>We are delighted that you reached out to us! We have successfully received your inquiry details:</p>
            <blockquote style="background: #f1f8e9; padding: 15px; border-left: 4px solid #2e7d32; margin: 15px 0; font-style: italic; border-radius: 4px;">
              "${message}"
            </blockquote>
            <p>Our expert support naturalists will review your request and get back to you shortly at <strong>${email}</strong> or by phone (<strong>${phone}</strong>).</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="text-align: center; font-weight: bold; color: #2e7d32; margin: 0;">🌳 May the Forest be with you! 🌳</p>
          </div>
        </div>
      `
    }).catch((clientMailError) => {
      console.error("❌ Failed to send contact confirmation email to client:", clientMailError);
    });

    // Also send notification email to the admin/owner vishwakarmaritik722@gmail.com (non-blocking background dispatch)
    sendEmail({
      to: "vishwakarmaritik722@gmail.com",
      subject: `🚨 New Contact Inquiry: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ffcc80; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background: #e65100; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 25px; color: #333; line-height: 1.6;">
            <p>You have received a new contact inquiry from the home page:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td>
              </tr>
            </table>
          </div>
        </div>
      `
    }).catch((adminMailError) => {
      console.error("❌ Failed to send contact notification email to admin:", adminMailError);
    });

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Form Error:", error);
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
    tenantId,
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
      tenantId: tenantId || "corbett-trails",
    });

    console.log("✅ Safari booking saved:", booking._id);

    // Send boarding ticket email immediately! (non-blocking background dispatch)
    sendTicketEmail(booking).catch((mailError) => {
      console.error("❌ Failed to send booking email:", mailError);
    });

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


// Handle Fetching Reviews
async function handleGetReviews(req, res) {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

// Handle Saving a New Review
async function handleCreateReview(req, res) {
  const { name, location, rating, comment, avatar, tenantId } = req.body;

  if (!name || !location || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReview = await Review.create({
      name,
      location,
      rating: Number(rating),
      comment,
      avatar: avatar || "🦁",
      tenantId: tenantId || "corbett-trails",
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Create Review Error:", error);
    return res.status(500).json({ message: "Failed to save review" });
  }
}


module.exports = { handleContactForm, handleBookSafari, handleGetReviews, handleCreateReview };
