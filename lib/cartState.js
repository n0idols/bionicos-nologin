import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider. We weill store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  // Closed cart by default
  const [cartOpen, setCartOpen] = useState(false);

  let cart = {};
  let totalCartPrice = 0;

  // const addToCart = (item, modifications) => {
  //   cart.update((cartItems) => {
  //     return (
  //       [...cartItems],
  //       {
  //         item,
  //         modifications,
  //       }
  //     );
  //   });
  // };
  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }
  return (
    <LocalStateProvider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        toggleCart,
        closeCart,
        openCart,
        // addToCart,
        totalCartPrice,
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
