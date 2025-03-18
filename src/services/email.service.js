const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendCertificateEmail = async (
  email,
  userName,
  courseName,
  certificatePath
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎓 Your Certificate is Ready!",
    text: `Hi ${userName},\n\nCongratulations on completing the ${courseName} course!\n\nYou can find your certificate attached.`,
    attachments: [
      {
        filename: `${userName}-${courseName}.pdf`,
        path: certificatePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Certificate email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};


exports.sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}. It will expire in 15 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};


