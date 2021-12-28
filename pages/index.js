import Layout from "@/components/Layout";
import LocationMap from "@/components/LocationMap";
import Image from "next/image";

import Link from "next/link";
import heroImage from "../public/hero.jpg";
export default function Home() {
  return (
    <Layout title="Home">
      <div className="">
        <Image
          src={heroImage}
          layout="responsive"
          className="relative "
          alt="background image"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col justify-center items-center text-center text-white  prose-sm ">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link href="/menu">
            <a className="btn btn-primary">View Menu</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
