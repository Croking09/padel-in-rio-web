import Carousel from "@/components/home/carousel";
import IconCard from "@/components/home/iconCard";
import IconCardFromBD from "@/components/home/iconCardFromBD";
import IconCardSkeleton from "@/components/home/iconCardSkeleton";
import Map from "@/components/home/map";
import { Dumbell, Medal, Person, Trophy } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <section>
        <Suspense>
          <Carousel />
        </Suspense>
      </section>

      <section className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-evenly w-1/2 mx-auto py-8">
        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="socios" icon={<Person />} />
        </Suspense>
        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="torneos" icon={<Trophy />} />
        </Suspense>
        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="ligas" icon={<Medal />} />
        </Suspense>
        <IconCard title=">1000" subtitle="CLASES" icon={<Dumbell />} />
      </section>

      <hr className="border-border w-2/3 mx-auto" />

      <section className="flex flex-col items-center justify-center font-bold py-8">
        <div className="flex flex-col gap-4 items-center justify-center pb-8">
          <h2 className="text-center text-4xl">NUESTRA CASA</h2>
          <h6 className="text-center opacity-80 text-sm mb-2">
            Bienvenidos a “La Central”, donde jugamos y entrenamos casi todos
            los días.
          </h6>
        </div>

        <Map />
        <Button
          asChild
          className="mt-8 font-bold"
          variant="secondary"
          size="lg"
        >
          <Link
            href="https://riotorto.pistas-online.com/"
            target="_blank"
            rel="noreferrer"
          >
            RESERVA
          </Link>
        </Button>
      </section>
    </>
  );
}
