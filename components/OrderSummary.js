import formatMoney from "@/lib/formatMoney";
import { useCart } from "@/lib/cartState";
import Link from "next/link";
import CartItem from "./Cart/CartItem";
import Loading from "./icons/Loading";

export default function OrderSummary({ orderSummary }) {
  const { cart, setCart } = useCart();

  return (
    <div>
      <h1>Order Summary</h1>
      <div className="my-4">
        <h1>SUMMARY</h1>
        {cart.map((item, index) => (
          <div key={index}>
            <CartItem item={item} index={index} />
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <Link href="/menu">
          <a className="bg-gray-200 rounded-2xl px-4 py-1">+ Add more items</a>
        </Link>
      </div>
      <div>
        {!orderSummary ? (
          <Loading />
        ) : (
          <div>
            <div className="flex justify-between mt-4">
              <h4>Subtotal</h4>
              <h4>{formatMoney(orderSummary.subtotal)}</h4>
            </div>
            <div className="flex justify-between mt-4">
              <h4>Total</h4>
              <h4>{formatMoney(orderSummary.total)}</h4>
            </div>
            <div className="flex justify-between mt-4">
              <h4>Fee &amp; Estimated Tax</h4>
              <h4>{formatMoney(orderSummary.totalTaxAmount)}</h4>
            </div>
            <hr />
            <div className="flex justify-between mt-4">
              <h4>Total</h4>
              <h4>{formatMoney(orderSummary.total)}</h4>
            </div>
            <div className="flex justify-between mt-4 mb-8">
              <h4>Amount Due</h4>
              <h4>{formatMoney(orderSummary.total)}</h4>
            </div>
            <hr />
          </div>
        )}
      </div>
    </div>
  );
}
