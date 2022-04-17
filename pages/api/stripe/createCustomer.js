import initStripe from "stripe";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("You are not authorized");
  }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const customer = await stripe.customers.create({
      email: req.body.record.email,
    });

    await supabaseClient
      .from("profiles")
      .update({
        stripe_customer: customer.id,
      })
      .eq("id", req.body.record.id);

    res.send({
      customer: customer,
    });
  } catch (err) {
    res.send(err);
  }
}
