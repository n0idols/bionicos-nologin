import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo";
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/lib/authState";
import { useCart } from "@/lib/cartState";
import { GrCart } from "react-icons/gr";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const router = useRouter();
  const linkClasses = `btn btn-ghost btn-sm rounded-btn `;
  const activeClasses = `btn btn-primary btn-sm rounded-btn `;
  const { cart, show, toggleCart, closeCart } = useCart();
  const { user, logout } = useContext(AuthContext);

  function AdminLinks() {
    return (
      <>
        {" "}
        <Link href="/account/admin/orders">
          <a
            className={
              router.pathname == "/account/admin/orders"
                ? activeClasses
                : linkClasses
            }
          >
            All
          </a>
        </Link>
        <Link href="/account/admin/orders/pending">
          <a
            className={
              router.pathname == "/account/admin/orders/pending"
                ? activeClasses
                : linkClasses
            }
          >
            Pending
          </a>
        </Link>
        <Link href="/account/admin/orders/progress">
          <a
            className={
              router.pathname == "/account/admin/orders/progress"
                ? activeClasses
                : linkClasses
            }
          >
            In Progress
          </a>
        </Link>
        <Link href="/account/admin/orders/ready">
          <a
            className={
              router.pathname == "/account/admin/orders/ready"
                ? activeClasses
                : linkClasses
            }
          >
            Ready For Pickup
          </a>
        </Link>
      </>
    );
  }
  return (
    <>
      <CartDrawer show={show} onClose={closeCart} />
      {/* <AdminDrawer show={show} /> */}

      <header className="fixed top-0 z-50 w-full">
        <div className="navbar shadow-lg bg-base-100 text-neutral-content standalone:pt-4">
          <div className="px-2 mx-2 navbar-start">
            <Logo />
          </div>
          <div className="hidden px-2 mx-2 navbar-center md:flex text-gray-600">
            <div className="flex items-center">
              {user?.role.type === "merchant" ? (
                <AdminLinks />
              ) : (
                <>
                  {" "}
                  <Link href="/">
                    <a
                      className={
                        router.pathname == "/" ? activeClasses : linkClasses
                      }
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/menu/specials">
                    <a
                      className={
                        router.pathname == "/menu/specials"
                          ? activeClasses
                          : linkClasses
                      }
                    >
                      Specials
                    </a>
                  </Link>
                  <Link href="/menu">
                    <a
                      className={
                        router.pathname == "/menu" ? activeClasses : linkClasses
                      }
                    >
                      Menu
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="navbar-end space-x-4">
            {user?.role.type !== "merchant" ? (
              <div>
                {user ? (
                  <div className="lg:flex hidden items-center">
                    <Link href="/account/dashboard">
                      <a className="btn btn-ghost btn-sm  text-gray-600">
                        Account
                      </a>
                    </Link>
                  </div>
                ) : (
                  <Link href="/account/login">
                    <a className="btn btn-ghost btn-sm  text-gray-600">
                      Log In
                    </a>
                  </Link>
                )}
              </div>
            ) : (
              <></>
            )}
            {user?.role.type !== "merchant" ? (
              <button aria-label="cart" onClick={toggleCart} className="px-4">
                <span className="relative inline-block ml-2">
                  <div className="indicator">
                    {cart.length > 0 && (
                      <div className="indicator-item badge badge-primary rounded-full">
                        {cart.length}
                      </div>
                    )}

                    <span className="text-2xl text-gray-600">
                      <GrCart />
                    </span>
                  </div>
                </span>
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
