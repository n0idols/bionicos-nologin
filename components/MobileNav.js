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

import Link from "next/link";
import { useRouter } from "next/router";

const icon = `text-gray-600 text-2xl`;
const iconActive = `text-gray-600 text-2xl`;

const navWrap = `fixed bottom-0 inset-x-0 bg-gray-200 flex lg:hidden justify-between max-w-2xl mx-auto rounded-3xl z-50`;
const iconWrap = `w-full h-full p-4 text-center flex flex-col items-center text-xs`;

export default function MobileNav() {
  const router = useRouter();

  return (
    <div>
      <nav className={navWrap}>
        <Link href="/">
          <a className={iconWrap}>
            <AiOutlineHome className={icon} />
            Home
          </a>
        </Link>

        <Link href="/menu/specials">
          <a className={iconWrap}>
            <AiOutlineFire className={icon} /> Specials
          </a>
        </Link>

        <Link href="/menu">
          <a className={iconWrap}>
            <AiOutlineRead className={icon} />
            Menu
          </a>
        </Link>

        <Link href="/account">
          <a className={iconWrap}>
            <AiOutlineUser className={icon} />
            Account
          </a>
        </Link>
      </nav>
    </div>
  );
}
