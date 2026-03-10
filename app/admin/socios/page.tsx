import Socios from "@/components/asociacion/admin/socios";
import { Suspense } from "react";
import SociosListSkeleton from "@/components/asociacion/admin/socios-list-skeleton";

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-8">Socios</h1>

      <Suspense fallback={<SociosListSkeleton />}>
        <Socios />
      </Suspense>
    </>
  );
}
