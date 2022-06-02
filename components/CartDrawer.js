import { useState, useEffect } from "react";

import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";

import { useRouter } from "next/router";
import ReactDOM from "react-dom";
import CartItem from "./Cart/CartItem";
import Logo from "./Logo";
// import useOnClickOutsideRef from "@/lib/onClickOutside";

const overlay = `h-screen w-screen bg-black overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-60 flex`;
const container = `fixed top-0 right-0 h-screen w-full md:w-5/12 xl:w-4/12`;
const drawerstyle = ` h-screen flex flex-col shadow-2xl `;
const drawerheader = `shadow-lg bg-gray-200 flex justify-between items-center p-4`;
const drawerbody = `bg-white h-full px-4 overflow-y-auto`;
const drawerfooter = `bg-gray-200 shadow-lg px-2 pt-2 `;
const checkoutbtnDesk = `hidden md:flex btn btn-primary btn-lg my-4  w-full py-2  justify-between`;
const checkoutbtn = `md:hidden btn btn-primary btn-lg my-4  w-full py-2 flex justify-between`;

export default function CartDrawer({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const { cart, closeCart, totalCartPrice, emptyCart } = useCart();

  // const modalRef = useOnClickOutsideRef(() => alert("hey"));

  const router = useRouter();
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const onMenuChange = () => {
    closeCart();
    router.push("/menu");
  };

  const onCheckout = () => {
    // if (!user) {
    //   alert("Please sign up to place an order");
    //   router.push("/account/signup");
    // }
    closeCart();

    router.push("/checkout");
  };

  const drawerContent = show ? (
    <div className={overlay}>
      <div className={container}>
        <div className={drawerstyle}>
          <div className={drawerheader}>
            <h1>Your Order</h1>

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
            <button
              onClick={onCheckout}
              className={checkoutbtnDesk}
              disabled={cart.length == 0}
            >
              <h3>Continue</h3>
              <h3>{formatMoney(totalCartPrice)}</h3>
            </button>
            <div>
              {cart.length === 0 ? (
                <div className="space-y-4">
                  <h2>Your cart is empty!</h2>

                  <button className="btn" onClick={onMenuChange}>
                    add items
                  </button>
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
              <h3>Continue</h3>
              <h3>{formatMoney(totalCartPrice)}</h3>
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
