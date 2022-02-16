import { getSession } from "next-auth/react";

const stripe = require("stripe")(`${process.env.NEXT_PRIVATE_STRIPE_KEY}`);

const calculateOrderAmount = (cart) => {
  let total = 0;
  let newTotal = 0;
  let plusTax = 1.1025;
  cart.forEach((value) => {
    let itemTotal = value.item.price;
    value.modifications?.forEach((modification) => {
      itemTotal += modification.amount;
    });
    itemTotal *= value.quantity;
    total += itemTotal;
  });

  newTotal = total * plusTax;
  const final = Math.round(newTotal);
  console.log(final);

  return final;
};

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log(session);

  if (!session) return res.status(401).send("Unauthorized");
  const { cart } = req.body;
  try {
    // const customer = await stripe.customers.create();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(cart),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.send(err);
  }
}
