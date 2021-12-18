const Clover = require("clover-ecomm-sdk");

let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

export default async function handler(req, res) {
  try {
    const data = await cloverInst.orders.create({
      currency: "usd",
      email: "sample.email@example.com",
      items: {
        amount: 1358,
        currency: "usd",
        description: "Lemon cupcake with blackberry frosting",
        quantity: 2,
        tax_rates: { name: "Sale", tax_rate_uuid: "{tax_uuid}" },
      },
    });
    res.status(200).json({
      body: data,
    });
  } catch (e) {
    res.status(404).json({
      error: e,
    });
  }
}
