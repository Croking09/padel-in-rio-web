import Carousel from "@/components/home/carousel";
import IconCard from "@/components/home/iconCard";
import IconCardFromBD from "@/components/home/iconCardFromBD";
import IconCardSkeleton from "@/components/home/iconCardSkeleton";
import { Suspense } from "react";
import { UserRound, Trophy, Award, Dumbbell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MapSection from "@/components/home/mapSection";

export default function Home() {
  return (
    <>
      <section>
        <Suspense>
          <Carousel />
        </Suspense>
      </section>

      <section className="mx-auto grid grid-cols-1 w-[40%] gap-8 py-8 md:grid-cols-2 md:w-1/2 md:place-items-center xl:grid-cols-4">
        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="socios" icon={<UserRound />} />
        </Suspense>

        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="torneos" icon={<Trophy />} />
        </Suspense>

        <Suspense fallback={<IconCardSkeleton />}>
          <IconCardFromBD type="ligas" icon={<Award />} />
        </Suspense>

        <IconCard title=">1000" subtitle="CLASES" icon={<Dumbbell />} />
      </section>

      <div className="w-2/3 mx-auto">
        <Separator />
      </div>

      <section className="flex flex-col items-center justify-center font-bold py-8">
        <div className="flex flex-col gap-4 items-center justify-center pb-8">
          <h1 className="text-center text-4xl">NUESTRA CASA</h1>
          <p className="text-center text-muted-foreground text-sm mb-2 px-8">
            Bienvenidos a &quot;La Central&quot;, donde jugamos y entrenamos
            casi todos los días.
          </p>
        </div>

        <div className="w-full md:px-4">
          <MapSection />
        </div>
      </section>
    </>
  );
}
