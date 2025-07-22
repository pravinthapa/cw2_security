import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/create-checkout-session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 500, // $5
            product_data: {
              name: "LifeLockr Premium Plan",
              description: "Extra document slots & emergency access",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?payment=cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe error" });
  }
};
