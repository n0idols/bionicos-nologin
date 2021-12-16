import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider. We weill store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  // Closed cart by default
  const [cart, setCart] = useState([]);

  function remFromCart(index) {
    if (confirm("Are you sure you want to remove this item?")) {
      const tempCart = [...cart];
      tempCart.splice(index, 1);
      setCart(tempCart);
      // calcCartTotalPrice();
    }
  }
  function addToCart(item, modifications) {
    setCart([
      ...cart,
      {
        item,
        modifications,
      },
    ]);
    // calcCartTotalPrice();
  }
  // function toggleCart() {
  //   setCart(!cart);
  // }

  // function closeCart() {
  //   setCart(false);
  // }

  // function openCart() {
  //   setCart(true);
  // }
  return (
    <LocalStateProvider
      value={{
        cart,
        setCart,
        addToCart,
        remFromCart,
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
