import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentsSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-8 p-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex flex-row gap-4 overflow-hidden">
          <Skeleton className="h-120 w-full shrink-0 md:h-90 md:w-90" />

          <div className="flex w-full flex-col p-4">
            <Skeleton className="mb-3 h-8 w-3/5" />

            <Skeleton className="mb-2 h-4 w-2/5" />

            <div className="space-y-2 py-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="mt-4 flex w-full max-w-50 flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
