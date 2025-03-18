const express = require("express");
const router = express.Router();
const { protect, checkRole } = require("../middlewares/auth.middleware");
const {
  processPayment,
} = require("../controllers/payment.controller");

router.post("/pay", protect, checkRole("student"), processPayment);

module.exports = router;
