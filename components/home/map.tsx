"use client";

import {
  APIProvider,
  Map as InteractiveMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { CLUB_LOCATION } from "@/lib/location";

export default function Map() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <InteractiveMap
        mapId="DEMO_MAP_ID"
        defaultCenter={CLUB_LOCATION}
        defaultZoom={16}
        mapTypeId="hybrid"
        gestureHandling={isMobile ? "greedy" : "cooperative"}
        zoomControl={true}
        mapTypeControl={!isMobile}
        streetViewControl={!isMobile}
        fullscreenControl={true}
        style={{ width: "100%", height: "100%" }}
      >
        <AdvancedMarker position={CLUB_LOCATION} title="La Central" />
      </InteractiveMap>
    </APIProvider>
  );
}
