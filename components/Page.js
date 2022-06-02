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
        className="bg-base-100  md:mt-20"
      >
        <TempHeader user={user} />

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
