import { Suspense } from "react";
import SectionNav from "@/components/common/section-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense>
        <SectionNav
          adminLinks={[{ href: "/admin/socios", label: "Socios" }]}
          publicLinks={[
            {
              href: "/asociacion/historico",
              label: "Historial de participación",
            },
          ]}
        />
      </Suspense>
      {children}
    </div>
  );
}
