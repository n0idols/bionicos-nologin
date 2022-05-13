import initStripe from "stripe";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  //   if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
  //     return res.status(401).send("Unauthorized");
  //   }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const setupIntent = await stripe.setupIntents.create({
      //   customer: "cus_Lg2rZekSFSHPT6",

      customer: req.body.customerId,
      payment_method_types: ["card"],
      usage: "on_session",
    });

    res.send({
      setupIntent,
    });
  } catch (err) {
    res.send(err);
  }
}
