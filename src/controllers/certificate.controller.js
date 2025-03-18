const Notification = require("../models/notification.model");
const { generateCertificate } = require("../services/certificate.service");
const { sendCertificateEmail } = require("../services/email.service");

exports.generateCertificate = async (req, res, next) => {
  try {
    const { userName, courseName, userEmail, userId } = req.body;

    if (!userName || !courseName || !userEmail || !userId) {
      return res
        .status(400)
        .json({
          message: "User name, course name, email, and userId are required",
        });
    }

    console.log(
      `📝 Generating certificate for: ${userName}, Course: ${courseName}`
    );

    // توليد الشهادة
    const certificatePath = await generateCertificate(userName, courseName);
    console.log(`✅ Certificate generated at: ${certificatePath}`);

    // إرسال الشهادة عبر البريد الإلكتروني
    await sendCertificateEmail(
      userEmail,
      userName,
      courseName,
      certificatePath
    );
    console.log(`📩 Email sent to: ${userEmail}`);

    // إضافة الإشعار إلى قاعدة البيانات
    await Notification.create({
      userId: userId,
      message: `🎓 Congratulations! You have completed the ${courseName} course and earned a certificate.`,
      type: "certificate",
      read: false,
    });
    console.log(`🔔 Notification added for user: ${userId}`);

    res.status(200).json({
      message: "Certificate generated and sent successfully!",
      filePath: certificatePath,
    });
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    next(error);
  }
};
