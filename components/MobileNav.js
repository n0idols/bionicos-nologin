import { FiHome, FiTag, FiBookOpen, FiUser } from "react-icons/fi";
import { GrCart } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import { useEffect, useState } from "react";

const icon = `text-gray-600 text-2xl`;
const iconActive = `text-primary  text-2xl`;

const navWrap = `fixed bottom-0 inset-x-0 bg-gray-200 flex md:hidden justify-between max-w-2xl mx-auto rounded-3xl z-50`;
const iconWrap = `w-full h-full p-4 text-center flex flex-col items-center text-xs`;

export default function MobileNav() {
  const router = useRouter();
  const { cart, toggleCart, totalCartPrice } = useCart();
  const [showCart, setShowCart] = useState(null);
  useEffect(() => {
    if (router.pathname === "/checkout") {
      setShowCart(false);
    }
    if (router.pathname !== "/checkout" && cart.length > 0) {
      setShowCart(true);
    }
  }, [router, cart.length]);

  function CartDiv() {
    return (
      <div className="indicator w-full ">
        <button
          aria-label="cart"
          onClick={toggleCart}
          // className="p-2 flex w-full justify-center items-center"
          className="btn btn-primary btn-lg w-full flex justify-between"
        >
          <h2>your order</h2>

          <span className="relative flex items-center mx-4">
            <div className="mr-4 text-gray-800">
              {formatMoney(totalCartPrice)}
            </div>
            <div className="indicator">
              <div className="indicator-item badge badge-secondary rounded-full ">
                {cart.length}
              </div>

              <span className="text-2xl">
                <GrCart />
              </span>
            </div>
          </span>
        </button>
      </div>
    );
  }
  return (
    <>
      {showCart && (
        <div className="w-full fixed bottom-20 md:hidden flex justify-center">
          <div className="sm:w-2/3 w-full flex px-2">
            <CartDiv />
          </div>
        </div>
      )}

      <div>
        <nav className={navWrap}>
          <Link href="/">
            <a className={iconWrap}>
              <FiHome className={router.pathname == "/" ? iconActive : icon} />
              Home
            </a>
          </Link>

          <Link href="/menu/specials">
            <a className={iconWrap}>
              <FiTag
                className={
                  router.pathname == "/menu/specials" ? iconActive : icon
                }
              />{" "}
              Specials
            </a>
          </Link>

          <Link href="/menu">
            <a className={iconWrap}>
              <FiBookOpen
                className={router.pathname == "/menu" ? iconActive : icon}
              />
              Menu
            </a>
          </Link>

          <Link href="/dashboard">
            <a className={iconWrap}>
              <FiUser
                className={router.pathname == "/dashboard" ? iconActive : icon}
              />
              Account
            </a>
          </Link>
        </nav>
      </div>
    </>
  );
}
