const calculateTax = (cart) => {
  let total = 0;
  let taxTotal = 0;

  cart.forEach((value) => {
    let itemTotal = value.item.price;
    value.modifications.forEach((modification) => {
      itemTotal += modification.amount;
    });
    itemTotal *= value.quantity;
    total += itemTotal;
  });

  // discountedTotal = Math.round(total - total * coupon);
  taxTotal = total * 0.1025;
  const final = Math.round(taxTotal);
  return final;
};

const calculateSubAmount = (cart) => {
  let total = 0;
  cart.forEach((value) => {
    let itemTotal = value.item.price;
    value.modifications.forEach((modification) => {
      itemTotal += modification.amount;
    });
    itemTotal *= value.quantity;
    total += itemTotal;
  });

  const final = Math.round(total);

  return final;
};

const calculateStripeTotal = (cart) => {
  let total = 0;
  let newTotal = 0;
  let plusTax = 1.1025;
  cart.map((value) => {
    let itemTotal = value.item.price;
    value.modifications?.forEach((modification) => {
      itemTotal += modification.amount;
    });
    itemTotal *= value.quantity;
    total += itemTotal;
  });

  newTotal = total * plusTax;
  const final = Math.round(newTotal);
  console.log(typeof final, "final from stripe total", final);

  return final;
};

export { calculateTax, calculateSubAmount, calculateStripeTotal };
