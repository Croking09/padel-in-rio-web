import { Suspense } from "react";
import SectionNav from "@/components/common/section-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense>
        <SectionNav
          adminLinks={[{ href: "/admin/asociacion/socios", label: "Socios" }]}
          publicLinks={[]}
        />
      </Suspense>
      {children}
    </div>
  );
}
