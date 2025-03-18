const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = (userName, courseName, logoPath) => {
  return new Promise((resolve, reject) => {
    console.log(
      "📝 Generating certificate for:",
      userName,
      "Course:",
      courseName
    );

    const certificatesDir = path.join(__dirname, "../certificates");
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const filePath = path.join(
      certificatesDir,
      `${userName}-${courseName}.pdf`
    );
    const stream = fs.createWriteStream(filePath);
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });

    doc.pipe(stream);

    console.log("📂 Raw logoPath:", logoPath);
    let validLogoPath = logoPath ? path.resolve(logoPath) : null;

    console.log("🖼️ Checking logo path:", validLogoPath);

    if (validLogoPath && fs.existsSync(validLogoPath)) {
      console.log("✅ Adding user-provided logo:", validLogoPath);
      doc.image(validLogoPath, 50, 50, { width: 100 });
    } else {
      console.log("⚠️ No valid logo found at:", validLogoPath);
    }

    doc
      .fontSize(30)
      .fillColor("#333")
      .text("Certificate of Completion", 0, 150, { align: "center" });

    doc.moveDown();
    doc.fontSize(24).fillColor("#000").text(`${userName}`, { align: "center" });
    doc.moveDown();
    doc
      .fontSize(18)
      .text(`Has successfully completed the course \"${courseName}\".`, {
        align: "center",
      });
    doc.moveDown();
    doc
      .fontSize(16)
      .fillColor("#555")
      .text("Instructor Signature: _______________", { align: "left" });

    doc.end();

    stream.on("finish", () => {
      console.log("✅ Certificate generated successfully!");
      resolve(filePath);
    });

    stream.on("error", (err) => {
      console.error("❌ Error generating certificate:", err.message);
      reject(err);
    });
  });
};

module.exports = { generateCertificate };
