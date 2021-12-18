const { MERCH_ID } = require("../../../config");
const { MAIN_KEY } = require("../../../config");

const sdk = require("api")("@clover-platform/v3#j86pkx59yb6o");
export default async function handler(req, res) {
  const orderSummary = req.body.orderSummary;
  try {
    sdk.auth(MAIN_KEY);
    const data = await sdk["order.CreateAtomicOrder"](orderSummary, {
      mId: MERCH_ID,
    });
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error });
  }
}

//  const res = await fetch(
//    `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/atomic_order/orders`,
//    {
//      method: "POST",
//      headers: {
//        Authorization: `Bearer ${MAIN_KEY}`,
//      },
//      body: JSON.stringify(orderSummary),
//    }
//  );

//  if (!res.ok) throw Error();
//  const orderData = await res.json();
//  return [orderData.id, orderData.total];
