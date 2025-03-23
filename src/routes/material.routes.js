const express = require("express");
const upload = require("../services/upload.service");
const {
  uploadMaterial,
  getMaterialsByCourse,
  deleteMaterial,
} = require("../controllers/material.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - courseId
 *         - instructorId
 *         - fileName
 *         - fileUrl
 *       properties:
 *         courseId:
 *           type: string
 *           description: The ID of the course
 *         instructorId:
 *           type: string
 *           description: The ID of the instructor
 *         fileName:
 *           type: string
 *           description: The name of the uploaded file
 *         fileUrl:
 *           type: string
 *           description: The URL where the file can be accessed
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the file was uploaded
 *       example:
 *         courseId: 605c72ef153207001f0f6c5
 *         instructorId: 60d9bd8fa11b5b0c0e2b2f5a
 *         fileName: example.pdf
 *         fileUrl: /uploads/materials/example.pdf
 *         uploadedAt: 2025-03-22T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Upload, retrieve, and delete materials for courses
 */

/**
 * @swagger
 * /api/materials/upload:
 *   post:
 *     summary: Upload a new material (file) for a course
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course
 *                 example: 605c72ef153207001f0f6c5
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *       400:
 *         description: No file uploaded or course ID missing
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/materials/{courseId}:
 *   get:
 *     summary: Get all materials for a specific course
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: List of materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       404:
 *         description: No materials found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete a material by its ID
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the material
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */


router.post(
  "/upload",
  protect,
  checkRole("instructor"),
  upload.single("file"),
  uploadMaterial
);

router.get("/:courseId", protect, getMaterialsByCourse);

router.delete("/:id", protect, checkRole("instructor"), deleteMaterial);

module.exports = router;
