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
      className="bg-base-100 standalone:mt-32 mt-20"
    >
      <Header />
      <div>{children}</div>
      <Footer />
      <ToastContainer position="bottom-center" />
      <MobileNav />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
