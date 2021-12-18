const Clover = require("clover-ecomm-sdk");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

export default async function handler(req, res) {
  try {
    cloverInst.charges
      .create({
        source: req.body.source,
        amount: 2500,
        currency: "usd",
        capture: "true",
      })
      .then((chargeResponse) => {
        res.send(chargeResponse);
      })
      .catch((err) => {
        console.log("Getting error in Charge API - ", err);
      });
  } catch (err) {
    res.send(err);
  }
}
