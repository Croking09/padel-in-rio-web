import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[90%] mx-auto px-4 py-8 space-y-8 flex flex-col items-center">
      {/* Título */}
      <Skeleton className="h-10 w-64" />

      {/* Nota */}
      <Skeleton className="h-4 w-80" />

      {/* Tabla */}
      <div className="w-full max-w-xl rounded-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary/40 border-b border-border flex gap-2 px-2 py-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Filas */}
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-2 ${i % 2 === 0 ? "bg-primary/20" : "bg-background"}`}
            >
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
