const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await sgMail.send({
    to,
    from: "vishwakarmaritik722@gmail.com", // any verified sender
    subject,
    html,
  });
};

module.exports = sendEmail;
