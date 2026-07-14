import { Suspense } from "react";
import { cookies } from "next/headers";
import SectionNav from "@/components/common/section-nav";
import { resolveSeasonId } from "@/lib/liga/resolve-active-month";
import { getAllSeasons } from "@/app/actions/season-actions";
import SeasonSelector from "@/components/liga/season-selector";

export default async function LigaNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seasons, cookieStore] = await Promise.all([
    getAllSeasons(),
    cookies(),
  ]);

  const currentSeasonId = resolveSeasonId(
    [cookieStore.get("seasonId")?.value],
    seasons,
  );

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
          <SeasonSelector seasons={seasons} currentSeasonId={currentSeasonId} />
        </SectionNav>
      </Suspense>
      {children}
    </>
  );
}
