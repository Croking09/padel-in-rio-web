import TorneosSkeleton from "@/components/torneos/torneos-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between pt-8 px-8">
        <div /> {/* Spacer to center the title */}
        <h1 className="text-4xl font-bold">Nuestros Torneos</h1>
        <div /> {/* Spacer to center the title */}
      </div>
      <TorneosSkeleton />
    </>
  );
}
