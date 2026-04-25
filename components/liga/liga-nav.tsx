import { Suspense } from "react";
import SectionNav from "@/components/common/section-nav";
import TemporadaSelector from "./temporada-selector";
import { getTemporadas } from "@/app/actions/ligas";

export default async function LigaNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const temporadas = await getTemporadas();

  return (
    <div>
      <Suspense>
        <SectionNav
          adminLinks={[
            { href: "/admin/liga/asignacion", label: "Asignación" },
            { href: "/admin/liga/generador", label: "Generador" },
          ]}
          publicLinks={[
            { href: "/liga/clasificacion", label: "Clasificación General" },
            { href: "/liga/ascensor", label: "Ascensor" },
            { href: "/liga/partidos", label: "Partidos" },
            { href: "/liga/reglamento", label: "Reglamento" },
          ]}
        >
          <TemporadaSelector temporadas={temporadas} />
        </SectionNav>
      </Suspense>
      {children}
    </div>
  );
}
