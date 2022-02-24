import PropTypes from "prop-types";
import Header from "./Header";
import TempHeader from "./TempHeader";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

import toast, { Toaster } from "react-hot-toast";

import PromoBanner from "./PromoBanner";

export default function Page({ children }) {
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
        className="bg-base-100 standalone:mt-28  mt-20"
      >
        <TempHeader />

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
