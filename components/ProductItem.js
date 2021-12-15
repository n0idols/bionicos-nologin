import formatMoney from "@/lib/formatMoney";
export default function ProductItem({ item: { name, alternateName, price } }) {
  return (
    <div className="card lg:card-side bordered">
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
