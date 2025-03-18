const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (amount, paymentMethodId, email) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // يمنع طرق الدفع التي تتطلب إعادة توجيه
      },
      receipt_email: email,
    });

    // await stripe.paymentIntents.update(paymentIntent.id, {
    //   receipt_email: email,
    // });
    return paymentIntent;
  } catch (error) {
    console.error("Stripe Error:", error);
    throw error;
  }
};
