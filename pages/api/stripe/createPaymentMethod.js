import initStripe from "stripe";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("Unauthorized");
  }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      // card: req.cardElement,
      card: {
        number: "4242424242424242",
        exp_month: 5,
        exp_year: 2023,
        cvc: "314",
      },
    });

    res.send({
      paymentMethod,
    });
  } catch (err) {
    res.send(err);
  }
}
