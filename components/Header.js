import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo";
import { useState } from "react";
import Drawer from "@/components/Drawer";
import Cart from "@/components/Cart/Cart";
import { AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const linkClasses = `btn btn-ghost btn-sm rounded-btn hover:btn-primary`;
  const activeClasses = `btn btn-primary btn-sm rounded-btn `;
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {isCartDrawerOpen && (
          <Drawer closeDrawer={() => setIsCartDrawerOpen(false)}>
            <Cart setIsCartDrawerOpen={setIsCartDrawerOpen} />
          </Drawer>
        )}
      </AnimatePresence>
      <header>
        <div className="navbar mb-2 shadow-lg bg-gray-200 text-neutral-content rounded-box">
          <div className="px-2 mx-2 navbar-start">
            <Logo />
          </div>
          <div className="hidden px-2 mx-2 navbar-center lg:flex text-gray-600">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <a
                  className={
                    router.pathname == "/" ? activeClasses : linkClasses
                  }
                >
                  Home
                </a>
              </Link>

              <Link href="/contact">
                <a
                  className={
                    router.pathname == "/contact" ? activeClasses : linkClasses
                  }
                >
                  Contact
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
            </div>
          </div>
          <div className="navbar-end space-x-4">
            <Link href="/account">
              <a className="btn btn-ghost text-gray-600">Account</a>
            </Link>
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="btn btn-ghost text-gray-600"
            >
              Cart
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
