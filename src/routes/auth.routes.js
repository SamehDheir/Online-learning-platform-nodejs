const express = require("express");
const {
  register,
  login,
  sendResetCode,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password for the user account
 *         role:
 *           type: string
 *           enum: ["admin", "instructor", "student"]
 *           default: "student"
 *         isActive:
 *           type: boolean
 *           description: The active status of the user account
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 *         password: "password123"
 *         role: "student"
 *         isActive: true
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register with a username, email, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The user data for registration
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid input data or user already exists
 *     security: []
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Allows a user to log in with their email and password and receive a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *     security: []
 */

router.post("/register", register);
router.post("/login", login);
router.post("/send-reset-code", protect, sendResetCode);
// router.post("/verify-reset-code", protect, verifyResetCode);
router.post("/reset-password", protect, resetPassword);

module.exports = router;
