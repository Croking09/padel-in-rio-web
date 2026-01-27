"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 43.34407695189215,
  lng: -7.260536103497602,
};

export default function Map() {
  const [isMobile, setIsMobile] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-100 flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 h-100">
      <GoogleMap
        mapTypeId="satellite"
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        options={{
          gestureHandling: isMobile ? "greedy" : "cooperative",
          zoomControl: true,
          mapTypeControl: !isMobile,
          streetViewControl: !isMobile,
          fullscreenControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
