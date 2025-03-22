const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - chatId
 *         - sender
 *         - message
 *       properties:
 *         chatId:
 *           type: string
 *           description: The ID of the chat
 *         sender:
 *           type: string
 *           description: The ID of the sender
 *         message:
 *           type: string
 *           description: The message content
 *         isRead:
 *           type: boolean
 *           description: Whether the message has been read
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was created
 *       example:
 *         chatId: 605c72ef153207001f0f6c5
 *         sender: 60d9bd8fa11b5b0c0e2b2f5a
 *         message: "Hello, how are you?"
 *         isRead: false
 *         createdAt: 2025-03-22T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Send and retrieve messages in a chat
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a new message in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat
 *                 example: 605c72ef153207001f0f6c5
 *               message:
 *                 type: string
 *                 description: The message content
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized (sender not found)
 *       403:
 *         description: You are not a participant in this chat
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     summary: Get all messages in a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chat
 *     responses:
 *       200:
 *         description: List of messages in the chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */


router.post("/", protect, sendMessage);
router.get("/:chatId",protect, getMessages);

module.exports = router;

module.exports = router;
