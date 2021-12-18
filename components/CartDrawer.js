import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ReactDOM from "react-dom";
import CartItem from "./Cart/CartItem";

const overlay = `h-screen w-screen bg-black overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-60 flex`;
const container = `fixed top-0 right-0 h-screen w-full md:w-5/12 xl:w-4/12`;
const drawerstyle = ` h-screen flex flex-col shadow-2xl `;
const drawerheader = `shadow-lg bg-gray-200 flex justify-between items-center p-4`;
const drawerbody = `bg-white h-full px-4 overflow-y-auto`;
const drawerfooter = `bg-gray-200 shadow-lg p-2`;
const checkoutbtn = `btn btn-primary btn-lg my-4 rounded-3xl w-full px-4 py-2 flex justify-between`;

export default function CartDrawer({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const { cart, closeCart, totalCartPrice } = useCart();
  const [cookies, setCookie] = useCookies(["cart"]);
  const router = useRouter();
  useEffect(() => setIsBrowser(true));

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const onCheckout = () => {
    console.log(cart);
    setCookie("cart", JSON.stringify(cart), {
      path: "/",
    });
    console.log(cookies);
    closeCart();
    router.push("/checkout");
  };

  const drawerContent = show ? (
    <div className={overlay}>
      <div className={container}>
        <div className={drawerstyle}>
          <div className={drawerheader}>
            <div>
              <h1>Your Order</h1>
            </div>
            <div>
              <button
                onClick={handleClose}
                className="btn btn-circle btn-sm text-xl "
              >
                &times;
              </button>
            </div>
          </div>

          <div className={drawerbody}>
            {" "}
            <div>
              {cart.length === 0 ? (
                <div>
                  <h2>Your cart is empty</h2>
                  <h2>Add items to get started</h2>
                </div>
              ) : (
                <div>
                  <hr />
                  <div className="h-full z-50">
                    {cart.map((cartItem, index) => {
                      return (
                        <div key={index}>
                          <CartItem item={cartItem} index={index} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={drawerfooter}>
            <button
              onClick={onCheckout}
              className={checkoutbtn}
              disabled={cart.length == 0}
            >
              <h3 className="text-white">Checkout</h3>
              <h3 className="text-white">{formatMoney(totalCartPrice)}</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      drawerContent,
      document.getElementById("drawer-root")
    );
  } else {
    return null;
  }
}
