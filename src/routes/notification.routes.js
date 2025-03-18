const express = require("express");
const Notification = require("../models/notification.model");
const { protect, checkRole } = require("../middlewares/auth.middleware");
const {
  readNotification,
  markAllRead,
  getAllNotifications,
} = require("../controllers/notification.controller");

const router = express.Router();

// Fetch notifications to the user
router.get("/", protect,checkRole('student'), getAllNotifications);

router.put("/mark-read/:notificationId", protect,checkRole('student'), readNotification);

router.put("/mark-all-read", protect,checkRole('student'), markAllRead);

module.exports = router;
