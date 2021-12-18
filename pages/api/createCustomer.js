const Clover = require("clover-ecomm-sdk");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

export default async function handler(req, res) {
  try {
    cloverInst.customers
      .create({
        source: req.body.source,
        email: req.body.email,
      })
      .then((customerObj) => {
        res.send(customerObj);
      })
      .catch((err) => {
        console.log("Getting error in Customer Creation - ", err);
      });
  } catch (err) {
    res.send(err);
  }
}
