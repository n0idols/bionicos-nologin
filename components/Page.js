import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { Toaster } from "react-hot-toast";
import { useUser } from "@supabase/supabase-auth-helpers/react";

export default function Page({ children }) {
  const { user } = useUser();
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000,
          position: "bottom-center",
          reverseOrder: "true",
          style: {
            paddingInline: "1rem",
            fontFamily: "work sans, sans-serif",
            fontSize: ".9rem",
            x,
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
