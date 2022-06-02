import CartItem from "@/components/Cart/CartItem";
import { useCart } from "@/lib/cartState";

export default function Cart() {
  const { cart } = useCart();

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
