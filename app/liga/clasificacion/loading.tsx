import GeneralClassificationTableSkeleton from "@/components/liga/clasificacion-general/general-table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-24">
        <h1 className="text-4xl font-bold">Clasificación General</h1>
        <p className="text-muted-foreground">
          <span className="text-destructive">*</span> Solo se muestran jugadores
          que hayan jugado por lo menos un partido.
        </p>
      </div>

      <div className="flex justify-center pb-8 px-4 md:px-8 lg:px-24">
        <GeneralClassificationTableSkeleton />
      </div>
    </>
  );
}
