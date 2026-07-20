import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24 gap-4">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Asignación de Categorías
        </h1>

        <div className="justify-self-end">
          <Skeleton className="h-9 w-56" />
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-4 rounded-lg shadow-sm border">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Skeleton className="w-full md:w-64 h-230 rounded-lg" />

            <div className="flex-1 w-full md:w-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col border rounded-lg h-112.5 shadow-sm overflow-hidden"
                  >
                    <div className="p-3 border-b flex justify-between items-center">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                    <div className="flex-1 p-2 space-y-2">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <Skeleton key={j} className="h-10 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
