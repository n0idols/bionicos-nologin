import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/lib/cartState";
import { GrCart } from "react-icons/gr";
import CartDrawer from "./CartDrawer";

export default function Header({ user }) {
  const router = useRouter();
  const linkClasses = `btn btn-ghost btn-sm rounded-btn text-gray-600 `;
  const activeClasses = `btn btn-primary btn-sm rounded-btn  `;
  const cartBadge = `indicator-item badge badge-primary rounded-full `;
  const { cart, show, toggleCart, closeCart } = useCart();

  function CartDiv() {
    return (
      <div className="indicator">
        <button aria-label="cart" onClick={toggleCart} className="px-4">
          <span className="relative inline-block ml-2">
            <div className="indicator">
              {cart.length > 0 && (
                <div className={cartBadge}>{cart.length}</div>
              )}
              <span className="text-2xl text-gray-600">
                <GrCart />
              </span>
            </div>
          </span>
        </button>
      </div>
    );
  }
  function UserLinks() {
    return (
      <>
        <Link href="/">
          <a className={router.pathname == "/" ? activeClasses : linkClasses}>
            Home
          </a>
        </Link>
        <Link href="/menu/specials">
          <a
            className={
              router.pathname == "/menu/specials" ? activeClasses : linkClasses
            }
          >
            Specials
          </a>
        </Link>
        <Link href="/menu">
          <a
            className={router.pathname == "/menu" ? activeClasses : linkClasses}
          >
            Menu
          </a>
        </Link>
      </>
    );
  }

  return (
    <>
      <CartDrawer show={show} onClose={closeCart} />
      <div className="hidden md:flex">
        <header className="fixed top-0 z-50 w-full">
          <div className="navbar shadow-lg bg-white text-neutral-content standalone:pt-4">
            <div className="px-2 mx-2 navbar-start">
              <Logo />
            </div>
            <div className="hidden px-2 mx-2 navbar-center md:flex text-gray-600">
              <div className="flex items-center">
                <UserLinks />
              </div>
            </div>
            <div className="navbar-end space-x-4">
              <div className="flex">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <a className={linkClasses}>My Account</a>
                    </Link>
                    <CartDiv />
                  </>
                ) : (
                  <>
                    <Link href="/signin">
                      <a className={linkClasses}>Account</a>
                    </Link>
                    <CartDiv />
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
