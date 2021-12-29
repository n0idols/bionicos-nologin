import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page({ children }) {
  return (
    <div
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="bg-base-100 standalone:mt-32 mt-24"
    >
      <Header />
      <main className="min-h-screen ">{children}</main>
      <Footer />
      <ToastContainer position="top-center" />
      <MobileNav />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
