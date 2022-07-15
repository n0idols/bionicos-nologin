import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/lib/cartState";
import { GrCart } from "react-icons/gr";
import CartDrawer from "./CartDrawer";

export default function StandaloneHeader() {
  return (
    <>
      <div className="hidden standalone:flex -mt-10">
        <header className="fixed top-0 z-50 w-full">
          <div className=" shadow-lg bg-primary text-neutral-content py-6">
            {/* <div className="py-2 flex justify-center bg-red-800 text-gray-600">
              <Logo />
            </div> */}
          </div>
        </header>
      </div>
    </>
  );
}
