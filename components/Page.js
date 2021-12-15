import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <MobileNav />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
