"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const images = ["/carousel/1.jpg", "/carousel/2.jpg", "/carousel/3.jpg"];

export default function Carousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative w-full">
      <ShadcnCarousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full h-120 md:h-130"
      >
        <CarouselContent className="h-120 md:h-130 ml-0">
          {images.map((src) => (
            <CarouselItem key={src} className="relative h-full pl-0">
              <Image
                src={src}
                alt="Carousel image"
                fill
                priority
                className="object-cover"
                style={{ objectPosition: "50% 15%" }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </ShadcnCarousel>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-0 w-full flex items-center justify-center gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === current ? "w-5 bg-primary" : "w-1.5 bg-background/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
