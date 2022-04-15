import initStripe from "stripe";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  // if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
  //   return res.status(401).send("You are not authorized");
  // }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);
  const { id, email } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: email,
    });

    await supabaseClient
      .from("profile")
      .update({
        stripe_customer: customer.id,
      })
      .eq("id", id);

    res.send({
      //   stripeCustomer: customer,
      message: `stripe customer created: ${customer.id}`,
    });
  } catch (err) {
    res.send(err);
  }
}
