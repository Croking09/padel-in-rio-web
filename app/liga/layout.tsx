import { Suspense } from "react";
import SectionNav from "@/components/common/section-nav";

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense>
        <SectionNav
          adminLinks={[
            { href: "/admin/liga/asignacion", label: "Asignación" },
            { href: "/admin/liga/generador", label: "Generador" },
          ]}
          publicLinks={[
            { href: "/liga/partidos", label: "Partidos" },
            { href: "/liga/reglamento", label: "Reglamento" },
          ]}
        />
      </Suspense>
      {children}
    </div>
  );
}
