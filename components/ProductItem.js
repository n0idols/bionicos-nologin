import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
export default function ProductItem({
  item: { id, name, alternateName, price },
}) {
  const { addToCart } = useCart();

  return (
    <div className="card lg:card-side bordered bg-white ">
      <div className="p-4 space-y-2">
        <h2 className="text-xl">{name}</h2>
        <p>{alternateName}</p>
        <p>{formatMoney(price)}</p>
      </div>
    </div>
  );
}
