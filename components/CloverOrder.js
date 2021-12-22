import { useState } from "react";

export default function CloverOrder({ orderSummary }) {
  const [token, setToken] = useState(null);
  const [card_expiry, setCardExpiry] = useState("04/2022");
  const [orderId, setOrderId] = useState(null);
  const [card, setCard] = useState({
    number: "4005562231212123",
    brand: "VISA",
    cvv: "123",
    exp_month: "04",
    exp_year: "2022",
    address_zip: "90001",
  });

  const [orderInProgress, setOrderInProgress] = useState(false);

  function generateMask(cardNumber) {
    const last4Digits = cardNumber.slice(-4);
    return last4Digits.padStart(cardNumber.length, "*");
  }
  // Create token
  async function callCreateTokenAPI() {
    const data = JSON.stringify({ card });
    const response = await fetch("/api/createToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const resp = await response.json();
    if (response.status !== 200) {
      throw Error(resp.message);
    }
    console.log(`Token Id is - ${resp.id}`);
    setToken(resp.id);
    return resp;
  }

  //Create order from orderSummary object, set order id into state
  async function callCreateOrderAPI() {
    const response = await fetch(`/api/order/makeOrder`, {
      method: "POST",
      body: JSON.stringify({ orderSummary }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (!response.ok) throw Error();
    const resp = await response.json();
    setOrderId(resp.data.id);
    return resp;
  }

  async function callPayOrderAPI() {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        token,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) throw Error(await res.text());
    console.log("calling payorder api with order id and token...");
    console.log(res.json());
    return await res.json();
  }

  async function placeCompleteOrder() {
    setOrderInProgress(true);
    // setOrder(data);

    // alert(order);

    try {
      await callCreateOrderAPI();
      const idString = JSON.stringify({ orderId });
      console.log(idString);
      console.log(orderId);
      console.log(`submitting order ${orderId}, not paid yet`);
      await callPayOrderAPI(orderId, token);
      console.log("submitted payment successfully");
    } catch (e) {
      setOrderInProgress(false);
      alert(e);
    }
  }

  return (
    <div>
      <button className="btn" onClick={callCreateTokenAPI}>
        Generate Token
      </button>
      Card token: {token}
      <button className="btn" onClick={placeCompleteOrder}>
        Pay for Order
      </button>
      {orderInProgress ? <h1>Submitted order..</h1> : <h1>done</h1>}
    </div>
  );
}
