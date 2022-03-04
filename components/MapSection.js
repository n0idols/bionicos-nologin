import LocationMap from "./LocationMap";

export default function MapSection() {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center overflow-x-hidden max-w-5xl mx-auto mb-8">
        <div className="w-full flex flex-col items-center py-8 lg:text-left text-center">
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

        <div className=" rounded-lg lg:w-full w-screen ">
          <LocationMap />
        </div>
      </div>
    </>
  );
}
