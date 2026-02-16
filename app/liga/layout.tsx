import { Suspense } from "react";
import LigaNav from "@/components/liga/liga-nav";

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense>
        <LigaNav />
      </Suspense>
      {children}
    </div>
  );
}
