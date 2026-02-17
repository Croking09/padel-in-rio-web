import { Skeleton } from "@/components/ui/skeleton";

export default function PartidosSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Jornadas */}
      <div className="space-y-12">
        {[1, 2].map((jornada) => (
          <div key={jornada} className="space-y-6">
            {/* Jornada title */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-px flex-1" />
            </div>

            {/* Categories grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((cat) => (
                <div
                  key={cat}
                  className="flex flex-col bg-card rounded-xl shadow-sm border overflow-hidden"
                >
                  {/* Category header */}
                  <div className="px-4 py-3 border-b">
                    <Skeleton className="h-6 w-32" />
                  </div>

                  {/* Matches */}
                  <div className="p-4 space-y-4">
                    {[1, 2].map((match) => (
                      <div
                        key={match}
                        className="bg-primary p-3 rounded-lg border border-border space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((player) => (
                            <Skeleton key={player} className="h-4 w-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
