import { Suspense } from "react";
import InscripcionContent from "@/components/torneos/inscripcion/inscripcion-content";
import InscripcionSkeleton from "@/components/torneos/inscripcion/inscripcion-skeleton";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <Suspense fallback={<InscripcionSkeleton />}>
      <InscripcionContent searchParams={searchParams} />
    </Suspense>
  );
}
