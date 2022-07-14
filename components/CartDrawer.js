import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";

import { useRouter } from "next/router";
import ReactDOM from "react-dom";
import CartItem from "./Cart/CartItem";
import Logo from "./Logo";
import Overlay from "./Overlay";
// import useOnClickOutsideRef from "@/lib/onClickOutside";

const overlay = `h-screen w-screen bg-black bg-opacity-80 overflow-x-hidden overflow-y-auto fixed inset-0 z-50  flex`;
const container = `fixed top-0 right-0 h-screen w-full md:w-5/12 xl:w-4/12`;
const drawerstyle = ` h-screen flex flex-col shadow-2xl `;
const drawerheader = `shadow-lg bg-gray-200 flex justify-between items-center p-4`;
const drawerbody = `bg-white h-full px-4 overflow-y-auto`;
const drawerfooter = `bg-white px-2 pb-20`;
const checkoutbtnDesk = `hidden md:flex btn btn-primary  my-4 w-full py-2 justify-between`;
const checkoutbtn = `md:hidden btn btn-primary  my-4  w-full py-2 flex justify-between `;

export default function CartDrawer({ show, onClose }) {
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

  const dropIn = {
    hidden: {
      y: "20%",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "20%",
      opacity: 0,
    },
  };

  const slideIn = {
    hidden: {
      x: "20%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      x: "20%",
      opacity: 0,
    },
  };
  const drawerContent = show ? (
    // <div onClick={() => onClose()} className={overlay}>
    <Overlay onClick={onClose}>
      <motion.div
        variants={slideIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={container}
      >
        <div className={drawerstyle}>
          <div className={drawerheader}>
            <h1>Your Order</h1>

            <div>
              <button
                onClick={handleClose}
                className="btn btn-circle btn-sm text-xl"
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
              <h3>Checkout</h3>
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
              <h3>Checkout</h3>
              <h3>{formatMoney(totalCartPrice)}</h3>
            </button>
          </div>
        </div>
      </motion.div>
    </Overlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      <AnimatePresence
        exitBeforeEnter={true}
        initial={false}
        onExitComplete={() => null}
      >
        {drawerContent}
      </AnimatePresence>,
      document.getElementById("drawer-root")
    );
  } else {
    return null;
  }
}
