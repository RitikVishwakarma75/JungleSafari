const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async ({ to, subject, html }) => {
  // --- METHOD 1: Attempt SendGrid ---
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to,
        from: "vishwakarmaritik722@gmail.com",
        subject,
        html,
      };
      await sgMail.send(msg);
      console.log(`✉️ [SendGrid] Email successfully dispatched to ${to}`);
      return true;
    } catch (err) {
      console.warn("⚠️ SendGrid dispatch failed. Trying Nodemailer fallback...");
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
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 3000, // 3 seconds timeout
        socketTimeout: 3000, // 3 seconds socket timeout
      });
      console.log(`🔌 [Nodemailer] Using SMTP Transporter configured for user: ${process.env.SMTP_USER}`);
    } else {
      console.log("ℹ️ No custom SMTP credentials found. Creating auto-configured Ethereal sandbox transporter...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const senderEmail = process.env.SMTP_USER || "vishwakarmaritik722@gmail.com";
    const mailOptions = {
      from: `"Jungle Safari" <${senderEmail}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] Email sent successfully! MessageID: ${info.messageId}`);

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
};

module.exports = sendEmail;
