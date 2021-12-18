import CartItem from "@/components/Cart/CartItem";
import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { useState } from "react";
export default function Cart() {
  const [cookie, setCookie] = useCookies(["user"]);
  const { cart, totalCartPrice, closeCart } = useCart();

  function openAuthModal() {
    // $authOpen = true;
    // $cartOpen = false;
    // setIsCartDrawerOpen(false);
    closeCart();
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
