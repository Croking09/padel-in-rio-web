"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "50%",
  height: "600px",
};

const center = {
  lat: 43.34407695189215,
  lng: -7.260536103497602,
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapTypeId="satellite"
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}
