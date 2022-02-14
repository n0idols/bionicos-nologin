import Link from "next/link";

import Logo from "./Logo";
import { FiPhoneOutgoing, FiFacebook, FiInstagram } from "react-icons/fi";

const icon = `text-2xl`;
export default function Footer() {
  return (
    <>
      <footer className="footer footer-center bg-base-200 text-base-content  pt-8 pb-24 md:pb-8">
        <div className="">
          <Logo />
          <div className="grid grid-flow-col gap-8 mt-2">
            <a href="tel:+16612662620">
              <FiPhoneOutgoing className={icon} />
            </a>
            <a href="https://facebook.com/bionicosandjuicesrios">
              <FiFacebook className={icon} />
            </a>
            <a href="https://instagram.com/bionicosandjuicesrios">
              <FiInstagram className={icon} />
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
          <a className="link link-hover">Disclaimer</a>
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
