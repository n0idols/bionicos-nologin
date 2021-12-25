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
// const chargeCustomer = async (customerId) => {
//   // Lookup the payment methods available for the customer
//   const paymentMethods = await stripe.paymentMethods.list({
//     customer: customerId,
//     type: "card",
//   });
//   try {
//     // Charge the customer and payment method immediately
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 1099,
//       currency: "eur",
//       customer: customerId,
//       payment_method: paymentMethods.data[0].id,
//       off_session: true,
//       confirm: true,
//     });
//   } catch (err) {
//     // Error code will be authentication_required if authentication is needed
//     console.log("Error code is: ", err.code);
//     const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
//     console.log("PI retrieved: ", paymentIntentRetrieved.id);
//   }
// };
export default async function handler(req, res) {
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
