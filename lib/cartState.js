import { createContext } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider. We weill store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  const cartOpen = true;

  return (
    <LocalStateProvider value={{ cartOpen }}>{children}</LocalStateProvider>
  );
}

// custom hook for accessing hook
function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider };
