import CartItem from "@/components/Cart/CartItem";
import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { useState } from "react";
export default function Cart({ setIsCartDrawerOpen }) {
  const [cookie, setCookie] = useCookies(["user"]);
  const { cart, totalCartPrice } = useCart();
  // import { cartOpen } from '$lib/stores/cartOpen';
  // import { authOpen } from '$lib/stores/authOpen';

  function openAuthModal() {
    // $authOpen = true;
    // $cartOpen = false;
    setIsCartDrawerOpen(false);
  }

  return (
    <div>
      {cart.length === 0 ? (
        <div>
          <h2>Your cart is empty</h2>
          <h2>Add items to get started</h2>
        </div>
      ) : (
        <div>
          <div>
            <h1 className="text-3xl">Your Order</h1>
            <h3>Bionicos And Juices Rios</h3>
          </div>
          <Link href={"/checkout"}>
            <a
              onClick={!cookie.user && openAuthModal}
              className="bg-primary my-4 rounded-3xl w-full px-4 py-2 flex justify-between"
            >
              <h3 className="text-white">Checkout</h3>
              <h3 className="text-white">{formatMoney(totalCartPrice)}</h3>
            </a>
          </Link>
          <hr />
          <div className="overflow-y-scroll h-full z-50">
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
  );
}
