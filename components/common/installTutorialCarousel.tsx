"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const steps = [
  {
    src: "/tutorial-instalacion/1.png",
    title: "1 Pulsa los tres puntos",
    description: "En la esquina inferior derecha del navegador.",
  },
  {
    src: "/tutorial-instalacion/2.png",
    title: "2 Toca “Compartir”",
  },
  {
    src: "/tutorial-instalacion/3.png",
    title: "3 Selecciona “Añadir a la pantalla de inicio”",
  },
  {
    src: "/tutorial-instalacion/4.png",
    title: "4 Pulsa “Añadir” para confirmar",
    description: "Puedes cambiar el nombre antes de añadirla si quieres.",
  },
];

export default function InstallTutorialCarousel() {
  return (
    <Carousel className="w-full max-w-xs sm:max-w-sm mx-auto group">
      <CarouselContent>
        {steps.map((step, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="text-center min-h-20 flex flex-col justify-center px-4 mb-6">
                    <h3 className="font-bold text-lg leading-tight">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm opacity-60 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full aspect-9/16 max-h-[50vh] rounded-4xl overflow-hidden shadow-xl border">
                    <Image
                      src={step.src}
                      alt={step.title}
                      fill
                      className="object-contain p-4"
                      priority={index === 0}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center gap-6 mt-6">
        <CarouselPrevious className="static translate-y-0 h-12 w-12 hover:bg-secondary transition-colors" />

        <CarouselNext className="static translate-y-0 h-12 w-12 hover:bg-secondary transition-colors" />
      </div>
    </Carousel>
  );
}
