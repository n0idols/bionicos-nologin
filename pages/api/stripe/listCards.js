import initStripe from "stripe";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  //   if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
  //     return res.status(401).send("Unauthorized");
  //   }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      req.body.customerId,
      { type: "card" }
    );

    res.send({
      paymentMethods,
    });
  } catch (err) {
    res.send(err);
  }
}
