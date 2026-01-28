import Torneos from "@/components/torneos/torneos";
import TorneosSkeleton from "@/components/torneos/torneos-skeleton";
import { Suspense } from "react";

type SearchParams = {
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mt-8">NUESTROS TORNEOS</h2>

      <Suspense fallback={<TorneosSkeleton />}>
        <TorneosWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TorneosWrapper({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return <Torneos page={page} />;
}
