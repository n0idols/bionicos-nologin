import Stripe from "stripe";
import { buffer } from "micro";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";
//turn off body parser for this particular api route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.NEXT_PRIVATE_STRIPE_KEY);

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

    let event;

    try {
      if (!sig || !webhookSecret) return;

      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (error) {
      console.log(`Webhook Error: ${error.message}`);

      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("event", event);

    res.status(200).send();
  }
}
