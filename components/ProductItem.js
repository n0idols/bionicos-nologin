import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
export default function ProductItem({
  item: { id, name, alternateName, price },
}) {
  const { addToCart } = useCart();

  return (
    <div className="card lg:card-side bordered prose-sm prose-base">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{alternateName}</p>
        <p>{formatMoney(price)}</p>

        <div className="card-actions">
          <button className="btn btn-outline btn-accent">More info</button>
        </div>
      </div>
    </div>
  );
}
