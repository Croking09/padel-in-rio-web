import { Skeleton } from "@/components/ui/skeleton";

export default function InscripcionSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-9 w-2/3 mb-6" />

      <div className="bg-muted/30 p-6 rounded-lg border">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2 mt-2" />
          <Skeleton className="h-10 w-40 mt-4" />
          <div className="flex flex-col gap-3 mt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
