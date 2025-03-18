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
