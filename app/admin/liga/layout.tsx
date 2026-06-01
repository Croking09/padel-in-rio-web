import LigaNav from "@/components/liga/liga-nav";
import { Suspense } from "react";

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <LigaNav>{children}</LigaNav>
    </Suspense>
  );
}
