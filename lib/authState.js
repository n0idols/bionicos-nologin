import { createContext, useContext, useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function AuthStateProvider({ children }) {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] =
    useState("not-authenticated");
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
        if (event === "SIGNED_IN") {
          setAuthenticatedState("authenticated");
          router.push("/account");
        }
        if (event === "SIGNED_OUT") {
          setAuthenticatedState("not-authenticated");
        }
      }
    );
    checkUser();
    return () => {
      authListener.unsubscribe();
    };
  }, []);
  async function checkUser() {
    const user = await supabase.auth.user();
    if (user) {
      setAuthenticatedState("authenticated");
    }
  }
  async function handleAuthChange(event, session) {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }
  return (
    <LocalStateProvider value={{ authenticatedState }}>
      {children}
    </LocalStateProvider>
  );
}

// custom hook for accessing hook
function useAuth() {
  const all = useContext(LocalStateContext);
  return all;
}
export { AuthStateProvider, useAuth };
