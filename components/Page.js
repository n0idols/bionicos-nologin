import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { Toaster } from "react-hot-toast";
import { useUser } from "@supabase/supabase-auth-helpers/react";

export default function Page({ children }) {
  const { user, isLoading } = useUser();

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
        <Header user={user} />

        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileNav />
        {/* <PromoBanner /> */}
      </div>
    </>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
