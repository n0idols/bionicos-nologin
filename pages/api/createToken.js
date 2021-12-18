const Clover = require("clover-ecomm-sdk");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

export default async function handler(req, res) {
  try {
    cloverInst.tokens
      .create({
        card: req.body.card,
        apiKey: API_KEY,
      })
      .then((tokenObj) => {
        res.send(tokenObj);
      })
      .catch((err) => {
        console.log("Getting error type in Token Test - ", err);
      });
  } catch (err) {
    res.send(err);
  }
}
