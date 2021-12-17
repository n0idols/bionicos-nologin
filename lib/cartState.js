import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider. We weill store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  // Closed cart by default
  const [show, toggleShow] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  function remFromCart(index) {
    if (confirm("Are you sure you want to remove this item?")) {
      const tempCart = [...cart];
      tempCart.splice(index, 1);
      setCart(tempCart);
      calcCartTotalPrice(tempCart);
    }
  }
  function addToCart(item, modifications) {
    const tempCart = [
      ...cart,
      {
        item,
        modifications,
      },
    ];
    setCart(tempCart);
    calcCartTotalPrice(tempCart);
  }

  function calcCartTotalPrice(cartToCalc) {
    let total = 0;
    cartToCalc.forEach((value) => {
      total += value.item.price;
      value.modifications.forEach((modification) => {
        total += modification.amount;
      });
    });
    setTotalCartPrice(total);
  }
  function toggleCart() {
    setCart(!cart);
  }

  function closeCart() {
    setCart(false);
  }

  function openCart() {
    setCart(true);
  }
  return (
    <LocalStateProvider
      value={{
        cart,
        setCart,
        addToCart,
        remFromCart,
        totalCartPrice,
        toggleCart,
        closeCart,
        openCart,
        show,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

// custom hook for accessing hook
function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
