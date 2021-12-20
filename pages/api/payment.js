// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const sdk = require("api")("@clover-platform/v3#650cgkrfewdyn");
export default async function handler(req, res) {
  const orderId = req.body.orderId;
  const token = req.body.token;
  const email = req.body.email;
  console.log({ orderId, token, email });
  try {
    sdk.auth("e2d4b1c7-5871-cf79-0f99-f774d69e1b70");
    const data = await sdk.PostOrdersIdPay(
      {
        ecomind: "ecom",
        email: email,
        source: token,
      },
      { orderId }
    );
    console.log({ data });
    res.status(200).json({
      body: data,
    });
  } catch (e) {
    res.status(404).json({
      error: e,
    });
  }
}
