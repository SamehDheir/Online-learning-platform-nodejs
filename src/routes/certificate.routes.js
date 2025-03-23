const express = require("express");
const { generateCertificate } = require("../services/certificate.service");
const upload = require("../middlewares/uploadLogo.middleware");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/certificate/generate-certificate:
 *   post:
 *     summary: Generate a course completion certificate
 *     description: Generates a certificate for a user upon course completion. Only admins can generate certificates.
 *     tags:
 *       - Certificate
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User and course information for certificate generation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               courseName:
 *                 type: string
 *               logoPath:
 *                 type: string
 *                 description: Optional logo path for the certificate
 *     responses:
 *       200:
 *         description: Certificate generated successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Forbidden - Admin access required
 *       400:
 *         description: Invalid request data
 *
 * /api/certificate/upload-logo:
 *   post:
 *     summary: Upload a logo for certificates
 *     description: Allows uploading a logo to be used in certificates.
 *     tags:
 *       - Certificate
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logoPath:
 *                   type: string
 *       400:
 *         description: No file uploaded
 */


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
