import Image from "next/image";
import Link from "next/link";
import brandImage from "../public/logo.svg";
export default function Logo() {
  return (
    <>
      <Link href="/">
        <div className="h-10 w-10">
          <Image
            src={brandImage}
            alt="Our Logo"
            objectFit="contain"
            objectPosition="relative"
          />
        </div>
      </Link>
    </>
  );
}
