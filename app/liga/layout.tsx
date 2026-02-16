import { Suspense } from "react";
import AdminNav from "@/components/liga/admin/admin-nav";

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense>
        <AdminNav />
      </Suspense>
      {children}
    </div>
  );
}
