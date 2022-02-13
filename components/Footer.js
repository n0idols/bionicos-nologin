import Link from "next/link";

import Logo from "./Logo";
import { FiPhoneOutgoing, FiFacebook, FiInstagram } from "react-icons/fi";

const icon = `text-2xl`;
export default function Footer() {
  return (
    <>
      <footer className="footer footer-center bg-base-200 text-base-content  pt-8 pb-24 md:pb-8">
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </div>
        <div className="-mt-8">
          <Logo />
          <div className="grid grid-flow-col gap-8 mt-2">
            <a>
              <FiPhoneOutgoing className={icon} />
            </a>
            <a>
              <FiFacebook className={icon} />
            </a>
            <a>
              <FiInstagram className={icon} />
            </a>
          </div>
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
