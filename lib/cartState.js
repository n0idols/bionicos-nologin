import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider. We weill store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  // Closed cart by default
  const [show, toggleShow] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["cart"]);
  const [cart, setCart] = useState(cookies.cart ? cookies.cart : []);
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  function remFromCart(index) {
    if (confirm("Are you sure you want to remove this item?")) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
      calcCartTotalPrice(newCart);
      setCookie("cart", JSON.stringify(newCart), {
        path: "/",
      });
    }
  }

  function addToCart(item, modifications) {
    const newCart = [
      ...cart,
      {
        item,
        modifications,
      },
    ];
    setCart(newCart);
    calcCartTotalPrice(newCart);
    setCookie("cart", JSON.stringify(newCart), {
      path: "/",
    });
  }

  function emptyCart() {
    setCart([]);
    removeCookie(cart);
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
    toggleShow(!show);
  }

  function closeCart() {
    toggleShow(false);
  }

  function openCart() {
    toggleShow(true);
  }
  return (
    <LocalStateProvider
      value={{
        cart,
        setCart,
        addToCart,
        remFromCart,
        emptyCart,
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
