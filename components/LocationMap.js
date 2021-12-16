import Image from "next/image";
import { useState, useEffect } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocode from "react-geocode";

export default function LocationMap({ address }) {
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

  useEffect(() => {
    // Get latitude & longitude from address.
    Geocode.fromAddress(
      "2211 E Palmdale Blvd suite e, Palmdale, CA 93550"
    ).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({ ...viewport, latitude: lat, longitude: lng });
        setLoading(false);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

  if (loading) return false;

  return (
    <div className="font-pop -z-10">
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
          Pin
          {/* <Image src="/pin.svg" width={30} height={30} /> */}
          <div class="text-black font-bold">
            <div>2211 E Palmdale Blvd Suite e</div>
            {/* <div>{new Date(evt.date).toLocaleDateString("en-US")}</div> */}
            {/* <div>@ {evt.time}</div> */}
          </div>
        </Marker>
      </ReactMapGl>
    </div>
  );
}
