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
import parseCookies from "@/lib/cookie";

export default function Checkout({ orderSummary }) {
  const [cookies] = useCookies(["user"]);
  const router = useRouter();
  const { cart, emptyCart } = useCart();
  const [changePayment, setChangePayment] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState("");
  const [disableOrderBtn, setDisableOrderBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false);
  // const [orderSummary, setOrderSummary] = useState(null);
  const [token, setToken] = useState("");
  //   cartOpen.set(false);
  //   let cardEntered =
  //     email.length > 0 &&
  //     cardNumber.length > 0 &&
  //     expMonth.length > 0 &&
  //     expYear.length > 0 &&
  //     cvv.length > 0;

  // async function getOrderSummary() {
  //   const url = `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/atomic_order/checkouts`;
  //   const res = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${MAIN_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       orderCart: {
  //         orderType: {
  //           id: "G36Q0HDWCWT1M",
  //         },

  //         lineItems: cart,
  //       },
  //     }),
  //   });
  //   if (res.ok) return await res.json();
  //   else throw Error(await res.text());
  // }

  // useEffect(() => {
  //   getOrderSummary()
  //     .then((data) => {
  //       console.log(data);
  //       setOrderSummary(data);
  //     })
  //     .catch((e) => {
  //       setOrderSummary({ subtotal: 0, total: 0, totalTaxAmount: 0 });
  //       alert("Error fetching order" + e);
  //     });
  // }, []);
  async function makeOrder() {
    const res = await fetch(`/api/order/makeOrder`, {
      method: "POST",
      body: JSON.stringify({ orderSummary }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const { orderId } = await res.json();
    return orderId;
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
      method: "POST",
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
    return await res.json();
  }

  async function placeOrder() {
    setOrderInProgress(true);
    try {
      const orderId = await makeOrder();
      console.log("before pay", orderId);
      await payForOrder(orderId, email);
      emptyCart();
      console.log("after pay");
      // await makeOrderPayRecord(orderId, orderAmount, tenderId);
      router.push("/");
    } catch (e) {
      setOrderInProgress(false);
      alert(e);
    }
  }
  useEffect(() => {
    console.log(cookies);
  }, [cookies.user]);
  console.log(cookies, disableOrderBtn, token);

  return (
    <div>
      <Script
        src="https://checkout.sandbox.dev.clover.com/sdk.js"
        strategy="beforeInteractive"
      />
      <a href="/menu/order" className="mb-4">
        <h1 className="text-red-600 mb-4">Back to Menu</h1>
      </a>
      <div className="flex flex-col space-y-8 md:space-y-0 md:space-x-12 md:flex-row">
        <div className="md:w-1/2">
          <CollectInfo
            email={email}
            userId={cookies.user}
            setDisableOrderBtn={setDisableOrderBtn}
            setEmail={setEmail}
          />
        </div>
        <div className="md:w-1/2">
          <div>
            <h1>PAYMENT</h1>
            <div className="flex justify-between">
              {!changePayment && (
                <button onClick={() => setChangePayment(true)}>
                  <h4 className="text-red-600">Change</h4>
                </button>
              )}
            </div>
            <div>
              {changePayment ? (
                <div>
                  <input
                    className="w-3/12 my-4 mr-8"
                    type="text"
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (paymentInfo.length === 0)
                        alert("Field can not be empty");
                      else setChangePayment(false);
                    }}
                  >
                    <h4 className="text-red-600">Save</h4>
                  </button>
                </div>
              ) : (
                <h4 className="text-gray-400 my-4">{paymentInfo}</h4>
              )}
            </div>
          </div>
          <hr />
          <div className="my-4">
            <h1>SUMMARY</h1>
            {cart.map((item, index) => (
              <div key={index}>
                <CartItem item={item} index={index} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mb-4">
            <a href="/menu/order" className="bg-gray-200 rounded-2xl px-4 py-1">
              <h4>+ Add more items</h4>
            </a>
          </div>
          <hr />
          <div>
            {!orderSummary ? (
              <Loading />
            ) : (
              <div>
                <div className="flex justify-between mt-4">
                  <h4>Subtotal</h4>
                  <h4>{formatMoney(orderSummary.subtotal)}</h4>
                </div>
                <div className="flex justify-between mt-4">
                  <h4>Total</h4>
                  <h4>{formatMoney(orderSummary.total)}</h4>
                </div>
                <div className="flex justify-between mt-4">
                  <h4>Fee &amp; Estimated Tax</h4>
                  <h4>{formatMoney(orderSummary.totalTaxAmount)}</h4>
                </div>
                <hr />
                <div className="flex justify-between mt-4">
                  <h4>Total</h4>
                  <h4>{formatMoney(orderSummary.total)}</h4>
                </div>
                <div className="flex justify-between mt-4 mb-8">
                  <h4>Amount Due</h4>
                  <h4>{formatMoney(orderSummary.total)}</h4>
                </div>
                <hr />
                {/* <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  style={{
                    content: {
                      top: "50%",
                      left: "50%",
                      right: "auto",
                      height: "90%",
                      bottom: "auto",
                      marginRight: "-50%",
                      transform: "translate(-50%, -50%)",
                      overflowY: "scroll",
                    },
                  }}
                > */}
                <CloverIframe
                  setIsModalOpen={setIsModalOpen}
                  setToken={setToken}
                />
                {/* </Modal>
                <button
                  className="m-4 bg-gray-600 rounded p-2 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Click to enter card info
                </button> */}
              </div>
            )}
            {cart.length !== 0 && (
              <button
                onClick={placeOrder}
                disabled={!cookies.user || disableOrderBtn || !token}
                className="btn btn-block btn bg-brand-red glass text-white hover:bg-brand-redhover"
              >
                {!orderInProgress ? (
                  <h3 className="text-white">Place Order</h3>
                ) : (
                  <Loading />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context.req);
  const url = `https://apisandbox.dev.clover.com/v3/merchants/${MERCH_ID}/atomic_order/checkouts`;
  try {
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

          lineItems: JSON.parse(cookies.cart),
        },
      }),
    });

    if (res.ok) return { props: { orderSummary: await res.json() } };
    return {
      props: { orderSummary: { subtotal: 0, total: 0, totalTaxAmount: 0 } },
    };
  } catch (e) {
    return {
      props: { orderSummary: { subtotal: 0, total: 0, totalTaxAmount: 0 } },
    };
  }
}
