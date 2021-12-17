import Layout from "@/components/Layout";
import LocationMap from "@/components/LocationMap";

import Link from "next/link";
import heroImage from "../public/hero.jpg";
export default function Home() {
  return (
    <Layout title="Home">
      <div className="">
        <div className="max-w-7xl mx-auto py-36 prose-sm flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link href="menu">
            <a className="btn btn-primary">View Menu</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
