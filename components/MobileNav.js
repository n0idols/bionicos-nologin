import {
  AiOutlineSketch,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineFire,
  AiOutlineHome,
  AiOutlineRead,
  AiFillHome,
} from "react-icons/ai";

import { FiHome, FiTag, FiBookOpen, FiUser } from "react-icons/fi";

import Link from "next/link";
import { useRouter } from "next/router";

const icon = `text-gray-600 text-2xl`;
const iconActive = `text-primary  text-2xl`;

const navWrap = `fixed bottom-0 inset-x-0 bg-gray-200 flex lg:hidden justify-between max-w-2xl mx-auto rounded-3xl z-50`;
const iconWrap = `w-full h-full p-4 text-center flex flex-col items-center text-xs`;

export default function MobileNav() {
  const router = useRouter();

  return (
    <div>
      <nav className={navWrap}>
        <Link href="/">
          <a className={iconWrap}>
            <FiHome className={router.pathname == "/" ? iconActive : icon} />
            Home
          </a>
        </Link>

        <Link href="/menu/specials">
          <a className={iconWrap}>
            <FiTag
              className={
                router.pathname == "/menu/specials" ? iconActive : icon
              }
            />{" "}
            Specials
          </a>
        </Link>

        <Link href="/menu">
          <a className={iconWrap}>
            <FiBookOpen
              className={router.pathname == "/menu" ? iconActive : icon}
            />
            Menu
          </a>
        </Link>

        <Link href="/account/dashboard">
          <a className={iconWrap}>
            <FiUser
              className={
                router.pathname == "/account/dashboard" ? iconActive : icon
              }
            />
            Account
          </a>
        </Link>
      </nav>
    </div>
  );
}
