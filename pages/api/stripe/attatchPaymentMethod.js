import initStripe from "stripe";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  //   if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
  //     return res.status(401).send("Unauthorized");
  //   }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const confirmPaymentMethod = await stripe.paymentMethods.attach(
      req.body.paymentMethod,
      {
        customer: req.body.customerId,
      }
    );

    res.send({
      confirmPaymentMethod,
    });
  } catch (err) {
    res.send(err);
  }
}
