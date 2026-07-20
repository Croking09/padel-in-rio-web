import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Equipo() {
  return (
    <>
      <div className="text-center mt-8 px-8">
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

      <section className="max-w-4xl mx-auto px-8 pt-16">
        <h2 className="text-2xl font-semibold pb-4">Nuestra trayectoria</h2>

        <Separator />

        <div className="mt-4 space-y-4 leading-relaxed">
          <p>
            En 2026 se formó el equipo femenino de{" "}
            <span className="font-medium">Padel in Rio</span>, que compite en la
            Liga Gallega de Equipos de Clubes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto pt-12">
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
      </section>

      <section className="max-w-4xl mx-auto px-8 pt-16 space-y-4">
        <h2 className="text-2xl font-semibold">El equipo técnico</h2>

        <Separator />

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
      </section>

      <section className="flex flex-col max-w-4xl mx-auto px-8 pt-16 pb-12 space-y-4">
        <h2 className="text-2xl font-semibold">Clasificación y partidos</h2>

        <Separator />

        <p>
          Puedes consultar la clasificación actual y los resultados de los
          partidos en el siguiente enlace:
        </p>

        <Link
          href="https://www.fgpadel.com/ligas-de-padel-en-galicia"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "default",
            size: "default",
            className: "w-fit self-center",
          })}
        >
          Liga Gallega de Pádel
        </Link>
      </section>
    </>
  );
}
