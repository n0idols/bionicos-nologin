import CloverIframe from "@/components/CloverIframe/CloverIframe";
import CollectInfo from "@/components/CollectInfo";
import { MAIN_KEY, MERCH_ID } from "@/config/index";
import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cartState";
import { useCookies } from "react-cookie";
import Script from "next/script";
import Modal from "react-modal";
import CloverApp from "@/components/CloverApp";

export default function OrderPage() {
  const [cookie, setCookie] = useCookies(["user"]);
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [changePayment, setChangePayment] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState("");
  const [disableOrderBtn, setDisableOrderBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [token, setToken] = useState("");

  async function handlePlaceOrder() {
    const res = await fetch("/api/order", {
      method: "post",
      body: JSON.stringify({
        email,
        token,
        orderId,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) throw Error(await res.text());
    console.log(res.json());
    return await res.json();
  }

  function calcCartTotalPrice(cartToCalc) {
    let total = 0;
    cartToCalc.forEach((value) => {
      total += value.item.price;
      value.modifications.forEach((modification) => {
        total += modification.amount;
      });
    });
    setTotalCartPrice(total);
  }
  async function getOrderSummary() {
    const url = `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/atomic_order/checkouts`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAIN_KEY}`,
      },
      body: JSON.stringify({
        orderCart: {
          orderType: {
            id: "G36Q0HDWCWT1M",
          },

          lineItems: cart,
        },
      }),
    });
    if (res.ok) return await res.json();
    else throw Error(await res.text());
  }

  //   useEffect(() => {
  //     getOrderSummary()
  //       .then((data) => {
  //         console.log(data);
  //         setOrderSummary(data);
  //       })
  //       .catch((e) => {
  //         setOrderSummary({ subtotal: 0, total: 0, totalTaxAmount: 0 });
  //         alert("Error fetching order" + e);
  //       });
  //   }, []);

  async function makeOrder() {
    const res = await fetch(
      `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/atomic_order/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MAIN_KEY}`,
        },
        body: JSON.stringify(orderSummary),
      }
    );

    if (!res.ok) throw Error();
    const orderData = await res.json();
    return [orderData.id, orderData.total];
  }

  async function makeOrderPayRecord(orderId, orderAmount) {
    const res = await fetch(
      `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/orders/${orderId}/payments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MAIN_KEY}`,
        },
        body: JSON.stringify({ amount: orderAmount }),
      }
    );

    if (!res.ok) throw Error(await res.text());
    return res.json();
  }

  async function payForOrder(orderId, email) {
    const res = await fetch("/api/payment", {
      method: "post",
      body: JSON.stringify({
        email,
        token,
        orderId,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) throw Error(await res.text());
    console.log(res.json());
    return await res.json();
  }

  async function placeOrder() {
    let orderId = "";
    let orderAmount = "";
    setOrderInProgress(true);
    try {
      [orderId, orderAmount] = await makeOrder();
      console.log("before pay");
      await payForOrder(orderId, email);
      console.log("after pay");
      await makeOrderPayRecord(orderId, orderAmount, tenderId);
      router.push("/");
    } catch (e) {
      orderInProgress = false;
      alert(e);
    }
  }

  return (
    <div>
      <Script
        src="https://checkout.sandbox.dev.clover.com/sdk.js"
        strategy="beforeInteractive"
      />
      <CloverApp />
      <button onClick={handlePlaceOrder}>Place order</button>
      {/* <CloverIframe setIsModalOpen={setIsModalOpen} setToken={setToken} /> */}
    </div>
  );
}
