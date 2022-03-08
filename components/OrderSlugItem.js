import formatMoney from "@/lib/formatMoney";

export default function OrderSlugItem({ item, index }) {
  function calcItemNetPrice() {
    let sum = 0;
    item.modifications?.forEach((modification) => {
      sum += modification.amount;
    });
    sum += item.item.price;
    sum *= item.quantity;
    return formatMoney(sum);
  }
  return (
    <div>
      <div className="flex justify-between items-center m-4">
        <div className="flex items-center">
          <div className="rounded-full bg-base-300 h-8 w-8 flex items-center justify-center text-black">
            <h6 className="text-xs font-bold">{item.quantity}x</h6>
          </div>
          <div className="ml-2">
            <h4>{item.item.name}</h4>
            {item.modifications?.map((modification, i) => (
              <h6 key={i} className="text-gray-600 m-0 p-0 text-xs">
                {modification.name}
              </h6>
            ))}

            <h4 className="mt-1">{calcItemNetPrice()}</h4>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
