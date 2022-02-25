import "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="bg-hero-pattern bg-cover h-[600px] mt-2">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center">
          <h1 className="md:text-5xl text-4xl font-bold text-white mb-6">
            {process.env.NEXT_PUBLIC_SITE_TITLE}
          </h1>

          <Link href="/menu">
            <button className="order-btn">Order Now</button>
          </Link>
        </div>
      </div>

      {/* <Image
        src={"/hero.jpeg"}
        layout="fill"
        objectFit="cover"
        alt="pizza logo"
      /> */}
    </>
  );
}
