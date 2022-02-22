import Image from "next/image";
import { useState, useEffect } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocode from "react-geocode";

export default function LocationMap() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState({
    latitude: 34.579449,
    longitude: -118.109291,
    width: "100%",
    height: "500px",
    zoom: 12,
  });

  const address = "2211 E Palmdale Blvd suite e, Palmdale, CA 93550";

  useEffect(() => {
    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
    )
      .then((response) => response.json())
      .then((result) => {
        const { lat, lon } = result.features[0].properties;
        setLat(lat);
        setLng(lon);
        setViewport({ ...viewport, latitude: lat, longitude: lon });
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (loading) return false;
  return (
    <div className=" -z-10 ">
      {/* <div className="mb-4">
        <h1 className="text-lg font-bold">{evt.venue}</h1>
        <h1>{evt.address}</h1>
      </div> */}
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(vp) => setViewport(vp)}
        className="rounded-md"
      >
        <Marker latitude={lat} longitude={lng}>
          <Image
            src="/pin.svg"
            width={30}
            height={30}
            alt="2211 E Palmdale Blvd Suite E"
          />

          {/* <Image src="/pin.svg" width={30} height={30} /> */}
          <div className="text-black font-bold">
            <div>2211 E Palmdale Blvd Suite e</div>
            {/* <div>{new Date(evt.date).toLocaleDateString("en-US")}</div> */}
            {/* <div>@ {evt.time}</div> */}
          </div>
        </Marker>
      </ReactMapGl>
    </div>
  );
}
