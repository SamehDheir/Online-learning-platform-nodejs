const express = require("express");
const {
  createGroupChat,
  addUserToGroup,
  getUserChats,
  createPrivateChat,
  removeUserFromGroup,
} = require("../controllers/chat.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the group chat
 *         isGroup:
 *           type: boolean
 *           description: Whether the chat is a group chat or private
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs participating in the chat
 *         admins:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who are admins of the group
 *         lastMessage:
 *           type: string
 *           description: The last message ID in the chat
 *
 * /chat/private:
 *   post:
 *     summary: Create a private chat
 *     description: Initiates a private chat between two users if it does not already exist.
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Private chat created successfully
 *       400:
 *         description: Chat already exists
 *
 * /chat/group:
 *   post:
 *     summary: Create a group chat
 *     description: Creates a new group chat with specified participants.
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Group chat created successfully
 *       400:
 *         description: Invalid input
 *
 * /chat/add-user:
 *   post:
 *     summary: Add a user to a group chat
 *     description: Adds a user to an existing group chat.
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: User already in the group
 *       404:
 *         description: Group not found
 *
 * /chat:
 *   get:
 *     summary: Get user chats
 *     description: Retrieves all chats the authenticated user is part of.
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved chats
 *       404:
 *         description: No chats found
 *
 * /chat/removeUser:
 *   post:
 *     summary: Remove a user from a group chat
 *     description: Removes a user from a group chat, deleting it if less than two users remain.
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *               userIdToRemove:
 *                 type: string
 *     responses:
 *       200:
 *         description: User removed successfully
 *       404:
 *         description: Chat not found
 *       403:
 *         description: Unauthorized to remove user
 */

router.post(
  "/private",
  protect,
  checkRole("instructor", "student"),
  createPrivateChat
);
router.post("/group", protect, checkRole("admin"), createGroupChat);
router.post("/add-user", protect, checkRole("instructor"), addUserToGroup);
router.get(
  "/",
  protect,
  checkRole("admin", "instructor", "student"),
  getUserChats
);
router.post(
  "/removeUser",
  protect,
  checkRole("admin", "instructor"),
  removeUserFromGroup
);
module.exports = router;
