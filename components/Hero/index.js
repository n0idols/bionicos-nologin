import "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero">
      <div className="prose">
        <div className="max-w-7xl mx-auto py-36  flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold">Bionicos Juices & Rios</h1>
          {/* <p className="">2211 E Palmdale Blvd Ste E Palmdale, CA 93550</p> */}
          <Link href="/menu">
            <a className="btn btn-primary mt-12">View Menu</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
