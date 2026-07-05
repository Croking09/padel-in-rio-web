"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Map from "@/components/home/map";
import LocationCard from "@/components/home/locationCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MapSection() {
  const [showCard, setShowCard] = useState(true);

  return (
    <div className="relative w-full max-w-250 mx-auto h-130 md:rounded-lg overflow-hidden">
      <Map />

      <div
        className={cn(
          "absolute bottom-8 left-8 right-8 sm:right-auto transition-all duration-300",
          showCard
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <LocationCard onClose={() => setShowCard(false)} />
      </div>

      <Button
        size="icon"
        onClick={() => setShowCard(true)}
        className={cn(
          "absolute bottom-8 left-8 rounded-full transition-all duration-300",
          showCard
            ? "opacity-0 scale-75 pointer-events-none"
            : "opacity-100 scale-100",
        )}
        aria-label="Mostrar información del lugar"
      >
        <MapPin />
      </Button>
    </div>
  );
}
