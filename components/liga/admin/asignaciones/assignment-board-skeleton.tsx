import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentBoardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center p-4 rounded-lg shadow-sm border">
        <Skeleton className="h-6 w-64" />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64 flex flex-col border rounded-lg h-screen">
          <div className="p-3 border-b">
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex-1 p-2 space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
            {[...Array(3)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="w-full flex flex-col border rounded-lg h-112.5 shadow-sm"
              >
                <div className="p-3 border-b flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-10" />
                </div>

                <div className="flex-1 p-2 space-y-2">
                  {[...Array(8)].map((_, rowIndex) => (
                    <Skeleton
                      key={rowIndex}
                      className="h-10 w-full rounded-md"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
