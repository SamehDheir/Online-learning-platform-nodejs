const paymentService = require("../services/payment.service");

exports.processPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethodId, email } = req.body; 

    console.log("Received Payment Request:", req.body); 
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
