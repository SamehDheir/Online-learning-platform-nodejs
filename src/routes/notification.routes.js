const express = require("express");
const Notification = require("../models/notification.model");
const { protect, checkRole } = require("../middlewares/auth.middleware");
const {
  readNotification,
  markAllRead,
  getAllNotifications,
} = require("../controllers/notification.controller");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - message
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user receiving the notification
 *         message:
 *           type: string
 *           description: The notification message content
 *         read:
 *           type: boolean
 *           description: Whether the notification has been read or not
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the notification was created
 *       example:
 *         userId: 60d9bd8fa11b5b0c0e2b2f5a
 *         message: "🎉 Congratulations! You have completed the course: 605c72ef153207001f0f6c5"
 *         read: false
 *         createdAt: 2025-03-22T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage notifications for users
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/mark-read/{notificationId}:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read!"
 *       400:
 *         description: Notification ID is required
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read!"
 *       500:
 *         description: Internal server error
 */


router.get("/", protect,checkRole('student'), getAllNotifications);

router.put("/mark-read/:notificationId", protect,checkRole('student'), readNotification);

router.put("/mark-all-read", protect,checkRole('student'), markAllRead);

module.exports = router;
