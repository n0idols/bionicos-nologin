import Link from "next/link";
import Drawer from "./Drawer";
import Logo from "./Logo";

export default function Header() {
  return (
    <header>
      <div className="navbar mb-2 shadow-lg bg-gray-200 text-neutral-content rounded-box">
        <div className="px-2 mx-2 navbar-start">
          <Logo />
        </div>
        <div className="hidden px-2 mx-2 navbar-center lg:flex text-gray-600">
          <div className="flex items-center space-x-4">
            <Link href="/menu">
              <a className="btn btn-ghost btn-glass btn-sm rounded-btn">Home</a>
            </Link>

            <Link href="/contact">
              <a className="btn btn-ghost btn-sm rounded-btn">Contact</a>
            </Link>

            <Link href="/menu/specials">
              <a className="btn btn-ghost btn-sm rounded-btn">Specials</a>
            </Link>
            <Link href="/menu">
              <a className="btn btn-ghost btn-sm rounded-btn">Menu</a>
            </Link>
          </div>
        </div>
        <div className="navbar-end space-x-4">
          <button className="btn btn-ghost text-gray-600">Account</button>
          <button className="btn btn-ghost text-gray-600">Cart</button>
        </div>
      </div>
    </header>
  );
}
