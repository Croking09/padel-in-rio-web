import { Suspense } from "react";
import SectionNav from "@/components/common/section-nav";
import SeasonSelector from "@/components/liga/season-selector";
import { getActiveSeason } from "@/lib/liga/resolve-season";

export default async function LigaNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const { seasonId, seasons } = await getActiveSeason({});

  return (
    <>
      <Suspense>
        <SectionNav
          adminLinks={[
            { href: "/admin/liga/temporadas", label: "Temporadas" },
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
          <SeasonSelector seasons={seasons} currentSeasonId={seasonId} />
        </SectionNav>
      </Suspense>
      {children}
    </>
  );
}
