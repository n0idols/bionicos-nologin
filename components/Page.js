import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

import toast, { Toaster } from "react-hot-toast";

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
        <Header />
        <main className="min-h-screen mb-8">{children}</main>
        <Footer />
        <MobileNav />
      </div>
    </>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
