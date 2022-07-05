import Link from "next/link";

import Logo from "./Logo";
import { FiPhoneOutgoing, FiFacebook, FiInstagram } from "react-icons/fi";

const icon = `text-2xl`;
const link = `flex flex-col items-center`;
export default function Footer() {
  return (
    <>
      <footer className="footer footer-center bg-base-200 text-base-content  pt-8 pb-24 md:pb-8">
        <div>
          <Logo />
          <div className="grid grid-flow-col gap-8 mt-2">
            <a href="tel:+16612662620" className={link}>
              <FiPhoneOutgoing className={icon} />
              Call Us
            </a>
            <a
              href="https://facebook.com/bionicosandjuicesrios"
              className={link}
            >
              <FiFacebook className={icon} />
              Facebook
            </a>
            <a
              href="https://instagram.com/bionicosandjuicesrios"
              className={link}
            >
              <FiInstagram className={icon} />
              Instagram
            </a>
          </div>
        </div>
        <div className="grid grid-flow-col gap-4 -mt-4">
          <Link href="/privacy">
            <a className="link link-hover">Privacy Policy</a>
          </Link>

          <Link href="/tos">
            <a className="link link-hover">Terms of Service</a>
          </Link>

          <Link href="/tos">
            <a className="link link-hover">Disclaimer</a>
          </Link>
        </div>
        <div className="hidden md:flex">
          <p>
            Made with ❤️ {new Date().getFullYear()} - BionicosJuicesRios.com
          </p>
        </div>
      </footer>
    </>
  );
}
