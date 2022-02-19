import LocationMap from "./LocationMap";

export default function MapSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center overflow-x-hidden max-w-5xl mx-auto mb-8">
      <div className="w-full flex flex-col items-center py-8 text-center">
        <div>
          <div className="mb-6">
            <p className="font-thin uppercase tracking-widest text-2xl">
              visit us
            </p>
          </div>
          <p className="font-bold tracking-wide mb-2 uppercase">
            Store Location
          </p>
          <p>2211 E Palmdale Blvd, STE E Palmdale, CA 93550</p>
          <div className="mt-6">
            <p className="font-bold uppercase tracking-wide mb-2">
              Business Hours
            </p>
            <p>
              <span className="font-semibold">Mon - Sun </span>
              7:00am - 4:00pm{" "}
            </p>

            {/* <p>
              {" "}
              <span className="font-semibold">Sun: </span>CLOSED
            </p> */}
          </div>
        </div>
      </div>

      <div className=" mx-auto bg-secondary p-1 rounded-lg shadow-2xl ">
        <LocationMap />

        {/* <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6569.832944813545!2d-118.088691!3d34.58098!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xda1ede9cb9f7f244!2sBionicos%20And%20Juice&#39;s%20Rios!5e0!3m2!1sen!2sus!4v1641671358648!5m2!1sen!2sus"
          className="lg:w-full w-screen h-[450px]"
          loading="lazy"
          title="map"
        ></iframe> */}
      </div>
    </div>
  );
}
