const calculateOrderAmount = (cartItems, couponOff) => {
  let total = 0;
  let discountedTotal = 0;
  let newTotal = 0;
  let plusTax = 1.1025;
  cartItems.map((value) => {
    let itemTotal = value.item.price;
    value.modifications?.forEach((modification) => {
      itemTotal += modification.amount;
    });
    itemTotal *= value.quantity;
    total += itemTotal;
  });

  discountedTotal = total * couponOff;
  newTotal = total * plusTax;
  const final = Math.round(newTotal);
  console.log(typeof final, "final", final);

  return final;
};

export default calculateOrderAmount;
