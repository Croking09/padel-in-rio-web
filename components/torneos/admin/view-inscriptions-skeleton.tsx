import { Skeleton } from "@/components/ui/skeleton";

export default function ViewInscriptionSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <section className="space-y-3">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-6 w-48" />

        <div className="overflow-hidden border rounded-lg">
          <div className="grid grid-cols-4 gap-4 p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-3 border-t">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
