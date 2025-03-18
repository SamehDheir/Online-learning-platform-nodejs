const express = require("express");
const { generateCertificate } = require("../services/certificate.service");
const upload = require("../middlewares/uploadLogo.middleware");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/generate-certificate",
  protect,
  checkRole("admin"),
  async (req, res, next) => {
    try {
      const { userName, courseName } = req.body;
      const logoPath = req.file ? req.file.path : req.body.logoPath;

      const filePath = await generateCertificate(
        userName,
        courseName,
        logoPath
      );
      res.download(filePath);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/upload-logo", upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ logoPath: `/uploads/logos/${req.file.filename}` });
});

module.exports = router;
