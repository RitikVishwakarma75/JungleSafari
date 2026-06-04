const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Compiles a beautiful ticket HTML content for both email formats with extremely kind, welcoming messages.
 */
function compileTicketHtml(booking, qrUrl) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px dashed #2e7d32; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); background-color: #ffffff; color: #333333;">
      
      <!-- Banner Header -->
      <div style="background: linear-gradient(135deg, #1b5e20, #2e7d32); color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px;">Jungle Safari Entry Pass</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.85; text-transform: uppercase;">Official Corbett Trails Boarding Ticket</p>
      </div>

      <!-- Ticket Core Details -->
      <div style="padding: 30px;">
        
        <!-- Warm Greeting & Kind Text -->
        <div style="margin-bottom: 25px; line-height: 1.6; color: #444444; font-size: 14px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
          <h3 style="color: #1b5e20; margin-top: 0; margin-bottom: 10px;">Hello ${booking.fullName},</h3>
          <p style="margin: 0 0 10px 0;">We are absolutely delighted to confirm your upcoming Jungle Safari adventure at Jim Corbett National Park! 🌳🐾</p>
          <p style="margin: 0 0 10px 0;">Your booking has been successfully processed and your official forest entry permit is ready below. Please keep this email safe as a confirmation receipt. You can print the permit or save it as a PDF anytime to present to forest rangers at the gate.</p>
          <p style="margin: 0;">We wish you an unforgettable adventure filled with breathtaking sights of majestic tigers and beautiful wildlife! 🐅✨</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; color: #666666; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
          <span>Ticket ID: <strong>#${booking._id}</strong></span>
          <span>Date Issued: <strong>${new Date().toLocaleDateString()}</strong></span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Traveller Name:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right;">${booking.fullName}</td>
          </tr>
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Safari Zone:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #2e7d32;">${booking.zone} Zone</td>
          </tr>
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Safari Date:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right;">${new Date(booking.date).toLocaleDateString()}</td>
          </tr>
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Visitors Count:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right;">${booking.visitors} Guest(s)</td>
          </tr>
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Safari Ride / Seating:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right;">${booking.safariType} ${booking.selectedSeats && booking.selectedSeats.length > 0 ? `(Seats: ${booking.selectedSeats.join(', ')})` : ''}</td>
          </tr>
          ${booking.assignedGuide ? `
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Assigned Guide:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #2e7d32;">${booking.assignedGuide}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 1px solid #f9f9f9;">
            <td style="padding: 10px 0; color: #666666; font-weight: 500;">Total Amount Paid:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #2e7d32;">Rs. ${booking.totalPrice}</td>
          </tr>
        </table>

        <!-- QR Code Ticket Section -->
        <div style="background-color: #f1f8e9; border: 1px solid #c8e6c9; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #2e7d32; letter-spacing: 0.5px;">Gate QR Pass</h4>
          <img src="${qrUrl}" alt="Boarding QR Code" style="width: 150px; height: 150px; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 8px;" />
          <p style="margin: 0; font-size: 11px; color: #666666;">Present this QR code to the naturalist officer at the gate entrance.</p>
        </div>

        <div style="font-size: 11px; color: #999999; text-align: center; border-top: 1px dashed #dddddd; padding-top: 15px; line-height: 1.4; margin-bottom: 20px;">
          Please reach the designated forest gate entrance 30 minutes before your slot session. Carry a valid photo ID along with this ticket card.
        </div>

        <!-- Kind Closing Text -->
        <div style="text-align: center; font-size: 13px; color: #555555; border-top: 1px solid #eeeeee; padding-top: 15px;">
          <p style="margin: 0 0 5px 0; font-weight: 600; color: #1b5e20;">🌳 May the Forest be with you! 🌳</p>
          <p style="margin: 0; font-size: 12px; color: #777777;">Warm regards,<br /><strong>The Corbett Trails Safari Team</strong><br />Support: vishwakarmaritik722@gmail.com</p>
        </div>
      </div>
    </div>
  `;
}

async function sendTicketEmail(booking) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(booking._id.toString())}`;
  const htmlContent = compileTicketHtml(booking, qrUrl);
  const subjectText = `🌳 Your Corbett Safari Boarding Ticket is Confirmed! (ID: #${booking._id})`;

  // --- METHOD 1: Attempt SendGrid ---
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to: booking.email,
        from: "vishwakarmaritik722@gmail.com", // Verified SendGrid single-sender
        subject: subjectText,
        html: htmlContent,
      };
      await sgMail.send(msg);
      console.log(`✉️ [SendGrid] Sighting ticket successfully dispatched to ${booking.email}`);
      return true;
    } catch (err) {
      console.warn("⚠️ SendGrid dispatch failed (possibly out of free credits or unauthorized). Trying Nodemailer fallback...");
      console.warn(err.message);
    }
  }

  // --- METHOD 2: Nodemailer fallback ---
  try {
    let transporter;

    // Check if user has specified their own SMTP credentials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 3000, // 3 seconds timeout
        socketTimeout: 3000, // 3 seconds socket timeout
      });
      console.log(`🔌 [Nodemailer] Using SMTP Transporter configured for user: ${process.env.SMTP_USER}`);
    } else {
      // Create Ethereal sandbox test account dynamically as an automatic, zero-config backup!
      console.log("ℹ️ No custom SMTP credentials found. Creating auto-configured Ethereal sandbox transporter...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const senderEmail = process.env.SMTP_USER || "vishwakarmaritik722@gmail.com";
    const mailOptions = {
      from: `"Corbett Trails Safari" <${senderEmail}>`,
      to: booking.email,
      subject: subjectText,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] Ticket email sent successfully! MessageID: ${info.messageId}`);

    // If Ethereal test account was used, print the test preview URL so the user can easily view the email in their browser!
    if (!process.env.SMTP_USER) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("\n==========================================================================");
      console.log(`🔍 [SANDBOX EMAIL PREVIEW] Open this URL in your browser to view the email:`);
      console.log(`🔗 ${previewUrl}`);
      console.log("==========================================================================\n");
    }
    return true;
  } catch (nodemailerErr) {
    console.error("❌ Both SendGrid and Nodemailer email dispatchers failed:", nodemailerErr.message);
    return false;
  }
}

module.exports = sendTicketEmail;
