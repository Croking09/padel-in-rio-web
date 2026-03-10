import { Skeleton } from "@/components/ui/skeleton";

export default function GeneradorPartidosSkeleton() {
  return (
    <div className="space-y-8 p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-40" />
      </div>

      {[...Array(2)].map((_, jornadaIndex) => (
        <div key={jornadaIndex} className="space-y-4">
          <Skeleton className="h-6 w-32" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, catIndex) => (
              <div
                key={catIndex}
                className="p-4 rounded-lg shadow space-y-3 border"
              >
                <Skeleton className="h-5 w-24" />

                <div className="space-y-2">
                  {[...Array(2)].map((_, matchIndex) => (
                    <div
                      key={matchIndex}
                      className="p-2 rounded bg-muted space-y-1"
                    >
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Skeleton className="h-10 w-40 mx-auto" />
    </div>
  );
}
