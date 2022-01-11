import "./Hero.module.css";
import Link from "next/link";
import { SITE_TITLE } from "@/config/index";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <div className="bg-hero-pattern bg-cover h-[600px] mt-2">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center">
          <h1 className="md:text-5xl text-4xl font-bold text-white mb-6">
            {SITE_TITLE}
          </h1>
          {/* <p className="">2211 E Palmdale Blvd Ste E Palmdale, CA 93550</p> */}
          <Link href="/menu">
            <button className="btn btn-accent shadow-2xl ">Order Now</button>
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
