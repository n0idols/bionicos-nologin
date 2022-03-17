import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo";

import { useCart } from "@/lib/cartState";
import { GrCart } from "react-icons/gr";
import CartDrawer from "./CartDrawer";
import { useUser, User } from "@supabase/supabase-auth-helpers/react";
import { useEffect, useState } from "react";
export default function TempHeader({ user, admin }) {
  const router = useRouter();
  const linkClasses = `btn btn-ghost btn-sm rounded-btn text-gray-600 `;
  const activeClasses = `btn btn-primary btn-sm rounded-btn text-white `;
  const { cart, show, toggleCart, closeCart } = useCart();

  const [sudo, setSudo] = useState(null);

  function CartDiv() {
    return (
      <div className="indicator">
        <button aria-label="cart" onClick={toggleCart} className="px-4">
          <span className="relative inline-block ml-2">
            <div className="indicator">
              {cart.length > 0 && (
                <div className="indicator-item badge badge-primary rounded-full text-white">
                  {cart.length}
                </div>
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

  function AdminLinks() {
    return (
      <>
        {" "}
        {/* <Link href="/account/admin/orders/progress">
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
        </Link> */}
        {/* <Link href="/account/admin/orders/completed">
          <a
            className={
              router.pathname == "/account/admin/orders/completed"
                ? activeClasses
                : linkClasses
            }
          >
            Completed
          </a>
        </Link> */}
        <Link href="/account/admin/orders">
          <a
            className={
              router.pathname == "/account/admin/orders"
                ? activeClasses
                : linkClasses
            }
          >
            All Orders
          </a>
        </Link>
      </>
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
      {/* <AdminDrawer show={show} /> */}
      <header className="fixed top-0 z-50 w-full">
        <div className="navbar shadow-lg bg-white text-neutral-content standalone:pt-4">
          <div className="px-2 mx-2 navbar-start">
            <Logo admin={admin} />
          </div>
          <div className="hidden px-2 mx-2 navbar-center md:flex text-gray-600">
            <div className="flex items-center">
              {admin ? <AdminLinks /> : <UserLinks />}
            </div>
          </div>
          <div className="navbar-end space-x-4">
            {admin ? (
              <>
                {" "}
                {/* <Link href="/account/admin/customers">
                  <a className={linkClasses}>customers</a>
                </Link> */}
                <Link href="/account/admin/orders/">
                  <a className={linkClasses}>Orders</a>
                </Link>
              </>
            ) : (
              <div className="flex">
                {user ? (
                  <>
                    {" "}
                    <Link href="/dashboard">
                      <a className={linkClasses}>My Account</a>
                    </Link>
                    <CartDiv />
                  </>
                ) : (
                  <>
                    {" "}
                    <Link href="/signin">
                      <a className={linkClasses}>Account</a>
                    </Link>
                    <CartDiv />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
