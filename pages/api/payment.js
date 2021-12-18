// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const sdk = require("api")("@clover-platform/v3#650cgkrfewdyn");
export default async function handler(req, res) {
  const orderId = req.body.orderId;
  const token = req.body.token;
  const email = req.body.email;

  // const options = {
  // 	method: 'POST',
  // 	headers: {
  // 		Accept: 'application/json',
  // 		'Content-Type': 'application/json',
  // 		Authorization: import.meta.env.VITE_CLOVER_OAUTH
  // 	},
  // 	body: JSON.stringify({
  // 		ecomind: 'ecom',
  // 		amount,
  // 		currency: 'usd',
  // 		source: token,
  // 		receipt_email: email
  // 	})
  // };
  // const response = await axios.post('https://scl-sandbox.dev.clover.com/v1/charges', {
  // 	ecomind: 'ecom',
  // 	amount,
  // 	currency: 'usd',
  // 	source: token,
  // 	receipt_email: email
  // });
  // if (!response.ok) res.status(response.status).json({ result: await response.text() });
  // else res.status(response.status).json({ result: await response.json() });
  // const data = await sdk.CreateCharge({
  //   ecomind: "ecom",
  //   amount,
  //   currency: "usd",
  //   source: token,
  //   email,
  // });
  // res.status(200).json({
  //   body: data,
  // });
  try {
    sdk.auth("5c0d1520-d0b3-2f81-0740-1ec258b458fc");
    const data = await sdk.PostOrdersIdPay(
      {
        ecomind: "ecom",
        email: "a@gmail.com",
        source: token,
      },
      { orderId }
    );
    res.status(200).json({
      body: data,
    });
  } catch (e) {
    res.status(404).json({
      error: e,
    });
  }
}
