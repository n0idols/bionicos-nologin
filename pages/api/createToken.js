const Clover = require("clover-ecomm-sdk");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

export default async function handler(req, res) {
  try {
    const token = await cloverInst.tokens.create({
      card: req.body.card,
      apiKey: API_KEY,
    });
    res.status(200).send(token);
  } catch (err) {
    res.error(500).send(err);
  }
}
