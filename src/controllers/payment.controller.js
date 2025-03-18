const paymentService = require("../services/payment.service");

exports.processPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethodId, email } = req.body; // إزالة `currency`

    console.log("Received Payment Request:", req.body); // التحقق من البيانات المستلمة

    const paymentIntent = await paymentService.createPayment(
      amount,
      paymentMethodId,
      email
    );

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Payment Error:", error);
    next(error);
  }
};
