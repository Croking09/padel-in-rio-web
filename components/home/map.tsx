"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const center = {
  lat: 43.34407695189215,
  lng: -7.260536103497602,
};

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

export default function InteractiveMap() {
  const [isMobile, setIsMobile] = useState(false);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <div className="w-full md:w-1/2 h-100">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={center}
          defaultZoom={17}
          mapTypeId="satellite"
          gestureHandling={isMobile ? "greedy" : "cooperative"}
          zoomControl={true}
          mapTypeControl={!isMobile}
          streetViewControl={!isMobile}
          fullscreenControl={true}
          style={{ width: "100%", height: "400px" }}
        >
          <AdvancedMarker
            ref={markerRef}
            position={center}
            title="Mi ubicación"
            onClick={() => setInfoWindowOpen(true)}
          />

          {infoWindowOpen && (
            <InfoWindow
              anchor={marker}
              onCloseClick={() => setInfoWindowOpen(false)}
              maxWidth={260}
              headerContent={
                <h3 className="m-0 mb-1 text-[15px] font-semibold text-gray-800">
                  La central
                </h3>
              }
            >
              <div>
                <Button variant="secondary" asChild>
                  <Link
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🚗 Cómo llegar
                  </Link>
                </Button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
