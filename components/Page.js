import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import TempHeader from "./TempHeader";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import toast, { Toaster } from "react-hot-toast";

import PromoBanner from "./PromoBanner";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { setCookie } from "nookies";

export default function Page({ children }) {
  const { user, isLoading, accessToken, error } = useUser();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(false);
  const [admin, setIsAdmin] = useState(null);
  const [userprofile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      getProfile();
    } else {
      return;
    }
  }, [user]);

  async function getProfile() {
    setLoading(true);

    try {
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`*`)
        .eq("id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data[0].isAdmin === true) {
        setIsAdmin(true);
      }

      // if (data) {
      //   setCookie(null, "username", data[0].username || data[0].full_name, {
      //     path: "/",
      //     sameSite: "lax",
      //   });
      //   setUserProfile(data);

      //   if (data[0].isAdmin === true) {
      //     setIsAdmin(true);
      //   }
      // }
    } catch (error) {
      alert(`From Page wrapper - ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 4000,
          position: "bottom-center",
          style: {
            padding: "16px",
          },
        }}
      />
      <div
        style={{ WebkitTapHighlightColor: "transparent" }}
        className="bg-base-100 standalone:mt-28 mt-20"
      >
        <TempHeader admin={admin} user={user} />

        <main className="min-h-screen">{children}</main>
        <Footer />
        {!admin && <MobileNav />}
        {/* <PromoBanner /> */}
      </div>
    </>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
