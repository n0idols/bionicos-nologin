import Image from "next/image";
import Link from "next/link";
import brandImage from "../public/169.png";
export default function Logo() {
  return (
    <>
      <Link href="/">
        <div className="h-20 w-32">
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
