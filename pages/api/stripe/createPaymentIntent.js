const stripe = require("stripe")(
  "sk_test_51JxjYrJpULzH3yu6Vy486PK87ceDaxQa7bfXUwSP0UiCfbpB8XFnAmpXziOx6U1HcRnQPfwQCHPgSTXoUoXxAsTs00LcEiUEeZ"
);

const calculateOrderAmount = (cart) => {
  let total = 0;
  cart.forEach((value) => {
    total += value.item.price;
    value.modifications.forEach((modification) => {
      total += modification.amount;
    });
  });

  return total;
};
export default async function handler(req, res) {
  const { cart } = req.body;
  try {
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
