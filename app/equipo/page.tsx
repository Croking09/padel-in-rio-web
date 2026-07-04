import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Equipo() {
  return (
    <>
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold">Equipo Femenino</h1>

        <p className="pt-4">Tres años después de aquello de:</p>

        <p className="italic font-medium">
          &quot;¿Por qué no organizamos un torneo?&quot;
        </p>

        <p className="text-lg pt-4">Un grupo de chicas dijo:</p>

        <p className="italic text-xl font-medium pt-2">
          &quot;¿Y por qué no competimos en una liga federada?&quot;
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <h2 className="text-2xl font-semibold pb-3 border-b">
          Nuestra trayectoria
        </h2>

        <div className="mt-4 space-y-4 leading-relaxed">
          <p>
            En 2026 se formó el equipo femenino de{" "}
            <span className="font-medium">Padel in Rio</span>, que compite en la
            Liga Gallega de Equipos de Clubes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="relative h-112.5 w-full overflow-hidden">
          <Image
            src="/equipo/equipoFemenino.webp"
            alt="Equipo femenino Padel in Rio"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-4">
        <h2 className="text-2xl font-semibold pb-3 border-b">
          El equipo técnico
        </h2>

        <p>
          Nuestras jugadoras cuentan con la ayuda de su entrenador,{" "}
          <span className="font-medium">Josiño</span>, que les transmite que lo
          importante es el proceso.
        </p>

        <p>
          Con cada entrenamiento trabajan para ser un{" "}
          <span className="font-medium">1% mejores</span>, mejorando técnica,
          táctica y mentalidad competitiva.
        </p>
      </div>

      <div className="flex flex-col max-w-4xl mx-auto px-6 pt-16 pb-12 space-y-4">
        <h2 className="text-2xl font-semibold pb-3 border-b">
          Clasificación y partidos
        </h2>

        <p>
          Puedes consultar la clasificación actual y los resultados de los
          partidos en el siguiente enlace:
        </p>

        <Button className="w-fit self-center mt-4" asChild variant="secondary">
          <a
            href="https://www.sport2fit.com/liga/liga-gallega-por-equipos-de-clubes-liga-gallega-por-equipos-de-clubes-2026-zona-norte-820/4144/17102/2620"
            target="_blank"
            rel="noopener noreferrer"
          >
            Liga Gallega de Pádel
          </a>
        </Button>
      </div>
    </>
  );
}
