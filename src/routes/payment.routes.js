const express = require("express");
const router = express.Router();
const { protect, checkRole } = require("../middlewares/auth.middleware");
const {
  processPayment,
} = require("../controllers/payment.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - paymentIntentId
 *         - email
 *         - amount
 *         - currency
 *         - status
 *       properties:
 *         paymentIntentId:
 *           type: string
 *           description: The unique ID of the payment intent (e.g., from Stripe)
 *         email:
 *           type: string
 *           description: The email of the student making the payment
 *         amount:
 *           type: number
 *           description: The amount paid in the transaction
 *         currency:
 *           type: string
 *           description: The currency used for the payment (e.g., USD)
 *         status:
 *           type: string
 *           description: The status of the payment (e.g., succeeded, failed)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the payment was created
 *       example:
 *         paymentIntentId: "pi_1GmWzV2eZvKYlo2CJy4g5J4A"
 *         email: "student@example.com"
 *         amount: 100
 *         currency: "USD"
 *         status: "succeeded"
 *         createdAt: "2025-03-22T14:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manage payments for students
 */

/**
 * @swagger
 * /api/payments/pay:
 *   post:
 *     summary: Process a payment for a student
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be paid
 *               paymentMethodId:
 *                 type: string
 *                 description: The payment method ID (e.g., from Stripe)
 *               email:
 *                 type: string
 *                 description: The email of the student making the payment
 *             required:
 *               - amount
 *               - paymentMethodId
 *               - email
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 paymentIntent:
 *                   type: object
 *                   description: Payment intent object returned by payment service
 *       400:
 *         description: Bad request, missing parameters
 *       500:
 *         description: Internal server error
 */


router.post("/pay", protect, checkRole("student"), processPayment);

module.exports = router;
