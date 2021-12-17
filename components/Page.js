import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

export default function Page({ children }) {
  return (
    <div
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="bg-base-100 standalone:mt-32 mt-24"
    >
      <Header />
      <div>{children}</div>
      <Footer />
      <MobileNav />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
