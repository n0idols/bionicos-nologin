import initStripe from "stripe";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export default async function handler(req, res) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("Unauthorized");
  }
  const stripe = initStripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  try {
    const customer = await stripe.customers.create({
      name: req.body.record.username || req.body.record.full_name,
      email: req.body.record.email,
    });

    await supabaseServerClient({ req, res })
      .from("profiles")
      .update({
        stripe_customer: customer.id,
      })
      .eq("id", req.body.record.id);

    await supabaseServerClient({ req, res }).from("customers").insert({
      id: req.body.record.id,
      stripe_customer: customer.id,
    });

    res.send({
      customer: customer,
    });
  } catch (err) {
    res.send(err);
  }
}
