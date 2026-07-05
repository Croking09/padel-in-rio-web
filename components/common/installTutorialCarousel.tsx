"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const steps = [
  {
    src: "/tutorial-instalacion/1.png",
    title: "1. Pulsa los tres puntos",
    description: "En la esquina inferior derecha del navegador.",
  },
  {
    src: "/tutorial-instalacion/2.png",
    title: "2. Toca “Compartir”",
  },
  {
    src: "/tutorial-instalacion/3.png",
    title: "3. Selecciona “Añadir a la pantalla de inicio”",
  },
  {
    src: "/tutorial-instalacion/4.png",
    title: "4. Pulsa “Añadir” para confirmar",
    description: "Puedes cambiar el nombre antes de añadirla si quieres.",
  },
];

export default function InstallTutorialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {steps.map((step, index) => (
          <CarouselItem key={index}>
            <div className="flex flex-col items-center">
              <div className="w-full text-center h-20 flex flex-col justify-center px-2">
                <h3 className="font-semibold text-base leading-snug">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>

              <div className="w-full h-[42dvh] flex items-center justify-center">
                <Image
                  src={step.src}
                  alt={step.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-2xl"
                  priority={index === 0}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-between w-full max-w-45 mx-auto mt-5">
        <CarouselPrevious className="static translate-y-0 h-10 w-10" />

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === current
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>

        <CarouselNext className="static translate-y-0 h-10 w-10" />
      </div>
    </Carousel>
  );
}
