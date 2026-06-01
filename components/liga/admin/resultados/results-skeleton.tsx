"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MatchResultsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Título */}
      <Skeleton className="h-8 w-1/3 mx-auto mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[0, 1, 2].map((setIndex) => (
          <div
            key={setIndex}
            className="flex flex-col rounded-xl border overflow-hidden"
          >
            {/* Header Set */}
            <div className="px-4 py-2 border-b">
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Body Set */}
            <div className="p-4 flex flex-col gap-4">
              {/* Pareja 1 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>

              {/* VS divider */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-px flex-1" />
                <span className="text-xs font-bold text-gray-400">VS</span>
                <Skeleton className="h-px flex-1" />
              </div>

              {/* Pareja 2 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-48 rounded" />
      </div>
    </div>
  );
}
