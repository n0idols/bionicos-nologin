import Image from "next/image";
import Link from "next/link";
import brandImage from "../public/169.png";
export default function Logo({ admin }) {
  return (
    <>
      {admin ? (
        <Link href="/account/admin/orders/progress">
          <div className="h-16 w-28">
            <Image
              src={brandImage}
              alt="Our Logo"
              objectFit="contain"
              objectPosition="relative"
            />
          </div>
        </Link>
      ) : (
        <Link href="/">
          <div className="h-16 w-28">
            <Image
              src={brandImage}
              alt="Our Logo"
              objectFit="contain"
              objectPosition="relative"
            />
          </div>
        </Link>
      )}
    </>
  );
}
