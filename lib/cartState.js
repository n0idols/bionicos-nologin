import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    calcCartTotalPrice(cart);
  }, [cart]);

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

  function addToCart(item, modifications, quantity = 1) {
    const index = cart.findIndex((cartItem) => {
      console.log({ cartItem, modifications });
      const isSameItem = cartItem.item.id === item.id;
      const isModificationsSameLength =
        cartItem.modifications.length === modifications.length;
      if (!isSameItem || isModificationsSameLength) return;
      for (let i = 0; i < cartItem.modifications.length; i++) {
        if (cartItem.modifications[i].name !== modifications[i].name) return;
      }
      return true;
    });
    const newCart = [...cart];
    if (index >= 0) newCart[index].quantity += quantity;
    else
      newCart.push({
        item,
        modifications,
        quantity,
      });
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
      let itemTotal = value.item.price;
      value.modifications?.forEach((modification) => {
        itemTotal += modification.amount;
      });
      itemTotal *= value.quantity;
      total += itemTotal;
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
