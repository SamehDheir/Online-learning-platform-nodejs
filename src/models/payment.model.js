const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
