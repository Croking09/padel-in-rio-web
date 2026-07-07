import { Suspense } from "react";
import { cookies } from "next/headers";
import SectionNav from "@/components/common/section-nav";
import TemporadaSelector from "./temporada-selector";
import { getTemporadas } from "@/app/actions/ligas";
import { resolveTemporadaId } from "@/lib/liga/resolve-active-month";

export default async function LigaNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [temporadas, cookieStore] = await Promise.all([
    getTemporadas(),
    cookies(),
  ]);

  const currentTemporadaId = resolveTemporadaId(
    [cookieStore.get("temporadaId")?.value],
    temporadas,
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
          <TemporadaSelector
            temporadas={temporadas}
            currentTemporadaId={currentTemporadaId}
          />
        </SectionNav>
      </Suspense>
      {children}
    </>
  );
}
